# Iteration 146: Garden Map Care Summary

Date: 2026-06-22
Route focus: `/sample-garden` and `/sample-garden/property`

## Scope

Simplify the default Garden Map drawer so it reads like a quick gardener summary instead of repeating map and task-system language.

## Changed

- Replaced the plot label `Garden map` with `Garden layout`.
- Replaced the default drawer label `What needs care next` with `Care at a glance`.
- Replaced `Choose a place to see what happened there and what needs care next.` with `Pick an area, bed, or plant to see its notes and next care.`
- Replaced `Next care item:` with `Next care:`.
- Added regression coverage that rejects the old repeated drawer phrases.

## Why

The sample Garden Map already tells users where things live. The drawer should quickly summarize the garden and point to the next useful action without repeating the same `what needs care next` phrase.

## Verification

- Focused tests passed: `sample-garden.test.ts`, `empty-state-content.test.ts`, and `plant-timeline-content.test.ts`, 3 files, 18 tests.
- Full `npm test` passed: 18 files, 89 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered-route visible-copy scan passed for `/sample-garden`, `/sample-garden/property`, `/sample-garden/calendar`, `/sample-garden/plants`, `/sample-garden/catalogue`, `/catalog`, `/app`, and `/`.
- Rendered scan confirms `/sample-garden` includes `Garden layout`, `Care at a glance`, `Pick an area, bed, or plant to see its notes and next care.`, and `Next care: Water deeply before the hot afternoon`.
- Rendered scan confirms stale Garden Map drawer phrases are absent from the scanned routes.

## Evidence limit

No new screenshots were captured. Browser/Chrome capture remain unavailable in this environment, and Playwright fallback requires explicit user approval. This pass is covered by source checks, component tests, production build, and rendered-route visible-text scans.
