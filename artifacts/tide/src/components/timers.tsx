import { Pause, Play, RotateCcw, X } from 'lucide-react';
import type { WorkoutBlock } from '../types';
import { getExercise } from '../data/exercises';
import { buildIntervalSteps, formatClock, useTimer } from '../lib/timers';

const Controls = ({
  running,
  onToggle,
  onReset,
  light = false,
}: {
  running: boolean;
  onToggle: () => void;
  onReset: () => void;
  light?: boolean;
}) => (
  <div className="flex items-center justify-center gap-3">
    <button
      type="button"
      onClick={onToggle}
      className={`btn rounded-full px-8 py-4 text-sm uppercase tracking-[0.12em] ${
        light ? 'bg-surface text-ink' : 'bg-ink text-surface'
      }`}
    >
      {running ? <Pause className="h-5 w-5" aria-hidden="true" /> : <Play className="h-5 w-5" aria-hidden="true" />}
      {running ? 'Pausar' : 'Iniciar'}
    </button>
    <button
      type="button"
      onClick={onReset}
      aria-label="Reiniciar temporizador"
      className={`btn rounded-full border px-4 py-4 ${
        light ? 'border-surface/40 text-surface' : 'border-line text-muted'
      }`}
    >
      <RotateCcw className="h-5 w-5" aria-hidden="true" />
    </button>
  </div>
);

/** Cuenta regresiva de descanso, a pantalla completa. */
export const RestTimer = ({
  seconds,
  nextLabel,
  onClose,
  storageKey,
}: {
  seconds: number;
  nextLabel?: string;
  onClose: () => void;
  storageKey?: string;
}) => {
  const t = useTimer({ mode: 'countdown', seconds, autoStart: true, onFinish: () => undefined, storageKey });
  const close = () => {
    t.clearSaved();
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand px-6 text-surface">
      <button
        type="button"
        onClick={close}
        aria-label="Cerrar temporizador"
        className="absolute right-5 top-[calc(env(safe-area-inset-top)+1rem)] rounded-full border border-surface/30 p-2"
      >
        <X className="h-5 w-5" aria-hidden="true" />
      </button>
      <p className="label text-surface/70">Descanso</p>
      <p className={`figure mt-3 text-[6rem] ${t.remaining <= 3 && t.running ? 'animate-pulse-ring' : ''}`}>
        {formatClock(t.remaining)}
      </p>
      {nextLabel && (
        <p className="mt-6 text-center">
          <span className="label text-surface/70">Sigue</span>
          <span className="mt-1 block font-display text-2xl uppercase">{nextLabel}</span>
        </p>
      )}
      <div className="mt-10">
        <Controls running={t.running} onToggle={t.toggle} onReset={t.reset} light />
      </div>
      <button type="button" onClick={close} className="mt-6 label text-surface/70 underline">
        Saltar descanso
      </button>
    </div>
  );
};

/** AMRAP / For Time: reloj grande + lista de ejercicios siempre visible. */
export const ClockTimer = ({
  block,
  onClose,
  storageKey,
}: {
  block: WorkoutBlock;
  onClose: () => void;
  storageKey?: string;
}) => {
  const countUp = block.format === 'for-time' || block.format === 'chipper';
  const cap = (block.capMinutes ?? block.minutes) * 60;
  const t = useTimer({ mode: countUp ? 'stopwatch' : 'countdown', seconds: cap, storageKey });
  const close = () => {
    t.clearSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-ink px-6 pb-[env(safe-area-inset-bottom)] pt-[calc(env(safe-area-inset-top)+1rem)] text-surface">
      <div className="flex items-center justify-between">
        <div>
          <p className="label text-surface/60">Bloque {block.index}</p>
          <p className="font-display text-xl uppercase">{block.formatLabel}</p>
        </div>
        <button type="button" onClick={close} aria-label="Cerrar temporizador" className="rounded-full border border-surface/30 p-2">
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center">
        <p className="figure text-[5.5rem] text-lime">
          {formatClock(countUp ? t.elapsed : t.remaining)}
        </p>
        {t.finished && <p className="mt-2 label text-lime">Tiempo cumplido</p>}
        <ul className="mt-8 w-full max-w-sm space-y-2">
          {block.items.map((it) => {
            const ex = getExercise(it.exerciseId);
            return (
              <li key={it.exerciseId} className="flex items-baseline justify-between border-b border-surface/15 pb-2">
                <span className="text-sm">{ex.name}</span>
                <span className="font-mono text-sm text-surface/70">
                  {it.reps ?? it.duration ?? it.distance}
                  {it.unilateral ? '/lado' : ''}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="pb-6">
        <Controls running={t.running} onToggle={t.toggle} onReset={t.reset} light />
      </div>
    </div>
  );
};

/** 40/20: ejercicio actual, próximo, vuelta y señal visual al cambiar. */
export const IntervalTimer = ({
  block,
  onClose,
  storageKey,
}: {
  block: WorkoutBlock;
  onClose: () => void;
  storageKey?: string;
}) => {
  const names = block.items.map((it) => getExercise(it.exerciseId).name);
  const steps = buildIntervalSteps(names, {
    work: block.work ?? 40,
    pause: block.pause ?? 20,
    rounds: block.rounds ?? 2,
  });
  const t = useTimer({ mode: 'interval', steps, storageKey });
  const close = () => {
    t.clearSaved();
    onClose();
  };
  const isWork = t.step?.kind === 'work';
  const changing = t.remaining <= 3 && t.running;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col px-6 pb-[env(safe-area-inset-bottom)] pt-[calc(env(safe-area-inset-top)+1rem)] transition-colors duration-200 ${
        isWork ? 'bg-lime text-ink' : 'bg-ink text-surface'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="label opacity-70">
            Vuelta {t.step?.round ?? 1} de {block.rounds ?? 2}
          </p>
          <p className="font-display text-lg uppercase">{block.formatLabel}</p>
        </div>
        <button
          type="button"
            onClick={close}
          aria-label="Cerrar temporizador"
          className={`rounded-full border p-2 ${isWork ? 'border-ink/30' : 'border-surface/30'}`}
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <p className="label opacity-70">{isWork ? 'Trabajo' : 'Transición'}</p>
        <p className="mt-2 font-display text-4xl uppercase leading-none">{t.step?.label}</p>
        <p className={`figure mt-6 text-[6rem] ${changing ? 'animate-pulse-ring' : ''}`}>
          {formatClock(t.remaining)}
        </p>
        {t.step?.next && (
          <p className="mt-6">
            <span className="label opacity-70">Sigue</span>
            <span className="mt-1 block font-display text-2xl uppercase">{t.step.next}</span>
          </p>
        )}
        {t.finished && <p className="mt-4 label">Tabata completo</p>}
        <div className="mt-6 flex gap-1" aria-hidden="true">
          {steps.map((s, i) => (
            <span
              key={i}
              className={`h-1 w-2 rounded-full ${
                i < t.stepIndex ? 'opacity-100' : i === t.stepIndex ? 'opacity-100' : 'opacity-25'
              } ${isWork ? 'bg-ink' : 'bg-surface'} ${s.kind === 'pause' ? 'w-1' : ''}`}
            />
          ))}
        </div>
      </div>

      <div className="pb-6">
        <Controls running={t.running} onToggle={t.toggle} onReset={t.reset} light={!isWork} />
      </div>
    </div>
  );
};

/** Elige el temporizador correcto según el formato del bloque. */
export const BlockTimer = ({
  block,
  onClose,
  storageKey,
}: {
  block: WorkoutBlock;
  onClose: () => void;
  storageKey?: string;
}) => {
  if (block.format === 'tabata-express' || block.format === 'tabata-full' || block.format === 'intervals') {
    return <IntervalTimer block={block} onClose={onClose} storageKey={storageKey} />;
  }
  return <ClockTimer block={block} onClose={onClose} storageKey={storageKey} />;
};

export const needsTimer = (block: WorkoutBlock): boolean =>
  ['amrap', 'for-time', 'tabata-express', 'tabata-full', 'intervals', 'chipper'].includes(block.format);
