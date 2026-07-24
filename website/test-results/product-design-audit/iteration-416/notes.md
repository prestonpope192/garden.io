# Iteration 416 - My Garden Weekly Label

Date: 2026-06-24
Route checked: `http://127.0.0.1:3021/sample-garden/property`

## Scope

Make the My Garden summary card use the same plain weekly-care language as the rest of the app.

## Change

- Changed the property summary label from `Check first` to `This week`.
- Updated the sample garden content test to require `This week`, reject `Check first`, and keep the label after the `Beds and areas` heading.

## Rationale

`Check first` sounded like an internal priority badge. `This week` is simpler, calmer, and matches the This Week calendar and Plant Journal language already used elsewhere in the app.

## Evidence

- `npm test -- sample-garden.test.ts` passed from the website package: 1 file, 13 tests.
- Live `/sample-garden/property` route-output probe found `This week Bell Pepper Water deeply before the hot afternoon` and did not find `Check first`.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed from the website package.
- `git diff --check` passed.

## Limit

Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed in this turn, and the only available screenshot-capable app tool has been blocked by safety policy for the Codex app in this session. Playwright fallback requires explicit permission under the Product Design rules.
