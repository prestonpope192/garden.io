# Iteration 343 Notes

Date: 2026-06-24
Surface: sample garden Calendar / This Week
Task class: build work
Destination: local audit folder

## Objective

Make the Calendar empty and upcoming-care states feel calmer and more specific to garden care.

## Product Design Steps

1. Upcoming-care status
   - Health: Green
   - Output: `website/components/views/calendar-view.tsx`
   - Changed `Care is coming up.` to `Care is coming up after this week.` so the message says when the care is coming.

2. No-care state
   - Health: Green
   - Output: `website/components/views/calendar-view.tsx`
   - Changed `Nothing urgent this week.` to `Nothing needs care this week.` to remove anxious urgency language.

3. Calendar regression coverage
   - Health: Green
   - Output: `website/tests/empty-state-content.test.ts`, `website/tests/sample-garden.test.ts`
   - Updated tests to require the calmer Calendar copy and reject the old `urgent`/generic upcoming phrasing.

## Evidence

- Product Design audit, Product Design critical overrides, saved user-context preflight, session-budget guidance, and Garden.io memory were read during this pass.
- Product Design saved context preflight found no saved entries, so this pass used the current repo and current app source as grounding.
- Focused tests passed: `sample-garden.test.ts`, `empty-state-content.test.ts`, and `garden-mutation-copy.test.ts` - 3 files, 22 tests.
- Full `npm test` passed: 23 files, 130 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Live `/sample-garden/calendar` contains either the new upcoming-care wording or the current care-check count, depending on week data.
- Live `/sample-garden/calendar` does not contain `Nothing urgent this week`, `Care is coming up.`, `Tasks`, `Filter tasks`, `Next task coming up`, or `care jobs`.

## Limit

Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, Codex app capture is blocked by safety policy, and Playwright fallback requires explicit permission under the Product Design rules.
