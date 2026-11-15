import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@jb06/db';
import { PriceDisplay, Badge } from '@jb06/ui';
import { ArrowRight, Play } from 'lucide-react';

export const revalidate = 60; // ISR cache 60s

export default async function HomePage() {
  // Fetch featured products from database
  const featuredProducts = await prisma.product.findMany({
    where: { isFeatured: true },
    include: {
      variants: {
        orderBy: { priceUSD: 'asc' },
        take: 1,
      },
    },
    take: 4,
  }).catch((err) => {
    console.error('Failed to query products for home page:', err);
    return [];
  });

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[620px] md:min-h-[720px] flex items-end justify-between bg-[#1A1A18] text-white px-6 sm:px-10 lg:px-16 py-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1800&q=85"
            alt="Sculpted Silhouette FW24"
            fill
            priority
            className="object-cover object-top opacity-70 filter brightness-[0.75] contrast-[1.1]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-2xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/15 text-[11px] font-medium tracking-widest uppercase text-[#E8DFC8]">
            <span>FW24 COLLECTION ARCHIVES // URBAN ESSENTIALS</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-tight">
            Sculpted Silhouette
          </h1>

          <p className="text-sm sm:text-base text-[#D0D0CA] font-light leading-relaxed max-w-xl">
            Streamlined silhouettes engineered with Japanese raw textiles and minor hand-finished hardware. Drop 06 now live in limited numbered edition.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/shoes"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#111111] hover:bg-[#FAFAF8] rounded-full text-xs font-semibold uppercase tracking-wider transition-all shadow-md active:scale-95"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <button
              type="button"
              className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full text-xs font-medium uppercase tracking-wider border border-white/20 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Watch Runway</span>
            </button>
          </div>

          <p className="text-[11px] text-[#A0A09C] pt-1">
            Tokyo Runway Presentation • Runtime 4:15
          </p>
        </div>

        {/* Edition Corner Badge */}
        <div className="relative z-10 hidden lg:block text-right text-xs text-[#D0D0CA] space-y-1 font-mono">
          <p className="text-[10px] tracking-widest uppercase text-[#B8912F] font-semibold">EDITION JB-06</p>
          <p className="font-semibold text-white">N° 01 — 50 AVAILABLE</p>
          <p className="text-[11px] text-[#A0A09C]">Kyoto Mill Wool / Heavy Cotton Poplin</p>
        </div>
      </section>

      {/* 2. VALUE PROPOSITIONS BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-white border border-[#E8E8E4] rounded-[12px] shadow-xs">
          <div className="space-y-1">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-[#111111]">Curated Atelier</h4>
            <p className="text-xs text-[#6B6B6B]">Hand-finished Japanese raw textiles</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-[#111111]">Numbered Archive</h4>
            <p className="text-xs text-[#6B6B6B]">Strictly limited to 50 of each piece</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-[#111111]">Priority Dispatch</h4>
            <p className="text-xs text-[#6B6B6B]">Complimentary over $100 / ₱5,800</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-[#111111]">Curated Exchanges</h4>
            <p className="text-xs text-[#6B6B6B]">30-day effortless size reservation</p>
          </div>
        </div>
      </section>

      {/* 3. CAPSULE COLLECTION (Seasonal Selection / New Arrivals) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-[#E8E8E4]">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#B8912F]">
              CAPSULE SELECTION
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#111111] font-normal mt-1">
              Seasonal Selection / New Arrivals
            </h2>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-[#059669]">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              Real-time inventory active
            </span>
            <Link
              href="/shoes"
              className="text-[#111111] hover:text-[#B8912F] flex items-center gap-1 uppercase tracking-wider transition-colors"
            >
              <span>View All (24)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((p) => {
            const v = p.variants[0];
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
                  {p.badge && (
                    <div className="absolute top-3 left-3">
                      <Badge variant={p.badge === 'NEW' ? 'new' : p.badge === 'LOW STOCK' ? 'low-stock' : 'atelier'}>
                        {p.badge}
                      </Badge>
                    </div>
                  )}
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

                  {v && (
                    <div className="pt-2 border-t border-[#F0F0EC]">
                      <PriceDisplay
                        priceUSD={v.priceUSD}
                        pricePHP={v.pricePHP}
                        primaryClassName="text-sm font-semibold text-[#111111]"
                        secondaryClassName="text-xs text-[#6B6B6B]"
                      />
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. SPLIT FEATURE COLLECTION PROMOTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Footwear Banner */}
          <div className="relative rounded-[12px] overflow-hidden min-h-[380px] flex items-end p-8 bg-[#2A2A26] text-white group">
            <Image
              src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1000&q=80"
              alt="Footwear Collection"
              fill
              className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="relative z-10 space-y-3">
              <span className="text-[10px] tracking-widest uppercase font-semibold text-[#B8912F]">
                COLLECTION 01 — FOOTWEAR
              </span>
              <h3 className="font-serif text-2xl font-normal text-white">
                Engineered Footwear & Modern Form
              </h3>
              <p className="text-xs text-[#D0D0CA] max-w-sm">
                Vibram® bespoke outsoles paired with vegetable-tanned French calfskin and seamless welded overlays.
              </p>
              <Link
                href="/shoes"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#111111] rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#FAFAF8] transition-colors"
              >
                <span>Shop Footwear</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Clothes Banner */}
          <div className="relative rounded-[12px] overflow-hidden min-h-[380px] flex items-end p-8 bg-[#222220] text-white group">
            <Image
              src="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=1000&q=80"
              alt="Clothes Collection"
              fill
              className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="relative z-10 space-y-3">
              <span className="text-[10px] tracking-widest uppercase font-semibold text-[#B8912F]">
                COLLECTION 02 — CLOTHES
              </span>
              <h3 className="font-serif text-2xl font-normal text-white">
                Structured Tailoring & Heavyweight Jersey
              </h3>
              <p className="text-xs text-[#D0D0CA] max-w-sm">
                Uncompromising boxy cuts, custom-milled loopback terry, and precision darting inspired by Kyoto architecture.
              </p>
              <Link
                href="/clothes"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#111111] rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#FAFAF8] transition-colors"
              >
                <span>Shop Apparel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. EDITORIAL SECTION (Kyoto & Tokyo Essay) */}
      <section id="editorial" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-white border border-[#E8E8E4] rounded-[12px] p-8 md:p-12">
          {/* Editorial Image */}
          <div className="relative aspect-[4/3] rounded-[8px] overflow-hidden bg-[#FAFAF8]">
            <Image
              src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1000&q=80"
              alt="The Weight of Stillness"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded text-[10px] text-white font-mono">
              Location: Aoyama Dist. 02 Atelier • 35.6621° N, 139.7121° E
            </div>
          </div>

          {/* Editorial Content */}
          <div className="space-y-4">
            <span className="text-[10px] tracking-widest uppercase font-semibold text-[#B8912F]">
              VOL. 06 EDITORIAL — TOKYO ESSAY
            </span>
            <h2 className="font-serif text-3xl font-normal text-[#111111]">
              The Weight of Stillness
            </h2>
            <p className="text-xs text-[#6B6B6B] leading-relaxed">
              In an era of hyper-velocity and fleeting runway seasons, JBØ6 returns to monolithic permanence. Drop 06 examines brutalist cast concrete, raw un-finished hem allowances, and organic loop-staple fibers that soften into personal armor through repetitive wear.
            </p>
            <p className="text-xs text-[#6B6B6B] leading-relaxed">
              Every seam is bonded with water-resistant Japanese micro-tape, then numbered by our two master patternmakers before departing Kyoto for our global collectors.
            </p>
            <div className="pt-2">
              <Link
                href="/shoes"
                className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#111111] hover:text-[#B8912F] transition-colors"
              >
                <span>Read Manifesto & Lookbook</span>
                <span className="text-[10px] text-[#A0A09C]">(5 min monograph)</span>
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* 7. CONFIDENTIAL LEDGER SIGNUP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#111111] text-white rounded-[12px] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-md">
            <span className="text-[10px] tracking-widest uppercase font-semibold text-[#B8912F]">
              CONFIDENTIAL SALON REGISTRY
            </span>
            <h3 className="font-serif text-2xl font-normal text-white">
              Join the JBØ6 Ledger
            </h3>
            <p className="text-xs text-[#A0A09C]">
              Receive private drop keys 2 hours prior to public release, archival restock telegrams, and private salon appointments in Milan and Tokyo.
            </p>
          </div>

          <form className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter client email..."
              className="px-4 py-3 bg-[#222222] border border-[#333333] rounded-full text-xs text-white placeholder:text-[#888888] focus:outline-none focus:border-[#B8912F] w-full sm:w-72"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#B8912F] hover:bg-[#967422] text-white rounded-full text-xs font-semibold uppercase tracking-wider transition-colors shrink-0"
            >
              Join Ledger
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
