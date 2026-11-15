'use client';

import React, { useState } from 'react';
import { useConsoleAuth } from '@/lib/auth-context';
import {
  Settings,
  DollarSign,
  Users,
  Shield,
  Clock,
  Save,
  Plus,
  Lock,
  Check,
} from 'lucide-react';
import { Input, Button, Badge } from '@jb06/ui';

export default function SettingsPage() {
  const { role, canAccessDevTools } = useConsoleAuth();

  const [rate, setRate] = useState('58.00');
  const [mode, setMode] = useState<'MANUAL' | 'AUTO'>('MANUAL');
  const [isSaved, setIsSaved] = useState(false);

  const [teamMembers, setTeamMembers] = useState([
    { id: '1', name: 'Devon Developer', email: 'devon.developer@jb06.com', role: 'DEVELOPER', mfa: 'ACTIVE (TOTP)' },
    { id: '2', name: 'Sarah Staff', email: 'sarah.staff@jb06.com', role: 'STAFF', mfa: 'RECOMMENDED' },
  ]);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'STAFF' | 'DEVELOPER'>('STAFF');

  if (!canAccessDevTools) {
    return (
      <div className="p-8 max-w-2xl mx-auto my-16 text-center bg-white border border-[#E8E8E4] rounded-[12px] p-10 space-y-4 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center mx-auto border border-[#FECACA]">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-2xl text-[#111111]">403 Access Restricted</h2>
        <p className="text-xs text-[#6B6B6B]">
          Currency settings and staff management require the <strong>DEVELOPER</strong> role. You are viewing as <strong>{role}</strong>.
        </p>
      </div>
    );
  }

  const handleSaveCurrency = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    setTeamMembers((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name: inviteEmail.split('@')[0],
        email: inviteEmail,
        role: inviteRole,
        mfa: 'PENDING SETUP',
      },
    ]);

    setInviteEmail('');
    alert(`Secure invitation link generated and dispatched to ${inviteEmail} with role ${inviteRole}.`);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E8E4]">
        <div>
          <span className="text-[10px] font-semibold tracking-widest uppercase text-[#B8912F]">
            SYSTEM CONFIGURATION // MONETARY & ACCESS CONTROLS
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#111111]">
            Settings & Team Roles
          </h1>
        </div>
      </div>

      {/* 1. DUAL-CURRENCY ENGINE SETTINGS */}
      <div className="bg-white border border-[#E8E8E4] rounded-[12px] p-6 space-y-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E4]">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#111111] flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#B8912F]" />
              Dual-Currency Exchange Engine
            </h3>
            <p className="text-[11px] text-[#6B6B6B]">Governs PHP conversion across the Storefront, Cart holds, and GCash settlement</p>
          </div>
          <Badge variant="new">Live Peg Active</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
          <Input
            label="Standard Exchange Rate (PHP per 1 USD)"
            type="number"
            step="0.01"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            helperText="Order records snapshot this value immutably at checkout."
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-medium tracking-wide text-[#111111] uppercase">
              Update Frequency Mode
            </label>
            <div className="flex items-center gap-2">
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as any)}
                className="w-full text-xs px-3.5 py-2 bg-white border border-[#E8E8E4] rounded-[8px] focus:outline-none focus:border-[#111111]"
              >
                <option value="MANUAL">MANUAL (Fixed Atelier Policy Standard)</option>
                <option value="AUTO">AUTO (Bangko Sentral ng Pilipinas Live Feed)</option>
              </select>

              <Button
                type="button"
                variant="primary"
                onClick={handleSaveCurrency}
                className="text-xs font-semibold uppercase tracking-wider px-5 py-2 shrink-0"
              >
                {isSaved ? <Check className="w-4 h-4 text-[#10B981]" /> : <Save className="w-4 h-4" />}
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TEAM MEMBERS & DEVELOPER INVITE FLOW */}
      <div className="bg-white border border-[#E8E8E4] rounded-[12px] p-6 space-y-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E4]">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#111111] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#B8912F]" />
              Atelier Team & Access Guards
            </h3>
            <p className="text-[11px] text-[#6B6B6B]">Role-based route and API guards enforced with Supabase app_metadata</p>
          </div>
          <span className="text-[10px] bg-[#111111] text-[#E8DFC8] px-2 py-0.5 rounded font-mono font-semibold">
            STRICT RLS ENFORCED
          </span>
        </div>

        {/* Team Table */}
        <div className="divide-y divide-[#F0F0EC] border border-[#E8E8E4] rounded-[8px] overflow-hidden">
          {teamMembers.map((m) => (
            <div key={m.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-[#FAFAF8]">
              <div>
                <p className="font-semibold text-[#111111]">{m.name}</p>
                <p className="text-[11px] text-[#6B6B6B]">{m.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#FAF6ED] text-[#B8912F] border border-[#E8DFC8]">
                  {m.role}
                </span>
                <span className="text-[10px] text-[#6B6B6B] font-mono">{m.mfa}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Invite Form */}
        <form onSubmit={handleInvite} className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <Input
            placeholder="colleague@jb06.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="flex-1"
          />
          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value as any)}
            className="text-xs px-3.5 py-2 bg-white border border-[#E8E8E4] rounded-[8px] focus:outline-none focus:border-[#111111]"
          >
            <option value="STAFF">STAFF (Inventory, Orders, Customers)</option>
            <option value="DEVELOPER">DEVELOPER (Full System Access + Health)</option>
          </select>
          <Button type="submit" variant="primary" className="text-xs uppercase tracking-wider px-5 py-2 shrink-0">
            <Plus className="w-3.5 h-3.5" />
            <span>Send Invite</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
