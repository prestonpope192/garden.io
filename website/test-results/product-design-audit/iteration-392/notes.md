# Iteration 392 - Field Guide Label Cleanup

Date: 2026-06-24

## Objective

Make plant browsing feel clearer and more field-guide-like by replacing awkward `kind` and vague plant-link wording across public and signed-in catalogue surfaces.

## What Changed

- `website/components/public-catalogue-browser.tsx`
  - Changed the collapsed filter button from `Choose kind` to `Plant type`.
  - Changed the expanded filter button from `Hide kinds` to `Hide types`.
  - Changed highlighted plant and side-preview labels from `Kind` to `Type`.
  - Changed `See this plant` links to `Open plant page`.
- `website/app/catalog/[slug]/page.tsx`
  - Changed the public plant detail label from `Kind` to `Type`.
- `website/components/views/catalogue-view.tsx`
  - Changed the signed-in Field Guide filter button and aria label from `Choose kind` to `Plant type`.
  - Changed the expanded state from `Hide kinds` to `Hide types`.
- `website/tests/public-catalogue-content.test.ts`
  - Updated public catalogue assertions for `Plant type`, `Type`, and `Open plant page`.
  - Added guards against `Choose kind`, `Hide kinds`, and `See this plant`.
- `website/tests/catalogue-format.test.ts`
  - Updated public and signed-in catalogue assertions to require the new labels and reject the old ones.

## Evidence

- Focused tests passed from `website`:
  - `npm test -- public-catalogue-content.test.ts catalogue-format.test.ts`
  - 2 files, 22 tests.
- Live route probes:
  - `/catalog` returned `200`, found `Plant type`, `Type`, and `Open plant page`, and did not find `Choose kind`, `Hide kinds`, `See this plant`, or `Kind`.
  - `/catalog/calendula` returned `200`, found `Type`, and did not find the old wording.
  - `/sample-garden/catalogue` returned `200` and did not expose the old wording.
- Full verification passed from `website`:
  - `npm test`
  - `npm run build`
  - `git diff --check`

## Remaining Uncertainty

No browser screenshot was captured in this pass. Browser/Chrome capture tools were not exposed, Codex app capture has been blocked by safety policy in this session, and Playwright fallback requires explicit permission under the Product Design rules.

## Next Action

Continue the cleanup loop on homepage framing, especially labels like `How it helps` and the hero field note, then inspect the Ask empty-state `Start here` language.
