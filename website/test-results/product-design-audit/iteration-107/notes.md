# Product Design Audit Iteration 107

Scope: simplify saved-plant fallback copy and keep the read-only sample calendar focused instead of exposing the dense week grid.

Capture status: no new screenshots were captured in this pass. Product Design Browser capture was not exposed through available tools, and Playwright fallback still requires explicit user approval. Validation used source inspection, component rendering tests, production build, and rendered route HTML from `http://localhost:3020`.

## What Changed

- Saved plant cards now use `Saved for later` instead of `Saved as an idea`.
- Saved plant list rows now use `Saved for later` instead of a dash when no note exists.
- The selected saved-plant drawer preview now uses `Saved for later`.
- The read-only sample calendar no longer renders the dense week grid when tasks happen to fall in the current week.
- Calendar tests now cover both the `Next care item coming up` fallback and the current-week count, while still rejecting the week-grid classes in sample mode.

## Product Design Read

Step 1, saved plants: improved. Saved items now use the same plain-language mental model as the Plant Guide and mutation feedback.

Step 2, sample calendar: improved. The sample stays focused on a short care list and upcoming rail instead of exposing full calendar mechanics.

Step 3, prospective-user comprehension: improved. The sample demonstrates the value of knowing what to do next without asking a new user to decode every scheduling control.

Step 4, public and signed-out routes: healthy. No stale visible-copy regression found in rendered route HTML.

## Verification

- `npm test -- sample-garden.test.ts empty-state-content.test.ts garden-mutation-copy.test.ts`: 3 files, 17 tests passed.
- `npm test`: 17 files, 84 tests passed.
- `git diff --check`: passed.
- `npm run build`: passed.
- Rendered-route visible-copy scan: passed for 14 routes at `http://localhost:3020`.
- `/sample-garden/calendar` rendered without `garden-cal2-week-grid` or `garden-cal2-day-col`.

## Remaining Risk

- Screenshot evidence is still limited because no approved screenshot capture path is available in this environment.
- Protected signed-in app states still rely primarily on component rendering tests without a real signed-in browser session.
- Editable calendar grid behavior still needs a browser-backed interaction pass later, but this change intentionally only affects read-only sample mode.
