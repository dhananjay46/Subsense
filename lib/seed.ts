import { addDays, startOfDay, subDays } from 'date-fns';

import type { Profile, Subscription, SubscriptionCategory } from '@/types/subscription';

/** The 8 Indian subscriptions the brief ships with. Renewal dates are relative to today. */
export function seedSubscriptions(now: Date): Subscription[] {
  const today = startOfDay(now);
  const createdAt = subDays(today, 60);
  const base = { currency: 'INR' as const, createdAt, isSample: true };
  return [
    { id: 'netflix', name: 'Netflix', planName: 'Premium', category: 'entertainment', price: 649, billingCycle: 'monthly', renewalDate: addDays(today, 1), iconLetter: 'N', iconColor: 'coral', status: 'expiring', ...base },
    { id: 'spotify', name: 'Spotify', planName: 'Premium Individual', category: 'music', price: 119, billingCycle: 'monthly', renewalDate: addDays(today, 3), iconLetter: 'S', iconColor: 'teal', status: 'expiring', ...base },
    { id: 'youtube-premium', name: 'YouTube Premium', planName: 'Individual', category: 'entertainment', price: 149, billingCycle: 'monthly', renewalDate: addDays(today, 7), iconLetter: 'Y', iconColor: 'rose', status: 'expiring', ...base },
    { id: 'jiocinema', name: 'JioCinema', planName: 'Premium, yearly', category: 'entertainment', price: 999, billingCycle: 'yearly', renewalDate: addDays(today, 41), iconLetter: 'J', iconColor: 'coral', status: 'active', ...base },
    { id: 'icloud', name: 'iCloud+', planName: '50 GB', category: 'cloud', price: 75, billingCycle: 'monthly', renewalDate: addDays(today, 5), iconLetter: 'i', iconColor: 'teal', status: 'expiring', ...base },
    { id: 'google-one', name: 'Google One', planName: '100 GB', category: 'cloud', price: 130, billingCycle: 'monthly', renewalDate: addDays(today, 18), iconLetter: 'G', iconColor: 'amber', status: 'active', ...base },
    { id: 'notion', name: 'Notion', planName: 'Plus', category: 'productivity', price: 800, billingCycle: 'monthly', renewalDate: addDays(today, 12), iconLetter: 'N', iconColor: 'ink', status: 'active', ...base },
    { id: 'canva', name: 'Canva Pro', planName: 'Pro', category: 'productivity', price: 500, billingCycle: 'monthly', renewalDate: addDays(today, 9), iconLetter: 'C', iconColor: 'teal', status: 'active', ...base },
  ];
}

/** Order sections render in on the Subscriptions tab. */
export const categoryOrder: SubscriptionCategory[] = [
  'entertainment',
  'music',
  'productivity',
  'cloud',
  'finance',
  'other',
];

const profile: Profile = { name: 'Meera Sharma', email: 'meera@example.com' };

export function loadProfile(): Profile {
  return profile;
}

export const isEmptyList = (items: readonly unknown[]): boolean => items.length === 0;
export const neverEmpty = (): boolean => false;
