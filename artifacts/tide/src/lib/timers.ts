import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

/**
 * Motor de temporizadores. Un solo hook para todos los formatos: cuenta el
 * tiempo contra `Date.now()`, así no se desincroniza si el teléfono suspende
 * la pestaña o la app pasa a segundo plano.
 */
export type TimerMode = 'countdown' | 'stopwatch' | 'interval';

export interface IntervalStep {
  label: string;
  seconds: number;
  kind: 'work' | 'pause';
  /** Qué viene después, para anunciarlo en pantalla. */
  next?: string;
  round: number;
}

export interface TimerState {
  running: boolean;
  /** Segundos transcurridos desde el arranque. */
  elapsed: number;
  /** Segundos restantes (countdown e interval). */
  remaining: number;
  finished: boolean;
  /** Paso actual en modo intervalos. */
  step?: IntervalStep;
  stepIndex: number;
  totalSteps: number;
}

interface SavedTimerState {
  signature: string;
  elapsed: number;
  running: boolean;
  finished: boolean;
  savedAt: number;
}

export const formatClock = (totalSeconds: number): string => {
  const s = Math.max(0, Math.round(totalSeconds));
  const m = Math.floor(s / 60);
  const rest = s % 60;
  return `${String(m).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
};

/** Construye la secuencia de un 40/20: trabajo y pausa por ejercicio, por vuelta. */
export const buildIntervalSteps = (
  exercises: string[],
  { work, pause, rounds }: { work: number; pause: number; rounds: number },
): IntervalStep[] => {
  const steps: IntervalStep[] = [];
  for (let r = 1; r <= rounds; r += 1) {
    exercises.forEach((name, i) => {
      const isLast = r === rounds && i === exercises.length - 1;
      const nextName = i + 1 < exercises.length ? exercises[i + 1] : r < rounds ? exercises[0] : undefined;
      steps.push({ label: name, seconds: work, kind: 'work', next: nextName, round: r });
      if (!isLast) steps.push({ label: 'Transición', seconds: pause, kind: 'pause', next: nextName, round: r });
    });
  }
  return steps;
};

export const useTimer = ({
  mode,
  seconds = 0,
  steps = [],
  onFinish,
  autoStart = false,
  storageKey,
}: {
  mode: TimerMode;
  /** Duración para countdown. */
  seconds?: number;
  /** Secuencia para modo intervalos. */
  steps?: IntervalStep[];
  onFinish?: () => void;
  autoStart?: boolean;
  storageKey?: string;
}) => {
  const totalIntervalSeconds = useMemo(() => steps.reduce((s, x) => s + x.seconds, 0), [steps]);
  const totalSeconds = mode === 'interval' ? totalIntervalSeconds : seconds;
  const signature = `${mode}:${totalSeconds}:${mode === 'interval'
    ? steps.map((step) => `${step.label}:${step.seconds}:${step.kind}`).join('|')
    : ''}`;
  const [restored] = useState<SavedTimerState | null>(() => {
    if (!storageKey) return null;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return null;
      const value = JSON.parse(raw) as Partial<SavedTimerState>;
      if (
        value.signature !== signature
        || typeof value.elapsed !== 'number'
        || !Number.isFinite(value.elapsed)
        || typeof value.running !== 'boolean'
        || typeof value.finished !== 'boolean'
        || typeof value.savedAt !== 'number'
        || !Number.isFinite(value.savedAt)
      ) return null;
      return value as SavedTimerState;
    } catch {
      return null;
    }
  });
  const initialElapsed = restored
    ? Math.max(0, restored.elapsed + (restored.running ? (Date.now() - restored.savedAt) / 1000 : 0))
    : 0;
  const initialFinished = Boolean(restored?.finished)
    || (mode !== 'stopwatch' && totalSeconds > 0 && initialElapsed >= totalSeconds);
  const initialRunning = restored ? restored.running && !initialFinished : autoStart;
  const [running, setRunning] = useState(initialRunning);
  const [elapsed, setElapsed] = useState(initialElapsed);
  const [finished, setFinished] = useState(initialFinished);
  const anchor = useRef<number | null>(null);
  const accumulated = useRef(initialElapsed);
  const finishRef = useRef(onFinish);
  finishRef.current = onFinish;

  const latest = useRef({ elapsed: initialElapsed, running: initialRunning, finished: initialFinished });
  const lastControlState = useRef({ running: initialRunning, finished: initialFinished });
  const lastPersistedAt = useRef(0);
  const persistSnapshot = useCallback((force = false) => {
    if (!storageKey) return;
    const now = Date.now();
    if (!force && now - lastPersistedAt.current < 1000) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({
        signature,
        ...latest.current,
        savedAt: now,
      } satisfies SavedTimerState));
      lastPersistedAt.current = now;
    } catch {
      // Timer restoration is best-effort; workout records use the main state store.
    }
  }, [signature, storageKey]);

  useLayoutEffect(() => {
    latest.current = { elapsed, running, finished };
    const controlsChanged = lastControlState.current.running !== running
      || lastControlState.current.finished !== finished;
    persistSnapshot(controlsChanged);
    lastControlState.current = { running, finished };
  }, [elapsed, running, finished, persistSnapshot]);

  useEffect(() => {
    if (!storageKey) return undefined;
    const saveBeforeSuspend = () => persistSnapshot(true);
    const saveWhenHidden = () => {
      if (document.visibilityState === 'hidden') saveBeforeSuspend();
    };
    window.addEventListener('pagehide', saveBeforeSuspend);
    document.addEventListener('visibilitychange', saveWhenHidden);
    return () => {
      window.removeEventListener('pagehide', saveBeforeSuspend);
      document.removeEventListener('visibilitychange', saveWhenHidden);
    };
  }, [storageKey, persistSnapshot]);

  const clearSaved = useCallback(() => {
    if (!storageKey) return;
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // The active timer will still close; only its optional resume point is lost.
    }
  }, [storageKey]);

  useEffect(() => {
    if (!running) return undefined;
    anchor.current = Date.now();
    const tick = () => {
      const base = accumulated.current + (Date.now() - (anchor.current ?? Date.now())) / 1000;
      setElapsed(base);
    };
    const h = window.setInterval(tick, 200);
    tick();
    return () => window.clearInterval(h);
  }, [running]);

  // Fin por tiempo agotado
  useEffect(() => {
    if (finished || mode === 'stopwatch' || totalSeconds <= 0) return;
    if (elapsed >= totalSeconds) {
      setFinished(true);
      setRunning(false);
      accumulated.current = totalSeconds;
      setElapsed(totalSeconds);
      finishRef.current?.();
    }
  }, [elapsed, finished, mode, totalSeconds]);

  const start = useCallback(() => {
    if (finished) return;
    accumulated.current = elapsed;
    setRunning(true);
  }, [elapsed, finished]);

  const pause = useCallback(() => {
    accumulated.current = elapsed;
    setRunning(false);
  }, [elapsed]);

  const reset = useCallback(() => {
    accumulated.current = 0;
    anchor.current = null;
    setElapsed(0);
    setFinished(false);
    setRunning(false);
  }, []);

  const toggle = useCallback(() => (running ? pause() : start()), [running, pause, start]);

  // Paso actual en modo intervalos
  const { step, stepIndex, stepRemaining } = useMemo(() => {
    if (mode !== 'interval' || !steps.length) {
      return { step: undefined, stepIndex: 0, stepRemaining: 0 };
    }
    let acc = 0;
    for (let i = 0; i < steps.length; i += 1) {
      const end = acc + steps[i].seconds;
      if (elapsed < end) return { step: steps[i], stepIndex: i, stepRemaining: end - elapsed };
      acc = end;
    }
    const last = steps[steps.length - 1];
    return { step: last, stepIndex: steps.length - 1, stepRemaining: 0 };
  }, [mode, steps, elapsed]);

  const state: TimerState = {
    running,
    elapsed,
    remaining: mode === 'stopwatch' ? 0 : mode === 'interval' ? stepRemaining : Math.max(0, totalSeconds - elapsed),
    finished,
    step,
    stepIndex,
    totalSteps: steps.length,
  };

  return { ...state, start, pause, reset, toggle, totalSeconds, clearSaved };
};
