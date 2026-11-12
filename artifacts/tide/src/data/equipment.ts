/**
 * INVENTARIO REAL. El generador solo puede prescribir lo que está acá.
 * `qa/equipment.ts` falla si algún ejercicio pide otra cosa.
 */
export const INVENTORY = [
  'Rack', 'Barra', 'Discos', 'Banco', 'TRX', 'Kettlebell', 'Mancuernas',
  'Balón medicinal', 'Banda', 'Mini band', 'Ab wheel', 'Soga', 'Cajón',
  'Exterior', 'Bicicleta', 'Peso corporal', 'Pared', 'Colchoneta', 'Foam roller',
] as const;
export type Equipment = (typeof INVENTORY)[number];

export const UNAVAILABLE = ['Assault Bike', 'SkiErg', 'Remo', 'Trineo', 'Polea', 'Máquina', 'Cinta', 'Trap bar'];

/** Una sola barra: 20 kg + 2×20 + 2×10 + 2×5 = 90 kg máximo. */
export const BARBELL = { bar: 20, plates: [20, 20, 10, 10, 5, 5], max: 90 };
export const KETTLEBELLS = [8, 12, 20];
export const DUMBBELLS = [3, 5];
export const MED_BALLS = [5, 10];

/** Implemento protagonista: una configuración de barra por sesión. */
export type Station = 'barra' | 'trx' | 'kettlebell' | 'outdoor' | 'bici' | 'suelo';
export const STATION_LABEL: Record<Station, string> = {
  barra: 'Barra', trx: 'TRX', kettlebell: 'Kettlebells', outdoor: 'Exterior',
  bici: 'Bicicleta', suelo: 'Suelo y bandas',
};
