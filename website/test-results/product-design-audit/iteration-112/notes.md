# Product Design Audit - Iteration 112

Date: 2026-06-22
Scope: selected-plant history and harvest/how-it-went tracking.

Capture status: no new screenshots were captured in this pass. Product Design Browser capture was not exposed through available tools, and Playwright fallback still requires explicit user approval. Validation used source inspection, component rendering tests, production build, and rendered route HTML from `http://localhost:3020`.

## User Goal

A gardener opening a plant should be able to understand what happened, what is next, and how the planting went without reading raw database dates or abstract record/outcome language.

## Finding

The selected-plant history still displayed timeline dates directly from ISO values, and the harvest/outcome affordance still used generic `result` wording in several places. That made one of the core "remember what happened" loops feel more like a record editor than a garden history.

## Change

- Plant timeline dates now use `formatGardenDate()` before rendering.
- Non-harvest outcome history now labels the entry as `How it went` instead of `Result`.
- Outcome controls now use `+ Add harvest or how it went`, `Remove how it went`, and `Save how it went`.
- Empty history copy now mentions notes, photos, and harvests as the things a gardener naturally saves.
- Added focused rendering coverage in `plant-timeline-content.test.ts`.

## Step Review

1. Selected plant history: healthier. Dates now read like normal garden dates, and the history heading remains simple.
2. Harvest/how-it-went tracking: healthier. The action now speaks to a gardener's goal instead of the data model.
3. Public and signed-out routes: healthy. Rendered HTML still avoids stale product/beta/timeline wording.

## Verification

- Focused tests passed: `plant-timeline-content.test.ts`, `garden-timeline.test.ts`, and `sample-garden.test.ts`, 3 files, 23 tests.
- Full `npm test` passed: 18 files, 85 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Refreshed `next start` preview on `http://localhost:3020`.
- Rendered-route visible-copy scan passed for 14 routes.

## Evidence Limit

No screenshot-backed visual audit was completed in this pass. The copy and formatting behavior are verified through component rendering and rendered-route HTML; visual spacing, focus behavior, and signed-in click-through interaction still need a browser-backed pass when capture is available or Playwright is approved.
