import type { HapticStrength } from '@/lib/haptics';
import { cx } from '@/lib/utils';

import { HapticPressable } from './haptic-pressable';
import { Text, type TextTone } from './text';

export type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'ghost';
export type ButtonSize = 'default' | 'compact';

export type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  disabled?: boolean;
  className?: string;
};

type VariantStyle = { box: string; text: TextTone; haptic: HapticStrength };

const variantStyle: Record<ButtonVariant, VariantStyle> = {
  // Primary: coral-fill (stronger than the semantic coral) so white text passes AA.
  primary: { box: 'bg-coral-fill', text: 'surface', haptic: 'medium' },
  // Secondary: raised surface + strong line, so it reads as a button on any backdrop.
  secondary: {
    box: 'border border-line-strong bg-bg-raised',
    text: 'ink',
    haptic: 'light',
  },
  // Destructive: rose-tinted ghost — soft until pressed, never shouty.
  destructive: { box: 'bg-transparent border border-line', text: 'rose', haptic: 'light' },
  ghost: { box: 'bg-transparent', text: 'muted', haptic: 'light' },
};

const sizeStyle: Record<ButtonSize, string> = {
  default: 'h-14 rounded-md px-6',
  compact: 'h-11 rounded-md px-4',
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'default',
  accessibilityLabel,
  accessibilityHint,
  disabled = false,
  className,
}: ButtonProps) {
  const style = variantStyle[variant];
  // The AnimatedPressable's className is static per instance — variant/size are stable, and
  // disabled is routed through `style.opacity`, not through a className swap NativeWind would append.
  return (
    <HapticPressable
      haptic={style.haptic}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      disabled={disabled}
      onPress={onPress}
      pressScale={0.97}
      style={disabled ? disabledStyle : undefined}
      className={cx(
        'flex-row items-center justify-center',
        sizeStyle[size],
        style.box,
        className,
      )}>
      <Text variant={size === 'compact' ? 'body' : 'title'} tone={style.text}>
        {label}
      </Text>
    </HapticPressable>
  );
}

const disabledStyle = { opacity: 0.5 } as const;
