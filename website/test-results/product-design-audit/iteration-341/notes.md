# Iteration 341 Notes

Date: 2026-06-24
Surface: homepage and sample garden Ask entry
Task class: build work
Destination: local audit folder

## Objective

Make the main AI-care entry feel more like a gardener describing a real observation and less like product/system copy.

## Product Design Steps

1. Ask-screen promise
   - Health: Green
   - Output: `website/components/views/garden-ask-view.tsx`
   - Changed the main Ask lead to `Describe what changed. Get one clear care step from your garden notes.`

2. Ask composer prompt
   - Health: Green
   - Output: `website/components/views/garden-ask-view.tsx`
   - Replaced the vague `What are you seeing?` placeholder with concrete garden examples: `Yellow leaves, new spots, heavy rain...`

3. Homepage-to-app consistency
   - Health: Green
   - Output: `website/app/page.tsx`, `website/components/garden-app.tsx`, `website/components/garden-app-preview.tsx`
   - Aligned the homepage help section and app subtitles with the same `Describe what changed` care-step promise.

4. Regression coverage
   - Health: Green
   - Output: `website/tests/ai-first-garden-home.test.tsx`, `website/tests/sample-garden.test.ts`, `website/tests/homepage-content.test.ts`
   - Updated tests to require the new copy and reject the older `Show what changed`, `What are you seeing?`, and `Save what you notice now` phrases.

## Evidence

- Product Design audit, Product Design index, Product Design critical overrides, saved user-context preflight, session-budget guidance, and Garden.io style/current-state docs were read during this pass.
- Product Design saved context preflight found no saved entries, so this pass used the current repo, current app source, and Garden.io memory as grounding.
- Focused tests passed: `ai-first-garden-home.test.tsx`, `sample-garden.test.ts`, and `homepage-content.test.ts` - 3 files, 22 tests.
- Full `npm test` passed: 23 files, 130 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Live `/` contains `Describe what changed, then keep the useful care step with the right plant.`
- Live `/` does not contain `Show what changed, then keep the useful care step with the right plant.`
- Live `/sample-garden/ask` contains `Describe what changed. Get one clear care step from your garden notes.` and `Yellow leaves, new spots, heavy rain...`
- Live `/sample-garden/ask` does not contain `Show what changed. Get one care step using your garden notes.`, `What are you seeing?`, or `Save what you notice now`.

## Limit

Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, Codex app capture is blocked by safety policy, and Playwright fallback requires explicit permission under the Product Design rules.
