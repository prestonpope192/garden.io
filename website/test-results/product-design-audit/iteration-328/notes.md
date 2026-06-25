# Iteration 328 - Shared Route Heading Copy

Date: 2026-06-24
Surface: shared app route headings for Ask and My Garden
Health: Green

Goal: Align the authenticated app and sample preview route headings with the cleaned user-facing copy already visible in the app flows.

Changes:
- Changed the Ask route subtitle in `GardenApp` and `GardenAppPreview` from `Write a garden note or add a photo. Keep what matters with the right plant, bed, and season.` to `Show what changed. Get one useful care step from the garden you already saved.`
- Changed the My Garden route subtitle in `GardenApp` from `See where each plant lives and what happened there.` to `See where each plant lives, with its notes and care.`
- Updated sample garden tests to inspect both route-heading source tables and reject the older phrases.

Files:
- `website/components/garden-app.tsx`
- `website/components/garden-app-preview.tsx`
- `website/tests/sample-garden.test.ts`

Evidence:
- Product Design audit, Product Design index, user-context preflight, critical overrides, session-budget guidance, and Garden.io memory were read during this pass.
- Product Design saved context preflight found no saved entries, so this pass used the current repo and Garden.io memory as grounding.
- Focused tests passed: `sample-garden.test.ts`, `ai-first-garden-home.test.tsx`, and `empty-state-content.test.ts` - 3 files, 26 tests.
- Full `npm test` passed: 23 files, 130 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Live `/sample-garden/ask` contains `Show what changed. Get one useful care step from the garden you already saved.`
- Live `/sample-garden/property` contains `See where each plant lives, with its notes and care.`
- Source search confirms the old route-heading phrases only remain inside negative regression assertions.
- The first focused test run caught duplicate source variable declarations in the updated test; those were fixed before the passing verification run.

Limit:
- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.
