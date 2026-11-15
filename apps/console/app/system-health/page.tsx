'use client';

import React, { useState } from 'react';
import { useConsoleAuth } from '@/lib/auth-context';
import {
  ShieldAlert,
  Lock,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Server,
  Zap,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Badge, Button } from '@jb06/ui';

export default function SystemHealthPage() {
  const { role, canAccessDevTools } = useConsoleAuth();
  const [retryingId, setRetryingId] = useState<string | null>(null);

  const [webhookLogs, setWebhookLogs] = useState([
    {
      id: 'wh-1042',
      gateway: 'PAYMONGO (GCash)',
      event: 'checkout.session.payment.paid',
      orderNumber: 1042,
      status: 'DELIVERED',
      time: '14 mins ago',
      responseCode: 200,
    },
    {
      id: 'wh-1041',
      gateway: 'PAYPAL',
      event: 'PAYMENT.CAPTURE.COMPLETED',
      orderNumber: 1041,
      status: 'DELIVERED',
      time: '48 mins ago',
      responseCode: 200,
    },
    {
      id: 'wh-1038',
      gateway: 'PAYMONGO (GCash)',
      event: 'checkout.session.payment.paid',
      orderNumber: 1038,
      status: 'DELIVERED',
      time: '7 hours ago',
      responseCode: 200,
    },
  ]);

  if (!canAccessDevTools) {
    return (
      <div className="p-8 max-w-2xl mx-auto my-16 text-center bg-white border border-[#E8E8E4] rounded-[12px] p-10 space-y-4 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center mx-auto border border-[#FECACA]">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-2xl text-[#111111]">403 Access Restricted</h2>
        <p className="text-xs text-[#6B6B6B] leading-relaxed">
          System Health, low-level API telemetry, and webhook replay capabilities require the <strong>DEVELOPER</strong> role. You are currently viewing as <strong>{role}</strong>.
        </p>
        <p className="text-[11px] text-[#A0A09C]">
          Use the "Switch Role" toggle at the bottom of the sidebar to test access rights.
        </p>
      </div>
    );
  }

  const handleRetryWebhook = (id: string) => {
    setRetryingId(id);
    setTimeout(() => {
      setRetryingId(null);
      alert(`Webhook event ${id} successfully replayed to /api/webhooks/paymongo (HTTP 200 OK)`);
    }, 1200);
  };

  const services = [
    { name: 'Supabase Postgres', type: 'Database (aws-1-ap-northeast-1)', status: 'OPERATIONAL', latency: '18ms', icon: Server },
    { name: 'Supabase Realtime', type: 'WebSockets Broadcast (live-monitor)', status: 'OPERATIONAL', latency: '22ms', icon: Zap },
    { name: 'PayMongo GCash Gateway', type: 'Checkout Sessions API', status: 'OPERATIONAL', latency: '64ms', icon: CheckCircle2 },
    { name: 'PayPal Sandbox Gateway', type: 'Orders API v2', status: 'OPERATIONAL', latency: '85ms', icon: CheckCircle2 },
  ];

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E8E4]">
        <div>
          <span className="text-[10px] font-semibold tracking-widest uppercase text-[#B8912F]">
            DEVELOPER SECURITY ZONE // INFRASTRUCTURE TELEMETRY
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#111111]">
            System Health & Gateway Status
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] px-3 py-1.5 rounded-full font-mono font-semibold flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            ALL SYSTEMS NOMINAL
          </span>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {services.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="bg-white border border-[#E8E8E4] rounded-[12px] p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <Icon className="w-5 h-5 text-[#B8912F]" />
                <Badge variant="in-stock">{s.status}</Badge>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#111111]">{s.name}</h4>
                <p className="text-[11px] text-[#6B6B6B]">{s.type}</p>
              </div>
              <div className="pt-2 border-t border-[#F0F0EC] flex items-center justify-between text-xs font-mono text-[#6B6B6B]">
                <span>Roundtrip Latency:</span>
                <span className="font-semibold text-[#111111]">{s.latency}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Webhook Delivery & Replay Ledger */}
      <div className="bg-white border border-[#E8E8E4] rounded-[12px] p-6 space-y-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E4]">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#111111]">
              Webhook Event Ledger & Replay Engine
            </h3>
            <p className="text-[11px] text-[#6B6B6B]">Idempotent verification logs for GCash (PayMongo) and PayPal</p>
          </div>
          <span className="text-xs text-[#059669] font-mono">0 Failed Events</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFAF8] border-b border-[#E8E8E4] text-[10px] uppercase tracking-widest text-[#6B6B6B] font-semibold">
              <tr>
                <th className="py-2.5 px-3">Event ID</th>
                <th className="py-2.5 px-3">Gateway</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Order #</th>
                <th className="py-2.5 px-3">Timeline</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-center">Replay Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F0EC]">
              {webhookLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#FAFAF8]">
                  <td className="py-3 px-3 font-mono font-semibold text-[#111111]">{log.id}</td>
                  <td className="py-3 px-3">{log.gateway}</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-[#6B6B6B]">{log.event}</td>
                  <td className="py-3 px-3 font-mono font-bold text-[#111111]">#{log.orderNumber}</td>
                  <td className="py-3 px-3 text-[#6B6B6B]">{log.time}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="text-[10px] bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] px-2 py-0.5 rounded font-mono font-semibold">
                      HTTP {log.responseCode}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      type="button"
                      disabled={retryingId === log.id}
                      onClick={() => handleRetryWebhook(log.id)}
                      className="px-2.5 py-1 bg-white border border-[#E8E8E4] hover:border-[#111111] text-[#111111] rounded text-[11px] font-semibold transition-colors flex items-center gap-1 mx-auto"
                    >
                      <RotateCw className={`w-3 h-3 ${retryingId === log.id ? 'animate-spin' : ''}`} />
                      <span>{retryingId === log.id ? 'Replaying...' : 'Replay'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
