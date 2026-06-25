# Iteration 439 - Garden Check Action Copy

Date: 2026-06-24
Surface focus:
- Sample garden `Garden Check` route
- Ask composer primary action

## Scope

Make the AI check action read like a natural gardener-facing command instead of a clipped interface label.

## Changes

- Changed the primary ask button from `Get care step` to `Get one care step`.
- Kept the surrounding promise `Show what changed. Get one care step.` so the action and headline reinforce the same simple value.

## Evidence

- Live `/sample-garden/ask` route-output probe found `Garden Check`, `Show what changed. Get one care step.`, `Add a photo`, and `Get one care step`.
- Focused tests passed from the website package: `sample-garden.test.ts` and `ai-first-garden-home.test.tsx` - 2 files, 18 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limit

- Browser screenshot capture was not used. This pass used server-rendered route text plus full test/build verification; Playwright fallback still requires explicit permission under the Product Design browser rule.
