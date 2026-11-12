import assert from 'node:assert/strict';
import {
  clearSessionResume,
  readSessionResume,
  saveSessionResume,
  timerStorageKey,
} from '../src/lib/session-resume';

const values = new Map<string, string>();
Object.defineProperty(globalThis, 'window', {
  configurable: true,
  value: {
    localStorage: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => { values.set(key, value); },
      removeItem: (key: string) => { values.delete(key); },
    },
  },
});

const position = {
  workoutId: 'week-1-day-1',
  blockIndex: 2,
  view: 'exercise' as const,
  exerciseIndex: 3,
  timerBlockId: 'amrap-block',
  restTimer: { seconds: 75, next: 'Sentadilla · serie 2', blockIndex: 2 },
};

saveSessionResume(position);
assert.deepEqual(readSessionResume(), position, 'the active workout position survives a reload');
assert.deepEqual(readSessionResume(position.workoutId), position, 'a matching workout restores its position');
assert.equal(readSessionResume('another-workout'), null, 'a different workout cannot inherit this position');
assert.equal(timerStorageKey(position.workoutId, 'block:amrap-block'), 'tide.timer.v1:week-1-day-1:block%3Aamrap-block');

values.set('tide.session-resume.v1', '{invalid json');
assert.equal(readSessionResume(), null, 'corrupt UI state is ignored safely');

saveSessionResume(position);
clearSessionResume();
assert.equal(readSessionResume(), null, 'leaving a workout clears the active route');

console.log('Session resume QA passed: restores workout, block, view and exercise; ignores invalid or mismatched state.');
