import { Play, RotateCcw } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { ACTIVITY_LABEL, BLOCK_LABEL, STATION_LABEL } from '../data/program';
import { longDate } from '../lib/date';
import { sessionProgress } from '../lib/prescription';
import { EmptyState } from '../components/ui';
import { Logo } from '../components/ui';
import { Flag } from 'lucide-react';
import { WeekStrip } from '../components/WeekStrip';
import { CoachWeekly } from '../components/CoachWeekly';
import { BLOCK_META } from '../components/blockMeta';
import { addDays, startOfWeek } from '../lib/date';
import { daysUntil, hybridRows, mean7, phaseIndex, phaseSettingsOf } from '../components/v8';
import { CollapsibleBlock } from '../components/workout-parts2';
import { TransitionCard } from '../components/TransitionCard';
import { EquipmentList } from '../components/EquipmentList';
import { ModuleBadge } from '../components/ModuleBadge';
import { CoachMode } from '../components/CoachMode';

export const TodayScreen = ({
  onStart,
  onProfile,
  onWeek,
}: {
  onStart: (workoutId: string, blockIndex?: number) => void;
  onProfile: () => void;
  onWeek?: () => void;
}) => {
  const app = useApp();
  const { today } = app;
  const scheduled = app.workoutFor(today);
  const pending = app.nextPending();

  /**
   * Si la sesión de hoy ya está registrada, la pantalla muestra la siguiente
   * pendiente en vez de repetir lo que ya entrenaste.
   */
  const alreadyDone = scheduled ? app.isDone(scheduled.id) : false;
  const workout = alreadyDone && pending ? pending : scheduled ?? pending;
  const showingNext = !!workout && !!scheduled && workout.id !== scheduled.id;
  const session = workout ? app.sessionFor(workout.id) : undefined;
  const summary = workout ? app.summaryFor(workout.id) : undefined;

  if (!workout) {
    return (
      <div className="px-5 pt-8">
        <EmptyState title="Sin sesión programada" hint="Abrí la semana para elegir una actividad." />
      </div>
    );
  }

  const progress = sessionProgress(workout, session);
  const raceDate = app.state.profile.raceDate;
  const countdown = raceDate ? daysUntil(today, raceDate) : null;
  const ps = phaseSettingsOf(app.state);
  const phaseNames = ps.names;
  const phaseIdx = phaseIndex(workout.week, app.state.activePlan);
  const isFourWeekCycle = app.state.activePlan === 'home-mesocycle-4week';
  const cycleWeek = isFourWeekCycle ? ((workout.week - 1) % 4) + 1 : workout.week;
  const cycleNumber = isFourWeekCycle ? Math.floor((workout.week - 1) / 4) + 1 : 0;
  const isDeloadWeek = ps.deloadWeeks.includes(workout.week);
  const weekWeight = mean7(app.state.metrics.weight ?? [], today);
  const lastHybrid = hybridRows(app.state.sessions)[0];
  const lastScore = app.state.history.find((h) => h.finisherScore?.rounds || h.finisherScore?.time);
  const ws = startOfWeek(today);
  const weekWorkouts = app.program.filter((w) => w.date >= ws && w.date < addDays(ws, 7) && w.date <= today && !w.externalActivity);
  const due = weekWorkouts.length;
  const doneWeek = weekWorkouts.filter((w) => app.isDone(w.id)).length;
  const started = !!session && !session.completedAt;

  return (
    <div className="today-screen animate-fade-in">
      {/* HERO — azul profundo: carrera, fase, semana, calendario */}
      <section className="hero-deep px-5 pb-6 pt-[calc(env(safe-area-inset-top)+1rem)] text-white">
        <div className="flex items-center justify-between">
          <button type="button" onClick={onProfile} className="tap -ml-1 flex items-center px-1 text-left" data-testid="link-profile">
            <Logo compact light />
          </button>
          <span className="label text-white/60">{longDate(today)}</span>
        </div>

        <div className="mt-5 grid grid-cols-[1fr_auto] items-end gap-4 animate-rise-in">
          <div>
            <p className="label text-white/60">HYROX · {raceDate ? longDate(raceDate) : 'fecha sin definir'}</p>
            {countdown !== null && countdown >= 0 ? (
              <p className="mt-1 flex items-baseline gap-2" data-testid="text-countdown">
                <span className="figure text-[4.25rem] text-white">{countdown}</span>
                <span className="font-display text-xl uppercase text-lime">{countdown === 1 ? 'día' : 'días'}</span>
              </p>
            ) : countdown !== null ? (
              <p className="mt-2 font-display text-2xl uppercase text-lime" data-testid="text-countdown">Carrera realizada</p>
            ) : (
              <button type="button" onClick={onProfile} className="btn-lime mt-3 py-3" data-testid="button-set-race">
                <Flag className="h-4 w-4" aria-hidden="true" /> Definir fecha de carrera
              </button>
            )}
          </div>
          <div className="text-right">
            <p className="label text-white/60">Fase {phaseIdx + 1}/4</p>
            <p className="font-display text-xl uppercase leading-tight" data-testid="text-phase">{phaseNames[phaseIdx]}</p>
            <p className="label mt-1 text-white/80">
              {isFourWeekCycle ? `Ciclo ${cycleNumber} · Semana ${cycleWeek}` : `Semana ${workout.week}`}{isDeloadWeek ? ' · descarga' : ''}
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl bg-white/95 p-2">
          <WeekStrip anchor={today} onPick={(id) => onStart(id)} />
        </div>
      </section>

      {/* Indicadores reales */}
      <section className="grid grid-cols-3 gap-2 px-5 pt-4" aria-label="Indicadores">
        <div className="card p-3" data-testid="stat-weekly-weight">
          <p className="label">Peso 7 d</p>
          {weekWeight ? (
            <p className="figure mt-1 text-2xl">{weekWeight.value}<span className="ml-0.5 text-sm text-muted">kg</span></p>
          ) : (
            <p className="mt-1 text-xs text-muted">Sin registros esta semana</p>
          )}
          {weekWeight && <p className="text-[10px] text-muted">{weekWeight.n} {weekWeight.n === 1 ? 'pesaje' : 'pesajes'}</p>}
        </div>
        <div className="card p-3" data-testid="stat-benchmark">
          <p className="label">Benchmark</p>
          {lastHybrid ? (
            <>
              <p className="figure mt-1 text-2xl text-success">{lastHybrid.score}</p>
              <p className="truncate text-[10px] text-muted">{lastHybrid.title}</p>
            </>
          ) : lastScore ? (
            <>
              <p className="figure mt-1 text-2xl text-success">{lastScore.finisherScore?.rounds ?? lastScore.finisherScore?.time}</p>
              <p className="truncate text-[10px] text-muted">{lastScore.workoutName}</p>
            </>
          ) : (
            <p className="mt-1 text-xs text-muted">Sin híbrido registrado</p>
          )}
        </div>
        <div className="card p-3" data-testid="stat-compliance">
          <p className="label">Cumplimiento</p>
          {due > 0 ? (
            <p className="figure mt-1 text-2xl">{doneWeek}/{due}</p>
          ) : (
            <p className="mt-1 text-xs text-muted">Nada vencido aún</p>
          )}
          <p className="text-[10px] text-muted">esta semana</p>
        </div>
      </section>

      {/* Entrenamiento de hoy */}
      <section className="px-5 pt-4">
        <div className="card overflow-hidden">
          <div className="p-4">
            <p className="label">
              {showingNext ? 'Siguiente pendiente' : 'Entrenamiento de hoy'} · {isFourWeekCycle ? `Ciclo ${cycleNumber} · Semana ${cycleWeek}` : `Semana ${workout.week}`} · Día {workout.day}
            </p>
            <h1 className="mt-1 text-[2.25rem] text-brand-dark">{workout.name}</h1>
            <p className="font-display text-lg uppercase text-brand">{workout.subtitle}</p>
            <p className="label mt-2 flex flex-wrap gap-x-2 gap-y-1">
              <span>{workout.duration}</span><span aria-hidden="true">·</span>
              <span>RPE {workout.plannedRpe}</span><span aria-hidden="true">·</span>
              <span>{STATION_LABEL[workout.station]}</span>
            </p>
            <ol className="mt-3 space-y-1.5">
              {workout.blocks.filter((b) => b.kind !== 'transicion').slice(0, 3).map((b, i) => (
                <li key={b.id} className="flex items-center gap-3 rounded-xl bg-surface2 px-3 py-2">
                  <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-bold ${BLOCK_META[b.kind].head} ${BLOCK_META[b.kind].text}`}>{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{b.title}</span>
                    <span className="text-[11px] text-muted">{BLOCK_META[b.kind].label} · {b.duration}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <div className="space-y-5 px-5 pt-5">
        {today < app.program[0]!.date && (
          <p className="rounded-xl border border-brand/30 bg-sky px-4 py-3 text-sm text-brand-dark">
            Tu nuevo ciclo comienza el {longDate(app.program[0]!.date)}. Tu historial anterior se conserva en Progreso.
          </p>
        )}
        {showingNext && scheduled && (
          <p className="rounded-xl border border-brand/30 bg-sky px-4 py-3 text-sm text-brand-dark">
            Ya registraste <strong>{scheduled.name}</strong>. Seguimos con la próxima sesión del plan.
          </p>
        )}
        <button type="button" onClick={() => onStart(workout.id)} className="btn-primary w-full py-5 text-base" data-testid="button-start">
          {summary ? (
            <>
              <RotateCcw className="h-5 w-5" aria-hidden="true" /> Repasar la sesión
            </>
          ) : started ? (
            <>
              <Play className="h-5 w-5" aria-hidden="true" /> Retomar · {Math.round(progress * 100)} %
            </>
          ) : (
            <>
              <Play className="h-5 w-5" aria-hidden="true" /> Comenzar
            </>
          )}
        </button>

        {started && !summary && (
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${progress * 100}%` }} />
          </div>
        )}

        {summary && (
          <p className="flex items-center justify-between rounded-xl border border-brand/30 bg-lime-soft px-4 py-3 text-sm">
            <span className="label text-brand-dark">Completado</span>
            <span className="text-muted">
              {summary.durationMin} min · RPE {summary.rpe}
              {summary.finisherScore?.rounds ? ` · ${summary.finisherScore.rounds} rondas` : ''}
              {summary.finisherScore?.time ? ` · ${summary.finisherScore.time}` : ''}
            </span>
          </p>
        )}

        {/* Objetivo y coach note */}
        <section>
          <p className="label">Objetivo</p>
          <p className="mt-1.5 text-sm leading-relaxed text-white">{workout.objective}</p>
        </section>

        <section className="rounded-2xl border-l-4 border-brand bg-lime-soft px-4 py-3">
          <p className="label text-brand-dark">Coach note</p>
          <p className="mt-1 text-sm leading-relaxed text-ink">{workout.coachNote}</p>
        </section>

        <CoachWeekly onReview={(t) => (t === 'profile' ? onProfile() : onWeek ? onWeek() : onProfile())} />

        <CoachMode workout={workout} />

        {/* Transferencia deportiva */}
        {workout.transfersTo.length > 0 && (
          <section>
            <p className="label">Transfiere a</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {workout.transfersTo.map((m) => (
                <ModuleBadge key={m} module={m} size="sm" />
              ))}
            </div>
          </section>
        )}

        {/* HOY NECESITÁS */}
        <EquipmentList workoutId={workout.id} items={workout.equipment} />

        {/* Vista previa de bloques */}
        <section className="space-y-3">
          <div className="section-head">
            <h2 className="text-lg text-white">La sesión</h2>
            <span className="label">
              {workout.blocks.filter((b) => b.kind !== 'transicion').length} bloques
              {workout.blocks.some((b) => b.kind === 'transicion')
                ? ` · ${workout.blocks.filter((b) => b.kind === 'transicion').length} vueltas`
                : ''} · {workout.duration}
            </span>
          </div>
          {workout.blocks.map((b, i) =>
            b.kind === 'transicion' ? (
              <TransitionCard key={b.id} block={b} compact />
            ) : (
              <CollapsibleBlock key={b.id} block={b} onOpenExercise={() => onStart(workout.id, i)} />
            ),
          )}
        </section>

        <section className="pb-4">
          <div className="section-head">
            <h2 className="text-lg text-white">Mañana</h2>
          </div>
          <p className="figure text-3xl text-white">
            {workout.nextDayActivity ? ACTIVITY_LABEL[workout.nextDayActivity] : '—'}
          </p>
        </section>
      </div>
    </div>
  );
};

export { BLOCK_LABEL };
