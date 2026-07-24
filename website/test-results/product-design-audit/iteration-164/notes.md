# Iteration 164 Product Design Audit Notes

Scope: simplify area setup and area details from abstract metadata language to gardener-facing language.

Changed:
- Replaced the area edit field label `Purpose` with `Use`.
- Replaced the add-area field label `Purpose` with `Use`.
- Replaced the area details row label `Purpose` with `Use`.
- Added regression coverage so the area form and details row keep the simpler label.

Why:
- A gardener is trying to describe what an area is for, not configure a product field.
- `Use` is shorter, easier to scan, and matches examples like vegetables, orchard, and shade border.
- The app should feel like recording a real garden, not managing an internal data model.

Verification:
- Focused tests passed from `website/`: `empty-state-content.test.ts` and `sample-garden.test.ts`, 2 files, 17 tests.
- Full `npm test` passed from `website/`: 18 files, 90 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Source scan confirms `Purpose` is absent from the touched property-view component and the new `Use` label is covered by tests.
- Rendered visible-text scan passed across `/`, `/sample-garden`, `/sample-garden/calendar`, `/sample-garden/plants`, `/sample-garden/catalogue`, `/catalog`, `/catalog/french-marigold`, `/app`, and `/app/my-property`.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture remain unavailable in this environment, and Playwright fallback requires explicit user approval. This pass is covered by source checks, component tests, production build, and rendered-route visible-text scans.
