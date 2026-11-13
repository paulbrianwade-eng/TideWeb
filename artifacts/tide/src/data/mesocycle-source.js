// =====================================================================
// TIDE · routine.js — Mesociclo rotativo de 4 semanas
// ---------------------------------------------------------------------
// La app sigue leyendo `week` (array de 7 días, mismo formato de siempre).
// La diferencia: `week` ahora se elige solo según la fecha, rotando entre
// 4 semanas distintas (S1 Base → S2 Carga → S3 Pico → S4 Reset + Benchmark).
// Cada lunes cambia la semana. Al terminar S4 vuelve a S1.
//
// Estructura días de fuerza: Calentamiento fijo (7) → Fuerza (principal + explosivo + accesorio)
//   → Híbrido largo 24' (32' sábado) con 2 ejercicios de core integrados. Jueves run, domingo descanso.
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
// SEMANA 1 · BASE
// =====================================================================
const week1 = [
  {
    id: 'lun', day: 'L', name: 'Lunes', type: 'bigg',
    title: 'Push · Bench',
    subtitle: 'S1 Base · Bench Press + metcon de empuje',
    duration: 47, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
    intro: 'Bench Press + explosivo + accesorio, y un híbrido largo de 24\' con core integrado. Objetivo: ≥300 kcal (Garmin): densidad alta, descansos mínimos.',
    blocks: [
      { type: 'warmup', title: 'Calentamiento', duration: 8, format: 'Movilidad fija · 7 ejercicios',
        exercises: [
          { id: 's1-l-w-1', name: 'Gato contento / enojado', reps: '5 reps', detail: 'Columna segmento a segmento, exhalá al redondear.' },
          { id: 's1-l-w-2', name: 'Cuadrupedia: alcanzo y tiro', reps: '10 reps (5/5)', detail: 'En cuatro apoyos: estirá un brazo adelante y tirá el codo hacia atrás rotando el pecho.' },
          { id: 's1-l-w-3', name: 'Estocada con giro y me estiro', reps: '10 reps (5/5)', detail: 'Estocada larga, girá el torso hacia la pierna de adelante y estirá el brazo al techo.' },
          { id: 's1-l-w-4', name: '90/90', reps: '10 reps', detail: 'Sentado, rotá las dos rodillas de lado a lado sin usar las manos si podés.' },
          { id: 's1-l-w-5', name: 'Sentadilla y estiro brazos', reps: '10 reps', detail: 'Sentadilla profunda, abajo estirá los brazos arriba y empujá las rodillas afuera.' },
          { id: 's1-l-w-6', name: 'Extensión de isquios', reps: '10 reps', detail: 'Desde cuclillas tomando las puntas de los pies, estirá las rodillas sin soltar.' },
          { id: 's1-l-w-7', name: 'Movimiento de espalda', reps: '10 reps', detail: 'Rotaciones y extensiones torácicas controladas, sin dolor.' },
        ] },
      { type: 'strength', title: 'Fuerza', duration: 15, format: '5 rondas · cada 3\' · principal → explosivo → accesorio',
        exercises: [
          { id: 's1-l-2-1', name: 'Barbell Bench Press', reps: '6 reps', target: '~55 kg', detail: '72% 1RM. RPE 8, 1-2 reps en reserva. Pausa breve en el pecho. Antes: 2 series de aproximación.' },
          { id: 's1-l-2-2', name: 'Plyo Push Ups', reps: '6 reps', detail: 'Explosivo. Despegá las manos del piso; recepción suave.' },
          { id: 's1-l-2-3', name: 'DKB Floor Press', reps: '10 reps', target: '2 × KB 12', detail: 'Sustituye DDB Chest Press. Codo toca el piso, sube explosivo.' },
        ] },
      { type: 'metcon', title: 'Hybrid Long', duration: 24, format: 'AMRAP 24\'',
        exercises: [
          { id: 's1-l-3-1', name: 'Burpees Over The Bar', reps: '8 reps', detail: 'Salto lateral con dos pies.' },
          { id: 's1-l-3-2', name: 'DKB Thruster', reps: '10 reps', target: '2 × KB 12', detail: 'Squat completo, bloqueo arriba.' },
          { id: 's1-l-3-3', name: 'Push Ups', reps: '12 reps', detail: 'Pecho al piso, cuerpo en bloque.' },
          { id: 's1-l-3-4', name: 'American Swing', reps: '15 reps', target: 'KB 20', detail: 'Cadera manda, KB sobre la cabeza.' },
          { id: 's1-l-3-5', name: 'Box Jumps', reps: '10 reps', detail: 'Step down para cuidar tendones.' },
          { id: 's1-l-3-6', name: 'TRX Triceps Extension', reps: '12 reps', detail: 'Codos fijos, cuerpo inclinado según nivel.' },
          { id: 's1-l-3-7', name: 'Mountain Climbers', reps: '30 reps', detail: 'Rápidos, cadera baja.' },
          { id: 's1-l-3-8', name: 'Soga (Jump Rope)', reps: '60 saltos', detail: 'Ritmo alto.' },
          { id: 's1-l-3-9', name: 'Hollow Hold', reps: '30 seg', detail: 'Core. Lumbar pegada al piso.' },
          { id: 's1-l-3-10', name: 'V-Sit Ups', reps: '12 reps', detail: 'Core. Manos tocan pies arriba.' },
        ] },
    ],
  },
  {
    id: 'mar', day: 'M', name: 'Martes', type: 'bigg',
    title: 'Run + Pull · Deadlift',
    subtitle: 'S1 Base · Deadlift + metcon cada 90 seg',
    duration: 47, image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
    intro: 'Deadlift + explosivo + accesorio, y un híbrido largo de 24\' con core integrado. Objetivo: ≥300 kcal (Garmin): densidad alta, descansos mínimos.',
    blocks: [
      { type: 'warmup', title: 'Calentamiento', duration: 8, format: 'Movilidad fija · 7 ejercicios',
        exercises: [
          { id: 's1-ma-w-1', name: 'Gato contento / enojado', reps: '5 reps', detail: 'Columna segmento a segmento, exhalá al redondear.' },
          { id: 's1-ma-w-2', name: 'Cuadrupedia: alcanzo y tiro', reps: '10 reps (5/5)', detail: 'En cuatro apoyos: estirá un brazo adelante y tirá el codo hacia atrás rotando el pecho.' },
          { id: 's1-ma-w-3', name: 'Estocada con giro y me estiro', reps: '10 reps (5/5)', detail: 'Estocada larga, girá el torso hacia la pierna de adelante y estirá el brazo al techo.' },
          { id: 's1-ma-w-4', name: '90/90', reps: '10 reps', detail: 'Sentado, rotá las dos rodillas de lado a lado sin usar las manos si podés.' },
          { id: 's1-ma-w-5', name: 'Sentadilla y estiro brazos', reps: '10 reps', detail: 'Sentadilla profunda, abajo estirá los brazos arriba y empujá las rodillas afuera.' },
          { id: 's1-ma-w-6', name: 'Extensión de isquios', reps: '10 reps', detail: 'Desde cuclillas tomando las puntas de los pies, estirá las rodillas sin soltar.' },
          { id: 's1-ma-w-7', name: 'Movimiento de espalda', reps: '10 reps', detail: 'Rotaciones y extensiones torácicas controladas, sin dolor.' },
        ] },
      { type: 'strength', title: 'Fuerza', duration: 15, format: '5 rondas · cada 3\' · principal → explosivo → accesorio',
        exercises: [
          { id: 's1-ma-2-1', name: 'Barbell Deadlift', reps: '6 reps', target: '90 kg (tope)', detail: 'Techo de discos (~64%). Bajada en 3 seg para subir el estímulo. Antes: 2 series de aproximación.' },
          { id: 's1-ma-2-2', name: 'Russian Swing pesado', reps: '10 reps', target: 'KB 20', detail: 'Explosivo. Cadera explosiva, KB a la altura del pecho.' },
          { id: 's1-ma-2-3', name: 'TRX Row', reps: '12 reps', detail: 'Pausa 1 seg con pecho a las manijas.' },
        ] },
      { type: 'metcon', title: 'Hybrid Long', duration: 24, format: 'Every 2\' × 12 · rotar A / B / C / D (D = core)',
        exercises: [
          { id: 's1-ma-3-1', name: 'SKB Hang Clean', reps: 'A · 6/6 reps', target: 'KB 20', detail: 'Codo pegado, recepción suave.' },
          { id: 's1-ma-3-2', name: 'Burpee', reps: 'A · 6 reps', detail: 'Pecho al piso.' },
          { id: 's1-ma-3-3', name: 'Sprawl to Box Jump', reps: 'B · 6 reps', detail: 'Sprawl rápido, salto al cajón.' },
          { id: 's1-ma-3-4', name: 'Lateral Bounds', reps: 'B · 10 reps', detail: 'Clavá la recepción 1 seg.' },
          { id: 's1-ma-3-5', name: 'DKB Bent Over Row', reps: 'C · 12 reps', target: '2 × KB 20', detail: 'Espalda plana, codos hacia la cadera.' },
          { id: 's1-ma-3-6', name: 'Jumping Lunges', reps: 'C · 12 reps', detail: 'Rodilla trasera cerca del piso.' },
          { id: 's1-ma-3-7', name: 'Run', reps: 'A · 200 m', detail: 'Ritmo fuerte y sostenible.' },
          { id: 's1-ma-3-8', name: 'Toe Touches', reps: 'D · 12 reps', detail: 'Core. Piernas verticales.' },
          { id: 's1-ma-3-9', name: 'Copenhagen Plank', reps: 'D · 15 seg/lado', detail: 'Core. Rodilla en el banco si hace falta.' },
        ] },
    ],
  },
  {
    id: 'mie', day: 'X', name: 'Miércoles', type: 'bigg',
    title: 'Legs · Back Squat',
    subtitle: 'S1 Base · Back Squat + metcon de piernas',
    duration: 47, image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&q=80',
    intro: 'Back Squat + explosivo + accesorio, y un híbrido largo de 24\' con core integrado. Objetivo: ≥300 kcal (Garmin): densidad alta, descansos mínimos.',
    blocks: [
      { type: 'warmup', title: 'Calentamiento', duration: 8, format: 'Movilidad fija · 7 ejercicios',
        exercises: [
          { id: 's1-mi-w-1', name: 'Gato contento / enojado', reps: '5 reps', detail: 'Columna segmento a segmento, exhalá al redondear.' },
          { id: 's1-mi-w-2', name: 'Cuadrupedia: alcanzo y tiro', reps: '10 reps (5/5)', detail: 'En cuatro apoyos: estirá un brazo adelante y tirá el codo hacia atrás rotando el pecho.' },
          { id: 's1-mi-w-3', name: 'Estocada con giro y me estiro', reps: '10 reps (5/5)', detail: 'Estocada larga, girá el torso hacia la pierna de adelante y estirá el brazo al techo.' },
          { id: 's1-mi-w-4', name: '90/90', reps: '10 reps', detail: 'Sentado, rotá las dos rodillas de lado a lado sin usar las manos si podés.' },
          { id: 's1-mi-w-5', name: 'Sentadilla y estiro brazos', reps: '10 reps', detail: 'Sentadilla profunda, abajo estirá los brazos arriba y empujá las rodillas afuera.' },
          { id: 's1-mi-w-6', name: 'Extensión de isquios', reps: '10 reps', detail: 'Desde cuclillas tomando las puntas de los pies, estirá las rodillas sin soltar.' },
          { id: 's1-mi-w-7', name: 'Movimiento de espalda', reps: '10 reps', detail: 'Rotaciones y extensiones torácicas controladas, sin dolor.' },
        ] },
      { type: 'strength', title: 'Fuerza', duration: 15, format: '5 rondas · cada 3\' · principal → explosivo → accesorio',
        exercises: [
          { id: 's1-mi-2-1', name: 'Barbell Back Squat', reps: '6 reps', target: '~75 kg', detail: '72% 1RM. Profundidad bajo paralelo, RPE 8. Antes: 2 series de aproximación.' },
          { id: 's1-mi-2-2', name: 'Broad Jump', reps: '4 reps', detail: 'Explosivo. Salto largo máximo, clavá la recepción 1 seg.' },
          { id: 's1-mi-2-3', name: 'DKB Front Rack Reverse Lunges', reps: '6/6 reps', target: '2 × KB 12', detail: 'Torso vertical.' },
        ] },
      { type: 'metcon', title: 'Hybrid Long', duration: 24, format: '5 rondas for time · cap 24\'',
        exercises: [
          { id: 's1-mi-3-1', name: 'Wall Ball', reps: '15 reps', target: 'MB 10 kg', detail: 'Squat completo, blanco ~3 m.' },
          { id: 's1-mi-3-2', name: 'Burpee Box Jump', reps: '8 reps', detail: 'Step down.' },
          { id: 's1-mi-3-3', name: 'Goblet Thrusters', reps: '12 reps', target: 'KB 20', detail: 'Codos adentro.' },
          { id: 's1-mi-3-4', name: 'Skater Jumps', reps: '20 reps', detail: 'Recepción unipodal estable.' },
          { id: 's1-mi-3-5', name: 'DKB Front Rack March', reps: '40 pasos', target: '2 × KB 20', detail: 'Rodilla a la cadera, codos altos.' },
          { id: 's1-mi-3-6', name: 'Soga (Jump Rope)', reps: '100 saltos', detail: 'Ritmo alto.' },
          { id: 's1-mi-3-7', name: 'Run', reps: '200 m', detail: 'Ritmo fuerte y sostenible.' },
          { id: 's1-mi-3-8', name: 'Reverse Crunches', reps: '12 reps', detail: 'Core. La cadera despega del piso.' },
          { id: 's1-mi-3-9', name: 'Zombie Sit Ups', reps: '12 reps', detail: 'Core. Brazos al frente, sin impulso.' },
        ] },
    ],
  },
  {
    id: 'jue', day: 'J', name: 'Jueves', type: 'run',
    title: 'Run · 4×4',
    subtitle: 'S1 Base · Intervalos 4×4 en Z4',
    duration: 38, image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80',
    intro: 'Intervalos noruegos 4×4: el estímulo aeróbico más rendidor para VO2max. Objetivo: ≥300 kcal (Garmin).',
    blocks: [
      { type: 'warmup', title: 'Calentamiento', duration: 8, format: 'Trote + drills',
        exercises: [
          { id: 's1-j-w-1', name: 'Trote suave', reps: '6 min', detail: 'Z1-Z2.' },
          { id: 's1-j-w-2', name: 'Drills A-Skip + Pogo Jumps', reps: '2 min', detail: '2 × 20 m cada uno.' },
        ] },
      { type: 'run', title: 'Intervalos 4×4', duration: 25, format: '4 × 4\' Z4 / 3\' trote',
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
    duration: 47, image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
    intro: 'Shoulder Press + explosivo + accesorio, y un híbrido largo de 24\' con core integrado. Objetivo: ≥300 kcal (Garmin): densidad alta, descansos mínimos.',
    blocks: [
      { type: 'warmup', title: 'Calentamiento', duration: 8, format: 'Movilidad fija · 7 ejercicios',
        exercises: [
          { id: 's1-v-w-1', name: 'Gato contento / enojado', reps: '5 reps', detail: 'Columna segmento a segmento, exhalá al redondear.' },
          { id: 's1-v-w-2', name: 'Cuadrupedia: alcanzo y tiro', reps: '10 reps (5/5)', detail: 'En cuatro apoyos: estirá un brazo adelante y tirá el codo hacia atrás rotando el pecho.' },
          { id: 's1-v-w-3', name: 'Estocada con giro y me estiro', reps: '10 reps (5/5)', detail: 'Estocada larga, girá el torso hacia la pierna de adelante y estirá el brazo al techo.' },
          { id: 's1-v-w-4', name: '90/90', reps: '10 reps', detail: 'Sentado, rotá las dos rodillas de lado a lado sin usar las manos si podés.' },
          { id: 's1-v-w-5', name: 'Sentadilla y estiro brazos', reps: '10 reps', detail: 'Sentadilla profunda, abajo estirá los brazos arriba y empujá las rodillas afuera.' },
          { id: 's1-v-w-6', name: 'Extensión de isquios', reps: '10 reps', detail: 'Desde cuclillas tomando las puntas de los pies, estirá las rodillas sin soltar.' },
          { id: 's1-v-w-7', name: 'Movimiento de espalda', reps: '10 reps', detail: 'Rotaciones y extensiones torácicas controladas, sin dolor.' },
        ] },
      { type: 'strength', title: 'Fuerza', duration: 15, format: '5 rondas · cada 3\' · principal → explosivo → accesorio',
        exercises: [
          { id: 's1-v-2-1', name: 'Barbell Shoulder Press', reps: '6 reps', target: '~37.5 kg', detail: '72% 1RM. Glúteos apretados, sin arquear. Antes: 2 series de aproximación.' },
          { id: 's1-v-2-2', name: 'MB Overhead Throw contra pared', reps: '6 reps', target: 'MB 5 kg', detail: 'Explosivo. Lanzamiento explosivo tipo line-out.' },
          { id: 's1-v-2-3', name: 'DKB Z-Press', reps: '8 reps', target: '2 × KB 12', detail: 'Sentado en el piso, piernas extendidas.' },
        ] },
      { type: 'metcon', title: 'Hybrid Long', duration: 24, format: 'AMRAP 24\' · escalera 2-4-6-8-10…',
        exercises: [
          { id: 's1-v-3-1', name: 'DKB Hang Clean & Jerk', reps: 'escalera', target: '2 × KB 12', detail: 'Dip & drive con piernas.' },
          { id: 's1-v-3-2', name: 'Burpee Broad Jump', reps: 'escalera', detail: 'Salto largo máximo.' },
          { id: 's1-v-3-3', name: 'MB Squat Ground to Overhead', reps: 'escalera', target: 'MB 10 kg', detail: 'Del piso a bloqueo arriba.' },
          { id: 's1-v-3-4', name: 'Plank Get Up', reps: 'escalera', detail: 'Alterná brazo que sube primero.' },
          { id: 's1-v-3-5', name: 'KB Renegade Rows', reps: 'escalera', target: '2 × KB 12', detail: 'Sustituye DDB Renegade Rows. Pies abiertos.' },
          { id: 's1-v-3-6', name: 'SKB Single-Arm Snatch', reps: 'escalera (total)', target: 'KB 20', detail: 'Sustituye DDB Single-Arm Snatch. Alterná brazos.' },
          { id: 's1-v-3-7', name: 'Soga (Jump Rope)', reps: '60 saltos', detail: 'Ritmo alto.' },
          { id: 's1-v-3-8', name: 'L-Sit Hold', reps: '20 seg', detail: 'Core. Sobre cajones/KB o piernas flexionadas; repartí en series.' },
          { id: 's1-v-3-9', name: 'Scissor Kicks', reps: '30 reps', detail: 'Core. Piernas bajas.' },
        ] },
    ],
  },
  {
    id: 'sab', day: 'S', name: 'Sábado', type: 'bigg',
    title: 'HYBRID · Hyrox Home',
    subtitle: 'S1 Base · Front Rack Lunges + Hyrox 4 rondas',
    duration: 55, image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&q=80',
    intro: 'Front Rack Lunges + explosivo + accesorio, y un híbrido largo de 32\' con core integrado. Objetivo: ≥300 kcal (Garmin): densidad alta, descansos mínimos.',
    blocks: [
      { type: 'warmup', title: 'Calentamiento', duration: 8, format: 'Movilidad fija · 7 ejercicios',
        exercises: [
          { id: 's1-sa-w-1', name: 'Gato contento / enojado', reps: '5 reps', detail: 'Columna segmento a segmento, exhalá al redondear.' },
          { id: 's1-sa-w-2', name: 'Cuadrupedia: alcanzo y tiro', reps: '10 reps (5/5)', detail: 'En cuatro apoyos: estirá un brazo adelante y tirá el codo hacia atrás rotando el pecho.' },
          { id: 's1-sa-w-3', name: 'Estocada con giro y me estiro', reps: '10 reps (5/5)', detail: 'Estocada larga, girá el torso hacia la pierna de adelante y estirá el brazo al techo.' },
          { id: 's1-sa-w-4', name: '90/90', reps: '10 reps', detail: 'Sentado, rotá las dos rodillas de lado a lado sin usar las manos si podés.' },
          { id: 's1-sa-w-5', name: 'Sentadilla y estiro brazos', reps: '10 reps', detail: 'Sentadilla profunda, abajo estirá los brazos arriba y empujá las rodillas afuera.' },
          { id: 's1-sa-w-6', name: 'Extensión de isquios', reps: '10 reps', detail: 'Desde cuclillas tomando las puntas de los pies, estirá las rodillas sin soltar.' },
          { id: 's1-sa-w-7', name: 'Movimiento de espalda', reps: '10 reps', detail: 'Rotaciones y extensiones torácicas controladas, sin dolor.' },
        ] },
      { type: 'strength', title: 'Fuerza', duration: 15, format: '5 rondas · cada 3\' · principal → explosivo → accesorio',
        exercises: [
          { id: 's1-sa-2-1', name: 'Barbell Front Rack Lunges', reps: '6/6 reps', target: '~45 kg', detail: 'Codos altos, rodilla roza el piso. Antes: 2 series de aproximación.' },
          { id: 's1-sa-2-2', name: 'Rotational Jump 90°', reps: '4/4 reps', detail: 'Explosivo. Aterrizá suave, rodillas alineadas.' },
          { id: 's1-sa-2-3', name: 'SKB Single-Arm Overhead Carry', reps: '20 m/lado', target: 'KB 20', detail: 'Costillas cerradas.' },
        ] },
      { type: 'metcon', title: 'Hyrox Home', duration: 32, format: '5 rondas for time · cap 30\' · core al final de cada ronda',
        exercises: [
          { id: 's1-sa-3-1', name: 'Run', reps: '400 m', detail: 'Ritmo de carrera Hyrox, no sprint.' },
          { id: 's1-sa-3-2', name: 'MB Lateral Slam', reps: '16 reps', target: 'MB 10 kg', detail: 'Sustituye SkiErg.' },
          { id: 's1-sa-3-3', name: 'TRX High Row', reps: '15 reps', detail: 'Sustituye Sled Pull. Codos altos.' },
          { id: 's1-sa-3-4', name: 'Burpees To Bumper', reps: '10 reps', detail: 'Tocá el bumper con el salto.' },
          { id: 's1-sa-3-5', name: 'Farmer Carry pesado', reps: '50 m', target: '2 × KB 20', detail: 'Pasos cortos y rápidos.' },
          { id: 's1-sa-3-6', name: 'KB Goblet Walking Lunges', reps: '20 reps', target: 'KB 20', detail: 'Sustituye Sandbag Lunges.' },
          { id: 's1-sa-3-7', name: 'MB Devil Press', reps: '10 reps', target: 'MB 10 kg', detail: 'Burpee + MB del piso a overhead.' },
          { id: 's1-sa-3-8', name: 'Tatun Sit Ups', reps: '12 reps', detail: 'Core. Sumá 1 rep por ronda.' },
          { id: 's1-sa-3-9', name: 'Tall Plank Toe Touches', reps: '10/10 reps', detail: 'Core. Cadera quieta.' },
        ] },
    ],
  },
  {
    id: 'dom', day: 'D', name: 'Domingo', type: 'rest',
    title: 'Descanso activo',
    subtitle: 'Recuperación',
    duration: 45, image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
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
// SEMANA 2 · CARGA
// =====================================================================
const week2 = [
  {
    id: 'lun', day: 'L', name: 'Lunes', type: 'bigg',
    title: 'Push · Incline Bench',
    subtitle: 'S2 Carga · Incline Bench + every 90 seg',
    duration: 47, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
    intro: 'Incline Bench Press + explosivo + accesorio, y un híbrido largo de 24\' con core integrado. Objetivo: ≥300 kcal (Garmin): densidad alta, descansos mínimos.',
    blocks: [
      { type: 'warmup', title: 'Calentamiento', duration: 8, format: 'Movilidad fija · 7 ejercicios',
        exercises: [
          { id: 's2-l-w-1', name: 'Gato contento / enojado', reps: '5 reps', detail: 'Columna segmento a segmento, exhalá al redondear.' },
          { id: 's2-l-w-2', name: 'Cuadrupedia: alcanzo y tiro', reps: '10 reps (5/5)', detail: 'En cuatro apoyos: estirá un brazo adelante y tirá el codo hacia atrás rotando el pecho.' },
          { id: 's2-l-w-3', name: 'Estocada con giro y me estiro', reps: '10 reps (5/5)', detail: 'Estocada larga, girá el torso hacia la pierna de adelante y estirá el brazo al techo.' },
          { id: 's2-l-w-4', name: '90/90', reps: '10 reps', detail: 'Sentado, rotá las dos rodillas de lado a lado sin usar las manos si podés.' },
          { id: 's2-l-w-5', name: 'Sentadilla y estiro brazos', reps: '10 reps', detail: 'Sentadilla profunda, abajo estirá los brazos arriba y empujá las rodillas afuera.' },
          { id: 's2-l-w-6', name: 'Extensión de isquios', reps: '10 reps', detail: 'Desde cuclillas tomando las puntas de los pies, estirá las rodillas sin soltar.' },
          { id: 's2-l-w-7', name: 'Movimiento de espalda', reps: '10 reps', detail: 'Rotaciones y extensiones torácicas controladas, sin dolor.' },
        ] },
      { type: 'strength', title: 'Fuerza', duration: 15, format: '5 rondas · cada 3\' · principal → explosivo → accesorio',
        exercises: [
          { id: 's2-l-2-1', name: 'Barbell Incline Bench Press', reps: '5 reps', target: '~50 kg', detail: '~77% 1RM inclinado (banco 30-45°). RPE 8-8.5. Antes: 2 series de aproximación.' },
          { id: 's2-l-2-2', name: 'MB Chest Pass contra pared', reps: '8 reps', target: 'MB 5 kg', detail: 'Explosivo. Pase de pecho explosivo, recibí y repetí.' },
          { id: 's2-l-2-3', name: 'TRX Chest Fly', reps: '10 reps', detail: 'Sustituye DDB Chest Flys. Brazos semi-flexionados.' },
        ] },
      { type: 'metcon', title: 'Hybrid Long', duration: 24, format: 'Every 2\' × 12 · rotar A / B / C / D (D = core)',
        exercises: [
          { id: 's2-l-3-1', name: 'DKB Push Press', reps: 'A · 10 reps', target: '2 × KB 12', detail: 'Sustituye DDB Push Press.' },
          { id: 's2-l-3-2', name: 'Burpees', reps: 'A · 6 reps', detail: 'Pecho al piso.' },
          { id: 's2-l-3-3', name: 'Hand-Release Push Ups', reps: 'B · 12 reps', detail: 'Manos despegan abajo.' },
          { id: 's2-l-3-4', name: 'Skipping', reps: 'B · 30 seg', detail: 'Rodillas altas.' },
          { id: 's2-l-3-5', name: 'Russian Swing', reps: 'C · 15 reps', target: 'KB 20', detail: 'Pesado y explosivo.' },
          { id: 's2-l-3-6', name: 'Jumping Jacks', reps: 'C · 30 reps', detail: 'Ritmo alto.' },
          { id: 's2-l-3-7', name: 'Soga (Jump Rope)', reps: 'A · 60 saltos', detail: 'Ritmo alto.' },
          { id: 's2-l-3-8', name: 'Ab Wheel Rollout', reps: 'D · 8 reps', detail: 'Core. Rango hasta donde no arquees.' },
          { id: 's2-l-3-9', name: 'Lateral Hip Raises', reps: 'D · 10/10 reps', detail: 'Core. Plancha lateral con elevación de cadera.' },
        ] },
    ],
  },
  {
    id: 'mar', day: 'M', name: 'Martes', type: 'bigg',
    title: 'Run + Pull · Bent Over Row',
    subtitle: 'S2 Carga · Barbell Row + AMRAP olímpico',
    duration: 47, image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
    intro: 'Bent Over Row + explosivo + accesorio, y un híbrido largo de 24\' con core integrado. Objetivo: ≥300 kcal (Garmin): densidad alta, descansos mínimos.',
    blocks: [
      { type: 'warmup', title: 'Calentamiento', duration: 8, format: 'Movilidad fija · 7 ejercicios',
        exercises: [
          { id: 's2-ma-w-1', name: 'Gato contento / enojado', reps: '5 reps', detail: 'Columna segmento a segmento, exhalá al redondear.' },
          { id: 's2-ma-w-2', name: 'Cuadrupedia: alcanzo y tiro', reps: '10 reps (5/5)', detail: 'En cuatro apoyos: estirá un brazo adelante y tirá el codo hacia atrás rotando el pecho.' },
          { id: 's2-ma-w-3', name: 'Estocada con giro y me estiro', reps: '10 reps (5/5)', detail: 'Estocada larga, girá el torso hacia la pierna de adelante y estirá el brazo al techo.' },
          { id: 's2-ma-w-4', name: '90/90', reps: '10 reps', detail: 'Sentado, rotá las dos rodillas de lado a lado sin usar las manos si podés.' },
          { id: 's2-ma-w-5', name: 'Sentadilla y estiro brazos', reps: '10 reps', detail: 'Sentadilla profunda, abajo estirá los brazos arriba y empujá las rodillas afuera.' },
          { id: 's2-ma-w-6', name: 'Extensión de isquios', reps: '10 reps', detail: 'Desde cuclillas tomando las puntas de los pies, estirá las rodillas sin soltar.' },
          { id: 's2-ma-w-7', name: 'Movimiento de espalda', reps: '10 reps', detail: 'Rotaciones y extensiones torácicas controladas, sin dolor.' },
        ] },
      { type: 'strength', title: 'Fuerza', duration: 15, format: '5 rondas · cada 3\' · principal → explosivo → accesorio',
        exercises: [
          { id: 's2-ma-2-1', name: 'Barbell Bent Over Row', reps: '8 reps', target: '~60 kg', detail: '~77% 1RM. Torso a 45°, barra al ombligo. Antes: 2 series de aproximación.' },
          { id: 's2-ma-2-2', name: 'Explosive KB Single-Arm Clean', reps: '4/4 reps', target: 'KB 20', detail: 'Explosivo. Máxima velocidad de cadera.' },
          { id: 's2-ma-2-3', name: 'SKB Single-Leg Deadlift', reps: '8/8 reps', target: 'KB 20', detail: 'Isquios y estabilidad de cadera.' },
        ] },
      { type: 'metcon', title: 'Hybrid Long', duration: 24, format: 'AMRAP 24\'',
        exercises: [
          { id: 's2-ma-3-1', name: 'Barbell Hang Power Clean', reps: '6 reps', target: '~45 kg', detail: 'Recepción en cuarto de sentadilla.' },
          { id: 's2-ma-3-2', name: 'TRX Row', reps: '12 reps', detail: 'Cuerpo bien inclinado.' },
          { id: 's2-ma-3-3', name: 'Sprawl to Box Jump', reps: '6 reps', detail: 'Rápido.' },
          { id: 's2-ma-3-4', name: 'DKB Deadlift', reps: '12 reps', target: '2 × KB 20', detail: 'Ritmo constante.' },
          { id: 's2-ma-3-5', name: 'Jumping Lunges', reps: '16 reps', detail: 'Alternadas.' },
          { id: 's2-ma-3-6', name: 'Mountain Climbers', reps: '30 reps', detail: 'Cadera baja.' },
          { id: 's2-ma-3-7', name: 'Run', reps: '200 m', detail: 'Ritmo fuerte y sostenible.' },
          { id: 's2-ma-3-8', name: 'Turkish Sit Ups', reps: '4/4 reps', detail: 'Core. Flexión + estabilidad de hombro. Brazo bloqueado arriba.' },
          { id: 's2-ma-3-9', name: 'Leg Circles', reps: '10 por sentido', detail: 'Core. Círculos amplios, lumbar pegada.' },
        ] },
    ],
  },
  {
    id: 'mie', day: 'X', name: 'Miércoles', type: 'bigg',
    title: 'Legs · Hip Thrust',
    subtitle: 'S2 Carga · Hip Thrust + 21-15-9',
    duration: 47, image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&q=80',
    intro: 'Hip Thrust + explosivo + accesorio, y un híbrido largo de 24\' con core integrado. Objetivo: ≥300 kcal (Garmin): densidad alta, descansos mínimos.',
    blocks: [
      { type: 'warmup', title: 'Calentamiento', duration: 8, format: 'Movilidad fija · 7 ejercicios',
        exercises: [
          { id: 's2-mi-w-1', name: 'Gato contento / enojado', reps: '5 reps', detail: 'Columna segmento a segmento, exhalá al redondear.' },
          { id: 's2-mi-w-2', name: 'Cuadrupedia: alcanzo y tiro', reps: '10 reps (5/5)', detail: 'En cuatro apoyos: estirá un brazo adelante y tirá el codo hacia atrás rotando el pecho.' },
          { id: 's2-mi-w-3', name: 'Estocada con giro y me estiro', reps: '10 reps (5/5)', detail: 'Estocada larga, girá el torso hacia la pierna de adelante y estirá el brazo al techo.' },
          { id: 's2-mi-w-4', name: '90/90', reps: '10 reps', detail: 'Sentado, rotá las dos rodillas de lado a lado sin usar las manos si podés.' },
          { id: 's2-mi-w-5', name: 'Sentadilla y estiro brazos', reps: '10 reps', detail: 'Sentadilla profunda, abajo estirá los brazos arriba y empujá las rodillas afuera.' },
          { id: 's2-mi-w-6', name: 'Extensión de isquios', reps: '10 reps', detail: 'Desde cuclillas tomando las puntas de los pies, estirá las rodillas sin soltar.' },
          { id: 's2-mi-w-7', name: 'Movimiento de espalda', reps: '10 reps', detail: 'Rotaciones y extensiones torácicas controladas, sin dolor.' },
        ] },
      { type: 'strength', title: 'Fuerza', duration: 15, format: '5 rondas · cada 3\' · principal → explosivo → accesorio',
        exercises: [
          { id: 's2-mi-2-1', name: 'Barbell Hip Thrust', reps: '10 reps', target: '90 kg (tope)', detail: 'Techo de discos. Pausa 2 seg arriba en cada rep. Antes: 2 series de aproximación.' },
          { id: 's2-mi-2-2', name: 'Single-Leg Box Jump', reps: '3/3 reps', detail: 'Explosivo. Cajón bajo, recepción a dos pies.' },
          { id: 's2-mi-2-3', name: 'TRX Hamstring Curl', reps: '10 reps', detail: 'Sustituye Lying Leg Curls. Cadera arriba todo el set.' },
        ] },
      { type: 'metcon', title: 'Hybrid Long', duration: 24, format: '2 vueltas de 21-15-9 · cap 24\'',
        exercises: [
          { id: 's2-mi-3-1', name: 'Wall Ball', reps: '21-15-9', target: 'MB 10 kg', detail: 'Squat completo.' },
          { id: 's2-mi-3-2', name: 'Goblet Pulse Squat', reps: '21-15-9', target: 'KB 20', detail: 'Rebote en el tercio inferior.' },
          { id: 's2-mi-3-3', name: 'Burpee Box Jump', reps: '10-8-6', detail: 'Step down.' },
          { id: 's2-mi-3-4', name: 'DKB Front Rack Reverse Lunges', reps: '10-8-6 por lado', target: '2 × KB 12', detail: 'Torso vertical.' },
          { id: 's2-mi-3-5', name: 'Skater Jumps', reps: '20-16-12', detail: 'Recepción estable.' },
          { id: 's2-mi-3-6', name: 'Soga (Jump Rope)', reps: '60 saltos entre series', detail: 'Transición activa.' },
          { id: 's2-mi-3-7', name: 'Run', reps: '200 m', detail: 'Ritmo fuerte y sostenible.' },
          { id: 's2-mi-3-8', name: 'KB Dead Bug', reps: '8/8 reps', detail: 'Core. KB arriba con ambas manos, bajá pierna contraria.' },
          { id: 's2-mi-3-9', name: 'Side Plank', reps: '20 seg/lado', detail: 'Core. Cadera alta.' },
        ] },
    ],
  },
  {
    id: 'jue', day: 'J', name: 'Jueves', type: 'run',
    title: 'Run · 30/30',
    subtitle: 'S2 Carga · 2 series × 10 × 30/30',
    duration: 38, image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80',
    intro: 'Intervalos cortos a velocidad alta: mucha calidad de zancada con recuperación incompleta. Objetivo: ≥300 kcal (Garmin).',
    blocks: [
      { type: 'warmup', title: 'Calentamiento', duration: 8, format: 'Trote + drills',
        exercises: [
          { id: 's2-j-w-1', name: 'Trote suave', reps: '6 min', detail: 'Z1-Z2.' },
          { id: 's2-j-w-2', name: 'Strides', reps: '3 × 15 seg', detail: 'Aceleraciones progresivas.' },
        ] },
      { type: 'run', title: '30/30', duration: 24, format: '2 × (10 × 30 seg rápido / 30 seg suave) · 4\' entre series',
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
    duration: 47, image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
    intro: 'Push Press + explosivo + accesorio, y un híbrido largo de 24\' con core integrado. Objetivo: ≥300 kcal (Garmin): densidad alta, descansos mínimos.',
    blocks: [
      { type: 'warmup', title: 'Calentamiento', duration: 8, format: 'Movilidad fija · 7 ejercicios',
        exercises: [
          { id: 's2-v-w-1', name: 'Gato contento / enojado', reps: '5 reps', detail: 'Columna segmento a segmento, exhalá al redondear.' },
          { id: 's2-v-w-2', name: 'Cuadrupedia: alcanzo y tiro', reps: '10 reps (5/5)', detail: 'En cuatro apoyos: estirá un brazo adelante y tirá el codo hacia atrás rotando el pecho.' },
          { id: 's2-v-w-3', name: 'Estocada con giro y me estiro', reps: '10 reps (5/5)', detail: 'Estocada larga, girá el torso hacia la pierna de adelante y estirá el brazo al techo.' },
          { id: 's2-v-w-4', name: '90/90', reps: '10 reps', detail: 'Sentado, rotá las dos rodillas de lado a lado sin usar las manos si podés.' },
          { id: 's2-v-w-5', name: 'Sentadilla y estiro brazos', reps: '10 reps', detail: 'Sentadilla profunda, abajo estirá los brazos arriba y empujá las rodillas afuera.' },
          { id: 's2-v-w-6', name: 'Extensión de isquios', reps: '10 reps', detail: 'Desde cuclillas tomando las puntas de los pies, estirá las rodillas sin soltar.' },
          { id: 's2-v-w-7', name: 'Movimiento de espalda', reps: '10 reps', detail: 'Rotaciones y extensiones torácicas controladas, sin dolor.' },
        ] },
      { type: 'strength', title: 'Fuerza', duration: 15, format: '5 rondas · cada 3\' · principal → explosivo → accesorio',
        exercises: [
          { id: 's2-v-2-1', name: 'Barbell Push Press', reps: '5 reps', target: '~48-50 kg', detail: '~77-80% 1RM push press. Dip corto, drive explosivo. Antes: 2 series de aproximación.' },
          { id: 's2-v-2-2', name: 'MB Hip Rotation Toss', reps: '5/5 reps', target: 'MB 5 kg', detail: 'Explosivo. Contra pared, la cadera inicia el giro (golf/rugby).' },
          { id: 's2-v-2-3', name: 'DB Lateral Raises', reps: '15 reps', target: 'DB 5 kg', detail: 'Mancuernas livianas, bajada en 3 seg.' },
        ] },
      { type: 'metcon', title: 'Hybrid Long', duration: 24, format: 'AMRAP 24\'',
        exercises: [
          { id: 's2-v-3-1', name: 'DKB Thruster', reps: '10 reps', target: '2 × KB 12', detail: 'Squat completo.' },
          { id: 's2-v-3-2', name: 'Burpee Broad Jump', reps: '6 reps', detail: 'Salto largo.' },
          { id: 's2-v-3-3', name: 'SKB Single-Arm Snatch', reps: '6/6 reps', target: 'KB 20', detail: 'Sustituye DDB Single-Arm Snatch.' },
          { id: 's2-v-3-4', name: 'Plank Get Up', reps: '10 reps', detail: 'Alterná brazo.' },
          { id: 's2-v-3-5', name: 'MB Squat Ground to Overhead', reps: '10 reps', target: 'MB 10 kg', detail: 'Bloqueo arriba.' },
          { id: 's2-v-3-6', name: 'Box Jumps', reps: '10 reps', detail: 'Step down.' },
          { id: 's2-v-3-7', name: 'Soga (Jump Rope)', reps: '60 saltos', detail: 'Ritmo alto.' },
          { id: 's2-v-3-8', name: 'TRX Knee Tucks', reps: '12 reps', detail: 'Core. Anti-extensión + flexión. Pies en el TRX, rodillas al pecho.' },
          { id: 's2-v-3-9', name: 'MB Russian Twist', reps: '20 reps', detail: 'Core. Pies elevados si podés.' },
        ] },
    ],
  },
  {
    id: 'sab', day: 'S', name: 'Sábado', type: 'bigg',
    title: 'HYBRID · Hyrox Home',
    subtitle: 'S2 Carga · Hang Squat Clean + Hyrox 4 rondas',
    duration: 55, image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&q=80',
    intro: 'Hang Squat Clean + explosivo + accesorio, y un híbrido largo de 32\' con core integrado. Objetivo: ≥300 kcal (Garmin): densidad alta, descansos mínimos.',
    blocks: [
      { type: 'warmup', title: 'Calentamiento', duration: 8, format: 'Movilidad fija · 7 ejercicios',
        exercises: [
          { id: 's2-sa-w-1', name: 'Gato contento / enojado', reps: '5 reps', detail: 'Columna segmento a segmento, exhalá al redondear.' },
          { id: 's2-sa-w-2', name: 'Cuadrupedia: alcanzo y tiro', reps: '10 reps (5/5)', detail: 'En cuatro apoyos: estirá un brazo adelante y tirá el codo hacia atrás rotando el pecho.' },
          { id: 's2-sa-w-3', name: 'Estocada con giro y me estiro', reps: '10 reps (5/5)', detail: 'Estocada larga, girá el torso hacia la pierna de adelante y estirá el brazo al techo.' },
          { id: 's2-sa-w-4', name: '90/90', reps: '10 reps', detail: 'Sentado, rotá las dos rodillas de lado a lado sin usar las manos si podés.' },
          { id: 's2-sa-w-5', name: 'Sentadilla y estiro brazos', reps: '10 reps', detail: 'Sentadilla profunda, abajo estirá los brazos arriba y empujá las rodillas afuera.' },
          { id: 's2-sa-w-6', name: 'Extensión de isquios', reps: '10 reps', detail: 'Desde cuclillas tomando las puntas de los pies, estirá las rodillas sin soltar.' },
          { id: 's2-sa-w-7', name: 'Movimiento de espalda', reps: '10 reps', detail: 'Rotaciones y extensiones torácicas controladas, sin dolor.' },
        ] },
      { type: 'strength', title: 'Fuerza', duration: 15, format: '5 rondas · cada 3\' · principal → explosivo → accesorio',
        exercises: [
          { id: 's2-sa-2-1', name: 'Barbell Hang Squat Clean', reps: '5 reps', target: '~45-50 kg', detail: 'Recepción en sentadilla profunda. Antes: 2 series de aproximación.' },
          { id: 's2-sa-2-2', name: 'Broad Jump to Sprint', reps: '3 reps', detail: 'Explosivo. Salto largo + 10 m de sprint.' },
          { id: 's2-sa-2-3', name: 'DKB Front Rack Hold', reps: '30 seg', target: '2 × KB 20', detail: 'Codos altos, respirá por la panza.' },
        ] },
      { type: 'metcon', title: 'Hyrox Home', duration: 32, format: '5 rondas for time · cap 30\' · core al final de cada ronda',
        exercises: [
          { id: 's2-sa-3-1', name: 'Run', reps: '400 m', detail: 'Ritmo de carrera Hyrox.' },
          { id: 's2-sa-3-2', name: 'MB Rotational Slam', reps: '8/8 reps', target: 'MB 10 kg', detail: 'Sustituye SkiErg.' },
          { id: 's2-sa-3-3', name: 'Lateral Bear Crawl', reps: '10 m ida y vuelta', detail: 'Sustituye Sled Push. Rodillas a 3 cm del piso.' },
          { id: 's2-sa-3-4', name: 'Burpees Over The Bar', reps: '8 reps', detail: 'Sustituye Burpee Broad Jump.' },
          { id: 's2-sa-3-5', name: 'American Swing', reps: '15 reps', target: 'KB 20', detail: 'Sustituye remo.' },
          { id: 's2-sa-3-6', name: 'Farmer Carry pesado', reps: '50 m', target: '2 × KB 20', detail: 'Hombros abajo.' },
          { id: 's2-sa-3-7', name: 'Bumper Overhead Lunges', reps: '8/8 reps', target: 'Bumper 5 kg', detail: 'Sustituye Sandbag Lunges.' },
          { id: 's2-sa-3-8', name: 'Hollow Rocks', reps: '12 reps', detail: 'Core. Forma de banana firme.' },
          { id: 's2-sa-3-9', name: 'Plank Jack', reps: '20 reps', detail: 'Core. Cadera estable.' },
        ] },
    ],
  },
  {
    id: 'dom', day: 'D', name: 'Domingo', type: 'rest',
    title: 'Descanso activo',
    subtitle: 'Recuperación',
    duration: 45, image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
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
// SEMANA 3 · PICO
// =====================================================================
const week3 = [
  {
    id: 'lun', day: 'L', name: 'Lunes', type: 'bigg',
    title: 'Push · Bench Heavy',
    subtitle: 'S3 Pico · Bench pesado + rondas descendentes',
    duration: 47, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
    intro: 'Bench Press + explosivo + accesorio, y un híbrido largo de 24\' con core integrado. Objetivo: ≥300 kcal (Garmin): densidad alta, descansos mínimos.',
    blocks: [
      { type: 'warmup', title: 'Calentamiento', duration: 8, format: 'Movilidad fija · 7 ejercicios',
        exercises: [
          { id: 's3-l-w-1', name: 'Gato contento / enojado', reps: '5 reps', detail: 'Columna segmento a segmento, exhalá al redondear.' },
          { id: 's3-l-w-2', name: 'Cuadrupedia: alcanzo y tiro', reps: '10 reps (5/5)', detail: 'En cuatro apoyos: estirá un brazo adelante y tirá el codo hacia atrás rotando el pecho.' },
          { id: 's3-l-w-3', name: 'Estocada con giro y me estiro', reps: '10 reps (5/5)', detail: 'Estocada larga, girá el torso hacia la pierna de adelante y estirá el brazo al techo.' },
          { id: 's3-l-w-4', name: '90/90', reps: '10 reps', detail: 'Sentado, rotá las dos rodillas de lado a lado sin usar las manos si podés.' },
          { id: 's3-l-w-5', name: 'Sentadilla y estiro brazos', reps: '10 reps', detail: 'Sentadilla profunda, abajo estirá los brazos arriba y empujá las rodillas afuera.' },
          { id: 's3-l-w-6', name: 'Extensión de isquios', reps: '10 reps', detail: 'Desde cuclillas tomando las puntas de los pies, estirá las rodillas sin soltar.' },
          { id: 's3-l-w-7', name: 'Movimiento de espalda', reps: '10 reps', detail: 'Rotaciones y extensiones torácicas controladas, sin dolor.' },
        ] },
      { type: 'strength', title: 'Fuerza', duration: 15, format: '5 rondas · cada 3\' · principal → explosivo → accesorio',
        exercises: [
          { id: 's3-l-2-1', name: 'Barbell Bench Press', reps: '3 reps', target: '~62.5-65 kg', detail: '82-85% 1RM. RPE 9, 1 rep en reserva. Si la última ronda sale lenta, bajá 2.5 kg. Antes: 2 series de aproximación.' },
          { id: 's3-l-2-2', name: 'Plyo Push Ups', reps: '6 reps', detail: 'Explosivo. Máxima altura, recepción con codos suaves.' },
          { id: 's3-l-2-3', name: 'Deficit Push Ups', reps: '10 reps', detail: 'Manos sobre 2 KB, pecho por debajo de las manos.' },
        ] },
      { type: 'metcon', title: 'Hybrid Long', duration: 24, format: '6 rondas descendentes 14-12-10-8-6-4 · cap 24\'',
        exercises: [
          { id: 's3-l-3-1', name: 'Hand-Release Push Ups', reps: '14-12-10-8-6-4', detail: 'Manos despegan abajo.' },
          { id: 's3-l-3-2', name: 'DKB Hang Clean & Jerk', reps: '14-12-10-8-6-4', target: '2 × KB 12', detail: 'Dip & drive.' },
          { id: 's3-l-3-3', name: 'Burpees Over The Bar', reps: '14-12-10-8-6-4', detail: 'Salto lateral.' },
          { id: 's3-l-3-4', name: 'TRX Triceps Extension', reps: '14-12-10-8-6-4', detail: 'Codos fijos.' },
          { id: 's3-l-3-5', name: 'Russian Swing', reps: '14-12-10-8-6-4', target: 'KB 20', detail: 'Explosivo.' },
          { id: 's3-l-3-6', name: 'Box Jump Overs', reps: '14-12-10-8-6-4', detail: 'Saltá o pasá por encima del cajón.' },
          { id: 's3-l-3-7', name: 'Soga (Jump Rope)', reps: '60 saltos', detail: 'Ritmo alto.' },
          { id: 's3-l-3-8', name: 'Walkouts', reps: '6 reps', detail: 'Core. Caminá con las manos hasta plancha larga y volvé.' },
          { id: 's3-l-3-9', name: 'Tuck Ups', reps: '12 reps', detail: 'Core. Doble de reps que los walkouts.' },
        ] },
    ],
  },
  {
    id: 'mar', day: 'M', name: 'Martes', type: 'bigg',
    title: 'Run + Pull · Snatch Grip DL',
    subtitle: 'S3 Pico · Snatch Grip Deadlift + every 90 seg',
    duration: 47, image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
    intro: 'Snatch Grip Deadlift + explosivo + accesorio, y un híbrido largo de 24\' con core integrado. Objetivo: ≥300 kcal (Garmin): densidad alta, descansos mínimos.',
    blocks: [
      { type: 'warmup', title: 'Calentamiento', duration: 8, format: 'Movilidad fija · 7 ejercicios',
        exercises: [
          { id: 's3-ma-w-1', name: 'Gato contento / enojado', reps: '5 reps', detail: 'Columna segmento a segmento, exhalá al redondear.' },
          { id: 's3-ma-w-2', name: 'Cuadrupedia: alcanzo y tiro', reps: '10 reps (5/5)', detail: 'En cuatro apoyos: estirá un brazo adelante y tirá el codo hacia atrás rotando el pecho.' },
          { id: 's3-ma-w-3', name: 'Estocada con giro y me estiro', reps: '10 reps (5/5)', detail: 'Estocada larga, girá el torso hacia la pierna de adelante y estirá el brazo al techo.' },
          { id: 's3-ma-w-4', name: '90/90', reps: '10 reps', detail: 'Sentado, rotá las dos rodillas de lado a lado sin usar las manos si podés.' },
          { id: 's3-ma-w-5', name: 'Sentadilla y estiro brazos', reps: '10 reps', detail: 'Sentadilla profunda, abajo estirá los brazos arriba y empujá las rodillas afuera.' },
          { id: 's3-ma-w-6', name: 'Extensión de isquios', reps: '10 reps', detail: 'Desde cuclillas tomando las puntas de los pies, estirá las rodillas sin soltar.' },
          { id: 's3-ma-w-7', name: 'Movimiento de espalda', reps: '10 reps', detail: 'Rotaciones y extensiones torácicas controladas, sin dolor.' },
        ] },
      { type: 'strength', title: 'Fuerza', duration: 15, format: '5 rondas · cada 3\' · principal → explosivo → accesorio',
        exercises: [
          { id: 's3-ma-2-1', name: 'Barbell Snatch Grip Deadlift', reps: '6 reps', target: '~80 kg', detail: 'Agarre amplio, pecho arriba. Pausa 1 seg bajo rodilla en la rep 1. Antes: 2 series de aproximación.' },
          { id: 's3-ma-2-2', name: 'Broad Jump', reps: '4 reps', detail: 'Explosivo. Clavá la recepción, caminá de vuelta.' },
          { id: 's3-ma-2-3', name: 'Single-Arm KB Bent Over Row', reps: '10/10 reps', target: 'KB 20', detail: 'Sustituye Single-Arm DB Row. Mano en el banco.' },
        ] },
      { type: 'metcon', title: 'Hybrid Long', duration: 24, format: 'Every 2\' × 12 · rotar A / B / C / D (D = core)',
        exercises: [
          { id: 's3-ma-3-1', name: 'Barbell Power Clean', reps: 'A · 4 reps', target: '~45-50 kg', detail: 'Del piso, recepción en cuarto de sentadilla.' },
          { id: 's3-ma-3-2', name: 'Burpee', reps: 'A · 6 reps', detail: 'Pecho al piso.' },
          { id: 's3-ma-3-3', name: 'TRX Row', reps: 'B · 12 reps', detail: 'Cuerpo bien inclinado.' },
          { id: 's3-ma-3-4', name: 'Lateral Bounds', reps: 'B · 10 reps', detail: 'Clavá la recepción.' },
          { id: 's3-ma-3-5', name: 'DKB Bent Over Row', reps: 'C · 10 reps', target: '2 × KB 20', detail: 'Espalda plana.' },
          { id: 's3-ma-3-6', name: 'Skipping', reps: 'C · 30 seg', detail: 'Rodillas altas.' },
          { id: 's3-ma-3-7', name: 'Run', reps: 'A · 200 m', detail: 'Ritmo fuerte y sostenible.' },
          { id: 's3-ma-3-8', name: 'Dead Bug Progressions', reps: 'D · 8/8 reps', detail: 'Core. Brazo y pierna contrarios, exhalá al extender.' },
          { id: 's3-ma-3-9', name: 'Flutter Kicks', reps: 'D · 30 reps', detail: 'Core. Patadas cortas y rápidas.' },
        ] },
    ],
  },
  {
    id: 'mie', day: 'X', name: 'Miércoles', type: 'bigg',
    title: 'Legs · Front Squat',
    subtitle: 'S3 Pico · Front Squat + AMRAP de piernas',
    duration: 47, image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&q=80',
    intro: 'Front Squat + explosivo + accesorio, y un híbrido largo de 24\' con core integrado. Objetivo: ≥300 kcal (Garmin): densidad alta, descansos mínimos.',
    blocks: [
      { type: 'warmup', title: 'Calentamiento', duration: 8, format: 'Movilidad fija · 7 ejercicios',
        exercises: [
          { id: 's3-mi-w-1', name: 'Gato contento / enojado', reps: '5 reps', detail: 'Columna segmento a segmento, exhalá al redondear.' },
          { id: 's3-mi-w-2', name: 'Cuadrupedia: alcanzo y tiro', reps: '10 reps (5/5)', detail: 'En cuatro apoyos: estirá un brazo adelante y tirá el codo hacia atrás rotando el pecho.' },
          { id: 's3-mi-w-3', name: 'Estocada con giro y me estiro', reps: '10 reps (5/5)', detail: 'Estocada larga, girá el torso hacia la pierna de adelante y estirá el brazo al techo.' },
          { id: 's3-mi-w-4', name: '90/90', reps: '10 reps', detail: 'Sentado, rotá las dos rodillas de lado a lado sin usar las manos si podés.' },
          { id: 's3-mi-w-5', name: 'Sentadilla y estiro brazos', reps: '10 reps', detail: 'Sentadilla profunda, abajo estirá los brazos arriba y empujá las rodillas afuera.' },
          { id: 's3-mi-w-6', name: 'Extensión de isquios', reps: '10 reps', detail: 'Desde cuclillas tomando las puntas de los pies, estirá las rodillas sin soltar.' },
          { id: 's3-mi-w-7', name: 'Movimiento de espalda', reps: '10 reps', detail: 'Rotaciones y extensiones torácicas controladas, sin dolor.' },
        ] },
      { type: 'strength', title: 'Fuerza', duration: 15, format: '5 rondas · cada 3\' · principal → explosivo → accesorio',
        exercises: [
          { id: 's3-mi-2-1', name: 'Barbell Front Squat', reps: '4 reps', target: '~67.5-70 kg', detail: '80-82% 1RM. Codos altos, RPE 8.5-9. Antes: 2 series de aproximación.' },
          { id: 's3-mi-2-2', name: 'Box Jumps (altura máx)', reps: '5 reps', detail: 'Explosivo. Step down para cuidar tendones.' },
          { id: 's3-mi-2-3', name: 'KB Box Step Ups', reps: '8/8 reps', target: '2 × KB 12', detail: 'Sustituye DDB Box Step Ups. Sin impulso de la pierna de abajo.' },
        ] },
      { type: 'metcon', title: 'Hybrid Long', duration: 24, format: 'AMRAP 24\'',
        exercises: [
          { id: 's3-mi-3-1', name: 'Wall Ball', reps: '15 reps', target: 'MB 10 kg', detail: 'Squat completo.' },
          { id: 's3-mi-3-2', name: 'Burpee Box Jump', reps: '8 reps', detail: 'Step down.' },
          { id: 's3-mi-3-3', name: 'MB Squat Ground to Overhead', reps: '10 reps', target: 'MB 10 kg', detail: 'Bloqueo arriba.' },
          { id: 's3-mi-3-4', name: 'Jumping Curtsy Lunges', reps: '16 reps', detail: 'Glúteo medio.' },
          { id: 's3-mi-3-5', name: 'Farmer Carry pesado', reps: '40 m', target: '2 × KB 20', detail: 'Pasos rápidos.' },
          { id: 's3-mi-3-6', name: 'Soga (Jump Rope)', reps: '80 saltos', detail: 'Ritmo alto.' },
          { id: 's3-mi-3-7', name: 'Run', reps: '200 m', detail: 'Ritmo fuerte y sostenible.' },
          { id: 's3-mi-3-8', name: 'Stir the Pot (TRX)', reps: '6/6 reps', detail: 'Core. Plancha con pies en el TRX, círculos con la cadera quieta.' },
          { id: 's3-mi-3-9', name: 'Sit Ups', reps: '12 reps', detail: 'Core. Pies anclados si hace falta.' },
        ] },
    ],
  },
  {
    id: 'jue', day: 'J', name: 'Jueves', type: 'run',
    title: 'Run · 4×4 progresivo',
    subtitle: 'S3 Pico · 4×4 con recuperación decreciente',
    duration: 38, image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80',
    intro: '4×4 más exigente: cada intervalo un poco más rápido y menos recuperación. Objetivo: ≥300 kcal (Garmin).',
    blocks: [
      { type: 'warmup', title: 'Calentamiento', duration: 9, format: 'Trote + drills',
        exercises: [
          { id: 's3-j-w-1', name: 'Trote suave', reps: '6 min', detail: 'Z1-Z2.' },
          { id: 's3-j-w-2', name: 'Drills + Strides', reps: '3 min', detail: 'A-skip, B-skip, 3 × 15 seg aceleración.' },
        ] },
      { type: 'run', title: '4×4 progresivo', duration: 24, format: '4 × 4\' Z4→Z5 / rec 3\' · 2\'30 · 2\'',
        exercises: [
          { id: 's3-j-1-1', name: 'Intervalo progresivo', reps: '4 × 4 min', detail: 'Arrancá RPE 8, terminá RPE 9. Cada intervalo 2-3 seg/km más rápido.' },
          { id: 's3-j-1-2', name: 'Recuperación decreciente', reps: '3\' · 2\'30 · 2\'', detail: 'Trote muy suave.' },
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
    duration: 47, image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
    intro: 'Z-Press + explosivo + accesorio, y un híbrido largo de 24\' con core integrado. Objetivo: ≥300 kcal (Garmin): densidad alta, descansos mínimos.',
    blocks: [
      { type: 'warmup', title: 'Calentamiento', duration: 8, format: 'Movilidad fija · 7 ejercicios',
        exercises: [
          { id: 's3-v-w-1', name: 'Gato contento / enojado', reps: '5 reps', detail: 'Columna segmento a segmento, exhalá al redondear.' },
          { id: 's3-v-w-2', name: 'Cuadrupedia: alcanzo y tiro', reps: '10 reps (5/5)', detail: 'En cuatro apoyos: estirá un brazo adelante y tirá el codo hacia atrás rotando el pecho.' },
          { id: 's3-v-w-3', name: 'Estocada con giro y me estiro', reps: '10 reps (5/5)', detail: 'Estocada larga, girá el torso hacia la pierna de adelante y estirá el brazo al techo.' },
          { id: 's3-v-w-4', name: '90/90', reps: '10 reps', detail: 'Sentado, rotá las dos rodillas de lado a lado sin usar las manos si podés.' },
          { id: 's3-v-w-5', name: 'Sentadilla y estiro brazos', reps: '10 reps', detail: 'Sentadilla profunda, abajo estirá los brazos arriba y empujá las rodillas afuera.' },
          { id: 's3-v-w-6', name: 'Extensión de isquios', reps: '10 reps', detail: 'Desde cuclillas tomando las puntas de los pies, estirá las rodillas sin soltar.' },
          { id: 's3-v-w-7', name: 'Movimiento de espalda', reps: '10 reps', detail: 'Rotaciones y extensiones torácicas controladas, sin dolor.' },
        ] },
      { type: 'strength', title: 'Fuerza', duration: 15, format: '5 rondas · cada 3\' · principal → explosivo → accesorio',
        exercises: [
          { id: 's3-v-2-1', name: 'Barbell Z-Press', reps: '5 reps', target: '~35 kg', detail: '~80% de tu Z-press estimado. Sentado, piernas extendidas, sin inclinarte atrás. Antes: 2 series de aproximación.' },
          { id: 's3-v-2-2', name: 'MB Overhead Throw contra pared', reps: '6 reps', target: 'MB 5 kg', detail: 'Explosivo. Explosivo desde los pies.' },
          { id: 's3-v-2-3', name: 'Half-Kneeling KB Press', reps: '8/8 reps', target: 'KB 12', detail: 'Glúteo de la rodilla apoyada apretado.' },
        ] },
      { type: 'metcon', title: 'Hybrid Long', duration: 24, format: 'AMRAP 24\' · escalera 2-4-6-8-10…',
        exercises: [
          { id: 's3-v-3-1', name: 'DKB Push Press', reps: 'escalera', target: '2 × KB 12', detail: 'Sustituye DDB Push Press.' },
          { id: 's3-v-3-2', name: 'Burpee Broad Jump', reps: 'escalera', detail: 'Salto largo.' },
          { id: 's3-v-3-3', name: 'SKB Single-Arm Snatch', reps: 'escalera (total)', target: 'KB 20', detail: 'Alterná brazos.' },
          { id: 's3-v-3-4', name: 'Plank Get Up', reps: 'escalera', detail: 'Alterná brazo.' },
          { id: 's3-v-3-5', name: 'KB Renegade Rows', reps: 'escalera', target: '2 × KB 12', detail: 'Pies abiertos.' },
          { id: 's3-v-3-6', name: 'Mountain Climbers', reps: 'escalera × 2', detail: 'Doble de reps que la escalera.' },
          { id: 's3-v-3-7', name: 'Soga (Jump Rope)', reps: '60 saltos', detail: 'Ritmo alto.' },
          { id: 's3-v-3-8', name: 'L-Sit Hold', reps: '20 seg', detail: 'Core. Sobre cajones/KB.' },
          { id: 's3-v-3-9', name: 'KB Around The World', reps: '8/8 reps', detail: 'Core. Pasá la KB alrededor de la cintura sin mover la cadera.' },
        ] },
    ],
  },
  {
    id: 'sab', day: 'S', name: 'Sábado', type: 'bigg',
    title: 'HYBRID · Hyrox Home',
    subtitle: 'S3 Pico · Clean & Jerk + Hyrox 4 rondas',
    duration: 55, image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&q=80',
    intro: 'Clean & Jerk + explosivo + accesorio, y un híbrido largo de 32\' con core integrado. Objetivo: ≥300 kcal (Garmin): densidad alta, descansos mínimos.',
    blocks: [
      { type: 'warmup', title: 'Calentamiento', duration: 8, format: 'Movilidad fija · 7 ejercicios',
        exercises: [
          { id: 's3-sa-w-1', name: 'Gato contento / enojado', reps: '5 reps', detail: 'Columna segmento a segmento, exhalá al redondear.' },
          { id: 's3-sa-w-2', name: 'Cuadrupedia: alcanzo y tiro', reps: '10 reps (5/5)', detail: 'En cuatro apoyos: estirá un brazo adelante y tirá el codo hacia atrás rotando el pecho.' },
          { id: 's3-sa-w-3', name: 'Estocada con giro y me estiro', reps: '10 reps (5/5)', detail: 'Estocada larga, girá el torso hacia la pierna de adelante y estirá el brazo al techo.' },
          { id: 's3-sa-w-4', name: '90/90', reps: '10 reps', detail: 'Sentado, rotá las dos rodillas de lado a lado sin usar las manos si podés.' },
          { id: 's3-sa-w-5', name: 'Sentadilla y estiro brazos', reps: '10 reps', detail: 'Sentadilla profunda, abajo estirá los brazos arriba y empujá las rodillas afuera.' },
          { id: 's3-sa-w-6', name: 'Extensión de isquios', reps: '10 reps', detail: 'Desde cuclillas tomando las puntas de los pies, estirá las rodillas sin soltar.' },
          { id: 's3-sa-w-7', name: 'Movimiento de espalda', reps: '10 reps', detail: 'Rotaciones y extensiones torácicas controladas, sin dolor.' },
        ] },
      { type: 'strength', title: 'Fuerza', duration: 15, format: '5 rondas · cada 3\' · principal → explosivo → accesorio',
        exercises: [
          { id: 's3-sa-2-1', name: 'Barbell Clean & Jerk', reps: '4 reps', target: '~45-50 kg', detail: 'Power clean + push jerk. Toque y vuelta. Antes: 2 series de aproximación.' },
          { id: 's3-sa-2-2', name: 'Pogo Jumps', reps: '20 reps', detail: 'Explosivo. Tobillos rígidos, contacto corto.' },
          { id: 's3-sa-2-3', name: 'DKB Front Rack March', reps: '30 m', target: '2 × KB 20', detail: 'Codos altos.' },
        ] },
      { type: 'metcon', title: 'Hyrox Home', duration: 32, format: '5 rondas for time · cap 30\' · core al final de cada ronda',
        exercises: [
          { id: 's3-sa-3-1', name: 'Run', reps: '400 m', detail: 'Ritmo de carrera Hyrox.' },
          { id: 's3-sa-3-2', name: 'MB Rotational Slam', reps: '8/8 reps', target: 'MB 10 kg', detail: 'Sustituye SkiErg.' },
          { id: 's3-sa-3-3', name: 'Lateral Bear Crawl', reps: '10 m ida y vuelta', detail: 'Sustituye Sled Push.' },
          { id: 's3-sa-3-4', name: 'Burpees To Bumper', reps: '10 reps', detail: 'Sustituye Burpee Broad Jump.' },
          { id: 's3-sa-3-5', name: 'American Swing', reps: '15 reps', target: 'KB 20', detail: 'Sustituye remo.' },
          { id: 's3-sa-3-6', name: 'KB Goblet Walking Lunges', reps: '20 reps', target: 'KB 20', detail: 'Sustituye Sandbag Lunges.' },
          { id: 's3-sa-3-7', name: 'SKB Suitcase Carry', reps: '30 m/lado', target: 'KB 20', detail: 'Sustituye DDB Suitcase Carry. Sin inclinarte.' },
          { id: 's3-sa-3-8', name: 'Zombie Sit Ups', reps: '12 reps', detail: 'Core. Brazos al frente.' },
          { id: 's3-sa-3-9', name: 'TRX Pike', reps: '8 reps', detail: 'Core. Pies en el TRX, cadera al techo con piernas estiradas.' },
        ] },
    ],
  },
  {
    id: 'dom', day: 'D', name: 'Domingo', type: 'rest',
    title: 'Descanso activo',
    subtitle: 'Recuperación',
    duration: 45, image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
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
// SEMANA 4 · RESET + BENCHMARK
// =====================================================================
const week4 = [
  {
    id: 'lun', day: 'L', name: 'Lunes', type: 'bigg',
    title: 'Push · Close-Grip Bench',
    subtitle: 'S4 Reset · Close-Grip tempo + rondas',
    duration: 47, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
    intro: 'Close-Grip Bench Press + explosivo + accesorio, y un híbrido largo de 24\' con core integrado. Objetivo: ≥300 kcal (Garmin): densidad alta, descansos mínimos.',
    blocks: [
      { type: 'warmup', title: 'Calentamiento', duration: 8, format: 'Movilidad fija · 7 ejercicios',
        exercises: [
          { id: 's4-l-w-1', name: 'Gato contento / enojado', reps: '5 reps', detail: 'Columna segmento a segmento, exhalá al redondear.' },
          { id: 's4-l-w-2', name: 'Cuadrupedia: alcanzo y tiro', reps: '10 reps (5/5)', detail: 'En cuatro apoyos: estirá un brazo adelante y tirá el codo hacia atrás rotando el pecho.' },
          { id: 's4-l-w-3', name: 'Estocada con giro y me estiro', reps: '10 reps (5/5)', detail: 'Estocada larga, girá el torso hacia la pierna de adelante y estirá el brazo al techo.' },
          { id: 's4-l-w-4', name: '90/90', reps: '10 reps', detail: 'Sentado, rotá las dos rodillas de lado a lado sin usar las manos si podés.' },
          { id: 's4-l-w-5', name: 'Sentadilla y estiro brazos', reps: '10 reps', detail: 'Sentadilla profunda, abajo estirá los brazos arriba y empujá las rodillas afuera.' },
          { id: 's4-l-w-6', name: 'Extensión de isquios', reps: '10 reps', detail: 'Desde cuclillas tomando las puntas de los pies, estirá las rodillas sin soltar.' },
          { id: 's4-l-w-7', name: 'Movimiento de espalda', reps: '10 reps', detail: 'Rotaciones y extensiones torácicas controladas, sin dolor.' },
        ] },
      { type: 'strength', title: 'Fuerza', duration: 15, format: '4 rondas · cada 3\' · principal → explosivo → accesorio',
        exercises: [
          { id: 's4-l-2-1', name: 'Barbell Close-Grip Bench Press', reps: '8 reps', target: '~47.5-50 kg', detail: '~65% 1RM bench. Tempo 3-1-1, codos pegados. Antes: 2 series de aproximación.' },
          { id: 's4-l-2-2', name: 'MB Chest Pass contra pared', reps: '8 reps', target: 'MB 5 kg', detail: 'Explosivo. Pase de pecho explosivo.' },
          { id: 's4-l-2-3', name: 'SKB Floor Press', reps: '8/8 reps', target: 'KB 20', detail: 'Unilateral, anti-rotación.' },
        ] },
      { type: 'metcon', title: 'Hybrid Long', duration: 24, format: '5 rondas for time · cap 24\'',
        exercises: [
          { id: 's4-l-3-1', name: 'DKB Thruster', reps: '10 reps', target: '2 × KB 12', detail: 'Squat completo.' },
          { id: 's4-l-3-2', name: 'Push Ups', reps: '12 reps', detail: 'Pecho al piso.' },
          { id: 's4-l-3-3', name: 'Burpees Over The Bar', reps: '8 reps', detail: 'Salto lateral.' },
          { id: 's4-l-3-4', name: 'TRX Triceps Extension', reps: '12 reps', detail: 'Codos fijos.' },
          { id: 's4-l-3-5', name: 'Box Jumps', reps: '10 reps', detail: 'Step down.' },
          { id: 's4-l-3-6', name: 'American Swing', reps: '15 reps', target: 'KB 20', detail: 'Extensión completa.' },
          { id: 's4-l-3-7', name: 'Soga (Jump Rope)', reps: '60 saltos', detail: 'Ritmo alto.' },
          { id: 's4-l-3-8', name: 'Ab Wheel Rollout', reps: '8 reps', detail: 'Core. Rueda abdominal.' },
          { id: 's4-l-3-9', name: 'Bent Knee Prayer Crunches', reps: '12 reps', detail: 'Core. Manos juntas al frente.' },
        ] },
    ],
  },
  {
    id: 'mar', day: 'M', name: 'Martes', type: 'bigg',
    title: 'Run + Pull · RDL',
    subtitle: 'S4 Reset · Romanian Deadlift + every 90 seg',
    duration: 47, image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
    intro: 'Romanian Deadlift + explosivo + accesorio, y un híbrido largo de 24\' con core integrado. Objetivo: ≥300 kcal (Garmin): densidad alta, descansos mínimos.',
    blocks: [
      { type: 'warmup', title: 'Calentamiento', duration: 8, format: 'Movilidad fija · 7 ejercicios',
        exercises: [
          { id: 's4-ma-w-1', name: 'Gato contento / enojado', reps: '5 reps', detail: 'Columna segmento a segmento, exhalá al redondear.' },
          { id: 's4-ma-w-2', name: 'Cuadrupedia: alcanzo y tiro', reps: '10 reps (5/5)', detail: 'En cuatro apoyos: estirá un brazo adelante y tirá el codo hacia atrás rotando el pecho.' },
          { id: 's4-ma-w-3', name: 'Estocada con giro y me estiro', reps: '10 reps (5/5)', detail: 'Estocada larga, girá el torso hacia la pierna de adelante y estirá el brazo al techo.' },
          { id: 's4-ma-w-4', name: '90/90', reps: '10 reps', detail: 'Sentado, rotá las dos rodillas de lado a lado sin usar las manos si podés.' },
          { id: 's4-ma-w-5', name: 'Sentadilla y estiro brazos', reps: '10 reps', detail: 'Sentadilla profunda, abajo estirá los brazos arriba y empujá las rodillas afuera.' },
          { id: 's4-ma-w-6', name: 'Extensión de isquios', reps: '10 reps', detail: 'Desde cuclillas tomando las puntas de los pies, estirá las rodillas sin soltar.' },
          { id: 's4-ma-w-7', name: 'Movimiento de espalda', reps: '10 reps', detail: 'Rotaciones y extensiones torácicas controladas, sin dolor.' },
        ] },
      { type: 'strength', title: 'Fuerza', duration: 15, format: '4 rondas · cada 3\' · principal → explosivo → accesorio',
        exercises: [
          { id: 's4-ma-2-1', name: 'Barbell Romanian Deadlift', reps: '8 reps', target: '~70 kg', detail: 'Bajada 3 seg, barra pegada a las piernas, estiramiento de isquio. Antes: 2 series de aproximación.' },
          { id: 's4-ma-2-2', name: 'Russian Swing pesado', reps: '12 reps', target: 'KB 20', detail: 'Explosivo. Cadera explosiva, sin tirar con brazos.' },
          { id: 's4-ma-2-3', name: 'TRX Row', reps: '12 reps', detail: 'Pausa 2 seg arriba.' },
        ] },
      { type: 'metcon', title: 'Hybrid Long', duration: 24, format: 'Every 2\' × 12 · rotar A / B / C / D (D = core)',
        exercises: [
          { id: 's4-ma-3-1', name: 'SKB Hang Clean', reps: 'A · 5/5 reps', target: 'KB 20', detail: 'Recepción suave.' },
          { id: 's4-ma-3-2', name: 'Burpee', reps: 'A · 5 reps', detail: 'Pecho al piso.' },
          { id: 's4-ma-3-3', name: 'DKB Bent Over Row', reps: 'B · 10 reps', target: '2 × KB 20', detail: 'Espalda plana.' },
          { id: 's4-ma-3-4', name: 'Jumping Lunges', reps: 'B · 12 reps', detail: 'Alternadas.' },
          { id: 's4-ma-3-5', name: 'Sprawl to Box Jump', reps: 'C · 5 reps', detail: 'Rápido.' },
          { id: 's4-ma-3-6', name: 'Mountain Climbers', reps: 'C · 30 reps', detail: 'Cadera baja.' },
          { id: 's4-ma-3-7', name: 'Run', reps: 'A · 200 m', detail: 'Ritmo fuerte y sostenible.' },
          { id: 's4-ma-3-8', name: 'TRX Knee Tucks', reps: 'D · 12 reps', detail: 'Core. Anti-extensión + flexión. Rodillas al pecho.' },
          { id: 's4-ma-3-9', name: 'Band Woodchop (alto a bajo)', reps: 'D · 10/10 reps', detail: 'Core. La cadera inicia.' },
        ] },
    ],
  },
  {
    id: 'mie', day: 'X', name: 'Miércoles', type: 'bigg',
    title: 'Legs · Paused Squat',
    subtitle: 'S4 Reset · Back Squat con pausa + 21-15-9',
    duration: 47, image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&q=80',
    intro: 'Back Squat (pausa) + explosivo + accesorio, y un híbrido largo de 24\' con core integrado. Objetivo: ≥300 kcal (Garmin): densidad alta, descansos mínimos.',
    blocks: [
      { type: 'warmup', title: 'Calentamiento', duration: 8, format: 'Movilidad fija · 7 ejercicios',
        exercises: [
          { id: 's4-mi-w-1', name: 'Gato contento / enojado', reps: '5 reps', detail: 'Columna segmento a segmento, exhalá al redondear.' },
          { id: 's4-mi-w-2', name: 'Cuadrupedia: alcanzo y tiro', reps: '10 reps (5/5)', detail: 'En cuatro apoyos: estirá un brazo adelante y tirá el codo hacia atrás rotando el pecho.' },
          { id: 's4-mi-w-3', name: 'Estocada con giro y me estiro', reps: '10 reps (5/5)', detail: 'Estocada larga, girá el torso hacia la pierna de adelante y estirá el brazo al techo.' },
          { id: 's4-mi-w-4', name: '90/90', reps: '10 reps', detail: 'Sentado, rotá las dos rodillas de lado a lado sin usar las manos si podés.' },
          { id: 's4-mi-w-5', name: 'Sentadilla y estiro brazos', reps: '10 reps', detail: 'Sentadilla profunda, abajo estirá los brazos arriba y empujá las rodillas afuera.' },
          { id: 's4-mi-w-6', name: 'Extensión de isquios', reps: '10 reps', detail: 'Desde cuclillas tomando las puntas de los pies, estirá las rodillas sin soltar.' },
          { id: 's4-mi-w-7', name: 'Movimiento de espalda', reps: '10 reps', detail: 'Rotaciones y extensiones torácicas controladas, sin dolor.' },
        ] },
      { type: 'strength', title: 'Fuerza', duration: 15, format: '4 rondas · cada 3\' · principal → explosivo → accesorio',
        exercises: [
          { id: 's4-mi-2-1', name: 'Barbell Back Squat (pausa)', reps: '5 reps', target: '~67.5 kg', detail: '~65% 1RM. Pausa 2 seg abajo sin rebotar. Antes: 2 series de aproximación.' },
          { id: 's4-mi-2-2', name: 'Single-Leg Box Jump', reps: '3/3 reps', detail: 'Explosivo. Cajón bajo, recepción estable.' },
          { id: 's4-mi-2-3', name: 'DKB Cossack Squat', reps: '6/6 reps', target: 'KB 12 goblet', detail: 'Talón apoyado, pierna estirada con punta arriba.' },
        ] },
      { type: 'metcon', title: 'Hybrid Long', duration: 24, format: '2 vueltas de 21-15-9 · cap 24\'',
        exercises: [
          { id: 's4-mi-3-1', name: 'Wall Ball', reps: '21-15-9', target: 'MB 10 kg', detail: 'Squat completo.' },
          { id: 's4-mi-3-2', name: 'Goblet Thrusters', reps: '21-15-9', target: 'KB 20', detail: 'Codos adentro.' },
          { id: 's4-mi-3-3', name: 'Burpee Box Jump', reps: '10-8-6', detail: 'Step down.' },
          { id: 's4-mi-3-4', name: 'Skater Jumps', reps: '20-16-12', detail: 'Recepción estable.' },
          { id: 's4-mi-3-5', name: 'DKB Front Rack March', reps: '30 m por serie', target: '2 × KB 20', detail: 'Codos altos.' },
          { id: 's4-mi-3-6', name: 'Soga (Jump Rope)', reps: '60 saltos entre series', detail: 'Transición activa.' },
          { id: 's4-mi-3-7', name: 'Run', reps: '200 m', detail: 'Ritmo fuerte y sostenible.' },
          { id: 's4-mi-3-8', name: 'V-Sit Ups', reps: '12 reps', detail: 'Core. Controlado.' },
          { id: 's4-mi-3-9', name: 'Tall Plank Toe Touches', reps: '10/10 reps', detail: 'Core. Cadera quieta.' },
        ] },
    ],
  },
  {
    id: 'jue', day: 'J', name: 'Jueves', type: 'run',
    title: 'Run · 30/30',
    subtitle: 'S4 Reset · 3 series × 6 × 30/30',
    duration: 38, image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80',
    intro: 'Mismo estímulo de velocidad, repartido en 3 bloques más cortos para llegar fresco al benchmark. Objetivo: ≥300 kcal (Garmin).',
    blocks: [
      { type: 'warmup', title: 'Calentamiento', duration: 8, format: 'Trote + drills',
        exercises: [
          { id: 's4-j-w-1', name: 'Trote suave', reps: '6 min', detail: 'Z1-Z2.' },
          { id: 's4-j-w-2', name: 'Strides', reps: '3 × 15 seg', detail: 'Aceleraciones progresivas.' },
        ] },
      { type: 'run', title: '30/30', duration: 24, format: '3 × (6 × 30 seg rápido / 30 seg suave) · 3\' entre series',
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
    duration: 47, image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
    intro: 'Shoulder Press (tempo) + explosivo + accesorio, y un híbrido largo de 24\' con core integrado. Objetivo: ≥300 kcal (Garmin): densidad alta, descansos mínimos.',
    blocks: [
      { type: 'warmup', title: 'Calentamiento', duration: 8, format: 'Movilidad fija · 7 ejercicios',
        exercises: [
          { id: 's4-v-w-1', name: 'Gato contento / enojado', reps: '5 reps', detail: 'Columna segmento a segmento, exhalá al redondear.' },
          { id: 's4-v-w-2', name: 'Cuadrupedia: alcanzo y tiro', reps: '10 reps (5/5)', detail: 'En cuatro apoyos: estirá un brazo adelante y tirá el codo hacia atrás rotando el pecho.' },
          { id: 's4-v-w-3', name: 'Estocada con giro y me estiro', reps: '10 reps (5/5)', detail: 'Estocada larga, girá el torso hacia la pierna de adelante y estirá el brazo al techo.' },
          { id: 's4-v-w-4', name: '90/90', reps: '10 reps', detail: 'Sentado, rotá las dos rodillas de lado a lado sin usar las manos si podés.' },
          { id: 's4-v-w-5', name: 'Sentadilla y estiro brazos', reps: '10 reps', detail: 'Sentadilla profunda, abajo estirá los brazos arriba y empujá las rodillas afuera.' },
          { id: 's4-v-w-6', name: 'Extensión de isquios', reps: '10 reps', detail: 'Desde cuclillas tomando las puntas de los pies, estirá las rodillas sin soltar.' },
          { id: 's4-v-w-7', name: 'Movimiento de espalda', reps: '10 reps', detail: 'Rotaciones y extensiones torácicas controladas, sin dolor.' },
        ] },
      { type: 'strength', title: 'Fuerza', duration: 15, format: '4 rondas · cada 3\' · principal → explosivo → accesorio',
        exercises: [
          { id: 's4-v-2-1', name: 'Barbell Shoulder Press (tempo)', reps: '6 reps', target: '~34 kg', detail: '~65% 1RM. Bajada en 3 seg. Antes: 2 series de aproximación.' },
          { id: 's4-v-2-2', name: 'MB Hip Rotation Toss', reps: '5/5 reps', target: 'MB 5 kg', detail: 'Explosivo. La cadera inicia el giro.' },
          { id: 's4-v-2-3', name: 'Barbell Rotational Press', reps: '8/8 reps', target: 'Barra + 5 kg', detail: 'Punta de la barra en una esquina, rotá cadera y empujá.' },
        ] },
      { type: 'metcon', title: 'Hybrid Long', duration: 24, format: 'AMRAP 24\' · escalera 2-4-6-8-10…',
        exercises: [
          { id: 's4-v-3-1', name: 'DKB Hang Clean & Jerk', reps: 'escalera', target: '2 × KB 12', detail: 'Dip & drive.' },
          { id: 's4-v-3-2', name: 'Burpee Broad Jump', reps: 'escalera', detail: 'Salto largo.' },
          { id: 's4-v-3-3', name: 'SKB Single-Arm Snatch', reps: 'escalera (total)', target: 'KB 20', detail: 'Alterná brazos.' },
          { id: 's4-v-3-4', name: 'Plank Get Up', reps: 'escalera', detail: 'Alterná brazo.' },
          { id: 's4-v-3-5', name: 'MB Squat Ground to Overhead', reps: 'escalera', target: 'MB 10 kg', detail: 'Bloqueo arriba.' },
          { id: 's4-v-3-6', name: 'KB Renegade Rows', reps: 'escalera', target: '2 × KB 12', detail: 'Pies abiertos.' },
          { id: 's4-v-3-7', name: 'Soga (Jump Rope)', reps: '60 saltos', detail: 'Ritmo alto.' },
          { id: 's4-v-3-8', name: 'Hollow Hold', reps: '30 seg', detail: 'Core. Lumbar pegada.' },
          { id: 's4-v-3-9', name: 'Leg Circles', reps: '10 por sentido', detail: 'Core. Cambiá de sentido a mitad.' },
        ] },
    ],
  },
  {
    id: 'sab', day: 'S', name: 'Sábado', type: 'bigg',
    title: 'HYBRID · Hyrox Benchmark',
    subtitle: 'S4 · Benchmark Hyrox Home (registrá el tiempo)',
    duration: 55, image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&q=80',
    intro: 'Hang Power Clean + explosivo + accesorio, y un híbrido largo de 32\' con core integrado. Objetivo: ≥300 kcal (Garmin): densidad alta, descansos mínimos.',
    blocks: [
      { type: 'warmup', title: 'Calentamiento', duration: 8, format: 'Movilidad fija · 7 ejercicios',
        exercises: [
          { id: 's4-sa-w-1', name: 'Gato contento / enojado', reps: '5 reps', detail: 'Columna segmento a segmento, exhalá al redondear.' },
          { id: 's4-sa-w-2', name: 'Cuadrupedia: alcanzo y tiro', reps: '10 reps (5/5)', detail: 'En cuatro apoyos: estirá un brazo adelante y tirá el codo hacia atrás rotando el pecho.' },
          { id: 's4-sa-w-3', name: 'Estocada con giro y me estiro', reps: '10 reps (5/5)', detail: 'Estocada larga, girá el torso hacia la pierna de adelante y estirá el brazo al techo.' },
          { id: 's4-sa-w-4', name: '90/90', reps: '10 reps', detail: 'Sentado, rotá las dos rodillas de lado a lado sin usar las manos si podés.' },
          { id: 's4-sa-w-5', name: 'Sentadilla y estiro brazos', reps: '10 reps', detail: 'Sentadilla profunda, abajo estirá los brazos arriba y empujá las rodillas afuera.' },
          { id: 's4-sa-w-6', name: 'Extensión de isquios', reps: '10 reps', detail: 'Desde cuclillas tomando las puntas de los pies, estirá las rodillas sin soltar.' },
          { id: 's4-sa-w-7', name: 'Movimiento de espalda', reps: '10 reps', detail: 'Rotaciones y extensiones torácicas controladas, sin dolor.' },
        ] },
      { type: 'strength', title: 'Fuerza', duration: 15, format: '4 rondas · cada 3\' · principal → explosivo → accesorio',
        exercises: [
          { id: 's4-sa-2-1', name: 'Barbell Hang Power Clean', reps: '5 reps', target: '~45 kg', detail: 'Rápido y limpio, sin fatigar para el benchmark. Antes: 2 series de aproximación.' },
          { id: 's4-sa-2-2', name: 'Rotational Jump 90°', reps: '4/4 reps', detail: 'Explosivo. Recepción suave y estable.' },
          { id: 's4-sa-2-3', name: 'SKB Single-Arm Overhead Carry', reps: '15 m/lado', target: 'KB 20', detail: 'Costillas cerradas.' },
        ] },
      { type: 'metcon', title: 'Hyrox Home Benchmark', duration: 32, format: 'For time · 7 × (Run 400 m + estación) · cap 30\' · core entre estaciones',
        exercises: [
          { id: 's4-sa-3-1', name: 'Run', reps: '7 × 400 m', detail: 'Antes de cada estación. Anotá tiempo total.' },
          { id: 's4-sa-3-2', name: 'MB Rotational Slam', reps: '30 reps', target: 'MB 10 kg', detail: 'Estación 1 · sustituye SkiErg.' },
          { id: 's4-sa-3-3', name: 'Lateral Bear Crawl', reps: '2 × 10 m', detail: 'Estación 2 · sustituye Sled Push.' },
          { id: 's4-sa-3-4', name: 'TRX High Row', reps: '20 reps', detail: 'Estación 3 · sustituye Sled Pull.' },
          { id: 's4-sa-3-5', name: 'Burpees To Bumper', reps: '15 reps', detail: 'Estación 4 · sustituye Burpee Broad Jump.' },
          { id: 's4-sa-3-6', name: 'Farmer Carry pesado', reps: '100 m', target: '2 × KB 20', detail: 'Estación 5.' },
          { id: 's4-sa-3-7', name: 'KB Goblet Walking Lunges', reps: '30 reps', target: 'KB 20', detail: 'Estación 6 · sustituye Sandbag Lunges.' },
          { id: 's4-sa-3-8', name: 'Air Ball', reps: '30 reps', target: 'MB 5 kg', detail: 'Estación 7 · sustituye Wall Balls.' },
          { id: 's4-sa-3-9', name: 'Sit Ups', reps: '12 reps', detail: 'Core. Bajá 1 rep por ronda.' },
          { id: 's4-sa-3-10', name: 'Side Plank Reach-Through', reps: '8/8 reps', detail: 'Core. Lateral + rotación.' },
        ] },
    ],
  },
  {
    id: 'dom', day: 'D', name: 'Domingo', type: 'rest',
    title: 'Descanso activo',
    subtitle: 'Recuperación',
    duration: 45, image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
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
