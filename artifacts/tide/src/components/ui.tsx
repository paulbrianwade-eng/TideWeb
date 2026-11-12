import type { ReactNode } from 'react';
import tideLogo from '../assets/tide-logo.png';

export const Logo = ({ compact = false, light = false }: { compact?: boolean; light?: boolean }) => (
  <div className={`flex items-baseline gap-2 ${light ? 'text-white' : 'text-ink'}`}>
    <img src={tideLogo} alt="TIDE" className="block h-auto w-24 shrink-0 object-contain" />
    {!compact && (
      <span className={`label ${light ? 'text-white/70' : ''}`}>High Performance Training System</span>
    )}
  </div>
);



export const Card = ({
  children,
  className = '',
  as: As = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'li' | 'article';
}) => <As className={`card p-5 ${className}`}>{children}</As>;

export const SectionTitle = ({ eyebrow, title, right }: { eyebrow?: string; title: string; right?: ReactNode }) => (
  <div className="section-head">
    <div>
      {eyebrow && <p className="label">{eyebrow}</p>}
      <h2 className="text-xl">{title}</h2>
    </div>
    {right}
  </div>
);

type Tone = 'accent' | 'success' | 'warn' | 'danger' | 'muted' | 'ink';

const TONE_CLASS: Record<Tone, string> = {
  accent: 'bg-lime text-ink border-transparent',
  success: 'bg-success/10 text-success border-success/30',
  warn: 'bg-warn/10 text-warn border-warn/30',
  danger: 'bg-danger/10 text-danger border-danger/30',
  muted: 'bg-surface text-muted border-line',
  ink: 'bg-brand text-white border-brand',
};

export const StatusBadge = ({ tone = 'muted', children, icon }: { tone?: Tone; children: ReactNode; icon?: ReactNode }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] ${TONE_CLASS[tone]}`}
  >
    {icon}
    {children}
  </span>
);

export const EmptyState = ({ title, hint, action }: { title: string; hint: string; action?: ReactNode }) => (
  <div className="rounded-2xl border border-dashed border-line bg-surface p-8 text-center">
    <p className="font-display text-xl uppercase">{title}</p>
    <p className="mt-2 meta">{hint}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
);

/** Métrica editorial: etiqueta chica arriba, número grande abajo. */
export const Stat = ({
  label,
  value,
  size = 'md',
  accent = false,
}: {
  label: string;
  value: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  accent?: boolean;
}) => {
  const cls = { sm: 'text-xl', md: 'text-3xl', lg: 'text-5xl', xl: 'text-7xl' }[size];
  return (
    <div>
      <p className="label">{label}</p>
      <p className={`figure mt-1 ${cls} ${accent ? 'text-brand' : ''}`}>{value}</p>
    </div>
  );
};

export const ScaleSelector = ({
  label,
  value,
  onChange,
  max = 10,
  min = 1,
  hint,
}: {
  label: string;
  value: number | null;
  onChange: (v: number) => void;
  max?: number;
  min?: number;
  hint?: string;
}) => {
  const values = Array.from({ length: max - min + 1 }, (_, i) => i + min);
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <p className="label-ink">{label}</p>
        <p className="figure text-2xl">{value === null ? '—' : value}</p>
      </div>
      <div role="group" aria-label={label} className="grid grid-cols-5 gap-1.5 sm:grid-cols-10 sm:gap-1">
        {values.map((v) => {
          const active = value !== null && v <= value;
          return (
            <button
              key={v}
              type="button"
              aria-label={`${label}: ${v}`}
              aria-pressed={value === v}
              onClick={() => onChange(v)}
              className={`h-11 rounded-lg border text-xs font-semibold transition-all duration-200 sm:h-9 ${
                active ? 'border-brand bg-brand text-white' : 'border-line bg-surface text-muted hover:border-brand'
              } ${value === v ? 'ring-2 ring-lime ring-offset-1' : ''}`}
            >
              {v}
            </button>
          );
        })}
      </div>
      {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </div>
  );
};

export const Toggle = ({
  active,
  onClick,
  children,
  ariaLabel,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  ariaLabel?: string;
}) => (
  <button
    type="button"
    aria-pressed={active}
    aria-label={ariaLabel}
    onClick={onClick}
    className={`rounded-xl border px-3 py-3 text-left text-sm transition-all duration-200 ${
      active ? 'border-brand bg-brand text-white' : 'border-line bg-surface text-muted hover:border-brand hover:text-ink'
    }`}
  >
    <span className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className={`grid h-4 w-4 shrink-0 place-items-center rounded border text-[10px] ${
          active ? 'border-lime bg-lime text-ink' : 'border-line'
        }`}
      >
        {active ? '✓' : ''}
      </span>
      {children}
    </span>
  </button>
);

export const Field = ({
  label,
  value,
  onChange,
  type = 'text',
  suffix,
  placeholder,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  suffix?: string;
  placeholder?: string;
  inputMode?: 'numeric' | 'decimal' | 'text';
}) => {
  const id = `f-${label.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <label htmlFor={id} className="block">
      <span className="label">{label}</span>
      <span className="mt-1 flex items-center gap-2">
        <input
          id={id}
          type={type}
          inputMode={inputMode}
          value={value}
          placeholder={placeholder}
          onChange={(ev) => onChange(ev.target.value)}
          className="field"
        />
        {suffix && <span className="label shrink-0">{suffix}</span>}
      </span>
    </label>
  );
};
