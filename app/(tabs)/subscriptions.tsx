import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Fragment, useMemo, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/card';
import { Chip } from '@/components/chip';
import { EmptyState } from '@/components/empty-state';
import { FAB } from '@/components/fab';
import { ScreenHeader } from '@/components/screen-header';
import { SearchBar } from '@/components/search-bar';
import { SubscriptionFormSheet } from '@/components/subscription-form-sheet';
import { SubscriptionRow } from '@/components/subscription-row';
import { SubscriptionSheet } from '@/components/subscription-sheet';
import { Text } from '@/components/text';
import { useScreenBottomPadding } from '@/lib/layout';
import { categoryOrder } from '@/lib/seed';
import { useSubscriptionsStore } from '@/lib/subscriptions-store';
import { useNow } from '@/lib/use-now';
import { categoryLabel, formatCount } from '@/lib/utils';
import type { Subscription, SubscriptionCategory } from '@/types/subscription';

type Filter = SubscriptionCategory | 'all';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'productivity', label: 'Productivity' },
  { value: 'cloud', label: 'Cloud' },
  { value: 'music', label: 'Music' },
  { value: 'finance', label: 'Finance' },
  { value: 'other', label: 'Other' },
];

/** Aligns the hairline under the row title, past monogram (44) + gap-4 (16). Mirrors RenewalTimeline. */
const DIVIDER_INSET = 60;

type Group = { category: SubscriptionCategory; items: Subscription[] };

function groupByCategory(
  subscriptions: Subscription[],
  order: SubscriptionCategory[],
): Group[] {
  return order
    .map<Group>((category) => ({
      category,
      items: subscriptions
        .filter((s) => s.category === category)
        .sort((a, b) => a.renewalDate.getTime() - b.renewalDate.getTime()),
    }))
    .filter((g) => g.items.length > 0);
}

export default function Subscriptions() {
  const now = useNow();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const items = useSubscriptionsStore((s) => s.items);
  const loadSampleData = useSubscriptionsStore((s) => s.loadSampleData);
  const bottomPadding = useScreenBottomPadding();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((s) => {
      if (filter !== 'all' && s.category !== filter) return false;
      if (!q) return true;
      return s.name.toLowerCase().includes(q) || s.planName.toLowerCase().includes(q);
    });
  }, [items, query, filter]);

  const groups = useMemo<Group[]>(
    () => groupByCategory(filtered, filter === 'all' ? categoryOrder : [filter]),
    [filtered, filter],
  );

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

  const subtitle = query.trim()
    ? `${formatCount(filtered.length)} of ${formatCount(items.length)} match`
    : `${formatCount(items.length)} subscriptions`;

  // When a specific filter is active, the chip row above already names the category — the
  // section label becomes redundant noise.
  const showSectionLabels = filter === 'all';

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <ScrollView
        contentContainerClassName="gap-6 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: bottomPadding }}
        showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Subscriptions" subtitle={subtitle} />

        {items.length > 0 ? (
          <>
            <SearchBar value={query} onChange={setQuery} placeholder="Search Netflix, Notion…" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8, paddingVertical: 2 }}>
              {FILTERS.map((option) => (
                <Chip
                  key={option.value}
                  label={option.label}
                  selected={filter === option.value}
                  onPress={() => setFilter(option.value)}
                  accessibilityLabel={`Filter by ${option.label}`}
                />
              ))}
            </ScrollView>
          </>
        ) : null}

        {items.length === 0 ? (
          <Card>
            <EmptyState
              message="Nothing yet. Add your first subscription to see what you're paying for."
              actionLabel="Explore with sample data"
              onAction={loadSampleData}
            />
          </Card>
        ) : groups.length === 0 ? (
          <Card>
            <EmptyState
              message={
                query.trim()
                  ? `Nothing matches "${query.trim()}". Try a different word.`
                  : `Nothing in ${filter === 'all' ? 'this view' : categoryLabel[filter]} yet.`
              }
            />
          </Card>
        ) : (
          groups.map((group) => (
            <View key={group.category} className="gap-3">
              {showSectionLabels ? (
                <Text variant="micro" tone="subtle" accessibilityRole="header">
                  {categoryLabel[group.category]}
                </Text>
              ) : null}
              <Card padding="none">
                <View className="px-5">
                  {group.items.map((subscription, i) => (
                    <Fragment key={subscription.id}>
                      {i > 0 && (
                        <View
                          className="h-px bg-line"
                          style={{ marginLeft: DIVIDER_INSET }}
                          aria-hidden={true}
                        />
                      )}
                      <SubscriptionRow
                        subscription={subscription}
                        now={now}
                        variant="detailed"
                        showCategoryChip={false}
                        onPress={openDetail}
                      />
                    </Fragment>
                  ))}
                </View>
              </Card>
            </View>
          ))
        )}
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
