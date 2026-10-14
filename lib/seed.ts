import { addDays, startOfDay, subDays } from 'date-fns';

import type { Profile, Subscription, SubscriptionCategory } from '@/types/subscription';

/** The 8 Indian subscriptions the brief ships with. Renewal dates are relative to today. */
export function seedSubscriptions(now: Date): Subscription[] {
  const today = startOfDay(now);
  const createdAt = subDays(today, 60);
  return [
    { id: 'netflix', name: 'Netflix', planName: 'Premium', category: 'entertainment', price: 649, billingCycle: 'monthly', renewalDate: addDays(today, 1), createdAt, iconLetter: 'N', iconColor: 'coral', status: 'expiring' },
    { id: 'spotify', name: 'Spotify', planName: 'Premium Individual', category: 'music', price: 119, billingCycle: 'monthly', renewalDate: addDays(today, 3), createdAt, iconLetter: 'S', iconColor: 'teal', status: 'expiring' },
    { id: 'youtube-premium', name: 'YouTube Premium', planName: 'Individual', category: 'entertainment', price: 149, billingCycle: 'monthly', renewalDate: addDays(today, 7), createdAt, iconLetter: 'Y', iconColor: 'rose', status: 'expiring' },
    { id: 'jiocinema', name: 'JioCinema', planName: 'Premium, yearly', category: 'entertainment', price: 999, billingCycle: 'yearly', renewalDate: addDays(today, 41), createdAt, iconLetter: 'J', iconColor: 'coral', status: 'active' },
    { id: 'icloud', name: 'iCloud+', planName: '50 GB', category: 'cloud', price: 75, billingCycle: 'monthly', renewalDate: addDays(today, 5), createdAt, iconLetter: 'i', iconColor: 'teal', status: 'expiring' },
    { id: 'google-one', name: 'Google One', planName: '100 GB', category: 'cloud', price: 130, billingCycle: 'monthly', renewalDate: addDays(today, 18), createdAt, iconLetter: 'G', iconColor: 'amber', status: 'active' },
    { id: 'notion', name: 'Notion', planName: 'Plus', category: 'productivity', price: 800, billingCycle: 'monthly', renewalDate: addDays(today, 12), createdAt, iconLetter: 'N', iconColor: 'ink', status: 'active' },
    { id: 'canva', name: 'Canva Pro', planName: 'Pro', category: 'productivity', price: 500, billingCycle: 'monthly', renewalDate: addDays(today, 9), createdAt, iconLetter: 'C', iconColor: 'teal', status: 'active' },
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
