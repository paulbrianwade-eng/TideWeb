import { Dumbbell, Flame, Target, Waves, Moon, Mountain, Footprints } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { BlockKind } from '../types';

export interface BlockMeta {
  label: string;
  icon: LucideIcon;
  /** Color del encabezado. El verde brillante es el de los bloques principales. */
  head: string;
  text: string;
}

export const BLOCK_META: Record<BlockKind, BlockMeta> = {
  'zona-media': { label: 'Zona media / Flow', icon: Target, head: 'bg-sky', text: 'text-brand-dark' },
  fuerza: { label: 'Strength + Power', icon: Dumbbell, head: 'bg-violet-soft', text: 'text-brand-dark' },
  atleta: { label: 'Atleta', icon: Waves, head: 'bg-sky', text: 'text-brand-dark' },
  finisher: { label: 'Hybrid', icon: Flame, head: 'bg-success', text: 'text-white' },
  outdoor: { label: 'Running', icon: Mountain, head: 'bg-brand', text: 'text-white' },
  recovery: { label: 'Recuperación', icon: Moon, head: 'bg-mist', text: 'text-ink' },
  // La transición se ve distinta de los bloques principales: tarjeta más simple.
  transicion: { label: 'Vuelta a la manzana', icon: Footprints, head: 'bg-lime-soft', text: 'text-brand-dark' },
};
