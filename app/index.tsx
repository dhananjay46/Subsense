import { router } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { AnimatedView } from '@/components/animated';
import { Text } from '@/components/text';
import { entry, springTight, timing } from '@/lib/tokens';

const HOLD_MS = 1600;
const DOT_DELAY_MS = 160;
const TAGLINE_DELAY_MS = 360;

export default function Splash() {
  const wordmark = useSharedValue(0);
  const dot = useSharedValue(0);
  const tagline = useSharedValue(0);

  useEffect(() => {
    wordmark.set(withTiming(1, { duration: timing.base, easing: Easing.out(Easing.cubic) }));
    dot.set(withDelay(DOT_DELAY_MS, withSpring(1, springTight)));
    tagline.set(
      withDelay(
        TAGLINE_DELAY_MS,
        withTiming(1, { duration: timing.base, easing: Easing.out(Easing.cubic) }),
      ),
    );

    const timer = setTimeout(() => router.replace('/onboarding'), HOLD_MS);
    return () => clearTimeout(timer);
  }, [wordmark, dot, tagline]);

  const wordmarkStyle = useAnimatedStyle(() => ({
    opacity: wordmark.get(),
    transform: [{ translateY: (1 - wordmark.get()) * entry.rise }],
  }));

  const dotStyle = useAnimatedStyle(() => ({
    opacity: dot.get(),
    transform: [{ scale: 0.5 + dot.get() * 0.5 }],
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: tagline.get(),
    transform: [{ translateY: (1 - tagline.get()) * entry.rise }],
  }));

  return (
    <View className="flex-1 items-center justify-center bg-bg">
      <View className="items-center gap-3">
        <AnimatedView
          style={wordmarkStyle}
          className="flex-row items-end"
          accessible
          accessibilityRole="header"
          accessibilityLabel="Subsense">
          <Text variant="display-xl">Subsense</Text>
          <AnimatedView style={dotStyle} aria-hidden={true}>
            <Text variant="display-xl" tone="coral">
              .
            </Text>
          </AnimatedView>
        </AnimatedView>
        <AnimatedView style={taglineStyle}>
          <Text variant="body" tone="muted">
            Quiet clarity for what you pay for.
          </Text>
        </AnimatedView>
      </View>
    </View>
  );
}
