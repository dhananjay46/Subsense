import { View, type ViewProps } from 'react-native';

import { cx } from '@/lib/utils';

import { HapticPressable, type HapticPressableProps } from './haptic-pressable';

export type CardPadding = 'none' | 'compact' | 'default' | 'feature';

/** Paper with a line: surface, 1px border, radius 24. Never a shadow. */
const cardClass = 'rounded-xl border border-line bg-surface';

const paddingClass: Record<CardPadding, string> = {
  none: '',
  compact: 'p-4',
  default: 'p-5',
  feature: 'p-6',
};

export type CardProps = ViewProps & {
  padding?: CardPadding;
  className?: string;
};

export function Card({ padding = 'default', className, ...rest }: CardProps) {
  return <View className={cx(cardClass, paddingClass[padding], className)} {...rest} />;
}

export type PressableCardProps = HapticPressableProps & {
  padding?: CardPadding;
};

export function PressableCard({ padding = 'default', className, ...rest }: PressableCardProps) {
  return <HapticPressable className={cx(cardClass, paddingClass[padding], className)} {...rest} />;
}
