# Iteration 577 Today composer disabled-state pass

Scope: continue the clean/simple application goal by checking the core Today flow: a gardener notices something, starts a note, and asks what helps.

Findings:
- The empty Today composer previously showed the final action label, `See what helps`, while the button was disabled. That left the user to infer why the action was unavailable.
- The browser-controlled typing/click path in this environment changed raw DOM values but did not trigger React state, so that interaction result is recorded as a tooling limitation rather than product-failure evidence.
- The checked Today composer state had no forbidden beta/prototype/waitlist/Field Guide/developer-facing copy, no horizontal overflow, and no small visible targets.

Changed:
- The Today composer submit button now says `Add a note first` until the user has added note text or a photo.
- Once a note or photo exists, the same button returns to `See what helps`; while loading, it still says `Looking closely...`.
- Suggested note chips now focus the note field after filling it, so the user can keep typing or submit from the same place.
- Updated regression tests for the clearer empty-state button copy and prompt-focus behavior.

Evidence:
- `today-composer-after.json` records the post-fix Today composer state: disabled submit button label is `Add a note first`, suggested note chips are 48px tall, no small targets, no overflow, and no forbidden copy.

Verification:
- Focused Today/sample tests passed: 3 files, 20 tests.
- Full `npm test` passed: 24 files, 135 tests.
- `npm run build` passed.
- `git diff --check` passed.

Limit:
- This pass improves the local tour Today composer. The overall active goal should remain open because authenticated live-data states and full signed-in keyboard traversal are still not proven.
