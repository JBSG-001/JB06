import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma, OrderStatus } from '@jb06/db';

const updateStatusSchema = z.object({
  orderId: z.string(),
  status: z.enum(['PENDING', 'PAID', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = updateStatusSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    const { orderId, status } = parsed.data;

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: status as OrderStatus },
    });

    await prisma.orderStatusHistory.create({
      data: {
        orderId,
        toStatus: status as OrderStatus,
        note: `Status updated to ${status} via operations console`,
        changedBy: 'CONSOLE_STAFF',
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Status update failed' }, { status: 500 });
  }
}
