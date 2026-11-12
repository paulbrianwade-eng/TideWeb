import { useCallback, createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type {
  AppState,
  FinisherScore,
  TransitionResult,
  CompletedSet,
  DailyReadiness,
  MetricEntry,
  NutritionDay,
  NutritionDayType,
  SessionSummary,
  SportActivity,
  UserProfile,
  Workout,
  WorkoutSession,
} from '../types';
import { clearState, emptyState, loadState, migrate, saveState, STORAGE_KEY, STATE_VERSION, getStorageProblem } from '../lib/storage';
import { CLOUD_STATE_EVENT, initCloud } from '../lib/cloud-sync';
import { defaultStart } from '../data/program';
import { buildScheduledProgram } from '../data/v8';
import type { HybridResult } from '../types/hybrid';
import { todayISO } from '../lib/date';
import {
  createMesocycleBackup,
  createPlanResetBackup,
  integrateFourWeekMesocycle,
  resetPlanFromDate,
} from '../lib/plan-reset';
import { FOUR_WEEK_PLAN_ID } from '../data/mesocycle';

type Action =
  | { type: 'profile'; payload: Partial<UserProfile> }
  | { type: 'readiness'; date: string; payload: Partial<DailyReadiness> }
  | { type: 'adjustments'; date: string; payload: string[] }
  | { type: 'session'; workoutId: string; payload: WorkoutSession }
  | { type: 'blockChoice'; workoutId: string; blockId: string; choice: string }
  | { type: 'summary'; payload: SessionSummary }
  | { type: 'override'; date: string; activity: SportActivity | null }
  | { type: 'metric'; metricId: string; entry: MetricEntry }
  | { type: 'nutrition'; date: string; payload: Partial<NutritionDay> }
  | { type: 'extra'; date: string; exerciseId: string }
  | { type: 'screen'; payload: string }
  | { type: 'programStart'; date: string }
  | { type: 'restartPlan'; date: string }
  | { type: 'integrateMesocycle'; date: string }
  | { type: 'schedule'; payload: Record<string, string> }
  | { type: 'skip'; workoutId: string; skipped: boolean }
  | { type: 'phases'; payload: NonNullable<AppState['phaseSettings']> }
  | { type: 'hybrid'; workout: Workout; blockId: string; result: HybridResult }
  | { type: 'start'; workout: Workout }
  | { type: 'blockComplete'; workout: Workout; blockId: string }
  | { type: 'reset' };

const defaultReadiness: DailyReadiness = { energy: null, sleep: null, pain: null, motivation: null };
const newSession = (workout: Workout): WorkoutSession => ({
  workoutId: workout.id, date: workout.date, definition: structuredClone(workout),
  startedAt: Date.now(), elapsedMs: 0, blockIndex: 0, activeKey: null,
  sets: {}, skipped: [], substitutions: {},
});

const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'schedule':
      return { ...state, schedule: { ...state.schedule, ...action.payload } };
    case 'skip':
      return { ...state, skippedWorkouts: action.skipped
        ? [...new Set([...(state.skippedWorkouts ?? []), action.workoutId])]
        : (state.skippedWorkouts ?? []).filter(id => id !== action.workoutId) };
    case 'phases':
      return { ...state, phaseSettings: action.payload };
    case 'start': {
      const existing = state.sessions[action.workout.id];
      if (existing?.definition) return state;
      return { ...state, sessions: { ...state.sessions, [action.workout.id]: {
        ...newSession(action.workout), ...existing, definition: structuredClone(action.workout),
      } } };
    }
    case 'blockComplete': {
      const existing = state.sessions[action.workout.id] ?? newSession(action.workout);
      return { ...state, sessions: { ...state.sessions, [action.workout.id]: {
        ...existing, completedBlocks: [...new Set([...(existing.completedBlocks ?? []), action.blockId])],
      } } };
    }
    case 'hybrid': {
      const existing = state.sessions[action.workout.id] ?? newSession(action.workout);
      const isFinisher = action.workout.blocks.find(b => b.id === action.blockId)?.kind === 'finisher';
      const seconds = Math.round(action.result.activeElapsedSec);
      const score = { rounds: String(action.result.completedRounds), reps: String(action.result.partialReps),
        time: `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`, note: action.result.notes };
      return { ...state, sessions: { ...state.sessions, [action.workout.id]: {
        ...existing, hybridResults: { ...existing.hybridResults, [action.blockId]: action.result },
        ...(isFinisher ? { finisherScore: score } : {}),
      } } };
    }
    case 'profile':
      return { ...state, profile: { ...state.profile, ...action.payload } };
    case 'readiness':
      return {
        ...state,
        readiness: {
          ...state.readiness,
          [action.date]: { ...defaultReadiness, ...state.readiness[action.date], ...action.payload },
        },
      };
    case 'adjustments':
      return { ...state, adjustments: { ...state.adjustments, [action.date]: action.payload } };
    case 'session':
      return { ...state, sessions: { ...state.sessions, [action.workoutId]: action.payload } };
    case 'blockChoice': {
      const existing = state.sessions[action.workoutId];
      if (!existing) return state;
      return {
        ...state,
        sessions: {
          ...state.sessions,
          [action.workoutId]: {
            ...existing,
            choices: { ...(existing.choices ?? {}), [action.blockId]: action.choice },
          },
        },
      };
    }
    case 'summary':
      return {
        ...state,
        history: [action.payload, ...state.history.filter((h) => h.workoutId !== action.payload.workoutId)],
      };
    case 'override': {
      const next = { ...state.calendarOverrides };
      if (action.activity === null) delete next[action.date];
      else next[action.date] = action.activity;
      return { ...state, calendarOverrides: next };
    }
    case 'metric': {
      const list = state.metrics[action.metricId] ?? [];
      const filtered = list.filter((x) => x.date !== action.entry.date);
      return {
        ...state,
        metrics: {
          ...state.metrics,
          [action.metricId]: [...filtered, action.entry].sort((a, b) => a.date.localeCompare(b.date)),
        },
      };
    }
    case 'nutrition': {
      const current: NutritionDay = state.nutrition[action.date] ?? {
        date: action.date,
        dayType: 'fuerza',
        mealsDone: [],
        water: 0,
        creatine: false,
      };
      return { ...state, nutrition: { ...state.nutrition, [action.date]: { ...current, ...action.payload } } };
    }
    case 'extra': {
      const list = state.extras[action.date] ?? [];
      const next = list.includes(action.exerciseId)
        ? list.filter((x) => x !== action.exerciseId)
        : [...list, action.exerciseId];
      return { ...state, extras: { ...state.extras, [action.date]: next } };
    }
    case 'screen':
      return { ...state, lastScreen: action.payload };
    case 'programStart':
      return { ...state, programStart: action.date };
    case 'restartPlan':
      return resetPlanFromDate(state, action.date);
    case 'integrateMesocycle':
      return integrateFourWeekMesocycle(state, action.date);
    case 'reset':
      return emptyState();
    default:
      return state;
  }
};

interface Ctx {
  startSession: (workout: Workout) => void;
  setHybridResult: (workoutId: string, blockId: string, result: HybridResult) => void;
  markBlockComplete: (workoutId: string, blockId: string) => void;
  setSchedule: (workoutId: string, date: string) => boolean;
  swapWorkouts: (idA: string, idB: string) => boolean;
  setSkipped: (workoutId: string, skipped: boolean) => void;
  setPhaseSettings: (settings: NonNullable<AppState['phaseSettings']>) => void;
  state: AppState;
  program: Workout[];
  today: string;
  workoutFor: (date: string) => Workout | null;
  readinessFor: (date: string) => DailyReadiness;
  sessionFor: (workoutId: string) => WorkoutSession | undefined;
  summaryFor: (workoutId: string) => SessionSummary | undefined;
  nutritionFor: (date: string) => NutritionDay;
  setProfile: (p: Partial<UserProfile>) => void;
  setReadiness: (date: string, p: Partial<DailyReadiness>) => void;
  setAdjustments: (date: string, ids: string[]) => void;
  saveSession: (s: WorkoutSession) => void;
  saveSummary: (s: SessionSummary) => void;
  setOverride: (date: string, a: SportActivity | null) => void;
  setMetric: (metricId: string, entry: MetricEntry) => void;
  setNutrition: (date: string, p: Partial<NutritionDay>) => void;
  setDayType: (date: string, t: NutritionDayType) => void;
  toggleExtra: (date: string, exerciseId: string) => void;
  setScreen: (s: string) => void;
  resetDemo: () => void;
  restartPlanFromToday: () => { ok: boolean; message: string };
  integrateFourWeekMesocycleFromToday: () => { ok: boolean; message: string };
  emptySet: () => CompletedSet;
  workoutById: (id: string) => Workout | undefined;
  /** Próxima sesión sin completar: con esto la app retoma donde quedaste. */
  nextPending: () => Workout | undefined;
  isDone: (workoutId: string) => boolean;
  recordSet: (workoutId: string, key: string, index: number, entry: Partial<CompletedSet>) => void;
  setFinisherScore: (workoutId: string, score: FinisherScore) => void;
  recordTransition: (workoutId: string, result: TransitionResult) => void;
  setBlockChoice: (workoutId: string, blockId: string, choice: string) => void;
}

const AppCtx = createContext<Ctx | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState(loadState);
  const stateRef = useRef(state);
  const [storageError, setStorageError] = useState(getStorageProblem);
  const dispatch = useCallback((action: Action) => {
    const next = reducer(stateRef.current, action);
    stateRef.current = next;
    // Persist each user action synchronously, not on a delayed render/tick.
    saveState(next);
    setStorageError(getStorageProblem());
    setState(next);
  }, []);
  // El programa se ancla a la fecha guardada la primera vez. Nunca se re-ancla.
  const programStart = state.programStart ?? defaultStart();
  const program = useMemo(() => buildScheduledProgram(programStart, state), [programStart, state.activePlan, state.sessions, state.history, state.schedule, state.skippedWorkouts, state.phaseSettings, state.v8From]);

  useEffect(() => {
    if (!state.programStart) dispatch({ type: 'programStart', date: programStart });
  }, [state.programStart, programStart]);
  const today = todayISO();

  useEffect(() => {
    saveState(stateRef.current);
    const sync = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || !event.newValue) return;
      const loaded = loadState();
      stateRef.current = loaded;
      setState(loaded);
      setStorageError(getStorageProblem());
    };
    window.addEventListener('storage', sync);
    // Estado que llega desde la nube (otro dispositivo o primera sincronización).
    const fromCloud = (event: Event) => {
      try {
        const parsed = JSON.parse((event as CustomEvent<string>).detail) as Partial<AppState>;
        if (!parsed || typeof parsed !== 'object' || (parsed.version ?? 0) > STATE_VERSION) return;
        const next = migrate(parsed);
        saveState(next);
        stateRef.current = next;
        setState(next);
        setStorageError(getStorageProblem());
      } catch { /* datos remotos inválidos: se conserva el estado local */ }
    };
    window.addEventListener(CLOUD_STATE_EVENT, fromCloud);
    void initCloud();
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener(CLOUD_STATE_EVENT, fromCloud);
    };
  }, []);

  const workoutById = useCallback(
    (id: string) => program.find((w) => w.id === id),
    [program],
  );

  const isDone = useCallback(
    (workoutId: string) => state.history.some((h) => h.workoutId === workoutId),
    [state.history],
  );

  /**
   * La primera sesión de entrenamiento que todavía no registraste.
   * Si ya hiciste el lunes, esto devuelve el martes aunque el calendario diga otra cosa:
   * el programa avanza con vos, no con el reloj.
   */
  const nextPending = useCallback(
    () =>
      program.find((w) => w.status !== 'rest' && !state.skippedWorkouts?.includes(w.id) && !state.history.some((h) => h.workoutId === w.id)),
    [program, state.history, state.skippedWorkouts],
  );

  /** Registra una serie creando la sesión si todavía no existe. */
  const recordSet = useCallback(
    (workoutId: string, key: string, index: number, entry: Partial<CompletedSet>) => {
      const workout = program.find((w) => w.id === workoutId);
      if (!workout) return;
      const existing = state.sessions[workoutId];
      const base: WorkoutSession = existing ?? {
        definition: structuredClone(workout),
        workoutId,
        date: workout.date,
        startedAt: Date.now(),
        elapsedMs: 0,
        blockIndex: 0,
        activeKey: key,
        sets: {},
        skipped: [],
        substitutions: {},
      };
      const rows = [...(base.sets[key] ?? [])];
      while (rows.length <= index) rows.push({ done: false, load: '', reps: '' });
      rows[index] = { ...rows[index], ...entry };
      dispatch({
        type: 'session',
        workoutId,
        payload: { ...base, activeKey: key, sets: { ...base.sets, [key]: rows } },
      });
    },
    [program, state.sessions],
  );

  /** Guarda el resultado de una vuelta a la manzana. */
  const recordTransition = useCallback(
    (workoutId: string, result: TransitionResult) => {
      const workout = program.find((w) => w.id === workoutId);
      const existing = state.sessions[workoutId];
      if (!workout) return;
      const base: WorkoutSession = existing ?? {
        definition: structuredClone(workout),
        workoutId, date: workout.date, startedAt: Date.now(), elapsedMs: 0,
        blockIndex: 0, activeKey: null, sets: {}, skipped: [], substitutions: {},
      };
      dispatch({
        type: 'session',
        workoutId,
        payload: { ...base, transitions: { ...(base.transitions ?? {}), [result.blockId]: result } },
      });
    },
    [program, state.sessions],
  );

  const setFinisherScore = useCallback(
    (workoutId: string, score: FinisherScore) => {
      const workout = program.find((candidate) => candidate.id === workoutId);
      if (!workout) return;
      const existing: WorkoutSession = state.sessions[workoutId] ?? {
        definition: structuredClone(workout),
        workoutId,
        date: workout.date,
        startedAt: Date.now(),
        elapsedMs: 0,
        blockIndex: 0,
        activeKey: null,
        sets: {},
        skipped: [],
        substitutions: {},
      };
      dispatch({ type: 'session', workoutId, payload: { ...existing, finisherScore: score } });
    },
    [program, state.sessions],
  );

  const setBlockChoice = useCallback(
    (workoutId: string, blockId: string, choice: string) => {
      const workout = program.find((candidate) => candidate.id === workoutId);
      if (!workout) return;
      const existing = state.sessions[workoutId] ?? {
        definition: structuredClone(workout),
        workoutId,
        date: workout.date,
        startedAt: Date.now(),
        elapsedMs: 0,
        blockIndex: 0,
        activeKey: null,
        sets: {},
        skipped: [],
        substitutions: {},
      };
      dispatch({ type: 'session', workoutId, payload: existing });
      dispatch({ type: 'blockChoice', workoutId, blockId, choice });
    },
    [program, state.sessions],
  );

  const editable = (id: string) => !state.sessions[id] && !state.history.some(h => h.workoutId === id);
  const value: Ctx = {
    startSession: workout => dispatch({ type: 'start', workout }),
    setHybridResult: (workoutId, blockId, result) => {
      const workout = workoutById(workoutId);
      if (workout) dispatch({ type: 'hybrid', workout, blockId, result });
    },
    markBlockComplete: (workoutId, blockId) => {
      const workout = workoutById(workoutId);
      if (workout) dispatch({ type: 'blockComplete', workout, blockId });
    },
    setSchedule: (workoutId, date) => {
      if (!editable(workoutId) || !/^\d{4}-\d{2}-\d{2}$/.test(date) || program.some(w => w.id !== workoutId && w.date === date)) return false;
      dispatch({ type: 'schedule', payload: { [workoutId]: date } });
      return true;
    },
    swapWorkouts: (idA, idB) => {
      const a = workoutById(idA), b = workoutById(idB);
      if (!a || !b || !editable(idA) || !editable(idB)) return false;
      dispatch({ type: 'schedule', payload: { [idA]: b.date, [idB]: a.date } });
      return true;
    },
    setSkipped: (workoutId, skipped) => {
      if (editable(workoutId)) dispatch({ type: 'skip', workoutId, skipped });
    },
    setPhaseSettings: payload => dispatch({ type: 'phases', payload }),
    state,
    program,
    today,
    workoutFor: (date) => program.find((w) => w.date === date) ?? null,
    readinessFor: (date) => state.readiness[date] ?? defaultReadiness,
    sessionFor: (workoutId) => state.sessions[workoutId],
    summaryFor: (workoutId) => state.history.find((h) => h.workoutId === workoutId),
    nutritionFor: (date) =>
      state.nutrition[date] ?? { date, dayType: 'fuerza', mealsDone: [], water: 0, creatine: false },
    setProfile: (p) => dispatch({ type: 'profile', payload: p }),
    setReadiness: (date, p) => dispatch({ type: 'readiness', date, payload: p }),
    setAdjustments: (date, ids) => dispatch({ type: 'adjustments', date, payload: ids }),
    saveSession: (s) => dispatch({ type: 'session', workoutId: s.workoutId, payload: s }),
    saveSummary: (s) => dispatch({ type: 'summary', payload: s }),
    setOverride: (date, a) => dispatch({ type: 'override', date, activity: a }),
    setMetric: (metricId, entry) => dispatch({ type: 'metric', metricId, entry }),
    setNutrition: (date, p) => dispatch({ type: 'nutrition', date, payload: p }),
    setDayType: (date, t) => dispatch({ type: 'nutrition', date, payload: { dayType: t } }),
    toggleExtra: (date, exerciseId) => dispatch({ type: 'extra', date, exerciseId }),
    setScreen: (s) => dispatch({ type: 'screen', payload: s }),
    resetDemo: () => {
      clearState();
      dispatch({ type: 'reset' });
    },
    restartPlanFromToday: () => {
      if (stateRef.current.programStart === today) {
        return { ok: false, message: 'El plan ya empieza hoy; no se modificó.' };
      }
      if (getStorageProblem()) {
        return { ok: false, message: 'No se pudo leer el almacenamiento. Exportá tus datos; el plan no se modificó.' };
      }

      try {
        createPlanResetBackup(stateRef.current, today);
      } catch (error) {
        return {
          ok: false,
          message: error instanceof Error ? error.message : 'No se pudo crear el respaldo; el plan no se modificó.',
        };
      }

      const next = reducer(stateRef.current, { type: 'restartPlan', date: today });
      saveState(next);
      const storageError = getStorageProblem();
      setStorageError(storageError);
      if (storageError) {
        return { ok: false, message: 'El respaldo se descargó, pero no se pudo guardar el reinicio. El plan anterior sigue intacto.' };
      }
      stateRef.current = next;
      setState(next);
      return { ok: true, message: `Plan reiniciado desde hoy. Se descargó un respaldo JSON.` };
    },
    integrateFourWeekMesocycleFromToday: () => {
      const current = stateRef.current;
      if (current.activePlan === FOUR_WEEK_PLAN_ID && current.programStart === today) {
        return { ok: false, message: 'El mesociclo ya está activo desde hoy; no se modificó.' };
      }
      if (getStorageProblem()) {
        return { ok: false, message: 'No se pudo leer el almacenamiento. Exportá tus datos; el plan no se modificó.' };
      }

      try {
        createMesocycleBackup(current, today);
      } catch (error) {
        return {
          ok: false,
          message: error instanceof Error ? error.message : 'No se pudo crear el respaldo; el plan no se modificó.',
        };
      }

      const next = reducer(current, { type: 'integrateMesocycle', date: today });
      saveState(next);
      const storageError = getStorageProblem();
      setStorageError(storageError);
      if (storageError) {
        return { ok: false, message: 'El respaldo se descargó, pero no se pudo guardar el nuevo plan. El plan anterior sigue intacto.' };
      }
      stateRef.current = next;
      setState(next);
      return { ok: true, message: 'Mesociclo de 4 semanas integrado desde hoy. Historial y perfil conservados; se descargó un respaldo.' };
    },
    emptySet: () => ({ done: false }),
    workoutById,
    nextPending,
    isDone,
    recordSet,
    setFinisherScore,
    recordTransition,
    setBlockChoice,
  };

  return <AppCtx.Provider value={value}>
    {storageError && <div role="alert" className="sticky top-0 z-[100] bg-red-50 p-4 text-sm text-red-900">
      {storageError}
      <button type="button" className="btn-ghost mt-2" onClick={() => {
        try {
          const raw = window.localStorage.getItem(STORAGE_KEY);
          if (!raw) return;
          const url = URL.createObjectURL(new Blob([raw], { type: 'application/json' }));
          const link = document.createElement('a');
          link.href = url; link.download = 'tide-datos-originales.json'; link.click();
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        } catch { /* Keep the warning visible if browser storage itself is blocked. */ }
      }}>Descargar datos originales sin modificar</button>
    </div>}
    {children}
  </AppCtx.Provider>;
};

export const useApp = (): Ctx => {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useApp debe usarse dentro de AppProvider');
  return ctx;
};
