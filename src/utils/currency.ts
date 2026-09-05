/**
 * Centralized Currency Formatting Utility
 * 
 * Configured for consistent USD ($) formatting across all dashboard cards,
 * charts, product tables, category summaries, and AI insight reports.
 * 
 * Designed for immediate extensibility (e.g. switching to INR '₹') in the future
 * by updating the CURRENT_CURRENCY configuration without modifying UI components.
 */

export type CurrencyCode = 'USD' | 'INR';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  locale: string;
}

export const CURRENT_CURRENCY: CurrencyConfig = {
  code: 'USD',
  symbol: '$',
  locale: 'en-US',
};

/**
 * Formats a monetary amount into a standard currency string (e.g. "$12,450.00").
 */
export function formatCurrency(
  amount: number,
  options?: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }
): string {
  const minDigits = options?.minimumFractionDigits ?? 2;
  const maxDigits = options?.maximumFractionDigits ?? 2;

  if (isNaN(amount) || amount === null || amount === undefined) {
    return `${CURRENT_CURRENCY.symbol}0.00`;
  }

  return new Intl.NumberFormat(CURRENT_CURRENCY.locale, {
    style: 'currency',
    currency: CURRENT_CURRENCY.code,
    minimumFractionDigits: minDigits,
    maximumFractionDigits: maxDigits,
  }).format(amount);
}

/**
 * Formats large amounts compactly for chart axis ticks and compact metric badges
 * (e.g. "$1.2k", "$45k", "$1.5M").
 */
export function formatCompactCurrency(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return `${CURRENT_CURRENCY.symbol}0`;
  }

  const symbol = CURRENT_CURRENCY.symbol;
  const abs = Math.abs(amount);

  if (abs >= 1_000_000) {
    return `${symbol}${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (abs >= 1_000) {
    return `${symbol}${(amount / 1_000).toFixed(1)}k`;
  }
  return `${symbol}${amount.toFixed(0)}`;
}

/**
 * Returns the active currency symbol (e.g. "$").
 */
export function getCurrencySymbol(): string {
  return CURRENT_CURRENCY.symbol;
}
