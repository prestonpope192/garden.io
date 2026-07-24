# Iteration 566 local review and target-size cleanup

Scope: continue the clean/simple app goal with a fresh local flow audit focused on visual cruft, focusable controls, target size, overflow, and lingering beta/product-language flags.

Captured:
- `/`
- `/tour/ask`
- `/tour/calendar`
- `/tour/property`
- `/tour/plants`
- `/tour/catalogue`
- `/app/my-property`

Findings:
- No captured route showed beta/early-access/waitlist/product-preview language.
- No captured route showed horizontal overflow.
- The small black `N` badge visible in prior local screenshots came from Next.js development tooling (`nextjs-portal`), not Garden.io UI.
- The homepage top nav `Choose plants` link measured only 25px high, below the rest of the page's tap/focus target standard.

Changed:
- Disabled the Next.js development indicator with `devIndicators: false` in `next.config.mjs` so local Product Design review screenshots are not polluted by framework chrome.
- Added `next-config.test.ts` to protect that setting.
- Increased `.topnav a` to a 34px minimum height with slight inline padding, preserving the quiet header style while making the link easier to target.

Evidence:
- Browser recapture on `http://localhost:3021/`, `/tour/ask`, and `/tour/calendar` confirmed the local dev badge was not visible.
- Browser recapture confirmed homepage `Choose plants` measures 93px by 34px, with no remaining small homepage targets and no horizontal overflow.
- Screenshots and JSON evidence saved in `iteration-566/`.

Verification:
- Focused tests passed from the website package: 3 files, 8 tests.
- Full `npm test` passed from the website package: 24 files, 133 tests.
- `npm run build` passed from the website package.
- `git diff --check` passed.

Limit:
- This pass improves local review cleanliness and one measurable target-size issue. The broader active goal still needs deeper signed-in data-state QA and a full manual keyboard walkthrough before it can be considered complete.
