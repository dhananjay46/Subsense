import { useEffect, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

/**
 * A ticking "now" that updates:
 *   - exactly at the next local midnight (so day-boundary labels like "Today" / "Tomorrow"
 *     stay honest without a per-second re-render)
 *   - whenever the app returns to the foreground (so a session resumed the next day repairs
 *     itself immediately)
 *
 * Pure React, no store — components call this once and pass `now` down.
 */
export function useNow(): Date {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    const scheduleMidnight = () => {
      if (timer) clearTimeout(timer);
      const current = new Date();
      const nextMidnight = new Date(
        current.getFullYear(),
        current.getMonth(),
        current.getDate() + 1,
        0,
        0,
        0,
        0,
      );
      const delay = Math.max(1_000, nextMidnight.getTime() - current.getTime());
      timer = setTimeout(() => {
        setNow(new Date());
        scheduleMidnight();
      }, delay);
    };

    const onAppStateChange = (state: AppStateStatus) => {
      if (state === 'active') setNow(new Date());
    };

    scheduleMidnight();
    const sub = AppState.addEventListener('change', onAppStateChange);

    return () => {
      if (timer) clearTimeout(timer);
      sub.remove();
    };
  }, []);

  return now;
}
