import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@jb06/db';
import { PriceDisplay, Badge } from '@jb06/ui';
import { SlidersHorizontal, ChevronRight, Heart } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface ShoesPageProps {
  searchParams?: Promise<{
    sub?: string;
    size?: string;
    color?: string;
    inStock?: string;
    sort?: string;
  }>;
}

export default async function ShoesCatalogPage({ searchParams }: ShoesPageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const currentSub = resolvedParams.sub || 'all';
  const currentSize = resolvedParams.size || '';

  // Query category and products
  const category = await prisma.category.findUnique({
    where: { slug: 'shoes' },
    include: { subcategories: true },
  }).catch(() => null);

  const products = await prisma.product.findMany({
    where: {
      categoryId: category?.id,
      ...(currentSub !== 'all' ? { subcategory: { slug: currentSub } } : {}),
      ...(currentSize
        ? {
            variants: {
              some: {
                size: { contains: currentSize },
                stock: { gt: 0 },
              },
            },
          }
        : {}),
    },
    include: {
      subcategory: true,
      variants: {
        orderBy: { priceUSD: 'asc' },
      },
    },
  }).catch(() => []);

  const subcategories = [
    { label: 'All Shoes', slug: 'all', count: 12 },
    { label: 'Sneakers', slug: 'sneakers', count: 5 },
    { label: 'Boots', slug: 'boots', count: 3 },
    { label: 'Loafers', slug: 'loafers', count: 2 },
    { label: 'Derbies', slug: 'derbies', count: 1 },
    { label: 'Slides & Mules', slug: 'slides-mules', count: 2 },
  ];

  const sizes = ['7.0', '7.5', '8.0', '8.5', '9.0', '9.5', '10.0', '10.5', '11.0', '11.5', '12.0', '13.0'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. TOP HEADER & EXCHANGE STANDARD */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-4 border-b border-[#E8E8E4]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-3xl font-normal text-[#111111]">
              SHOES
            </h1>
            <span className="text-xs text-[#6B6B6B] font-mono">({products.length} Items)</span>
            <span className="text-[10px] bg-[#FAF6ED] text-[#B8912F] border border-[#E8DFC8] px-2 py-0.5 rounded font-semibold uppercase">
              DROP 06 ARCHIVE
            </span>
          </div>
        </div>

        <div className="text-xs text-[#6B6B6B] font-mono">
          EXCHANGE STANDARD: <span className="font-semibold text-[#111111]">1 USD ≈ ₱58.00 PHP</span>
        </div>
      </div>

      {/* 2. SUBCATEGORY PILL FILTER BAR */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {subcategories.map((sub) => {
          const isActive = currentSub === sub.slug;
          return (
            <Link
              key={sub.slug}
              href={sub.slug === 'all' ? '/shoes' : `/shoes?sub=${sub.slug}`}
              className={`px-4 py-2 rounded-full text-xs font-medium tracking-wider whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'bg-white text-[#6B6B6B] border border-[#E8E8E4] hover:text-[#111111] hover:border-[#111111]'
              }`}
            >
              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#B8912F]" />}
              <span>{sub.label}</span>
            </Link>
          );
        })}
      </div>

      {/* 3. MAIN CATALOG GRID WITH LEFT SIDEBAR FILTERS */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar Filters */}
        <aside className="space-y-6">
          <div className="bg-white border border-[#E8E8E4] rounded-[12px] p-5 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E4]">
              <span className="text-xs font-semibold tracking-wider uppercase text-[#111111] flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Refine Gallery
              </span>
              <Link href="/shoes" className="text-[11px] text-[#6B6B6B] hover:text-[#111111] underline">
                Reset
              </Link>
            </div>

            {/* Sizing (US Men) Filter Matrix */}
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#111111]">
                Sizing (US Men)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {sizes.map((s) => {
                  const isSelected = currentSize === s;
                  return (
                    <Link
                      key={s}
                      href={isSelected ? '/shoes' : `/shoes?size=${s}`}
                      className={`text-xs py-2 text-center rounded border font-mono transition-colors ${
                        isSelected
                          ? 'bg-[#111111] text-white border-[#111111] font-semibold'
                          : 'bg-[#FAFAF8] text-[#111111] border-[#E8E8E4] hover:border-[#111111]'
                      }`}
                    >
                      {s}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Palette Colorway */}
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#111111]">
                Palette Colorway
              </label>
              <div className="space-y-2 text-xs text-[#6B6B6B]">
                <label className="flex items-center gap-2 cursor-pointer hover:text-[#111111]">
                  <input type="checkbox" defaultChecked className="rounded border-[#E8E8E4] text-[#111111] focus:ring-0" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#111111]" />
                  <span>Onyx Black</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-[#111111]">
                  <input type="checkbox" className="rounded border-[#E8E8E4] text-[#111111] focus:ring-0" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F4F4F2] border border-[#CCCCCC]" />
                  <span>Chalk White</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-[#111111]">
                  <input type="checkbox" className="rounded border-[#E8E8E4] text-[#111111] focus:ring-0" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#71716E]" />
                  <span>Slate Grey</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-[#111111]">
                  <input type="checkbox" className="rounded border-[#E8E8E4] text-[#111111] focus:ring-0" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#B8912F]" />
                  <span>Desert Tan / Ochre</span>
                </label>
              </div>
            </div>

            {/* Price Threshold Slider */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#111111]">
                Price Threshold
              </label>
              <div className="flex items-center justify-between text-[11px] text-[#6B6B6B] font-mono">
                <span>$50.00 (₱2,900)</span>
                <span>$280.00 (₱16,240)</span>
              </div>
              <input type="range" min="50" max="280" defaultValue="200" className="w-full accent-[#111111]" />
            </div>

            {/* In-Stock Only Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-[#E8E8E4]">
              <span className="text-xs font-medium text-[#111111]">In-Stock Only</span>
              <input type="checkbox" defaultChecked className="toggle-checkbox accent-[#111111]" />
            </div>
          </div>
        </aside>

        {/* 3-Column Product Grid */}
        <div className="lg:col-span-3 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => {
              const lowestVariant = p.variants[0];
              const isLowStock = p.variants.some((v) => v.stock > 0 && v.stock <= 3);
              const isOutOfStock = p.variants.every((v) => v.stock === 0);

              return (
                <Link
                  key={p.id}
                  href={`/product/${p.slug}`}
                  className="group flex flex-col bg-white border border-[#E8E8E4] rounded-[12px] overflow-hidden hover:border-[#B8912F] transition-all duration-200"
                >
                  {/* Image Container with 4:5 Aspect Ratio */}
                  <div className="relative aspect-[4/5] bg-[#F4F4F2] overflow-hidden">
                    <Image
                      src={p.images[0] || 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&q=80'}
                      alt={p.title}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Status Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      {isOutOfStock ? (
                        <Badge variant="out">OUT OF STOCK</Badge>
                      ) : isLowStock ? (
                        <Badge variant="low-stock">LOW STOCK</Badge>
                      ) : p.badge ? (
                        <Badge variant={p.badge === 'NEW' ? 'new' : p.badge === 'RESTOCK' ? 'restock' : 'limited'}>
                          {p.badge}
                        </Badge>
                      ) : null}
                    </div>

                    <button
                      type="button"
                      aria-label="Wishlist"
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 backdrop-blur-sm text-[#111111] hover:text-[#B8912F] transition-colors"
                    >
                      <Heart className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Card Details */}
                  <div className="p-4 flex flex-col flex-1 justify-between space-y-2">
                    <div>
                      <p className="text-[10px] tracking-widest uppercase text-[#6B6B6B] font-medium">
                        {p.department}
                      </p>
                      <h3 className="text-sm font-semibold text-[#111111] group-hover:text-[#B8912F] transition-colors mt-0.5">
                        {p.title}
                      </h3>
                    </div>

                    {lowestVariant && (
                      <div className="pt-2 border-t border-[#F0F0EC] flex items-baseline justify-between">
                        <PriceDisplay
                          priceUSD={lowestVariant.priceUSD}
                          pricePHP={lowestVariant.pricePHP}
                          primaryClassName="text-sm font-semibold text-[#111111]"
                          secondaryClassName="text-xs text-[#6B6B6B]"
                        />
                        <span className="text-[10px] text-[#A0A09C] font-mono">
                          US {p.variants[0]?.size.slice(3, 6)}–{p.variants[p.variants.length - 1]?.size.slice(3, 6)}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Collection Yield & Load More */}
          <div className="pt-8 border-t border-[#E8E8E4] text-center space-y-4">
            <p className="text-xs text-[#6B6B6B] uppercase tracking-widest font-mono">
              Showing {products.length} of 24 pieces
            </p>
            <div className="flex justify-center">
              <button
                type="button"
                className="px-8 py-3 bg-[#111111] text-white hover:bg-black rounded-full text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Load More (Archive Complete)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. THE JBØ6 FIT ASSURANCE BANNER */}
      <section className="bg-[#111111] text-white rounded-[12px] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 max-w-xl">
          <p className="text-[10px] uppercase tracking-widest text-[#B8912F] font-semibold">
            THE JBØ6 FIT ASSURANCE
          </p>
          <h3 className="font-serif text-xl font-normal text-white">
            Precision Silhouette Guarantee & Dual-Region Courier
          </h3>
          <p className="text-xs text-[#A0A09C]">
            Every footwear order includes a complimentary digital sizing session with our Kyoto atelier artisans. If your fit isn’t flawless, return within 30 days via prepaid regional DHL Express or domestic J&T in the Philippines.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            className="px-5 py-2.5 bg-white text-[#111111] rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#FAFAF8] transition-colors shrink-0"
          >
            Schedule Fit Consultation
          </button>
        </div>
      </section>
    </div>
  );
}
