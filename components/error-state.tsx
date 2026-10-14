import { View } from 'react-native';

import { Button } from './button';
import { Text } from './text';

export type ErrorStateProps = {
  /** What happened, why we think, what to do next. */
  message: string;
  onRetry: () => void;
};

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <View className="gap-4">
      <Text variant="body" accessibilityRole="alert" accessibilityLiveRegion="polite">
        {message}
      </Text>
      <Button label="Try again" variant="secondary" onPress={onRetry} />
    </View>
  );
}
