# Iteration 280 - Homepage Copy Pass

Scope: simplify the homepage, signed-out gate, and first ask surface copy around the clearer promise `Your garden, smarter.`

Audit mode: current mobile screenshot capture, source inspection, scoped copy and CSS changes, focused regression tests, production build, CDP mobile screenshot capture, and rendered viewport metrics.

Captured screens:
- `07-mobile-home-copy-after.png` - first Chrome CLI mobile screenshot after the copy change; rejected as visual evidence because Chrome cropped a 500px layout into a 390px screenshot.
- `08-mobile-home-copy-after-wrap-fix.png` - intermediate Chrome CLI screenshot after headline wrap change; rejected for the same Chrome CLI viewport mismatch.
- `09-mobile-home-copy-cdp.png` - accepted CDP-emulated 390px mobile screenshot after switching to real mobile viewport capture.
- `10-mobile-home-copy-final.png` - final accepted CDP-emulated 390px mobile screenshot after the guarded CSS value.

Finding:
- The user-provided screenshot showed stale `Ask your garden` / `Know what to do next` copy that sounded generic and less aligned with the preferred `Your garden, smarter` direction.
- The current source had already moved the homepage toward `Your garden, smarter`, but the supporting copy still explained the product instead of speaking directly to the user's reason to care.
- First mobile screenshot verification also exposed that Chrome CLI screenshots were cropping a wider layout; CDP capture was needed for reliable mobile evidence.

Changed:
- Rewrote the homepage lead to: `Save what you planted, where it is, and what you notice. When something looks off, your notes and photos help point to the next step.`
- Rewrote the homepage note to: `Start with one plant. The garden gets more helpful each time you add a note.`
- Simplified the three-step value loop: map the garden, save quick notes, ask what to do next.
- Rewrote the signed-out auth gate to use the same direct value proposition.
- Rewrote the first ask-surface lead and save hint so the app says what the gardener can do instead of describing the product.
- Updated browser/share metadata to the same promise.
- Constrained the mobile hero headline to wrap cleanly without using the previously rejected `2.45rem` size.

Evidence:
- Focused tests passed: `homepage-content.test.ts`, `auth-gate-content.test.ts`, `sample-garden.test.ts`, `ai-first-garden-home.test.tsx`, `app-flow-visual-css.test.ts`, and `mobile-layout-css.test.ts` - 6 files, 35 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Final CDP mobile metrics: `innerWidth: 390`, `scrollWidth: 390`, `bodyScrollWidth: 390`.
- Final rendered text starts with `Your garden, smarter.` and the new lead copy.
- Final screenshot saved at `iteration-280/10-mobile-home-copy-final.png`.
- Preview restarted at `http://127.0.0.1:3021`.

Accessibility notes:
- The first mobile hero now wraps without horizontal overflow at 390px.
- The copy is shorter and more action-oriented, which should improve scan time for prospective users.
- This pass did not run a screen-reader or keyboard-only walkthrough.

Evidence limits:
- This pass focused on the public homepage, signed-out gate copy, and first ask-surface copy. It did not re-audit every authenticated app screen.
- Screenshot evidence is from the sample/public path and does not prove email magic-link delivery or authenticated save behavior.
