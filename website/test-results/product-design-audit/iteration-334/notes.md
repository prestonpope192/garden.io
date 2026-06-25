# Iteration 334 - My Garden Place Copy

Date: 2026-06-24
Surface: My Garden/property view in the app and sample garden
Health: Green

Goal: Make the My Garden surface explain the user's benefit more directly: see what grows where, keep notes and care together, and start with the next plant to check.

Changes:
- Changed the My Garden route subtitle from `See where each plant lives, with its notes and care.` to `See what grows where, with notes and care in one place.`
- Changed the property guide line from `Open a place or plant for its notes, photos, and care.` to `Start with the next plant to check, or open any bed for notes.` when care is due.
- Kept the no-urgent-care line simple: `Open any bed or plant for notes and photos.`
- Updated tests to require the new user-facing copy and reject the older object-model phrasing.

Files:
- `website/components/garden-app.tsx`
- `website/components/garden-app-preview.tsx`
- `website/components/views/property-view.tsx`
- `website/tests/sample-garden.test.ts`

Evidence:
- Product Design audit, Product Design critical overrides, saved user-context preflight, session-budget guidance, and Garden.io memory were read during this pass.
- Product Design saved context preflight found no saved entries, so this pass used the current repo and Garden.io memory as grounding.
- Focused tests passed: `sample-garden.test.ts`, `empty-state-content.test.ts`, and `ai-first-garden-home.test.tsx` - 3 files, 26 tests.
- Full `npm test` passed: 23 files, 130 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Live `/sample-garden/property` contains `See what grows where, with notes and care in one place.` and `Start with the next plant to check, or open any bed for notes.`
- Live `/sample-garden/property` did not return `See where each plant lives, with its notes and care.` or `Open a place or plant for its notes, photos, and care.` in the route probe.

Limit:
- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.
