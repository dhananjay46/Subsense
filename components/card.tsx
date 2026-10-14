import { View, type ViewProps } from 'react-native';

import { cx } from '@/lib/utils';

import { HapticPressable, type HapticPressableProps } from './haptic-pressable';

export type CardPadding = 'none' | 'compact' | 'default' | 'feature';

/** Paper with a line: surface, 1px border, radius 24. Never a shadow. */
const cardClass = 'rounded-xl border border-line bg-surface';

/**
 * Paper-edge lift — the lightest shadow we allow (DESIGN.md: depth from tonal shifts, not weight).
 * Use on cards that want a touch more presence than the default border provides.
 */
export const cardLift = {
  shadowColor: '#16161A',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.04,
  shadowRadius: 3,
  elevation: 1,
} as const;

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
