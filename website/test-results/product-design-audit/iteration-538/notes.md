# Iteration 538 - Sample Garden Action Notices

Scope: make read-only sample garden action notices sound like a clear invitation instead of a mechanical save warning.

Changed:
- Changed the reusable sample action notice from `Start your garden to {action}.` to `Start your garden, then you can {action}.`
- Changed note-related sample actions from `save this note with the right plant` to `keep this note with the right plant`.
- Changed the weekly care edit notice from `change this care in your garden` to `update this care note`.
- Removed repetitive `in your garden` phrasing from weekly care deletion notices.
- Updated sample-garden tests to require the cleaner notice shape and reject the older awkward phrases.

Evidence:
- Used Product Design audit guidance, Product Design user-context preflight, session budget guidance, current source, focused tests, and Garden.io brand memory.
- Source inspection showed the sample app already frames itself around starting a real garden, but action notices still produced awkward strings like `Start your garden to change this care in your garden.`
- Focused tests passed from the website package: `sample-garden.test.ts`, `quick-log-content.test.ts`, and `ai-first-garden-home.test.tsx` - 3 files, 20 tests.
- Source scan confirms the older sample notice strings are gone from `garden-app-preview.tsx`.

Verification:
- Focused tests passed from the website package: 3 files, 20 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

Limit:
- Direct browser screenshot capture was not available in this run, so this pass used source/test verification before broader checks.
