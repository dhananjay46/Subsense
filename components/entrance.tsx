import type { ReactNode } from 'react';
import { FadeInDown } from 'react-native-reanimated';

import { entry, timing } from '@/lib/tokens';

import { AnimatedView } from './animated';

export type EntranceProps = {
  /** Position in the stagger sequence. */
  index?: number;
  className?: string;
  children: ReactNode;
};

/** House entry: 240ms fade + rise 8, staggered 40ms. */
export function Entrance({ index = 0, className, children }: EntranceProps) {
  return (
    <AnimatedView
      className={className}
      entering={FadeInDown.duration(timing.base)
        .delay(index * entry.stagger)
        .withInitialValues({ opacity: 0, transform: [{ translateY: entry.rise }] })}>
      {children}
    </AnimatedView>
  );
}
