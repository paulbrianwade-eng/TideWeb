---
name: TIDE exercise-id uniqueness invariant
description: Why every exercise id in TIDE's routine.ts must be globally unique
---

# TIDE: exercise ids must be globally unique across the whole week

`artifacts/tide` keys completion checks (`checks[exercise.id]`) and weight logs (`tide_loads_v1`, keyed by exercise id) **globally**, not per-day. Two exercises sharing an `id` anywhere in `routine.ts` would share check/load state.

**How to apply:** after any routine data swap, verify no duplicate ids:
`rg -o "id: '[a-z]-[a-z0-9-]+'" routine.ts | sort | uniq -d` (empty = OK).

The `Day`/`Card`/`Block`/`Exercise` interfaces live at the top of `routine.ts`; incoming routine files are plain JS with the identical shape, so a swap = keep the interface header + `export const week: Day[] = [...]`, paste the new array. `loads.ts:isWeightedExercise` matches by exercise **name keywords / `target` containing "kg"**, never by id, so new ids are safe.
