import { Platform, StyleSheet, View, type ViewProps } from 'react-native';

import { colors } from '@/lib/tokens';

/** The phone-sized frame our mobile layouts are designed for. */
const PHONE_WIDTH = 420;
/** Narrower than this and we're already on a phone or a phone-sized viewport. */
const DESKTOP_BREAKPOINT = 760;

/**
 * On web, constrains the app to a phone-width column so the mobile layout looks right
 * even when previewed in a desktop browser. On native, this is just a passthrough.
 */
export function MobileFrame({ children }: ViewProps) {
  if (Platform.OS !== 'web') return <>{children}</>;

  if (typeof window !== 'undefined' && window.innerWidth < DESKTOP_BREAKPOINT) {
    return <>{children}</>;
  }

  return (
    <View style={styles.stage}>
      <View style={styles.frame}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgRaised,
    paddingVertical: 24,
  },
  frame: {
    width: PHONE_WIDTH,
    height: '100%',
    maxHeight: 900,
    backgroundColor: colors.bg,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    overflow: 'hidden',
  },
});
