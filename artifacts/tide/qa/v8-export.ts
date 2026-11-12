import assert from 'node:assert/strict';
import { buildProgram } from '../src/data/program';
import type { SessionSummary, WorkoutSession } from '../src/types';
import type { HybridResult } from '../src/types/hybrid';
import { actualSessionStats, exactHybridMatch, hasSpecifiedHybridLoads, hybridStats, initialSessionDurationMin } from '../src/lib/analytics';
import { comparableKey, hybridRows } from '../src/components/v8';
import {
  buildSessionCsv, buildSessionExport, buildSessionRows, escapeCsv, parseImportSessions,
  parseSessionExport, sessionExportFilename, sessionSummaryText,
} from '../src/lib/session-export';
import { buildBackup, buildCoachCsv, buildCoachRows } from '../src/lib/export';
import { emptyState } from '../src/lib/storage';
import { setKey } from '../src/lib/prescription';

const workout = structuredClone(buildProgram()[0]!);
workout.name = 'Fuerza, "motor"\nTécnica é';
const strength = workout.blocks.find((block) => block.kind === 'fuerza')!;
const hybrid = workout.blocks.find((block) => block.kind === 'finisher')!;
const item = strength.items[0]!;
const key = setKey(strength.id, item.exerciseId, 0);
const result: HybridResult = {
  workoutDefinitionId: `${workout.id}:${hybrid.id}`, workoutVersion: 8,
  definition: { ...hybrid, items: hybrid.items.map((entry, index) => ({ ...entry, load: index === 0 ? '20 kg' : '0' })) },
  format: 'amrap', targetSec: 480, status: 'finished', activeElapsedSec: 480,
  pausedSec: 12, completedRounds: 4, partialReps: 7,
  partialDetails: [{ exerciseId: 'bike', value: 120, unit: 'm' }],
  splits: [90, 100, 110, 120].map((splitSec, index, times) => ({
    round: index + 1, splitSec, elapsedSec: times.slice(0, index + 1).reduce((sum, sec) => sum + sec, 0),
    recordedAt: '2026-10-12T12:00:00.000Z', source: 'tap',
  })),
  notes: '=SUM(A1:A2)\n"parcial", sí',
  events: [
    { type: 'pause', at: '2026-10-12T12:00:00.000Z', elapsedSec: 100, reason: 'agua' },
    { type: 'edit', at: '2026-10-12T12:01:00.000Z', elapsedSec: 110, before: 1, after: 2 },
  ],
};
const session: WorkoutSession = {
  workoutId: workout.id, definition: workout, date: workout.date,
  startedAt: 1791806400000, completedAt: 1791809400000, elapsedMs: 3000000,
  blockIndex: 0, activeKey: null, sets: {
    [key]: [{ done: true, load: '32,5', reps: '8', rpe: 7 }, { done: false }],
  }, skipped: ['skipped-exercise'], substitutions: { [key]: 'goblet-squat' },
  completedBlocks: [strength.id], hybridResults: { [hybrid.id]: result },
  transitions: { lap: { blockId: 'lap', seconds: 75, completedAt: 1791806500000 } },
  painArea: 'rodilla', painExercise: 'sentadilla', painNote: '@nota',
};
const summary: SessionSummary = {
  workoutId: session.workoutId, workoutName: workout.name, date: session.date,
  durationMin: 50, blocksCompleted: 2, blocksTotal: workout.blocks.length,
  volumeKg: 260, setsCompleted: 1, rpe: 8, energy: 6, pain: 2, feeling: null,
  comment: '+riesgo, "especial"\ny segunda línea é', highlight: null, personalRecord: null,
  coachNote: '', dataSource: 'manual', painArea: 'rodilla', painExercise: 'sentadilla', painNote: 'nota',
};
const complete = buildSessionExport(session, { ...summary, calories: 420, avgHr: 140, maxHr: 171, dataSource: 'Garmin' },
  workout, '2026-10-12T13:00:00.000Z', 'America/Argentina/Buenos_Aires');
const json = JSON.stringify(complete);
assert.deepEqual(parseSessionExport(json), JSON.parse(json), 'complete session round-trips exactly (JSON omits undefined)');
const unknown = JSON.parse(json);
unknown.session.futureField = { revision: 19 };
unknown.session.hybridResults[hybrid.id].futureSensor = ['preserved'];
assert.deepEqual(parseSessionExport(JSON.stringify(unknown)), unknown, 'unknown fields survive validation');
assert.deepEqual(parseImportSessions(JSON.stringify(unknown))[0]!.session, unknown.session);
const noWatch = buildSessionExport(session, summary, undefined, complete.exportedAt, complete.timezone);
const noWatchParsed = parseSessionExport(JSON.stringify(noWatch));
assert.equal(noWatchParsed.summary?.calories, undefined);
assert.equal(noWatchParsed.summary?.avgHr, undefined);
assert.equal(noWatchParsed.summary?.maxHr, undefined);
assert(!JSON.stringify(noWatch).includes('"avgHr"'));
assert(!JSON.stringify(noWatch).includes('"profile"'));
assert(!JSON.stringify(noWatch).includes('"age"'));
assert.equal(buildSessionRows(noWatch).find((row) => row.record_type === 'summary')!.avg_hr_bpm, undefined);
const csv = buildSessionCsv(complete);
assert(csv.startsWith('\uFEFFsession_id,'));
assert(csv.includes('"Fuerza, ""motor""\nTécnica é"'));
assert(csv.includes('"\'+riesgo, ""especial""\ny segunda línea é"'));
assert(csv.includes('260'));
assert.equal(escapeCsv(' \t=1+1'), "' \t=1+1");
assert.equal(escapeCsv('@cmd'), "'@cmd");
assert.equal(escapeCsv('-cmd'), "'-cmd");
assert.equal(escapeCsv('+cmd'), "'+cmd");
assert.equal(escapeCsv(0), '0');
assert.equal(escapeCsv(undefined), '');
const rows = buildSessionRows(complete);
assert.equal(rows.filter((row) => row.record_type === 'set').length, 1, 'untouched slots omitted');
assert.deepEqual(rows.filter((row) => row.record_type === 'round').map((row) => row.round_split_sec), [90, 100, 110, 120]);
assert.deepEqual(rows.filter((row) => row.record_type === 'round').map((row) => row.cumulative_sec), [90, 190, 300, 420]);
assert.equal(rows.find((row) => row.record_type === 'hybrid')!.paused_sec, 12);
assert.equal(rows.find((row) => row.record_type === 'hybrid')!.partial_reps, 7);
assert.equal(rows.filter((row) => row.record_type === 'audit').length, 2);
assert.equal(rows.find((row) => row.record_type === 'partial')!.distance_m, 120);
assert.equal(actualSessionStats(session, workout).volumeKg, 260);
assert.equal(actualSessionStats({ ...session, sets: {} }, workout).volumeKg, undefined);
assert.equal(actualSessionStats({ ...session, completedBlocks: [], hybridResults: {}, transitions: {} }, workout).completedBlockIds.length, 0);
assert(exactHybridMatch(result, structuredClone(result)));
assert(!exactHybridMatch(result, { ...result, targetSec: 600 }));
const anotherDate = { ...structuredClone(result), workoutDefinitionId: 'other-date-workout',
  definition: { ...structuredClone(result.definition), id: 'other-date-block', title: 'Otro título' } };
assert(exactHybridMatch(result, anotherDate), 'date-specific identities and labels do not prevent comparison');
assert.equal(comparableKey(result), comparableKey(anotherDate), 'progress uses canonical hybrid matcher');
assert(!exactHybridMatch(result, { ...result, definition: { ...result.definition, rest: '99 s' } }));
assert(!exactHybridMatch(result, { ...result, definition: { ...result.definition, pause: 99 } }));
assert(!exactHybridMatch(result, { ...result, definition: { ...result.definition, items: result.definition.items.map((entry, index) =>
  index === 0 ? { ...entry, load: '22 kg' } : entry) } }));
const unknownLoads = { ...result, definition: { ...result.definition, items: result.definition.items.map((entry) => ({ ...entry, load: undefined })) } };
const prescribedLoads = { ...result, definition: { ...result.definition, items: result.definition.items.map((entry) => ({ ...entry, load: 'Misma barra · confirmar kg' })) } };
assert(!hasSpecifiedHybridLoads(unknownLoads));
assert(!exactHybridMatch(unknownLoads, structuredClone(unknownLoads)), 'two absent loads are not comparable');
assert(!exactHybridMatch(prescribedLoads, structuredClone(prescribedLoads)), 'identical unknown prescriptions are not actual loads');
assert.equal(comparableKey(unknownLoads), undefined);
const unknownRows = hybridRows({
  first: { ...session, workoutId: 'first', hybridResults: { block: unknownLoads } },
  second: { ...session, workoutId: 'second', hybridResults: { block: unknownLoads } },
});
assert.notEqual(unknownRows[0]!.key, unknownRows[1]!.key, 'progress isolates attempts with unknown loads');
assert.equal(initialSessionDurationMin(undefined, summary), undefined, 'no session means no fabricated duration');
assert.equal(initialSessionDurationMin(session, undefined, 1), 50, 'actual completed timestamps take precedence over current time');
assert.equal(initialSessionDurationMin({ ...session, startedAt: NaN, completedAt: undefined, elapsedMs: 0 }), undefined);
assert.equal(initialSessionDurationMin({ ...session, startedAt: NaN, completedAt: undefined, elapsedMs: 120000 }), 2);
assert.equal(initialSessionDurationMin(session, { ...summary, durationMin: NaN }), 50);
assert.equal(hybridStats(result).pacingDropSec, 30);
assert(sessionExportFilename(complete, 'csv').startsWith('TIDE_2026-10-12_'));
assert(sessionSummaryText(noWatch).includes('FC media/máx: sin dato/sin dato'));
const legacy = buildSessionExport({ ...session, definition: undefined }, summary, workout);
assert.equal(legacy.definition, null, 'current plan never masquerades as a historical snapshot');
assert.equal(parseSessionExport(JSON.stringify(legacy)).definitionSource, 'unavailable');
const state = emptyState();
state.profile.name = 'PRIVATE PERSON';
state.sessions[session.workoutId] = session;
state.history = [summary];
assert.equal(parseImportSessions(JSON.stringify(buildBackup(state))).length, 1);
assert.equal(buildCoachCsv(state, [workout]).rowCount > 0, true, 'coach API remains compatible');
const globalRows = buildCoachRows(state, [workout]);
const globalCsv = buildCoachCsv(state, [workout]).csv;
assert(globalCsv.startsWith('\uFEFFrecord_type,date,week,day,workout_id,workout_name,'));
for (const column of ['round_number', 'round_split_sec', 'cumulative_sec', 'partial_reps',
  'paused_sec', 'timezone', 'source', 'definition_id', 'event_type', 'details_json']) {
  assert(globalCsv.split('\r\n')[0]!.includes(column), `global CSV includes ${column}`);
}
assert.deepEqual(globalRows.filter((row) => row.record_type === 'round').map((row) => row.round_split_sec), [90, 100, 110, 120]);
assert.deepEqual(globalRows.filter((row) => row.record_type === 'round').map((row) => row.cumulative_sec), [90, 190, 300, 420]);
const globalHybrid = globalRows.find((row) => row.record_type === 'hybrid')!;
assert.equal(globalHybrid.partial_reps, 7);
assert.equal(globalHybrid.paused_sec, 12);
assert.equal(globalHybrid.duration_sec, 480);
assert.equal(globalHybrid.definition_id, result.workoutDefinitionId);
assert.equal(globalHybrid.source, 'timer');
assert.deepEqual(JSON.parse(String(globalHybrid.definition_json)), JSON.parse(JSON.stringify(result.definition)));
assert.equal(globalRows.find((row) => row.record_type === 'partial')!.distance_m, 120);
const globalAudits = globalRows.filter((row) => row.record_type === 'audit');
assert.deepEqual(globalAudits.map((row) => row.event_type), ['pause', 'edit']);
assert.equal(JSON.parse(String(globalAudits[1]!.details_json)).after, 2);
assert.equal(globalRows.filter((row) => row.record_type === 'session').length, 1, 'summary row not duplicated');
assert(!globalCsv.includes('PRIVATE PERSON'), 'global coach CSV excludes profile name');
assert(!globalCsv.includes('profile'), 'global coach CSV excludes profile');
assert(globalCsv.includes('"\'=SUM(A1:A2)\n""parcial"", sí"'), 'global hybrid notes escape formulas and quotes');
const noSetState = { ...state, history: [], sessions: {
  [session.workoutId]: { ...session, sets: {}, elapsedMs: 0, completedAt: undefined },
} };
const noSetRows = buildCoachRows(noSetState, []);
assert.equal(noSetRows.filter((row) => row.record_type === 'round').length, 4, 'hybrid-only sessions export splits');
const unsummarized = noSetRows.find((row) => row.record_type === 'session')!;
assert.equal(unsummarized.duration, undefined, 'ongoing session does not invent duration');
assert.equal(unsummarized.avg_hr, undefined);
assert.equal(unsummarized.calories, undefined);
const emptySessionState = { ...state, history: [], sessions: {
  empty: { ...session, workoutId: 'empty', sets: {}, hybridResults: {}, transitions: {}, substitutions: {},
    definition: undefined, completedBlocks: undefined, elapsedMs: 0, completedAt: undefined },
} };
assert.equal(buildCoachRows(emptySessionState, []).filter((row) => row.record_type === 'session').length, 1,
  'sessions export even without sets, hybrids or summary');
assert(!buildCoachCsv(noSetState, []).csv.includes('PRIVATE PERSON'));
assert(!JSON.stringify(complete).includes('PRIVATE PERSON'));
assert.throws(() => parseSessionExport('{"schema":"tide-session","schemaVersion":999}'));
assert.throws(() => parseSessionExport(JSON.stringify({ ...complete, sessionId: 'different' })));
assert.throws(() => parseSessionExport('{"__proto__":{"polluted":true}}'));
const broken = JSON.parse(json);
broken.session.hybridResults[hybrid.id].splits[0].splitSec = 'NaN';
assert.throws(() => parseSessionExport(JSON.stringify(broken)));
const brokenDefinition = JSON.parse(json);
delete brokenDefinition.session.hybridResults[hybrid.id].definition;
assert.throws(() => parseSessionExport(JSON.stringify(brokenDefinition)));
console.log('V8 export QA: complete/no-watch round-trips, privacy, CSV safety, splits, partials, pauses, audit, stats, backup and validation passed.');
