# Iteration 224 - Find Plants Quick Fit

Scope: continue simplifying the sample app by making Find Plants work as a quick plant-fit comparison instead of a botanical reading page.

Audit mode: focused UX, copy hierarchy, responsive layout, screenshot, route, and build verification pass.

User goal:
- Open Find Plants and quickly answer whether a plant fits a bed, container, light level, and care routine.
- See real plant imagery without letting the photo push the useful decision details out of reach.
- Keep the app feeling like a working garden tracker, not a product-demo page.

Accepted screenshots:
- `screenshots/desktop-property-before.png` - desktop My Garden context before this pass.
- `screenshots/desktop-calendar-before.png` - desktop This Week regression context before this pass.
- `screenshots/desktop-plants-before.png` - desktop My Plants context before this pass.
- `screenshots/desktop-catalogue-before.png` - desktop Find Plants before this pass.
- `screenshots/mobile-property-before.png` - mobile My Garden context before this pass.
- `screenshots/mobile-calendar-before.png` - mobile This Week regression context before this pass.
- `screenshots/mobile-plants-before.png` - mobile My Plants context before this pass.
- `screenshots/mobile-catalogue-before.png` - mobile Find Plants before this pass.
- `screenshots/desktop-catalogue-after.png` - desktop Find Plants after this pass.
- `screenshots/mobile-catalogue-after.png` - mobile Find Plants after this pass.
- `screenshots/mobile-calendar-regression.png` - mobile This Week regression check after this pass.
- `screenshots/desktop-calendar-regression.png` - desktop This Week regression check after this pass.

Finding:
- The Find Plants route was still acting like a set of botanical article cards.
- On mobile, the first catalogue card was 758px tall and the catalogue grid was 2306px tall, so one plant consumed most of the first interaction.
- The long description appeared before the decision facts. A gardener looking for a fit had to read prose before seeing light, water, height, and best spot.
- The real image was useful, but it dominated the card rather than supporting a fast comparison.

Changed:
- Reordered each catalogue card so the user sees photo, plant name, botanical name, quick fit facts, then description.
- Renamed `Sun` to `Light` to match the plain user question more closely.
- Added an accessible `quick fit` label around the facts block.
- Restyled Find Plants cards into compact comparison cards with smaller real photos and a two-column fact grid.
- Added mobile constraints so real photos stay visible without taking over the first screen.
- Added source tests and CSS tests to guard the quick-fit hierarchy and compact photo sizing.

Result:
- Mobile first catalogue card height dropped from 758px to 491px.
- Mobile catalogue grid height dropped from 2306px to 1500px.
- Mobile first plant image is now 150px tall, with quick-fit facts above the description.
- Desktop first plant image is now 180px tall inside a compact two-column comparison card.
- The This Week screen stayed stable after the catalogue CSS changes, with the care panel still in the first viewport.
- No horizontal document overflow was found on the checked desktop and mobile routes.

Accessibility risks:
- The facts block now has an accessible label, but screen-reader order, keyboard focus, and touch target quality still need direct assistive-tech testing.
- Some long context strings in calendar cards still have internal scroll-width measurements even though they do not create document-level horizontal overflow.
- The audit did not test authenticated add, edit, upload, or magic-link flows.

Verification:
- Focused `npm test -- sample-garden.test.ts app-flow-visual-css.test.ts public-catalogue-content.test.ts catalogue-format.test.ts` passed from `website/`: 4 files, 31 tests.
- Full `npm test` passed from `website/`: 21 files, 104 tests.
- `npm run build` passed from `website/`.
- `git diff --check` passed.
- Local production server returned 200 for `/sample-garden/catalogue`, `/sample-garden/calendar`, and `/app/plant-catalogue`.
- Chrome DevTools Protocol screenshots and metrics reported no horizontal document overflow on the checked desktop and mobile routes.

Evidence limits:
- This pass used local Chrome DevTools screenshots, source tests, full tests, build, and HTTP route probes.
- It did not prove signed-in database writes, image upload, magic-link email delivery, keyboard navigation, screen-reader output, or production deployment behavior.
- Database attribution showed the current sample images are Commons-attributed, but many newer catalogue rows are AI-generated; future passes should keep separating real-photo showcase choices from generated fallback images.
