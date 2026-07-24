# Iteration 492 Notes

Scope: make the sample Plants selection language feel like choosing a plant, not operating a screen.

Changed:
- Changed the Plant Journal subtitle from `Open one plant to see what happened and what helped.` to `Choose one plant to see what happened and what helped.`
- Changed the empty drawer label from `Open a plant` to `Choose a plant`.
- Changed the drawer summary from `Open any plant when you want its notes.` to `Choose any plant when you want its notes.`
- Updated sample and empty-state content tests to require the new `Choose` wording and reject the old `Open` wording.

Evidence:
- Used Product Design audit guidance, Product Design critical overrides, Product Design user-context preflight, current route text, focused tests, full tests, build verification, and Garden.io brand memory.
- Live `/sample-garden/plants` route-output probe found `Choose one plant to see what happened and what helped.`, `Choose a plant`, and `Choose any plant when you want its notes.`
- The route probe did not find `Open one plant to see what happened and what helped.`, `Open a plant`, or `Open any plant when you want its notes.`
- Focused tests passed from the website package: `sample-garden.test.ts`, `empty-state-content.test.ts`, `app-flow-visual-css.test.ts`, and `mobile-layout-css.test.ts` - 4 files, 33 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.

Limit:
- Browser screenshot capture was not available in this thread. The Browser-specific tool was not exposed, and Computer Use is blocked from accessing the Codex app, so this pass used route-output probes plus test/build verification.
