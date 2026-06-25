# Product Design Audit Iteration 95

Scope: simplify first-run setup, empty states, and care-list language so the app points users to the smallest useful next action.

Capture status: no new screenshots were captured in this pass. Browser and Chrome capture are not exposed in this environment, and Playwright fallback still requires explicit user approval. Validation used source inspection, component rendering tests, production build, and rendered route HTML from `http://localhost:3020`.

## What Changed

- First garden setup now says `Give it a name. Add one area, one bed, and one plant next.`
- First garden optional section now says `Add where you garden (optional)` instead of `Add location and season`.
- First garden submit now says `Save garden` instead of `Start my garden`.
- Property guide now says users can choose a place to see what happened there and what needs care next.
- Empty Plants state now says to add one plant, then save notes, photos, and what needs care next.
- Empty Calendar now distinguishes between no plants and an empty care list:
  - no plants: add one plant first.
  - plants present: nothing is on the care list yet.
- Care-list forms now use `What needs doing?`, `When`, and `Add a care item`.
- Plant urgency badges now say `Care soon` / `Care overdue` instead of `Due soon` / `Overdue`.
- Mutation feedback now uses `Add one area`, `Add one bed`, `Add one plant`, and `Plant saved to your garden`.

## Product Design Read

Step 1, first garden setup: improved. The form asks for one visible thing and tells the user the next three garden steps without product jargon.

Step 2, empty Plants state: improved. It now describes the user's immediate action and why it matters.

Step 3, empty Calendar with no plants: improved. It tells the user to add one plant before expecting care tracking.

Step 4, empty Calendar with plants but no care list: improved. It no longer wrongly tells the user to add a plant.

Step 5, sample Garden Map: improved. The guide now centers on seeing what happened and what needs care next.

Step 6, plant urgency labels: improved. The badge language now reads like garden care rather than task software.

Step 7, public and signed-out routes: healthy. No stale-copy regression found in rendered route HTML.

## Verification

- `npm test -- empty-state-content.test.ts sample-garden.test.ts garden-mutation-copy.test.ts`: 3 files, 16 tests passed.
- `npm test`: 17 files, 82 tests passed.
- `git diff --check`: passed.
- `npm run build`: passed.
- Rendered-route scan: passed for 13 routes at `http://localhost:3020` with no hits for old labels such as `Name it first`, `Start my garden`, `Add location and season`, `Add something to do`, `No tasks on this day`, `Due soon`, `Plant added to your garden`, or destructive/status copy from earlier passes.

## Remaining Risk

- Screenshot evidence is still limited because no approved screenshot capture path is available in this environment.
- Protected signed-in app states still rely primarily on component rendering tests without a real signed-in browser session.
- Next pass should audit visual hierarchy and density inside the editable Garden Map drawer now that the copy is simpler.
