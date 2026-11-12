import type { AppState, ExercisePrescription, Workout, WorkoutBlock } from '../types';
import { buildV7 } from './v7';
import { getExercise } from './exercises';
import { buildFourWeekMesocycle, isFourWeekMesocycle } from './mesocycle';

export const V8_PHASE_NAMES = ['FOUNDATION', 'BUILD', 'HYBRID', 'RACE PREP'];
const item = (exerciseId: string, details: Partial<ExercisePrescription> = {}): ExercisePrescription => ({ exerciseId, ...details });
const FLOW = [
  [item('situp-to-stand', { reps: '6' }), item('dead-bug', { reps: '8/lado' }), item('hip-9090', { reps: '8 cambios' }), item('pallof-press', { reps: '10/lado' })],
  [item('crab-reach', { reps: '6/lado' }), item('ab-wheel', { reps: '6–8' }), item('shinbox-to-stand', { reps: '5/lado' }), item('bird-dog', { reps: '8/lado' })],
  [item('beast-to-down-dog', { reps: '8' }), item('cossack-knee-drive', { reps: '5/lado' }), item('dead-bug', { reps: '8/lado' }), item('pallof-press', { reps: '8/lado' })],
];
const MENUS: ExercisePrescription[][] = [
  [item('hang-power-clean', { reps: '6', load: 'Barra liviana · confirmar kg' }), item('push-press', { reps: '6', load: 'Misma barra, sin cambiar montaje' }), item('goblet-squat', { reps: '10', load: 'Una KB · confirmar kg' }), item('sit-up', { reps: '12' }), item('spinning-bike', { duration: '45 s' })],
  [item('box-step-up', { reps: '12 total' }), item('kb-swing', { reps: '12', load: 'Una KB · confirmar kg' }), item('push-up', { reps: '8' }), item('jump-rope', { reps: '60' }), item('sit-up', { reps: '12' })],
  [item('kb-clean', { reps: '6/lado', load: 'Una KB · confirmar kg' }), item('reverse-lunge', { reps: '12 total' }), item('trx-row', { reps: '10' }), item('burpee', { reps: '6' }), item('spinning-bike', { duration: '60 s' })],
  [item('db-curl-to-press', { reps: '12', load: 'DB livianas' }), item('goblet-squat', { reps: '10', load: 'Una KB · confirmar kg' }), item('box-step-over', { reps: '12 total' }), item('jump-rope', { reps: '50' }), item('spinning-bike', { duration: '45 s' })],
];

/** V8 is derived only for unstarted workouts. V7 remains available for historical definitions. */
export const toV8Workout = (source: Workout, deload = source.week % 4 === 0): Workout => {
  const workout = structuredClone(source);
  if (source.day === 7) return workout;
  const gym = [1, 3, 5].includes(source.day);
  const phase = Math.floor((source.week - 1) / 4);
  if (gym) {
    const position = (source.day - 1) / 2;
    const strengthSets = deload ? 3 : 4;
    const main = ['back-squat', 'bench-press', 'deadlift'][position]!;
    const power = ['box-jump', 'med-ball-chest-pass', 'broad-jump'][position]!;
    const accessory = ['bulgarian-split-squat', 'single-leg-rdl', 'reverse-lunge'][position]!;
    const compensation = ['trx-row', 'db-lateral-raise', 'band-face-pull'][position]!;
    const minutes = deload ? 12 : [15, 16, 18, 15][phase]!;
    const forTime = (source.week + position) % 3 === 0;
    const rounds = deload ? 3 : 4;
    workout.name = ['LOWER STRENGTH + HYBRID', 'UPPER STRENGTH + HYBRID', 'FULL BODY + HYBRID'][position]!;
    workout.subtitle = 'Flow · Fuerza + potencia · Hybrid';
    workout.blocks = [
      { id: '', index: 1, kind: 'zona-media', title: '01 · ZONA MEDIA / FLOW', minutes: 8, duration: '8 min', format: 'rounds', rounds: deload ? 2 : 3, formatLabel: `${deload ? 2 : 3} vueltas · calidad`, focus: 'Movilidad, core dinámico y control; no agotamiento.', items: structuredClone(FLOW[position]!) },
      { id: '', index: 2, kind: 'fuerza', title: '02 · STRENGTH + POWER', minutes: 22, duration: '22 min', format: 'sets', formatLabel: 'CONTRASTE A · SUPERSET B', focus: 'A1 → descanso → A2 → descanso; repetir. Luego B1 → B2.', rest: '90 s', items: [
        item(main, { order: 'A1', sets: strengthSets, reps: phase === 0 ? '5–6' : '4–5', rpe: deload ? '6' : '7–8', rest: '120 s', instructions: 'Registrá la carga real. Técnica limpia y 1–3 repeticiones en reserva; no es un máximo.' }),
        item(power, { order: 'A2', sets: strengthSets, reps: source.day === 3 ? '5' : '3–4', rest: '90 s', instructions: 'Explosivo con calidad. Cortá antes de perder velocidad; no buscar fatiga.' }),
        item(accessory, { order: 'B1', sets: deload ? 2 : 3, reps: '8/lado', unilateral: true, rest: '15 s', load: 'Una KB, carga editable' }),
        item(compensation, { order: 'B2', sets: deload ? 2 : 3, reps: '10–12', rest: '60 s', instructions: 'Alterná B1 y B2. No requiere desmontar la barra principal.' }),
      ] },
      { id: '', index: 3, kind: 'transicion', title: 'TRANSICIÓN OPCIONAL', minutes: 3, duration: 'Opcional · 3 min aprox.', format: 'sets', formatLabel: 'Una vuelta a la manzana · opcional', intensity: 'suave', goal: 'Conectar fuerza e híbrido. Podés omitirla; no se exige correr dentro del WOD.', items: [item('block-run', { sets: 1, duration: 'Una vuelta', rpe: '4–5' })] },
      { id: '', index: 4, kind: 'finisher', title: '03 · HYBRID CONDITIONING', minutes, duration: `${minutes} min`, format: forTime ? 'for-time' : 'amrap', rounds: forTime ? rounds : undefined, capMinutes: minutes, formatLabel: forTime ? `${rounds} vueltas · cap ${minutes} min` : `AMRAP ${minutes} min`, scoreType: forTime ? 'time' : 'rounds-reps', scoreHint: 'Vueltas, parciales y tiempos registrados', focus: 'Continuo y medible; ritmo repetible. Primero calidad y pacing, luego carga.', items: structuredClone(MENUS[(source.week - 1 + position) % MENUS.length]!) },
    ];
  } else if (source.day === 2) {
    const zone = workout.blocks[1]!;
    zone.minutes = deload ? 35 : 45;
    zone.duration = deload ? '35–40 min' : '40–50 min';
    zone.formatLabel = zone.duration;
    zone.items = zone.items.map(i => ({ ...i, duration: zone.duration }));
  } else if (source.day === 6) {
    // No pretend sled, rower, SkiErg or matched kettlebell pair: real run/stations only.
    const cap = deload ? 18 : [20, 22, 24, 25][phase]!;
    workout.blocks = workout.blocks.filter(b => b.kind !== 'atleta');
    const hybrid = workout.blocks.find(b => b.kind === 'finisher')!;
    hybrid.minutes = cap;
    hybrid.capMinutes = cap;
    hybrid.duration = `${cap} min`;
    hybrid.format = 'for-time';
    hybrid.rounds = deload ? 3 : 4;
    hybrid.formatLabel = `${hybrid.rounds} vueltas · cap ${cap} min`;
    hybrid.scoreType = 'time';
    hybrid.items = [
      item('threshold-run', { distance: phase < 2 ? '400 m' : '600 m', instructions: 'Corré a ritmo repetible; no sprint.' }),
      item((source.week % 2) ? 'box-step-over' : 'goblet-squat', { reps: '16' }),
      item('trx-row', { reps: '12' }),
      item('reverse-lunge', { reps: '16 total', load: 'Goblet con una KB' }),
      item((source.week % 2) ? 'burpee' : 'spinning-bike', (source.week % 2) ? { reps: '8' } : { duration: '60 s' }),
    ];
  }
  workout.blocks = workout.blocks.map((block, index) => ({ ...block, id: `${source.id}-v8-b${index + 1}`, index: index + 1 }));
  workout.plannedRpe = deload ? '6–7' : source.day === 2 ? '4–5' : source.day === 6 ? '8' : '7–8';
  workout.duration = `${workout.blocks.reduce((sum, b) => sum + b.minutes, 0)} min`;
  workout.coachNote = gym
    ? 'V8 · Tres bloques y una transición opcional. Conservá velocidad en el contraste y un ritmo sostenible en Hybrid. La carga se confirma, no se supone.'
    : source.coachNote;
  workout.equipment = [...new Set(workout.blocks.flatMap(b => b.items.flatMap(i => getExercise(i.exerciseId).equipment)))];
  return workout;
};

export const buildScheduledProgram = (start: string, state: AppState): Workout[] => {
  const scheduled = isFourWeekMesocycle(state) ? buildFourWeekMesocycle(start) : buildV7(start);
  return scheduled.map(original => {
    const session = state.sessions[original.id];
    const done = state.history.some(summary => summary.workoutId === original.id);
    if (session?.definition) return session.definition;
    if (session || done) return original;
    const date = state.schedule?.[original.id] ?? original.date;
    if (isFourWeekMesocycle(state)) {
      return { ...original, date, status: state.skippedWorkouts?.includes(original.id) ? 'modified' : original.status };
    }
    const upcoming = state.v8From && date >= state.v8From;
    const converted = upcoming
      ? toV8Workout(original, (state.phaseSettings?.deloadWeeks ?? [4, 8, 12, 16]).includes(original.week))
      : original;
    return { ...converted, date, status: state.skippedWorkouts?.includes(original.id) ? 'modified' : converted.status };
  }).sort((a, b) => a.date.localeCompare(b.date));
};
