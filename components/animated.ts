import { cssInterop } from 'nativewind';
import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';

// NativeWind only wires className into core RN components. Register the animated ones we style.
export const AnimatedView = Animated.View;
export const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

cssInterop(AnimatedView, { className: 'style' });
cssInterop(AnimatedPressable, { className: 'style' });
