# Product Design Audit Iteration 93

Scope: continue simplifying mutation, status, and confirmation copy so the app speaks in gardener outcomes instead of generic task/app events.

Capture status: no new screenshots were captured in this pass. Browser and Chrome capture are not exposed in this environment, and Playwright fallback still requires explicit user approval. Validation used source inspection, component rendering tests, production build, and rendered route HTML from `http://127.0.0.1:3020`.

## What Changed

- Care-list feedback now says `Added to your care list`, `Marked done`, `Back on your care list`, `Care item updated`, and `Removed from your care list`.
- Plant idea feedback now says `Saved as a plant idea` and `Removed from plant ideas`.
- Plant save feedback now says `Plant added to your garden. Add a note when something changes.`
- Note feedback now says `Note saved to your garden.`
- Result feedback now says `Result saved to this plant.`
- Signed-in Plant Guide actions now say `Plant in a bed` and `Save as idea`.
- Catalogue card helper copy now says a plant can be planted now or saved as an idea.
- Auth sent-link copy now says `Use it to open your garden here` instead of `Open it on this device`.
- Auth value copy now says `what needs care next` instead of `care tasks`.

## Product Design Read

Step 1, homepage hero: healthy. No regression found.

Step 2, homepage value sections: healthy. No regression found.

Step 3, public catalogue browse: healthy. Prior browse/narrow/read improvements held.

Step 4, public catalogue detail: improved. The garden-start prompt now connects plant notes, photos, weather, and what needs care next.

Step 5, app entry/sign-in gate: improved. The sent-link instruction is clearer and less device-mechanical.

Step 6, signed-in Plant Guide: improved through component/source coverage. Actions now describe planting in a bed or saving an idea.

Step 7, care list actions: improved. Mutation feedback now matches the user-facing `care list` language.

Step 8, plant notes/results/ideas: improved. Feedback now tells the user where the thing went.

## Verification

- `npm test -- garden-mutation-copy.test.ts auth-gate-content.test.ts sample-garden.test.ts catalogue-format.test.ts empty-state-content.test.ts`: 5 files, 27 tests passed.
- `npm test`: 17 files, 81 tests passed.
- `git diff --check`: passed.
- `npm run build`: passed.
- Rendered-route scan: passed for 13 routes after restarting the local server on `3020`.

## Remaining Risk

- Screenshot evidence is still limited because no approved screenshot capture path is available in this environment.
- The auth sent-link state is component-test verified rather than route-HTML verified because `/app` does not render the sent state by default.
- Protected signed-in app states still rely primarily on component rendering tests without a real signed-in browser session.
- Next pass should audit destructive/undo-adjacent copy such as delete confirmations, `Keep it`, `Delete`, `Mark finished`, `Return to growing`, and whether those labels feel safe enough for ordinary gardeners.
