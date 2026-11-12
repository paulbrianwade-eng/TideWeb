import type { AppState } from '../types';
import { buildBackup } from './export';
import { STORAGE_KEY } from './storage';
import { FOUR_WEEK_PHASES, FOUR_WEEK_PLAN_ID } from '../data/mesocycle';

const DEFAULT_PHASES = {
  names: ['FOUNDATION', 'BUILD', 'HYBRID', 'RACE PREP'],
  deloadWeeks: [4, 8, 12, 16],
};

/**
 * Start a clean training cycle without discarding the user's training data.
 * Date-keyed records before today remain available in history.
 */
export const resetPlanFromDate = (state: AppState, date: string): AppState => ({
  ...state,
  lastScreen: 'today',
  activePlan: 'v8',
  programStart: date,
  v8From: date,
  schedule: {},
  skippedWorkouts: [],
  phaseSettings: { names: [...DEFAULT_PHASES.names], deloadWeeks: [...DEFAULT_PHASES.deloadWeeks] },
  calendarOverrides: Object.fromEntries(
    Object.entries(state.calendarOverrides ?? {}).filter(([entryDate]) => entryDate < date),
  ),
});

/** Switch to the attached four-week mesocycle without touching completed data. */
export const integrateFourWeekMesocycle = (state: AppState, date: string): AppState => ({
  ...state,
  lastScreen: 'today',
  programStart: date,
  v8From: date,
  activePlan: FOUR_WEEK_PLAN_ID,
  schedule: {},
  skippedWorkouts: [],
  phaseSettings: { names: [...FOUR_WEEK_PHASES], deloadWeeks: [4, 8, 12, 16] },
  calendarOverrides: Object.fromEntries(
    Object.entries(state.calendarOverrides ?? {}).filter(([entryDate]) => entryDate < date),
  ),
});

/** Persist and download a complete backup before changing the active plan. */
const createPlanBackup = (
  state: AppState,
  date: string,
  purpose: string,
  fileName: string,
): { fileName: string } => {
  const backup = JSON.stringify(buildBackup(state), null, 2);
  const recoveryKey = `${STORAGE_KEY}.before-${purpose}.${date}`;

  if (window.localStorage.getItem(recoveryKey)) {
    throw new Error('Ya existe un respaldo de reinicio para hoy. No se modificó el plan.');
  }

  window.localStorage.setItem(recoveryKey, backup);
  if (window.localStorage.getItem(recoveryKey) !== backup) {
    throw new Error('No se pudo verificar el respaldo local. No se modificó el plan.');
  }

  const objectUrl = URL.createObjectURL(new Blob([backup], { type: 'application/json;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = fileName;
  link.style.display = 'none';
  document.body.appendChild(link);
  try {
    link.click();
  } finally {
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  }

  return { fileName };
};

export const createPlanResetBackup = (state: AppState, date: string): { fileName: string } =>
  createPlanBackup(state, date, 'plan-reset', `tide-respaldo-previo-al-reinicio-${date}.json`);

export const createMesocycleBackup = (state: AppState, date: string): { fileName: string } =>
  createPlanBackup(state, date, 'mesocycle-4-week', `tide-respaldo-previo-al-mesociclo-${date}.json`);
