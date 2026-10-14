import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import Constants from 'expo-constants';
import { useRef, type ReactNode } from 'react';
import { ScrollView, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Chip } from '@/components/chip';
import { Divider } from '@/components/divider';
import { HapticPressable } from '@/components/haptic-pressable';
import { ScreenHeader } from '@/components/screen-header';
import { Sheet } from '@/components/sheet';
import { Text } from '@/components/text';
import { currencyList, type CurrencyCode } from '@/lib/currencies';
import { triggerHaptic } from '@/lib/haptics';
import { loadProfile } from '@/lib/seed';
import { useSettings } from '@/lib/store';
import { useSubscriptionsStore } from '@/lib/subscriptions-store';
import { colors } from '@/lib/tokens';

export default function Settings() {
  const profile = loadProfile();
  const notificationsEnabled = useSettings((s) => s.notificationsEnabled);
  const setNotificationsEnabled = useSettings((s) => s.setNotificationsEnabled);
  const currency = useSubscriptionsStore((s) => s.currency);
  const setCurrency = useSubscriptionsStore((s) => s.setCurrency);
  const aboutRef = useRef<BottomSheetModal>(null);
  const version = Constants.expoConfig?.version ?? '1.0.0';

  const onPickCurrency = (code: CurrencyCode) => {
    triggerHaptic('selection');
    setCurrency(code);
  };

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <ScrollView
        contentContainerClassName="gap-7 px-4 pb-12 pt-4"
        showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Settings" />

        <Section title="Profile">
          <Card padding="none">
            <MetaRow label="Name" value={profile.name} />
            <Divider className="mx-5" />
            <MetaRow label="Email" value={profile.email} />
          </Card>
        </Section>

        <Section title="Preferences">
          <Card padding="none">
            <View className="gap-3 p-5">
              <View className="flex-row items-center justify-between">
                <Text variant="body-lg">Currency</Text>
                <Text variant="caption" tone="muted">
                  {currency}
                </Text>
              </View>
              <View className="flex-row flex-wrap gap-2">
                {currencyList.map((cur) => (
                  <Chip
                    key={cur.code}
                    label={`${cur.symbol} ${cur.code}`}
                    selected={currency === cur.code}
                    onPress={() => onPickCurrency(cur.code)}
                    accessibilityLabel={`Set currency to ${cur.name}`}
                  />
                ))}
              </View>
            </View>
            <Divider className="mx-5" />
            <View className="flex-row items-center gap-4 p-5">
              <View className="flex-1 gap-1">
                <Text variant="body-lg">Renewal nudges</Text>
                <Text variant="caption" tone="muted">
                  A heads-up 24 hours before anything renews
                </Text>
              </View>
              <Switch
                accessibilityRole="switch"
                accessibilityLabel="Renewal nudges"
                value={notificationsEnabled}
                onValueChange={(enabled) => {
                  triggerHaptic('selection');
                  setNotificationsEnabled(enabled);
                }}
                trackColor={{ false: colors.lineStrong, true: colors.coral }}
                thumbColor={colors.surface}
                ios_backgroundColor={colors.lineStrong}
              />
            </View>
          </Card>
        </Section>

        <Section title="About">
          <Card padding="none">
            <HapticPressable
              className="flex-row items-center justify-between rounded-xl p-5"
              accessibilityRole="button"
              accessibilityLabel="About Subsense"
              accessibilityHint="Opens a short description"
              onPress={() => aboutRef.current?.present()}>
              <Text variant="body-lg">About Subsense</Text>
              <Text variant="body" tone="subtle">
                ›
              </Text>
            </HapticPressable>
            <Divider className="mx-5" />
            <View
              className="flex-row items-center justify-between p-5"
              accessible
              accessibilityLabel={`Version ${version}`}>
              <Text variant="body-lg">Version</Text>
              <Text variant="mono" tone="muted">
                {version}
              </Text>
            </View>
            <Divider className="mx-5" />
            <View
              className="flex-row items-center justify-between p-5"
              accessible
              accessibilityLabel="Made in India with love">
              <Text variant="body-lg" tone="muted">
                Made in India
              </Text>
              <Text variant="body-lg" tone="coral">
                ♥
              </Text>
            </View>
          </Card>
        </Section>
      </ScrollView>

      <Sheet ref={aboutRef} accessibilityLabel="About Subsense">
        <View className="gap-4">
          <Text variant="display-md" accessibilityRole="header">
            Subsense
          </Text>
          <Text variant="body-lg" tone="muted">
            One honest view of every subscription your household pays for, with a quiet nudge before
            each renewal.
          </Text>
          <Button label="Done" variant="secondary" onPress={() => aboutRef.current?.dismiss()} />
        </View>
      </Sheet>
    </SafeAreaView>
  );
}

type SectionProps = { title: string; children: ReactNode };

function Section({ title, children }: SectionProps) {
  return (
    <View className="gap-3">
      <Text variant="micro" tone="subtle" accessibilityRole="header">
        {title}
      </Text>
      {children}
    </View>
  );
}

type MetaRowProps = { label: string; value: string };

function MetaRow({ label, value }: MetaRowProps) {
  return (
    <View
      className="gap-1 p-5"
      accessible
      accessibilityLabel={`${label}, ${value}`}>
      <Text variant="caption" tone="subtle">
        {label}
      </Text>
      <Text variant="body-lg">{value}</Text>
    </View>
  );
}
