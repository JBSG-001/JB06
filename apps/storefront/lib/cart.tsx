'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  variantId: string;
  productId: string;
  title: string;
  department: string;
  size: string;
  color: string;
  priceUSD: number; // minor units (cents)
  pricePHP?: number | null; // minor units (centavos)
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  totalCount: number;
  subtotalUSD: number;
  subtotalPHP: number;
  promoCode: string | null;
  discountPercentage: number;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
  reservedSecondsLeft: number;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalCount: 0,
  subtotalUSD: 0,
  subtotalPHP: 0,
  promoCode: null,
  discountPercentage: 0,
  applyPromo: () => false,
  removePromo: () => {},
  reservedSecondsLeft: 900,
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState<string | null>('ATELIER10');
  const [discountPercentage, setDiscountPercentage] = useState<number>(10);
  const [reservedSecondsLeft, setReservedSecondsLeft] = useState<number>(894); // ~14:54 as in Image 4

  // Load cart from localStorage or initialize with sample items matching Image 4
  useEffect(() => {
    try {
      const saved = localStorage.getItem('jb06_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      } else {
        // Initial sample items faithful to Image 4 ("Your Bag (2 items)")
        const initialItems: CartItem[] = [
          {
            variantId: 'sample-v1',
            productId: 'sample-p1',
            title: 'Void Runner Sneaker',
            department: 'FOOTWEAR / RUNNER',
            size: 'US 9.0 (EU 42)',
            color: 'Obsidian / Gold',
            priceUSD: 14500,
            pricePHP: 841000,
            image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&q=80',
            quantity: 1,
          },
          {
            variantId: 'sample-v2',
            productId: 'sample-p2',
            title: 'Oversized Heavy Tee',
            department: 'APPAREL / HEAVYWEIGHT JERSEY',
            size: 'L (Bespoke Boxy)',
            color: 'Chalk White',
            priceUSD: 6500,
            pricePHP: 377000,
            image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
            quantity: 1,
          },
        ];
        setItems(initialItems);
      }
    } catch {
      // fallback
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('jb06_cart', JSON.stringify(items));
    } catch {}
  }, [items]);

  // Countdown timer for 15-minute vault reservation
  useEffect(() => {
    const timer = setInterval(() => {
      setReservedSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.variantId === item.variantId);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx].quantity += item.quantity;
        return updated;
      }
      return [...prev, item];
    });
  };

  const removeItem = (variantId: string) => {
    setItems((prev) => prev.filter((i) => i.variantId !== variantId));
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(variantId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.variantId === variantId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const applyPromo = (code: string) => {
    const cleaned = code.trim().toUpperCase();
    if (cleaned === 'ATELIER10') {
      setPromoCode('ATELIER10');
      setDiscountPercentage(10);
      return true;
    }
    return false;
  };

  const removePromo = () => {
    setPromoCode(null);
    setDiscountPercentage(0);
  };

  const totalCount = items.reduce((acc, i) => acc + i.quantity, 0);
  const subtotalUSD = items.reduce((acc, i) => acc + i.priceUSD * i.quantity, 0);
  const subtotalPHP = items.reduce(
    (acc, i) => acc + (i.pricePHP ?? Math.round(i.priceUSD * 58)) * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalCount,
        subtotalUSD,
        subtotalPHP,
        promoCode,
        discountPercentage,
        applyPromo,
        removePromo,
        reservedSecondsLeft,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
