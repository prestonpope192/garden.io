# Iteration 578 app-shell target and tour-copy pass

Scope: continue the clean/simple Garden.io goal by checking the homepage, local tour app flow, and signed-out app gate for remaining user-facing friction.

Task type: build work.

Findings:
- The Today screen itself is calm and focused, but the shared tour app header links measured 38px tall on desktop across `Today`, `My Garden`, `Weekly care`, `Plant Journal`, and `Choose plants`.
- The hidden photo input still produced a 1px visible target in the browser scan, even though the visible `Add a photo` button is the intended control.
- Tour save notices used the slightly indirect phrase `Start your garden, then you can...`.

Changed:
- `.garden-app-header__nav a` now uses inline-flex centering and a 40px minimum height across the desktop app shell.
- `.garden-ai-photo-input` now has a zero-size hidden box, so the browser no longer sees it as a tiny target.
- Tour read-only notices now use the simpler `Start your garden to ...` pattern.
- Regression tests protect the app nav target height, hidden photo input box, and simpler tour notice copy.

Evidence:
- `route-sweep-before.json` captured the baseline across `/`, `/tour/ask`, `/tour/property`, `/tour/calendar`, `/tour/plants`, `/tour/catalogue`, and `/app/my-property`.
- `route-sweep-after.json` captured the post-fix tour routes. Every header nav link measured 40px tall, `smallTargets` was empty, `overflow` was 0, and forbidden copy was empty.
- Screenshots saved in this folder include `home.png`, `tour-ask.png`, `tour-property.png`, `tour-calendar.png`, `tour-plants.png`, `tour-catalogue.png`, `app-gate.png`, and the five `*-after.png` tour screenshots.

Verification:
- Focused tests passed: 3 files, 29 tests.
- Full `npm test` passed.
- `npm run build` passed.
- `git diff --check` passed.

Limit:
- This pass improves local public/tour/app-gate surfaces. The overall active goal remains open because signed-in live-data states and full signed-in keyboard traversal are still not proven.
