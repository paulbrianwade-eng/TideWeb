import { useState } from 'react';
import { Flag } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { TOTAL_WEEKS } from '../data/program';
import { longDate } from '../lib/date';
import { daysUntil, phaseSettingsOf, v8 } from './v8';

export const RaceDateCard = () => {
  const app = useApp();
  const saved = app.state.profile.raceDate ?? '';
  const [draft, setDraft] = useState(saved);
  const left = saved ? daysUntil(app.today, saved) : null;
  return (
    <section className="card space-y-3 p-5" data-testid="card-race-date">
      <div className="section-head">
        <div>
          <p className="label">Objetivo</p>
          <h2 className="text-xl">Carrera HYROX</h2>
        </div>
        <Flag className="h-5 w-5 text-success" aria-hidden="true" />
      </div>
      <p className="text-sm text-muted" data-testid="text-race-status">
        {saved ? `${longDate(saved)} · ${left !== null && left >= 0 ? `faltan ${left} días` : 'fecha pasada'}` : 'Sin fecha definida. La cuenta regresiva aparece cuando la guardes.'}
      </p>
      <div className="flex gap-2">
        <label className="flex-1">
          <span className="sr-only">Fecha de carrera</span>
          <input type="date" value={draft} onChange={(e) => setDraft(e.target.value)} className="field min-h-11" data-testid="input-race-date" />
        </label>
        <button type="button" className="btn-primary px-4 py-3" disabled={draft === saved} onClick={() => app.setProfile({ raceDate: draft || undefined })} data-testid="button-save-race">
          Guardar
        </button>
      </div>
      {saved && (
        <button type="button" className="btn-quiet min-h-11" onClick={() => { setDraft(''); app.setProfile({ raceDate: undefined }); }} data-testid="button-clear-race">
          Quitar fecha
        </button>
      )}
    </section>
  );
};

export const PhaseEditor = () => {
  const app = useApp();
  const api = v8(app);
  const current = phaseSettingsOf(app.state);
  const [names, setNames] = useState<string[]>(current.names);
  const [deloads, setDeloads] = useState<number[]>(current.deloadWeeks);
  const [review, setReview] = useState(false);
  const [done, setDone] = useState(false);
  const changed = JSON.stringify(names) !== JSON.stringify(current.names) || JSON.stringify([...deloads].sort((a, b) => a - b)) !== JSON.stringify([...current.deloadWeeks].sort((a, b) => a - b));
  const perPhase = Math.ceil(TOTAL_WEEKS / 4);
  const added = deloads.filter((w) => !current.deloadWeeks.includes(w));
  const removed = current.deloadWeeks.filter((w) => !deloads.includes(w));

  return (
    <section className="card space-y-4 p-5" data-testid="card-phase-editor">
      <div className="section-head">
        <div>
          <p className="label">Plan</p>
          <h2 className="text-xl">Fases y descargas</h2>
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {names.map((n, i) => (
          <label key={i} className="block">
            <span className="label">Fase {i + 1} · semanas {i * perPhase + 1}–{Math.min(TOTAL_WEEKS, (i + 1) * perPhase)}</span>
            <input value={n} onChange={(e) => { setNames(names.map((x, j) => (j === i ? e.target.value.toUpperCase() : x))); setDone(false); }}
              className="field mt-1 min-h-11" data-testid={`input-phase-${i}`} />
          </label>
        ))}
      </div>
      <div>
        <p className="label">Semanas de descarga</p>
        <div className="mt-2 grid grid-cols-8 gap-1.5">
          {Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1).map((w) => {
            const on = deloads.includes(w);
            return (
              <button key={w} type="button" aria-pressed={on} onClick={() => { setDeloads(on ? deloads.filter((x) => x !== w) : [...deloads, w]); setDone(false); }}
                className={`h-11 rounded-lg text-xs font-semibold ${on ? 'bg-brand-dark text-white' : 'border border-line bg-surface text-muted'}`} data-testid={`button-deload-${w}`}>
                {w}
              </button>
            );
          })}
        </div>
      </div>
      {review && changed ? (
        <div className="space-y-2 rounded-xl border border-brand/30 bg-sky p-3 text-sm" data-testid="panel-phase-review">
          <p className="font-semibold text-brand-dark">Revisar antes de aplicar</p>
          <ul className="list-inside list-disc text-ink">
            {names.map((n, i) => n !== current.names[i] && <li key={i}>Fase {i + 1}: {current.names[i]} → {n || '(vacío)'}</li>)}
            {added.length > 0 && <li>Nuevas descargas: semana {added.sort((a, b) => a - b).join(', ')}</li>}
            {removed.length > 0 && <li>Sin descarga: semana {removed.sort((a, b) => a - b).join(', ')}</li>}
          </ul>
          <p className="text-xs text-muted">Se aplica solo a sesiones futuras no iniciadas. Lo completado no cambia.</p>
          <div className="flex gap-2">
            <button type="button" className="btn-primary flex-1 py-3" disabled={!api.setPhaseSettings || names.some((n) => !n.trim())}
              onClick={() => { api.setPhaseSettings?.({ names: names.map((n) => n.trim()), deloadWeeks: [...deloads].sort((a, b) => a - b) }); setReview(false); setDone(true); }}
              data-testid="button-approve-phases">Aprobar cambios</button>
            <button type="button" className="btn-ghost" onClick={() => setReview(false)}>Volver</button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <button type="button" className="btn-ghost flex-1" disabled={!changed} onClick={() => setReview(true)} data-testid="button-review-phases">Revisar cambios</button>
          {changed && <button type="button" className="btn-quiet min-h-11" onClick={() => { setNames(current.names); setDeloads(current.deloadWeeks); }}>Descartar</button>}
        </div>
      )}
      {done && !changed && <p className="text-sm text-success" role="status">Cambios aplicados al plan futuro.</p>}
    </section>
  );
};
