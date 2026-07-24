# Iteration 332 - Signed-Out Garden Link CTA

Date: 2026-06-24
Surface: signed-out app entry
Health: Green

Goal: Make the app entry call to action sound like something a gardener wants to do, not an internal authentication step.

Changes:
- Changed the signed-out app button from `Email me my garden link` to `Send my garden link`.
- Updated auth gate tests to require the new button copy and reject the old phrasing.

Files:
- `website/components/auth-gate.tsx`
- `website/tests/auth-gate-content.test.ts`

Evidence:
- Orchestratror mode, Product Design critical overrides, saved user-context preflight, codex-safe-run guidance, and Garden.io memory were read during this pass.
- Product Design saved context preflight found no saved entries, so this pass used the current repo and Garden.io memory as grounding.
- Focused tests passed: `auth-gate-content.test.ts` and `homepage-content.test.ts` - 2 files, 6 tests.
- Full `npm test` passed: 23 files, 130 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Live `/app/my-property` contains `Send my garden link`.
- Live `/app/my-property` did not return `Email me my garden link` in the route probe.

Limit:
- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.
