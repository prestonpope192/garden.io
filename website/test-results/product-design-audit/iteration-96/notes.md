# Product Design Audit Iteration 96

Scope: simplify the editable Garden Map drawer so Details reads as a calm summary first, with heavier management controls tucked away.

Capture status: no new screenshots were captured in this pass. Browser and Chrome capture are not exposed in this environment, and Playwright fallback still requires explicit user approval. Validation used source inspection, component rendering tests, production build, and rendered route HTML from `http://localhost:3020`.

## What Changed

- Details now starts with a compact summary block for the selected area, bed, or plant.
- Plant details now show the plant name, where it lives, current status, and the next care item before the detail table.
- Area and bed details now show a short count summary and the next care item before secondary facts.
- Edit, move, and remove controls are now grouped under `Change this ...` instead of being equally prominent in the default Details state.
- The main edit button now says `Edit details` instead of just `Edit`.
- Drawer styling now includes a clearer summary block, next-care callout, status pill, and management disclosure spacing.

## Product Design Read

Step 1, Garden Map default property guide: healthy. The broad property guide still centers on what needs attention.

Step 2, selected plant Details drawer: improved. The first read is now the plant, location, status, and next care item rather than a flat list of controls.

Step 3, selected area/bed Details drawer: improved. Counts and next care now appear before lower-level facts.

Step 4, management actions: improved. Edit/move/remove remain available, but they no longer dominate the read state.

Step 5, destructive flow: healthy. Existing remove confirmation copy and safer `Keep ...` / `Remove ...` actions still remain in place.

Step 6, public and signed-out routes: healthy. No stale-copy regression found in rendered route HTML.

## Verification

- `npm test -- empty-state-content.test.ts sample-garden.test.ts garden-mutation-copy.test.ts`: 3 files, 16 tests passed.
- `npm test`: 17 files, 82 tests passed.
- `git diff --check`: passed.
- `npm run build`: passed.
- Rendered-route scan: passed for 13 routes at `http://localhost:3020` with no hits for old labels such as `Overview`, `Tasks`, `Next steps`, `Actions`, `Delete this`, `Mark finished`, `Return to growing`, `Due soon`, or prior first-run/empty-state copy.

## Remaining Risk

- Screenshot evidence is still limited because no approved screenshot capture path is available in this environment.
- Protected signed-in app states still rely primarily on component rendering tests without a real signed-in browser session.
- Next pass should audit the Log tab and quick-save flow for whether adding notes, plant checks, and area/bed/plant creation feel like one coherent workflow.
