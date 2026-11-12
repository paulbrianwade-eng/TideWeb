import type { AppState, FinisherScore, Workout } from '../types';
import { METRICS } from '../data/defaults';
import { getExercise } from '../data/exercises';
import { actualSessionStats } from './analytics';

export interface TideBackup {
  schema: 'tide-backup-v1';
  app: 'TIDE';
  exportedAt: string;
  state: AppState;
}

type CsvValue = string | number | boolean | null | undefined;
type CsvRow = Record<string, CsvValue>;

export const buildBackup = (state: AppState, exportedAt = new Date().toISOString()): TideBackup => ({
  schema: 'tide-backup-v1',
  app: 'TIDE',
  exportedAt,
  state,
});

const COLUMNS = [
  'record_type', 'date', 'week', 'day', 'workout_id', 'workout_name',
  'block_index', 'block_id', 'block_kind', 'block_title',
  'exercise_order', 'exercise_id', 'exercise_name', 'set_number',
  'completed', 'load', 'reps', 'duration', 'distance', 'rounds', 'time',
  'transition_seconds', 'transition_rpe', 'feeling', 'rpe', 'energy', 'pain',
  'calories', 'avg_hr', 'max_hr', 'volume_kg', 'sets_completed',
  'metric_id', 'metric_label', 'metric_unit', 'metric_value', 'comment', 'note',
  'round_number', 'round_split_sec', 'cumulative_sec', 'partial_reps', 'paused_sec',
  'timezone', 'source', 'definition_id', 'workout_version', 'duration_sec', 'distance_m',
  'event_type', 'recorded_at', 'partial_unit', 'partial_value', 'substitution',
  'pain_area', 'pain_exercise', 'pain_note', 'blocks_completed', 'blocks_total',
  'details_json', 'definition_json',
] as const;

const parseSemanticKey = (key: string): { blockId: string; exerciseId: string; itemIndex: number | null } => {
  const parts = key.split(':');
  if (parts.length >= 3) {
    const itemIndex = Number(parts.at(-1));
    return {
      blockId: parts[0] ?? '',
      exerciseId: parts.slice(1, -1).join(':'),
      itemIndex: Number.isInteger(itemIndex) ? itemIndex : null,
    };
  }
  return { blockId: '', exerciseId: key, itemIndex: null };
};

const workoutFields = (workout: Workout | undefined): CsvRow => ({
  date: workout?.date,
  week: workout?.week,
  day: workout?.day,
  workout_id: workout?.id,
  workout_name: workout?.name,
});

const scoreFields = (score: FinisherScore): CsvRow => ({
  rounds: score.rounds,
  reps: score.reps,
  time: score.time,
  distance: score.distance,
  note: score.note,
});

export const buildCoachRows = (state: AppState, program: Workout[]): CsvRow[] => {
  const rows: CsvRow[] = [];
  const workouts = new Map(program.map((workout) => [workout.id, workout]));
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

  Object.values(state.sessions).forEach((session) => {
    const workout = session.definition ?? workouts.get(session.workoutId);
    const historicalSummary = state.history.find((entry) => entry.workoutId === session.workoutId);
    const historicalDay = session.workoutId.match(/w(\d+)d(\d+)$/);
    const context: CsvRow = { ...(workout ? workoutFields(workout) : {
      workout_id: session.workoutId,
      workout_name: historicalSummary?.workoutName,
      week: historicalDay ? Number(historicalDay[1]) : undefined,
      day: historicalDay ? Number(historicalDay[2]) : undefined,
    }), timezone, source: 'manual', definition_id: session.definition?.id };
    Object.entries(session.sets).forEach(([key, completedSets]) => {
      const parsed = parseSemanticKey(key);
      const block = workout?.blocks.find((candidate) => candidate.id === parsed.blockId);
      const currentItem = parsed.itemIndex === null ? undefined : block?.items[parsed.itemIndex];
      const matchesCurrent = currentItem?.exerciseId === parsed.exerciseId;
      if (matchesCurrent && block?.choiceLabel && currentItem?.order !== session.choices?.[block.id]) return;
      completedSets.forEach((completedSet, setIndex) => {
        if (!completedSet.done) return;
        rows.push({
          record_type: 'set',
          ...context,
          date: session.date,
          workout_id: session.workoutId,
          block_index: matchesCurrent ? block?.index : undefined,
          block_id: parsed.blockId,
          block_kind: matchesCurrent ? block?.kind : undefined,
          block_title: matchesCurrent ? block?.title : 'Registro histórico',
          exercise_order: matchesCurrent ? currentItem?.order : undefined,
          exercise_id: parsed.exerciseId,
          exercise_name: getExercise(parsed.exerciseId).name,
          set_number: setIndex + 1,
          completed: true,
          load: completedSet.load,
          reps: completedSet.reps,
          rpe: completedSet.rpe,
          substitution: session.substitutions[key],
        });
      });
    });

    Object.values(session.transitions ?? {}).forEach((transition) => {
      const block = workout?.blocks.find((candidate) => candidate.id === transition.blockId);
      rows.push({
        record_type: 'transition',
        ...context,
        date: session.date,
        workout_id: session.workoutId,
        block_index: block?.index,
        block_id: transition.blockId,
        block_kind: block?.kind,
        block_title: block?.title,
        transition_seconds: transition.seconds,
        transition_rpe: transition.rpe,
        duration_sec: transition.seconds,
        distance_m: transition.distanceM,
        feeling: transition.feeling,
        comment: transition.comment,
      });
    });

    if (session.finisherScore) {
      rows.push({
        record_type: 'finisher',
        ...context,
        date: session.date,
        workout_id: session.workoutId,
        ...scoreFields(session.finisherScore),
      });
    }

    Object.entries(session.hybridResults ?? {}).forEach(([blockId, result]) => {
      const hybridContext: CsvRow = {
        ...context, date: session.date, workout_id: session.workoutId,
        block_id: blockId, block_index: result.definition.index,
        block_kind: result.definition.kind, block_title: result.definition.title,
        definition_id: result.workoutDefinitionId, workout_version: result.workoutVersion,
      };
      rows.push({
        ...hybridContext, record_type: 'hybrid', source: 'timer',
        duration_sec: result.activeElapsedSec, paused_sec: result.pausedSec,
        rounds: result.completedRounds, partial_reps: result.partialReps,
        completed: result.status === 'finished' && !result.dnf, note: result.notes,
        recorded_at: result.finishedAt, definition_json: JSON.stringify(result.definition),
        details_json: JSON.stringify(result),
      });
      result.splits.forEach((split) => rows.push({
        ...hybridContext, record_type: 'round', source: split.source,
        round_number: split.round, round_split_sec: split.splitSec,
        cumulative_sec: split.elapsedSec, recorded_at: split.recordedAt,
        completed: true, details_json: JSON.stringify(split),
      }));
      result.partialDetails?.forEach((partial) => rows.push({
        ...hybridContext, record_type: 'partial', source: 'manual',
        exercise_id: partial.exerciseId, exercise_name: getExercise(partial.exerciseId).name,
        reps: partial.unit === 'reps' ? partial.value : undefined,
        distance_m: partial.unit === 'm' ? partial.value : undefined,
        duration_sec: ['sec', 's'].includes(partial.unit) ? partial.value : undefined,
        partial_unit: partial.unit, partial_value: partial.value,
        details_json: JSON.stringify(partial),
      }));
      result.events.forEach((event) => rows.push({
        ...hybridContext, record_type: 'audit', source: 'app',
        event_type: event.type, cumulative_sec: event.elapsedSec,
        recorded_at: event.at, note: event.reason, details_json: JSON.stringify(event),
      }));
    });
    Object.entries(session.substitutions).forEach(([key, substitution]) => rows.push({
      ...context, date: session.date, workout_id: session.workoutId,
      record_type: 'substitution', exercise_id: key, substitution,
    }));
    // An open / imported session still exists even without any sets or a closure summary.
    if (!historicalSummary) {
      const stats = actualSessionStats(session, session.definition);
      const elapsedMs = session.elapsedMs > 0 ? session.elapsedMs :
        session.completedAt !== undefined && session.completedAt >= session.startedAt ?
          session.completedAt - session.startedAt : undefined;
      rows.push({
        ...context, date: session.date, workout_id: session.workoutId, record_type: 'session',
        completed: session.completedAt !== undefined,
        duration: elapsedMs === undefined ? undefined : elapsedMs / 60000,
        duration_sec: elapsedMs === undefined ? undefined : elapsedMs / 1000,
        sets_completed: stats.setsCompleted, volume_kg: stats.volumeKg,
        blocks_completed: session.definition ? stats.completedBlockIds.length : session.completedBlocks?.length,
        blocks_total: session.definition?.blocks.length,
        pain_area: session.painArea, pain_exercise: session.painExercise, pain_note: session.painNote,
        definition_json: session.definition ? JSON.stringify(session.definition) : undefined,
      });
    }
  });

  state.history.forEach((summary) => {
    const session = state.sessions[summary.workoutId];
    const workout = session?.definition ?? workouts.get(summary.workoutId);
    rows.push({
      record_type: 'session',
      ...workoutFields(workout),
      date: summary.date,
      workout_id: summary.workoutId,
      workout_name: summary.workoutName,
      duration: summary.durationMin,
      duration_sec: summary.durationMin * 60,
      timezone,
      source: summary.dataSource ?? session?.dataSource ?? 'manual',
      definition_id: session?.definition?.id,
      feeling: summary.feeling,
      rpe: summary.rpe,
      energy: summary.energy,
      pain: summary.pain,
      pain_area: summary.painArea,
      pain_exercise: summary.painExercise,
      pain_note: summary.painNote,
      blocks_completed: summary.blocksCompleted,
      blocks_total: summary.blocksTotal,
      calories: summary.calories,
      avg_hr: summary.avgHr,
      max_hr: summary.maxHr,
      volume_kg: summary.volumeKg,
      sets_completed: summary.setsCompleted,
      comment: summary.comment,
      note: [summary.highlight, summary.personalRecord, summary.coachNote].filter(Boolean).join(' · '),
    });
  });

  const metrics = new Map(METRICS.map((metric) => [metric.id, metric]));
  Object.entries(state.metrics).forEach(([metricId, entries]) => {
    const metric = metrics.get(metricId);
    entries.forEach((entry) => {
      rows.push({
        record_type: 'metric',
        date: entry.date,
        metric_id: metricId,
        metric_label: metric?.label ?? metricId,
        metric_unit: metric?.unit,
        metric_value: entry.value,
        timezone,
        source: 'manual',
      });
    });
  });

  return rows.sort((a, b) => String(a.date ?? '').localeCompare(String(b.date ?? '')));
};

const csvEscape = (value: CsvValue): string => {
  const raw = value === null || value === undefined ? '' : String(value);
  const text = typeof value === 'string' && (/^[\s\uFEFF]*[=+\-@]/.test(raw) || /^[\t\r\n]/.test(raw)) ? `'${raw}` : raw;
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

export const rowsToCsv = (rows: CsvRow[]): string => {
  const lines = [
    COLUMNS.join(','),
    ...rows.map((row) => COLUMNS.map((column) => csvEscape(row[column])).join(',')),
  ];
  return `\uFEFF${lines.join('\r\n')}`;
};

export const buildCoachCsv = (state: AppState, program: Workout[]): { csv: string; rowCount: number } => {
  const rows = buildCoachRows(state, program);
  return { csv: rowsToCsv(rows), rowCount: rows.length };
};

export { buildSessionExport, buildSessionCsv, parseSessionExport } from './session-export';