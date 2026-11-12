/** Verifica los temporizadores contra el reloj real, sin DOM. */
import { buildIntervalSteps, formatClock } from '../src/lib/timers.ts';

let failed = 0;
const check = (name, ok, detail = '') => {
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${name}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failed += 1;
};

check('Formatea el reloj', formatClock(72) === '01:12', formatClock(72));
check('Nunca muestra negativos', formatClock(-5) === '00:00');

// Tabata Express: 4 ejercicios · 40/20 · 2 vueltas = 8 min
const express = buildIntervalSteps(['A', 'B', 'C', 'D'], { work: 40, pause: 20, rounds: 2 });
const expressSeconds = express.reduce((s, x) => s + x.seconds, 0);
check('Tabata Express dura 8 minutos', Math.abs(expressSeconds - 480) <= 20, `${expressSeconds} s`);
check('Tabata Express hace 2 vueltas', express.filter((s) => s.kind === 'work').length === 8);
check('No hay pausa después del último trabajo', express[express.length - 1].kind === 'work');
check('Anuncia el próximo ejercicio', express[0].next === 'B');

// Tabata Extendido completo: 8 ejercicios · 40/20 · 4 vueltas ≈ 32 min
const full = buildIntervalSteps(['A','B','C','D','E','F','G','H'], { work: 40, pause: 20, rounds: 4 });
const fullMin = full.reduce((s, x) => s + x.seconds, 0) / 60;
check('Tabata Extendido ronda los 32 minutos', Math.abs(fullMin - 32) < 1, `${fullMin.toFixed(1)} min`);
check('Tabata Extendido hace 32 bloques de trabajo', full.filter((s) => s.kind === 'work').length === 32);

// Sprint intervals: 20/40 × 10 = 10 min
const sprint = buildIntervalSteps(['Sprint'], { work: 20, pause: 40, rounds: 10 });
const sprintMin = sprint.reduce((s, x) => s + x.seconds, 0) / 60;
check('Sprint intervals dura 10 minutos', Math.abs(sprintMin - 10) < 0.7, `${sprintMin.toFixed(1)} min`);

// La vuelta se informa bien
check('Informa la vuelta actual', full.find((s) => s.round === 4) !== undefined);

if (failed) process.exit(1);
