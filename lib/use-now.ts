import { useEffect, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

/**
 * A ticking "now" that updates:
 *   - at the next local hour boundary (so the greeting rolls over at 05:00/12:00/17:00/21:00
 *     and day-boundary labels like "Today" / "Tomorrow" stay honest at midnight)
 *   - whenever the app returns to the foreground (so a session resumed hours later repairs
 *     itself immediately)
 *
 * Pure React, no store — components call this once and pass `now` down.
 */
export function useNow(): Date {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    const scheduleNextHour = () => {
      if (timer) clearTimeout(timer);
      const current = new Date();
      const nextHour = new Date(
        current.getFullYear(),
        current.getMonth(),
        current.getDate(),
        current.getHours() + 1,
        0,
        0,
        0,
      );
      const delay = Math.max(1_000, nextHour.getTime() - current.getTime());
      timer = setTimeout(() => {
        setNow(new Date());
        scheduleNextHour();
      }, delay);
    };

    const onAppStateChange = (state: AppStateStatus) => {
      if (state === 'active') setNow(new Date());
    };

    scheduleNextHour();
    const sub = AppState.addEventListener('change', onAppStateChange);

    return () => {
      if (timer) clearTimeout(timer);
      sub.remove();
    };
  }, []);

  return now;
}
