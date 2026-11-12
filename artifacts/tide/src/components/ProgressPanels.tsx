import { useApp } from '../state/AppContext';
import { addDays, shortDate } from '../lib/date';
import { fmtSec, hybridRows, LIFTS, mean, mean7, round1, runningSplits, strengthRecords } from './v8';
import type { HybridRow } from './v8';

const Empty = ({ children }: { children: string }) => (
  <p className="rounded-xl border border-dashed border-line bg-surface px-4 py-5 text-center text-sm text-muted">{children}</p>
);
const Stat = ({ label, value, sub, tid }: { label: string; value: string; sub?: string; tid: string }) => (
  <div className="card p-3" data-testid={tid}>
    <p className="label">{label}</p>
    <p className="figure mt-1 text-2xl">{value}</p>
    {sub && <p className="text-[10px] text-muted">{sub}</p>}
  </div>
);

export const BodyStats = () => {
  const app = useApp();
  const w = app.state.metrics.weight ?? [];
  const waist = app.state.metrics.waist ?? [];
  const last = w[w.length - 1];
  const m7 = last ? mean7(w, last.date) : null;
  const prev7 = last ? mean7(w, addDays(last.date, -7)) : null;
  const lastWaist = waist[waist.length - 1];
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        <Stat tid="stat-mean7" label="Media 7 d" value={m7 ? `${m7.value} kg` : '—'} sub={m7 ? `${m7.n} pesajes` : 'Sin pesajes'} />
        <Stat tid="stat-mean7-delta" label="vs 7 d previos" value={m7 && prev7 ? `${m7.value - prev7.value > 0 ? '+' : ''}${round1(m7.value - prev7.value)}` : '—'} sub="kg" />
        <Stat tid="stat-waist" label="Cintura" value={lastWaist ? `${lastWaist.value}` : '—'} sub={lastWaist ? `cm · ${shortDate(lastWaist.date)}` : 'Sin registro'} />
      </div>
      <p className="text-[11px] text-muted">Peso perdido no equivale a grasa perdida. Cruzá con cintura y fuerza.</p>
    </div>
  );
};

export const StrengthPanel = () => {
  const app = useApp();
  const { best, log } = strengthRecords(app.state.sessions);
  return (
    <div className="card overflow-hidden" data-testid="panel-strength">
      <table className="w-full text-sm">
        <thead className="bg-surface2 text-left">
          <tr className="label"><th className="px-3 py-2">Lift</th><th className="px-2 py-2">Mejor serie</th><th className="px-2 py-2">e1RM</th><th className="px-3 py-2 text-right">Fecha</th></tr>
        </thead>
        <tbody className="divide-y divide-line">
          {LIFTS.map((l) => {
            const r = best[l.id];
            return (
              <tr key={l.id} data-testid={`row-lift-${l.id}`}>
                <td className="px-3 py-2.5"><span className="font-semibold">{l.label}</span>{r && <span className="block text-[11px] text-muted">{r.exercise}</span>}</td>
                <td className="px-2 py-2.5 font-mono">{r ? (r.load ? `${r.load} kg × ${r.reps}` : `${r.reps} reps`) : '—'}</td>
                <td className="px-2 py-2.5 font-mono text-brand">{r?.e1rm ? `${r.e1rm}` : '—'}</td>
                <td className="px-3 py-2.5 text-right text-muted">{r ? shortDate(r.date) : 'sin datos'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="border-t border-line px-3 py-2 text-[11px] text-muted">
        {log.length} series registradas con carga y reps. e1RM estimado (Epley), no un máximo probado.
      </p>
    </div>
  );
};

export const RunningPanel = () => {
  const app = useApp();
  const runs = runningSplits(app.state.sessions);
  const five = app.state.metrics['5k'] ?? [];
  if (!runs.length && !five.length) return <Empty>Sin splits registrados. Se muestran solo tiempos que cargues: vueltas, pasadas o 5 km.</Empty>;
  const withDist = runs.filter((r) => r.distanceM);
  const paces = withDist.map((r) => r.seconds / (r.distanceM! / 1000));
  const cv = paces.length > 1 ? round1((Math.sqrt(mean(paces.map((p) => (p - mean(paces)) ** 2))) / mean(paces)) * 100) : null;
  return (
    <div className="space-y-2" data-testid="panel-running">
      <div className="grid grid-cols-3 gap-2">
        <Stat tid="stat-runs" label="Splits" value={`${runs.length}`} />
        <Stat tid="stat-pace" label="Ritmo medio" value={paces.length ? `${fmtSec(mean(paces))}` : '—'} sub={paces.length ? 'min/km' : 'falta distancia'} />
        <Stat tid="stat-consistency" label="Variación" value={cv !== null ? `${cv}%` : '—'} sub="ritmo entre splits" />
      </div>
      {runs.length > 0 && (
        <ul className="card divide-y divide-line">
          {runs.slice(0, 12).map((r, i) => (
            <li key={`${r.workoutId}-${r.blockId}-${i}`} className="flex items-center justify-between px-3 py-2.5 text-sm">
              <span className="text-muted">{shortDate(r.date)}{r.distanceM ? ` · ${r.distanceM} m` : ''}{r.rpe ? ` · RPE ${r.rpe}` : ''}</span>
              <span className="font-mono">{fmtSec(r.seconds)}{r.distanceM ? <span className="ml-2 text-muted">{fmtSec(r.seconds / (r.distanceM / 1000))}/km</span> : null}</span>
            </li>
          ))}
        </ul>
      )}
      {five.length > 0 && <p className="text-xs text-muted">5 km registrado: {five[five.length - 1].value} min ({shortDate(five[five.length - 1].date)}).</p>}
    </div>
  );
};

export const HybridPanel = () => {
  const app = useApp();
  const rows = hybridRows(app.state.sessions);
  const legacy = app.state.history.filter((h) => h.finisherScore?.rounds || h.finisherScore?.time);
  if (!rows.length && !legacy.length) return <Empty>Sin resultados híbridos registrados. Los scores aparecen al terminar un AMRAP o For Time.</Empty>;
  const groups = rows.reduce<Record<string, HybridRow[]>>((acc, r) => ((acc[r.key] ??= []).push(r), acc), {});
  return (
    <div className="space-y-3" data-testid="panel-hybrid">
      {Object.values(groups).map((g) => {
        const best = g.length > 1 ? [...g].filter((r) => !r.result.dnf).sort((a, b) => (a.higherBetter ? b.scoreValue - a.scoreValue : a.scoreValue - b.scoreValue))[0] : undefined;
        const head = g[0]!;
        return (
          <article key={head.key} className="card overflow-hidden" data-testid={`card-hybrid-${head.blockId}`}>
            <div className="flex items-center justify-between gap-2 bg-success px-3 py-2 text-white">
              <span className="truncate font-display text-base uppercase">{head.title}</span>
              <span className="text-[10px] uppercase tracking-wider">{head.result.format.replace('_', ' ')}{head.result.targetSec ? ` · ${fmtSec(head.result.targetSec)}` : ''}</span>
            </div>
            <p className="px-3 pt-2 text-[11px] text-muted">
              {g.length > 1 ? `${g.length} intentos comparables (mismo WOD, reps, cargas y duración).` : 'Primer registro de esta definición. Sin comparación aún.'}
            </p>
            <ul className="divide-y divide-line">
              {g.map((r) => (
                <li key={`${r.workoutId}-${r.blockId}`} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-3 py-2.5 text-sm">
                  <span className="text-muted">{shortDate(r.date)}</span>
                  <span className="text-[11px] text-muted">
                    {r.result.splits.length ? `${r.result.splits.length} splits · media ${fmtSec(r.meanSplit!)} · mejor ${fmtSec(r.bestSplit!)} · peor ${fmtSec(r.worstSplit!)}${r.drop !== undefined ? ` · caída ${r.drop > 0 ? '+' : ''}${r.drop}s` : ''}` : 'Sin splits por vuelta'}
                  </span>
                  <span className={`figure text-xl ${best === r ? 'text-success' : ''}`}>{r.score}</span>
                </li>
              ))}
            </ul>
          </article>
        );
      })}
      {legacy.length > 0 && (
        <div className="card p-3">
          <p className="label">Scores previos (sin definición guardada, no comparables)</p>
          <ul className="mt-2 space-y-1 text-sm">
            {legacy.map((h) => (
              <li key={h.workoutId} className="flex justify-between gap-2">
                <span className="truncate text-muted">{shortDate(h.date)} · {h.workoutName}</span>
                <span className="font-mono">{h.finisherScore?.rounds ? `${h.finisherScore.rounds} rondas` : h.finisherScore?.time}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
