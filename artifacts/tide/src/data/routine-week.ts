import type {
  BlockFormat,
  BlockKind,
  ExercisePrescription,
  PrimaryCapability,
  ScoreType,
  SportActivity,
  SportModule,
  WorkoutBlock,
} from '../types';
import type { Station } from './equipment';

interface SourceBlock {
  kind: BlockKind;
  title: string;
  minutes: number;
  format: BlockFormat;
  formatLabel: string;
  focus?: string;
  rounds?: number;
  capMinutes?: number;
  rest?: string;
  scoreType?: ScoreType;
  scoreHint?: string;
  choiceLabel?: string;
  items: ExercisePrescription[];
}

export interface SourceDay {
  name: string;
  tagline: string;
  objective: string;
  plannedRpe: string;
  station: Station;
  capability: PrimaryCapability;
  transfersTo: SportModule[];
  nextDayActivity: SportActivity | null;
  coachNote: string;
  blocks: SourceBlock[];
}

const item = (
  exerciseId: string,
  prescription: Omit<ExercisePrescription, 'exerciseId'> = {},
): ExercisePrescription => ({ exerciseId, ...prescription });

const block = (
  kind: BlockKind,
  title: string,
  minutes: number,
  format: BlockFormat,
  formatLabel: string,
  items: ExercisePrescription[],
  details: Partial<Omit<SourceBlock, 'kind' | 'title' | 'minutes' | 'format' | 'formatLabel' | 'items'>> = {},
): SourceBlock => ({ kind, title, minutes, format, formatLabel, items, ...details });

export const SOURCE_WEEK: SourceDay[] = [
  {
    name: 'SQUAT + TRACCIÓN',
    tagline: 'Pierna pesada · Espalda',
    objective: 'Core anti-extensión, squat al cajón con contraste, tracción en circuito y un híbrido de cuatro rondas.',
    plannedRpe: '8',
    station: 'barra',
    capability: 'Strength',
    transfersTo: [],
    nextDayActivity: 'running',
    coachNote: 'GOWOD va fuera de la app. En las primeras tres series de dominadas dejá una o dos repeticiones en reserva.',
    blocks: [
      block('recovery', 'Calentamiento', 5, 'sets', 'GOWOD + activación', [
        item('gowod-routine', { order: 'A', duration: '≈10 min', instructions: 'Hacela antes de entrar a la sesión.' }),
        item('rope-air-squat', { order: 'B', duration: '90 s', reps: '15 air squats' }),
        item('box-squat', { order: 'C', sets: 2, reps: '8 con barra vacía → 5 al 60%', rest: '60 s', instructions: 'Aproximación, no series efectivas.' }),
      ]),
      block('zona-media', 'B1 · Core anti-extensión', 7, 'rounds', '4 vueltas · circuito', [
        item('dynamic-plank', { order: 'A1', reps: '5' }),
        item('extreme-plank', { order: 'A2', duration: '15 s' }),
        item('ytwl', { order: 'A3', reps: '12', instructions: 'W-Y acostado. Trapecio inferior, sin encoger hombros.' }),
        item('copenhagen-plank', { order: 'A4', duration: '10 s/lado', unilateral: true }),
      ], { rounds: 4, rest: 'Sin descanso entre ejercicios' }),
      block('fuerza', 'B2 · Circuito Pierna', 14, 'rounds', '4 vueltas', [
        item('box-squat', { order: 'A1', reps: '5', rpe: '7–8', rest: '90 s entre vueltas', instructions: 'Sentate, pausa 1 s y subí sin rebote. Registrá la carga.' }),
        item('drop-jump', { order: 'A2', reps: '4', instructions: 'Caída bilateral desde cajón, sin contramovimiento. Va en el descanso del squat.' }),
        item('goblet-squat', { order: 'A3', reps: '4', load: 'Kettlebell al pecho', instructions: 'Profundidad completa. Registrá la carga.' }),
        item('box-step-up', { order: 'A4', reps: '8/lado', unilateral: true, load: 'Kettlebell en rack o mano' }),
      ], { rounds: 4, rest: '90 s entre vueltas' }),
      block('fuerza', 'B3 · Circuito Tracción', 10, 'rounds', '4 vueltas', [
        item('pull-up', { order: 'B1', reps: 'Máximo técnico', instructions: 'Dejá 1–2 en reserva las primeras tres series; última al fallo técnico.' }),
        item('explosive-one-arm-row', { order: 'B2', reps: '6/lado', unilateral: true, instructions: 'Barra en el suelo con sujetador. Tirón rápido y bajada controlada. Registrá la carga.' }),
        item('mb-slam', { order: 'B3', reps: '10', load: 'Balón 10 kg' }),
      ], { rounds: 4, rest: '60 s entre vueltas' }),
      block('finisher', 'B4 · Híbrido', 13, 'for-time', '4 vueltas en 13 min · FC 150+', [
        item('kb-rotational-swing', { order: 'C1', reps: '9/lado', unilateral: true }),
        item('burpee', { order: 'C2', reps: '5' }),
        item('box-jump', { order: 'C3', reps: '10', instructions: 'Step down para cuidar el Aquiles.' }),
        item('kb-push-jerk', { order: 'C4', reps: '3/lado', unilateral: true }),
        item('burpee', { order: 'C5', reps: '5', instructions: 'Cierre de vuelta.' }),
      ], { rounds: 4, capMinutes: 13, scoreType: 'time', scoreHint: 'Vueltas completadas y tiempo' }),
    ],
  },
  {
    name: 'ZONA 2',
    tagline: 'Base aeróbica',
    objective: 'Carrera continua a ritmo conversacional como recuperación activa entre los días de fuerza.',
    plannedRpe: '4–5',
    station: 'outdoor',
    capability: 'Engine',
    transfersTo: ['running'],
    nextDayActivity: 'gym',
    coachNote: 'Test de conversación: sostené cuatro o cinco frases sin jadear. Si el pulso sube, caminá.',
    blocks: [
      block('recovery', 'Previo', 5, 'sets', 'GOWOD + entrada progresiva', [
        item('gowod-routine', { order: 'A', duration: '≈10 min', instructions: 'Antes de salir.' }),
        item('easy-walk', { order: 'B', duration: '5 min', instructions: 'Pasá gradualmente de caminata a trote.' }),
      ]),
      block('outdoor', 'Carrera continua Z2', 40, 'sets', '60–70% FCM · ≈130–145 ppm', [
        item('zone2-run', { order: 'A', duration: '35 min', instructions: 'Ritmo conversacional; caminá si el pulso se eleva.' }),
        item('easy-walk', { order: 'B', duration: '5 min', instructions: 'Vuelta a la calma hasta pulso menor a 110.' }),
      ], { scoreType: 'distance', scoreHint: 'Distancia total de la carrera' }),
    ],
  },
  {
    name: 'CADERA + EMPUJE',
    tagline: 'Cadera pesada · Arranque · Press',
    objective: 'Cadera pesada, arranque colgado y empuje horizontal con un AMRAP de quince minutos.',
    plannedRpe: '8',
    station: 'barra',
    capability: 'Strength',
    transfersTo: [],
    nextDayActivity: 'running',
    coachNote: 'Velocidad sobre carga en el arranque: si la técnica cae, bajá peso.',
    blocks: [
      block('recovery', 'Calentamiento', 5, 'sets', 'GOWOD + activación', [
        item('gowod-routine', { order: 'A', duration: '≈10 min' }),
        item('glute-bridge', { order: 'B1', sets: 2, reps: '15', instructions: 'Activación de glúteos.' }),
        item('monster-walk', { order: 'B2', sets: 2, reps: '12/lado', unilateral: true }),
        item('wrist-mobility', { order: 'B3', sets: 2, duration: '60–90 s' }),
        item('hang-snatch', { order: 'C', sets: 2, reps: '8 con barra vacía', rest: '60 s', instructions: 'Aproximación técnica.' }),
      ]),
      block('zona-media', 'B1 · Cadera + Core', 6, 'rounds', '4 vueltas · circuito', [
        item('hip-raise-extreme', { order: 'A1', reps: '8', instructions: 'Rango completo y pausa arriba.' }),
        item('glute-bridge-single', { order: 'A2', reps: '8/lado', unilateral: true }),
        item('stir-the-pot', { order: 'A3', reps: '10 círculos' }),
        item('roll-out-wheel', { order: 'A4', reps: '8' }),
      ], { rounds: 4 }),
      block('fuerza', 'B2 · Cadera + Olímpico', 13, 'rounds', '4 vueltas', [
        item('hip-thrust', { order: 'B1', reps: '5', rpe: '7–8', instructions: 'Espalda alta en banco, pausa 1 s arriba. Registrá la carga.' }),
        item('hang-snatch', { order: 'B2', reps: '6', rpe: '6–7', instructions: 'Velocidad sobre carga. Registrá la carga solo con técnica estable.' }),
        item('box-jump', { order: 'B3', reps: '5', instructions: 'Máxima altura y aterrizaje absorbido. Va en el descanso.' }),
      ], { rounds: 4, rest: '90 s entre vueltas' }),
      block('fuerza', 'B3 · Circuito Empuje', 10, 'rounds', '4 vueltas', [
        item('bench-press', { order: 'C1', reps: '8-8-6-6', instructions: 'Subí carga en las series de seis. Registrá la carga.' }),
        item('kb-floor-press-1m', { order: 'C2', reps: '6/lado', unilateral: true }),
        item('supine-mb-throw', { order: 'C3', reps: '5' }),
        item('band-face-pull', { order: 'C4', reps: '15' }),
      ], { rounds: 4, rest: '60 s entre vueltas' }),
      block('finisher', 'B4 · AMRAP 15', 15, 'amrap', 'AMRAP 15 min', [
        item('db-curl-to-press', { order: 'D1', reps: '10', load: 'Kettlebell o mancuernas livianas' }),
        item('push-up', { order: 'D2', reps: '8' }),
        item('sit-up', { order: 'D3', reps: '6' }),
        item('burpee-pull-up', { order: 'D4', reps: '4' }),
        item('jump-rope', { order: 'D5', reps: '40', instructions: 'Dobles si salen con técnica.' }),
      ], { capMinutes: 15, scoreType: 'rounds-reps', scoreHint: 'Rondas completas + repeticiones' }),
    ],
  },
  {
    name: 'INTERVALOS',
    tagline: '4×4 o 30/30 · VO₂max',
    objective: 'Entrenar el estímulo cardiovascular de mayor intensidad de la semana eligiendo una de dos opciones.',
    plannedRpe: '8–9',
    station: 'outdoor',
    capability: 'Engine',
    transfersTo: ['running'],
    nextDayActivity: 'gym',
    coachNote: 'Elegí una sola opción. Si mañana el deadlift será pesado, usá 30/30. Si llegás cansado, reducí a 3×4 o 12×30/30.',
    blocks: [
      block('recovery', 'Calentamiento', 10, 'sets', 'GOWOD + trote + drills', [
        item('gowod-routine', { order: 'A', duration: '≈10 min' }),
        item('easy-walk', { order: 'B', duration: '7 min', instructions: 'Caminata a trote progresivo.' }),
        item('running-drills', { order: 'C', duration: '3 min', instructions: 'Skipping, talones al glúteo y zancadas largas.' }),
      ]),
      block('outdoor', 'Bloque principal', 20, 'sets', 'Elegí A o B', [
        item('interval-4x4', { order: 'A', sets: 4, duration: '4 min', rest: '2 min de trote', rpe: '8–9', instructions: 'Elegí esta opción o la B, no ambas.' }),
        item('interval-30-30', { order: 'B', sets: 16, duration: '30 s', rest: '30 s trotando', rpe: '9', instructions: 'Elegí esta opción o la A, no ambas.' }),
      ], {
        choiceLabel: 'Elegí una sola opción',
        scoreType: 'distance',
        scoreHint: 'Distancia total de la opción elegida',
      }),
      block('recovery', 'Vuelta a la calma', 8, 'sets', 'Trote Z1 + caminata', [
        item('zone2-run', { order: 'A', duration: '5 min', instructions: 'Trote muy suave para bajar el pulso.' }),
        item('easy-walk', { order: 'B', duration: '3 min', instructions: 'Hasta pulso menor a 110.' }),
      ]),
    ],
  },
  {
    name: 'BISAGRA + HOMBRO',
    tagline: 'Deadlift · Press vertical',
    objective: 'Deadlift pesado, empuje vertical y complejo de barra liviana de seis vueltas.',
    plannedRpe: '8',
    station: 'barra',
    capability: 'Strength',
    transfersTo: [],
    nextDayActivity: 'gym',
    coachNote: 'El complejo usa barra liviana: el deadlift pesado ya se completó en B2.',
    blocks: [
      block('recovery', 'Calentamiento', 5, 'sets', 'GOWOD + activación posterior', [
        item('gowod-routine', { order: 'A', duration: '≈10 min' }),
        item('barbell-good-morning', { order: 'B1', sets: 2, reps: '10', load: 'Barra vacía' }),
        item('kb-swing', { order: 'B2', sets: 2, reps: '15', load: 'KB 12 kg' }),
        item('deadlift', { order: 'C', sets: 2, reps: '8 con barra vacía → 5 al 50%', rest: '60 s', instructions: 'Aproximación, no series efectivas.' }),
      ]),
      block('zona-media', 'B1 · Core anti-rotación', 6, 'rounds', '4 vueltas · circuito', [
        item('static-plank', { order: 'A1', duration: '10 s', instructions: 'Tensión máxima, no aguante largo.' }),
        item('side-plank', { order: 'A2', reps: '5/lado', unilateral: true, instructions: 'Subí y bajá la cadera con control.' }),
        item('pallof-press', { order: 'A3', reps: '8/lado', unilateral: true }),
        item('bear-kick-through', { order: 'A4', reps: '8 total' }),
      ], { rounds: 4 }),
      block('fuerza', 'B2 · Circuito Bisagra', 13, 'rounds', '4 vueltas', [
        item('deadlift', { order: 'B1', reps: '5', rpe: '7–8', instructions: 'Bajada controlada, sin rebote. Registrá la carga.' }),
        item('barbell-row', { order: 'B2', reps: '8', instructions: 'Tirón hacia el pecho; escápulas primero. Registrá la carga.' }),
        item('glute-bridge-iso', { order: 'B3', duration: '20 s', instructions: 'Va en el descanso del deadlift.' }),
      ], { rounds: 4, rest: '90 s entre vueltas' }),
      block('fuerza', 'B3 · Circuito Hombro', 11, 'rounds', '4 vueltas', [
        item('overhead-press', { order: 'C1', reps: '6', instructions: 'Estricto, costillas abajo. Registrá la carga.' }),
        item('db-lateral-raise', { order: 'C2', reps: '10', load: 'Mancuernas livianas' }),
        item('plyo-push-up', { order: 'C3', reps: '5' }),
      ], { rounds: 4, rest: '60 s entre vueltas' }),
      block('finisher', 'B4 · Complejo de Barra', 13, 'for-time', '6 vueltas en 13 min · barra liviana', [
        item('kb-swing', { order: 'D1', reps: '5', load: 'KB 20 kg', instructions: 'Reemplaza el deadlift original: ya hiciste 4×5 pesado.' }),
        item('barbell-clean', { order: 'D2', reps: '4', rpe: '6', load: 'Barra liviana', instructions: 'Técnica primero con fatiga.' }),
        item('barbell-thruster', { order: 'D3', reps: '3', rpe: '6', load: 'Misma barra liviana' }),
        item('burpee', { order: 'D4', reps: '2' }),
        item('tempo-run', { order: 'D5', duration: '1 min', instructions: 'Afuera o en el lugar.' }),
      ], { rounds: 6, capMinutes: 13, scoreType: 'time', scoreHint: 'Vueltas completadas y tiempo' }),
    ],
  },
  {
    name: 'HYROX HOME',
    tagline: 'Benchmark · 8 estaciones',
    objective: 'Benchmark repetible con ocho carreras de 200 m y estaciones fijas para comparar el tiempo cada tres o cuatro semanas.',
    plannedRpe: '9',
    station: 'kettlebell',
    capability: 'Engine',
    transfersTo: ['running'],
    nextDayActivity: 'rest',
    coachNote: 'Primera vez: terminá y anotá el tiempo. Objetivo a tres meses: bajar 10% sin cambiar repeticiones.',
    blocks: [
      block('recovery', 'Calentamiento pre-test', 8, 'sets', 'No arranques frío', [
        item('gowod-routine', { order: 'A', duration: '≈10 min' }),
        item('zone2-run', { order: 'B', duration: '5 min', instructions: 'Trote progresivo.' }),
        item('wall-ball', { order: 'C1', reps: '10' }),
        item('kb-swing', { order: 'C2', reps: '10' }),
        item('burpee-broad-jump', { order: 'C3', reps: '5', instructions: 'Ensayo sin llegar a fatiga.' }),
      ]),
      block('finisher', 'HYROX HOME · Por tiempo', 45, 'for-time', '8 × 200 m + 1 estación', [
        item('jump-rope', { order: '1', reps: '150', instructions: 'Después de 200 m corriendo. Reemplaza SkiErg 1000 m.' }),
        item('goblet-squat', { order: '2', reps: '30', load: 'KB 20 kg', instructions: 'Después de 200 m. Reemplaza Sled Push 50 m.' }),
        item('trx-row', { order: '3', reps: '30', instructions: 'Después de 200 m. Reemplaza Sled Pull 50 m.' }),
        item('burpee-broad-jump', { order: '4', reps: '20', instructions: 'Después de 200 m. Estación oficial.' }),
        item('american-kb-swing', { order: '5', reps: '40', load: 'KB 20 kg', instructions: 'Después de 200 m. Reemplaza Row 1000 m.' }),
        item('farmer-carry', { order: '6', distance: '100 m', load: 'KB 20 + 12 kg', carry: true, instructions: 'Después de 200 m. Asimétrico; cambiá de mano a la mitad.' }),
        item('overhead-lunge', { order: '7', reps: '40 pasos', load: 'Disco 10 kg', unilateral: true, instructions: 'Después de 200 m. Reemplaza Sandbag Lunges 100 m.' }),
        item('wall-ball', { order: '8', reps: '50', load: 'Balón 10 kg', instructions: 'Después de 200 m. Estación final.' }),
      ], { capMinutes: 45, scoreType: 'time', scoreHint: 'Tiempo total o estación alcanzada' }),
      block('recovery', 'Marcas de referencia', 0, 'sets', 'Compará contra vos mismo', [
        item('benchmark-first-time', { order: '1' }),
        item('benchmark-three-month-goal', { order: '2' }),
        item('benchmark-bottleneck', { order: '3' }),
        item('benchmark-time-cap', { order: '4' }),
      ]),
    ],
  },
  {
    name: 'DESCANSO',
    tagline: 'GOWOD · Caminata',
    objective: 'Recuperar sin correr ni levantar y cerrar la semana con un chequeo breve.',
    plannedRpe: '1–2',
    station: 'suelo',
    capability: 'Recovery',
    transfersTo: [],
    nextDayActivity: 'gym',
    coachNote: 'Ni corras ni levantes. Hacé GOWOD y caminá a pulso menor a 110.',
    blocks: [
      block('recovery', 'Recuperación', 15, 'sets', 'GOWOD + caminata', [
        item('gowod-routine', { order: 'A', duration: '15–20 min', instructions: 'Sesión larga fuera de la app.' }),
        item('easy-walk', { order: 'B', duration: '30–45 min', instructions: 'Pulso menor a 110.' }),
      ]),
      block('recovery', 'Chequeo semanal', 0, 'sets', 'Dos minutos · una vez por semana', [
        item('weekly-export-check', { order: '1', instructions: 'Usá el botón de exportación del Perfil.' }),
        item('weekly-alarm-check', { order: '2', instructions: 'Si cargas y sueño empeoran dos semanas seguidas, bajá volumen 20% una semana.' }),
        item('weekly-hyrox-check', { order: '3', instructions: 'Repetí el sábado con las mismas repeticiones cada 3–4 semanas.' }),
      ]),
    ],
  },
];

export const instantiateSourceBlocks = (workoutId: string, day: SourceDay): WorkoutBlock[] =>
  day.blocks.map((source, blockIndex) => ({
    id: `${workoutId}-b${blockIndex + 1}`,
    index: blockIndex + 1,
    duration: `${source.minutes} min`,
    ...source,
  }));