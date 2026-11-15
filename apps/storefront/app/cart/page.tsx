'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart';
import { useCurrency } from '@/lib/currency';
import { formatMoney, Button } from '@jb06/ui';
import { ArrowLeft, ArrowRight, ShieldCheck, Clock, Trash2, Tag, Check } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    updateQuantity,
    removeItem,
    totalCount,
    subtotalUSD,
    subtotalPHP,
    promoCode,
    discountPercentage,
    applyPromo,
    removePromo,
    reservedSecondsLeft,
  } = useCart();
  const { currency } = useCurrency();

  const [inputCode, setInputCode] = useState('');
  const [promoError, setPromoError] = useState('');

  // Format timer MM:SS
  const mins = Math.floor(reservedSecondsLeft / 60);
  const secs = reservedSecondsLeft % 60;
  const timerStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  // Calculations
  const discountUSD = Math.round(subtotalUSD * (discountPercentage / 100));
  const discountPHP = Math.round(subtotalPHP * (discountPercentage / 100));

  const shippingUSD = subtotalUSD > 10000 ? 0 : 1800; // Free over $100
  const shippingPHP = subtotalUSD > 10000 ? 0 : 104400;

  const taxableUSD = subtotalUSD - discountUSD;
  const taxUSD = Math.round(taxableUSD * 0.08); // 8% VAT
  const taxPHP = Math.round((subtotalPHP - discountPHP) * 0.08);

  const finalTotalUSD = subtotalUSD - discountUSD + shippingUSD + taxUSD;
  const finalTotalPHP = subtotalPHP - discountPHP + shippingPHP + taxPHP;

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode) return;
    const ok = applyPromo(inputCode);
    if (!ok) {
      setPromoError('Invalid invitation or voucher code');
    } else {
      setPromoError('');
      setInputCode('');
    }
  };

  const pairings = [
    { title: 'Atelier Sneaker Care System', category: 'ACCESSORY / MAINTENANCE', priceUSD: 3200, pricePHP: 185600, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80' },
    { title: 'Ribbed Archival Crew Socks', category: 'ESSENTIALS / SOCKS', priceUSD: 2400, pricePHP: 139200, image: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=600&q=80' },
    { title: 'Washed Canvas Atelier Cap', category: 'HEADWEAR / CAPS', priceUSD: 4800, pricePHP: 278400, image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80' },
    { title: 'Bridle Leather Key Lanyard', category: 'ACCESSORIES / HARDWARE', priceUSD: 3800, pricePHP: 220400, image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&q=80' },
  ];

  return (
    <div className="space-y-10 pb-16">
      {/* 1. TOP VAULT RESERVATION BANNER */}
      <div className="bg-[#FAF6ED] border-b border-[#E8DFC8] py-2.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#B8912F] font-medium">
            <span className="w-2 h-2 rounded-full bg-[#B8912F]" />
            <span className="uppercase tracking-wider font-semibold">COMPLIMENTARY COURIER APPLIED</span>
            <span className="text-[#6B6B6B] hidden sm:inline">• Over $100 threshold unlocked for expedited priority air</span>
          </div>

          <div className="flex items-center gap-2 text-[#111111] font-mono bg-white px-3 py-1 rounded-full border border-[#E8DFC8] shadow-xs">
            <Clock className="w-3.5 h-3.5 text-[#B8912F]" />
            <span>Vault reservation: <strong>{timerStr}</strong></span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Title */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E8E4]">
          <h1 className="font-serif text-3xl font-normal text-[#111111]">
            Your Bag ({totalCount} {totalCount === 1 ? 'item' : 'items'})
          </h1>
          <span className="text-[10px] bg-[#111111] text-[#E8DFC8] px-3 py-1 rounded-full font-mono uppercase tracking-wider font-semibold">
            DROP 06 / ATELIER RESERVATION
          </span>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16 space-y-4 bg-white border border-[#E8E8E4] rounded-[12px] p-8">
            <p className="font-serif text-2xl text-[#111111]">Your atelier bag is empty</p>
            <p className="text-xs text-[#6B6B6B]">Explore our curated footwear and garment archives to reserve limited editions.</p>
            <Link
              href="/shoes"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#111111] text-white rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          /* 2. MAIN CART GRID (ITEMS TABLE + ORDER BREAKDOWN) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left: Line Items (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="hidden sm:grid grid-cols-12 text-[10px] uppercase tracking-widest text-[#6B6B6B] pb-2 border-b border-[#E8E8E4] font-semibold">
                <span className="col-span-7">Atelier Piece</span>
                <span className="col-span-2 text-center">Quantity</span>
                <span className="col-span-3 text-right">Settlement</span>
              </div>

              {/* Items List */}
              <div className="space-y-6">
                {items.map((item) => (
                  <div
                    key={item.variantId}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-white border border-[#E8E8E4] rounded-[12px] p-4 sm:p-5 shadow-xs"
                  >
                    {/* Item Details */}
                    <div className="sm:col-span-7 flex gap-4">
                      <div className="relative w-20 aspect-[4/5] bg-[#F4F4F2] rounded-[8px] overflow-hidden shrink-0 border border-[#E8E8E4]">
                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <span className="text-[10px] font-semibold tracking-wider uppercase text-[#B8912F]">
                          {item.department}
                        </span>
                        <h3 className="text-sm font-semibold text-[#111111] leading-tight">
                          {item.title}
                        </h3>
                        <p className="text-xs text-[#6B6B6B]">
                          Size: <strong className="text-[#111111]">{item.size}</strong>
                        </p>
                        <p className="text-xs text-[#6B6B6B]">
                          Color: <strong className="text-[#111111]">{item.color}</strong>
                        </p>
                        <div className="flex items-center gap-3 pt-2 text-[11px] text-[#A0A09C]">
                          <button type="button" className="hover:text-[#111111] underline">
                            Save for Later
                          </button>
                          <span>•</span>
                          <button
                            type="button"
                            onClick={() => removeItem(item.variantId)}
                            className="hover:text-[#EF4444] flex items-center gap-1 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="sm:col-span-2 flex items-center justify-center">
                      <div className="inline-flex items-center border border-[#E8E8E4] rounded-full bg-[#FAFAF8] text-xs">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-[#111111] hover:bg-[#E8E8E4] rounded-l-full transition-colors"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-mono font-semibold text-[#111111]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-[#111111] hover:bg-[#E8E8E4] rounded-r-full transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Settlement Price */}
                    <div className="sm:col-span-3 text-right space-y-0.5">
                      <p className="text-sm font-semibold text-[#111111]">
                        {currency === 'PHP'
                          ? formatMoney((item.pricePHP ?? Math.round(item.priceUSD * 58)) * item.quantity, 'PHP')
                          : formatMoney(item.priceUSD * item.quantity, 'USD')}
                      </p>
                      <p className="text-xs text-[#6B6B6B]">
                        ≈{' '}
                        {currency === 'PHP'
                          ? formatMoney(item.priceUSD * item.quantity, 'USD')
                          : formatMoney((item.pricePHP ?? Math.round(item.priceUSD * 58)) * item.quantity, 'PHP')}
                      </p>
                      <span className="text-[10px] text-[#059669] font-medium">Free Priority Courier</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code Input */}
              <div className="bg-white border border-[#E8E8E4] rounded-[12px] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#B8912F]" />
                  <div>
                    <p className="text-xs font-semibold text-[#111111]">Atelier Invitation / Voucher</p>
                    <p className="text-[11px] text-[#6B6B6B]">Redeem generative invite credentials or archival code</p>
                  </div>
                </div>

                {promoCode ? (
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF6ED] text-[#B8912F] border border-[#E8DFC8] rounded-full text-xs font-mono font-semibold">
                      <Check className="w-3.5 h-3.5" />
                      {promoCode} (10% OFF)
                    </span>
                    <button
                      type="button"
                      onClick={removePromo}
                      className="text-xs text-[#EF4444] hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyVoucher} className="flex items-center gap-2 w-full sm:w-auto">
                    <input
                      type="text"
                      placeholder="e.g. ATELIER10"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      className="px-3 py-1.5 text-xs bg-[#FAFAF8] border border-[#E8E8E4] rounded-full uppercase font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#111111] text-white rounded-full text-xs font-semibold hover:bg-black transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
              </div>
              {promoError && <p className="text-xs text-[#EF4444]">{promoError}</p>}

              {/* Return link */}
              <div className="pt-2">
                <Link
                  href="/shoes"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#111111] hover:text-[#B8912F] uppercase tracking-wider transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Continue Curating Footwear & Apparel</span>
                </Link>
              </div>
            </div>

            {/* Right: Order Breakdown (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-[#E8E8E4] rounded-[12px] p-6 space-y-5 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E4]">
                  <h3 className="font-semibold text-sm tracking-wider uppercase text-[#111111]">
                    Order Breakdown
                  </h3>
                  <span className="text-[10px] bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] px-2 py-0.5 rounded font-mono font-semibold uppercase">
                    DUTIES INCLUDED
                  </span>
                </div>

                <div className="space-y-3 text-xs text-[#6B6B6B]">
                  <div className="flex items-center justify-between">
                    <span>Subtotal ({totalCount} items)</span>
                    <span className="font-medium text-[#111111]">
                      {currency === 'PHP' ? formatMoney(subtotalPHP, 'PHP') : formatMoney(subtotalUSD, 'USD')}
                    </span>
                  </div>

                  {discountPercentage > 0 && (
                    <div className="flex items-center justify-between text-[#059669]">
                      <span>Atelier Promo ({discountPercentage}% OFF)</span>
                      <span>
                        -{currency === 'PHP' ? formatMoney(discountPHP, 'PHP') : formatMoney(discountUSD, 'USD')}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span>Express Courier Shipping</span>
                    <span className="text-[#059669] font-medium">FREE</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Estimated Tax & Customs VAT</span>
                    <span className="font-medium text-[#111111]">
                      {currency === 'PHP' ? formatMoney(taxPHP, 'PHP') : formatMoney(taxUSD, 'USD')}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-[#E8E8E4] flex items-baseline justify-between text-base font-semibold text-[#111111]">
                    <span>Final Total</span>
                    <div className="text-right">
                      <p className="text-xl">
                        {currency === 'PHP' ? formatMoney(finalTotalPHP, 'PHP') : formatMoney(finalTotalUSD, 'USD')}
                      </p>
                      <p className="text-xs text-[#6B6B6B] font-normal">
                        ≈ {currency === 'PHP' ? formatMoney(finalTotalUSD, 'USD') : formatMoney(finalTotalPHP, 'PHP')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Seamless Local Settlement Notice */}
                <div className="p-3.5 bg-[#FAF6ED] border border-[#E8DFC8] rounded-[8px] space-y-1.5">
                  <span className="text-[10px] font-semibold tracking-wider uppercase text-[#B8912F] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Seamless Local Settlement
                  </span>
                  <p className="text-[11px] text-[#6B6B6B] leading-relaxed">
                    GCash transactions are billed natively in PHP ({formatMoney(finalTotalPHP, 'PHP')}) with zero conversion surcharges. PayPal and Global Cards settle transparently in USD ({formatMoney(finalTotalUSD, 'USD')}).
                  </p>
                </div>

                {/* Checkout CTA */}
                <Link
                  href="/checkout"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#111111] hover:bg-black text-white rounded-full text-xs font-semibold uppercase tracking-widest shadow-md transition-all active:scale-[0.99]"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="text-center space-y-2 pt-2">
                  <p className="text-[11px] text-[#A0A09C] flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    256-Bit SSL Encrypted Atelier Protocol
                  </p>
                  <div className="flex items-center justify-center gap-2 text-[10px] font-medium text-[#6B6B6B]">
                    <span>GCash</span> • <span>PayPal</span> • <span>Visa</span> • <span>Mastercard</span> • <span>Apple Pay</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. FREQUENTLY PAIRED WITH DROP 06 */}
        <section className="space-y-6 pt-8 border-t border-[#E8E8E4]">
          <div>
            <p className="text-[10px] tracking-widest uppercase font-semibold text-[#B8912F]">
              CURATED PAIRINGS
            </p>
            <h2 className="font-serif text-2xl font-normal text-[#111111] mt-0.5">
              Frequently Paired with Drop 06
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pairings.map((p, idx) => (
              <div key={idx} className="bg-white border border-[#E8E8E4] rounded-[12px] p-4 flex flex-col justify-between space-y-3">
                <div className="relative aspect-[4/5] bg-[#F4F4F2] rounded-[8px] overflow-hidden">
                  <Image src={p.image} alt={p.title} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-[9px] text-[#6B6B6B] uppercase tracking-wider">{p.category}</p>
                  <h4 className="text-xs font-semibold text-[#111111]">{p.title}</h4>
                  <p className="text-xs font-semibold text-[#111111] mt-1">
                    {currency === 'PHP' ? formatMoney(p.pricePHP, 'PHP') : formatMoney(p.priceUSD, 'USD')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => alert(`Added ${p.title} to bag`)}
                  className="w-full py-1.5 text-xs font-semibold bg-[#FAFAF8] border border-[#E8E8E4] hover:bg-[#111111] hover:text-white rounded-full transition-colors"
                >
                  + Add
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
