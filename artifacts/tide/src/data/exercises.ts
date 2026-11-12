import type { Exercise, ExerciseCategory, SportModule } from '../types';
import { MOVEMENT } from './ex-movement';
import { STRENGTH_POWER } from './ex-strength';
import { MODULES, CORE_FINISHER } from './ex-modules';
import { CONTRAST, MONTHLY, BIKE } from './ex-contrast';
import { ZIP_EXERCISES } from './ex-zip';
import { NEW_WEEK_EXERCISES } from './ex-new-week';

export { CATEGORIES, MODULE_LABEL, MODULE_COLOR } from './ex-movement';

export const EXERCISES: Exercise[] = [
  ...MOVEMENT,
  ...STRENGTH_POWER,
  ...MODULES,
  ...CORE_FINISHER,
  ...CONTRAST,
  ...MONTHLY,
  ...BIKE,
  ...ZIP_EXERCISES,
  ...NEW_WEEK_EXERCISES,
];

export const EXERCISE_MAP: Record<string, Exercise> = Object.fromEntries(
  EXERCISES.map((e) => [e.id, e]),
);

export const getExercise = (id: string): Exercise =>
  EXERCISE_MAP[id] ?? {
    id,
    name: id,
    categories: ['Fuerza'] as ExerciseCategory[],
    objective: '',
    capacities: [],
    targets: [],
    typical: '',
    cues: [],
    mistakes: [],
    regression: '',
    progression: '',
    equipment: [],
  };

export const byModule = (m: SportModule): Exercise[] =>
  EXERCISES.filter((e) => e.modules?.includes(m));

/** Link de búsqueda de video. No hospedamos video propio en esta versión. */
export const videoUrl = (e: Exercise): string =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(e.video ?? e.name)}`;
