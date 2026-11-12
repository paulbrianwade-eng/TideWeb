import type { Workout, WorkoutSession } from '../types';
import { getExercise } from '../data/exercises';
import { setKey } from './prescription';

const maxLoadByExercise = (workout: Workout, session: WorkoutSession): Record<string, number> => {
  const out: Record<string, number> = {};
  workout.blocks.forEach((block) => {
    block.items.forEach((item, i) => {
      const rows = session.sets[setKey(block.id, item.exerciseId, i)] ?? [];
      rows.forEach((r) => {
        if (!r.done) return;
        const load = Number(r.load);
        if (!Number.isFinite(load) || load <= 0) return;
        out[item.exerciseId] = Math.max(out[item.exerciseId] ?? 0, load);
      });
    });
  });
  return out;
};

/** Compara la sesión actual contra el historial y devuelve un récord si lo hay. */
export const detectRecord = (
  workout: Workout,
  session: WorkoutSession,
  allSessions: Record<string, WorkoutSession>,
  program: Workout[],
): string | null => {
  const current = maxLoadByExercise(workout, session);
  const previous: Record<string, number> = {};

  Object.values(allSessions).forEach((s) => {
    if (s.workoutId === session.workoutId) return;
    const w = program.find((x) => x.id === s.workoutId);
    if (!w) return;
    const m = maxLoadByExercise(w, s);
    Object.entries(m).forEach(([id, v]) => {
      previous[id] = Math.max(previous[id] ?? 0, v);
    });
  });

  let best: { id: string; delta: number; value: number } | null = null;
  Object.entries(current).forEach(([id, value]) => {
    const prev = previous[id];
    if (prev === undefined || value <= prev) return;
    const delta = value - prev;
    if (!best || delta > best.delta) best = { id, delta, value };
  });

  if (!best) return null;
  const rec = best as { id: string; delta: number; value: number };
  return `${getExercise(rec.id).name} · ${rec.value} kg (+${rec.delta} kg)`;
};

export const highlightExercise = (workout: Workout, session: WorkoutSession): string | null => {
  const loads = maxLoadByExercise(workout, session);
  const entries = Object.entries(loads);
  if (entries.length === 0) return null;
  const top = entries.sort((a, b) => b[1] - a[1])[0];
  return `${getExercise(top[0]).name} · ${top[1]} kg`;
};
