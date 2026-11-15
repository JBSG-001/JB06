import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@jb06/db';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Release expired reservations via raw query or fallback
    const result = await prisma.$executeRawUnsafe(`SELECT release_expired_reservations();`);
    return NextResponse.json({ success: true, released: result });
  } catch {
    // Fallback if function is not yet created in database
    const now = new Date();
    const expiredVariants = await prisma.variant.updateMany({
      where: {
        reserved: { gt: 0 },
        reservedUntil: { lt: now },
      },
      data: {
        reserved: 0,
        reservedUntil: null,
      },
    });

    return NextResponse.json({ success: true, fallbackReleasedCount: expiredVariants.count });
  }
}
