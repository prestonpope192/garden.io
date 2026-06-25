# Iteration 123 Notes

Scope: replace remaining public/sample tracking language with gardener-facing notice language.

Changed:
- Public plant detail pages now say `What to notice` instead of `What to track`.
- Plant detail guidance now says `Once it is growing, note timing, weather, photos, and care so next season is easier.`
- The sample calendar bloom note now says `Notice how long this flush lasts before deadheading.`
- Regression coverage rejects `What to track`, `trackingDetails`, and `Track how long this flush lasts before deadheading.`

Why:
- The old language still felt like the app was asking the user to operate tracking software.
- The new language matches a gardener's real behavior: notice what changes, save the useful detail, and make next season easier.

Verification:
- Focused tests passed: `public-catalogue-content.test.ts` and `sample-garden.test.ts`, 2 files, 14 tests.
- Full `npm test` passed: 18 files, 87 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered-route visible-copy scan passed for 14 routes at `http://localhost:3020`.
- Rendered `/catalog/french-marigold` now includes `What to notice` and rejects `What to track`.
- Rendered `/sample-garden/calendar` now includes `Notice how long this flush lasts before deadheading.` and rejects the old tracking phrase.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture remain unavailable in this environment, and Playwright fallback requires explicit user approval. This pass is covered by route text scans, source checks, and component tests.
