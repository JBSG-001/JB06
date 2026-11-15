import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma, OrderStatus, PaymentGateway, PaymentStatus } from '@jb06/db';
import { createPaymentProvider } from '@jb06/payments';
import { createRealtimeProvider } from '@jb06/events';

const checkoutItemSchema = z.object({
  variantId: z.string(),
  productId: z.string(),
  quantity: z.number().int().min(1),
});

const checkoutSchema = z.object({
  customer: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
    address: z.string().min(3),
    city: z.string().min(2),
    country: z.string().default('PH'),
  }),
  items: z.array(checkoutItemSchema).min(1),
  paymentMethod: z.enum(['GCASH', 'PAYPAL']),
  chargedCurrency: z.enum(['USD', 'PHP']),
  totalUSD: z.number().int().positive(),
  totalPHP: z.number().int().positive(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid checkout parameters', details: parsed.error.format() }, { status: 400 });
    }

    const { customer: cData, items, paymentMethod, chargedCurrency, totalUSD, totalPHP } = parsed.data;

    // 15-minute reservation expiry
    const reservedUntil = new Date(Date.now() + 15 * 60 * 1000);

    // Run in a database transaction with stock reservation
    const result = await prisma.$transaction(async (tx) => {
      // Find or create customer
      const customer = await tx.customer.upsert({
        where: { email: cData.email },
        update: {
          name: cData.name,
          phone: cData.phone,
          address: cData.address,
          city: cData.city,
          country: cData.country,
        },
        create: {
          name: cData.name,
          email: cData.email,
          phone: cData.phone,
          address: cData.address,
          city: cData.city,
          country: cData.country,
          tier: 'Standard Collector',
        },
      });

      // Reserve stock on variants
      for (const item of items) {
        const variant = await tx.variant.findUnique({
          where: { id: item.variantId },
        });

        if (!variant || variant.stock < item.quantity) {
          throw new Error(`Insufficient stock for item: ${variant?.sku || item.variantId}`);
        }

        await tx.variant.update({
          where: { id: item.variantId },
          data: {
            stock: { decrement: item.quantity },
            reserved: { increment: item.quantity },
            reservedUntil,
          },
        });
      }

      // Create Order in PENDING status
      const order = await tx.order.create({
        data: {
          customerId: customer.id,
          status: OrderStatus.PENDING,
          paymentMethod: paymentMethod as PaymentGateway,
          chargedCurrency,
          exchangeRateSnapshot: 58.0000,
          subtotalUSD: totalUSD,
          totalUSD,
          subtotalPHP: totalPHP,
          totalPHP,
          reservedUntil,
          items: {
            create: items.map((i) => ({
              productId: i.productId,
              variantId: i.variantId,
              quantity: i.quantity,
              unitPriceUSD: Math.round(totalUSD / items.length),
              unitPricePHP: Math.round(totalPHP / items.length),
              totalUSD: Math.round(totalUSD / items.length) * i.quantity,
              totalPHP: Math.round(totalPHP / items.length) * i.quantity,
            })),
          },
          statusHistory: {
            create: {
              toStatus: OrderStatus.PENDING,
              note: `Checkout started. Reserved stock until ${reservedUntil.toISOString()}`,
              changedBy: 'SYSTEM',
            },
          },
        },
      });

      return order;
    });

    // Notify realtime telemetry
    const realtime = createRealtimeProvider();
    realtime.publish({
      sessionId: `visitor_${result.orderNumber}`,
      eventType: 'checkout_started',
      path: '/checkout',
      timestamp: new Date().toISOString(),
      country: cData.country,
      metadata: {
        orderNumber: result.orderNumber,
        paymentMethod,
        totalUSD,
        totalPHP,
      },
    }).catch(() => {});

    // Initialize Payment Provider session
    const provider = createPaymentProvider(paymentMethod);
    const returnUrl = `${process.env.NEXT_PUBLIC_STOREFRONT_URL || 'http://localhost:3000'}/order/confirmation/${result.id}`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_STOREFRONT_URL || 'http://localhost:3000'}/cart`;

    const paymentSession = await provider.createSession({
      orderId: result.id,
      orderNumber: result.orderNumber,
      amountUSD: totalUSD,
      amountPHP: totalPHP,
      chargedCurrency,
      customer: {
        name: cData.name,
        email: cData.email,
        phone: cData.phone,
      },
      returnUrl,
      cancelUrl,
    });

    // Record initial Payment entity
    await prisma.payment.create({
      data: {
        orderId: result.id,
        gateway: paymentMethod as PaymentGateway,
        transactionId: paymentSession.sessionId,
        amount: chargedCurrency === 'PHP' ? totalPHP : totalUSD,
        currency: chargedCurrency,
        status: PaymentStatus.PENDING,
      },
    });

    return NextResponse.json({
      success: true,
      orderId: result.id,
      orderNumber: result.orderNumber,
      checkoutUrl: paymentSession.checkoutUrl,
    });
  } catch (err: any) {
    console.error('Checkout error:', err);
    return NextResponse.json({ error: err.message || 'Checkout failed' }, { status: 500 });
  }
}
