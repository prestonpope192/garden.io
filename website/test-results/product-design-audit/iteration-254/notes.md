# Iteration 254 - Homepage Promise Tightening

Date: 2026-06-23

Scope: tighten the homepage hero and signed-out app gate around the `Your garden, smarter` promise.

## Screenshots

- `screenshots/01-homepage-before.png` - accepted Chrome capture before the hero lead rewrite.
- `screenshots/02-homepage-after.png` - accepted Chrome capture after the hero lead rewrite.
- `screenshots/03-auth-gate-after.png` - accepted Chrome capture of the signed-out app gate after the rewrite.

## Finding

- The headline was strong, but the support line still described product mechanics: `Snap a photo, ask a question, and save the answer...`
- That phrasing made users parse storage behavior before understanding the benefit.
- The signed-out app gate repeated the same mechanics-heavy sentence.

## Changed

- Replaced the homepage lead with: `Jot a note or add a photo. Garden.io remembers your plants, beds, and season so the next step is clearer.`
- Replaced the homepage note with: `Use it like a garden journal. The more you save, the better your care answers get.`
- Updated the signed-out app gate to match the same benefit-led promise.
- Updated browser/share metadata to say the app remembers garden context so care advice gets clearer.
- Added content tests that reject the old mechanics-heavy line.

## Result

- The first three seconds now say what the user does and what gets better.
- The homepage, auth gate, and metadata all explain Garden.io as a garden journal with memory.
- The promise now points to the user's felt need: clearer care advice without re-explaining the garden every time.

## Evidence

- Chrome accessibility tree for `/` showed the new hero lead and no old `Snap a photo...save the answer...` copy.
- Chrome accessibility tree for `/app/my-property` showed the same new support line in the signed-out app gate.
- Focused tests passed: `homepage-content.test.ts`, `auth-gate-content.test.ts`, `ai-first-garden-home.test.tsx`, and `sample-garden.test.ts`, 4 files, 21 tests.
- Full `npm test` passed: 22 files, 120 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Live preview at `http://127.0.0.1:3021` served the new homepage line, new metadata description, and no old hero sentence.

## Evidence Limits

- This pass covered desktop Chrome homepage and signed-out app gate copy.
- It did not re-audit the full Ask answer/save flow.
- Screenshot inspection does not prove complete keyboard or screen-reader behavior.
