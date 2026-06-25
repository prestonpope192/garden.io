# Iteration 178: Add-plant drawer wording

Scope: make the bed-level add-plant form feel like recording what is growing, not operating a generic add form.

Changed:
- Replaced `Add a plant to {bed}` with `What's growing in {bed}?`
- Replaced the bare field label `Plant` with `Plant name`.
- Replaced the submit button `Add plant` with `Save this plant`.
- Added regression coverage so the bed add form keeps the user-facing wording and rejects the older generic labels.

Why:
- The previous setup path now tells users to add their first plant, so the form itself should match that moment.
- `What's growing in this bed?` starts from the user's real garden rather than an internal object type.
- `Save this plant` describes the outcome better than `Add plant` and aligns with the app's record-keeping value.

Verification:
- Focused tests passed from `website/`: `empty-state-content.test.ts`, `garden-mutation-copy.test.ts`, and `sample-garden.test.ts`, 3 files, 18 tests.
- Full `npm test` passed from `website/`: 18 files, 90 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered visible-text scan passed across `/`, `/sample-garden/property`, `/sample-garden/calendar`, `/app/my-property`, and `/app/my-plants`.
- Source scan confirms `property-view.tsx` includes `What's growing in {activeBed.name}?`, `Plant name`, and `Save this plant`.
- Source scan confirms the older `Add a plant to {activeBed.name}`, bare `Plant` field label, and `Add plant` button are gone from the add-plant form.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture controls were not available in this environment, and Playwright fallback requires explicit user approval.
- The bed add-plant form is behind auth and the Garden Map Add tab in the local preview, so this pass verifies that exact state through source checks and component tests rather than a live authenticated route.
