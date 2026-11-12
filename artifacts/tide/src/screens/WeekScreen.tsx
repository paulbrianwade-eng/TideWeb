import { useMemo, useState } from 'react';
import { AlertTriangle, ArrowLeftRight, Ban, LayoutGrid, List, RotateCcw, X } from 'lucide-react';
import { useApp } from '../state/AppContext';
import type { Workout } from '../types';
import { phaseForWeek, STATION_LABEL, TOTAL_WEEKS } from '../data/program';
import { shortDate, weekdayShort } from '../lib/date';
import {
  canMove, dayState, hardAdjacency, phaseIndex, phaseSettingsOf, STATE_LABEL, tagOf, TAG_LABEL, TAG_STYLE, v8,
} from '../components/v8';
import type { DayState } from '../components/v8';
import { FOUR_WEEK_PLAN_ID } from '../data/mesocycle';

const STATE_CHIP: Record<DayState, string> = {
  done: 'bg-lime-soft text-success', skipped: 'bg-mist text-muted line-through', rest: 'bg-mist text-muted',
  started: 'bg-sky text-brand', missed: 'bg-warn/15 text-warn', today: 'bg-brand text-white', planned: 'bg-surface2 text-muted',
};

/** Semana: lista o cuadrícula, intercambio explícito con aprobación y estados de omitido/descanso. */
export const WeekScreen = ({ onOpen }: { onOpen: (workoutId: string) => void }) => {
  const app = useApp();
  const api = v8(app);
  const today = app.workoutFor(app.today);
  const [week, setWeek] = useState(today?.week ?? 1);
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [moving, setMoving] = useState<string | null>(null);
  const [pending, setPending] = useState<{ a: Workout; b: Workout } | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const days = useMemo(() => app.program.filter((w) => w.week === week).sort((a, b) => a.date.localeCompare(b.date)), [app.program, week]);
  const isFourWeekCycle = app.state.activePlan === FOUR_WEEK_PLAN_ID;
  const phase = phaseForWeek(week);
  const ps = phaseSettingsOf(app.state);
  const deload = ps.deloadWeeks.includes(week);
  const phaseIdx = phaseIndex(week, app.state.activePlan);
  const cycleWeek = ((week - 1) % 4) + 1;
  const cycleNumber = Math.floor((week - 1) / 4) + 1;
  const currentAdj = hardAdjacency(days);

  const preview = useMemo(() => {
    if (!pending) return null;
    const swapped = days.map((w) =>
      w.id === pending.a.id ? { ...w, date: pending.b.date } : w.id === pending.b.id ? { ...w, date: pending.a.date } : w);
    return hardAdjacency(swapped);
  }, [pending, days]);

  const pick = (w: Workout) => {
    setNotice(null);
    if (!moving) { setMoving(w.id); return; }
    if (moving === w.id) { setMoving(null); return; }
    const a = days.find((d) => d.id === moving);
    if (a) setPending({ a, b: w });
    setMoving(null);
  };

  const approve = () => {
    if (!pending) return;
    const ok = api.swapWorkouts ? api.swapWorkouts(pending.a.id, pending.b.id) : false;
    setNotice(ok ? `Intercambio aplicado: ${pending.a.name} ↔ ${pending.b.name}.` : 'No se pudo intercambiar: una de las sesiones ya está iniciada o completada.');
    setPending(null);
  };

  const toggleSkip = (w: Workout, skip: boolean) => api.setSkipped?.(w.id, skip);

  return (
    <div className="blue-screen space-y-4 animate-fade-in">
      <header className="space-y-3">
        <div>
          <p className="label">Fase {phaseIdx + 1} · {ps.names[phaseIdx]}{deload ? ' · Descarga' : ''}</p>
          <h1 className="text-[2.25rem] text-brand-dark">
            {isFourWeekCycle ? `Ciclo ${cycleNumber} · Semana ${cycleWeek}` : `Semana ${week}`}
          </h1>
          <p className="mt-1 max-w-lg text-sm text-muted">
            {isFourWeekCycle ? 'Rotación de cuatro semanas: Base, Carga, Pico y Reset + Benchmark.' : phase.focus}
          </p>
        </div>
        <div className="-mx-5 flex gap-1.5 overflow-x-auto px-5 pb-1" aria-label="Elegir semana">
          {Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1).map((n) => (
            <button key={n} type="button" onClick={() => { setWeek(n); setMoving(null); setPending(null); }}
              aria-current={n === week ? 'true' : undefined} data-testid={`button-week-${n}`}
              className={`h-11 min-w-11 shrink-0 rounded-full px-2 text-xs font-semibold transition-colors ${
                n === week ? 'bg-brand text-white' : ps.deloadWeeks.includes(n) ? 'border border-dashed border-line bg-surface text-muted' : 'border border-line bg-surface text-muted'}`}>
              {n}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex rounded-xl border border-line bg-surface p-1" role="group" aria-label="Vista">
            {(['list', 'grid'] as const).map((v) => {
              const Icon = v === 'list' ? List : LayoutGrid;
              return (
                <button key={v} type="button" onClick={() => setView(v)} aria-pressed={view === v} data-testid={`button-view-${v}`}
                  className={`flex h-10 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold uppercase tracking-wider ${view === v ? 'bg-brand-dark text-white' : 'text-muted'}`}>
                  <Icon className="h-4 w-4" aria-hidden="true" /> {v === 'list' ? 'Lista' : 'Grilla'}
                </button>
              );
            })}
          </div>
          {moving && (
            <button type="button" className="btn-quiet min-h-11" onClick={() => setMoving(null)} data-testid="button-cancel-move">
              <X className="h-4 w-4" aria-hidden="true" /> Cancelar
            </button>
          )}
        </div>
      </header>

      {moving && (
        <p className="rounded-xl border border-brand/30 bg-sky px-4 py-3 text-sm text-brand-dark" role="status">
          Elegí el día con el que querés intercambiar <strong>{days.find((d) => d.id === moving)?.name}</strong>.
        </p>
      )}
      {notice && <p className="rounded-xl border border-line bg-surface px-4 py-3 text-sm" role="status" data-testid="text-notice">{notice}</p>}
      {!pending && currentAdj.length > 0 && (
        <p className="flex gap-2 rounded-xl border border-warn/40 bg-warn/10 px-4 py-3 text-sm text-ink">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warn" aria-hidden="true" />
          Sesiones duras consecutivas: {currentAdj.map(([a, b]) => `${weekdayShort(a.date)} ${a.name} → ${weekdayShort(b.date)} ${b.name}`).join(' · ')}
        </p>
      )}

      {pending && preview && (
        <section className="card space-y-3 border-brand p-4" data-testid="panel-swap-review">
          <p className="label text-brand">Revisar intercambio</p>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-sm">
            <span><strong>{pending.a.name}</strong><br /><span className="text-muted">{weekdayShort(pending.a.date)} {shortDate(pending.a.date)} → {weekdayShort(pending.b.date)} {shortDate(pending.b.date)}</span></span>
            <ArrowLeftRight className="h-4 w-4 text-brand" aria-hidden="true" />
            <span><strong>{pending.b.name}</strong><br /><span className="text-muted">{weekdayShort(pending.b.date)} {shortDate(pending.b.date)} → {weekdayShort(pending.a.date)} {shortDate(pending.a.date)}</span></span>
          </div>
          {preview.length > 0 ? (
            <p className="flex gap-2 rounded-xl bg-warn/10 px-3 py-2 text-sm" data-testid="text-adjacency-warning">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warn" aria-hidden="true" />
              Quedarían sesiones duras juntas: {preview.map(([a, b]) => `${a.name} → ${b.name}`).join(' · ')}. Podés aprobar igual.
            </p>
          ) : (
            <p className="text-sm text-success">Sin sesiones duras en días consecutivos.</p>
          )}
          <div className="flex gap-2">
            <button type="button" className="btn-primary flex-1 py-3" onClick={approve} disabled={!api.swapWorkouts} data-testid="button-approve-swap">Aprobar intercambio</button>
            <button type="button" className="btn-ghost" onClick={() => setPending(null)} data-testid="button-cancel-swap">Cancelar</button>
          </div>
        </section>
      )}

      <ul className={view === 'grid' ? 'grid grid-cols-2 gap-2 sm:grid-cols-4' : 'space-y-2.5'}>
        {days.map((w) => {
          const st = dayState(w, app.state, app.today);
          const tag = tagOf(w);
          const movable = canMove(w, app.state) && tag !== 'REST';
          const isSource = moving === w.id;
          const target = !!moving && !isSource;
          return (
            <li key={w.id} data-testid={`card-day-${w.id}`}
              className={`card overflow-hidden transition-colors ${isSource ? 'border-brand ring-2 ring-brand/30' : target && movable ? 'border-brand/50' : ''} ${w.date === app.today ? 'border-brand' : ''}`}>
              <button type="button" onClick={() => (target ? movable && pick(w) : onOpen(w.id))} disabled={target && !movable}
                className="flex w-full gap-3 p-3 text-left disabled:opacity-40" data-testid={`button-open-${w.id}`}>
                <span className="flex w-11 shrink-0 flex-col items-center rounded-xl bg-surface2 py-1.5">
                  <span className="text-[10px] font-semibold text-muted">{weekdayShort(w.date)}</span>
                  <span className="figure text-lg">{shortDate(w.date).slice(0, 2)}</span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-1.5">
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wider ${TAG_STYLE[tag]}`}>{tag} · {TAG_LABEL[tag]}</span>
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${STATE_CHIP[st]}`}>{STATE_LABEL[st]}</span>
                  </span>
                  <span className={`mt-1 block font-display text-lg uppercase leading-tight ${st === 'skipped' ? 'text-muted line-through' : 'text-brand-dark'}`}>{w.name}</span>
                  {view === 'list' && <span className="block truncate text-xs text-muted">{w.objective}</span>}
                  <span className="label mt-1 block">{w.duration}{view === 'list' ? ` · RPE ${w.plannedRpe} · ${STATION_LABEL[w.station]}` : ''}</span>
                </span>
              </button>
              {!moving && tag !== 'REST' && st !== 'done' && (
                <div className="flex border-t border-line">
                  <button type="button" onClick={() => pick(w)} disabled={!movable || !api.swapWorkouts}
                    className="flex min-h-11 flex-1 items-center justify-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-brand disabled:text-muted/50" data-testid={`button-move-${w.id}`}>
                    <ArrowLeftRight className="h-3.5 w-3.5" aria-hidden="true" /> Mover
                  </button>
                  <button type="button" onClick={() => toggleSkip(w, st !== 'skipped')} disabled={!api.setSkipped || st === 'started'}
                    className="flex min-h-11 flex-1 items-center justify-center gap-1.5 border-l border-line text-[11px] font-semibold uppercase tracking-wider text-muted disabled:opacity-40" data-testid={`button-skip-${w.id}`}>
                    {st === 'skipped' ? <><RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Reactivar</> : <><Ban className="h-3.5 w-3.5" aria-hidden="true" /> Omitir</>}
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <p className="text-[11px] text-muted">Sesiones completadas o iniciadas no se mueven. Los cambios solo se aplican al aprobarlos.</p>
    </div>
  );
};
