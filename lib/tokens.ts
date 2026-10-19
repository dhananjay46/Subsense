/**
 * Hex mirror of the token layer in styles/global.css.
 * Use classNames everywhere you can. Reach for these only where an API can't take a
 * className: navigator options, Reanimated, Switch, BlurView, SVG.
 */
export const colors = {
  bg: '#FAFAF7',
  bgRaised: '#F4F0E8',
  surface: '#FFFFFE',
  surfaceSunken: '#F0ECE2',
  ink: '#16161A',
  muted: '#5E5E66',
  subtle: '#6B6B74',
  line: '#E4E0D8',
  lineStrong: '#CFC9BE',
  lineControl: '#8A8276',
  coral: '#D9482A',
  coralSoft: '#FBE4DC',
  coralInk: '#A8341A',
  coralFill: '#C13C20',
  teal: '#0B6E6C',
  tealSoft: '#D7ECEB',
  amber: '#C58C1E',
  amberSoft: '#F7E8CA',
  amberInk: '#7A5200',
  rose: '#B3261E',
  roseSoft: '#F5D9D6',
  scrim: 'rgba(22,22,26,0.32)',
  blurTint: 'rgba(250,250,247,0.72)',
} as const;

export const fonts = {
  display: 'Fraunces_500Medium',
  sans: 'Geist_400Regular',
  sansMedium: 'Geist_500Medium',
  sansSemibold: 'Geist_600SemiBold',
  mono: 'GeistMono_500Medium',
} as const;

export const radius = { sm: 10, md: 14, lg: 20, xl: 24, sheet: 28, pill: 999 } as const;

/** House spring. Press, sheet, page snap. */
export const spring = { damping: 20, stiffness: 180, mass: 1 } as const;
export const springSoft = { damping: 24, stiffness: 140 } as const;
export const springTight = { damping: 18, stiffness: 240 } as const;

export const timing = { fast: 160, base: 240, slow: 400 } as const;

/** Entry choreography: fade + rise 8, staggered 40. */
export const entry = { rise: 8, stagger: 40 } as const;

export const hitTarget = 44;
