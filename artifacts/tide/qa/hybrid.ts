import assert from 'node:assert/strict';
import type { WorkoutBlock } from '../src/types';
import {
  completeDistanceInterval, completeHybridRound, computeHybridElapsed, correctHybrid,
  createHybridResult, distanceIntervalPhase, endIntervalRest, finishHybrid,
  hybridComparableKey, hybridStats, isHybridBlock, pauseHybrid, recordIntervalScore,
  setHybridPartial, startHybrid, undoHybridRound,
} from '../src/lib/hybrid';

const epoch = Date.parse('2026-10-19T12:00:00.000Z');
const at = (seconds: number) => epoch + seconds * 1000;
const prescription: WorkoutBlock = {
  id: 'hybrid-1', kind: 'finisher', index: 3, title: 'QA AMRAP',
  duration: '15 min', minutes: 15, capMinutes: 15, format: 'amrap',
  formatLabel: 'AMRAP 15 MIN', scoreType: 'rounds-reps',
  items: [
    { exerciseId: 'kb-swing', reps: '12', load: 'KB 20 kg', order: '1' },
    { exerciseId: 'push-press', reps: '8', load: '30 kg', order: '2' },
  ],
};

// Only fixtures in this QA file: no results are seeded into production.
let result = createHybridResult(prescription, 'qa-session');
assert.equal(result.status, 'idle');
assert.equal(result.splits.length, 0);
assert.equal(hybridStats(result).mean, undefined);
assert.equal(isHybridBlock(prescription), true);
result = startHybrid(result, at(0));
assert.equal(computeHybridElapsed(result, at(30)), 30);
assert.equal(computeHybridElapsed(result, at(-20)), 0, 'backwards clock cannot produce negative active time');
assert.equal(startHybrid(result, at(1)), result, 'duplicate start is ignored');

result = completeHybridRound(result, at(120));
assert.equal(result.completedRounds, 1);
assert.equal(result.splits[0]!.splitSec, 120);
assert.equal(hybridStats(result).delta, undefined, 'one split is not a pacing decline');
assert.equal(completeHybridRound(result, at(120.1)), result, 'double tap is ignored');
assert.equal(result.activeElapsedSec, 120, 'user event checkpoints active elapsed');
result = pauseHybrid(result, at(150));
assert.equal(computeHybridElapsed(result, at(250)), 150);
assert.equal(pauseHybrid(result, at(200)), result);
result = startHybrid(result, at(210));
assert.equal(result.pausedSec, 60);
result = completeHybridRound(result, at(300));
assert.equal(result.splits[1]!.elapsedSec, 240);
assert.equal(result.splits[1]!.splitSec, 120, 'pause excluded from split');
result = completeHybridRound(result, at(450));
result = completeHybridRound(result, at(600));
assert.equal(result.completedRounds, 4);
assert.deepEqual(result.splits.map((s) => s.splitSec), [120, 120, 150, 150]);
assert.equal(hybridStats(result).mean, 135);
assert.equal(hybridStats(result).delta, 30);
assert.equal(hybridStats(result).deviation, 15);

result = setHybridPartial(result, 9, [
  { exerciseId: 'kb-swing', value: 9, unit: 'reps' },
  { exerciseId: 'threshold-run', value: 100, unit: 'm' },
], at(601));
assert.equal(result.partialReps, 9);
assert.equal(result.partialDetails?.[1]?.unit, 'm');
assert.throws(() => setHybridPartial(result, -1, [], at(602)));
const beforeUndo = result;
result = undoHybridRound(result, at(605));
assert.equal(result.completedRounds, 3);
assert.equal(result.events.at(-1)?.type, 'undo_round');
assert.deepEqual(result.events.at(-1)?.before, beforeUndo.splits.at(-1));
assert.throws(() => undoHybridRound(result, at(700)), /ventana/);
result = completeHybridRound(result, at(610));
assert.equal(result.completedRounds, 4);

// Reload/offline/background reconstruction uses stored wall anchor, no interval counter.
const reloaded = JSON.parse(JSON.stringify(result)) as typeof result;
assert.equal(computeHybridElapsed(reloaded, at(800)), 740);
assert.equal(computeHybridElapsed(reloaded, at(500)), reloaded.activeElapsedSec);
const capped = finishHybrid(reloaded, at(1000), true);
assert.equal(capped.activeElapsedSec, 900);
assert.equal(capped.status, 'finished');
assert.equal(capped.dnf, false);
assert.equal(finishHybrid(capped, at(1010)), capped);
assert.equal(capped.partialReps, 9);
assert.equal(capped.pausedSec, 60);
assert.throws(() => completeHybridRound(reloaded, at(1000)), /cap/);
const outside = completeHybridRound(capped, at(1003), true);
assert.equal(outside.splits.at(-1)!.elapsedSec, 903);
assert.match(outside.events.at(-1)!.reason!, /confirmada/);
assert.equal(completeHybridRound(capped, at(1003)), capped);

const amended = correctHybrid(capped, { activeElapsedSec: 901, completedRounds: 5 }, 'Error al pulsar el botón', at(1010));
assert.equal(amended.completedRounds, 5);
assert.equal(amended.splits.length, capped.splits.length, 'never fabricate missing splits');
assert.equal(amended.events.at(-1)!.type, 'correction');
assert.ok(amended.events.at(-1)!.before);
assert.throws(() => correctHybrid(capped, { partialReps: 1 }, '   ', at(1011)), /motivo/);
assert.throws(() => correctHybrid(reloaded, { activeElapsedSec: 10 }, 'QA', at(1011)), /Pausá/);
assert.throws(() => correctHybrid(capped, { completedRounds: 1.5 }, 'QA', at(1011)), /enteras/);
assert.throws(() => correctHybrid(capped, { activeElapsedSec: 10 }, 'QA', at(1011)), /splits/);
const splitFix = correctHybrid(capped, {
  splits: capped.splits.map((s, i) => ({ ...s, elapsedSec: i === 0 ? 121 : s.elapsedSec })),
}, 'Primer toque registrado un segundo antes', at(1012));
assert.equal(splitFix.splits[0]!.splitSec, 121);
assert.equal(splitFix.splits[1]!.splitSec, 119);
assert.equal(splitFix.splits[0]!.source, 'manual');

const roundsBlock: WorkoutBlock = { ...prescription, format: 'for-time', rounds: 2, capMinutes: 5 };
let rounds = startHybrid(createHybridResult(roundsBlock, 'qa-rounds'), at(0));
rounds = completeHybridRound(rounds, at(60));
rounds = completeHybridRound(rounds, at(130));
assert.equal(rounds.format, 'rounds_for_time');
assert.equal(rounds.status, 'finished', 'round target auto-finishes');
assert.equal(rounds.activeElapsedSec, 130);
assert.equal(rounds.dnf, false);
rounds = undoHybridRound(rounds, at(131));
assert.equal(rounds.status, 'paused', 'undo auto-finish does not silently restart a timer');
assert.equal(rounds.completedRounds, 1);
rounds = startHybrid(rounds, at(140));
rounds = completeHybridRound(rounds, at(180));
assert.equal(rounds.status, 'finished');
const dnf = finishHybrid(startHybrid(createHybridResult(roundsBlock, 'qa-dnf'), at(0)), at(400), true);
assert.equal(dnf.activeElapsedSec, 300);
assert.equal(dnf.dnf, true);

const key = hybridComparableKey(result);
const equivalent = { ...result, workoutDefinitionId: 'different-date', definition: { ...result.definition, id: 'other-id', title: 'other title' } };
assert.equal(hybridComparableKey(equivalent), key, 'presentation/identity changes do not prevent comparison');
assert.notEqual(hybridComparableKey({ ...result, workoutVersion: 9 }), key);
assert.notEqual(hybridComparableKey({ ...result, targetSec: 1000 }), key);
for (const definition of [
  { ...prescription, items: [...prescription.items].reverse() },
  { ...prescription, items: prescription.items.map((i, n) => n ? i : { ...i, reps: '15' }) },
  { ...prescription, items: prescription.items.map((i, n) => n ? i : { ...i, load: '12 kg' }) },
  { ...prescription, items: prescription.items.map((i, n) => n ? i : { ...i, exerciseId: 'spinning-bike' }) },
]) assert.notEqual(hybridComparableKey({ ...result, definition }), key, 'order/reps/load/substitution change equivalence');

const runningBlock: WorkoutBlock = {
  ...prescription, id: 'run', kind: 'outdoor', format: 'intervals', capMinutes: undefined,
  rounds: 2, pause: 90, items: [{ exerciseId: 'threshold-run', distance: '400 m' }],
};
let running = startHybrid(createHybridResult(runningBlock, 'qa-run'), at(0));
assert.equal(isHybridBlock(runningBlock), true);
const legacyRunning = { ...runningBlock, format: 'sets' as const, rounds: undefined, pause: undefined,
  rest: '90 s caminata/trote', items: [{ ...runningBlock.items[0]!, sets: 6, rest: '90 s caminata/trote' }] };
assert.equal(isHybridBlock(legacyRunning), true, 'actual V7/V8 distance prescription uses sets, not intervals');
assert.equal(createHybridResult(legacyRunning, 'qa-legacy-running').targetRounds, 6);
assert.equal(createHybridResult(legacyRunning, 'qa-legacy-running').definition.pause, 90);
running = completeDistanceInterval(running, at(100));
assert.equal(running.splits[0]!.splitSec, 100);
assert.equal(distanceIntervalPhase(running, at(120)).remaining, 70);
assert.equal(completeDistanceInterval(running, at(121)), running, 'cannot double-complete while resting');
running = pauseHybrid(running, at(130));
running = startHybrid(running, at(160));
assert.equal(distanceIntervalPhase(running, at(180)).remaining, 40);
assert.equal(endIntervalRest(running, at(200)), running);
running = endIntervalRest(running, at(230));
assert.equal(distanceIntervalPhase(running, at(230)).resting, false);
running = completeDistanceInterval(running, at(320));
assert.equal(running.status, 'finished');
assert.equal(running.splits[1]!.splitSec, 100, 'work split excludes prescribed recovery and explicit pause');
assert.equal(running.activeElapsedSec, 290, 'total includes prescribed recovery, excludes explicit pause');
assert.equal(running.pausedSec, 30);
running = recordIntervalScore(running, 2, 400, 'm', at(321));
assert.deepEqual(running.events.at(-1)!.after, { interval: 2, value: 400, unit: 'm', workSec: undefined, restSec: 90 });

const timed = createHybridResult({ ...prescription, format: 'intervals', capMinutes: undefined, rounds: 3, work: 40, pause: 20 }, 'qa-interval');
assert.equal(timed.targetSec, 160, 'no final unused rest');
assert.equal(timed.targetRounds, 3);
const timedFinished = finishHybrid(startHybrid(timed, at(0)), at(160), true);
assert.equal(timedFinished.completedRounds, 3);
assert.equal(timedFinished.splits.length, 0, 'do not invent manually recorded splits for timed work');
const tabata = createHybridResult({ ...prescription, format: 'tabata-express', capMinutes: undefined, rounds: 2, work: 40, pause: 20 }, 'qa-tabata');
assert.equal(tabata.targetRounds, 4, 'tabata includes each exercise in each round');
assert.equal(createHybridResult({ ...prescription, format: 'chipper' }, 'qa-chipper').format, 'chipper');
assert.equal(createHybridResult({ ...prescription, format: 'ladder' }, 'qa-ladder').format, 'ladder');
assert.equal(createHybridResult({ ...prescription, format: 'for-time', rounds: undefined }, 'qa-time').format, 'for_time');

console.log('Hybrid QA: AMRAP, 4 rounds, partial units, pause/resume, cap, DNF, audited undo/corrections, reload/background, clock reversal, comparable versions and running/timed intervals passed.');
