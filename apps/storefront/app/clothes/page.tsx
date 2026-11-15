import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@jb06/db';
import { PriceDisplay, Badge } from '@jb06/ui';
import { SlidersHorizontal, Heart } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface ClothesPageProps {
  searchParams?: Promise<{
    sub?: string;
  }>;
}

export default async function ClothesCatalogPage({ searchParams }: ClothesPageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const currentSub = resolvedParams.sub || 'all';

  const category = await prisma.category.findUnique({
    where: { slug: 'clothes' },
    include: { subcategories: true },
  }).catch(() => null);

  const products = await prisma.product.findMany({
    where: {
      categoryId: category?.id,
      ...(currentSub !== 'all' ? { subcategory: { slug: currentSub } } : {}),
    },
    include: {
      subcategory: true,
      variants: {
        orderBy: { priceUSD: 'asc' },
      },
    },
  }).catch(() => []);

  const subcategories = [
    { label: 'All Clothes', slug: 'all' },
    { label: 'Tees & Tops', slug: 'tees-tops' },
    { label: 'Hoodies & Sweatshirts', slug: 'hoodies-sweatshirts' },
    { label: 'Jackets & Outerwear', slug: 'jackets-outerwear' },
    { label: 'Shirts', slug: 'shirts' },
    { label: 'Pants & Cargos', slug: 'pants-cargos' },
    { label: 'Shorts', slug: 'shorts' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. TOP HEADER & EXCHANGE STANDARD */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-4 border-b border-[#E8E8E4]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-3xl font-normal text-[#111111]">
              CLOTHES & TAILORING
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
              href={sub.slug === 'all' ? '/clothes' : `/clothes?sub=${sub.slug}`}
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

      {/* 3. PRODUCT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p) => {
          const lowestVariant = p.variants[0];
          return (
            <Link
              key={p.id}
              href={`/product/${p.slug}`}
              className="group flex flex-col bg-white border border-[#E8E8E4] rounded-[12px] overflow-hidden hover:border-[#B8912F] transition-all duration-200"
            >
              <div className="relative aspect-[4/5] bg-[#F4F4F2] overflow-hidden">
                <Image
                  src={p.images[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80'}
                  alt={p.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                {p.badge && (
                  <div className="absolute top-3 left-3">
                    <Badge variant={p.badge === 'NEW' ? 'new' : p.badge === 'ATELIER' ? 'atelier' : 'low-stock'}>
                      {p.badge}
                    </Badge>
                  </div>
                )}
                <button
                  type="button"
                  aria-label="Wishlist"
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 backdrop-blur-sm text-[#111111] hover:text-[#B8912F] transition-colors"
                >
                  <Heart className="w-3.5 h-3.5" />
                </button>
              </div>

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
                  <div className="pt-2 border-t border-[#F0F0EC]">
                    <PriceDisplay
                      priceUSD={lowestVariant.priceUSD}
                      pricePHP={lowestVariant.pricePHP}
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
    </div>
  );
}
