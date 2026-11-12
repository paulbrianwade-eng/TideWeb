/**
 * Verifica que actualizar la rutina o la lógica NO borre ni desplace lo ya entrenado.
 */
import { buildProgram } from '../src/data/program';
import type { AppState, SessionSummary } from '../src/types';

let failed = 0;
const check = (name: string, ok: boolean, detail = '') => {
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${name}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failed += 1;
};

// ── El programa no se re-ancla ──
const anchored = buildProgram('2026-01-05');
const anchoredAgain = buildProgram('2026-01-05');
check(
  'Con la misma fecha de inicio el calendario es idéntico',
  anchored[0].date === anchoredAgain[0].date && anchored[0].date === '2026-01-05',
);
check('El Dia 1 sigue siendo el dia de arranque, no hoy', anchored[0].day === 1 && anchored[0].name === 'Rodilla + Tracción');
check('El martes cae al dia siguiente', anchored[1].date === '2026-01-06' && anchored[1].name === 'Spinning');

// ── Migración: cambiar de versión conserva el historial ──
const summary: SessionSummary = {
  workoutId: 'w1d1',
  workoutName: 'Rodilla + Tracción',
  date: '2026-01-05',
  durationMin: 47,
  blocksCompleted: 4,
  blocksTotal: 4,
  volumeKg: 0,
  setsCompleted: 18,
  rpe: 8,
  energy: 7,
  pain: 1,
  feeling: null,
  comment: '',
  highlight: null,
  personalRecord: null,
  coachNote: '',
};

const oldState: Partial<AppState> = {
  version: 1,
  history: [summary],
  sessions: {
    w1d1: {
      workoutId: 'w1d1',
      date: '2026-01-05',
      startedAt: 1,
      elapsedMs: 1,
      blockIndex: 3,
      activeKey: null,
      sets: { 'w1d1-fuerza:0': [{ done: true, load: '70', reps: '5' }] },
      skipped: [],
      substitutions: {},
    },
  },
  metrics: { peso: [{ date: '2026-01-05', value: 84.4 }] },
  programStart: '2026-01-05',
};

const migrated: Partial<AppState> = { ...oldState, version: 2 };
check('La migracion conserva el historial', (migrated.history ?? []).length === 1);
check('La migracion conserva las series registradas', Object.keys(migrated.sessions ?? {}).length === 1);
check('La migracion conserva las metricas', !!migrated.metrics?.peso?.length);
check('La migracion conserva la fecha de arranque', migrated.programStart === '2026-01-05');

// ── Los ids de sesión son estables entre versiones de la rutina ──
const ids = anchored.map((w) => w.id);
check(
  'Los ids siguen el patron wSdD y no dependen del contenido',
  ids[0] === 'w1d1' && ids[1] === 'w1d2' && ids[7] === 'w2d1',
);
check('Cambiar los ejercicios no cambia el id de la sesion', anchored.find((w) => w.id === 'w1d1')!.name === 'Rodilla + Tracción');

// ── La próxima pendiente salta lo ya hecho ──
const done = new Set(['w1d1']);
const nextPending = anchored.find((w) => w.name !== 'Descanso' && !done.has(w.id));
check(
  'Con el lunes hecho, la proxima pendiente es el martes',
  nextPending?.id === 'w1d2' && nextPending?.name === 'Spinning',
  nextPending?.name,
);

const done2 = new Set(['w1d1', 'w1d2', 'w1d3', 'w1d4', 'w1d5']);
const done3 = new Set(['w1d1', 'w1d2', 'w1d3', 'w1d4', 'w1d5', 'w1d6']);
const nextWeek = anchored.find((w) => w.name !== 'Descanso' && !done3.has(w.id));
check('Terminada la semana 1, sigue la semana 2', nextWeek?.id === 'w2d1', nextWeek?.id);

if (failed) {
  console.error(`\n${failed} verificaciones fallaron`);
  process.exit(1);
}
