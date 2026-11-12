/** Audita el mes: estructura semanal, cargas reales y progresión. */
import { buildProgram, TOTAL_WEEKS, totalMinutes, schemeFor, loadFor } from '../src/data/program';
import { LOADABLE } from '../src/data/month';
import { EXERCISES, getExercise } from '../src/data/exercises';
import { INVENTORY, UNAVAILABLE } from '../src/data/equipment';

let failed = 0;
const check = (name: string, ok: boolean, detail = '') => {
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${name}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failed += 1;
};

const prog = buildProgram('2026-01-05');

// ── Estructura ──
check('4 semanas × 7 días', prog.length === TOTAL_WEEKS * 7, `${prog.length}`);

const names = prog.filter((w) => w.week === 1).map((w) => w.name);
check(
  'La semana sigue el orden acordado',
  names.join('|') === 'Rodilla + Tracción|Spinning|Cadera + Empuje|Pasadas|Unipodal + Mixto|Competencia|Descanso',
  names.join(' · '),
);

const fullBody = prog.filter((w) => ['Rodilla + Tracción', 'Cadera + Empuje', 'Unipodal + Mixto'].includes(w.name));
check('3 días de fuerza por semana', fullBody.length === TOTAL_WEEKS * 3);
check(
  'Los días de fuerza tienen Core → Fuerza → Atleta → Híbrido',
  fullBody.every((w) => w.blocks.length === 4 && w.blocks[0].kind === 'zona-media' && w.blocks[1].kind === 'fuerza' && w.blocks[2].kind === 'atleta'),
);

// ── Duración ──
const fbMin = fullBody.map((w) => totalMinutes(w.blocks));
check('Los días de fuerza rondan los 45-50 min', Math.max(...fbMin) <= 52, `rango ${Math.min(...fbMin)}–${Math.max(...fbMin)} min`);

const sat = prog.filter((w) => w.name === 'Competencia');
check('El sábado es el más largo', sat.every((w) => totalMinutes(w.blocks) >= 40), `${totalMinutes(sat[0].blocks)} min`);

// ── Core: 4 ejercicios, 4 vueltas ──
check('El Core siempre tiene 4 ejercicios y 4 vueltas',
  fullBody.every((w) => w.blocks[0].items.length === 4 && w.blocks[0].rounds === 4));

// ── Bloque Fuerza: 1 principal + 3 complementos ──
check('Fuerza = 1 principal + 3 complementos',
  fullBody.every((w) => w.blocks[1].items.length === 4));

// ── Cargas: solo las que los discos permiten ──
const barLoads = fullBody
  .flatMap((w) => w.blocks.flatMap((b) => b.items))
  .map((i) => i.load)
  .filter((l): l is string => !!l && /^\d+ kg$/.test(l))
  .map((l) => Number(l.replace(' kg', '')));
const impossible = barLoads.filter((l) => !(LOADABLE as readonly number[]).includes(l));
check('Todas las cargas de barra son montables con los discos reales', impossible.length === 0,
  impossible.length ? `imposibles: ${[...new Set(impossible)].join(', ')}` : `usadas: ${[...new Set(barLoads)].sort((a, b) => a - b).join(', ')} kg`);
check('Ninguna carga supera el techo de 90 kg', barLoads.every((l) => l <= 90), `máx ${Math.max(...barLoads)} kg`);

// ── Progresión ──
const squatByWeek = [1, 2, 3, 4].map((w) => loadFor(60, w));
check('La sentadilla progresa 60 → 60 → 70 → 50 (descarga)',
  squatByWeek.join(',') === '60,60,70,50', squatByWeek.join(' → '));
const dlByWeek = [1, 2, 3, 4].map((w) => loadFor(70, w));
check('El peso muerto progresa 70 → 70 → 80 → 60', dlByWeek.join(',') === '70,70,80,60', dlByWeek.join(' → '));
check('La semana 2 progresa por tempo, no por carga', schemeFor(2).tempo === '3-1-1' && schemeFor(2).loadDelta === 0);
check('La semana 3 suma serie y carga', schemeFor(3).sets === 4 && schemeFor(3).loadDelta === 10);
check('La semana 4 es descarga', schemeFor(4).sets === 2 && schemeFor(4).loadDelta === -10);

// ── Cardio ──
const spin = prog.filter((w) => w.name === 'Spinning');
check('Martes es spinning las 4 semanas', spin.length === 4);
check('El spinning varía de formato', new Set(spin.map((w) => w.blocks[0].formatLabel)).size === 4);

const runs = prog.filter((w) => w.name === 'Pasadas');
const w1run = runs[0].blocks.find((b) => b.title === 'Pasadas')!;
check('El jueves 1 tiene 8×50, 10×100, 4×200 y 1×400',
  w1run.items.length === 4 && w1run.items[0].sets === 8 && w1run.items[1].sets === 10 && w1run.items[2].sets === 4,
  w1run.formatLabel);
check('El jueves de la semana 3 baja el volumen',
  (runs[2].blocks.find((b) => b.title === 'Pasadas')!.items.length ?? 0) === 3);

// ── Sábados ──
check('Los sábados rotan 4 formatos', new Set(sat.map((w) => w.blocks[1].title)).size === 4,
  sat.map((w) => w.blocks[1].title).join(' · '));
check('El sábado de la semana 4 es el test',
  sat[3].blocks[1].title.includes('Hyrox'), sat[3].blocks[1].title);
check('Todos los sábados tienen score', sat.every((w) => !!w.blocks[1].scoreType));

// ── Híbridos ──
const hybrids = fullBody.map((w) => w.blocks[3]);
check('Los híbridos varían de formato', new Set(hybrids.map((b) => b.format)).size >= 3,
  [...new Set(hybrids.map((b) => b.formatLabel))].length + ' etiquetas distintas');
check('Todos los híbridos son medibles',
  hybrids.filter((b) => b.kind === 'finisher').every((b) => !!b.scoreType));

// ── Nada de barra en los híbridos ──
const barInHybrid = hybrids.flatMap((b) => b.items).filter((i) => {
  const eq = getExercise(i.exerciseId).equipment;
  return eq.includes('Barra') && eq.includes('Discos');
});
check('Ningún híbrido usa la barra cargada', barInHybrid.length === 0,
  barInHybrid.map((i) => getExercise(i.exerciseId).name).join(', '));

// ── Equipamiento real ──
const bad: string[] = [];
EXERCISES.forEach((e) => e.equipment.forEach((q) => {
  if (UNAVAILABLE.includes(q) || !INVENTORY.includes(q as never)) bad.push(`${e.name}: ${q}`);
}));
check('Ningún ejercicio pide material inexistente', bad.length === 0, bad.slice(0, 3).join(' · '));

console.log(`\nEjercicios: ${EXERCISES.length} · sesiones: ${prog.length}`);
console.log(`Semana 1 lunes: ${prog[0].blocks.map((b) => `${b.title} (${b.minutes}′)`).join(' | ')}`);

if (failed) {
  console.error(`\n${failed} verificaciones fallaron`);
  process.exit(1);
}
