import { useMemo } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { categoryOrder } from '@/lib/seed';
import { useSubscriptionsStore } from '@/lib/subscriptions-store';
import { entry } from '@/lib/tokens';
import { categoryLabel, formatMoney, monthlyEquivalent } from '@/lib/utils';
import type { SubscriptionCategory } from '@/types/subscription';

import { Card } from './card';
import { EmptyState } from './empty-state';
import { Text } from './text';

type Row = {
  category: SubscriptionCategory;
  spend: number;
  share: number;
};

const COUNT_UP_MS = 600;

/** Shows what each category costs each month, with a share-of-total bar. */
export function CategoryBreakdown() {
  const items = useSubscriptionsStore((s) => s.items);
  const currency = useSubscriptionsStore((s) => s.currency);

  const rows = useMemo<Row[]>(() => {
    // Only items in the primary currency contribute — never mix currencies in a sum.
    const active = items.filter((s) => s.status !== 'paused' && s.currency === currency);
    const totals = new Map<SubscriptionCategory, number>();
    for (const sub of active) {
      const monthly = monthlyEquivalent(sub.price, sub.billingCycle);
      totals.set(sub.category, (totals.get(sub.category) ?? 0) + monthly);
    }
    const total = [...totals.values()].reduce((sum, n) => sum + n, 0);
    return categoryOrder
      .map<Row>((category) => ({
        category,
        spend: Math.round(totals.get(category) ?? 0),
        share: total > 0 ? (totals.get(category) ?? 0) / total : 0,
      }))
      .filter((row) => row.spend > 0)
      .sort((a, b) => b.spend - a.spend);
  }, [items, currency]);

  if (rows.length === 0) {
    return (
      <Card>
        <EmptyState message="Add a subscription to see where your money goes." />
      </Card>
    );
  }

  return (
    <Card className="gap-4">
      {rows.map((row, i) => (
        <BreakdownRow key={row.category} row={row} index={i} />
      ))}
    </Card>
  );
}

type BreakdownRowProps = { row: Row; index: number };

function BreakdownRow({ row, index }: BreakdownRowProps) {
  const currency = useSubscriptionsStore((s) => s.currency);
  const progress = useSharedValue(0);

  // Delay by stagger so bars grow in a wave, not all at once.
  progress.set(
    withDelay(
      index * entry.stagger,
      withTiming(row.share, { duration: COUNT_UP_MS, easing: Easing.out(Easing.cubic) }),
    ),
  );

  const barStyle = useAnimatedStyle(() => ({
    width: `${Math.max(2, progress.get() * 100)}%`,
  }));

  return (
    <View
      className="gap-2"
      accessible
      accessibilityLabel={`${categoryLabel[row.category]}, ${formatMoney(row.spend, currency)} a month, ${Math.round(row.share * 100)} percent`}>
      <View className="flex-row items-baseline justify-between">
        <Text variant="body" tone="ink">
          {categoryLabel[row.category]}
        </Text>
        <Text variant="mono" tone="ink">
          {formatMoney(row.spend, currency)}
        </Text>
      </View>
      <View className="h-3 overflow-hidden rounded-pill border border-line bg-bg-raised">
        <Animated.View
          className="h-full rounded-pill bg-teal"
          style={barStyle}
          aria-hidden={true}
        />
      </View>
    </View>
  );
}
