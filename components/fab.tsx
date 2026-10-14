import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cx } from '@/lib/utils';

import { HapticPressable } from './haptic-pressable';
import { Text } from './text';

export type FABProps = {
  label: string;
  onPress: () => void;
  accessibilityHint?: string;
  /** Extra bottom offset for screens with a tab bar above the home indicator. */
  liftAboveTabs?: boolean;
  className?: string;
};

/** Keep in sync with tabBarStyle.height in app/(tabs)/_layout.tsx. */
const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 84 : 64;
const CLEARANCE_ABOVE_BAR = 16;

/** Floating primary action — coral pill, warm shadow via line, never a drop shadow. */
export function FAB({
  label,
  onPress,
  accessibilityHint,
  liftAboveTabs = true,
  className,
}: FABProps) {
  const insets = useSafeAreaInsets();
  // On a tab screen the tab bar already pads itself with insets.bottom, so just clear its full height.
  const bottom = liftAboveTabs ? TAB_BAR_HEIGHT + CLEARANCE_ABOVE_BAR : insets.bottom + 16;

  return (
    <View pointerEvents="box-none" style={[styles.container, { bottom }]} className={cx(className)}>
      <HapticPressable
        haptic="medium"
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint={accessibilityHint}
        onPress={onPress}
        pressScale={0.96}
        className="h-14 flex-row items-center justify-center rounded-pill border border-coral bg-coral px-6"
        enforceMinSize={false}>
        <Text variant="title" tone="surface">
          + {label}
        </Text>
      </HapticPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 20,
  },
});
