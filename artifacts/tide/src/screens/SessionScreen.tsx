import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowLeft, Check, LayoutList, Rows3, Timer } from 'lucide-react';
import { useApp } from '../state/AppContext';
import type { CompletedSet, Workout, WorkoutBlock } from '../types';
import { getExercise, videoUrl } from '../data/exercises';
import { setKey, plannedSets, doneKeys, sessionProgress } from '../lib/prescription';
import { nextStrengthSet, restForItem } from '../lib/set-navigation';
import { CollapsibleBlock, ExerciseRow, volumeText } from '../components/workout-parts2';
import { BlockTimer, RestTimer, needsTimer } from '../components/timers';
import { Thumb } from '../components/media';
import { BLOCK_META } from '../components/blockMeta';
import { ScoreInput } from '../components/ScoreInput';
import { TransitionCard } from '../components/TransitionCard';
import { WorkoutTimeline } from '../components/WorkoutTimeline';
import { HybridTimer } from '../components/HybridTimer';
import { isHybridBlock } from '../lib/hybrid';
import { readSessionResume, saveSessionResume, timerStorageKey } from '../lib/session-resume';

type View = 'block' | 'exercise';

export const SessionScreen = ({
  workoutId,
  /** Sesión ya transformada por las reglas de adaptación. */
  workout: adapted,
  initialBlockIndex = 0,
  onExit,
  onFinish,
}: {
  workoutId: string;
  workout?: Workout;
  initialBlockIndex?: number;
  onExit: () => void;
  onFinish: () => void;
}) => {
  const app = useApp();
  const session = app.sessionFor(workoutId);
  // Started/completed prescriptions are immutable; adaptations apply only before start.
  const workout = session?.definition ?? adapted ?? app.workoutById(workoutId);
  const savedPosition = readSessionResume(workoutId);
  const [blockIndex, setBlockIndex] = useState(() => {
    const maxBlock = Math.max(0, (workout?.blocks.length ?? 1) - 1);
    return Math.min(maxBlock, Math.max(0, savedPosition?.blockIndex ?? initialBlockIndex));
  });
  const [view, setView] = useState<View>(savedPosition?.view ?? 'block');
  const [exIndex, setExIndex] = useState(savedPosition?.exerciseIndex ?? 0);
  const [timerBlock, setTimerBlock] = useState<WorkoutBlock | null>(() =>
    savedPosition?.timerBlockId
      ? workout?.blocks.find((candidate) => candidate.id === savedPosition.timerBlockId) ?? null
      : null);
  const [rest, setRest] = useState<{ seconds: number; next?: string; blockIndex: number } | null>(() =>
    savedPosition?.restTimer ?? null);
  const [showTimeline, setShowTimeline] = useState(false);
  const resumeRef = useRef({
    workoutId, blockIndex, view, exerciseIndex: exIndex,
    timerBlockId: timerBlock?.id ?? null,
    restTimer: rest,
  });

  useLayoutEffect(() => {
    const resume = {
      workoutId,
      blockIndex,
      view,
      exerciseIndex: exIndex,
      timerBlockId: timerBlock?.id ?? null,
      restTimer: rest,
    };
    resumeRef.current = resume;
    saveSessionResume(resume);
  }, [workoutId, blockIndex, view, exIndex, timerBlock, rest]);

  useEffect(() => {
    const saveBeforeSuspend = () => saveSessionResume(resumeRef.current);
    const saveWhenHidden = () => {
      if (document.visibilityState === 'hidden') saveBeforeSuspend();
    };
    window.addEventListener('pagehide', saveBeforeSuspend);
    document.addEventListener('visibilitychange', saveWhenHidden);
    return () => {
      window.removeEventListener('pagehide', saveBeforeSuspend);
      document.removeEventListener('visibilitychange', saveWhenHidden);
    };
  }, []);

  useEffect(() => {
    if (workout && !session?.startedAt) app.startSession(workout);
  }, [workoutId, workout, session?.startedAt, app.startSession]);

  if (!workout) return null;
  const block = workout.blocks[blockIndex];
  const done = doneKeys(session);
  const progress = sessionProgress(workout, session);
  const selectedChoice = session?.choices?.[block.id];
  const activeItemIndexes = block.items
    .map((_, index) => index)
    .filter((index) => !block.choiceLabel || block.items[index]?.order === selectedChoice);
  const currentItemIndex = activeItemIndexes.includes(exIndex) ? exIndex : (activeItemIndexes[0] ?? -1);
  const activePosition = activeItemIndexes.indexOf(currentItemIndex);
  const visibleBlock = block.choiceLabel
    ? { ...block, items: activeItemIndexes.map((index) => block.items[index]!) }
    : block;

  const item = currentItemIndex >= 0 ? block.items[currentItemIndex] : undefined;
  // Las transiciones como "Vuelta a la manzana" no tienen ejercicios.
  // No intentes resolver uno antes de renderizar su tarjeta propia.
  const ex = item ? getExercise(item.exerciseId) : null;
  const target = item ? plannedSets(item, block) : 0;
  const key = item ? setKey(block.id, item.exerciseId, currentItemIndex) : `${block.id}:empty:${exIndex}`;
  const sets = session?.sets[key] ?? [];
  const isCircuit = block.format === 'rounds' && block.items.length > 1;
  const hybrid = isHybridBlock(block);

  const completeSet = (i: number, load: string, reps: string, rpe?: number) => {
    if (!ex) return;
    app.recordSet(workoutId, key, i, { done: true, load, reps, rpe });
    const restSeconds = restForItem(item?.rest, block.rest);

    if (isCircuit) {
      if (activePosition + 1 < activeItemIndexes.length) {
        // En un circuito los ejercicios de la vuelta se encadenan sin pausa.
        setExIndex(activeItemIndexes[activePosition + 1]!);
      } else if (i + 1 < target) {
        // La pausa empieza recién al terminar el último ejercicio de la vuelta.
        const firstEx = getExercise(block.items[activeItemIndexes[0]!]!.exerciseId);
        setRest({ seconds: restSeconds, next: `${firstEx.name} · vuelta ${i + 2}`, blockIndex });
        setExIndex(activeItemIndexes[0]!);
      }
      return;
    }

    if (block.kind !== 'fuerza') {
      // Fuera de Fuerza no se interrumpe el flujo con descansos automáticos.
      if (i + 1 >= target && activePosition + 1 < activeItemIndexes.length) {
        setExIndex(activeItemIndexes[activePosition + 1]!);
      }
      return;
    }

    const next = nextStrengthSet(block, activeItemIndexes, currentItemIndex, i);
    if (next.nextIndex === undefined) return;
    const nextEx = getExercise(block.items[next.nextIndex]!.exerciseId);
    if (next.pause)
      setRest({
        seconds: restSeconds,
        next: `${nextEx.name}${next.nextSet ? ` · serie ${next.nextSet + 1}` : ''}`,
        blockIndex,
      });
    setExIndex(next.nextIndex);
  };

  const nextBlock = (skip = false) => {
    const hybridResult = session?.hybridResults?.[block.id];
    if (hybridResult?.status === 'running' || hybridResult?.status === 'paused') {
      window.alert('Terminá el reloj de este bloque antes de continuar. Se conserva al navegar o salir.');
      return;
    }
    if (!skip) app.markBlockComplete(workoutId, block.id);
    setRest(null);
    setTimerBlock(null);
    if (blockIndex + 1 < workout.blocks.length) {
      setBlockIndex((n) => n + 1);
      setExIndex(0);
      setView('block');
    } else {
      onFinish();
    }
  };

  const meta = BLOCK_META[block.kind];

  return (
    <div className="min-h-screen bg-canvas pb-32">
      <header className="sticky top-0 z-20 border-b border-line bg-canvas/95 pt-[env(safe-area-inset-top)] backdrop-blur">
        <div className="flex items-center gap-3 px-4 py-3">
          <button type="button" onClick={onExit} aria-label="Salir del modo sesión" className="btn-quiet">
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="label">
              Bloque {block.index} de {workout.blocks.length}
            </p>
            <p className="truncate font-display text-lg uppercase">{workout.name}</p>
          </div>
          {!hybrid && <button
            type="button"
            onClick={() => setView(view === 'block' ? 'exercise' : 'block')}
            aria-label={view === 'block' ? 'Ver ejercicio por ejercicio' : 'Ver el bloque completo'}
            className="btn-ghost px-3 py-2"
          >
            {view === 'block' ? <Rows3 className="h-4 w-4" aria-hidden="true" /> : <LayoutList className="h-4 w-4" aria-hidden="true" />}
          </button>}
        </div>
        <div className="h-1 w-full bg-line">
          <div className="h-full bg-brand transition-all" style={{ width: `${progress * 100}%` }} />
        </div>
      </header>

      <div className="mx-auto max-w-2xl space-y-4 px-4 pt-4">
        {workout.adaptations.length > 0 && (
          <p className="rounded-xl border border-brand/30 bg-lime-soft px-3 py-2 text-xs text-brand-dark">
            Sesión adaptada: {workout.adaptations.join(' · ')}
          </p>
        )}

        <button
          type="button"
          onClick={() => setShowTimeline((v) => !v)}
          aria-expanded={showTimeline}
          className="btn-ghost w-full"
        >
          {showTimeline ? 'Ocultar recorrido' : 'Ver dónde estoy'}
        </button>
        {showTimeline && (
          <div className="card animate-rise-in p-4">
            <WorkoutTimeline
              workout={workout}
              currentIndex={blockIndex}
              doneIndexes={workout.blocks.map((b, i) => session?.completedBlocks?.includes(b.id) ? i : -1).filter((i) => i >= 0)}
              onJump={(i) => {
                setBlockIndex(i);
                setExIndex(0);
                setShowTimeline(false);
              }}
            />
          </div>
        )}

        {/* Selector de bloque */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {workout.blocks.map((b, i) => (
            <button
              key={b.id}
              type="button"
              onClick={() => {
                setBlockIndex(i);
                setExIndex(0);
              }}
              className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors duration-200 ${
                i === blockIndex
                  ? 'bg-brand text-white'
                  : b.kind === 'transicion'
                    ? 'border border-brand/30 bg-lime-soft text-brand'
                    : 'border border-line bg-surface text-muted'
              }`}
            >
              {b.kind === 'transicion' ? '↗ Vuelta' : `${b.index}. ${b.title}`}
            </button>
          ))}
        </div>

        {block.choiceLabel && (
          <section className="card p-4">
            <p className="label">{block.choiceLabel}</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {block.items.map((option, optionIndex) => {
                const optionExercise = getExercise(option.exerciseId);
                const active = selectedChoice === option.order;
                return (
                  <button
                    key={option.exerciseId}
                    type="button"
                    onClick={() => {
                      app.setBlockChoice(workoutId, block.id, option.order ?? String(optionIndex + 1));
                      setExIndex(optionIndex);
                      setView('block');
                    }}
                    aria-pressed={active}
                    className={active ? 'btn-primary justify-start' : 'btn-ghost justify-start'}
                  >
                    <span className="label">{option.order}</span>
                    {optionExercise.name}
                  </button>
                );
              })}
            </div>
            {!selectedChoice && (
              <p className="mt-2 text-xs text-muted">Elegí una alternativa para empezar y registrar solo esa opción.</p>
            )}
          </section>
        )}

        {block.kind === 'fuerza' && (
          <p className="rounded-xl border border-line bg-surface p-3 text-sm">
            <strong>CONTRASTE A:</strong> A1 fuerza → A2 potencia; respetá el descanso para conservar calidad.
            {' '}<strong>SUPERSET B:</strong> alterná B1/B2 y luego descansá según la prescripción.
          </p>
        )}

        {block.kind === 'transicion' ? (
          <TransitionCard
            block={block}
            result={session?.transitions?.[block.id]}
            onComplete={(r) => app.recordTransition(workoutId, { ...r, blockId: block.id, completedAt: Date.now() })}
          />
        ) : hybrid ? (
          <HybridTimer
            key={`${workoutId}:${block.id}`}
            block={visibleBlock}
            workoutId={workoutId}
            value={session?.hybridResults?.[block.id]}
            onChange={(result) => app.setHybridResult(workoutId, block.id, result)}
          />
        ) : !item || !ex ? null : view === 'block' ? (
          <CollapsibleBlock
            block={visibleBlock}
            defaultOpen
            doneIds={done}
            itemIndexes={activeItemIndexes}
            onOpenExercise={(i) => {
              setExIndex(i);
              setView('exercise');
            }}
            onTimer={() => setTimerBlock(block)}
          />
        ) : (
          <section className="card overflow-hidden">
            <div className={`px-4 py-3 ${meta.head} ${meta.text}`}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] opacity-80">
                Bloque {block.index} · {block.formatLabel}
              </p>
              <p className="font-display text-xl uppercase">{block.title}</p>
            </div>

            <div className="p-4">
              <Thumb exerciseId={ex.id} kind={block.kind} className="h-44 w-full rounded-xl" />
              <p className="label mt-4">
                Ejercicio {activePosition + 1} de {activeItemIndexes.length}
              </p>
              <h2 className="mt-1 text-3xl">{ex.name}</h2>
              <p className="mt-2 font-mono text-lg text-brand">{volumeText(item)}</p>
              {item.rpe && <p className="label mt-1">RPE {item.rpe}</p>}
              {item.load && <p className="meta mt-1">{item.load}</p>}
              {item.rest && <p className="meta mt-1">Recuperación: {item.rest}</p>}
              {item.instructions && <p className="mt-2 text-sm text-muted">{item.instructions}</p>}
              {item.alternatives && item.alternatives.length > 0 && (
                <p className="mt-2 text-sm text-muted">
                  <span className="font-semibold">Alternativas:</span> {item.alternatives.join(' · ')}
                </p>
              )}

              <div className="mt-4 space-y-2">
                {Array.from({ length: target }, (_, i) => (
                  <SetRow
                      key={`${key}:${i}`}
                    index={i}
                    unitLabel={isCircuit ? 'Vuelta' : 'Serie'}
                    entry={sets[i]}
                    onComplete={(load, reps, rpe) => completeSet(i, load, reps, rpe)}
                  />
                ))}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <a href={videoUrl(ex)} target="_blank" rel="noreferrer" className="btn-ghost">
                  Ver técnica
                </a>
                <button
                  type="button"
                  onClick={() => setRest({ seconds: restForItem(item.rest, block.rest), next: ex.name, blockIndex })}
                  className="btn-ghost"
                >
                  <Timer className="h-4 w-4" aria-hidden="true" /> Descanso
                </button>
              </div>

              <details className="mt-4 rounded-xl border border-line p-3">
                <summary className="label cursor-pointer">Técnica y errores</summary>
                <ul className="mt-2 space-y-1 text-sm text-muted">
                  {ex.cues.map((c) => (
                    <li key={c}>· {c}</li>
                  ))}
                </ul>
                <p className="label mt-3">Errores frecuentes</p>
                <ul className="mt-1 space-y-1 text-sm text-muted">
                  {ex.mistakes.map((m) => (
                    <li key={m}>· {m}</li>
                  ))}
                </ul>
                <p className="mt-3 text-sm text-muted">
                  <span className="label">Regresión</span> {ex.regression}
                </p>
                <p className="mt-1 text-sm text-muted">
                  <span className="label">Progresión</span> {ex.progression}
                </p>
              </details>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  disabled={activePosition <= 0}
                  onClick={() => setExIndex(activeItemIndexes[activePosition - 1] ?? currentItemIndex)}
                  className="btn-ghost flex-1"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  disabled={activePosition + 1 >= activeItemIndexes.length}
                  onClick={() => setExIndex(activeItemIndexes[activePosition + 1] ?? currentItemIndex)}
                  className="btn-ghost flex-1"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Score del finisher */}
        {block.kind === 'finisher' && !hybrid && block.scoreType && (
          <ScoreInput
            block={block}
            value={session?.finisherScore}
            onChange={(score) => app.setFinisherScore(workoutId, score)}
          />
        )}

        {!hybrid && block.kind !== 'transicion' && needsTimer(block) && view === 'block' && (
          <button
            type="button"
            onClick={() => setTimerBlock(block)}
            aria-label={`Abrir temporizador: ${block.formatLabel}`}
            className="btn-lime w-full"
          >
            <Timer className="h-5 w-5" aria-hidden="true" /> {block.formatLabel}
          </button>
        )}

        {block.kind === 'transicion' && (
          <button type="button" onClick={() => nextBlock(true)} className="btn-ghost min-h-11 w-full" data-testid="button-skip-transition">
            Omitir transición opcional
          </button>
        )}
        <button type="button" onClick={() => nextBlock()} className="btn-primary w-full" data-testid="button-complete-block">
          <Check className="h-5 w-5" aria-hidden="true" />
          {blockIndex + 1 < workout.blocks.length
            ? block.kind === 'transicion'
              ? 'Vuelta completa'
              : 'Bloque completo'
            : 'Finalizar sesión'}
        </button>
      </div>

      {timerBlock && (
        <BlockTimer
          key={timerBlock.id}
          block={timerBlock}
          storageKey={timerStorageKey(workoutId, `block:${timerBlock.id}`)}
          onClose={() => setTimerBlock(null)}
        />
      )}
      {rest && (
        <RestTimer
          key={`${rest.blockIndex}:${rest.seconds}`}
          seconds={rest.seconds}
          nextLabel={rest.next}
          storageKey={timerStorageKey(workoutId, `rest:${rest.blockIndex}`)}
          onClose={() => setRest(null)}
        />
      )}
    </div>
  );
};

/** Fila de registro: carga, repeticiones y confirmación. */
const SetRow = ({
  index,
  unitLabel = 'Serie',
  entry,
  onComplete,
}: {
  index: number;
  unitLabel?: 'Serie' | 'Vuelta';
  entry?: CompletedSet;
  onComplete: (load: string, reps: string, rpe?: number) => void;
}) => {
  const [load, setLoad] = useState(entry?.load ?? '');
  const [reps, setReps] = useState(entry?.reps ?? '');
  const [rpe, setRpe] = useState(entry?.rpe?.toString() ?? '');
  const done = entry?.done;

  return (
    <div
      className={`flex flex-wrap items-center gap-2 rounded-xl border px-3 py-2 ${
        done ? 'border-brand bg-lime-soft' : 'border-line bg-surface'
      }`}
    >
      <span className="label w-12 shrink-0">{unitLabel} {index + 1}</span>
      <input
        aria-label={`Carga de ${unitLabel.toLowerCase()} ${index + 1}`}
        inputMode="decimal"
        value={load}
        onChange={(e) => setLoad(e.target.value)}
        placeholder="kg"
        className="field flex-1 py-2"
      />
      <input
        aria-label={`Repeticiones de ${unitLabel.toLowerCase()} ${index + 1}`}
        inputMode="numeric"
        value={reps}
        onChange={(e) => setReps(e.target.value)}
        placeholder="reps"
        className="field flex-1 py-2"
      />
      <button
        type="button"
        onClick={() => onComplete(load, reps, rpe ? Number(rpe) : undefined)}
        aria-label={`Completar ${unitLabel.toLowerCase()} ${index + 1}`}
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
          done ? 'bg-brand text-white' : 'border border-line text-muted'
        }`}
      >
        <Check className="h-4 w-4" aria-hidden="true" />
      </button>
      <label className="flex w-full items-center gap-2 text-xs text-muted">
        RPE opcional
        <input type="number" min="1" max="10" step="1" aria-label={`RPE de ${unitLabel.toLowerCase()} ${index + 1}`}
          value={rpe} onChange={e => setRpe(e.target.value && Number(e.target.value) >= 1 && Number(e.target.value) <= 10 ? e.target.value : '')}
          className="field max-w-24 py-2" placeholder="1–10" />
      </label>
    </div>
  );
};

export { ExerciseRow };
