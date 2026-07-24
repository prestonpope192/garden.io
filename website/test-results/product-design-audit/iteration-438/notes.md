# Iteration 438 - This Week Care Hierarchy

Date: 2026-06-24
Surface focus:
- Sample garden `This Week` route
- Weekly care attention header

## Scope

Continue simplifying the care route so a gardener can see the next useful action without repeated summary labels.

## Changes

- Changed the attention header from `This week's care` to `Next care`.
- Changed the week count from `3 things this week` style language to `3 open this week`.
- Removed the duplicate `2 later this week` subhead count so `Later this week` appears once before the remaining care cards.
- Kept the app navigation label `This Week` because it is short, user-facing, and already works as the route name.

## Evidence

- Live `/sample-garden/calendar` route-output probe found `Next care`, `3 open this week`, `Today`, and a single `Later this week` label before the remaining care cards.
- Focused tests passed from the website package: `sample-garden.test.ts` and `empty-state-content.test.ts` - 2 files, 21 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limit

- Browser screenshot capture was not used. This pass used server-rendered route text plus full test/build verification; Playwright fallback still requires explicit permission under the Product Design browser rule.
