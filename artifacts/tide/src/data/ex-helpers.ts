import type { Capacity, Exercise, ExerciseCategory, SportModule } from '../types';

export interface Draft {
  cat: ExerciseCategory[];
  obj: string;
  cap: Capacity[];
  tgt: string[];
  mod?: SportModule[];
  typ: string;
  cues: string[];
  err: string[];
  reg: string;
  pro: string;
  eq: string[];
  vid?: string;
}

/** Constructor compacto de ejercicios: mantiene la tabla legible y editable. */
export const x = (id: string, name: string, d: Draft): Exercise => ({
  id,
  name,
  categories: d.cat,
  objective: d.obj,
  capacities: d.cap,
  targets: d.tgt,
  modules: d.mod,
  typical: d.typ,
  cues: d.cues,
  mistakes: d.err,
  regression: d.reg,
  progression: d.pro,
  equipment: d.eq,
  video: d.vid ?? `${name} exercise technique`,
});
