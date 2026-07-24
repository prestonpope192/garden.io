# Iteration 415 - My Garden Subtitle

Date: 2026-06-24
Route checked: `http://127.0.0.1:3021/sample-garden/property`

## Scope

Align the My Garden subtitle with the rest of the app's calmer `this week's care` language.

## Change

- Changed the shared My Garden subtitle from `See each bed, what grows there, and what needs care next.` to `See each bed, what grows there, and this week's care.`
- Updated the sample garden content test to require the new subtitle in both shared app shells and reject the older `what needs care next` phrasing.

## Rationale

`what needs care next` pulled the app back toward generic next-step/task language. `this week's care` is more concrete and matches the current This Week and Plant Journal copy, while still telling the user why the garden map matters.

## Evidence

- `npm test -- sample-garden.test.ts` passed from the website package: 1 file, 13 tests.
- Live `/sample-garden/property` route-output probe found `See each bed, what grows there, and this week's care.` and did not find `See each bed, what grows there, and what needs care next.`
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed from the website package.
- `git diff --check` passed.

## Limit

Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed in this turn, and the only available screenshot-capable app tool has been blocked by safety policy for the Codex app in this session. Playwright fallback requires explicit permission under the Product Design rules.
