# Iteration 471 - Today Shortcut Copy

Date: 2026-06-24
Surface: `/sample-garden/ask`, `GardenAskView`

## Scope

Simplify the Today shortcut row by replacing the vague `See next care` label with a clearer weekly-care destination.

## Changed

- Changed the Today shortcut text from `See next care` to `Weekly care`.
- Changed the shortcut accessibility label from `See next care` to `Open weekly care`.
- Updated Garden Check/Today tests to protect the new wording and reject the older vague shortcut.

## Evidence

- Live `/sample-garden/ask` route-output probe found `Your garden, smarter.`, `See your garden`, `Weekly care`, and `Choose plants`.
- Focused tests passed from the website package: `ai-first-garden-home.test.tsx` and `sample-garden.test.ts` - 2 files, 18 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limit

Browser screenshot capture was not available. The Browser-specific tool was not exposed, and Computer Use is blocked from accessing the Codex app, so this pass used route-output probes plus test/build verification.
