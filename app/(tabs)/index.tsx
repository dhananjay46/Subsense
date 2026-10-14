import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/card';
import { CategoryBreakdown } from '@/components/category-breakdown';
import { EmptyState } from '@/components/empty-state';
import { Entrance } from '@/components/entrance';
import { FAB } from '@/components/fab';
import { HapticPressable } from '@/components/haptic-pressable';
import { KPIStack } from '@/components/kpi-stack';
import { MonthlyTrend } from '@/components/monthly-trend';
import { RenewalTimeline } from '@/components/renewal-timeline';
import { ReviewNudge } from '@/components/review-nudge';
import { SubscriptionFormSheet } from '@/components/subscription-form-sheet';
import { SubscriptionSheet } from '@/components/subscription-sheet';
import { Text } from '@/components/text';
import { loadProfile } from '@/lib/seed';
import { useDashboard, useSubscriptionsStore } from '@/lib/subscriptions-store';
import { greeting } from '@/lib/utils';
import type { Subscription } from '@/types/subscription';

export default function Home() {
  const [now] = useState(() => new Date());
  const dashboard = useDashboard(now);
  const resetToSample = useSubscriptionsStore((s) => s.resetToSample);
  const itemCount = useSubscriptionsStore((s) => s.items.length);

  const detailRef = useRef<BottomSheetModal>(null);
  const formRef = useRef<BottomSheetModal>(null);
  const [selected, setSelected] = useState<Subscription | null>(null);
  const [editing, setEditing] = useState<Subscription | null>(null);

  const openDetail = (subscription: Subscription) => {
    setSelected(subscription);
    detailRef.current?.present();
  };

  const openEdit = (subscription: Subscription) => {
    detailRef.current?.dismiss();
    setEditing(subscription);
    setTimeout(() => formRef.current?.present(), 220);
  };

  const openAdd = () => {
    setEditing(null);
    formRef.current?.present();
  };

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <ScrollView
        contentContainerClassName="gap-8 px-4 pb-40 pt-4"
        showsVerticalScrollIndicator={false}>
        <Entrance index={0}>
          <HeaderBar name={loadProfile().name} now={now} />
        </Entrance>

        <Entrance index={1}>
          <KPIStack summary={dashboard.summary} />
        </Entrance>

        <Entrance index={2}>
          <View className="gap-3">
            <Text variant="micro" tone="subtle" accessibilityRole="header">
              Where it goes
            </Text>
            <CategoryBreakdown />
          </View>
        </Entrance>

        {dashboard.needsReview.length > 0 ? (
          <Entrance index={3}>
            <View className="gap-3">
              <Text variant="micro" tone="subtle" accessibilityRole="header">
                Check back
              </Text>
              <ReviewNudge items={dashboard.needsReview} onSelect={openDetail} />
            </View>
          </Entrance>
        ) : null}

        <Entrance index={4}>
          <View className="gap-3">
            <Text variant="micro" tone="subtle" accessibilityRole="header">
              Coming up
            </Text>
            {dashboard.upcoming.length > 0 ? (
              <RenewalTimeline items={dashboard.upcoming} now={now} onSelect={openDetail} />
            ) : (
              <Card>
                <EmptyState
                  message={
                    itemCount === 0
                      ? "Nothing yet. Add your first subscription."
                      : 'All quiet. Nothing renews in the next few weeks.'
                  }
                  actionLabel={itemCount === 0 ? 'Add sample subscriptions' : undefined}
                  onAction={itemCount === 0 ? resetToSample : undefined}
                />
              </Card>
            )}
          </View>
        </Entrance>

        <Entrance index={5}>
          <View className="gap-3">
            <Text variant="micro" tone="subtle" accessibilityRole="header">
              Spending insights
            </Text>
            <MonthlyTrend />
          </View>
        </Entrance>
      </ScrollView>

      <FAB label="Add" onPress={openAdd} accessibilityHint="Add a new subscription" />

      <SubscriptionSheet
        ref={detailRef}
        subscription={selected}
        now={now}
        onClose={() => detailRef.current?.dismiss()}
        onEdit={openEdit}
      />
      <SubscriptionFormSheet
        ref={formRef}
        existing={editing}
        onDismiss={() => setEditing(null)}
      />
    </SafeAreaView>
  );
}

type HeaderBarProps = { name: string; now: Date };

/**
 * Spec: "Subsense" on the left (Fraunces 500), tappable gear on the right that routes
 * to Settings. Second line is the time-based greeting.
 */
function HeaderBar({ name, now }: HeaderBarProps) {
  return (
    <View className="gap-1">
      <View className="flex-row items-center justify-between">
        <Text variant="display-md" accessibilityRole="header">
          Subsense
        </Text>
        <HapticPressable
          haptic="selection"
          accessibilityRole="button"
          accessibilityLabel="Settings"
          accessibilityHint="Opens the settings tab"
          onPress={() => router.push('/settings')}
          enforceMinSize={false}
          className="h-11 w-11 items-center justify-center rounded-pill border border-line bg-surface">
          <Text variant="title" tone="muted" aria-hidden={true}>
            ⚙
          </Text>
        </HapticPressable>
      </View>
      <Text variant="body-lg" tone="muted">
        {greeting(now)}, {name}
      </Text>
    </View>
  );
}
