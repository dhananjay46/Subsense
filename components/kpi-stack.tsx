import { View, type ViewStyle } from 'react-native';

import { colors } from '@/lib/tokens';
import { formatCount, formatMoney } from '@/lib/utils';
import type { DashboardSummary } from '@/types/subscription';

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
        display="currency"
        currency={summary.monthlySpendCurrency}
        accessibilityValue={formatMoney(summary.monthlySpend, summary.monthlySpendCurrency)}
      />
      <KPI
        label="Active"
        value={summary.activeCount}
        display="count"
        accessibilityValue={formatCount(summary.activeCount)}
      />
      <KPI
        label="Due this week"
        value={summary.dueThisWeek}
        display="count"
        tone={summary.dueThisWeek > 0 ? 'coral-ink' : 'ink'}
        accessibilityValue={formatCount(summary.dueThisWeek)}
      />
    </View>
  );
}

const kpiCardStyle: ViewStyle = {
  borderWidth: 1.5,
  borderColor: colors.kpiEdge,
  boxShadow: `0 3px 8px 0 ${colors.kpiGlow}`,
};

type KPIProps = {
  label: string;
  value: number;
  display: 'currency' | 'count';
  currency?: DashboardSummary['monthlySpendCurrency'];
  tone?: TextTone;
  accessibilityValue: string;
};

function KPI({ label, value, display, currency, tone = 'ink', accessibilityValue }: KPIProps) {
  return (
    <View
      className="flex-1 justify-between gap-3 rounded-md bg-surface p-4"
      style={kpiCardStyle}
      accessible
      accessibilityLabel={`${label}, ${accessibilityValue}`}>
      <Text variant="micro" tone="subtle" numberOfLines={2}>
        {label}
      </Text>
      <NumberDisplay value={value} display={display} currency={currency} size="sm" tone={tone} />
    </View>
  );
}
