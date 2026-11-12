import { useState } from 'react';
import { RoundPaceChart } from './RoundPaceChart';
import { Check } from 'lucide-react';
import { useApp } from '../state/AppContext';
import type { BlockKind, SessionSummary } from '../types';
import { actualSessionStats, initialSessionDurationMin } from '../lib/analytics';
import { formatClock } from '../lib/timers';
import { ScaleSelector, Stat } from './ui';
import { SessionExport } from './SessionExport';

/** Closure reports observations, not the planned duration or an inferred completion. */
export const WorkoutSummaryModal = ({ workoutId, onClose }: { workoutId: string; onClose: () => void }) => {
  const app = useApp();
  const session = app.sessionFor(workoutId);
  const workout = session?.definition ?? app.workoutById(workoutId);
  const previous = app.summaryFor(workoutId);
  const [duration, setDuration] = useState(() => initialSessionDurationMin(session, previous)?.toString() ?? '');
  const [rpe, setRpe] = useState<number | null>(previous?.rpe ?? null);
  const [energy, setEnergy] = useState<number | null>(previous?.energy ?? null);
  const [pain, setPain] = useState<number | null>(previous?.pain ?? null);
  const [painArea, setPainArea] = useState(previous?.painArea ?? session?.painArea ?? '');
  const [painExercise, setPainExercise] = useState(previous?.painExercise ?? session?.painExercise ?? '');
  const [painNote, setPainNote] = useState(previous?.painNote ?? session?.painNote ?? '');
  const [comment, setComment] = useState(previous?.comment ?? '');
  const [calories, setCalories] = useState(previous?.calories?.toString() ?? '');
  const [avgHr, setAvgHr] = useState(previous?.avgHr?.toString() ?? '');
  const [maxHr, setMaxHr] = useState(previous?.maxHr?.toString() ?? '');
  const [source, setSource] = useState<'manual' | 'Garmin'>(previous?.dataSource ?? session?.dataSource ?? 'manual');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  if (!session) return (
    <div className="p-5"><p>No hay una sesión registrada para cerrar.</p><button type="button" className="btn-ghost" onClick={onClose}>Volver</button></div>
  );
  if (!workout) return (
    <div className="mx-auto max-w-2xl space-y-4 p-5">
      <p>La sesión no tiene una definición guardada ni un plan disponible. No se generan tiempos ni bloques para completar el resumen.</p>
      <SessionExport workoutId={workoutId} />
      <button type="button" className="btn-ghost" onClick={onClose}>Volver</button>
    </div>
  );
  const stats = actualSessionStats(session, workout);
  const transitions = Object.values(session.transitions ?? {});
  const timeByBlock: Partial<Record<BlockKind, number>> = {};
  for (const block of workout.blocks) {
    const measured = session.transitions?.[block.id]?.seconds ?? session.hybridResults?.[block.id]?.activeElapsedSec;
    if (measured !== undefined) timeByBlock[block.kind] = (timeByBlock[block.kind] ?? 0) + measured;
  }
  const measuredTimes = Object.values(timeByBlock);
  const bestTransition = transitions.length ? Math.min(...transitions.map((entry) => entry.seconds)) : undefined;
  const feedback = pain !== null && pain > 0 ?
    'Registraste dolor. No fuerces el movimiento que lo provoca; si persiste o es intenso, consultá a un profesional.' :
    'Registro guardado con tus datos reales. No se infiere calidad, recuperación ni descansos a partir de la frecuencia cardíaca.';

  const save = () => {
    const minutes = Number(duration);
    if (!duration.trim() || !Number.isFinite(minutes) || minutes <= 0) {
      setError('Ingresá una duración real mayor que 0 minutos.'); return;
    }
    if (rpe === null || energy === null || pain === null || rpe < 1 || rpe > 10 || energy < 1 || energy > 10 || pain < 0 || pain > 10) {
      setError('Seleccioná RPE, energía y dolor antes de guardar.'); return;
    }
    if (pain > 0 && (!painArea.trim() || !painExercise.trim() || !painNote.trim())) {
      setError('Completá ubicación, ejercicio asociado y nota del dolor (podés indicar «no identificado»).'); return;
    }
    const metrics = [calories, avgHr, maxHr];
    if (metrics.some((value) => value.trim() && (!Number.isFinite(Number(value)) || Number(value) <= 0))) {
      setError('Las métricas opcionales deben ser positivas o quedar vacías.'); return;
    }
    if (avgHr.trim() && maxHr.trim() && Number(avgHr) > Number(maxHr)) {
      setError('La FC máxima no puede ser menor que la media.'); return;
    }
    const painFields = { painArea: pain > 0 ? painArea.trim() : undefined,
      painExercise: pain > 0 ? painExercise.trim() : undefined, painNote: pain > 0 ? painNote.trim() : undefined };
    const summary = {
      ...previous, workoutId, workoutName: workout.name, date: session.date, durationMin: minutes,
      blocksCompleted: stats.completedBlockIds.length, blocksTotal: workout.blocks.length,
      // Legacy type requires volumeKg; absence is intentional when load/reps were not recorded.
      volumeKg: stats.volumeKg,
      setsCompleted: stats.setsCompleted, finisherScore: session.finisherScore,
      timeByBlock: measuredTimes.length ? timeByBlock : undefined,
      transitionsDone: transitions.length, bestTransitionSec: bestTransition,
      cardioSeconds: workout.blocks.some((block) => ['transicion', 'finisher', 'outdoor'].includes(block.kind) &&
        (session.transitions?.[block.id] || session.hybridResults?.[block.id])) ?
        workout.blocks.reduce((sum, block) => ['transicion', 'finisher', 'outdoor'].includes(block.kind) ?
          sum + (session.transitions?.[block.id]?.seconds ?? session.hybridResults?.[block.id]?.activeElapsedSec ?? 0) : sum, 0) : undefined,
      calories: calories.trim() ? Number(calories) : undefined,
      avgHr: avgHr.trim() ? Number(avgHr) : undefined, maxHr: maxHr.trim() ? Number(maxHr) : undefined,
      dataSource: source, rpe, energy, pain, ...painFields, feeling: previous?.feeling ?? null,
      comment, highlight: previous?.highlight ?? null, personalRecord: previous?.personalRecord ?? null, coachNote: feedback,
    } as SessionSummary;
    // Do not re-snapshot an old prescription at closure.
    app.saveSession({ ...session, completedAt: session.completedAt ?? Date.now(), elapsedMs: minutes * 60000,
      completedBlocks: stats.completedBlockIds, ...painFields, dataSource: source });
    app.saveSummary(summary);
    setError('');
    setSaved(true);
  };

  if (saved) return (
    <div className="min-h-screen bg-canvas pb-24">
      <div className="mx-auto max-w-2xl space-y-5 px-5 pt-[calc(env(safe-area-inset-top)+1.5rem)]">
        <p className="label text-brand">Sesión guardada</p>
        <h1 className="text-3xl">{workout.name}</h1>
        <p className="text-sm text-muted">Se guardaron {stats.setsCompleted} series y {stats.completedBlockIds.length}/{workout.blocks.length} bloques completos. Lo no registrado no se considera realizado.</p>
        <SessionExport workoutId={workoutId} />
        <button type="button" className="btn-primary w-full" onClick={onClose}>Listo · volver</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-canvas pb-24">
      <div className="mx-auto max-w-2xl space-y-5 px-5 pb-8 pt-[calc(env(safe-area-inset-top)+1.5rem)]">
        <header><p className="label text-brand">Cerrar sesión · datos reales</p><h1 className="mt-1 text-3xl">{workout.name}</h1></header>
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Bloques" value={`${stats.completedBlockIds.length}/${workout.blocks.length}`} />
          <Stat label="Series" value={String(stats.setsCompleted)} />
          <Stat label="Volumen registrado" value={stats.volumeKg === undefined ? 'Sin dato' : `${stats.volumeKg} kg`} />
        </div>
        <section className="card space-y-3 p-4">
          <label className="block"><span className="label">Duración real (minutos) · obligatoria</span>
            <input type="number" min="0.1" step="0.1" className="field mt-1" value={duration} onChange={(event) => setDuration(event.target.value)} />
          </label>
          <p className="text-xs text-muted">Valor inicial: tiempo transcurrido desde el inicio, incluidas pausas. Corregilo si dejaste la sesión abierta. No es el tiempo planificado.</p>
          <p className="label">Tiempos cronometrados por bloque</p>
          {measuredTimes.length ? workout.blocks.map((block) => {
            const seconds = session.transitions?.[block.id]?.seconds ?? session.hybridResults?.[block.id]?.activeElapsedSec;
            return <p key={block.id} className="flex justify-between gap-2 text-sm"><span>{block.title}</span><span>{seconds === undefined ? 'Sin dato' : formatClock(seconds)}</span></p>;
          }) : <p className="text-sm text-muted">Sin tiempos de bloques registrados.</p>}
          {transitions.length > 0 && <p className="text-sm">{transitions.length} transiciones · mejor: {formatClock(bestTransition!)}</p>}
          {Object.entries(session.hybridResults ?? {}).map(([id, result]) => (
            <div key={id} className="border-t border-border pt-2 text-sm">
              <p>{result.definition.title}: {result.completedRounds} vueltas + {result.partialReps} reps parciales{result.dnf ? ' · DNF' : ''}</p>
              <p className="text-muted">Activo {formatClock(result.activeElapsedSec)} · pausa {formatClock(result.pausedSec)}</p>
              <p className="text-muted">Splits: {result.splits.map((split) => `${split.round}: ${formatClock(split.splitSec)}`).join(' · ') || 'sin dato'}</p>
              <RoundPaceChart splits={result.splits} />
            </div>
          ))}
        </section>
        <section className="card space-y-5 p-4">
          <p className="text-sm text-muted">Obligatorio: RPE, energía y dolor. Cero dolor debe seleccionarse explícitamente.</p>
          <ScaleSelector label="RPE final *" value={rpe} onChange={setRpe} />
          <ScaleSelector label="Energía *" value={energy} onChange={setEnergy} />
          <ScaleSelector label="Dolor *" value={pain} onChange={setPain} min={0} hint="0 = sin molestias" />
          {pain !== null && pain > 0 && <div className="space-y-3">
            <label className="block"><span className="label">Ubicación del dolor *</span><input className="field mt-1" value={painArea} onChange={(event) => setPainArea(event.target.value)} /></label>
            <label className="block"><span className="label">Ejercicio asociado *</span><input className="field mt-1" value={painExercise} onChange={(event) => setPainExercise(event.target.value)} /></label>
            <label className="block"><span className="label">Nota de dolor *</span><textarea className="field mt-1" value={painNote} onChange={(event) => setPainNote(event.target.value)} /></label>
          </div>}
          <label className="block"><span className="label">Comentario</span><textarea className="field mt-1" value={comment} onChange={(event) => setComment(event.target.value)} /></label>
        </section>
        <section className="card space-y-3 p-4">
          <p className="label">Métricas opcionales del reloj</p>
          <p className="text-sm text-muted">Carga manual. No hay conexión automática con Garmin. Si no las mediste, dejalas vacías.</p>
          <div className="grid grid-cols-3 gap-2">
            {[{ label: 'kcal', value: calories, set: setCalories }, { label: 'FC media · bpm', value: avgHr, set: setAvgHr },
              { label: 'FC máx · bpm', value: maxHr, set: setMaxHr }].map((field) => (
                <label key={field.label} className="block"><span className="label">{field.label}</span><input type="number" min="1" className="field mt-1" value={field.value} onChange={(event) => field.set(event.target.value)} /></label>
              ))}
          </div>
          <label className="block"><span className="label">Fuente declarada</span><select className="field mt-1" value={source} onChange={(event) => setSource(event.target.value as 'manual' | 'Garmin')}><option value="manual">Manual</option><option value="Garmin">Garmin (transcrito manualmente)</option></select></label>
        </section>
        <p className="text-sm text-muted">{feedback}</p>
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        <button type="button" onClick={save} className="btn-primary w-full"><Check className="h-5 w-5" /> Guardar sesión y exportar</button>
        <button type="button" onClick={onClose} className="btn-ghost w-full">Volver sin cerrar sesión</button>
      </div>
    </div>
  );
};
