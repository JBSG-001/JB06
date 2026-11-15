'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldAlert } from 'lucide-react';

export default function ConsoleNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FAFAF8] text-center">
      <div className="w-full max-w-md bg-white border border-[#E8E8E4] rounded-[12px] p-8 shadow-xs space-y-5">
        <div className="w-10 h-10 bg-[#FAF6ED] border border-[#E8DFC8] rounded-[8px] flex items-center justify-center mx-auto text-[#B8912F]">
          <ShieldAlert className="w-5 h-5" />
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase text-[#B8912F] font-semibold">
            ERROR 404 // CONSOLE ROUTE NOT FOUND
          </span>
          <h1 className="font-serif text-2xl text-[#111111] font-normal">
            Endpoint not mapped
          </h1>
          <p className="text-xs text-[#6B6B6B]">
            The requested console operational path does not exist or has been migrated.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/dashboard"
            className="w-full py-2.5 px-4 bg-[#111111] hover:border-[#B8912F] text-white border border-transparent rounded-[8px] text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Operations Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
