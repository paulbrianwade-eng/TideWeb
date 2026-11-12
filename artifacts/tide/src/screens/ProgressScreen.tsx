import { useState } from 'react';
import { Camera, Minus, TrendingDown, TrendingUp } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { METRICS, METRIC_GROUPS } from '../data/defaults';
import type { MetricEntry, MetricStatus, ProgressMetric } from '../types';
import { addDays, shortDate, startOfWeek } from '../lib/date';
import { Card, SectionTitle, StatusBadge } from '../components/ui';
import { BodyStats, HybridPanel, RunningPanel, StrengthPanel } from '../components/ProgressPanels';
import { SessionExport } from '../components/SessionExport';

const TABS = ['Body', 'Strength', 'Running', 'Hybrid', 'Métricas', 'Historial'] as const;
type Tab = (typeof TABS)[number];

const statusOf = (metric: ProgressMetric, entries: MetricEntry[]): MetricStatus => {
  if (entries.length === 0) return 'nodata';
  if (entries.length === 1) return 'stable';
  const last = entries[entries.length - 1].value;
  const prev = entries[entries.length - 2].value;
  const delta = last - prev;
  if (Math.abs(delta) < 0.01) return 'stable';
  const better = metric.lowerIsBetter ? delta < 0 : delta > 0;
  return better ? 'improving' : 'attention';
};

const STATUS_META: Record<MetricStatus, { label: string; tone: 'muted' | 'success' | 'warn' | 'accent' }> = {
  nodata: { label: 'Sin datos', tone: 'muted' },
  improving: { label: 'Mejorando', tone: 'success' },
  stable: { label: 'Estable', tone: 'accent' },
  attention: { label: 'Requiere atención', tone: 'warn' },
};

const Sparkline = ({ entries, lowerIsBetter }: { entries: MetricEntry[]; lowerIsBetter?: boolean }) => {
  if (entries.length < 2) return null;
  const values = entries.map((e) => e.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  return (
    <div className="mt-3 flex h-10 items-end gap-1" aria-hidden="true">
      {entries.slice(-12).map((e, i) => {
        const h = 12 + ((e.value - min) / span) * 28;
        const good = lowerIsBetter ? e.value <= values[0] : e.value >= values[0];
        return (
          <span
            key={`${e.date}-${i}`}
            className={`w-full rounded-sm ${good ? 'bg-brand/70' : 'bg-line'}`}
            style={{ height: `${h}px` }}
          />
        );
      })}
    </div>
  );
};

const MetricCard = ({ metric }: { metric: ProgressMetric }) => {
  const app = useApp();
  const entries = app.state.metrics[metric.id] ?? [];
  const last = entries[entries.length - 1];
  const first = entries[0];
  const status = statusOf(metric, entries);
  const [draft, setDraft] = useState('');

  const delta = last && first ? last.value - first.value : 0;
  const Trend = delta === 0 ? Minus : delta > 0 ? TrendingUp : TrendingDown;

  const submit = () => {
    const value = Number(draft.replace(',', '.'));
    if (!Number.isFinite(value)) return;
    app.setMetric(metric.id, { date: app.today, value });
    setDraft('');
  };

  return (
    <Card className="space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium">{metric.label}</p>
          <p className="font-mono text-[11px] text-muted">
            {metric.unit}
            {metric.target ? ` · objetivo ${metric.target}` : ''}
          </p>
        </div>
        <StatusBadge tone={STATUS_META[status].tone}>{STATUS_META[status].label}</StatusBadge>
      </div>

      <div className="flex items-baseline gap-3">
        <p className="font-display text-3xl leading-none">{last ? last.value : '—'}</p>
        {entries.length > 1 && (
          <p className="flex items-center gap-1 font-mono text-xs text-muted">
            <Trend className="h-3 w-3" aria-hidden="true" />
            {delta > 0 ? '+' : ''}
            {Math.round(delta * 100) / 100} desde {shortDate(first.date)}
          </p>
        )}
      </div>

      <Sparkline entries={entries} lowerIsBetter={metric.lowerIsBetter} />

      <div className="flex gap-2">
        <label className="flex-1">
          <span className="sr-only">{`Nuevo valor para ${metric.label}`}</span>
          <input
            inputMode="decimal"
            value={draft}
            placeholder={`Registrar ${metric.unit}`}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submit();
            }}
            className="field py-2 text-sm"
          />
        </label>
        <button type="button" onClick={submit} disabled={draft.trim() === ''} className="btn-ghost">
          Guardar
        </button>
      </div>
    </Card>
  );
};

export const ProgressScreen = () => {
  const app = useApp();
  const profile = app.state.profile;
  const weightEntries = app.state.metrics.weight ?? [];
  const [tab, setTab] = useState<Tab>('Body');
  const hasWeight = weightEntries.length > 0;
  const currentWeight = hasWeight ? weightEntries[weightEntries.length - 1].value : NaN;
  const baseline = hasWeight ? weightEntries[0].value : NaN;
  const toGo = Math.round((currentWeight - profile.targetWeight) * 10) / 10;
  const totalChange = weightEntries.length > 1 ? currentWeight - weightEntries[0].value : 0;

  const weekStart = startOfWeek(app.today);
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const planned = weekDates.filter((d) => app.workoutFor(d) && !app.workoutFor(d)?.externalActivity).length;
  const done = app.state.history.filter((h) => weekDates.includes(h.date)).length;

  return (
    <div className="blue-screen space-y-5">
      <header>
        <p className="eyebrow">Dashboard</p>
        <h1 className="font-display text-3xl leading-none text-brand-dark">Progreso</h1>
      </header>

      <div className="-mx-5 flex gap-1.5 overflow-x-auto px-5 pb-1" role="tablist" aria-label="Secciones de progreso">
        {TABS.map((t) => (
          <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)} data-testid={`tab-${t.toLowerCase()}`}
            className={`h-11 shrink-0 rounded-full px-4 text-xs font-semibold uppercase tracking-wider ${tab === t ? 'bg-brand text-white' : 'border border-line bg-surface text-muted'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'Strength' && <StrengthPanel />}
      {tab === 'Running' && <RunningPanel />}
      {tab === 'Hybrid' && <HybridPanel />}

      {tab === 'Body' && (<>
      <BodyStats />

      <Card className="space-y-4">
        <SectionTitle eyebrow="Composición corporal" title="Peso y objetivo" />
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="eyebrow">Actual</p>
            <p className="font-display text-2xl" data-testid="text-current-weight">{hasWeight ? `${currentWeight} kg` : '—'}</p>
          </div>
          <div>
            <p className="eyebrow">Objetivo</p>
            <p className="font-display text-2xl text-accent">{profile.targetWeight} kg</p>
          </div>
          <div>
            <p className="eyebrow">Cambio total</p>
            <p className="font-display text-2xl">
              {weightEntries.length > 1 ? `${totalChange > 0 ? '+' : ''}${Math.round(totalChange * 10) / 10} kg` : '—'}
            </p>
          </div>
        </div>
        <div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface2">
            <div
              className="h-full rounded-full bg-brand"
              style={{
                width: `${Math.max(
                  4,
                  Math.min(100, hasWeight ? ((baseline - currentWeight) / Math.max(1, baseline - profile.targetWeight)) * 100 : 0),
                )}%`,
              }}
            />
          </div>
          <p className="mt-1.5 font-mono text-[11px] text-muted">
            {!hasWeight ? 'Registrá tu peso en Métricas para calcular la distancia al objetivo (editable en Perfil).' : toGo > 0 ? `Faltan ${toGo} kg para el objetivo tentativo` : 'Objetivo alcanzado'}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {['Frente', 'Perfil', 'Espalda'].map((v) => (
            <div
              key={v}
              className="grid aspect-[3/4] place-items-center rounded-xl border border-dashed border-line text-center"
            >
              <div className="text-muted">
                <Camera className="mx-auto h-5 w-5" aria-hidden="true" />
                <p className="mt-1 text-[11px]">{v}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted">Las fotos de progreso son marcadores: subilas cuando la app tenga almacenamiento de imágenes.</p>
      </Card>

      <Card className="space-y-3">
        <SectionTitle eyebrow="Adherencia" title="Esta semana" />
        <div className="flex items-baseline gap-3">
          <p className="font-display text-3xl">
            {done}/{planned || 0}
          </p>
          <p className="text-sm text-muted">sesiones completadas</p>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {weekDates.map((d) => {
            const hasSession = app.state.history.some((h) => h.date === d);
            return (
              <span
                key={d}
                title={d}
                className={`h-8 rounded-md border ${
                  hasSession ? 'border-accent bg-brand/25' : 'border-line bg-surface2'
                }`}
              />
            );
          })}
        </div>
      </Card>

      </>)}

      {(tab === 'Métricas' || tab === 'Body') && METRIC_GROUPS.filter((g) => tab === 'Métricas' || g === 'Composición').map((group) => (
        <section key={group}>
          <SectionTitle eyebrow="Métricas" title={group} />
          <div className="grid gap-3 sm:grid-cols-2">
            {METRICS.filter((m) => m.group === group).map((m) => (
              <MetricCard key={m.id} metric={m} />
            ))}
          </div>
        </section>
      ))}

      {tab === 'Historial' && app.state.history.length === 0 && (
        <p className="rounded-xl border border-dashed border-line bg-surface px-4 py-5 text-center text-sm text-muted">Todavía no hay sesiones registradas.</p>
      )}
      {tab === 'Historial' && app.state.history.length > 0 && (
        <section>
          <SectionTitle eyebrow="Historial" title="Sesiones registradas" />
          <ul className="space-y-2">
            {app.state.history.map((h) => (
              <li key={h.workoutId} className="card min-w-0 space-y-3 overflow-hidden p-3">
                <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{h.workoutName}</p>
                  <p className="break-words font-mono text-[11px] text-muted">
                    {shortDate(h.date)} · {h.durationMin} min · RPE {h.rpe}
                    {h.calories ? ` · ${h.calories} kcal` : ''}
                    {h.avgHr ? ` · ${h.avgHr} ppm` : ''}
                    {h.pain ? ` · dolor ${h.pain}/10` : ''}
                    {h.dataSource ? ` · ${h.dataSource}` : ''}
                  </p>
                </div>
                {h.personalRecord && <StatusBadge tone="accent">PR</StatusBadge>}
                </div>
                <div className="min-w-0">
                  <SessionExport workoutId={h.workoutId} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};
