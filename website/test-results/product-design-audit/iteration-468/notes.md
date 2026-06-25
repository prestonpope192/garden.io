# Iteration 468 - App Entry Promise

Date: 2026-06-24
Route checked: `http://127.0.0.1:3021/app/my-property`

## Audit Read

The signed-out app entry and shared app shell still used the generic phrase `what to do next`. The rest of the homepage and sample app have moved toward the more grounded promise: remember what happened and what helped.

## Change

- Changed the app shell tagline from `Remember what happened and what to do next.` to `Remember what happened and what helped.`
- Changed the signed-out app entry copy from `Remember what you planted, what changed, and what to do next in one calm garden notebook.` to `Remember what you planted, what changed, and what helped in one calm garden notebook.`
- Updated homepage and auth-gate tests to protect the grounded `what helped` wording and keep the older generic copy out.

## Evidence

- Live route-output probe for `/app/my-property` found `Your garden, smarter.` and `Remember what you planted, what changed, and what helped in one calm garden notebook.`
- Focused tests passed from the website package: `homepage-content.test.ts` and `auth-gate-content.test.ts` - 2 files, 7 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limit

Browser screenshot capture was not used. This pass used source inspection, server-rendered route text, focused tests, full tests, and build verification.
