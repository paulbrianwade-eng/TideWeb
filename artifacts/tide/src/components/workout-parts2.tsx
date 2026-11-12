import { useState } from 'react';
import { Check, ChevronDown, ChevronRight, Repeat, Timer } from 'lucide-react';
import type { WorkoutBlock } from '../types';
import { BLOCK_META } from './blockMeta';
import { getExercise } from '../data/exercises';
import { Thumb } from './media';
import { needsTimer } from './timers';
import { setKey } from '../lib/prescription';

/**
 * LÓGICA A/B
 * ──────────
 * `A` sola significa: completar todas sus series antes de pasar a `B`.
 * `A1`, `A2` significa superserie: alternar entre ambos y descansar al final
 * de cada vuelta. Se agrupa por la letra para que la diferencia se vea.
 */
export const groupByLetter = (items: WorkoutBlock['items']) => {
  const groups: { letter: string; superset: boolean; items: { item: WorkoutBlock['items'][number]; index: number }[] }[] = [];
  items.forEach((item, index) => {
    const letter = (item.order ?? '').replace(/\d+$/, '');
    const numbered = /\d+$/.test(item.order ?? '');
    const last = groups[groups.length - 1];
    if (last && last.letter === letter) {
      last.items.push({ item, index });
      // Dos o más con la misma letra Y numerados = superserie
      last.superset = numbered && last.items.length > 1;
    } else {
      groups.push({ letter, superset: false, items: [{ item, index }] });
    }
  });
  return groups;
};

/** Volumen legible: "3 × 8 rep/lado", "40 s", "25 m". */
export const volumeText = (it: WorkoutBlock['items'][number]): string => {
  const side = it.unilateral ? '/lado' : '';
  let right = '';
  if (it.reps) right = /[a-zA-Z]/.test(it.reps) ? it.reps : `${it.reps} rep`;
  else if (it.duration) right = it.duration;
  else if (it.distance) right = it.distance;
  const left = it.sets ? String(it.sets) : '';
  const core = left && right ? `${left} × ${right}` : right || left;
  return `${core}${side}`;
};

/** Tarjeta horizontal: miniatura · nombre · volumen · estado. */
export const ExerciseRow = ({
  item,
  kind,
  done = false,
  onOpen,
}: {
  item: WorkoutBlock['items'][number];
  kind: WorkoutBlock['kind'];
  done?: boolean;
  onOpen?: () => void;
}) => {
  const ex = getExercise(item.exerciseId);
  const body = (
    <>
      <Thumb exerciseId={ex.id} kind={kind} className="h-14 w-14 shrink-0 rounded-xl" />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold leading-tight text-ink">{ex.name}</span>
        <span className="mt-1 block font-mono text-xs text-muted">{volumeText(item)}</span>
        {item.load && <span className="mt-0.5 block text-[11px] text-muted">{item.load}</span>}
        {item.instructions && (
          <span className="mt-0.5 block text-[11px] leading-snug text-muted">{item.instructions}</span>
        )}
        {item.alternatives && item.alternatives.length > 0 && (
          <span className="mt-0.5 block text-[11px] leading-snug text-muted">
            Alternativas: {item.alternatives.join(' · ')}
          </span>
        )}
        {item.rest && (
          <span className="mt-0.5 block text-[11px] leading-snug text-muted">Recuperación: {item.rest}</span>
        )}
      </span>
      {done ? (
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand text-white">
          <Check className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      ) : (
        item.order && <span className="label shrink-0">{item.order}</span>
      )}
    </>
  );

  return onOpen ? (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Abrir ${ex.name}`}
      className="flex w-full items-center gap-3 border-b border-line py-3 text-left last:border-b-0"
    >
      {body}
    </button>
  ) : (
    <div className="flex items-center gap-3 border-b border-line py-3 last:border-b-0">{body}</div>
  );
};

/**
 * Bloque plegable con encabezado verde: "BLOQUE 1 · ZONA MEDIA · 3 VUELTAS".
 * Es la unidad visual de toda la app.
 */
export const CollapsibleBlock = ({
  block,
  defaultOpen = false,
  onOpenExercise,
  onTimer,
  doneIds = [],
  itemIndexes,
  footer,
}: {
  block: WorkoutBlock;
  defaultOpen?: boolean;
  onOpenExercise?: (index: number) => void;
  onTimer?: () => void;
  doneIds?: string[];
  /** Índices originales cuando el bloque muestra solo la opción elegida. */
  itemIndexes?: number[];
  footer?: React.ReactNode;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const meta = BLOCK_META[block.kind];
  const Icon = meta.icon;

  return (
    <section className="card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left ${meta.head} ${meta.text}`}
      >
        <span className="min-w-0">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] opacity-80">
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            Bloque {block.index}
          </span>
          <span className="mt-0.5 block font-display text-2xl uppercase leading-none">{block.title}</span>
          <span className="mt-1 block text-[11px] font-semibold uppercase tracking-[0.1em] opacity-90">
            {block.formatLabel}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.1em] opacity-80">
            {block.minutes} min
          </span>
          {open ? <ChevronDown className="h-4 w-4" aria-hidden="true" /> : <ChevronRight className="h-4 w-4" aria-hidden="true" />}
        </span>
      </button>

      {open && (
        <div className="animate-rise-in px-4 pb-4">
          {block.focus && <p className="pt-3 text-xs text-muted">{block.focus}</p>}
          <div className="mt-1">
            {groupByLetter(block.items).map((g) => (
              <div key={g.letter} className="mb-2 last:mb-0">
                {g.letter && (
                  <p className="flex items-baseline gap-2 pb-1 pt-2">
                    <span className="grid h-5 w-5 place-items-center rounded bg-ink text-[10px] font-bold text-white">
                      {g.letter}
                    </span>
                    <span className="label">
                      {g.superset
                        ? `Superserie · ${g.items.length} ejercicios alternados`
                        : 'Completar todas las series antes de continuar'}
                    </span>
                  </p>
                )}
                {g.items.map(({ item, index }) => (
                  <ExerciseRow
                    key={`${block.id}-${itemIndexes?.[index] ?? index}`}
                    item={item}
                    kind={block.kind}
                    done={doneIds.includes(setKey(block.id, item.exerciseId, itemIndexes?.[index] ?? index))}
                    onOpen={onOpenExercise ? () => onOpenExercise(itemIndexes?.[index] ?? index) : undefined}
                  />
                ))}
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {block.rest && (
              <span className="chip">
                <Repeat className="h-3 w-3" aria-hidden="true" /> {block.rest}
              </span>
            )}
            {block.scoreHint && <span className="chip-lime">Score: {block.scoreHint}</span>}
          </div>

          {onTimer && needsTimer(block) && (
            <button type="button" onClick={onTimer} className="btn-ghost mt-3 w-full">
              <Timer className="h-4 w-4" aria-hidden="true" /> Abrir temporizador
            </button>
          )}

          {footer}
        </div>
      )}
    </section>
  );
};
