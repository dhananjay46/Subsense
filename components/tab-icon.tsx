import type { ColorValue } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

export type TabIconName = 'home' | 'subscriptions' | 'settings';

export type TabIconProps = {
  name: TabIconName;
  color: ColorValue;
};

const SIZE = 24;
const STROKE = 1.75;

/** Decorative: the tab label carries the meaning. */
export function TabIcon({ name, color }: TabIconProps) {
  return (
    <Svg
      width={SIZE}
      height={SIZE}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={STROKE}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={true}>
      {name === 'home' && <Path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" />}
      {name === 'subscriptions' && <Path d="M4 6h16M4 12h16M4 18h10" />}
      {name === 'settings' && (
        <>
          <Path d="M4 7h9M19 7h1M4 17h3M13 17h7" />
          <Circle cx={16} cy={7} r={2.5} />
          <Circle cx={10} cy={17} r={2.5} />
        </>
      )}
    </Svg>
  );
}
