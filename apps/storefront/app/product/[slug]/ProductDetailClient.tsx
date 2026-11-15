'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product, Variant } from '@jb06/db';
import { useCart } from '@/lib/cart';
import { useCurrency } from '@/lib/currency';
import { PriceDisplay, Badge, Button, formatMoney } from '@jb06/ui';
import { 
  ChevronDown, 
  ChevronUp, 
  Truck, 
  RefreshCw, 
  ShieldCheck, 
  Box, 
  Heart, 
  Check, 
  Sparkles 
} from 'lucide-react';

interface ProductDetailClientProps {
  product: Product & {
    category: { name: string; slug: string };
    subcategory: { name: string; slug: string };
    variants: Variant[];
  };
  completeTheLook: (Product & { variants: Variant[] })[];
}

export const ProductDetailClient: React.FC<ProductDetailClientProps> = ({
  product,
  completeTheLook,
}) => {
  const router = useRouter();
  const { currency, exchangeRate } = useCurrency();
  const { addItem } = useCart();

  const [selectedImage, setSelectedImage] = useState<string>(
    product.images[0] || 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&q=80'
  );

  // Default to first variant with stock > 0
  const availableVariant = product.variants.find((v) => v.stock > 0) || product.variants[0];
  const [selectedVariant, setSelectedVariant] = useState<Variant | undefined>(availableVariant);
  const [addedNotice, setAddedNotice] = useState<boolean>(false);

  // Accordion states
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    tech: true,
    materials: false,
    shipping: false,
    returns: false,
  });

  const toggleSection = (sec: string) => {
    setOpenSections((prev) => ({ ...prev, [sec]: !prev [sec] }));
  };

  const handleAddToBag = () => {
    if (!selectedVariant) return;

    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      title: product.title,
      department: product.department,
      size: selectedVariant.size,
      color: selectedVariant.color,
      priceUSD: selectedVariant.priceUSD,
      pricePHP: selectedVariant.pricePHP,
      image: selectedImage,
      quantity: 1,
    });

    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const handleExpressCheckout = () => {
    handleAddToBag();
    router.push('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* 1. BREADCRUMBS & BADGES */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-[#6B6B6B]">
        <nav className="flex items-center gap-2">
          <Link href="/" className="hover:text-[#111111]">Home</Link>
          <span>/</span>
          <Link href={`/${product.category.slug}`} className="hover:text-[#111111]">{product.category.name}</Link>
          <span>/</span>
          <Link href={`/${product.category.slug}?sub=${product.subcategory.slug}`} className="hover:text-[#111111]">{product.subcategory.name}</Link>
          <span>/</span>
          <span className="text-[#111111] font-medium">{product.title}</span>
        </nav>

        <span className="text-[10px] bg-[#FAF6ED] text-[#B8912F] border border-[#E8DFC8] px-2.5 py-1 rounded font-semibold uppercase tracking-wider">
          LIMITED DROP • ARCHIVE 06
        </span>
      </div>

      {/* 2. MAIN PDP LAYOUT: 2-COLUMN (GALLERY + DETAILS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Image Gallery (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Hero Featured View */}
          <div className="relative aspect-[4/5] bg-[#F4F4F2] rounded-[12px] overflow-hidden border border-[#E8E8E4]">
            <Image
              src={selectedImage}
              alt={product.title}
              fill
              priority
              className="object-cover object-center"
            />
            <button
              type="button"
              className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md border border-[#E8E8E4] px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[#111111] flex items-center gap-1.5 shadow-sm hover:bg-white transition-colors"
            >
              <Box className="w-3.5 h-3.5" />
              <span>View in 3D / AR Room</span>
            </button>
          </div>

          {/* Thumbnails Row */}
          <div className="grid grid-cols-4 gap-3">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImage(img)}
                className={`relative aspect-[4/5] rounded-[8px] overflow-hidden border transition-all ${
                  selectedImage === img
                    ? 'border-[#111111] ring-1 ring-[#111111]'
                    : 'border-[#E8E8E4] opacity-70 hover:opacity-100'
                }`}
              >
                <Image src={img} alt={`${product.title} view ${idx + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Specification & Purchase Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-1">
            <p className="text-xs font-medium tracking-widest uppercase text-[#6B6B6B]">
              {product.department}
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#111111]">
              {product.title}
            </h1>
          </div>

          {/* Dual Price Display */}
          {selectedVariant && (
            <div className="flex items-baseline gap-3 pb-4 border-b border-[#E8E8E4]">
              <PriceDisplay
                priceUSD={selectedVariant.priceUSD}
                pricePHP={selectedVariant.pricePHP}
                primaryClassName="text-2xl font-semibold text-[#111111]"
                secondaryClassName="text-sm text-[#6B6B6B]"
              />
              <span className="text-[10px] font-mono tracking-wider text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded border border-[#A7F3D0] uppercase font-semibold">
                DUTIES & TAXES INCLUDED
              </span>
            </div>
          )}

          {/* Colorway Info */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#6B6B6B]">Colorway:</span>
              <span className="font-semibold text-[#111111]">{selectedVariant?.color || 'Obsidian / Gold'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#111111] ring-2 ring-offset-2 ring-[#111111]" />
              <span className="w-5 h-5 rounded-full bg-[#E5E5DF] border border-[#CCCCCC]" />
            </div>
          </div>

          {/* Size Selection Matrix with Stock Verification */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#111111] uppercase tracking-wider">
                Select Size (US Men)
              </span>
              <button type="button" className="text-[#6B6B6B] hover:text-[#111111] underline">
                Size Guide & Conversions
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {product.variants.map((v) => {
                const isSelected = selectedVariant?.id === v.id;
                const isOut = v.stock === 0;

                return (
                  <button
                    key={v.id}
                    type="button"
                    disabled={isOut}
                    onClick={() => setSelectedVariant(v)}
                    className={`relative py-3 text-xs text-center rounded-[8px] font-mono border transition-all ${
                      isSelected
                        ? 'bg-[#111111] text-white border-[#111111] shadow-xs'
                        : isOut
                        ? 'bg-[#F4F4F2] text-[#A0A09C] border-[#E8E8E4] cursor-not-allowed line-through'
                        : 'bg-white text-[#111111] border-[#E8E8E4] hover:border-[#111111]'
                    }`}
                  >
                    <span>{v.size.replace('US ', '').replace('Size ', '')}</span>
                    {v.stock > 0 && v.stock <= 3 && !isSelected && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#F59E0B]" />
                    )}
                  </button>
                );
              })}
            </div>

            <p className="text-[11px] text-[#6B6B6B] flex items-center gap-1.5">
              <span>●</span>
              <span>True to size. Half sizes recommended for wide profile feet.</span>
            </p>
          </div>

          {/* Availability & Dispatch Notice */}
          <div className="p-3.5 bg-[#FAF6ED] border border-[#E8DFC8] rounded-[8px] text-xs text-[#6B6B6B] space-y-1">
            <p className="font-semibold text-[#111111]">
              In stock — ships securely within 24 hours.
            </p>
            <p className="text-[11px]">
              Eligible for complimentary express priority delivery to US, Philippines, and Japan.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleAddToBag}
              className="text-xs uppercase tracking-widest font-semibold py-4"
            >
              {addedNotice ? (
                <span className="flex items-center gap-2 text-[#10B981]">
                  <Check className="w-4 h-4" /> Added to Atelier Bag
                </span>
              ) : selectedVariant ? (
                <span>
                  ADD TO BAG — {currency === 'PHP' ? formatMoney(selectedVariant.pricePHP ?? Math.round(selectedVariant.priceUSD * 58), 'PHP') : formatMoney(selectedVariant.priceUSD, 'USD')}
                </span>
              ) : (
                'Select Size'
              )}
            </Button>

            <Button
              variant="gold"
              size="lg"
              fullWidth
              onClick={handleExpressCheckout}
              className="text-xs uppercase tracking-widest font-semibold py-3.5"
            >
              Express GCash / Card
            </Button>

            <button
              type="button"
              className="w-full py-2.5 text-xs text-[#6B6B6B] hover:text-[#111111] flex items-center justify-center gap-2 transition-colors"
            >
              <Heart className="w-4 h-4" />
              <span>Add to Atelier Wishlist</span>
            </button>
          </div>

          {/* Trust Guarantees Row */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#E8E8E4] text-center text-[10px] text-[#6B6B6B]">
            <div className="p-2 space-y-1">
              <Truck className="w-4 h-4 mx-auto text-[#B8912F]" />
              <p className="font-semibold text-[#111111]">Free Courier</p>
              <p>Orders $100+</p>
            </div>
            <div className="p-2 space-y-1">
              <RefreshCw className="w-4 h-4 mx-auto text-[#B8912F]" />
              <p className="font-semibold text-[#111111]">30-Day Returns</p>
              <p>Effortless exchange</p>
            </div>
            <div className="p-2 space-y-1">
              <ShieldCheck className="w-4 h-4 mx-auto text-[#B8912F]" />
              <p className="font-semibold text-[#111111]">Certified Drop</p>
              <p>100% Authentic</p>
            </div>
          </div>

          {/* Accordion Sections */}
          <div className="space-y-3 pt-4 border-t border-[#E8E8E4]">
            {/* 1. Technical Specifications */}
            <div className="border-b border-[#E8E8E4] pb-3">
              <button
                type="button"
                onClick={() => toggleSection('tech')}
                className="w-full flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#111111]"
              >
                <span>Technical Specifications</span>
                {openSections.tech ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openSections.tech && (
                <div className="pt-3 text-xs text-[#6B6B6B] space-y-2 leading-relaxed">
                  <p>{product.description}</p>
                  {product.materials && (
                    <p><strong className="text-[#111111]">Materials:</strong> {product.materials}</p>
                  )}
                  {selectedVariant && (
                    <p className="font-mono text-[11px] text-[#A0A09C]">
                      SKU: {selectedVariant.sku}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* 2. Materials & Care */}
            <div className="border-b border-[#E8E8E4] pb-3">
              <button
                type="button"
                onClick={() => toggleSection('materials')}
                className="w-full flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#111111]"
              >
                <span>Materials & Care</span>
                {openSections.materials ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openSections.materials && (
                <div className="pt-3 text-xs text-[#6B6B6B] space-y-2 leading-relaxed">
                  <p>{product.care || 'Specialist clean only. Store in provided archival dust cover.'}</p>
                </div>
              )}
            </div>

            {/* 3. Shipping & Local Settlement */}
            <div className="border-b border-[#E8E8E4] pb-3">
              <button
                type="button"
                onClick={() => toggleSection('shipping')}
                className="w-full flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#111111]"
              >
                <span>Shipping & Local Settlement</span>
                {openSections.shipping ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openSections.shipping && (
                <div className="pt-3 text-xs text-[#6B6B6B] space-y-2 leading-relaxed">
                  <p>
                    Domestic orders in the Philippines are charged natively in PHP via PayMongo GCash with zero cross-border FX surcharges.
                  </p>
                  <p>
                    International orders settle transparently in USD via PayPal or global cards with prepaid duty clearance.
                  </p>
                </div>
              )}
            </div>

            {/* 4. Returns & Archive Policy */}
            <div className="pb-3">
              <button
                type="button"
                onClick={() => toggleSection('returns')}
                className="w-full flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#111111]"
              >
                <span>Returns & Archive Policy</span>
                {openSections.returns ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openSections.returns && (
                <div className="pt-3 text-xs text-[#6B6B6B] space-y-2 leading-relaxed">
                  <p>
                    Items in original unworn condition with serialized archive tags attached may be returned within 30 days of arrival.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. COMPLETE THE LOOK / CURATED PAIRINGS */}
      {completeTheLook.length > 0 && (
        <section className="space-y-6 pt-12 border-t border-[#E8E8E4]">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-[10px] tracking-widest uppercase font-semibold text-[#B8912F]">
                CURATED ENSEMBLES • ARCHIVE 06 CAPSULE
              </p>
              <h2 className="font-serif text-2xl font-normal text-[#111111] mt-0.5">
                Complete the Look
              </h2>
            </div>
            <Link href="/clothes" className="text-xs text-[#6B6B6B] hover:text-[#111111] uppercase tracking-wider underline">
              Explore Drop 06 Runway
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {completeTheLook.map((item) => {
              const lowestV = item.variants[0];
              return (
                <Link
                  key={item.id}
                  href={`/product/${item.slug}`}
                  className="group bg-white border border-[#E8E8E4] rounded-[12px] overflow-hidden hover:border-[#B8912F] transition-all"
                >
                  <div className="relative aspect-[4/5] bg-[#F4F4F2] overflow-hidden">
                    <Image
                      src={item.images[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80'}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wider">{item.department}</p>
                    <h4 className="text-sm font-semibold text-[#111111] group-hover:text-[#B8912F] transition-colors">{item.title}</h4>
                    {lowestV && (
                      <PriceDisplay
                        priceUSD={lowestV.priceUSD}
                        pricePHP={lowestV.pricePHP}
                        primaryClassName="text-sm font-semibold text-[#111111]"
                      />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
