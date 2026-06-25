# Product Design Audit - Iteration 523

Date: 2026-06-24
Scope: make My Garden drawer tabs name the work a gardener is doing instead of using vague action language.

## Changed
- Changed the My Garden ideas drawer tab from `Try` to `Care ideas`.
- Updated drawer-tab tests to require `Care ideas` and reject the vague `Try` tab label.

## Evidence
- Used Product Design critical overrides, session budget guidance, current source, focused tests, and Garden.io brand memory.
- Source scan found the vague `Try` tab in `drawerTabLabel()`, while nearby tests already protected the My Garden drawer labels.
- Focused tests passed from the website package: `empty-state-content.test.ts`, `sample-garden.test.ts`, and `app-flow-visual-css.test.ts` - 3 files, 31 tests.

## Verification
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limit
- Browser screenshot capture was not available in this run, so this pass used source/test verification before broader checks.
