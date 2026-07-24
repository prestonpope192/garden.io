# Iteration 324 - Plants Route Care-First Copy

Date: 2026-06-23
Surface: sample app Plants route and Plants empty drawer
Health: Green

Goal: Make the Plants route explain the user benefit directly instead of describing list sorting behavior.

Changes:
- Changed the Plants route subtitle from `Plants with care due soon appear first. Open one for notes and photos.` to `Start with plants that need care. Open one for notes and photos.`
- Changed the empty drawer guide copy to use the same care-first wording after the saved plant count.
- Updated sample garden and empty-state tests to require the new wording and reject `Plants with care due soon appear first.`

Files:
- `website/components/garden-app-preview.tsx`
- `website/components/views/plants-view.tsx`
- `website/tests/sample-garden.test.ts`
- `website/tests/empty-state-content.test.ts`

Evidence:
- Product Design audit, Product Design index, user-context preflight, critical overrides, session-budget guidance, and Garden.io memory were read during this pass.
- Product Design saved context preflight found no saved entries, so this pass used the current repo and Garden.io memory as grounding.
- Focused tests passed: `sample-garden.test.ts` and `empty-state-content.test.ts` - 2 files, 21 tests.
- Full `npm test` passed: 23 files, 130 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Live `/sample-garden/plants` contains `Start with plants that need care. Open one for notes and photos.`
- Live `/sample-garden/plants` did not return old `Plants with care due soon appear first` phrase in the route probe.

Limit:
- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.
