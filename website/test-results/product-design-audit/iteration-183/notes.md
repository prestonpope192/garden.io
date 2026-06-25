## Iteration 183

Task type: build work.

Current-state finding:
- The homepage was clean overall, but the third value card still used the abstract title `Check plants with context`.
- A prospective gardener does not need that abstraction first; the felt need is, "Something looks wrong. What should I try next?"

Changes implemented:
- Replaced the homepage value title with `Get help when something looks off`.
- Replaced the supporting sentence with `Describe what you see or add a photo. Its notes, bed, and season help shape what to try next.`
- Updated homepage regression coverage to require the new user-facing phrasing and reject the older abstract wording.

Evidence:
- Focused homepage test passed: `npm test -- homepage-content.test.ts`, 1 file, 3 tests.
- Full `npm test` passed: 18 files, 90 tests.
- `npm run build` passed with Next.js production build.
- `git diff --check` passed.
- Restarted the local preview server on `http://localhost:3020` after the first rendered scan exposed stale homepage HTML.
- Rendered route scan passed for `/`, `/sample-garden/property`, `/sample-garden/calendar`, `/sample-garden/plants`, `/sample-garden/catalogue`, `/catalog`, `/catalog/french-marigold`, `/app/my-property`, `/app/my-plants`, and `/app/plant-catalogue`.
- The rendered route scan found no hits for old internal sample/demo copy, beta/prototype/waitlist copy, visible photo placeholders, old SVG plant-art paths, the old generic best-spot line, or the old `Check plants with context` copy.

Evidence limits:
- Browser screenshot capture remains unavailable in this thread; current proof is source, server-rendered HTML, tests, build, and local route availability.
- Authenticated signed-in visual QA, keyboard flow, screen-reader behavior, successful magic-link delivery, and photo upload still need a reliable browser-backed pass.
