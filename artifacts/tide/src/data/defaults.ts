import type { NutritionDayType, ProgressMetric, UserProfile } from '../types';

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Atleta',
  age: 38,
  weight: 85,
  height: 184,
  targetWeight: 80,
  daysAvailable: 5,
  preferredDuration: '40–70 min',
  equipment: ['Gimnasio completo', 'Barra', 'Rack', 'Mancuernas', 'Polea', 'Assault Bike', 'Cajón', 'Balón medicinal'],
  sports: ['Rugby (previo)', 'Surf', 'Golf', 'Esquí', 'Running'],
  complaints: ['Zona lumbar', 'Ciático'],
  trainingTime: '06:30',
};

export const EQUIPMENT_OPTIONS = [
  'Gimnasio completo',
  'Barra',
  'Rack',
  'Mancuernas',
  'Kettlebells',
  'Polea',
  'Landmine',
  'Bandas',
  'Assault Bike',
  'Remo',
  'SkiErg',
  'Cajón',
  'Balón medicinal',
  'Trineo',
];

export const SPORT_OPTIONS = ['Rugby (previo)', 'Surf', 'Golf', 'Esquí', 'Running', 'Natación', 'Trekking'];

export const PREFERENCES = ['Fuerza', 'AMRAP', 'HYROX', 'Trabajo atlético', 'Sin EMOM como formato principal'];

export const METRICS: ProgressMetric[] = [
  { id: 'weight', group: 'Composición', label: 'Peso corporal', unit: 'kg', target: '80 kg', lowerIsBetter: true },
  { id: 'waist', group: 'Composición', label: 'Circunferencia de cintura', unit: 'cm', lowerIsBetter: true },
  { id: 'bodyfat', group: 'Composición', label: 'Grasa corporal estimada', unit: '%', hint: 'Opcional', lowerIsBetter: true },

  { id: 'bench', group: 'Fuerza', label: 'Bench Press', unit: 'kg × 5' },
  { id: 'pullups', group: 'Fuerza', label: 'Dominadas estrictas', unit: 'reps' },
  { id: 'squat', group: 'Fuerza', label: 'Back Squat', unit: 'kg × 5' },
  { id: 'rdl', group: 'Fuerza', label: 'Romanian Deadlift', unit: 'kg × 8' },
  { id: 'farmer', group: 'Fuerza', label: 'Farmer Carry', unit: 'kg × 40 m' },

  { id: 'broad-jump', group: 'Atlético', label: 'Broad Jump', unit: 'cm' },
  { id: 'vertical-jump', group: 'Atlético', label: 'Vertical Jump', unit: 'cm' },
  { id: 'balance', group: 'Atlético', label: 'Equilibrio unipodal', unit: 's' },
  { id: 'throw', group: 'Atlético', label: 'Rotational Throw', unit: 'm' },

  { id: '5k', group: 'Engine', label: '5 km', unit: 'min', lowerIsBetter: true },
  { id: 'vo2', group: 'Engine', label: 'VO₂ max', unit: 'ml/kg/min' },
  { id: 'rhr', group: 'Engine', label: 'FC en reposo', unit: 'bpm', lowerIsBetter: true },
  { id: 'zone2', group: 'Engine', label: 'Zona 2 semanal', unit: 'min' },

  { id: 'sleep', group: 'Recuperación', label: 'Horas de sueño', unit: 'h' },
  { id: 'energy', group: 'Recuperación', label: 'Energía', unit: '/10' },
  { id: 'pain', group: 'Recuperación', label: 'Dolor', unit: '/10', lowerIsBetter: true },
  { id: 'hrv', group: 'Recuperación', label: 'HRV (manual)', unit: 'ms' },
];

export const METRIC_GROUPS: ProgressMetric['group'][] = [
  'Composición',
  'Fuerza',
  'Atlético',
  'Engine',
  'Recuperación',
];

export interface NutritionDayConfig {
  id: NutritionDayType;
  label: string;
  carbs: 'Alto' | 'Moderado' | 'Bajo';
  note: string;
}

export const NUTRITION_DAYS: NutritionDayConfig[] = [
  { id: 'fuerza', label: 'Fuerza', carbs: 'Moderado', note: 'Carbohidratos alrededor del entrenamiento; proteína en cada comida.' },
  { id: 'hibrido', label: 'Híbrido', carbs: 'Alto', note: 'Sesión larga y mixta: sumá carbohidratos en el almuerzo y la cena.' },
  { id: 'zona2', label: 'Zona 2', carbs: 'Moderado', note: 'Suficiente energía para sostener el ritmo sin exceso calórico.' },
  { id: 'descanso', label: 'Descanso', carbs: 'Bajo', note: 'Menos carbohidratos, misma proteína. Priorizá verduras y grasas buenas.' },
  { id: 'ski', label: 'Esquí', carbs: 'Alto', note: 'Jornada larga en frío: desayuno sólido, colación cada 2 h e hidratación constante.' },
  { id: 'surf', label: 'Surf', carbs: 'Moderado', note: 'Comida liviana antes del agua y una recarga con proteína al salir.' },
  { id: 'golf', label: 'Golf', carbs: 'Moderado', note: 'Energía estable: colaciones cada 6 hoyos e hidratación con electrolitos.' },
];

export interface Meal {
  id: string;
  time: string;
  title: string;
  items: string[];
  optional?: boolean;
}

export const MEAL_PLAN: Meal[] = [
  {
    id: 'pre',
    time: '06:00',
    title: 'Pre-entrenamiento',
    items: ['300–500 ml de agua', 'Mate o café', 'Creatina 5 g', 'Banana opcional si el entrenamiento es intenso o supera los 60 min'],
  },
  {
    id: 'post',
    time: '08:00',
    title: 'Post-entrenamiento',
    items: ['250 g de yogur griego', '60 g de avena', '1 banana', 'Frutos rojos', '1 scoop de whey', 'Nueces'],
  },
  { id: 'mid-morning', time: '11:00', title: 'Media mañana', items: ['1 fruta', '30 g de almendras'] },
  {
    id: 'lunch',
    time: '13:30',
    title: 'Almuerzo',
    items: ['220 g de pollo', '250 g de papas al horno', 'Ensalada grande', 'Aceite de oliva'],
  },
  { id: 'snack', time: '17:00', title: 'Merienda', items: ['Yogur griego', 'Fruta'] },
  {
    id: 'dinner',
    time: '20:30',
    title: 'Cena',
    items: ['220 g de salmón, pollo o carne magra', 'Verduras', '100–150 g de arroz cocido si al día siguiente hay entrenamiento o esquí'],
  },
  { id: 'night', time: 'Antes de dormir', title: 'Opcional', items: ['Yogur griego', 'Queso cottage'], optional: true },
];

export const NUTRITION_TARGETS = {
  protein: '170–190 g',
  calories: 'Déficit moderado',
  water: '2,5–3 L + lo que pida el entrenamiento',
  creatine: '5 g diarios',
};

export const MATE_NOTE =
  'El mate puede utilizarse antes del entrenamiento por su aporte de cafeína, pero no reemplaza la hidratación.';
