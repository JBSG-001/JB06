'use client';

import React from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, User } from 'lucide-react';
import { useCurrency } from '@/lib/currency';
import { useCart } from '@/lib/cart';
import { formatMoney } from '@jb06/ui';

export const Header: React.FC = () => {
  const { currency, setCurrency, exchangeRate } = useCurrency();
  const { totalCount, subtotalUSD, subtotalPHP } = useCart();

  const formattedTotal =
    currency === 'PHP'
      ? `${formatMoney(subtotalPHP, 'PHP')} ≈ ${formatMoney(subtotalUSD, 'USD')}`
      : `${formatMoney(subtotalUSD, 'USD')} ≈ ${formatMoney(subtotalPHP, 'PHP')}`;

  return (
    <header className="sticky top-0 z-40 bg-[#FAFAF8]/95 backdrop-blur-md border-b border-[#E8E8E4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-[#111111] text-white flex items-center justify-center font-bold text-xs tracking-wider rounded-sm group-hover:bg-[#B8912F] transition-colors">
            JB
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-tight text-sm text-[#111111] leading-none">
              JBØ6
            </span>
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#6B6B6B] font-medium leading-tight">
              ATELIER
            </span>
          </div>
        </Link>

        {/* Navigation Categories */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium tracking-wider uppercase text-[#111111]">
          <Link href="/shoes" className="hover:text-[#B8912F] transition-colors">
            SHOES
          </Link>
          <Link href="/clothes" className="hover:text-[#B8912F] transition-colors">
            CLOTHES
          </Link>
          <Link href="/shoes" className="hover:text-[#B8912F] transition-colors">
            NEW IN
          </Link>
          <Link href="/#editorial" className="hover:text-[#B8912F] transition-colors">
            EDITORIAL
          </Link>
          <Link href="/shoes" className="flex items-center gap-1 hover:text-[#B8912F] transition-colors">
            <span>SALE</span>
            <span className="text-[9px] bg-[#FAF6ED] text-[#B8912F] px-1 py-0.2 rounded font-semibold border border-[#E8DFC8]">
              ARCHIVE
            </span>
          </Link>
        </nav>

        {/* Controls: Search, Currency Toggle, Bag, Account */}
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative hidden lg:block">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#A0A09C]" />
            <input
              type="text"
              placeholder="Search drops..."
              className="pl-8 pr-9 py-1.5 text-xs bg-white border border-[#E8E8E4] rounded-full w-48 text-[#111111] placeholder:text-[#A0A09C] focus:outline-none focus:border-[#111111]"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#A0A09C] border border-[#E8E8E4] rounded px-1 py-0.2">
              ⌘K
            </span>
          </div>

          {/* Currency Switcher Pill (USD | PHP) */}
          <div className="inline-flex items-center bg-white border border-[#E8E8E4] rounded-full p-0.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setCurrency('USD')}
              className={`px-2.5 py-1 rounded-full transition-all duration-150 ${
                currency === 'USD'
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'text-[#6B6B6B] hover:text-[#111111]'
              }`}
            >
              USD
            </button>
            <button
              type="button"
              onClick={() => setCurrency('PHP')}
              className={`px-2.5 py-1 rounded-full transition-all duration-150 ${
                currency === 'PHP'
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'text-[#6B6B6B] hover:text-[#111111]'
              }`}
            >
              PHP
            </button>
          </div>

          {/* Bag Button */}
          <Link
            href="/cart"
            className="flex items-center gap-2 bg-white border border-[#E8E8E4] hover:border-[#111111] rounded-full px-3 py-1.5 transition-colors group"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 text-[#111111]" />
              {totalCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#B8912F] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalCount}
                </span>
              )}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[11px] font-semibold text-[#111111] leading-none">
                {currency === 'PHP' ? formatMoney(subtotalPHP, 'PHP') : formatMoney(subtotalUSD, 'USD')}
              </span>
              <span className="text-[9px] text-[#6B6B6B] leading-tight">
                ≈ {currency === 'PHP' ? formatMoney(subtotalUSD, 'USD') : formatMoney(subtotalPHP, 'PHP')}
              </span>
            </div>
          </Link>

          {/* Customer Profile / Account */}
          <Link
            href="/account"
            className="p-2 rounded-full border border-[#E8E8E4] bg-white hover:bg-[#FAFAF8] text-[#111111] transition-colors"
            title="Customer Account"
          >
            <User className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
};
