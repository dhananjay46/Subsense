import { Fragment } from 'react';
import { View } from 'react-native';

import type { Subscription } from '@/types/subscription';

import { Card } from './card';
import { Divider } from './divider';
import { Entrance } from './entrance';
import { SubscriptionRow } from './subscription-row';

export type RenewalTimelineProps = {
  items: Subscription[];
  now: Date;
  onSelect: (subscription: Subscription) => void;
};

export function RenewalTimeline({ items, now, onSelect }: RenewalTimelineProps) {
  return (
    <Card padding="none">
      <View className="px-5">
        {items.map((subscription, i) => (
          <Entrance key={subscription.id} index={i}>
            <Fragment>
              {i > 0 && <Divider />}
              <SubscriptionRow subscription={subscription} now={now} onPress={onSelect} />
            </Fragment>
          </Entrance>
        ))}
      </View>
    </Card>
  );
}
