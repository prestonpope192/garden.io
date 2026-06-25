# Iteration 321 - Metadata And Shell Journal Copy

Date: 2026-06-23
Surface: homepage metadata and app shell tagline
Health: Green

Goal: Keep the public browser/share promise and the app shell tagline aligned with the simple garden journal framing.

Changes:
- Changed global metadata description from `Keep a simple garden journal with notes, photos, plant history, and smarter care guidance.` to `Keep a simple garden journal with plants, notes, photos, and care in one place.`
- Applied the same description to Open Graph and Twitter metadata.
- Changed the shared app shell tagline from `Keep your plants, notes, photos, and care history in one garden journal.` to `Keep your plants, notes, photos, and care in one garden journal.`
- Updated homepage content tests to require the new metadata and shell tagline and reject `plant history`, `smarter care guidance`, and `care history` in those sources.

Files:
- `website/app/layout.tsx`
- `website/components/journal-primitives.tsx`
- `website/tests/homepage-content.test.ts`

Evidence:
- Product Design audit, Product Design index, user-context preflight, critical overrides, session-budget guidance, and Garden.io memory were read during this pass.
- Product Design saved context preflight found no saved entries, so this pass used the current repo and Garden.io memory as grounding.
- Focused test passed: `homepage-content.test.ts` - 1 file, 4 tests.
- Full `npm test` passed: 23 files, 130 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Raw homepage route probe found the new metadata description and did not return old metadata phrases.
- Source probe found the new shell tagline and only old phrases inside negative test assertions.

Limit:
- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.
