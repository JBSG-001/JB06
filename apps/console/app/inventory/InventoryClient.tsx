'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Variant, Product, Category, Subcategory } from '@jb06/db';
import { formatMoney, Badge, Button, Input, Drawer } from '@jb06/ui';
import {
  Search,
  SlidersHorizontal,
  Download,
  Plus,
  Edit2,
  AlertTriangle,
  Upload,
  Check,
  RefreshCw,
} from 'lucide-react';

interface ExtendedVariant extends Variant {
  product: Product & {
    category: Category;
    subcategory: Subcategory;
  };
}

interface InventoryClientProps {
  initialVariants: ExtendedVariant[];
  totalSkus: number;
  totalUnits: number;
  totalValueUSD: number;
  lowStockCount: number;
}

export const InventoryClient: React.FC<InventoryClientProps> = ({
  initialVariants,
  totalSkus,
  totalUnits,
  totalValueUSD,
  lowStockCount,
}) => {
  const [variants, setVariants] = useState<ExtendedVariant[]>(initialVariants);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'shoes' | 'clothes'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'in-stock' | 'low-stock' | 'out'>('all');

  // Selected variant for Inspector Drawer
  const [selectedVariant, setSelectedVariant] = useState<ExtendedVariant | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Drawer Form State
  const [drawerUSD, setDrawerUSD] = useState(0);
  const [drawerPHP, setDrawerPHP] = useState<number | null>(null);
  const [isOverride, setIsOverride] = useState(false);
  const [adjustAmount, setAdjustAmount] = useState(0);
  const [adjustReason, setAdjustReason] = useState('');
  const [reorderThreshold, setReorderThreshold] = useState(5);
  const [isSaving, setIsSaving] = useState(false);

  const openInspector = (v: ExtendedVariant) => {
    setSelectedVariant(v);
    setDrawerUSD(v.priceUSD / 100);
    setDrawerPHP(v.pricePHP ? v.pricePHP / 100 : null);
    setIsOverride(v.pricePHP !== null);
    setAdjustAmount(0);
    setAdjustReason('Restock arrival from Kyoto Atelier PO #804 via DHL Express air freight batch A-12.');
    setReorderThreshold(v.reorderLevel);
    setIsDrawerOpen(true);
  };

  const handleQuickAdjustStock = (variantId: string, delta: number) => {
    setVariants((prev) =>
      prev.map((v) => {
        if (v.id === variantId) {
          const nextStock = Math.max(0, v.stock + delta);
          return { ...v, stock: nextStock };
        }
        return v;
      })
    );
  };

  const handleSaveDrawer = async () => {
    if (!selectedVariant) return;
    setIsSaving(true);

    try {
      const res = await fetch('/api/inventory/update-variant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantId: selectedVariant.id,
          priceUSD: Math.round(drawerUSD * 100),
          pricePHP: isOverride && drawerPHP ? Math.round(drawerPHP * 100) : null,
          adjustStockDelta: adjustAmount,
          reason: adjustReason,
          reorderLevel: reorderThreshold,
        }),
      });

      if (!res.ok) throw new Error('Failed to update variant');

      // Update local state
      setVariants((prev) =>
        prev.map((v) => {
          if (v.id === selectedVariant.id) {
            return {
              ...v,
              stock: Math.max(0, v.stock + adjustAmount),
              priceUSD: Math.round(drawerUSD * 100),
              pricePHP: isOverride && drawerPHP ? Math.round(drawerPHP * 100) : null,
              reorderLevel: reorderThreshold,
            };
          }
          return v;
        })
      );

      setIsDrawerOpen(false);
    } catch (err: any) {
      alert(err.message || 'Error updating variant');
    } finally {
      setIsSaving(false);
    }
  };

  // Filtered variants
  const filtered = variants.filter((v) => {
    const matchesSearch =
      v.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.product.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat =
      categoryFilter === 'all' || v.product.category.slug === categoryFilter;

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'in-stock' && v.stock > v.reorderLevel) ||
      (statusFilter === 'low-stock' && v.stock > 0 && v.stock <= v.reorderLevel) ||
      (statusFilter === 'out' && v.stock === 0);

    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* 1. TOP HEADER & METRICS BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E8E4]">
        <div>
          <span className="text-[10px] font-semibold tracking-widest uppercase text-[#A0A09C]">
            ARCHIVE INDEX // VAULT 06
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#111111]">
            Archival & Core Inventory
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="bg-white border border-[#E8E8E4] px-3.5 py-1.5 rounded-full font-mono shadow-xs">
            TOTAL SKUS: <strong>{totalSkus}</strong>
          </div>
          <div className="bg-white border border-[#E8E8E4] px-3.5 py-1.5 rounded-full font-mono shadow-xs">
            UNITS ON HAND: <strong>{totalUnits.toLocaleString()}</strong>
          </div>
          <div className="bg-white border border-[#E8E8E4] px-3.5 py-1.5 rounded-full font-mono shadow-xs">
            STOCK VALUE: <strong>{formatMoney(totalValueUSD, 'USD')}</strong>
          </div>
          <div className="bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A] px-3.5 py-1.5 rounded-full font-mono font-semibold">
            ⚠️ LOW STOCK ALERTS: {lowStockCount}
          </div>
        </div>
      </div>

      {/* 2. SEARCH, CATEGORY TABS & ACTION BUTTONS */}
      <div className="bg-white border border-[#E8E8E4] rounded-[12px] p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#A0A09C]" />
          <input
            type="text"
            placeholder="Filter by SKU, product name, or barcode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-4 py-2 text-xs bg-[#FAFAF8] border border-[#E8E8E4] rounded-full text-[#111111] placeholder:text-[#A0A09C] focus:outline-none focus:border-[#111111]"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 bg-[#FAFAF8] p-1 rounded-full border border-[#E8E8E4] text-xs font-medium">
          <button
            type="button"
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1 rounded-full transition-colors ${
              categoryFilter === 'all' ? 'bg-[#111111] text-white' : 'text-[#6B6B6B] hover:text-[#111111]'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter('shoes')}
            className={`px-3 py-1 rounded-full transition-colors ${
              categoryFilter === 'shoes' ? 'bg-[#111111] text-white' : 'text-[#6B6B6B] hover:text-[#111111]'
            }`}
          >
            Shoes (12)
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter('clothes')}
            className={`px-3 py-1 rounded-full transition-colors ${
              categoryFilter === 'clothes' ? 'bg-[#111111] text-white' : 'text-[#6B6B6B] hover:text-[#111111]'
            }`}
          >
            Clothes (12)
          </button>
        </div>

        {/* Status Filters & Actions */}
        <div className="flex items-center gap-2">
          <div className="inline-flex bg-[#FAFAF8] border border-[#E8E8E4] rounded-full p-0.5 text-xs">
            {(['all', 'in-stock', 'low-stock', 'out'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 rounded-full uppercase tracking-wider text-[10px] font-semibold transition-colors ${
                  statusFilter === s ? 'bg-[#111111] text-white' : 'text-[#6B6B6B]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111111] text-white hover:bg-black rounded-full text-xs font-semibold uppercase tracking-wider transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Drop</span>
          </button>
        </div>
      </div>

      {/* 3. INVENTORY DATA TABLE */}
      <div className="bg-white border border-[#E8E8E4] rounded-[12px] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFAF8] border-b border-[#E8E8E4] text-[10px] uppercase tracking-widest text-[#6B6B6B] font-semibold">
              <tr>
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">SKU Identifier</th>
                <th className="py-3 px-4">Product Name & Dept</th>
                <th className="py-3 px-4">Variant Spec</th>
                <th className="py-3 px-4 text-center">On Hand</th>
                <th className="py-3 px-4 text-center">Reserved</th>
                <th className="py-3 px-4 text-center">Reorder</th>
                <th className="py-3 px-4 text-right">USD Base</th>
                <th className="py-3 px-4 text-right">PHP Spot</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F0EC]">
              {filtered.map((v) => {
                const isLow = v.stock > 0 && v.stock <= v.reorderLevel;
                const isOut = v.stock === 0;

                return (
                  <tr key={v.id} className="hover:bg-[#FAFAF8] transition-colors">
                    {/* Item Thumbnail */}
                    <td className="py-3 px-4">
                      <div className="relative w-10 aspect-[4/5] bg-[#F4F4F2] rounded overflow-hidden border border-[#E8E8E4]">
                        <Image src={v.product.images[0]} alt={v.product.title} fill className="object-cover" />
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="py-3 px-4 font-mono font-semibold text-[#111111]">
                      {v.sku}
                    </td>

                    {/* Product Name & Dept */}
                    <td className="py-3 px-4">
                      <p className="font-semibold text-[#111111]">{v.product.title}</p>
                      <p className="text-[10px] text-[#6B6B6B] uppercase font-mono">{v.product.department}</p>
                    </td>

                    {/* Variant Spec */}
                    <td className="py-3 px-4 text-[#6B6B6B]">
                      {v.size} / {v.color}
                    </td>

                    {/* On Hand with Inline Stepper */}
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center border border-[#E8E8E4] rounded-full bg-white text-xs">
                        <button
                          type="button"
                          onClick={() => handleQuickAdjustStock(v.id, -1)}
                          className="w-5 h-5 flex items-center justify-center hover:bg-[#E8E8E4] rounded-l-full text-[#6B6B6B]"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-mono font-bold text-[#111111]">
                          {v.stock}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQuickAdjustStock(v.id, 1)}
                          className="w-5 h-5 flex items-center justify-center hover:bg-[#E8E8E4] rounded-r-full text-[#6B6B6B]"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* Reserved */}
                    <td className="py-3 px-4 text-center font-mono text-[#6B6B6B]">
                      {v.reserved}
                    </td>

                    {/* Reorder Floor */}
                    <td className="py-3 px-4 text-center font-mono text-[#6B6B6B]">
                      {v.reorderLevel}
                    </td>

                    {/* USD Base */}
                    <td className="py-3 px-4 text-right font-mono font-semibold text-[#111111]">
                      {formatMoney(v.priceUSD, 'USD')}
                    </td>

                    {/* PHP Spot with Auto vs Manual Badge */}
                    <td className="py-3 px-4 text-right font-mono">
                      <p className="font-semibold text-[#111111]">
                        {formatMoney(v.pricePHP ?? Math.round(v.priceUSD * 58), 'PHP')}
                      </p>
                      <span className="text-[9px] text-[#6B6B6B]">
                        {v.pricePHP ? 'MANUAL OVERRIDE' : 'AUTO @ ₱58'}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4 text-center">
                      {isOut ? (
                        <Badge variant="out">OUT OF STOCK</Badge>
                      ) : isLow ? (
                        <Badge variant="low-stock">LOW STOCK ({v.stock})</Badge>
                      ) : (
                        <Badge variant="in-stock">IN STOCK</Badge>
                      )}
                    </td>

                    {/* Edit Drawer Trigger */}
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => openInspector(v)}
                        className="p-1.5 rounded-full hover:bg-[#E8E8E4] text-[#111111] transition-colors"
                        title="Open Variant Inspector Drawer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. ACTIVE VARIANT INSPECTOR DRAWER (SLIDE-OVER MATCHING IMAGE 7) */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="ACTIVE VARIANT INSPECTOR"
        subtitle={selectedVariant?.product.title}
        width="lg"
      >
        {selectedVariant && (
          <div className="space-y-6">
            {/* Header Card with Thumbnail & SKU */}
            <div className="flex items-center gap-4 p-4 bg-[#FAFAF8] border border-[#E8E8E4] rounded-[8px]">
              <div className="relative w-16 aspect-[4/5] bg-white rounded overflow-hidden border border-[#E8E8E4]">
                <Image src={selectedVariant.product.images[0]} alt={selectedVariant.product.title} fill className="object-cover" />
              </div>
              <div className="space-y-1">
                <p className="font-mono text-xs font-semibold text-[#111111]">{selectedVariant.sku}</p>
                <p className="text-xs text-[#6B6B6B]">{selectedVariant.size} • {selectedVariant.color}</p>
                <label className="inline-flex items-center gap-1.5 text-xs text-[#B8912F] hover:underline cursor-pointer">
                  <Upload className="w-3 h-3" />
                  <span>Replace Image (Supabase Storage product-images)</span>
                  <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" />
                </label>
              </div>
            </div>

            {/* DUAL PRICING ENGINE */}
            <div className="bg-white border border-[#E8E8E4] rounded-[8px] p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#E8E8E4]">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#111111]">
                  Dual Pricing Engine
                </span>
                <div className="flex items-center gap-2 text-xs">
                  <span className={!isOverride ? 'font-semibold text-[#111111]' : 'text-[#6B6B6B]'}>Auto (1:58)</span>
                  <input
                    type="checkbox"
                    checked={isOverride}
                    onChange={(e) => {
                      setIsOverride(e.target.checked);
                      if (!e.target.checked) setDrawerPHP(null);
                      else setDrawerPHP(Math.round(drawerUSD * 58));
                    }}
                    className="accent-[#B8912F]"
                  />
                  <span className={isOverride ? 'font-semibold text-[#B8912F]' : 'text-[#6B6B6B]'}>Override</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="USD Base Price ($)"
                  type="number"
                  step="0.01"
                  value={drawerUSD}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    setDrawerUSD(val);
                    if (!isOverride) setDrawerPHP(Math.round(val * 58));
                  }}
                />
                <Input
                  label="PHP Price (₱)"
                  type="number"
                  step="1"
                  disabled={!isOverride}
                  value={drawerPHP !== null ? drawerPHP : Math.round(drawerUSD * 58)}
                  onChange={(e) => setDrawerPHP(parseFloat(e.target.value) || 0)}
                  helperText={!isOverride ? 'Calculated automatically at ₱58/USD' : 'Manual override active'}
                />
              </div>
            </div>

            {/* INVENTORY ADJUSTMENT & AUDIT NOTE */}
            <div className="bg-white border border-[#E8E8E4] rounded-[8px] p-5 space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#111111]">
                Inventory Adjustment
              </span>

              <div className="grid grid-cols-3 gap-3 text-center p-3 bg-[#FAFAF8] rounded border border-[#E8E8E4]">
                <div>
                  <p className="text-[10px] text-[#6B6B6B] uppercase">Current</p>
                  <p className="font-mono text-base font-bold text-[#111111]">{selectedVariant.stock}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#6B6B6B] uppercase">Reserved</p>
                  <p className="font-mono text-base font-bold text-[#D97706]">{selectedVariant.reserved}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#6B6B6B] uppercase">Available</p>
                  <p className="font-mono text-base font-bold text-[#059669]">
                    {Math.max(0, selectedVariant.stock - selectedVariant.reserved)}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#111111] uppercase">Quick Adjust Amount (+/-)</label>
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center border border-[#E8E8E4] rounded-full bg-[#FAFAF8]">
                    <button
                      type="button"
                      onClick={() => setAdjustAmount((prev) => prev - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-[#E8E8E4] rounded-l-full"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={adjustAmount}
                      onChange={(e) => setAdjustAmount(parseInt(e.target.value, 10) || 0)}
                      className="w-16 text-center font-mono font-bold text-xs bg-transparent focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setAdjustAmount((prev) => prev + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-[#E8E8E4] rounded-r-full"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-[#6B6B6B] font-mono">
                    New Total: <strong>{Math.max(0, selectedVariant.stock + adjustAmount)}</strong>
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#111111] uppercase">Audit Adjustment Reason / PO Note</label>
                <textarea
                  rows={3}
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full text-xs p-3 bg-[#FAFAF8] border border-[#E8E8E4] rounded-[8px] focus:outline-none focus:border-[#111111]"
                />
              </div>
            </div>

            {/* LOW STOCK TRIGGER */}
            <div className="bg-white border border-[#E8E8E4] rounded-[8px] p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#111111]">
                  Low Stock Threshold Trigger
                </span>
                <span className="font-mono text-xs font-bold text-[#111111]">{reorderThreshold} Units</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                value={reorderThreshold}
                onChange={(e) => setReorderThreshold(parseInt(e.target.value, 10))}
                className="w-full accent-[#B8912F]"
              />
              <p className="text-[11px] text-[#6B6B6B]">
                Triggers visual warning in top metrics and low-stock procurement table when available stock dips to or below this count.
              </p>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8E8E4]">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="px-5 py-2.5 bg-white border border-[#E8E8E4] hover:bg-[#FAFAF8] text-[#111111] text-xs font-semibold rounded-full transition-colors"
              >
                Cancel
              </button>
              <Button
                type="button"
                variant="primary"
                isLoading={isSaving}
                onClick={handleSaveDrawer}
                className="text-xs font-semibold uppercase tracking-wider px-6 py-2.5"
              >
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
