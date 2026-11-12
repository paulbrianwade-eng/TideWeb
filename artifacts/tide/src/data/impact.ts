import type { Workout } from '../types';
import { getExercise } from './exercises';

/**
 * CARGA DE IMPACTO
 * ────────────────
 * La bici no es un reemplazo del correr: es la herramienta para sumar motor
 * cuando el impacto acumulado ya es alto. Para decidir eso hace falta medirlo.
 *
 * Cada ejercicio aporta un costo de impacto por sesión. Correr, saltar y
 * esquiar acumulan; la bici, el remo de KB y la fuerza no.
 */
export type ImpactLevel = 'alto' | 'medio' | 'bajo' | 'nulo';

export const IMPACT_COST: Record<ImpactLevel, number> = {
  alto: 4,
  medio: 2,
  bajo: 1,
  nulo: 0,
};

/** Impacto explícito. Lo que no está acá se deriva de las capacidades. */
const EXPLICIT: Record<string, ImpactLevel> = {
  // Alto: aterrizajes y carrera rápida
  sprint: 'alto',
  'hill-sprint': 'alto',
  'shuttle-run': 'alto',
  'box-jump': 'alto',
  'broad-jump': 'alto',
  'drop-jump': 'alto',
  'lateral-bound': 'alto',
  'skater-jump': 'alto',
  'lateral-drop-1p': 'alto',
  'split-squat-iso-catch': 'alto',
  bounding: 'alto',
  burpee: 'alto',

  // Medio: carrera continua y pliometría de bajo contacto
  'zone2-run': 'medio',
  'threshold-run': 'medio',
  'tempo-run': 'medio',
  'pogo-jump': 'medio',
  'jump-rope': 'medio',
  stride: 'medio',
  skipping: 'medio',
  carioca: 'medio',
  'lateral-shuffle': 'medio',
  'box-step-up': 'bajo',
  'mountain-climber': 'bajo',

  // Nulo: la bici y todo lo que no despega los pies
  spinning: 'nulo',
  'bike-sprint': 'nulo',
  'bike-power': 'nulo',
  'bike-ski-legs': 'nulo',
  'bike-zone2': 'nulo',
  'bike-recovery': 'nulo',
  'easy-walk': 'nulo',
};

export const impactOf = (exerciseId: string): ImpactLevel => {
  const explicit = EXPLICIT[exerciseId];
  if (explicit) return explicit;
  const ex = getExercise(exerciseId);
  if (ex.capacities.includes('Absorción de impacto')) return 'alto';
  if (ex.capacities.includes('Velocidad')) return 'medio';
  if (ex.capacities.includes('Tendón')) return 'bajo';
  return 'nulo';
};

export const sessionImpact = (workout: Workout): number =>
  workout.blocks.reduce(
    (sum, b) => sum + b.items.reduce((s, it) => s + IMPACT_COST[impactOf(it.exerciseId)], 0),
    0,
  );

/**
 * Umbral semanal. Por encima de esto, sumar más carrera es cavar más hondo:
 * conviene que el motor salga de la bici.
 */
export const WEEKLY_IMPACT_CAP = 60;

export const weekImpact = (program: Workout[], week: number): number =>
  program.filter((w) => w.week === week).reduce((s, w) => s + sessionImpact(w), 0);

/**
 * ¿Conviene la bici en vez de más carrera?
 * Devuelve el motivo si la respuesta es sí.
 */
export const shouldPreferBike = (
  program: Workout[],
  week: number,
  context?: { recentSki?: boolean; painLegs?: boolean },
): string | null => {
  if (context?.recentSki) return 'Venís de esquiar: las piernas ya tienen impacto acumulado de sobra.';
  if (context?.painLegs) return 'Con molestia en las piernas, el motor sale de la bici y no del asfalto.';
  const load = weekImpact(program, week);
  if (load > WEEKLY_IMPACT_CAP) {
    return `El impacto de la semana está en ${load} sobre un techo de ${WEEKLY_IMPACT_CAP}: sumar carrera es cavar más hondo.`;
  }
  return null;
};

/** Protocolos de bici según para qué se la necesita. */
export const BIKE_PROTOCOL = {
  finisher: 'bike-sprint',
  potencia: 'bike-power',
  ski: 'bike-ski-legs',
  zona2: 'bike-zone2',
  recuperacion: 'bike-recovery',
} as const;

/**
 * Lo que la bici NO reemplaza. Estas cualidades solo se entrenan con los pies
 * en el suelo, y el motor tiene que saberlo para no ofrecer la bici como
 * sustituto.
 */
export const BIKE_CANNOT_REPLACE = [
  'sprint',
  'hill-sprint',
  'shuttle-run',
  'skipping',
  'stride',
  'bounding',
  'pogo-jump',
  'jump-rope',
  'box-jump',
  'broad-jump',
  'drop-jump',
  'lateral-bound',
  'skater-jump',
];

export const canBikeReplace = (exerciseId: string): boolean => !BIKE_CANNOT_REPLACE.includes(exerciseId);
