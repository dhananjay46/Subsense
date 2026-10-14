import { Text as RNText, StyleSheet, type TextProps as RNTextProps } from 'react-native';

import { cx } from '@/lib/utils';

export type TextVariant =
  | 'display-xl'
  | 'display-lg'
  | 'display-md'
  | 'title-lg'
  | 'title'
  | 'body-lg'
  | 'body'
  | 'caption'
  | 'micro'
  | 'mono-lg'
  | 'mono';

export type TextTone = 'ink' | 'muted' | 'subtle' | 'coral' | 'teal' | 'amber' | 'rose' | 'surface';

export type TextProps = RNTextProps & {
  variant?: TextVariant;
  tone?: TextTone;
  className?: string;
};

const variantClass: Record<TextVariant, string> = {
  'display-xl': 'font-display text-display-xl',
  'display-lg': 'font-display text-display-lg',
  'display-md': 'font-display text-display-md',
  'title-lg': 'font-sans-semibold text-title-lg',
  title: 'font-sans-semibold text-title',
  'body-lg': 'font-sans text-body-lg',
  body: 'font-sans text-body',
  caption: 'font-sans-medium text-caption',
  micro: 'font-sans-semibold text-micro uppercase tracking-micro',
  'mono-lg': 'font-mono text-mono-lg',
  mono: 'font-mono text-mono',
};

const toneClass: Record<TextTone, string> = {
  ink: 'text-ink',
  muted: 'text-muted',
  subtle: 'text-subtle',
  coral: 'text-coral',
  teal: 'text-teal',
  amber: 'text-amber',
  rose: 'text-rose',
  surface: 'text-surface',
};

/** Every piece of copy goes through here: type scale, tone, and tabular numbers. */
export function Text({ variant = 'body', tone = 'ink', className, style, ...rest }: TextProps) {
  return (
    <RNText
      className={cx(variantClass[variant], toneClass[tone], className)}
      style={[styles.tabular, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  tabular: { fontVariant: ['tabular-nums'] },
});
