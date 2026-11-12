import { Check, Footprints } from 'lucide-react';
import type { Workout } from '../types';
import { BLOCK_META } from './blockMeta';

/**
 * TIMELINE VERTICAL
 * Responde una sola pregunta: dónde estoy dentro del entrenamiento.
 * Las transiciones se ven distintas de los bloques principales.
 */
export const WorkoutTimeline = ({
  workout,
  currentIndex,
  doneIndexes = [],
  onJump,
}: {
  workout: Workout;
  currentIndex: number;
  doneIndexes?: number[];
  onJump?: (index: number) => void;
}) => (
  <ol className="relative space-y-0">
    {workout.blocks.map((b, i) => {
      const isTransition = b.kind === 'transicion';
      const done = doneIndexes.includes(i);
      const current = i === currentIndex;
      const meta = BLOCK_META[b.kind];
      const Icon = isTransition ? Footprints : meta.icon;
      const last = i === workout.blocks.length - 1;

      const body = (
        <>
          <span className="relative flex flex-col items-center">
            <span
              className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 ${
                done
                  ? 'border-brand bg-brand text-white'
                  : current
                    ? 'border-brand bg-white text-brand'
                    : 'border-line bg-white text-muted'
              }`}
            >
              {done ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
            </span>
            {!last && <span className={`w-0.5 flex-1 ${done ? 'bg-brand' : 'bg-line'}`} style={{ minHeight: 18 }} />}
          </span>

          <span className="min-w-0 flex-1 pb-4">
            <span className="flex items-baseline justify-between gap-2">
              <span
                className={`truncate text-sm font-semibold ${
                  isTransition ? 'text-brand' : current ? 'text-ink' : 'text-muted'
                }`}
              >
                {isTransition ? 'Vuelta a la manzana' : `${String(b.index).padStart(2, '0')} · ${b.title}`}
              </span>
              <span className="label shrink-0">{b.minutes} min</span>
            </span>
            <span className="mt-0.5 block text-xs text-muted">
              {done ? 'Completado' : current ? 'En curso' : 'Pendiente'}
              {isTransition && b.intensity ? ` · ${b.intensity}` : ''}
            </span>
          </span>
        </>
      );

      return (
        <li key={b.id}>
          {onJump ? (
            <button type="button" onClick={() => onJump(i)} className="flex w-full gap-3 text-left">
              {body}
            </button>
          ) : (
            <div className="flex gap-3">{body}</div>
          )}
        </li>
      );
    })}
  </ol>
);
