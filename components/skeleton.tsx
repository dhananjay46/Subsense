import { useEffect, type ReactNode } from 'react';
import { View } from 'react-native';
import {
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { timing } from '@/lib/tokens';
import { cx } from '@/lib/utils';

import { AnimatedView } from './animated';

export type SkeletonProps = {
  /** Size and radius, e.g. "h-4 w-24". */
  className?: string;
};

export function Skeleton({ className }: SkeletonProps) {
  const reduceMotion = useReducedMotion();
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (reduceMotion) return;
    opacity.set(withRepeat(withTiming(0.5, { duration: timing.slow }), -1, true));
    return () => cancelAnimation(opacity);
  }, [opacity, reduceMotion]);

  const pulse = useAnimatedStyle(() => ({ opacity: opacity.get() }));

  return <AnimatedView className={cx('rounded-sm bg-bg-raised', className)} style={pulse} />;
}

export type SkeletonGroupProps = {
  accessibilityLabel: string;
  className?: string;
  children: ReactNode;
};

/** Announces one "loading" to screen readers instead of every block. */
export function SkeletonGroup({ accessibilityLabel, className, children }: SkeletonGroupProps) {
  return (
    <View
      className={className}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ busy: true }}>
      {children}
    </View>
  );
}
