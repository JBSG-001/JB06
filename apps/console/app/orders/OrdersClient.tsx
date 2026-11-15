'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Order, Customer, OrderItem, Product, Variant } from '@jb06/db';
import { formatMoney, Badge, Button, Drawer } from '@jb06/ui';
import {
  Search,
  Download,
  Printer,
  Package,
  RotateCcw,
  CheckCircle2,
  Clock,
  Truck,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface ExtendedOrder extends Order {
  customer: Customer;
  items: (OrderItem & {
    product: Product;
    variant: Variant;
  })[];
}

interface OrdersClientProps {
  initialOrders: ExtendedOrder[];
}

export const OrdersClient: React.FC<OrdersClientProps> = ({ initialOrders }) => {
  const [orders, setOrders] = useState<ExtendedOrder[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<ExtendedOrder | null>(initialOrders[0] || null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [statusTab, setStatusTab] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const openDrawer = (order: ExtendedOrder) => {
    setSelectedOrder(order);
    setIsDrawerOpen(true);
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedOrder) return;
    setIsProcessing(true);

    try {
      const res = await fetch('/api/orders/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          status: newStatus,
        }),
      });

      if (!res.ok) throw new Error('Failed to update status');

      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrder.id ? { ...o, status: newStatus as any } : o))
      );
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus as any } : null));
    } catch (err: any) {
      alert(err.message || 'Status update failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleIssueRefund = async () => {
    if (!selectedOrder) return;
    if (!confirm(`Are you sure you want to issue a full refund for Order #${selectedOrder.orderNumber}?`)) return;

    setIsProcessing(true);
    try {
      const res = await fetch('/api/orders/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          reason: 'Customer requested return authorized by atelier staff',
        }),
      });

      if (!res.ok) throw new Error('Refund failed');

      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrder.id ? { ...o, status: 'REFUNDED' as any } : o))
      );
      setSelectedOrder((prev) => (prev ? { ...prev, status: 'REFUNDED' as any } : null));
      alert(`Refund issued successfully for Order #${selectedOrder.orderNumber}`);
    } catch (err: any) {
      alert(err.message || 'Refund failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const statusTabs = [
    { label: 'All Orders', key: 'ALL', count: orders.length },
    { label: 'New Awaiting', key: 'PAID', count: orders.filter((o) => o.status === 'PAID').length },
    { label: 'Packed', key: 'PACKED', count: orders.filter((o) => o.status === 'PACKED').length },
    { label: 'Shipped', key: 'SHIPPED', count: orders.filter((o) => o.status === 'SHIPPED').length },
    { label: 'Delivered', key: 'DELIVERED', count: orders.filter((o) => o.status === 'DELIVERED').length },
    { label: 'Refunded', key: 'REFUNDED', count: orders.filter((o) => o.status === 'REFUNDED').length },
  ];

  const filtered = orders.filter((o) => {
    const matchesTab = statusTab === 'ALL' || o.status === statusTab;
    const matchesSearch =
      String(o.orderNumber).includes(searchTerm) ||
      o.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer.email.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* 1. HEADER & CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E8E4]">
        <div>
          <span className="text-[10px] font-semibold tracking-widest uppercase text-[#A0A09C]">
            OPERATIONS CONSOLE // FULFILLMENT & COMMERCE
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#111111]">
            Customer Orders
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-[#E8E8E4] hover:bg-[#FAFAF8] rounded-full text-xs font-medium text-[#111111] transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Manifest</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#111111] text-white hover:bg-black rounded-full text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Batch Label Gen</span>
          </button>
        </div>
      </div>

      {/* 2. STATUS TABS & SEARCH BAR */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatusTab(tab.key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                statusTab === tab.key
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'bg-white border border-[#E8E8E4] text-[#6B6B6B] hover:text-[#111111]'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  statusTab === tab.key ? 'bg-white/20 text-white' : 'bg-[#F0F0EC] text-[#111111]'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="bg-white border border-[#E8E8E4] rounded-[12px] p-3.5 flex items-center gap-3 shadow-xs">
          <Search className="w-4 h-4 text-[#A0A09C]" />
          <input
            type="text"
            placeholder="Search by order #, client name, email, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs bg-transparent focus:outline-none text-[#111111] placeholder:text-[#A0A09C]"
          />
        </div>
      </div>

      {/* 3. ORDERS QUEUE LEDGER TABLE */}
      <div className="bg-white border border-[#E8E8E4] rounded-[12px] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFAF8] border-b border-[#E8E8E4] text-[10px] uppercase tracking-widest text-[#6B6B6B] font-semibold">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Timeline</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Cart Summary</th>
                <th className="py-3 px-4 text-right">Total Price</th>
                <th className="py-3 px-4 text-center">Payment</th>
                <th className="py-3 px-4 text-center">Fulfillment</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F0EC]">
              {filtered.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => openDrawer(order)}
                  className="hover:bg-[#FAF6ED]/50 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-[#111111]">
                    #{order.orderNumber}
                  </td>
                  <td className="py-3.5 px-4 text-[#6B6B6B]">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-[#111111]">{order.customer.name}</p>
                    <p className="text-[11px] text-[#6B6B6B]">{order.customer.city || 'Makati City'}, {order.customer.country}</p>
                  </td>
                  <td className="py-3.5 px-4 text-[#6B6B6B]">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                    {order.items[0] && `: ${order.items[0].product.title}`}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono">
                    <p className="font-semibold text-[#111111]">
                      {formatMoney(order.totalUSD, 'USD')}
                    </p>
                    <p className="text-[10px] text-[#6B6B6B]">
                      ≈ {formatMoney(order.totalPHP, 'PHP')}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                        order.paymentMethod === 'GCASH'
                          ? 'bg-[#FAF6ED] text-[#B8912F] border border-[#E8DFC8]'
                          : 'bg-[#F0F0EC] text-[#111111]'
                      }`}
                    >
                      {order.paymentMethod === 'GCASH' ? 'GCash PHP' : 'PayPal USD'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <Badge
                      variant={
                        order.status === 'DELIVERED'
                          ? 'in-stock'
                          : order.status === 'PAID'
                          ? 'new'
                          : order.status === 'PACKED' || order.status === 'SHIPPED'
                          ? 'default'
                          : order.status === 'REFUNDED'
                          ? 'out'
                          : 'low-stock'
                      }
                    >
                      {order.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDrawer(order);
                      }}
                      className="p-1 rounded hover:bg-[#E8E8E4] text-[#111111]"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. ORDER DETAIL DRAWER (MATCHING STITCH IMAGE 8) */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedOrder ? `Order #${selectedOrder.orderNumber}` : 'Order Dossier'}
        subtitle={selectedOrder ? `Ref: JB-PH-2026-${selectedOrder.orderNumber}` : ''}
        width="lg"
      >
        {selectedOrder && (
          <div className="space-y-6 text-xs">
            {/* PAYMENT SETTLEMENT BANNER */}
            <div className="p-4 bg-[#FAF6ED] border border-[#E8DFC8] rounded-[8px] flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-semibold text-[#B8912F]">Payment Settlement</p>
                <p className="text-base font-bold text-[#111111] font-mono">
                  {selectedOrder.chargedCurrency === 'PHP'
                    ? formatMoney(selectedOrder.totalPHP, 'PHP')
                    : formatMoney(selectedOrder.totalUSD, 'USD')}
                </p>
                <p className="text-[11px] text-[#6B6B6B]">
                  Equiv. {selectedOrder.chargedCurrency === 'PHP' ? formatMoney(selectedOrder.totalUSD, 'USD') : formatMoney(selectedOrder.totalPHP, 'PHP')}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] px-2 py-0.5 rounded font-mono font-semibold">
                  ✓ {selectedOrder.paymentMethod} Verified
                </span>
                <p className="text-[11px] text-[#6B6B6B] mt-1">Status: {selectedOrder.status}</p>
              </div>
            </div>

            {/* CUSTOMER DOSSIER */}
            <div className="bg-white border border-[#E8E8E4] rounded-[8px] p-4 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-[#E8E8E4]">
                <span className="font-semibold uppercase tracking-wider text-[#111111]">
                  Customer Dossier
                </span>
                <span className="text-[10px] text-[#B8912F] font-mono font-semibold">
                  {selectedOrder.customer.tier}
                </span>
              </div>
              <p className="font-bold text-[#111111] text-sm">{selectedOrder.customer.name}</p>
              <p className="text-[#6B6B6B]">{selectedOrder.customer.email}</p>
              <p className="text-[#6B6B6B]">{selectedOrder.customer.phone || '+63 917 555 0192'}</p>
              <p className="text-[#6B6B6B] pt-1">{selectedOrder.customer.address}, {selectedOrder.customer.city || 'Makati City'}</p>
            </div>

            {/* ORDERED MERCHANDISE */}
            <div className="bg-white border border-[#E8E8E4] rounded-[8px] p-4 space-y-3">
              <span className="font-semibold uppercase tracking-wider text-[#111111]">
                Ordered Merchandise ({selectedOrder.items.length})
              </span>
              <div className="space-y-3 divide-y divide-[#F0F0EC]">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 aspect-[4/5] bg-[#F4F4F2] rounded overflow-hidden border border-[#E8E8E4]">
                        <Image src={item.product.images[0]} alt={item.product.title} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#111111]">{item.product.title}</p>
                        <p className="text-[11px] text-[#6B6B6B]">{item.variant.size} • Qty {item.quantity}</p>
                        <p className="text-[10px] text-[#A0A09C] font-mono">SKU: {item.variant.sku}</p>
                      </div>
                    </div>
                    <span className="font-mono font-semibold text-[#111111]">
                      {formatMoney(item.totalUSD, 'USD')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* FULFILLMENT AUDIT TRAIL */}
            <div className="bg-white border border-[#E8E8E4] rounded-[8px] p-4 space-y-3">
              <span className="font-semibold uppercase tracking-wider text-[#111111]">
                Fulfillment Audit Trail
              </span>
              <div className="space-y-2 border-l-2 border-[#E8DFC8] pl-3">
                <div>
                  <p className="font-semibold text-[#111111]">Payment verified via {selectedOrder.paymentMethod} webhook</p>
                  <p className="text-[11px] text-[#6B6B6B]">Confirmed settlement • 14 mins ago</p>
                </div>
                <div>
                  <p className="font-semibold text-[#111111]">Inventory reserved (Atelier Hub)</p>
                  <p className="text-[11px] text-[#6B6B6B]">Stock auto-deducted • 15 mins ago</p>
                </div>
                <div>
                  <p className="font-semibold text-[#111111]">Order initiated</p>
                  <p className="text-[11px] text-[#6B6B6B]">Online checkout session completed</p>
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="space-y-2 pt-2">
              <Button
                variant="primary"
                fullWidth
                onClick={() => alert(`Courier shipping label generated for DHL/J&T Air: #JB-PH-${selectedOrder.orderNumber}`)}
                className="py-3 text-xs uppercase tracking-wider font-semibold"
              >
                Print Courier Shipping Label (DHL / J&T)
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  isLoading={isProcessing}
                  onClick={() => handleUpdateStatus('PACKED')}
                >
                  Mark as Packed
                </Button>
                <Button
                  variant="danger"
                  isLoading={isProcessing}
                  onClick={handleIssueRefund}
                >
                  Issue Refund
                </Button>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
