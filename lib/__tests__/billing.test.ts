import { deriveBillingStatus, nextChargeDate, RENEWS_SOON_WITHIN_DAYS } from '../billing';

const d = (year: number, month1Indexed: number, day: number, hours = 10) =>
  new Date(year, month1Indexed - 1, day, hours);

describe('nextChargeDate — monthly', () => {
  it('returns the anchor when it is still in the future', () => {
    const anchor = d(2026, 2, 15);
    const now = d(2026, 2, 10);
    expect(nextChargeDate(anchor, 'monthly', now)).toEqual(anchor);
  });

  it('rolls forward from an elapsed anchor to the next month', () => {
    const anchor = d(2026, 1, 15);
    const now = d(2026, 1, 20);
    expect(nextChargeDate(anchor, 'monthly', now)).toEqual(d(2026, 2, 15));
  });

  it('clamps a 31 Jan anchor to 28 Feb in a non-leap year', () => {
    const anchor = d(2026, 1, 31);
    const now = d(2026, 2, 1);
    expect(nextChargeDate(anchor, 'monthly', now)).toEqual(d(2026, 2, 28));
  });

  it('clamps a 31 Jan anchor to 29 Feb in a leap year', () => {
    const anchor = d(2024, 1, 31);
    const now = d(2024, 2, 1);
    expect(nextChargeDate(anchor, 'monthly', now)).toEqual(d(2024, 2, 29));
  });

  it('restores the anchor day in a long month after a short-month clamp (31 Jan → 28 Feb → 31 Mar)', () => {
    const anchor = d(2026, 1, 31);
    const now = d(2026, 3, 1);
    expect(nextChargeDate(anchor, 'monthly', now)).toEqual(d(2026, 3, 31));
  });

  it('skips multiple elapsed months in one call', () => {
    const anchor = d(2026, 1, 15);
    const now = d(2026, 5, 10);
    expect(nextChargeDate(anchor, 'monthly', now)).toEqual(d(2026, 5, 15));
  });

  it('crosses year boundaries', () => {
    const anchor = d(2025, 12, 31);
    const now = d(2026, 1, 10);
    expect(nextChargeDate(anchor, 'monthly', now)).toEqual(d(2026, 1, 31));
  });
});

describe('nextChargeDate — quarterly', () => {
  it('adds three months', () => {
    const anchor = d(2026, 1, 15);
    const now = d(2026, 2, 1);
    expect(nextChargeDate(anchor, 'quarterly', now)).toEqual(d(2026, 4, 15));
  });

  it('clamps a 31 Jan quarterly anchor to 30 Apr', () => {
    const anchor = d(2026, 1, 31);
    const now = d(2026, 2, 1);
    expect(nextChargeDate(anchor, 'quarterly', now)).toEqual(d(2026, 4, 30));
  });
});

describe('nextChargeDate — yearly', () => {
  it('adds one year', () => {
    const anchor = d(2026, 3, 10);
    const now = d(2026, 4, 1);
    expect(nextChargeDate(anchor, 'yearly', now)).toEqual(d(2027, 3, 10));
  });

  it('handles 29 Feb → 28 Feb on a non-leap year', () => {
    const anchor = d(2024, 2, 29);
    const now = d(2025, 1, 1);
    expect(nextChargeDate(anchor, 'yearly', now)).toEqual(d(2025, 2, 28));
  });

  it('restores 29 Feb in the next leap year after a non-leap clamp', () => {
    const anchor = d(2024, 2, 29);
    const now = d(2027, 3, 1);
    expect(nextChargeDate(anchor, 'yearly', now)).toEqual(d(2028, 2, 29));
  });
});

describe('deriveBillingStatus', () => {
  it('is paused when isPaused', () => {
    expect(
      deriveBillingStatus({
        anchorDate: d(2026, 2, 10),
        cycle: 'monthly',
        now: d(2026, 2, 1),
        isPaused: true,
      }),
    ).toBe('paused');
  });

  it('is trial when isTrial and not paused', () => {
    expect(
      deriveBillingStatus({
        anchorDate: d(2026, 2, 10),
        cycle: 'monthly',
        now: d(2026, 2, 1),
        isTrial: true,
      }),
    ).toBe('trial');
  });

  it('is expiring within the renews-soon window', () => {
    expect(
      deriveBillingStatus({
        anchorDate: d(2026, 2, 5),
        cycle: 'monthly',
        now: d(2026, 2, 1),
      }),
    ).toBe('expiring');
  });

  it('is active past the renews-soon window', () => {
    expect(
      deriveBillingStatus({
        anchorDate: d(2026, 3, 20),
        cycle: 'monthly',
        now: d(2026, 2, 1),
      }),
    ).toBe('active');
  });

  it('exposes RENEWS_SOON_WITHIN_DAYS as a shared constant', () => {
    expect(RENEWS_SOON_WITHIN_DAYS).toBe(7);
  });
});
