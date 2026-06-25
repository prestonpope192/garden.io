# Iteration 165 Product Design Audit Notes

Scope: simplify the sample Plants cards so the growing-plants view scans around useful garden facts instead of repeated status.

Changed:
- Removed the `Growing` badge from each default growing plant card.
- Kept status available in selected plant details, where it has useful context.
- Added regression coverage so sample plant cards do not render status badges immediately after plant names.

Why:
- The Plants page is already scoped to active growing plants, so repeating `Growing` on every card adds noise.
- The useful scan path is plant name, plant type, place, count or age, and next care.
- This makes the sample garden feel more like a practical garden record and less like a status dashboard.

Verification:
- Focused tests passed from `website/`: `sample-garden.test.ts` and `empty-state-content.test.ts`, 2 files, 17 tests.
- Full `npm test` passed from `website/`: 18 files, 90 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered visible-text scan passed across `/`, `/sample-garden`, `/sample-garden/calendar`, `/sample-garden/plants`, `/sample-garden/catalogue`, `/catalog`, `/catalog/french-marigold`, `/app`, and `/app/my-property`.
- Rendered scan confirms `/sample-garden/plants` no longer contains `French Marigold Growing Flower`, `Autumn Sage Growing Shrub`, or `Curry Leaf Growing Shrub`.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture controls were not available in this environment, and Playwright fallback requires explicit user approval. This pass is covered by source checks, component tests, production build, and rendered-route visible-text scans.
