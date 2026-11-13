import type { AppState, BlockFormat, BlockKind, ExercisePrescription, Workout, WorkoutBlock } from '../types';
import { buildV7 } from './v7';
import { getExercise } from './exercises';

// The attached routine is plain JavaScript; keep its programming source intact
// and adapt its legacy week shape to TIDE's current workout model here.
// @ts-ignore The user-supplied source has no TypeScript declaration file.
import { weeks as sourceWeeks, weekLabels as sourceWeekLabels, MESO_START as sourceMesoStart } from './mesocycle-source.js';

/** Lunes de inicio del mesociclo (definido en mesocycle-source.js). */
export const MESO_START = sourceMesoStart as string;

interface SourceExercise {
  name: string;
  reps?: string;
  target?: string;
  detail?: string;
}

interface SourceBlock {
  type: string;
  title: string;
  duration: number;
  format: string;
  exercises: SourceExercise[];
}

interface SourceDay {
  name: string;
  type: 'bigg' | 'run' | 'rest';
  title: string;
  subtitle?: string;
  intro: string;
  blocks: SourceBlock[];
}

const sourceWeeksTyped = sourceWeeks as unknown as SourceDay[][];

export const FOUR_WEEK_PLAN_ID = 'home-mesocycle-4week' as const;
export const FOUR_WEEK_PHASES = sourceWeekLabels as string[];
export const FOUR_WEEK_COUNT = sourceWeeksTyped.length;

const phaseRpe = ['8', '8–8.5', '8.5–9', '6–9'];
const blockKinds: Record<string, BlockKind> = {
  warmup: 'recovery',
  quality: 'atleta',
  strength: 'fuerza',
  metcon: 'finisher',
  finisher: 'finisher',
  run: 'outdoor',
};

const numberMatch = (text: string, pattern: RegExp): number | undefined => {
  const value = pattern.exec(text)?.[1];
  return value ? Number(value) : undefined;
};

const intervalTiming = (block: SourceBlock): Pick<WorkoutBlock, 'format' | 'work' | 'pause' | 'rounds' | 'capMinutes'> | null => {
  const text = block.format;
  const every = /every\s+(\d+)\s*sec(?:ond)?s?\s*[×x]\s*(\d+)/i.exec(text);
  if (every) {
    const itemCount = Math.max(1, block.exercises.length);
    const intervals = Number(every[2]);
    return {
      format: 'intervals',
      work: Number(every[1]),
      pause: 0,
      rounds: Math.max(1, Math.ceil(intervals / itemCount)),
      capMinutes: block.duration,
    };
  }

  const split = /(\d+)\s*(?:sec(?:ond)?s?|s)\s*(?:rápido|on|trabajo)?\s*\/\s*(\d+)\s*(?:sec(?:ond)?s?|s)\s*(?:suave|off|descanso)?/i.exec(text);
  if (!split) return null;

  const multipliers = [...text.matchAll(/(\d+)\s*[×x]\s*/gi)].map(match => Number(match[1]));
  const rounds = multipliers.length
    ? multipliers.reduce((product, value) => product * value, 1)
    : numberMatch(text, /(\d+)\s*(?:rondas?|vueltas?)/i) ?? 1;
  return {
    format: 'intervals',
    work: Number(split[1]),
    pause: Number(split[2]),
    rounds,
    capMinutes: block.duration,
  };
};

const formatBlock = (source: SourceBlock): Pick<
  WorkoutBlock,
  'format' | 'formatLabel' | 'rounds' | 'capMinutes' | 'work' | 'pause' | 'scoreType' | 'scoreHint'
> => {
  const label = source.format;
  const amrap = /amrap\s*(\d+)\s*(?:min|')?/i.exec(label);
  const emom = /emom\s*(\d+)/i.exec(label);
  const cap = numberMatch(label, /cap\s*(\d+)\s*(?:min|')?/i);
  const rounds = numberMatch(label, /(\d+)\s*(?:rondas?|vueltas?|rounds?)/i);

  if (amrap) {
    return {
      format: 'amrap', formatLabel: label, capMinutes: Number(amrap[1]),
      scoreType: 'rounds-reps', scoreHint: 'Vueltas y repeticiones',
    };
  }

  const interval = intervalTiming(source);
  if (interval) {
    return {
      ...interval,
      formatLabel: label,
      scoreType: 'none',
      scoreHint: 'Seguí el intervalo indicado',
    };
  }

  if (emom) {
    const minutes = Number(emom[1]);
    if (minutes % Math.max(1, source.exercises.length) === 0) {
      return {
        format: 'intervals',
        formatLabel: label,
        work: 60,
        pause: 0,
        rounds: minutes / Math.max(1, source.exercises.length),
        capMinutes: minutes,
        scoreType: 'none',
        scoreHint: 'Un ejercicio por minuto',
      };
    }
    return {
      format: 'amrap', formatLabel: label, capMinutes: minutes,
      scoreType: 'rounds-reps', scoreHint: 'Vueltas y repeticiones',
    };
  }

  if (/ladder|escalera|complete\s+\d+\s*→/i.test(label)) {
    return {
      format: 'ladder', formatLabel: label, capMinutes: cap,
      scoreType: 'reps', scoreHint: 'Escalones completados',
    };
  }

  if (/chipper/i.test(label)) {
    return {
      format: 'chipper', formatLabel: label, capMinutes: cap ?? source.duration,
      scoreType: 'time', scoreHint: 'Tiempo total',
    };
  }

  if (/for\s*time|por\s+tiempo|21-15-9|descendente/i.test(label)) {
    return {
      format: 'for-time',
      formatLabel: label,
      rounds: rounds,
      capMinutes: cap ?? source.duration,
      scoreType: 'time',
      scoreHint: 'Tiempo total',
    };
  }

  if (rounds) {
    return {
      format: 'rounds', formatLabel: label, rounds, capMinutes: cap,
      scoreType: 'none', scoreHint: 'Vueltas completadas',
    };
  }

  return {
    format: 'sets', formatLabel: label, capMinutes: cap,
    scoreType: 'none', scoreHint: 'Seguí la prescripción',
  };
};

const prescription = (exercise: SourceExercise): ExercisePrescription => {
  const ordered = /^([A-Z]\d?)\s*[·:]\s*(.+)$/i.exec(exercise.reps ?? '');
  return {
    exerciseId: exercise.name,
    ...(ordered ? { order: ordered[1], reps: ordered[2] } : exercise.reps ? { reps: exercise.reps } : {}),
    ...(exercise.target ? { load: exercise.target } : {}),
    ...(exercise.detail ? { instructions: exercise.detail } : {}),
  };
};

const equipmentForRoutine = (day: SourceDay, original: Workout): string[] => {
  const text = day.blocks.flatMap(block => [
    block.title,
    ...block.exercises.flatMap(exercise => [exercise.name, exercise.target ?? '']),
  ]).join(' ').toLowerCase();
  const equipment = new Set<string>();
  const matches: [RegExp, string][] = [
    [/barbell|barra|bench|squat|deadlift|press|clean|snatch/, 'Barra y discos'],
    [/dumbbell|\bdb\b|\bddb\b/, 'Mancuernas'],
    [/kettlebell|\bkb\b|swing/, 'Kettlebell'],
    [/\btrx\b/, 'TRX'],
    [/box|cajón/, 'Cajón'],
    [/medicine ball|\bmb\b|slam|wall ball/, 'Balón medicinal'],
    [/jump rope|soga|comba/, 'Cuerda'],
    [/run|trote|carrera|shuttle/, 'Espacio para correr'],
    [/band|banda/, 'Banda elástica'],
    [/bench|banco/, 'Banco'],
    [/ab wheel|rueda abdominal/, 'Rueda abdominal'],
  ];
  for (const [pattern, label] of matches) if (pattern.test(text)) equipment.add(label);
  if (day.type === 'run') equipment.add('Zapatillas de running');
  if (!equipment.size && day.type !== 'rest') return original.equipment;
  return [...equipment];
};

const mapDay = (original: Workout, source: SourceDay, cycleWeek: number): Workout => {
  const blocks: WorkoutBlock[] = source.blocks.map((block, index) => {
    const minutes = Math.max(1, Math.round(Number(block.duration) || 1));
    return {
      id: `${original.id}-m4-b${index + 1}`,
      index: index + 1,
      kind: blockKinds[block.type] ?? 'recovery',
      title: block.title,
      minutes,
      duration: `${minutes} min`,
      ...formatBlock(block),
      items: block.exercises.map(prescription),
    };
  });
  const isRest = source.type === 'rest';
  const isRun = source.type === 'run';
  const runningModules = ['running'] as const;
  const nameText = source.title.toLowerCase();
  const isHybrid = /hybrid|hyrox|benchmark/.test(nameText);
  const modules = isRun || isHybrid ? [...runningModules] : original.modules;
  const transfersTo = isRun || isHybrid ? [...runningModules] : original.transfersTo;
  const totalMinutes = blocks.reduce((total, block) => total + block.minutes, 0);
  const id = original.id.replace('-v7-', '-m4-');

  return {
    ...original,
    id,
    week: original.week,
    name: source.title,
    subtitle: `${FOUR_WEEK_PHASES[cycleWeek - 1] ?? `Semana ${cycleWeek}`} · ${source.subtitle ?? source.name}`,
    objective: source.intro,
    duration: `${totalMinutes} min`,
    plannedRpe: isRest ? '—' : phaseRpe[cycleWeek - 1] ?? '8',
    coachNote: `${source.intro} Las cargas marcadas como aproximadas son objetivos sugeridos, no registros reales; ajustalas antes de entrenar.`,
    nextDayActivity: isRest ? 'rest' : isRun ? 'running' : original.nextDayActivity,
    blocks,
    adaptations: [],
    status: isRest ? 'rest' : 'pending',
    phase: cycleWeek,
    station: isRun ? 'outdoor' : isRest ? 'suelo' : original.station,
    equipment: equipmentForRoutine(source, original),
    modules,
    transfersTo,
    capability: isRest ? 'Recovery' : isRun ? 'Engine' : original.capability,
    externalActivity: isRest ? 'rest' : undefined,
  };
};

/** Four prescribed weeks repeated four times to fit TIDE's 16-week calendar. */
export const buildFourWeekMesocycle = (start: string): Workout[] => {
  const templates = buildV7(start);
  return templates.map(template => {
    const cycleWeek = ((template.week - 1) % FOUR_WEEK_COUNT) + 1;
    const source = sourceWeeksTyped[cycleWeek - 1]?.[template.day - 1];
    if (!source) return template;
    return mapDay(template, source, cycleWeek);
  });
};

export const isFourWeekMesocycle = (state: Pick<AppState, 'activePlan'>): boolean =>
  state.activePlan === FOUR_WEEK_PLAN_ID;
