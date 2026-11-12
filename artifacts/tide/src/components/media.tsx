import type { BlockKind, Workout } from '../types';

/**
 * SISTEMA DE IMÁGENES — sin URLs externas.
 * Para usar fotos propias: copiá los archivos a `public/img/` y agregá la
 * entrada acá, con clave el id de la sesión, `day-N` o el id del ejercicio.
 */
export const IMAGES: Record<string, string> = {
  // 'w1d1': '/img/strong-legs.jpg',
  // 'box-squat': '/img/box-squat.jpg',
};

const TONE: Record<string, [string, string]> = {
  'zona-media': ['#087F5B', '#B8FF72'],
  fuerza: ['#161816', '#087F5B'],
  atleta: ['#056647', '#B8FF72'],
  finisher: ['#087F5B', '#E9FFD7'],
  outdoor: ['#056647', '#B8FF72'],
  recovery: ['#E9FFD7', '#B8FF72'],
};

const hash = (s: string) => [...s].reduce((a, c) => a + c.charCodeAt(0), 0);

/** Placeholder generativo: determinista, monocromo, sin dependencias. */
export const Placeholder = ({
  tone = 'fuerza',
  seed = 0,
  className = '',
}: {
  tone?: string;
  seed?: number;
  className?: string;
}) => {
  const [from, to] = TONE[tone] ?? TONE.fuerza;
  const id = `g${tone}${seed}`;
  const shift = seed % 40;
  return (
    <svg viewBox="0 0 120 120" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="120" height="120" fill={`url(#${id})`} />
      <g stroke="#FFFFFF" strokeOpacity="0.16" strokeWidth="1.5">
        {Array.from({ length: 7 }, (_, i) => (
          <line key={i} x1={-20 + i * 24 + shift} y1={140} x2={30 + i * 24 + shift} y2={-20} />
        ))}
      </g>
      <circle cx={80 - (seed % 20)} cy={40 + (seed % 15)} r="26" fill="#FFFFFF" fillOpacity="0.12" />
    </svg>
  );
};

/** Miniatura de ejercicio. */
export const Thumb = ({
  exerciseId,
  kind,
  className = '',
}: {
  exerciseId: string;
  kind: BlockKind;
  className?: string;
}) => {
  const src = IMAGES[exerciseId];
  return src ? (
    <img src={src} alt="" className={`object-cover ${className}`} />
  ) : (
    <Placeholder tone={kind} seed={hash(exerciseId)} className={className} />
  );
};

/** Hero de la sesión: foto si existe, si no placeholder, siempre con overlay legible. */
export const TodayHero = ({
  workout,
  className = '',
  children,
}: {
  workout: Workout;
  className?: string;
  children?: React.ReactNode;
}) => {
  const src = IMAGES[workout.id] ?? IMAGES[`day-${workout.day}`];
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {src ? (
        <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <Placeholder tone="fuerza" seed={workout.week * 7 + workout.day} className="absolute inset-0 h-full w-full" />
      )}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/45 to-ink/10" />
      <div className="relative text-white">{children}</div>
    </div>
  );
};
