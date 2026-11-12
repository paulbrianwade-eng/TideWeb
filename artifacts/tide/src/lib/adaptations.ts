import type { DailyReadiness, Workout, WorkoutBlock } from '../types';

/**
 * REGLAS DE ADAPTACIÓN
 * ────────────────────
 * No son sugerencias de texto: cada regla transforma la sesión antes de
 * empezar. `applyAdaptations` devuelve los bloques ya modificados, así lo que
 * ves en el modo entrenamiento es lo que vas a hacer.
 */

export interface AdaptationAnswers {
  rain?: boolean;
  /** Horas de sueño declaradas. */
  sleep: number | null;
  energy: number | null;
  /** 0 = sin molestias. */
  pain: number | null;
  /** Zona de la molestia, si la hay. */
  painArea: 'lumbar' | 'rodilla' | 'hombro' | null;
  /** Minutos disponibles. */
  minutes: 30 | 50 | null;
  place: 'gym' | 'casa' | null;
  /** Deporte de mañana. */
  tomorrow: 'surf' | 'ski' | 'golf' | null;
}

export const emptyAnswers: AdaptationAnswers = {
  sleep: null, energy: null, pain: null, painArea: null, minutes: null, place: null, tomorrow: null,
};

export interface AppliedRule {
  id: string;
  label: string;
  effect: string;
}

/** Sustituciones por molestia: id original → id de reemplazo. */
const SWAPS: Record<string, Record<string, string>> = {
  lumbar: {
    'deadlift': 'hip-thrust',
    'barbell-row': 'inverted-row',
    'romanian-deadlift': 'glute-bridge-single',
    'ab-wheel': 'dead-bug',
    'hang-power-clean': 'kb-swing',
    'box-squat': 'goblet-squat',
  },
  rodilla: {
    'box-squat': 'hip-thrust',
    'back-squat': 'hip-thrust',
    'front-squat': 'hip-thrust',
    'bulgarian-split-squat': 'glute-bridge-single',
    'step-down': 'split-squat-hold',
    'box-jump': 'kb-swing',
    'drop-jump': 'pogo-jump',
  },
  hombro: {
    'bench-press': 'push-up',
    'overhead-press': 'kb-shoulder-press',
    'push-press': 'goblet-squat',
    'trx-push-up': 'push-up',
    'bottom-up-carry': 'suitcase-carry',
  },
};

/** Reparto del tiempo cuando solo hay 30 minutos. */
const SHORT_BUDGET: Record<WorkoutBlock['kind'], number> = {
  'zona-media': 5, fuerza: 12, atleta: 6, finisher: 7, outdoor: 10, recovery: 5, transicion: 3,
};

/**
 * Aplica todas las reglas activas y devuelve la sesión transformada
 * junto con el detalle de qué cambió y por qué.
 */
export const applyAdaptations = (
  workout: Workout,
  a: AdaptationAnswers,
): { blocks: WorkoutBlock[]; rules: AppliedRule[]; rpeCap?: string } => {
  let blocks = workout.blocks.map((b) => ({ ...b, items: b.items.map((i) => ({ ...i })) }));
  const rules: AppliedRule[] = [];
  let rpeCap: string | undefined;
  if (a.rain) {
    blocks = blocks.map(b => ({
      ...b,
      ...(b.kind === 'transicion' ? { title: 'TRANSICIÓN INDOOR', goal: 'Bicicleta indoor; tiempo y RPE registrados.' } : {}),
      items: b.items.map(i => {
        const outdoor = ['block-run', 'zone2-run', 'threshold-run', 'tempo-run', 'shuttle-run', 'jump-rope'].includes(i.exerciseId);
        if (outdoor) return { ...i, exerciseId: 'spinning-bike', distance: undefined, reps: undefined, duration: i.duration ?? (i.distance?.includes('800') ? '3 min' : '90 s'), instructions: `Modo lluvia: sustituye ${i.exerciseId}. No comparable con la versión exterior.` };
        if (i.exerciseId.startsWith('trx-')) return { ...i, exerciseId: 'band-face-pull', instructions: `Modo lluvia: sustituye ${i.exerciseId}. Variante con banda; no equivalente para benchmarks.` };
        return i;
      }),
    }));
    rules.push({ id: 'rain', label: 'Modo lluvia', effect: 'Solo TRX, corrida exterior y soga se sustituyen. El resto permanece igual.' });
  }

  // ── Sueño menor a 6 horas ──
  if (a.sleep !== null && a.sleep < 6) {
    blocks = blocks.map((b) => {
      if ((b.kind === 'atleta' || b.kind === 'zona-media') && b.rounds && b.rounds > 2)
        return { ...b, rounds: b.rounds - 1, formatLabel: `${b.rounds - 1} vueltas` };
      if (b.kind === 'fuerza') {
        return { ...b, items: b.items.map((i, idx) => (idx === 0 ? { ...i, rpe: '7' } : i)) };
      }
      return b;
    });
    rpeCap = '7';
    rules.push({
      id: 'sleep-low',
      label: 'Dormiste menos de 6 horas',
      effect: 'Una vuelta menos en Atleta · fuerza limitada a RPE 7 · el finisher se mantiene en RPE 7–8.',
    });
  }

  // ── Dolor ──
  if (a.pain !== null && a.pain >= 4 && a.painArea) {
    const swap = SWAPS[a.painArea] ?? {};
    let changed = 0;
    blocks = blocks.map((b) => ({
      ...b,
      items: b.items.map((i) => {
        const to = swap[i.exerciseId];
        if (!to) return i;
        changed += 1;
        return { ...i, exerciseId: to, instructions: 'Sustituido por la molestia declarada.' };
      }),
    }));
    if (changed) {
      rules.push({
        id: `pain-${a.painArea}`,
        label: `Molestia en ${a.painArea}`,
        effect: `${changed} ejercicio${changed > 1 ? 's' : ''} reemplazado${changed > 1 ? 's' : ''} por variantes con apoyo.`,
      });
    }
  }

  /**
   * La bici NO reemplaza automáticamente correr, vueltas, sprint, soga,
   * shuttle ni el finisher. Es una opción de equipamiento, no un sustituto:
   * si conviene usarla, se dice, pero la sesión no se toca sola.
   */

  if (a.pain !== null && a.pain >= 4 && a.painArea === 'rodilla') {
    rules.push({
      id: 'bike-suggest-knee',
      label: 'Molestia de rodilla',
      effect: 'Sugerencia: el motor del híbrido puede salir de la bici. La sesión no se cambia sola — decidilo vos.',
    });
  }

  // ── Mañana esquío: menos excéntricos y volumen de piernas ──
  if (a.tomorrow === 'ski') {
    blocks = blocks.map((b) => {
      if (b.kind === 'fuerza') {
        return {
          ...b,
          items: b.items.map((i, idx) =>
            idx === 0 ? { ...i, sets: Math.max(2, (i.sets ?? 4) - 2), instructions: 'Volumen reducido: mañana hay nieve.' } : i,
          ),
        };
      }
      if (b.kind === 'atleta' && b.rounds && b.rounds > 2) {
        return { ...b, rounds: 2, formatLabel: '2 vueltas' };
      }
      return b;
    });
    rules.push({
      id: 'tomorrow-ski',
      label: 'Mañana esquiás',
      effect:
        'Dos series menos en el principal y Atleta a 2 vueltas. Se mantienen activación, potencia breve y core. Si querés, el motor del híbrido puede salir de la bici.',
    });
  }

  // ── Mañana surfeo: menos fatiga de dorsal y hombro ──
  if (a.tomorrow === 'surf') {
    const PULL = ['pull-up', 'trx-row', 'inverted-row', 'barbell-row', 'trx-power-pull'];
    blocks = blocks.map((b) => ({
      ...b,
      items: b.items.map((i) =>
        PULL.includes(i.exerciseId)
          ? { ...i, sets: Math.max(2, (i.sets ?? 3) - 1), instructions: 'Volumen de tirón reducido: mañana hay olas.' }
          : i,
      ),
    }));
    rules.push({
      id: 'tomorrow-surf',
      label: 'Mañana surfeás',
      effect: 'Una serie menos en todo el trabajo de tracción. Sin carries sobre la cabeza.',
    });
  }

  // ── Mañana juego al golf: rotación en modo técnico ──
  if (a.tomorrow === 'golf') {
    blocks = blocks.map((b) =>
      b.kind === 'atleta'
        ? { ...b, items: b.items.map((i) => (i.exerciseId.includes('rotational') ? { ...i, reps: '3', instructions: 'Modo técnico: velocidad sin fatiga.' } : i)) }
        : b,
    );
    rules.push({
      id: 'tomorrow-golf',
      label: 'Mañana jugás al golf',
      effect: 'Los lanzamientos rotacionales bajan a 3 repeticiones: velocidad sin fatiga acumulada.',
    });
  }

  // ── Entreno en casa: sin barra ni rack ──
  if (a.place === 'casa') {
    const HOME_SWAP: Record<string, string> = {
      'box-squat': 'goblet-squat', 'back-squat': 'goblet-squat', 'front-squat': 'goblet-squat',
      'bench-press': 'push-up', 'push-press': 'kb-shoulder-press', 'overhead-press': 'kb-shoulder-press',
      'hang-power-clean': 'kb-clean', 'deadlift': 'kb-swing', 'barbell-row': 'trx-row',
      'inverted-row': 'trx-row',
    };
    let changed = 0;
    blocks = blocks.map((b) => ({
      ...b,
      items: b.items.map((i) => {
        const to = HOME_SWAP[i.exerciseId];
        if (!to) return i;
        changed += 1;
        return { ...i, exerciseId: to, instructions: 'Versión sin barra.' };
      }),
    }));
    if (changed) {
      rules.push({
        id: 'place-home',
        label: 'Entrenás en casa',
        effect: `${changed} ejercicio${changed > 1 ? 's' : ''} de barra reemplazado${changed > 1 ? 's' : ''} por kettlebell, TRX o peso corporal.`,
      });
    }
  }

  // ── Solo 30 minutos ──
  if (a.minutes === 30) {
    blocks = blocks.map((b) => {
      if (b.kind === 'transicion') return { ...b, minutes: 3, duration: '3 min' };
      const target = SHORT_BUDGET[b.kind];
      const trimmed = b.kind === 'zona-media' || b.kind === 'atleta' ? b.items.slice(0, 3) : b.items;
      return {
        ...b,
        minutes: target,
        duration: `${target} min`,
        items: trimmed,
        rounds: b.rounds && b.rounds > 2 ? 2 : b.rounds,
        capMinutes: b.capMinutes ? Math.min(b.capMinutes, target) : undefined,
        formatLabel:
          b.format === 'amrap' ? `AMRAP ${Math.min(b.capMinutes ?? target, target)} min`
          : b.rounds && b.rounds > 2 ? '2 vueltas'
          : b.formatLabel,
      };
    });
    rules.push({
      id: 'time-30',
      label: 'Solo 30 minutos',
      effect: 'Zona media 5′ · Fuerza 12′ · Atleta 6′ · Finisher 7′. Se recortan ejercicios, no bloques.',
    });
  }

  return { blocks, rules, rpeCap };
};

/** Lectura del estado general para mostrar en pantalla. */
export const readinessState = (r: DailyReadiness): { label: string; tone: 'success' | 'warn' | 'danger' } => {
  const energy = r.energy ?? 5;
  const pain = r.pain ?? 0;
  if (pain >= 6) return { label: 'Cuidado', tone: 'danger' };
  if (energy <= 4 || pain >= 4) return { label: 'Justo', tone: 'warn' };
  return { label: 'Listo', tone: 'success' };
};
