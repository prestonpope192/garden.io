# Iteration 169: Simplify the app shell entry state

Scope: reduce repeated garden-name and garden-label copy in the sample app and signed-in app shell.

Changed:
- Removed the default left-rail garden heading when there is only one garden.
- Changed the multi-garden rail control label to `Choose garden`.
- Hid the root-level breadcrumb until a user drills into an area, bed, or plant.
- Applied the same shell simplification to both the sample preview and the signed-in app.
- Added regression coverage so the sample Garden Map no longer starts with repeated `Home garden` / `Backyard Garden` sequences.

Why:
- The app should move a gardener quickly into areas, beds, plants, notes, and next care.
- Repeating the same garden label and garden name before the map made the interface feel more like a dashboard shell than a garden record.
- The breadcrumb is useful after drill-in, but the root state already has enough context in the page title.

Verification:
- Focused tests passed from `website/`: `sample-garden.test.ts` and `empty-state-content.test.ts`, 2 files, 17 tests.
- Full `npm test` passed from `website/`: 18 files, 90 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered visible-text scan passed across `/`, `/sample-garden`, `/sample-garden/calendar`, `/sample-garden/plants`, `/sample-garden/catalogue`, `/catalog`, `/catalog/french-marigold`, `/app`, and `/app/my-property`.
- Rendered scan confirms `/sample-garden`, `/sample-garden/calendar`, `/sample-garden/plants`, and `/sample-garden/catalogue` no longer include the repeated `Home garden Backyard Garden Kitchen Garden` sequence.
- Rendered scan confirms `/sample-garden` now moves from top navigation directly into `Kitchen Garden` and `Pollinator Edge` before the main `Garden Map` content.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture controls were not available in this environment, and Playwright fallback requires explicit user approval. This pass is covered by source checks, component tests, production build, and rendered-route visible-text scans.
