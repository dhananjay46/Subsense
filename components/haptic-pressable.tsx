import type { ReactNode } from 'react';
import type { PressableProps, StyleProp, ViewStyle } from 'react-native';
import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { triggerHaptic, type HapticStrength } from '@/lib/haptics';
import { hitTarget, spring } from '@/lib/tokens';

import { AnimatedPressable } from './animated';

export type HapticPressableProps = Omit<
  PressableProps,
  'accessibilityLabel' | 'accessibilityRole' | 'style' | 'children'
> & {
  accessibilityLabel: string;
  accessibilityRole: NonNullable<PressableProps['accessibilityRole']>;
  haptic?: HapticStrength;
  pressScale?: number;
  /** Pads the box to 44pt. Turn off only when hitSlop already makes up the difference. */
  enforceMinSize?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

const minSize: ViewStyle = { minHeight: hitTarget, minWidth: hitTarget };

export function HapticPressable({
  haptic = 'light',
  pressScale = 0.98,
  enforceMinSize = true,
  onPress,
  onPressIn,
  onPressOut,
  disabled,
  accessibilityState,
  className,
  style,
  children,
  ...rest
}: HapticPressableProps) {
  const scale = useSharedValue(1);
  const pressStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  return (
    <AnimatedPressable
      {...rest}
      disabled={disabled}
      accessibilityState={{ ...accessibilityState, disabled: Boolean(disabled) }}
      onPressIn={(event) => {
        scale.set(withSpring(pressScale, spring));
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        scale.set(withSpring(1, spring));
        onPressOut?.(event);
      }}
      onPress={(event) => {
        triggerHaptic(haptic);
        onPress?.(event);
      }}
      className={className}
      style={[enforceMinSize ? minSize : null, pressStyle, style]}>
      {children}
    </AnimatedPressable>
  );
}
