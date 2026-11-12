import assert from 'node:assert/strict';
import type { AppState, SessionSummary, Workout, WorkoutSession } from '../src/types';
import { EXERCISE_MAP, getExercise } from '../src/data/exercises';
import { UNAVAILABLE } from '../src/data/equipment';
import { buildV7 } from '../src/data/v7';
import { buildScheduledProgram } from '../src/data/v8';
import { emptyState, migrate, STATE_VERSION, STORAGE_KEY } from '../src/lib/storage';
import { applyAdaptations, emptyAnswers } from '../src/lib/adaptations';
import { createHybridResult, hybridComparableKey } from '../src/lib/hybrid';
import { setKey } from '../src/lib/prescription';

const normalized = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const start = '2026-09-21';
const legacy = buildV7(start);
const first = legacy[0]!;
const completedOnly = legacy[1]!;
const snapshotWorkout = structuredClone(legacy[2]!);
snapshotWorkout.name = 'Prescripción histórica personalizada';
snapshotWorkout.blocks[1]!.items[0]!.load = 'Carga registrada: 57.5 kg';
const recorded = (workout: Workout): WorkoutSession => {
  const block = workout.blocks.find((candidate) => candidate.kind === 'fuerza') ?? workout.blocks[0]!;
  const key = setKey(block.id, block.items[0]!.exerciseId, 0);
  return {
    workoutId: workout.id, date: workout.date, startedAt: 123, completedAt: 456,
    elapsedMs: 123456, blockIndex: 1, activeKey: key,
    sets: { [key]: [{ done: true, load: '57.5', reps: '6', rpe: 7 }] },
    skipped: ['registro anterior'], substitutions: { original: 'adaptación histórica' },
    finisherScore: { rounds: '4', reps: '3', note: 'Sin splits registrados' },
  };
};
const oldRecord = { ...recorded(first), futureSessionField: { preserved: true, values: [1, 2] } };
const oldSnapshotRecord = { ...recorded(snapshotWorkout), definition: snapshotWorkout };
const summary: SessionSummary = {
  workoutId: completedOnly.id, workoutName: completedOnly.name, date: completedOnly.date,
  durationMin: 44, blocksCompleted: 3, blocksTotal: 3, volumeKg: 345,
  setsCompleted: 6, rpe: 7, energy: 8, pain: 0, feeling: 'fresco',
  comment: 'Registro de prueba de migración', highlight: null, personalRecord: null, coachNote: '',
};
const rescheduled = legacy[7]!;
const skipped = legacy[8]!;
const original: AppState & { futureStateField: { untouched: string[] } } = {
  ...emptyState(), version: 4, programStart: start, v8From: '2026-10-01',
  futureStateField: { untouched: ['keep', 'all', 'unknown', 'fields'] },
  profile: { ...emptyState().profile, name: 'QA', weight: 83.4, futureProfileField: 'preserved' } as AppState['profile'],
  sessions: { [first.id]: oldRecord, [snapshotWorkout.id]: oldSnapshotRecord },
  history: [summary],
  schedule: {
    [first.id]: '2026-12-20',
    [completedOnly.id]: '2026-12-21',
    [snapshotWorkout.id]: '2026-12-22',
    [rescheduled.id]: '2026-11-20',
  },
  skippedWorkouts: [skipped.id],
  metrics: { weight: [{ date: '2026-09-19', value: 83.4 }], waist: [{ date: '2026-09-19', value: 89 }] },
  nutrition: { '2026-09-19': { date: '2026-09-19', dayType: 'fuerza', mealsDone: ['breakfast'], water: 1.5, creatine: true } },
};
const backup = normalized(original);
const migrated = migrate(original);
assert.equal(STORAGE_KEY, 'tide.state.v1');
assert.equal(migrated.version, STATE_VERSION);
assert.equal(migrated.programStart, start, 'never re-anchor an existing calendar');
assert.equal(migrated.v8From, original.v8From);
assert.deepEqual(normalized(original), backup, 'migration never mutates the input/backup');
assert.deepEqual(normalized((migrated as typeof original).futureStateField), backup.futureStateField);
assert.deepEqual(normalized(migrated.profile), backup.profile, 'profile and unknown profile keys survive');
assert.deepEqual(migrated.history, original.history);
assert.deepEqual(migrated.metrics, original.metrics);
assert.deepEqual(migrated.nutrition, original.nutrition);
assert.deepEqual(migrated.schedule, original.schedule);
assert.deepEqual(migrated.skippedWorkouts, original.skippedWorkouts);
const { definition, ...recordedFields } = migrated.sessions[first.id]!;
assert.deepEqual(recordedFields, oldRecord, 'only snapshot is added; sets, dates, loads and unknown keys survive');
assert.deepEqual(definition, first);
assert.equal(migrated.sessions[snapshotWorkout.id]!.definition, snapshotWorkout, 'existing snapshots stay untouched');
assert.deepEqual(migrated.sessions[snapshotWorkout.id], oldSnapshotRecord);
assert.deepEqual(normalized(migrate(normalized(migrated))), normalized(migrated), 'JSON reload migration is idempotent');
assert.deepEqual(normalized(migrate(migrate(migrated))), normalized(migrated), 'repeated in-memory migration is idempotent');

const scheduled = buildScheduledProgram(start, migrated);
assert.equal(scheduled.length, 112);
assert.equal(new Set(scheduled.map((workout) => workout.id)).size, 112, 'no duplicate identities');
assert.ok(scheduled.every((workout, index) => index === 0 || scheduled[index - 1]!.date <= workout.date), 'calendar sorted by actual scheduled date');
const byId = new Map(scheduled.map((workout) => [workout.id, workout]));
assert.equal(byId.get(first.id), definition, 'started session always uses its frozen snapshot');
assert.equal(byId.get(first.id)!.date, first.date, 'schedule cannot move a started historical session');
assert.deepEqual(byId.get(completedOnly.id), completedOnly, 'history-only sessions remain V7 with their original dates');
assert.equal(byId.get(snapshotWorkout.id), snapshotWorkout);
assert.equal(byId.get(snapshotWorkout.id)!.date, snapshotWorkout.date);
assert.equal(byId.get(rescheduled.id)!.date, '2026-11-20', 'explicit schedule applies to unstarted sessions');
assert.equal(byId.get(rescheduled.id)!.blocks.length, 4, 'rescheduled workout after cutoff receives V8');
assert.equal(byId.get(skipped.id)!.status, 'modified');
assert.deepEqual(byId.get(legacy[3]!.id), legacy[3], 'unstarted workouts before V8 cutoff remain V7');

let v8GymCount = 0;
let changedRainItems = 0;
const observedRainSources = new Set<string>();
const rainSources = new Set(['block-run', 'zone2-run', 'threshold-run', 'tempo-run', 'shuttle-run', 'jump-rope']);
for (const workout of scheduled) {
  const isV8Gym = [1, 3, 5].includes(workout.day) && workout.blocks.some((block) => block.id.includes('-v8-'));
  if (isV8Gym) {
    v8GymCount++;
    assert.deepEqual(workout.blocks.filter((block) => block.kind !== 'transicion').map((block) => block.kind),
      ['zona-media', 'fuerza', 'finisher'], 'exactly three primary gym blocks');
    const transitions = workout.blocks.filter((block) => block.kind === 'transicion');
    assert.equal(transitions.length, 1);
    assert.match(transitions[0]!.title, /OPCIONAL/);
    const strength = workout.blocks.find((block) => block.kind === 'fuerza')!;
    assert.deepEqual(strength.items.map((item) => item.order), ['A1', 'A2', 'B1', 'B2']);
    assert.ok(strength.items.every((item) => item.sets && item.sets > 0));
    const hybrid = workout.blocks.find((block) => block.kind === 'finisher')!;
    assert.ok(hybrid.capMinutes! >= 12 && hybrid.capMinutes! <= 25);
    assert.ok(['amrap', 'for-time'].includes(hybrid.format));
    if (hybrid.format === 'for-time') assert.ok(hybrid.rounds! > 0);
  }
  for (const block of workout.blocks) {
    for (const item of block.items) {
      assert.ok(EXERCISE_MAP[item.exerciseId], `${workout.id}: unknown catalog ID ${item.exerciseId}`);
      assert.ok(!getExercise(item.exerciseId).equipment.some((equipment) => UNAVAILABLE.includes(equipment)),
        `${workout.id}: unavailable equipment for ${item.exerciseId}`);
    }
  }

  const beforeRain = normalized(workout);
  assert.deepEqual(normalized(applyAdaptations(workout, emptyAnswers).blocks), beforeRain.blocks, 'no implicit rain substitutions');
  const rainy = applyAdaptations(workout, { ...emptyAnswers, rain: true });
  assert.deepEqual(normalized(workout), beforeRain, 'rain adaptation does not mutate scheduled/frozen definitions');
  assert.ok(rainy.rules.some((rule) => rule.id === 'rain'));
  assert.equal(rainy.blocks.length, workout.blocks.length);
  rainy.blocks.forEach((block, blockIndex) => {
    const before = workout.blocks[blockIndex]!;
    assert.equal(block.items.length, before.items.length);
    block.items.forEach((item, itemIndex) => {
      const previous = before.items[itemIndex]!;
      if (rainSources.has(previous.exerciseId)) {
        changedRainItems++;
        observedRainSources.add(previous.exerciseId);
        assert.equal(item.exerciseId, 'spinning-bike');
        assert.equal(item.distance, undefined);
        assert.equal(item.reps, undefined);
        assert.ok(item.duration);
        assert.match(item.instructions!, /Modo lluvia/);
      } else if (previous.exerciseId.startsWith('trx-')) {
        changedRainItems++;
        observedRainSources.add(previous.exerciseId);
        assert.equal(item.exerciseId, 'band-face-pull');
        assert.match(item.instructions!, /Modo lluvia/);
      } else {
        assert.deepEqual(item, previous, `rain must not alter unaffected ${previous.exerciseId}`);
      }
      assert.ok(EXERCISE_MAP[item.exerciseId], `rain substitution must use real catalog ID: ${item.exerciseId}`);
    });
    if (before.kind === 'finisher' && before.items.some((item) => rainSources.has(item.exerciseId) || item.exerciseId.startsWith('trx-'))) {
      assert.notEqual(
        hybridComparableKey(createHybridResult(before, workout.id)),
        hybridComparableKey(createHybridResult(block, workout.id)),
        'rain substitutions invalidate same-WOD benchmark equivalence',
      );
    }
  });
}
assert.ok(v8GymCount >= 30, 'test covers future V8 prescriptions throughout the cycle');
assert.ok(changedRainItems > 0);
for (const id of ['block-run', 'zone2-run', 'threshold-run', 'jump-rope', 'trx-row'])
  assert.ok(observedRainSources.has(id), `rain coverage includes ${id}`);
assert.deepEqual(normalized(migrated), normalized(migrate(normalized(migrated))), 'program/rain reads never mutate state');
console.log(`V8 migration QA passed: preserved dates/records/snapshots/unknown fields, idempotent reloads, ${v8GymCount} three-block gym workouts, 112 catalog-validated sessions and ${changedRainItems} selective rain substitutions.`);
