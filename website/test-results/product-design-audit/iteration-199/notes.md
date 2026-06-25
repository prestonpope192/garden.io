# Iteration 199 - Homepage Plant Check And Sample App Label

Date: 2026-06-22

## Scope

Tighten the homepage's plant-check promise and make the sample app header feel less like a developer demo.

## Changed

- Replaced homepage promise copy from `Check a plant with its history` to `Ask about one plant`.
- Replaced supporting copy with `When something looks off, get a next step based on its notes, bed, photo, and season.`
- Replaced the sample app header label `Example garden` with `Try it first`.
- Updated homepage and sample app regression coverage for the new visible copy.

## Why

- A prospective gardener is trying to solve one immediate problem: "What should I do about this plant?"
- The new homepage wording makes the AI-backed check feel like a simple user action without naming the technology.
- `Try it first` keeps the sample route honest while making it feel like a guided entry point instead of a demo artifact.

## Verification

- Focused tests passed from `website/`: `homepage-content.test.ts` and `sample-garden.test.ts`, 2 files, 13 tests.
- Full `npm test` passed from `website/`: 18 files, 95 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Local route checks returned 200 for `/`, `/sample-garden/property`, `/sample-garden/plants`, `/sample-garden/catalogue`, and `/catalog`.
- Rendered visible-text probes confirmed `/` contains `Ask about one plant`, `When something looks off`, and `get a next step based`.
- Rendered visible-text probes confirmed the sample routes contain `Try it first`.
- Rendered visible-text probes found zero visible matches for `Example garden`, `Sample garden`, `Demo garden`, `Preview garden`, `Check a plant with its history`, `When leaves yellow`, and `the check starts with its notes`.

## Evidence limits

- Product Design Browser/Chrome capture tools were not exposed in this thread; Playwright was not used because explicit approval is required.
- Current proof is source, server-rendered/component tests, build, route checks, and rendered HTML probes.
- Authenticated signed-in visual QA, keyboard flow, screen-reader behavior, successful magic-link delivery, and photo upload still need a reliable browser-backed pass.
