# Iteration 83 - Recommendation Copy Simplification

## Current-State Finding

- The app had been cleaned substantially, but the recommendation and calendar surfaces still carried formal or engine-like wording.
- History-based next steps used phrases like `track record`, `records`, `underperformed`, `lean into it`, and `Rethink`, which sound more like analysis output than practical gardening help.
- The calendar side rail used interface-oriented labels such as `Upcoming (14 days)`, `Undated`, `Task title`, and `Due date`.

## Changes Implemented

- Rewrote history-based plant recommendations:
  - `has a strong track record for you` -> `has done well for you`
  - `From your records` -> `From what you saved`
  - `has underperformed for you before` -> `has struggled before`
  - `Scout ... early - past plantings underperformed` -> `Check ... early`
  - `Note: ... has a strong track record` -> `Keep ... in the plan`
- Rewrote bed-level recommendation copy:
  - `A reliable pairing - lean into it.` -> `This pairing is working.`
  - `has underperformed in ...` -> `has struggled in ...`
  - `Rethink ...` -> `Try a different plan for ...`
  - rationale now suggests trying a different bed or changing how the crop is grown.
- Simplified calendar side rail labels:
  - `Upcoming (14 days)` -> `Coming up`
  - `No tasks due in the next 14 days.` -> `Nothing scheduled for the next two weeks.`
  - `Undated` -> `Needs a date`
  - `no date` -> `pick a date`
  - `Next care steps` -> `What to do next`
  - `Task title` -> `What needs doing?`
  - `Due date` -> `When`
- Updated tests to protect the new wording and exclude the old phrases.

## Updated Health

- The recommendation rail now explains why a next step matters in plain gardening language.
- AI-backed/history-backed guidance feels more like a helpful memory of what happened in the garden, not a database report.
- The calendar rail is easier to scan: what is coming up, what needs a date, and what to do next.
- The app still uses the existing suggestion engine and data model; only the user-facing language changed.

## Evidence

- Product Design audit skill and critical overrides were loaded; user-context preflight ran and found no saved Product Design context.
- Focused tests passed: `garden-suggestions-history.test.ts`, `sample-garden.test.ts`, and `empty-state-content.test.ts`, 3 files, 20 tests.
- Full `npm test` passed: 17 test files, 78 tests.
- `git diff --check` passed.
- `npm run build` passed with Next.js production build.
- Rendered route scan confirmed `/`, `/sample-garden/property`, `/sample-garden/plants`, `/sample-garden/calendar`, `/sample-garden/catalogue`, `/catalog`, `/catalog/french-marigold`, `/app/my-property`, `/app/my-plants`, and `/app/calendar` returned `200`.
- Rendered route scan found no hits for `track record`, `underperformed`, `Your records`, `From your records`, `lean into it`, `Rethink`, `recorded harvests`, `recorded outcomes`, `Next care steps`, `Upcoming (14 days)`, `Task title`, `Due date`, `Undated`, `no date`, `Suggested next steps`, `Pattern spotted`, or `Recommended`.

## Evidence Limits

- No accepted screenshots were captured in this pass. In-app Browser screenshot capture previously timed out; Chrome fallback is currently unavailable because the Codex Chrome Extension is missing from the selected Chrome profile.
- Authenticated signed-in visual QA, keyboard flow, screen-reader behavior, successful magic-link delivery, and photo upload still need a reliable browser-backed pass.
