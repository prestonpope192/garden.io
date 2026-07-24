# Iteration 449 - Plant Journal Next Labels

Date: 2026-06-24
Surface focus:
- Sample garden Plant Journal route
- Growing plant cards

## Scope

Make each plant card's care label scan faster by naming the next plant action instead of repeating a weekly schedule label.

## Changes

- Changed the growing plant card label from `This week:` to `Next:`.
- Updated sample and empty-state tests to lock in the shorter card label and keep the old label out of Plant Journal cards.

## Evidence

- Live `/sample-garden/plants` route-output probe found `Next:` before each plant's care item.
- Focused tests passed from the website package: `sample-garden.test.ts` and `empty-state-content.test.ts` - 2 files, 21 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limit

- Browser screenshot capture was not used. This pass used server-rendered route text plus full test/build verification; Playwright fallback still requires explicit permission under the Product Design browser rule.
