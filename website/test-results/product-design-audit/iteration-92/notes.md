# Product Design Audit Iteration 92

Scope: continue simplifying secondary controls in the public catalogue, signed-in Plant Guide, and Plants view. The target was copy that still sounded like interface mechanics instead of a gardener narrowing choices.

Capture status: no new screenshots were captured in this pass. Browser and Chrome capture are not exposed in this environment, and Playwright fallback still requires explicit user approval. Validation used source inspection, component rendering tests, production build, and rendered route HTML from `http://127.0.0.1:3020`.

## What Changed

- Public catalogue summary now says `Browsing` and `All plants`.
- Public catalogue action now says `Narrow choices` instead of `Filter plants`.
- Public catalogue reset now says `Show all plants` instead of `Clear filters`.
- Public catalogue links now say `Read care guide`, `Read guide`, and `Read full guide` instead of view/open phrasing.
- Public catalogue load-more text now says `{n} of {m} plants shown.`
- Signed-in Plant Guide uses the same `Browsing`, `All plants`, and `Narrow choices` language.
- Signed-in Plant Guide plant-type control is now labeled as choosing plant type instead of filtering by plant type.
- Plants view filter drawer now uses `Narrow plants`, `Hide choices`, and `Show all plants`.
- Empty filtered Plants state now says `No plants match that yet.`

## Product Design Read

Step 1, homepage hero: healthy. No regression found.

Step 2, homepage value sections: healthy. No regression found.

Step 3, public catalogue browse: improved. Controls now describe the user's job of narrowing choices and reading care guidance.

Step 4, public catalogue search/results: improved. Empty and load-more states avoid internal filter language.

Step 5, public plant detail: unchanged in this pass and still healthy from prior checks.

Step 6, app entry/sign-in gate: unchanged in this pass and still healthy from prior checks.

Step 7, signed-in Plant Guide: improved through component rendering coverage. The protected route renders the auth gate in route HTML, so this remains test-verified rather than screenshot-verified.

Step 8, Plants view controls: improved. The filter drawer and reset controls now use calmer user-facing labels.

## Verification

- `npm test -- catalogue-format.test.ts public-catalogue-content.test.ts sample-garden.test.ts empty-state-content.test.ts homepage-content.test.ts`: 5 files, 29 tests passed.
- `npm test`: 17 files, 81 tests passed.
- `git diff --check`: passed.
- `npm run build`: passed.
- Rendered-route scan: passed for 13 routes.

## Remaining Risk

- Screenshot evidence is still limited because no approved screenshot capture path is available in this environment.
- Protected `/app/*` pages still render the auth gate in route HTML without a signed-in session, so signed-in states rely on component rendering tests.
- Next pass should audit the remaining action/status language in the app shell and mutation notices, including `Task added`, `Task completed`, `Save for later`, `Add to bed`, and auth copy like `Open it on this device`.
