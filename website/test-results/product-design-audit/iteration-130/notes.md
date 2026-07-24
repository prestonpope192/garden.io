# Iteration 130 Notes

Scope: make plant and care-item location actions clearer.

Changed:
- Calendar task cards now use `Map` / `Show in map` instead of `See` / `See place`.
- Calendar upcoming and undated task links now say `Show in map`.
- Plants grid cards now say `Show in map` and use `Show where ... is planted in Garden Map` aria labels.
- Plants list rows now use the compact `Map` label instead of `Place`.
- Plant drawer location actions now say `Show in Garden Map`.
- Regression coverage rejects the old vague labels: `See place`, `See plant place`, and `See where planted`.

Why:
- `See place` and `Place` were terse but vague.
- The user is trying to find where a plant or care item lives, so the action should name the destination: the garden map.
- This keeps the product simple while making cross-view navigation easier to understand.

Verification:
- Focused Plants/Calendar tests passed: `empty-state-content.test.ts` and `sample-garden.test.ts`, 2 files, 17 tests.
- Full `npm test` passed: 18 files, 87 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered-route visible-copy scan passed for 14 routes at `http://localhost:3020`.
- Source scan confirms old location labels remain only as negative assertions.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture remain unavailable in this environment, and Playwright fallback requires explicit user approval. This pass is covered by route text scans, source checks, component tests, and the production build.
