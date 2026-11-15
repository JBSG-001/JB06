'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useConsoleAuth } from '@/lib/auth-context';
import LiveMonitorPage from './live-monitor/page';

export default function ConsoleRootPage() {
  const router = useRouter();
  const { isAuthenticated } = useConsoleAuth();

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FAFAF8] space-y-3">
        <div className="w-8 h-8 bg-[#111111] rounded-[8px] flex items-center justify-center text-[#B8912F] font-serif font-bold text-xs animate-pulse">
          JB
        </div>
        <p className="text-xs text-[#6B6B6B] font-mono">Authenticating console operator...</p>
      </div>
    );
  }

  return <LiveMonitorPage />;
}
