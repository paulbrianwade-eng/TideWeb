---
name: Routine replacement policy
description: Preserving user history when importing replacement training programming
---

Import the approved training programming into the existing TIDE app rather than replacing the app with an uploaded standalone scaffold. Treat a different routine as a separate cycle even when its start date matches the previous routine.

**Why:** The user explicitly chose to preserve training history and existing app functions. The supplied HYROX/contrast ZIP used an older storage version that returned empty state for newer saved data, and its README described a different weekly schedule than its program code. The user approved integrating the code's programming.

**How to apply:** Preserve original historical dates, set keys, and loads; isolate replacement routine identities. Compare source code rather than trusting stale README claims. Do not copy uploaded storage or assume matching calendar dates imply matching workouts.

For V8, the user approved an incremental update, not another calendar reset. Preserve the saved start date, existing calendar and profile; apply changed prescriptions only to future unstarted sessions and keep already-started definitions fixed. Uploaded reference screenshots contain illustrative numbers, never training records. The race date must be configurable, not inferred from the screenshot.

**Why:** The approved V8 specification explicitly prohibits resets, retrospective edits and invented results, and defines export as the primary external Coach workflow rather than an automatic ChatGPT or Garmin connection.

The user later approved integrating the supplied four-week Base/Carga/Pico/Reset + Benchmark routine from the device's local current date, preserving history and profile. Treat source load targets as estimates, never as actual session results; in TIDE's existing 16-week calendar, repeat the four-week sequence four times.

**Why:** This was the user's explicit choice for the new routine, distinct from the earlier V8-only incremental update.

**How to apply:** Keep old session IDs and records intact, use a distinct plan identity for the new cycle, and switch the active calendar only after the user confirms in the app.