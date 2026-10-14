import AsyncStorage from '@react-native-async-storage/async-storage';
import { addDays, differenceInCalendarDays, isAfter, startOfDay, subDays } from 'date-fns';
import { useMemo } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type {
  Dashboard,
  DashboardSummary,
  Subscription,
  SubscriptionCategory,
  SubscriptionDraft,
  SubscriptionStatus,
} from '@/types/subscription';

import type { CurrencyCode } from './currencies';
import { seedSubscriptions } from './seed';
import { monthlyEquivalent } from './utils';

type Serialised = Omit<Subscription, 'renewalDate' | 'createdAt' | 'lastReviewedOn'> & {
  renewalDate: string;
  createdAt: string;
  lastReviewedOn?: string;
};

export type SubscriptionsState = {
  items: Subscription[];
  currency: CurrencyCode;
  hasHydrated: boolean;
  add: (draft: SubscriptionDraft) => Subscription;
  update: (id: string, patch: Partial<SubscriptionDraft>) => void;
  remove: (id: string) => void;
  togglePause: (id: string) => void;
  markReviewed: (id: string) => void;
  setCurrency: (code: CurrencyCode) => void;
  resetToSample: () => void;
  clear: () => void;
};

const EXPIRING_WITHIN_DAYS = 7;
export const REVIEW_STALE_DAYS = 90;

const ICON_COLORS = ['coral', 'teal', 'amber', 'rose', 'ink'] as const;

function pickIconColor(name: string): string {
  const sum = [...name].reduce((n, ch) => n + ch.charCodeAt(0), 0);
  return ICON_COLORS[sum % ICON_COLORS.length];
}

function deriveStatus(
  renewalDate: Date,
  now: Date,
  isTrial: boolean,
  previous: SubscriptionStatus = 'active',
): SubscriptionStatus {
  if (previous === 'paused') return 'paused';
  if (isTrial) return 'trial';
  const days = differenceInCalendarDays(renewalDate, now);
  return days >= 0 && days <= EXPIRING_WITHIN_DAYS ? 'expiring' : 'active';
}

function id() {
  return `sub_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function serialise(s: Subscription): Serialised {
  return {
    ...s,
    renewalDate: s.renewalDate.toISOString(),
    createdAt: s.createdAt.toISOString(),
    lastReviewedOn: s.lastReviewedOn?.toISOString(),
  };
}

function hydrate(s: Serialised): Subscription {
  return {
    ...s,
    renewalDate: new Date(s.renewalDate),
    createdAt: new Date(s.createdAt),
    lastReviewedOn: s.lastReviewedOn ? new Date(s.lastReviewedOn) : undefined,
  };
}

export const useSubscriptionsStore = create<SubscriptionsState>()(
  persist(
    (set, get) => ({
      items: [],
      currency: 'INR',
      hasHydrated: false,
      add: (draft) => {
        const now = new Date();
        const item: Subscription = {
          id: id(),
          name: draft.name,
          planName: draft.planName,
          category: draft.category,
          price: draft.price,
          billingCycle: draft.billingCycle,
          renewalDate: draft.renewalDate,
          createdAt: now,
          iconLetter: draft.iconLetter ?? draft.name.charAt(0).toUpperCase(),
          iconColor: draft.iconColor ?? pickIconColor(draft.name),
          status: deriveStatus(draft.renewalDate, now, Boolean(draft.isTrial)),
          isTrial: draft.isTrial,
          owner: draft.owner,
          cancelUrl: draft.cancelUrl,
        };
        set({ items: [...get().items, item] });
        return item;
      },
      update: (targetId, patch) => {
        const now = new Date();
        set({
          items: get().items.map((item) => {
            if (item.id !== targetId) return item;
            const next: Subscription = { ...item, ...patch };
            if (patch.name && !patch.iconLetter) next.iconLetter = patch.name.charAt(0).toUpperCase();
            next.status = deriveStatus(
              next.renewalDate,
              now,
              Boolean(next.isTrial),
              item.status === 'paused' ? 'paused' : 'active',
            );
            return next;
          }),
        });
      },
      remove: (targetId) => set({ items: get().items.filter((s) => s.id !== targetId) }),
      togglePause: (targetId) => {
        const now = new Date();
        set({
          items: get().items.map((item) => {
            if (item.id !== targetId) return item;
            if (item.status === 'paused') {
              return {
                ...item,
                status: deriveStatus(item.renewalDate, now, Boolean(item.isTrial), 'active'),
              };
            }
            return { ...item, status: 'paused' };
          }),
        });
      },
      markReviewed: (targetId) => {
        const now = new Date();
        set({
          items: get().items.map((item) =>
            item.id === targetId ? { ...item, lastReviewedOn: now } : item,
          ),
        });
      },
      setCurrency: (currency) => set({ currency }),
      resetToSample: () => set({ items: seedSubscriptions(new Date()) }),
      clear: () => set({ items: [] }),
    }),
    {
      // v2: Subscription shape changed (plan→planName, cycle→billingCycle, renewsOn→renewalDate,
      // added iconLetter/iconColor/createdAt). Reset existing installs cleanly.
      name: 'subsense.subscriptions.v2',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        items: state.items.map(serialise),
        currency: state.currency,
      }),
      merge: (persisted, current) => {
        const payload = persisted as { items?: Serialised[]; currency?: CurrencyCode } | undefined;
        const raw = payload?.items ?? [];
        const items = raw.length > 0 ? raw.map(hydrate) : seedSubscriptions(new Date());
        return {
          ...current,
          items,
          currency: payload?.currency ?? current.currency,
          hasHydrated: true,
        };
      },
      onRehydrateStorage: () => (state) => {
        if (state && state.items.length === 0) {
          state.items = seedSubscriptions(new Date());
        }
        if (state) state.hasHydrated = true;
      },
    },
  ),
);

export function selectDashboard(items: Subscription[], now: Date): Dashboard {
  const active = items.filter((s) => s.status !== 'paused');
  const monthlySpend = Math.round(
    active.reduce((sum, s) => sum + monthlyEquivalent(s.price, s.billingCycle), 0),
  );
  const dueThisWeek = active.filter((s) => {
    const days = differenceInCalendarDays(s.renewalDate, now);
    return days >= 0 && days <= EXPIRING_WITHIN_DAYS;
  }).length;

  const summary: DashboardSummary = {
    monthlySpend,
    activeCount: active.length,
    dueThisWeek,
  };

  const upcoming = [...active]
    .filter((s) => isAfter(s.renewalDate, startOfDay(addDays(now, -1))))
    .sort((a, b) => a.renewalDate.getTime() - b.renewalDate.getTime())
    .slice(0, 5);

  const reviewCutoff = subDays(now, REVIEW_STALE_DAYS);
  const needsReview = active
    .filter((s) => s.status !== 'trial')
    .filter((s) => !s.lastReviewedOn || isAfter(reviewCutoff, s.lastReviewedOn))
    .sort((a, b) => (a.lastReviewedOn?.getTime() ?? 0) - (b.lastReviewedOn?.getTime() ?? 0))
    .slice(0, 3);

  return { summary, upcoming, needsReview };
}

export function selectByCategory(items: Subscription[]) {
  const groups = new Map<SubscriptionCategory, Subscription[]>();
  for (const item of items) {
    const bucket = groups.get(item.category) ?? [];
    bucket.push(item);
    groups.set(item.category, bucket);
  }
  for (const bucket of groups.values()) {
    bucket.sort((a, b) => a.renewalDate.getTime() - b.renewalDate.getTime());
  }
  return groups;
}

export function useDashboard(now: Date): Dashboard {
  const items = useSubscriptionsStore((s) => s.items);
  return useMemo(() => selectDashboard(items, now), [items, now]);
}
