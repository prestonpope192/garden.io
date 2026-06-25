# Iteration 154 Notes

Scope: simplify public catalogue browse and plant detail pages so prospective users see practical plant identity first, not family-name taxonomy.

Changed:
- Removed visible family-name display from the featured public catalogue plant card.
- Removed visible family-name display from public catalogue result rows.
- Removed visible family-name display from the public plant detail hero and quick-facts card.
- Kept botanical names visible as secondary identifiers.
- Kept lifecycle and plant type visible through the clearer `Annual · Flower` style labels.
- Updated public catalogue tests to reject `Asteraceae`, `Lamiaceae`, `Plant family`, and the old family-name fallback in public-facing copy.

Why:
- The public catalogue is a prospective user's first browse experience.
- A gardener deciding what to plant needs common name, lifecycle, type, sun, water, and fit before botanical family.

Verification:
- Focused tests passed: `public-catalogue-content.test.ts`, `catalogue-format.test.ts`, and `homepage-content.test.ts`, 3 files, 18 tests.
- Full `npm test` passed: 18 files, 89 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered-route public catalogue scans passed for `/catalog` and `/catalog/french-marigold`.
- Rendered scans confirm both public catalogue routes include `Tagetes patula`, `Annual`, and `Flower`.
- Rendered scans confirm both public catalogue routes no longer show `Asteraceae`, `Plant family`, `Lamiaceae`, or `Rutaceae`.
- Visible-text scan across `/`, `/sample-garden`, `/sample-garden/calendar`, `/sample-garden/plants`, `/sample-garden/catalogue`, `/catalog`, `/catalog/french-marigold`, and `/app` found no beta, early-access, prototype, working-product, internal, developer, waitlist, taxonomy, confidence, or signal language.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture remain unavailable in this environment, and Playwright fallback requires explicit user approval. This pass is covered by source checks, component tests, production build, and rendered-route visible-text scans.
