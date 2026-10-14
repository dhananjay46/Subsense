import { StyleSheet, TextInput, View } from 'react-native';

import { triggerHaptic } from '@/lib/haptics';
import { colors, fonts, radius } from '@/lib/tokens';

import { HapticPressable } from './haptic-pressable';
import { Text } from './text';

export type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

/** Hand-rolled: surface + 1px line, no shadow, "Clear" is a label not an icon. */
export function SearchBar({ value, onChange, placeholder = 'Search' }: SearchBarProps) {
  return (
    <View style={styles.wrap}>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.subtle}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        accessibilityLabel="Search subscriptions"
        style={styles.input}
      />
      {value.length > 0 ? (
        <HapticPressable
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          haptic="selection"
          onPress={() => {
            onChange('');
            triggerHaptic('selection');
          }}
          enforceMinSize={false}
          className="rounded-pill px-3 py-1">
          <Text variant="caption" tone="muted">
            Clear
          </Text>
        </HapticPressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    paddingLeft: 16,
    paddingRight: 8,
  },
  input: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 17,
    color: colors.ink,
  },
});
