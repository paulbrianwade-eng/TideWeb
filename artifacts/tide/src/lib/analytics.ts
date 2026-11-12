import type { SessionSummary, Workout, WorkoutSession } from '../types';
import type { HybridResult } from '../types/hybrid';
import { plannedSets, setKey } from './prescription';
import { hybridComparableKey } from './hybrid';

/** Unknown / non-numeric loads are not treated as zero kilograms. */
export const recordedNumber = (value: unknown): number | undefined => {
  if (typeof value !== 'number' && typeof value !== 'string') return undefined;
  if (typeof value === 'string' && !/^\d+(?:[.,]\d+)?$/.test(value.trim())) return undefined;
  const result = Number(typeof value === 'string' ? value.replace(',', '.') : value);
  return Number.isFinite(result) && result >= 0 ? result : undefined;
};

export const actualSessionStats = (session?: WorkoutSession, workout?: Workout) => {
  const sets = Object.values(session?.sets ?? {}).flat().filter((set) => set.done);
  const volumeEntries = sets.flatMap((set) => {
    const load = recordedNumber(set.load);
    const reps = recordedNumber(set.reps);
    return load === undefined || reps === undefined ? [] : [load * reps];
  });
  const completedBlockIds = (workout?.blocks ?? []).filter((block) => {
    if (session?.completedBlocks?.includes(block.id)) return true;
    if (session?.transitions?.[block.id]) return true;
    const result = session?.hybridResults?.[block.id];
    if (result) return result.status === 'finished' && !result.dnf;
    const items = block.items.map((item, index) => ({ item, index }))
      .filter(({ item }) => !block.choiceLabel || item.order === session?.choices?.[block.id]);
    return items.length > 0 && items.every(({ item, index }) => {
      const entries = session?.sets[setKey(block.id, item.exerciseId, index)] ?? [];
      const required = plannedSets(item, block);
      return entries.length >= required && entries.slice(0, required).every((entry) => entry.done);
    });
  }).map((block) => block.id);
  return {
    setsCompleted: sets.length,
    volumeKg: volumeEntries.length ? volumeEntries.reduce((sum, value) => sum + value, 0) : undefined,
    volumeRecordedSets: volumeEntries.length,
    completedBlockIds,
  };
};

/** Conservative: every item needs an explicit load, including 0 / "sin carga".
 * Empty loads, "confirmar kg", "misma barra" and other prescriptions are unknown,
 * not a pair of equal measured values. Numeric-only entries use the app's kg unit.
 */
export const hasSpecifiedHybridLoads = (result: HybridResult): boolean =>
  result.definition.items.length > 0 && result.definition.items.every((item) => {
    const load = item.load?.trim();
    if (!load) return false;
    return /^(?:\d+(?:[.,]\d+)?(?:\s*(?:kg|lbs?))?|(?:\d+\s*[x×]\s*)?\d+(?:[.,]\d+)?\s*(?:kg|lbs?)(?:\s*(?:c\/u|por mano|cada una))?|sin carga|peso corporal|bodyweight|bw)$/i.test(load);
  });

/** No benchmark claims across different prescriptions, loads, caps or substitutions. */
export const exactHybridMatch = (a: HybridResult, b: HybridResult): boolean =>
  hasSpecifiedHybridLoads(a) && hasSpecifiedHybridLoads(b) &&
  hybridComparableKey(a) === hybridComparableKey(b);

/** Only recorded timestamps/duration may initialize closure; never a generated plan.
 * A summary without its real session cannot supply a new session's initial duration.
 */
export const initialSessionDurationMin = (
  session?: WorkoutSession, summary?: SessionSummary, now = Date.now(),
): number | undefined => {
  if (!session) return undefined;
  if (summary && Number.isFinite(summary.durationMin) && summary.durationMin > 0) return summary.durationMin;
  const end = session.completedAt ?? now;
  if (Number.isFinite(session.startedAt) && session.startedAt > 0 && Number.isFinite(end) && end > session.startedAt)
    return Math.round((end - session.startedAt) / 6000) / 10;
  return Number.isFinite(session.elapsedMs) && session.elapsedMs > 0 ?
    Math.round(session.elapsedMs / 6000) / 10 : undefined;
};

export const hybridStats = (result: HybridResult) => {
  const splits = result.splits.map((split) => split.splitSec).filter((sec) => Number.isFinite(sec) && sec > 0);
  return {
    rounds: result.completedRounds,
    partialReps: result.partialReps,
    activeSeconds: result.activeElapsedSec,
    pausedSeconds: result.pausedSec,
    fastestRoundSec: splits.length ? Math.min(...splits) : undefined,
    averageRoundSec: splits.length ? splits.reduce((sum, sec) => sum + sec, 0) / splits.length : undefined,
    pacingDropSec: splits.length >= 2 ? splits[splits.length - 1] - splits[0] : undefined,
  };
};
