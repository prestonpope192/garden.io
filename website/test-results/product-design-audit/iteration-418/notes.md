# Iteration 418 - My Garden Quiet Fallbacks

Date: 2026-06-24
Surface checked: My Garden fallback copy in `property-view.tsx`

## Scope

Remove urgency-heavy fallback language from My Garden states that appear when no care is queued.

## Change

- Changed `Nothing urgent right now.` to `No care waiting this week.`
- Changed `Nothing urgent here right now.` to `No care waiting here this week.`
- Updated empty-state/source tests to require the calmer copy and reject the old urgency phrases.

## Rationale

`Nothing urgent` still frames the garden around urgency. `No care waiting this week` is calmer, clearer, and matches the weekly-care language used across My Garden, Plant Journal, and This Week.

## Evidence

- `npm test -- empty-state-content.test.ts` passed from the website package: 1 file, 8 tests.
- Source scan found `No care waiting this week.` and `No care waiting here this week.` in `property-view.tsx`.
- Source scan found no `Nothing urgent right now.` or `Nothing urgent here right now.` in the edited property source/tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed from the website package.
- `git diff --check` passed.

## Limit

The current sample garden route has care queued, so this fallback text does not render in the live route output. Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed in this turn, and the only available screenshot-capable app tool has been blocked by safety policy for the Codex app in this session. Playwright fallback requires explicit permission under the Product Design rules.
