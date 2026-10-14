# Subsense — Project Instructions

Subsense is an India-first subscription tracker across six categories: OTT, music, productivity, cloud storage, fitness & wellness, and subscription boxes. Mobile app, light mode.

## Golden rules
1. Read `docs/DESIGN.md` and `.claude/skills/subsense-brand/SKILL.md` before any UI work.
2. Load `design-engineer` skill when converting Figma to code.
3. Load `animate-expo` and `animation-vocabulary` before any motion.
4. NEVER install a React Native UI kit (NativeBase, UI Kitten, React Native Paper, Tamagui). We hand-roll primitives.
5. NEVER use heavy drop shadows. Depth comes from subtle color shifts (surface → surface-raised) and 1px lines.
6. Every tap gets a haptic. Every screen transition has intent.
7. No `any` types. No hardcoded colors. No pixel values that aren't on the 4-point grid.

## Stack
- Expo SDK latest, React Native, TypeScript strict
- Expo Router v3 (file-based)
- NativeWind v4 + token layer in global.css
- Reanimated 3, Gesture Handler
- @gorhom/bottom-sheet, @shopify/flash-list
- expo-blur, expo-linear-gradient, expo-haptics, expo-font
- Zustand + AsyncStorage persist
- react-hook-form + zod
- Victory Native XL (charts)
- Lottie-react-native (one signature animation)
- @anthropic-ai/sdk (receipt parsing with Claude Sonnet 4.5)

## Theme
Light mode only for v1.

## Non-negotiables for every component
- Loading, empty, and error states.
- INR formatting via Intl.NumberFormat('en-IN').
- Numbers rendered with `fontVariant: ['tabular-nums']`.
- Minimum 44pt hit target on every pressable.
- `accessibilityLabel` and `accessibilityRole` on every interactive element.
- Safe area from react-native-safe-area-context.

## Day 1 — Scaffold commands
pnpm create expo-app . -t default-typescript
pnpm add nativewind@latest tailwindcss@^3.4
pnpm add react-native-reanimated react-native-gesture-handler react-native-safe-area-context
pnpm add @gorhom/bottom-sheet @shopify/flash-list
pnpm add expo-blur expo-linear-gradient expo-haptics expo-font expo-router
pnpm add zustand @react-native-async-storage/async-storage
pnpm add react-hook-form zod @anthropic-ai/sdk date-fns
pnpm add lottie-react-native victory-native react-native-svg

## Commands
pnpm start — Expo dev server (QR code to open in Expo Go)
pnpm ios / pnpm android — simulators
pnpm lint — ESLint
pnpm typecheck — TypeScript check

## Where things live
app/            Expo Router pages
components/     Hand-rolled primitives + composed components
lib/            store.ts, ai.ts, seed.ts, utils.ts
types/          Shared types
styles/         global.css with tokens
assets/         Fonts, Lottie files