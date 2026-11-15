'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = 'USD' | 'PHP';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  toggleCurrency: () => void;
  exchangeRate: number;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'USD',
  setCurrency: () => {},
  toggleCurrency: () => {},
  exchangeRate: 58,
});

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<Currency>('USD');
  const [exchangeRate] = useState<number>(58);

  useEffect(() => {
    const saved = document.cookie
      .split('; ')
      .find((row) => row.startsWith('atelier_currency='))
      ?.split('=')[1] as Currency | undefined;

    if (saved === 'USD' || saved === 'PHP') {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    document.cookie = `atelier_currency=${c}; path=/; max-age=31536000; SameSite=Lax`;
  };

  const toggleCurrency = () => {
    const next = currency === 'USD' ? 'PHP' : 'USD';
    setCurrency(next);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, toggleCurrency, exchangeRate }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
