# Iteration 283 - Copy Simplification

## Objective

Respond to the homepage/app copy concern by centering the user-facing promise around "Your garden, smarter" instead of feature or developer-facing phrasing.

## Changes

- Rewrote the homepage hero support line around a simple garden journal that uses notes and photos to make the garden smarter.
- Reframed the homepage loop as "Map your garden", "Log what happened", and "Get smarter guidance."
- Updated metadata, auth gate, sample ask surface, signed-in ask surface, and plant diagnosis panel to use consistent guidance language.
- Changed app CTAs from "Get next step" to "Get guidance" where the action is asking Garden.io for help.

## Proof

- `npm test -- homepage-content.test.ts auth-gate-content.test.ts ai-first-garden-home.test.tsx sample-garden.test.ts diagnose-panel-content.test.ts` passed: 5 files, 25 tests.
- `npm run build` passed.
- `npm test` passed: 23 files, 128 tests.
- `git diff --check` passed.
- Live preview restarted and confirmed updated copy on `http://127.0.0.1:3021`, `/sample-garden/ask`, and `/app/my-property`.

## Remaining

- This was a copy-only pass. The active product-design goal remains open for continued visual and flow simplification.
