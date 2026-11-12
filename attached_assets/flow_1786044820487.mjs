import { boot, click as rawClick, findButton, setInput as rawSet, has } from './harness.mjs';

let failed = 0;
let total = 0;
const check = (name, ok, detail = '') => {
  total += 1;
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${name}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failed += 1;
};

const { window, doc } = await boot('dist-preview/index.html');
const click = (el, label = '') => rawClick(window, el, label);
const setInput = (el, v) => rawSet(window, el, v);

// ── HOY ──
check('Hoy carga la sesión del día', has(doc, 'Rodilla + Tracción'));
check('Muestra el tagline', has(doc, 'Full Body A'));
check('Muestra duración y capacidad', has(doc, 'min') && has(doc, 'Strength'));
check('Muestra la estación del día', has(doc, 'Barra'));
check('Muestra el checklist de equipamiento', has(doc, 'Hoy necesitás'));
check('Muestra coach note', has(doc, 'Coach note'));
check('Explica por qué esta sesión', has(doc, 'Por qué esta sesión'));
check('Muestra el balance de patrones', has(doc, 'Patrones de movimiento'));
check('Muestra las prioridades del deporte', has(doc, 'Prioridades de'));
check('Valida la sesión', has(doc, 'Sesión validada'));
check('Muestra los cuatro bloques', ['Core', 'Fuerza', 'Atleta', 'Híbrido'].every((b) => has(doc, b)));
check('Muestra el formato de cada bloque', has(doc, 'AMRAP') || has(doc, 'vueltas'));

// Checklist interactivo
const rack = findButton(doc, 'Rack');
await click(rack);
check('El checklist marca elementos', rack.getAttribute('aria-pressed') === 'true');

// Bloque plegable
const blockBtn = [...doc.querySelectorAll('button[aria-expanded]')][0];
const before = blockBtn.getAttribute('aria-expanded');
await click(blockBtn);
check('Los bloques se expanden y contraen', blockBtn.getAttribute('aria-expanded') !== before);

// ── PREGUNTAS PREVIAS ──
await click(findButton(doc, 'Comenzar'));
check('Pregunta antes de entrenar', has(doc, 'Antes de entrenar') && has(doc, '¿Cómo dormiste?'));
check('Pregunta por tiempo, lugar y deporte de mañana',
  has(doc, 'Tiempo disponible') && has(doc, '¿Dónde entrenás?') && has(doc, '¿Mañana hacés deporte?'));

// Una respuesta que cambia la sesión
await click(findButton(doc, 'Menos de 6 h'));
check('Muestra en vivo cómo se adapta', has(doc, 'La sesión se adapta') && has(doc, 'RPE 7'));
await click(findButton(doc, '30 min'));
check('El recorte de tiempo se anuncia', has(doc, 'Zona media 5'));

// ── MODO SESIÓN ──
await click(findButton(doc, 'Entrenar', { exact: false }));
check('Abre el modo sesión', has(doc, 'Bloque 1'));
check('La sesión llega adaptada', has(doc, 'Sesión adaptada'));
check('Muestra el selector de bloques', has(doc, '2. Fuerza'));
check('El Core abre por defecto', has(doc, 'Ab Wheel'));

// Vista ejercicio por ejercicio
const toggleView = doc.querySelector('button[aria-label*="ejercicio por ejercicio"]');
await click(toggleView);
check('Cambia a vista ejercicio por ejercicio', has(doc, 'Ejercicio 1 de'));
check('Muestra técnica y errores', has(doc, 'Técnica y errores'));
check('Ofrece el video', !!doc.querySelector('a[href*="youtube.com"]'));

// Registrar una serie
const loadInput = doc.querySelector('input[aria-label*="Carga de la serie 1"]');
await setInput(loadInput, '20');
const repsInput = doc.querySelector('input[aria-label*="Repeticiones de la serie 1"]');
await setInput(repsInput, '8');
await click(doc.querySelector('button[aria-label="Completar serie 1"]'));
check('Registra carga y repeticiones', has(doc, 'Descanso'));

// Temporizador de descanso a pantalla completa
check('El descanso ocupa la pantalla', has(doc, 'Saltar descanso'));
await click(findButton(doc, 'Saltar descanso'));

// Ir al finisher (volviendo a la vista de bloque completo)
await click(doc.querySelector('button[aria-label*="bloque completo"]'));
await click(findButton(doc, '4. Híbrido'));
check('Navega al bloque Híbrido', has(doc, 'Score del finisher'));
const timerBtn = doc.querySelector('button[aria-label^="Abrir temporizador"]');
check('El finisher ofrece temporizador', !!timerBtn);
await click(timerBtn);
check('El temporizador abre a pantalla completa', has(doc, 'Iniciar'));
await click(doc.querySelector('button[aria-label="Cerrar temporizador"]'));

// Score
// El score del lunes es por repeticiones (50/10), no por rondas
const scoreInput = [...doc.querySelectorAll('input')].find((i) =>
  /Repeticiones|Rondas|Tiempo|Distancia/.test(i.parentElement?.textContent ?? ''),
);
if (scoreInput) {
  await setInput(scoreInput, '6');
  check('Registra el score del híbrido', scoreInput.value === '6');
} else {
  check('Registra el score del híbrido', false, 'input no encontrado');
}

// ── RESUMEN ──
await click(findButton(doc, 'Finalizar sesión'));
check('Muestra el resumen', has(doc, 'Sesión completa'));
check('El resumen incluye duración y series', has(doc, 'Duración') && has(doc, 'Series'));
check('El resumen pide calorías y frecuencia',
  has(doc, 'Calorías') && has(doc, 'FC media') && has(doc, 'FC máx'));
check('Ofrece coach feedback', has(doc, 'Coach feedback'));
const rpeBtn = doc.querySelector('button[aria-label="RPE final: 8"]');
await click(rpeBtn);
check('Registra el RPE final', has(doc, 'rango planificado') || has(doc, 'por encima') || has(doc, 'corto'));
await click(findButton(doc, 'Guardar y salir'));
// Tras guardar, Hoy avanza a la próxima pendiente en vez de repetir lo ya hecho
check('Vuelve a Hoy tras guardar', !has(doc, 'Guardar y salir'));
check('Avanza a la próxima sesión pendiente', has(doc, 'Ya registraste'));

// ── NAVEGACIÓN ──
await click(findButton(doc, 'Semana'));
check('La semana es una colección de tarjetas', has(doc, 'Spinning') && has(doc, 'Competencia'));
await click(findButton(doc, 'Biblioteca'));
check('La biblioteca lista ejercicios', has(doc, 'Ab Wheel'));
await click(findButton(doc, 'Progreso'));
check('Progreso carga', has(doc, 'Progreso') || has(doc, 'Peso'));
await click(findButton(doc, 'Perfil'));
check('Perfil carga', has(doc, 'Restablecer') || has(doc, 'Perfil'));

console.log(`\nRESUMEN: ${total - failed}/${total} OK`);
if (failed) process.exit(1);
