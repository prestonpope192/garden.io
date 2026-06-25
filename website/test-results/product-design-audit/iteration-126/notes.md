# Iteration 126 Notes

Scope: remove an unnecessary signed-in Plant Guide sort control.

Changed:
- Removed the signed-in Plant Guide sort state and dropdown.
- Plant Guide browsing now keeps only search and plant type choices.
- The summary now stays plain: `All plants` or the selected plant type.
- Regression coverage rejects `grouped by type`, `garden-cat-sort`, `SortKey`, and `htmlFor="cat-sort"`.

Why:
- The public Plant Guide was already simpler without a sort dropdown.
- Signed-in users are trying to choose plants that fit their garden, not manage sorting controls.
- Removing this control reduces decision noise while preserving name-based ordering.

Verification:
- Focused tests passed: `catalogue-format.test.ts` and `sample-garden.test.ts`, 2 files, 20 tests.
- Full `npm test` passed: 18 files, 87 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered-route visible-copy scan passed for 14 routes at `http://localhost:3020`.
- Source guard confirms the signed-in sort control is removed from `catalogue-view.tsx`.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture remain unavailable in this environment, and Playwright fallback requires explicit user approval. This pass is covered by route text scans, source checks, and component tests.
