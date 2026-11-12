import type { CompletedSet, WorkoutSession, Workout, WorkoutBlock } from '../types';

/**
 * La clave incluye el ejercicio además de su posición. Si una actualización de
 * la rutina cambia el contenido del bloque, un registro viejo nunca se muestra
 * como si perteneciera al ejercicio nuevo.
 */
export const setKey = (blockId: string, exerciseId: string, index: number) =>
  `${blockId}:${exerciseId}:${index}`;

/** Cuántas entradas de series debería tener un ejercicio. */
export const plannedSets = (item: WorkoutBlock['items'][number], block: WorkoutBlock): number =>
  item.sets ?? block.rounds ?? 1;

const plannedItemEntries = (workout: Workout, session?: WorkoutSession) =>
  workout.blocks.flatMap((block) => {
    const choice = session?.choices?.[block.id];
    return block.items
      .map((item, index) => ({ block, item, index }))
      .filter(({ item }) => !block.choiceLabel || (choice !== undefined && item.order === choice));
  });

export const totalPlannedSets = (workout: Workout, session?: WorkoutSession): number =>
  plannedItemEntries(workout, session).reduce(
    (sum, { block, item }) => sum + plannedSets(item, block),
    0,
  );

export const completedSets = (session?: WorkoutSession, workout?: Workout): number => {
  if (!session) return 0;
  const validKeys = workout
    ? new Set(plannedItemEntries(workout, session).map(({ block, item, index }) =>
        setKey(block.id, item.exerciseId, index)))
    : null;
  return Object.entries(session.sets)
    .filter(([key]) => !validKeys || validKeys.has(key))
    .flatMap(([, rows]) => rows as CompletedSet[])
    .filter((set) => set.done)
    .length;
};

export const sessionProgress = (workout: Workout, session?: WorkoutSession): number => {
  if (!session) return 0;
  const total = totalPlannedSets(workout, session);
  return total ? Math.min(1, completedSets(session, workout) / total) : 0;
};

/** Ejercicios marcados como completos, por clave bloque:índice. */
export const doneKeys = (session?: WorkoutSession): string[] => {
  if (!session) return [];
  return Object.entries(session.sets)
    .filter(([, sets]) => (sets as CompletedSet[]).length > 0 && (sets as CompletedSet[]).every((s) => s.done))
    .map(([k]) => k);
};
