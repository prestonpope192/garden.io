# Iteration 330 - Shared Garden Promise Copy

Date: 2026-06-24
Surface: homepage hero and signed-out app entry
Health: Green

Goal: Make the shared Garden.io promise read naturally and directly describe the user's garden-care need.

Changes:
- Changed the shared promise from `A calm garden notebook for what you planted, where it lives, what changed, and what to care for now.` to `A calm garden notebook for what you planted, where it lives, what changed, and what needs care next.`
- Applied the same wording to the homepage hero and the signed-out app entry.
- Updated homepage and auth-gate tests to require the new phrase and reject the awkward `what to care for now` wording.

Files:
- `website/app/page.tsx`
- `website/components/auth-gate.tsx`
- `website/tests/homepage-content.test.ts`
- `website/tests/auth-gate-content.test.ts`

Evidence:
- Product Design audit, Product Design index, user-context preflight, critical overrides, session-budget guidance, and Garden.io memory were read during this pass.
- Product Design saved context preflight found no saved entries, so this pass used the current repo and Garden.io memory as grounding.
- Focused tests passed: `homepage-content.test.ts` and `auth-gate-content.test.ts` - 2 files, 6 tests.
- Full `npm test` passed: 23 files, 130 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Live `/` contains `A calm garden notebook for what you planted, where it lives, what changed, and what needs care next.`
- Live `/app/my-property` signed-out entry contains the same phrase.
- Live route probes did not return `what to care for now`.

Limit:
- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.
