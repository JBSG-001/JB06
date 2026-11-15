'use client';

import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-[#E8E8E4] pt-16 pb-12 text-[#111111]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#E8E8E4]">
          {/* Brand Story */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#111111] text-white flex items-center justify-center font-bold text-[10px] tracking-wider rounded-sm">
                JB
              </div>
              <span className="font-bold text-sm tracking-tight">JBØ6</span>
            </div>
            <p className="font-serif italic text-sm text-[#111111]">
              Atelier Kyoto & Milan
            </p>
            <p className="text-xs text-[#6B6B6B] leading-relaxed">
              High-fidelity minimalist streetwear engineered with disciplined tailoring, dual-monetary transparency, and limited generational capsules.
            </p>
          </div>

          {/* Collection Links */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-semibold tracking-widest uppercase text-[#111111]">
              Collection
            </h4>
            <ul className="space-y-2 text-xs text-[#6B6B6B]">
              <li>
                <Link href="/shoes" className="hover:text-[#111111] transition-colors">
                  Footwear / Shoes
                </Link>
              </li>
              <li>
                <Link href="/clothes" className="hover:text-[#111111] transition-colors">
                  Garments / Clothes
                </Link>
              </li>
              <li>
                <Link href="/shoes" className="hover:text-[#111111] transition-colors">
                  Drop 06 New In
                </Link>
              </li>
              <li>
                <Link href="/#editorial" className="hover:text-[#111111] transition-colors">
                  Runway Lookbook
                </Link>
              </li>
              <li>
                <Link href="/shoes" className="hover:text-[#111111] transition-colors">
                  Archival Vault
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Care */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-semibold tracking-widest uppercase text-[#111111]">
              Client Care
            </h4>
            <ul className="space-y-2 text-xs text-[#6B6B6B]">
              <li>
                <Link href="/account" className="hover:text-[#111111] transition-colors">
                  Shipping & Duties
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-[#111111] transition-colors">
                  30-Day Returns
                </Link>
              </li>
              <li>
                <Link href="/shoes" className="hover:text-[#111111] transition-colors">
                  Bespoke Size Guide
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-[#111111] transition-colors">
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-[#111111] transition-colors">
                  Atelier FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Ledger Newsletter Form */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-semibold tracking-widest uppercase text-[#111111]">
              Join the JBØ6 Ledger
            </h4>
            <p className="text-xs text-[#6B6B6B]">
              Private notices on rare drops, secret showroom releases, and atelier archives.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2 pt-1">
              <input
                type="email"
                placeholder="Enter client email..."
                className="w-full text-xs px-3.5 py-2 bg-[#FAFAF8] border border-[#E8E8E4] rounded-[8px] text-[#111111] placeholder:text-[#A0A09C] focus:outline-none focus:border-[#111111]"
              />
              <button
                type="submit"
                className="text-xs font-semibold px-4 py-2 bg-[#111111] text-white hover:bg-black rounded-[8px] transition-colors shrink-0"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Disclaimer & Payment Gateways */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#6B6B6B]">
          <p className="text-[11px]">
            GCash payments charged natively in PHP. 1 USD ≈ ₱58. PayPal and bankcards in USD.
          </p>

          <div className="flex items-center gap-3 text-[11px] font-medium text-[#111111]">
            <span className="px-2 py-0.5 bg-[#FAF6ED] text-[#B8912F] rounded border border-[#E8DFC8]">GCash</span>
            <span className="px-2 py-0.5 bg-[#F0F0EC] rounded">PayPal</span>
            <span className="px-2 py-0.5 bg-[#F0F0EC] rounded">Visa</span>
            <span className="px-2 py-0.5 bg-[#F0F0EC] rounded">Mastercard</span>
            <span className="px-2 py-0.5 bg-[#F0F0EC] rounded">Apple Pay</span>
          </div>

          <p className="text-[11px]">
            © 2026 JBØ6 Atelier Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
