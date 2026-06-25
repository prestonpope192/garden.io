# Iteration 462 - This Week First Care Step

Date: 2026-06-24

Surface focus:
- Sample garden This Week route
- Authenticated This Week shell subtitle

## Scope

Make the weekly care screen speak as a direct action list: do the first care step, then let the rest wait.

## Changes

- Changed the This Week shell subtitle from `Start with the next care check. Let the rest wait.` to `Do the first care step. Let the rest wait.`
- Updated sample-garden tests to protect the simpler action-first wording and keep the older `next care check` wording out.

## Evidence

- Live `/sample-garden/calendar` route-output probe found `This Week`, `Do the first care step. Let the rest wait.`, `Start here`, `3 care steps this week`, `Today`, `Water deeply before the hot afternoon`, and `Later this week`.
- Focused tests passed from the website package: `sample-garden.test.ts` and `empty-state-content.test.ts` - 2 files, 21 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limit

- Browser screenshot capture was not used. This pass used server-rendered route text plus focused test verification; Playwright fallback still requires explicit permission under the Product Design browser rule.
