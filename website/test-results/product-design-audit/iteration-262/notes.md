# Product Design Audit - Iteration 262

Date: 2026-06-23

Task class: build work

Current-state finding:
- The screenshot the user reacted to showed stale copy: `Know what to do next` and `Ask your garden`.
- The current homepage and auth gate already use the simpler user-facing promise: `Your garden, smarter.`
- The remaining visual mismatch was in the My Plants app list: botanical/journal-style plant images were still cropped with `object-fit: cover`, making them feel like generic square photos instead of preserved plant records.

Changes implemented:
- Kept the homepage and auth-gate direction centered on `Your garden, smarter.`
- Changed `.garden-plants-thumb__img` from cropped cover art to centered `object-fit: contain` so real plant artwork keeps its specimen/field-note feel inside the existing paper-toned frame.
- Added CSS regression coverage for the My Plants thumbnail treatment.

Updated health:
- Homepage copy is now aligned with the user's requested simpler phrase.
- Old screenshot copy is absent from source and the running preview.
- My Plants thumbnails now preserve the full plant image instead of cropping it like a generic photo card.
- The sample plant set remains Bell Pepper, Cilantro, and Calendula, with no Cucumber in the checked sample garden route.

Evidence:
- Focused tests passed: `homepage-content.test.ts`, `auth-gate-content.test.ts`, `ai-first-garden-home.test.tsx`, `app-flow-visual-css.test.ts`, and `sample-garden.test.ts`, 5 files, 30 tests.
- Full `npm test` passed: 22 test files, 120 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Running preview at `http://127.0.0.1:3021/` serves `Your garden, smarter.` and does not serve `Know what to do next`, `ASK YOUR GARDEN`, or `Ask your garden`.
- Running preview at `/sample-garden/plants` serves Bell Pepper, Cilantro, and Calendula thumbnails with computed `object-fit: contain`, `object-position: 50% 50%`, all loaded, and no Cucumber.

Evidence limits:
- The in-app Browser full-page screenshot timed out with `Page.captureScreenshot`.
- The in-app Browser element screenshot helper is not supported in this session.
- I did not switch to a separate Playwright browser because the Product Design browser guidance requires explicit permission before using another browser route.
