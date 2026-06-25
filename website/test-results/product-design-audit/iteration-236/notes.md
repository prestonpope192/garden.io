# Iteration 236 - Real-Photo Showcase Cleanup

Scope: continue simplifying the prospective-user flow, focused on the homepage, default Plant Guide showcase, and sample garden plant records.

Audit mode: combined UX, responsive, and accessibility-risk pass.

User goal:
- Trust that the app is showing real garden material, not placeholder art.
- Quickly understand that every plant can keep photos, notes, tasks, and next steps together.
- See a simple working sample garden without beta, prototype, or developer-facing language.

Accepted screenshots:
- `screenshots/01-my-plants-mobile-before.png` - mobile My Plants before this pass.
- `screenshots/02-my-plants-desktop-before.png` - desktop My Plants before this pass.
- `screenshots/03-home-mobile-final.png` - homepage mobile after this pass.
- `screenshots/04-home-desktop-final.png` - homepage desktop after this pass.
- `screenshots/05-my-plants-mobile-final.png` - sample My Plants mobile after this pass.
- `screenshots/06-find-plants-mobile-final.png` - sample Find Plants mobile after this pass.

Finding:
- The sample plant surfaces were structurally simple and responsive, but the default showcase still included Autumn Sage imagery that read like a cutout or illustration at card size.
- That undercut the user-facing promise that the app is grounded in real plant records and real photos.

Changed:
- Replaced default showcase Autumn Sage with Foxglove across the homepage, sample garden snapshot, public Plant Guide featured list, and broad catalogue ranking.
- Updated sample care copy from `Trim spent sage blooms` to `Cut back spent foxglove stalks`.
- Kept search-specific Autumn Sage behavior intact for sage queries and diagnosis examples.
- Added real Wikimedia attribution on fallback real-photo profiles.
- Updated content tests so default public/sample routes assert Foxglove and the new real-photo URL.

Result:
- The homepage now shows three immediately photo-like plant cards: French Marigold, Foxglove, and Curry Leaf.
- The sample My Plants list still demonstrates the core loop: choose a plant, see where it lives, see how long it has been growing, and see the next step.
- The sample Find Plants view uses real photos and practical fit copy without old SVG-style plant images.

Evidence:
- Focused tests passed: `sample-garden.test.ts`, `homepage-content.test.ts`, `public-catalogue-content.test.ts`, and `catalogue-format.test.ts`, 4 files, 32 tests.
- Full `npm test` passed: 22 files, 117 tests.
- `npm run build` passed with Next.js production build.
- `git diff --check` passed.
- Route probe passed with `200` for `/`, `/catalog`, `/sample-garden/plants`, `/sample-garden/catalogue`, and `/app/my-property`.
- Final route scan found `Foxglove` and `foxglove.jpg` on `/`, `/catalog`, `/sample-garden/plants`, and `/sample-garden/catalogue`.
- Final route scan found no `autumn-sage.jpg` and no `.svg` image references on the checked routes.
- CDP screenshot metrics showed no horizontal overflow at 390px mobile or 1280px desktop.

Evidence limits:
- Screenshots and DOM metrics do not prove keyboard/focus behavior.
- This pass did not test signed-in add, save, or photo-upload flows.
- The DB still contains Autumn Sage as a valid real-photo plant; this pass only removed it from default showcase surfaces because it reads poorly at card size.
