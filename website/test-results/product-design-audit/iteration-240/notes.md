# Product Design Audit - Iteration 240

Date: 2026-06-23

Scope: align homepage hero copy with the simpler `Your garden, smarter.` direction.

User need:
- Understand the app in about three seconds.
- Hear a user-facing promise, not developer-facing product description.
- See that notes/photos become useful garden memory tied to real plants, beds, and seasons.

Accepted screenshots:
- `screenshots/home-mobile-final.png` - homepage mobile with the updated hero copy.
- `screenshots/home-desktop-final.png` - homepage desktop with the updated hero copy.

Finding:
- The homepage still led with `Know what to do next in your garden.`, while the signed-out app entry had already moved to `Your garden, smarter.`
- That split the product promise and made the homepage feel more procedural than memorable.

Changed:
- Updated the homepage H1 to `Your garden, smarter.`
- Replaced the lead with `Ask with a quick note or photo. Keep the answer with the plant, bed, or season it belongs to.`
- Replaced the fit line with `Built for gardeners who want help that remembers the garden they actually have.`
- Simplified the first section header to explain the loop in user-facing language.
- Updated homepage content tests to guard the new copy and reject the old procedural phrasing.

Result:
- Homepage and signed-out app entry now share the same simple promise.
- Supporting copy explains the practical value without mentioning product mechanics or internal development framing.

Evidence:
- Focused tests passed: `homepage-content.test.ts`, `auth-gate-content.test.ts`, and `public-catalogue-content.test.ts`, 3 files, 13 tests.
- Full `npm test` passed: 22 files, 118 tests.
- `npm run build` passed with Next.js production build.
- Browser capture on `/` confirmed `Your garden, smarter.` on mobile and desktop, no old hero copy, no SVG images, and no horizontal overflow.
- Visual review accepted `screenshots/home-mobile-final.png`.

Evidence limits:
- This pass did not test a real sign-in email.
- This pass was copy-focused and did not redesign the hero CTA layout.
