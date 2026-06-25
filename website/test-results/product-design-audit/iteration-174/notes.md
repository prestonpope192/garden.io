# Iteration 174: Empty Property setup copy

Scope: simplify the first authenticated setup screen for users who do not have a garden record yet.

Changed:
- Replaced `First garden` with `First step`.
- Replaced `Start with the garden you have` with `Name your garden`.
- Replaced `Just give it a name. Add location, beds, and plants as you go.` with `Name the place you grow. Beds, plants, and notes can come next.`
- Replaced the placeholder `Backyard Garden` with `Backyard garden`.
- Replaced the submit button `Save garden` with `Create garden`.
- Updated empty-state regression coverage to require the simpler first-step copy and reject the older setup wording.

Why:
- The first authenticated screen should ask for one obvious action, not explain the whole setup path.
- `Name your garden` is shorter and clearer than another `Start with...` headline after the auth gate.
- `Create garden` better matches the first-time action than `Save garden`.

Verification:
- Focused tests passed from `website/`: `empty-state-content.test.ts` and `sample-garden.test.ts`, 2 files, 17 tests.
- Full `npm test` passed from `website/`: 18 files, 90 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered visible-text scan passed across `/`, `/app/my-property`, `/sample-garden/property`, and `/sample-garden/calendar`.
- Source scan confirms `property-view.tsx` includes `Name your garden`, `Name the place you grow. Beds, plants, and notes can come next.`, and `Create garden`.
- Source scan confirms `property-view.tsx` no longer includes `Start with the garden you have`, `Just give it a name. Add location, beds, and plants as you go.`, or `Save garden`.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture controls were not available in this environment, and Playwright fallback requires explicit user approval.
- The empty Property setup screen is behind auth in the local preview, so this pass verifies it through component tests and source checks rather than a live authenticated route.
