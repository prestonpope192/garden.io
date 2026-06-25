# Iteration 316 - First Start Copy

Date: 2026-06-23
Surface: signed-out start page and signed-in no-garden Ask state
Health: Green

## Goal

Make first-start copy sound concrete to a gardener instead of explaining internal "context" mechanics.

## Changes

- Changed signed-out start copy from `Your first plant gives the garden context.` to `Your first plant gives the notebook a place to begin.`
- Changed signed-in no-garden Ask copy from `Answers get better once your first plant has a place.` to `Start by giving one plant a place.`
- Updated AuthGate and Ask-home tests to require the new first-start wording and reject the older context/answer-improvement phrasing.

## Files

- `website/components/auth-gate.tsx`
- `website/components/views/garden-ask-view.tsx`
- `website/tests/auth-gate-content.test.ts`
- `website/tests/ai-first-garden-home.test.tsx`

## Evidence

- Product Design audit, Product Design index, user-context preflight, critical overrides, session-budget guidance, and Garden.io memory were read during this pass.
- Product Design saved context preflight found no saved entries, so this pass used the current repo and Garden.io memory as grounding.
- Focused tests passed: `auth-gate-content.test.ts`, `ai-first-garden-home.test.tsx`, and `sample-garden.test.ts` - 3 files, 20 tests.
- Full `npm test` passed: 23 files, 130 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Live `/sample-garden/ask` contains `Your garden, smarter` and `Ask from your garden`.
- Live `/sample-garden/ask` did not return the older `Your first plant gives the garden context` or `Answers get better once your first plant has a place` phrases.
- Live `/sample-garden/catalogue` rendered the Field Guide content through the actual sample route. The `404` text seen in raw HTML was inside Next's embedded not-found boundary script, not visible page content.

## Limit

- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.
- The signed-out AuthGate first-start copy is covered by rendered component tests because the live `/app` route redirects through auth/session handling.
