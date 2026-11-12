import type { AppState, CompletedSet, MetricEntry, Workout, WorkoutSession } from '../types';
import type { HybridResult } from '../types/hybrid';
import { addDays, parseISO } from '../lib/date';
import { getExercise } from '../data/exercises';
import { TOTAL_WEEKS } from '../data/program';
import { hybridComparableKey } from '../lib/hybrid';
import { hasSpecifiedHybridLoads } from '../lib/analytics';
import { FOUR_WEEK_COUNT, FOUR_WEEK_PLAN_ID } from '../data/mesocycle';

/** V8 context actions. Typed as optional so screens degrade gracefully. */
export interface V8Api {
  setSchedule: (workoutId: string, date: string) => boolean;
  swapWorkouts: (idA: string, idB: string) => boolean;
  setSkipped: (id: string, skipped: boolean) => void;
  setPhaseSettings: (s: { names: string[]; deloadWeeks: number[] }) => void;
}
export const v8 = <T extends object>(app: T): T & Partial<V8Api> => app as T & Partial<V8Api>;

export const DEFAULT_PHASE_NAMES = ['FOUNDATION', 'BUILD', 'HYBRID', 'RACE PREP'];
export const DEFAULT_DELOADS = [4, 8, 12, 16];

export const phaseSettingsOf = (state: AppState) => ({
  names: state.phaseSettings?.names?.length === 4 ? state.phaseSettings.names : DEFAULT_PHASE_NAMES,
  deloadWeeks: state.phaseSettings?.deloadWeeks ?? DEFAULT_DELOADS,
});
export const phaseIndex = (week: number, activePlan?: AppState['activePlan']) =>
  activePlan === FOUR_WEEK_PLAN_ID
    ? (week - 1) % FOUR_WEEK_COUNT
    : Math.min(3, Math.max(0, Math.floor((week - 1) / Math.ceil(TOTAL_WEEKS / 4))));

export type DayTag = 'STR' | 'Z2' | 'RUN' | 'HYB' | 'REST' | 'REC';
export const TAG_LABEL: Record<DayTag, string> = {
  STR: 'Fuerza', Z2: 'Zone 2', RUN: 'Running', HYB: 'HYROX', REST: 'Descanso', REC: 'Recuperación',
};
export const TAG_STYLE: Record<DayTag, string> = {
  STR: 'bg-violet-soft text-brand-dark',
  Z2: 'bg-lime-soft text-success',
  RUN: 'bg-sky text-brand',
  HYB: 'bg-success text-white',
  REST: 'bg-mist text-muted',
  REC: 'bg-mist text-muted',
};

export const tagOf = (w: Workout): DayTag => {
  if (w.externalActivity === 'rest' || w.status === 'rest') return 'REST';
  if (w.day === 6) return 'HYB';
  const n = `${w.name} ${w.subtitle}`.toLowerCase();
  if (/zona 2|zone 2|\bz2\b/.test(n)) return 'Z2';
  if (/pasad|run|carrera|interval/.test(n) && !w.blocks.some((b) => b.kind === 'fuerza')) return 'RUN';
  if (/hyrox|h[ií]brid|hybrid/.test(n) && !w.blocks.some((b) => b.kind === 'fuerza')) return 'HYB';
  if (w.blocks.some((b) => b.kind === 'fuerza')) return 'STR';
  if (w.capability === 'Engine') return 'Z2';
  return 'REC';
};
export const isHard = (w: Workout) => ['STR', 'RUN', 'HYB'].includes(tagOf(w));

export type DayState = 'done' | 'skipped' | 'rest' | 'started' | 'missed' | 'today' | 'planned';
export const dayState = (w: Workout, state: AppState, today: string): DayState => {
  if (state.history.some((h) => h.workoutId === w.id)) return 'done';
  if (state.skippedWorkouts?.includes(w.id)) return 'skipped';
  if (tagOf(w) === 'REST') return 'rest';
  if (state.sessions[w.id]) return 'started';
  if (w.date === today) return 'today';
  if (w.date < today) return 'missed';
  return 'planned';
};
export const STATE_LABEL: Record<DayState, string> = {
  done: 'Completado', skipped: 'Omitido', rest: 'Descanso', started: 'En curso', missed: 'Sin registro', today: 'Hoy', planned: 'Programado',
};
export const canMove = (w: Workout, state: AppState) =>
  !state.history.some((h) => h.workoutId === w.id) && !state.sessions[w.id];

/** Pairs of consecutive dates that would both hold hard sessions. */
export const hardAdjacency = (workouts: Workout[]): [Workout, Workout][] => {
  const sorted = [...workouts].sort((a, b) => a.date.localeCompare(b.date));
  const out: [Workout, Workout][] = [];
  for (let i = 1; i < sorted.length; i++) {
    const a = sorted[i - 1]!; const b = sorted[i]!;
    if (addDays(a.date, 1) === b.date && isHard(a) && isHard(b)) out.push([a, b]);
  }
  return out;
};

export const daysUntil = (from: string, to: string) =>
  Math.round((parseISO(to).getTime() - parseISO(from).getTime()) / 86400000);

export const round1 = (n: number) => Math.round(n * 10) / 10;
export const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN);

/** Mean of entries within the 7 days ending on `end` (inclusive). */
export const mean7 = (entries: MetricEntry[], end: string) => {
  const start = addDays(end, -6);
  const win = entries.filter((e) => e.date >= start && e.date <= end);
  return win.length ? { value: round1(mean(win.map((e) => e.value))), n: win.length } : null;
};

export const fmtSec = (s: number) => {
  const t = Math.max(0, Math.round(s));
  const h = Math.floor(t / 3600); const m = Math.floor((t % 3600) / 60); const sec = t % 60;
  const p = (n: number) => String(n).padStart(2, '0');
  return h ? `${h}:${p(m)}:${p(sec)}` : `${m}:${p(sec)}`;
};

/* ── Strength: semantic records from actually logged sets ── */
export const LIFTS: { id: string; label: string; match: RegExp; exclude?: RegExp }[] = [
  { id: 'squat', label: 'Squat', match: /squat|sentadilla/, exclude: /split|bulgar|goblet|jump|pistol|cossack/ },
  { id: 'bench', label: 'Bench Press', match: /bench|press de banca/ },
  { id: 'deadlift', label: 'Deadlift', match: /deadlift|peso muerto|rdl/, exclude: /single|unilateral|kb|kettlebell/ },
  { id: 'ohp', label: 'Overhead Press', match: /overhead|ohp|military|strict press|push press/ },
  { id: 'pullup', label: 'Pull-ups', match: /pull-?up|chin-?up|dominad/ },
];
export interface LiftRecord { lift: string; exercise: string; load: number; reps: number; e1rm: number; date: string; sets: number }
const num = (v?: string) => { const m = v?.replace(',', '.').match(/\d+(\.\d+)?/); return m ? Number(m[0]) : NaN; };

export const strengthRecords = (sessions: Record<string, WorkoutSession>) => {
  const best: Record<string, LiftRecord | undefined> = {};
  const log: LiftRecord[] = [];
  Object.values(sessions).forEach((s) => {
    Object.entries(s.sets).forEach(([key, rows]) => {
      const exId = key.split(':')[1] ?? key;
      const name = (() => { try { return getExercise(exId).name; } catch { return exId; } })();
      const hay = `${exId} ${name}`.toLowerCase();
      const lift = LIFTS.find((l) => l.match.test(hay) && !(l.exclude && l.exclude.test(hay)));
      if (!lift) return;
      (rows as CompletedSet[]).filter((r) => r.done).forEach((r) => {
        const load = num(r.load); const reps = num(r.reps);
        const isPull = lift.id === 'pullup';
        if (!Number.isFinite(reps) || reps <= 0) return;
        if (!isPull && (!Number.isFinite(load) || load <= 0)) return;
        const l = Number.isFinite(load) ? load : 0;
        const rec: LiftRecord = { lift: lift.id, exercise: name, load: l, reps, e1rm: l ? round1(l * (1 + reps / 30)) : 0, date: s.date, sets: 1 };
        log.push(rec);
        const cur = best[lift.id];
        const score = isPull ? reps + l / 10 : rec.e1rm;
        const curScore = cur ? (isPull ? cur.reps + cur.load / 10 : cur.e1rm) : -1;
        if (score > curScore) best[lift.id] = rec;
      });
    });
  });
  return { best, log };
};

/* ── Running: recorded transitions only ── */
export const runningSplits = (sessions: Record<string, WorkoutSession>) =>
  Object.values(sessions)
    .flatMap((s) => Object.values(s.transitions ?? {}).map((t) => ({ ...t, date: s.date, workoutId: s.workoutId })))
    .filter((t) => t.seconds > 0)
    .sort((a, b) => b.date.localeCompare(a.date));

/* ── Hybrid ── */
export const comparableKey = (r: HybridResult): string | undefined =>
  hasSpecifiedHybridLoads(r) ? hybridComparableKey(r) : undefined;
export interface HybridRow { workoutId: string; blockId: string; date: string; title: string; result: HybridResult; key: string;
  score: string; scoreValue: number; higherBetter: boolean; meanSplit?: number; bestSplit?: number; worstSplit?: number; drop?: number }

export const hybridRows = (sessions: Record<string, WorkoutSession>): HybridRow[] =>
  Object.values(sessions).flatMap((s) =>
    Object.entries(s.hybridResults ?? {}).filter(([, r]) => r.status === 'finished').map(([blockId, r]) => {
      const amrap = r.format === 'amrap';
      const splits = r.splits.map((x) => x.splitSec);
      const half = Math.floor(splits.length / 2);
      const drop = splits.length >= 2 ? round1(mean(splits.slice(splits.length - half)) - mean(splits.slice(0, half))) : undefined;
      return {
        workoutId: s.workoutId, blockId, date: s.date, title: r.definition.title, result: r,
        // Missing loads isolate the attempt, rather than grouping two unknowns.
        key: comparableKey(r) ?? JSON.stringify(['not-comparable', s.workoutId, blockId]),
        score: r.dnf ? 'DNF' : amrap ? `${r.completedRounds} + ${r.partialReps}` : fmtSec(r.activeElapsedSec),
        scoreValue: amrap ? r.completedRounds * 1000 + r.partialReps : r.activeElapsedSec,
        higherBetter: amrap,
        meanSplit: splits.length ? mean(splits) : undefined,
        bestSplit: splits.length ? Math.min(...splits) : undefined,
        worstSplit: splits.length ? Math.max(...splits) : undefined,
        drop,
      };
    }),
  ).sort((a, b) => b.date.localeCompare(a.date));
