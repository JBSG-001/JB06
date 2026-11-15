'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

export default function StorefrontLoginPage() {
  const [email, setEmail] = useState('alex@example.com');
  const [password, setPassword] = useState('AtelierSecure2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldError(null);
    setFormError(null);

    if (!email || !email.includes('@')) {
      setFieldError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Demo authentication simulation
      window.location.href = '/account';
    }, 1200);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] grid grid-cols-1 lg:grid-cols-2 bg-[#FAFAF8]">
      {/* LEFT PANEL: PRODUCT EDITORIAL & BRANDING (Desktop 1440px) */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 lg:p-16 bg-[#111111] text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1600&q=85"
            alt="JBØ6 Atelier Drop 06"
            fill
            className="object-cover opacity-50 filter contrast-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/60" />
        </div>

        {/* Top Header Badge */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-[8px] border border-white/20 flex items-center justify-center text-[#B8912F] font-serif font-bold text-xs shadow-xs">
              JB
            </div>
            <span className="font-bold tracking-tight text-xs uppercase text-white">JBØ6 ATELIER</span>
          </div>
          <span className="text-[10px] font-mono tracking-widest text-[#B8912F] border border-[#B8912F]/40 px-3 py-1 rounded-full bg-black/40">
            DROP 06 // MILAN & KYOTO
          </span>
        </div>

        {/* Brand Quote */}
        <div className="relative z-10 space-y-3 max-w-md my-auto">
          <p className="font-serif italic text-4xl xl:text-5xl text-white font-normal leading-tight">
            Cool shoes.<br />Stylish clothes.
          </p>
          <p className="text-xs text-[#D4D4CE] leading-relaxed font-light">
            Disciplined minimalist streetwear engineered with dual-monetary transparency and limited generational capsules.
          </p>
        </div>

        {/* Bottom Specs */}
        <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-[11px] text-[#A0A09C]">
          <span>Archival Vault Access</span>
          <span className="font-mono">USD $ • PHP ₱58.00</span>
        </div>
      </div>

      {/* RIGHT PANEL: FORM CARD (Desktop & Mobile 390px) */}
      <div className="flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md bg-white border border-[#E8E8E4] rounded-[12px] p-8 sm:p-10 shadow-xs space-y-6">
          
          {/* Top Logo Tile */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#111111] rounded-[8px] flex items-center justify-center text-[#B8912F] font-serif font-bold text-sm shadow-xs shrink-0">
              JB
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-[#111111]">JBØ6</span>
                <span className="text-[9px] uppercase tracking-widest text-[#B8912F] font-semibold">ATELIER</span>
              </div>
              <p className="text-[11px] text-[#6B6B6B] leading-none mt-0.5">Client Authentication</p>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <h1 className="font-serif text-2xl text-[#111111] font-normal tracking-tight">Log in to your account</h1>
            <p className="text-xs text-[#6B6B6B]">
              Enter your client credentials to access your archival orders and private drops.
            </p>
          </div>

          {/* Error Banner */}
          {formError && (
            <div className="p-3.5 bg-[#FEF2F2] border border-[#FECACA] rounded-[8px] flex items-start gap-2.5 text-xs text-[#C0392B]">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#111111] uppercase tracking-wider mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className={`w-full px-3.5 py-2.5 bg-white border rounded-[8px] text-xs text-[#111111] transition-all focus:outline-none focus:border-[#111111] focus:ring-2 focus:ring-[#B8912F]/35 ${
                  fieldError ? 'border-[#C0392B] ring-2 ring-[#C0392B]/15' : 'border-[#E8E8E4]'
                }`}
              />
              {fieldError && <p className="text-[11px] text-[#C0392B] mt-1">{fieldError}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-[#111111] uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-[11px] font-medium text-[#6B6B6B] hover:text-[#B8912F] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-3.5 py-2.5 pr-10 bg-white border border-[#E8E8E4] rounded-[8px] text-xs text-[#111111] transition-all focus:outline-none focus:border-[#111111] focus:ring-2 focus:ring-[#B8912F]/35"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#111111] p-0.5"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#111111] border-[#E8E8E4] focus:ring-[#B8912F] accent-[#111111]"
                />
                <span className="text-xs text-[#6B6B6B]">Remember me for 30 days</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-[#111111] hover:border-[#B8912F] text-white border border-transparent rounded-[8px] text-xs font-semibold uppercase tracking-wider transition-all duration-150 shadow-xs flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Authenticating...</span>
                </>
              ) : (
                'Log in'
              )}
            </button>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E8E8E4]" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-widest text-[#A0A09C]">
                <span className="bg-white px-3">or</span>
              </div>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              className="w-full py-2.5 px-4 bg-white border border-[#E8E8E4] hover:bg-[#FAFAF8] rounded-[8px] text-xs font-medium text-[#111111] flex items-center justify-center gap-2.5 transition-colors shadow-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Footer Links */}
            <div className="pt-4 text-center space-y-2 border-t border-[#E8E8E4]">
              <div>
                <Link
                  href="/shoes"
                  className="text-xs text-[#6B6B6B] hover:text-[#111111] transition-colors underline underline-offset-4"
                >
                  Continue as guest
                </Link>
              </div>
              <p className="text-xs text-[#6B6B6B]">
                New to JBØ6?{' '}
                <Link
                  href="/signup"
                  className="font-semibold text-[#111111] hover:text-[#B8912F] transition-colors"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
