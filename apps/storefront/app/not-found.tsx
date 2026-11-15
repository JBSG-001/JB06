'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function StorefrontNotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center justify-center text-center space-y-6">
      <div className="w-10 h-10 bg-[#111111] rounded-[8px] flex items-center justify-center text-[#B8912F] font-serif font-bold text-sm shadow-xs">
        JB
      </div>

      <div className="space-y-2 max-w-md">
        <span className="text-[10px] font-mono tracking-widest uppercase text-[#B8912F] font-semibold">
          404 // PIECE NOT IN ARCHIVE
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#111111] font-normal">
          Lookbook entry not found
        </h1>
        <p className="text-xs text-[#6B6B6B] leading-relaxed">
          The requested archival garment, footwear silhouette, or page is no longer listed in the current capsule.
        </p>
      </div>

      <div className="flex items-center gap-4 pt-2">
        <Link
          href="/"
          className="px-6 py-3 bg-[#111111] hover:border-[#B8912F] text-white border border-transparent rounded-full text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Atelier Home</span>
        </Link>
        <Link
          href="/shoes"
          className="px-6 py-3 bg-white hover:border-[#111111] text-[#111111] border border-[#E8E8E4] rounded-full text-xs font-semibold uppercase tracking-wider transition-colors"
        >
          <span>Explore Footwear</span>
        </Link>
      </div>
    </div>
  );
}
