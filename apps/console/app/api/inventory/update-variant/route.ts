import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma, MovementType } from '@jb06/db';

const updateVariantSchema = z.object({
  variantId: z.string(),
  priceUSD: z.number().int().positive(),
  pricePHP: z.number().int().positive().nullable(),
  adjustStockDelta: z.number().int().default(0),
  reason: z.string().optional(),
  reorderLevel: z.number().int().min(1).default(5),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = updateVariantSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid parameters', details: parsed.error.format() }, { status: 400 });
    }

    const { variantId, priceUSD, pricePHP, adjustStockDelta, reason, reorderLevel } = parsed.data;

    const updated = await prisma.$transaction(async (tx) => {
      const v = await tx.variant.update({
        where: { id: variantId },
        data: {
          priceUSD,
          pricePHP,
          reorderLevel,
          ...(adjustStockDelta !== 0
            ? { stock: { increment: adjustStockDelta } }
            : {}),
        },
      });

      if (adjustStockDelta !== 0) {
        await tx.stockMovement.create({
          data: {
            variantId,
            type: adjustStockDelta > 0 ? MovementType.RESTOCK : MovementType.ADJUSTMENT,
            quantity: adjustStockDelta,
            reason: reason || 'Manual inventory adjustment via console inspector',
            performedBy: 'CONSOLE_USER',
          },
        });
      }

      return v;
    });

    return NextResponse.json({ success: true, variant: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Update failed' }, { status: 500 });
  }
}
