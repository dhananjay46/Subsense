import { differenceInCalendarDays } from 'date-fns';

import type { BillingCycle, SubscriptionStatus } from '@/types/subscription';

/**
 * How many days before the renewal date we start calling the subscription "Renews soon".
 * Keep this constant usable from the status derivation and the "Coming up" filter.
 */
export const RENEWS_SOON_WITHIN_DAYS = 7;

/**
 * Advance an anchor date by one billing cycle, forward from `now`, preserving the anchor's
 * day-of-month across short months (31 Jan monthly → 28 or 29 Feb → 31 Mar).
 *
 * Called at render time, so it's cheap, pure, and deterministic — the only state is `anchorDate`
 * and `now`. Dates are treated in local time to match the rest of the app.
 */
export function nextChargeDate(anchorDate: Date, cycle: BillingCycle, now: Date): Date {
  // If the anchor is still in the future, that IS the next charge — nothing to roll forward.
  if (anchorDate.getTime() > now.getTime()) return new Date(anchorDate.getTime());

  // Walk forward one cycle at a time until we land strictly after `now`. Clearer than computing
  // the number of cycles analytically (which gets fiddly for month-end anchors), and in practice
  // runs for a handful of iterations.
  let next = new Date(anchorDate.getTime());
  while (next.getTime() <= now.getTime()) {
    next = advance(anchorDate, next, cycle);
  }
  return next;
}

/**
 * Derive the current status from an anchor renewal date and the day-of-month anchoring semantics.
 * `isPaused` and `isTrial` dominate; otherwise the item is "expiring" (renews soon) within the window.
 */
export function deriveBillingStatus(args: {
  anchorDate: Date;
  cycle: BillingCycle;
  now: Date;
  isTrial?: boolean;
  isPaused?: boolean;
}): SubscriptionStatus {
  if (args.isPaused) return 'paused';
  if (args.isTrial) return 'trial';
  const upcoming = nextChargeDate(args.anchorDate, args.cycle, args.now);
  const days = differenceInCalendarDays(upcoming, args.now);
  return days >= 0 && days <= RENEWS_SOON_WITHIN_DAYS ? 'expiring' : 'active';
}

/**
 * Advance `cursor` by one cycle anchored on `anchor`'s day-of-month. For `yearly`, add 12 months;
 * for `quarterly`, 3; for `monthly`, 1 — the caller loops until the result is in the future.
 */
function advance(anchor: Date, cursor: Date, cycle: BillingCycle): Date {
  const monthsToAdd = cycle === 'yearly' ? 12 : cycle === 'quarterly' ? 3 : 1;
  const targetYear = cursor.getFullYear();
  const targetMonth = cursor.getMonth() + monthsToAdd;

  // Anchor to the ORIGINAL day-of-month, not the cursor's — otherwise a 31 Jan anchor that landed on
  // 28 Feb would stay at 28 for every subsequent month. Clamp to the target month's last day.
  const anchorDay = anchor.getDate();
  const lastDay = daysInMonth(targetYear, targetMonth);
  const day = Math.min(anchorDay, lastDay);

  const next = new Date(targetYear, targetMonth, day);
  // Preserve the time-of-day from the anchor so the renewal keeps its hour/minute.
  next.setHours(anchor.getHours(), anchor.getMinutes(), anchor.getSeconds(), 0);
  return next;
}

/** Number of days in a given year/month. JS normalises an out-of-range month, so month+12 works. */
function daysInMonth(year: number, monthIndex: number): number {
  // Day 0 of the next month === last day of this month.
  return new Date(year, monthIndex + 1, 0).getDate();
}
