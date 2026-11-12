import assert from 'node:assert/strict';
import { buildFourWeekMesocycle, FOUR_WEEK_PHASES, FOUR_WEEK_PLAN_ID } from '../src/data/mesocycle';
import { buildV7 } from '../src/data/v7';
import { integrateFourWeekMesocycle } from '../src/lib/plan-reset';
import { emptyState } from '../src/lib/storage';
import { buildScheduledProgram } from '../src/data/v8';

const today = '2026-10-30';
const priorProgram = buildV7('2026-10-12');
const oldWorkout = priorProgram[0]!;
const state = {
  ...emptyState(),
  programStart: '2026-10-12',
  v8From: '2026-10-20',
  schedule: { 'old-workout': '2026-11-02' },
  skippedWorkouts: ['old-workout'],
  profile: { ...emptyState().profile, name: 'Athlete' },
  history: [{ workoutId: oldWorkout.id, date: oldWorkout.date }] as never[],
  sessions: {
    [oldWorkout.id]: {
      workoutId: oldWorkout.id,
      date: oldWorkout.date,
      startedAt: 1,
      elapsedMs: 20,
      blockIndex: 1,
      activeKey: null,
      sets: { squat: [{ done: true, load: '80 kg', reps: '5' }] },
      skipped: [],
      substitutions: {},
    },
  },
  metrics: { weight: [{ date: '2026-10-20', value: 80 }] },
  nutrition: { '2026-10-20': { date: '2026-10-20', water: 2 } } as never,
  calendarOverrides: {
    '2026-10-25': 'rest',
    '2026-10-30': 'running',
    '2026-11-01': 'gym',
  } as never,
};

const integrated = integrateFourWeekMesocycle(state, today);
assert.equal(integrated.programStart, today);
assert.equal(integrated.activePlan, FOUR_WEEK_PLAN_ID);
assert.deepEqual(integrated.phaseSettings, {
  names: FOUR_WEEK_PHASES,
  deloadWeeks: [4, 8, 12, 16],
});
assert.deepEqual(integrated.schedule, {});
assert.deepEqual(integrated.skippedWorkouts, []);
assert.deepEqual(integrated.calendarOverrides, { '2026-10-25': 'rest' });
assert.deepEqual(integrated.history, state.history);
assert.deepEqual(integrated.sessions, state.sessions);
assert.deepEqual(integrated.profile, state.profile);
assert.deepEqual(integrated.metrics, state.metrics);
assert.deepEqual(integrated.nutrition, state.nutrition);

const program = buildFourWeekMesocycle(today);
assert.equal(program.length, 16 * 7, 'the 4-week routine repeats across TIDE’s 16-week calendar');
assert.equal(program[0]!.date, today);
assert.equal(program[0]!.week, 1);
assert.notEqual(program[0]!.id, oldWorkout.id, 'new cycle identities do not collide with retained history');
assert.equal(program[0]!.name, program[28]!.name, 'the S1 workout repeats in the next four-week cycle');
assert.ok(program[0]!.subtitle.includes('S1'));
assert.ok(program[7]!.subtitle.includes('S2'));
assert.ok(program[14]!.subtitle.includes('S3'));
assert.ok(program[21]!.subtitle.includes('S4'));
assert.ok(program[0]!.blocks.some(block => block.kind === 'fuerza'));
assert.ok(program[0]!.blocks.flatMap(block => block.items).some(item => item.load?.startsWith('~')),
  'source load estimates remain suggestions in prescriptions, not session results');

const scheduled = buildScheduledProgram(today, integrated);
assert.equal(scheduled.length, program.length);
assert.equal(scheduled[0]!.id, program[0]!.id);
assert.equal(scheduled[0]!.date, today);
assert.equal(scheduled.find(workout => workout.id === oldWorkout.id), undefined);

console.log('Four-week mesocycle QA passed: starts today, repeats four source weeks across TIDE’s calendar, and preserves historical data.');
