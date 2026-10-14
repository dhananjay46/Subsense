import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import type { Ref } from 'react';
import { View } from 'react-native';

import { triggerHaptic, type HapticStrength } from '@/lib/haptics';

import { Button } from './button';
import { Sheet } from './sheet';
import { Text } from './text';

export type ConfirmSheetProps = {
  ref?: Ref<BottomSheetModal>;
  title: string;
  body?: string;
  /** Shown on the destructive button. "Remove", "Delete", etc. */
  confirmLabel: string;
  /** 'heavy' for destructive, 'medium' for merely consequential. */
  confirmHaptic?: HapticStrength;
  onConfirm: () => void;
  onDismiss?: () => void;
};

const SNAP = ['35%'];

/** Bottom-sheet confirmation — on-brand replacement for native Alert. */
export function ConfirmSheet({
  ref,
  title,
  body,
  confirmLabel,
  confirmHaptic = 'heavy',
  onConfirm,
  onDismiss,
}: ConfirmSheetProps) {
  const dismiss = () => {
    const node = ref as { current: BottomSheetModal | null } | null;
    node?.current?.dismiss();
  };

  const handleConfirm = () => {
    triggerHaptic(confirmHaptic);
    onConfirm();
    dismiss();
  };

  return (
    <Sheet ref={ref} snapPoints={SNAP} accessibilityLabel={title} onDismiss={onDismiss}>
      <View className="gap-5">
        <View className="gap-2">
          <Text variant="display-md" accessibilityRole="header">
            {title}
          </Text>
          {body ? (
            <Text variant="body-lg" tone="muted">
              {body}
            </Text>
          ) : null}
        </View>
        <View className="gap-3 pt-2">
          <Button label={confirmLabel} variant="destructive" onPress={handleConfirm} />
          <Button label="Cancel" variant="secondary" onPress={dismiss} />
        </View>
      </View>
    </Sheet>
  );
}
