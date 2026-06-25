# Iteration 326 - Ask Screen User Promise

Date: 2026-06-24
Surface: sample app Ask route
Health: Green

Goal: Make the Ask screen's first-read promise explain the gardener benefit instead of describing the app's internal context model.

Changes:
- Changed the Ask lead from `Add a note or photo. The answer starts with your saved plants, beds, weather, and notes.` to `Show what changed. Get one useful care step from the garden you already saved.`
- Changed the composer hint from `Save useful notes so the next visit starts with what you noticed.` to `Save what you notice now so next week is easier.`
- Changed the answer-save helper from `Save it with the right plant or bed so the next visit starts with what you noticed.` to `Keep it with the right plant or bed so the next check starts in the right place.`
- Updated Ask and sample garden tests to require the new wording and reject the old implementation-heavy phrases.

Files:
- `website/components/views/garden-ask-view.tsx`
- `website/tests/ai-first-garden-home.test.tsx`
- `website/tests/sample-garden.test.ts`

Evidence:
- Product Design audit, Product Design index, user-context preflight, critical overrides, session-budget guidance, orchestratror-mode guidance, and Garden.io memory were read during this pass.
- Product Design saved context preflight found no saved entries, so this pass used the current repo and Garden.io memory as grounding.
- Focused tests passed: `ai-first-garden-home.test.tsx`, `sample-garden.test.ts`, and `empty-state-content.test.ts` - 3 files, 26 tests.
- Full `npm test` passed: 23 files, 130 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Live `/sample-garden/ask` contains `Show what changed. Get one useful care step from the garden you already saved.` and `Save what you notice now so next week is easier.`
- Live `/sample-garden/ask` did not return the old `The answer starts with your saved plants, beds, weather, and notes.` phrase in the route probe.
- The first focused test run caught two stale assertions that still expected the old copy; both were fixed before the passing verification run.

Limit:
- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.
