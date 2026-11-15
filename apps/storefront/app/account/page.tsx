import React from 'react';
import Link from 'next/link';
import { prisma } from '@jb06/db';
import { formatMoney, Badge } from '@jb06/ui';
import { User, Package, Clock, ShieldCheck, MapPin } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  // Query sample customer profile and orders
  const customer = await prisma.customer.findFirst({
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: { product: true, variant: true },
          },
        },
        take: 5,
      },
    },
  }).catch(() => null);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Profile Summary */}
      <div className="bg-white border border-[#E8E8E4] rounded-[12px] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-lg">
            {customer?.name.slice(0, 2).toUpperCase() || 'MV'}
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="font-serif text-2xl text-[#111111] font-normal">{customer?.name || 'Marco Valenzuela'}</h1>
              <span className="text-[10px] bg-[#FAF6ED] text-[#B8912F] border border-[#E8DFC8] px-2 py-0.5 rounded font-semibold uppercase">
                {customer?.tier || 'Tier 1 Collector'}
              </span>
            </div>
            <p className="text-xs text-[#6B6B6B]">{customer?.email || 'marco.v@atelier-kyoto.ph'}</p>
          </div>
        </div>

        <div className="text-right text-xs text-[#6B6B6B] space-y-1 hidden sm:block">
          <p className="font-mono text-[11px]">Primary Atelier Residence:</p>
          <p className="font-semibold text-[#111111]">{customer?.city || 'Makati City'}, Philippines</p>
          <p className="text-[10px] text-[#059669]">● Verified Collector Status</p>
        </div>
      </div>

      {/* Order History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#E8E8E4]">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#111111] flex items-center gap-2">
            <Package className="w-4 h-4 text-[#B8912F]" />
            Atelier Order History ({customer?.orders.length || 0})
          </h2>
          <span className="text-xs text-[#6B6B6B]">Dual Currency Archive</span>
        </div>

        {customer?.orders && customer.orders.length > 0 ? (
          <div className="space-y-4">
            {customer.orders.map((o) => (
              <div
                key={o.id}
                className="bg-white border border-[#E8E8E4] rounded-[12px] p-5 space-y-4 shadow-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs pb-3 border-b border-[#F0F0EC]">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#111111]">Order #{o.orderNumber}</span>
                    <span className="text-[#6B6B6B]">• {new Date(o.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={o.status === 'DELIVERED' ? 'in-stock' : o.status === 'PAID' ? 'new' : 'default'}>
                      {o.status}
                    </Badge>
                    <span className="font-mono font-semibold text-[#111111]">
                      {o.chargedCurrency === 'PHP' ? formatMoney(o.totalPHP, 'PHP') : formatMoney(o.totalUSD, 'USD')}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {o.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs">
                      <span className="text-[#111111] font-medium">{item.product.title}</span>
                      <span className="text-[#6B6B6B]">{item.variant.size} • Qty {item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#6B6B6B] py-6 text-center">No orders recorded yet.</p>
        )}
      </div>
    </div>
  );
}
