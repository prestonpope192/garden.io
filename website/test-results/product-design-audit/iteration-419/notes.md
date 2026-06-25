# Iteration 419 - Calendar Later Count

Date: 2026-06-24
Route checked: `http://127.0.0.1:3021/sample-garden/calendar`

## Scope

Make the This Week later-care count read like normal user-facing copy.

## Change

- Changed the later-week count from `{n} after today` to `{n} later this week`.
- Updated sample calendar tests to require the new count pattern and reject `after today`.

## Rationale

`2 after today` was accurate but felt like internal shorthand. `2 later this week` reads naturally beside the `Later this week` heading and keeps the calendar focused on calm weekly care.

## Evidence

- `npm test -- sample-garden.test.ts` passed from the website package: 1 file, 13 tests.
- Live `/sample-garden/calendar` route-output probe found `2 later this week` and did not find `2 after today`.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed from the website package.
- `git diff --check` passed.

## Limit

Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed in this turn, and the only available screenshot-capable app tool has been blocked by safety policy for the Codex app in this session. Playwright fallback requires explicit permission under the Product Design rules.
