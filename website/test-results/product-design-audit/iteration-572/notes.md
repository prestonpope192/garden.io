# Iteration 572 keyboard focus cleanup

Scope: audit the cleaned homepage, tour ask/property screens, public catalogue, and signed-out app gate for keyboard focus clarity after the broader simplification passes.

Findings:
- The public catalogue search had `outline: none` on the input with no clear replacement state on the surrounding search panel.
- Homepage plant cards were keyboard-focusable but needed an explicit card-level focus ring and scroll margin so focus lands cleanly during keyboard navigation.
- The fast screenshot audit briefly caught smooth-scroll focus before it settled; a slower settled recapture confirmed the plant-card focus state is visible.
- Tour ask, tour property, and signed-out app controls already had visible focus treatment.

Changed:
- Added a visible `:focus-within` ring and border treatment to the public catalogue search panel.
- Added a visible `:focus-within` box-shadow to the signed-in catalogue search panel.
- Added `scroll-margin-block` and a visible `:focus-visible` ring to homepage plant cards.
- Raised the small folio link minimum height to 40px.
- Added CSS tests to protect the new focus treatments.

Evidence:
- `focus-baseline.json` captures the initial focus scan.
- `focus-after.json` captures the post-fix focus scan.
- `home-focus-settled.json` confirms the homepage plant cards are visible after smooth-scroll settle.
- Screenshots in this folder capture baseline and fixed states for home, catalogue, tour, property, and auth gate checks.

Verification:
- Focused CSS/layout tests passed: 3 files, 15 tests.
- Full `npm test` passed: 24 files, 133 tests.
- `npm run build` passed.
- `git diff --check` passed.

Limit:
- This pass improves local keyboard focus quality on the checked public/tour/auth surfaces. The active clean/simple goal should remain open until deeper signed-in production-data states and a full end-to-end keyboard walkthrough are proven.
