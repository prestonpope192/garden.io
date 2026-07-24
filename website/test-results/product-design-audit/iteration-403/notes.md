# Iteration 403 Notes

Scope: make app section headers read like useful garden labels instead of repeated product labels.

Changed:
- Replaced the repeated section kicker `Your garden` in signed-in and sample app headers.
- Added view-specific kickers:
  - `Beds and areas` for `My Garden`
  - `Weekly care` for `This Week`
  - `Your plants` for `Plant Journal`
  - `Plant choices` for `Field Guide`
- Updated the sample-garden content test to reject the old repeated header patterns and the too-database-like `Plant records` label.

Evidence:
- Product Design audit guidance, Product Design critical overrides, Product Design saved-context preflight, session-budget guidance, Garden.io memory, current source, and live local route output were used.
- Product Design saved-context preflight found a context file but no saved entries, so this pass used current repo and local route evidence.
- Focused test passed from the website package: `sample-garden.test.ts` - 1 file, 13 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Live route probes for `/sample-garden/property`, `/sample-garden/calendar`, `/sample-garden/plants`, and `/sample-garden/catalogue` found the new section labels and did not find `Your garden My Garden`, `Garden journal Plant Journal`, `Plant records Plant Journal`, or `Choose plants Field Guide`.

Limit:
- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, Codex app capture has been blocked by safety policy in this session, and Playwright fallback requires explicit permission under the Product Design rules.
