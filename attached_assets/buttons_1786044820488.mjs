import { boot, click, findButton, buttons, tick } from './harness.mjs';

const HTML = process.env.TIDE_HTML || 'dist-preview/index.html';

const name = (b) =>
  (b.getAttribute('aria-label') || (b.textContent || '').replace(/\s+/g, ' ').trim() || '(sin nombre)').slice(0, 48);

const run = async () => {
  const { window, doc, errors } = await boot(HTML);
  const dead = [];
  const unnamed = [];

  const screens = ['Hoy', 'Semana', 'Progreso', 'Biblioteca', 'Perfil'];

  for (const screen of screens) {
    await click(window, buttons(doc).find((b) => (b.textContent || '').trim() === screen), screen);
    // abrir paneles colapsados para alcanzar más controles
    for (const opener of ['Ajustar sesión', 'Actividad de mañana', 'Cambiar actividad del día']) {
      const btn = findButton(doc, opener);
      if (btn) await click(window, btn, opener);
    }

    const list = buttons(doc);
    console.log(`\n== ${screen}: ${list.length} botones ==`);

    for (let i = 0; i < list.length; i += 1) {
      const b = list[i];
      if (!doc.contains(b)) continue;
      const label = name(b);
      if (label === '(sin nombre)') unnamed.push(`${screen}: botón ${i}`);
      if (screens.includes(label) || label === 'Perfil' || label === 'Abrir perfil') continue; // no navegar fuera
      if (label.includes('Restablecer') || label.includes('Confirmar')) continue; // destructivo
      if (label.includes('One Pager') || label.includes('Comenzar') || label.includes('Abrir sesión')) continue; // cambian de vista

      const before = doc.getElementById('root').innerHTML;
      try {
        await click(window, b, label);
      } catch (e) {
        errors.push(`click ${screen}/${label}: ${e.message}`);
        continue;
      }
      const after = doc.getElementById('root').innerHTML;
      if (before === after) dead.push(`${screen} · ${label}`);
    }
  }

  await tick(window, 100);
  console.log('\n--- Botones sin efecto visible ---');
  console.log(dead.length ? dead.join('\n') : 'ninguno');
  console.log('\n--- Botones sin nombre accesible ---');
  console.log(unnamed.length ? unnamed.join('\n') : 'ninguno');
  console.log('\n--- Errores ---');
  console.log(errors.length ? errors.join('\n') : 'ninguno');
};

run().catch((e) => {
  console.error('HARNESS ERROR:', e.message);
  process.exit(2);
});
