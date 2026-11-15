import React from 'react';
import { prisma } from '@jb06/db';
import { formatMoney, Badge } from '@jb06/ui';
import { Truck, Plus, CheckCircle, Package } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SuppliersPage() {
  const suppliers = await prisma.supplier.findMany({
    include: {
      purchaseOrders: {
        include: { items: { include: { variant: { include: { product: true } } } } },
      },
    },
  }).catch(() => []);

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E8E4]">
        <div>
          <span className="text-[10px] font-semibold tracking-widest uppercase text-[#B8912F]">
            SUPPLY CHAIN ARCHIVE // PROCUREMENT & MILLS
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#111111]">
            Suppliers & Purchase Orders
          </h1>
        </div>

        <button
          type="button"
          className="flex items-center gap-1.5 px-4 py-2 bg-[#111111] text-white hover:bg-black rounded-full text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Draft Purchase Order</span>
        </button>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {suppliers.map((s) => (
          <div key={s.id} className="bg-white border border-[#E8E8E4] rounded-[12px] p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#B8912F] font-bold">{s.code}</span>
                <h3 className="font-serif text-xl font-normal text-[#111111]">{s.name}</h3>
              </div>
              <Badge variant="atelier">{s.country || 'JP'}</Badge>
            </div>

            <div className="text-xs text-[#6B6B6B] space-y-1">
              <p>Primary Representative: <strong className="text-[#111111]">{s.contactName}</strong></p>
              <p>Direct Telegram / Email: <strong className="text-[#111111]">{s.email}</strong></p>
              <p>Average Airfreight Lead Time: <strong className="text-[#111111]">{s.leadTimeDays} business days</strong></p>
            </div>

            {/* Attached POs */}
            <div className="pt-3 border-t border-[#F0F0EC] space-y-2">
              <p className="text-[10px] uppercase font-semibold text-[#6B6B6B]">Recent PO Batches ({s.purchaseOrders.length})</p>
              {s.purchaseOrders.map((po) => (
                <div key={po.id} className="p-3 bg-[#FAFAF8] border border-[#E8E8E4] rounded-[8px] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-[#111111]">{po.poNumber}</span>
                    <p className="text-[11px] text-[#6B6B6B]">{po.note}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={po.status === 'RECEIVED' ? 'in-stock' : 'low-stock'}>
                      {po.status}
                    </Badge>
                    <p className="font-mono font-semibold text-[#111111] mt-1">
                      {formatMoney(po.totalCostUSD, 'USD')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
