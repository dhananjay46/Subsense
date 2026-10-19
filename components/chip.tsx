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

type Visual = { box: string; text: TextTone };

const toneStyle: Record<ChipTone, Visual> = {
  // Unselected chips use the dedicated control line so the border contrasts enough.
  neutral: { box: 'border border-line-control bg-transparent', text: 'ink' },
  coral: { box: 'bg-coral-soft', text: 'coral-ink' },
  teal: { box: 'bg-teal-soft', text: 'teal' },
  amber: { box: 'bg-amber-soft', text: 'amber-ink' },
  rose: { box: 'bg-rose-soft', text: 'rose' },
};

const selectedStyle: Visual = { box: 'bg-ink', text: 'surface' };

/** 32 tall + 6 above and below = a 44pt target without a 44pt-tall chip. */
const chipHitSlop: Insets = { top: 6, bottom: 6 };

const CHIP_BOX = 'h-9 flex-row items-center rounded-pill px-4';

export function Chip({ label, tone = 'neutral', selected = false, onPress, accessibilityLabel }: ChipProps) {
  const visual = selected ? selectedStyle : toneStyle[tone];
  // Key the inner View+Text by the selected state so React tears them down between
  // selections. That stops NativeWind from reusing a prior render's compiled style
  // (which, on web, left the "All" chip's text white after it was deselected).
  const stateKey = selected ? 'on' : `off-${tone}`;
  const content = (
    <View key={stateKey} className={cx(CHIP_BOX, visual.box)}>
      <Text key={stateKey} variant="caption" tone={visual.text} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );

  if (!onPress) {
    return (
      <View accessible accessibilityLabel={accessibilityLabel ?? label}>
        {content}
      </View>
    );
  }

  // Dynamic visuals live on an inner plain View — the AnimatedPressable's className
  // never changes between renders, so NativeWind can't append stale classes.
  return (
    <HapticPressable
      haptic="selection"
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected }}
      aria-selected={selected}
      onPress={onPress}
      hitSlop={chipHitSlop}
      enforceMinSize={false}
      className="rounded-pill">
      {content}
    </HapticPressable>
  );
}
