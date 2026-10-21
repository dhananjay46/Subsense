import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** Tab bar size (kept in sync with app/(tabs)/_layout.tsx). */
export const TAB_BAR_BASE = Platform.OS === 'ios' ? 48 : 56;
/** Pixel-perfect height of the FAB pill. */
export const FAB_HEIGHT = 56;
/** Breathing room between the last row and the FAB. */
export const FAB_CLEARANCE = 24;

/**
 * Bottom padding every scrollable screen needs so content isn't eaten by the FAB,
 * the tab bar and the home indicator. Returning a plain number instead of a style
 * so callers can compose it into either `contentContainerStyle` or a flex layout.
 */
export function useScreenBottomPadding(): number {
  const insets = useSafeAreaInsets();
  return TAB_BAR_BASE + insets.bottom + FAB_HEIGHT + FAB_CLEARANCE;
}

/** Full height of the tab bar, including the home-indicator inset. */
export function useTabBarHeight(bottomInset: number): number {
  return TAB_BAR_BASE + bottomInset;
}
