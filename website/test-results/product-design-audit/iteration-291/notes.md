# Iteration 291 - User-Facing Garden Counts

Scope: remove schema-style app copy from the core sample app surfaces.

Changed:
- Ask header summary changed from "2 areas, 3 beds, 4 growing plants" to "4 plants saved in 3 beds."
- My Garden subtitle changed from "See each area, bed, plant, and note by place" to "See where each plant lives and what happened there."
- My Garden drawer summary changed from "2 areas, 3 beds, 4 growing plants" to "4 plants saved in 3 beds."
- My Plants drawer summary changed from "4 growing plants across 3 beds" to "4 saved plants in 3 beds."
- The same title/subtitle change was applied to both real app and sample app shells.

Evidence:
- Product Design user-context preflight ran; no saved visual/product references were available.
- Focused tests passed: `ai-first-garden-home.test.tsx`, `sample-garden.test.ts`, and `empty-state-content.test.ts` - 3 files, 26 tests.
- Full `npm test` passed: 23 files, 128 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Preview restarted at `http://127.0.0.1:3021`.
- Rendered sample ask route contains "4 plants saved in 3 beds" and no matched old "areas/growing plants" count in the checked text.
- Rendered sample My Garden route contains "See where each plant lives and what happened there" and "4 plants saved in 3 beds."
- Rendered sample My Plants route contains "4 saved plants in 3 beds."

Limit:
- Browser screenshot capture was not used. The available Product Design Browser/Chrome tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.
