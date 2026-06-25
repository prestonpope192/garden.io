# Iteration 498 - Weekly Care Label Cleanup

Scope: make the weekly care screen and app shell use clearer, consistent language.

Changed:
- Changed the calendar screen from `Weekly care` kicker + `This Week` title to `This week` kicker + `Weekly care` title.
- Changed app shell calendar nav from `This Week` to `Weekly care`.
- Updated sample, homepage shell, and app-home tests to require the new labels and reject the old title-cased `This Week` link/heading.

Why:
- `This Week` is understandable but generic app navigation.
- `Weekly care` names the user's actual job in the garden, while `This week` works better as the smaller time context.

Evidence:
- Product Design user-context preflight ran. Saved context exists but has no entries, so this pass used route output, source, tests, build output, and Garden.io brand memory.
- Live `/sample-garden/calendar` route-output probe found `This week`, `Weekly care`, `Start with what needs care. Let the rest wait.`, and `3 garden jobs this week`.
- The route probe did not find `This Week`.
- Focused tests passed from the website package: `sample-garden.test.ts`, `homepage-content.test.ts`, `ai-first-garden-home.test.tsx`, and `app-flow-visual-css.test.ts` - 4 files, 33 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.

Limit:
- Browser screenshot capture was not available. The Browser-specific tool was not exposed, and Computer Use is blocked from accessing the Codex app, so this pass used route-output probes plus test/build verification.
