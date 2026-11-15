'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart';
import { useCurrency } from '@/lib/currency';
import { formatMoney, Button, Input } from '@jb06/ui';
import { ShieldCheck, ArrowLeft, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';

export function CheckoutClient() {
  const router = useRouter();
  const { items, subtotalUSD, subtotalPHP, discountPercentage, clearCart } = useCart();
  const { currency } = useCurrency();

  const [paymentMethod, setPaymentMethod] = useState<'GCASH' | 'PAYPAL'>('GCASH');
  const [formData, setFormData] = useState({
    name: 'Marco Valenzuela',
    email: 'marco.v@atelier-kyoto.ph',
    phone: '+63 917 555 0192',
    address: 'Unit 14B, Salcedo Village',
    city: 'Makati City',
    country: 'PH',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Calculations
  const discountUSD = Math.round(subtotalUSD * (discountPercentage / 100));
  const discountPHP = Math.round(subtotalPHP * (discountPercentage / 100));
  const shippingUSD = subtotalUSD > 10000 ? 0 : 1800;
  const shippingPHP = subtotalUSD > 10000 ? 0 : 104400;
  const taxUSD = Math.round((subtotalUSD - discountUSD) * 0.08);
  const taxPHP = Math.round((subtotalPHP - discountPHP) * 0.08);

  const finalTotalUSD = subtotalUSD - discountUSD + shippingUSD + taxUSD;
  const finalTotalPHP = subtotalPHP - discountPHP + shippingPHP + taxPHP;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/checkout/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: formData,
          items: items.map((i) => ({
            variantId: i.variantId,
            productId: i.productId,
            quantity: i.quantity,
          })),
          paymentMethod,
          chargedCurrency: paymentMethod === 'GCASH' ? 'PHP' : 'USD',
          totalUSD: finalTotalUSD,
          totalPHP: finalTotalPHP,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to initialize payment');
      }

      // If mock checkout, clear cart and redirect to order confirmation
      if (data.checkoutUrl) {
        clearCart();
        window.location.href = data.checkoutUrl;
      } else {
        clearCart();
        router.push(`/order/confirmation/${data.orderId}`);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during checkout');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-[#E8E8E4]">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#111111] hover:text-[#B8912F] uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Atelier Bag</span>
        </Link>
        <span className="text-xs text-[#6B6B6B] flex items-center gap-1.5 font-mono">
          <Lock className="w-3.5 h-3.5 text-[#B8912F]" />
          256-Bit Encrypted Atelier Checkout
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Shipping & Payment Form (7 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          <form onSubmit={handleSubmitOrder} className="space-y-8">
            {/* Step 1: Customer Dossier */}
            <div className="bg-white border border-[#E8E8E4] rounded-[12px] p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#E8E8E4]">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#111111]">
                  1. Client Dossier & Shipping Address
                </h3>
                <span className="text-[10px] text-[#B8912F] font-semibold uppercase">DHL / J&T Express</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  required
                  value={formData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                />
                <Input
                  label="Email Address"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Phone Number"
                  required
                  value={formData.phone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phone: e.target.value })}
                />
                <Input
                  label="City / Municipality"
                  required
                  value={formData.city}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>

              <Input
                label="Street Address / Residence Unit"
                required
                value={formData.address}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            {/* Step 2: Payment Gateway Selection */}
            <div className="bg-white border border-[#E8E8E4] rounded-[12px] p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#E8E8E4]">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#111111]">
                  2. Settlement Gateway
                </h3>
                <span className="text-[10px] text-[#059669] font-semibold uppercase">Verified Gateway Protocols</span>
              </div>

              {/* GCash (PayMongo) Option */}
              <label
                onClick={() => setPaymentMethod('GCASH')}
                className={`flex items-start justify-between p-4 rounded-[8px] border cursor-pointer transition-all ${
                  paymentMethod === 'GCASH'
                    ? 'border-[#B8912F] bg-[#FAF6ED] ring-1 ring-[#B8912F]'
                    : 'border-[#E8E8E4] bg-white hover:border-[#111111]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="gateway"
                    checked={paymentMethod === 'GCASH'}
                    onChange={() => setPaymentMethod('GCASH')}
                    className="mt-1 accent-[#B8912F]"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#111111]">GCash (PayMongo Direct)</span>
                      <span className="text-[10px] bg-[#FAF6ED] text-[#B8912F] border border-[#E8DFC8] px-1.5 py-0.2 rounded font-semibold">
                        PHP NATIVE
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6B6B6B]">
                      Instant QR & mobile authorization. Billed natively in Philippine Pesos ({formatMoney(finalTotalPHP, 'PHP')}) with zero FX fee.
                    </p>
                  </div>
                </div>
                <span className="font-semibold text-xs text-[#111111] font-mono">
                  {formatMoney(finalTotalPHP, 'PHP')}
                </span>
              </label>

              {/* PayPal Option */}
              <label
                onClick={() => setPaymentMethod('PAYPAL')}
                className={`flex items-start justify-between p-4 rounded-[8px] border cursor-pointer transition-all ${
                  paymentMethod === 'PAYPAL'
                    ? 'border-[#B8912F] bg-[#FAF6ED] ring-1 ring-[#B8912F]'
                    : 'border-[#E8E8E4] bg-white hover:border-[#111111]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="gateway"
                    checked={paymentMethod === 'PAYPAL'}
                    onChange={() => setPaymentMethod('PAYPAL')}
                    className="mt-1 accent-[#B8912F]"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#111111]">PayPal / International Cards</span>
                      <span className="text-[10px] bg-[#F0F0EC] text-[#111111] px-1.5 py-0.2 rounded font-semibold">
                        USD GLOBAL
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6B6B6B]">
                      Secure global checkout in USD ({formatMoney(finalTotalUSD, 'USD')}). PayPal balance, credit, and international debit cards.
                    </p>
                  </div>
                </div>
                <span className="font-semibold text-xs text-[#111111] font-mono">
                  {formatMoney(finalTotalUSD, 'USD')}
                </span>
              </label>
            </div>

            {errorMessage && (
              <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-[8px] text-xs text-[#DC2626]">
                {errorMessage}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
              className="py-4 text-xs font-semibold uppercase tracking-widest"
            >
              Authorize & Settle Order (
              {paymentMethod === 'GCASH'
                ? formatMoney(finalTotalPHP, 'PHP')
                : formatMoney(finalTotalUSD, 'USD')}
              )
            </Button>
          </form>
        </div>

        {/* Right: Order Summary Dossier (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#E8E8E4] rounded-[12px] p-6 space-y-4 shadow-xs">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#111111] pb-2 border-b border-[#E8E8E4]">
              Cart Dossier ({items.length} items)
            </h3>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.variantId} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 aspect-[4/5] bg-[#F4F4F2] rounded overflow-hidden shrink-0 border border-[#E8E8E4]">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#111111] line-clamp-1">{item.title}</p>
                      <p className="text-[11px] text-[#6B6B6B]">{item.size} • Qty {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-mono font-semibold text-[#111111]">
                    {currency === 'PHP'
                      ? formatMoney((item.pricePHP ?? Math.round(item.priceUSD * 58)) * item.quantity, 'PHP')
                      : formatMoney(item.priceUSD * item.quantity, 'USD')}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#E8E8E4] space-y-2 text-xs text-[#6B6B6B]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{currency === 'PHP' ? formatMoney(subtotalPHP, 'PHP') : formatMoney(subtotalUSD, 'USD')}</span>
              </div>
              {discountPercentage > 0 && (
                <div className="flex justify-between text-[#059669]">
                  <span>Promo (10% OFF)</span>
                  <span>-{currency === 'PHP' ? formatMoney(discountPHP, 'PHP') : formatMoney(discountUSD, 'USD')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Courier Express</span>
                <span className="text-[#059669] font-semibold">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>VAT & Duties</span>
                <span>{currency === 'PHP' ? formatMoney(taxPHP, 'PHP') : formatMoney(taxUSD, 'USD')}</span>
              </div>
              <div className="pt-2 border-t border-[#E8E8E4] flex justify-between font-semibold text-base text-[#111111]">
                <span>Total Due</span>
                <span>
                  {paymentMethod === 'GCASH'
                    ? formatMoney(finalTotalPHP, 'PHP')
                    : formatMoney(finalTotalUSD, 'USD')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
