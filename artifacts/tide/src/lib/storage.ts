import type { AppState } from '../types';
import { DEFAULT_PROFILE } from '../data/defaults';
import { rekeyLegacySessions } from './legacy-set-keys';
import { buildV7 } from '../data/v7';
import { FOUR_WEEK_PHASES, FOUR_WEEK_PLAN_ID, MESO_START } from '../data/mesocycle';
import { todayISO } from './date';
import { notifyLocalSave } from './cloud-sync';

export const STORAGE_KEY = 'tide.state.v1';
export const STATE_VERSION = 5;
export const FIXED_PROGRAM_START = '2026-10-12';

export const emptyState = (): AppState => ({
  version: STATE_VERSION,
  activePlan: FOUR_WEEK_PLAN_ID,
  mesoAutoApplied: true,
  programStart: MESO_START,
  v8From: MESO_START,
  schedule: {},
  skippedWorkouts: [],
  phaseSettings: { names: [...FOUR_WEEK_PHASES], deloadWeeks: [4, 8, 12, 16] },
  profile: { ...DEFAULT_PROFILE },
  readiness: {},
  adjustments: {},
  sessions: {},
  history: [],
  calendarOverrides: {},
  metrics: {},
  nutrition: {},
  extras: {},
  lastScreen: 'today',
});

/**
 * MIGRACIÓN
 * ─────────
 * Cambiar la rutina o la lógica NUNCA borra lo que ya entrenaste.
 * Se conserva historial, sesiones, métricas y perfil. La fecha del programa se
 * ancla una sola vez al inicio acordado: nunca se recalcula desde "hoy".
 */
/**
 * Paso único al mesociclo de 4 semanas (pedido por Paul): si el estado todavía está en V8
 * y nunca se aplicó, se cambia al mesociclo anclado al lunes MESO_START. Conserva historial,
 * sesiones, perfil y mediciones. Si después alguien vuelve a V8 a mano, se respeta.
 */
const applyMesocycleOnce = (state: AppState): AppState => {
  if (state.mesoAutoApplied) return state;
  if (state.activePlan === FOUR_WEEK_PLAN_ID) return { ...state, mesoAutoApplied: true };
  return {
    ...state,
    mesoAutoApplied: true,
    activePlan: FOUR_WEEK_PLAN_ID,
    programStart: MESO_START,
    v8From: MESO_START,
    schedule: {},
    skippedWorkouts: [],
    phaseSettings: { names: [...FOUR_WEEK_PHASES], deloadWeeks: [4, 8, 12, 16] },
    calendarOverrides: Object.fromEntries(
      Object.entries(state.calendarOverrides ?? {}).filter(([entryDate]) => entryDate < MESO_START),
    ),
  };
};

export const migrate = (parsed: Partial<AppState>): AppState => applyMesocycleOnce(migrateBase(parsed));

const migrateBase = (parsed: Partial<AppState>): AppState => {
  const base = emptyState();
  const sessions = (parsed.version ?? 0) >= 4
    ? parsed.sessions ?? {}
    : rekeyLegacySessions(parsed.sessions ?? {});
  // Archive identities, not contents: old set keys, dates and loads stay intact.
  // The start marker makes this one-time operation safe across reloads.
  // V8 never re-anchors an existing calendar. Freeze definitions of started V7
  // sessions before changing future prescriptions. Older records remain untouched.
  const start = parsed.programStart ?? FIXED_PROGRAM_START;
  const legacy = new Map(buildV7(start).map(w => [w.id, w]));
  return {
    ...base,
    ...parsed,
    version: STATE_VERSION,
    // No heredar el flag del estado vacío: solo cuenta si el estado guardado ya lo tenía.
    mesoAutoApplied: parsed.mesoAutoApplied,
    profile: { ...DEFAULT_PROFILE, ...parsed.profile },
    // Lo que se conserva sí o sí entre versiones:
    history: parsed.history ?? [],
    sessions: Object.fromEntries(Object.entries(sessions).map(([id, session]) => [
      id, session.definition || !legacy.has(id) ? session : { ...session, definition: legacy.get(id) },
    ])),
    adjustments: parsed.adjustments ?? {},
    metrics: parsed.metrics ?? {},
    readiness: parsed.readiness ?? {},
    calendarOverrides: parsed.calendarOverrides ?? {},
    programStart: start,
    v8From: parsed.v8From ?? base.v8From,
  };
};

let storageProblem: string | null = null;
export const getStorageProblem = () => storageProblem;

export const loadState = (): AppState => {
  if (typeof window === 'undefined') return emptyState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as Partial<AppState>;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Formato de datos inválido');
    if ((parsed.version ?? 0) > STATE_VERSION) throw new Error('Datos de una versión más nueva; no se sobrescribirán');
    if (parsed.version !== STATE_VERSION) {
      // A failed backup blocks writes; never silently destroy the only copy.
      window.localStorage.setItem(`${STORAGE_KEY}.before-v8`, raw);
    }
    if (!parsed.mesoAutoApplied && parsed.activePlan !== FOUR_WEEK_PLAN_ID) {
      // Respaldo local antes del paso único al mesociclo de 4 semanas.
      window.localStorage.setItem(`${STORAGE_KEY}.before-meso`, raw);
    }
    // Versión distinta: migramos en vez de borrar.
    return migrate(parsed);
  } catch {
    storageProblem = 'No se pudieron leer o respaldar tus datos. Se bloqueó el guardado para protegerlos. Descargá una copia desde Perfil y liberá espacio antes de recargar.';
    return emptyState();
  }
};

export const saveState = (state: AppState): void => {
  if (storageProblem) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    notifyLocalSave();
  } catch {
    storageProblem = 'No se pudo guardar en este dispositivo. Exportá tus datos antes de cerrar la app.';
    window.dispatchEvent(new Event('tide-storage-error'));
  }
};

export const clearState = (): void => {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* noop */
  }
};
