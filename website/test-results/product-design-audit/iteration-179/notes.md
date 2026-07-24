# Iteration 179: Area and bed action wording

Scope: make the Garden Map action forms read like simple record setup steps.

Changed:
- Replaced the area form heading `Add an area` with `Name this area`.
- Replaced the area form button `Add area` with `Save this area`.
- Simplified the area examples from `Vegetables, orchard, shade border...` to `Vegetables, herbs, flowers...`.
- Replaced the bed form heading `Add a bed to {area}` with `Name this bed`.
- Replaced the bed form button `Add bed` with `Save this bed`.
- Lowercased the bed placeholder from `Raised Bed 2` to `Raised bed 2`.
- Added regression coverage so the action drawer keeps the simpler area, bed, and plant setup copy.

Why:
- The first-use path should feel like naming real places in a garden, not adding internal objects.
- `Name this...` and `Save this...` are calmer and match the preceding `Name your garden` and following `Save this plant` steps.
- The area/bed/plant sequence now uses one consistent pattern: name the place, save it, then record what grows there.

Verification:
- Focused tests passed from `website/`: `empty-state-content.test.ts`, `garden-mutation-copy.test.ts`, and `sample-garden.test.ts`, 3 files, 18 tests.
- Full `npm test` passed from `website/`: 18 files, 90 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered visible-text scan passed across `/`, `/sample-garden/property`, `/sample-garden/calendar`, `/app/my-property`, and `/app/my-plants`.
- Source scan confirms `property-view.tsx` includes `Name this area`, `Save this area`, `Name this bed`, `Save this bed`, `What's growing in {activeBed.name}?`, and `Save this plant`.
- Source scan confirms the older action-form phrases `Add an area`, `Add a bed to {activeZone.name}`, `Raised Bed 2`, and `Vegetables, orchard, shade border` are gone.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture controls were not available in this environment, and Playwright fallback requires explicit user approval.
- The exact action-form states are behind auth and Garden Map tab interactions in the local preview, so this pass verifies those states through source checks and component tests rather than a live authenticated route.
