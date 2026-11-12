import type { RoundSplit } from '../types/hybrid';
import { formatClock } from '../lib/timers';

/** Zero-baseline bars of measured round durations; missing splits stay missing. */
export const RoundPaceChart = ({ splits }: { splits: RoundSplit[] }) => {
  const measured = splits.filter(s => Number.isFinite(s.splitSec) && s.splitSec >= 0);
  if (!measured.length) return <p className="text-sm text-muted">Tiempos por vuelta: no registrados.</p>;
  const maximum = Math.max(1, ...measured.map(s => s.splitSec));
  return (
    <figure className="mt-3 rounded-xl border border-line bg-surface p-3">
      <figcaption className="label mb-3">Tiempo por vuelta · segundos</figcaption>
      <div className="space-y-2" role="img" aria-label={measured.map(s => `Vuelta ${s.round}: ${s.splitSec.toFixed(1)} segundos`).join('; ')}>
        {measured.map(s => (
          <div key={s.round} className="grid grid-cols-[2rem_1fr_3.5rem] items-center gap-2 text-xs">
            <span>R{s.round}</span>
            <div className="h-5 rounded bg-sky">
              <div className="h-full rounded bg-brand" title={`${s.splitSec.toFixed(1)} segundos`} style={{ width: `${s.splitSec / maximum * 100}%` }} />
            </div>
            <span className="text-right font-mono">{formatClock(s.splitSec)}</span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-muted">Escala desde 0 hasta {maximum.toFixed(1)} s. Solo parciales registrados; menos tiempo no implica mejor técnica.</p>
    </figure>
  );
};
