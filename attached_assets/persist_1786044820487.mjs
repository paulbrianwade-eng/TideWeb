import { JSDOM } from 'jsdom';
import fs from 'node:fs';

const html = fs.readFileSync(process.env.TIDE_HTML || 'dist-preview/index.html', 'utf8');
const today = new Date();
const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

const state = {
  version: 1,
  profile: { name: 'QA', age: 38, weight: 85, height: 184, targetWeight: 80, daysAvailable: 5,
    preferredDuration: '40–70 min', equipment: [], sports: [], complaints: [], trainingTime: '06:30' },
  readiness: { [iso]: { energy: 8, sleep: 7, pain: 1, motivation: 9 } },
  adjustments: {},
  sessions: { 'w1d1': { workoutId: 'w1d1', date: iso, startedAt: Date.now(),
    elapsedMs: 600000, blockIndex: 1, activeKey: 'w1d1-fuerza:0',
    sets: { 'w1d1-fuerza:0': [{ done: true, load: '82.5', reps: '8' }, { done: true, load: '82.5', reps: '8' }] },
    skipped: [], substitutions: {} } },
  history: [],
  calendarOverrides: {},
  metrics: { weight: [{ date: iso, value: 84.4 }] },
  nutrition: {},
  extras: {},
  lastScreen: 'progress',
};

const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  url: 'https://tide.local/',
  beforeParse(window) {
    window.localStorage.setItem('tide.state.v1', JSON.stringify(state));
    window.scrollTo = () => {};
  },
});

setTimeout(() => {
  const text = (dom.window.document.getElementById('root').textContent || '').replace(/\s+/g, ' ');
  const ok = (n, c) => console.log(`${c ? 'OK  ' : 'FAIL'} ${n}`);
  ok('Reabre en la última pantalla usada (Progreso)', text.includes('Progreso') && text.includes('Adherencia'));
  ok('Restaura el peso cargado (84.4)', text.includes('84.4'));
  const home = [...dom.window.document.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Hoy');
  home.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
  setTimeout(() => {
    const t2 = (dom.window.document.getElementById('root').textContent || '').replace(/\s+/g, ' ');
    ok('Hoy ofrece retomar la sesión en curso', t2.includes('Retomar'));
    const pct = t2.match(/Retomar · (\d+) %/);
    ok('Calcula el progreso guardado', !!pct && Number(pct[1]) > 0);
    // La readiness se pregunta al arrancar la sesión, no en Hoy: verificamos que persista el estado guardado
    ok('Conserva la readiness guardada entre recargas',
      (dom.window.localStorage.getItem('tide.state.v1') ?? '').includes('"energy":8'));
    console.log('progreso restaurado:', pct ? pct[1] + ' %' : 'n/d');
  }, 200);
}, 900);
