# Iteration 325 - This Week Care Count Copy

Date: 2026-06-23
Surface: sample app This Week route
Health: Green

Goal: Make the weekly care counters sound like garden work instead of generic to-do list copy.

Changes:
- Changed the weekly count from `N things to do` to `N care job(s)`.
- Changed the upcoming count from `N later this week` to `N care job(s) later this week`.
- Used a single template string for the upcoming count so the visible text does not split `job` and `s`.
- Updated sample garden tests to require the care-job wording and reject `things to do` / `2 later this week`.

Files:
- `website/components/views/calendar-view.tsx`
- `website/tests/sample-garden.test.ts`

Evidence:
- Product Design audit, Product Design index, user-context preflight, critical overrides, session-budget guidance, and Garden.io memory were read during this pass.
- Product Design saved context preflight found no saved entries, so this pass used the current repo and Garden.io memory as grounding.
- Focused tests passed: `sample-garden.test.ts` and `empty-state-content.test.ts` - 2 files, 21 tests.
- Full `npm test` passed: 23 files, 130 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Live `/sample-garden/calendar` contains `3 care jobs` and `2 care jobs later this week`.
- Live `/sample-garden/calendar` did not return `things to do`, `2 later this week`, or the split `care job s` phrase.
- The first focused test run caught a brittle exact-count assertion and a JSX split-text issue; both were fixed before the passing verification run.

Limit:
- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.
