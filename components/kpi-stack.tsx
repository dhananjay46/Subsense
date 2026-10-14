import { View } from 'react-native';

import { formatCount, formatINR } from '@/lib/utils';
import type { DashboardSummary } from '@/types/subscription';

import { cardLift } from './card';
import { NumberDisplay } from './number-display';
import { Text, type TextTone } from './text';

export type KPIStackProps = {
  summary: DashboardSummary;
};

export function KPIStack({ summary }: KPIStackProps) {
  return (
    <View className="flex-row gap-2">
      <KPI
        label="Monthly spend"
        value={summary.monthlySpend}
        currency="INR"
        accessibilityValue={formatINR(summary.monthlySpend)}
      />
      <KPI
        label="Active"
        value={summary.activeCount}
        currency="none"
        accessibilityValue={formatCount(summary.activeCount)}
      />
      <KPI
        label="Due this week"
        value={summary.dueThisWeek}
        currency="none"
        tone={summary.dueThisWeek > 0 ? 'coral' : 'ink'}
        accessibilityValue={formatCount(summary.dueThisWeek)}
      />
    </View>
  );
}

type KPIProps = {
  label: string;
  value: number;
  currency: 'INR' | 'none';
  tone?: TextTone;
  accessibilityValue: string;
};

function KPI({ label, value, currency, tone = 'ink', accessibilityValue }: KPIProps) {
  return (
    <View
      className="flex-1 justify-between gap-3 rounded-xl border border-coral/40 bg-surface p-4"
      style={cardLift}
      accessible
      accessibilityLabel={`${label}, ${accessibilityValue}`}>
      <Text variant="micro" tone="subtle" numberOfLines={2}>
        {label}
      </Text>
      <NumberDisplay value={value} currency={currency} size="sm" tone={tone} />
    </View>
  );
}
