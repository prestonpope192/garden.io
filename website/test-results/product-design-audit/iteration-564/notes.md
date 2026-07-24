# Iteration 564 Notes

Scope: make the public tour and signed-in app shell feel like one coherent garden journal instead of isolated route pages.

## Captures

- Baseline route evidence: `route-evidence.json`
- Baseline screenshots: `home.png`, `tour-ask.png`, `tour-property.png`, `tour-calendar.png`, `tour-plants.png`, `tour-catalogue.png`, `app-entry.png`
- After navigation fix: `desktop-plants-after-nav.png`, `desktop-calendar-after-nav.png`, `mobile-plants-after-nav.png`
- Navigation evidence: `nav-evidence-after.json`

## Finding

- The tour pages were clean individually, but once a visitor left Today, the header only offered `Garden.io`, `Today`, and `Start your garden`.
- That made the no-account tour feel like disconnected pages rather than a simple app flow.

## Change

- Added a shared garden-section nav to both `GardenAppPreview` and the signed-in `GardenApp` shell:
  - Today
  - My Garden
  - Weekly care
  - Plant Journal
  - Field Guide
- Added `aria-current="page"` and `.is-active` on the current section.
- Kept the nav compact on mobile with a five-column row.
- Updated tests so the tour protects the complete section nav while still rejecting old generic labels like `This Week`, `Plants`, and `Find`.

## Evidence

- Browser route check on `/tour/plants` found all five links, active `Plant Journal`, `aria-current="page"`, no horizontal overflow, and a 73px desktop header.
- Browser route check on `/tour/calendar` found active `Weekly care`, no horizontal overflow, and a 73px desktop header.
- Mobile browser check on `/tour/plants` found all five links, 32px-high nav targets, active `Plant Journal`, no horizontal overflow, and an 88px header.
- Visual screenshots confirmed the navigation fits the folio header on desktop and mobile without covering content.

## Verification

- Focused tests passed from the website package: 4 files, 34 tests.
- Full `npm test` passed from the website package: 23 files, 132 tests.
- `npm run build` passed from the website package.
- `git diff --check` passed.

## Limit

- This pass improves route-to-route flow and active-state clarity. It does not complete the larger goal; a full manual keyboard walkthrough and broader signed-in state QA remain before the active goal can be marked complete.
