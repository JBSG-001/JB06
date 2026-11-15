'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useConsoleAuth, ConsoleRole } from '@/lib/auth-context';
import {
  Eye,
  EyeOff,
  ShieldCheck,
  Lock,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  ArrowLeft,
  Smartphone,
  RefreshCw,
  Copy,
  Info,
} from 'lucide-react';

export default function ConsoleLoginPage() {
  const router = useRouter();
  const { login } = useConsoleAuth();

  // Navigation steps: 'credentials' -> '2fa' -> 'recovery'
  const [step, setStep] = useState<'credentials' | '2fa' | 'recovery'>('credentials');

  // Step 1: Credentials State
  const [email, setEmail] = useState('devon.developer@jb06.com');
  const [password, setPassword] = useState('DevonMasterKey2026!');
  const [role, setRole] = useState<ConsoleRole>('DEVELOPER');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberTerminal, setRememberTerminal] = useState(true);
  const [environment, setEnvironment] = useState<'PRODUCTION' | 'STAGING'>('PRODUCTION');
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [credError, setCredError] = useState<string | null>(null);
  const [showForgotNotice, setShowForgotNotice] = useState(false);

  // Step 2: 2FA State
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(60);
  const [resendNotice, setResendNotice] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState<number | null>(null);

  // Recovery Code State
  const [recoveryCode, setRecoveryCode] = useState('');
  const [recoveryError, setRecoveryError] = useState<string | null>(null);

  // Refs for 6 OTP boxes
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus first OTP input when transitioning to 2FA
  useEffect(() => {
    if (step === '2fa') {
      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  // Resend countdown timer effect
  useEffect(() => {
    if (step === '2fa' && resendCountdown > 0) {
      const timer = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, resendCountdown]);

  // Lockout countdown timer effect
  useEffect(() => {
    if (lockoutTimer !== null && lockoutTimer > 0) {
      const timer = setInterval(() => {
        setLockoutTimer((prev) => {
          if (prev === null || prev <= 1) {
            setFailedAttempts(0);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lockoutTimer]);

  // Quick Account Select
  const handleSelectAccount = (selectedRole: ConsoleRole) => {
    setRole(selectedRole);
    setCredError(null);
    if (selectedRole === 'DEVELOPER') {
      setEmail('devon.developer@jb06.com');
      setPassword('DevonMasterKey2026!');
    } else {
      setEmail('sarah.staff@jb06.com');
      setPassword('StaffOperations2026!');
    }
  };

  // Step 1: Submit Credentials
  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCredError(null);

    if (!email.trim() || !password.trim()) {
      setCredError('Please enter both operator email and password.');
      return;
    }

    setIsAuthorizing(true);

    setTimeout(() => {
      setIsAuthorizing(false);
      // Advance to 2FA step
      setStep('2fa');
      setResendCountdown(60);
      setOtp(['', '', '', '', '', '']);
      setOtpError(null);
    }, 800);
  };

  // OTP Input handlers
  const handleOtpChange = (index: number, value: string) => {
    // Only accept numeric digit
    const cleaned = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = cleaned;
    setOtp(newOtp);
    setOtpError(null);

    // Auto-advance to next box
    if (cleaned && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Move back to previous box
        otpRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pastedData[i] || '';
      }
      setOtp(newOtp);
      setOtpError(null);

      // Focus last filled box
      const targetFocus = Math.min(pastedData.length, 5);
      otpRefs.current[targetFocus]?.focus();
    }
  };

  // Quick Fill Demo OTP
  const handleQuickFillOtp = () => {
    setOtp(['0', '6', '2', '0', '2', '6']);
    setOtpError(null);
    otpRefs.current[5]?.focus();
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();

    if (lockoutTimer !== null) {
      return;
    }

    const code = otp.join('');
    if (code.length < 6) {
      setOtpError('Please enter all 6 digits of your verification code.');
      return;
    }

    setIsVerifying(true);
    setOtpError(null);

    setTimeout(() => {
      setIsVerifying(false);

      // Demo condition: '000000' triggers invalid attempt to test error handling
      if (code === '000000') {
        const nextFailed = failedAttempts + 1;
        setFailedAttempts(nextFailed);
        if (nextFailed >= 3) {
          setLockoutTimer(300); // 5 minute lockout
          setOtpError('Security lock engaged: Too many failed attempts. Console locked for 5 minutes.');
        } else {
          setOtpError(
            `Invalid verification code (${3 - nextFailed} attempt${3 - nextFailed === 1 ? '' : 's'} remaining).`
          );
        }
        return;
      }

      // Success!
      setIsSuccess(true);
      login(email, role);

      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    }, 900);
  };

  // Step 3: Verify Recovery Code
  const handleVerifyRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryCode.trim()) {
      setRecoveryError('Please enter your 8-character emergency recovery code.');
      return;
    }

    setIsVerifying(true);
    setRecoveryError(null);

    setTimeout(() => {
      setIsVerifying(false);
      setIsSuccess(true);
      login(email, role);

      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    }, 900);
  };

  // Resend code trigger
  const handleResend = () => {
    if (resendCountdown === 0) {
      setResendCountdown(60);
      setResendNotice(true);
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
      setTimeout(() => setResendNotice(false), 4000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#FAFAF8]">
      <div className="w-full max-w-md bg-white border border-[#E8E8E4] rounded-[12px] p-6 sm:p-10 shadow-xs space-y-6">
        
        {/* Top Header: Brand Monogram + Environment Badge */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E8E4]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#111111] rounded-[8px] flex items-center justify-center text-[#B8912F] font-serif font-bold text-xs shadow-xs">
              JB
            </div>
            <div>
              <span className="font-bold text-xs tracking-tight text-[#111111] block leading-none">
                JBØ6 CONSOLE
              </span>
              <span className="text-[10px] text-[#6B6B6B] font-mono">
                OPERATIONS ERP
              </span>
            </div>
          </div>

          {/* Environment Switcher Badge */}
          <button
            type="button"
            onClick={() => setEnvironment(environment === 'PRODUCTION' ? 'STAGING' : 'PRODUCTION')}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-[#F4F4F0] hover:bg-[#E8E8E4] border border-[#E8E8E4] rounded-full text-[10px] font-mono transition-colors"
            title="Click to toggle environment (Production / Staging)"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                environment === 'PRODUCTION' ? 'bg-[#2E7D5B] animate-pulse' : 'bg-[#C98A1B]'
              }`}
            />
            <span className="font-semibold text-[#111111]">{environment}</span>
          </button>
        </div>

        {/* -------------------- STEP 1: CREDENTIALS -------------------- */}
        {step === 'credentials' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h1 className="font-serif text-2xl text-[#111111] font-normal tracking-tight">
                Console sign in
              </h1>
              <p className="text-xs text-[#6B6B6B]">
                Authenticate with your assigned staff or developer credentials.
              </p>
            </div>

            {/* Quick-Switch Operator Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6B6B6B]">
                Quick Select Operator
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectAccount('DEVELOPER')}
                  className={`p-2.5 rounded-[8px] border text-left transition-colors flex flex-col ${
                    role === 'DEVELOPER'
                      ? 'border-[#111111] bg-[#111111] text-white'
                      : 'border-[#E8E8E4] bg-[#FAFAF8] text-[#111111] hover:border-[#111111]'
                  }`}
                >
                  <span className="text-xs font-semibold leading-tight">Devon</span>
                  <span
                    className={`text-[10px] font-mono ${
                      role === 'DEVELOPER' ? 'text-[#B8912F]' : 'text-[#6B6B6B]'
                    }`}
                  >
                    DEVELOPER
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectAccount('STAFF')}
                  className={`p-2.5 rounded-[8px] border text-left transition-colors flex flex-col ${
                    role === 'STAFF'
                      ? 'border-[#111111] bg-[#111111] text-white'
                      : 'border-[#E8E8E4] bg-[#FAFAF8] text-[#111111] hover:border-[#111111]'
                  }`}
                >
                  <span className="text-xs font-semibold leading-tight">Sarah</span>
                  <span
                    className={`text-[10px] font-mono ${
                      role === 'STAFF' ? 'text-[#B8912F]' : 'text-[#6B6B6B]'
                    }`}
                  >
                    STAFF
                  </span>
                </button>
              </div>
            </div>

            {credError && (
              <div className="p-3.5 bg-[#FEF2F2] border border-[#FECACA] rounded-[8px] flex items-start gap-2.5 text-xs text-[#C0392B]">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{credError}</span>
              </div>
            )}

            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#111111] uppercase tracking-wider mb-1.5">
                  Operator email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@jb06.com"
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E8E8E4] rounded-[8px] text-xs text-[#111111] focus:outline-none focus:border-[#111111] focus:ring-2 focus:ring-[#B8912F]/35 font-mono"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-[#111111] uppercase tracking-wider">
                    Secret key / Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotNotice(!showForgotNotice)}
                    className="text-[11px] text-[#6B6B6B] hover:text-[#111111] underline"
                  >
                    Forgot password?
                  </button>
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
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {showForgotNotice && (
                <div className="p-3 bg-[#FAF6ED] border border-[#E8DFC8] rounded-[8px] text-xs text-[#6B6B6B] flex items-start gap-2">
                  <Info className="w-4 h-4 text-[#B8912F] shrink-0 mt-0.5" />
                  <span>
                    Console credentials are restricted. Contact Devon Developer or systems lead to issue a secure password reset via the internal CLI.
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#6B6B6B]">
                  <input
                    type="checkbox"
                    checked={rememberTerminal}
                    onChange={(e) => setRememberTerminal(e.target.checked)}
                    className="rounded border-[#E8E8E4] text-[#111111] focus:ring-0"
                  />
                  <span>Remember this terminal for 12 hours</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isAuthorizing}
                className="w-full py-2.5 bg-[#111111] hover:border-[#B8912F] text-white border border-transparent rounded-[8px] text-xs font-semibold uppercase tracking-wider transition-all duration-150 shadow-xs flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {isAuthorizing ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Verifying credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Continue to 2FA Verification</span>
                    <ShieldCheck className="w-4 h-4 text-[#B8912F]" />
                  </>
                )}
              </button>

              {/* Strict Console Disclaimer */}
              <div className="p-3 bg-[#FAFAF8] border border-[#E8E8E4] rounded-[8px] flex items-start gap-2.5 text-xs text-[#6B6B6B]">
                <Lock className="w-4 h-4 text-[#B8912F] shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="text-[#111111] block mb-0.5">Restricted ERP Access</strong>
                  <span>
                    Invitation only. Public sign-up is disabled. Hardware token or TOTP 2FA required for all operators.
                  </span>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* -------------------- STEP 2: 2FA OTP VERIFICATION -------------------- */}
        {step === '2fa' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-[#B8912F] font-semibold mb-1">
                <Smartphone className="w-3.5 h-3.5" />
                <span>STEP 2 OF 2: MULTI-FACTOR AUTH</span>
              </div>
              <h1 className="font-serif text-2xl text-[#111111] font-normal tracking-tight">
                Two-factor verification
              </h1>
              <p className="text-xs text-[#6B6B6B]">
                Enter the 6-digit code generated by your authenticator app for{' '}
                <span className="font-semibold text-[#111111] font-mono">{email}</span>.
              </p>
            </div>

            {/* Interactive Demo OTP Tip */}
            <div className="p-3 bg-[#FAF6ED] border border-[#E8DFC8] rounded-[8px] flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-[#6B6B6B]">
                <KeyRound className="w-4 h-4 text-[#B8912F] shrink-0" />
                <span>
                  Demo OTP: <strong className="font-mono text-[#111111]">062026</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={handleQuickFillOtp}
                className="px-2.5 py-1 bg-white border border-[#E8DFC8] hover:border-[#111111] rounded text-[11px] font-medium text-[#111111] transition-colors cursor-pointer"
              >
                Quick Fill
              </button>
            </div>

            {/* Error or Lockout Alert */}
            {otpError && (
              <div className="p-3.5 bg-[#FEF2F2] border border-[#FECACA] rounded-[8px] flex items-start gap-2.5 text-xs text-[#C0392B]">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="block">{otpError}</strong>
                  {lockoutTimer !== null && (
                    <span className="font-mono text-[11px]">
                      Lockout active: {Math.floor(lockoutTimer / 60)}:
                      {String(lockoutTimer % 60).padStart(2, '0')} remaining.
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Resend Notice */}
            {resendNotice && (
              <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-[8px] flex items-center gap-2 text-xs text-[#2E7D5B]">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>New 6-digit code dispatched to your registered authenticator.</span>
              </div>
            )}

            {/* Success Animation */}
            {isSuccess && (
              <div className="p-4 bg-[#F0FDF4] border border-[#2E7D5B] rounded-[8px] flex items-center gap-3 text-xs text-[#2E7D5B]">
                <CheckCircle2 className="w-5 h-5 shrink-0 animate-bounce" />
                <div>
                  <strong className="block text-sm">2FA Verified Successfully</strong>
                  <span>Initializing operator console session...</span>
                </div>
              </div>
            )}

            {!isSuccess && (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                {/* 6 OTP Input Boxes */}
                <div>
                  <label className="block text-xs font-medium text-[#111111] uppercase tracking-wider mb-3 text-center">
                    6-digit security code
                  </label>
                  <div
                    className="flex items-center justify-between gap-2 max-w-xs mx-auto"
                    onPaste={handleOtpPaste}
                  >
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          otpRefs.current[idx] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={digit}
                        disabled={lockoutTimer !== null}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-mono font-bold rounded-[8px] border transition-all ${
                          digit
                            ? 'border-[#111111] bg-white text-[#111111]'
                            : 'border-[#E8E8E4] bg-[#FAFAF8] text-[#111111]'
                        } focus:outline-none focus:border-[#111111] focus:ring-2 focus:ring-[#B8912F]/40 disabled:opacity-50`}
                      />
                    ))}
                  </div>
                </div>

                {/* Primary Verify Button */}
                <button
                  type="submit"
                  disabled={isVerifying || otp.join('').length < 6 || lockoutTimer !== null}
                  className="w-full py-2.5 bg-[#111111] hover:border-[#B8912F] text-white border border-transparent rounded-[8px] text-xs font-semibold uppercase tracking-wider transition-all duration-150 shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isVerifying ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span>Validating code...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify & Enter Console</span>
                      <ShieldCheck className="w-4 h-4 text-[#B8912F]" />
                    </>
                  )}
                </button>

                {/* Resend & Emergency Recovery Options */}
                <div className="flex flex-col items-center gap-3 pt-2 text-xs text-[#6B6B6B] border-t border-[#E8E8E4]">
                  <div className="flex items-center gap-1.5">
                    <span>Didn&apos;t receive a code?</span>
                    {resendCountdown > 0 ? (
                      <span className="font-mono text-[#111111]">
                        Resend in {resendCountdown}s
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResend}
                        className="text-[#111111] hover:text-[#B8912F] font-semibold underline cursor-pointer"
                      >
                        Resend code
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep('recovery')}
                    className="text-[#6B6B6B] hover:text-[#111111] underline text-[11px]"
                  >
                    Use an emergency backup recovery code
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep('credentials')}
                    className="flex items-center gap-1.5 text-xs text-[#6B6B6B] hover:text-[#111111] pt-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to operator sign in</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* -------------------- STEP 3: EMERGENCY RECOVERY CODE -------------------- */}
        {step === 'recovery' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-[#B8912F] font-semibold mb-1">
                <KeyRound className="w-3.5 h-3.5" />
                <span>FALLBACK RECOVERY</span>
              </div>
              <h1 className="font-serif text-2xl text-[#111111] font-normal tracking-tight">
                Use emergency recovery code
              </h1>
              <p className="text-xs text-[#6B6B6B]">
                Enter one of your 8-character single-use emergency backup codes saved during 2FA setup.
              </p>
            </div>

            {/* Quick Fill Demo Code */}
            <div className="p-3 bg-[#FAF6ED] border border-[#E8DFC8] rounded-[8px] flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-[#6B6B6B]">
                <KeyRound className="w-4 h-4 text-[#B8912F] shrink-0" />
                <span>
                  Demo Code: <strong className="font-mono text-[#111111]">A9X2-K7P4</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setRecoveryCode('A9X2-K7P4')}
                className="px-2.5 py-1 bg-white border border-[#E8DFC8] hover:border-[#111111] rounded text-[11px] font-medium text-[#111111] transition-colors cursor-pointer"
              >
                Quick Fill
              </button>
            </div>

            {recoveryError && (
              <div className="p-3.5 bg-[#FEF2F2] border border-[#FECACA] rounded-[8px] flex items-start gap-2.5 text-xs text-[#C0392B]">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{recoveryError}</span>
              </div>
            )}

            <form onSubmit={handleVerifyRecovery} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#111111] uppercase tracking-wider mb-1.5">
                  Recovery code
                </label>
                <input
                  type="text"
                  value={recoveryCode}
                  onChange={(e) => setRecoveryCode(e.target.value.toUpperCase())}
                  placeholder="XXXX-XXXX"
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E8E8E4] rounded-[8px] text-xs text-[#111111] focus:outline-none focus:border-[#111111] focus:ring-2 focus:ring-[#B8912F]/35 font-mono uppercase tracking-widest text-center"
                />
              </div>

              <button
                type="submit"
                disabled={isVerifying || !recoveryCode.trim()}
                className="w-full py-2.5 bg-[#111111] hover:border-[#B8912F] text-white border border-transparent rounded-[8px] text-xs font-semibold uppercase tracking-wider transition-all duration-150 shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isVerifying ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Consuming recovery code...</span>
                  </>
                ) : (
                  <>
                    <span>Verify Recovery Code</span>
                    <ShieldCheck className="w-4 h-4 text-[#B8912F]" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep('2fa')}
                className="w-full flex items-center justify-center gap-1.5 text-xs text-[#6B6B6B] hover:text-[#111111] pt-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to 6-digit OTP verification</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
