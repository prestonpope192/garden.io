# Product Design Audit Iteration 189

Scope: make public catalogue actions point to the user's decision, not generic page viewing.

## Change

- `View plant` -> `Check fit`
- `Plant details` -> `Check fit`
- `aria-label="Plant details"` -> `aria-label="Plant fit"`

## Rationale

The catalogue's job is not just to show plant pages. It helps the gardener answer, "Does this plant fit my bed, container, sun, water, and space?" The shorter `Check fit` label keeps the browse flow tied to that decision.

## Verification

- `npm test -- catalogue-format.test.ts public-catalogue-content.test.ts` passed from `website/`: 2 files, 15 tests.
- `npm test` passed from `website/`: 18 files, 93 tests.
- `npm run build` passed from `website/`.
- `git diff --check` passed from the repo root.
- Rendered `/catalog` contained:
  - `Check fit`
  - `Find plants that fit your garden`
- Rendered `/catalog` did not contain:
  - `View plant`
  - `Plant details`
- Rendered `/catalog/french-marigold` contained `Choose the right spot`.
- Rendered `/catalog/french-marigold` did not contain `View plant` or `Plant details`.

## Evidence Limits

- No Playwright screenshot pass was run because Product Design browser-driving requires explicit approval in this thread.
- The authenticated signed-in app still needs browser-backed visual QA.
