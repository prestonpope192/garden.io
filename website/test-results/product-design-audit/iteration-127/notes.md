# Iteration 127 Notes

Scope: simplify signed-in Calendar from a mode switcher to a focused weekly care view.

Changed:
- Removed the signed-in Calendar `Week` / `Month` view toggle.
- Removed month-view state and month-grid rendering.
- Previous/Next now always move by week.
- Regression coverage rejects `MonthView`, `ViewToggle`, `Previous month`, `Next month`, `monthFocus`, and `calView`.

Why:
- The navigation is named `This Week`, and users mainly need what needs care now and what is coming up.
- Month mode added an extra decision and a second calendar model without helping the immediate garden-care workflow.
- The sample Calendar was already focused on weekly care; the signed-in version now follows the same simpler mental model.

Verification:
- Focused Calendar/sample tests passed: `empty-state-content.test.ts` and `sample-garden.test.ts`, 2 files, 17 tests.
- Full `npm test` passed: 18 files, 87 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered-route visible-copy scan passed for 14 routes at `http://localhost:3020`.
- Source guard confirms the signed-in Calendar month mode is removed from `calendar-view.tsx`.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture remain unavailable in this environment, and Playwright fallback requires explicit user approval. This pass is covered by route text scans, source checks, and component tests.
