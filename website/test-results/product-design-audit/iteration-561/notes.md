# Iteration 561 Notes

Scope: mobile rendering plus static keyboard/focus audit for the simplified sample app surfaces.

## Screens Captured

- Homepage baseline: `01-mobile-homepage.png`
- Ask baseline: `02-mobile-ask.png`
- My Garden baseline: `03-mobile-property.png`
- Plant Journal baseline: `04-mobile-plants.png`
- Weekly Care baseline: `05-mobile-calendar.png`
- Field Guide baseline: `06-mobile-catalogue.png`
- Ask after accessibility fixes: `ask-mobile-after-a11y.png`
- My Garden after accessibility fixes: `property-mobile-after-a11y.png`
- Plant Journal after accessibility fixes: `plants-mobile-after-a11y.png`
- Weekly Care after accessibility fixes: `calendar-mobile-after-a11y.png`
- Field Guide after accessibility fixes: `catalogue-mobile-after-a11y.png`

## Findings

- Mobile layout at 390x844 has no horizontal overflow on Ask, My Garden, Plant Journal, Weekly Care, or Field Guide.
- Ask keeps the homepage promise compact: quick note/photo input, simple helper text, and direct next actions.
- Plant Journal now reads like a botanical notebook on mobile, with visible plate-style plant images and compact cards.
- My Garden, Weekly Care, and Field Guide stack cleanly without clipped text or overlapping controls.

## Changes

- Added an `aria-label` to the Ask photo file input and gave the visible photo label a `:focus-within` outline so keyboard focus lands on something the user can see.
- Added a visible focus outline to Ask shortcut buttons.
- Changed Plant Journal card buttons away from `display: contents` so each plant card has a real visible 84px focus/target box.
- Increased My Garden zone headers to a 28px minimum height so their tap/focus target is not cramped.
- Marked the hidden app rail as `hidden aria-hidden="true"` in both sample and signed-in app shells so dormant controls stay out of interaction and accessibility audits.

## Evidence

- `tabbable-audit-after-rail-fix.json` shows no unresolved hidden or undersized controls across the five mobile sample routes.
- Visual spot checks confirmed Ask, My Garden, and Plant Journal still fit the garden-journal style after the accessibility changes.
- Browser screenshots were saved after the fixes for all five sample routes.

## Verification

- Focused tests passed from the website package: 3 files, 29 tests.
- Full `npm test` passed from the website package: 23 files, 132 tests.
- `npm run build` passed from the website package.
- `git diff --check` passed.

## Limits

- Actual Tab key simulation in the in-app browser did not move focus beyond `body`, so the keyboard pass used DOM/static tabbable evidence, CSS/source checks, and visual screenshots. A real manual keyboard walkthrough in a regular browser remains the last validation item before claiming the full app simplification goal complete.
- Mobile screenshot coverage used a 390x844 viewport.
