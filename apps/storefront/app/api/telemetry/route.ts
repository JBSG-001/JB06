import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createRealtimeProvider } from '@jb06/events';
import { prisma } from '@jb06/db';

const telemetrySchema = z.object({
  sessionId: z.string().min(1),
  eventType: z.enum([
    'page_view',
    'product_view',
    'add_to_cart',
    'checkout_started',
    'payment_pending',
    'order_paid',
  ]),
  path: z.string(),
  timestamp: z.string().optional(),
  country: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = telemetrySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid telemetry payload' }, { status: 400 });
    }

    const { sessionId, eventType, path, metadata, country } = parsed.data;

    // Broadcast anonymously to private channel live-monitor
    const provider = createRealtimeProvider();
    await provider.publish({
      sessionId,
      eventType,
      path,
      timestamp: new Date().toISOString(),
      country: country || 'PH',
      metadata,
    });

    // Optionally record in activity_events table
    try {
      await prisma.activityEvent.create({
        data: {
          sessionId,
          eventType,
          path,
          metadata: metadata ? (metadata as any) : undefined,
        },
      });
    } catch {}

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Telemetry error' }, { status: 500 });
  }
}
