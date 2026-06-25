# Iteration 308 - Garden drawer action wording

Scope: make the My Garden drawer controls sound like garden actions instead of generic software controls.

Finding:
- The drawer management section already used direct labels like `Change this plant`.
- The edit action still said `Edit details`, which was generic and less clear once the drawer can focus a garden, area, bed, or plant.
- The drawer's screen-reader label was `Garden details`, which described a panel type more than the user's garden notebook.

Changed:
- Changed the edit button to `Edit this {garden/area/bed/plant}` based on the current drawer focus.
- Changed the drawer accessibility label from `Garden details` to `Garden notebook`.
- Updated tests to verify the plant drawer renders `Edit this plant`, rejects `Edit details`, and preserves the dynamic source label.

Evidence:
- Product Design audit, Product Design index, user-context preflight, critical overrides, and design-audit framework were read during this pass.
- Product Design saved context preflight returned no saved entries, so this pass used the current repo and Garden.io memory as grounding.
- Focused tests passed: `empty-state-content.test.ts`, `sample-garden.test.ts`, and `app-flow-visual-css.test.ts` - 3 files, 31 tests.
- Full `npm test` passed: 23 files, 130 tests.
- `git diff --check` passed.
- `npm run build` passed with Next.js production build.
- Standalone preview restarted at `http://127.0.0.1:3021`.
- Live `/sample-garden/property` contains `Garden notebook`.
- Live `/` still contains `Your garden, smarter`, `A calm garden notebook`, and `Ask with context`.

Limit:
- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.
- The route HTML probe exposed the drawer accessibility label, while the exact interactive edit-button text is verified through rendered component tests.
