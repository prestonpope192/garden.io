# Iteration 134 Notes

Scope: simplify app-shell subtitles so each main view describes the gardener's job.

Changed:
- Garden Map subtitle now says `Find each area, bed, plant, and note by place.`
- This Week subtitle now says `Know what needs care this week and what can wait.`
- Plants subtitle now says `Choose a plant to see where it lives, what happened, and what needs care next.`
- Plant Guide subtitle now says `Compare sun, water, and space before you choose what to grow.`
- The same copy now appears in both the signed-in app shell and the example garden shell.
- Regression coverage rejects the previous list-like/module-like subtitles.

Why:
- The old subtitles described app inventory: areas, beds, plants, notes, or keeping plants tied to beds.
- A gardener is trying to answer practical questions: where is it, what needs care, what happened, and what fits this space.
- The app frame now reinforces those jobs before the user enters each view.

Verification:
- Focused app/example tests passed: `sample-garden.test.ts` and `empty-state-content.test.ts`, 2 files, 17 tests.
- Full `npm test` passed: 18 files, 87 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered-route visible-copy scan passed for 14 routes at `http://localhost:3020`.
- Source scan confirms old app-shell subtitles remain only as negative assertions.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture remain unavailable in this environment, and Playwright fallback requires explicit user approval. This pass is covered by source checks, component tests, production build, and rendered-route visible-text scans.
