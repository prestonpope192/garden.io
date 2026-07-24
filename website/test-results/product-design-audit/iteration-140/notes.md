# Iteration 140: Weekly Care Page Simplification

Scope: simplify the weekly care page so it answers "what should I do this week?" without repeating the same care items in multiple places.

Changed:
- The main weekly priority section now says `Do first` instead of `Start here`.
- The count now says `care item(s) this week` instead of generic `thing(s) this week`.
- The right rail now shows `Later care` and filters out care items already shown in the current week list.
- Optional generated garden ideas now sit under `Worth considering` instead of `What to do next`.
- Empty rail copy now uses `No later care scheduled.` and `No extra ideas right now.`
- Added regression coverage that rejects `Start here`, `Coming up`, and `What to do next`, and confirms current-week tasks are not duplicated in the later-care rail.

Why:
- A gardener opening the weekly page wants one clear care plan, not three separate sections that sound like competing task systems.
- Repeating the same watering/pruning items in the main list and the rail makes the page look busier than it is.
- `Worth considering` makes generated ideas feel optional and useful, while `Do first` keeps the urgent weekly work obvious.

Verification:
- Focused tests passed: `sample-garden.test.ts` and `empty-state-content.test.ts`, 2 files, 17 tests.
- Full `npm test` passed: 18 files, 89 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered-route visible-copy scan passed for 14 routes at `http://localhost:3020`.
- Rendered scan confirms `Water deeply before the hot afternoon` and `Trim spent sage blooms` each appear once on `/sample-garden/calendar`.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture remain unavailable in this environment, and Playwright fallback requires explicit user approval. This pass is covered by source checks, component tests, production build, and rendered-route visible-text scans.
