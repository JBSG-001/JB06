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

    const provider = createPaymentProvider('PAYPAL');
    const verification = await provider.verifyWebhook(headers, rawBody);

    if (!verification.isValid || !verification.eventId) {
      return NextResponse.json({ error: 'Invalid PayPal webhook signature' }, { status: 400 });
    }

    // Idempotency check
    const existing = await prisma.webhookEvent.findUnique({
      where: { eventId: verification.eventId },
    });

    if (existing) {
      return NextResponse.json({ status: 'already_processed' }, { status: 200 });
    }

    await prisma.webhookEvent.create({
      data: {
        eventId: verification.eventId,
        gateway: 'PAYPAL',
        eventType: verification.eventType || 'PAYMENT.CAPTURE.COMPLETED',
        payload: verification.rawPayload as any,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('PayPal webhook error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
