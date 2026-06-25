# Iteration 137 - No-Photo Plant Surfaces

Scope: remove visible no-photo placeholder copy from plant browsing and plant-record surfaces.

Changed:
- Public catalogue photos now render only when a real image URL is available.
- Public catalogue feature cards omit the media block when no real photo exists.
- Signed-in plant guide cards without real photos now become text-first care cards instead of showing `Photo coming soon`.
- Public plant detail pages omit the photo media block when no real photo exists.
- In-app plant thumbnails no longer expose `Photo coming soon` as visible copy.
- Added regression coverage that rejects `Photo coming soon`, `photo coming soon`, and stale SVG-style image paths in plant surfaces.

Why:
- The user specifically wanted real photos from the database, not fake SVG-style or placeholder photo states.
- A missing image should not compete with the plant guidance a gardener came for.
- Text-first no-photo cards keep the catalogue useful while showcasing real photos whenever the database has them.

Verification:
- Focused tests passed: `public-catalogue-content.test.ts`, `catalogue-format.test.ts`, and `sample-garden.test.ts`, 3 files, 25 tests.
- Full `npm test` passed: 18 files, 89 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered-route visible-copy scan passed for 14 routes at `http://localhost:3020`.
- Source scan confirms no-photo placeholder phrases remain only as negative test assertions.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture remain unavailable in this environment, and Playwright fallback requires explicit user approval. This pass is covered by source checks, component tests, production build, and rendered-route visible-text scans.
