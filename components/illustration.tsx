import { View } from 'react-native';
import Svg, { Circle, G, Line, Path, Rect } from 'react-native-svg';

import { colors } from '@/lib/tokens';

export type IllustrationName = 'wallet' | 'bell' | 'receipt' | 'empty';

export type IllustrationProps = {
  name: IllustrationName;
  size?: number;
};

/**
 * Hand-rolled on-brand illustrations: thin strokes, warm fills, token-only colours.
 * No cartoon faces, no gradients. Each one is one small idea on an airy canvas.
 */
export function Illustration({ name, size = 240 }: IllustrationProps) {
  return (
    <View
      aria-hidden={true}
      style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 240 240" fill="none">
        {name === 'wallet' && <Wallet />}
        {name === 'bell' && <Bell />}
        {name === 'receipt' && <Receipt />}
        {name === 'empty' && <Empty />}
      </Svg>
    </View>
  );
}

const STROKE = 1.5;

/** Soft disc + concentric line, same for every scene — ties the set together. */
function Backdrop() {
  return (
    <G>
      <Circle cx={120} cy={120} r={96} fill={colors.bgRaised} />
      <Circle cx={120} cy={120} r={96} stroke={colors.line} strokeWidth={STROKE} />
      <Circle cx={120} cy={120} r={72} stroke={colors.line} strokeWidth={STROKE} />
    </G>
  );
}

function Wallet() {
  return (
    <G>
      <Backdrop />
      <Rect
        x={70}
        y={92}
        width={100}
        height={64}
        rx={10}
        fill={colors.surface}
        stroke={colors.lineStrong}
        strokeWidth={STROKE}
      />
      <Rect
        x={70}
        y={92}
        width={100}
        height={16}
        rx={10}
        fill={colors.coralSoft}
        stroke={colors.lineStrong}
        strokeWidth={STROKE}
      />
      <Circle cx={150} cy={128} r={8} fill={colors.coral} />
      <Line x1={82} y1={140} x2={118} y2={140} stroke={colors.subtle} strokeWidth={STROKE} />
    </G>
  );
}

function Bell() {
  return (
    <G>
      <Backdrop />
      <Path
        d="M120 76 C 100 76 88 92 88 112 L 88 134 L 76 150 L 164 150 L 152 134 L 152 112 C 152 92 140 76 120 76 Z"
        fill={colors.surface}
        stroke={colors.lineStrong}
        strokeWidth={STROKE}
      />
      <Path
        d="M108 158 C 110 166 114 170 120 170 C 126 170 130 166 132 158"
        stroke={colors.lineStrong}
        strokeWidth={STROKE}
        fill="none"
      />
      <Circle cx={152} cy={92} r={10} fill={colors.coral} />
    </G>
  );
}

function Receipt() {
  return (
    <G>
      <Backdrop />
      <Path
        d="M78 72 L 162 72 L 162 160 L 150 152 L 138 160 L 126 152 L 114 160 L 102 152 L 90 160 L 78 152 Z"
        fill={colors.surface}
        stroke={colors.lineStrong}
        strokeWidth={STROKE}
      />
      <Line x1={92} y1={92} x2={148} y2={92} stroke={colors.ink} strokeWidth={STROKE} />
      <Line x1={92} y1={108} x2={148} y2={108} stroke={colors.subtle} strokeWidth={STROKE} />
      <Line x1={92} y1={122} x2={132} y2={122} stroke={colors.subtle} strokeWidth={STROKE} />
      <Line x1={92} y1={136} x2={120} y2={136} stroke={colors.subtle} strokeWidth={STROKE} />
    </G>
  );
}

function Empty() {
  return (
    <G>
      <Backdrop />
      <Rect
        x={78}
        y={92}
        width={84}
        height={56}
        rx={8}
        fill={colors.surface}
        stroke={colors.lineStrong}
        strokeWidth={STROKE}
      />
      <Line x1={90} y1={112} x2={132} y2={112} stroke={colors.subtle} strokeWidth={STROKE} />
      <Line x1={90} y1={128} x2={118} y2={128} stroke={colors.subtle} strokeWidth={STROKE} />
    </G>
  );
}
