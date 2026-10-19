import { useEffect, useState } from 'react';
import {
  Easing,
  useAnimatedReaction,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import type { CurrencyCode } from '@/lib/currencies';
import { formatCount, formatMoney } from '@/lib/utils';

import { Text, type TextTone, type TextVariant } from './text';

export type NumberDisplaySize = 'xl' | 'lg' | 'md' | 'sm';

export type NumberDisplayProps = {
  value: number;
  /** `currency` renders money (always via formatMoney with an explicit code), `count` renders a plain count. */
  display?: 'currency' | 'count';
  /** Required when `display === 'currency'`. */
  currency?: CurrencyCode;
  size?: NumberDisplaySize;
  tone?: TextTone;
  /** Shrink to fit narrow containers instead of truncating. */
  fit?: boolean;
  accessibilityLabel?: string;
};

/** components.md: count up over 800ms, easing out. Carries meaning, so it may exceed 400ms. */
const COUNT_UP_MS = 800;

const sizeVariant: Record<NumberDisplaySize, TextVariant> = {
  xl: 'display-xl',
  lg: 'display-lg',
  md: 'display-md',
  sm: 'title-lg',
};

export function NumberDisplay({
  value,
  display = 'currency',
  currency = 'INR',
  size = 'lg',
  tone = 'ink',
  fit = false,
  accessibilityLabel,
}: NumberDisplayProps) {
  const reduceMotion = useReducedMotion();
  const animated = useSharedValue(0);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    // Animates from wherever the number is now, so updates morph instead of jumping.
    animated.set(
      withTiming(value, {
        duration: reduceMotion ? 0 : COUNT_UP_MS,
        easing: Easing.out(Easing.cubic),
      }),
    );
  }, [animated, value, reduceMotion]);

  useAnimatedReaction(
    () => Math.round(animated.get()),
    (current, previous) => {
      if (current !== previous) scheduleOnRN(setShown, current);
    },
  );

  const format = (n: number) =>
    display === 'currency' ? formatMoney(n, currency) : formatCount(n);

  return (
    <Text
      variant={sizeVariant[size]}
      tone={tone}
      numberOfLines={1}
      adjustsFontSizeToFit={fit}
      minimumFontScale={0.6}
      accessibilityLabel={accessibilityLabel ?? format(value)}>
      {format(shown)}
    </Text>
  );
}
