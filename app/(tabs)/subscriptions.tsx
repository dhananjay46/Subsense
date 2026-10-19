import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { FlashList } from '@shopify/flash-list';
import { useMemo, useRef, useState, type ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/card';
import { Chip } from '@/components/chip';
import { Divider } from '@/components/divider';
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

type ListItem =
  | { type: 'header'; key: string; title: string }
  | { type: 'row'; key: string; subscription: Subscription; isLastInGroup: boolean };

function toListItems(subscriptions: Subscription[], order: SubscriptionCategory[]): ListItem[] {
  return order.flatMap((category) => {
    const group = subscriptions
      .filter((s) => s.category === category)
      .sort((a, b) => a.renewalDate.getTime() - b.renewalDate.getTime());
    if (group.length === 0) return [];
    const header: ListItem = {
      type: 'header',
      key: `header-${category}`,
      title: categoryLabel[category],
    };
    const rows = group.map<ListItem>((subscription, i) => ({
      type: 'row',
      key: subscription.id,
      subscription,
      isLastInGroup: i === group.length - 1,
    }));
    return [header, ...rows];
  });
}

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

  const listOrder = useMemo<SubscriptionCategory[]>(
    () => (filter === 'all' ? categoryOrder : [filter]),
    [filter],
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

  const header = (
    <View className="gap-4">
      <ScreenHeader title="Subscriptions" subtitle={subtitle} />
      {items.length > 0 ? (
        <>
          <SearchBar value={query} onChange={setQuery} placeholder="Search Netflix, Notion…" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}>
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
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      {items.length > 0 ? (
        <FlashList
          data={toListItems(filtered, listOrder)}
          keyExtractor={(item) => item.key}
          getItemType={(item) => item.type}
          ListHeaderComponent={<View className="px-4 pt-4">{header}</View>}
          ListEmptyComponent={
            <View className="px-4 pt-6">
              <Card>
                <EmptyState
                  message={
                    query.trim()
                      ? `Nothing matches "${query.trim()}". Try a different word.`
                      : `Nothing in ${filter === 'all' ? 'this view' : categoryLabel[filter]} yet.`
                  }
                />
              </Card>
            </View>
          }
          contentContainerStyle={{ paddingBottom: bottomPadding }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) =>
            item.type === 'header' ? (
              <View className="px-4 pb-1 pt-8">
                <Text variant="micro" tone="subtle" accessibilityRole="header">
                  {item.title}
                </Text>
              </View>
            ) : (
              <View className="px-4">
                <SubscriptionRow
                  subscription={item.subscription}
                  now={now}
                  variant="detailed"
                  onPress={openDetail}
                />
                {!item.isLastInGroup && <Divider />}
              </View>
            )
          }
        />
      ) : (
        <StatePane header={header}>
          <Card>
            <EmptyState
              message="Nothing yet. Add your first subscription to see what you're paying for."
              actionLabel="Explore with sample data"
              onAction={loadSampleData}
            />
          </Card>
        </StatePane>
      )}

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

type StatePaneProps = { header: ReactNode; children: ReactNode };

function StatePane({ header, children }: StatePaneProps) {
  return (
    <View className="flex-1 gap-8 px-4 pt-4">
      {header}
      {children}
    </View>
  );
}
