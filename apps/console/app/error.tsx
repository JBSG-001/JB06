'use client';

import React from 'react';
import { AlertCircle, RotateCw } from 'lucide-react';

export default function ConsoleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FAFAF8] text-center">
      <div className="w-full max-w-md bg-white border border-[#E8E8E4] rounded-[12px] p-8 shadow-xs space-y-5">
        <div className="w-10 h-10 bg-[#FEF2F2] border border-[#FECACA] rounded-[8px] flex items-center justify-center mx-auto text-[#C0392B]">
          <AlertCircle className="w-5 h-5" />
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase text-[#C0392B] font-semibold">
            CONSOLE FAULT RECOVERED
          </span>
          <h1 className="font-serif text-2xl text-[#111111] font-normal">
            Operational Exception
          </h1>
          <p className="text-xs text-[#6B6B6B]">
            {error.message || 'An unexpected runtime state occurred in the console environment.'}
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full py-2.5 px-4 bg-[#111111] hover:border-[#B8912F] text-white border border-transparent rounded-[8px] text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Reload & Try Again</span>
          </button>
        </div>
      </div>
    </div>
  );
}
