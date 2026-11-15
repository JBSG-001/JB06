'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity,
  Maximize2,
  Minimize2,
  Smartphone,
  Monitor,
  ExternalLink,
  Pause,
  Play,
  RotateCw,
  Search,
  CheckCircle2,
  ShoppingBag,
  CreditCard,
  Eye,
  Globe,
} from 'lucide-react';
import { formatMoney } from '@jb06/ui';

interface StreamEvent {
  id: string;
  type: 'order_paid' | 'checkout_started' | 'add_to_cart' | 'product_view' | 'payment_pending';
  title: string;
  subtitle: string;
  time: string;
  amountUSD?: number;
  amountPHP?: number;
  badge?: string;
  badgeColor?: string;
}

export default function LiveMonitorPage() {
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [isFrozen, setIsFrozen] = useState(false);
  const [storefrontUrl, setStorefrontUrl] = useState('http://localhost:3000');
  const [eventFilter, setEventFilter] = useState<'all' | 'views' | 'cart' | 'checkout' | 'paid'>('all');

  const [activeVisitors, setActiveVisitors] = useState(42);
  const [openCarts, setOpenCarts] = useState(18);
  const [ordersToday, setOrdersToday] = useState(36);
  const [revenueTodayUSD, setRevenueTodayUSD] = useState(642000); // $6,420.00
  const [conversionRate, setConversionRate] = useState(3.42);

  const [events, setEvents] = useState<StreamEvent[]>([
    {
      id: 'e1',
      type: 'order_paid',
      title: 'Order #1042 placed',
      subtitle: 'Void Runner Sneaker (US 9.0) + Ribbed Socks • Marco V. (Makati City, PH)',
      time: 'Just now',
      amountUSD: 18400,
      amountPHP: 1067200,
      badge: 'GCash PHP',
      badgeColor: 'bg-[#FAF6ED] text-[#B8912F] border border-[#E8DFC8]',
    },
    {
      id: 'e2',
      type: 'order_paid',
      title: 'Paid via PayPal Order #1041',
      subtitle: 'Sculpted Wool Trench • Elena R. (Tokyo, JP)',
      time: '12s ago',
      amountUSD: 21000,
      amountPHP: 1218000,
      badge: 'PayPal USD',
      badgeColor: 'bg-[#F0F0EC] text-[#111111]',
    },
    {
      id: 'e3',
      type: 'checkout_started',
      title: 'Checkout started',
      subtitle: 'Cart $145.00 ≈ ₱8,410 • Step: Shipping Selection (Visitor #8841)',
      time: '48s ago',
      badge: 'Sync active',
    },
    {
      id: 'e4',
      type: 'add_to_cart',
      title: 'Added to Cart',
      subtitle: 'Oversized Heavy Tee (Chalk White, L) • Visitor #8839 (Manila, PH)',
      time: '2m ago',
    },
    {
      id: 'e5',
      type: 'product_view',
      title: 'Visitor viewed product',
      subtitle: 'Noir Chelsea Boot (US 10.0) • Visitor #8822 (Cebu City, PH)',
      time: '3m ago',
      badge: '3 remaining',
      badgeColor: 'bg-[#FFFBEB] text-[#D97706]',
    },
    {
      id: 'e6',
      type: 'payment_pending',
      title: 'Payment pending GCash',
      subtitle: '₱8,410 ($145.00) • Awaiting QR scan (Expires in 11m 40s) • Pasig City',
      time: '4m ago',
      badge: 'Pending',
      badgeColor: 'bg-[#FFFBEB] text-[#D97706]',
    },
  ]);

  // Simulate subtle live pulses if stream is not frozen
  useEffect(() => {
    if (isFrozen) return;

    const interval = setInterval(() => {
      // Randomly jitter active visitors slightly
      setActiveVisitors((prev) => Math.max(38, Math.min(48, prev + (Math.random() > 0.5 ? 1 : -1))));
    }, 4000);

    return () => clearInterval(interval);
  }, [isFrozen]);

  const filteredEvents = events.filter((e) => {
    if (eventFilter === 'views') return e.type === 'product_view';
    if (eventFilter === 'cart') return e.type === 'add_to_cart';
    if (eventFilter === 'checkout') return e.type === 'checkout_started' || e.type === 'payment_pending';
    if (eventFilter === 'paid') return e.type === 'order_paid';
    return true;
  });

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* 1. TOP HEADER & TELEMETRY STATUS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E8E4]">
        <div>
          <span className="text-[10px] font-semibold tracking-widest uppercase text-[#A0A09C]">
            SESSION STREAM // REALTIME TELEMETRY
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#111111]">
            Atelier Storefront Live Monitor
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[#6B6B6B] bg-white border border-[#E8E8E4] px-3 py-1.5 rounded-full shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span>Sync Node: AP-SOUTHEAST-1</span>
            <span className="text-[#A0A09C]">• 18ms</span>
          </div>

          <button
            type="button"
            onClick={() => setIsFrozen(!isFrozen)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E8E8E4] hover:bg-[#FAFAF8] rounded-full text-xs font-medium text-[#111111] transition-colors"
          >
            {isFrozen ? <Play className="w-3.5 h-3.5 text-[#10B981]" /> : <Pause className="w-3.5 h-3.5 text-[#F59E0B]" />}
            <span>{isFrozen ? 'Resume Stream' : 'Freeze Stream'}</span>
          </button>
        </div>
      </div>

      {/* 2. FIVE LIVE TELEMETRY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Active Visitors */}
        <div className="bg-white border border-[#E8E8E4] rounded-[12px] p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-[#6B6B6B]">
            <span>Active Visitors</span>
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
          </div>
          <p className="text-2xl font-serif text-[#111111]">{activeVisitors}</p>
          <div className="flex items-center justify-between text-[10px] text-[#059669]">
            <span>+14% vs 1h</span>
            <span className="text-[#6B6B6B]">72% mobile</span>
          </div>
        </div>

        {/* Open Carts */}
        <div className="bg-white border border-[#E8E8E4] rounded-[12px] p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-[#6B6B6B]">
            <span>Open Carts</span>
            <ShoppingBag className="w-3 h-3 text-[#B8912F]" />
          </div>
          <p className="text-2xl font-serif text-[#111111]">{openCarts}</p>
          <p className="text-[10px] text-[#6B6B6B] truncate">
            High intent: 9 • $3,240 (₱187k)
          </p>
        </div>

        {/* Orders Today */}
        <div className="bg-white border border-[#E8E8E4] rounded-[12px] p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-[#6B6B6B]">
            <span>Orders Today</span>
            <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
          </div>
          <p className="text-2xl font-serif text-[#111111]">{ordersToday}</p>
          <div className="flex items-center justify-between text-[10px] text-[#6B6B6B]">
            <span>Target: 40</span>
            <span className="text-[#059669] font-medium">90% met</span>
          </div>
        </div>

        {/* Gross Revenue Today */}
        <div className="bg-white border border-[#E8E8E4] rounded-[12px] p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-[#6B6B6B]">
            <span>Gross Revenue</span>
            <CreditCard className="w-3 h-3 text-[#B8912F]" />
          </div>
          <p className="text-xl font-serif text-[#111111]">
            {formatMoney(revenueTodayUSD, 'USD')}
          </p>
          <p className="text-[10px] text-[#059669]">
            ≈ {formatMoney(revenueTodayUSD * 58, 'PHP')} (+22%)
          </p>
        </div>

        {/* Live Conversion Rate */}
        <div className="bg-white border border-[#E8E8E4] rounded-[12px] p-4 space-y-1 shadow-xs col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-[#6B6B6B]">
            <span>Conversion Rate</span>
            <Activity className="w-3 h-3 text-[#10B981]" />
          </div>
          <p className="text-2xl font-serif text-[#111111]">{conversionRate}%</p>
          <p className="text-[10px] text-[#059669]">
            +0.62% vs atelier benchmark
          </p>
        </div>
      </div>

      {/* 3. STOREFRONT SPECTATOR + ACTIVITY STREAM DUAL PANE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Scaled Storefront Spectator (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E8E8E4] rounded-[12px] overflow-hidden flex flex-col shadow-xs">
          {/* Spectator Browser Chrome Header */}
          <div className="p-3 bg-[#FAFAF8] border-b border-[#E8E8E4] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />

              <div className="flex items-center gap-1 ml-2 bg-white border border-[#E8E8E4] rounded px-2.5 py-1 text-xs font-mono text-[#6B6B6B] w-64 truncate">
                <span className="text-[#059669] font-bold">●</span>
                <span className="truncate">{storefrontUrl}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Device Viewport Toggle (1440px / 390px) */}
              <div className="inline-flex bg-white border border-[#E8E8E4] rounded-full p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setViewport('desktop')}
                  className={`p-1.5 rounded-full transition-colors ${
                    viewport === 'desktop' ? 'bg-[#111111] text-white' : 'text-[#6B6B6B]'
                  }`}
                  title="Desktop View (1440px)"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewport('mobile')}
                  className={`p-1.5 rounded-full transition-colors ${
                    viewport === 'mobile' ? 'bg-[#111111] text-white' : 'text-[#6B6B6B]'
                  }`}
                  title="Mobile View (390px)"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>

              <a
                href={storefrontUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-full bg-white border border-[#E8E8E4] text-[#6B6B6B] hover:text-[#111111] transition-colors"
                title="Open Storefront in New Tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Iframe Viewport Container */}
          <div className="relative flex-1 bg-[#FAFAF8] min-h-[520px] flex items-center justify-center p-4 overflow-hidden">
            <div
              className={`transition-all duration-300 rounded border border-[#E8E8E4] shadow-md overflow-hidden bg-white ${
                viewport === 'desktop' ? 'w-full h-[520px]' : 'w-[390px] h-[520px]'
              }`}
            >
              <iframe
                src={storefrontUrl}
                title="Storefront Live Spectator"
                className="w-full h-full border-0"
              />
            </div>
          </div>

          {/* Spectator Footer Status Bar */}
          <div className="px-4 py-2.5 bg-[#FAFAF8] border-t border-[#E8E8E4] flex flex-wrap items-center justify-between text-xs text-[#6B6B6B] font-mono">
            <span>● Following: Visitor #8841 (Live DOM State)</span>
            <span>Viewport: {viewport === 'desktop' ? '1440x900' : '390x844'} • Scale: 85% Auto-fit</span>
          </div>
        </div>

        {/* Right: Live Activity Stream (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-[#E8E8E4] rounded-[12px] p-5 flex flex-col justify-between space-y-4 shadow-xs">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E4]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#111111]">
                  Activity Stream
                </h3>
              </div>
              <span className="text-[10px] text-[#A0A09C] font-mono">128 recorded / hour</span>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 py-3 border-b border-[#F0F0EC] text-[11px] font-medium overflow-x-auto scrollbar-none">
              {(['all', 'views', 'cart', 'checkout', 'paid'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setEventFilter(tab)}
                  className={`px-2.5 py-1 rounded-full uppercase tracking-wider transition-colors ${
                    eventFilter === tab
                      ? 'bg-[#111111] text-white font-semibold'
                      : 'bg-[#FAFAF8] text-[#6B6B6B] hover:text-[#111111]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Stream List */}
            <div className="space-y-3 pt-3 max-h-[420px] overflow-y-auto pr-1">
              {filteredEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-3 bg-[#FAFAF8] border border-[#E8E8E4] rounded-[8px] space-y-1.5 hover:border-[#B8912F] transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#111111] flex items-center gap-1.5">
                      {evt.type === 'order_paid' && <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />}
                      {evt.type === 'checkout_started' && <CreditCard className="w-3.5 h-3.5 text-[#B8912F]" />}
                      {evt.type === 'add_to_cart' && <ShoppingBag className="w-3.5 h-3.5 text-[#111111]" />}
                      {evt.type === 'product_view' && <Eye className="w-3.5 h-3.5 text-[#6B6B6B]" />}
                      {evt.title}
                    </span>
                    <span className="text-[10px] text-[#A0A09C] font-mono">{evt.time}</span>
                  </div>

                  <p className="text-[11px] text-[#6B6B6B] leading-tight">{evt.subtitle}</p>

                  <div className="flex items-center justify-between pt-1">
                    {evt.amountUSD ? (
                      <span className="font-mono text-[11px] font-semibold text-[#111111]">
                        {formatMoney(evt.amountUSD, 'USD')} ≈ {formatMoney(evt.amountPHP ?? evt.amountUSD * 58, 'PHP')}
                      </span>
                    ) : <span />}

                    {evt.badge && (
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded font-mono font-semibold ${
                          evt.badgeColor || 'bg-[#F0F0EC] text-[#6B6B6B]'
                        }`}
                      >
                        {evt.badge}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Global Sessions Geography Card */}
          <div className="pt-3 border-t border-[#E8E8E4] space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[#111111]">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#B8912F]" />
                Live Global Sessions
              </span>
              <span className="text-[10px] text-[#059669] font-mono">8 Currencies Active</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#6B6B6B]">
              <span className="font-semibold text-[#111111]">PH (64%)</span> •{' '}
              <span>JP (18%)</span> •{' '}
              <span>US (12%)</span> •{' '}
              <span>Other (6%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
