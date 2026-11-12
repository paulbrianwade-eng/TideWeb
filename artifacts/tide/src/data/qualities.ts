import { EXERCISES, getExercise } from './exercises';

/**
 * CUALIDAD DEL ESTÍMULO
 * ─────────────────────
 * Un mismo patrón se puede entrenar de tres maneras distintas, y ahí está la
 * diferencia entre acumular volumen y entrenar rendimiento:
 *
 *   pesado      → producir fuerza máxima
 *   isométrico  → sostener la posición bajo tensión
 *   balístico   → expresar esa fuerza rápido
 *
 * Encadenarlas sobre el mismo patrón es un TRI-SET DE CONTRASTE. No es
 * repetición: es método. El validador de patrones necesita esta distinción
 * para no marcar como error lo que en realidad es buena programación.
 */
export type Quality = 'pesado' | 'isometrico' | 'balistico' | 'dinamico' | 'tejido';

export const QUALITY_LABEL: Record<Quality, string> = {
  pesado: 'Pesado',
  isometrico: 'Isométrico',
  balistico: 'Balístico',
  dinamico: 'Dinámico',
  tejido: 'Tejido',
};

/** Overrides explícitos. El resto se deriva de las capacidades del ejercicio. */
const EXPLICIT: Record<string, Quality> = {
  // Pesados
  'back-squat': 'pesado', 'front-squat': 'pesado', 'box-squat': 'pesado',
  deadlift: 'pesado', 'romanian-deadlift': 'pesado', 'hip-thrust': 'pesado',
  'bench-press': 'pesado', 'incline-bench-press': 'pesado', 'overhead-press': 'pesado',
  'pull-up': 'pesado', 'barbell-row': 'pesado', 'inverted-row': 'pesado',
  'trx-row': 'pesado', 'bulgarian-split-squat': 'pesado', 'goblet-squat': 'pesado',
  'kb-shoulder-press': 'pesado', 'single-leg-rdl': 'pesado', 'push-up': 'pesado',
  'trx-push-up': 'pesado', 'landmine-press': 'pesado', 'reverse-lunge': 'pesado',
  'lateral-lunge': 'pesado', 'good-morning-1p': 'pesado', 'deadlift-1p': 'pesado',
  'trx-power-pull': 'pesado', 'horizontal-pull-alt': 'pesado', 'kb-floor-press-1m': 'pesado',
  'lateral-lunge-goblet': 'pesado', 'roll-out-wheel': 'dinamico', 'box-step-up': 'pesado', 'cossack-squat': 'pesado',

  // Isométricos
  'wall-sit': 'isometrico', 'spanish-squat': 'isometrico', 'split-squat-hold': 'isometrico',
  'copenhagen-plank': 'isometrico', 'side-plank': 'isometrico', 'hollow-hold': 'isometrico',
  'single-leg-balance': 'isometrico', 'deep-squat-hold': 'isometrico',
  'bottom-up-carry': 'isometrico', 'waiter-carry': 'isometrico',
  // Los aterrizajes producen y absorben fuerza rápido: son balísticos, no isométricos
  'split-squat-iso-catch': 'balistico', 'lateral-drop-1p': 'balistico',

  // Balísticos
  'box-jump': 'balistico', 'broad-jump': 'balistico', 'drop-jump': 'balistico',
  'lateral-bound': 'balistico', 'skater-jump': 'balistico', 'pogo-jump': 'balistico',
  'mb-slam': 'balistico', 'rotational-mb-throw': 'balistico', 'mb-rotational-slam': 'balistico',
  'push-press': 'balistico', 'hang-power-clean': 'balistico', 'kb-swing': 'balistico',
  'kb-clean': 'balistico', 'sprint': 'balistico', 'hill-sprint': 'balistico',
  'shuttle-run': 'balistico', 'bounding': 'balistico',

  // Tejido y control lento
  'step-down': 'dinamico', 'reverse-nordic': 'dinamico', 'nordic-curl': 'isometrico',
  'soleus-raise': 'tejido', 'tibialis-raise': 'tejido', 'foot-activation': 'tejido',
  'jefferson-curl': 'tejido', 'hip-airplane': 'dinamico',
};

export const qualityOf = (exerciseId: string): Quality => {
  const explicit = EXPLICIT[exerciseId];
  if (explicit) return explicit;
  const ex = getExercise(exerciseId);
  if (ex.capacities.includes('Isometría')) return 'isometrico';
  if (ex.capacities.includes('Potencia') || ex.capacities.includes('Velocidad')) return 'balistico';
  if (ex.capacities.includes('Fuerza máxima')) return 'pesado';
  if (ex.capacities.includes('Tendón') || ex.capacities.includes('Movilidad')) return 'tejido';
  return 'dinamico';
};

/**
 * ¿Es un tri-set de contraste? Mismo patrón, cualidades distintas.
 * Si las tres son la misma cualidad, ahí sí es acumular volumen sin criterio.
 */
export const isContrastSet = (exerciseIds: string[]): boolean => {
  if (exerciseIds.length < 2) return false;
  const qualities = new Set(exerciseIds.map(qualityOf));
  return qualities.size >= 2;
};

export const untagged = (): string[] =>
  EXERCISES.filter((e) => !EXPLICIT[e.id] && qualityOf(e.id) === 'dinamico').map((e) => e.id);
