## Iteration 184

Task type: build work.

Current-state finding:
- The rendered public plant guide was mostly user-facing, but the browse page repeated nearby count language as `988 plants to browse` and `Plants to choose from 988 plants`.
- A prospective gardener scanning quickly should see the count once and then move into the list, not parse redundant section labels.

Changes implemented:
- Simplified the plant-guide hero count from `plants to browse` to `plants`.
- Replaced the results section label from `Plants to choose from` to `Browse plants`.
- Updated catalogue regression tests to require `Browse plants` and reject the old redundant strings.

Evidence:
- Focused tests passed: `npm test -- public-catalogue-content.test.ts`, 1 file, 5 tests.
- Focused catalogue tests passed: `npm test -- catalogue-format.test.ts public-catalogue-content.test.ts`, 2 files, 15 tests.
- Full `npm test` passed: 18 files, 90 tests.
- `npm run build` passed with Next.js production build.
- `git diff --check` passed.
- Rendered route scan passed for `/catalog`, `/`, `/sample-garden/catalogue`, and `/catalog/french-marigold`.
- The rendered route scan found no hits for `Plants to choose from`, `plants to browse`, old internal sample/demo copy, beta/prototype/waitlist copy, visible photo placeholders, or old SVG plant-art paths.

Evidence limits:
- Browser screenshot capture remains unavailable in this thread without explicit Playwright approval; current proof is source, server-rendered HTML, tests, build, and local route availability.
- Authenticated signed-in visual QA, keyboard flow, screen-reader behavior, successful magic-link delivery, and photo upload still need a reliable browser-backed pass.
