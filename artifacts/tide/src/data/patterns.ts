import { EXERCISES } from './exercises';
import type { SportModule } from '../types';

/**
 * TAXONOMÍA DE PATRONES DE MOVIMIENTO
 * ───────────────────────────────────
 * El motor no razona sobre "ejercicios" sino sobre patrones. Dos ejercicios
 * distintos que empujan igual cuentan como el mismo patrón, y ahí es donde
 * aparece la mala programación (bench → push-up → TRX push-up).
 */
export type MovementPattern =
  | 'upper-push'
  | 'upper-pull'
  | 'squat'
  | 'hinge'
  | 'rotation'
  | 'anti-rotation'
  | 'unilateral'
  | 'locomotion'
  | 'plyometrics'
  | 'core'
  | 'mobility'
  | 'isolation'
  | 'conditioning';

export const PATTERN_LABEL: Record<MovementPattern, string> = {
  'upper-push': 'Empuje superior',
  'upper-pull': 'Tracción superior',
  squat: 'Sentadilla',
  hinge: 'Bisagra',
  rotation: 'Rotación',
  'anti-rotation': 'Antirrotación',
  unilateral: 'Unilateral',
  locomotion: 'Locomoción',
  plyometrics: 'Pliometría',
  core: 'Core',
  mobility: 'Movilidad',
  isolation: 'Aislamiento',
  conditioning: 'Motor',
};

/**
 * Patrón primario y secundarios de cada ejercicio.
 * El primero de la lista es el primario: es el que usa la regla de no duplicación.
 */
export const PATTERNS: Record<string, MovementPattern[]> = {
  // V7: estaciones, potencia de contraste y accesorios del nuevo ciclo.
  'block-run': ['locomotion', 'conditioning'],
  'spinning-bike': ['conditioning'],
  'kb-clean-push-press': ['hinge', 'upper-push', 'plyometrics', 'unilateral'],
  'med-ball-chest-pass': ['upper-push', 'plyometrics'],
  'clean-pull': ['hinge', 'plyometrics'],
  'clean-high-pull': ['hinge', 'plyometrics'],
  'box-step-over': ['squat', 'unilateral', 'conditioning'],
  'front-rack-reverse-lunge': ['squat', 'unilateral'],
  'db-lateral-raise': ['upper-push', 'isolation'],
  'db-hammer-curl': ['upper-pull', 'isolation'],
  'db-biceps-curl': ['upper-pull', 'isolation'],
  'db-shoulder-press': ['upper-push'],
  'kb-snatch': ['hinge', 'plyometrics', 'unilateral'],
  'push-jerk': ['upper-push', 'plyometrics'],
  'split-jump': ['plyometrics', 'squat', 'unilateral'],
  // ── UPPER PUSH ──
  'bench-press': ['upper-push'],
  'bench-iso-push': ['upper-push'],
  'supine-mb-throw': ['upper-push', 'plyometrics'],
  'kb-floor-press-1m': ['upper-push', 'unilateral', 'anti-rotation'],
  'overhead-iso-push': ['upper-push'],
  'kneeling-oh-throw': ['upper-push', 'plyometrics'],
  'kb-press-explosive-1m': ['upper-push', 'unilateral', 'plyometrics'],
  'incline-bench-press': ['upper-push'],
  'push-up': ['upper-push', 'core'],
  'trx-push-up': ['upper-push', 'core'],
  'push-press': ['upper-push', 'squat'],
  'overhead-press': ['upper-push'],
  'kb-shoulder-press': ['upper-push', 'unilateral'],
  'landmine-press': ['upper-push', 'unilateral', 'anti-rotation'],
  'scapular-push-up': ['upper-push', 'mobility'],
  'kb-push-jerk': ['upper-push', 'plyometrics', 'unilateral'],
  'plyo-push-up': ['upper-push', 'plyometrics', 'core'],
  'barbell-thruster': ['squat', 'upper-push', 'conditioning'],
  'db-curl-to-press': ['upper-push', 'isolation'],

  // ── UPPER PULL ──
  'pull-up': ['upper-pull'],
  'trx-row': ['upper-pull'],
  'row-iso-hold': ['upper-pull'],
  'pull-up-iso-hold': ['upper-pull'],
  'horizontal-pull-alt': ['upper-pull', 'unilateral', 'anti-rotation'],
  'inverted-row': ['upper-pull'],
  'barbell-row': ['upper-pull', 'hinge'],
  'band-face-pull': ['upper-pull', 'isolation'],
  'trx-power-pull': ['upper-pull', 'rotation', 'unilateral'],
  ytwl: ['upper-pull', 'isolation'],
  'explosive-one-arm-row': ['upper-pull', 'unilateral', 'anti-rotation'],
  'burpee-pull-up': ['conditioning', 'upper-pull', 'locomotion'],

  // ── SQUAT ──
  'back-squat': ['squat'],
  'front-squat': ['squat'],
  'box-squat': ['squat'],
  'goblet-squat': ['squat'],
  'bulgarian-split-squat': ['squat', 'unilateral'],
  'split-squat-hold': ['squat', 'unilateral'],
  'step-down': ['squat', 'unilateral'],
  'box-step-up': ['squat', 'unilateral'],
  'reverse-lunge': ['squat', 'unilateral'],
  'reverse-lunge-mb': ['squat', 'unilateral'],
  'cossack-squat': ['squat', 'unilateral', 'mobility'],
  'lateral-lunge': ['squat', 'unilateral'],
  'lateral-lunge-goblet': ['squat', 'unilateral'],
  'split-squat-iso-catch': ['squat', 'unilateral', 'plyometrics'],
  'lateral-drop-1p': ['plyometrics', 'unilateral'],
  'wall-sit': ['squat', 'isolation'],
  'spanish-squat': ['squat', 'isolation'],
  'deep-squat-hold': ['mobility', 'squat'],

  // ── HINGE ──
  deadlift: ['hinge'],
  'romanian-deadlift': ['hinge'],
  'kb-swing': ['hinge', 'plyometrics'],
  'kb-swing-intervals': ['hinge', 'conditioning'],
  'hip-thrust': ['hinge'],
  'single-leg-rdl': ['hinge', 'unilateral'],
  'deadlift-1p': ['hinge', 'unilateral'],
  'good-morning-1p': ['hinge', 'unilateral'],
  'hip-bridge-iso-1p': ['hinge', 'unilateral', 'core'],
  'triple-extension-march': ['plyometrics', 'unilateral'],
  'glute-bridge-single': ['hinge', 'unilateral', 'core'],
  'glute-bridge-iso': ['hinge', 'core'],
  'glute-bridge': ['hinge', 'core'],
  'hip-raise-extreme': ['hinge', 'core'],
  'barbell-good-morning': ['hinge', 'mobility'],
  'nordic-curl': ['hinge', 'isolation'],
  'hang-power-clean': ['hinge', 'plyometrics'],
  'hang-clean': ['hinge', 'plyometrics'],
  'hang-snatch': ['hinge', 'plyometrics', 'upper-push'],
  'barbell-clean': ['hinge', 'plyometrics'],
  'american-kb-swing': ['hinge', 'plyometrics', 'conditioning'],
  'kb-clean': ['hinge', 'unilateral', 'plyometrics'],
  'reverse-nordic': ['isolation', 'squat'],

  // ── ROTATION ──
  'rotational-mb-throw': ['rotation', 'plyometrics'],
  'mb-rotational-slam': ['rotation', 'plyometrics'],
  'landmine-rotation': ['rotation'],
  'band-chop': ['rotation'],
  'band-lift': ['rotation'],
  'side-plank-rotation': ['rotation', 'core'],
  'kb-rotational-swing': ['rotation', 'hinge', 'plyometrics'],
  'bear-kick-through': ['rotation', 'core', 'mobility'],
  'band-lift-kneeling': ['rotation'],
  'thoracic-rotation': ['mobility', 'rotation'],
  'open-book': ['mobility', 'rotation'],
  carioca: ['locomotion', 'rotation'],

  // ── ANTI ROTATION ──
  'pallof-press': ['anti-rotation', 'core'],
  'suitcase-carry': ['anti-rotation', 'locomotion'],
  'bottom-up-carry': ['anti-rotation', 'locomotion', 'unilateral'],
  'single-arm-farmer': ['anti-rotation', 'locomotion'],
  'waiter-carry': ['anti-rotation', 'locomotion'],
  'bear-plank-tap': ['anti-rotation', 'core'],
  'bird-dog': ['anti-rotation', 'core'],
  'dead-bug': ['anti-rotation', 'core'],
  'ab-wheel': ['anti-rotation', 'core'],
  'roll-out-wheel': ['anti-rotation', 'core'],
  'anti-lateral-flexion-dyn': ['anti-rotation', 'core'],
  'side-plank-run': ['core', 'anti-rotation'],
  'plank-run': ['anti-rotation', 'core'],
  'hollow-hold': ['core'],
  'trx-body-saw': ['anti-rotation', 'core'],
  'trx-fallout': ['anti-rotation', 'core'],
  'side-plank': ['core', 'anti-rotation'],
  'copenhagen-plank': ['core', 'unilateral'],
  'dynamic-plank': ['anti-rotation', 'core'],
  'extreme-plank': ['core', 'anti-rotation'],
  'stir-the-pot': ['anti-rotation', 'core'],
  'sit-up': ['core'],
  'static-plank': ['core', 'anti-rotation'],

  // ── UNILATERAL / ESTABILIDAD ──
  'hip-airplane': ['unilateral', 'rotation', 'mobility'],
  'single-leg-balance': ['unilateral', 'isolation'],

  // ── LOCOMOTION ──
  sprint: ['locomotion', 'plyometrics'],
  'hill-sprint': ['locomotion', 'plyometrics'],
  'shuttle-run': ['locomotion', 'plyometrics'],
  'lateral-shuffle': ['locomotion'],
  'farmer-carry': ['locomotion', 'anti-rotation'],
  'bear-crawl': ['locomotion', 'anti-rotation', 'core'],
  'lateral-ape': ['locomotion', 'mobility', 'core'],
  'zone2-run': ['locomotion', 'conditioning'],
  'threshold-run': ['locomotion', 'conditioning'],
  'tempo-run': ['locomotion', 'conditioning'],
  'easy-walk': ['locomotion', 'mobility'],
  'running-drills': ['locomotion', 'mobility'],
  'interval-4x4': ['locomotion', 'conditioning'],
  'interval-30-30': ['locomotion', 'conditioning'],
  stride: ['locomotion'],
  skipping: ['locomotion', 'plyometrics'],

  // ── PLYOMETRICS ──
  'box-jump': ['plyometrics'],
  'broad-jump': ['plyometrics'],
  'lateral-bound': ['plyometrics', 'unilateral'],
  'skater-jump': ['plyometrics', 'unilateral'],
  'pogo-jump': ['plyometrics', 'isolation'],
  'drop-jump': ['plyometrics'],
  bounding: ['plyometrics', 'locomotion'],
  'mb-slam': ['plyometrics', 'core'],
  'wall-ball': ['squat', 'upper-push', 'conditioning'],
  'rope-air-squat': ['conditioning', 'squat', 'plyometrics'],
  'overhead-lunge': ['squat', 'unilateral', 'upper-push'],
  'farmer-march': ['anti-rotation', 'unilateral', 'core'],
  'spinning': ['conditioning'],
  'bike-sprint': ['conditioning'],
  'bike-power': ['conditioning'],
  'bike-ski-legs': ['conditioning', 'isolation'],
  'bike-zone2': ['conditioning'],
  'bike-recovery': ['conditioning', 'mobility'],

  // ── MOTOR / FINISHER ──
  burpee: ['conditioning', 'locomotion'],
  'burpee-broad-jump': ['conditioning', 'locomotion', 'plyometrics'],
  'mountain-climber': ['conditioning', 'core'],
  'jump-rope': ['conditioning', 'plyometrics'],
  'rope-intervals': ['conditioning', 'plyometrics'],
  'hyrox-block': ['conditioning', 'locomotion'],

  // ── AISLAMIENTO / TEJIDO ──
  'soleus-raise': ['isolation'],
  'tibialis-raise': ['isolation'],
  'foot-activation': ['isolation', 'mobility'],

  // ── MOVILIDAD ──
  'hip-cars': ['mobility'],
  'shoulder-cars': ['mobility'],
  'hip-9090': ['mobility'],
  'shin-box': ['mobility', 'rotation'],
  'jefferson-curl': ['mobility', 'hinge'],
  'hip-flow': ['mobility'],
  'situp-to-stand': ['core', 'mobility', 'squat'],
  'shinbox-to-stand': ['mobility', 'rotation', 'unilateral'],
  'beast-to-down-dog': ['mobility', 'core', 'upper-push'],
  'cossack-knee-drive': ['mobility', 'unilateral', 'squat'],
  'crab-reach': ['mobility', 'rotation', 'core'],
  'cat-cow': ['mobility'],
  "worlds-greatest-stretch": ['mobility'],
  'hip-flexor-stretch': ['mobility'],
  'monster-walk': ['isolation', 'unilateral'],
  'nasal-breathing': ['mobility'],
  'foam-roller': ['mobility'],
  'down-regulation': ['mobility'],
  'gowod-routine': ['mobility'],
  'wrist-mobility': ['mobility'],
  'weekly-export-check': ['mobility'],
  'weekly-alarm-check': ['mobility'],
  'weekly-hyrox-check': ['conditioning'],
  'benchmark-first-time': ['mobility'],
  'benchmark-three-month-goal': ['conditioning'],
  'benchmark-bottleneck': ['mobility'],
  'benchmark-time-cap': ['mobility'],
};

export const patternsOf = (exerciseId: string): MovementPattern[] => PATTERNS[exerciseId] ?? ['isolation'];

/** El patrón primario es el que gobierna la regla de no duplicación. */
export const primaryPattern = (exerciseId: string): MovementPattern => patternsOf(exerciseId)[0];

/**
 * Patrones "pesados": los que se cargan de verdad y compiten por el sistema
 * nervioso. Máximo uno de cada uno por sesión.
 */
export const HEAVY: Record<string, 'squat' | 'hinge' | 'press' | 'pull'> = {
  'back-squat': 'squat',
  'front-squat': 'squat',
  'box-squat': 'squat',
  deadlift: 'hinge',
  'romanian-deadlift': 'hinge',
  'hang-power-clean': 'hinge',
  'hip-thrust': 'hinge',
  'bench-press': 'press',
  'deadlift-1p': 'hinge',
  'incline-bench-press': 'press',
  'overhead-press': 'press',
  'push-press': 'press',
  'pull-up': 'pull',
  'barbell-row': 'pull',
};

/**
 * PRIORIDADES POR DEPORTE
 * Cada deporte define qué patrones suman y cuáles conviene limitar.
 * El validador y el explicador leen esto.
 */
export interface SportProfile {
  label: string;
  priorities: string[];
  favor: MovementPattern[];
  limit?: { pattern: MovementPattern; max: number; reason: string; heavyOnly?: boolean };
}

export const SPORT_PROFILE: Record<SportModule, SportProfile> = {
  surf: {
    label: 'Surf',
    priorities: [
      'Estabilidad escapular',
      'Resistencia de tracción',
      'Agarre',
      'Rotación torácica',
      'Salud de hombro',
      'Estabilidad de core',
    ],
    favor: ['upper-pull', 'anti-rotation', 'rotation', 'core'],
    limit: {
      pattern: 'upper-push',
      max: 2,
      heavyOnly: true,
      reason: 'El volumen de empuje compite con la salud del hombro que la remada necesita',
    },
  },
  ski: {
    label: 'Esquí',
    priorities: [
      'Resistencia de cuádriceps',
      'Fuerza excéntrica',
      'Estabilidad de cadera',
      'Fuerza unipodal',
      'Potencia lateral',
      'Rigidez de tobillo',
    ],
    favor: ['squat', 'unilateral', 'plyometrics', 'isolation'],
  },
  golf: {
    label: 'Golf',
    priorities: [
      'Rotación',
      'Antirrotación',
      'Transferencia de potencia',
      'Estabilidad de cadera',
      'Fuerza contra el suelo',
    ],
    favor: ['rotation', 'anti-rotation', 'hinge', 'unilateral'],
  },
  running: {
    label: 'Running',
    priorities: [
      'Elasticidad',
      'Zancada',
      'Extensión de cadera',
      'Fuerza de pie',
      'Rigidez reactiva',
    ],
    favor: ['plyometrics', 'locomotion', 'hinge', 'isolation'],
  },
};

/**
 * Alternativas del mismo patrón, para rotar estímulo y para sugerir sustituciones
 * cuando la validación falla.
 */
export const SAME_PATTERN_ALTERNATIVES: Record<MovementPattern, string[]> = {
  'upper-push': ['bench-press', 'incline-bench-press', 'push-up', 'trx-push-up', 'kb-shoulder-press', 'push-press', 'overhead-press'],
  'upper-pull': ['trx-row', 'inverted-row', 'trx-power-pull', 'band-face-pull', 'horizontal-pull-alt', 'ytwl', 'row-iso-hold', 'pull-up', 'barbell-row', 'pull-up-iso-hold'],
  squat: ['box-squat', 'front-squat', 'goblet-squat', 'bulgarian-split-squat', 'box-step-up', 'reverse-lunge'],
  hinge: ['single-leg-rdl', 'glute-bridge-single', 'kb-swing', 'hip-bridge-iso-1p', 'good-morning-1p', 'nordic-curl', 'hip-thrust', 'kb-clean', 'deadlift', 'romanian-deadlift'],
  rotation: ['rotational-mb-throw', 'mb-rotational-slam', 'landmine-rotation', 'band-chop', 'side-plank-rotation'],
  'anti-rotation': ['pallof-press', 'suitcase-carry', 'bear-plank-tap', 'ab-wheel', 'trx-fallout', 'dead-bug'],
  unilateral: ['single-leg-rdl', 'bulgarian-split-squat', 'step-down', 'hip-airplane', 'box-step-up'],
  locomotion: ['sprint', 'shuttle-run', 'farmer-carry', 'bear-crawl', 'lateral-shuffle', 'carioca'],
  plyometrics: ['box-jump', 'lateral-bound', 'skater-jump', 'pogo-jump', 'drop-jump', 'mb-slam'],
  core: ['hollow-hold', 'side-plank', 'copenhagen-plank', 'trx-body-saw', 'bird-dog'],
  mobility: ['hip-9090', 'hip-cars', 'worlds-greatest-stretch', 'hip-flow', 'thoracic-rotation'],
  isolation: ['soleus-raise', 'tibialis-raise', 'monster-walk', 'single-leg-balance'],
  conditioning: ['jump-rope', 'burpee', 'mountain-climber', 'kb-swing'],
};

/** Ejercicios sin patrón asignado: sirve para que el test detecte huecos. */
export const untaggedExercises = (): string[] => EXERCISES.filter((e) => !PATTERNS[e.id]).map((e) => e.id);
