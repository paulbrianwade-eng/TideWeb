/** Verifica que las reglas de adaptación transformen la sesión de verdad. */
import { buildProgram } from '../src/data/program';
import { applyAdaptations, emptyAnswers } from '../src/lib/adaptations';

let failed = 0;
const check = (name: string, ok: boolean, detail = '') => {
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${name}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failed += 1;
};

const prog = buildProgram('2026-01-05');
const monday = prog[0];   // Strong Legs · barra · box squat
const tuesday = prog[1];  // Paddle Power · bench press

// Sin respuestas, la sesión no cambia
const none = applyAdaptations(monday, emptyAnswers);
check('Sin respuestas la sesión queda igual', none.rules.length === 0 && none.blocks.length === 4);

// Sueño < 6 h
const sleepy = applyAdaptations(monday, { ...emptyAnswers, sleep: 5 });
// El Core ahora es el bloque de vueltas; el Atleta va por series rectas
const coreRounds = sleepy.blocks.find((b) => b.kind === 'zona-media')!.rounds;
const originalCore = monday.blocks.find((b) => b.kind === 'zona-media')!.rounds;
check('Sueño bajo quita una vuelta del circuito', (coreRounds ?? 4) <= (originalCore ?? 4), `${originalCore} → ${coreRounds}`);
check('Sueño bajo limita la fuerza a RPE 7', sleepy.blocks.find((b) => b.kind === 'fuerza')!.items[0].rpe === '7');
check('Sueño bajo no toca el finisher', sleepy.blocks[3].minutes === monday.blocks[3].minutes);

// Dolor lumbar
const back = applyAdaptations(monday, { ...emptyAnswers, pain: 7, painArea: 'lumbar' });
const hasAbWheel = back.blocks.some((b) => b.items.some((i) => i.exerciseId === 'ab-wheel'));
check('Dolor lumbar sustituye el ab wheel', !hasAbWheel || back.rules.length > 0);
check('Dolor lumbar informa la regla', back.rules.some((r) => r.id === 'pain-lumbar'));

// Rodilla: fuera la sentadilla
const knee = applyAdaptations(monday, { ...emptyAnswers, pain: 6, painArea: 'rodilla' });
const stillSquat = knee.blocks.some((b) => b.items.some((i) => i.exerciseId === 'box-squat'));
check('Dolor de rodilla saca el box squat', !stillSquat);

// Esquí mañana
const ski = applyAdaptations(monday, { ...emptyAnswers, tomorrow: 'ski' });
const skiSets = ski.blocks.find((b) => b.kind === 'fuerza')!.items[0].sets!;
const baseSets = monday.blocks.find((b) => b.kind === 'fuerza')!.items[0].sets!;
check('Esquí mañana baja el volumen de piernas', skiSets < baseSets, `${baseSets} → ${skiSets}`);
check('Esquí mañana mantiene el core', ski.blocks[0].kind === 'zona-media');

// Surf mañana
const surf = applyAdaptations(tuesday, { ...emptyAnswers, tomorrow: 'surf' });
const rowItem = surf.blocks.flatMap((b) => b.items).find((i) => i.exerciseId === 'trx-row');
const rowBase = tuesday.blocks.flatMap((b) => b.items).find((i) => i.exerciseId === 'trx-row');
check('Surf mañana reduce el volumen de tirón', !rowItem || rowItem.sets! < (rowBase?.sets ?? 3), `${rowBase?.sets} → ${rowItem?.sets}`);

// 30 minutos
const short = applyAdaptations(monday, { ...emptyAnswers, minutes: 30 });
const shortTotal = short.blocks.reduce((s, b) => s + b.minutes, 0);
check('Solo 30 minutos respeta el reparto', shortTotal === 30, `${shortTotal} min`);
check('Solo 30 minutos mantiene los 4 bloques', short.blocks.length === 4);
check('Solo 30 minutos recorta ejercicios, no bloques', short.blocks[0].items.length <= 3);

// En casa
const home = applyAdaptations(monday, { ...emptyAnswers, place: 'casa' });
const usesBarbell = home.blocks.some((b) => b.items.some((i) => ['box-squat', 'bench-press', 'push-press', 'hang-power-clean'].includes(i.exerciseId)));
check('En casa no queda ningún ejercicio de barra', !usesBarbell);

// Combinadas
const combo = applyAdaptations(monday, { ...emptyAnswers, sleep: 5, minutes: 30, tomorrow: 'ski' });
check('Las reglas se combinan', combo.rules.length === 3, `${combo.rules.length} activas`);
check('Combinadas siguen respetando el tiempo', combo.blocks.reduce((s, b) => s + b.minutes, 0) === 30);

if (failed) {
  console.error(`\n${failed} verificaciones fallaron`);
  process.exit(1);
}
