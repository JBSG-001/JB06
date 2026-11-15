'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useConsoleAuth } from '@/lib/auth-context';
import {
  Activity,
  LayoutDashboard,
  ShoppingBag,
  Layers,
  Users,
  Truck,
  Archive,
  ShieldAlert,
  Settings,
  Lock,
  LogOut,
  RefreshCw,
  Plus,
  Bell,
  Search,
} from 'lucide-react';

export const ConsoleSidebar: React.FC = () => {
  const pathname = usePathname();
  const { role, user, switchRole, canAccessDevTools, logout } = useConsoleAuth();

  if (pathname?.startsWith('/login')) {
    return null;
  }

  const navOperations = [
    { name: 'Live Monitor', href: '/live-monitor', icon: Activity, badge: 'Live', isLive: true },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Orders', href: '/orders', icon: ShoppingBag, badge: '14' },
    { name: 'Inventory', href: '/inventory', icon: Layers, badge: 'Low stock 3', badgeColor: 'bg-[#FFFBEB] text-[#D97706]' },
    { name: 'Customers', href: '/customers', icon: Users },
  ];

  const navSupply = [
    { name: 'Suppliers & POs', href: '/suppliers', icon: Truck },
    { name: 'Drops & Archives', href: '/drops', icon: Archive },
  ];

  const navSystem = [
    {
      name: 'System Health & APIs',
      href: '/system-health',
      icon: ShieldAlert,
      isDevOnly: true,
      badge: 'Dev',
    },
    { name: 'Settings & Currency', href: '/settings', icon: Settings, isDevOnly: true },
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#E8E8E4] flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none">
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Brand Header */}
        <div className="h-16 border-b border-[#E8E8E4] px-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#111111] text-white flex items-center justify-center font-bold text-xs rounded-sm">
              JB
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-[#111111]">JBØ6</span>
              <span className="text-[9px] tracking-widest uppercase text-[#B8912F] font-semibold">
                ADMIN CONSOLE
              </span>
            </div>
          </div>
          <span className="text-[10px] bg-[#FAF6ED] text-[#B8912F] border border-[#E8DFC8] px-1.5 py-0.5 rounded font-mono font-semibold">
            PROD
          </span>
        </div>

        {/* Navigation Sections */}
        <div className="p-4 space-y-6">
          {/* Operations */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-semibold tracking-wider uppercase text-[#A0A09C]">
              OPERATIONS
            </p>
            {navOperations.map((item) => {
              const isActive = pathname === item.href || (item.href === '/live-monitor' && pathname === '/');
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-[8px] text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#FAF6ED] text-[#111111] font-semibold border border-[#E8DFC8]'
                      : 'text-[#6B6B6B] hover:text-[#111111] hover:bg-[#FAFAF8]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#B8912F]' : 'text-[#6B6B6B]'}`} />
                    <span>{item.name}</span>
                    {item.isLive && (
                      <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                    )}
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        item.badgeColor || 'bg-[#F0F0EC] text-[#111111]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Supply & Merch */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-semibold tracking-wider uppercase text-[#A0A09C]">
              SUPPLY & MERCH
            </p>
            {navSupply.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-[8px] text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#FAF6ED] text-[#111111] font-semibold border border-[#E8DFC8]'
                      : 'text-[#6B6B6B] hover:text-[#111111] hover:bg-[#FAFAF8]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#B8912F]' : 'text-[#6B6B6B]'}`} />
                    <span>{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* System (Developer vs Staff Guarded) */}
          <div className="space-y-1">
            <div className="px-3 flex items-center justify-between">
              <p className="text-[10px] font-semibold tracking-wider uppercase text-[#A0A09C]">
                SYSTEM
              </p>
              {!canAccessDevTools && (
                <span title="Developer Only">
                  <Lock className="w-3 h-3 text-[#A0A09C]" />
                </span>
              )}
            </div>
            {navSystem.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              const isLocked = item.isDevOnly && !canAccessDevTools;

              return (
                <Link
                  key={item.name}
                  href={isLocked ? '#' : item.href}
                  onClick={(e) => {
                    if (isLocked) {
                      e.preventDefault();
                      alert('Access restricted to DEVELOPER role. Switch role at the bottom to test.');
                    }
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-[8px] text-xs font-medium transition-colors ${
                    isLocked
                      ? 'opacity-40 cursor-not-allowed text-[#A0A09C]'
                      : isActive
                      ? 'bg-[#FAF6ED] text-[#111111] font-semibold border border-[#E8DFC8]'
                      : 'text-[#6B6B6B] hover:text-[#111111] hover:bg-[#FAFAF8]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#B8912F]' : 'text-[#6B6B6B]'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] bg-[#111111] text-[#E8DFC8] px-1.5 py-0.2 rounded font-mono font-semibold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Profile & Role Switcher */}
      <div className="p-4 border-t border-[#E8E8E4] bg-[#FAFAF8] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-xs">
              {user.name.slice(0, 1)}
            </div>
            <div>
              <p className="text-xs font-semibold text-[#111111] leading-none">{user.name}</p>
              <span className="text-[10px] text-[#B8912F] font-mono leading-tight">{user.role}</span>
            </div>
          </div>
          <span className="text-[10px] text-[#A0A09C] font-mono">v2.4.1</span>
        </div>

        {/* Quick Role Switch Toggle & Sign Out */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={switchRole}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white border border-[#E8E8E4] hover:border-[#111111] rounded-[6px] text-[11px] font-medium text-[#111111] transition-colors"
            title="Switch role between DEVELOPER and STAFF to verify permissions"
          >
            <RefreshCw className="w-3 h-3 text-[#B8912F]" />
            <span>{role === 'DEVELOPER' ? 'Staff View' : 'Dev View'}</span>
          </button>

          <button
            type="button"
            onClick={logout}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 bg-white border border-[#E8E8E4] hover:border-[#C0392B] hover:text-[#C0392B] rounded-[6px] text-[11px] font-medium text-[#6B6B6B] transition-colors"
            title="Sign out of console"
          >
            <LogOut className="w-3 h-3" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
