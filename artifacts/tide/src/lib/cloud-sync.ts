/**
 * SINCRONIZACIÓN EN LA NUBE (Firebase)
 * ────────────────────────────────────
 * localStorage sigue siendo la fuente local (la app funciona offline igual que antes).
 * Cuando hay sesión de Google iniciada, cada guardado local se sube a Firestore
 * (users/{uid}/tide/state) y los cambios hechos en otro dispositivo se bajan solos.
 *
 * Reglas de seguridad de datos:
 *  - Nunca se sube nada antes de la primera sincronización con la cuenta (evita que un
 *    dispositivo vacío pise los datos de la nube).
 *  - Si hay conflicto real, gana el estado con más entrenamiento registrado y el otro
 *    queda respaldado en localStorage (tide.state.v1.cloud-backup).
 *  - Firebase se carga recién cuando hace falta, así no se agranda la carga inicial.
 */
import type { Auth, User } from 'firebase/auth';
import type { DocumentReference, Firestore, Bytes as BytesType } from 'firebase/firestore';

const LOCAL_KEY = 'tide.state.v1';
const META_KEY = 'tide.cloud.meta';
const BACKUP_KEY = 'tide.state.v1.cloud-backup';
const MAX_BYTES = 950_000; // límite de documento de Firestore ≈ 1 MiB
const PUSH_DELAY = 1500;

// Configuración pública del proyecto Firebase "Tide" (no es secreta: la seguridad la dan
// las reglas de Firestore). Las variables VITE_FIREBASE_* de Netlify, si existen, tienen prioridad.
const env = import.meta.env;
const firebaseConfig = {
  apiKey: (env.VITE_FIREBASE_API_KEY as string | undefined) || 'AIzaSyDOEWfd7e5Xs5TY3O2j4Zx5ZcbRn2pd2_s',
  authDomain: (env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined) || 'tide-ce785.firebaseapp.com',
  projectId: (env.VITE_FIREBASE_PROJECT_ID as string | undefined) || 'tide-ce785',
  appId: (env.VITE_FIREBASE_APP_ID as string | undefined) || '1:1023368623092:web:0942dbc32e8120ae183fa1',
  storageBucket: (env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined) || 'tide-ce785.firebasestorage.app',
  messagingSenderId: (env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined) || '1023368623092',
};

export const cloudConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId,
);

export type CloudPhase = 'off' | 'loading' | 'signedOut' | 'syncing' | 'synced' | 'offline' | 'error';
export interface CloudStatus {
  phase: CloudPhase;
  email?: string;
  name?: string;
  lastSync?: number;
  message?: string;
}

interface Meta { uid?: string; remoteAt?: number; dirty?: boolean; localAt?: number; hash?: string }

/** Hash rápido (FNV-1a) para saber si el contenido local cambió de verdad. */
const hashOf = (text: string | null): string => {
  if (!text) return '';
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return `${text.length}:${(h >>> 0).toString(36)}`;
};

let status: CloudStatus = { phase: cloudConfigured ? 'loading' : 'off' };
const listeners = new Set<() => void>();
const setStatus = (next: Partial<CloudStatus>) => {
  status = { ...status, ...next };
  listeners.forEach((fn) => fn());
};
export const subscribeCloud = (fn: () => void) => { listeners.add(fn); return () => { listeners.delete(fn); }; };
export const getCloudStatus = () => status;

const readMeta = (): Meta => {
  try { return JSON.parse(localStorage.getItem(META_KEY) || '{}') as Meta; } catch { return {}; }
};
const writeMeta = (patch: Partial<Meta>) => {
  try { localStorage.setItem(META_KEY, JSON.stringify({ ...readMeta(), ...patch })); } catch { /* noop */ }
};

// ── Firebase (carga diferida) ──────────────────────────────────────────────
type FB = {
  auth: Auth;
  db: Firestore;
  authMod: typeof import('firebase/auth');
  fsMod: typeof import('firebase/firestore');
};
let fbPromise: Promise<FB> | null = null;
export const loadFirebase = (): Promise<FB> => {
  if (!fbPromise) {
    fbPromise = (async () => {
      const [appMod, authMod, fsMod] = await Promise.all([
        import('firebase/app'), import('firebase/auth'), import('firebase/firestore'),
      ]);
      const app = appMod.initializeApp(firebaseConfig as Record<string, string>);
      const auth = authMod.getAuth(app);
      await authMod.setPersistence(auth, authMod.browserLocalPersistence);
      const db = fsMod.getFirestore(app);
      return { auth, db, authMod, fsMod };
    })();
  }
  return fbPromise;
};

// ── Codificación (gzip cuando el navegador lo permite) ─────────────────────
const encode = async (json: string): Promise<{ encoding: 'gzip' | 'json'; bytes: Uint8Array }> => {
  if (typeof CompressionStream !== 'undefined') {
    const stream = new Blob([json]).stream().pipeThrough(new CompressionStream('gzip'));
    return { encoding: 'gzip', bytes: new Uint8Array(await new Response(stream).arrayBuffer()) };
  }
  return { encoding: 'json', bytes: new TextEncoder().encode(json) };
};
const decode = async (encoding: string, data: BytesType): Promise<string> => {
  const bytes = data.toUint8Array();
  if (encoding === 'gzip') {
    if (typeof DecompressionStream === 'undefined') throw new Error('Este navegador no puede leer los datos comprimidos de la nube.');
    const stream = new Blob([bytes as Uint8Array<ArrayBuffer>]).stream().pipeThrough(new DecompressionStream('gzip'));
    return await new Response(stream).text();
  }
  return new TextDecoder().decode(bytes);
};

const trainingAmount = (json: string | null): number => {
  if (!json) return 0;
  try {
    const s = JSON.parse(json) as { history?: unknown[]; sessions?: Record<string, unknown> };
    return (s.history?.length ?? 0) * 10 + Object.keys(s.sessions ?? {}).length;
  } catch { return 0; }
};

// ── Estado de la sincronización ────────────────────────────────────────────
let ref: DocumentReference | null = null;
let ready = false;
let unsubscribeSnapshot: (() => void) | null = null;
let pushTimer: ReturnType<typeof setTimeout> | null = null;
let pushing = false;
let saveCounter = 0;
let applyingRemote = false;

/** AppContext escucha este evento y aplica el estado bajado de la nube. */
export const CLOUD_STATE_EVENT = 'tide-cloud-state';

const applyRemote = (json: string, remoteAt: number, uid: string) => {
  applyingRemote = true;
  try {
    window.dispatchEvent(new CustomEvent<string>(CLOUD_STATE_EVENT, { detail: json }));
  } finally {
    applyingRemote = false;
  }
  writeMeta({ uid, remoteAt, dirty: false, hash: hashOf(localStorage.getItem(LOCAL_KEY)) });
  setStatus({ phase: 'synced', lastSync: remoteAt, message: undefined });
};

const backup = (json: string | null) => {
  if (!json) return;
  try { localStorage.setItem(BACKUP_KEY, json); } catch { /* noop */ }
};

const push = async () => {
  if (!ready || !ref || pushing) return;
  const raw = localStorage.getItem(LOCAL_KEY);
  if (!raw) return;
  pushing = true;
  const counterAtStart = saveCounter;
  setStatus({ phase: 'syncing' });
  try {
    const { fsMod } = await loadFirebase();
    const { encoding, bytes } = await encode(raw);
    if (bytes.length > MAX_BYTES) throw new Error('Tus datos superan el tamaño máximo de la nube. Exportá un respaldo desde Perfil.');
    const at = Date.now();
    await fsMod.setDoc(ref, {
      data: fsMod.Bytes.fromUint8Array(bytes),
      encoding,
      updatedAt: at,
      size: raw.length,
      device: navigator.userAgent.slice(0, 120),
    });
    const stillDirty = saveCounter !== counterAtStart;
    writeMeta({ remoteAt: at, dirty: stillDirty, hash: hashOf(raw) });
    setStatus({ phase: 'synced', lastSync: at, message: undefined });
    if (stillDirty) schedulePush();
  } catch (error) {
    const offline = typeof navigator !== 'undefined' && !navigator.onLine;
    setStatus({
      phase: offline ? 'offline' : 'error',
      message: offline ? 'Sin conexión: se sube cuando vuelva internet.' : error instanceof Error ? error.message : 'No se pudo sincronizar.',
    });
  } finally {
    pushing = false;
  }
};

const schedulePush = (delay = PUSH_DELAY) => {
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => { pushTimer = null; void push(); }, delay);
};

/** Lo llama saveState() después de cada guardado local. */
export const notifyLocalSave = () => {
  if (!cloudConfigured || applyingRemote) return;
  const meta = readMeta();
  // Guardados sin cambios reales (p. ej. al abrir la app) no cuentan como edición.
  if (meta.hash && hashOf(localStorage.getItem(LOCAL_KEY)) === meta.hash) return;
  saveCounter += 1;
  writeMeta({ dirty: true, localAt: Date.now() });
  if (ready) schedulePush();
};

const startSync = async (user: User) => {
  const { db, fsMod } = await loadFirebase();
  ready = false;
  setStatus({ phase: 'syncing', email: user.email ?? undefined, name: user.displayName ?? undefined, message: undefined });
  ref = fsMod.doc(db, 'users', user.uid, 'tide', 'state');
  try {
    const snap = await fsMod.getDoc(ref);
    const meta = readMeta();
    const local = localStorage.getItem(LOCAL_KEY);
    const remote = snap.exists()
      ? { at: Number(snap.get('updatedAt')) || 0, json: await decode(String(snap.get('encoding')), snap.get('data') as BytesType) }
      : null;

    ready = true;
    if (!remote) {
      writeMeta({ uid: user.uid });
      if (local) await push();
      else setStatus({ phase: 'synced' });
    } else if (meta.uid === user.uid && !meta.dirty) {
      if (remote.at !== meta.remoteAt) applyRemote(remote.json, remote.at, user.uid);
      else setStatus({ phase: 'synced', lastSync: remote.at });
    } else if (meta.uid === user.uid) {
      // Hubo cambios locales sin subir.
      if (remote.at === meta.remoteAt || (meta.localAt ?? 0) > remote.at) {
        if (remote.at !== meta.remoteAt) backup(remote.json);
        await push();
      } else {
        backup(local);
        applyRemote(remote.json, remote.at, user.uid);
      }
    } else {
      // Primera vez de esta cuenta en este dispositivo.
      writeMeta({ uid: user.uid });
      if (trainingAmount(local) > trainingAmount(remote.json)) {
        backup(remote.json);
        await push();
      } else {
        if (trainingAmount(local) > 0) backup(local);
        applyRemote(remote.json, remote.at, user.uid);
      }
    }
  } catch (error) {
    ready = false;
    setStatus({ phase: 'error', message: error instanceof Error ? error.message : 'No se pudo leer la nube.' });
    return;
  }

  unsubscribeSnapshot?.();
  unsubscribeSnapshot = fsMod.onSnapshot(ref, async (snap) => {
    if (!snap.exists() || snap.metadata.hasPendingWrites) return;
    const at = Number(snap.get('updatedAt')) || 0;
    const meta = readMeta();
    if (at === meta.remoteAt || meta.dirty || pushing) return;
    try {
      applyRemote(await decode(String(snap.get('encoding')), snap.get('data') as BytesType), at, user.uid);
    } catch { /* se reintenta en el próximo cambio */ }
  });
};

const stopSync = () => {
  unsubscribeSnapshot?.();
  unsubscribeSnapshot = null;
  ready = false;
  ref = null;
};

let initPromise: Promise<void> | null = null;
/** Se llama una vez cuando arranca la app. Idempotente. */
export const initCloud = (): Promise<void> => {
  if (!cloudConfigured) return Promise.resolve();
  if (!initPromise) {
    initPromise = (async () => {
      try {
        const { auth, authMod } = await loadFirebase();
        authMod.getRedirectResult(auth).catch(() => undefined);
        authMod.onAuthStateChanged(auth, (user) => {
          if (user) void startSync(user);
          else { stopSync(); setStatus({ phase: 'signedOut', email: undefined, name: undefined }); }
        });
        window.addEventListener('online', () => { if (readMeta().dirty) schedulePush(0); });
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'hidden' && pushTimer) { clearTimeout(pushTimer); pushTimer = null; void push(); }
        });
      } catch (error) {
        setStatus({ phase: 'error', message: error instanceof Error ? error.message : 'No se pudo iniciar Firebase.' });
      }
    })();
  }
  return initPromise;
};

export const signInCloud = async () => {
  const { auth, authMod } = await loadFirebase();
  const provider = new authMod.GoogleAuthProvider();
  try {
    await authMod.signInWithPopup(auth, provider);
  } catch (error) {
    const code = (error as { code?: string }).code ?? '';
    if (code === 'auth/popup-blocked' || code === 'auth/operation-not-supported-in-this-environment') {
      await authMod.signInWithRedirect(auth, provider);
      return;
    }
    if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return;
    if (code === 'auth/unauthorized-domain') {
      setStatus({ phase: 'error', message: `Agregá ${location.hostname} en Firebase → Authentication → Configuración → Dominios autorizados.` });
      return;
    }
    setStatus({ phase: 'error', message: error instanceof Error ? error.message : 'No se pudo iniciar sesión.' });
  }
};

export const signOutCloud = async () => {
  const { auth, authMod } = await loadFirebase();
  if (pushTimer) { clearTimeout(pushTimer); pushTimer = null; await push(); }
  await authMod.signOut(auth);
};

export const syncNow = () => { if (ready) void push(); };
