import type { BlockFormat, ExercisePrescription, ScoreType } from '../types';

/**
 * EL MES
 * ──────
 * Cuatro semanas explícitas. A diferencia de la versión anterior, acá no hay
 * generador: la rutina está escrita tal como se acordó, porque la estructura
 * la definió Paul y no tiene sentido que un motor la reinvente cada semana.
 *
 * Lo que sí varía por semana es el ESQUEMA de fuerza y la CARGA:
 *
 *   S1  3×8,6,6   carga base            RPE 7
 *   S2  3×8,6,6   tempo 3-1-1           RPE 7-8   (misma carga que S1)
 *   S3  4×6,4,4,4 +10 kg, una serie más RPE 8
 *   S4  2×6,6     descarga −20 kg       RPE 6     + test del mes
 *
 * LÍMITE DE LA BARRA: con 2×20 + 2×10 + 2×5 las únicas cargas posibles son
 * 20/30/40/50/60/70/80/90 kg. El salto mínimo es 10 kg y el techo son 90.
 * Por eso las semanas 1 y 2 comparten carga y se diferencian por tempo.
 */

export const LOADABLE = [20, 30, 40, 50, 60, 70, 80, 90] as const;

export interface WeekScheme {
  week: number;
  name: string;
  sets: number;
  reps: string;
  rpe: string;
  /** Delta sobre la carga base de la semana 1. */
  loadDelta: number;
  tempo?: string;
  note: string;
}

export interface TrainingPhase {
  id: number;
  name: string;
  weeks: [number, number];
  focus: string;
  strength: { sets: number; reps: string; rpe: string; rest: string };
  power: { sets: number; reps: string; rest: string; intent: string };
  accessoryReps: string;
  coachNote: string;
}

/**
 * Cuatro bloques de cuatro semanas. El primer mes conserva exactamente la
 * progresión ya acordada; los meses siguientes cambian el estímulo, no el
 * calendario ni los IDs de las sesiones.
 */
export const TRAINING_PHASES: TrainingPhase[] = [
  {
    id: 1, name: 'Ciclo 1 · Referencia', weeks: [1, 4],
    focus: 'Aprender la semana y establecer la primera marca HYROX Home.',
    strength: { sets: 4, reps: '6–8', rpe: '7', rest: '90–120 s' },
    power: { sets: 3, reps: '4–6', rest: '60 s', intent: 'Rápido y limpio' },
    accessoryReps: '10–12',
    coachNote: 'Repetí la estructura sin cambiar repeticiones del benchmark.',
  },
  {
    id: 2, name: 'Ciclo 2 · Acumulación', weeks: [5, 8],
    focus: 'Consolidar cargas, técnica y tolerancia al trabajo semanal.',
    strength: { sets: 5, reps: '5–6', rpe: '7–8', rest: '2 min' },
    power: { sets: 4, reps: '3–5', rest: '75 s', intent: 'Velocidad con carga moderada' },
    accessoryReps: '8–10',
    coachNote: 'Compará cargas y sensaciones con el primer ciclo.',
  },
  {
    id: 3, name: 'Ciclo 3 · Consolidación', weeks: [9, 12],
    focus: 'Sostener fuerza y mejorar la ejecución de intervalos y estaciones.',
    strength: { sets: 4, reps: '4–5', rpe: '8', rest: '2–3 min' },
    power: { sets: 4, reps: '3–5', rest: '60–75 s', intent: 'Máxima intención' },
    accessoryReps: '8–10',
    coachNote: 'Mantené las repeticiones fijas para que la comparación sea válida.',
  },
  {
    id: 4, name: 'Ciclo 4 · Comparación', weeks: [13, 16],
    focus: 'Cerrar el período comparando cargas y benchmark con el punto inicial.',
    strength: { sets: 4, reps: '4–6', rpe: '7–8', rest: '2 min' },
    power: { sets: 4, reps: '3–5', rest: '60–75 s', intent: 'Potencia aplicada' },
    accessoryReps: '8–12',
    coachNote: 'Buscá progreso sin cambiar el formato ni sacrificar técnica.',
  },
];

export const phaseForWeek = (week: number): TrainingPhase =>
  TRAINING_PHASES[Math.min(TRAINING_PHASES.length - 1, Math.max(0, Math.floor((week - 1) / 4)))]!;

export const SCHEMES: WeekScheme[] = [
  {
    week: 1,
    name: 'Introducción',
    sets: 3,
    reps: '8,6,6',
    rpe: '7',
    loadDelta: 0,
    note: 'Carga base. Terminá cada serie sintiendo que te quedaban tres repeticiones.',
  },
  {
    week: 2,
    name: 'Tempo',
    sets: 3,
    reps: '8,6,6',
    rpe: '7–8',
    loadDelta: 0,
    tempo: '3-1-1',
    note: 'Misma carga que la semana pasada. Lo que cambia es la bajada: 3 segundos, 1 de pausa. Va a costar bastante más con el mismo peso.',
  },
  {
    week: 3,
    name: 'Carga',
    sets: 4,
    reps: '6,4,4,4',
    rpe: '8',
    loadDelta: 10,
    note: 'La semana pesada del mes. Diez kilos más y una serie más, sin tempo: foco en mover la carga.',
  },
  {
    week: 4,
    name: 'Descarga y test',
    sets: 2,
    reps: '6,6',
    rpe: '6',
    loadDelta: -10,
    note: 'Bajás la carga para consolidar. Tiene que sentirse fácil: es intencional. El sábado es el test del mes.',
  },
  {
    week: 5,
    name: 'Build · volumen',
    sets: 4,
    reps: '6,6,5,5',
    rpe: '7',
    loadDelta: 0,
    note: 'Arranca Build: más series de calidad, dejando dos repeticiones en reserva.',
  },
  {
    week: 6,
    name: 'Build · pausa',
    sets: 4,
    reps: '6,6,5,5',
    rpe: '7–8',
    loadDelta: 0,
    tempo: '2-1-X',
    note: 'La pausa abajo construye posición y control antes de sumar carga.',
  },
  {
    week: 7,
    name: 'Build · carga',
    sets: 5,
    reps: '5,5,5,4,4',
    rpe: '8',
    loadDelta: 10,
    note: 'Semana fuerte de Build: la técnica manda; no se persigue una repetición fea.',
  },
  {
    week: 8,
    name: 'Build · descarga',
    sets: 3,
    reps: '5,5,5',
    rpe: '6',
    loadDelta: -10,
    note: 'Descarga: guardá piernas y hombros para que la potencia vuelva a subir.',
  },
  {
    week: 9,
    name: 'Athletic · fuerza rápida',
    sets: 4,
    reps: '5,5,4,4',
    rpe: '7',
    loadDelta: 0,
    note: 'Mové cada repetición con intención rápida; cortá antes de perder velocidad.',
  },
  {
    week: 10,
    name: 'Athletic · control',
    sets: 4,
    reps: '5,4,4,4',
    rpe: '7–8',
    tempo: '2-0-X',
    loadDelta: 0,
    note: 'Bajada controlada, subida explosiva: fuerza que se convierte en movimiento.',
  },
  {
    week: 11,
    name: 'Athletic · intensidad',
    sets: 5,
    reps: '3,3,3,3,3',
    rpe: '8',
    loadDelta: 10,
    note: 'Pocas repeticiones y descansos completos: potencia sin fatiga técnica.',
  },
  {
    week: 12,
    name: 'Athletic · descarga',
    sets: 3,
    reps: '4,4,4',
    rpe: '6',
    loadDelta: -10,
    note: 'Bajá el volumen. Conservá velocidad y salí con ganas de más.',
  },
  {
    week: 13,
    name: 'Surf + Golf · transferencia',
    sets: 4,
    reps: '5,5,5,4',
    rpe: '7',
    loadDelta: 0,
    note: 'Fuerza estable y limpia para transferirla a rotación, remada y cambio de dirección.',
  },
  {
    week: 14,
    name: 'Surf + Golf · posición',
    sets: 4,
    reps: '5,5,4,4',
    rpe: '7–8',
    tempo: '2-1-X',
    loadDelta: 0,
    note: 'Sostené las posiciones que después necesitás expresar rápido en el deporte.',
  },
  {
    week: 15,
    name: 'Surf + Golf · potencia',
    sets: 5,
    reps: '4,4,3,3,3',
    rpe: '8',
    loadDelta: 10,
    note: 'Última semana alta: calidad por encima de volumen, con potencia limpia.',
  },
  {
    week: 16,
    name: 'Surf + Golf · descarga',
    sets: 2,
    reps: '5,5',
    rpe: '6',
    loadDelta: -10,
    note: 'Cerrá el bloque fresco: movilidad, motor suave y técnica antes del próximo ciclo.',
  },
];

export const schemeFor = (week: number): WeekScheme => SCHEMES[(week - 1) % SCHEMES.length]!;

/** Ajusta una carga base al esquema de la semana, respetando los discos reales. */
export const loadFor = (base: number, week: number): number => {
  const target = base + schemeFor(week).loadDelta;
  return [...LOADABLE].reduce((best, l) => (Math.abs(l - target) < Math.abs(best - target) ? l : best), 20);
};

export interface BlockSpec {
  kind: 'zona-media' | 'fuerza' | 'atleta' | 'finisher' | 'outdoor' | 'recovery' | 'transicion';
  intensity?: 'suave' | 'sostenido' | 'fuerte';
  goal?: string;
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

const p = (exerciseId: string, extra: Partial<ExercisePrescription> = {}): ExercisePrescription => ({
  exerciseId,
  ...extra,
});

// ═══════════════════════ CORE — 4 vueltas ═══════════════════════
const CORE_MON: BlockSpec = {
  kind: 'zona-media', index: 1, title: 'Core', minutes: 8,
  format: 'rounds', formatLabel: '4 vueltas', rounds: 4, rest: '45 s entre vueltas',
  focus: 'Antiextensión y cadera',
  items: [
    p('ab-wheel', { reps: '8' }),
    p('copenhagen-plank', { duration: '20 s', unilateral: true, isometric: true }),
    p('dead-bug', { reps: '8', unilateral: true, instructions: 'Con banda anclada detrás.' }),
    p('glute-bridge-single', { reps: '10', unilateral: true }),
  ],
};

const CORE_WED: BlockSpec = {
  kind: 'zona-media', index: 1, title: 'Core', minutes: 8,
  format: 'rounds', formatLabel: '4 vueltas', rounds: 4, rest: '45 s entre vueltas',
  focus: 'Antirrotación y control escapular',
  items: [
    p('trx-body-saw', { reps: '10' }),
    p('side-plank-rotation', { reps: '6', unilateral: true }),
    p('bear-plank-tap', { reps: '10', unilateral: true }),
    p('pallof-press', { reps: '8', unilateral: true }),
  ],
};

const CORE_FRI: BlockSpec = {
  kind: 'zona-media', index: 1, title: 'Core', minutes: 8,
  format: 'rounds', formatLabel: '4 vueltas', rounds: 4, rest: '45 s entre vueltas',
  focus: 'Antiextensión y plano frontal',
  items: [
    p('roll-out-wheel', { reps: '10' }),
    p('side-plank-run', { duration: '10 s', unilateral: true }),
    p('bird-dog', { reps: '8', unilateral: true }),
    p('hollow-hold', { duration: '25 s', isometric: true }),
  ],
};

// ═══════════════════════ HÍBRIDOS — rotan por semana ═══════════════════════
export const HYBRIDS: Record<number, BlockSpec[]> = {
  // Lunes
  1: [
    {
      kind: 'finisher', index: 4, title: 'Híbrido', minutes: 12,
      format: 'tabata-full', formatLabel: '50″/10″ · 6 estaciones · 2 vueltas',
      rounds: 2, work: 50, pause: 10,
      focus: 'Sin barra: cero cambio de discos con pulsaciones altas',
      scoreType: 'reps', scoreHint: 'Repeticiones totales de la última vuelta',
      items: [
        p('wall-ball', { duration: '50 s', load: 'Balón 5 kg' }),
        p('box-jump', { duration: '50 s' }),
        p('goblet-squat', { duration: '50 s', load: 'KB 20 kg' }),
        p('reverse-lunge-mb', { duration: '50 s', load: 'KB 12 kg' }),
        p('farmer-march', { duration: '50 s', load: 'KB 20 kg' }),
        p('sprint', { duration: '50 s', instructions: 'Trote fuerte, no sprint máximo.' }),
      ],
    },
    {
      kind: 'finisher', index: 4, title: 'Híbrido', minutes: 12,
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
      kind: 'finisher', index: 4, title: 'Híbrido', minutes: 12,
      format: 'tabata-full', formatLabel: '50″/10″ · 6 estaciones · 2 vueltas',
      rounds: 2, work: 50, pause: 10,
      focus: 'Mismo formato que la semana 1: comparás repeticiones',
      scoreType: 'reps', scoreHint: 'Repeticiones totales de la última vuelta',
      items: [
        p('wall-ball', { duration: '50 s', load: 'Balón 5 kg' }),
        p('box-jump', { duration: '50 s' }),
        p('goblet-squat', { duration: '50 s', load: 'KB 20 kg' }),
        p('reverse-lunge-mb', { duration: '50 s', load: 'KB 12 kg' }),
        p('farmer-march', { duration: '50 s', load: 'KB 20 kg' }),
        p('sprint', { duration: '50 s' }),
      ],
    },
    {
      kind: 'finisher', index: 4, title: 'Híbrido', minutes: 6,
      format: 'tabata-full', formatLabel: '50″/10″ · 6 estaciones · 1 vuelta',
      rounds: 1, work: 50, pause: 10,
      focus: 'Descarga: una sola vuelta',
      scoreType: 'reps', scoreHint: 'Repeticiones totales',
      items: [
        p('wall-ball', { duration: '50 s', load: 'Balón 5 kg' }),
        p('box-jump', { duration: '50 s' }),
        p('goblet-squat', { duration: '50 s', load: 'KB 20 kg' }),
        p('reverse-lunge-mb', { duration: '50 s', load: 'KB 12 kg' }),
        p('farmer-march', { duration: '50 s', load: 'KB 20 kg' }),
        p('sprint', { duration: '50 s' }),
      ],
    },
  ],
  // Miércoles
  3: [
    {
      kind: 'finisher', index: 4, title: 'Híbrido', minutes: 12,
      format: 'amrap', formatLabel: 'AMRAP 12 min', capMinutes: 12,
      focus: 'Full body',
      scoreType: 'rounds-reps', scoreHint: 'Rondas + repeticiones',
      items: [
        p('kb-swing', { reps: '10', load: 'KB 20 kg' }),
        p('burpee', { reps: '8' }),
        p('mb-slam', { reps: '12', load: 'Balón 10 kg' }),
        p('jump-rope', { reps: '40 saltos' }),
      ],
    },
    {
      kind: 'finisher', index: 4, title: 'Híbrido', minutes: 12,
      format: 'chipper', formatLabel: 'Chipper · una vuelta',
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
      kind: 'finisher', index: 4, title: 'Híbrido · Bici', minutes: 12,
      format: 'for-time', formatLabel: '4 rondas por tiempo', rounds: 4,
      focus: 'Semana de más impacto: el motor sale de la bici, no del suelo',
      scoreType: 'time', scoreHint: 'Tiempo total',
      items: [
        p('bike-sprint', { duration: '45 s fuerte', rpe: '8–9' }),
        p('kb-swing', { reps: '10', load: 'KB 20 kg' }),
        p('burpee', { reps: '8' }),
        p('mb-slam', { reps: '10', load: 'Balón 10 kg' }),
      ],
    },
    {
      kind: 'finisher', index: 4, title: 'Híbrido', minutes: 6,
      format: 'amrap', formatLabel: 'AMRAP 6 min', capMinutes: 6,
      focus: 'Descarga',
      scoreType: 'rounds-reps', scoreHint: 'Rondas + repeticiones',
      items: [
        p('kb-swing', { reps: '10', load: 'KB 12 kg' }),
        p('mb-slam', { reps: '10', load: 'Balón 5 kg' }),
        p('jump-rope', { reps: '40 saltos' }),
      ],
    },
  ],
  // Viernes
  5: [
    {
      kind: 'finisher', index: 4, title: 'Híbrido', minutes: 14,
      format: 'for-time', formatLabel: 'Escalera 10-8-6-4-2 · 200 m entre escalones',
      focus: 'Volumen descendente con carrera',
      scoreType: 'time', scoreHint: 'Tiempo total',
      items: [
        p('goblet-squat', { reps: '10-8-6-4-2', load: 'KB 20 kg' }),
        p('push-up', { reps: '10-8-6-4-2' }),
        p('kb-clean', { reps: '10-8-6-4-2', unilateral: true, load: 'KB 20 kg' }),
        p('box-step-up', { reps: '10-8-6-4-2', unilateral: true }),
        p('sprint', { distance: '200 m', instructions: 'Entre cada escalón.' }),
      ],
    },
    {
      kind: 'finisher', index: 4, title: 'Híbrido', minutes: 14,
      format: 'chipper', formatLabel: 'Chipper · una vuelta',
      focus: 'Sin pausas',
      scoreType: 'time', scoreHint: 'Tiempo total',
      items: [
        p('wall-ball', { reps: '50', load: 'Balón 5 kg' }),
        p('box-step-up', { reps: '40', unilateral: true }),
        p('kb-swing', { reps: '30', load: 'KB 20 kg' }),
        p('burpee', { reps: '20' }),
        p('sprint', { distance: '400 m' }),
      ],
    },
    {
      kind: 'finisher', index: 4, title: 'Híbrido', minutes: 14,
      format: 'for-time', formatLabel: 'Escalera 10-8-6-4-2 · 200 m entre escalones',
      focus: 'Misma escalera que la semana 1: comparás tiempo',
      scoreType: 'time', scoreHint: 'Tiempo total',
      items: [
        p('goblet-squat', { reps: '10-8-6-4-2', load: 'KB 20 kg' }),
        p('push-up', { reps: '10-8-6-4-2' }),
        p('kb-clean', { reps: '10-8-6-4-2', unilateral: true, load: 'KB 20 kg' }),
        p('box-step-up', { reps: '10-8-6-4-2', unilateral: true }),
        p('sprint', { distance: '200 m' }),
      ],
    },
    {
      kind: 'recovery', index: 4, title: 'Movilidad de cierre', minutes: 10,
      format: 'sets', formatLabel: 'Continuo',
      focus: 'Sin híbrido esta semana',
      items: [
        p('hip-flow', { duration: '3 min' }),
        p('deep-squat-hold', { duration: '45 s', isometric: true }),
        p('hip-flexor-stretch', { duration: '40 s', unilateral: true, isometric: true }),
        p('nasal-breathing', { duration: '3 min' }),
      ],
    },
  ],
};

// ═══════════════════════ SÁBADO — competencia ═══════════════════════
export const SATURDAY_WARMUP: BlockSpec = {
  kind: 'zona-media', index: 1, title: 'Entrada en calor', minutes: 10,
  format: 'rounds', formatLabel: '2 vueltas', rounds: 2,
  focus: 'Antes de romper',
  items: [
    p('easy-walk', { distance: '200 m', instructions: 'Trote suave.' }),
    p('hip-9090', { reps: '8 cambios' }),
    p('monster-walk', { reps: '15 pasos', unilateral: true }),
    p('pogo-jump', { reps: '15' }),
    p('worlds-greatest-stretch', { reps: '5', unilateral: true }),
  ],
};

export const SATURDAY_WODS: BlockSpec[] = [
  {
    kind: 'finisher', index: 2, title: 'WOD · Chipper largo', minutes: 40,
    format: 'chipper', formatLabel: 'For Time · una vuelta',
    focus: 'La marca del mes',
    scoreType: 'time', scoreHint: 'Tiempo total — anotalo',
    items: [
      p('sprint', { distance: '800 m' }),
      p('kb-swing', { reps: '20', load: 'KB 20 kg' }),
      p('box-step-up', { reps: '20', unilateral: true }),
      p('sprint', { distance: '600 m' }),
      p('wall-ball', { reps: '30', load: 'Balón 5 kg' }),
      p('farmer-march', { reps: '30', unilateral: true, load: 'KB 20 kg' }),
      p('sprint', { distance: '400 m' }),
      p('reverse-lunge-mb', { reps: '40', load: 'Balón 5 kg' }),
      p('burpee', { reps: '20' }),
      p('sprint', { distance: '400 m' }),
      p('jump-rope', { reps: '50 saltos' }),
      p('mb-slam', { reps: '15', load: 'Balón 10 kg' }),
      p('sprint', { distance: '800 m' }),
    ],
  },
  {
    kind: 'finisher', index: 2, title: 'WOD · 5 rondas', minutes: 35,
    format: 'for-time', formatLabel: '5 rondas por tiempo', rounds: 5,
    focus: 'Ritmo sostenido',
    scoreType: 'time', scoreHint: 'Tiempo total',
    items: [
      p('sprint', { distance: '400 m' }),
      p('wall-ball', { reps: '15', load: 'Balón 5 kg' }),
      p('kb-swing', { reps: '15', load: 'KB 20 kg' }),
      p('box-step-up', { reps: '10', unilateral: true }),
    ],
  },
  {
    kind: 'finisher', index: 2, title: 'WOD · AMRAP 30′', minutes: 30,
    format: 'amrap', formatLabel: 'AMRAP 30 min', capMinutes: 30,
    focus: 'Cuántas rondas entran',
    scoreType: 'rounds-reps', scoreHint: 'Rondas + repeticiones',
    items: [
      p('sprint', { distance: '200 m' }),
      p('wall-ball', { reps: '10', load: 'Balón 5 kg' }),
      p('kb-swing', { reps: '10', load: 'KB 20 kg' }),
      p('box-step-up', { reps: '10', unilateral: true }),
      p('jump-rope', { reps: '15 saltos' }),
    ],
  },
  {
    kind: 'finisher', index: 2, title: 'TEST · Hyrox simulado', minutes: 45,
    format: 'for-time', formatLabel: '8 × (400 m + estación)', rounds: 8,
    focus: 'El test del mes. Mismas distancias y cargas todos los meses.',
    scoreType: 'time', scoreHint: 'Tiempo total — es tu marca comparable',
    items: [
      p('sprint', { distance: '400 m', instructions: 'Antes de cada estación.' }),
      p('farmer-carry', { distance: '50 m', carry: true, load: 'KB 20 kg' }),
      p('wall-ball', { reps: '40', load: 'Balón 5 kg' }),
      p('box-step-up', { reps: '30', unilateral: true }),
      p('kb-swing', { reps: '40', load: 'KB 20 kg' }),
      p('reverse-lunge-mb', { distance: '50 m', load: 'Balón 5 kg' }),
      p('burpee', { reps: '30' }),
      p('jump-rope', { reps: '100 saltos' }),
      p('mb-slam', { reps: '30', load: 'Balón 10 kg' }),
    ],
  },
];

export const SATURDAY_COOLDOWN: BlockSpec = {
  kind: 'recovery', index: 3, title: 'Bajada', minutes: 5,
  format: 'sets', formatLabel: 'Continuo', focus: 'Down regulation',
  items: [
    p('easy-walk', { duration: '3 min' }),
    p('nasal-breathing', { duration: '2 min', instructions: 'Inhalar 4 s · exhalar 8 s.' }),
  ],
};

// ═══════════════════════ MARTES — spinning ═══════════════════════
export const SPINNING: BlockSpec[] = [
  {
    kind: 'outdoor', index: 1, title: 'Spinning', minutes: 45,
    format: 'intervals', formatLabel: '5 × (3′ fuerte / 2′ suave)', rounds: 5,
    focus: 'Base aeróbica',
    scoreType: 'distance', scoreHint: 'Distancia o vatios medios',
    items: [
      p('bike-zone2', { duration: '10 min', instructions: 'Entrada en calor progresiva.' }),
      p('bike-sprint', { sets: 5, duration: '3 min fuerte / 2 min suave', rpe: '7', instructions: 'Fuerte = frases cortas, no charla.' }),
      p('bike-recovery', { duration: '10 min' }),
    ],
  },
  {
    kind: 'outdoor', index: 1, title: 'Spinning', minutes: 45,
    format: 'intervals', formatLabel: '8 × (2′ fuerte / 1′ suave)', rounds: 8,
    focus: 'Intervalos más cortos y duros',
    scoreType: 'distance', scoreHint: 'Distancia o vatios medios',
    items: [
      p('bike-zone2', { duration: '10 min', instructions: 'Entrada en calor progresiva.' }),
      p('bike-sprint', { sets: 8, duration: '2 min fuerte / 1 min suave', rpe: '8' }),
      p('bike-recovery', { duration: '10 min' }),
    ],
  },
  {
    kind: 'outdoor', index: 1, title: 'Spinning', minutes: 45,
    format: 'intervals', formatLabel: '4 × (5′ umbral / 3′ suave)', rounds: 4,
    focus: 'Umbral',
    scoreType: 'distance', scoreHint: 'Distancia o vatios medios',
    items: [
      p('bike-zone2', { duration: '10 min', instructions: 'Entrada en calor progresiva.' }),
      p('bike-power', { sets: 4, duration: '5 min umbral / 3 min suave', rpe: '8' }),
      p('bike-power', { sets: 6, duration: '45 s sentado / 15 s suave', instructions: 'Resistencia alta y cadencia estable, sin perder postura.' }),
    ],
  },
  {
    kind: 'outdoor', index: 1, title: 'Spinning', minutes: 35,
    format: 'sets', formatLabel: 'Zona 2 continua',
    focus: 'Descarga',
    items: [
      p('bike-zone2', { duration: '35 min', rpe: '5', instructions: 'Continuo, conversacional. Sin intervalos.' }),
    ],
  },
];

// ═══════════════════════ JUEVES — pasadas ═══════════════════════
export const RUN_SESSIONS: BlockSpec[][] = [
  // S1 — volumen completo
  [
    {
      kind: 'zona-media', index: 1, title: 'Entrada en calor', minutes: 10,
      format: 'sets', formatLabel: 'Progresivo', focus: 'Antes de correr rápido',
      items: [
        p('easy-walk', { duration: '5 min', instructions: 'Trote suave.' }),
        p('skipping', { sets: 2, distance: '20 m' }),
        p('sprint', { sets: 3, distance: '40 m', instructions: 'Progresivas, no máximas.' }),
      ],
    },
    {
      kind: 'atleta', index: 2, title: 'Pasadas', minutes: 40,
      format: 'intervals', formatLabel: '8×50 · 10×100 · 4×200 · 1×400',
      focus: '2.600 m de trabajo rápido',
      scoreType: 'time', scoreHint: 'Tiempo de los 400 m finales',
      items: [
        p('sprint', { sets: 8, distance: '50 m', rpe: '90 %', rest: 'Vuelta caminando' }),
        p('sprint', { sets: 10, distance: '100 m', rpe: '85 %', rest: '60 s' }),
        p('sprint', { sets: 4, distance: '200 m', rpe: '80 %', rest: '90 s' }),
        p('sprint', { sets: 1, distance: '400 m', instructions: 'Fuerte y controlado. Si en las 100 perdiste velocidad, cortá acá.' }),
      ],
    },
  ],
  // S2 — mismo volumen, más rápido
  [
    {
      kind: 'zona-media', index: 1, title: 'Entrada en calor', minutes: 10,
      format: 'sets', formatLabel: 'Progresivo', focus: 'Antes de correr rápido',
      items: [
        p('easy-walk', { duration: '5 min', instructions: 'Trote suave.' }),
        p('skipping', { sets: 2, distance: '20 m' }),
        p('sprint', { sets: 3, distance: '40 m' }),
      ],
    },
    {
      kind: 'atleta', index: 2, title: 'Pasadas', minutes: 40,
      format: 'intervals', formatLabel: '8×50 · 10×100 · 4×200 · 1×400',
      focus: 'Mismo volumen, un segundo más rápido en las 100',
      scoreType: 'time', scoreHint: 'Tiempo de los 400 m finales',
      items: [
        p('sprint', { sets: 8, distance: '50 m', rpe: '90 %', rest: 'Vuelta caminando' }),
        p('sprint', { sets: 10, distance: '100 m', rpe: '85 %', rest: '60 s', instructions: 'Objetivo: 1 s más rápido que la semana pasada.' }),
        p('sprint', { sets: 4, distance: '200 m', rpe: '80 %', rest: '90 s' }),
        p('sprint', { sets: 1, distance: '400 m' }),
      ],
    },
  ],
  // S3 — volumen reducido (venís del lunes pesado)
  [
    {
      kind: 'zona-media', index: 1, title: 'Entrada en calor', minutes: 10,
      format: 'sets', formatLabel: 'Progresivo', focus: 'Antes de correr rápido',
      items: [
        p('easy-walk', { duration: '5 min', instructions: 'Trote suave.' }),
        p('skipping', { sets: 2, distance: '20 m' }),
        p('sprint', { sets: 3, distance: '40 m' }),
      ],
    },
    {
      kind: 'atleta', index: 2, title: 'Pasadas', minutes: 30,
      format: 'intervals', formatLabel: '6×50 · 8×100 · 3×200',
      focus: 'Volumen reducido: las piernas vienen cargadas del lunes',
      scoreType: 'time', scoreHint: 'Tiempo medio de las 200',
      items: [
        p('sprint', { sets: 6, distance: '50 m', rest: 'Vuelta caminando' }),
        p('sprint', { sets: 8, distance: '100 m', rest: '60 s' }),
        p('sprint', { sets: 3, distance: '200 m', rest: '90 s' }),
      ],
    },
  ],
  // S4 — descarga
  [
    {
      kind: 'zona-media', index: 1, title: 'Entrada en calor', minutes: 10,
      format: 'sets', formatLabel: 'Progresivo', focus: 'Suave',
      items: [
        p('easy-walk', { duration: '5 min', instructions: 'Trote suave.' }),
        p('skipping', { sets: 2, distance: '20 m' }),
      ],
    },
    {
      kind: 'atleta', index: 2, title: 'Pasadas', minutes: 20,
      format: 'intervals', formatLabel: '8×100 · 2×200',
      focus: 'Descarga: sin 400',
      scoreType: 'time', scoreHint: 'Tiempo medio de las 100',
      items: [
        p('sprint', { sets: 8, distance: '100 m', rest: '60 s' }),
        p('sprint', { sets: 2, distance: '200 m', rest: '2 min' }),
      ],
    },
  ],
];

export const MOBILITY_CLOSE: BlockSpec = {
  kind: 'recovery', index: 3, title: 'Movilidad', minutes: 10,
  format: 'sets', formatLabel: 'Continuo', focus: 'Cadera y tobillo',
  items: [
    p('hip-flexor-stretch', { duration: '40 s', unilateral: true, isometric: true }),
    p('soleus-raise', { sets: 2, reps: '15' }),
    p('nasal-breathing', { duration: '2 min' }),
  ],
};

export const SUNDAY: BlockSpec = {
  kind: 'recovery', index: 1, title: 'Descanso', minutes: 20,
  format: 'sets', formatLabel: 'Opcional',
  focus: 'Seis días de trabajo necesitan uno sin nada',
  items: [
    p('easy-walk', { duration: '20 min', instructions: 'Opcional. Si el cuerpo lo pide.' }),
    p('nasal-breathing', { duration: '3 min' }),
  ],
};

/**
 * VUELTA A LA MANZANA
 * ───────────────────
 * Transición cardiovascular entre bloques. No es un ejercicio: es un elemento
 * propio, con su tarjeta, su cronómetro y su registro.
 *
 * Sin distancia fija: la rutina no la especifica, así que la app no la impone.
 */
export const vuelta = (
  intensity: 'suave' | 'sostenido' | 'fuerte',
  goal: string,
  minutes = 4,
): BlockSpec => ({
  kind: 'transicion', index: 0, title: 'Vuelta a la manzana', minutes,
  format: 'sets', formatLabel: 'Cardio transition',
  intensity, goal,
  focus: 'Transición entre bloques',
  scoreType: 'time', scoreHint: 'Tiempo de la vuelta',
  items: [],
});

export { CORE_MON, CORE_WED, CORE_FRI };
