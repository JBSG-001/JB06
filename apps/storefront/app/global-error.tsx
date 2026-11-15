'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center p-6 bg-[#FAFAF8] text-[#111111] font-sans">
        <div className="max-w-md w-full bg-white border border-[#E8E8E4] rounded-[12px] p-8 text-center space-y-4">
          <h1 className="text-xl font-serif">JBØ6 Atelier Client Recovery</h1>
          <p className="text-xs text-[#6B6B6B]">{error.message || 'An unexpected application error occurred.'}</p>
          <button
            type="button"
            onClick={() => reset()}
            className="px-4 py-2 bg-[#111111] text-white rounded-full text-xs font-semibold uppercase tracking-wider cursor-pointer"
          >
            Reset Session
          </button>
        </div>
      </body>
    </html>
  );
}
