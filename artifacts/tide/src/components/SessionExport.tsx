import { useState } from 'react';
import { Copy, Download, Share2 } from 'lucide-react';
import { useApp } from '../state/AppContext';
import {
  buildSessionCsv, buildSessionExport, downloadExport, sessionExportFilename, sessionSummaryText,
} from '../lib/session-export';

/** The same controls work immediately after saving and for an archived workout ID. */
export const SessionExport = ({ workoutId }: { workoutId: string }) => {
  const app = useApp();
  const [status, setStatus] = useState('');
  const [copyFallback, setCopyFallback] = useState('');
  const session = app.sessionFor(workoutId);
  if (!session) return <p className="text-sm text-muted">Sin registro de sesión para exportar.</p>;

  const payload = () => buildSessionExport(session, app.summaryFor(workoutId));
  const exportFile = async (extension: 'csv' | 'json', share = false) => {
    const data = payload();
    const filename = sessionExportFilename(data, extension);
    const mime = extension === 'csv' ? 'text/csv;charset=utf-8' : 'application/json;charset=utf-8';
    const content = extension === 'csv' ? buildSessionCsv(data) : JSON.stringify(data, null, 2);
    try {
      const file = new File([content], filename, { type: mime });
      if (share && navigator.canShare?.({ files: [file] }) && navigator.share) {
        await navigator.share({ files: [file], title: 'TIDE · Exportar para coach' });
        setStatus('Archivo compartido.');
        return;
      }
      downloadExport(filename, content, mime);
      setStatus(share ? 'Compartir archivos no está disponible. Archivo descargado; en iPhone buscá en Archivos y usá Compartir.' :
        'Archivo descargado. En iPhone: Archivos → Descargas.');
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        setStatus('Compartir cancelado. Podés descargar el archivo.');
        return;
      }
      downloadExport(filename, content, mime);
      setStatus('No se pudo compartir. Se descargó el archivo como alternativa.');
    }
  };
  const copy = async () => {
    const text = sessionSummaryText(payload());
    try {
      await navigator.clipboard.writeText(text);
      setStatus('Resumen copiado.');
      setCopyFallback('');
    } catch {
      setCopyFallback(text);
      setStatus('Copiar automáticamente no está disponible. Seleccioná el texto y copialo.');
    }
  };
  return (
    <section className="card min-w-0 max-w-full space-y-3 p-4" aria-label="Exportar sesión para coach">
      <p className="label text-brand">EXPORTAR PARA COACH</p>
      <p className="text-sm text-muted">Datos registrados, sin perfil personal. Los campos sin medición quedan vacíos.</p>
      <div className="grid grid-cols-1 gap-2 min-[360px]:grid-cols-2">
        <button type="button" className="btn-primary min-w-0 whitespace-normal px-3 text-center" onClick={() => void exportFile('csv')}><Download className="h-4 w-4" /> CSV</button>
        <button type="button" className="btn-ghost min-w-0 whitespace-normal px-3 text-center" onClick={() => void exportFile('json')}><Download className="h-4 w-4" /> JSON</button>
        <button type="button" className="btn-ghost min-w-0 whitespace-normal px-3 text-center" onClick={() => void exportFile('csv', true)}><Share2 className="h-4 w-4" /> Compartir CSV</button>
        <button type="button" className="btn-ghost min-w-0 whitespace-normal px-3 text-center" onClick={() => void exportFile('json', true)}><Share2 className="h-4 w-4" /> Compartir JSON</button>
      </div>
      <button type="button" className="btn-ghost w-full" onClick={() => void copy()}><Copy className="h-4 w-4" /> Copiar resumen</button>
      {copyFallback && <textarea className="field h-48 w-full" aria-label="Resumen para copiar" readOnly value={copyFallback} onFocus={(event) => event.currentTarget.select()} />}
      <p className="text-xs text-muted" role="status" aria-live="polite">{status}</p>
    </section>
  );
};
