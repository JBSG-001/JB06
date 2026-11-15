'use client';

import React from 'react';
import { RotateCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function StorefrontError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center justify-center text-center space-y-6">
      <div className="w-10 h-10 bg-[#FAF6ED] border border-[#E8DFC8] rounded-[8px] flex items-center justify-center mx-auto text-[#B8912F] font-serif font-bold text-sm">
        JB
      </div>

      <div className="space-y-2 max-w-md">
        <span className="text-[10px] font-mono tracking-widest uppercase text-[#B8912F] font-semibold">
          ATELIER CLIENT CONNECTION EXCEPTION
        </span>
        <h1 className="font-serif text-3xl text-[#111111] font-normal">
          Temporary Session Disruption
        </h1>
        <p className="text-xs text-[#6B6B6B] leading-relaxed">
          {error.message || 'An unexpected issue occurred while rendering this view. Your cart and reservations remain safe.'}
        </p>
      </div>

      <div className="flex items-center gap-4 pt-2">
        <button
          type="button"
          onClick={() => reset()}
          className="px-6 py-3 bg-[#111111] hover:border-[#B8912F] text-white border border-transparent rounded-full text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-2 cursor-pointer"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Reload View</span>
        </button>
        <Link
          href="/"
          className="px-6 py-3 bg-white hover:border-[#111111] text-[#111111] border border-[#E8E8E4] rounded-full text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Atelier Home</span>
        </Link>
      </div>
    </div>
  );
}
