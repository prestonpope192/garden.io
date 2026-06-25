# Product Design Audit Iteration 372

Date: 2026-06-24
Surface: Public catalogue and plant detail pages

## Objective

Continue simplifying Garden.io by removing visible taxonomy/data-field language from public plant-selection surfaces.

## Finding

The public plant detail page rendered `Lifecycle Annual` in the `Watch this season` facts. The catalogue side preview also used `Lifecycle` and `Type`.

Annual/perennial is useful, but the `Lifecycle` label feels more like a database field than a quick gardener-facing fact. The same surface already uses `Kind`, so `Type` was also slightly less consistent than it needed to be.

## Changes

- Changed public plant detail label `Lifecycle` to `Grows as`.
- Changed public catalogue side preview label `Lifecycle` to `Grows as`.
- Changed public catalogue side preview label `Type` to `Kind`.
- Updated public catalogue tests to require `Grows as` and reject the old `Lifecycle` label.

## Evidence

- Focused tests passed: `npm test -- public-catalogue-content.test.ts catalogue-format.test.ts`
- Full tests passed: `npm test` with 23 files and 130 tests.
- Production build passed: `npm run build`.
- Whitespace check passed: `git diff --check`.
- Live route probe against `http://127.0.0.1:3021/catalog/french-marigold` returned `200`.
- Live route probe confirmed `hasGrowsAs: true` and `hasLifecycle: false`.
- Tight source scan found no remaining visible `<dt>Lifecycle</dt>`, `label: "Lifecycle"`, or `<dt>Type</dt>` in public catalogue sources outside the intended negative test.

## Remaining Risk

- Screenshot capture was not available in this session, so visual spacing and line wrapping for the changed labels were verified indirectly through tests, build, and live route text only.
- The side preview label change is in a client component; the static live `/catalog` HTML does not expose the interactive preview state without browser interaction.
