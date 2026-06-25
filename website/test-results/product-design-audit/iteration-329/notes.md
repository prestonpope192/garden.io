# Iteration 329 - Homepage Care-Step Promise

Date: 2026-06-24
Surface: homepage How it helps section
Health: Green

Goal: Make the homepage's middle promise sound like a gardener benefit instead of an abstract question/context loop.

Changes:
- Changed the homepage section body from `Your next question starts with the plant, place, season, and notes already in the journal.` to `Show what changed, then keep the useful care step with the right plant.`
- Changed the third loop item from `Ask from your garden` / `When something looks off, start with its place, season, and notes.` to `Get one care step` / `When something looks off, start with the plant and what you already noticed.`
- Updated homepage tests to require the new copy and reject the older abstract phrases.

Files:
- `website/app/page.tsx`
- `website/tests/homepage-content.test.ts`

Evidence:
- Product Design audit, Product Design index, user-context preflight, critical overrides, session-budget guidance, and Garden.io memory were read during this pass.
- Product Design saved context preflight found no saved entries, so this pass used the current repo and Garden.io memory as grounding.
- Focused tests passed: `homepage-content.test.ts` and `auth-gate-content.test.ts` - 2 files, 6 tests.
- Full `npm test` passed: 23 files, 130 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Live `/` contains `Show what changed, then keep the useful care step with the right plant.` and `Get one care step`.
- Live `/` did not return the old `Your next question starts...` phrase in the route probe.

Limit:
- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.
