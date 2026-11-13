/** Los cuatro bloques de toda sesión principal, más los dos de fin de semana. */
export type BlockKind =
  | 'zona-media'
  | 'fuerza'
  | 'atleta'
  | 'finisher'
  | 'outdoor'
  | 'recovery'
  /** Vuelta a la manzana: transición cardiovascular entre bloques. */
  | 'transicion';

/** Intensidad de una transición cardiovascular. */
export type TransitionIntensity = 'suave' | 'sostenido' | 'fuerte';

export const TRANSITION_INTENSITY: Record<
  TransitionIntensity,
  { label: string; rpe: string; detail: string }
> = {
  suave: { label: 'Suave', rpe: 'RPE 4–5', detail: 'Recuperación activa' },
  sostenido: { label: 'Sostenido', rpe: 'RPE 6–7', detail: 'Ritmo cómodo pero activo' },
  fuerte: { label: 'Fuerte controlado', rpe: 'RPE 7–8', detail: 'Alta intensidad sin sprint máximo' },
};

/** Resultado registrado de una vuelta a la manzana. */
export interface TransitionResult {
  blockId: string;
  /** Segundos cronometrados. */
  seconds: number;
  distanceM?: number;
  rpe?: number;
  feeling?: string;
  comment?: string;
  completedAt: number;
}

/** Cómo se ejecuta un bloque. Define qué temporizador se abre. */
export type BlockFormat =
  | 'rounds'        // 3 vueltas
  | 'amrap'         // AMRAP 8 min
  | 'for-time'      // 4 vueltas por tiempo
  | 'tabata-express'// 4 ejercicios · 40/20 · 2 vueltas
  | 'tabata-full'   // 8 ejercicios · 40/20 · 4 vueltas (sesión especial)
  | 'intervals'     // 20 s fuerte / 40 s caminata
  | 'chipper'
  | 'ladder'
  | 'sets';         // series rectas con descanso

/** Cómo se puntúa un finisher. */
export type ScoreType = 'rounds-reps' | 'time' | 'reps' | 'distance' | 'none';

/** Resultado registrado del finisher. */
export interface FinisherScore {
  rounds?: string;
  reps?: string;
  time?: string;
  distance?: string;
  note?: string;
}

/** Módulos deportivos que reemplazan trabajo accesorio dentro de los bloques. */
export type SportModule = 'ski' | 'surf' | 'golf' | 'running';

/** Sistema de capacidades: el programa se organiza por esto, no por grupos musculares. */
export type PrimaryCapability =
  | 'Strength'
  | 'Power'
  | 'Engine'
  | 'Mobility'
  | 'Athletic'
  | 'Balance'
  | 'Rotation'
  | 'Recovery';

/** Cualidades que entrena un ejercicio. Es el eje del programa, no el músculo. */
export type Capacity =
  | 'Fuerza máxima'
  | 'Potencia'
  | 'Velocidad'
  | 'Resistencia local'
  | 'Isometría'
  | 'Excéntrico'
  | 'Antirrotación'
  | 'Rotación'
  | 'Unilateral'
  | 'Unipodal'
  | 'Plano frontal'
  | 'Plano transversal'
  | 'Tendón'
  | 'Pie y tobillo'
  | 'Equilibrio'
  | 'Desaceleración'
  | 'Cambio de dirección'
  | 'Absorción de impacto'
  | 'Movilidad'
  | 'Estabilidad escapular'
  | 'Capacidad aeróbica'
  | 'Umbral'
  | 'Down regulation';

/** Fase del macrociclo de 16 semanas. */
export interface Phase {
  id: number;
  name: string;
  weeks: [number, number];
  focus: string;
  /** Cómo se prescribe la fuerza principal en esta fase. */
  strength: { sets: number; reps: string; rpe: string; rest: string };
  /** Cómo se prescribe la potencia. */
  power: { sets: number; reps: string; rest: string; intent: string };
  /** Multiplicador de volumen accesorio. */
  accessoryReps: string;
  coachNote: string;
}

export type SportActivity =
  | 'surf'
  | 'golf'
  | 'ski'
  | 'running'
  | 'rest'
  | 'gym'
  | 'home';

export type WorkoutStatus =
  | 'pending'
  | 'completed'
  | 'modified'
  | 'external'
  | 'rest';

export type MetricStatus = 'nodata' | 'improving' | 'stable' | 'attention';

export type ExerciseCategory =
  | 'Fuerza'
  | 'Potencia'
  | 'Antirrotación'
  | 'Rotación'
  | 'Unilateral'
  | 'Unipodal'
  | 'Plano frontal'
  | 'Core'
  | 'Tendones'
  | 'Movilidad'
  | 'Running'
  | 'Surf'
  | 'Golf'
  | 'Esquí'
  | 'Finisher'
  | 'Recovery';

export interface Exercise {
  id: string;
  name: string;
  categories: ExerciseCategory[];
  /** Para qué está en el programa: la intención, en una línea. */
  objective: string;
  /** Cualidades que desarrolla. */
  capacities: Capacity[];
  /** Músculos y estructuras principales. */
  targets: string[];
  /** Módulos deportivos a los que aporta directamente. */
  modules?: SportModule[];
  typical: string;
  cues: string[];
  mistakes: string[];
  regression: string;
  progression: string;
  equipment: string[];
  /** Término de búsqueda para el video de técnica (se abre en YouTube). */
  video?: string;
}

export interface ExercisePrescription {
  exerciseId: string;
  /** Etiqueta de orden dentro del bloque: A1, B, E3… (corta, 1-3 caracteres) */
  order?: string;
  /** Subgrupo dentro del bloque: "Circuito", "Finisher"… se muestra como encabezado. */
  group?: string;
  sets?: number;
  reps?: string;
  duration?: string;
  distance?: string;
  rest?: string;
  rpe?: string;
  load?: string;
  unilateral?: boolean;
  isometric?: boolean;
  carry?: boolean;
  instructions?: string;
  alternatives?: string[];
}

export interface WorkoutBlock {
  id: string;
  kind: BlockKind;
  /** Número visible: BLOQUE 1, BLOQUE 2… */
  index: number;
  title: string;
  duration: string;
  /** Minutos reales, para validar el presupuesto de 45-50 min. */
  minutes: number;
  format: BlockFormat;
  /** Texto del formato: "3 VUELTAS", "AMRAP 9 MIN". */
  formatLabel: string;
  focus?: string;
  rounds?: number;
  /** Minutos del reloj para AMRAP / for time. */
  capMinutes?: number;
  /** Segundos de trabajo y pausa para 40/20 e intervalos. */
  work?: number;
  pause?: number;
  rest?: string;
  scoreType?: ScoreType;
  scoreHint?: string;
  /** Bloque con alternativas mutuamente excluyentes; `order` identifica cada opción. */
  choiceLabel?: string;
  module?: SportModule;
  /** Solo para bloques de transición. */
  intensity?: TransitionIntensity;
  /** Objetivo de la transición, en texto. */
  goal?: string;
  items: ExercisePrescription[];
}

export interface Workout {
  id: string;
  week: number;
  day: number;
  date: string; // YYYY-MM-DD
  name: string;
  subtitle: string;
  objective: string;
  duration: string;
  plannedRpe: string;
  coachNote: string;
  nextDayActivity: SportActivity | null;
  blocks: WorkoutBlock[];
  adaptations: string[];
  status: WorkoutStatus;
  /** Fase del macrociclo (1-4). */
  phase: number;
  /** Implemento protagonista: una configuración de barra por sesión. */
  station: import('../data/equipment').Station;
  /** Equipamiento a preparar antes de empezar. */
  equipment: string[];
  /** Deportes a los que transfiere la sesión. */
  transfersTo: SportModule[];
  /** Capacidad principal que desarrolla la sesión. Reemplaza al "qué músculo toca". */
  capability: PrimaryCapability;
  /** Módulos deportivos presentes en la sesión. */
  modules: SportModule[];
  /** Día sin entrenamiento programado (deporte externo o descanso). */
  externalActivity?: SportActivity;
}

export interface UserProfile {
  raceDate?: string;
  name: string;
  age: number;
  weight: number;
  height: number;
  targetWeight: number;
  daysAvailable: number;
  preferredDuration: string;
  equipment: string[];
  sports: string[];
  complaints: string[];
  trainingTime: string;
}

export interface CompletedSet {
  rpe?: number;
  done: boolean;
  load?: string;
  reps?: string;
}

export interface WorkoutSession {
  definition?: Workout;
  hybridResults?: Record<string, import('./hybrid').HybridResult>;
  completedBlocks?: string[];
  painArea?: string;
  painExercise?: string;
  painNote?: string;
  dataSource?: 'manual' | 'Garmin';
  workoutId: string;
  date: string;
  startedAt: number;
  completedAt?: number;
  elapsedMs: number;
  blockIndex: number;
  activeKey: string | null;
  sets: Record<string, CompletedSet[]>;
  skipped: string[];
  substitutions: Record<string, string>;
  /** Opción elegida por bloque, usando la etiqueta corta de `order` (A, B…). */
  choices?: Record<string, string>;
  /** Score del finisher, cargado al terminar el bloque 4. */
  finisherScore?: FinisherScore;
  /** Vueltas a la manzana completadas, por id de bloque. */
  transitions?: Record<string, TransitionResult>;
}

export interface SessionSummary {
  painArea?: string;
  painExercise?: string;
  painNote?: string;
  dataSource?: 'manual' | 'Garmin';
  workoutId: string;
  workoutName: string;
  date: string;
  durationMin: number;
  blocksCompleted: number;
  blocksTotal: number;
  volumeKg: number;
  setsCompleted: number;
  finisherScore?: FinisherScore;
  /** Calorías quemadas, del reloj o la app de la bici. */
  calories?: number;
  /** Desglose de tiempos por tipo de bloque, en segundos. */
  timeByBlock?: Partial<Record<BlockKind, number>>;
  /** Vueltas a la manzana completadas y la mejor de ellas. */
  transitionsDone?: number;
  bestTransitionSec?: number;
  /** Suma de todo el trabajo cardiovascular de la sesión, en segundos. */
  cardioSeconds?: number;
  /** Frecuencia cardíaca media durante la sesión. */
  avgHr?: number;
  /** Frecuencia cardíaca máxima alcanzada. */
  maxHr?: number;
  rpe: number;
  energy: number;
  pain: number;
  feeling: 'fresco' | 'justo' | 'destruido' | null;
  comment: string;
  highlight: string | null;
  personalRecord: string | null;
  coachNote: string;
}

export interface DailyReadiness {
  energy: number | null;
  sleep: number | null;
  pain: number | null;
  motivation: number | null;
}

export interface CoachAdjustment {
  id: string;
  label: string;
  group: 'estado' | 'mañana' | 'contexto';
  recommendation: string;
  effect: string;
}

export type NutritionDayType =
  | 'fuerza'
  | 'hibrido'
  | 'zona2'
  | 'descanso'
  | 'ski'
  | 'surf'
  | 'golf';

export interface NutritionDay {
  date: string;
  dayType: NutritionDayType;
  mealsDone: string[];
  water: number;
  creatine: boolean;
}

export interface ProgressMetric {
  id: string;
  group: 'Composición' | 'Fuerza' | 'Atlético' | 'Engine' | 'Recuperación';
  label: string;
  unit: string;
  target?: string;
  hint?: string;
  /** true = valores más bajos son mejores (peso, cintura, 5k, FC reposo, dolor) */
  lowerIsBetter?: boolean;
}

export interface MetricEntry {
  date: string;
  value: number;
}

export interface AppState {
  /** V8 is only applied to future, unstarted workouts. Existing identities remain stable. */
  v8From?: string;
  /** Active programming model; absent/unknown legacy values continue to use V8. */
  activePlan?: 'v8' | 'home-mesocycle-4week';
  /** true cuando ya se pasó una vez al mesociclo de 4 semanas (no se vuelve a forzar). */
  mesoAutoApplied?: boolean;
  schedule?: Record<string, string>;
  skippedWorkouts?: string[];
  phaseSettings?: { names: string[]; deloadWeeks: number[] };
  version: number;
  profile: UserProfile;
  readiness: Record<string, DailyReadiness>;
  adjustments: Record<string, string[]>;
  sessions: Record<string, WorkoutSession>;
  history: SessionSummary[];
  calendarOverrides: Record<string, SportActivity>;
  metrics: Record<string, MetricEntry[]>;
  nutrition: Record<string, NutritionDay>;
  extras: Record<string, string[]>;
  lastScreen: string;
  /** Fecha en que arrancó el programa. Se fija la primera vez y no se toca nunca más. */
  programStart?: string;
}
