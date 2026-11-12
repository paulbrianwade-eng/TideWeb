import { useState } from 'react';
import { Check } from 'lucide-react';

/**
 * "HOY NECESITÁS" — checklist de preparación previa.
 * El estado es local a la sesión: es una ayuda para armar la estación, no un dato
 * que valga la pena persistir entre días.
 */
export const EquipmentList = ({ workoutId, items }: { workoutId: string; items: string[] }) => {
  const [checked, setChecked] = useState<string[]>([]);
  if (!items.length) return null;

  const toggle = (item: string) =>
    setChecked((prev) => (prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]));

  return (
    <section key={workoutId}>
      <div className="section-head">
        <h2 className="text-lg">Hoy necesitás</h2>
        <span className="label">
          {checked.length}/{items.length}
        </span>
      </div>
      <ul className="grid grid-cols-2 gap-2">
        {items.map((item) => {
          const on = checked.includes(item);
          return (
            <li key={item}>
              <button
                type="button"
                onClick={() => toggle(item)}
                aria-pressed={on}
                className={`flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors duration-200 ${
                  on ? 'border-brand bg-lime-soft text-brand-dark' : 'border-line bg-surface text-muted'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`grid h-4 w-4 shrink-0 place-items-center rounded border ${
                    on ? 'border-brand bg-brand text-white' : 'border-line'
                  }`}
                >
                  {on && <Check className="h-3 w-3" aria-hidden="true" />}
                </span>
                {item}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
