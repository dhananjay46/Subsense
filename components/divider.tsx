import { View } from 'react-native';

import { cx } from '@/lib/utils';

import { Text } from './text';

export type DividerProps = {
  /** Renders the `with-label` variant: a micro label on a bg chip in the middle. */
  label?: string;
  className?: string;
};

export function Divider({ label, className }: DividerProps) {
  if (!label) {
    return (
      <View
        className={cx('h-px bg-line', className)}
        aria-hidden={true}
      />
    );
  }

  return (
    <View className={cx('flex-row items-center', className)}>
      <View className="h-px flex-1 bg-line" />
      <View className="mx-2 rounded-pill bg-bg px-2 py-1">
        <Text variant="micro" tone="subtle">
          {label}
        </Text>
      </View>
      <View className="h-px flex-1 bg-line" />
    </View>
  );
}
