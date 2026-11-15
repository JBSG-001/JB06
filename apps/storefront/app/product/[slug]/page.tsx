import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@jb06/db';
import { ProductDetailClient } from './ProductDetailClient';

export const dynamic = 'force-dynamic';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      subcategory: true,
      variants: {
        orderBy: { size: 'asc' },
      },
    },
  }).catch(() => null);

  if (!product) {
    notFound();
  }

  // Cross-sell items
  const completeTheLook = await prisma.product.findMany({
    where: {
      id: { not: product.id },
      categoryId: { not: product.categoryId }, // recommend clothes if shoe, and vice versa
    },
    include: {
      variants: {
        orderBy: { priceUSD: 'asc' },
        take: 1,
      },
    },
    take: 3,
  }).catch(() => []);

  return (
    <ProductDetailClient
      product={product}
      completeTheLook={completeTheLook}
    />
  );
}
