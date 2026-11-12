import type { WorkoutBlock } from '../types';
import type { HybridResult, HybridEvent } from '../types/hybrid';
import { getExercise } from '../data/exercises';
import { parseRestSeconds } from './set-navigation';

export type { HybridResult } from '../types/hybrid';

/** Serialize acquisition handshakes, not the entire lifetime of a held lock.
 * An aborted/unmounting handshake must settle before a new mount can attempt
 * ifAvailable, otherwise StrictMode can mistake its own old request for a tab.
 */
export const createHybridAcquisitionQueue = () => {
  let pending: Promise<void> = Promise.resolve();
  return <T>(acquire: () => Promise<T>): Promise<T> => {
    const result = pending.then(acquire);
    pending = result.then(() => undefined, () => undefined);
    return result;
  };
};

export interface HybridLockIdentity { timerId: string; label: string; owner: string }
export type HybridLockRequest = (hold: (available: boolean) => Promise<void>) => Promise<void>;

/** Browser-independent coordinator: a request only settles AFTER the host has
 * released the actual lock. An AbortSignal covers pending and acquired leases.
 * The host still decides availability, so genuine other tabs cannot be stolen.
 */
export const createHybridLockCoordinator = ({
  request, claim,
}: {
  request?: HybridLockRequest;
  claim: (identity: HybridLockIdentity) => void;
}) => {
  const enqueue = createHybridAcquisitionQueue();
  let releasing: Promise<void> = Promise.resolve();
  const cancelled = () => new DOMException('Adquisición cancelada', 'AbortError');
  return (identity: HybridLockIdentity, signal: AbortSignal): Promise<() => void> => enqueue(async () => {
    await releasing;
    if (signal.aborted) throw cancelled();
    if (!request) { claim(identity); return () => undefined; }
    return new Promise<() => void>((resolve, reject) => {
      let releaseHold: (() => void) | undefined;
      let acquired = false;
      let failure: unknown;
      let settled: Promise<void>;
      const unlock = () => {
        if (!releaseHold) return;
        const finish = releaseHold;
        releaseHold = undefined;
        releasing = settled.catch(() => undefined);
        finish();
      };
      signal.addEventListener('abort', unlock, { once: true });
      settled = Promise.resolve().then(() => request(async (available) => {
        if (signal.aborted) return;
        if (!available) throw new Error('Un temporizador ya está abierto en otra pestaña. Pausalo o cerrá esa pestaña.');
        await new Promise<void>((done) => {
          releaseHold = done;
          if (signal.aborted) { done(); return; }
          try {
            claim(identity);
            acquired = true;
            resolve(unlock);
          } catch (error) {
            // Do not let the next handshake run before the host releases us.
            failure = error;
            done();
          }
        });
      }));
      void settled.then(() => {
        signal.removeEventListener('abort', unlock);
        if (!acquired) reject(failure ?? cancelled());
      }, (error: unknown) => {
        signal.removeEventListener('abort', unlock);
        reject(error);
      });
    });
  });
};

/** V8 clock policy: background/reload time counts; only explicit pauses are excluded.
 * A backwards wall clock never subtracts already accumulated active time.
 */
export const computeHybridElapsed = (result: HybridResult, now = Date.now()): number =>
  Math.max(0, result.activeElapsedSec) +
  (result.status === 'running' && result.runningSince !== undefined
    ? Math.max(0, now - result.runningSince) / 1000
    : 0);

/** Materialize elapsed only when an event is saved, never at display frequency. */
const checkpoint = (result: HybridResult, now: number): HybridResult => result.status === 'running'
  ? { ...result, activeElapsedSec: computeHybridElapsed(result, now), runningSince: Math.max(result.runningSince ?? now, now) }
  : result;

const canonical = (value: unknown): string => {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object')
    return `{${Object.entries(value).filter(([, v]) => v !== undefined).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${JSON.stringify(k)}:${canonical(v)}`).join(',')}}`;
  return JSON.stringify(value) ?? 'null';
};

/** Full canonical text, not a lossy hash. IDs/dates/titles do not define equivalence.
 * Item sequence, actual substitutions, loads, equipment and all prescription rules do.
 */
export const hybridComparableKey = (result: HybridResult): string => canonical({
  version: result.workoutVersion,
  format: result.format,
  cap: result.targetSec,
  rounds: result.targetRounds,
  work: result.definition.work,
  pause: result.definition.pause,
  rest: result.definition.rest,
  rules: [result.definition.formatLabel, result.definition.focus, result.definition.scoreType, result.definition.scoreHint],
  items: result.definition.items.map((item) => ({
    ...item,
    equipment: getExercise(item.exerciseId).equipment,
  })),
});

export const isHybridBlock = (block: WorkoutBlock): boolean =>
  (block.kind === 'finisher' && ['amrap', 'for-time', 'rounds', 'chipper', 'ladder', 'intervals', 'tabata-express', 'tabata-full'].includes(block.format)) ||
  ((block.format === 'intervals' || (block.kind === 'outdoor' && block.format === 'sets')) &&
    block.items.some((item) => !!item.distance && (block.format === 'intervals' || (item.sets ?? 1) > 1)));

export const isDistanceInterval = (result: HybridResult): boolean =>
  result.format === 'interval' && !result.definition.work && result.definition.items.some((item) => !!item.distance);

export const createHybridResult = (definition: WorkoutBlock, workoutDefinitionId: string): HybridResult => {
  const distanceSets = definition.kind === 'outdoor' && definition.format === 'sets' &&
    definition.items.some((item) => !!item.distance && (item.sets ?? 1) > 1);
  const format: HybridResult['format'] = distanceSets ? 'interval' : definition.format === 'for-time' || definition.format === 'rounds'
    ? definition.rounds ? 'rounds_for_time' : 'for_time'
    : definition.format === 'chipper' ? 'chipper'
      : definition.format === 'ladder' ? 'ladder'
        : ['intervals', 'tabata-express', 'tabata-full'].includes(definition.format) ? 'interval' : 'amrap';
  const timedIntervals = format === 'interval' && !!definition.work;
  const count = (definition.rounds ?? definition.items.find((item) => item.distance)?.sets ?? 1) *
    (definition.format.startsWith('tabata') ? definition.items.length : 1);
  const pause = definition.pause ?? (distanceSets ? parseRestSeconds(definition.items.find((item) => item.distance)?.rest ?? definition.rest) : undefined);
  return {
    workoutDefinitionId, workoutVersion: 8, definition: { ...definition, ...(pause !== undefined ? { pause } : {}) }, format,
    targetSec: definition.capMinutes ? definition.capMinutes * 60
      : timedIntervals ? count * definition.work! + Math.max(0, count - 1) * (definition.pause ?? 0)
        : format === 'amrap' ? definition.minutes * 60 : undefined,
    targetRounds: format === 'rounds_for_time' || format === 'interval' ? count : undefined,
    status: 'idle', activeElapsedSec: 0, pausedSec: 0, splits: [],
    completedRounds: 0, partialReps: 0, events: [],
  };
};

const event = (result: HybridResult, type: string, now: number, extra: Partial<HybridEvent> = {}): HybridEvent =>
  ({ type, at: new Date(now).toISOString(), elapsedSec: computeHybridElapsed(result, now), ...extra });

export const startHybrid = (result: HybridResult, now = Date.now()): HybridResult => {
  if (result.status !== 'idle' && result.status !== 'paused') return result;
  return {
    ...result, status: 'running', runningSince: now, pausedSince: undefined,
    startedAt: result.startedAt ?? new Date(now).toISOString(),
    pausedSec: result.pausedSec + (result.pausedSince === undefined ? 0 : Math.max(0, now - result.pausedSince) / 1000),
    events: [...result.events, event(result, result.status === 'idle' ? 'start' : 'resume', now)],
  };
};

export const pauseHybrid = (result: HybridResult, now = Date.now()): HybridResult => {
  if (result.status !== 'running') return result;
  return {
    ...result, status: 'paused', activeElapsedSec: computeHybridElapsed(result, now),
    runningSince: undefined, pausedSince: now,
    events: [...result.events, event(result, 'pause', now)],
  };
};

export const finishHybrid = (result: HybridResult, now = Date.now(), atCap = false): HybridResult => {
  if (result.status === 'finished' || result.status === 'idle') return result;
  const elapsed = atCap && result.targetSec !== undefined ? result.targetSec : computeHybridElapsed(result, now);
  const timedInterval = result.format === 'interval' && !!result.definition.work;
  const intervalCycle = (result.definition.work ?? 0) + (result.definition.pause ?? 0);
  const completedRounds = timedInterval
    ? Math.min(result.targetRounds ?? Infinity, Math.floor(elapsed / intervalCycle) +
      (elapsed % intervalCycle >= result.definition.work! ? 1 : 0))
    : result.completedRounds;
  return {
    ...result, completedRounds, status: 'finished', activeElapsedSec: elapsed, runningSince: undefined, pausedSince: undefined,
    pausedSec: result.pausedSec + (result.pausedSince === undefined ? 0 : Math.max(0, now - result.pausedSince) / 1000),
    finishedAt: new Date(now).toISOString(),
    dnf: (atCap && !['amrap', 'ladder', 'interval'].includes(result.format)) ||
      ((result.format === 'rounds_for_time' || isDistanceInterval(result)) &&
        result.completedRounds < (result.targetRounds ?? 0)),
    events: [...result.events, event(result, atCap ? 'cap' : 'finish', now, { elapsedSec: elapsed })],
  };
};

export const completeHybridRound = (
  result: HybridResult, now = Date.now(), outsideCapConfirmed = false,
): HybridResult => {
  const elapsedSec = computeHybridElapsed(result, now) +
    (result.status === 'finished' && outsideCapConfirmed && result.finishedAt
      ? Math.max(0, now - Date.parse(result.finishedAt)) / 1000 : 0);
  if (result.status !== 'running' && !(result.status === 'finished' && outsideCapConfirmed)) return result;
  if (result.targetSec !== undefined && elapsedSec > result.targetSec && !outsideCapConfirmed)
    throw new Error('Fuera del time cap: confirmá explícitamente para registrar esta vuelta.');
  const lastTap = [...result.events].reverse().find((e) => e.type === 'round');
  if (lastTap && now - Date.parse(lastTap.at) < 800) return result;
  const previous = result.splits.at(-1)?.elapsedSec ?? 0;
  const split = {
    round: result.splits.length + 1, elapsedSec,
    splitSec: Math.max(0, elapsedSec - previous),
    recordedAt: new Date(now).toISOString(), source: 'tap' as const,
  };
  const next = checkpoint({
    ...result, completedRounds: result.completedRounds + 1,
    splits: [...result.splits, split],
    events: [...result.events, event(result, 'round', now, { elapsedSec, after: split, reason: outsideCapConfirmed ? 'Vuelta fuera del cap confirmada' : undefined })],
  }, now);
  return result.format === 'rounds_for_time' && next.completedRounds >= (result.targetRounds ?? Infinity)
    ? finishHybrid(next, now) : next;
};

export const undoHybridRound = (result: HybridResult, now = Date.now()): HybridResult => {
  const last = result.splits.at(-1);
  if (!last) return result;
  const recent = now - Date.parse(last.recordedAt) <= 10000;
  if (!recent) throw new Error('La ventana de deshacer es de 10 s. Usá corrección justificada.');
  const autoFinished = result.status === 'finished' && result.format === 'rounds_for_time' && !result.dnf;
  return checkpoint({
    ...result, splits: result.splits.slice(0, -1), completedRounds: Math.max(0, result.completedRounds - 1),
    // Reopen paused, never silently restart a clock or compete for the timer lock.
    status: autoFinished ? 'paused' : result.status,
    pausedSince: autoFinished ? now : result.pausedSince,
    finishedAt: autoFinished ? undefined : result.finishedAt,
    events: [...result.events, event(result, 'undo_round', now, { before: last, reason: 'Deshacer último toque (10 s)' })],
  }, now);
};

export const setHybridPartial = (
  result: HybridResult, partialReps: number, details: HybridResult['partialDetails'], now = Date.now(),
): HybridResult => {
  if (!Number.isFinite(partialReps) || partialReps < 0 || !Number.isInteger(partialReps) ||
    details?.some((d) => !Number.isFinite(d.value) || d.value < 0 || !d.unit.trim()))
    throw new Error('Ingresá repeticiones enteras y detalles con cantidades y unidades válidas.');
  return checkpoint({
    ...result, partialReps, partialDetails: details,
    events: [...result.events, event(result, 'partial', now, {
      before: { partialReps: result.partialReps, details: result.partialDetails },
      after: { partialReps, details },
    })],
  }, now);
};

/** Corrections never manufacture missing splits. Cumulative edits recompute actual deltas. */
export const correctHybrid = (
  result: HybridResult,
  patch: { activeElapsedSec?: number; completedRounds?: number; partialReps?: number; splits?: HybridResult['splits']; notes?: string },
  reason: string, now = Date.now(),
): HybridResult => {
  if (!reason.trim()) throw new Error('La corrección necesita un motivo.');
  if (result.status === 'running') throw new Error('Pausá antes de corregir.');
  for (const value of [patch.activeElapsedSec, patch.completedRounds, patch.partialReps])
    if (value !== undefined && (!Number.isFinite(value) || value < 0)) throw new Error('Usá cantidades válidas, no negativas.');
  if ([patch.completedRounds, patch.partialReps].some((n) => n !== undefined && !Number.isInteger(n)))
    throw new Error('Vueltas y repeticiones deben ser enteras.');
  if (patch.activeElapsedSec !== undefined && !patch.splits &&
    result.splits.some((s) => s.elapsedSec > patch.activeElapsedSec!))
    throw new Error('El tiempo total no puede ser menor a los splits: corregí también sus acumulados.');
  let previous = 0;
  const splits = patch.splits?.map((split, index) => {
    if (!Number.isFinite(split.elapsedSec) || split.elapsedSec < previous ||
      split.elapsedSec > (patch.activeElapsedSec ?? result.activeElapsedSec))
      throw new Error('Los acumulados deben estar ordenados y dentro del tiempo total.');
    const fixed = { ...split, round: index + 1, splitSec: split.elapsedSec - previous, source: 'manual' as const };
    previous = split.elapsedSec;
    return fixed;
  });
  const next = { ...result, ...patch, ...(splits ? { splits } : {}) };
  return { ...next, events: [...result.events, event(result, 'correction', now, {
    reason: reason.trim(), before: {
      activeElapsedSec: result.activeElapsedSec, completedRounds: result.completedRounds,
      partialReps: result.partialReps, splits: result.splits, notes: result.notes,
    }, after: patch,
  })] };
};

export const hybridStats = (result: HybridResult) => {
  const splits = result.splits.map((split) => split.splitSec);
  const mean = splits.length ? splits.reduce((a, b) => a + b, 0) / splits.length : undefined;
  const deviation = mean === undefined ? undefined : Math.sqrt(splits.reduce((n, s) => n + (s - mean) ** 2, 0) / splits.length);
  return {
    completedRounds: result.completedRounds, partialReps: result.partialReps,
    fastest: splits.length ? Math.min(...splits) : undefined,
    slowest: splits.length ? Math.max(...splits) : undefined,
    mean, deviation,
    consistency: splits.length >= 2 && mean ? (deviation! / mean) * 100 : undefined,
    delta: splits.length >= 2 ? splits[splits.length - 1]! - splits[0]! : undefined,
    comparableKey: hybridComparableKey(result),
  };
};

export const recordIntervalScore = (
  result: HybridResult, interval: number, value: number, unit: string, now = Date.now(),
): HybridResult => {
  if (!Number.isFinite(value) || value < 0 || !unit.trim() || interval < 1 || !Number.isInteger(interval) ||
    interval > (result.targetRounds ?? Infinity)) throw new Error('Revisá intervalo, cantidad y unidad.');
  const previous = [...result.events].reverse().find((e) =>
    e.type === 'interval_score' && (e.after as { interval?: number } | undefined)?.interval === interval);
  return checkpoint({ ...result, events: [...result.events, event(result, 'interval_score', now, {
    before: previous?.after,
    after: { interval, value, unit: unit.trim(), workSec: result.definition.work, restSec: result.definition.pause },
  })] }, now);
};

export const distanceIntervalPhase = (result: HybridResult, now = Date.now()) => {
  const last = [...result.events].reverse().find((e) => e.type === 'interval_work_end');
  const next = [...result.events].reverse().find((e) => e.type === 'interval_rest_end');
  const resting = !!last && (!next || last.elapsedSec > next.elapsedSec);
  return {
    resting,
    remaining: resting ? Math.max(0, (result.definition.pause ?? 0) - (computeHybridElapsed(result, now) - last!.elapsedSec)) : 0,
  };
};

export const completeDistanceInterval = (result: HybridResult, now = Date.now()): HybridResult => {
  if (result.status !== 'running' || distanceIntervalPhase(result, now).resting) return result;
  const last = [...result.events].reverse().find((e) => e.type === 'interval_rest_end');
  const elapsedSec = computeHybridElapsed(result, now);
  const split = {
    round: result.splits.length + 1, elapsedSec, splitSec: Math.max(0, elapsedSec - (last?.elapsedSec ?? 0)),
    recordedAt: new Date(now).toISOString(), source: 'tap' as const,
  };
  const next = checkpoint({
    ...result, completedRounds: result.completedRounds + 1, splits: [...result.splits, split],
    events: [...result.events, event(result, 'interval_work_end', now, {
      after: { ...split, distance: result.definition.items.find((item) => item.distance)?.distance, restSec: result.definition.pause },
    })],
  }, now);
  return next.completedRounds >= (next.targetRounds ?? Infinity) ? finishHybrid(next, now) : next;
};

export const endIntervalRest = (result: HybridResult, now = Date.now()): HybridResult => {
  const phase = distanceIntervalPhase(result, now);
  if (!phase.resting || phase.remaining > 0 || result.status !== 'running') return result;
  const last = [...result.events].reverse().find((e) => e.type === 'interval_work_end')!;
  return checkpoint({ ...result, events: [...result.events, event(result, 'interval_rest_end', now, {
    elapsedSec: last.elapsedSec + (result.definition.pause ?? 0),
  })] }, now);
};
