# Iteration 253 - Copy Promise Alignment

Date: 2026-06-23

Scope: align the homepage/browser metadata with the simplified homepage promise.

## Finding

- The visible homepage and app entry already used `Your garden, smarter.`
- The live page title still served `Garden.io | Know What Your Garden Needs`.
- That split made the product promise feel less simple in tabs, search snippets, and share cards.

## Changed

- Updated root metadata title to `Garden.io | Your Garden, Smarter`.
- Updated metadata, Open Graph, and Twitter descriptions to a user-facing journal promise:
  `A simple garden journal that saves notes, photos, and answers with the right plant, bed, or season.`
- Added a homepage regression test so metadata stays aligned with the visible promise.

## Evidence

- Focused tests passed: `homepage-content.test.ts`, `auth-gate-content.test.ts`, `ai-first-garden-home.test.tsx`, and `sample-garden.test.ts`, 4 files, 21 tests.
- Full `npm test` passed: 22 files, 120 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Live preview at `http://127.0.0.1:3021` now serves:
  - title: `Garden.io | Your Garden, Smarter`
  - visible headline: `Your garden, smarter.`
  - no `Know What Your Garden Needs`
  - no visible `Know what to do next`

## Evidence Limits

- This pass addressed copy alignment only.
- It did not change layout, imagery, or deeper Ask-answer interactions.
