import type { WorkoutSession } from '../types';
import {
  CORE_FRI,
  CORE_MON,
  CORE_WED,
  HYBRIDS,
  MOBILITY_CLOSE,
  SPINNING,
  SUNDAY,
} from '../data/month';
import { setKey } from './prescription';

const STRENGTH_BY_DAY: Record<number, string[]> = {
  1: ['box-squat', 'trx-row', 'single-leg-rdl'],
  2: ['bench-press', 'trx-row', 'band-face-pull'],
  4: ['deadlift', 'pallof-press', 'hip-airplane'],
  5: ['bulgarian-split-squat', 'trx-row', 'kb-floor-press-1m'],
};

const ATHLETE_BY_DAY: Record<number, string[]> = {
  1: ['kb-clean', 'box-jump', 'rotational-mb-throw', 'shuttle-run'],
  2: ['trx-power-pull', 'kb-press-explosive-1m', 'broad-jump', 'rotational-mb-throw'],
  4: ['kb-clean', 'lateral-bound', 'mb-rotational-slam', 'shuttle-run'],
  5: ['kb-swing', 'broad-jump', 'mb-slam', 'lateral-shuffle'],
};

const coreForDay = (day: number): string[] | undefined => {
  const source = day === 1 ? CORE_MON : day === 5 ? CORE_FRI : day === 2 || day === 4 ? CORE_WED : undefined;
  return source?.items.map((item) => item.exerciseId);
};

const outdoorFor = (week: number, blockNumber: number): string[] | undefined => {
  const cycle = ((week - 1) % 4) + 1;
  if (blockNumber === 1) {
    return [[
      'zone2-run',
    ], [
      'threshold-run',
    ], [
      'tempo-run',
    ], [
      'easy-walk',
    ]][cycle - 1];
  }
  if (blockNumber !== 2) return undefined;
  if (cycle === 2) return ['hip-airplane', 'band-chop', 'thoracic-rotation'];
  if (cycle === 4) return ['hip-9090', 'band-lift', 'pallof-press'];
  return MOBILITY_CLOSE.items.map((item) => item.exerciseId);
};

/**
 * Resuelve las claves numéricas usadas antes de la adaptación de la rutina.
 * El resultado conserva el ejercicio original en la clave aunque ya no ocupe
 * esa posición en el bloque nuevo.
 */
export const legacyExerciseIds = (workoutId: string, blockId: string): string[] | undefined => {
  const match = workoutId.match(/^w(\d+)d(\d+)$/);
  const blockMatch = blockId.match(/-b(\d+)$/);
  if (!match || !blockMatch) return undefined;
  const week = Number(match[1]);
  const day = Number(match[2]);
  const blockNumber = Number(blockMatch[1]);

  if (day === 3) {
    if (blockNumber === 1) return SPINNING[(week - 1) % SPINNING.length]!.items.map((item) => item.exerciseId);
    if (blockNumber === 2) return MOBILITY_CLOSE.items.map((item) => item.exerciseId);
  }
  if (day === 6) return outdoorFor(week, blockNumber);
  if (day === 7 && blockNumber === 1) return SUNDAY.items.map((item) => item.exerciseId);

  if (blockNumber === 1) return coreForDay(day);
  if (blockNumber === 2) return STRENGTH_BY_DAY[day];
  if (blockNumber === 3) return ATHLETE_BY_DAY[day];
  if (blockNumber === 4) {
    const poolDay = day === 1 ? 1 : day === 2 || day === 4 ? 3 : day === 5 ? 5 : undefined;
    return poolDay
      ? HYBRIDS[poolDay][(week - 1) % HYBRIDS[poolDay].length]!.items.map((item) => item.exerciseId)
      : undefined;
  }
  return undefined;
};

export const rekeyLegacySessions = (
  sessions: Record<string, WorkoutSession>,
): Record<string, WorkoutSession> => Object.fromEntries(
  Object.entries(sessions).map(([workoutId, session]) => {
    const sets = Object.fromEntries(
      Object.entries(session.sets ?? {}).map(([key, rows]) => {
        const old = key.match(/^(.*):(\d+)$/);
        if (!old || old[1]!.includes(':')) return [key, rows];
        const blockId = old[1]!;
        const itemIndex = Number(old[2]);
        const exerciseId = legacyExerciseIds(workoutId, blockId)?.[itemIndex];
        return exerciseId ? [setKey(blockId, exerciseId, itemIndex), rows] : [key, rows];
      }),
    );
    const activeOld = session.activeKey?.match(/^(.*):(\d+)$/);
    const activeExercise = activeOld && !activeOld[1]!.includes(':')
      ? legacyExerciseIds(workoutId, activeOld[1]!)?.[Number(activeOld[2])]
      : undefined;
    const activeKey = activeOld && activeExercise
      ? setKey(activeOld[1]!, activeExercise, Number(activeOld[2]))
      : session.activeKey;
    return [workoutId, { ...session, sets, activeKey }];
  }),
);