## Iteration 182

Task type: build work.

Current-state finding:
- The main homepage, sample garden, catalogue, plant detail, and signed-out app gate no longer exposed beta/prototype/product-facing marketing copy in the checked rendered routes.
- The next visible issue was in sample plant catalogue fallback data: plant records still carried internal `Garden tracking demo` use-case language and a generic `Good fit for a small, closely watched planting.` best-spot line.
- Even when the real database supplies photos, the fallback records should still read like useful garden examples rather than internal scaffolding.

Changes implemented:
- Replaced fallback plant use cases with gardener-facing values:
  - French Marigold: pollinator support and companion planting.
  - Autumn Sage: pollinator support and color/flowers.
  - Curry Leaf: fresh herb and container growing.
- Replaced the repeated generic best-spot sentence with plant-specific placement copy.
- Replaced fallback image attribution from `Demo plant image` to `Garden photo`.
- Added `container growing` -> `Containers` to the plant-use label formatter.
- Added sample Plant Guide regression coverage for the new visible best-spot copy and old internal-copy exclusions.

Evidence:
- Focused tests passed: `npm test -- sample-garden.test.ts catalogue-format.test.ts public-catalogue-content.test.ts`, 3 files, 25 tests.
- Full `npm test` passed: 18 files, 90 tests.
- `npm run build` passed with Next.js production build.
- `git diff --check` passed.
- Rendered route scan passed for `/`, `/sample-garden/property`, `/sample-garden/calendar`, `/sample-garden/plants`, `/sample-garden/catalogue`, `/catalog`, `/catalog/french-marigold`, `/app/my-property`, `/app/my-plants`, and `/app/plant-catalogue`.
- The rendered route scan found no hits for `Garden tracking demo`, `Tracking Demo`, `Demo plant image`, `Working product`, `whole product`, `early access`, `private beta`, `prototype`, `waitlist`, visible photo placeholders, old SVG plant-art paths, or the old generic best-spot line.

Evidence limits:
- Browser screenshot capture remains unavailable in this thread; current proof is source, server-rendered HTML, tests, build, and local route availability.
- Authenticated signed-in visual QA, keyboard flow, screen-reader behavior, successful magic-link delivery, and photo upload still need a reliable browser-backed pass.
