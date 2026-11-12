import type { BlockFormat, ExercisePrescription, ScoreType, WorkoutBlock } from '../types';

const p = (exerciseId: string, extra: Partial<ExercisePrescription> = {}): ExercisePrescription => ({
  exerciseId,
  ...extra,
});

interface BlockDraft {
  kind: WorkoutBlock['kind'];
  index: number;
  title: string;
  minutes: number;
  format: BlockFormat;
  formatLabel: string;
  focus?: string;
  rounds?: number;
  capMinutes?: number;
  work?: number;
  pause?: number;
  rest?: string;
  scoreType?: ScoreType;
  scoreHint?: string;
  items: ExercisePrescription[];
}

export const mk = (id: string, d: BlockDraft): WorkoutBlock => ({
  id: `${id}-${d.kind}`,
  duration: `${d.minutes} min`,
  ...d,
});

// ═══════════════════════ BLOQUE 1 · ZONA MEDIA ═══════════════════════
/**
 * 7-9 minutos, 3-4 ejercicios. Nunca al fallo: prepara para el resto de la sesión.
 * Cubre antiextensión, antirrotación, antiflexión lateral y rotación controlada.
 */
export const ZONA_MEDIA: BlockDraft[] = [
  {
    kind: 'zona-media', index: 1, title: 'Zona media', minutes: 8,
    format: 'rounds', formatLabel: '3 vueltas', rounds: 3, rest: '45 s entre vueltas',
    focus: 'Antiextensión y estabilidad de cadera',
    items: [
      p('ab-wheel', { reps: '8' }),
      p('copenhagen-plank', { duration: '20 s', unilateral: true, isometric: true }),
      p('dead-bug', { reps: '8', unilateral: true, instructions: 'Con banda anclada detrás.' }),
      p('glute-bridge-single', { reps: '10', unilateral: true }),
    ],
  },
  {
    kind: 'zona-media', index: 1, title: 'Zona media', minutes: 7,
    format: 'amrap', formatLabel: 'AMRAP 7 min', capMinutes: 7,
    focus: 'Control escapular y antirrotación',
    scoreType: 'rounds-reps', scoreHint: 'Rondas completas + repeticiones',
    items: [
      p('trx-body-saw', { reps: '10' }),
      p('side-plank-rotation', { reps: '6', unilateral: true }),
      p('bear-plank-tap', { reps: '10', unilateral: true }),
      p('pallof-press', { reps: '8', unilateral: true }),
    ],
  },
  {
    kind: 'zona-media', index: 1, title: 'Zona media', minutes: 8,
    format: 'rounds', formatLabel: '3 vueltas', rounds: 3, rest: '40 s entre vueltas',
    focus: 'Estabilidad lumbopélvica para correr',
    items: [
      p('dead-bug', { reps: '8', unilateral: true }),
      p('side-plank', { duration: '25 s', unilateral: true, isometric: true }),
      p('bird-dog', { reps: '8', unilateral: true }),
      p('soleus-raise', { duration: '25 s', isometric: true, instructions: 'Isométrico, no repeticiones.' }),
    ],
  },
  {
    kind: 'zona-media', index: 1, title: 'Zona media', minutes: 8,
    format: 'rounds', formatLabel: '3 vueltas', rounds: 3, rest: '45 s entre vueltas',
    focus: 'Rotación controlada y cadera',
    items: [
      p('pallof-press', { reps: '10', unilateral: true }),
      p('side-plank-rotation', { reps: '8', unilateral: true }),
      p('hip-airplane', { reps: '5', unilateral: true }),
      p('dead-bug', { reps: '8', unilateral: true, instructions: 'Con banda.' }),
    ],
  },
  {
    kind: 'zona-media', index: 1, title: 'Zona media', minutes: 7,
    format: 'amrap', formatLabel: 'AMRAP 7 min', capMinutes: 7,
    focus: 'Transferencia de fuerza',
    scoreType: 'rounds-reps', scoreHint: 'Rondas completas + repeticiones',
    items: [
      p('ab-wheel', { reps: '6' }),
      p('bear-crawl', { distance: '10 m' }),
      p('copenhagen-plank', { duration: '15 s', unilateral: true, isometric: true }),
      p('glute-bridge-single', { reps: '10', unilateral: true }),
    ],
  },
  {
    kind: 'zona-media', index: 1, title: 'Zona media', minutes: 8,
    format: 'rounds', formatLabel: '4 vueltas', rounds: 4, rest: '30 s entre vueltas',
    focus: 'Antiextensión con TRX',
    items: [
      p('trx-fallout', { reps: '8' }),
      p('hollow-hold', { duration: '25 s', isometric: true }),
      p('bear-plank-tap', { reps: '8', unilateral: true }),
    ],
  },
];

// ═══════════════════════ BLOQUE 3 · ATLETA ═══════════════════════
/** 10-12 min, circuito de 3-4 ejercicios. Explosivo antes de que la técnica caiga. */
export const ATLETA: BlockDraft[] = [
  {
    kind: 'atleta', index: 3, title: 'Atleta', minutes: 11,
    format: 'rounds', formatLabel: '3 vueltas', rounds: 3, rest: '75 s entre vueltas',
    focus: 'Plano frontal y potencia de cadera',
    items: [
      p('lateral-bound', { reps: '6', unilateral: true }),
      p('kb-swing', { reps: '12', load: 'KB 20 kg' }),
      p('hip-airplane', { reps: '5', unilateral: true }),
      p('pogo-jump', { reps: '20' }),
    ],
  },
  {
    kind: 'atleta', index: 3, title: 'Atleta', minutes: 11,
    format: 'rounds', formatLabel: '3 vueltas', rounds: 3, rest: '75 s entre vueltas',
    focus: 'Rotación y tracción unilateral',
    items: [
      p('rotational-mb-throw', { reps: '5', unilateral: true, load: 'Balón 5 kg' }),
      p('trx-power-pull', { reps: '6', unilateral: true }),
      p('suitcase-carry', { distance: '25 m', unilateral: true, carry: true, load: 'KB 20 kg' }),
      p('lateral-bound', { reps: '5', unilateral: true, instructions: 'Aterrizaje estable de 1 s.' }),
    ],
  },
  {
    kind: 'atleta', index: 3, title: 'Atleta', minutes: 11,
    format: 'rounds', formatLabel: '3 vueltas', rounds: 3, rest: '60 s entre vueltas',
    focus: 'Mecánica de carrera y cambio de dirección',
    items: [
      p('skipping', { distance: '20 m' }),
      p('pogo-jump', { reps: '20' }),
      p('sprint', { distance: '20 m', instructions: 'Aceleración progresiva, no salida máxima.' }),
      p('single-leg-rdl', { reps: '8', unilateral: true, load: 'KB 20 kg' }),
    ],
  },
  {
    kind: 'atleta', index: 3, title: 'Atleta', minutes: 12,
    format: 'rounds', formatLabel: '3 vueltas', rounds: 3, rest: '75 s entre vueltas',
    focus: 'Potencia rotacional y desaceleración',
    items: [
      p('rotational-mb-throw', { reps: '5', unilateral: true, load: 'Balón 5 kg' }),
      p('lateral-bound', { reps: '5', unilateral: true, instructions: 'Sostener 1 s el aterrizaje.' }),
      p('bottom-up-carry', { distance: '20 m', unilateral: true, carry: true, load: 'KB 12 kg' }),
      p('sprint', { distance: '20 m' }),
    ],
  },
  {
    kind: 'atleta', index: 3, title: 'Atleta', minutes: 12,
    format: 'rounds', formatLabel: '3 vueltas', rounds: 3, rest: '90 s entre vueltas',
    focus: 'Salto, rotación y cambio de dirección',
    items: [
      p('box-jump', { reps: '4' }),
      p('mb-rotational-slam', { reps: '6', unilateral: true, load: 'Balón 10 kg' }),
      p('suitcase-carry', { distance: '25 m', unilateral: true, carry: true, load: 'KB 20 kg' }),
      p('shuttle-run', { distance: '10 + 10 m' }),
    ],
  },
  {
    kind: 'atleta', index: 3, title: 'Atleta', minutes: 11,
    format: 'rounds', formatLabel: '3 vueltas', rounds: 3, rest: '75 s entre vueltas',
    focus: 'Unipodal y absorción de impacto',
    items: [
      p('skater-jump', { duration: '20 s' }),
      p('single-leg-rdl', { reps: '8', unilateral: true, load: 'KB 20 kg' }),
      p('drop-jump', { reps: '4', instructions: 'Aterrizaje silencioso.' }),
      p('farmer-carry', { distance: '30 m', carry: true, load: 'KB 20 kg por mano' }),
    ],
  },
  {
    kind: 'atleta', index: 3, title: 'Atleta', minutes: 11,
    format: 'rounds', formatLabel: '3 vueltas', rounds: 3, rest: '75 s entre vueltas',
    focus: 'Salto y carry sin correr',
    items: [
      p('broad-jump', { reps: '4' }),
      p('waiter-carry', { distance: '20 m', unilateral: true, carry: true, load: 'KB 12 kg' }),
      p('cossack-squat', { reps: '6', unilateral: true }),
      p('mb-slam', { reps: '8', load: 'Balón 10 kg' }),
    ],
  },
  {
    kind: 'atleta', index: 3, title: 'Atleta', minutes: 11,
    format: 'rounds', formatLabel: '3 vueltas', rounds: 3, rest: '75 s entre vueltas',
    focus: 'Kettlebell y coordinación',
    items: [
      p('kb-clean', { reps: '6', unilateral: true, load: 'KB 20 kg' }),
      p('cossack-squat', { reps: '6', unilateral: true }),
      p('carioca', { distance: '20 m', unilateral: true }),
      p('waiter-carry', { distance: '20 m', unilateral: true, carry: true, load: 'KB 12 kg' }),
    ],
  },
  {
    kind: 'atleta', index: 3, title: 'Atleta', minutes: 12,
    format: 'rounds', formatLabel: '4 vueltas', rounds: 4, rest: '60 s entre vueltas',
    focus: 'Reactividad lateral para surf',
    items: [
      p('lateral-bound', { reps: '6', unilateral: true }),
      p('bear-crawl', { distance: '12 m' }),
      p('bottom-up-carry', { distance: '20 m', unilateral: true, carry: true, load: 'KB 12 kg' }),
      p('pogo-jump', { reps: '20' }),
    ],
  },
  {
    kind: 'atleta', index: 3, title: 'Atleta', minutes: 11,
    format: 'rounds', formatLabel: '3 vueltas', rounds: 3, rest: '75 s entre vueltas',
    focus: 'Base atlética y antirrotación',
    items: [
      p('single-leg-rdl', { reps: '8', unilateral: true, load: 'KB 20 kg' }),
      p('pallof-press', { reps: '10', unilateral: true }),
      p('suitcase-carry', { distance: '25 m', unilateral: true, carry: true, load: 'KB 20 kg' }),
      p('copenhagen-plank', { duration: '20 s', unilateral: true, isometric: true }),
    ],
  },
  {
    kind: 'atleta', index: 3, title: 'Atleta', minutes: 11,
    format: 'rounds', formatLabel: '3 vueltas', rounds: 3, rest: '75 s entre vueltas',
    focus: 'Surf · hombro, gateo y estabilidad',
    items: [
      p('bear-crawl', { distance: '15 m' }),
      p('trx-power-pull', { reps: '6', unilateral: true }),
      p('bottom-up-carry', { distance: '20 m', unilateral: true, carry: true, load: 'KB 12 kg' }),
      p('side-plank', { duration: '30 s', unilateral: true, isometric: true }),
    ],
  },
  {
    kind: 'atleta', index: 3, title: 'Atleta', minutes: 12,
    format: 'rounds', formatLabel: '3 vueltas', rounds: 3, rest: '75 s entre vueltas',
    focus: 'Golf · rotación y frenado',
    items: [
      p('rotational-mb-throw', { reps: '5', unilateral: true, load: 'Balón 5 kg' }),
      p('hip-airplane', { reps: '6', unilateral: true }),
      p('suitcase-carry', { distance: '25 m', unilateral: true, carry: true, load: 'KB 20 kg' }),
      p('lateral-bound', { reps: '5', unilateral: true, instructions: 'Sostener 1 s el aterrizaje.' }),
    ],
  },
  {
    kind: 'atleta', index: 3, title: 'Atleta', minutes: 11,
    format: 'rounds', formatLabel: '3 vueltas', rounds: 3, rest: '60 s entre vueltas',
    focus: 'Running · pie, elasticidad y postura',
    items: [
      p('skipping', { distance: '20 m' }),
      p('pogo-jump', { reps: '20' }),
      p('soleus-raise', { reps: '20' }),
      p('single-leg-balance', { duration: '30 s', unilateral: true, isometric: true }),
    ],
  },
  {
    kind: 'atleta', index: 3, title: 'Atleta', minutes: 12,
    format: 'rounds', formatLabel: '4 vueltas', rounds: 4, rest: '75 s entre vueltas',
    focus: 'Potencia horizontal y cambio de dirección',
    items: [
      p('broad-jump', { reps: '4' }),
      p('shuttle-run', { distance: '10 + 10 m' }),
      p('kb-clean', { reps: '5', unilateral: true, load: 'KB 20 kg' }),
      p('pallof-press', { reps: '8', unilateral: true }),
    ],
  },
  {
    kind: 'atleta', index: 3, title: 'Atleta', minutes: 11,
    format: 'rounds', formatLabel: '3 vueltas', rounds: 3, rest: '75 s entre vueltas',
    focus: 'Potencia rotacional aplicada',
    items: [
      p('mb-rotational-slam', { reps: '6', unilateral: true, load: 'Balón 10 kg' }),
      p('single-leg-rdl', { reps: '8', unilateral: true, load: 'KB 20 kg' }),
      p('waiter-carry', { distance: '20 m', unilateral: true, carry: true, load: 'KB 12 kg' }),
      p('cossack-squat', { reps: '6', unilateral: true }),
    ],
  },
  {
    kind: 'atleta', index: 3, title: 'Atleta', minutes: 10,
    format: 'rounds', formatLabel: '2 vueltas', rounds: 2, rest: '90 s entre vueltas',
    focus: 'Descarga · cierre de ciclo',
    items: [
      p('single-leg-balance', { duration: '40 s', unilateral: true, isometric: true }),
      p('pallof-press', { reps: '10', unilateral: true }),
      p('farmer-carry', { distance: '30 m', carry: true, load: 'Moderado' }),
      p('nasal-breathing', { duration: '90 s' }),
    ],
  },
];

// Siete estímulos de motor del ZIP, traducidos al equipamiento disponible.
export const ENGINE: BlockDraft[] = [
  {
    kind: 'outdoor', index: 1, title: 'Engine · intervalos', minutes: 30,
    format: 'intervals', formatLabel: '10 × 20″ fuerte / 40″ suave', rounds: 10,
    focus: 'Potencia aeróbica sin esfuerzo máximo',
    scoreType: 'distance', scoreHint: 'Distancia o vatios medios',
    items: [p('bike-sprint', { sets: 10, duration: '20 s fuerte / 40 s suave', rpe: '8' })],
  },
  {
    kind: 'outdoor', index: 1, title: 'Engine · Zona 2', minutes: 40,
    format: 'sets', formatLabel: 'Continuo conversacional',
    focus: 'Base aeróbica',
    scoreType: 'distance', scoreHint: 'Distancia o tiempo total',
    items: [p('zone2-run', { duration: '40 min', rpe: '5' })],
  },
  {
    kind: 'outdoor', index: 1, title: 'Engine · umbral', minutes: 35,
    format: 'intervals', formatLabel: '4 × 6 min · 2 min suave', rounds: 4,
    focus: 'Umbral controlado',
    scoreType: 'distance', scoreHint: 'Distancia o ritmo medio',
    items: [p('threshold-run', { sets: 4, duration: '6 min', rest: '2 min trote', rpe: '7' })],
  },
  {
    kind: 'outdoor', index: 1, title: 'Engine · descarga', minutes: 30,
    format: 'sets', formatLabel: 'Zona 2 suave',
    focus: 'Recuperar sin perder continuidad',
    items: [p('bike-zone2', { duration: '30 min', rpe: '4–5' })],
  },
  {
    kind: 'outdoor', index: 1, title: 'Engine · tempo', minutes: 30,
    format: 'sets', formatLabel: '20–25 min continuos',
    focus: 'Ritmo sostenible y economía',
    scoreType: 'distance', scoreHint: 'Distancia o ritmo medio',
    items: [p('tempo-run', { duration: '25 min', rpe: '6–7' })],
  },
  {
    kind: 'outdoor', index: 1, title: 'Engine · cambios', minutes: 35,
    format: 'intervals', formatLabel: '8 × 2′ fuerte / 1′ suave', rounds: 8,
    focus: 'Tolerancia a cambios de ritmo',
    scoreType: 'distance', scoreHint: 'Distancia o vatios medios',
    items: [p('bike-sprint', { sets: 8, duration: '2 min fuerte / 1 min suave', rpe: '8' })],
  },
  {
    kind: 'outdoor', index: 1, title: 'Engine · progresivo', minutes: 40,
    format: 'sets', formatLabel: 'Suave → sostenido',
    focus: 'Cerrar más rápido sin sprintar',
    scoreType: 'distance', scoreHint: 'Distancia o ritmo medio',
    items: [p('zone2-run', { duration: '40 min', rpe: '5–7', instructions: 'Subí el ritmo cada 10 minutos.' })],
  },
];

// ═══════════════════════ BLOQUE 4 · FINISHER ═══════════════════════
/** 8-12 min, RPE 8-9, obligatorio, medible y distinto cada día. */
export const FINISHERS: BlockDraft[] = [
  {
    kind: 'finisher', index: 4, title: 'Finisher', minutes: 9,
    format: 'amrap', formatLabel: 'AMRAP 9 min', capMinutes: 9,
    focus: 'Piernas y pulsaciones',
    scoreType: 'rounds-reps', scoreHint: 'Rondas + repeticiones de la ronda incompleta',
    items: [
      p('goblet-squat', { reps: '10', load: 'KB 20 kg' }),
      p('mb-slam', { reps: '10', load: 'Balón 10 kg' }),
      p('box-step-up', { reps: '8', unilateral: true }),
      p('jump-rope', { reps: '40 saltos' }),
    ],
  },
  {
    kind: 'finisher', index: 4, title: 'Finisher', minutes: 11,
    format: 'for-time', formatLabel: '4 vueltas por tiempo', rounds: 4,
    focus: 'Tren superior bajo fatiga',
    scoreType: 'time', scoreHint: 'Tiempo total',
    items: [
      p('trx-row', { reps: '10' }),
      p('push-up', { reps: '10' }),
      p('kb-swing', { reps: '12', load: 'KB 20 kg' }),
      p('jump-rope', { reps: '50 saltos' }),
    ],
  },
  {
    kind: 'finisher', index: 4, title: 'Finisher', minutes: 10,
    format: 'intervals', formatLabel: 'Sprint intervals · 10 vueltas', rounds: 10, work: 20, pause: 40,
    focus: 'Motor de carrera',
    scoreType: 'distance', scoreHint: 'Distancia total recorrida',
    items: [
      p('sprint', { duration: '20 s fuerte', instructions: '40 s caminando entre repeticiones.' }),
    ],
  },
  {
    kind: 'finisher', index: 4, title: 'Finisher', minutes: 8,
    format: 'tabata-express', formatLabel: 'Tabata Express · 40/20 · 2 vueltas',
    rounds: 2, work: 40, pause: 20,
    focus: 'Cuatro estaciones, ocho minutos',
    scoreType: 'reps', scoreHint: 'Repeticiones totales de la última vuelta',
    items: [
      p('mb-slam', { duration: '40 s', load: 'Balón 10 kg' }),
      p('mountain-climber', { duration: '40 s' }),
      p('jump-rope', { duration: '40 s' }),
      p('kb-swing', { duration: '40 s', load: 'KB 20 kg' }),
    ],
  },
  {
    kind: 'finisher', index: 4, title: 'Finisher', minutes: 10,
    format: 'amrap', formatLabel: 'AMRAP 10 min', capMinutes: 10,
    focus: 'Full body',
    scoreType: 'rounds-reps', scoreHint: 'Rondas + repeticiones',
    items: [
      p('burpee', { reps: '8' }),
      p('kb-swing', { reps: '12', load: 'KB 20 kg' }),
      p('reverse-lunge-mb', { reps: '10', unilateral: true, load: 'Balón 5 kg' }),
      p('trx-row', { reps: '8' }),
      p('jump-rope', { reps: '50 saltos' }),
    ],
  },
  {
    kind: 'finisher', index: 4, title: 'Finisher', minutes: 12,
    format: 'chipper', formatLabel: 'Chipper · una sola vuelta',
    focus: 'De arriba abajo sin parar',
    scoreType: 'time', scoreHint: 'Tiempo total',
    items: [
      p('jump-rope', { reps: '100 saltos' }),
      p('kb-swing', { reps: '40', load: 'KB 20 kg' }),
      p('reverse-lunge', { reps: '30', unilateral: true }),
      p('burpee', { reps: '20' }),
      p('mb-slam', { reps: '10', load: 'Balón 10 kg' }),
      p('sprint', { distance: '200 m' }),
    ],
  },
  {
    kind: 'finisher', index: 4, title: 'Finisher', minutes: 10,
    format: 'for-time', formatLabel: '3 vueltas por tiempo', rounds: 3,
    focus: 'Carrera y fuerza mezcladas',
    scoreType: 'time', scoreHint: 'Tiempo total',
    items: [
      p('sprint', { distance: '200 m' }),
      p('goblet-squat', { reps: '12', load: 'KB 20 kg' }),
      p('push-up', { reps: '10' }),
      p('trx-row', { reps: '8' }),
    ],
  },
  {
    kind: 'finisher', index: 4, title: 'Finisher', minutes: 9,
    format: 'amrap', formatLabel: 'AMRAP 9 min', capMinutes: 9,
    focus: 'Kettlebell y soga',
    scoreType: 'rounds-reps', scoreHint: 'Rondas + repeticiones',
    items: [
      p('kb-clean', { reps: '6', unilateral: true, load: 'KB 20 kg' }),
      p('box-step-up', { reps: '8', unilateral: true }),
      p('mountain-climber', { duration: '30 s' }),
      p('jump-rope', { reps: '40 saltos' }),
    ],
  },
  {
    kind: 'finisher', index: 4, title: 'Finisher', minutes: 10,
    format: 'amrap', formatLabel: 'AMRAP 10 min', capMinutes: 10,
    focus: 'Sin soga ni swings: peso corporal y balón',
    scoreType: 'rounds-reps', scoreHint: 'Rondas + repeticiones',
    items: [
      p('burpee', { reps: '10' }),
      p('goblet-squat', { reps: '12', load: 'KB 20 kg' }),
      p('mountain-climber', { duration: '40 s' }),
      p('bear-crawl', { distance: '15 m' }),
    ],
  },
  {
    kind: 'finisher', index: 4, title: 'Finisher', minutes: 11,
    format: 'for-time', formatLabel: '3 vueltas por tiempo', rounds: 3,
    focus: 'Cambio de dirección bajo fatiga',
    scoreType: 'time', scoreHint: 'Tiempo total',
    items: [
      p('shuttle-run', { reps: '4', distance: '10 + 10 m' }),
      p('push-up', { reps: '12' }),
      p('reverse-lunge-mb', { reps: '10', unilateral: true, load: 'Balón 5 kg' }),
      p('ab-wheel', { reps: '8' }),
    ],
  },
  {
    kind: 'finisher', index: 4, title: 'Finisher', minutes: 8,
    format: 'tabata-express', formatLabel: 'Tabata Express · 40/20 · 2 vueltas',
    rounds: 2, work: 40, pause: 20,
    focus: 'Balón, cajón y suelo',
    scoreType: 'reps', scoreHint: 'Repeticiones totales de la última vuelta',
    items: [
      p('mb-rotational-slam', { duration: '40 s', load: 'Balón 10 kg' }),
      p('box-step-up', { duration: '40 s', unilateral: true }),
      p('bear-crawl', { duration: '40 s' }),
      p('burpee', { duration: '40 s' }),
    ],
  },
  {
    kind: 'finisher', index: 4, title: 'Finisher', minutes: 10,
    format: 'intervals', formatLabel: 'Cuestas · 8 repeticiones', rounds: 8, work: 12, pause: 60,
    focus: 'Potencia de carrera',
    scoreType: 'distance', scoreHint: 'Distancia de la última cuesta',
    items: [p('hill-sprint', { duration: '12 s', rest: 'Vuelta caminando' })],
  },
];

/** TABATA EXTENDIDO COMPLETO: sesión especial independiente, ~32 min. No entra en una sesión normal. */
export const TABATA_FULL: BlockDraft = {
  kind: 'finisher', index: 1, title: 'Tabata Extendido', minutes: 32,
  format: 'tabata-full', formatLabel: '8 ejercicios · 40/20 · 4 vueltas',
  rounds: 4, work: 40, pause: 20,
  focus: 'Sesión especial: 32 minutos de trabajo continuo',
  scoreType: 'reps', scoreHint: 'Repeticiones totales por ejercicio',
  items: [
    p('jump-rope', { duration: '40 s' }),
    p('kb-swing', { duration: '40 s', load: 'KB 20 kg' }),
    p('mountain-climber', { duration: '40 s' }),
    p('goblet-squat', { duration: '40 s', load: 'KB 20 kg' }),
    p('mb-slam', { duration: '40 s', load: 'Balón 10 kg' }),
    p('push-up', { duration: '40 s' }),
    p('reverse-lunge-mb', { duration: '40 s', load: 'Balón 5 kg' }),
    p('burpee', { duration: '40 s' }),
  ],
};

export type { BlockDraft };
