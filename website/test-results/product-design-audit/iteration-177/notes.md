# Iteration 177: First-plant setup guidance

Scope: make the guidance after creating a bed point to the first plant in simpler language.

Changed:
- Replaced `Bed saved. Add one plant next.` with `Bed created. Add your first plant next.`
- Applied the same bed-created feedback to the signed-in app and the example garden preview.
- Replaced the empty Plants copy `Add one plant to a bed...` with `Add your first plant to a bed...`.
- Replaced the empty Calendar copy `Add one plant first.` and `Add a plant` action with `Add your first plant.` and `Add your first plant`.
- Updated regression coverage to reject the older `Bed saved`, `Add one plant`, and `Add first plant` wording.

Why:
- After a user creates a bed, the next step should feel like the final step in a simple guided setup sequence.
- `Add your first plant` matches the existing `Add your first area` and `Add your first bed` copy.
- Empty Plants and Calendar states should describe the value a user gets after adding a plant: notes, photos, care, harvests, and checks have a place to go.

Verification:
- Focused tests passed from `website/`: `garden-mutation-copy.test.ts`, `empty-state-content.test.ts`, and `sample-garden.test.ts`, 3 files, 18 tests.
- Full `npm test` passed from `website/`: 18 files, 90 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered visible-text scan passed across `/`, `/sample-garden/property`, `/sample-garden/calendar`, `/app/my-plants`, and `/app/calendar`.
- Source scan confirms `garden-app.tsx` and `garden-app-preview.tsx` include `Bed created. Add your first plant next.`
- Source scan confirms `plants-view.tsx` includes `Add your first plant to a bed` and `Add your first plant`.
- Source scan confirms `calendar-view.tsx` includes `Add your first plant. Then watering...`.
- Source scan confirms the older `Bed saved. Add one plant next.`, `Add one plant first.`, `Add one plant to a bed`, and `Add first plant` phrases are gone from the changed source files.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture controls were not available in this environment, and Playwright fallback requires explicit user approval.
- The first-plant setup state is behind auth in the local preview, so this pass verifies it through component tests and source checks rather than a live authenticated route.
