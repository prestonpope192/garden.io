# Iteration 87 - Garden Map copy cleanup

Current-state finding:
- The Garden Map flow had the right basic structure, but a few labels still made setup and plant details feel like stored records instead of a gardener's working memory.
- Remaining examples included `Create my garden`, `Field note`, raw plant status values like `growing`, `No open tasks here`, and plant removal copy that said it removes `history`.
- The sample Garden Map needed to prove the read-only experience showed clean plant status and note language without exposing edit/remove controls.

Changes implemented:
- Replaced the first-run CTA:
  - `Create my garden` -> `Start my garden`
  - saving state `Creating...` -> `Saving...`
- Added a small plant status formatter so the drawer shows:
  - `Growing`
  - `Past`
  instead of raw stored status values.
- Replaced `Field note` with `Notes` in the Garden Map drawer.
- Replaced `No open tasks here.` with `No tasks here right now.`
- Rewrote plant removal confirmation from `This also removes its history` to `Its notes, tasks, and results will be removed too.`
- Extended first-run and sample Garden Map tests to cover the cleaner CTA, note label, and formatted plant status.

Updated health after implementation:
- First garden setup: improved. The CTA now matches the user's goal of starting a garden, not creating a record.
- Selected plant drawer: improved. Plant status is user-facing and notes are labeled plainly.
- Task empty state: improved. It now sounds like a calm state rather than a database filter state.
- Destructive plant copy: improved. It tells the user exactly what they lose: notes, tasks, and results.

Evidence:
- Product Design user-context preflight ran; no saved context exists, so this pass used the current app as source of truth.
- Focused tests passed: `empty-state-content.test.ts`, `sample-garden.test.ts`, and `garden-mutation-copy.test.ts`, 3 files, 13 tests.
- Full `npm test` passed: 17 test files, 78 tests.
- `npm run build` passed with Next.js production build.
- `git diff --check` passed.
- Rendered route scan confirmed `/`, `/sample-garden`, `/sample-garden/property`, `/sample-garden/plants`, `/sample-garden/calendar`, `/sample-garden/catalogue`, `/catalog`, `/catalog/french-marigold`, `/app`, `/app/my-property`, `/app/my-plants`, and `/app/calendar` returned `200`.
- The rendered route scan found no hits for `Create my garden`, `Creating...`, `Field note`, `This also removes its history`, `No open tasks here`, old guide phrases, old homepage copy, early access, waitlist, working-product language, or product-facing homepage terms.
- Source scan found old Garden Map/homepage/guide phrases only in negative test assertions.

Evidence limits:
- No accepted screenshots were captured in this pass. Browser screenshot capture remains unavailable in this environment without using Playwright, and the Product Design skill requires asking before using Playwright as fallback.
- `/app/my-property` route-level rendering is the signed-out auth gate without a session, so first-run Garden Map evidence is from component tests rather than a live authenticated route.
- Authenticated signed-in visual QA, keyboard flow, screen-reader behavior, successful magic-link delivery, and photo upload still need a reliable browser-backed pass.
