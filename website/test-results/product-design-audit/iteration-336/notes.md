# Iteration 336 - Calendar Care Check Copy

Date: 2026-06-24
Surface: This Week/calendar view in the app and sample garden
Health: Green

Goal: Make the weekly care count sound like a simple garden check instead of work-ticket language.

Changes:
- Changed the Calendar count label from `care job(s)` to `care check(s)`.
- Changed the later-this-week count from `care job(s) later this week` to `care check(s) later this week`.
- Updated tests to require the new wording and reject the old `care job(s)` phrasing.

Files:
- `website/components/views/calendar-view.tsx`
- `website/tests/sample-garden.test.ts`

Evidence:
- Product Design audit, Product Design critical overrides, saved user-context preflight, session-budget guidance, and Garden.io memory were read during this pass.
- Product Design saved context preflight found no saved entries, so this pass used the current repo and Garden.io memory as grounding.
- Focused tests passed: `sample-garden.test.ts`, `empty-state-content.test.ts`, and `app-flow-visual-css.test.ts` - 3 files, 31 tests.
- Full `npm test` passed: 23 files, 130 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Live `/sample-garden/calendar` contains `3 care checks` and `2 care checks later this week`.
- Live `/sample-garden/calendar` did not return `care job` in the route probe.

Limit:
- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.
