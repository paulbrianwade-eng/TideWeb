import { Check, Minus, X } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { addDays, dayNumber, startOfWeek, weekdayShort } from '../lib/date';
import { dayState, tagOf, TAG_STYLE, STATE_LABEL } from './v8';

/** Mini calendar Mon–Sun for the week containing `anchor`. */
export const WeekStrip = ({ anchor, onPick }: { anchor: string; onPick?: (workoutId: string) => void }) => {
  const app = useApp();
  const start = startOfWeek(anchor);
  const dates = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  return (
    <ol className="grid grid-cols-7 gap-1.5" aria-label="Semana actual" data-testid="mini-calendar">
      {dates.map((d) => {
        const w = app.workoutFor(d);
        const st = w ? dayState(w, app.state, app.today) : null;
        const tag = w ? tagOf(w) : null;
        const isToday = d === app.today;
        return (
          <li key={d}>
            <button
              type="button"
              disabled={!w || !onPick}
              onClick={() => w && onPick?.(w.id)}
              data-testid={`day-${d}`}
              aria-label={`${weekdayShort(d)} ${dayNumber(d)}${w ? ` · ${w.name} · ${STATE_LABEL[st!]}` : ''}`}
              className={`flex min-h-[68px] w-full flex-col items-center justify-between rounded-xl border px-0.5 py-1.5 transition-colors ${
                isToday ? 'border-brand bg-sky' : 'border-line bg-surface'
              } ${st === 'skipped' ? 'opacity-60' : ''}`}
            >
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">{weekdayShort(d).slice(0, 2)}</span>
              <span className={`figure text-lg ${isToday ? 'text-brand' : 'text-ink'}`}>{dayNumber(d)}</span>
              {tag ? (
                <span className={`rounded px-1 text-[9px] font-bold tracking-wider ${TAG_STYLE[tag]}`}>{tag}</span>
              ) : (
                <span className="text-[9px] text-muted">—</span>
              )}
              <span className="h-3" aria-hidden="true">
                {st === 'done' && <Check className="h-3 w-3 text-success" strokeWidth={3} />}
                {st === 'skipped' && <X className="h-3 w-3 text-muted" strokeWidth={3} />}
                {st === 'missed' && <Minus className="h-3 w-3 text-warn" strokeWidth={3} />}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
};
