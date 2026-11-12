import type { SportModule, Workout, WorkoutBlock } from '../types';
import {
  HEAVY,
  PATTERN_LABEL,
  SAME_PATTERN_ALTERNATIVES,
  SPORT_PROFILE,
  patternsOf,
  primaryPattern,
} from '../data/patterns';
import type { MovementPattern } from '../data/patterns';
import { getExercise } from '../data/exercises';
import { canBikeReplace, impactOf, sessionImpact } from '../data/impact';
import { QUALITY_LABEL, isContrastSet, qualityOf } from '../data/qualities';

/**
 * MOTOR DE INTELIGENCIA DE ENTRENAMIENTO
 * ──────────────────────────────────────
 * Antes de mostrar una sesión, se analiza. Los hallazgos son informativos:
 * nunca bloquean ni modifican una sesión aprobada.
 */

export type Severity = 'warning';

export interface Issue {
  id: string;
  severity: Severity;
  message: string;
  /** Sustitución concreta que resuelve el problema. */
  fix?: { blockId: string; itemIndex: number; from: string; to: string; why: string };
}

export interface SessionAnalysis {
  valid: boolean;
  issues: Issue[];
  counts: Record<MovementPattern, number>;
  push: number;
  pull: number;
  bilateral: number;
  unilateral: number;
}

/** Los bloques de movilidad y recuperación no entran en el análisis de patrones. */
const SCORED = (b: WorkoutBlock) => b.kind !== 'recovery';

const IGNORED: MovementPattern[] = ['mobility'];

interface Slot {
  blockId: string;
  index: number;
  exerciseId: string;
  primary: MovementPattern;
  all: MovementPattern[];
  block: WorkoutBlock;
}

const slotsOf = (workout: Workout): Slot[] =>
  workout.blocks.filter(SCORED).flatMap((block) =>
    block.items.map((it, index) => ({
      blockId: block.id,
      index,
      exerciseId: it.exerciseId,
      primary: primaryPattern(it.exerciseId),
      all: patternsOf(it.exerciseId),
      block,
    })),
  );

/** Elige una alternativa del mismo patrón que no esté ya en la sesión. */
const suggestAlternative = (pattern: MovementPattern, used: Set<string>): string | undefined =>
  SAME_PATTERN_ALTERNATIVES[pattern]?.find((id) => !used.has(id));

/** Elige una alternativa de un patrón distinto que la sesión no esté cubriendo. */
/**
 * `avoid` lleva lo ya programado en la semana: sin eso, la sustitución podría
 * meter un ejercicio que ya aparece en otro día y romper la regla de no repetir.
 */
let avoidSet: Set<string> = new Set();
export const setWeeklyAvoid = (ids: Iterable<string>): void => {
  avoidSet = new Set(ids);
};

const suggestComplement = (
  missing: MovementPattern,
  used: Set<string>,
  equipment: string[],
): string | undefined => {
  const pool = SAME_PATTERN_ALTERNATIVES[missing] ?? [];
  const free = (id: string) => !used.has(id) && !avoidSet.has(id);
  return (
    pool.find((id) => free(id) && getExercise(id).equipment.every((e) => equipment.includes(e) || e === 'Peso corporal')) ??
    pool.find(free)
  );
};

export const analyzeSession = (workout: Workout): SessionAnalysis => {
  const slots = slotsOf(workout);
  const used = new Set(slots.map((s) => s.exerciseId));
  const issues: Issue[] = [];
  const needsAthleticBalance = workout.blocks.some((block) => block.kind === 'fuerza' || block.kind === 'atleta');

  const counts = {} as Record<MovementPattern, number>;
  slots.forEach((s) => {
    if (IGNORED.includes(s.primary)) return;
    counts[s.primary] = (counts[s.primary] ?? 0) + 1;
  });

  // ── 1. Sin patrones primarios duplicados en exceso dentro de un bloque ──
  workout.blocks.filter(SCORED).forEach((block) => {
    const byPattern = new Map<MovementPattern, Slot[]>();
    block.items.forEach((it, index) => {
      const pr = primaryPattern(it.exerciseId);
      if (IGNORED.includes(pr)) return;
      byPattern.set(pr, [...(byPattern.get(pr) ?? []), { blockId: block.id, index, exerciseId: it.exerciseId, primary: pr, all: patternsOf(it.exerciseId), block }]);
    });

    byPattern.forEach((group, pattern) => {
      /**
       * TRI-SET DE CONTRASTE
       * Repetir el patrón NO es un error si cada ejercicio entrena una cualidad
       * distinta: pesado → isométrico → balístico. Eso es método, no volumen.
       * El error aparece cuando las tres versiones son la misma cualidad
       * (bench → push-up → TRX push-up: tres veces "pesado").
       */
      const ids = group.map((g) => g.exerciseId);
      if (group.length >= 2 && isContrastSet(ids)) return;

      // En circuitos de core y motor es normal repetir familia; el límite ahí es 3.
      const cap = block.kind === 'zona-media' || block.kind === 'finisher' ? 3 : 2;
      if (group.length > cap) {
        const offender = group[group.length - 1];
        const to = suggestAlternative(
          (Object.keys(SAME_PATTERN_ALTERNATIVES) as MovementPattern[]).find(
            (p) => !counts[p] && p !== pattern && !IGNORED.includes(p),
          ) ?? pattern,
          used,
        );
        issues.push({
          id: `dup-${block.id}-${pattern}`,
          severity: 'warning',
          message: `${block.title}: ${group.length} ejercicios de ${PATTERN_LABEL[pattern].toLowerCase()}, todos ${QUALITY_LABEL[qualityOf(ids[0])].toLowerCase()}s. Repetir el patrón solo sirve si cambia la cualidad.`,
          fix: to
            ? {
                blockId: block.id,
                itemIndex: offender.index,
                from: offender.exerciseId,
                to,
                why: `Varía el patrón en vez de repetir ${PATTERN_LABEL[pattern].toLowerCase()}.`,
              }
            : undefined,
        });
      }
    });
  });

  // ── 2. Límites de patrones pesados ──
  const heavyCount: Record<string, Slot[]> = {};
  slots.forEach((s) => {
    const h = HEAVY[s.exerciseId];
    if (!h) return;
    heavyCount[h] = [...(heavyCount[h] ?? []), s];
  });
  Object.entries(heavyCount).forEach(([kind, group]) => {
    if (group.length > 1) {
      const offender = group[group.length - 1];
      const light = SAME_PATTERN_ALTERNATIVES[offender.primary]?.find((id) => !HEAVY[id] && !used.has(id));
      issues.push({
        id: `heavy-${kind}`,
        severity: 'warning',
        message: `Dos patrones pesados de ${kind} en la misma sesión (${group.map((g) => getExercise(g.exerciseId).name).join(' y ')}).`,
        fix: light
          ? {
              blockId: offender.blockId,
              itemIndex: offender.index,
              from: offender.exerciseId,
              to: light,
              why: 'Un solo patrón pesado por sesión; el resto complementa.',
            }
          : undefined,
      });
    }
  });

  // ── 3. Balance empuje / tracción ──
  /**
   * Un trío de contraste (pesado → isométrico → balístico) es UN patrón de
   * empuje, no tres. Se cuenta por bloque, no por ejercicio: si no, el método
   * dispara siempre una falsa alarma de desbalance.
   */
  const countPattern = (p: MovementPattern): number => {
    const perBlock = new Map<string, string[]>();
    slots.filter((s) => s.all.includes(p)).forEach((s) => {
      perBlock.set(s.blockId, [...(perBlock.get(s.blockId) ?? []), s.exerciseId]);
    });
    let total = 0;
    perBlock.forEach((ids) => {
      total += ids.length >= 2 && isContrastSet(ids) ? 1 : ids.length;
    });
    return total;
  };

  const push = countPattern('upper-push');
  const pull = countPattern('upper-pull');
  if (needsAthleticBalance && push > 0 && pull === 0) {
    const to = suggestComplement('upper-pull', used, workout.equipment);
    // Se cambia un ejercicio del bloque Atleta, no el trío de contraste del bloque Fuerza.
    const target =
      [...slots].reverse().find((s) => s.block.kind === 'atleta' && !HEAVY[s.exerciseId] && !s.all.includes('unilateral')) ??
      [...slots].reverse().find((s) => s.block.kind === 'atleta' && !HEAVY[s.exerciseId]);
    issues.push({
      id: 'balance-pull',
      severity: 'warning',
      message: 'Hay empuje pero nada de tracción. La sesión queda desbalanceada.',
      fix:
        to && target
          ? { blockId: target.blockId, itemIndex: target.index, from: target.exerciseId, to, why: 'Compensa el empuje con tracción.' }
          : undefined,
    });
  }
  if (needsAthleticBalance && push > pull + 1) {
    issues.push({
      id: 'balance-push-heavy',
      severity: 'warning',
      message: `Empuje ${push} contra tracción ${pull}: demasiado empuje para el perfil del atleta.`,
    });
  }

  // ── 4. Balance bilateral / unilateral ──
  const unilateral = slots.filter((s) => s.all.includes('unilateral')).length;
  const bilateral = slots.filter(
    (s) => !s.all.includes('unilateral') && !IGNORED.includes(s.primary),
  ).length;
  if (needsAthleticBalance && unilateral === 0) {
    const to = suggestComplement('unilateral', used, workout.equipment);
    // Se reemplaza el ejercicio menos específico del bloque Atleta.
    const target = [...slots].reverse().find((s) => s.block.kind === 'atleta' && !HEAVY[s.exerciseId]);
    issues.push({
      id: 'balance-unilateral',
      severity: 'warning',
      message: 'Sin trabajo unilateral. El deporte se juega sobre una pierna.',
      fix:
        to && target
          ? { blockId: target.blockId, itemIndex: target.index, from: target.exerciseId, to, why: 'Suma trabajo unipodal.' }
          : undefined,
    });
  }

  // ── 5. Al menos un rotacional o antirrotacional ──
  const rotational = slots.filter((s) => s.all.includes('rotation') || s.all.includes('anti-rotation')).length;
  if (needsAthleticBalance && rotational === 0) {
    const to = suggestComplement('anti-rotation', used, workout.equipment);
    const target = [...slots].reverse().find((s) => s.block.kind === 'zona-media');
    issues.push({
      id: 'no-rotation',
      severity: 'warning',
      message: 'Ni rotación ni antirrotación en toda la sesión.',
      fix:
        to && target
          ? { blockId: target.blockId, itemIndex: target.index, from: target.exerciseId, to, why: 'El core transfiere fuerza rotando y resistiendo rotación.' }
          : undefined,
    });
  }

  // ── 6. Al menos un movimiento atlético ──
  const athletic = slots.filter(
    (s) => s.all.includes('plyometrics') || s.all.includes('locomotion'),
  ).length;
  if (needsAthleticBalance && athletic === 0) {
    const to = suggestComplement('plyometrics', used, workout.equipment);
    const target = [...slots].reverse().find((s) => s.block.kind === 'atleta' && !HEAVY[s.exerciseId]);
    issues.push({
      id: 'no-athletic',
      severity: 'warning',
      message: 'Sin saltos, sprints ni desplazamientos: falta el componente atlético.',
      fix:
        to && target
          ? { blockId: target.blockId, itemIndex: target.index, from: target.exerciseId, to, why: 'Sin pliometría ni locomoción no hay atleta.' }
          : undefined,
    });
  }

  // ── 7. Prioridades del deporte al que transfiere ──
  workout.transfersTo.forEach((sport) => {
    const profile = SPORT_PROFILE[sport];
    if (!profile.limit) return;
    // Un solo patrón PESADO de empuje: el volumen liviano de push-ups no cuenta igual.
    const heavyPress = slots.filter((s) => HEAVY[s.exerciseId] === 'press').length;
    const n = profile.limit.heavyOnly
      ? Math.max(heavyPress, slots.filter((s) => s.all.includes(profile.limit!.pattern)).length - 1)
      : slots.filter((s) => s.all.includes(profile.limit!.pattern)).length;
    if (n > profile.limit.max) {
      const offender = [...slots].reverse().find((s) => s.all.includes(profile.limit!.pattern))!;
      const to = suggestComplement('upper-pull', used, workout.equipment);
      issues.push({
        id: `sport-${sport}`,
        severity: 'warning',
        message: `${profile.label}: ${n} patrones de ${PATTERN_LABEL[profile.limit.pattern].toLowerCase()} cuando el máximo recomendado es ${profile.limit.max}. ${profile.limit.reason}.`,
        fix: to
          ? { blockId: offender.blockId, itemIndex: offender.index, from: offender.exerciseId, to, why: profile.limit.reason }
          : undefined,
      });
    }
  });

  /**
   * ── 8. Impacto acumulado ──
   * La bici es la herramienta para sumar motor cuando correr y saltar ya
   * cobraron. Pero nunca reemplaza sprints, pliometría, soga ni mecánica:
   * esas cualidades solo se entrenan con los pies en el suelo.
   */
  const impact = sessionImpact(workout);
  if (impact >= 20) {
    const swappable = slots.filter(
      (s) => impactOf(s.exerciseId) !== 'nulo' && canBikeReplace(s.exerciseId) && s.block.kind === 'finisher',
    );
    issues.push({
      id: 'impact-high',
      severity: 'warning',
      message:
        `Sesión de impacto alto (${impact} puntos). ` +
        (swappable.length
          ? 'Si las piernas están cargadas, bajá el impacto o el volumen del híbrido; la bici queda como estación opcional.'
          : 'Todo lo que suma impacto acá es sprint o pliometría: no se reemplaza por bici sin perder la cualidad.'),
      fix: swappable.length
        ? {
            blockId: swappable[0].blockId,
            itemIndex: swappable[0].index,
            from: swappable[0].exerciseId,
            to: 'bike-sprint',
            why: 'Mismo estímulo cardiovascular, cero impacto.',
          }
        : undefined,
    });
  }

  return {
    valid: true,
    issues,
    counts,
    push,
    pull,
    bilateral,
    unilateral,
  };
};

/**
 * ⚠️ NO SE USA EN EL GENERADOR.
 * La rutina está aprobada y no se modifica automáticamente. El validador
 * detecta duplicaciones, muestra alertas y análisis, pero la sesión original
 * se conserva siempre. Esta función queda disponible solo para uso manual.
 */
export const autoFix = (workout: Workout): Workout => {
  const { issues } = analyzeSession(workout);
  // Dos reglas distintas pueden proponer el mismo reemplazo: se aplica una sola vez.
  const seen = new Set<string>();
  const fixes = issues.filter((i) => {
    if (!i.fix || !i.fix.from) return false;
    // El impacto se sugiere, no se corrige solo: depende de cómo venís, no de la sesión.
    if (i.id === 'impact-high') return false;
    if (seen.has(i.fix.to)) return false;
    seen.add(i.fix.to);
    return true;
  });
  if (!fixes.length) return workout;

  const blocks = workout.blocks.map((b) => {
    const applicable = fixes.filter((f) => f.fix!.blockId === b.id);
    if (!applicable.length) return b;
    const items = b.items.map((it, i) => {
      const f = applicable.find((x) => x.fix!.itemIndex === i && x.fix!.from === it.exerciseId);
      if (!f) return it;
      /**
       * Al sustituir hay que rehacer la prescripción: heredar "30 m" de un
       * farmer carry para un TRX row no tiene sentido. Se toma el volumen
       * típico del ejercicio nuevo.
       */
      const next = getExercise(f.fix!.to);
      const typical = next.typical;
      // "3 × 12–15" · "4 × 30 s" · "3 × 25 m por lado"
      const m = typical.match(/(\d+)\s*[×x]\s*([\d–\-]+)\s*(s|m|min|saltos|pasos|contactos)?/i);
      const amount = m?.[2];
      const unit = (m?.[3] ?? '').toLowerCase();
      return {
        ...it,
        exerciseId: f.fix!.to,
        sets: m ? Number(m[1]) : it.sets,
        reps: amount && !unit ? amount : undefined,
        duration: amount && (unit === 's' || unit === 'min') ? `${amount} ${unit}` : undefined,
        distance: amount && unit === 'm' ? `${amount} m` : undefined,
        carry: unit === 'm' ? it.carry : undefined,
        unilateral: /por lado|cada lado/i.test(typical) || undefined,
        load: undefined,
        instructions: 'Sustituido para equilibrar la sesión.',
      };
    });
    return { ...b, items };
  });
  return { ...workout, blocks };
};

// ═══════════════════════ COACH MODE ═══════════════════════

/**
 * Explica por qué la selección de ejercicios de hoy tiene sentido.
 * Se arma de los patrones reales de la sesión, no de un texto guardado.
 */
export const explainSession = (workout: Workout): string => {
  const a = analyzeSession(workout);
  const sport = workout.transfersTo[0];
  const profile = sport ? SPORT_PROFILE[sport] : undefined;

  const parts: string[] = [];

  // El patrón pesado del día manda la explicación: es lo que define la sesión.
  const heavySlots = workout.blocks
    .flatMap((b) => b.items)
    .map((i) => ({ id: i.exerciseId, heavy: HEAVY[i.exerciseId] }))
    .filter((x) => x.heavy);
  const heavyKind = heavySlots[0]?.heavy;
  const sportName = profile ? profile.label.toLowerCase() : 'tu deporte';

  if (profile?.favor.includes('upper-pull') && a.pull >= a.push && a.pull > 0) {
    // Surf: la tracción manda aunque haya un press pesado.
    parts.push(
      `Hoy la sesión sostiene el empuje en un solo patrón pesado y carga el resto en tracción, agarre y control escapular: es lo que mejora la resistencia de remada y protege el hombro para ${sportName}`,
    );
  } else if (heavyKind === 'squat' && profile?.favor.includes('squat')) {
    parts.push(
      `El eje del día es la sentadilla con trabajo unipodal e isométrico alrededor: resistencia de cuádriceps y estabilidad de cadera, que es lo que falla en una jornada larga de ${sportName}`,
    );
  } else if (heavyKind === 'hinge') {
    parts.push(
      `El día se organiza alrededor de una bisagra explosiva: producir fuerza rápido desde la cadera y absorberla al recibir, que es la base de todo lo atlético y lo que sostiene ${sportName}`,
    );
  } else if ((a.counts.rotation ?? 0) >= 2 && profile?.favor.includes('rotation')) {
    parts.push(
      `La sesión gira alrededor de la potencia rotacional y su freno: la cadena pie-cadera-torso que produce velocidad en ${sportName}`,
    );
  } else if (profile?.favor.includes('plyometrics') && (a.counts.plyometrics ?? 0) > 0) {
    parts.push(
      `El foco está en elasticidad y rigidez reactiva, con la mecánica antes del volumen: es lo que devuelve energía en cada zancada de ${sportName}`,
    );
  } else if (heavyKind === 'press') {
    parts.push(`El día se apoya en un empuje pesado, con la tracción y el core equilibrando la carga para ${sportName}`);
  } else {
    parts.push(`La sesión reparte el trabajo entre los patrones principales sin sobrecargar ninguno, con la mirada puesta en ${sportName}`);
  }

  // Balance concreto
  const balance: string[] = [];
  if (a.push && a.pull) balance.push(`${a.push} de empuje contra ${a.pull} de tracción`);
  if (a.unilateral) balance.push(`${a.unilateral} unilaterales`);
  const rot = (a.counts.rotation ?? 0) + (a.counts['anti-rotation'] ?? 0);
  if (rot) balance.push(`${rot} de rotación o antirrotación`);
  if (balance.length) parts.push(`El balance queda en ${balance.join(', ')}`);

  // Un solo patrón pesado
  if (heavySlots.length === 1) {
    parts.push(
      `Hay un único patrón pesado — ${getExercise(heavySlots[0].id).name} — y todo lo demás lo complementa en vez de competirle`,
    );
  }

  return `${parts.join('. ')}.`;
};

/** Las prioridades del deporte, para mostrarlas junto a la explicación. */
export const sportPriorities = (sport: SportModule): string[] => SPORT_PROFILE[sport].priorities;
