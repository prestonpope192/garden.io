# Iteration 304 - Calendar Care Rail Copy

Date: 2026-06-23 20:57 CDT
Preview: http://127.0.0.1:3021

## Scope

Make the secondary calendar care rail sound less like generic app ideas and more like things a gardener might try.

## Changed

- Changed the calendar rail label from `Ideas for later` to `Try later`.
- Changed the empty rail message from `No extra ideas right now.` to `Nothing else to try right now.`
- Kept the nearby `Add care`, `What needs doing?`, and `Add to care list` language because it is already direct and user-facing.

## Evidence

- Product Design audit, user-context preflight, and critical overrides were read during this pass.
- Garden.io memory was checked to preserve the living botanical notebook / useful AI companion tension.
- Focused tests passed: `empty-state-content.test.ts`, `sample-garden.test.ts`, and `app-flow-visual-css.test.ts` - 3 files, 31 tests.
- Full `npm test` passed: 23 files, 130 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Preview restarted at `http://127.0.0.1:3021`.
- Source scan found `Ideas for later` and `No extra ideas right now` only in negative test guards.
- Rendered calendar tests confirm `Try later` and reject the old rail copy.
- Live `/sample-garden/calendar` still contains `Care this week`.
- Live `/sample-garden/ask` contains `Your garden, smarter`, `Garden notes`, `This week`, and `Field guide`.
- Live `/` contains `Your garden, smarter`, `A calm garden notebook`, and `Start with one plant`.

## Limit

Browser screenshot capture was not used. The required Product Design Browser/Chrome screenshot tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.

The live sample calendar check did not expose the secondary rail text in the captured HTML slice, so the `Try later` verification is from rendered component tests and source checks.

## Next Target

Continue checking remaining care-list buttons and navigation microcopy for generic task-management language.
