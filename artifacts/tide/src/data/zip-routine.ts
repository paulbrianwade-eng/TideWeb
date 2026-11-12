import type { ExercisePrescription } from '../types';
import type { BlockSpec } from './month';

const p = (exerciseId: string, extra: Partial<ExercisePrescription> = {}): ExercisePrescription => ({
  exerciseId,
  ...extra,
});

const circuit = (
  kind: BlockSpec['kind'],
  index: number,
  title: string,
  focus: string,
  items: ExercisePrescription[],
  minutes = 10,
): BlockSpec => ({
  kind,
  index,
  title,
  focus,
  items,
  minutes,
  format: 'rounds',
  formatLabel: '3 vueltas',
  rounds: 3,
  rest: '60 s entre vueltas',
});

/** Los cuatro menús de zona media definidos por el ZIP. */
export const ZIP_CORE: BlockSpec[] = [
  circuit('zona-media', 1, 'Core', 'Antiextensión, antirrotación y estabilidad de cadera', [
    p('ab-wheel', { reps: '8' }),
    p('copenhagen-plank', { duration: '20 s/lado', unilateral: true }),
    p('dead-bug', { reps: '8/lado', unilateral: true }),
    p('pallof-press', { reps: '10/lado', unilateral: true }),
  ], 8),
  circuit('zona-media', 1, 'Core', 'Control escapular, gateo y estabilidad unipodal', [
    p('trx-body-saw', { reps: '10' }),
    p('side-plank-rotation', { reps: '6/lado', unilateral: true }),
    p('bear-crawl', { distance: '10 m' }),
    p('hip-airplane', { reps: '5/lado', unilateral: true }),
  ], 8),
  circuit('zona-media', 1, 'Core', 'Plano frontal, control cruzado y antirrotación', [
    p('side-plank', { duration: '25 s/lado', unilateral: true }),
    p('bird-dog', { reps: '8/lado', unilateral: true }),
    p('pallof-press', { reps: '8/lado', unilateral: true }),
    p('ab-wheel', { reps: '6–8' }),
  ], 8),
  circuit('zona-media', 1, 'Core', 'Antiextensión dinámica y estabilidad lateral', [
    p('dead-bug', { reps: '10/lado', unilateral: true }),
    p('copenhagen-plank', { duration: '15–20 s/lado', unilateral: true }),
    p('trx-body-saw', { reps: '8' }),
    p('bear-crawl', { distance: '12 m' }),
  ], 8),
];

/** Las doce combinaciones Atleta MOVE + EXPLODE de la rutina v6. */
export const ZIP_ATHLETE: BlockSpec[] = [
  circuit('atleta', 3, 'Atleta · Move + Explode', 'Movilidad en movimiento, clean, salto y aceleración', [
    p('situp-to-stand', { order: 'A1', reps: '6' }),
    p('hang-clean', { order: 'A2', reps: '4', rpe: '6–7', load: 'Barra vacía · técnica' }),
    p('box-jump', { order: 'A3', reps: '5' }),
    p('threshold-run', { order: 'A4', distance: '25 m rápido', alternatives: ['Indoor: bicicleta 20 s fuerte'] }),
  ], 11),
  circuit('atleta', 3, 'Atleta · Move + Explode', 'Locomoción lateral, kettlebell, salto y rotación', [
    p('lateral-ape', { order: 'A1', reps: '5/lado', unilateral: true }),
    p('kb-clean-push-press', { order: 'A2', reps: '5/lado', unilateral: true }),
    p('lateral-bound', { order: 'A3', reps: '5/lado', unilateral: true }),
    p('rotational-mb-throw', { order: 'A4', reps: '6/lado', unilateral: true }),
  ], 11),
  circuit('atleta', 3, 'Atleta · Move + Explode', 'Cadera rotacional, triple extensión, salto y shuttle', [
    p('shinbox-to-stand', { order: 'A1', reps: '5/lado', unilateral: true }),
    p('clean-high-pull', { order: 'A2', reps: '4', rpe: '6–7', load: 'Barra vacía · técnica' }),
    p('broad-jump', { order: 'A3', reps: '4' }),
    p('shuttle-run', { order: 'A4', distance: '10-20-10 m', alternatives: ['Indoor: bicicleta 30 s fuerte'] }),
  ], 11),
  circuit('atleta', 3, 'Atleta · Move + Explode', 'Flujo animal, jerk, salto unilateral y rotación', [
    p('beast-to-down-dog', { order: 'A1', reps: '8' }),
    p('push-jerk', { order: 'A2', reps: '4', rpe: '6–7', load: 'Barra vacía · técnica' }),
    p('split-jump', { order: 'A3', reps: '6 total' }),
    p('rotational-mb-throw', { order: 'A4', reps: '5/lado', unilateral: true }),
  ], 11),
  circuit('atleta', 3, 'Atleta · Move + Explode', 'Plano frontal, tirón explosivo, salto y shuttle', [
    p('cossack-knee-drive', { order: 'A1', reps: '5/lado', unilateral: true }),
    p('clean-pull', { order: 'A2', reps: '5', rpe: '6–7', load: 'Barra vacía · técnica' }),
    p('burpee-broad-jump', { order: 'A3', reps: '5' }),
    p('shuttle-run', { order: 'A4', distance: '10-10-10 m', alternatives: ['Indoor: bicicleta 30 s fuerte'] }),
  ], 11),
  circuit('atleta', 3, 'Atleta · Move + Explode', 'Apertura, snatch, salto lateral y lanzamiento', [
    p('crab-reach', { order: 'A1', reps: '6/lado', unilateral: true }),
    p('kb-snatch', { order: 'A2', reps: '5/lado', unilateral: true }),
    p('skater-jump', { order: 'A3', reps: '6/lado', unilateral: true }),
    p('med-ball-chest-pass', { order: 'A4', reps: '8' }),
  ], 11),
  circuit('atleta', 3, 'Atleta · Move + Explode', 'Transición suelo-parado, press, tobillo y shuttle', [
    p('situp-to-stand', { order: 'A1', reps: '6' }),
    p('push-press', { order: 'A2', reps: '5', rpe: '6–7', load: 'Barra vacía · técnica' }),
    p('pogo-jump', { order: 'A3', reps: '20' }),
    p('shuttle-run', { order: 'A4', distance: '20-20 m', alternatives: ['Indoor: bicicleta 25 s fuerte'] }),
  ], 11),
  circuit('atleta', 3, 'Atleta · Move + Explode', 'Cadera rotacional, clean, plano frontal y rotación', [
    p('shinbox-to-stand', { order: 'A1', reps: '5/lado', unilateral: true }),
    p('hang-clean', { order: 'A2', reps: '3', rpe: '6–7', load: 'Barra vacía · técnica' }),
    p('lateral-bound', { order: 'A3', reps: '5/lado', unilateral: true }),
    p('rotational-mb-throw', { order: 'A4', reps: '6/lado', unilateral: true }),
  ], 11),
  circuit('atleta', 3, 'Atleta · Move + Explode', 'Locomoción lateral, triple extensión, salto y aceleración', [
    p('lateral-ape', { order: 'A1', reps: '4/lado', unilateral: true }),
    p('clean-high-pull', { order: 'A2', reps: '4', rpe: '6–7', load: 'Barra vacía · técnica' }),
    p('box-jump', { order: 'A3', reps: '5' }),
    p('threshold-run', { order: 'A4', distance: '30 m rápido', alternatives: ['Indoor: bicicleta 20 s fuerte'] }),
  ], 11),
  circuit('atleta', 3, 'Atleta · Move + Explode', 'Flujo animal, clean unilateral, salto y rotación', [
    p('beast-to-down-dog', { order: 'A1', reps: '8' }),
    p('kb-clean', { order: 'A2', reps: '6/lado', unilateral: true }),
    p('broad-jump', { order: 'A3', reps: '4' }),
    p('rotational-mb-throw', { order: 'A4', reps: '5/lado', unilateral: true }),
  ], 11),
  circuit('atleta', 3, 'Atleta · Move + Explode', 'Plano frontal, jerk, salto lateral y carry', [
    p('cossack-knee-drive', { order: 'A1', reps: '5/lado', unilateral: true }),
    p('push-jerk', { order: 'A2', reps: '4', rpe: '6–7', load: 'Barra vacía · técnica' }),
    p('skater-jump', { order: 'A3', reps: '6/lado', unilateral: true }),
    p('farmer-carry', { order: 'A4', distance: '30 m', carry: true, alternatives: ['Indoor: farmer march 40 pasos'] }),
  ], 11),
  circuit('atleta', 3, 'Atleta · Move + Explode', 'Apertura, kettlebell, salto unilateral y shuttle', [
    p('crab-reach', { order: 'A1', reps: '6/lado', unilateral: true }),
    p('kb-clean-push-press', { order: 'A2', reps: '5/lado', unilateral: true }),
    p('split-jump', { order: 'A3', reps: '8 total' }),
    p('shuttle-run', { order: 'A4', distance: '20-20 m', alternatives: ['Indoor: bicicleta 30 s fuerte'] }),
  ], 11),
];

const finisher = (
  format: BlockSpec['format'],
  formatLabel: string,
  focus: string,
  items: ExercisePrescription[],
  minutes: number,
  rounds?: number,
): BlockSpec => ({
  kind: 'finisher', index: 4, title: 'Híbrido', minutes, format, formatLabel, focus, items, rounds,
  capMinutes: format === 'amrap' ? minutes : undefined,
  scoreType: format === 'amrap' ? 'rounds-reps' : 'time',
  scoreHint: format === 'amrap' ? 'Rondas + repeticiones' : 'Tiempo total',
  rest: 'Solo lo necesario · RPE 8–9',
});

/** Los doce finishers mixtos de la rutina v5. */
export const ZIP_FINISHERS: BlockSpec[] = [
  finisher('amrap', 'AMRAP 9 min', 'Bici, mancuernas, cajón, TRX y soga', [
    p('spinning-bike', { duration: '35 s fuerte' }), p('db-curl-to-press', { reps: '10' }),
    p('box-step-over', { reps: '10' }), p('trx-row', { reps: '10' }), p('jump-rope', { reps: '40' }),
  ], 9),
  finisher('for-time', '4 vueltas por tiempo', 'Carrera, piernas, hombro y suelo', [
    p('threshold-run', { distance: '150 m' }), p('goblet-squat', { reps: '12', load: 'KB 20 kg' }),
    p('db-shoulder-press', { reps: '12' }), p('burpee', { reps: '8' }),
  ], 11, 4),
  finisher('amrap', 'AMRAP 10 min', 'Kettlebell, unilateral, tracción y bici', [
    p('kb-clean', { reps: '6/lado', unilateral: true }), p('reverse-lunge', { reps: '10 total' }),
    p('pull-up', { reps: '6' }), p('spinning-bike', { duration: '40 s fuerte' }), p('jump-rope', { reps: '30' }),
  ], 10),
  finisher('chipper', 'Chipper · una vuelta', 'Soga, cajón, brazos, burpees y carrera', [
    p('jump-rope', { reps: '100' }), p('box-step-over', { reps: '30' }), p('db-hammer-curl', { reps: '20' }),
    p('burpee', { reps: '15' }), p('threshold-run', { distance: '300 m' }),
  ], 11, 1),
  finisher('amrap', 'AMRAP 9 min', 'Cambio de dirección, potencia y core', [
    p('shuttle-run', { distance: '10-20-10 m' }), p('kb-clean-push-press', { reps: '5/lado', unilateral: true }),
    p('trx-row', { reps: '10' }), p('mountain-climber', { duration: '25 s' }),
  ], 9),
  finisher('for-time', '4 vueltas por tiempo', 'Bici, piernas, hombro y salto', [
    p('spinning-bike', { duration: '30 s fuerte' }), p('goblet-squat', { reps: '10' }),
    p('db-curl-to-press', { reps: '8' }), p('burpee-broad-jump', { reps: '5' }),
  ], 11, 4),
  finisher('for-time', 'Escalera 2-4-6-8-10', 'Empuje, tracción y carrera entre escalones', [
    p('push-press', { reps: '2-4-6-8-10', rpe: '6–7', load: 'Barra vacía · técnica' }),
    p('pull-up', { reps: '2-4-6-8-10' }), p('threshold-run', { distance: '100 m entre escalones' }),
  ], 10),
  finisher('amrap', 'AMRAP 10 min', 'Carry, cajón, brazos, soga y burpee', [
    p('farmer-carry', { distance: '30 m', carry: true }), p('box-step-over', { reps: '12' }),
    p('db-biceps-curl', { reps: '12' }), p('jump-rope', { reps: '50' }), p('burpee', { reps: '6' }),
  ], 10),
  finisher('for-time', '3 vueltas por tiempo', 'Carrera, bisagra, empuje y unilateral', [
    p('threshold-run', { distance: '200 m' }), p('kb-swing', { reps: '15' }), p('push-up', { reps: '10' }),
    p('reverse-lunge', { reps: '12 total' }), p('jump-rope', { reps: '40' }),
  ], 10, 3),
  finisher('amrap', 'AMRAP 9 min', 'Bici, balón, TRX, cajón y core', [
    p('spinning-bike', { duration: '40 s fuerte' }), p('mb-slam', { reps: '10' }), p('trx-row', { reps: '10' }),
    p('box-step-over', { reps: '10' }), p('mountain-climber', { duration: '20 s' }),
  ], 9),
  finisher('for-time', '4 vueltas por tiempo', 'Carrera, hombro, unilateral, gateo y soga', [
    p('threshold-run', { distance: '100 m' }), p('db-curl-to-press', { reps: '8' }),
    p('bulgarian-split-squat', { reps: '8/lado', unilateral: true }), p('bear-crawl', { distance: '10 m' }),
    p('jump-rope', { reps: '30' }),
  ], 11, 4),
  finisher('amrap', 'AMRAP 10 min', 'Bici, tracción, cajón, brazos y burpee', [
    p('spinning-bike', { duration: '30 s fuerte' }), p('pull-up', { reps: '5' }),
    p('box-step-over', { reps: '12' }), p('db-hammer-curl', { reps: '10' }), p('burpee', { reps: '6' }),
  ], 10),
];

/** Menús de movilidad compuestos exclusivamente por ejercicios del ZIP. */
export const ZIP_MOBILITY: BlockSpec[] = [
  circuit('recovery', 2, 'Movilidad', 'Cadera, tórax y hombro', [
    p('hip-9090', { reps: '8 cambios' }), p('open-book', { reps: '8/lado', unilateral: true }),
    p('hip-flexor-stretch', { duration: '45 s/lado', unilateral: true }), p('shoulder-cars', { reps: '5/lado', unilateral: true }),
  ], 10),
  circuit('recovery', 2, 'Movilidad', 'Rotación y extensión de cadera', [
    p('open-book', { reps: '8/lado', unilateral: true }), p('hip-flexor-stretch', { duration: '45 s/lado', unilateral: true }),
    p('hip-9090', { reps: '8 cambios' }),
  ], 9),
  circuit('recovery', 2, 'Movilidad', 'Hombro, respiración y cadera', [
    p('shoulder-cars', { reps: '5/lado', unilateral: true }), p('hip-flow', { duration: '4 min' }),
    p('nasal-breathing', { duration: '2 min' }),
  ], 9),
  circuit('recovery', 2, 'Movilidad · descarga', 'Movilidad mínima efectiva', [
    p('hip-9090', { reps: '6 cambios' }), p('open-book', { reps: '6/lado', unilateral: true }),
    p('nasal-breathing', { duration: '3 min' }),
  ], 8),
];

export const ZIP_ENGINE: BlockSpec[] = [
  {
    kind: 'outdoor', index: 1, title: 'Engine · bicicleta', minutes: 28, format: 'sets',
    formatLabel: '22–30 min continuos', focus: 'Motor sin impacto', scoreType: 'distance', scoreHint: 'Distancia o vatios medios',
    items: [p('spinning-bike', { duration: '22–30 min', rpe: '4–6', instructions: 'Ritmo conversacional o tempo controlado según fase.' })],
  },
  {
    kind: 'outdoor', index: 1, title: 'Engine · running', minutes: 28, format: 'sets',
    formatLabel: '22–30 min continuos', focus: 'Base aeróbica y economía', scoreType: 'distance', scoreHint: 'Distancia o ritmo medio',
    items: [p('zone2-run', { duration: '22–30 min', rpe: '4–6', instructions: 'Ritmo conversacional o tempo controlado según fase.' })],
  },
];

export const V5_ZONE2_PREP: BlockSpec = {
  kind: 'recovery', index: 1, title: 'Movement Prep', minutes: 7, format: 'sets',
  formatLabel: '6–8 min continuos', focus: 'Preparar sin fatigar',
  items: [
    p('foot-activation', { sets: 1, duration: '60 s' }),
    p('hip-9090', { sets: 1, reps: '8 cambios' }),
    p('open-book', { sets: 1, reps: '8/lado', unilateral: true }),
    p('shoulder-cars', { sets: 1, reps: '5/lado', unilateral: true }),
  ],
};

export const V5_ZONE2_MOBILITY: BlockSpec = {
  kind: 'recovery', index: 3, title: 'Mobility', minutes: 9, format: 'sets',
  formatLabel: '8–10 min continuos', focus: 'Cadera, tórax y cadena anterior',
  items: [
    p('hip-flexor-stretch', { sets: 1, duration: '45 s/lado', unilateral: true }),
    p('thoracic-rotation', { sets: 1, reps: '8/lado', unilateral: true }),
    p('worlds-greatest-stretch', { sets: 1, reps: '5/lado', unilateral: true }),
  ],
};

export const V5_HYROX_PREP: BlockSpec[] = [
  circuit('atleta', 3, 'Hyrox Prep', 'Potencia corta antes del bloque largo', [
    p('clean-high-pull', { reps: '4', rpe: '6–7', load: 'Barra vacía · técnica' }),
    p('box-jump', { reps: '5' }), p('shuttle-run', { distance: '10-20-10 m' }),
  ], 9),
  circuit('atleta', 3, 'Hyrox Prep', 'Potencia unilateral, plano frontal y carga', [
    p('kb-snatch', { reps: '5/lado', unilateral: true }), p('lateral-bound', { reps: '5/lado', unilateral: true }),
    p('farmer-carry', { distance: '30 m', carry: true }),
  ], 9),
  circuit('atleta', 3, 'Hyrox Prep', 'Potencia overhead, salto y aceleración', [
    p('push-jerk', { reps: '4', rpe: '6–7', load: 'Barra vacía · técnica' }),
    p('broad-jump', { reps: '4' }), p('threshold-run', { distance: '30 m rápido' }),
  ], 9),
  circuit('atleta', 3, 'Hyrox Prep', 'Potencia unilateral y cambio de dirección', [
    p('kb-clean-push-press', { reps: '5/lado', unilateral: true }),
    p('skater-jump', { reps: '6/lado', unilateral: true }), p('shuttle-run', { distance: '20-20 m' }),
  ], 9),
];

export const V5_HYROX_FINISHERS: BlockSpec[] = [
  finisher('for-time', 'Hyrox Style · 4 vueltas', 'Carrera y estaciones funcionales', [
    p('threshold-run', { distance: '400 m' }), p('spinning-bike', { duration: '60 s fuerte' }),
    p('goblet-squat', { reps: '15' }), p('farmer-carry', { distance: '40 m', carry: true }), p('burpee', { reps: '10' }),
  ], 22, 4),
  finisher('for-time', 'Hyrox Style · 5 vueltas', 'Carrera, cajón, tracción y piernas', [
    p('threshold-run', { distance: '300 m' }), p('box-step-over', { reps: '16' }), p('pull-up', { reps: '5' }),
    p('reverse-lunge', { reps: '16 total' }), p('spinning-bike', { duration: '45 s fuerte' }),
  ], 22, 5),
  finisher('chipper', 'Hyrox Style · Chipper', 'Carrera larga y estaciones acumuladas', [
    p('threshold-run', { distance: '800 m' }), p('farmer-carry', { distance: '80 m', carry: true }),
    p('box-step-over', { reps: '40' }), p('burpee-broad-jump', { reps: '20' }),
    p('jump-rope', { reps: '150' }), p('threshold-run', { distance: '800 m' }),
  ], 22, 1),
  finisher('for-time', 'Hyrox Style · 4 vueltas', 'Carrera, bici, tren superior y gateo', [
    p('threshold-run', { distance: '400 m' }), p('spinning-bike', { duration: '45 s fuerte' }),
    p('db-curl-to-press', { reps: '12' }), p('goblet-squat', { reps: '12' }), p('bear-crawl', { distance: '15 m' }),
  ], 22, 4),
];