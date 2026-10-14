import * as Haptics from 'expo-haptics';

export type HapticStrength = 'none' | 'selection' | 'light' | 'medium' | 'heavy';

const impact = {
  light: Haptics.ImpactFeedbackStyle.Light,
  medium: Haptics.ImpactFeedbackStyle.Medium,
  heavy: Haptics.ImpactFeedbackStyle.Heavy,
} as const;

export function triggerHaptic(strength: HapticStrength): void {
  if (strength === 'none') return;
  const pending =
    strength === 'selection' ? Haptics.selectionAsync() : Haptics.impactAsync(impact[strength]);
  // Best effort: web and some Android devices have no haptic engine.
  pending.catch(() => undefined);
}
