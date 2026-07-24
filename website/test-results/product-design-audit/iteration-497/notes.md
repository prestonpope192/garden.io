# Iteration 497 - Sample My Garden Notes CTA

Scope: make the sample My Garden drawer action say what the gardener gets, rather than using generic `Open` language.

Changed:
- Changed `Start with Bell Pepper. Open it when you want its notes.` to `Start with Bell Pepper. View its notes when you need context.`
- Changed the complete-no-care fallback from `Open a bed or plant when you want its notes.` to `Choose a bed or plant when you want its notes.`
- Changed the next-plant action from `Open Bell Pepper` to `View Bell Pepper notes`.
- Updated sample content tests to require the new wording and reject the old `Open` wording.

Why:
- `Open` describes operating the interface.
- `View notes` tells the gardener what they get and keeps the sample garden feeling like a useful journal.

Evidence:
- Product Design user-context preflight ran. Saved context exists but has no entries, so this pass used route output, source, tests, build output, and Garden.io brand memory.
- Live `/sample-garden/property` route-output probe found `Start with Bell Pepper. View its notes when you need context.` and `Where things grow`.
- The route probe did not find `Start with Bell Pepper. Open it when you want its notes.` or `Open Bell Pepper`.
- Focused tests passed from the website package: `sample-garden.test.ts`, `empty-state-content.test.ts`, and `app-flow-visual-css.test.ts` - 3 files, 31 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.

Limit:
- Browser screenshot capture was not available. The Browser-specific tool was not exposed, and Computer Use is blocked from accessing the Codex app, so this pass used route-output probes plus test/build verification.
