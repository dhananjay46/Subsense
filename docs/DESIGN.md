# Subsense — Design story

## 1. What this product is
Subsense is a mobile app that gives an Indian household one honest view of every subscription they pay for, with a quiet nudge before each renewal.

## 2. Why it looks the way it does
- **Warm off-white, not clinical white.** Money anxiety already feels cold; we don't need to add to it.
- **Serif for numbers.** Fraunces makes a ₹ total feel considered, not alarmist.
- **No drop shadows.** Depth comes from paper-like tonal shifts, like a well-made notebook.

## 3. The user, in their own words
From proto-personas, to be validated:
- Meera (Family Admin, 38): "I pay for everyone, but I couldn't tell you who watches what."
- Arjun (Stacker, 27): "Each one is only ₹100-something. I never added them up."
- Sana (Freelancer, 31): "I found out about a ₹9,000 renewal from my credit-card statement."

## 4. Visual direction
- Palette: warm off-white canvas, pure white surfaces, 1px warm-grey borders. Coral for action, teal for insight, amber for caution.
- Type: Fraunces (serif) for display and numbers; Geist (sans) for everything else; Geist Mono for inline prices.
- Mood reference: a well-kept financial journal, not a dashboard.

## 5. Component language
A card feels like paper with a line, not a widget with a shadow. Buttons press in with a small haptic. Numbers never jump — they count up or morph. Motion is confident, never bouncy.

## 6. Content voice
See `.claude/skills/subsense-brand/references/voice.md` — older-sibling-good-with-money.

## 7. States we always design
Loading, empty, error, zero-data, single-item, overflow (100+), offline. See `components.md` for defaults.

## 8. Anti-patterns
- No neon gradients. No cartoon illustrations. No modal upsells.
- No shaming language. No red-and-green pressure.
- No log-ins in the demo path.
- No feature parity with Rocket Money. We are not an aggregator; we are a sense-maker.

## 9. The demo moment
In 15 seconds a reviewer must feel this: paste a UPI receipt → watch the fields fill themselves in → the dashboard already shows next week's renewal, with a one-sentence nudge.

## 10. Platform personality
iOS first (Expo Go demo on iPhone). Spring animations, haptics, Dynamic Island awareness optional. Android must feel identical, not Material-flavoured.

## 11. The one-handed test
Every primary action lives in the bottom half of the screen. The reviewer uses it one-handed on an iPhone 15 or Pixel 8.

## 12. User journey (reference, not prompt)
Dashboard → Pre-renewal nudge → Open subscription → "Still worth it?" verdict → Keep / Pause / Cancel steps. OR: Dashboard → Add → Paste receipt → AI parses → Confirm → Dashboard.