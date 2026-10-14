import { View } from 'react-native';

import { Text } from './text';

export type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
};

export function ScreenHeader({ title, subtitle }: ScreenHeaderProps) {
  return (
    <View className="gap-1">
      <Text variant="display-md" accessibilityRole="header">
        {title}
      </Text>
      {subtitle ? (
        <Text variant="body-lg" tone="muted">
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
