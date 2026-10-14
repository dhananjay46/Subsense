export type SubscriptionCategory =
  | 'entertainment'
  | 'productivity'
  | 'cloud'
  | 'music'
  | 'finance'
  | 'other';

export type BillingCycle = 'monthly' | 'quarterly' | 'yearly';

export type SubscriptionStatus = 'active' | 'expiring' | 'paused' | 'trial';

export type Subscription = {
  id: string;
  name: string;
  planName: string;
  category: SubscriptionCategory;
  price: number;
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
};

export type SubscriptionDraft = {
  name: string;
  planName: string;
  category: SubscriptionCategory;
  price: number;
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
