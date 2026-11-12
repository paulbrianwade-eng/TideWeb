import { useState } from 'react';
import { Check, Footprints, Pause, Play, RotateCcw } from 'lucide-react';
import type { TransitionIntensity, TransitionResult, WorkoutBlock } from '../types';
import { TRANSITION_INTENSITY } from '../types';
import { formatClock, useTimer } from '../lib/timers';

/**
 * VUELTA A LA MANZANA
 * ───────────────────
 * No es un ejercicio: es una transición cardiovascular con entidad propia.
 * Tarjeta más simple que los bloques principales, fondo verde muy claro,
 * cronómetro libre (la rutina no fija distancia, así que la app no la impone).
 */
export const TransitionCard = ({
  block,
  result,
  onComplete,
  compact = false,
}: {
  block: WorkoutBlock;
  result?: TransitionResult;
  onComplete?: (r: Omit<TransitionResult, 'blockId' | 'completedAt'>) => void;
  /** En Hoy se muestra sin cronómetro: solo la previsualización. */
  compact?: boolean;
}) => {
  const intensity: TransitionIntensity = block.intensity ?? 'sostenido';
  const meta = TRANSITION_INTENSITY[intensity];
  const t = useTimer({ mode: 'stopwatch' });
  const [rpe, setRpe] = useState('');
  const [feeling, setFeeling] = useState('');
  const [distance, setDistance] = useState('');
  const [done, setDone] = useState(!!result);

  const seconds = result?.seconds ?? Math.round(t.elapsed);

  if (compact) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-brand/25 bg-lime-soft px-4 py-3">
        <Footprints className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-brand">
            Cardio transition
          </span>
          <span className="block font-display text-base uppercase leading-tight text-ink">
            {block.title.includes('INDOOR') ? 'Bicicleta indoor' : 'Vuelta a la manzana'}
          </span>
          <span className="block text-xs text-muted">{meta.label} · {meta.rpe}</span>
        </span>
        <span aria-hidden="true" className="shrink-0 text-lg text-brand">↗</span>
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-brand/25 bg-lime-soft p-4">
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand text-white">
          <Footprints className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand">
            Cardio transition
          </p>
          <h3 className="mt-0.5 text-xl text-ink">{block.title.includes('INDOOR') ? 'Bicicleta indoor' : 'Vuelta a la manzana'}</h3>
        </div>
        <span aria-hidden="true" className="text-xl text-brand">↗</span>
      </div>

      <dl className="mt-3 space-y-1.5 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="label">Ritmo</dt>
          <dd className="font-semibold text-ink">
            {meta.label} · {meta.rpe}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="label">Intensidad</dt>
          <dd className="text-muted">{meta.detail}</dd>
        </div>
        {block.goal && (
          <div>
            <dt className="label">Objetivo</dt>
            <dd className="mt-0.5 text-muted">{block.goal}</dd>
          </div>
        )}
      </dl>

      {done ? (
        <div className="mt-4">
          <p className="flex items-center gap-2 font-semibold text-brand">
            <Check className="h-4 w-4" aria-hidden="true" /> Completado
          </p>
          <p className="figure mt-1 text-3xl text-ink">{formatClock(seconds)}</p>
          {(result?.rpe || rpe) && <p className="mt-1 label">RPE {result?.rpe ?? rpe}</p>}
        </div>
      ) : (
        <>
          <p className="figure mt-4 text-center text-5xl text-ink">{formatClock(t.elapsed)}</p>

          <div className="mt-3 flex items-center justify-center gap-2">
            <button type="button" onClick={t.toggle} className="btn-primary px-6 py-3">
              {t.running ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
              {t.running ? 'Pausar' : t.elapsed > 0 ? 'Seguir' : 'Iniciar'}
            </button>
            <button
              type="button"
              onClick={t.reset}
              aria-label="Reiniciar cronómetro de la vuelta"
              className="btn-ghost px-4 py-3"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {t.elapsed > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <label className="block">
                <span className="label">RPE</span>
                <input
                  inputMode="numeric"
                  value={rpe}
                  onChange={(e) => setRpe(e.target.value)}
                  placeholder="7"
                  className="field mt-1"
                />
              </label>
              <label className="block">
                <span className="label">Sensación</span>
                <input
                  value={feeling}
                  onChange={(e) => setFeeling(e.target.value)}
                  placeholder="Bien"
                  className="field mt-1"
                />
              </label>
            </div>
          )}

          <button
            type="button"
            disabled={t.elapsed === 0}
            onClick={() => {
              t.pause();
              setDone(true);
              onComplete?.({
                seconds: Math.round(t.elapsed),
                distanceM: distance ? Number(distance) : undefined,
                rpe: rpe ? Number(rpe) : undefined,
                feeling: feeling || undefined,
              });
            }}
            className="btn-lime mt-3 w-full"
          >
            <Check className="h-4 w-4" aria-hidden="true" /> Completar vuelta
          </button>
          <label className="mt-3 block text-sm">Distancia opcional (m)
            <input type="number" min="0" value={distance} onChange={e => setDistance(e.target.value)} className="field mt-1" />
          </label>
        </>
      )}
    </section>
  );
};
