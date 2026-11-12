import { Brain, CheckCircle2 } from 'lucide-react';
import type { Workout } from '../types';
import { analyzeSession, explainSession, sportPriorities } from '../lib/intelligence';
import { PATTERN_LABEL } from '../data/patterns';
import type { MovementPattern } from '../data/patterns';
import { SPORT_PROFILE } from '../data/patterns';
import { sessionImpact } from '../data/impact';

/**
 * COACH MODE
 * Explica por qué la selección de hoy tiene sentido, muestra el balance de
 * patrones y reporta cualquier problema de programación que el validador
 * haya detectado.
 */
export const CoachMode = ({ workout }: { workout: Workout }) => {
  const analysis = analyzeSession(workout);
  const explanation = explainSession(workout);
  const impact = sessionImpact(workout);
  const usesAthleticBalance = workout.blocks.some((block) => block.kind === 'fuerza' || block.kind === 'atleta');
  const patterns = (Object.entries(analysis.counts) as [MovementPattern, number][])
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1]);
  const maxCount = patterns[0]?.[1] ?? 1;

  return (
    <section className="card overflow-hidden">
      <div className="flex items-center gap-2 bg-brand px-4 py-3 text-white">
        <Brain className="h-4 w-4" aria-hidden="true" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em]">Por qué esta sesión</span>
      </div>

      <div className="space-y-4 p-4">
        <p className="text-sm leading-relaxed text-ink">{explanation}</p>

        {/* Balance de patrones */}
        <div>
          <p className="label">Movement pattern analysis</p>
          <ul className="mt-2 space-y-1.5">
            {patterns.map(([p, n]) => (
              <li key={p} className="flex items-center gap-2">
                <span className="w-32 shrink-0 text-xs text-muted">{PATTERN_LABEL[p]}</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-canvas">
                  <span
                    className="block h-full rounded-full bg-lime"
                    style={{ width: `${(n / maxCount) * 100}%` }}
                  />
                </span>
                <span className="w-4 shrink-0 text-right font-mono text-xs text-ink">{n}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Prioridades del deporte */}
        {workout.transfersTo.length > 0 && (
          <div>
            <p className="label">Prioridades de {SPORT_PROFILE[workout.transfersTo[0]].label.toLowerCase()}</p>
            <p className="mt-1.5 flex flex-wrap gap-1.5">
              {sportPriorities(workout.transfersTo[0]).map((pri) => (
                <span key={pri} className="chip-lime">
                  {pri}
                </span>
              ))}
            </p>
          </div>
        )}

        {/* Impacto */}
        <div>
          <p className="label">Impacto de la sesión</p>
          <div className="mt-2 flex items-center gap-3">
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-canvas">
              <span
                className={`block h-full rounded-full ${impact >= 20 ? 'bg-warn' : 'bg-brand'}`}
                style={{ width: `${Math.min(100, (impact / 30) * 100)}%` }}
              />
            </span>
            <span className="font-mono text-xs text-ink">{impact}</span>
          </div>
          <p className="mt-1 text-xs text-muted">
            {impact >= 20
              ? 'Alto. Si las piernas están cargadas, bajá impacto o volumen; la bici es una estación opcional.'
              : impact >= 10
                ? 'Moderado. Los pies tocan el suelo lo justo.'
                : 'Bajo. Sin castigo articular.'}
          </p>
        </div>

        {/* Validación */}
        <div className="rounded-xl border border-line p-3">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <CheckCircle2 className="h-4 w-4 text-brand" aria-hidden="true" />
            Sesión validada
          </p>
          {analysis.valid && !analysis.issues.length && (
            <p className="mt-1 text-xs text-muted">
              {usesAthleticBalance
                ? `Sin patrones duplicados · empuje y tracción revisados · ${analysis.unilateral} unilaterales · rotación y componente atlético revisados.`
                : 'Día de motor o recuperación: las reglas de balance de fuerza no aplican.'}
            </p>
          )}
          {analysis.issues.length > 0 && (
            <>
              <ul className="mt-2 space-y-2">
                {analysis.issues.map((i) => (
                  <li key={i.id} className="text-xs">
                    <p className="text-warn">{i.message}</p>
                    {i.fix && (
                      <p className="mt-0.5 text-muted">
                        Alternativa posible: {i.fix.to} · {i.fix.why}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[11px] text-muted">
                El análisis informa, no modifica. La sesión programada se mantiene tal cual.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
