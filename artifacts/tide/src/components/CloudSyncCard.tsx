import { useState, useSyncExternalStore } from 'react';
import { Cloud, CloudOff, LogIn, LogOut, RefreshCw, Send } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { lastCoachSend, sendToCoach } from '../lib/drive-export';
import { Card, SectionTitle, StatusBadge } from './ui';
import { getCloudStatus, signInCloud, signOutCloud, subscribeCloud, syncNow } from '../lib/cloud-sync';
import type { CloudPhase } from '../lib/cloud-sync';

const BADGE: Record<CloudPhase, { tone: 'success' | 'warn' | 'danger' | 'muted' | 'accent'; text: string }> = {
  off: { tone: 'muted', text: 'Sin configurar' },
  loading: { tone: 'muted', text: 'Cargando' },
  signedOut: { tone: 'warn', text: 'Solo este dispositivo' },
  syncing: { tone: 'accent', text: 'Sincronizando' },
  synced: { tone: 'success', text: 'Sincronizado' },
  offline: { tone: 'warn', text: 'Sin conexión' },
  error: { tone: 'danger', text: 'Error' },
};

const timeLabel = (at?: number) =>
  at ? new Date(at).toLocaleString('es-CL', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';

export const CloudSyncCard = () => {
  const status = useSyncExternalStore(subscribeCloud, getCloudStatus);
  const [busy, setBusy] = useState(false);
  const { state, program } = useApp();
  const [coachMsg, setCoachMsg] = useState('');
  const [coachError, setCoachError] = useState(false);
  const [lastSent, setLastSent] = useState(lastCoachSend);

  const sendCoach = async () => {
    setBusy(true);
    setCoachMsg('Enviando…');
    setCoachError(false);
    try {
      setCoachMsg(await sendToCoach(state, program));
      setLastSent(lastCoachSend());
    } catch (error) {
      const code = (error as { code?: string }).code ?? '';
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') setCoachMsg('');
      else {
        setCoachError(true);
        setCoachMsg(code === 'auth/popup-blocked'
          ? 'El navegador bloqueó la ventana de Google. Permití ventanas emergentes para este sitio.'
          : error instanceof Error ? error.message : 'No se pudo enviar.');
      }
    } finally {
      setBusy(false);
    }
  };
  const badge = BADGE[status.phase];
  const signedIn = Boolean(status.email) && status.phase !== 'signedOut';

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    try { await fn(); } finally { setBusy(false); }
  };

  return (
    <Card className="space-y-3" as="section">
      <SectionTitle
        eyebrow="Nube · Firebase"
        title="Sincronización"
        right={<StatusBadge tone={badge.tone} icon={status.phase === 'off' || status.phase === 'offline' ? <CloudOff className="h-3 w-3" /> : <Cloud className="h-3 w-3" />}>{badge.text}</StatusBadge>}
      />

      {status.phase === 'off' && (
        <p className="text-sm text-muted">
          Faltan las variables <code>VITE_FIREBASE_*</code> en Netlify. Mientras tanto tus datos se guardan solo en este dispositivo.
        </p>
      )}

      {(status.phase === 'signedOut' || (status.phase === 'error' && !status.email)) && (
        <>
          <p className="text-sm text-muted">
            Entrá con Google para respaldar tus entrenamientos y verlos igual en el celular y en la compu.
          </p>
          <button type="button" className="btn-primary w-full" disabled={busy} onClick={() => run(signInCloud)}>
            <LogIn className="h-4 w-4" aria-hidden="true" /> Entrar con Google
          </button>
        </>
      )}

      {signedIn && (
        <div className="space-y-2">
          <p className="text-sm text-ink">
            {status.name ? `${status.name} · ` : ''}<span className="text-muted">{status.email}</span>
          </p>
          {status.lastSync && <p className="meta">Última sincronización: {timeLabel(status.lastSync)}</p>}
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-ghost flex-1" disabled={busy || status.phase === 'syncing'} onClick={() => syncNow()}>
              <RefreshCw className="h-4 w-4" aria-hidden="true" /> Sincronizar ahora
            </button>
            <button type="button" className="btn-quiet" disabled={busy} onClick={() => run(signOutCloud)}>
              <LogOut className="h-4 w-4" aria-hidden="true" /> Salir
            </button>
          </div>
        </div>
      )}

      {signedIn && (
        <div className="space-y-2 rounded-xl border border-line bg-surface2 p-3">
          <p className="label">Coach · Google Drive</p>
          <p className="text-sm text-muted">
            Sube tus series, cargas y RPE a la carpeta <b>TIDE</b> de tu Drive para que Claude ajuste la rutina.
          </p>
          <button type="button" className="btn-primary w-full" disabled={busy} onClick={sendCoach} data-testid="button-send-coach">
            <Send className="h-4 w-4" aria-hidden="true" /> Enviar al coach
          </button>
          {lastSent && !coachMsg && <p className="meta">Último envío: {timeLabel(lastSent)}</p>}
          {coachMsg && <p className={`text-sm ${coachError ? 'text-danger' : 'text-ink'}`} role="status">{coachMsg}</p>}
        </div>
      )}

      {status.message && (
        <p className={`text-sm ${status.phase === 'error' ? 'text-danger' : 'text-muted'}`} role="status">{status.message}</p>
      )}
    </Card>
  );
};
