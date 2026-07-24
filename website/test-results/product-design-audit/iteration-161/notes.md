# Iteration 161 Product Design Audit Notes

Scope: simplify public plant-guide accessible labels so screen-reader users hear the same language visible users see.

Changed:
- Replaced the public guide meta landmark `aria-label="Catalogue summary"` with `aria-label="Plant guide summary"`.
- Replaced the filter panel label `aria-label="Catalogue filters"` with `aria-label="Plant filters"`.
- Added public catalogue copy tests requiring the new labels and rejecting the formal `Catalogue` labels.

Why:
- The visible UI already says `Plant guide`, which is simpler and more user-facing than `Catalogue`.
- Assistive-technology labels should not fall back to older formal/internal wording.
- A gardener browsing plants needs plain labels that match the surface they are using.

Verification:
- Focused tests passed: `public-catalogue-content.test.ts`, `catalogue-format.test.ts`, and `homepage-content.test.ts`, 3 files, 18 tests.
- Full `npm test` passed: 18 files, 89 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Source scan confirms the public guide now uses `Plant guide summary` and `Plant filters`.
- Rendered visible-text scan passed across `/`, `/sample-garden`, `/sample-garden/calendar`, `/sample-garden/plants`, `/sample-garden/catalogue`, `/catalog`, `/catalog/french-marigold`, `/app`, and `/app/my-property`.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture remain unavailable in this environment, and Playwright fallback requires explicit user approval. This pass is covered by source checks, component tests, production build, and rendered-route visible-text scans.
