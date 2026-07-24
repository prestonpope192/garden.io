# Product Design Audit Iteration 371

Date: 2026-06-24
Surface: Garden.io sample app, especially `/sample-garden/property`

## Objective

Use orchestratror-mode for a bounded cleanup pass that keeps judgment in the main thread, uses parallel source/test reads for evidence, and removes one visible source of product/database language from the garden-journal experience.

## Finding

The My Garden sample route still exposed the stored property label `Home garden` in the shared app title stamp, plot metadata, and drawer scope. That label was technically accurate, but in the rendered flow it read like an internal category because the user already sees the garden name, location, growing zone, season, areas, beds, and plants.

The property drawer also still used `Care note:` for the next action. Other app surfaces had already moved to `Next up:`, so this was an inconsistent leftover.

## Changes

- Changed the real app shell and sample app shell title stamp to `Your garden`.
- Removed `activeProperty.label` from the property plot metadata.
- Changed the property drawer scope label to use the garden name alone at property level.
- Changed the property drawer next-action prefix from `Care note:` to `Next up:`.
- Updated focused assertions in `sample-garden.test.ts` and `empty-state-content.test.ts`.

## Evidence

- Focused tests passed: `npm test -- sample-garden.test.ts empty-state-content.test.ts`
- Full tests passed: `npm test` with 23 files and 130 tests.
- Production build passed: `npm run build`.
- Whitespace check passed: `git diff --check`.
- Live route probe against `http://127.0.0.1:3021/sample-garden/property` returned `200`.
- Live route probe confirmed `hasHomeGarden: false`.
- Live route probe confirmed the route contains `Your garden My Garden` and `Backyard Garden Central Texas · Growing zone 8b · Summer`.

## Remaining Risk

- This pass did not capture screenshots because Browser/Chrome screenshot tools were unavailable in this session and Product Design rules require explicit permission before using Playwright fallback.
- The live property route default state does not expose the plant-level drawer, so the `Next up:` drawer prompt is protected by focused render tests rather than a live interaction probe.
