# Iteration 576 Today shortcut target-size pass

Scope: continue the clean/simple application goal by checking the homepage, auth-gated app entry, tour app flow, and public catalogue for remaining user-facing copy, navigation, image, overflow, and target-size issues.

Findings:
- The checked routes had no forbidden beta/prototype/waitlist/Field Guide/developer-facing copy.
- The checked desktop and mobile routes had no horizontal overflow.
- The tour Today route had three bottom shortcut links at 34px tall on desktop: My Garden, Weekly care, and Choose plants. Those shortcuts are repeated app navigation, so they should meet the same comfortable target size used elsewhere.
- Local `/app/*` routes still resolve to the auth gate in this browser session, so this pass does not prove signed-in live-data states.

Changed:
- Raised `.garden-ai-shortcut` from a 34px minimum height to a 40px minimum height.
- Slightly increased shortcut padding to preserve the quiet pill shape after the size increase.
- Updated CSS/content regression tests to protect the larger Today shortcut target size.

Evidence:
- `route-dom-sweep.json` records the desktop/mobile route sweep before the fix. The desktop Today route reported the bottom shortcut links at 34px tall.
- `shortcut-target-after.json` records the desktop/mobile Today recapture after the fix. The shortcut row reports no small targets, no overflow, and 40-41px heights for the bottom shortcuts.
- The in-app Browser has repeatedly timed out on screenshot capture for these local app routes, so this iteration uses DOM/browser-state evidence plus tests/build instead of screenshot evidence.

Verification:
- Focused CSS/content tests passed: 3 files, 29 tests.
- Full `npm test` passed: 24 files, 135 tests.
- `npm run build` passed.
- `git diff --check` passed.

Limit:
- This pass improves local tour/app navigation ergonomics. The overall active goal should remain open because authenticated live-data states and full signed-in keyboard traversal are still not proven.
