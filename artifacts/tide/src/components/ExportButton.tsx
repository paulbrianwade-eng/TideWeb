import { useState } from 'react';
import { CheckCircle2, Download, FileText } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { buildBackup, buildCoachCsv } from '../lib/export';
import { parseImportSessions } from '../lib/session-export';
import type { SessionSummary, WorkoutSession } from '../types';

type ExportStatus = 'csv' | 'json' | 'empty' | null;

const dateStamp = (): string => {
  const date = new Date();
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const downloadFile = (filename: string, content: string, mime: string): void => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

export const ExportButton = () => {
  const { state, program, saveSession, saveSummary } = useApp();
  const [status, setStatus] = useState<ExportStatus>(null);
  const [importMessage, setImportMessage] = useState('');
  const [pending, setPending] = useState<{ session: WorkoutSession; summary?: SessionSummary }[]>([]);

  const readImport = async (file?: File) => {
    setPending([]);
    if (!file) return;
    try {
      if (file.size > 15_000_000) throw new Error('El archivo supera 15 MB.');
      const entries = parseImportSessions(await file.text());
      const occupied = new Set([...Object.keys(state.sessions), ...state.history.map((entry) => entry.workoutId)]);
      const newEntries = entries.filter((entry) => !occupied.has(entry.session.workoutId));
      setPending(newEntries);
      setImportMessage(`${newEntries.length} sesiones nuevas. ${entries.length - newEntries.length} IDs existentes omitidos: nunca se sobrescriben. Solo se importan sesiones y resúmenes; no perfil ni otros ajustes.`);
    } catch (error) {
      setImportMessage(error instanceof Error ? error.message : 'No se pudo leer el archivo.');
    }
  };

  const confirmImport = () => {
    const occupied = new Set([...Object.keys(state.sessions), ...state.history.map((entry) => entry.workoutId)]);
    let count = 0;
    for (const entry of pending) {
      if (occupied.has(entry.session.workoutId)) continue;
      saveSession(entry.session);
      if (entry.summary) saveSummary(entry.summary);
      occupied.add(entry.session.workoutId);
      count += 1;
    }
    setPending([]);
    setImportMessage(`${count} sesiones importadas sin sobrescribir datos.`);
  };

  const acknowledge = (next: ExportStatus) => {
    setStatus(next);
    window.setTimeout(() => setStatus(null), 2400);
  };

  const exportJson = () => {
    downloadFile(
      `tide-backup-${dateStamp()}.json`,
      JSON.stringify(buildBackup(state), null, 2),
      'application/json;charset=utf-8',
    );
    acknowledge('json');
  };

  const exportCsv = () => {
    const { csv, rowCount } = buildCoachCsv(state, program);
    if (rowCount === 0) {
      acknowledge('empty');
      return;
    }
    downloadFile(`tide-coach-${dateStamp()}.csv`, csv, 'text/csv;charset=utf-8');
    acknowledge('csv');
  };

  return (
    <div className="space-y-3 border-t border-border pt-4">
      <div>
        <p className="eyebrow">Exportación</p>
        <h3 className="font-display text-xl">Tus datos</h3>
        <p className="mt-1 text-sm text-muted">
          El CSV resume cargas, sesiones y métricas para el coach. El JSON guarda un respaldo completo.
        </p>
      </div>

      <button type="button" onClick={exportCsv} className="btn-primary w-full">
        {status === 'csv' ? <CheckCircle2 className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
        {status === 'csv' ? 'CSV descargado' : 'Exportar CSV para el coach'}
      </button>
      <button type="button" onClick={exportJson} className="btn-ghost w-full">
        {status === 'json' ? <CheckCircle2 className="h-4 w-4" /> : <Download className="h-4 w-4" />}
        {status === 'json' ? 'Backup descargado' : 'Descargar backup JSON'}
      </button>
      <div className="space-y-2 border-t border-border pt-3">
        <label className="block text-sm">
          Importar sesión o backup JSON (solo IDs nuevos)
          <input type="file" accept=".json,application/json" className="field mt-2 w-full"
            onChange={(event) => { void readImport(event.target.files?.[0]); event.target.value = ''; }} />
        </label>
        <p className="text-xs text-muted" role="status">{importMessage}</p>
        {pending.length > 0 && <>
          <p className="break-words text-xs text-muted">{pending.map((entry) => entry.session.workoutId).join(', ')}</p>
          <button type="button" className="btn-primary w-full" onClick={confirmImport}>Confirmar importación de {pending.length} sesiones nuevas</button>
          <button type="button" className="btn-ghost w-full" onClick={() => { setPending([]); setImportMessage('Importación cancelada.'); }}>Cancelar</button>
        </>}
      </div>

      <p className="text-xs text-muted" role="status" aria-live="polite">
        {status === 'empty'
          ? 'Todavía no hay cargas, sesiones o métricas para incluir en el CSV.'
          : 'En iPhone, la descarga queda disponible en la app Archivos.'}
      </p>
    </div>
  );
};