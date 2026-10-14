import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { differenceInCalendarDays, format } from 'date-fns';
import * as WebBrowser from 'expo-web-browser';
import { useRef, type Ref } from 'react';
import { Alert, View } from 'react-native';

import { triggerHaptic } from '@/lib/haptics';
import { useSubscriptionsStore } from '@/lib/subscriptions-store';
import { categoryLabel, cycleLabel, formatMoney, renewsPhrase, statusLabel } from '@/lib/utils';
import type { Subscription } from '@/types/subscription';

import { Button } from './button';
import { Chip } from './chip';
import { ConfirmSheet } from './confirm-sheet';
import { Divider } from './divider';
import { Sheet } from './sheet';
import { Text } from './text';

export type SubscriptionSheetProps = {
  ref?: Ref<BottomSheetModal>;
  subscription: Subscription | null;
  now: Date;
  onClose: () => void;
  onEdit: (subscription: Subscription) => void;
};

const DETAIL_SNAP = ['55%', '90%'];

export function SubscriptionSheet({
  ref,
  subscription,
  now,
  onClose,
  onEdit,
}: SubscriptionSheetProps) {
  const remove = useSubscriptionsStore((s) => s.remove);
  const togglePause = useSubscriptionsStore((s) => s.togglePause);
  const markReviewed = useSubscriptionsStore((s) => s.markReviewed);
  const currency = useSubscriptionsStore((s) => s.currency);
  const confirmRef = useRef<BottomSheetModal>(null);

  const openDeleteConfirm = () => {
    if (!subscription) return;
    confirmRef.current?.present();
  };

  const doDelete = () => {
    if (!subscription) return;
    remove(subscription.id);
    onClose();
  };

  const onTogglePause = () => {
    if (!subscription) return;
    triggerHaptic('medium');
    togglePause(subscription.id);
  };

  const onCancelFlow = async () => {
    if (!subscription?.cancelUrl) return;
    triggerHaptic('medium');
    try {
      await WebBrowser.openBrowserAsync(subscription.cancelUrl);
    } catch {
      Alert.alert(
        'Could not open the cancel page',
        "The provider's cancel link didn't open. Try again, or do it from their app.",
      );
    }
  };

  const onKeepIt = () => {
    if (!subscription) return;
    triggerHaptic('selection');
    markReviewed(subscription.id);
  };

  return (
    <>
      <Sheet
        ref={ref}
        snapPoints={DETAIL_SNAP}
        accessibilityLabel={subscription ? `${subscription.name} details` : 'Subscription details'}>
        {subscription && (
          <View className="gap-5">
            <View className="gap-1">
              <Text variant="display-md" accessibilityRole="header">
                {subscription.name}
              </Text>
              <Text variant="body" tone="muted">
                {subscription.planName}
              </Text>
            </View>

            {subscription.isTrial ? (
              <TrialCallout renewsOn={subscription.renewalDate} now={now} />
            ) : null}

            <View className="flex-row items-end justify-between">
              <View className="flex-row items-baseline gap-2">
                <Text variant="mono-lg">{formatMoney(subscription.price, currency)}</Text>
                <Text variant="caption" tone="subtle">
                  a {cycleLabel(subscription.billingCycle)}
                </Text>
              </View>
              <Text variant="caption" tone="muted">
                {renewsPhrase(subscription.renewalDate, now)},{' '}
                {format(subscription.renewalDate, 'd MMM')}
              </Text>
            </View>

            <View className="flex-row flex-wrap gap-2">
              <Chip label={categoryLabel[subscription.category]} />
              <Chip
                label={statusLabel[subscription.status]}
                tone={
                  subscription.status === 'expiring'
                    ? 'amber'
                    : subscription.status === 'paused'
                      ? 'rose'
                      : subscription.status === 'trial'
                        ? 'coral'
                        : 'teal'
                }
              />
            </View>

            <Divider />

            <MetaRow
              label="Paid by"
              value={subscription.owner ?? 'Not set — tap Edit to add'}
            />
            <MetaRow
              label="Last reviewed"
              value={
                subscription.lastReviewedOn
                  ? format(subscription.lastReviewedOn, 'd MMM yyyy')
                  : 'Never'
              }
            />

            <View className="gap-3 pt-2">
              <Button label="Still worth it" onPress={onKeepIt} />
              <Button
                label="Cancel on provider site"
                variant="secondary"
                onPress={onCancelFlow}
                disabled={!subscription.cancelUrl}
                accessibilityHint={
                  subscription.cancelUrl
                    ? "Opens the provider's cancel page"
                    : 'Add a cancel link in Edit first'
                }
              />
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Button
                    label="Edit"
                    variant="secondary"
                    size="compact"
                    onPress={() => onEdit(subscription)}
                  />
                </View>
                <View className="flex-1">
                  <Button
                    label={subscription.status === 'paused' ? 'Resume' : 'Pause'}
                    variant="secondary"
                    size="compact"
                    onPress={onTogglePause}
                  />
                </View>
                <View className="flex-1">
                  <Button
                    label="Delete"
                    variant="destructive"
                    size="compact"
                    onPress={openDeleteConfirm}
                  />
                </View>
              </View>
            </View>
          </View>
        )}
      </Sheet>

      <ConfirmSheet
        ref={confirmRef}
        title={subscription ? `Remove ${subscription.name}?` : 'Remove subscription?'}
        body="You can add it back any time, but we won't nudge you about this one again."
        confirmLabel="Remove"
        onConfirm={doDelete}
      />
    </>
  );
}

type MetaRowProps = { label: string; value: string };

function MetaRow({ label, value }: MetaRowProps) {
  return (
    <View className="flex-row items-center justify-between">
      <Text variant="caption" tone="subtle">
        {label}
      </Text>
      <Text variant="body" numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

type TrialCalloutProps = { renewsOn: Date; now: Date };

function TrialCallout({ renewsOn, now }: TrialCalloutProps) {
  const days = Math.max(0, differenceInCalendarDays(renewsOn, now));
  const when =
    days === 0 ? 'today' : days === 1 ? 'tomorrow' : `in ${days} days (${format(renewsOn, 'd MMM')})`;
  return (
    <View className="rounded-md border border-coral-soft bg-coral-soft p-4">
      <Text variant="caption" tone="coral">
        TRIAL CONVERTS {when.toUpperCase()}
      </Text>
      <Text variant="body" tone="ink" className="pt-1">
        You'll be charged automatically unless you cancel first.
      </Text>
    </View>
  );
}
