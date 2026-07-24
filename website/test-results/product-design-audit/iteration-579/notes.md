# Iteration 579 responsive target-size pass

Scope: continue the clean/simple Garden.io goal with a responsive audit across the homepage, tour app flow, public catalogue, and signed-out app gate.

Task type: build work.

Findings:
- The default desktop and mobile route sweep showed no forbidden beta/prototype/waitlist copy, no overflow, and no visible small controls.
- Source inspection still found several user-facing interactive rules below the 40px target standard in secondary states: public catalogue kind chips, catalogue tags, Today answer follow-up/save buttons, calendar navigation/action buttons, Plant Journal chips/view toggles, and plant chooser detail controls.
- The mobile public catalogue keeps the desktop featured plant image hidden at 0x0. That is not visible to the user, but the after-sweep now distinguishes hidden images from visible image issues.

Changed:
- Raised remaining shared interactive controls in `globals.css` to a 40px minimum target height.
- Covered public catalogue kind chips and tag buttons, Today answer action buttons, Today photo-preview remove button, calendar navigation/action controls, Plant Journal chips and view toggles, and plant chooser sort/detail controls.
- Added regression assertions for the 40px target standard on these controls.

Evidence:
- `responsive-route-sweep-before.json` records the baseline route sweep across desktop and mobile.
- `catalog-filters-open-before.json` records the attempted catalogue filter-open evidence; browser interaction did not toggle the hydrated state reliably, so the source-level 38px rule was used as the authoritative issue.
- `responsive-route-sweep-after.json` records the post-fix desktop/mobile route sweep. Every checked route had `smallTargets: []`, `overflow: 0`, `visibleImageIssues: 0`, and no forbidden copy.
- Screenshots saved in this folder include desktop and mobile before/after captures for `/`, `/tour/ask`, `/tour/property`, `/tour/calendar`, `/tour/plants`, `/tour/catalogue`, `/catalog`, and `/app/my-property`.

Verification:
- Focused tests passed: 6 files, 51 tests.
- Full `npm test` passed.
- `npm run build` passed.
- `git diff --check` passed.

Limit:
- This pass improves local public/tour/app-gate surfaces and source-level target sizes. The overall active goal remains open because authenticated live-data states and full signed-in keyboard traversal are still not proven.
