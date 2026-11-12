/**
 * ENVIAR AL COACH (Google Drive)
 * ──────────────────────────────
 * Sube tus datos a tu propio Google Drive, carpeta "TIDE":
 *  - tide-coach.csv    → series, cargas, RPE, finishers, métricas (formato para analizar)
 *  - tide-backup.json  → respaldo completo del estado de la app
 * Los archivos se reemplazan en cada envío. Claude los lee desde tu Drive para ajustar la rutina.
 *
 * Usa el permiso "drive.file": la app solo puede ver y tocar los archivos que ella misma creó,
 * nunca el resto de tu Drive.
 */
import type { AppState, Workout } from '../types';
import { buildBackup, buildCoachCsv } from './export';
import { loadFirebase } from './cloud-sync';

const SCOPE = 'https://www.googleapis.com/auth/drive.file';
const FOLDER_NAME = 'TIDE';
const FOLDER_MIME = 'application/vnd.google-apps.folder';
const API = 'https://www.googleapis.com/drive/v3/files';
const UPLOAD = 'https://www.googleapis.com/upload/drive/v3/files';

let cached: { token: string; expires: number } | null = null;

/** Pide (o reutiliza) un permiso temporal de Google Drive. Abre una ventanita de Google. */
const getDriveToken = async (): Promise<string> => {
  if (cached && cached.expires > Date.now()) return cached.token;
  const { auth, authMod } = await loadFirebase();
  const provider = new authMod.GoogleAuthProvider();
  provider.addScope(SCOPE);
  if (auth.currentUser?.email) provider.setCustomParameters({ login_hint: auth.currentUser.email });
  const result = auth.currentUser
    ? await authMod.reauthenticateWithPopup(auth.currentUser, provider)
    : await authMod.signInWithPopup(auth, provider);
  const token = authMod.GoogleAuthProvider.credentialFromResult(result)?.accessToken;
  if (!token) throw new Error('Google no devolvió el permiso de Drive.');
  cached = { token, expires: Date.now() + 50 * 60 * 1000 };
  return token;
};

const driveFetch = async (token: string, url: string, init: RequestInit = {}) => {
  const res = await fetch(url, { ...init, headers: { Authorization: `Bearer ${token}`, ...(init.headers ?? {}) } });
  if (res.status === 401) cached = null;
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    if (body.includes('accessNotConfigured') || body.includes('has not been used') || body.includes('SERVICE_DISABLED')) {
      throw new Error('Falta activar la "Google Drive API" en Google Cloud para el proyecto tide-ce785.');
    }
    throw new Error(`Drive respondió ${res.status}. Probá de nuevo.`);
  }
  return res;
};

const q = (s: string) => s.replace(/'/g, "\\'");

const findId = async (token: string, query: string): Promise<string | null> => {
  const res = await driveFetch(token, `${API}?q=${encodeURIComponent(query)}&fields=files(id)&spaces=drive`);
  const data = (await res.json()) as { files?: { id: string }[] };
  return data.files?.[0]?.id ?? null;
};

const ensureFolder = async (token: string): Promise<string> => {
  const existing = await findId(token, `name='${FOLDER_NAME}' and mimeType='${FOLDER_MIME}' and trashed=false`);
  if (existing) return existing;
  const res = await driveFetch(token, API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: FOLDER_NAME, mimeType: FOLDER_MIME }),
  });
  return ((await res.json()) as { id: string }).id;
};

const putFile = async (token: string, folderId: string, name: string, content: string, mime: string) => {
  const existing = await findId(token, `name='${q(name)}' and '${folderId}' in parents and trashed=false`);
  if (existing) {
    await driveFetch(token, `${UPLOAD}/${existing}?uploadType=media`, {
      method: 'PATCH', headers: { 'Content-Type': mime }, body: content,
    });
    return;
  }
  const boundary = `tide${Date.now()}`;
  const body =
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n` +
    JSON.stringify({ name, parents: [folderId], mimeType: mime }) +
    `\r\n--${boundary}\r\nContent-Type: ${mime}\r\n\r\n${content}\r\n--${boundary}--`;
  await driveFetch(token, `${UPLOAD}?uploadType=multipart`, {
    method: 'POST', headers: { 'Content-Type': `multipart/related; boundary=${boundary}` }, body,
  });
};

const LAST_KEY = 'tide.coach.lastSent';
export const lastCoachSend = (): number | null => {
  try { return Number(localStorage.getItem(LAST_KEY)) || null; } catch { return null; }
};

export const sendToCoach = async (state: AppState, program: Workout[]): Promise<string> => {
  const token = await getDriveToken();
  const folderId = await ensureFolder(token);
  const { csv, rowCount } = buildCoachCsv(state, program);
  await putFile(token, folderId, 'tide-coach.csv', csv, 'text/csv');
  await putFile(token, folderId, 'tide-backup.json', JSON.stringify(buildBackup(state), null, 2), 'application/json');
  try { localStorage.setItem(LAST_KEY, String(Date.now())); } catch { /* noop */ }
  return `Enviado a tu Drive (carpeta TIDE): ${rowCount} registros.`;
};
