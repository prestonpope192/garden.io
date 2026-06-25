# Iteration 175: First-area setup guidance

Scope: make the guidance after creating a garden point to the next setup step in simpler language.

Changed:
- Replaced `Garden saved. Add one area next.` with `Garden created. Add your first area next.`
- Replaced the empty map message `No areas yet. Add one area to start your map.` with `No areas yet. Add your first area.`
- Applied the same wording to the signed-in app and the example garden preview.
- Updated regression coverage to reject the older `Add one area` wording.

Why:
- After the user creates a garden, the next step should feel like a natural setup path, not a generic saved-state message.
- `Add your first area` is more personal and clearer than `Add one area`.
- The empty map should make the next action obvious without explaining the whole map concept again.

Verification:
- Focused tests passed from `website/`: `garden-mutation-copy.test.ts`, `empty-state-content.test.ts`, and `sample-garden.test.ts`, 3 files, 18 tests.
- Full `npm test` passed from `website/`: 18 files, 90 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered visible-text scan passed across `/`, `/app/my-property`, `/sample-garden/property`, and `/sample-garden/calendar`.
- Source scan confirms both `garden-app.tsx` and `garden-app-preview.tsx` include `Garden created. Add your first area next.` and `No areas yet. Add your first area.`
- Source scan confirms both files no longer include `Garden saved. Add one area next.` or `No areas yet. Add one area to start your map.`

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture controls were not available in this environment, and Playwright fallback requires explicit user approval.
- The first-area setup state is behind auth in the local preview, so this pass verifies it through component tests and source checks rather than a live authenticated route.
