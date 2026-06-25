# Iteration 504 - Saved Plant Check Journal Wording

Date: 2026-06-24
Surface: Plant check saved note and care-task provenance
Health: Green

## Goal

Make saved plant-check output read like part of the garden journal instead of a feature log.

## Change

- Changed saved diagnosis note prefix from `Plant check — ...` to `Plant note — ...`.
- Changed care-task provenance from `From this plant check: ...` to `From this plant note: ...`.
- Kept visible action copy like `Check this plant`, because that still describes the user's immediate action clearly.

## Files

- `website/components/diagnose-panel.tsx`
- `website/tests/diagnose-panel-content.test.ts`

## Evidence

- Product Design critical overrides, session-budget guidance, and Garden.io memory were read during this pass.
- Source scan confirms `Plant note` and `From this plant note:` and rejects `Plant check —` / `From this plant check:`.
- Focused tests passed: `diagnose-panel-content.test.ts`, `diagnose-route-copy.test.ts`, and `sample-garden.test.ts` - 3 files, 17 tests.
- Full `npm test` passed: 23 files, 131 tests.
- `npm run build` passed.
- Route probe of `/sample-garden/property` confirmed the static My Garden view still renders (`Where things grow`). The changed saved-note text is result-state content and does not render in the static route probe.

## Limit

- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.
- The changed saved-note wording is covered by source/component tests, not by an end-to-end browser interaction that creates and saves a plant check result.
