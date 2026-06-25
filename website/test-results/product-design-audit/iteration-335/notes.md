# Iteration 335 - Plants Daily Check Copy

Date: 2026-06-24
Surface: Plants view in the app and sample garden
Health: Green

Goal: Make the Plants surface feel like a practical daily check instead of a navigation instruction.

Changes:
- Changed the Plants route subtitle from `Start with plants that need care. Open one for notes and photos.` to `Check plants that need care first. Keep notes and photos together.`
- Changed the Plants empty-guide summary to use the same simpler promise.
- Updated tests to require the new copy and reject the old navigation-style phrasing.

Files:
- `website/components/garden-app.tsx`
- `website/components/garden-app-preview.tsx`
- `website/components/views/plants-view.tsx`
- `website/tests/sample-garden.test.ts`
- `website/tests/empty-state-content.test.ts`

Evidence:
- Product Design audit, Product Design critical overrides, saved user-context preflight, session-budget guidance, and Garden.io memory were read during this pass.
- Product Design saved context preflight found no saved entries, so this pass used the current repo and Garden.io memory as grounding.
- Focused tests passed: `sample-garden.test.ts`, `empty-state-content.test.ts`, and `app-flow-visual-css.test.ts` - 3 files, 31 tests.
- Full `npm test` passed: 23 files, 130 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Live `/sample-garden/plants` contains `Check plants that need care first. Keep notes and photos together.`
- Live `/sample-garden/plants` did not return `Start with plants that need care. Open one for notes and photos.` or `Open one for notes and photos.` in the route probe.

Limit:
- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.
