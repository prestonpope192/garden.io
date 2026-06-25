# Iteration 323 - Ask Surface Note-First Copy

Date: 2026-06-23
Surface: sample app Ask route and Ask answer save panel
Health: Green

Goal: Make the Ask surface explain the smart-garden value in plain gardener language without awkward `ask from` or context-plumbing phrasing.

Changes:
- Changed the Ask lead from `Add a note or photo. Ask from the plants, beds, weather, and notes you already saved.` to `Add a note or photo. The answer starts with your saved plants, beds, weather, and notes.`
- Changed the composer hint from `Save useful notes so the next visit starts with what happened.` to `Save useful notes so the next visit starts with what you noticed.`
- Changed the answer-save helper from `Save it with the right plant or bed so the next visit starts with what happened.` to `Save it with the right plant or bed so the next visit starts with what you noticed.`
- Updated Ask and sample garden tests to require the new wording and reject the old phrases.

Files:
- `website/components/views/garden-ask-view.tsx`
- `website/tests/sample-garden.test.ts`
- `website/tests/ai-first-garden-home.test.tsx`

Evidence:
- Product Design audit, Product Design index, critical overrides, session-budget guidance, and Garden.io memory were read during this pass.
- Focused tests passed: `sample-garden.test.ts` and `ai-first-garden-home.test.tsx` - 2 files, 18 tests.
- Full `npm test` passed: 23 files, 130 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Live `/sample-garden/ask` contains `The answer starts with your saved plants, beds, weather, and notes` and `Save useful notes so the next visit starts with what you noticed`.
- Live `/sample-garden/ask` did not return old `Ask from the plants` or `starts with what happened` phrases in the route probe.

Limit:
- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.
