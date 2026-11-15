import React from 'react';
import { prisma } from '@jb06/db';
import { InventoryClient } from './InventoryClient';

export const dynamic = 'force-dynamic';

export default async function InventoryPage() {
  const variants = await prisma.variant.findMany({
    include: {
      product: {
        include: {
          category: true,
          subcategory: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  }).catch(() => []);

  const totalSkus = variants.length;
  const totalUnits = variants.reduce((acc, v) => acc + v.stock, 0);
  const totalValueUSD = variants.reduce((acc, v) => acc + v.priceUSD * v.stock, 0);
  const lowStockCount = variants.filter((v) => v.stock > 0 && v.stock <= v.reorderLevel).length;

  return (
    <InventoryClient
      initialVariants={variants as any}
      totalSkus={totalSkus}
      totalUnits={totalUnits}
      totalValueUSD={totalValueUSD}
      lowStockCount={lowStockCount}
    />
  );
}
