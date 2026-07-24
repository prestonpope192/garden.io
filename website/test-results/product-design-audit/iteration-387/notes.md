# Iteration 387 Notes

Date: 2026-06-24

Scope: align Field Guide and Plant Journal labels with gardener-facing care language.

What changed:
- Changed sample Field Guide cards from `Light` to `Sun`, matching the public catalogue and plant detail pages.
- Changed Plant Journal plant-card labels from `Next up:` to `Next care:`.
- Changed the garden detail drawer label from `Next up:` to `Next care:`.
- Updated focused sample, empty-state, and catalogue tests to require the new labels and reject the older wording.

Why:
- `Sun` is the simpler gardener-facing label and now appears consistently across the guide surfaces.
- `Next care` tells users why the plant is being surfaced, while `Next up` reads like generic task software.
- Both changes support the app's notebook promise: choose a plant, see where it belongs, then keep useful notes and care with it.

Evidence:
- Product Design audit, Product Design index, Product Design user-context preflight, Product Design critical overrides, session-budget guidance, and Garden.io memory were used during this pass.
- Product Design saved context preflight found no saved entries, so this pass used the current repo, current app source, live route/source evidence, and Garden.io memory as grounding.
- Focused tests passed from `website`: `npm test -- sample-garden.test.ts empty-state-content.test.ts catalogue-format.test.ts` - 3 files, 33 tests.
- Full tests passed from `website`: `npm test` - 23 files, 130 tests.
- Production build passed from `website`: `npm run build`.
- Whitespace check passed from repo root: `git diff --check`.
- Live `/sample-garden/catalogue` returned `200`, contains `Best spot`, `Sun`, and `Keep notes on`, and no longer contains `Light`, `Fits`, or `Watch for`.
- Live `/sample-garden/plants` returned `200`, contains `Next care:`, and no longer contains `Next up:`.

Limit:
- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, Codex app capture has been blocked by safety policy in this session, and Playwright fallback requires explicit permission under the Product Design rules.
