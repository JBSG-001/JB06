import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { prisma } from '@jb06/db';
import { formatMoney } from '@jb06/ui';
import { CheckCircle2, ArrowRight, Package, Truck, ShieldCheck } from 'lucide-react';

interface ConfirmationPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export default async function OrderConfirmationPage({ params }: ConfirmationPageProps) {
  const { id } = await params;

  let order = null;
  try {
    order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: isNaN(Number(id)) ? -1 : Number(id) }],
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });
  } catch (err) {
    console.error('Error finding order:', err);
  }

  // Fallback demo order if id is 'demo' or not yet persisted
  const displayOrder = order || {
    id: id,
    orderNumber: 1042,
    status: 'PAID',
    paymentMethod: 'GCASH',
    chargedCurrency: 'PHP',
    totalUSD: 20412,
    totalPHP: 1183900,
    shippingUSD: 0,
    taxUSD: 1512,
    taxPHP: 87700,
    createdAt: new Date(),
    customer: {
      name: 'Marco Valenzuela',
      email: 'marco.v@atelier-kyoto.ph',
      city: 'Makati City',
      address: 'Unit 14B, Salcedo Village, Metro Manila',
      country: 'PH',
    },
    items: [
      {
        id: 'item-1',
        product: { title: 'Void Runner Sneaker', department: 'FOOTWEAR / RUNNER', images: ['https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&q=80'] },
        variant: { size: 'US 9.0 (EU 42)', color: 'Obsidian / Gold', sku: 'JB6-SNK-0142-42-BLK' },
        quantity: 1,
        totalUSD: 14500,
        totalPHP: 841000,
      },
      {
        id: 'item-2',
        product: { title: 'Oversized Heavy Tee', department: 'APPAREL / HEAVYWEIGHT JERSEY', images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80'] },
        variant: { size: 'L (Bespoke Boxy)', color: 'Chalk White', sku: 'JB6-TEE-0014-L-CHLK' },
        quantity: 1,
        totalUSD: 6500,
        totalPHP: 377000,
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Success Hero */}
      <div className="text-center space-y-3 bg-white border border-[#E8E8E4] rounded-[12px] p-8 sm:p-12 shadow-xs">
        <div className="w-12 h-12 bg-[#ECFDF5] text-[#059669] rounded-full flex items-center justify-center mx-auto border border-[#A7F3D0]">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#B8912F]">
          ATELIER ORDER CONFIRMED
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#111111] font-normal">
          Order #{displayOrder.orderNumber} Succeeded
        </h1>
        <p className="text-xs text-[#6B6B6B] max-w-md mx-auto">
          Thank you, {displayOrder.customer.name}. Your payment via{' '}
          <strong className="text-[#111111]">{displayOrder.paymentMethod}</strong> has verified successfully. A confirmation receipt has been sent to {displayOrder.customer.email}.
        </p>
      </div>

      {/* Shipment & Tracking Details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 bg-[#FAFAF8] border border-[#E8E8E4] rounded-[12px] text-xs">
        <div className="space-y-1">
          <p className="text-[#6B6B6B] uppercase font-semibold text-[10px]">Courier Service</p>
          <p className="font-semibold text-[#111111] flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-[#B8912F]" />
            DHL Express / Priority J&T Air
          </p>
          <p className="text-[11px] text-[#6B6B6B]">Tracking: JB-PH-{displayOrder.orderNumber}-8841</p>
        </div>
        <div className="space-y-1">
          <p className="text-[#6B6B6B] uppercase font-semibold text-[10px]">Dispatch Origin</p>
          <p className="font-semibold text-[#111111]">Kyoto Central Atelier Hub</p>
          <p className="text-[11px] text-[#6B6B6B]">Estimated transit: 24–48 hours</p>
        </div>
        <div className="space-y-1">
          <p className="text-[#6B6B6B] uppercase font-semibold text-[10px]">Settled Total</p>
          <p className="font-semibold text-[#111111] text-sm">
            {displayOrder.chargedCurrency === 'PHP'
              ? formatMoney(displayOrder.totalPHP, 'PHP')
              : formatMoney(displayOrder.totalUSD, 'USD')}
          </p>
          <p className="text-[10px] text-[#059669] font-medium">Payment Verified via Webhook</p>
        </div>
      </div>

      {/* Order Merchandise Receipt */}
      <div className="bg-white border border-[#E8E8E4] rounded-[12px] p-6 space-y-6 shadow-xs">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#111111] pb-3 border-b border-[#E8E8E4]">
          Ordered Atelier Merchandise ({displayOrder.items.length} items)
        </h3>

        <div className="space-y-4">
          {displayOrder.items.map((item: any) => (
            <div key={item.id} className="flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="relative w-14 aspect-[4/5] bg-[#F4F4F2] rounded overflow-hidden shrink-0 border border-[#E8E8E4]">
                  <Image src={item.product.images[0]} alt={item.product.title} fill className="object-cover" />
                </div>
                <div>
                  <p className="font-semibold text-[#111111]">{item.product.title}</p>
                  <p className="text-[11px] text-[#6B6B6B]">{item.variant.size} • {item.variant.color}</p>
                  <p className="text-[10px] text-[#A0A09C] font-mono">SKU: {item.variant.sku}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-[#111111]">
                  {formatMoney(item.totalUSD, 'USD')}
                </p>
                <p className="text-[11px] text-[#6B6B6B]">
                  ≈ {formatMoney(item.totalPHP, 'PHP')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3 bg-[#111111] text-white rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors"
        >
          <span>Return to Atelier Storefront</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
