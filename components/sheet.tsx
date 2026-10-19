import {
  BottomSheetFooter,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
  useBottomSheetModal,
  useBottomSheetSpringConfigs,
  type BottomSheetBackdropProps,
  type BottomSheetFooterProps,
} from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';
import type { ReactNode, Ref } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { triggerHaptic } from '@/lib/haptics';
import { colors, radius, spring } from '@/lib/tokens';

export type SheetProps = {
  ref?: Ref<BottomSheetModal>;
  accessibilityLabel: string;
  /** Fixed snap points. Omit (and set `scrollable: false`) for dynamic sizing (capped at ~90%). */
  snapPoints?: string[];
  /** When true, children scroll inside the sheet (BottomSheetScrollView). Default is a static view. */
  scrollable?: boolean;
  /** Rendered as a sticky footer. Stays pinned while the body scrolls under it. */
  footer?: ReactNode;
  onDismiss?: () => void;
  children: ReactNode;
};

const DEFAULT_SCROLLABLE_SNAP_POINTS = ['70%', '95%'];
const BLUR_INTENSITY = 18;
const CONTENT_PADDING = 24;
const FOOTER_HEADROOM = 96;

/** Present with `ref.current?.present()`. Needs BottomSheetModalProvider above it. */
export function Sheet({
  ref,
  accessibilityLabel,
  snapPoints,
  scrollable = false,
  footer,
  onDismiss,
  children,
}: SheetProps) {
  const insets = useSafeAreaInsets();
  const animationConfigs = useBottomSheetSpringConfigs(spring);

  // Short confirm / about sheets size to their content; everything else uses explicit snap points.
  const dynamic = !snapPoints;
  const resolvedSnapPoints =
    snapPoints ?? (scrollable ? DEFAULT_SCROLLABLE_SNAP_POINTS : undefined);

  // Content must not sit under the footer — add headroom when a footer is rendered.
  const bottomPadding = insets.bottom + CONTENT_PADDING + (footer ? FOOTER_HEADROOM : 0);

  const body = scrollable ? (
    <BottomSheetScrollView
      style={styles.scrollable}
      contentContainerStyle={[styles.content, { paddingBottom: bottomPadding }]}
      keyboardShouldPersistTaps="handled">
      {children}
    </BottomSheetScrollView>
  ) : (
    <BottomSheetView style={[styles.content, { paddingBottom: bottomPadding }]}>
      {children}
    </BottomSheetView>
  );

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={resolvedSnapPoints}
      enableDynamicSizing={dynamic}
      {...(dynamic ? { topInset: insets.top } : null)}
      animationConfigs={animationConfigs}
      backdropComponent={SheetBackdrop}
      backgroundStyle={styles.background}
      handleIndicatorStyle={styles.handle}
      accessibilityLabel={accessibilityLabel}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      footerComponent={
        footer ? (props) => <StickyFooter {...props} bottomInset={insets.bottom}>{footer}</StickyFooter> : undefined
      }
      onDismiss={onDismiss}>
      {body}
    </BottomSheetModal>
  );
}

type StickyFooterProps = BottomSheetFooterProps & {
  bottomInset: number;
  children: ReactNode;
};

function StickyFooter({ animatedFooterPosition, bottomInset, children }: StickyFooterProps) {
  return (
    <BottomSheetFooter
      animatedFooterPosition={animatedFooterPosition}
      bottomInset={bottomInset}
      style={styles.footer}>
      {children}
    </BottomSheetFooter>
  );
}

function SheetBackdrop({ animatedIndex, style }: BottomSheetBackdropProps) {
  const { dismiss } = useBottomSheetModal();
  const fade = useAnimatedStyle(() => ({
    opacity: interpolate(animatedIndex.get(), [-1, 0], [0, 1], Extrapolation.CLAMP),
  }));

  return (
    <Animated.View style={[style, fade]}>
      <BlurView intensity={BLUR_INTENSITY} tint="light" style={StyleSheet.absoluteFill} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close"
        onPress={() => {
          triggerHaptic('light');
          dismiss();
        }}
        style={[StyleSheet.absoluteFill, styles.scrim]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: colors.lineStrong,
  },
  scrim: {
    backgroundColor: colors.scrim,
  },
  content: {
    paddingHorizontal: CONTENT_PADDING,
    paddingTop: 8,
  },
  scrollable: {
    flex: 1,
  },
  footer: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingHorizontal: CONTENT_PADDING,
    paddingTop: 12,
    paddingBottom: 12,
  },
});
