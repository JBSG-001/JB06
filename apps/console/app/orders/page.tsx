import React from 'react';
import { prisma } from '@jb06/db';
import { OrdersClient } from './OrdersClient';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      customer: true,
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  }).catch(() => []);

  return <OrdersClient initialOrders={orders as any} />;
}
