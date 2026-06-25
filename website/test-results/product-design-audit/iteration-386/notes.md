# Iteration 386 Notes

Date: 2026-06-24

Scope: make Field Guide labels and plant-detail guidance read like gardener-facing journal copy.

What changed:
- Changed sample Field Guide card labels from `Fits` to `Best spot`.
- Changed sample Field Guide card labels from `Watch for` to `Keep notes on`.
- Changed public plant detail copy from `Match it to your garden.` to `Match it to the garden you have.`
- Changed public plant detail copy from `Check light, water, soil, and room before you make space.` to `Check sun, water, soil, and room before you plant.`
- Changed the plant-detail CTA from `Give it the right place.` to `Give it a place to grow.`
- Updated focused catalogue/sample tests to require the new wording and reject the older wording.

Why:
- The Field Guide should feel like a practical garden notebook, not a database label sheet.
- `Sun` and `before you plant` match the newer public catalogue language and a gardener's natural scan pattern.
- `Keep notes on` better supports the Garden.io promise: useful observations stay with the plant over time.

Evidence:
- Product Design audit, Product Design index, Product Design user-context preflight, Product Design critical overrides, session-budget guidance, and Garden.io memory were used during this pass.
- Product Design saved context preflight found no saved entries, so this pass used the current repo, current app source, live route/source evidence, and Garden.io memory as grounding.
- Focused tests passed from `website`: `npm test -- sample-garden.test.ts catalogue-format.test.ts public-catalogue-content.test.ts` - 3 files, 35 tests.
- Full tests passed from `website`: `npm test` - 23 files, 130 tests.
- Production build passed from `website`: `npm run build`.
- Whitespace check passed from repo root: `git diff --check`.
- Live `/sample-garden/catalogue` returned `200`, contains `Best spot` and `Keep notes on`, and no longer contains `Fits` or `Watch for`.
- Live `/catalog/french-marigold` returned `200`, contains `Match it to the garden you have.`, `Check sun, water, soil, and room before you plant.`, and `Give it a place to grow.`

Limit:
- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, Codex app capture has been blocked by safety policy in this session, and Playwright fallback requires explicit permission under the Product Design rules.
