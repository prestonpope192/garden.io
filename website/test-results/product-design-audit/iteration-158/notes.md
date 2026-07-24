# Iteration 158 Product Design Audit Notes

Scope: simplify the selected-plant drawer so daily plant details use practical garden identity instead of botanical naming.

Changed:
- Replaced the selected plant detail row labeled `Botanical` with `Plant type`.
- Changed the selected drawer value from a Latin botanical name to a gardener-facing type/lifecycle summary such as `Flower · Annual`.
- Added a small local helper that derives the plant type summary from the selected plant profile.
- Updated selected drawer regression tests to require `Plant type` and reject the old botanical row and Latin name.

Why:
- The selected-plant drawer is a daily care/action surface, not a plant encyclopedia.
- A gardener deciding what to do next needs plant type, lifecycle, next care, quantity, planted date, and stage before they need the Latin name.

Verification:
- Focused tests passed: `sample-garden.test.ts`, `empty-state-content.test.ts`, and `plant-timeline-content.test.ts`, 3 files, 18 tests.
- Full `npm test` passed: 18 files, 89 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered visible-text scan passed across `/`, `/sample-garden`, `/sample-garden/calendar`, `/sample-garden/plants`, `/sample-garden/catalogue`, `/catalog`, `/catalog/french-marigold`, and `/app`.
- Component-rendered selected drawer test confirms `<dt>Plant type</dt><dd>Flower · Annual</dd>` and rejects `<dt>Botanical</dt>` plus `Tagetes patula`.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture remain unavailable in this environment, and Playwright fallback requires explicit user approval. This pass is covered by source checks, component tests, production build, and rendered-route visible-text scans.
