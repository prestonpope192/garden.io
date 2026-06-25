# Iteration 413 - Homepage Habit Label

Date: 2026-06-24
Route checked: `http://127.0.0.1:3021/`

## Scope

Make the homepage tracking section read more plainly for a prospective gardener by replacing the abstract label `Daily rhythm` with `Simple garden habit`.

## Change

- Changed the homepage section label to `Simple garden habit`.
- Updated the homepage content test to require the new label and reject `Daily rhythm`.

## Rationale

`Daily rhythm` was pleasant but a little internal and editorial. `Simple garden habit` is more direct: it tells a gardener the app helps them build one small repeatable behavior, which matches the current homepage promise of adding notes, photos, and care to the plant they belong to.

## Evidence

- `npm test -- homepage-content.test.ts` passed from the website package: 1 file, 5 tests.
- Live homepage route-output probe found `Simple garden habit` and did not find `Daily rhythm`.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed from the website package.
- `git diff --check` passed.

## Limit

Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, Codex app capture has been blocked by safety policy in this session, and Playwright fallback requires explicit permission under the Product Design rules.
