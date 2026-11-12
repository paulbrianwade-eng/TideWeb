import assert from 'node:assert/strict';
import { emptyState } from '../src/lib/storage';
import { resetPlanFromDate } from '../src/lib/plan-reset';
import { buildScheduledProgram } from '../src/data/v8';

const today = '2026-10-26';
const state = {
  ...emptyState(),
  programStart: '2026-10-12',
  v8From: '2026-10-20',
  schedule: { oldWorkout: '2026-11-02' },
  skippedWorkouts: ['oldWorkout'],
  phaseSettings: { names: ['CUSTOM'], deloadWeeks: [2] },
  profile: { ...emptyState().profile, name: 'Athlete', raceDate: '2027-02-01' },
  history: [{ workoutId: 'old-cycle-w1d1', date: '2026-10-12' }] as never[],
  sessions: { 'old-cycle-w1d1': { workoutId: 'old-cycle-w1d1', date: '2026-10-12', sets: { squat: [{ done: true, load: '80 kg' }] } } } as never,
  metrics: { weight: [{ date: '2026-10-20', value: 80 }] },
  nutrition: { '2026-10-20': { date: '2026-10-20', water: 2 } } as never,
  readiness: { '2026-10-20': { energy: 4 } } as never,
  adjustments: { '2026-10-20': ['rain'] },
  extras: { '2026-10-20': ['walk'] },
  calendarOverrides: {
    '2026-10-25': 'rest',
    '2026-10-26': 'running',
    '2026-11-01': 'gym',
  } as never,
};

const restarted = resetPlanFromDate(state, today);
assert.equal(restarted.programStart, today);
assert.equal(restarted.v8From, today);
assert.deepEqual(restarted.schedule, {});
assert.deepEqual(restarted.skippedWorkouts, []);
assert.deepEqual(restarted.phaseSettings, {
  names: ['FOUNDATION', 'BUILD', 'HYBRID', 'RACE PREP'],
  deloadWeeks: [4, 8, 12, 16],
});
assert.deepEqual(restarted.calendarOverrides, { '2026-10-25': 'rest' }, 'past calendar entries remain; today/future entries reset');
assert.deepEqual(restarted.history, state.history);
assert.deepEqual(restarted.sessions, state.sessions);
assert.deepEqual(restarted.profile, state.profile);
assert.deepEqual(restarted.metrics, state.metrics);
assert.deepEqual(restarted.nutrition, state.nutrition);
assert.deepEqual(restarted.readiness, state.readiness);
assert.deepEqual(restarted.adjustments, state.adjustments);
assert.deepEqual(restarted.extras, state.extras);
const priorCycleMonday = buildScheduledProgram(state.programStart!, state).find(workout => workout.week === 1 && workout.day === 1)!;
const restartedMonday = buildScheduledProgram(restarted.programStart!, restarted).find(workout => workout.week === 1 && workout.day === 1)!;
assert.equal(restartedMonday.date, today);
assert.notEqual(restartedMonday.id, priorCycleMonday.id, 'cycle IDs differ so old history cannot collide with the restarted plan');
assert.ok(restartedMonday.blocks.some(block => block.id.includes('-v8-')), 'week one of the restarted cycle uses V8');
console.log('Plan reset QA passed: starts today; preserves history, active sessions, profile and records; resets cycle/calendar settings.');
