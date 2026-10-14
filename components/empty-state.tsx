import { View } from 'react-native';

import { Button } from './button';
import { Illustration, type IllustrationName } from './illustration';
import { Text } from './text';

export type EmptyStateProps = {
  /** One line. Never two. */
  message: string;
  illustration?: IllustrationName;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  message,
  illustration = 'empty',
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View className="items-center gap-5 py-4">
      <Illustration name={illustration} size={140} />
      <Text variant="body" tone="muted" className="text-center">
        {message}
      </Text>
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} className="self-stretch" />
      ) : null}
    </View>
  );
}
