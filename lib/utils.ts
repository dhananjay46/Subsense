import { addWeeks, differenceInCalendarDays, format, isSameWeek } from 'date-fns';

import type { BillingCycle, SubscriptionCategory, SubscriptionStatus } from '@/types/subscription';

import { currencies, type CurrencyCode } from './currencies';

export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}

/** Cache formatters per (locale, currency) pair — Intl constructors are not cheap. */
const formatterCache = new Map<string, { whole: Intl.NumberFormat; paise: Intl.NumberFormat }>();

function getFormatters(code: CurrencyCode) {
  const cur = currencies[code];
  const key = `${cur.locale}:${code}`;
  const cached = formatterCache.get(key);
  if (cached) return cached;
  const made = {
    whole: new Intl.NumberFormat(cur.locale, {
      style: 'currency',
      currency: code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }),
    paise: new Intl.NumberFormat(cur.locale, {
      style: 'currency',
      currency: code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
  };
  formatterCache.set(key, made);
  return made;
}

const count = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

/** ₹1,24,500 by default. Pass a currency code to format in another currency. */
export function formatMoney(value: number, code: CurrencyCode = 'INR'): string {
  const { whole, paise } = getFormatters(code);
  const hasPaise = !Number.isInteger(value) && Math.abs(value) < 10;
  return (hasPaise ? paise : whole).format(value);
}

/** Back-compat alias for existing callers. */
export const formatINR = (value: number) => formatMoney(value, 'INR');

export function formatCount(value: number): string {
  return count.format(value);
}

const cycleWord: Record<BillingCycle, string> = {
  monthly: 'month',
  quarterly: 'quarter',
  yearly: 'year',
};

/** "₹999 a year", "₹500 a quarter". */
export function formatPrice(price: number, cycle: BillingCycle, code: CurrencyCode = 'INR'): string {
  return `${formatMoney(price, code)} a ${cycleWord[cycle]}`;
}

export function cycleLabel(cycle: BillingCycle): string {
  return cycleWord[cycle];
}

const WEEK = { weekStartsOn: 1 } as const;

export function renewalLabel(date: Date, now: Date): string {
  const days = differenceInCalendarDays(date, now);
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days > 1 && isSameWeek(date, now, WEEK)) return format(date, 'EEE');
  if (days > 1 && isSameWeek(date, addWeeks(now, 1), WEEK)) return `Next ${format(date, 'EEE')}`;
  return format(date, 'd MMM');
}

export function renewsPhrase(date: Date, now: Date): string {
  const label = renewalLabel(date, now);
  // Only lowercase the two bare-word relatives. "Next Mon" keeps its day-of-week casing
  // ("Renews next Mon"), and absolute labels like "12 Mar" stay as-is.
  if (label === 'Today' || label === 'Tomorrow') return `Renews ${label.toLowerCase()}`;
  if (label.startsWith('Next ')) return `Renews next ${label.slice(5)}`;
  return `Renews ${label}`;
}

export function greeting(now: Date): string {
  const hour = now.getHours();
  if (hour < 5) return 'Good night';
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good night';
}

export const categoryLabel: Record<SubscriptionCategory, string> = {
  entertainment: 'Entertainment',
  music: 'Music',
  productivity: 'Productivity',
  cloud: 'Cloud',
  finance: 'Finance',
  other: 'Other',
};

export const statusLabel: Record<SubscriptionStatus, string> = {
  active: 'Active',
  expiring: 'Renews soon',
  paused: 'Paused',
  trial: 'Trial',
};

export function monthlyEquivalent(price: number, cycle: BillingCycle): number {
  if (cycle === 'yearly') return price / 12;
  if (cycle === 'quarterly') return price / 3;
  return price;
}
