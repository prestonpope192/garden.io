# Iteration 247 Notes

Scope: simplify the homepage and signed-out gate copy around the `Your garden, smarter.` direction.

User need:
- Understand the value in a few seconds.
- Hear language meant for a gardener, not the developer.
- See a simple journal-first promise, with smarter help coming from saved garden context.

Accepted screenshots:
- `screenshots/homepage-desktop.png` - desktop homepage after copy update.
- `screenshots/homepage-mobile.png` - mobile homepage after copy update.
- `screenshots/homepage-desktop-small.png` - resized desktop reference.
- `screenshots/homepage-mobile-small.png` - resized mobile reference.

Finding:
- The hero was moving toward the right idea, but supporting copy still mixed older mechanical phrasing with the new promise.
- The first explanatory section still leaned on generic next-step wording instead of showing how saved garden memory makes the help better.

Changed:
- Kept the hero promise as `Your garden, smarter.`
- Changed the lead to `Snap a photo, ask a question, and save the answer with the plant, bed, or season it belongs to.`
- Reframed the support line as `A simple garden journal with enough memory to give better next steps.`
- Reworked the first three steps to `Map your garden`, `Record what happened`, and `Ask with context`.
- Matched the signed-out gate to the same promise with `Garden help with memory` and simpler first-step copy.

Result:
- The first screen now reads as a simple user benefit: journal what happened, then ask with context.
- The mobile screenshot shows the headline, support line, CTA, and botanical plate without the old `Know what to do next` hero copy.
- The homepage uses journal-style botanical plant images in the checked state.

Evidence:
- Focused content tests passed: `homepage-content.test.ts` and `auth-gate-content.test.ts`, 2 files, 5 tests.
- Full `npm test` passed: 22 files, 119 tests.
- `npm run build` passed.
- Browser metrics confirmed `Your garden, smarter.`, the new lead/support line, no old hero copy, and no visible overflow on desktop or mobile.
- `git diff --check` passed for touched files.

Evidence limits:
- This pass reviewed homepage and signed-out gate copy, not every in-app microcopy string.
- Screenshot checks confirm layout and visible copy, not conversion quality.
