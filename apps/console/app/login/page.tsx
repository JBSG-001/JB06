'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, ShieldAlert, Lock, AlertCircle } from 'lucide-react';

export default function ConsoleLoginPage() {
  const [email, setEmail] = useState('staff@jbo6.com');
  const [password, setPassword] = useState('StaffSecureKey2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [environment, setEnvironment] = useState<'PRODUCTION' | 'STAGING'>('PRODUCTION');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Simulate login -> navigate to 2FA verification
      window.location.href = '/dashboard';
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#FAFAF8]">
      <div className="w-full max-w-md bg-white border border-[#E8E8E4] rounded-[12px] p-8 sm:p-10 shadow-xs space-y-6">
        
        {/* Top Header with Environment Badge */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E8E4]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#111111] rounded-[8px] flex items-center justify-center text-[#B8912F] font-serif font-bold text-xs shadow-xs">
              JB
            </div>
            <div>
              <span className="font-bold text-xs tracking-tight text-[#111111] block leading-none">JBØ6 CONSOLE</span>
              <span className="text-[10px] text-[#6B6B6B] font-mono">OPERATIONS ERP</span>
            </div>
          </div>

          {/* Environment Switcher Badge */}
          <button
            type="button"
            onClick={() => setEnvironment(environment === 'PRODUCTION' ? 'STAGING' : 'PRODUCTION')}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-[#F4F4F0] hover:bg-[#E8E8E4] border border-[#E8E8E4] rounded-full text-[10px] font-mono transition-colors"
            title="Click to toggle environment"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                environment === 'PRODUCTION' ? 'bg-[#2E7D5B] animate-pulse' : 'bg-[#C98A1B]'
              }`}
            />
            <span className="font-semibold text-[#111111]">{environment}</span>
          </button>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h1 className="font-serif text-2xl text-[#111111] font-normal tracking-tight">Console sign in</h1>
          <p className="text-xs text-[#6B6B6B]">
            Authenticate with your assigned staff or developer credentials.
          </p>
        </div>

        {formError && (
          <div className="p-3.5 bg-[#FEF2F2] border border-[#FECACA] rounded-[8px] flex items-start gap-2.5 text-xs text-[#C0392B]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#111111] uppercase tracking-wider mb-1.5">
              Operator email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="staff@jbo6.com"
              required
              className="w-full px-3.5 py-2.5 bg-white border border-[#E8E8E4] rounded-[8px] text-xs text-[#111111] focus:outline-none focus:border-[#111111] focus:ring-2 focus:ring-[#B8912F]/35"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-[#111111] uppercase tracking-wider">
                Secret key / Password
              </label>
              <span className="text-[11px] text-[#6B6B6B] cursor-not-allowed">
                Forgot password?
              </span>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full px-3.5 py-2.5 pr-10 bg-white border border-[#E8E8E4] rounded-[8px] text-xs text-[#111111] focus:outline-none focus:border-[#111111] focus:ring-2 focus:ring-[#B8912F]/35 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#111111] p-0.5"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-[#111111] hover:border-[#B8912F] text-white border border-transparent rounded-[8px] text-xs font-semibold uppercase tracking-wider transition-all duration-150 shadow-xs flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Authorizing operator...</span>
              </>
            ) : (
              'Log in'
            )}
          </button>

          {/* Invitation-Only Note (Strictly enforced: no Google, no public signup) */}
          <div className="mt-4 p-3.5 bg-[#FAF6ED] border border-[#E8DFC8] rounded-[8px] flex items-start gap-2.5 text-xs text-[#6B6B6B]">
            <Lock className="w-4 h-4 text-[#B8912F] shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-[#111111] block mb-0.5">Restricted ERP Access</strong>
              <span>
                Access is by invitation only. Contact a Developer to obtain operator keys. Public sign-up is disabled.
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
