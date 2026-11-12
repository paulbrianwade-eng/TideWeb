// ============================================
// TIDE · ExportButton.jsx
// Exporta todos los datos guardados en localStorage.
// JSON  = backup completo (para vos)
// CSV   = tabla de cargas y sesiones (para pegarle al coach)
// ============================================

import { useState } from 'react';
import { Download, FileText, Check } from 'lucide-react';

// Agarra TODA clave de localStorage que arranque con "tide"
// (cubre tide.state.v1, tide_checks_v1, tide_history_v1, tide_loads_v1, etc.)
function readTideStorage() {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.toLowerCase().startsWith('tide')) continue;
    const raw = localStorage.getItem(key);
    try {
      data[key] = JSON.parse(raw);
    } catch {
      data[key] = raw;
    }
  }
  return data;
}

function download(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function stamp() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

// Aplana la estructura sea cual sea la forma exacta del state.
// Busca recursivamente objetos que parezcan registros de carga o de sesión.
function flattenToRows(data) {
  const rows = [];

  const looksLikeLoad = (o) =>
    o && typeof o === 'object' &&
    ('weight' in o || 'peso' in o || 'kg' in o || 'reps' in o);

  const looksLikeSession = (o) =>
    o && typeof o === 'object' &&
    ('dayId' in o || 'duration' in o || 'calories' in o || 'avgHr' in o || 'feel' in o);

  const walk = (node, path) => {
    if (node === null || node === undefined) return;

    if (Array.isArray(node)) {
      node.forEach((child, i) => walk(child, [...path, i]));
      return;
    }

    if (typeof node === 'object') {
      if (looksLikeLoad(node) || looksLikeSession(node)) {
        rows.push({
          ruta: path.join(' > '),
          fecha: node.date || node.fecha || node.timestamp || node.completedAt || '',
          dia: node.dayId || node.day || '',
          ejercicio: node.exerciseId || node.exercise || node.name || path[path.length - 1] || '',
          peso: node.weight ?? node.peso ?? node.kg ?? '',
          reps: node.reps ?? '',
          duracion: node.duration ?? '',
          fc: node.avgHr ?? node.hr ?? node.fc ?? '',
          calorias: node.calories ?? node.calorias ?? '',
          sensacion: node.feel ?? node.sensacion ?? '',
          notas: (node.notes ?? node.notas ?? '').toString().replace(/[\n\r;]/g, ' '),
        });
        return;
      }
      Object.entries(node).forEach(([k, v]) => walk(v, [...path, k]));
    }
  };

  Object.entries(data).forEach(([key, value]) => walk(value, [key]));
  return rows;
}

function toCSV(rows) {
  const headers = [
    'fecha', 'dia', 'ejercicio', 'peso', 'reps',
    'duracion', 'fc', 'calorias', 'sensacion', 'notas', 'ruta',
  ];
  const esc = (v) => {
    const s = (v ?? '').toString();
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [headers.join(',')];
  rows.forEach((r) => lines.push(headers.map((h) => esc(r[h])).join(',')));
  return lines.join('\n');
}

export default function ExportButton() {
  const [done, setDone] = useState(null);

  const exportJSON = () => {
    const data = readTideStorage();
    if (!Object.keys(data).length) {
      alert('No hay datos guardados todavía.');
      return;
    }
    const payload = {
      app: 'TIDE',
      exportedAt: new Date().toISOString(),
      keys: Object.keys(data),
      data,
    };
    download(`tide-backup-${stamp()}.json`, JSON.stringify(payload, null, 2), 'application/json');
    setDone('json');
    setTimeout(() => setDone(null), 2000);
  };

  const exportCSV = () => {
    const data = readTideStorage();
    const rows = flattenToRows(data);
    if (!rows.length) {
      alert('No encontré registros para exportar. Probá con el JSON.');
      return;
    }
    download(`tide-datos-${stamp()}.csv`, toCSV(rows), 'text/csv;charset=utf-8;');
    setDone('csv');
    setTimeout(() => setDone(null), 2000);
  };

  const btn =
    'flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-semibold text-sm transition-colors';

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wide text-tide-dim mb-1">
          Exportar datos
        </h3>
        <p className="text-xs text-tide-muted">
          El CSV es el que le pasás al coach. El JSON es tu backup completo.
        </p>
      </div>

      <button onClick={exportCSV} className={`${btn} bg-tide-lime text-black active:opacity-80`}>
        {done === 'csv' ? <Check size={18} /> : <FileText size={18} />}
        {done === 'csv' ? 'CSV descargado' : 'Exportar CSV (cargas y sesiones)'}
      </button>

      <button
        onClick={exportJSON}
        className={`${btn} bg-tide-surface-2 text-tide-text border border-white/10 active:opacity-80`}
      >
        {done === 'json' ? <Check size={18} /> : <Download size={18} />}
        {done === 'json' ? 'JSON descargado' : 'Backup completo (JSON)'}
      </button>

      <p className="text-[11px] leading-relaxed text-tide-muted">
        En iPhone el archivo va a la app Archivos. Desde ahí lo compartís o lo abrís
        para copiar el contenido.
      </p>
    </div>
  );
}
