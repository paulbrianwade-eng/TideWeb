const pad = (n: number) => String(n).padStart(2, '0');

export const toISO = (d: Date): string =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const todayISO = (): string => toISO(new Date());

export const parseISO = (iso: string): Date => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
};

export const addDays = (iso: string, days: number): string => {
  const d = parseISO(iso);
  d.setDate(d.getDate() + days);
  return toISO(d);
};

const DAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const DAYS_SHORT = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
const MONTHS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

export const weekdayName = (iso: string): string => DAYS[parseISO(iso).getDay()];
export const weekdayShort = (iso: string): string => DAYS_SHORT[parseISO(iso).getDay()];
export const dayNumber = (iso: string): number => parseISO(iso).getDate();
export const monthName = (iso: string): string => MONTHS[parseISO(iso).getMonth()];

export const longDate = (iso: string): string => {
  const d = parseISO(iso);
  return `${DAYS[d.getDay()]} ${d.getDate()} de ${MONTHS[d.getMonth()]}`;
};

export const shortDate = (iso: string): string => {
  const d = parseISO(iso);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
};

export const startOfWeek = (iso: string): string => {
  const d = parseISO(iso);
  const diff = (d.getDay() + 6) % 7; // lunes = 0
  d.setDate(d.getDate() - diff);
  return toISO(d);
};

export const monthMatrix = (iso: string): string[] => {
  const d = parseISO(iso);
  const first = new Date(d.getFullYear(), d.getMonth(), 1);
  const start = startOfWeek(toISO(first));
  return Array.from({ length: 42 }, (_, i) => addDays(start, i));
};

export const isSameMonth = (a: string, b: string): boolean =>
  a.slice(0, 7) === b.slice(0, 7);

export const formatClock = (ms: number): string => {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${pad(m)}:${pad(s)}`;
};
