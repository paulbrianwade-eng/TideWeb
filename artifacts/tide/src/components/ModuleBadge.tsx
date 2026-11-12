import { Mountain, Waves, Flag, Footprints } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { SportModule } from '../types';
import { MODULE_COLOR, MODULE_LABEL } from '../data/exercises';

export const MODULE_ICON: Record<SportModule, LucideIcon> = {
  ski: Mountain,
  surf: Waves,
  golf: Flag,
  running: Footprints,
};

export const ModuleBadge = ({
  module,
  size = 'md',
  light = false,
}: {
  module: SportModule;
  size?: 'sm' | 'md';
  light?: boolean;
}) => {
  const Icon = MODULE_ICON[module];
  const color = MODULE_COLOR[module];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-mono uppercase tracking-[0.14em] ${
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px]'
      }`}
      style={
        light
          ? { borderColor: 'rgba(255,255,255,0.35)', backgroundColor: 'rgba(255,255,255,0.14)', color: '#fff' }
          : { borderColor: `${color}55`, backgroundColor: `${color}14`, color }
      }
    >
      <Icon className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} aria-hidden="true" />
      {MODULE_LABEL[module]}
    </span>
  );
};
