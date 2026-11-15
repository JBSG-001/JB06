import { NextRequest, NextResponse } from 'next/server';
import { prisma, OrderStatus, PaymentStatus, MovementType } from '@jb06/db';
import { createPaymentProvider } from '@jb06/payments';
import { createRealtimeProvider } from '@jb06/events';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const headers: Record<string, string> = {};
    req.headers.forEach((val, key) => {
      headers[key] = val;
    });

    const provider = createPaymentProvider('GCASH');
    const verification = await provider.verifyWebhook(headers, rawBody);

    if (!verification.isValid || !verification.eventId) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
    }

    // Idempotency: Check if already processed
    const existing = await prisma.webhookEvent.findUnique({
      where: { eventId: verification.eventId },
    });

    if (existing) {
      return NextResponse.json({ status: 'already_processed' }, { status: 200 });
    }

    // Record webhook event
    await prisma.webhookEvent.create({
      data: {
        eventId: verification.eventId,
        gateway: 'GCASH',
        eventType: verification.eventType || 'checkout.session.payment.paid',
        payload: verification.rawPayload as any,
      },
    });

    // If payment paid event, update order and finalize stock
    if (verification.orderNumber) {
      const order = await prisma.order.findUnique({
        where: { orderNumber: verification.orderNumber },
        include: { items: true, customer: true },
      });

      if (order && order.status === OrderStatus.PENDING) {
        await prisma.$transaction(async (tx) => {
          // 1. Mark order as PAID
          await tx.order.update({
            where: { id: order.id },
            data: {
              status: OrderStatus.PAID,
              paidAt: new Date(),
              reservedUntil: null,
            },
          });

          // 2. Finalize stock: clear reserved count, create StockMovement
          for (const item of order.items) {
            await tx.variant.update({
              where: { id: item.variantId },
              data: {
                reserved: { decrement: item.quantity },
                reservedUntil: null,
              },
            });

            await tx.stockMovement.create({
              data: {
                variantId: item.variantId,
                type: MovementType.SALE,
                quantity: -item.quantity,
                reason: `Payment verified via PayMongo GCash (Order #${order.orderNumber})`,
                referenceId: order.id,
                performedBy: 'PAYMONGO_WEBHOOK',
              },
            });
          }

          // 3. Update payment record
          await tx.payment.updateMany({
            where: { orderId: order.id },
            data: {
              status: PaymentStatus.SUCCESS,
              transactionId: verification.transactionId,
            },
          });

          // 4. Record order status history
          await tx.orderStatusHistory.create({
            data: {
              orderId: order.id,
              fromStatus: OrderStatus.PENDING,
              toStatus: OrderStatus.PAID,
              note: `Payment verified via PayMongo GCash (Webhook ID: ${verification.eventId})`,
              changedBy: 'PAYMONGO_WEBHOOK',
            },
          });
        });

        // 5. Broadcast to live monitor
        const realtime = createRealtimeProvider();
        realtime.publish({
          sessionId: `visitor_${order.orderNumber}`,
          eventType: 'order_paid',
          path: '/order/confirmation',
          timestamp: new Date().toISOString(),
          country: order.customer.country,
          metadata: {
            orderNumber: order.orderNumber,
            totalPHP: order.totalPHP,
            totalUSD: order.totalUSD,
            paymentMethod: 'GCash PHP',
            customerMasked: `${order.customer.name.slice(0, 5)}... • ${order.customer.city || 'Makati City'}`,
          },
        }).catch(() => {});
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('PayMongo webhook error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
