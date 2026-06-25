# Iteration 333 - Ask Surface Promise And CTA

Date: 2026-06-24
Surface: Ask surface in the app and sample garden
Health: Green

Goal: Make the main Ask surface explain the user's benefit in simpler terms: show what changed, use the garden notes, and get one care step.

Changes:
- Changed the Ask lead from `Show what changed. Get one useful care step from the garden you already saved.` to `Show what changed. Get one care step using your garden notes.`
- Changed the submit button from `Ask from your garden` to `Get a care step`.
- Updated the authenticated app and sample garden route subtitles so the same promise appears consistently.
- Updated tests to require the new copy and reject the older mechanism-focused phrasing.

Files:
- `website/components/views/garden-ask-view.tsx`
- `website/components/garden-app.tsx`
- `website/components/garden-app-preview.tsx`
- `website/tests/ai-first-garden-home.test.tsx`
- `website/tests/sample-garden.test.ts`

Evidence:
- Product Design audit, Product Design critical overrides, saved user-context preflight, session-budget guidance, and Garden.io memory were read during this pass.
- Product Design saved context preflight found no saved entries, so this pass used the current repo and Garden.io memory as grounding.
- Focused tests passed: `ai-first-garden-home.test.tsx`, `sample-garden.test.ts`, and `homepage-content.test.ts` - 3 files, 22 tests.
- Full `npm test` passed: 23 files, 130 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Live `/sample-garden/ask` contains `Show what changed. Get one care step using your garden notes.` and `Get a care step`.
- Live `/sample-garden/ask` did not return `Ask from your garden` or `one useful care step`.

Limit:
- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.
