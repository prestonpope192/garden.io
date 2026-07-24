# Iteration 573 staged-build cleanup and tab-order pass

Scope: continue the clean/simple app goal by removing remaining staged-build framing from current source surfaces and checking the homepage, tour, Plant Journal, My Garden, and signed-out app gate in the browser.

Findings:
- The rendered routes no longer exposed beta, waitlist, early-access, prototype, MVP, Field Guide, Working product, or AI suggestions copy.
- The sample app and signed-in app still rendered a fully hidden legacy garden rail. It was not part of the current user flow and produced dead hidden controls in automated scans.
- The Today/Ask photo picker put the hidden 1px file input in the keyboard tab order, so focus landed on an invisible control instead of the visible Add a photo affordance.
- `docs/current-state.md` still described the app with older staged-product language and the old Field Guide label.

Changed:
- Removed the hidden `garden-app-rail` markup from the sample tour shell and signed-in app shell.
- Removed the unused rail CSS and rail-only tests.
- Converted the Today/Ask photo picker to a visible `button` that triggers a hidden file input with `tabIndex={-1}`.
- Changed the photo button focus styling from `:focus-within` to `:focus-visible`.
- Removed remaining Phase/Slice comments from timeline/performance source files.
- Updated `docs/current-state.md` to describe the current garden app and `Choose plants` label without linking historical beta migration filenames as the product-facing evidence.

Evidence:
- `route-cleanup-summary-final.json` records the checked routes, forbidden-copy scan, overflow scan, visible-control size scan, hidden rail count, and Today/Ask tab order.
- Screenshots saved in this folder: `home-final.png`, `tour-ask-final.png`, `tour-plants-final.png`, `tour-property-final.png`, and `app-gate-final.png`.

Verification:
- Focused tests passed: 4 files, 31 tests.
- Full `npm test` passed: 24 files, 133 tests.
- `npm run build` passed.
- `git diff --check` passed.

Limit:
- This pass proves the checked local public/tour/auth surfaces are cleaner and no longer carry the removed hidden rail. The active goal should remain open because deeper authenticated live-data states and full keyboard traversal across every signed-in app route are still not proven.
