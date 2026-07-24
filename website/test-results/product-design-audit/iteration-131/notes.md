# Iteration 131 Notes

Scope: simplify AI/recommendation copy into gardener-facing care guidance.

Changed:
- Homepage "Know what to do next" copy now says notes, photos, dates, and weather become simple care tips.
- Removed the homepage phrase `AI turns your notes... practical suggestions`.
- Plant check intro now says the plant's context helps shape what to try next.
- Plant check save hint now says saved checks help future care tips use that context.
- Regression coverage rejects the old `AI turns`, `practical suggestions`, `future suggestions`, and `help suggest what to try next` phrasing.

Why:
- Prospective users need to understand the payoff in about three seconds: save what happened, get clearer next steps.
- "AI" and "suggestions" describe how the product works internally.
- "Care tips" and "what to try next" describe the gardener's felt need without overexplaining the system.

Verification:
- Focused copy tests passed: `homepage-content.test.ts` and `diagnose-panel-content.test.ts`, 2 files, 4 tests.
- Full `npm test` passed: 18 files, 87 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered-route visible-copy scan passed for 14 routes at `http://localhost:3020`.
- Source scan confirms old phrases remain only as negative assertions.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture remain unavailable in this environment, and Playwright fallback requires explicit user approval. This pass is covered by source checks, component tests, production build, and rendered-route text scans.
