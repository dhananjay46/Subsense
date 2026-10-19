import type { CurrencyCode } from '@/lib/currencies';

export type SubscriptionCategory =
  | 'entertainment'
  | 'productivity'
  | 'cloud'
  | 'music'
  | 'finance'
  | 'other';

export type BillingCycle = 'monthly' | 'quarterly' | 'yearly';

/** 'expiring' is the stored value for the renders-soon state. Keep the type stable. */
export type SubscriptionStatus = 'active' | 'expiring' | 'paused' | 'trial';

export type Subscription = {
  id: string;
  name: string;
  planName: string;
  category: SubscriptionCategory;
  price: number;
  /** The currency this amount is denominated in — never relabel to another currency. */
  currency: CurrencyCode;
  billingCycle: BillingCycle;
  renewalDate: Date;
  createdAt: Date;
  /** Monogram glyph (usually `name.charAt(0)`). */
  iconLetter: string;
  /** Token name — e.g. 'coral', 'teal', 'amber'. Mapped to a soft bg + ink text. */
  iconColor: string;
  status: SubscriptionStatus;
  /** Optional research-driven extensions, kept non-breaking. */
  isTrial?: boolean;
  owner?: string;
  cancelUrl?: string;
  lastReviewedOn?: Date;
  /** Flagged on items added via the sample-data action, so Settings can remove just those. */
  isSample?: boolean;
};

export type SubscriptionDraft = {
  name: string;
  planName: string;
  category: SubscriptionCategory;
  price: number;
  currency?: CurrencyCode;
  billingCycle: BillingCycle;
  renewalDate: Date;
  iconLetter?: string;
  iconColor?: string;
  isTrial?: boolean;
  owner?: string;
  cancelUrl?: string;
};

export type DashboardSummary = {
  monthlySpend: number;
  /** The currency `monthlySpend` is denominated in; the KPI never renames it. */
  monthlySpendCurrency: CurrencyCode;
  activeCount: number;
  dueThisWeek: number;
};

export type Dashboard = {
  summary: DashboardSummary;
  upcoming: Subscription[];
  needsReview: Subscription[];
};

export type Profile = {
  name: string;
  email: string;
};
