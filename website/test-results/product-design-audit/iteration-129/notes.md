# Iteration 129 Notes

Scope: simplify Garden Map by removing spatial arrange/edit-layout controls.

Changed:
- Removed the Garden Map `Arrange` / `Done` control.
- Removed drag-to-move and resize-corner behavior for areas and beds.
- Removed the bed-arranging subview and placed-canvas rendering path.
- Removed layout persistence props from `PropertyView`, `GardenApp`, sample preview, and tests.
- Removed unused arrange/placed-canvas CSS.
- Regression coverage rejects `persistZoneLayout`, `persistBedLayout`, `garden-plot__canvas`, placed area/bed classes, pointer-drag handlers, and visible `Arrange` language.

Why:
- A first-use garden should feel like a simple record of areas, beds, plants, notes, care, and suggestions.
- Spatial layout editing made the Garden Map feel like a design tool and added a second task that was not necessary to start using the product.
- The simpler grid still lets users choose an area, bed, or plant and see what happened there and what needs care next.

Verification:
- Focused Garden Map/sample tests passed: `sample-garden.test.ts` and `empty-state-content.test.ts`, 2 files, 17 tests.
- Full `npm test` passed: 18 files, 87 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered-route visible-copy scan passed for 14 routes at `http://localhost:3020`.
- Route scan rejects `Arrange`, `Arranging`, drag/resize copy, placed-canvas classes, and stale beta/product wording.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture remain unavailable in this environment, and Playwright fallback requires explicit user approval. This pass is covered by route text scans, source checks, component tests, and the production build.
