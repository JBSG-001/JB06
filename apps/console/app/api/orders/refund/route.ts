import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma, OrderStatus, PaymentStatus, MovementType } from '@jb06/db';
import { createPaymentProvider } from '@jb06/payments';

const refundSchema = z.object({
  orderId: z.string(),
  reason: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = refundSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid refund payload' }, { status: 400 });
    }

    const { orderId, reason } = parsed.data;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, payments: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Call payment provider refund
    const provider = createPaymentProvider(order.paymentMethod);
    const primaryPayment = order.payments[0];

    const refundRes = await provider.refundPayment({
      orderId: order.id,
      transactionId: primaryPayment?.transactionId || order.id,
      amount: order.chargedCurrency === 'PHP' ? order.totalPHP : order.totalUSD,
      currency: order.chargedCurrency as 'USD' | 'PHP',
      reason,
    });

    if (!refundRes.success) {
      return NextResponse.json({ error: refundRes.error || 'Refund rejected by gateway' }, { status: 400 });
    }

    // Run DB transaction: mark order REFUNDED, return items to inventory, log stock movement
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.REFUNDED },
      });

      for (const item of order.items) {
        await tx.variant.update({
          where: { id: item.variantId },
          data: { stock: { increment: item.quantity } },
        });

        await tx.stockMovement.create({
          data: {
            variantId: item.variantId,
            type: MovementType.RETURN,
            quantity: item.quantity,
            reason: `Restocked upon customer refund for Order #${order.orderNumber}`,
            referenceId: order.id,
            performedBy: 'CONSOLE_STAFF',
          },
        });
      }

      await tx.orderStatusHistory.create({
        data: {
          orderId: order.id,
          fromStatus: order.status,
          toStatus: OrderStatus.REFUNDED,
          note: `Refund issued: ${reason || 'Return authorized'} (Refund ID: ${refundRes.refundId})`,
          changedBy: 'CONSOLE_STAFF',
        },
      });
    });

    return NextResponse.json({ success: true, refundId: refundRes.refundId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Refund processing failed' }, { status: 500 });
  }
}
