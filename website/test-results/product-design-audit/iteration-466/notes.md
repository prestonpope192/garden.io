# Iteration 466 - Plant Journal Start Point

Date: 2026-06-24
Route checked: `http://127.0.0.1:3021/sample-garden/plants`

## Audit Read

The Plant Journal default drawer had a useful intent but vague wording: `Start with the next check, or open any plant.` The plant list already knows which plant has the first care item, so the drawer can be more direct and easier to act on.

## Change

- Changed the Plant Journal default drawer from `Start with the next check, or open any plant.` to a named start point: `Start with Bell Pepper. Open any plant when you want its notes.`
- Implemented the copy dynamically, using the first plant with care due soon rather than hard-coding the demo plant.
- Updated sample-garden and empty-state tests to protect the named-plant guidance and keep the older next-check phrasing out.

## Evidence

- Live route-output probe for `/sample-garden/plants` found `Plant Journal`, `4 plants in 3 beds. Start with Bell Pepper. Open any plant when you want its notes.`, and `4 plants to check this week.`
- Focused tests passed from the website package: `sample-garden.test.ts` and `empty-state-content.test.ts` - 2 files, 21 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limit

Browser screenshot capture was not used. This pass used source inspection, server-rendered route text, focused tests, full tests, and build verification.
