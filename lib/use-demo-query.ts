import { useEffect, useState } from 'react';

import { useSettings, type DemoState } from './store';

export type QueryState<T> =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'empty' }
  | { status: 'success'; data: T };

export type DemoQuery<T> = {
  state: QueryState<T>;
  /** Retry after an error, or restore sample data from an empty state. */
  reload: () => void;
};

/** Long enough for the skeleton to read as intentional, short enough not to drag. */
const LOAD_DELAY_MS = 600;

/**
 * Reads hardcoded seed data with a simulated load, honouring the demo state from Settings.
 * `load` and `isEmpty` must be stable (module-level) functions.
 */
export function useDemoQuery<T>(load: () => T, isEmpty: (data: T) => boolean): DemoQuery<T> {
  const demoState = useSettings((s) => s.demoState);
  const setDemoState = useSettings((s) => s.setDemoState);
  const [attempt, setAttempt] = useState(0);
  const [resolved, setResolved] = useState<{ key: string; state: QueryState<T> } | null>(null);

  const requestKey = `${demoState}:${attempt}`;

  useEffect(() => {
    if (demoState === 'loading') return;
    const timer = setTimeout(() => {
      setResolved({ key: requestKey, state: resolve(demoState, load, isEmpty) });
    }, LOAD_DELAY_MS);
    return () => clearTimeout(timer);
  }, [demoState, requestKey, load, isEmpty]);

  const state: QueryState<T> =
    resolved?.key === requestKey ? resolved.state : { status: 'loading' };

  const reload = () => {
    setDemoState('live');
    setAttempt((n) => n + 1);
  };

  return { state, reload };
}

function resolve<T>(
  demoState: Exclude<DemoState, 'loading'>,
  load: () => T,
  isEmpty: (data: T) => boolean,
): QueryState<T> {
  if (demoState === 'error') return { status: 'error' };
  if (demoState === 'empty') return { status: 'empty' };
  const data = load();
  return isEmpty(data) ? { status: 'empty' } : { status: 'success', data };
}

export function mapQuery<T, U>(state: QueryState<T>, select: (data: T) => U): QueryState<U> {
  return state.status === 'success' ? { status: 'success', data: select(state.data) } : state;
}
