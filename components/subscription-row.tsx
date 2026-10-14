import { View } from 'react-native';

import { useSubscriptionsStore } from '@/lib/subscriptions-store';
import {
  categoryLabel,
  cycleLabel,
  formatMoney,
  formatPrice,
  renewalLabel,
  renewsPhrase,
  statusLabel,
} from '@/lib/utils';
import type { Subscription } from '@/types/subscription';

import { Chip } from './chip';
import { HapticPressable } from './haptic-pressable';
import { Text, type TextTone } from './text';

export type SubscriptionRowVariant = 'compact' | 'detailed';

export type SubscriptionRowProps = {
  subscription: Subscription;
  now: Date;
  /** compact: plan + relative date (timeline). detailed: category and status chips (list). */
  variant?: SubscriptionRowVariant;
  onPress: (subscription: Subscription) => void;
};

export function SubscriptionRow({
  subscription,
  now,
  variant = 'compact',
  onPress,
}: SubscriptionRowProps) {
  const currency = useSubscriptionsStore((s) => s.currency);
  const { name, planName, price, billingCycle, renewalDate, category, status } = subscription;
  const accessibilityLabel = [
    name,
    formatPrice(price, billingCycle, currency),
    renewsPhrase(renewalDate, now),
    variant === 'detailed' ? statusLabel[status] : null,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <HapticPressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint="Opens details"
      onPress={() => onPress(subscription)}
      className="flex-row items-center gap-4 py-4">
      <Monogram subscription={subscription} />

      <View className="flex-1 gap-1">
        <Text variant="title" numberOfLines={1}>
          {name}
        </Text>
        {variant === 'compact' ? (
          <Text variant="caption" tone="muted" numberOfLines={1}>
            {planName}
          </Text>
        ) : (
          <>
            <Text variant="caption" tone="muted" numberOfLines={1}>
              {renewsPhrase(renewalDate, now)}
            </Text>
            <View className="flex-row flex-wrap gap-2 pt-1">
              <Chip label={categoryLabel[category]} />
              <Chip
                label={statusLabel[status]}
                tone={
                  status === 'expiring'
                    ? 'amber'
                    : status === 'paused'
                      ? 'rose'
                      : status === 'trial'
                        ? 'coral'
                        : 'teal'
                }
              />
            </View>
          </>
        )}
      </View>

      <View className="items-end gap-1">
        <Text variant="mono">{formatMoney(price, currency)}</Text>
        <Text variant="caption" tone="subtle">
          {variant === 'compact' ? renewalLabel(renewalDate, now) : `a ${cycleLabel(billingCycle)}`}
        </Text>
      </View>
    </HapticPressable>
  );
}

type MonogramProps = { subscription: Subscription };

const colorBg: Record<string, string> = {
  coral: 'bg-coral-soft',
  teal: 'bg-teal-soft',
  amber: 'bg-amber-soft',
  rose: 'bg-rose-soft',
  ink: 'bg-bg-raised',
};

const colorText: Record<string, TextTone> = {
  coral: 'coral',
  teal: 'teal',
  amber: 'amber',
  rose: 'rose',
  ink: 'ink',
};

/** Category-tinted squircle with the subscription's iconLetter: no shadows, 1px line for depth. */
function Monogram({ subscription }: MonogramProps) {
  const bg = colorBg[subscription.iconColor] ?? 'bg-bg-raised';
  const text = colorText[subscription.iconColor] ?? 'muted';
  return (
    <View
      className={`h-11 w-11 items-center justify-center rounded-lg border border-line ${bg}`}
      aria-hidden={true}>
      <Text variant="title" tone={text}>
        {subscription.iconLetter}
      </Text>
    </View>
  );
}
