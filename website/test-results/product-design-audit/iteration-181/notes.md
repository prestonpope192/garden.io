# Iteration 181: Quick note place labels

Scope: remove awkward repeated place labels from the quick-note target selector.

Changed:
- Replaced bed target labels from `{bed name} bed ({area name})` to `{bed name} in {area name}`.
- Replaced plant target labels from `{plant name} ({bed name})` to `{plant name} in {bed name}`.
- Added regression coverage to reject the awkward `{bed.name} bed` pattern and the older prefixed selector labels.

Why:
- The previous quick-note simplification removed internal prefixes but could produce awkward labels such as `Herb Bed bed`.
- `Herb Bed in Kitchen Garden` and `French Marigold in Bloom Border` read like real places in the garden.
- The quick-note flow should stay fast and natural because it is used while recording observations.

Verification:
- Focused tests passed from `website/`: `quick-log-content.test.ts`, `empty-state-content.test.ts`, and `sample-garden.test.ts`, 3 files, 19 tests.
- Full `npm test` passed from `website/`: 18 files, 90 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered visible-text scan passed across `/`, `/sample-garden/property`, `/sample-garden/calendar`, `/app/my-property`, and `/app/my-plants`.
- Source scan confirms `quick-log.tsx` includes `{bed.name} in {getZoneName(...)}` and `{plant name} in {bed name}`.
- Source scan confirms the older `Where should this go?`, `Area ·`, `Bed ·`, `Plant ·`, `›`, and `{bed.name} bed` quick-note selector phrases are gone.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture controls were not available in this environment, and Playwright fallback requires explicit user approval.
- The open quick-note dialog is behind auth and client interaction in the local preview, so this pass verifies that exact state through source checks and component tests rather than a live authenticated route.
