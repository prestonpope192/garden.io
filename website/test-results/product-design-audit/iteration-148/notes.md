# Product Design Audit Iteration 148

Date: 2026-06-22
Surface: sample garden Plants view
Preview: http://localhost:3020/sample-garden/plants

## Finding

The Plants screen repeated a long phrase about seeing where a plant lives, what happened, and what needs care next. The phrase was accurate, but repeated too much across the app and made the drawer feel wordier than it needed to be.

## Change

- Changed the Plants subtitle to `Choose a plant to see its notes, photos, and next care.`
- Changed the empty drawer prompt to `Pick one to see notes, photos, and next care.`
- Changed one write-mode prompt from `save an update` to `save a note`.
- Added tests that reject the older Plants wording.

## Verification

- `npm test -- sample-garden.test.ts empty-state-content.test.ts quick-log-content.test.ts plant-timeline-content.test.ts` passed.
- `npm test` passed: 18 files, 89 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered scan of `/sample-garden/plants` passed with required copy present and stale Plants copy absent.
- Visible-text scan across the main public and sample routes found no beta-era or internal product language.

## Evidence Limit

No fresh screenshots were captured because Browser/Chrome capture tools are not available in this thread and Playwright requires explicit approval. This iteration is validated through source checks, component tests, production build, and rendered-route visible-text scans.
