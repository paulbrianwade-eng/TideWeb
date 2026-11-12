import type { SportActivity, Workout, WorkoutBlock } from '../types';
import { STATION_LABEL } from './equipment';
import { getExercise } from './exercises';
import { buildV7, V7_WEEK, phaseForWeek, PHASES } from './v7';

export const TOTAL_WEEKS = 16;
export const defaultStart = (): string => '2026-10-12';

export const ACTIVITY_LABEL: Record<SportActivity, string> = {
  surf: 'Surf', golf: 'Golf', ski: 'Esquí', running: 'Running',
  rest: 'Descanso', gym: 'Gimnasio', home: 'Entrenamiento en casa',
};

export const BLOCK_LABEL: Record<WorkoutBlock['kind'], string> = {
  'zona-media': 'Core', fuerza: 'Fuerza', atleta: 'Atleta',
  finisher: 'Híbrido', outdoor: 'Cardio', recovery: 'Recuperación',
  transicion: 'Vuelta a la manzana',
};

export const WEEK_STRUCTURE = V7_WEEK.map(day => ({
  name: day.name,
  tagline: day.tagline,
  station: STATION_LABEL[day.station],
}));

export const equipmentFor = (blocks: WorkoutBlock[]): string[] => {
  const set = new Set<string>();
  blocks.forEach(block => block.items.forEach(item => getExercise(item.exerciseId).equipment.forEach(equipment => set.add(equipment))));
  set.delete('Peso corporal');
  set.delete('Colchoneta');
  return [...set].sort();
};

export const totalMinutes = (blocks: WorkoutBlock[]): number =>
  blocks.reduce((total, block) => total + block.minutes, 0);

export const buildProgram = (start: string = defaultStart()): Workout[] => buildV7(start);

export { STATION_LABEL, phaseForWeek };
export { schemeFor, loadFor, SCHEMES } from './month';
export const TRAINING_PHASES = PHASES;