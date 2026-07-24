# Iteration 116 Notes

Scope: simplify plant-list filter language in the signed-in Plants flow.

Changed:
- The Plants drawer filter button now says `Choose plants` instead of `Narrow plants`.
- The expanded state now says `Hide plant choices` instead of `Hide choices`.
- The lifecycle fallback option now says `Mixed or unknown` instead of `Other`.
- Regression tests now require the clearer labels and reject the older interface-oriented copy.

Why:
- Gardeners are trying to choose the plants they want to inspect, not manage filter machinery.
- `Other` is a vague catch-all; `Mixed or unknown` is clearer about what the plant data means.

Verification:
- Focused tests passed: `empty-state-content.test.ts` and `sample-garden.test.ts`, 2 files, 17 tests.
- Full `npm test` passed: 18 files, 86 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered-route visible-copy scan passed for 14 routes at `http://localhost:3020`.
- Component source scan confirms `Choose plants`, `Hide plant choices`, and `Mixed or unknown`; it rejects `Narrow plants`, `Hide choices`, and `>Other</option>`.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture remain unavailable in this environment, and Playwright fallback requires explicit user approval. This pass is covered by route text scans, source checks, and component tests.
