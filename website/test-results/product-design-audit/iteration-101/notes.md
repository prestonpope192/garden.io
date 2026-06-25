# Product Design Audit Iteration 101

Scope: simplify remaining Calendar and garden-history copy so the app consistently speaks in the user's care-list language instead of internal `task` language.

Capture status: no new screenshots were captured in this pass. Browser and Chrome capture are not exposed in this environment, and Playwright fallback still requires explicit user approval. Validation used source inspection, component rendering tests, production build, and rendered route HTML from `http://localhost:3020`.

## What Changed

- Sample Calendar now says `Next care item coming up.` instead of `Next task coming up.`
- Calendar's read-only fallback now says `The next care item is below` instead of `The next care task is below`.
- Calendar view-toggle accessibility label now says `Weekly care view`.
- Month-day accessibility labels now announce `care item` / `care items` instead of `task` / `tasks`.
- Garden Map guide now says `Next care item:` instead of `Next care task:`.
- Plant-history and Garden Map timeline chips now say `care` instead of `task`.
- Sample garden and empty-state tests now guard against the old task phrasing returning.

## Product Design Read

Step 1, Calendar start-here state: improved. The first visible line now matches the care-list promise users saw on the homepage and Garden Map.

Step 2, Calendar accessibility labels: improved. Assistive-tech labels now describe care items, not internal task objects.

Step 3, Garden Map next-care guide: improved. The drawer continues the same care-item vocabulary users see in the Calendar.

Step 4, Plant history timeline: improved. The timeline now reads as a garden care history rather than a project-management log.

Step 5, public and signed-out routes: healthy. No stale visible-copy regression found in rendered route HTML.

## Verification

- `npm test -- sample-garden.test.ts empty-state-content.test.ts garden-timeline.test.ts garden-mutation-copy.test.ts`: 4 files, 28 tests passed.
- `npm test`: 17 files, 82 tests passed.
- `git diff --check`: passed.
- `npm run build`: passed.
- Rendered-route visible-copy scan: passed for 14 routes at `http://localhost:3020`.

## Remaining Risk

- Screenshot evidence is still limited because no approved screenshot capture path is available in this environment.
- Protected signed-in app states still rely primarily on component rendering tests without a real signed-in browser session.
- Internal code still uses the `GardenTask` model name. This pass intentionally changed user-facing labels only.
