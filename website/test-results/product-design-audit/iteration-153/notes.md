# Iteration 153 Notes

Scope: simplify the Plant Guide cards and search prompt so the guide starts with practical garden information rather than botanical database language.

Changed:
- Replaced the card overline from plant family names, such as `Lamiaceae` and `Asteraceae`, to lifecycle labels, such as `Annual` and `Perennial`.
- Kept plant type visible beside the plant name, so cards still read as `French Marigold Flower` or `Autumn Sage Shrub`.
- Replaced the editable Plant Guide search placeholder `Search by name, botanical name, or family…` with `Search plants…`.
- Updated catalogue tests to require the simpler lifecycle/search copy and reject the family-name lead label.

Why:
- The Plant Guide should help a gardener decide quickly whether a plant fits their bed.
- `Annual`, `Perennial`, `Flower`, and `Shrub` are faster to understand than botanical family names on the first scan.

Verification:
- Focused tests passed: `catalogue-format.test.ts`, `sample-garden.test.ts`, and `public-catalogue-content.test.ts`, 3 files, 25 tests.
- Full `npm test` passed: 18 files, 89 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered-route Plant Guide scan passed for `/sample-garden/catalogue`.
- Rendered scan confirms `/sample-garden/catalogue` includes `Annual`, `Perennial`, `Autumn Sage`, `Curry Leaf`, `French Marigold`, and `Best spot`.
- Rendered scan confirms `/sample-garden/catalogue` no longer shows `Lamiaceae`, `Rutaceae`, `Asteraceae`, or `Search by name, botanical name, or family`.
- Visible-text scan across `/`, `/sample-garden`, `/sample-garden/calendar`, `/sample-garden/plants`, `/sample-garden/catalogue`, `/catalog`, `/catalog/french-marigold`, and `/app` found no beta, early-access, prototype, working-product, internal, developer, waitlist, taxonomy, confidence, or signal language.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture remain unavailable in this environment, and Playwright fallback requires explicit user approval. This pass is covered by source checks, component tests, production build, and rendered-route visible-text scans.
