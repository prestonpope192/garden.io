# Iteration 571 mobile target-size cleanup

Scope: continue the active clean/simple app goal with an evidence-led QA pass across the homepage, tour app, public catalogue, plant detail, and signed-out app gate on mobile.

Captured:
- `/` desktop and mobile
- `/tour/ask`
- `/tour/property`
- `/tour/calendar`
- `/tour/plants`
- `/tour/catalogue`
- `/catalog`
- `/catalog/borage`
- `/app/my-property`

Findings:
- Copy and imagery were healthy on checked routes: no visible beta/early-access/product-scaffold copy, no `Field Guide` copy, no horizontal overflow, and all checked plant images came from loaded `plant-art` URLs with zero SVG image sources.
- The remaining measurable friction was tap-target sizing on mobile: app-section nav links were 32px tall, homepage/public top nav links were 34px tall, the signed-out secondary links were 34px tall, the public catalogue filter button was 36px tall, and garden chips were 34px tall.

Changed:
- Raised shared brand links to a 40px minimum hit area.
- Raised public top-nav links to 40px.
- Raised the quiet homepage secondary CTA to a 40px hit area while keeping it visually understated.
- Raised mobile app section nav links, start-garden header CTA, and home-link variants to 40px.
- Raised signed-out secondary links, public catalogue filter button, signed-in catalogue chips, and garden map plant chips to 40px.
- Updated CSS tests to protect the new 40px target standard for the affected shared surfaces.

Evidence:
- `capture-summary.json` records the initial mobile target-size findings.
- `final-target-summary.json` and `accepted-summary.json` confirm the checked mobile routes had no visible controls below the 40px height / 44px width threshold after the fix.
- Accepted screenshots saved in this folder include `accepted-home-mobile.png`, `accepted-home-desktop.png`, the tour app mobile routes, public catalogue mobile, plant detail mobile, and auth gate mobile.
- `home-plants-scrolled-mobile.png` verifies the lower homepage plant cards render the intended botanical plate images when the section is in view. The full-page mobile screenshot can show below-fold images as blank due to Chrome full-page screenshot paint timing, even though DOM image load state is complete.

Verification:
- Focused layout/CSS tests passed: 4 files, 20 tests.
- Full `npm test` passed: 24 files, 133 tests.
- `npm run build` passed.
- `git diff --check` passed.

Limit:
- This pass improves measured mobile usability on local public/tour/auth surfaces. The overall active goal should remain open because a deeper signed-in keyboard/focus walkthrough and production-data-state audit are still not proven.
