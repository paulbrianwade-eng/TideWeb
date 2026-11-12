export type SessionView = 'block' | 'exercise';

export interface RestTimerResume {
  seconds: number;
  next?: string;
  blockIndex: number;
}

export interface SessionResume {
  workoutId: string;
  blockIndex: number;
  view: SessionView;
  exerciseIndex: number;
  timerBlockId?: string | null;
  restTimer?: RestTimerResume | null;
}

const STORAGE_KEY = 'tide.session-resume.v1';

const isSessionResume = (value: unknown): value is SessionResume => {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<SessionResume>;
  return typeof candidate.workoutId === 'string'
    && candidate.workoutId.length > 0
    && Number.isInteger(candidate.blockIndex)
    && (candidate.blockIndex ?? -1) >= 0
    && (candidate.view === 'block' || candidate.view === 'exercise')
    && Number.isInteger(candidate.exerciseIndex)
    && (candidate.exerciseIndex ?? -1) >= 0
    && (candidate.timerBlockId === undefined || candidate.timerBlockId === null || typeof candidate.timerBlockId === 'string')
    && (candidate.restTimer === undefined || candidate.restTimer === null || (
      typeof candidate.restTimer === 'object'
      && Number.isFinite(candidate.restTimer.seconds)
      && candidate.restTimer.seconds >= 0
      && Number.isInteger(candidate.restTimer.blockIndex)
      && candidate.restTimer.blockIndex >= 0
      && (candidate.restTimer.next === undefined || typeof candidate.restTimer.next === 'string')
    ));
};

export const readSessionResume = (workoutId?: string): SessionResume | null => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isSessionResume(parsed) || (workoutId && parsed.workoutId !== workoutId)) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const saveSessionResume = (resume: SessionResume): void => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(resume));
  } catch {
    // Workout data has its own protected persistence and remains intact.
  }
};

export const clearSessionResume = (): void => {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // This only stores the last open screen, not training data.
  }
};

export const timerStorageKey = (workoutId: string, timerId: string): string =>
  `tide.timer.v1:${encodeURIComponent(workoutId)}:${encodeURIComponent(timerId)}`;
