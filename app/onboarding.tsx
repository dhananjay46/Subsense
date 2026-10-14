import { router } from 'expo-router';
import { useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  type SharedValue,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { AnimatedView } from '@/components/animated';
import { Button } from '@/components/button';
import { Illustration, type IllustrationName } from '@/components/illustration';
import { Text } from '@/components/text';
import { triggerHaptic } from '@/lib/haptics';
import { colors, spring } from '@/lib/tokens';

type OnboardingPage = {
  title: string;
  body: string;
  illustration: IllustrationName;
};

const PAGES: readonly OnboardingPage[] = [
  {
    title: 'Your subscriptions, in one honest view',
    body: 'Track Netflix, Spotify, iCloud, Cult.fit and everything in between — grouped the way you think about them.',
    illustration: 'wallet',
  },
  {
    title: "Know before you're charged",
    body: 'A quiet nudge 24 hours before any renewal hits your account. Never a sales pitch.',
    illustration: 'bell',
  },
  {
    title: 'Paste a receipt, skip the typing',
    body: 'Forward a UPI receipt and we fill in the price, plan and renewal for you.',
    illustration: 'receipt',
  },
];

const LAST = PAGES.length - 1;
const EDGE_RESISTANCE = 0.3;
const FLING_PROJECTION = 0.2;
const DOT = { idle: 8, active: 24 } as const;

export default function Onboarding() {
  const { width } = useWindowDimensions();
  const [page, setPage] = useState(0);
  const translateX = useSharedValue(0);
  const dragStart = useSharedValue(0);

  const settle = (target: number) => {
    setPage(target);
    triggerHaptic('selection');
  };

  const goTo = (target: number) => {
    translateX.set(withSpring(-target * width, spring));
    settle(target);
  };

  const pan = Gesture.Pan()
    .activeOffsetX([-12, 12])
    .failOffsetY([-12, 12])
    .onStart(() => {
      dragStart.set(translateX.get());
    })
    .onUpdate((event) => {
      const raw = dragStart.get() + event.translationX;
      const clamped = Math.min(Math.max(raw, -LAST * width), 0);
      translateX.set(clamped + (raw - clamped) * EDGE_RESISTANCE);
    })
    .onEnd((event) => {
      const from = Math.round(-dragStart.get() / width);
      const projected = translateX.get() + event.velocityX * FLING_PROJECTION;
      const nearest = Math.round(-projected / width);
      const target = Math.min(Math.max(nearest, Math.max(from - 1, 0)), Math.min(from + 1, LAST));
      translateX.set(withSpring(-target * width, spring));
      if (target !== from) scheduleOnRN(settle, target);
    });

  const track = useAnimatedStyle(() => ({ transform: [{ translateX: translateX.get() }] }));

  const isLast = page === LAST;

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top', 'bottom']}>
      <View className="flex-row justify-end px-5 py-3">
        <Button
          label="Skip"
          variant="ghost"
          onPress={() => router.replace('/home')}
          accessibilityHint="Skip the intro and go to the home screen"
          className="h-11 self-end px-3"
        />
      </View>

      <View className="flex-1 overflow-hidden">
        <GestureDetector gesture={pan}>
          <AnimatedView
            className="flex-1 flex-row"
            style={[{ width: width * PAGES.length }, track]}>
            {PAGES.map((item, i) => (
              <View
                key={item.title}
                className="flex-1 items-center justify-center gap-8 px-6"
                style={{ width }}
                aria-hidden={i !== page}>
                <Illustration name={item.illustration} size={Math.min(220, width - 120)} />
                <View className="gap-3">
                  <Text variant="display-md" className="text-center" accessibilityRole="header">
                    {item.title}
                  </Text>
                  <Text variant="body-lg" tone="muted" className="text-center">
                    {item.body}
                  </Text>
                </View>
              </View>
            ))}
          </AnimatedView>
        </GestureDetector>
      </View>

      <View className="gap-6 px-5 pb-6 pt-8">
        <View
          className="flex-row justify-center gap-2"
          accessible
          accessibilityRole="adjustable"
          accessibilityLabel={`Page ${page + 1} of ${PAGES.length}`}
          accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
          onAccessibilityAction={({ nativeEvent }) => {
            if (nativeEvent.actionName === 'increment' && page < LAST) goTo(page + 1);
            if (nativeEvent.actionName === 'decrement' && page > 0) goTo(page - 1);
          }}>
          {PAGES.map((item, i) => (
            <Dot key={item.title} index={i} translateX={translateX} width={width} />
          ))}
        </View>

        {isLast ? (
          <Button label="Get started" onPress={() => router.replace('/home')} />
        ) : (
          <Button label="Next" variant="secondary" onPress={() => goTo(page + 1)} />
        )}
      </View>
    </SafeAreaView>
  );
}

type DotProps = {
  index: number;
  translateX: SharedValue<number>;
  width: number;
};

function Dot({ index, translateX, width }: DotProps) {
  const style = useAnimatedStyle(() => {
    const distance = Math.abs(-translateX.get() / width - index);
    return {
      width: interpolate(distance, [0, 1], [DOT.active, DOT.idle], Extrapolation.CLAMP),
      backgroundColor: interpolateColor(
        Math.min(distance, 1),
        [0, 1],
        [colors.coral, colors.lineStrong],
      ),
    };
  });

  return <AnimatedView className="h-2 rounded-pill" style={style} />;
}
