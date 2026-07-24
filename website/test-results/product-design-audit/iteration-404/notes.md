# Iteration 404 Notes

Scope: align plant-card care labels with the `This Week` weekly-care model.

Changed:
- Changed Plant Journal growing-card labels from `Next care:` to `This week:`.
- Changed the selected-plant drawer in My Garden from `Next care:` to `This week:`.
- Updated sample-garden and empty-state content tests to require `This week:` and reject `Next care:` in those surfaces.

Evidence:
- Product Design audit guidance, Product Design critical overrides, Product Design saved-context preflight, session-budget guidance, Garden.io memory, current source, and live local route output were used.
- Product Design saved-context preflight found a context file but no saved entries, so this pass used current repo and local route evidence.
- Focused tests passed from the website package: `sample-garden.test.ts` and `empty-state-content.test.ts` - 2 files, 21 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Live `/sample-garden/plants` route-output probe found four `This week:` labels and no `Next care:` labels.
- The selected-plant My Garden drawer state is covered by focused component tests because the default live sample route does not open that drawer.

Limit:
- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, Codex app capture has been blocked by safety policy in this session, and Playwright fallback requires explicit permission under the Product Design rules.
