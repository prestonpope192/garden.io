## Iteration 273 update

Current-state finding:
- The homepage and auth entry are much cleaner after the prior pass.
- The first working sample screen, `/sample-garden/ask`, still had a weak next step after the question box.
- The three useful paths below the composer looked like quiet footer text instead of clear choices.
- A mobile screenshot from basic Chrome capture appeared horizontally cropped, so this pass checked the layout with explicit Chrome DevTools viewport metrics.

Changes implemented:
- Turned the three Ask shortcuts into lightweight action tiles while keeping the same simple choices:
  - `Open garden map`
  - `See this week`
  - `Find plants`
- Added clear borders, paper background, soft shadow, and hover/focus states to the tiles.
- Added mobile wrapping rules for the Ask context line and suggested-question chips.
- Added regression coverage for the action-tile styling and no-overflow wrapping rules.

Updated health after implementation:
- The Ask screen now gives a clearer path after the user sees the main note/photo composer.
- The shortcuts are visibly clickable without bringing back heavy app navigation or internal module language.
- The mobile Ask layout has metric proof of no horizontal overflow at a 390px CSS viewport.

Evidence:
- Captured current-state screenshots for `/`, `/sample-garden/ask`, `/sample-garden/property`, `/sample-garden/plants`, and `/app/my-property`.
- Accepted final desktop screenshot: `08-sample-ask-final-desktop.png`.
- Mobile layout metrics saved in `mobile-overflow-metrics.json`: `innerWidth` 390, `scrollWidth` 390, `bodyScrollWidth` 390, and no overflowing elements.
- Focused tests passed: `ai-first-garden-home.test.tsx`, `sample-garden.test.ts`, and `app-flow-visual-css.test.ts`, 3 files, 26 tests.
- Full `npm test` passed: 23 test files, 124 tests.
- `npm run build` passed with Next.js production build.
- `git diff --check` passed.
- Route scan confirmed `/`, `/sample-garden/ask`, `/sample-garden/property`, `/sample-garden/plants`, and `/app/my-property` returned 200.
- Route scan confirmed `/sample-garden/ask` includes the three shortcut actions and no old `Know what to do next` / `Ask your garden` copy.
- Preview remains running at `http://127.0.0.1:3021`.

Evidence limits:
- Basic Chrome `--screenshot` at `390x844` cropped a 500px CSS layout, so that file was not used as accepted mobile visual evidence.
- Chrome DevTools `Page.captureScreenshot` hung before writing the CDP mobile screenshot, but the CDP metric check completed and proved the layout width.
- This pass did not verify signed-in account creation, real magic-link email delivery, keyboard tab order, or a screen-reader run.
