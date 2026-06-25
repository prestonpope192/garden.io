# Iteration 331 - Homepage How-It-Helps Headline

Date: 2026-06-24
Surface: homepage How it helps section
Health: Green

Goal: Replace a stiff explanatory headline with a shorter, clearer gardener-facing promise.

Changes:
- Changed the homepage section headline from `Know what happened before deciding what to do.` to `See what changed before you act.`
- Updated homepage tests to require the new headline and reject the old phrasing.

Files:
- `website/app/page.tsx`
- `website/tests/homepage-content.test.ts`

Evidence:
- Product Design audit, Product Design index, user-context preflight, critical overrides, session-budget guidance, and Garden.io memory were read during this pass.
- Product Design saved context preflight found no saved entries, so this pass used the current repo and Garden.io memory as grounding.
- Focused tests passed: `homepage-content.test.ts` and `auth-gate-content.test.ts` - 2 files, 6 tests.
- Full `npm test` passed: 23 files, 130 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Live `/` contains `See what changed before you act.`
- Live `/` did not return `Know what happened before deciding` in the route probe.

Limit:
- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.
