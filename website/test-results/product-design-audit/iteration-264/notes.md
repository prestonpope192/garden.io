# Product Design Audit - Iteration 264

Date: 2026-06-23

Task class: build work

Current-state finding:
- The sample garden header still used a visible `Start` CTA.
- In rendered text this collapsed into `Look aroundStart`, and the visible button was less clear than the rest of the simplified flow.
- The signed-in property view source still titled the route `Garden Memory`, which is more product-structure language than gardener-facing language.

Changes implemented:
- Changed the sample garden header CTA from `Start` to `Start your garden`.
- Changed the signed-in property view title from `Garden Memory` to `My Garden`.
- Updated regression coverage so the sample header keeps the explicit CTA and the app source keeps `My Garden`.

Updated health:
- The sample header now explains the action without relying on aria-only copy.
- The property view title now matches the sample route and the user's mental model: this is their garden, not a module named memory.
- The first-value path remains intact: ask, open the garden map, check plants/care, or start your own garden.

Evidence:
- Focused tests passed: `sample-garden.test.ts` and `ai-first-garden-home.test.tsx`, 2 files, 15 tests.
- Full `npm test` passed: 22 test files, 120 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Running preview at `http://127.0.0.1:3021/sample-garden/property` renders `Start your garden` and `My Garden`.
- In-app Browser DOM check confirmed `ctaText: Start your garden`, `title: My Garden`, no short `Start` link, and no visible `Garden Memory`.

Evidence limits:
- In-app Browser DOM verification succeeded.
- In-app Browser screenshot capture still timed out with `Page.captureScreenshot`.
- Separate Playwright/Chrome screenshot capture was not used because Product Design browser guidance requires explicit approval before using another browser route.
