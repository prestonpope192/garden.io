# Iteration 176: First-bed setup guidance

Scope: make the guidance after creating an area point to the first bed in simpler language.

Changed:
- Replaced `Area saved. Add one bed next.` with `Area created. Add your first bed next.`
- Replaced the empty-area message `No beds in this area yet.` with `No beds here yet.`
- Kept the existing `Add your first bed` action as the primary empty-area action.
- Applied the same area-created feedback to the signed-in app and the example garden preview.
- Updated regression coverage to reject the older `Add one bed` and `No beds in this area yet` wording.

Why:
- After a user creates an area, the next step should feel like a guided setup sequence, not a generic saved-state message.
- `Add your first bed` matches the previous `Add your first area` copy and keeps the setup path consistent.
- `No beds here yet` is shorter and avoids repeating the area concept in the empty state.

Verification:
- Focused tests passed from `website/`: `garden-mutation-copy.test.ts`, `empty-state-content.test.ts`, and `sample-garden.test.ts`, 3 files, 18 tests.
- Full `npm test` passed from `website/`: 18 files, 90 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered visible-text scan passed across `/`, `/app/my-property`, `/sample-garden/property`, and `/sample-garden/calendar`.
- Source scan confirms both `garden-app.tsx` and `garden-app-preview.tsx` include `Area created. Add your first bed next.`
- Source scan confirms `property-view.tsx` includes `No beds here yet.` and `Add your first bed`.
- Source scan confirms the older `Area saved. Add one bed next.` and `No beds in this area yet.` phrases are gone.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture controls were not available in this environment, and Playwright fallback requires explicit user approval.
- The first-bed setup state is behind auth in the local preview, so this pass verifies it through component tests and source checks rather than a live authenticated route.
