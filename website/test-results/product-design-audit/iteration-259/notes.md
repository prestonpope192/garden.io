# Iteration 259 - Start Screen Copy

Date: 2026-06-23

Scope: simplify the signed-out Start screen a prospective user sees before creating a garden memory.

## Screenshots

- `screenshots/01-ask-entry-before.png` - current sample Ask entry, used to compare the product promise before sign-in.
- `screenshots/02-start-auth-before.png` - previous signed-out Start screen with the three-step checklist.
- `screenshots/03-start-auth-after.png` - revised Start screen with one garden-memory promise and a clearer email action.

## Finding

- The Ask entry screen already explains the value clearly: ask with a note or photo, then save answers so future questions have more context.
- The signed-out Start screen repeated that idea as a checklist, which made starting feel more procedural than necessary.
- The email action sounded like a generic link flow instead of a way to begin the user's garden memory.

## Changed

- Replaced `Garden help with memory` with `Start your garden`.
- Replaced the three-step checklist with one benefit-led card: `Start with one garden note.`
- Rewrote the support copy around saved notes giving future answers more context.
- Reframed the email prompt as starting and returning to the user's garden.
- Changed the CTA from `Email me the link` to `Email me my garden link`.
- Updated auth content tests to lock out the older checklist and developer/auth-flavored language.

## Result

- The Start screen now gives the user one job: start a garden memory.
- The copy better matches the app promise that saved context makes future answers smarter.
- The form still communicates the practical reassurance: no password needed.

## Evidence

- In-app browser capture at `http://127.0.0.1:3021/app/my-property` confirms the updated Start screen at a 390px viewport.
- DOM verification confirmed the old checklist and `Garden help with memory` label are gone.
- DOM verification confirmed `Email me my garden link` fits the mobile button width.
- Focused tests passed: `auth-gate-content.test.ts`, `auth-magic-link-route.test.ts`, `homepage-content.test.ts`, and `sample-garden.test.ts`, 4 files, 19 tests.
- Full `npm test` passed: 22 files, 120 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Evidence Limits

- This pass covered the signed-out Start screen and static auth states.
- It did not send a real magic link through Supabase.
- Screenshot inspection does not prove full keyboard or screen-reader behavior.
