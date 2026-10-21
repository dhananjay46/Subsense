import { endOfMonth, format, isAfter, subMonths } from 'date-fns';
import { useMemo } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { useSubscriptionsStore } from '@/lib/subscriptions-store';
import { entry, radius } from '@/lib/tokens';
import { formatMoney, monthlyEquivalent } from '@/lib/utils';

import { Card, cardLift } from './card';
import { EmptyState } from './empty-state';
import { Text } from './text';

const MONTHS = 6;
const BAR_HEIGHT = 120;
const COUNT_UP_MS = 600;

type Bar = { label: string; value: number };

/**
 * 6-month approximate trend: for each of the last 6 months we sum the monthly-equivalent
 * cost of every subscription that existed by month end. Growth = adding subs over time.
 */
export function MonthlyTrend() {
  const items = useSubscriptionsStore((s) => s.items);
  const currency = useSubscriptionsStore((s) => s.currency);

  const bars = useMemo<Bar[]>(() => {
    const now = new Date();
    return Array.from({ length: MONTHS }, (_, i) => {
      const month = subMonths(now, MONTHS - 1 - i);
      const endOfThisMonth = endOfMonth(month);
      // Only items in the primary currency contribute — the trend reads as a single-currency total.
      const active = items.filter(
        (s) =>
          s.status !== 'paused' &&
          s.currency === currency &&
          !isAfter(s.createdAt, endOfThisMonth),
      );
      const value = Math.round(
        active.reduce((sum, s) => sum + monthlyEquivalent(s.price, s.billingCycle), 0),
      );
      return { label: format(month, 'MMM'), value };
    });
  }, [items, currency]);

  const max = Math.max(...bars.map((b) => b.value), 1);
  const peakMonth = bars.reduce((a, b) => (b.value > a.value ? b : a), bars[0]);

  if (bars.every((b) => b.value === 0)) {
    return (
      <Card>
        <EmptyState message="Add a subscription to see your six-month trend." />
      </Card>
    );
  }

  return (
    <Card className="gap-5 border-coral/40" style={cardLift}>
      <View className="flex-row items-end justify-between">
        <View>
          <Text variant="title">Monthly trend</Text>
          <Text variant="caption" tone="muted">
            Last {MONTHS} months
          </Text>
        </View>
        <View className="items-end">
          <Text variant="mono-lg">{formatMoney(peakMonth.value, currency)}</Text>
          <Text variant="caption" tone="subtle">
            peak · {peakMonth.label}
          </Text>
        </View>
      </View>

      <View className="flex-row items-end justify-between" style={{ height: BAR_HEIGHT }}>
        {bars.map((bar, i) => (
          <TrendBar key={bar.label} bar={bar} max={max} index={i} />
        ))}
      </View>

      <View className="flex-row justify-between">
        {bars.map((bar) => (
          <View key={bar.label} className="items-center" style={{ width: 32 }}>
            <Text variant="mono" tone="subtle">
              {bar.label}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

type TrendBarProps = { bar: Bar; max: number; index: number };

function TrendBar({ bar, max, index }: TrendBarProps) {
  const progress = useSharedValue(0);
  const target = bar.value / max;

  progress.set(
    withDelay(
      index * entry.stagger,
      withTiming(target, { duration: COUNT_UP_MS, easing: Easing.out(Easing.cubic) }),
    ),
  );

  const style = useAnimatedStyle(() => ({
    height: `${Math.max(2, progress.get() * 100)}%`,
  }));

  return (
    <View className="items-center justify-end" style={{ width: 32, height: '100%' }}>
      <Animated.View
        className="w-6 bg-coral"
        style={[
          style,
          { borderTopLeftRadius: radius.sm, borderTopRightRadius: radius.sm },
        ]}
        aria-hidden={true}
      />
    </View>
  );
}
