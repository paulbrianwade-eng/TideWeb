import { useMemo, useState } from 'react';
import { Check, PlayCircle, Plus, Search } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { CATEGORIES, EXERCISES, videoUrl } from '../data/exercises';
import { ModuleBadge } from '../components/ModuleBadge';
import type { Exercise, ExerciseCategory } from '../types';
import { Card, EmptyState, StatusBadge } from '../components/ui';

const ExerciseCard = ({ exercise }: { exercise: Exercise }) => {
  const app = useApp();
  const [open, setOpen] = useState(false);
  const added = (app.state.extras[app.today] ?? []).includes(exercise.id);

  return (
    <Card className="space-y-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-start justify-between gap-3 text-left"
      >
        <span className="min-w-0">
          <span className="block font-display text-lg font-semibold leading-tight">{exercise.name}</span>
          <span className="mt-1 block text-xs leading-snug text-muted">{exercise.objective}</span>
          <span className="mt-1.5 block font-mono text-[11px] text-muted">{exercise.typical}</span>
          <span className="mt-1.5 flex flex-wrap gap-1">
            {exercise.capacities.slice(0, 3).map((c) => (
              <span
                key={c}
                className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] text-accent"
              >
                {c}
              </span>
            ))}
            {exercise.modules?.map((m) => (
              <ModuleBadge key={m} module={m} size="sm" />
            ))}
          </span>
        </span>
        <span aria-hidden="true" className="mt-1 font-mono text-xs text-muted">
          {open ? '−' : '+'}
        </span>
      </button>

      {open && (
        <div className="space-y-3 border-t border-line pt-3 text-sm">
          <a
            href={videoUrl(exercise)}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost w-full"
          >
            <PlayCircle className="h-4 w-4" aria-hidden="true" /> Ver video de técnica
          </a>
          <div>
            <p className="eyebrow">Objetivo</p>
            <p className="mt-1 text-ink/90">{exercise.objective}</p>
          </div>
          <div>
            <p className="eyebrow">Capacidades que desarrolla</p>
            <p className="mt-1 flex flex-wrap gap-1">
              {exercise.capacities.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-line bg-surface2 px-2 py-0.5 text-[11px] text-muted"
                >
                  {c}
                </span>
              ))}
            </p>
          </div>
          <div>
            <p className="eyebrow">Músculos y estructuras</p>
            <p className="mt-1 text-muted">{exercise.targets.join(' · ')}</p>
          </div>
          <div>
            <p className="eyebrow">Categorías</p>
            <p className="mt-1 text-muted">{exercise.categories.join(' · ')}</p>
          </div>
          <div>
            <p className="eyebrow">Indicaciones técnicas</p>
            <ul className="mt-1 space-y-1">
              {exercise.cues.map((c) => (
                <li key={c} className="flex gap-2">
                  <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow">Errores frecuentes</p>
            <p className="mt-1 text-muted">{exercise.mistakes.join(' · ')}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="eyebrow">Regresión</p>
              <p className="mt-1 text-muted">{exercise.regression}</p>
            </div>
            <div>
              <p className="eyebrow">Progresión</p>
              <p className="mt-1 text-muted">{exercise.progression}</p>
            </div>
          </div>
          <div>
            <p className="eyebrow">Equipamiento</p>
            <p className="mt-1 text-muted">{exercise.equipment.join(' · ')}</p>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => app.toggleExtra(app.today, exercise.id)}
        className={added ? 'btn-ghost w-full border-accent/50 text-accent' : 'btn-ghost w-full'}
      >
        {added ? (
          <>
            <Check className="h-4 w-4" aria-hidden="true" /> En la sesión de hoy · quitar
          </>
        ) : (
          <>
            <Plus className="h-4 w-4" aria-hidden="true" /> Agregar a sesión
          </>
        )}
      </button>
    </Card>
  );
};

export const LibraryScreen = () => {
  const app = useApp();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<ExerciseCategory | 'Todos'>('Todos');
  const extras = app.state.extras[app.today] ?? [];

  const results = useMemo(
    () =>
      EXERCISES.filter((e) => {
        const matchCat = category === 'Todos' || e.categories.includes(category);
        const q = query.trim().toLowerCase();
        const matchQuery =
          q === '' ||
          e.name.toLowerCase().includes(q) ||
          e.targets.some((t) => t.toLowerCase().includes(q)) ||
          e.categories.some((c) => c.toLowerCase().includes(q));
        return matchCat && matchQuery;
      }),
    [query, category],
  );

  return (
    <div className="blue-screen space-y-4">
      <header className="flex items-end justify-between gap-3">
        <div>
          <p className="eyebrow">{EXERCISES.length} ejercicios</p>
          <h1 className="font-display text-3xl leading-none">Biblioteca</h1>
        </div>
        {extras.length > 0 && <StatusBadge tone="accent">{extras.length} en la sesión de hoy</StatusBadge>}
      </header>

      <label className="relative block">
        <span className="sr-only">Buscar ejercicio</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre, músculo o capacidad"
          className="field pl-9"
        />
      </label>

      <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1">
        {(['Todos', ...CATEGORIES] as const).map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={category === c}
            onClick={() => setCategory(c as ExerciseCategory | 'Todos')}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium ${
              category === c ? 'border-accent bg-accent/15 text-accent' : 'border-line bg-surface2 text-muted'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {results.length === 0 ? (
        <EmptyState title="Sin resultados" hint="Probá con otro nombre o quitá el filtro de categoría." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {results.map((e) => (
            <ExerciseCard key={e.id} exercise={e} />
          ))}
        </div>
      )}
    </div>
  );
};
