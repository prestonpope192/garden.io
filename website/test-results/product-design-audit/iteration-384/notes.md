# Iteration 384 Notes

Date: 2026-06-24

Scope: make the Calendar weekly-care labels shorter and more natural.

Orchestrator mode:
- Kept product judgment, target selection, and final review in the main thread.
- Used bounded parallel tool work for route/source scans and verification.
- Did not spawn subagents because the next improvement was tightly scoped to one component and one test file.

What changed:
- Changed the weekly care section label from `Care this week` to `This week's care`.
- Changed the first task label from `First today` / `First up` to `Today` / `Next`.
- Changed the later task label from `Coming up` plus `2 more this week` to `Later this week` plus `2 more checks`.
- Updated the sample Calendar regression test to require the simpler labels and reject the older ones.

Why:
- The Calendar is a care-list surface. The old labels were understandable but still felt like UI scaffolding.
- The new labels answer the gardener's three-second question more directly: what needs care now, and what can wait until later this week?

Evidence:
- Focused tests passed from `website`: `npm test -- sample-garden.test.ts empty-state-content.test.ts` - 2 files, 21 tests.
- Full tests passed from `website`: `npm test` - 23 files, 130 tests.
- Production build passed from `website`: `npm run build`.
- Whitespace check passed from repo root: `git diff --check`.
- Live `/sample-garden/calendar` returned `200`, contains `This week&#x27;s care`, `Today`, `Later this week`, and `2 more checks`, and no longer contains `First today`, `Coming up`, or `Care this week`.

Limit:
- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, Codex app capture has been blocked by safety policy in this session, and Playwright fallback requires explicit permission under the Product Design rules.
