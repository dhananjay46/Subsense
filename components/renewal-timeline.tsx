import { Fragment } from 'react';
import { View } from 'react-native';

import type { Subscription } from '@/types/subscription';

import { Card, cardLift } from './card';
import { Entrance } from './entrance';
import { SubscriptionRow } from './subscription-row';

export type RenewalTimelineProps = {
  items: Subscription[];
  now: Date;
  onSelect: (subscription: Subscription) => void;
};

/**
 * iOS table-view inset: aligns the hairline divider under the row title, past the
 * monogram (44pt) + gap-4 (16pt). Keeps the stack reading as one surface.
 */
const DIVIDER_INSET = 60;

export function RenewalTimeline({ items, now, onSelect }: RenewalTimelineProps) {
  return (
    <Card padding="none" className="border-coral/40" style={cardLift}>
      <View className="px-5">
        {items.map((subscription, i) => (
          <Entrance key={subscription.id} index={i}>
            <Fragment>
              {i > 0 && (
                <View
                  className="h-px bg-line"
                  style={{ marginLeft: DIVIDER_INSET }}
                  aria-hidden={true}
                />
              )}
              <SubscriptionRow subscription={subscription} now={now} onPress={onSelect} />
            </Fragment>
          </Entrance>
        ))}
      </View>
    </Card>
  );
}
