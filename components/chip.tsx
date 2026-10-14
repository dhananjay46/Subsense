import { View, type Insets } from 'react-native';

import { cx } from '@/lib/utils';

import { HapticPressable } from './haptic-pressable';
import { Text, type TextTone } from './text';

export type ChipTone = 'neutral' | 'coral' | 'teal' | 'amber' | 'rose';

export type ChipProps = {
  label: string;
  tone?: ChipTone;
  /** Selected chips render coral-soft, regardless of tone. */
  selected?: boolean;
  /** Present → the chip is a toggle with a selection haptic. */
  onPress?: () => void;
  accessibilityLabel?: string;
};

const toneStyle: Record<ChipTone, { box: string; text: TextTone }> = {
  neutral: { box: 'border border-line bg-transparent', text: 'ink' },
  coral: { box: 'bg-coral-soft', text: 'coral' },
  teal: { box: 'bg-teal-soft', text: 'teal' },
  amber: { box: 'bg-amber-soft', text: 'amber' },
  rose: { box: 'bg-rose-soft', text: 'rose' },
};

/** 32 tall + 6 above and below = a 44pt target without a 44pt-tall chip. */
const chipHitSlop: Insets = { top: 6, bottom: 6 };

export function Chip({ label, tone = 'neutral', selected = false, onPress, accessibilityLabel }: ChipProps) {
  const style = selected
    ? { box: 'bg-ink', text: 'surface' as const }
    : toneStyle[tone];
  const box = cx('h-9 flex-row items-center rounded-pill px-4', style.box);
  const text = (
    <Text variant="caption" tone={style.text} numberOfLines={1}>
      {label}
    </Text>
  );

  if (!onPress) {
    return (
      <View className={box} accessible accessibilityLabel={accessibilityLabel ?? label}>
        {text}
      </View>
    );
  }

  return (
    <HapticPressable
      haptic="selection"
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected }}
      onPress={onPress}
      hitSlop={chipHitSlop}
      enforceMinSize={false}
      className={box}>
      {text}
    </HapticPressable>
  );
}
