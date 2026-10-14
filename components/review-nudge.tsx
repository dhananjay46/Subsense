import { formatDistanceToNowStrict } from 'date-fns';
import { Fragment } from 'react';
import { View } from 'react-native';

import { useSubscriptionsStore } from '@/lib/subscriptions-store';
import { formatPrice } from '@/lib/utils';
import type { CurrencyCode } from '@/lib/currencies';
import type { Subscription } from '@/types/subscription';

import { Card } from './card';
import { Divider } from './divider';
import { HapticPressable } from './haptic-pressable';
import { Text } from './text';

export type ReviewNudgeProps = {
  items: Subscription[];
  onSelect: (subscription: Subscription) => void;
};

/** HMW6 / Theme C: "Is it still worth it?" — surface subscriptions the user hasn't confirmed. */
export function ReviewNudge({ items, onSelect }: ReviewNudgeProps) {
  const markReviewed = useSubscriptionsStore((s) => s.markReviewed);
  const currency = useSubscriptionsStore((s) => s.currency);

  if (items.length === 0) return null;

  return (
    <Card padding="none">
      <View className="gap-1 p-4 pb-3">
        <Text variant="title">Still worth it?</Text>
        <Text variant="caption" tone="muted">
          You haven't checked in on these in a while. One tap to confirm, or open to cancel.
        </Text>
      </View>
      <View className="px-4">
        {items.map((item, i) => (
          <Fragment key={item.id}>
            {i > 0 && <Divider />}
            <ReviewRow
              item={item}
              currency={currency}
              onKeep={() => markReviewed(item.id)}
              onOpen={() => onSelect(item)}
            />
          </Fragment>
        ))}
      </View>
    </Card>
  );
}

type ReviewRowProps = {
  item: Subscription;
  currency: CurrencyCode;
  onKeep: () => void;
  onOpen: () => void;
};

function ReviewRow({ item, currency, onKeep, onOpen }: ReviewRowProps) {
  const lastSeen = item.lastReviewedOn
    ? `Last reviewed ${formatDistanceToNowStrict(item.lastReviewedOn)} ago`
    : 'Never reviewed';

  return (
    <View className="flex-row items-center gap-3 py-4">
      <HapticPressable
        accessibilityRole="button"
        accessibilityLabel={`${item.name} details`}
        accessibilityHint="Opens details"
        onPress={onOpen}
        enforceMinSize={false}
        className="flex-1 gap-1">
        <Text variant="title" numberOfLines={1}>
          {item.name}
        </Text>
        <Text variant="caption" tone="muted" numberOfLines={1}>
          {formatPrice(item.price, item.billingCycle, currency)} · {lastSeen}
        </Text>
      </HapticPressable>
      <HapticPressable
        haptic="selection"
        accessibilityRole="button"
        accessibilityLabel={`Keep ${item.name}`}
        accessibilityHint="Marks this subscription as reviewed"
        onPress={onKeep}
        pressScale={0.96}
        enforceMinSize={false}
        className="h-10 items-center justify-center rounded-pill border border-line-strong bg-bg-raised px-4">
        <Text variant="caption" tone="ink">
          Keep
        </Text>
      </HapticPressable>
    </View>
  );
}
