import {
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetModal,
  useBottomSheetSpringConfigs,
  type BottomSheetBackdropProps,
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
  snapPoints?: string[];
  onDismiss?: () => void;
  children: ReactNode;
};

const DEFAULT_SNAP_POINTS = ['35%', '70%', '95%'];
const BLUR_INTENSITY = 18;
const CONTENT_PADDING = 24;

/** Present with `ref.current?.present()`. Needs BottomSheetModalProvider above it. */
export function Sheet({
  ref,
  accessibilityLabel,
  snapPoints = DEFAULT_SNAP_POINTS,
  onDismiss,
  children,
}: SheetProps) {
  const insets = useSafeAreaInsets();
  const animationConfigs = useBottomSheetSpringConfigs(spring);

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      animationConfigs={animationConfigs}
      backdropComponent={SheetBackdrop}
      backgroundStyle={styles.background}
      handleIndicatorStyle={styles.handle}
      accessibilityLabel={accessibilityLabel}
      onDismiss={onDismiss}>
      <BottomSheetView
        style={[styles.content, { paddingBottom: insets.bottom + CONTENT_PADDING }]}>
        {children}
      </BottomSheetView>
    </BottomSheetModal>
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
});
