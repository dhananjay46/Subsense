import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/** Forces every data-backed component into one state, so reviewers can see all of them. */
export type DemoState = 'live' | 'loading' | 'empty' | 'error';

export type SettingsState = {
  notificationsEnabled: boolean;
  demoState: DemoState;
  setNotificationsEnabled: (enabled: boolean) => void;
  setDemoState: (state: DemoState) => void;
};

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      notificationsEnabled: true,
      demoState: 'live',
      setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
      setDemoState: (demoState) => set({ demoState }),
    }),
    {
      name: 'subsense.settings',
      storage: createJSONStorage(() => AsyncStorage),
      // Demo state resets on launch so nobody gets stuck on a forced error.
      partialize: (state) => ({ notificationsEnabled: state.notificationsEnabled }),
    },
  ),
);
