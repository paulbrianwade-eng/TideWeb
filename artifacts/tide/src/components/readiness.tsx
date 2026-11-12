import { useState } from 'react';
import { ArrowLeft, Play } from 'lucide-react';
import type { Workout } from '../types';
import type { AdaptationAnswers } from '../lib/adaptations';
import { applyAdaptations, emptyAnswers } from '../lib/adaptations';

/**
 * ReadinessCheck — las preguntas previas al entrenamiento.
 * No es un formulario decorativo: cada respuesta transforma la sesión, y el
 * panel de abajo muestra en vivo qué va a cambiar antes de tocar "Entrenar".
 */
const Choice = <T,>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T | null;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) => (
  <div>
    <p className="label">{label}</p>
    <div className="mt-2 flex flex-wrap gap-2">
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={String(o.value)}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.value)}
            className={`rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors duration-200 ${
              active ? 'border-brand bg-brand text-white' : 'border-line bg-surface text-muted hover:border-brand'
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  </div>
);

export const ReadinessCheck = ({
  workout,
  onStart,
  onBack,
}: {
  workout: Workout;
  onStart: (answers: AdaptationAnswers) => void;
  onBack: () => void;
}) => {
  const [a, setA] = useState<AdaptationAnswers>({ ...emptyAnswers, minutes: 50, place: 'gym' });
  const set = (patch: Partial<AdaptationAnswers>) => setA((prev) => ({ ...prev, ...patch }));
  const { rules } = applyAdaptations(workout, a);

  return (
    <div className="min-h-screen bg-canvas pb-32">
      <label className="mx-5 mt-4 flex min-h-11 items-center gap-3 rounded-xl border border-line bg-surface p-3">
        <input type="checkbox" checked={!!a.rain} onChange={e => set({ rain: e.target.checked })} />
        Modo lluvia · solo TRX, exterior y soga
      </label>
      <header className="sticky top-0 z-20 border-b border-line bg-canvas/95 pt-[env(safe-area-inset-top)] backdrop-blur">
        <div className="flex items-center gap-3 px-4 py-3">
          <button type="button" onClick={onBack} aria-label="Volver" className="btn-quiet">
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="min-w-0">
            <p className="label">Antes de entrenar</p>
            <p className="truncate font-display text-lg uppercase">{workout.name}</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-2xl space-y-6 px-5 pt-5">
        <Choice
          label="¿Cómo dormiste?"
          value={a.sleep}
          onChange={(v) => set({ sleep: v })}
          options={[
            { value: 5, label: 'Menos de 6 h' },
            { value: 7, label: '6 a 8 h' },
            { value: 9, label: 'Más de 8 h' },
          ]}
        />

        <Choice
          label="Nivel de energía"
          value={a.energy}
          onChange={(v) => set({ energy: v })}
          options={[
            { value: 3, label: 'Bajo' },
            { value: 6, label: 'Normal' },
            { value: 9, label: 'Alto' },
          ]}
        />

        <Choice
          label="¿Dolor o molestia?"
          value={a.pain}
          onChange={(v) => set({ pain: v, painArea: v === 0 ? null : a.painArea })}
          options={[
            { value: 0, label: 'Ninguna' },
            { value: 4, label: 'Leve' },
            { value: 7, label: 'Marcada' },
          ]}
        />

        {a.pain !== null && a.pain > 0 && (
          <div className="animate-rise-in">
            <Choice
              label="¿Dónde?"
              value={a.painArea}
              onChange={(v) => set({ painArea: v })}
              options={[
                { value: 'lumbar' as const, label: 'Lumbar' },
                { value: 'rodilla' as const, label: 'Rodilla' },
                { value: 'hombro' as const, label: 'Hombro' },
              ]}
            />
          </div>
        )}

        <Choice
          label="Tiempo disponible"
          value={a.minutes}
          onChange={(v) => set({ minutes: v })}
          options={[
            { value: 30 as const, label: '30 min' },
            { value: 50 as const, label: 'Completo' },
          ]}
        />

        <Choice
          label="¿Dónde entrenás?"
          value={a.place}
          onChange={(v) => set({ place: v })}
          options={[
            { value: 'gym' as const, label: 'Gimnasio' },
            { value: 'casa' as const, label: 'En casa' },
          ]}
        />

        <Choice
          label="¿Mañana hacés deporte?"
          value={a.tomorrow}
          onChange={(v) => set({ tomorrow: a.tomorrow === v ? null : v })}
          options={[
            { value: 'surf' as const, label: 'Surf' },
            { value: 'golf' as const, label: 'Golf' },
          ]}
        />

        {/* Qué va a cambiar */}
        {rules.length > 0 && (
          <section className="animate-rise-in rounded-2xl border-l-4 border-brand bg-lime-soft px-4 py-3">
            <p className="label text-brand-dark">La sesión se adapta</p>
            <ul className="mt-2 space-y-2">
              {rules.map((r) => (
                <li key={r.id}>
                  <p className="text-sm font-semibold">{r.label}</p>
                  <p className="text-sm text-muted">{r.effect}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <button type="button" onClick={() => onStart(a)} className="btn-primary w-full py-5">
          <Play className="h-5 w-5" aria-hidden="true" /> Entrenar
        </button>

        <button type="button" onClick={() => onStart(emptyAnswers)} className="btn-quiet w-full pb-4">
          Saltar y entrenar sin adaptar
        </button>
      </div>
    </div>
  );
};
