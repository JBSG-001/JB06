import React from 'react';

export interface PriceDisplayProps {
  priceUSD: number; // minor units in cents ($145.00 -> 14500)
  pricePHP?: number | null; // minor units in centavos (₱8,410.00 -> 841000)
  exchangeRate?: number; // fallback exchange rate if pricePHP is null
  primaryCurrency?: 'USD' | 'PHP';
  className?: string;
  primaryClassName?: string;
  secondaryClassName?: string;
  showApprox?: boolean;
}

export function formatMoney(amountCents: number, currency: 'USD' | 'PHP'): string {
  const value = amountCents / 100;
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } else {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  priceUSD,
  pricePHP,
  exchangeRate = 58,
  primaryCurrency = 'USD',
  className = '',
  primaryClassName = 'font-medium text-[#111111]',
  secondaryClassName = 'text-xs text-[#6B6B6B]',
  showApprox = true,
}) => {
  const calculatedPHP = pricePHP ?? Math.round(priceUSD * exchangeRate);

  const formattedUSD = formatMoney(priceUSD, 'USD');
  const formattedPHP = formatMoney(calculatedPHP, 'PHP');

  if (primaryCurrency === 'PHP') {
    return (
      <span className={`inline-flex items-baseline gap-1.5 ${className}`}>
        <span className={primaryClassName}>{formattedPHP}</span>
        {showApprox && (
          <span className={secondaryClassName}>
            ≈ {formattedUSD}
          </span>
        )}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-baseline gap-1.5 ${className}`}>
      <span className={primaryClassName}>{formattedUSD}</span>
      {showApprox && (
        <span className={secondaryClassName}>
          ≈ {formattedPHP} PHP
        </span>
      )}
    </span>
  );
};
