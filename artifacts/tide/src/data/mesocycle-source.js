// =====================================================================
// TIDE · routine.js — Mesociclo rotativo de 4 semanas
// ---------------------------------------------------------------------
// La app sigue leyendo `week` (array de 7 días, mismo formato de siempre).
// La diferencia: `week` ahora se elige solo según la fecha, rotando entre
// 4 semanas distintas (S1 Base → S2 Carga → S3 Pico → S4 Reset + Benchmark).
// Cada lunes cambia la semana. Al terminar S4 vuelve a S1.
//
// IDs: s[semana]-[día]-[bloque]-[n]  ·  días: l, ma, mi, j, v, sa, d
// 1RM asumidos (cambiar cuando tengas datos reales):
//   Bench 76 · Back Squat 105 · Front Squat 85 · Deadlift 140 (techo de discos 90)
//   Strict Press 52 · Push Press 62 · Incline 65 · Bent Over Row 80
// =====================================================================

// Fecha de inicio del mesociclo (lunes). Antes de esta fecha se muestra S1.
export const MESO_START = '2026-11-02';

// Imágenes (si querés las tuyas, cambiá solo estas constantes)
const IMG = {
  push: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
  pull: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
  legs: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&q=80',
  run: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80',
  shoulders: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
  hybrid: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&q=80',
  rest: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
};

// =====================================================================
// SEMANA 1 · BASE (~72% 1RM · RPE 8)
// =====================================================================
const week1 = [
  {
    id: 'lun', day: 'L', name: 'Lunes', type: 'bigg',
    title: 'Push · Bench',
    subtitle: 'S1 Base · Bench Press + metcon de empuje',
    duration: 50, image: IMG.push,
    intro: 'Semana base del mesociclo. Bench al 72% con técnica limpia, metcon de empuje + cadera y core en 40/20. Objetivo: ≥300 kcal (Garmin): densidad alta, descansos mínimos.',
    blocks: [
      { type: 'warmup', title: 'Calentamiento', duration: 6, format: 'GOWOD + activación de hombro',
        exercises: [
          { id: 's1-l-w-1', name: 'GOWOD movilidad hombro', reps: '3 min', detail: 'Rutina de hombro/torácica del día.' },
          { id: 's1-l-w-2', name: 'Band Pull-Aparts', reps: '2 × 15', detail: 'Escápulas atrás, sin encoger hombros.' },
          { id: 's1-l-w-3', name: 'Bench Press rampa', reps: '2 × 8', detail: 'Barra vacía → 40 kg.' },
        ] },
      { type: 'quality', title: 'Push Control', duration: 7, format: "3 rondas · cap 7'",
        exercises: [
          { id: 's1-l-1-1', name: 'Push Up Hold', reps: '30 seg', detail: 'Pecho a 3 cm del piso, codos a 45°.' },
          { id: 's1-l-1-2', name: 'KB Kneeling Halo', reps: '6/6 reps', target: 'KB 12', detail: 'Costillas abajo, glúteos activos.' },
          { id: 's1-l-1-3', name: 'Plank Shoulder Taps', reps: '20 reps', detail: 'Cadera quieta, pies abiertos.' },
          { id: 's1-l-1-4', name: 'DKB Overhead Hold', reps: '30 seg', target: '2 × KB 12', detail: 'Bíceps junto a la oreja, core cerrado.' },
        ] },
      { type: 'strength', title: 'Hybrid Strength', duration: 13, format: "AMRAP 13' · Objetivo 3-4 rondas",
        exercises: [
          { id: 's1-l-2-1', name: 'Barbell Bench Press', reps: '6 reps', target: '~55 kg', detail: '72% 1RM. RPE 8, 1-2 reps en reserva. Pausa breve en el pecho.' },
          { id: 's1-l-2-2', name: 'DKB Floor Press', reps: '10 reps', target: '2 × KB 12', detail: 'Sustituye DDB Chest Press. Codo toca el piso, sube explosivo.' },
          { id: 's1-l-2-3', name: 'Soga (Jump Rope)', reps: '90 seg', detail: 'Sustituye máquina al 40%. Ritmo conversable, recupera el pecho.' },
        ] },
      { type: 'metcon', title: 'Hybrid Metcon', duration: 14, format: "AMRAP 14'",
        exercises: [
          { id: 's1-l-3-1', name: 'Burpees Over The Bar', reps: '8 reps', detail: 'Salto lateral con dos pies.' },
          { id: 's1-l-3-2', name: 'DKB Thruster', reps: '10 reps', target: '2 × KB 12', detail: 'Squat completo, bloqueo arriba.' },
          { id: 's1-l-3-3', name: 'Push Ups', reps: '12 reps', detail: 'Pecho al piso, cuerpo en bloque.' },
          { id: 's1-l-3-4', name: 'American Swing', reps: '15 reps', target: 'KB 20', detail: 'Cadera manda, KB sobre la cabeza.' },
          { id: 's1-l-3-5', name: 'Box Jumps', reps: '10 reps', detail: 'Step down para cuidar tendones.' },
          { id: 's1-l-3-6', name: 'TRX Triceps Extension', reps: '12 reps', detail: 'Codos fijos, cuerpo inclinado según nivel.' },
          { id: 's1-l-3-7', name: 'Mountain Climbers', reps: '30 reps', detail: 'Rápidos, cadera baja.' },
        ] },
      { type: 'finisher', title: 'Midline', duration: 8, format: "2 rondas · 40 seg on / 20 seg off",
        exercises: [
          { id: 's1-l-4-1', name: "Hollow Hold", reps: "40 seg", detail: "Anti-extensión. Lumbar pegada al piso." },
          { id: 's1-l-4-2', name: "V-Sit Ups", reps: "40 seg", detail: "Flexión. Manos tocan pies arriba." },
          { id: 's1-l-4-3', name: "Pallof Press Hold", reps: "40 seg", detail: "Anti-rotación con elástico. Cambiá de lado en la 2ª ronda." },
          { id: 's1-l-4-4', name: "Superman Hold", reps: "40 seg", detail: "Posterior. Brazos y piernas despegados, glúteos apretados." },
        ] },
    ],
  },
  {
    id: 'mar', day: 'M', name: 'Martes', type: 'bigg',
    title: 'Run + Pull · Deadlift',
    subtitle: 'S1 Base · Deadlift + metcon cada 90 seg',
    duration: 50, image: IMG.pull,
    intro: 'Cadena posterior y tirón. Deadlift en el techo de discos con tempo para compensar carga, corrida como recuperación activa. Objetivo: ≥300 kcal (Garmin): densidad alta, descansos mínimos.',
    blocks: [
      { type: 'warmup', title: 'Calentamiento', duration: 6, format: 'GOWOD + bisagra',
        exercises: [
          { id: 's1-ma-w-1', name: 'Happy-Angry Cat', reps: '8 reps', detail: 'Columna segmento a segmento.' },
          { id: 's1-ma-w-2', name: 'Bird Dogs', reps: '6/6 reps', detail: 'Pausa 2 seg extendido.' },
          { id: 's1-ma-w-3', name: 'Deadlift rampa', reps: '3 × 5', detail: '40 → 60 → 80 kg.' },
        ] },
      { type: 'quality', title: 'Pull Prehab', duration: 7, format: "3 rondas · cap 7'",
        exercises: [
          { id: 's1-ma-1-1', name: 'TRX Y-Raise', reps: '10 reps', detail: 'Pulgares arriba, escápulas abajo.' },
          { id: 's1-ma-1-2', name: 'Band Face Pull', reps: '15 reps', detail: 'Rotación externa al final.' },
          { id: 's1-ma-1-3', name: 'Side-Lying External Rotation', reps: '10/10 reps', target: 'DB 3 kg', detail: 'Toalla bajo el codo.' },
          { id: 's1-ma-1-4', name: 'Prone Paddle Simulation (Band)', reps: '30 seg', detail: 'Remada de surf boca abajo.' },
        ] },
      { type: 'strength', title: 'Hybrid Strength', duration: 13, format: "AMRAP 13' · Objetivo 3-4 rondas",
        exercises: [
          { id: 's1-ma-2-1', name: 'Barbell Deadlift', reps: '6 reps', target: '90 kg (tope)', detail: 'Techo de discos (~64%). Bajada en 3 seg para subir el estímulo.' },
          { id: 's1-ma-2-2', name: 'TRX Row', reps: '12 reps', detail: 'Pausa 1 seg con pecho a las manijas.' },
          { id: 's1-ma-2-3', name: 'Run', reps: '90 seg', detail: 'Al 40%. Trote suave de recuperación.' },
        ] },
      { type: 'metcon', title: 'Hybrid Metcon', duration: 14, format: 'Every 90 seg × 9 · rotar A / B / C',
        exercises: [
          { id: 's1-ma-3-1', name: 'SKB Hang Clean', reps: 'A · 6/6 reps', target: 'KB 20', detail: 'Codo pegado, recepción suave.' },
          { id: 's1-ma-3-2', name: 'Burpee', reps: 'A · 6 reps', detail: 'Pecho al piso.' },
          { id: 's1-ma-3-3', name: 'Sprawl to Box Jump', reps: 'B · 6 reps', detail: 'Sprawl rápido, salto al cajón.' },
          { id: 's1-ma-3-4', name: 'Lateral Bounds', reps: 'B · 10 reps', detail: 'Clavá la recepción 1 seg.' },
          { id: 's1-ma-3-5', name: 'DKB Bent Over Row', reps: 'C · 12 reps', target: '2 × KB 20', detail: 'Espalda plana, codos hacia la cadera.' },
          { id: 's1-ma-3-6', name: 'Jumping Lunges', reps: 'C · 12 reps', detail: 'Rodilla trasera cerca del piso.' },
        ] },
      { type: 'finisher', title: 'Midline', duration: 8, format: "EMOM 8 · rotar 4 ejercicios",
        exercises: [
          { id: 's1-ma-4-1', name: "Toe Touches", reps: "15 reps", detail: "Abdomen bajo. Piernas verticales." },
          { id: 's1-ma-4-2', name: "Copenhagen Plank", reps: "15 seg/lado", detail: "Lateral + aductores. Rodilla en el banco si hace falta." },
          { id: 's1-ma-4-3', name: "TRX Body Saw", reps: "10 reps", detail: "Anti-extensión. Pies en el TRX, antebrazos en el piso, empujá atrás y volvé." },
          { id: 's1-ma-4-4', name: "Band Woodchop (alto a bajo)", reps: "10/10 reps", detail: "Rotación. Elástico anclado alto, la cadera inicia." },
        ] },
    ],
  },
  {
    id: 'mie', day: 'X', name: 'Miércoles', type: 'bigg',
    title: 'Legs · Back Squat',
    subtitle: 'S1 Base · Back Squat + metcon de piernas',
    duration: 50, image: IMG.legs,
    intro: 'Día de piernas completo: squat al 72%, unilateral con KB y metcon de pierna explosivo. Objetivo: ≥300 kcal (Garmin): densidad alta, descansos mínimos.',
    blocks: [
      { type: 'warmup', title: 'Calentamiento', duration: 6, format: 'GOWOD + cadera/tobillo',
        exercises: [
          { id: 's1-mi-w-1', name: 'Quadruped Psoas Stretch', reps: '30 seg/lado', detail: 'Glúteo apretado.' },
          { id: 's1-mi-w-2', name: "World's Greatest Stretch", reps: '4/4 reps', detail: 'Rotación torácica completa.' },
          { id: 's1-mi-w-3', name: 'Back Squat rampa', reps: '3 × 5', detail: '20 → 50 → 65 kg.' },
        ] },
      { type: 'quality', title: 'Lower Prehab', duration: 7, format: "3 rondas · cap 7'",
        exercises: [
          { id: 's1-mi-1-1', name: 'Banded Side Steps', reps: '10/10 pasos', detail: 'Mini band en rodillas, media sentadilla.' },
          { id: 's1-mi-1-2', name: 'Single-Leg Glute Bridge', reps: '10/10 reps', detail: 'Pausa 2 seg arriba.' },
          { id: 's1-mi-1-3', name: 'Tibialis Raises', reps: '15 reps', detail: 'Espalda contra la pared, punta de pies arriba.' },
          { id: 's1-mi-1-4', name: 'SKB Single-Leg Deadlift', reps: '6/6 reps', target: 'KB 12', detail: 'Cadera cuadrada.' },
        ] },
      { type: 'strength', title: 'Hybrid Strength', duration: 13, format: "AMRAP 13' · Objetivo 3-4 rondas",
        exercises: [
          { id: 's1-mi-2-1', name: 'Barbell Back Squat', reps: '6 reps', target: '~75 kg', detail: '72% 1RM. Profundidad bajo paralelo, RPE 8.' },
          { id: 's1-mi-2-2', name: 'DKB Front Rack Reverse Lunges', reps: '6/6 reps', target: '2 × KB 12', detail: 'Torso vertical.' },
          { id: 's1-mi-2-3', name: 'Run', reps: '90 seg', detail: 'Al 40%. Soltá las piernas.' },
        ] },
      { type: 'metcon', title: 'Hybrid Metcon', duration: 14, format: "3 rondas for time · cap 14'",
        exercises: [
          { id: 's1-mi-3-1', name: 'Wall Ball', reps: '15 reps', target: 'MB 10 kg', detail: 'Squat completo, blanco ~3 m.' },
          { id: 's1-mi-3-2', name: 'Burpee Box Jump', reps: '8 reps', detail: 'Step down.' },
          { id: 's1-mi-3-3', name: 'Goblet Thrusters', reps: '12 reps', target: 'KB 20', detail: 'Codos adentro.' },
          { id: 's1-mi-3-4', name: 'Skater Jumps', reps: '20 reps', detail: 'Recepción unipodal estable.' },
          { id: 's1-mi-3-5', name: 'DKB Front Rack March', reps: '40 pasos', target: '2 × KB 20', detail: 'Rodilla a la cadera, codos altos.' },
          { id: 's1-mi-3-6', name: 'Soga (Jump Rope)', reps: '100 saltos', detail: 'Ritmo alto.' },
        ] },
      { type: 'finisher', title: 'Midline', duration: 8, format: "AMRAP 8'",
        exercises: [
          { id: 's1-mi-4-1', name: "Reverse Crunches", reps: "15 reps", detail: "Abdomen bajo. La cadera despega del piso." },
          { id: 's1-mi-4-2', name: "Zombie Sit Ups", reps: "10 reps", detail: "Flexión. Brazos al frente, sin impulso." },
          { id: 's1-mi-4-3', name: "KB Plank Pull-Through", reps: "8/8 reps", target: "KB 12", detail: "Anti-rotación. Plancha alta, arrastrá la KB de lado a lado sin rotar cadera." },
          { id: 's1-mi-4-4', name: "Back Extensions", reps: "12 reps", detail: "Posterior. Boca abajo en el piso, pausa arriba." },
        ] },
    ],
  },
  {
    id: 'jue', day: 'J', name: 'Jueves', type: 'run',
    title: 'Run · 4×4',
    subtitle: 'S1 Base · Intervalos 4×4 en Z4',
    duration: 38, image: IMG.run,
    intro: 'Intervalos noruegos 4×4: el estímulo aeróbico más rendidor para VO2max. Objetivo: ≥300 kcal (Garmin).',
    blocks: [
      { type: 'warmup', title: 'Calentamiento', duration: 8, format: 'Trote + drills',
        exercises: [
          { id: 's1-j-w-1', name: 'Trote suave', reps: '6 min', detail: 'Z1-Z2.' },
          { id: 's1-j-w-2', name: 'Drills A-Skip + Pogo Jumps', reps: '2 min', detail: '2 × 20 m cada uno.' },
        ] },
      { type: 'run', title: 'Intervalos 4×4', duration: 25, format: "4 × 4' Z4 / 3' trote",
        exercises: [
          { id: 's1-j-1-1', name: 'Intervalo Z4', reps: '4 × 4 min', detail: 'RPE 8, ~85-90% FCmax. Ritmo sostenible los 4 minutos.' },
          { id: 's1-j-1-2', name: 'Recuperación', reps: '3 × 3 min', detail: 'Trote muy suave, no caminar.' },
        ] },
      { type: 'run', title: 'Vuelta a la calma', duration: 5, format: 'Trote + GOWOD',
        exercises: [
          { id: 's1-j-2-1', name: 'Trote regenerativo', reps: '5 min', detail: 'Z1. Después GOWOD de piernas.' },
        ] },
    ],
  },
  {
    id: 'vie', day: 'V', name: 'Viernes', type: 'bigg',
    title: 'Push · Shoulder Press',
    subtitle: 'S1 Base · Strict Press + escalera ascendente',
    duration: 50, image: IMG.shoulders,
    intro: 'Empuje vertical estricto, bumper rotacional para rugby/golf y escalera híbrida. Objetivo: ≥300 kcal (Garmin).',
    blocks: [
      { type: 'warmup', title: 'Calentamiento', duration: 6, format: 'GOWOD + overhead',
        exercises: [
          { id: 's1-v-w-1', name: 'Lat Stretch + Thoracic Extension', reps: '30 seg/lado', detail: 'En el banco o cajón.' },
          { id: 's1-v-w-2', name: 'Band Dislocates', reps: '10 reps', detail: 'Agarre amplio.' },
          { id: 's1-v-w-3', name: 'Strict Press rampa', reps: '2 × 8', detail: 'Barra vacía → 30 kg.' },
        ] },
      { type: 'quality', title: 'Bumper', duration: 7, format: "3 rondas · cap 7'",
        exercises: [
          { id: 's1-v-1-1', name: 'Bumper Halo', reps: '8/8 reps', target: 'Bumper 5 kg', detail: 'Cuello largo.' },
          { id: 's1-v-1-2', name: 'MB Rotational Slam', reps: '6/6 reps', target: 'MB 10 kg', detail: 'Pivote de pie trasero tipo swing de golf.' },
          { id: 's1-v-1-3', name: 'MB Overhead Throw contra pared', reps: '8 reps', target: 'MB 5 kg', detail: 'Explosivo, tipo line-out.' },
          { id: 's1-v-1-4', name: 'Bumper Overhead Lunges', reps: '6/6 reps', target: 'Bumper 5 kg', detail: 'Brazos bloqueados.' },
        ] },
      { type: 'strength', title: 'Hybrid Strength', duration: 13, format: "AMRAP 13' · Objetivo 3-4 rondas",
        exercises: [
          { id: 's1-v-2-1', name: 'Barbell Shoulder Press', reps: '6 reps', target: '~37.5 kg', detail: '72% 1RM. Glúteos apretados, sin arquear.' },
          { id: 's1-v-2-2', name: 'DKB Z-Press', reps: '8 reps', target: '2 × KB 12', detail: 'Sentado en el piso, piernas extendidas.' },
          { id: 's1-v-2-3', name: 'Soga (Jump Rope)', reps: '90 seg', detail: 'Sustituye máquina al 40%.' },
        ] },
      { type: 'metcon', title: 'Hybrid Metcon', duration: 14, format: "AMRAP 14' · escalera 2-4-6-8-10…",
        exercises: [
          { id: 's1-v-3-1', name: 'DKB Hang Clean & Jerk', reps: 'escalera', target: '2 × KB 12', detail: 'Dip & drive con piernas.' },
          { id: 's1-v-3-2', name: 'Burpee Broad Jump', reps: 'escalera', detail: 'Salto largo máximo.' },
          { id: 's1-v-3-3', name: 'MB Squat Ground to Overhead', reps: 'escalera', target: 'MB 10 kg', detail: 'Del piso a bloqueo arriba.' },
          { id: 's1-v-3-4', name: 'Plank Get Up', reps: 'escalera', detail: 'Alterná brazo que sube primero.' },
          { id: 's1-v-3-5', name: 'KB Renegade Rows', reps: 'escalera', target: '2 × KB 12', detail: 'Sustituye DDB Renegade Rows. Pies abiertos.' },
          { id: 's1-v-3-6', name: 'SKB Single-Arm Snatch', reps: 'escalera (total)', target: 'KB 20', detail: 'Sustituye DDB Single-Arm Snatch. Alterná brazos.' },
        ] },
      { type: 'finisher', title: 'Midline', duration: 8, format: "2 rondas · 45 seg on / 15 seg off",
        exercises: [
          { id: 's1-v-4-1', name: "L-Sit Hold", reps: "45 seg", detail: "Isométrico. Sobre cajones/KB o piernas flexionadas; repartí en series." },
          { id: 's1-v-4-2', name: "Scissor Kicks", reps: "45 seg", detail: "Abdomen bajo. Piernas bajas." },
          { id: 's1-v-4-3', name: "Side Plank Reach-Through", reps: "45 seg", detail: "Lateral + rotación. Pasá el brazo por debajo del torso. Cambiá de lado en la 2ª ronda." },
          { id: 's1-v-4-4', name: "Knee-In Twist", reps: "45 seg", detail: "Oblicuos. Sentado, rodillas al pecho con rotación." },
        ] },
    ],
  },
  {
    id: 'sab', day: 'S', name: 'Sábado', type: 'bigg',
    title: 'HYBRID · Hyrox Home',
    subtitle: 'S1 Base · Front Rack Lunges + Hyrox 4 rondas',
    duration: 55, image: IMG.hybrid,
    intro: 'Sesión estilo Hyrox: potencia de cadera, fuerza de pierna con barra y bloque largo run + estaciones. Objetivo: ≥300 kcal (Garmin): densidad alta, descansos mínimos.',
    blocks: [
      { type: 'warmup', title: 'Calentamiento', duration: 6, format: 'Trote + activación',
        exercises: [
          { id: 's1-sa-w-1', name: 'Trote suave', reps: '3 min', detail: 'Z1-Z2.' },
          { id: 's1-sa-w-2', name: 'Hip 90/90 Stretch', reps: '6/6 reps', detail: 'Transiciones lentas.' },
          { id: 's1-sa-w-3', name: 'Front Rack Lunges rampa', reps: '2 × 5/5', detail: 'Barra vacía → 35 kg.' },
        ] },
      { type: 'quality', title: 'Hip Power', duration: 6, format: "4 rondas · cap 6'",
        exercises: [
          { id: 's1-sa-1-1', name: 'Broad Jump', reps: '4 reps', detail: 'Clavá la recepción.' },
          { id: 's1-sa-1-2', name: 'Rotational Jump 90°', reps: '4/4 reps', detail: 'Aterrizá suave, rodillas alineadas.' },
          { id: 's1-sa-1-3', name: 'Russian Swing', reps: '10 reps', target: 'KB 20', detail: 'Cadera explosiva, KB a altura de pecho.' },
          { id: 's1-sa-1-4', name: 'Pogo Jumps', reps: '20 reps', detail: 'Tobillos rígidos, contacto corto.' },
        ] },
      { type: 'strength', title: 'Hyrox Strength', duration: 12, format: "AMRAP 12'",
        exercises: [
          { id: 's1-sa-2-1', name: 'Barbell Front Rack Lunges', reps: '6/6 reps', target: '~45 kg', detail: 'Codos altos, rodilla roza el piso.' },
          { id: 's1-sa-2-2', name: 'SKB Single-Arm Overhead Carry', reps: '20 m/lado', target: 'KB 20', detail: 'Costillas cerradas.' },
          { id: 's1-sa-2-3', name: 'Run', reps: '90 seg', detail: 'Al 40%.' },
        ] },
      { type: 'metcon', title: 'Hyrox Home', duration: 24, format: "4 rondas for time · cap 24'",
        exercises: [
          { id: 's1-sa-3-1', name: 'Run', reps: '400 m', detail: 'Ritmo de carrera Hyrox, no sprint.' },
          { id: 's1-sa-3-2', name: 'MB Lateral Slam', reps: '16 reps', target: 'MB 10 kg', detail: 'Sustituye SkiErg.' },
          { id: 's1-sa-3-3', name: 'TRX High Row', reps: '15 reps', detail: 'Sustituye Sled Pull. Codos altos.' },
          { id: 's1-sa-3-4', name: 'Burpees To Bumper', reps: '10 reps', detail: 'Tocá el bumper con el salto.' },
          { id: 's1-sa-3-5', name: 'Farmer Carry pesado', reps: '50 m', target: '2 × KB 20', detail: 'Pasos cortos y rápidos.' },
          { id: 's1-sa-3-6', name: 'KB Goblet Walking Lunges', reps: '20 reps', target: 'KB 20', detail: 'Sustituye Sandbag Lunges.' },
          { id: 's1-sa-3-7', name: 'MB Devil Press', reps: '10 reps', target: 'MB 10 kg', detail: 'Burpee + MB del piso a overhead.' },
        ] },
      { type: 'finisher', title: 'Midline', duration: 5, format: "Escalera 1→8 · cap 5'",
        exercises: [
          { id: 's1-sa-4-1', name: "Tatun Sit Ups", reps: "1→8", detail: "Flexión. Sumá 1 rep por ronda." },
          { id: 's1-sa-4-2', name: "Tall Plank Toe Touches", reps: "1→8 por lado", detail: "Anti-rotación. Cadera quieta." },
          { id: 's1-sa-4-3', name: "Leg Levers", reps: "1→8", detail: "Abdomen bajo. Lumbar pegada." },
        ] },
    ],
  },
  {
    id: 'dom', day: 'D', name: 'Domingo', type: 'rest',
    title: 'Descanso activo',
    subtitle: 'Recuperación',
    duration: 45, image: IMG.rest,
    intro: 'Moverse sin carga: caminata, surf suave o golf + GOWOD.',
    blocks: [
      { type: 'warmup', title: 'Descanso activo', duration: 45, format: 'Libre, Z1',
        exercises: [
          { id: 's1-d-w-1', name: 'Caminata / surf suave / golf', reps: '30-45 min', detail: 'Z1, sin buscar intensidad.' },
          { id: 's1-d-w-2', name: 'GOWOD movilidad completa', reps: '15 min', detail: 'Foco cadera y cadena posterior.' },
        ] },
    ],
  },
];

// =====================================================================
// SEMANA 2 · CARGA (~77% 1RM · RPE 8-8.5)
// =====================================================================
const week2 = [
  {
    id: 'lun', day: 'L', name: 'Lunes', type: 'bigg',
    title: 'Push · Incline Bench',
    subtitle: 'S2 Carga · Incline Bench + every 90 seg',
    duration: 50, image: IMG.push,
    intro: 'Cambio de ángulo: inclinado para pectoral superior y deltoides anterior. Bumper rotacional abriendo. Objetivo: ≥300 kcal (Garmin): densidad alta, descansos mínimos.',
    blocks: [
      { type: 'warmup', title: 'Calentamiento', duration: 6, format: 'GOWOD + activación de hombro',
        exercises: [
          { id: 's2-l-w-1', name: 'GOWOD movilidad hombro', reps: '3 min', detail: 'Rutina de hombro/torácica del día.' },
          { id: 's2-l-w-2', name: 'Band Pull-Aparts', reps: '2 × 15', detail: 'Escápulas atrás.' },
          { id: 's2-l-w-3', name: 'Incline Bench rampa', reps: '2 × 8', detail: 'Barra vacía → 35 kg.' },
        ] },
      { type: 'quality', title: 'Bumper', duration: 7, format: "3 rondas · cap 7'",
        exercises: [
          { id: 's2-l-1-1', name: 'MB Hip Rotation Toss', reps: '6/6 reps', target: 'MB 10 kg', detail: 'Contra pared, la cadera inicia.' },
          { id: 's2-l-1-2', name: 'Bumper Overhead Sit-Ups', reps: '10 reps', target: 'Bumper 5 kg', detail: 'Brazos bloqueados.' },
          { id: 's2-l-1-3', name: 'Bumper Russian Twists', reps: '16 reps', target: 'Bumper 5 kg', detail: 'Pies elevados si podés.' },
          { id: 's2-l-1-4', name: 'Air Ball', reps: '10 reps', target: 'MB 5 kg', detail: 'Squat + lanzamiento vertical, recibí y repetí.' },
        ] },
      { type: 'strength', title: 'Hybrid Strength', duration: 13, format: "AMRAP 13' · Objetivo 3-4 rondas",
        exercises: [
          { id: 's2-l-2-1', name: 'Barbell Incline Bench Press', reps: '5 reps', target: '~50 kg', detail: '~77% 1RM inclinado (banco 30-45°). RPE 8-8.5.' },
          { id: 's2-l-2-2', name: 'TRX Chest Fly', reps: '10 reps', detail: 'Sustituye DDB Chest Flys. Brazos semi-flexionados.' },
          { id: 's2-l-2-3', name: 'Soga (Jump Rope)', reps: '90 seg', detail: 'Sustituye máquina al 40%.' },
        ] },
      { type: 'metcon', title: 'Hybrid Metcon', duration: 14, format: 'Every 90 seg × 9 · rotar A / B / C',
        exercises: [
          { id: 's2-l-3-1', name: 'DKB Push Press', reps: 'A · 10 reps', target: '2 × KB 12', detail: 'Sustituye DDB Push Press.' },
          { id: 's2-l-3-2', name: 'Burpees', reps: 'A · 6 reps', detail: 'Pecho al piso.' },
          { id: 's2-l-3-3', name: 'Hand-Release Push Ups', reps: 'B · 12 reps', detail: 'Manos despegan abajo.' },
          { id: 's2-l-3-4', name: 'Skipping', reps: 'B · 30 seg', detail: 'Rodillas altas.' },
          { id: 's2-l-3-5', name: 'Russian Swing', reps: 'C · 15 reps', target: 'KB 20', detail: 'Pesado y explosivo.' },
          { id: 's2-l-3-6', name: 'Jumping Jacks', reps: 'C · 30 reps', detail: 'Ritmo alto.' },
        ] },
      { type: 'finisher', title: 'Midline', duration: 8, format: "Every 90 seg × 5",
        exercises: [
          { id: 's2-l-4-1', name: "Ab Wheel Rollout", reps: "8 reps", detail: "Anti-extensión. Rango hasta donde no arquees." },
          { id: 's2-l-4-2', name: "Lateral Hip Raises", reps: "8/8 reps", detail: "Lateral. Plancha lateral con elevación de cadera." },
          { id: 's2-l-4-3', name: "Lemon Squeeze", reps: "12 reps", detail: "Flexión. Explosivo, codos a rodillas." },
        ] },
    ],
  },
  {
    id: 'mar', day: 'M', name: 'Martes', type: 'bigg',
    title: 'Run + Pull · Bent Over Row',
    subtitle: 'S2 Carga · Barbell Row + AMRAP olímpico',
    duration: 50, image: IMG.pull,
    intro: 'Espalda media y dorsales con barra, potencia de cadena posterior y hang power clean en el metcon. Objetivo: ≥300 kcal (Garmin): densidad alta, descansos mínimos.',
    blocks: [
      { type: 'warmup', title: 'Calentamiento', duration: 6, format: 'GOWOD + bisagra',
        exercises: [
          { id: 's2-ma-w-1', name: 'Happy-Angry Cat', reps: '8 reps', detail: 'Columna segmento a segmento.' },
          { id: 's2-ma-w-2', name: 'Stiff Leg Dead Bug', reps: '6/6 reps', detail: 'Lumbar pegada.' },
          { id: 's2-ma-w-3', name: 'Bent Over Row rampa', reps: '2 × 8', detail: 'Barra vacía → 40 kg.' },
        ] },
      { type: 'quality', title: 'Back Power', duration: 7, format: "4 rondas · cap 7'",
        exercises: [
          { id: 's2-ma-1-1', name: 'Explosive KB Single-Arm Clean', reps: '4/4 reps', target: 'KB 20', detail: 'Máxima velocidad.' },
          { id: 's2-ma-1-2', name: 'Barbell Good Morning', reps: '8 reps', target: 'Barra vacía', detail: 'Rodillas suaves, cadera atrás.' },
          { id: 's2-ma-1-3', name: 'American Swing', reps: '10 reps', target: 'KB 20', detail: 'Extensión de cadera completa.' },
        ] },
      { type: 'strength', title: 'Hybrid Strength', duration: 13, format: "AMRAP 13' · Objetivo 3-4 rondas",
        exercises: [
          { id: 's2-ma-2-1', name: 'Barbell Bent Over Row', reps: '8 reps', target: '~60 kg', detail: '~77% 1RM. Torso a 45°, barra al ombligo.' },
          { id: 's2-ma-2-2', name: 'SKB Single-Leg Deadlift', reps: '8/8 reps', target: 'KB 20', detail: 'Isquios y estabilidad de cadera.' },
          { id: 's2-ma-2-3', name: 'Run', reps: '90 seg', detail: 'Al 40%.' },
        ] },
      { type: 'metcon', title: 'Hybrid Metcon', duration: 14, format: "AMRAP 14'",
        exercises: [
          { id: 's2-ma-3-1', name: 'Barbell Hang Power Clean', reps: '6 reps', target: '~45 kg', detail: 'Recepción en cuarto de sentadilla.' },
          { id: 's2-ma-3-2', name: 'TRX Row', reps: '12 reps', detail: 'Cuerpo bien inclinado.' },
          { id: 's2-ma-3-3', name: 'Sprawl to Box Jump', reps: '6 reps', detail: 'Rápido.' },
          { id: 's2-ma-3-4', name: 'DKB Deadlift', reps: '12 reps', target: '2 × KB 20', detail: 'Ritmo constante.' },
          { id: 's2-ma-3-5', name: 'Jumping Lunges', reps: '16 reps', detail: 'Alternadas.' },
          { id: 's2-ma-3-6', name: 'Mountain Climbers', reps: '30 reps', detail: 'Cadera baja.' },
        ] },
      { type: 'finisher', title: 'Midline', duration: 8, format: "Complete 10→1 · cap 8'",
        exercises: [
          { id: 's2-ma-4-1', name: "Turkish Sit Ups", reps: "10→1 por lado", target: "KB 8", detail: "Flexión + estabilidad de hombro. Brazo bloqueado arriba." },
          { id: 's2-ma-4-2', name: "Leg Circles", reps: "10→1 por sentido", detail: "Abdomen bajo. Círculos amplios, lumbar pegada." },
          { id: 's2-ma-4-3', name: "Superman Swimmers", reps: "10→1", detail: "Posterior. Boca abajo, brazos de adelante a la cadera." },
        ] },
    ],
  },
  {
    id: 'mie', day: 'X', name: 'Miércoles', type: 'bigg',
    title: 'Legs · Hip Thrust',
    subtitle: 'S2 Carga · Hip Thrust + 21-15-9',
    duration: 50, image: IMG.legs,
    intro: 'Semana de glúteo e isquios: hip thrust pesado, curl de isquio y metcon de pierna en esquema descendente. Objetivo: ≥300 kcal (Garmin): densidad alta, descansos mínimos.',
    blocks: [
      { type: 'warmup', title: 'Calentamiento', duration: 6, format: 'GOWOD + cadera',
        exercises: [
          { id: 's2-mi-w-1', name: 'Hip 90/90 Stretch', reps: '6/6 reps', detail: 'Transiciones lentas.' },
          { id: 's2-mi-w-2', name: 'KB Glute Bridge', reps: '15 reps', target: 'KB 20', detail: 'Pausa arriba.' },
          { id: 's2-mi-w-3', name: 'Hip Thrust rampa', reps: '2 × 8', detail: '40 → 70 kg.' },
        ] },
      { type: 'quality', title: 'Hip Power', duration: 7, format: "4 rondas · cap 7'",
        exercises: [
          { id: 's2-mi-1-1', name: 'Box Jumps', reps: '5 reps', detail: 'Altura máxima, step down.' },
          { id: 's2-mi-1-2', name: 'Lateral Bounds', reps: '5/5 reps', detail: 'Distancia máxima, clavá.' },
          { id: 's2-mi-1-3', name: 'Single-Leg Box Jump', reps: '3/3 reps', detail: 'Cajón bajo, recepción a dos pies.' },
        ] },
      { type: 'strength', title: 'Hybrid Strength', duration: 13, format: "AMRAP 13' · Objetivo 3-4 rondas",
        exercises: [
          { id: 's2-mi-2-1', name: 'Barbell Hip Thrust', reps: '10 reps', target: '90 kg (tope)', detail: 'Techo de discos. Pausa 2 seg arriba en cada rep.' },
          { id: 's2-mi-2-2', name: 'TRX Hamstring Curl', reps: '10 reps', detail: 'Sustituye Lying Leg Curls. Cadera arriba todo el set.' },
          { id: 's2-mi-2-3', name: 'Run', reps: '90 seg', detail: 'Al 40%.' },
        ] },
      { type: 'metcon', title: 'Hybrid Metcon', duration: 14, format: "21-15-9 · cap 14'",
        exercises: [
          { id: 's2-mi-3-1', name: 'Wall Ball', reps: '21-15-9', target: 'MB 10 kg', detail: 'Squat completo.' },
          { id: 's2-mi-3-2', name: 'Goblet Pulse Squat', reps: '21-15-9', target: 'KB 20', detail: 'Rebote en el tercio inferior.' },
          { id: 's2-mi-3-3', name: 'Burpee Box Jump', reps: '10-8-6', detail: 'Step down.' },
          { id: 's2-mi-3-4', name: 'DKB Front Rack Reverse Lunges', reps: '10-8-6 por lado', target: '2 × KB 12', detail: 'Torso vertical.' },
          { id: 's2-mi-3-5', name: 'Skater Jumps', reps: '20-16-12', detail: 'Recepción estable.' },
          { id: 's2-mi-3-6', name: 'Soga (Jump Rope)', reps: '60 saltos entre series', detail: 'Transición activa.' },
        ] },
      { type: 'finisher', title: 'Midline', duration: 7, format: "AMRAP 7'",
        exercises: [
          { id: 's2-mi-4-1', name: "KB Dead Bug", reps: "8/8 reps", target: "KB 12", detail: "Anti-extensión. KB arriba con ambas manos, bajá pierna contraria." },
          { id: 's2-mi-4-2', name: "Side Plank", reps: "20 seg/lado", detail: "Lateral. Cadera alta." },
          { id: 's2-mi-4-3', name: "Heel Touches", reps: "20 reps", detail: "Oblicuos. Hombros despegados del piso." },
        ] },
    ],
  },
  {
    id: 'jue', day: 'J', name: 'Jueves', type: 'run',
    title: 'Run · 30/30',
    subtitle: 'S2 Carga · 2 series × 10 × 30/30',
    duration: 38, image: IMG.run,
    intro: 'Intervalos cortos a velocidad alta: mucha calidad de zancada con recuperación incompleta. Objetivo: ≥300 kcal (Garmin).',
    blocks: [
      { type: 'warmup', title: 'Calentamiento', duration: 8, format: 'Trote + drills',
        exercises: [
          { id: 's2-j-w-1', name: 'Trote suave', reps: '6 min', detail: 'Z1-Z2.' },
          { id: 's2-j-w-2', name: 'Strides', reps: '3 × 15 seg', detail: 'Aceleraciones progresivas.' },
        ] },
      { type: 'run', title: '30/30', duration: 24, format: "2 × (10 × 30 seg rápido / 30 seg suave) · 4' entre series",
        exercises: [
          { id: 's2-j-1-1', name: '30 seg rápido', reps: '2 × 10 reps', detail: 'RPE 8-9, ~ritmo 3-5 km.' },
          { id: 's2-j-1-2', name: '30 seg suave', reps: '2 × 10 reps', detail: 'Trote, no frenar.' },
          { id: 's2-j-1-3', name: 'Pausa entre series', reps: '4 min', detail: 'Trote muy suave.' },
        ] },
      { type: 'run', title: 'Vuelta a la calma', duration: 6, format: 'Trote + GOWOD',
        exercises: [
          { id: 's2-j-2-1', name: 'Trote regenerativo', reps: '6 min', detail: 'Z1. Después GOWOD de piernas.' },
        ] },
    ],
  },
  {
    id: 'vie', day: 'V', name: 'Viernes', type: 'bigg',
    title: 'Push · Push Press',
    subtitle: 'S2 Carga · Push Press + AMRAP overhead',
    duration: 50, image: IMG.shoulders,
    intro: 'Potencia de empuje vertical con piernas, deltoides lateral y prehab de manguito. Objetivo: ≥300 kcal (Garmin).',
    blocks: [
      { type: 'warmup', title: 'Calentamiento', duration: 6, format: 'GOWOD + overhead',
        exercises: [
          { id: 's2-v-w-1', name: 'Lat Stretch + Thoracic Extension', reps: '30 seg/lado', detail: 'En el banco.' },
          { id: 's2-v-w-2', name: 'Band Dislocates', reps: '10 reps', detail: 'Agarre amplio.' },
          { id: 's2-v-w-3', name: 'Push Press rampa', reps: '2 × 5', detail: 'Barra vacía → 40 kg.' },
        ] },
      { type: 'quality', title: 'Pull Prehab', duration: 7, format: "3 rondas · cap 7'",
        exercises: [
          { id: 's2-v-1-1', name: 'TRX Face Pull', reps: '12 reps', detail: 'Manos a las orejas.' },
          { id: 's2-v-1-2', name: 'Prone Y-T-W', reps: '6 c/u', target: 'DB 3 kg', detail: 'Boca abajo en banco inclinado.' },
          { id: 's2-v-1-3', name: 'Band External Rotation', reps: '12/12 reps', detail: 'Codo pegado.' },
        ] },
      { type: 'strength', title: 'Hybrid Strength', duration: 13, format: "AMRAP 13' · Objetivo 3-4 rondas",
        exercises: [
          { id: 's2-v-2-1', name: 'Barbell Push Press', reps: '5 reps', target: '~48-50 kg', detail: '~77-80% 1RM push press. Dip corto, drive explosivo.' },
          { id: 's2-v-2-2', name: 'DB Lateral Raises', reps: '15 reps', target: 'DB 5 kg', detail: 'Mancuernas livianas, bajada en 3 seg.' },
          { id: 's2-v-2-3', name: 'Soga (Jump Rope)', reps: '90 seg', detail: 'Sustituye máquina al 40%.' },
        ] },
      { type: 'metcon', title: 'Hybrid Metcon', duration: 14, format: "AMRAP 14'",
        exercises: [
          { id: 's2-v-3-1', name: 'DKB Thruster', reps: '10 reps', target: '2 × KB 12', detail: 'Squat completo.' },
          { id: 's2-v-3-2', name: 'Burpee Broad Jump', reps: '6 reps', detail: 'Salto largo.' },
          { id: 's2-v-3-3', name: 'SKB Single-Arm Snatch', reps: '6/6 reps', target: 'KB 20', detail: 'Sustituye DDB Single-Arm Snatch.' },
          { id: 's2-v-3-4', name: 'Plank Get Up', reps: '10 reps', detail: 'Alterná brazo.' },
          { id: 's2-v-3-5', name: 'MB Squat Ground to Overhead', reps: '10 reps', target: 'MB 10 kg', detail: 'Bloqueo arriba.' },
          { id: 's2-v-3-6', name: 'Box Jumps', reps: '10 reps', detail: 'Step down.' },
        ] },
      { type: 'finisher', title: 'Midline', duration: 7, format: "EMOM 7 · rotar 3 ejercicios",
        exercises: [
          { id: 's2-v-4-1', name: "TRX Knee Tucks", reps: "12 reps", detail: "Anti-extensión + flexión. Pies en el TRX, rodillas al pecho." },
          { id: 's2-v-4-2', name: "MB Russian Twist", reps: "20 reps", target: "MB 5 kg", detail: "Rotación. Pies elevados si podés." },
          { id: 's2-v-4-3', name: "Bear Plank Hold", reps: "30 seg", detail: "Isométrico. Rodillas a 3 cm del piso, espalda plana." },
        ] },
    ],
  },
  {
    id: 'sab', day: 'S', name: 'Sábado', type: 'bigg',
    title: 'HYBRID · Hyrox Home',
    subtitle: 'S2 Carga · Hang Squat Clean + Hyrox 4 rondas',
    duration: 55, image: IMG.hybrid,
    intro: 'Hyrox con estaciones nuevas. Clean pesado para potencia total antes del bloque largo. Objetivo: ≥300 kcal (Garmin): densidad alta, descansos mínimos.',
    blocks: [
      { type: 'warmup', title: 'Calentamiento', duration: 6, format: 'Trote + activación',
        exercises: [
          { id: 's2-sa-w-1', name: 'Trote suave', reps: '3 min', detail: 'Z1-Z2.' },
          { id: 's2-sa-w-2', name: 'Front Step + Thoracic Rotation', reps: '5/5 reps', detail: 'Abrí el pecho al techo.' },
          { id: 's2-sa-w-3', name: 'Hang Squat Clean rampa', reps: '3 × 3', detail: 'Barra vacía → 40 kg.' },
        ] },
      { type: 'quality', title: 'Lower Prehab', duration: 6, format: "3 rondas · cap 6'",
        exercises: [
          { id: 's2-sa-1-1', name: 'Banded Squat', reps: '12 reps', detail: 'Mini band, rodillas afuera.' },
          { id: 's2-sa-1-2', name: 'Single-Leg Romanian Deadlift', reps: '6/6 reps', detail: 'Sin carga, equilibrio.' },
          { id: 's2-sa-1-3', name: 'Single-Leg Calf Raises', reps: '12/12 reps', detail: 'Pausa abajo y arriba.' },
        ] },
      { type: 'strength', title: 'Hyrox Strength', duration: 12, format: "AMRAP 12'",
        exercises: [
          { id: 's2-sa-2-1', name: 'Barbell Hang Squat Clean', reps: '5 reps', target: '~45-50 kg', detail: 'Recepción en sentadilla profunda.' },
          { id: 's2-sa-2-2', name: 'DKB Front Rack Hold', reps: '30 seg', target: '2 × KB 20', detail: 'Codos altos, respirá por la panza.' },
          { id: 's2-sa-2-3', name: 'Run', reps: '90 seg', detail: 'Al 40%.' },
        ] },
      { type: 'metcon', title: 'Hyrox Home', duration: 24, format: "4 rondas for time · cap 24'",
        exercises: [
          { id: 's2-sa-3-1', name: 'Run', reps: '400 m', detail: 'Ritmo de carrera Hyrox.' },
          { id: 's2-sa-3-2', name: 'MB Rotational Slam', reps: '8/8 reps', target: 'MB 10 kg', detail: 'Sustituye SkiErg.' },
          { id: 's2-sa-3-3', name: 'Lateral Bear Crawl', reps: '10 m ida y vuelta', detail: 'Sustituye Sled Push. Rodillas a 3 cm del piso.' },
          { id: 's2-sa-3-4', name: 'Burpees Over The Bar', reps: '8 reps', detail: 'Sustituye Burpee Broad Jump.' },
          { id: 's2-sa-3-5', name: 'American Swing', reps: '15 reps', target: 'KB 20', detail: 'Sustituye remo.' },
          { id: 's2-sa-3-6', name: 'Farmer Carry pesado', reps: '50 m', target: '2 × KB 20', detail: 'Hombros abajo.' },
          { id: 's2-sa-3-7', name: 'Bumper Overhead Lunges', reps: '8/8 reps', target: 'Bumper 5 kg', detail: 'Sustituye Sandbag Lunges.' },
        ] },
      { type: 'finisher', title: 'Midline', duration: 5, format: "30 seg on / 30 seg off × 5 · rotar",
        exercises: [
          { id: 's2-sa-4-1', name: "Hollow Rocks", reps: "30 seg", detail: "Anti-extensión. Forma de banana firme." },
          { id: 's2-sa-4-2', name: "Plank Jack", reps: "30 seg", detail: "Isométrico dinámico. Cadera estable." },
          { id: 's2-sa-4-3', name: "Bent Knee Prayer Crunches", reps: "30 seg", detail: "Flexión. Manos juntas al frente." },
        ] },
    ],
  },
  {
    id: 'dom', day: 'D', name: 'Domingo', type: 'rest',
    title: 'Descanso activo',
    subtitle: 'Recuperación',
    duration: 45, image: IMG.rest,
    intro: 'Moverse sin carga: caminata, surf suave o golf + GOWOD.',
    blocks: [
      { type: 'warmup', title: 'Descanso activo', duration: 45, format: 'Libre, Z1',
        exercises: [
          { id: 's2-d-w-1', name: 'Caminata / surf suave / golf', reps: '30-45 min', detail: 'Z1, sin buscar intensidad.' },
          { id: 's2-d-w-2', name: 'GOWOD movilidad completa', reps: '15 min', detail: 'Foco cadera y cadena posterior.' },
        ] },
    ],
  },
];

// =====================================================================
// SEMANA 3 · PICO (~82% 1RM · RPE 8.5-9)
// =====================================================================
const week3 = [
  {
    id: 'lun', day: 'L', name: 'Lunes', type: 'bigg',
    title: 'Push · Bench Heavy',
    subtitle: 'S3 Pico · Bench pesado + rondas descendentes',
    duration: 50, image: IMG.push,
    intro: 'Semana más pesada del mes. Bench a triples, metcon descendente y core en escalera. Objetivo: ≥300 kcal (Garmin): densidad alta, descansos mínimos.',
    blocks: [
      { type: 'warmup', title: 'Calentamiento', duration: 6, format: 'GOWOD + activación de hombro',
        exercises: [
          { id: 's3-l-w-1', name: 'GOWOD movilidad hombro', reps: '3 min', detail: 'Rutina de hombro/torácica del día.' },
          { id: 's3-l-w-2', name: 'Band Pull-Aparts', reps: '2 × 15', detail: 'Escápulas atrás.' },
          { id: 's3-l-w-3', name: 'Bench Press rampa', reps: '5-3-2', detail: '40 → 50 → 57.5 kg.' },
        ] },
      { type: 'quality', title: 'Pull Prehab', duration: 7, format: "3 rondas · cap 7'",
        exercises: [
          { id: 's3-l-1-1', name: 'Band Face Pull', reps: '15 reps', detail: 'Rotación externa al final.' },
          { id: 's3-l-1-2', name: 'TRX Y-Raise', reps: '10 reps', detail: 'Escápulas abajo.' },
          { id: 's3-l-1-3', name: 'Cuban Press', reps: '8 reps', target: 'DB 3 kg', detail: 'Remo alto → rotación → press.' },
          { id: 's3-l-1-4', name: 'TRX Scapular Retraction', reps: '12 reps', detail: 'Brazos rectos, solo escápulas.' },
        ] },
      { type: 'strength', title: 'Hybrid Strength', duration: 13, format: "AMRAP 13' · Objetivo 4-5 rondas",
        exercises: [
          { id: 's3-l-2-1', name: 'Barbell Bench Press', reps: '3 reps', target: '~62.5-65 kg', detail: '82-85% 1RM. RPE 9, 1 rep en reserva. Si la última ronda sale lenta, bajá 2.5 kg.' },
          { id: 's3-l-2-2', name: 'Deficit Push Ups', reps: '10 reps', detail: 'Manos sobre 2 KB, pecho por debajo de las manos.' },
          { id: 's3-l-2-3', name: 'Soga (Jump Rope)', reps: '90 seg', detail: 'Sustituye máquina al 40%.' },
        ] },
      { type: 'metcon', title: 'Hybrid Metcon', duration: 14, format: "4 rondas descendentes 12-10-8-6 · cap 14'",
        exercises: [
          { id: 's3-l-3-1', name: 'Hand-Release Push Ups', reps: '12-10-8-6', detail: 'Manos despegan abajo.' },
          { id: 's3-l-3-2', name: 'DKB Hang Clean & Jerk', reps: '12-10-8-6', target: '2 × KB 12', detail: 'Dip & drive.' },
          { id: 's3-l-3-3', name: 'Burpees Over The Bar', reps: '12-10-8-6', detail: 'Salto lateral.' },
          { id: 's3-l-3-4', name: 'TRX Triceps Extension', reps: '12-10-8-6', detail: 'Codos fijos.' },
          { id: 's3-l-3-5', name: 'Russian Swing', reps: '12-10-8-6', target: 'KB 20', detail: 'Explosivo.' },
          { id: 's3-l-3-6', name: 'Box Jump Overs', reps: '12-10-8-6', detail: 'Saltá o pasá por encima del cajón.' },
        ] },
      { type: 'finisher', title: 'Midline', duration: 8, format: "Escalera 1→10 · cap 8'",
        exercises: [
          { id: 's3-l-4-1', name: "Walkouts", reps: "1→10", detail: "Anti-extensión. Caminá con las manos hasta plancha larga y volvé." },
          { id: 's3-l-4-2', name: "Tuck Ups", reps: "2→20", detail: "Flexión. Doble de reps que los walkouts." },
          { id: 's3-l-4-3', name: "Plank Hip Taps", reps: "1→10 por lado", detail: "Anti-rotación. Plancha de antebrazos, cadera toca el piso a cada lado." },
        ] },
    ],
  },
  {
    id: 'mar', day: 'M', name: 'Martes', type: 'bigg',
    title: 'Run + Pull · Snatch Grip DL',
    subtitle: 'S3 Pico · Snatch Grip Deadlift + every 90 seg',
    duration: 50, image: IMG.pull,
    intro: 'Agarre de arranque: más rango, más trapecio y dorsal con la misma barra. Power clean en el metcon. Objetivo: ≥300 kcal (Garmin): densidad alta, descansos mínimos.',
    blocks: [
      { type: 'warmup', title: 'Calentamiento', duration: 6, format: 'GOWOD + bisagra',
        exercises: [
          { id: 's3-ma-w-1', name: 'Happy-Angry Cat', reps: '8 reps', detail: 'Columna segmento a segmento.' },
          { id: 's3-ma-w-2', name: 'Bird Dogs', reps: '6/6 reps', detail: 'Pausa 2 seg.' },
          { id: 's3-ma-w-3', name: 'Snatch Grip DL rampa', reps: '3 × 5', detail: '40 → 60 → 70 kg.' },
        ] },
      { type: 'quality', title: 'Hip Power', duration: 7, format: "4 rondas · cap 7'",
        exercises: [
          { id: 's3-ma-1-1', name: 'Broad Jump to Sprint', reps: '2 reps', detail: 'Salto + 10 m sprint.' },
          { id: 's3-ma-1-2', name: 'Rotational Jump 90°', reps: '4/4 reps', detail: 'Recepción suave.' },
          { id: 's3-ma-1-3', name: 'Pogo Jumps', reps: '20 reps', detail: 'Contacto corto.' },
        ] },
      { type: 'strength', title: 'Hybrid Strength', duration: 13, format: "AMRAP 13' · Objetivo 3-4 rondas",
        exercises: [
          { id: 's3-ma-2-1', name: 'Barbell Snatch Grip Deadlift', reps: '6 reps', target: '~80 kg', detail: 'Agarre amplio, pecho arriba. Pausa 1 seg bajo rodilla en la rep 1.' },
          { id: 's3-ma-2-2', name: 'Single-Arm KB Bent Over Row', reps: '10/10 reps', target: 'KB 20', detail: 'Sustituye Single-Arm DB Row. Mano en el banco.' },
          { id: 's3-ma-2-3', name: 'Run', reps: '90 seg', detail: 'Al 40%.' },
        ] },
      { type: 'metcon', title: 'Hybrid Metcon', duration: 14, format: 'Every 90 seg × 9 · rotar A / B / C',
        exercises: [
          { id: 's3-ma-3-1', name: 'Barbell Power Clean', reps: 'A · 4 reps', target: '~45-50 kg', detail: 'Del piso, recepción en cuarto de sentadilla.' },
          { id: 's3-ma-3-2', name: 'Burpee', reps: 'A · 6 reps', detail: 'Pecho al piso.' },
          { id: 's3-ma-3-3', name: 'TRX Row', reps: 'B · 12 reps', detail: 'Cuerpo bien inclinado.' },
          { id: 's3-ma-3-4', name: 'Lateral Bounds', reps: 'B · 10 reps', detail: 'Clavá la recepción.' },
          { id: 's3-ma-3-5', name: 'DKB Bent Over Row', reps: 'C · 10 reps', target: '2 × KB 20', detail: 'Espalda plana.' },
          { id: 's3-ma-3-6', name: 'Skipping', reps: 'C · 30 seg', detail: 'Rodillas altas.' },
        ] },
      { type: 'finisher', title: 'Midline', duration: 8, format: "2 rondas · 45 seg on / 15 seg off",
        exercises: [
          { id: 's3-ma-4-1', name: "Dead Bug Progressions", reps: "45 seg", detail: "Anti-extensión. Brazo y pierna contrarios, exhalá al extender." },
          { id: 's3-ma-4-2', name: "Flutter Kicks", reps: "45 seg", detail: "Abdomen bajo. Patadas cortas y rápidas." },
          { id: 's3-ma-4-3', name: "Band Reverse Woodchop (bajo a alto)", reps: "45 seg", detail: "Rotación. Elástico anclado bajo. Cambiá de lado en la 2ª ronda." },
          { id: 's3-ma-4-4', name: "Superman Hold", reps: "45 seg", detail: "Posterior. Glúteos apretados." },
        ] },
    ],
  },
  {
    id: 'mie', day: 'X', name: 'Miércoles', type: 'bigg',
    title: 'Legs · Front Squat',
    subtitle: 'S3 Pico · Front Squat + AMRAP de piernas',
    duration: 50, image: IMG.legs,
    intro: 'Cuádriceps y core anterior con front squat pesado, step ups unilaterales y metcon de pierna. Objetivo: ≥300 kcal (Garmin): densidad alta, descansos mínimos.',
    blocks: [
      { type: 'warmup', title: 'Calentamiento', duration: 6, format: 'GOWOD + muñeca/tobillo',
        exercises: [
          { id: 's3-mi-w-1', name: 'Ankle Mobility Circles', reps: '10/10 reps', detail: 'Rodilla sobre la punta del pie.' },
          { id: 's3-mi-w-2', name: "World's Greatest Stretch", reps: '4/4 reps', detail: 'Rotación torácica.' },
          { id: 's3-mi-w-3', name: 'Front Squat rampa', reps: '5-3-2', detail: '20 → 45 → 60 kg.' },
        ] },
      { type: 'quality', title: 'Back Power', duration: 7, format: "4 rondas · cap 7'",
        exercises: [
          { id: 's3-mi-1-1', name: 'American Swing', reps: '10 reps', target: 'KB 20', detail: 'Extensión completa.' },
          { id: 's3-mi-1-2', name: 'DKB Hang Clean', reps: '6 reps', target: '2 × KB 12', detail: 'Codos rápidos.' },
          { id: 's3-mi-1-3', name: 'Barbell Good Morning', reps: '8 reps', target: 'Barra vacía', detail: 'Cadera atrás.' },
        ] },
      { type: 'strength', title: 'Hybrid Strength', duration: 13, format: "AMRAP 13' · Objetivo 3-4 rondas",
        exercises: [
          { id: 's3-mi-2-1', name: 'Barbell Front Squat', reps: '4 reps', target: '~67.5-70 kg', detail: '80-82% 1RM. Codos altos, RPE 8.5-9.' },
          { id: 's3-mi-2-2', name: 'KB Box Step Ups', reps: '8/8 reps', target: '2 × KB 12', detail: 'Sustituye DDB Box Step Ups. Sin impulso de la pierna de abajo.' },
          { id: 's3-mi-2-3', name: 'Run', reps: '90 seg', detail: 'Al 40%.' },
        ] },
      { type: 'metcon', title: 'Hybrid Metcon', duration: 14, format: "AMRAP 14'",
        exercises: [
          { id: 's3-mi-3-1', name: 'Wall Ball', reps: '15 reps', target: 'MB 10 kg', detail: 'Squat completo.' },
          { id: 's3-mi-3-2', name: 'Burpee Box Jump', reps: '8 reps', detail: 'Step down.' },
          { id: 's3-mi-3-3', name: 'MB Squat Ground to Overhead', reps: '10 reps', target: 'MB 10 kg', detail: 'Bloqueo arriba.' },
          { id: 's3-mi-3-4', name: 'Jumping Curtsy Lunges', reps: '16 reps', detail: 'Glúteo medio.' },
          { id: 's3-mi-3-5', name: 'Farmer Carry pesado', reps: '40 m', target: '2 × KB 20', detail: 'Pasos rápidos.' },
          { id: 's3-mi-3-6', name: 'Soga (Jump Rope)', reps: '80 saltos', detail: 'Ritmo alto.' },
        ] },
      { type: 'finisher', title: 'Midline', duration: 8, format: "EMOM 8 · rotar 4 ejercicios",
        exercises: [
          { id: 's3-mi-4-1', name: "Stir the Pot (TRX)", reps: "6/6 reps", detail: "Anti-extensión. Plancha con pies en el TRX, círculos con la cadera quieta." },
          { id: 's3-mi-4-2', name: "Sit Ups", reps: "15 reps", detail: "Flexión. Pies anclados si hace falta." },
          { id: 's3-mi-4-3', name: "Copenhagen Plank", reps: "20 seg/lado", detail: "Lateral + aductores. Pierna arriba sobre el banco." },
          { id: 's3-mi-4-4', name: "Leg Levers", reps: "12 reps", detail: "Abdomen bajo. Lumbar pegada." },
        ] },
    ],
  },
  {
    id: 'jue', day: 'J', name: 'Jueves', type: 'run',
    title: 'Run · 4×4 progresivo',
    subtitle: 'S3 Pico · 4×4 con recuperación decreciente',
    duration: 38, image: IMG.run,
    intro: '4×4 más exigente: cada intervalo un poco más rápido y menos recuperación. Objetivo: ≥300 kcal (Garmin).',
    blocks: [
      { type: 'warmup', title: 'Calentamiento', duration: 9, format: 'Trote + drills',
        exercises: [
          { id: 's3-j-w-1', name: 'Trote suave', reps: '6 min', detail: 'Z1-Z2.' },
          { id: 's3-j-w-2', name: 'Drills + Strides', reps: '3 min', detail: 'A-skip, B-skip, 3 × 15 seg aceleración.' },
        ] },
      { type: 'run', title: '4×4 progresivo', duration: 24, format: "4 × 4' Z4→Z5 / rec 3' · 2'30 · 2'",
        exercises: [
          { id: 's3-j-1-1', name: 'Intervalo progresivo', reps: '4 × 4 min', detail: 'Arrancá RPE 8, terminá RPE 9. Cada intervalo 2-3 seg/km más rápido.' },
          { id: 's3-j-1-2', name: 'Recuperación decreciente', reps: "3' · 2'30 · 2'", detail: 'Trote muy suave.' },
        ] },
      { type: 'run', title: 'Vuelta a la calma', duration: 5, format: 'Trote + GOWOD',
        exercises: [
          { id: 's3-j-2-1', name: 'Trote regenerativo', reps: '5 min', detail: 'Z1. Después GOWOD de piernas.' },
        ] },
    ],
  },
  {
    id: 'vie', day: 'V', name: 'Viernes', type: 'bigg',
    title: 'Push · Z-Press',
    subtitle: 'S3 Pico · Barbell Z-Press + escalera',
    duration: 50, image: IMG.shoulders,
    intro: 'Press sentado en el piso: hombro y core sin poder compensar con piernas. Control overhead unilateral. Objetivo: ≥300 kcal (Garmin).',
    blocks: [
      { type: 'warmup', title: 'Calentamiento', duration: 6, format: 'GOWOD + overhead',
        exercises: [
          { id: 's3-v-w-1', name: 'Lat Stretch + Thoracic Extension', reps: '30 seg/lado', detail: 'En el banco.' },
          { id: 's3-v-w-2', name: 'Band Dislocates', reps: '10 reps', detail: 'Agarre amplio.' },
          { id: 's3-v-w-3', name: 'Z-Press rampa', reps: '2 × 6', detail: 'Barra vacía → 27.5 kg (desde el rack bajo).' },
        ] },
      { type: 'quality', title: 'Push Control', duration: 7, format: "3 rondas · cap 7'",
        exercises: [
          { id: 's3-v-1-1', name: 'Tempo Push Ups', reps: '8 reps', detail: '3 seg bajada, 1 seg pausa.' },
          { id: 's3-v-1-2', name: 'KB Bottoms-Up Hold', reps: '20 seg/lado', target: 'KB 8', detail: 'Muñeca neutra, KB boca abajo.' },
          { id: 's3-v-1-3', name: 'Plank Shoulder Taps', reps: '20 reps', detail: 'Cadera quieta.' },
          { id: 's3-v-1-4', name: 'SKB Single-Arm Overhead Carry', reps: '15 m/lado', target: 'KB 12', detail: 'Costillas cerradas.' },
        ] },
      { type: 'strength', title: 'Hybrid Strength', duration: 13, format: "AMRAP 13' · Objetivo 3-4 rondas",
        exercises: [
          { id: 's3-v-2-1', name: 'Barbell Z-Press', reps: '5 reps', target: '~35 kg', detail: '~80% de tu Z-press estimado. Sentado, piernas extendidas, sin inclinarte atrás.' },
          { id: 's3-v-2-2', name: 'Half-Kneeling KB Press', reps: '8/8 reps', target: 'KB 12', detail: 'Glúteo de la rodilla apoyada apretado.' },
          { id: 's3-v-2-3', name: 'Soga (Jump Rope)', reps: '90 seg', detail: 'Sustituye máquina al 40%.' },
        ] },
      { type: 'metcon', title: 'Hybrid Metcon', duration: 14, format: "AMRAP 14' · escalera 2-4-6-8-10…",
        exercises: [
          { id: 's3-v-3-1', name: 'DKB Push Press', reps: 'escalera', target: '2 × KB 12', detail: 'Sustituye DDB Push Press.' },
          { id: 's3-v-3-2', name: 'Burpee Broad Jump', reps: 'escalera', detail: 'Salto largo.' },
          { id: 's3-v-3-3', name: 'SKB Single-Arm Snatch', reps: 'escalera (total)', target: 'KB 20', detail: 'Alterná brazos.' },
          { id: 's3-v-3-4', name: 'Plank Get Up', reps: 'escalera', detail: 'Alterná brazo.' },
          { id: 's3-v-3-5', name: 'KB Renegade Rows', reps: 'escalera', target: '2 × KB 12', detail: 'Pies abiertos.' },
          { id: 's3-v-3-6', name: 'Mountain Climbers', reps: 'escalera × 2', detail: 'Doble de reps que la escalera.' },
        ] },
      { type: 'finisher', title: 'Midline', duration: 8, format: "3 rondas for quality",
        exercises: [
          { id: 's3-v-4-1', name: "L-Sit Hold", reps: "20 seg", detail: "Isométrico. Sobre cajones/KB." },
          { id: 's3-v-4-2', name: "KB Around The World", reps: "8/8 reps", target: "KB 12", detail: "Rotación. Pasá la KB alrededor de la cintura sin mover la cadera." },
          { id: 's3-v-4-3', name: "Reverse Crunches", reps: "15 reps", detail: "Abdomen bajo. La cadera despega." },
          { id: 's3-v-4-4', name: "Lateral Hip Raises", reps: "10/10 reps", detail: "Lateral. Plancha lateral." },
        ] },
    ],
  },
  {
    id: 'sab', day: 'S', name: 'Sábado', type: 'bigg',
    title: 'HYBRID · Hyrox Home',
    subtitle: 'S3 Pico · Clean & Jerk + Hyrox 4 rondas',
    duration: 55, image: IMG.hybrid,
    intro: 'Pico del mes: clean & jerk, carga de rack y bloque Hyrox largo con carries. Objetivo: ≥300 kcal (Garmin): densidad alta, descansos mínimos.',
    blocks: [
      { type: 'warmup', title: 'Calentamiento', duration: 6, format: 'Trote + activación',
        exercises: [
          { id: 's3-sa-w-1', name: 'Trote suave', reps: '3 min', detail: 'Z1-Z2.' },
          { id: 's3-sa-w-2', name: 'Hip 90/90 Stretch', reps: '6/6 reps', detail: 'Transiciones lentas.' },
          { id: 's3-sa-w-3', name: 'Clean & Jerk rampa', reps: '3 × 2', detail: 'Barra vacía → 40 kg.' },
        ] },
      { type: 'quality', title: 'Bumper', duration: 6, format: "3 rondas · cap 6'",
        exercises: [
          { id: 's3-sa-1-1', name: 'Bumper Halo', reps: '8/8 reps', target: 'Bumper 5 kg', detail: 'Cuello largo.' },
          { id: 's3-sa-1-2', name: 'MB Overhead Throw contra pared', reps: '8 reps', target: 'MB 5 kg', detail: 'Explosivo.' },
          { id: 's3-sa-1-3', name: 'MB Lateral Slam', reps: '6/6 reps', target: 'MB 10 kg', detail: 'Rotación desde la cadera.' },
        ] },
      { type: 'strength', title: 'Hyrox Strength', duration: 12, format: "AMRAP 12'",
        exercises: [
          { id: 's3-sa-2-1', name: 'Barbell Clean & Jerk', reps: '4 reps', target: '~45-50 kg', detail: 'Power clean + push jerk. Toque y vuelta.' },
          { id: 's3-sa-2-2', name: 'DKB Front Rack March', reps: '30 m', target: '2 × KB 20', detail: 'Codos altos.' },
          { id: 's3-sa-2-3', name: 'Run', reps: '90 seg', detail: 'Al 40%.' },
        ] },
      { type: 'metcon', title: 'Hyrox Home', duration: 24, format: "4 rondas for time · cap 24'",
        exercises: [
          { id: 's3-sa-3-1', name: 'Run', reps: '400 m', detail: 'Ritmo de carrera Hyrox.' },
          { id: 's3-sa-3-2', name: 'MB Rotational Slam', reps: '8/8 reps', target: 'MB 10 kg', detail: 'Sustituye SkiErg.' },
          { id: 's3-sa-3-3', name: 'Lateral Bear Crawl', reps: '10 m ida y vuelta', detail: 'Sustituye Sled Push.' },
          { id: 's3-sa-3-4', name: 'Burpees To Bumper', reps: '10 reps', detail: 'Sustituye Burpee Broad Jump.' },
          { id: 's3-sa-3-5', name: 'American Swing', reps: '15 reps', target: 'KB 20', detail: 'Sustituye remo.' },
          { id: 's3-sa-3-6', name: 'KB Goblet Walking Lunges', reps: '20 reps', target: 'KB 20', detail: 'Sustituye Sandbag Lunges.' },
          { id: 's3-sa-3-7', name: 'SKB Suitcase Carry', reps: '30 m/lado', target: 'KB 20', detail: 'Sustituye DDB Suitcase Carry. Sin inclinarte.' },
        ] },
      { type: 'finisher', title: 'Midline', duration: 5, format: "AMRAP 5'",
        exercises: [
          { id: 's3-sa-4-1', name: "Zombie Sit Ups", reps: "10 reps", detail: "Flexión. Brazos al frente." },
          { id: 's3-sa-4-2', name: "TRX Pike", reps: "8 reps", detail: "Anti-extensión. Pies en el TRX, cadera al techo con piernas estiradas." },
          { id: 's3-sa-4-3', name: "Knee-In Twist", reps: "12 reps", detail: "Oblicuos. Rotación controlada." },
        ] },
    ],
  },
  {
    id: 'dom', day: 'D', name: 'Domingo', type: 'rest',
    title: 'Descanso activo',
    subtitle: 'Recuperación',
    duration: 45, image: IMG.rest,
    intro: 'Moverse sin carga: caminata, surf suave o golf + GOWOD.',
    blocks: [
      { type: 'warmup', title: 'Descanso activo', duration: 45, format: 'Libre, Z1',
        exercises: [
          { id: 's3-d-w-1', name: 'Caminata / surf suave / golf', reps: '30-45 min', detail: 'Z1, sin buscar intensidad.' },
          { id: 's3-d-w-2', name: 'GOWOD movilidad completa', reps: '15 min', detail: 'Foco cadera y cadena posterior.' },
        ] },
    ],
  },
];

// =====================================================================
// SEMANA 4 · RESET + BENCHMARK (~65% barra con tempo · metcons a tope)
// =====================================================================
const week4 = [
  {
    id: 'lun', day: 'L', name: 'Lunes', type: 'bigg',
    title: 'Push · Close-Grip Bench',
    subtitle: 'S4 Reset · Close-Grip tempo + rondas',
    duration: 48, image: IMG.push,
    intro: 'Barra más liviana con tempo para recuperar articulaciones; tríceps y metcon intensos. Objetivo: ≥300 kcal (Garmin): densidad alta, descansos mínimos.',
    blocks: [
      { type: 'warmup', title: 'Calentamiento', duration: 6, format: 'GOWOD + activación de hombro',
        exercises: [
          { id: 's4-l-w-1', name: 'GOWOD movilidad hombro', reps: '3 min', detail: 'Rutina de hombro/torácica del día.' },
          { id: 's4-l-w-2', name: 'Band Pull-Aparts', reps: '2 × 15', detail: 'Escápulas atrás.' },
          { id: 's4-l-w-3', name: 'Close-Grip Bench rampa', reps: '2 × 8', detail: 'Barra vacía → 40 kg.' },
        ] },
      { type: 'quality', title: 'Push Control', duration: 7, format: "3 rondas · cap 7'",
        exercises: [
          { id: 's4-l-1-1', name: 'Push Up Hold', reps: '30 seg', detail: 'Abajo, codos a 45°.' },
          { id: 's4-l-1-2', name: 'KB Kneeling Halo', reps: '6/6 reps', target: 'KB 12', detail: 'Costillas abajo.' },
          { id: 's4-l-1-3', name: 'Plank Shoulder Taps', reps: '20 reps', detail: 'Cadera quieta.' },
          { id: 's4-l-1-4', name: 'DKB Front Rack Hold', reps: '30 seg', target: '2 × KB 12', detail: 'Codos altos.' },
        ] },
      { type: 'strength', title: 'Hybrid Strength', duration: 12, format: "AMRAP 12' · Objetivo 3 rondas",
        exercises: [
          { id: 's4-l-2-1', name: 'Barbell Close-Grip Bench Press', reps: '8 reps', target: '~47.5-50 kg', detail: '~65% 1RM bench. Tempo 3-1-1, codos pegados.' },
          { id: 's4-l-2-2', name: 'SKB Floor Press', reps: '8/8 reps', target: 'KB 20', detail: 'Unilateral, anti-rotación.' },
          { id: 's4-l-2-3', name: 'Soga (Jump Rope)', reps: '90 seg', detail: 'Sustituye máquina al 40%.' },
        ] },
      { type: 'metcon', title: 'Hybrid Metcon', duration: 12, format: "3 rondas for time · cap 12'",
        exercises: [
          { id: 's4-l-3-1', name: 'DKB Thruster', reps: '10 reps', target: '2 × KB 12', detail: 'Squat completo.' },
          { id: 's4-l-3-2', name: 'Push Ups', reps: '12 reps', detail: 'Pecho al piso.' },
          { id: 's4-l-3-3', name: 'Burpees Over The Bar', reps: '8 reps', detail: 'Salto lateral.' },
          { id: 's4-l-3-4', name: 'TRX Triceps Extension', reps: '12 reps', detail: 'Codos fijos.' },
          { id: 's4-l-3-5', name: 'Box Jumps', reps: '10 reps', detail: 'Step down.' },
          { id: 's4-l-3-6', name: 'American Swing', reps: '15 reps', target: 'KB 20', detail: 'Extensión completa.' },
        ] },
      { type: 'finisher', title: 'Midline', duration: 7, format: "3 rondas for quality",
        exercises: [
          { id: 's4-l-4-1', name: "Ab Wheel Rollout", reps: "8 reps", detail: "Anti-extensión. Rueda abdominal." },
          { id: 's4-l-4-2', name: "Bent Knee Prayer Crunches", reps: "15 reps", detail: "Flexión. Manos juntas al frente." },
          { id: 's4-l-4-3', name: "Side Plank", reps: "25 seg/lado", detail: "Lateral. Cadera alta." },
        ] },
    ],
  },
  {
    id: 'mar', day: 'M', name: 'Martes', type: 'bigg',
    title: 'Run + Pull · RDL',
    subtitle: 'S4 Reset · Romanian Deadlift + every 90 seg',
    duration: 50, image: IMG.pull,
    intro: 'Isquios y espalda baja con RDL lento, tirón pausado y metcon de cadena posterior. Objetivo: ≥300 kcal (Garmin): densidad alta, descansos mínimos.',
    blocks: [
      { type: 'warmup', title: 'Calentamiento', duration: 6, format: 'GOWOD + bisagra',
        exercises: [
          { id: 's4-ma-w-1', name: 'Happy-Angry Cat', reps: '8 reps', detail: 'Columna segmento a segmento.' },
          { id: 's4-ma-w-2', name: 'Bird Dogs', reps: '6/6 reps', detail: 'Pausa 2 seg.' },
          { id: 's4-ma-w-3', name: 'RDL rampa', reps: '2 × 8', detail: '40 → 60 kg.' },
        ] },
      { type: 'quality', title: 'Bumper', duration: 7, format: "3 rondas · cap 7'",
        exercises: [
          { id: 's4-ma-1-1', name: 'MB Hip Rotation Toss', reps: '6/6 reps', target: 'MB 10 kg', detail: 'Contra pared.' },
          { id: 's4-ma-1-2', name: 'Bumper Russian Twists', reps: '16 reps', target: 'Bumper 5 kg', detail: 'Pies elevados.' },
          { id: 's4-ma-1-3', name: 'Bumper Tuck Ups', reps: '10 reps', target: 'Bumper 5 kg', detail: 'Bumper al frente.' },
          { id: 's4-ma-1-4', name: 'Bumper Halo', reps: '8/8 reps', target: 'Bumper 5 kg', detail: 'Cuello largo.' },
        ] },
      { type: 'strength', title: 'Hybrid Strength', duration: 13, format: "AMRAP 13' · Objetivo 3-4 rondas",
        exercises: [
          { id: 's4-ma-2-1', name: 'Barbell Romanian Deadlift', reps: '8 reps', target: '~70 kg', detail: 'Bajada 3 seg, barra pegada a las piernas, estiramiento de isquio.' },
          { id: 's4-ma-2-2', name: 'TRX Row', reps: '12 reps', detail: 'Pausa 2 seg arriba.' },
          { id: 's4-ma-2-3', name: 'Run', reps: '90 seg', detail: 'Al 40%.' },
        ] },
      { type: 'metcon', title: 'Hybrid Metcon', duration: 14, format: 'Every 90 seg × 9 · rotar A / B / C',
        exercises: [
          { id: 's4-ma-3-1', name: 'SKB Hang Clean', reps: 'A · 5/5 reps', target: 'KB 20', detail: 'Recepción suave.' },
          { id: 's4-ma-3-2', name: 'Burpee', reps: 'A · 5 reps', detail: 'Pecho al piso.' },
          { id: 's4-ma-3-3', name: 'DKB Bent Over Row', reps: 'B · 10 reps', target: '2 × KB 20', detail: 'Espalda plana.' },
          { id: 's4-ma-3-4', name: 'Jumping Lunges', reps: 'B · 12 reps', detail: 'Alternadas.' },
          { id: 's4-ma-3-5', name: 'Sprawl to Box Jump', reps: 'C · 5 reps', detail: 'Rápido.' },
          { id: 's4-ma-3-6', name: 'Mountain Climbers', reps: 'C · 30 reps', detail: 'Cadera baja.' },
        ] },
      { type: 'finisher', title: 'Midline', duration: 6, format: "EMOM 6 · rotar 3 ejercicios",
        exercises: [
          { id: 's4-ma-4-1', name: "TRX Knee Tucks", reps: "12 reps", detail: "Anti-extensión + flexión. Rodillas al pecho." },
          { id: 's4-ma-4-2', name: "Band Woodchop (alto a bajo)", reps: "10/10 reps", detail: "Rotación. La cadera inicia." },
          { id: 's4-ma-4-3', name: "Superman Swimmers", reps: "12 reps", detail: "Posterior. Brazos de adelante a la cadera." },
        ] },
    ],
  },
  {
    id: 'mie', day: 'X', name: 'Miércoles', type: 'bigg',
    title: 'Legs · Paused Squat',
    subtitle: 'S4 Reset · Back Squat con pausa + 21-15-9',
    duration: 50, image: IMG.legs,
    intro: 'Squat con pausa para técnica y posición, plano frontal con Cossack y metcon descendente. Objetivo: ≥300 kcal (Garmin): densidad alta, descansos mínimos.',
    blocks: [
      { type: 'warmup', title: 'Calentamiento', duration: 6, format: 'GOWOD + cadera/tobillo',
        exercises: [
          { id: 's4-mi-w-1', name: 'Quadruped Psoas Stretch', reps: '30 seg/lado', detail: 'Glúteo apretado.' },
          { id: 's4-mi-w-2', name: 'Ankle Mobility Circles', reps: '10/10 reps', detail: 'Rodilla sobre el pie.' },
          { id: 's4-mi-w-3', name: 'Back Squat rampa', reps: '2 × 5', detail: '20 → 50 kg.' },
        ] },
      { type: 'quality', title: 'Lower Prehab', duration: 7, format: "3 rondas · cap 7'",
        exercises: [
          { id: 's4-mi-1-1', name: 'Banded Side Steps', reps: '10/10 pasos', detail: 'Media sentadilla.' },
          { id: 's4-mi-1-2', name: 'Single-Leg Glute Bridge', reps: '10/10 reps', detail: 'Pausa arriba.' },
          { id: 's4-mi-1-3', name: 'Tibialis Raises', reps: '15 reps', detail: 'Contra la pared.' },
          { id: 's4-mi-1-4', name: 'Single-Leg Calf Raises', reps: '12/12 reps', detail: 'Pausa abajo y arriba.' },
        ] },
      { type: 'strength', title: 'Hybrid Strength', duration: 13, format: "AMRAP 13' · Objetivo 3-4 rondas",
        exercises: [
          { id: 's4-mi-2-1', name: 'Barbell Back Squat (pausa)', reps: '5 reps', target: '~67.5 kg', detail: '~65% 1RM. Pausa 2 seg abajo sin rebotar.' },
          { id: 's4-mi-2-2', name: 'DKB Cossack Squat', reps: '6/6 reps', target: 'KB 12 goblet', detail: 'Talón apoyado, pierna estirada con punta arriba.' },
          { id: 's4-mi-2-3', name: 'Run', reps: '90 seg', detail: 'Al 40%.' },
        ] },
      { type: 'metcon', title: 'Hybrid Metcon', duration: 14, format: "21-15-9 · cap 14'",
        exercises: [
          { id: 's4-mi-3-1', name: 'Wall Ball', reps: '21-15-9', target: 'MB 10 kg', detail: 'Squat completo.' },
          { id: 's4-mi-3-2', name: 'Goblet Thrusters', reps: '21-15-9', target: 'KB 20', detail: 'Codos adentro.' },
          { id: 's4-mi-3-3', name: 'Burpee Box Jump', reps: '10-8-6', detail: 'Step down.' },
          { id: 's4-mi-3-4', name: 'Skater Jumps', reps: '20-16-12', detail: 'Recepción estable.' },
          { id: 's4-mi-3-5', name: 'DKB Front Rack March', reps: '30 m por serie', target: '2 × KB 20', detail: 'Codos altos.' },
          { id: 's4-mi-3-6', name: 'Soga (Jump Rope)', reps: '60 saltos entre series', detail: 'Transición activa.' },
        ] },
      { type: 'finisher', title: 'Midline', duration: 7, format: "AMRAP 7'",
        exercises: [
          { id: 's4-mi-4-1', name: "V-Sit Ups", reps: "10 reps", detail: "Flexión. Controlado." },
          { id: 's4-mi-4-2', name: "Tall Plank Toe Touches", reps: "10/10 reps", detail: "Anti-rotación. Cadera quieta." },
          { id: 's4-mi-4-3', name: "Back Extensions", reps: "12 reps", detail: "Posterior. Pausa arriba." },
        ] },
    ],
  },
  {
    id: 'jue', day: 'J', name: 'Jueves', type: 'run',
    title: 'Run · 30/30',
    subtitle: 'S4 Reset · 3 series × 6 × 30/30',
    duration: 38, image: IMG.run,
    intro: 'Mismo estímulo de velocidad, repartido en 3 bloques más cortos para llegar fresco al benchmark. Objetivo: ≥300 kcal (Garmin).',
    blocks: [
      { type: 'warmup', title: 'Calentamiento', duration: 8, format: 'Trote + drills',
        exercises: [
          { id: 's4-j-w-1', name: 'Trote suave', reps: '6 min', detail: 'Z1-Z2.' },
          { id: 's4-j-w-2', name: 'Strides', reps: '3 × 15 seg', detail: 'Aceleraciones progresivas.' },
        ] },
      { type: 'run', title: '30/30', duration: 24, format: "3 × (6 × 30 seg rápido / 30 seg suave) · 3' entre series",
        exercises: [
          { id: 's4-j-1-1', name: '30 seg rápido', reps: '3 × 6 reps', detail: 'RPE 8-9.' },
          { id: 's4-j-1-2', name: '30 seg suave', reps: '3 × 6 reps', detail: 'Trote.' },
          { id: 's4-j-1-3', name: 'Pausa entre series', reps: '2 × 3 min', detail: 'Trote muy suave.' },
        ] },
      { type: 'run', title: 'Vuelta a la calma', duration: 6, format: 'Trote + GOWOD',
        exercises: [
          { id: 's4-j-2-1', name: 'Trote regenerativo', reps: '6 min', detail: 'Z1. Después GOWOD de piernas.' },
        ] },
    ],
  },
  {
    id: 'vie', day: 'V', name: 'Viernes', type: 'bigg',
    title: 'Push · Strict Press + Rotación',
    subtitle: 'S4 Reset · Strict Press tempo + escalera',
    duration: 50, image: IMG.shoulders,
    intro: 'Press estricto liviano con tempo, rotational press para golf/rugby y escalera híbrida. Objetivo: ≥300 kcal (Garmin).',
    blocks: [
      { type: 'warmup', title: 'Calentamiento', duration: 6, format: 'GOWOD + overhead',
        exercises: [
          { id: 's4-v-w-1', name: 'Lat Stretch + Thoracic Extension', reps: '30 seg/lado', detail: 'En el banco.' },
          { id: 's4-v-w-2', name: 'Band Dislocates', reps: '10 reps', detail: 'Agarre amplio.' },
          { id: 's4-v-w-3', name: 'Strict Press rampa', reps: '2 × 8', detail: 'Barra vacía → 30 kg.' },
        ] },
      { type: 'quality', title: 'Pull Prehab', duration: 7, format: "3 rondas · cap 7'",
        exercises: [
          { id: 's4-v-1-1', name: 'TRX Face Pull', reps: '12 reps', detail: 'Manos a las orejas.' },
          { id: 's4-v-1-2', name: 'Band External Rotation', reps: '12/12 reps', detail: 'Codo pegado.' },
          { id: 's4-v-1-3', name: 'Prone Y-T-W', reps: '6 c/u', target: 'DB 3 kg', detail: 'Banco inclinado.' },
          { id: 's4-v-1-4', name: 'Prone Paddle Simulation (Band)', reps: '30 seg', detail: 'Remada de surf.' },
        ] },
      { type: 'strength', title: 'Hybrid Strength', duration: 13, format: "AMRAP 13' · Objetivo 3-4 rondas",
        exercises: [
          { id: 's4-v-2-1', name: 'Barbell Shoulder Press (tempo)', reps: '6 reps', target: '~34 kg', detail: '~65% 1RM. Bajada en 3 seg.' },
          { id: 's4-v-2-2', name: 'Barbell Rotational Press', reps: '8/8 reps', target: 'Barra + 5 kg', detail: 'Punta de la barra en una esquina, rotá cadera y empujá.' },
          { id: 's4-v-2-3', name: 'Soga (Jump Rope)', reps: '90 seg', detail: 'Sustituye máquina al 40%.' },
        ] },
      { type: 'metcon', title: 'Hybrid Metcon', duration: 14, format: "AMRAP 14' · escalera 2-4-6-8-10…",
        exercises: [
          { id: 's4-v-3-1', name: 'DKB Hang Clean & Jerk', reps: 'escalera', target: '2 × KB 12', detail: 'Dip & drive.' },
          { id: 's4-v-3-2', name: 'Burpee Broad Jump', reps: 'escalera', detail: 'Salto largo.' },
          { id: 's4-v-3-3', name: 'SKB Single-Arm Snatch', reps: 'escalera (total)', target: 'KB 20', detail: 'Alterná brazos.' },
          { id: 's4-v-3-4', name: 'Plank Get Up', reps: 'escalera', detail: 'Alterná brazo.' },
          { id: 's4-v-3-5', name: 'MB Squat Ground to Overhead', reps: 'escalera', target: 'MB 10 kg', detail: 'Bloqueo arriba.' },
          { id: 's4-v-3-6', name: 'KB Renegade Rows', reps: 'escalera', target: '2 × KB 12', detail: 'Pies abiertos.' },
        ] },
      { type: 'finisher', title: 'Midline', duration: 6, format: "2 rondas · 45 seg on / 15 seg off",
        exercises: [
          { id: 's4-v-4-1', name: "Hollow Hold", reps: "45 seg", detail: "Anti-extensión. Lumbar pegada." },
          { id: 's4-v-4-2', name: "Leg Circles", reps: "45 seg", detail: "Abdomen bajo. Cambiá de sentido a mitad." },
          { id: 's4-v-4-3', name: "KB Plank Pull-Through", reps: "45 seg", target: "KB 12", detail: "Anti-rotación. Cadera quieta." },
        ] },
    ],
  },
  {
    id: 'sab', day: 'S', name: 'Sábado', type: 'bigg',
    title: 'HYBRID · Hyrox Benchmark',
    subtitle: 'S4 · Benchmark Hyrox Home (registrá el tiempo)',
    duration: 55, image: IMG.hybrid,
    intro: 'Cierre del mesociclo: benchmark fijo para comparar mes a mes. Mismo protocolo cada 4 semanas. Objetivo: ≥300 kcal (Garmin): densidad alta, descansos mínimos.',
    blocks: [
      { type: 'warmup', title: 'Calentamiento', duration: 6, format: 'Trote + activación',
        exercises: [
          { id: 's4-sa-w-1', name: 'Trote suave', reps: '3 min', detail: 'Z1-Z2.' },
          { id: 's4-sa-w-2', name: "World's Greatest Stretch", reps: '4/4 reps', detail: 'Rotación torácica.' },
          { id: 's4-sa-w-3', name: 'Hang Power Clean rampa', reps: '3 × 3', detail: 'Barra vacía → 40 kg.' },
        ] },
      { type: 'quality', title: 'Back Power', duration: 6, format: "3 rondas · cap 6'",
        exercises: [
          { id: 's4-sa-1-1', name: 'Explosive KB Single-Arm Clean', reps: '4/4 reps', target: 'KB 20', detail: 'Máxima velocidad.' },
          { id: 's4-sa-1-2', name: 'Russian Swing', reps: '12 reps', target: 'KB 20', detail: 'Explosivo.' },
          { id: 's4-sa-1-3', name: 'Barbell Good Morning', reps: '8 reps', target: 'Barra vacía', detail: 'Cadera atrás.' },
        ] },
      { type: 'strength', title: 'Hyrox Strength', duration: 10, format: "AMRAP 10'",
        exercises: [
          { id: 's4-sa-2-1', name: 'Barbell Hang Power Clean', reps: '5 reps', target: '~45 kg', detail: 'Rápido y limpio, sin fatigar para el benchmark.' },
          { id: 's4-sa-2-2', name: 'SKB Single-Arm Overhead Carry', reps: '15 m/lado', target: 'KB 20', detail: 'Costillas cerradas.' },
          { id: 's4-sa-2-3', name: 'Run', reps: '90 seg', detail: 'Al 40%.' },
        ] },
      { type: 'metcon', title: 'Hyrox Home Benchmark', duration: 28, format: "For time · 7 × (Run 400 m + estación) · cap 28'",
        exercises: [
          { id: 's4-sa-3-1', name: 'Run', reps: '7 × 400 m', detail: 'Antes de cada estación. Anotá tiempo total.' },
          { id: 's4-sa-3-2', name: 'MB Rotational Slam', reps: '30 reps', target: 'MB 10 kg', detail: 'Estación 1 · sustituye SkiErg.' },
          { id: 's4-sa-3-3', name: 'Lateral Bear Crawl', reps: '2 × 10 m', detail: 'Estación 2 · sustituye Sled Push.' },
          { id: 's4-sa-3-4', name: 'TRX High Row', reps: '20 reps', detail: 'Estación 3 · sustituye Sled Pull.' },
          { id: 's4-sa-3-5', name: 'Burpees To Bumper', reps: '15 reps', detail: 'Estación 4 · sustituye Burpee Broad Jump.' },
          { id: 's4-sa-3-6', name: 'Farmer Carry pesado', reps: '100 m', target: '2 × KB 20', detail: 'Estación 5.' },
          { id: 's4-sa-3-7', name: 'KB Goblet Walking Lunges', reps: '30 reps', target: 'KB 20', detail: 'Estación 6 · sustituye Sandbag Lunges.' },
          { id: 's4-sa-3-8', name: 'Air Ball', reps: '30 reps', target: 'MB 5 kg', detail: 'Estación 7 · sustituye Wall Balls.' },
        ] },
      { type: 'finisher', title: 'Midline', duration: 5, format: "Escalera 10→1 · cap 5'",
        exercises: [
          { id: 's4-sa-4-1', name: "Sit Ups", reps: "10→1", detail: "Flexión. Bajá 1 rep por ronda." },
          { id: 's4-sa-4-2', name: "Side Plank Reach-Through", reps: "10→1 por lado", detail: "Lateral + rotación." },
          { id: 's4-sa-4-3', name: "Lemon Squeeze", reps: "10→1", detail: "Flexión explosiva." },
        ] },
    ],
  },
  {
    id: 'dom', day: 'D', name: 'Domingo', type: 'rest',
    title: 'Descanso activo',
    subtitle: 'Recuperación',
    duration: 45, image: IMG.rest,
    intro: 'Moverse sin carga: caminata, surf suave o golf + GOWOD.',
    blocks: [
      { type: 'warmup', title: 'Descanso activo', duration: 45, format: 'Libre, Z1',
        exercises: [
          { id: 's4-d-w-1', name: 'Caminata / surf suave / golf', reps: '30-45 min', detail: 'Z1, sin buscar intensidad.' },
          { id: 's4-d-w-2', name: 'GOWOD movilidad completa', reps: '15 min', detail: 'Foco cadera y cadena posterior.' },
        ] },
    ],
  },
];

// =====================================================================
// ROTACIÓN AUTOMÁTICA
// =====================================================================
export const weeks = [week1, week2, week3, week4];
export const weekLabels = ['S1 · Base', 'S2 · Carga', 'S3 · Pico', 'S4 · Reset + Benchmark'];

export function getWeekIndex(date = new Date()) {
  const start = new Date(`${MESO_START}T00:00:00`);
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.floor((today - start) / 86400000);
  if (diffDays < 0) return 0;
  return Math.floor(diffDays / 7) % weeks.length;
}

// La app sigue consumiendo `week` igual que antes.
export const week = weeks[getWeekIndex()];
