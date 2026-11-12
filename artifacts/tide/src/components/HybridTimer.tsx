import { useEffect, useRef, useState } from 'react';
import type { WorkoutBlock } from '../types';
import type { HybridResult } from '../types/hybrid';
import { getExercise } from '../data/exercises';
import {
  completeDistanceInterval, completeHybridRound, computeHybridElapsed, correctHybrid,
  createHybridLockCoordinator, createHybridResult, distanceIntervalPhase, endIntervalRest, finishHybrid, hybridStats,
  isDistanceInterval, pauseHybrid, recordIntervalScore, setHybridPartial, startHybrid, undoHybridRound,
} from '../lib/hybrid';

const LOCK_KEY = 'tide:v8:active-hybrid';
const LOCK_NAME = 'tide-v8-hybrid-clock';
const clock = (seconds: number) => {
  const whole = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(whole / 60)).padStart(2, '0')}:${String(whole % 60).padStart(2, '0')}`;
};
type TimerLock = { timerId: string; owner: string; label: string };
const pageOwner = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

/** One global Web Lock serializes tabs, plus a persistent identity prevents a
 * different workout starting after navigation/closing. Local acquisition is
 * serialized through cancellation/release settlement (including StrictMode).
 * No heartbeat/tick writes and no lock stealing from a genuinely active tab.
 */
const coordinateTimer = createHybridLockCoordinator({
  request: typeof navigator !== 'undefined' && navigator.locks
    ? async (hold) => { await navigator.locks.request(LOCK_NAME, { ifAvailable: true }, (lock) => hold(!!lock)); }
    : undefined,
  claim: ({ timerId, label, owner }) => {
    const raw = localStorage.getItem(LOCK_KEY);
    const previous: TimerLock | null = raw ? JSON.parse(raw) : null;
    if (previous && previous.timerId !== timerId)
      throw new Error(`Hay otro reloj activo: ${previous.label}. Volvé a esa sesión y pausalo antes de iniciar otro.`);
    if (!navigator.locks && previous && previous.owner !== owner)
      throw new Error('Este reloj pertenece a otra pestaña. Cerrala y usá «Recuperar control» aquí.');
    localStorage.setItem(LOCK_KEY, JSON.stringify({ timerId, label, owner }));
  },
});
const acquireTimer = (timerId: string, label: string, owner: string, signal: AbortSignal) =>
  coordinateTimer({ timerId, label, owner }, signal);

export const HybridTimer = ({
  block, workoutId, value, onChange,
}: {
  block: WorkoutBlock;
  workoutId: string;
  value?: HybridResult;
  onChange: (result: HybridResult) => void;
}) => {
  const [result, setResult] = useState(() => value ?? createHybridResult(block, workoutId));
  const current = useRef(result);
  const callback = useRef(onChange);
  callback.current = onChange;
  const [now, setNow] = useState(Date.now());
  const [error, setError] = useState('');
  const [owned, setOwned] = useState(false);
  const release = useRef<(() => void) | undefined>(undefined);
  const lifetime = useRef(new AbortController());
  const owner = useRef(pageOwner);
  const busy = useRef(false);
  const lastAction = useRef(-Infinity);
  const timerId = `${workoutId}:${block.id}`;
  const runtime = useRef({ wall: Date.now(), mono: performance.now(), result: result });
  const [partial, setPartial] = useState(String(result.partialReps));
  const [detail, setDetail] = useState<Record<string, { value: string; unit: string }>>(() =>
    Object.fromEntries((result.partialDetails ?? []).map((d) => [d.exerciseId, { value: String(d.value), unit: d.unit }])));
  const [intervalNumber, setIntervalNumber] = useState('1');
  const [intervalScore, setIntervalScore] = useState('');
  const [intervalUnit, setIntervalUnit] = useState('reps');
  const [correctionReason, setCorrectionReason] = useState('');
  const [correctSeconds, setCorrectSeconds] = useState('');
  const [correctRounds, setCorrectRounds] = useState('');
  const [correctReps, setCorrectReps] = useState('');
  const [correctSplits, setCorrectSplits] = useState('');
  const [loads, setLoads] = useState(() => result.definition.items.map((item) => item.load ?? ''));

  useEffect(() => {
    if (lifetime.current.signal.aborted) lifetime.current = new AbortController();
    const controller = lifetime.current;
    return () => {
      // Also cancels start/recover calls that have not returned their lease yet.
      controller.abort();
      release.current?.();
      release.current = undefined;
    };
  }, []);

  const persist = (next: HybridResult) => {
    if (next === current.current) return;
    if (next.partialReps !== current.current.partialReps) setPartial(String(next.partialReps));
    current.current = next;
    setResult(next);
    callback.current(next);
    if (next.status !== 'running') {
      const raw = localStorage.getItem(LOCK_KEY);
      if (raw && (JSON.parse(raw) as TimerLock).owner === owner.current) localStorage.removeItem(LOCK_KEY);
      release.current?.();
      release.current = undefined;
      setOwned(false);
    }
  };

  // Running state is checkpointed only on actions/transitions, never on display ticks.
  const effectiveNow = () => {
    const r = current.current;
    if (r.status !== 'running' || r.runningSince === undefined) return Date.now();
    const anchor = runtime.current;
    const elapsed = Math.max(
      computeHybridElapsed(r, Date.now()),
      computeHybridElapsed(anchor.result, anchor.wall) + Math.max(0, performance.now() - anchor.mono) / 1000,
    );
    return r.runningSince + Math.max(0, elapsed - r.activeElapsedSec) * 1000;
  };

  useEffect(() => {
    if (!value || value === current.current) return;
    current.current = value;
    setResult(value);
    setPartial(String(value.partialReps));
    setDetail(Object.fromEntries((value.partialDetails ?? []).map((d) => [d.exerciseId, { value: String(d.value), unit: d.unit }])));
  }, [value]);

  useEffect(() => {
    runtime.current = { wall: Date.now(), mono: performance.now(), result: current.current };
    setNow(effectiveNow());
    if (result.status !== 'running') return;
    const tick = () => setNow(effectiveNow());
    const handle = window.setInterval(tick, 200);
    const visible = () => { if (!document.hidden) tick(); };
    document.addEventListener('visibilitychange', visible);
    return () => { window.clearInterval(handle); document.removeEventListener('visibilitychange', visible); };
  }, [result.status, result.runningSince, result.activeElapsedSec]);

  useEffect(() => {
    if (result.status !== 'running') {
      if (release.current) {
        const raw = localStorage.getItem(LOCK_KEY);
        if (raw && (JSON.parse(raw) as TimerLock).owner === owner.current) localStorage.removeItem(LOCK_KEY);
        release.current();
        release.current = undefined;
        setOwned(false);
      }
      return;
    }
    if (release.current) return;
    const controller = new AbortController();
    let acquiredUnlock: (() => void) | undefined;
    setOwned(false);
    busy.current = true;
    void acquireTimer(timerId, block.title, owner.current, controller.signal).then((unlock) => {
      if (controller.signal.aborted) { unlock(); return; }
      acquiredUnlock = unlock;
      release.current = unlock;
      setOwned(true);
      setError('');
    }).catch((e: unknown) => {
      if (!controller.signal.aborted) setError(e instanceof Error ? e.message : 'No se pudo bloquear el reloj.');
    }).finally(() => { if (!controller.signal.aborted) busy.current = false; });
    return () => {
      controller.abort();
      if (acquiredUnlock && release.current === acquiredUnlock) {
        release.current = undefined;
        setOwned(false);
      }
      busy.current = false;
    };
  }, [result.status, timerId, block.title]);

  const elapsed = computeHybridElapsed(result, now);
  const remaining = result.targetSec === undefined ? undefined : Math.max(0, result.targetSec - elapsed);
  const distanceInterval = isDistanceInterval(result);
  const distancePhase = distanceIntervalPhase(result, now);
  const work = result.definition.work ?? 0;
  const rest = result.definition.pause ?? 0;
  const cycle = work + rest;
  const timedInterval = result.format === 'interval' && !distanceInterval && cycle > 0;
  const timedIndex = timedInterval ? Math.min(result.targetRounds ?? Infinity, Math.floor(elapsed / cycle) + 1) : 0;
  const timedRest = timedInterval && elapsed % cycle >= work;

  // A cap/rest boundary is a status change, not a per-tick persistence loop.
  useEffect(() => {
    if (!owned || current.current.status !== 'running') return;
    const r = current.current;
    const time = effectiveNow();
    if (r.runningSince !== undefined && Date.now() < r.runningSince - 1000) {
      const paused = pauseHybrid(r, time);
      persist({ ...paused, events: [...paused.events, {
        type: 'clock_reversal', at: new Date().toISOString(), elapsedSec: paused.activeElapsedSec,
        reason: 'El reloj del sistema retrocedió: pausa de seguridad, sin restar tiempo activo.',
      }] });
      setError('El reloj del sistema retrocedió. Se pausó por seguridad; verificá la hora y reanudá.');
      return;
    }
    if (r.targetSec !== undefined && computeHybridElapsed(r, time) >= r.targetSec) {
      persist(finishHybrid(r, time, true));
      return;
    }
    if (isDistanceInterval(r)) {
      const next = endIntervalRest(r, time);
      if (next !== r) persist(next);
    }
  }, [now, owned]);

  const action = (fn: (r: HybridResult, time: number) => HybridResult, protect = false) => {
    if (busy.current || (protect && performance.now() - lastAction.current < 800)) return;
    if (current.current.status === 'running' && !owned) {
      setError('Recuperá el control del reloj antes de registrar cambios.');
      return;
    }
    try {
      setError('');
      if (protect) lastAction.current = performance.now();
      persist(fn(current.current, effectiveNow()));
    } catch (e) { setError(e instanceof Error ? e.message : 'No se pudo guardar.'); }
  };
  const start = async () => {
    if (busy.current || !['idle', 'paused'].includes(current.current.status)) return;
    busy.current = true;
    try {
      setError('');
      const signal = lifetime.current.signal;
      const unlock = await acquireTimer(timerId, block.title, owner.current, signal);
      if (signal.aborted) { unlock(); return; }
      release.current = unlock;
      setOwned(true);
      const time = Date.now();
      const existing = current.current;
      const changed = existing.status === 'idle' && loads.some((load, i) => load !== (existing.definition.items[i]?.load ?? ''));
      const prepared = changed ? {
        ...existing,
        definition: { ...existing.definition, items: existing.definition.items.map((item, i) => ({ ...item, load: loads[i] || undefined })) },
        events: [...existing.events, {
          type: 'prescription_loads', at: new Date(time).toISOString(), elapsedSec: 0,
          reason: 'Cargas reales confirmadas antes de iniciar',
          before: existing.definition.items.map((item) => item.load), after: loads,
        }],
      } : existing;
      persist(startHybrid(prepared, time));
    } catch (e) {
      if (!(e instanceof DOMException && e.name === 'AbortError')) setError(e instanceof Error ? e.message : 'No se pudo iniciar el reloj.');
    }
    finally { busy.current = false; }
  };

  const savePartial = (r: HybridResult, time: number) => setHybridPartial(r, Number(partial),
    block.items.filter((item) => detail[item.exerciseId]?.value !== undefined && detail[item.exerciseId]?.value !== '')
      .map((item) => ({
        exerciseId: item.exerciseId, value: Number(detail[item.exerciseId]!.value), unit: detail[item.exerciseId]!.unit,
      })), time);
  const stats = hybridStats(result);
  const markRound = () => action((r, time) => {
    const outside = r.targetSec !== undefined && computeHybridElapsed(r, time) > r.targetSec;
    if (outside && !window.confirm('Esta vuelta está fuera del time cap. ¿Registrar igualmente con nota de auditoría?')) return r;
    return completeHybridRound(r, time, outside);
  }, true);
  const recover = async () => {
    if (busy.current) return;
    busy.current = true;
    try {
      if (!navigator.locks) {
        if (!window.confirm('Recuperar control solo es seguro si cerraste la otra pestaña. ¿Confirmás?')) return;
        const raw = localStorage.getItem(LOCK_KEY);
        if (raw && (JSON.parse(raw) as TimerLock).timerId === timerId) localStorage.removeItem(LOCK_KEY);
      }
      const signal = lifetime.current.signal;
      const unlock = await acquireTimer(timerId, block.title, owner.current, signal);
      if (signal.aborted) { unlock(); return; }
      release.current = unlock;
      setOwned(true); setError('');
    } catch (e) {
      if (!(e instanceof DOMException && e.name === 'AbortError')) setError(e instanceof Error ? e.message : 'No se pudo recuperar.');
    }
    finally { busy.current = false; }
  };

  return (
    <section className="card overflow-hidden" aria-label="Reloj híbrido persistente" data-testid="hybrid-timer">
      <div className="border-b border-line bg-lime-soft px-4 py-3">
        <p className="label text-brand-dark">{block.formatLabel} · registro persistente</p>
        <h2 className="mt-1 text-xl">{block.title}</h2>
      </div>
      <div className="space-y-4 p-4">
        <p className="text-xs text-muted">El reloj continúa en segundo plano y al recargar. Solo «Pausar» excluye tiempo. Los descansos programados sí cuentan en el total.</p>
        <div className="rounded-xl border border-line p-4 text-center">
          <p className="label">{result.status === 'finished' ? result.dnf ? 'TIME CAP · DNF' : 'FINALIZADO' : result.status === 'paused' ? 'PAUSADO' : remaining === undefined ? 'TIEMPO ACTIVO' : 'RESTANTE'}</p>
          <p className="my-2 font-mono text-6xl font-semibold tabular-nums text-brand-dark" data-testid="text-hybrid-clock">
            {clock(result.status === 'finished' || remaining === undefined ? elapsed : remaining)}
          </p>
          <p className="text-sm text-muted" data-testid="text-hybrid-elapsed">Activo {clock(elapsed)} · pausas {clock(result.pausedSec + (result.pausedSince === undefined ? 0 : Math.max(0, now - result.pausedSince) / 1000))}</p>
          {timedInterval && result.status !== 'finished' && <p className="mt-2 font-semibold" data-testid="text-interval-phase">
            Intervalo {timedIndex}/{result.targetRounds} · {timedRest ? 'DESCANSO' : 'TRABAJO'} {clock(timedRest ? cycle - elapsed % cycle : work - elapsed % cycle)}
          </p>}
          {distanceInterval && <p className="mt-2 font-semibold" data-testid="text-distance-phase">
            {result.status === 'finished' ? `${result.completedRounds} pasadas registradas` : distancePhase.resting ? `RECUPERACIÓN ${clock(distancePhase.remaining)}` : `PASADA ${result.completedRounds + 1}/${result.targetRounds ?? '—'} · ${block.items.find((i) => i.distance)?.distance}`}
          </p>}
          {result.format !== 'interval' && <p className="mt-2 text-lg font-semibold" data-testid="text-hybrid-rounds">
            {result.completedRounds} {result.format === 'chipper' ? 'checkpoints' : result.format === 'ladder' ? 'escalones' : 'vueltas'} + {result.partialReps} reps
          </p>}
        </div>

        {error && <p role="alert" className="rounded-xl border border-line p-3 text-sm" data-testid="status-hybrid-error">{error}</p>}
        {result.status === 'running' && !owned && <button type="button" onClick={() => void recover()} className="btn-ghost w-full" data-testid="button-recover-timer">Recuperar control del reloj</button>}
        <div className="flex gap-2">
          {(result.status === 'idle' || result.status === 'paused') && <button type="button" onClick={() => void start()} className="btn-lime min-h-12 flex-1" data-testid="button-start-hybrid">{result.status === 'idle' ? 'Iniciar reloj' : 'Reanudar'}</button>}
          {result.status === 'running' && <button type="button" disabled={!owned} onClick={() => action((r, time) =>
            r.targetSec !== undefined && computeHybridElapsed(r, time) >= r.targetSec ? finishHybrid(r, time, true) : pauseHybrid(r, time),
          )} className="btn-ghost min-h-12 flex-1" data-testid="button-pause-hybrid">Pausar</button>}
          {['running', 'paused'].includes(result.status) && <button type="button" onClick={() => action((r, time) => {
            if (!window.confirm('¿Terminar el bloque y guardar el parcial actual?')) return r;
            return finishHybrid(savePartial(r, time), time, r.targetSec !== undefined && computeHybridElapsed(r, time) >= r.targetSec);
          })} className="btn-primary min-h-12 flex-1" data-testid="button-finish-hybrid">Terminar</button>}
        </div>

        {result.format !== 'interval' && result.status === 'running' && <button type="button" disabled={!owned} onClick={markRound} className="btn-lime min-h-16 w-full text-base" data-testid="button-complete-round">
          + {result.format === 'chipper' ? 'MARCAR CHECKPOINT' : result.format === 'ladder' ? 'COMPLETAR ESCALÓN' : 'COMPLETAR VUELTA'}
        </button>}
        {distanceInterval && result.status === 'running' && <button type="button" disabled={!owned || distancePhase.resting} onClick={() => action(completeDistanceInterval, true)} className="btn-lime min-h-16 w-full" data-testid="button-complete-distance">+ COMPLETAR PASADA</button>}
        {result.splits.length > 0 && result.format !== 'interval' && <button type="button" onClick={() => action(undoHybridRound)} className="btn-ghost min-h-11 w-full" data-testid="button-undo-round">Deshacer última vuelta · ventana 10 s</button>}
        {result.status === 'finished' && result.targetSec !== undefined && result.format !== 'interval' && <button type="button" onClick={() => action((r, time) => {
          if (!window.confirm('El cap ya terminó. ¿Añadir una vuelta fuera del límite con confirmación explícita?')) return r;
          return completeHybridRound(r, time, true);
        }, true)} className="btn-ghost w-full" data-testid="button-round-outside-cap">Registrar vuelta fuera del cap…</button>}

        <ol className="space-y-2" aria-label="Prescripción">
          {result.definition.items.map((item, i) => <li key={`${item.exerciseId}-${i}`} className="rounded-xl border border-line p-3 text-sm" data-testid={`text-hybrid-prescription-${i}`}>
            <span className="font-semibold">{i + 1}. {getExercise(item.exerciseId).name}</span>
            <span className="ml-2">{[item.reps && `${item.reps} reps`, item.distance, item.duration, item.load].filter(Boolean).join(' · ')}</span>
            {item.instructions && <p className="mt-1 text-xs text-muted">{item.instructions}</p>}
            {result.status === 'idle' && <label className="mt-2 block text-xs text-muted">Carga real / implemento (opcional, define comparación)
              <input className="field mt-1 w-full" value={loads[i] ?? ''} placeholder="Sin carga registrada" data-testid={`input-hybrid-load-${i}`} onChange={(e) => setLoads((previous) => previous.map((load, n) => n === i ? e.target.value : load))} />
            </label>}
          </li>)}
        </ol>

        {result.format === 'interval' ? (
          <fieldset className="space-y-2 rounded-xl border border-line p-3">
            <legend className="label px-1">Score por intervalo · sin datos inventados</legend>
            <label className="block text-xs">Intervalo<input data-testid="input-interval-number" type="number" min="1" max={result.targetRounds} value={intervalNumber} onChange={(e) => setIntervalNumber(e.target.value)} className="field mt-1 w-full" /></label>
            <div className="grid grid-cols-2 gap-2">
              <label className="text-xs">Cantidad<input data-testid="input-interval-score" type="number" min="0" value={intervalScore} onChange={(e) => setIntervalScore(e.target.value)} className="field mt-1 w-full" /></label>
              <label className="text-xs">Unidad<select data-testid="select-interval-unit" value={intervalUnit} onChange={(e) => setIntervalUnit(e.target.value)} className="field mt-1 w-full"><option value="reps">reps</option><option value="m">m</option><option value="s">s</option><option value="kcal">kcal</option></select></label>
            </div>
            <button type="button" className="btn-ghost w-full" disabled={intervalScore === '' || result.status === 'idle'} data-testid="button-save-interval-score" onClick={() => action((r, time) => recordIntervalScore(r, Number(intervalNumber), Number(intervalScore), intervalUnit, time))}>Guardar score del intervalo</button>
            {Array.from(new Map(result.events.filter((e) => e.type === 'interval_score').map((e) => {
              const score = e.after as { interval: number; value: number; unit: string };
              return [score.interval, score] as const;
            })).values()).map((score) => <p key={score.interval} className="text-sm" data-testid={`text-interval-score-${score.interval}`}>Intervalo {score.interval}: {score.value} {score.unit}</p>)}
          </fieldset>
        ) : (
          <fieldset className="space-y-3 rounded-xl border border-line p-3">
            <legend className="label px-1">Vuelta incompleta / parcial</legend>
            <label className="block text-xs">Reps parciales (solo reps, no sumar metros/segundos)<input type="number" min="0" step="1" value={partial} onChange={(e) => setPartial(e.target.value)} className="field mt-1 w-full" data-testid="input-partial-reps" /></label>
            <details>
              <summary className="min-h-11 cursor-pointer py-3 text-sm" data-testid="toggle-partial-details">Detalle por ejercicio y unidad</summary>
              {block.items.map((item, i) => {
                const d = detail[item.exerciseId] ?? { value: '', unit: item.distance ? 'm' : item.duration ? 's' : 'reps' };
                return <div key={`${item.exerciseId}-${i}`} className="mb-3">
                  <p className="mb-1 text-xs">{getExercise(item.exerciseId).name}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <input aria-label={`Parcial de ${getExercise(item.exerciseId).name}`} type="number" min="0" step="any" value={d.value} onChange={(e) => setDetail({ ...detail, [item.exerciseId]: { ...d, value: e.target.value } })} className="field w-full" data-testid={`input-detail-value-${i}`} />
                    <select aria-label={`Unidad de ${getExercise(item.exerciseId).name}`} value={d.unit} onChange={(e) => setDetail({ ...detail, [item.exerciseId]: { ...d, unit: e.target.value } })} className="field w-full" data-testid={`select-detail-unit-${i}`}><option value="reps">reps</option><option value="m">m</option><option value="s">s</option><option value="kcal">kcal</option></select>
                  </div>
                </div>;
              })}
            </details>
            <button type="button" onClick={() => action(savePartial)} className="btn-ghost w-full" disabled={result.status === 'idle'} data-testid="button-save-partial">Guardar parcial</button>
          </fieldset>
        )}

        <div className="space-y-2">
          <p className="label">Splits · {result.splits.length ? `${result.splits.length} registrados` : 'no registrados'}</p>
          {result.splits.map((split) => <div key={split.round} className="flex items-center justify-between rounded-xl border border-line px-3 py-2 text-sm" data-testid={`row-split-${split.round}`}>
            <span>{result.format === 'chipper' ? 'Checkpoint' : 'R'}{split.round}</span>
            <span className="font-mono">{clock(split.splitSec)}</span><span className="text-muted">Σ {clock(split.elapsedSec)}</span>
          </div>)}
          {stats.mean !== undefined && <p className="text-xs text-muted" data-testid="text-split-stats">Mejor {clock(stats.fastest!)} · más lenta {clock(stats.slowest!)} · media {clock(stats.mean)} · DE {stats.deviation!.toFixed(1)} s</p>}
          {stats.delta !== undefined && <p className="text-xs text-muted" data-testid="text-split-consistency">Última − primera: {stats.delta > 0 ? '+' : ''}{stats.delta.toFixed(1)} s · variación {stats.consistency?.toFixed(1)}%</p>}
        </div>

        <details className="rounded-xl border border-line p-3">
          <summary className="min-h-11 cursor-pointer py-3 text-sm" data-testid="toggle-hybrid-correction">Corrección manual justificada</summary>
          <p className="mb-2 text-xs text-muted">Pausá primero. Corregir el score no inventa splits faltantes. Cada cambio conserva el valor anterior.</p>
          <div className="space-y-2">
            <label className="block text-xs">Tiempo activo total (segundos)<input type="number" min="0" step="any" className="field mt-1 w-full" value={correctSeconds} onChange={(e) => setCorrectSeconds(e.target.value)} data-testid="input-correction-seconds" /></label>
            <label className="block text-xs">Vueltas completas<input type="number" min="0" step="1" className="field mt-1 w-full" value={correctRounds} onChange={(e) => setCorrectRounds(e.target.value)} data-testid="input-correction-rounds" /></label>
            <label className="block text-xs">Reps parciales corregidas<input type="number" min="0" step="1" className="field mt-1 w-full" value={correctReps} onChange={(e) => setCorrectReps(e.target.value)} data-testid="input-correction-reps" /></label>
            <label className="block text-xs">Acumulados de splits existentes (segundos, separados por coma)<input className="field mt-1 w-full" value={correctSplits} onChange={(e) => setCorrectSplits(e.target.value)} placeholder={result.splits.map((s) => s.elapsedSec.toFixed(1)).join(', ')} data-testid="input-correction-splits" /></label>
            <label className="block text-xs">Motivo obligatorio<input className="field mt-1 w-full" value={correctionReason} onChange={(e) => setCorrectionReason(e.target.value)} data-testid="input-correction-reason" /></label>
            <button type="button" disabled={result.status === 'running' || result.status === 'idle'} className="btn-ghost w-full" data-testid="button-save-correction" onClick={() => action((r, time) => {
              const cumulative = correctSplits.trim() ? correctSplits.split(',').map(Number) : undefined;
              if (cumulative && cumulative.length !== r.splits.length) throw new Error('Editá únicamente los splits existentes; no se crean tiempos no registrados.');
              const patch = {
                ...(correctSeconds !== '' ? { activeElapsedSec: Number(correctSeconds) } : {}),
                ...(correctRounds !== '' ? { completedRounds: Number(correctRounds) } : {}),
                ...(correctReps !== '' ? { partialReps: Number(correctReps) } : {}),
                ...(cumulative ? { splits: r.splits.map((s, i) => ({ ...s, elapsedSec: cumulative[i]! })) } : {}),
              };
              if (Object.keys(patch).length === 0) throw new Error('Ingresá al menos una corrección.');
              if (patch.activeElapsedSec !== undefined && r.targetSec !== undefined && patch.activeElapsedSec > r.targetSec &&
                !window.confirm('El tiempo corregido supera el cap. ¿Confirmás la corrección fuera del límite?')) return r;
              return correctHybrid(r, patch, correctionReason, time);
            })}>Guardar corrección auditada</button>
          </div>
        </details>
        <details className="rounded-xl border border-line p-3">
          <summary className="min-h-11 cursor-pointer py-3 text-sm" data-testid="toggle-hybrid-events">Historial de eventos ({result.events.length})</summary>
          <ol className="max-h-64 space-y-2 overflow-y-auto">
            {result.events.map((e, i) => <li key={i} className="border-t border-line pt-2 text-xs" data-testid={`text-hybrid-event-${i}`}>
              {new Date(e.at).toLocaleTimeString()} · {e.type} · {clock(e.elapsedSec)}{e.reason ? ` · ${e.reason}` : ''}
            </li>)}
          </ol>
        </details>
      </div>
    </section>
  );
};
