# Iteration 414 - Garden Check Prompt

Date: 2026-06-24
Route checked: `http://127.0.0.1:3021/sample-garden/ask`

## Scope

Make the Garden Check entry feel like a plain gardener-facing prompt instead of an abstract product sentence.

## Change

- Changed the shared Garden Check subtitle from `Describe what changed. Save the care it needs.` to `What changed in your garden?`.
- Changed the visible Garden Check composer lead to `What changed in your garden?`.
- Changed the hidden textarea label to `Garden note or photo description` so screen-reader text does not repeat the visible question.
- Updated sample and Garden Check tests to require the new prompt, require the hidden field label, reject the old sentence, and guard that the visible question appears once in rendered markup.

## Rationale

`Describe what changed. Save the care it needs.` made the user think through product mechanics before typing. `What changed in your garden?` is a simpler first action: notice something, write it down, then use the saved notes and plant/bed context.

## Evidence

- `npm test -- sample-garden.test.ts ai-first-garden-home.test.tsx` passed from the website package: 2 files, 18 tests.
- Live `/sample-garden/ask` route-output probe found `What changed in your garden?` once, found `Garden note or photo description`, and did not find `Describe what changed. Save the care it needs.`
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed from the website package.
- `git diff --check` passed.

## Limit

Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, Codex app capture was blocked by safety policy for `com.openai.codex`, and Playwright fallback requires explicit permission under the Product Design rules.
