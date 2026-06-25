# Product Design Audit Iteration 568

Date: 2026-06-24

## Objective

Continue the homepage/app simplification pass with user-facing copy, calmer notebook-style presentation, and real botanical plant imagery.

## Changes

- Reworked the homepage hero promise to: `Track changes. Ask what they mean. Keep answers with each plant.`
- Flattened the homepage hero so it no longer reads as a large marketing card:
  - transparent hero shell
  - bottom rule instead of boxed card chrome
  - retained botanical plate image treatment
- Rewrote the homepage value loop around user needs:
  - remember garden details
  - ask with plant/place/season context
  - keep useful answers as weekly care or plant-journal history
- Updated app entry copy on the ask surface to: `Add a note or photo. Keep what helps for later.`
- Updated sign-in gate copy to explain why starting a garden helps without launch/beta/product language.
- Updated the plant diagnosis panel helper text to match the note/photo context language.
- Updated tests to protect the new simpler copy and flatter hero treatment.

## Visual Evidence

- `final-home-desktop-1280.png`
- `final-home-mobile.png`
- `final-ask-desktop.png`
- `final-ask-mobile.png`

Browser checks:
- 1280px homepage had no horizontal overflow.
- 390px app ask view had no horizontal overflow.
- Hidden 1x1 elements were only accessibility/file-input internals; visible wrappers remain full-size.

## Verification

- `npm test` passed: 24 files, 133 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Remaining Risk

- The in-app browser keyboard Tab simulation did not advance focus, so the keyboard-flow artifact was not reliable. DOM inspection showed valid tabbable controls and visible wrapper controls, but a real OS/browser keyboard audit is still worth doing in a later pass.
- The worktree remains dirty with earlier large simplification changes outside this pass; those were not reverted.
