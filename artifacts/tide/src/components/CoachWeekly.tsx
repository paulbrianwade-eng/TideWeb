import { ClipboardList, Lightbulb } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { addDays, startOfWeek } from '../lib/date';
import { hardAdjacency, mean, phaseSettingsOf, round1 } from './v8';

interface Rec { id: string; evidence: string; suggestion: string; apply: 'week' | 'profile' | null }

/**
 * Rule-based weekly review. Reads only registered sessions; never mutates the
 * program. The athlete applies changes manually after reviewing.
 */
export const CoachWeekly = ({ onReview }: { onReview?: (target: 'week' | 'profile') => void }) => {
  const app = useApp();
  const since = addDays(app.today, -7);
  const recent = app.state.history.filter((h) => h.date > since && h.date <= app.today);
  const recs: Rec[] = [];

  if (recent.length === 0) {
    recs.push({ id: 'none', evidence: 'Sin sesiones registradas en los últimos 7 días.', suggestion: 'Registrá al menos una sesión para que el análisis tenga base. No se infiere nada sin datos.', apply: null });
  } else {
    const rpe = round1(mean(recent.map((h) => h.rpe)));
    const pains = recent.filter((h) => (h.pain ?? 0) >= 4);
    const destroyed = recent.filter((h) => h.feeling === 'destruido').length;
    if (rpe >= 8.3 || destroyed >= 2)
      recs.push({ id: 'load', evidence: `RPE medio ${rpe} en ${recent.length} sesiones${destroyed ? ` · ${destroyed} marcadas «destruido»` : ''}.`, suggestion: 'Considerar adelantar una semana de descarga o bajar volumen del Hybrid la semana próxima.', apply: 'profile' });
    else
      recs.push({ id: 'ok', evidence: `RPE medio ${rpe} en ${recent.length} sesiones.`, suggestion: 'Carga tolerable: progresar primero calidad, pacing o score antes que kilos. Un factor por vez.', apply: null });
    if (pains.length)
      recs.push({ id: 'pain', evidence: `Dolor ≥4/10 registrado${pains.map((p) => (p.painArea ? ` · ${p.painArea}` : '')).join('')}.`, suggestion: 'Revisar los ejercicios implicados y separar sesiones duras la próxima semana.', apply: 'week' });
  }

  const nextStart = addDays(startOfWeek(app.today), 7);
  const nextWeek = app.program.filter((w) => w.date >= nextStart && w.date < addDays(nextStart, 7));
  const adj = hardAdjacency(nextWeek);
  if (adj.length)
    recs.push({ id: 'adj', evidence: `Próxima semana: ${adj.map(([a, b]) => `${a.name} → ${b.name}`).join(', ')} quedan en días consecutivos.`, suggestion: 'Si llegás cargado, intercambiar un día duro con Zone 2 o descanso.', apply: 'week' });
  const nextWeekNum = nextWeek[0]?.week;
  if (nextWeekNum && phaseSettingsOf(app.state).deloadWeeks.includes(nextWeekNum))
    recs.push({ id: 'deload', evidence: `La semana ${nextWeekNum} está configurada como descarga.`, suggestion: 'Mantenerla salvo que los registros indiquen lo contrario.', apply: null });
  const skipped = (app.state.skippedWorkouts ?? []).length;
  if (skipped >= 2)
    recs.push({ id: 'skip', evidence: `${skipped} sesiones marcadas como omitidas en el plan.`, suggestion: 'No recuperarlas apilándolas: seguir el plan y priorizar la sesión de fuerza siguiente.', apply: null });

  return (
    <section className="card overflow-hidden" data-testid="coach-weekly">
      <div className="flex items-center justify-between gap-2 bg-brand-dark px-4 py-3 text-white">
        <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em]">
          <ClipboardList className="h-4 w-4" aria-hidden="true" /> Coach · revisión semanal
        </span>
        <span className="text-[10px] uppercase tracking-wider text-white/60">Reglas, sin IA</span>
      </div>
      <ul className="divide-y divide-line">
        {recs.map((r) => (
          <li key={r.id} className="space-y-2 p-4" data-testid={`coach-rec-${r.id}`}>
            <p className="text-sm">
              <span className="mr-2 rounded bg-surface2 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted">Registrado</span>
              {r.evidence}
            </p>
            <p className="flex gap-2 text-sm text-ink">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
              <span>
                <span className="mr-2 rounded bg-sky px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand">Recomendación</span>
                {r.suggestion}
              </span>
            </p>
            {r.apply && onReview && (
              <button type="button" onClick={() => onReview(r.apply!)} className="btn-ghost" data-testid={`button-review-${r.id}`}>
                {r.apply === 'week' ? 'Revisar y reordenar en Semana' : 'Revisar fases y descarga en Perfil'}
              </button>
            )}
          </li>
        ))}
      </ul>
      <p className="border-t border-line px-4 py-2.5 text-[11px] text-muted">
        Nada se modifica automáticamente. Los cambios se aplican solo cuando los aprobás.
      </p>
    </section>
  );
};
