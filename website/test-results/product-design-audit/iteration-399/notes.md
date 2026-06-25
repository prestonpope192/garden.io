# Iteration 399 Notes

Scope: align shared app-shell navigation with the simplified garden-notebook language.

Changed:
- Changed the shared shell nav label for `/app/my-plants` from `Plants` to `Plant Journal`.
- Changed the user-menu link for `/app/my-plants` from `Plants` to `Plant Journal`.
- Added a rendered `JournalShell` content test to require `Plant Journal` and reject `Plants` / `My Plants` nav labels.

Evidence:
- Product Design audit/index/user-context guidance, Product Design critical overrides, session-budget guidance, Garden.io memory, and current repo state were used.
- Product Design saved-context preflight found no saved entries, so this pass used current source, tests, and route-output inspection.
- Focused test passed from the website package: `homepage-content.test.ts` - 1 file, 5 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Source scan found `Plant Journal` in `journal-primitives.tsx`, `garden-app.tsx`, and `garden-app-preview.tsx`, and no remaining shared-shell `Plants` / `My Plants` nav labels.

Limit:
- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, Codex app capture has been blocked by safety policy in this session, and Playwright fallback requires explicit permission under the Product Design rules.
- A one-off `ts-node` rendered-shell probe was attempted but `ts-node/register/transpile-only` is not installed in this package; the rendered behavior is covered by Vitest instead.
