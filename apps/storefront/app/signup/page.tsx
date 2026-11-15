'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, Check, AlertCircle } from 'lucide-react';

export default function StorefrontSignupPage() {
  const [firstName, setFirstName] = useState('Alex');
  const [lastName, setLastName] = useState('Reyes');
  const [email, setEmail] = useState('alex@example.com');
  const [password, setPassword] = useState('AtelierSecure2026!');
  const [confirmPassword, setConfirmPassword] = useState('AtelierSecure2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Password rules validation
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const getStrength = () => {
    let score = 0;
    if (hasMinLength) score++;
    if (hasNumber) score++;
    if (hasSymbol) score++;
    if (password.length >= 12) score++;

    if (score === 0) return { label: 'EMPTY', color: 'bg-[#E8E8E4]', text: 'text-[#6B6B6B]', count: 0 };
    if (score <= 2) return { label: 'FAIR', color: 'bg-[#C98A1B]', text: 'text-[#C98A1B]', count: 2 };
    if (score === 3) return { label: 'GOOD', color: 'bg-[#B8912F]', text: 'text-[#B8912F]', count: 3 };
    return { label: 'STRONG', color: 'bg-[#2E7D5B]', text: 'text-[#2E7D5B]', count: 4 };
  };

  const strength = getStrength();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (!agreed) {
      setErrorMessage('Please agree to the Terms and Privacy Policy.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = '/account';
    }, 1200);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] grid grid-cols-1 lg:grid-cols-2 bg-[#FAFAF8]">
      {/* LEFT PANEL: PRODUCT EDITORIAL & BRANDING */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 lg:p-16 bg-[#111111] text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&q=85"
            alt="JBØ6 Garments Atelier"
            fill
            className="object-cover opacity-45 filter contrast-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/60" />
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-[8px] border border-white/20 flex items-center justify-center text-[#B8912F] font-serif font-bold text-xs shadow-xs">
              JB
            </div>
            <span className="font-bold tracking-tight text-xs uppercase text-white">JBØ6 ATELIER REGISTRY</span>
          </div>
          <span className="text-[10px] font-mono tracking-widest text-[#B8912F] border border-[#B8912F]/40 px-3 py-1 rounded-full bg-black/40">
            PRIVATE ACCESS
          </span>
        </div>

        <div className="relative z-10 space-y-3 max-w-md my-auto">
          <p className="font-serif italic text-4xl text-white font-normal leading-tight">
            "Disciplined luxury is not about excess. It is about exactitude."
          </p>
          <p className="text-xs text-[#D4D4CE] leading-relaxed font-light">
            Every garment numbered in limited generational editions. Members receive 2-hour priority vault keys before public drop drops.
          </p>
        </div>

        <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-[11px] text-[#A0A09C]">
          <span>Complimentary Worldwide Courier Over $100</span>
          <span className="font-mono">KYOTO • MILAN</span>
        </div>
      </div>

      {/* RIGHT PANEL: SIGN UP FORM */}
      <div className="flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md bg-white border border-[#E8E8E4] rounded-[12px] p-8 sm:p-10 shadow-xs space-y-5">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#111111] rounded-[8px] flex items-center justify-center text-[#B8912F] font-serif font-bold text-sm shadow-xs shrink-0">
              JB
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-[#111111]">JBØ6</span>
                <span className="text-[9px] uppercase tracking-widest text-[#B8912F] font-semibold">MEMBERSHIP</span>
              </div>
              <p className="text-[11px] text-[#6B6B6B] leading-none mt-0.5">Atelier Registration</p>
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="font-serif text-2xl text-[#111111] font-normal tracking-tight">Create your client account</h1>
            <p className="text-xs text-[#6B6B6B]">
              Unlock 15-minute vault holds, real-time telemetry tracking, and private capsule access.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 bg-[#FEF2F2] border border-[#FECACA] rounded-[8px] flex items-start gap-2.5 text-xs text-[#C0392B]">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#111111] uppercase tracking-wider mb-1">
                  First name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Alex"
                  required
                  className="w-full px-3 py-2 bg-white border border-[#E8E8E4] rounded-[8px] text-xs text-[#111111] focus:outline-none focus:border-[#111111] focus:ring-2 focus:ring-[#B8912F]/35"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#111111] uppercase tracking-wider mb-1">
                  Last name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Reyes"
                  required
                  className="w-full px-3 py-2 bg-white border border-[#E8E8E4] rounded-[8px] text-xs text-[#111111] focus:outline-none focus:border-[#111111] focus:ring-2 focus:ring-[#B8912F]/35"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#111111] uppercase tracking-wider mb-1">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                required
                className="w-full px-3 py-2 bg-white border border-[#E8E8E4] rounded-[8px] text-xs text-[#111111] focus:outline-none focus:border-[#111111] focus:ring-2 focus:ring-[#B8912F]/35"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#111111] uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create secure password"
                  required
                  className="w-full px-3 py-2 pr-10 bg-white border border-[#E8E8E4] rounded-[8px] text-xs text-[#111111] focus:outline-none focus:border-[#111111] focus:ring-2 focus:ring-[#B8912F]/35"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#111111] p-0.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Live Strength Meter */}
              <div className="mt-2 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#6B6B6B]">Password strength:</span>
                  <span className={`font-semibold font-mono ${strength.text}`}>{strength.label}</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 h-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`rounded-full transition-all duration-200 ${
                        i <= strength.count ? strength.color : 'bg-[#E8E8E4]'
                      }`}
                    />
                  ))}
                </div>

                {/* Rules Checklist */}
                <div className="grid grid-cols-3 gap-1 pt-1 text-[10px]">
                  <span className={`flex items-center gap-1 ${hasMinLength ? 'text-[#2E7D5B] font-medium' : 'text-[#6B6B6B]'}`}>
                    <Check className={`w-3 h-3 ${hasMinLength ? 'text-[#2E7D5B]' : 'text-[#A0A09C]'}`} /> 8+ chars
                  </span>
                  <span className={`flex items-center gap-1 ${hasNumber ? 'text-[#2E7D5B] font-medium' : 'text-[#6B6B6B]'}`}>
                    <Check className={`w-3 h-3 ${hasNumber ? 'text-[#2E7D5B]' : 'text-[#A0A09C]'}`} /> One number
                  </span>
                  <span className={`flex items-center gap-1 ${hasSymbol ? 'text-[#2E7D5B] font-medium' : 'text-[#6B6B6B]'}`}>
                    <Check className={`w-3 h-3 ${hasSymbol ? 'text-[#2E7D5B]' : 'text-[#A0A09C]'}`} /> One symbol
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#111111] uppercase tracking-wider mb-1">
                Confirm password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                required
                className="w-full px-3 py-2 bg-white border border-[#E8E8E4] rounded-[8px] text-xs text-[#111111] focus:outline-none focus:border-[#111111] focus:ring-2 focus:ring-[#B8912F]/35"
              />
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-[#111111] border-[#E8E8E4] focus:ring-[#B8912F] accent-[#111111]"
                />
                <span className="text-xs text-[#6B6B6B] leading-snug">
                  I agree to the <a href="#" className="underline hover:text-[#111111]">Terms of Service</a> and{' '}
                  <a href="#" className="underline hover:text-[#111111]">Privacy Policy</a>.
                </span>
              </label>
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
                  <span>Creating account...</span>
                </>
              ) : (
                'Create account'
              )}
            </button>

            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E8E8E4]" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-widest text-[#A0A09C]">
                <span className="bg-white px-3">or</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full py-2 px-4 bg-white border border-[#E8E8E4] hover:bg-[#FAFAF8] rounded-[8px] text-xs font-medium text-[#111111] flex items-center justify-center gap-2.5 transition-colors shadow-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="pt-3 text-center border-t border-[#E8E8E4]">
              <p className="text-xs text-[#6B6B6B]">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="font-semibold text-[#111111] hover:text-[#B8912F] transition-colors"
                >
                  Log in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
