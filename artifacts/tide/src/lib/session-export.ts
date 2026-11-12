import type { AppState, SessionSummary, Workout, WorkoutSession } from '../types';
import { getExercise } from '../data/exercises';
import { actualSessionStats, recordedNumber } from './analytics';

export interface SessionExport {
  schema: 'tide-session';
  schemaVersion: 1;
  app: 'TIDE';
  exportedAt: string;
  timezone: string;
  sessionId: string;
  dataSource: 'manual' | 'Garmin';
  units: Record<string, string>;
  definitionSource: 'snapshot' | 'unavailable';
  definition: Workout | null;
  session: WorkoutSession;
  summary: SessionSummary | null;
}

export const buildSessionExport = (
  session: WorkoutSession,
  summary?: SessionSummary,
  _workout?: Workout,
  exportedAt = new Date().toISOString(),
  timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
): SessionExport => ({
  schema: 'tide-session', schemaVersion: 1, app: 'TIDE', exportedAt, timezone,
  sessionId: session.workoutId,
  dataSource: summary?.dataSource ?? session.dataSource ?? 'manual',
  units: {
    'session.sets.load': 'kg (numeric strings only; other strings are raw annotations)',
    'session.sets.reps': 'repetitions',
    'session.elapsedMs': 'milliseconds',
    'session.startedAt': 'epoch milliseconds',
    'session.completedAt': 'epoch milliseconds',
    'session.transitions.seconds': 'seconds',
    'session.transitions.distanceM': 'metres',
    'session.hybridResults.activeElapsedSec': 'seconds',
    'session.hybridResults.pausedSec': 'seconds',
    'session.hybridResults.splits.elapsedSec': 'cumulative active seconds',
    'session.hybridResults.splits.splitSec': 'seconds',
    'session.hybridResults.partialReps': 'repetitions',
    'session.hybridResults.partialDetails': 'unit stored per entry',
    'summary.durationMin': 'minutes',
    'summary.calories': 'kcal',
    'summary.avgHr': 'bpm',
    'summary.maxHr': 'bpm',
    'summary.volumeKg': 'kg × repetitions (recorded numeric load/reps only)',
  },
  // Never mislabel today's program as an old session's canonical prescription.
  definitionSource: session.definition ? 'snapshot' : 'unavailable',
  definition: session.definition ?? null,
  session,
  summary: summary ?? null,
});

type Row = Record<string, string | number | boolean | null | undefined>;
export const SESSION_COLUMNS = [
  'session_id', 'date', 'timezone', 'schema_version', 'week', 'phase', 'session_name',
  'block', 'block_type', 'record_type', 'exercise', 'exercise_id', 'set_number',
  'reps', 'load_kg', 'load_raw', 'distance_m', 'duration_sec', 'round_number',
  'round_split_sec', 'cumulative_sec', 'partial_reps', 'completed', 'rpe', 'energy',
  'pain', 'pain_area', 'pain_exercise', 'pain_note', 'calories_kcal', 'avg_hr_bpm',
  'max_hr_bpm', 'notes', 'data_source', 'substitution', 'paused_sec', 'event_type',
  'recorded_at', 'volume_kg', 'sets_completed', 'blocks_completed', 'blocks_total', 'details_json',
] as const;

export const escapeCsv = (value: Row[string]): string => {
  let text = value == null ? '' : String(value);
  if (typeof value === 'string' && /^[\s\uFEFF]*[=+\-@]|^[\t\r\n]/.test(text)) text = `'${text}`;
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

export const buildSessionRows = (payload: SessionExport): Row[] => {
  const { session, summary, definition } = payload;
  const base: Row = {
    session_id: payload.sessionId, date: session.date, timezone: payload.timezone,
    schema_version: payload.schemaVersion, week: definition?.week, phase: definition?.phase,
    session_name: definition?.name ?? summary?.workoutName, data_source: 'manual',
  };
  const rows: Row[] = [];
  const push = (row: Row) => rows.push({ ...base, ...row });
  const blockFields = (id: string): Row => {
    const block = definition?.blocks.find((candidate) => candidate.id === id);
    return { block: id, block_type: block?.kind };
  };
  Object.entries(session.sets).forEach(([key, sets]) => {
    const parts = key.split(':');
    const blockId = parts.length >= 3 ? parts[0] : '';
    const exerciseId = parts.length >= 3 ? parts.slice(1, -1).join(':') : key;
    sets.forEach((set, index) => {
      // Untouched UI slots are not observations.
      if (!set.done && set.load === undefined && set.reps === undefined && set.rpe === undefined) return;
      push({
        ...blockFields(blockId), record_type: 'set', exercise_id: exerciseId,
        exercise: getExercise(session.substitutions[key] ?? exerciseId).name,
        set_number: index + 1, reps: set.reps, load_kg: recordedNumber(set.load), load_raw: set.load,
        completed: set.done, rpe: set.rpe, substitution: session.substitutions[key],
        details_json: JSON.stringify({ key, ...set }),
      });
    });
  });
  Object.values(session.transitions ?? {}).forEach((transition) => push({
    ...blockFields(transition.blockId), record_type: 'transition', distance_m: transition.distanceM,
    duration_sec: transition.seconds, completed: true, rpe: transition.rpe,
    notes: [transition.feeling, transition.comment].filter(Boolean).join(' · '),
    recorded_at: new Date(transition.completedAt).toISOString(), details_json: JSON.stringify(transition),
  }));
  Object.entries(session.hybridResults ?? {}).forEach(([id, result]) => {
    const context = blockFields(id);
    push({ ...context, record_type: 'hybrid', data_source: 'timer', duration_sec: result.activeElapsedSec,
      paused_sec: result.pausedSec, partial_reps: result.partialReps,
      completed: result.status === 'finished' && !result.dnf, notes: result.notes,
      details_json: JSON.stringify(result) });
    result.splits.forEach((split) => push({ ...context, record_type: 'round',
      round_number: split.round, round_split_sec: split.splitSec, cumulative_sec: split.elapsedSec,
      recorded_at: split.recordedAt, data_source: split.source, completed: true }));
    result.partialDetails?.forEach((partial) => push({ ...context, record_type: 'partial',
      exercise_id: partial.exerciseId, reps: partial.unit === 'reps' ? partial.value : undefined,
      distance_m: partial.unit === 'm' ? partial.value : undefined,
      duration_sec: partial.unit === 'sec' || partial.unit === 's' ? partial.value : undefined,
      details_json: JSON.stringify(partial) }));
    result.events.forEach((event) => push({ ...context, record_type: 'audit', data_source: 'app',
      event_type: event.type, cumulative_sec: event.elapsedSec, recorded_at: event.at,
      notes: event.reason, details_json: JSON.stringify(event) }));
  });
  Object.entries(session.substitutions).forEach(([key, substitution]) => push({
    record_type: 'substitution', exercise_id: key, substitution,
  }));
  session.skipped.forEach((key) => push({ record_type: 'skipped', exercise_id: key, completed: false }));
  session.completedBlocks?.forEach((id) => push({ ...blockFields(id), record_type: 'block', completed: true }));
  if (session.finisherScore) push({ record_type: 'finisher', notes: session.finisherScore.note,
    details_json: JSON.stringify(session.finisherScore) });
  const stats = actualSessionStats(session, definition ?? undefined);
  push({ record_type: 'summary', data_source: payload.dataSource,
    duration_sec: summary ? summary.durationMin * 60 : session.elapsedMs > 0 ? session.elapsedMs / 1000 : undefined,
    rpe: summary?.rpe, energy: summary?.energy, pain: summary?.pain,
    pain_area: summary?.painArea ?? session.painArea, pain_exercise: summary?.painExercise ?? session.painExercise,
    pain_note: summary?.painNote ?? session.painNote, calories_kcal: summary?.calories,
    avg_hr_bpm: summary?.avgHr, max_hr_bpm: summary?.maxHr, notes: summary?.comment,
    volume_kg: stats.volumeKg, sets_completed: stats.setsCompleted,
    blocks_completed: summary?.blocksCompleted, blocks_total: summary?.blocksTotal,
    completed: session.completedAt !== undefined, details_json: summary ? JSON.stringify(summary) : undefined });
  return rows;
};

export const buildSessionCsv = (payload: SessionExport): string =>
  `\uFEFF${[SESSION_COLUMNS.join(','), ...buildSessionRows(payload).map((row) =>
    SESSION_COLUMNS.map((column) => escapeCsv(row[column])).join(','))].join('\r\n')}`;

export const sessionExportFilename = (payload: SessionExport, extension: 'csv' | 'json'): string => {
  const slug = (payload.definition?.name ?? payload.summary?.workoutName ?? payload.sessionId)
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9_-]+/g, '-').slice(0, 80) || 'sesion';
  return `TIDE_${payload.session.date.slice(0, 10)}_${slug}.${extension}`;
};

export const sessionSummaryText = (payload: SessionExport): string => {
  const { session, summary, definition } = payload;
  const stats = actualSessionStats(session, definition ?? undefined);
  return [
    `TIDE · ${definition?.name ?? summary?.workoutName ?? payload.sessionId}`,
    `${session.date} · ${payload.timezone}`,
    `Duración: ${summary ? `${summary.durationMin} min` : 'sin dato'}`,
    `Series registradas: ${stats.setsCompleted} · volumen: ${stats.volumeKg === undefined ? 'sin dato' : `${stats.volumeKg} kg (solo series con carga y reps)`}`,
    `RPE: ${summary?.rpe ?? 'sin dato'} · Energía: ${summary?.energy ?? 'sin dato'} · Dolor: ${summary?.pain ?? 'sin dato'}`,
    summary?.pain ? `Dolor: ${summary.painArea ?? 'sin ubicación'} · ${summary.painExercise ?? ''} · ${summary.painNote ?? ''}` : '',
    ...Object.entries(session.hybridResults ?? {}).map(([id, result]) =>
      `${id}: ${result.completedRounds} vueltas + ${result.partialReps} reps parciales · ${result.activeElapsedSec}s activos · ${result.pausedSec}s pausa${result.dnf ? ' · DNF' : ''}\nSplits: ${result.splits.map((split) => `${split.round}: ${split.splitSec}s`).join(', ') || 'sin dato'}`),
    `Kcal: ${summary?.calories ?? 'sin dato'} · FC media/máx: ${summary?.avgHr ?? 'sin dato'}/${summary?.maxHr ?? 'sin dato'} bpm · Fuente: ${payload.dataSource}`,
    summary?.comment ?? '',
  ].filter(Boolean).join('\n');
};

const object = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);
const finite = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value >= 0;
const id = (value: unknown): value is string => typeof value === 'string' && value.length > 0 &&
  value.length <= 200 && !['__proto__', 'prototype', 'constructor'].includes(value);
const fail = (message: string): never => { throw new Error(`Importación rechazada: ${message}`); };
const parseJson = (text: string): unknown => {
  if (text.length > 15_000_000) fail('archivo demasiado grande (máximo 15 MB).');
  try {
    return JSON.parse(text.replace(/^\uFEFF/, ''), (key, value: unknown) => {
      if (['__proto__', 'prototype', 'constructor'].includes(key)) fail('clave insegura.');
      return value;
    });
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'JSON inválido.');
  }
};

const validateDefinition = (value: unknown): void => {
  if (!object(value) || !id(value.id) || typeof value.name !== 'string' || !Array.isArray(value.blocks)) fail('definición inválida.');
  const definition = value as Record<string, unknown>;
  for (const block of definition.blocks as unknown[]) {
    validateBlock(block);
  }
};
const validateBlock = (value: unknown): void => {
  if (!object(value) || !id(value.id) || typeof value.title !== 'string' ||
    typeof value.kind !== 'string' || !Array.isArray(value.items)) return fail('bloque inválido.');
  if (value.items.some((item) => !object(item) || !id(item.exerciseId))) fail('ejercicio inválido.');
};
const validateSession = (value: unknown): WorkoutSession => {
  if (!object(value)) return fail('sesión inválida.');
  if (!id(value.workoutId) || typeof value.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value.date) ||
    !finite(value.startedAt) || !finite(value.elapsedMs) || !finite(value.blockIndex) ||
    !(value.activeKey === null || typeof value.activeKey === 'string') ||
    !object(value.sets) || !object(value.substitutions) || !Array.isArray(value.skipped)) fail('campos de sesión inválidos.');
  for (const entries of Object.values(value.sets as Record<string, unknown>)) {
    if (!Array.isArray(entries) || entries.some((entry) => !object(entry) || typeof entry.done !== 'boolean' ||
      (entry.load !== undefined && typeof entry.load !== 'string') ||
      (entry.reps !== undefined && typeof entry.reps !== 'string') ||
      (entry.rpe !== undefined && (!finite(entry.rpe) || entry.rpe > 10)))) fail('series inválidas.');
  }
  if (Object.values(value.substitutions as object).some((entry) => typeof entry !== 'string') ||
    (value.skipped as unknown[]).some((entry) => typeof entry !== 'string')) fail('sustituciones inválidas.');
  if (value.completedAt !== undefined && (!finite(value.completedAt) || value.completedAt > 8.64e15)) fail('fecha de cierre inválida.');
  for (const key of ['painArea', 'painExercise', 'painNote']) {
    if (value[key] !== undefined && typeof value[key] !== 'string') fail(`${key} inválido.`);
  }
  if (value.dataSource !== undefined && !['manual', 'Garmin'].includes(String(value.dataSource))) fail('fuente inválida.');
  if (value.choices !== undefined && (!object(value.choices) ||
    Object.values(value.choices).some((entry) => typeof entry !== 'string'))) fail('opciones inválidas.');
  if (value.finisherScore !== undefined) {
    if (!object(value.finisherScore)) fail('score inválido.');
    for (const key of ['rounds', 'reps', 'time', 'distance', 'note']) {
      const entry = (value.finisherScore as Record<string, unknown>)[key];
      if (entry !== undefined && typeof entry !== 'string') fail('score inválido.');
    }
  }
  if (value.definition !== undefined) validateDefinition(value.definition);
  if (value.hybridResults !== undefined) {
    if (!object(value.hybridResults)) fail('resultados híbridos inválidos.');
    for (const entry of Object.values(value.hybridResults as object)) {
      if (!object(entry) || !finite(entry.activeElapsedSec) || !finite(entry.pausedSec) ||
        !finite(entry.completedRounds) || !finite(entry.partialReps) ||
        !id(entry.workoutDefinitionId) || !finite(entry.workoutVersion) ||
        !['amrap', 'for_time', 'rounds_for_time', 'chipper', 'ladder', 'interval'].includes(String(entry.format)) ||
        !['idle', 'running', 'paused', 'finished'].includes(String(entry.status)) ||
        !Array.isArray(entry.splits) || !Array.isArray(entry.events)) fail('resultado híbrido inválido.');
      validateBlock(entry.definition);
      if ((entry.splits as unknown[]).some((split) => !object(split) || !finite(split.round) ||
        !finite(split.splitSec) || !finite(split.elapsedSec) || typeof split.recordedAt !== 'string' ||
        !['tap', 'manual'].includes(String(split.source)))) fail('splits inválidos.');
      if ((entry.events as unknown[]).some((event) => !object(event) || typeof event.type !== 'string' ||
        typeof event.at !== 'string' || !finite(event.elapsedSec) ||
        (event.reason !== undefined && typeof event.reason !== 'string'))) fail('auditoría inválida.');
      if (entry.partialDetails !== undefined && (!Array.isArray(entry.partialDetails) ||
        entry.partialDetails.some((partial: unknown) => !object(partial) || !id(partial.exerciseId) ||
          !finite(partial.value) || typeof partial.unit !== 'string'))) fail('parcial inválido.');
      if (entry.notes !== undefined && typeof entry.notes !== 'string') fail('nota híbrida inválida.');
      for (const key of ['targetSec', 'targetRounds', 'runningSince', 'pausedSince']) {
        if (entry[key] !== undefined && !finite(entry[key])) fail(`híbrido: ${key} inválido.`);
      }
      if (entry.dnf !== undefined && typeof entry.dnf !== 'boolean') fail('DNF inválido.');
    }
  }
  if (value.completedBlocks !== undefined && (!Array.isArray(value.completedBlocks) ||
    value.completedBlocks.some((entry) => typeof entry !== 'string'))) fail('bloques completados inválidos.');
  if (value.transitions !== undefined) {
    if (!object(value.transitions)) fail('transiciones inválidas.');
    for (const entry of Object.values(value.transitions as object)) {
      if (!object(entry) || !id(entry.blockId) || !finite(entry.seconds) ||
        !finite(entry.completedAt) || entry.completedAt > 8.64e15) fail('transición inválida.');
      for (const key of ['distanceM', 'rpe']) if (entry[key] !== undefined && !finite(entry[key])) fail(`transición: ${key} inválido.`);
      for (const key of ['comment', 'feeling']) if (entry[key] !== undefined && typeof entry[key] !== 'string') fail(`transición: ${key} inválido.`);
    }
  }
  return value as unknown as WorkoutSession;
};
const validateSummary = (value: unknown, sessionId: string): SessionSummary => {
  if (!object(value) || value.workoutId !== sessionId || typeof value.workoutName !== 'string' ||
    typeof value.date !== 'string') return fail('resumen incompatible.');
  for (const key of ['durationMin', 'blocksCompleted', 'blocksTotal', 'setsCompleted', 'rpe', 'energy', 'pain']) {
    if (!finite(value[key])) fail(`resumen: ${key} inválido.`);
  }
  for (const key of ['calories', 'avgHr', 'maxHr', 'volumeKg', 'transitionsDone', 'bestTransitionSec', 'cardioSeconds']) {
    if (value[key] !== undefined && !finite(value[key])) fail(`${key} inválido.`);
  }
  if ((value.rpe as number) > 10 || (value.energy as number) > 10 || (value.pain as number) > 10) fail('escalas fuera de rango.');
  for (const key of ['comment', 'coachNote']) if (typeof value[key] !== 'string') fail(`${key} inválido.`);
  for (const key of ['painArea', 'painExercise', 'painNote', 'highlight', 'personalRecord']) {
    if (value[key] != null && typeof value[key] !== 'string') fail(`${key} inválido.`);
  }
  if (value.dataSource !== undefined && !['manual', 'Garmin'].includes(String(value.dataSource))) fail('fuente inválida.');
  if (value.timeByBlock !== undefined && (!object(value.timeByBlock) ||
    Object.values(value.timeByBlock).some((entry) => !finite(entry)))) fail('tiempos de bloques inválidos.');
  if (value.feeling !== null && !['fresco', 'justo', 'destruido'].includes(String(value.feeling))) fail('sensación inválida.');
  return value as unknown as SessionSummary;
};

/** Validation is non-destructive: unknown fields are retained, not projected away. */
export const parseSessionExport = (input: string | unknown): SessionExport => {
  const value = typeof input === 'string' ? parseJson(input) : input;
  if (!object(value) || value.schema !== 'tide-session' || value.schemaVersion !== 1 ||
    value.app !== 'TIDE' || !id(value.sessionId) || typeof value.timezone !== 'string' ||
    typeof value.exportedAt !== 'string' || !Number.isFinite(Date.parse(value.exportedAt)) ||
    !['manual', 'Garmin'].includes(String(value.dataSource))) return fail('formato o versión no compatible.');
  const session = validateSession(value.session);
  if (session.workoutId !== value.sessionId) fail('identidad inconsistente.');
  if (value.definition !== null) {
    validateDefinition(value.definition);
    if (!object(value.definition) || value.definition.id !== value.sessionId) fail('definición de otra sesión.');
  }
  if (!['snapshot', 'unavailable'].includes(String(value.definitionSource)) ||
    (value.definitionSource === 'snapshot') !== (value.definition !== null)) fail('origen de definición inconsistente.');
  if (session.definition && (!object(value.definition) ||
    JSON.stringify(session.definition) !== JSON.stringify(value.definition))) fail('snapshots contradictorios.');
  if (value.summary !== null) validateSummary(value.summary, value.sessionId);
  return value as unknown as SessionExport;
};

/** Backup imports only add session/summary pairs; never replace profile or existing IDs. */
export const parseImportSessions = (text: string): { session: WorkoutSession; summary?: SessionSummary }[] => {
  const value = parseJson(text);
  if (object(value) && value.schema === 'tide-backup-v1') {
    if (!object(value.state) || !object(value.state.sessions) || !Array.isArray(value.state.history)) return fail('backup inválido.');
    const state = value.state as unknown as AppState;
    return Object.entries(state.sessions).map(([key, candidate]) => {
      const session = validateSession(candidate);
      if (session.workoutId !== key) fail('identidad de backup inconsistente.');
      const summary = state.history.find((entry) => entry.workoutId === key);
      return { session, summary: summary ? validateSummary(summary, key) : undefined };
    });
  }
  const payload = parseSessionExport(value);
  return [{ session: payload.session.definition || !payload.definition ? payload.session :
    { ...payload.session, definition: payload.definition }, summary: payload.summary ?? undefined }];
};

export const downloadExport = (filename: string, content: string, mime: string): void => {
  const url = URL.createObjectURL(new Blob([content], { type: mime }));
  const anchor = document.createElement('a');
  anchor.href = url; anchor.download = filename;
  document.body.appendChild(anchor); anchor.click(); anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};
