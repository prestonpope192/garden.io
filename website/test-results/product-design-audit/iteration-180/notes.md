# Iteration 180: Quick note target wording

Scope: make the quick-note target selector feel like saving a note with the right garden place.

Changed:
- Replaced `Where should this go?` with `Save it with`.
- Replaced target options like `Area · Kitchen Garden` with `Kitchen Garden area`.
- Replaced target options like `Bed · Kitchen Garden › Herb Bed` with `Herb Bed bed (Kitchen Garden)`.
- Replaced target options like `Plant · French Marigold (Bloom Border)` with `French Marigold (Bloom Border)`.
- Added regression coverage so QuickLog keeps the simpler selector label and rejects the older prefixed option labels.

Why:
- The quick-note flow should be fast and conversational because users are likely recording something while they are in the garden.
- `Save it with` better matches the user's intent than asking where the note should "go."
- Removing `Area ·`, `Bed ·`, `Plant ·`, and the arrow keeps the selector closer to real garden language.

Verification:
- Focused tests passed from `website/`: `quick-log-content.test.ts`, `empty-state-content.test.ts`, and `sample-garden.test.ts`, 3 files, 19 tests.
- Full `npm test` passed from `website/`: 18 files, 90 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered visible-text scan passed across `/`, `/sample-garden/property`, `/sample-garden/calendar`, `/app/my-property`, and `/app/my-plants`.
- Source scan confirms `quick-log.tsx` includes `Save it with`, `{zone.name} area`, `{bed.name} bed (...)`, and plant names without the `Plant ·` prefix.
- Source scan confirms the older `Where should this go?`, `Area ·`, `Bed ·`, `Plant ·`, and `›` quick-note selector phrases are gone.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture controls were not available in this environment, and Playwright fallback requires explicit user approval.
- The open quick-note dialog is behind auth and client interaction in the local preview, so this pass verifies that exact state through source checks and component tests rather than a live authenticated route.
