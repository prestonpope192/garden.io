# Iteration 139: Selected Plant History And Update Copy

Scope: simplify the selected-plant history/update flow so it speaks to a gardener's need to remember what happened, know what to do next, and save lessons from the season.

Changed:
- Plant timelines now label the record as `Plant history` instead of a generic history/timeline surface.
- Saved non-harvest outcomes now appear as `What happened`.
- Suggested actions in the plant history now use `next step` instead of `try next`.
- Harvest/season outcome capture now opens from `Add harvest or lesson`, saves with `Save to plant history`, and uses `What happened` / `Some problems` instead of result-oriented language.
- Garden Map now labels the selected-plant action tab as `Update`; `Add` remains for garden-level, area, and bed setup.

Why:
- The selected plant flow should feel like one habit: notice something, save it to the plant, and know the next care step.
- `Add` is misleading once a plant is already selected; the user is updating or checking that plant.
- `Result`, `outcome`, and `try next` read more like product mechanics than a gardener's mental model.

Verification:
- Focused tests passed: `plant-timeline-content.test.ts`, `garden-timeline.test.ts`, `sample-garden.test.ts`, `empty-state-content.test.ts`, `diagnose-panel-content.test.ts`, and `quick-log-content.test.ts`, 6 files, 33 tests.
- Full `npm test` passed: 18 files, 89 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered-route visible-copy scan passed for 14 routes at `http://localhost:3020`.
- Source scan confirms stale outcome/history phrases remain only as negative test assertions or intentionally user-facing plant-check copy.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture remain unavailable in this environment, and Playwright fallback requires explicit user approval. This pass is covered by source checks, component tests, production build, and rendered-route visible-text scans.
