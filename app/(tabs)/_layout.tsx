import { Tabs } from 'expo-router';
import { Platform, StyleSheet } from 'react-native';

import { TabIcon } from '@/components/tab-icon';
import { triggerHaptic } from '@/lib/haptics';
import { colors, fonts } from '@/lib/tokens';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        sceneStyle: styles.scene,
        tabBarStyle: styles.bar,
        tabBarLabelStyle: styles.label,
        tabBarItemStyle: styles.item,
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.subtle,
      }}
      screenListeners={{ tabPress: () => triggerHaptic('selection') }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="subscriptions"
        options={{
          title: 'Subscriptions',
          tabBarIcon: ({ color }) => <TabIcon name="subscriptions" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <TabIcon name="settings" color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  scene: { backgroundColor: colors.bg },
  bar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.line,
    borderTopWidth: 1,
    elevation: 0,
    shadowOpacity: 0,
    height: Platform.OS === 'ios' ? 84 : 64,
    paddingTop: 6,
  },
  item: { paddingVertical: 4 },
  label: { fontFamily: fonts.sansMedium, fontSize: 11, marginTop: 2 },
});
