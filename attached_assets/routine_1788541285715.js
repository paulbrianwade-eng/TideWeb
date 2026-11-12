// ============================================
// TIDE · Rutina semanal
// Base: planilla propia de Paul + 4 ajustes técnicos
// Movilidad diaria: GOWOD (fuera de la app)
// Sábado: HYROX Home Benchmark (test repetible)
// ============================================

export const week = [

  // ─────────────────────────────────────────
  // LUNES · Squat + Tracción
  // ─────────────────────────────────────────
  {
    id: 'lun',
    day: 'L',
    name: 'Lunes',
    type: 'bigg',
    title: 'Squat + Tracción',
    subtitle: 'Pierna pesada + espalda',
    duration: 50,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
    intro: 'Core anti-extensión, squat al cajón con contraste, tracción en circuito y híbrido de 4 rondas.',
    blocks: [
      {
        type: 'warmup',
        title: 'Calentamiento',
        duration: 5,
        format: 'GOWOD primero, después activación',
        exercises: [
          { id: 'l-w-1', name: 'GOWOD · rutina del día', reps: '~10 min', detail: 'Fuera de la app. Hacela antes de entrar acá.' },
          { id: 'l-w-2', name: 'Soga + air squats', reps: '90" + 15', detail: 'Sube pulso y temperatura.' },
          { id: 'l-w-3', name: 'Aproximación al squat', reps: '2 series', rest: '60"', detail: 'Barra vacía × 8 → 60% × 5.' },
        ]
      },
      {
        type: 'quality',
        title: 'B1 · Core anti-extensión',
        duration: 7,
        format: '4 rondas · circuito, sin descanso entre ejercicios',
        exercises: [
          { id: 'l-1-1', name: 'Plancha Dinámica', reps: '5 reps', detail: 'De codos a manos y vuelta. Cadera quieta.' },
          { id: 'l-1-2', name: 'Plancha Extreme', reps: '15 seg', detail: '5 series si te sobra tiempo. Máxima tensión global.' },
          { id: 'l-1-3', name: 'W-Y Acostado', reps: '12 reps', detail: 'Boca abajo. Trapecio inferior, sin encoger hombros.' },
          { id: 'l-1-4', name: 'Plancha Copenhague', reps: '10 seg/lado', detail: 'Aductor. Rodilla apoyada si hace falta.' },
        ]
      },
      {
        type: 'strength',
        title: 'B2 · Circuito Pierna',
        duration: 14,
        format: '4 rondas · descanso 90" entre rondas',
        exercises: [
          { id: 'l-2-1', name: 'Back Squat al Cajón', reps: '5 reps', detail: 'Sentate, pausa 1", subí sin rebote. Anotá la carga.', target: 'Registrar' },
          { id: 'l-2-2', name: 'Caída 2P Cajón', reps: '4 reps', detail: 'Sin contramovimiento. Va en el descanso del squat: aterrizás fresco.' },
          { id: 'l-2-3', name: 'Sentadilla COPA (goblet)', reps: '4 reps', detail: 'KB al pecho, profundidad completa.', target: 'Registrar' },
          { id: 'l-2-4', name: 'Step Up al Cajón', reps: '8/8 reps', detail: 'Agregado: único unilateral de pierna de la semana. KB en rack o mano.' },
        ]
      },
      {
        type: 'strength',
        title: 'B3 · Circuito Tracción',
        duration: 10,
        format: '4 rondas · descanso 60" entre rondas',
        exercises: [
          { id: 'l-3-1', name: 'Dominada Palmar', reps: 'Max reps', detail: 'Dejá 1-2 en reserva las primeras 3 series. La última al fallo.' },
          { id: 'l-3-2', name: 'Remo 1 Mano Explosivo', reps: '6/6 reps', detail: 'Barra en el suelo con sujetador. Tirón rápido, bajada controlada.', target: 'Registrar' },
          { id: 'l-3-3', name: 'Slam Ball', reps: '10 reps', detail: 'Pelota 10 kg. Todo el cuerpo, sin frenar arriba.' },
        ]
      },
      {
        type: 'metcon',
        title: 'B4 · Híbrido',
        duration: 13,
        format: "4 rondas en 13' · FC objetivo 150+",
        exercises: [
          { id: 'l-4-1', name: 'KB Swing Rotacional', reps: '18 reps', detail: '9/9. Cadera y rotación, no brazos.' },
          { id: 'l-4-2', name: 'Burpees', reps: '5 reps', detail: 'Pecho al suelo.' },
          { id: 'l-4-3', name: 'Saltos al Cajón', reps: '10 reps', detail: 'Step down para cuidar el Aquiles.' },
          { id: 'l-4-4', name: 'KB Push Jerk', reps: '6 reps', detail: '3/3. Dip corto, recibí con brazo bloqueado.' },
          { id: 'l-4-5', name: 'Burpees', reps: '5 reps', detail: 'Cierre de ronda.' },
        ]
      },
    ]
  },

  // ─────────────────────────────────────────
  // MARTES · Zona 2
  // ─────────────────────────────────────────
  {
    id: 'mar',
    day: 'M',
    name: 'Martes',
    type: 'run',
    title: 'Zona 2',
    subtitle: 'Base aeróbica',
    duration: 45,
    image: 'https://images.unsplash.com/photo-1486218119243-13883505764c?w=800&q=80',
    intro: 'Carrera continua a ritmo conversacional. Recuperación activa entre lunes y miércoles.',
    blocks: [
      {
        type: 'warmup',
        title: 'Previo',
        duration: 5,
        exercises: [
          { id: 'ma-w-1', name: 'GOWOD · rutina del día', reps: '~10 min', detail: 'Antes de salir.' },
          { id: 'ma-w-2', name: 'Caminata → trote', reps: '5 min', detail: 'Entrá de a poco.' },
        ]
      },
      {
        type: 'run',
        title: 'Carrera continua Z2',
        duration: 40,
        format: 'Pulso 60-70% FCM · ~130-145 ppm',
        exercises: [
          { id: 'ma-1-1', name: 'Bloque Z2', reps: '35 min', detail: 'Test de conversación: 4-5 frases sin jadear. Si el pulso sube, caminá.' },
          { id: 'ma-1-2', name: 'Vuelta a la calma', reps: '5 min', detail: 'Caminata. Pulso bajo 110.' },
        ]
      },
    ]
  },

  // ─────────────────────────────────────────
  // MIÉRCOLES · Cadera + Empuje
  // ─────────────────────────────────────────
  {
    id: 'mie',
    day: 'M',
    name: 'Miércoles',
    type: 'bigg',
    title: 'Cadera + Empuje',
    subtitle: 'Empuje de cadera + arranque + press',
    duration: 50,
    image: 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=800&q=80',
    intro: 'Cadera pesada, arranque colgado y empuje horizontal. Cierre en AMRAP de 15.',
    blocks: [
      {
        type: 'warmup',
        title: 'Calentamiento',
        duration: 5,
        exercises: [
          { id: 'mi-w-1', name: 'GOWOD · rutina del día', reps: '~10 min', detail: 'Antes de entrar acá.' },
          { id: 'mi-w-2', name: 'Activación glúteo + muñeca', reps: '2 rondas', detail: '15 glute bridge + 12 banded side steps + movilidad de muñeca para el arranque.' },
          { id: 'mi-w-3', name: 'Aproximación', reps: '2 series', rest: '60"', detail: 'Barra vacía: 8 arranques colgados técnicos.' },
        ]
      },
      {
        type: 'quality',
        title: 'B1 · Cadera + Core',
        duration: 6,
        format: '4 rondas · circuito',
        exercises: [
          { id: 'mi-1-1', name: 'Elevación Cadera Extreme', reps: '8 reps', detail: 'Rango completo, pausa arriba.' },
          { id: 'mi-1-2', name: 'Elevación Cadera 1P s/MB', reps: '8 reps', detail: 'Una pierna, sin medicine ball. Cadera nivelada.' },
          { id: 'mi-1-3', name: 'Plancha Revuelvo Olla', reps: '10 reps', detail: 'Codos sobre pelota o disco. Círculos chicos, cadera quieta.' },
          { id: 'mi-1-4', name: 'Roll Out', reps: '8 reps', detail: 'Rueda abdominal. Costillas abajo.' },
        ]
      },
      {
        type: 'strength',
        title: 'B2 · Cadera + Olímpico',
        duration: 13,
        format: '4 rondas · descanso 90"',
        exercises: [
          { id: 'mi-2-1', name: 'Empuje de Cadera', reps: '5 reps', detail: 'Espalda alta en banco, pausa 1" arriba.', target: 'Registrar' },
          { id: 'mi-2-2', name: 'Arranque Colgado', reps: '6 reps', detail: 'Velocidad sobre carga. Si se cae la técnica, bajá peso.', target: 'Registrar' },
          { id: 'mi-2-3', name: 'Salto al Cajón', reps: '5 reps', detail: 'Máxima altura, aterrizaje absorbido. Va en el descanso.' },
        ]
      },
      {
        type: 'strength',
        title: 'B3 · Circuito Empuje',
        duration: 10,
        format: '4 rondas · descanso 60"',
        exercises: [
          { id: 'mi-3-1', name: 'Press Plano', reps: '8-8-6-6 reps', detail: 'Sube carga en las series de 6.', target: 'Registrar' },
          { id: 'mi-3-2', name: 'Press Plano KB 1 Mano', reps: '6/6 reps', detail: 'Anti-rotación forzada. Cadera y hombros pegados al banco.' },
          { id: 'mi-3-3', name: 'Lanzamiento Pecho Acostado', reps: '5 reps', detail: 'Pelota contra pared o al aire. Potencia de empuje.' },
          { id: 'mi-3-4', name: 'Face Pull con elástico', reps: '15 reps', detail: 'Agregado: equilibra el ratio empuje/tracción de la semana.' },
        ]
      },
      {
        type: 'metcon',
        title: 'B4 · AMRAP 15',
        duration: 15,
        format: "AMRAP 15' · anotá rondas completas",
        exercises: [
          { id: 'mi-4-1', name: 'Bícep + Hombro', reps: '10 reps', detail: 'Curl + press. KB o DDB livianas.' },
          { id: 'mi-4-2', name: 'Push Ups', reps: '8 reps', detail: 'Pecho al suelo.' },
          { id: 'mi-4-3', name: 'Sit Ups', reps: '6 reps', detail: 'Rango completo.' },
          { id: 'mi-4-4', name: 'Burpee Pull', reps: '4 reps', detail: 'Burpee + dominada.' },
          { id: 'mi-4-5', name: 'Saltos', reps: '40 reps', detail: 'Soga. Dobles si te salen.' },
        ]
      },
    ]
  },

  // ─────────────────────────────────────────
  // JUEVES · Intervalos
  // ─────────────────────────────────────────
  {
    id: 'jue',
    day: 'J',
    name: 'Jueves',
    type: 'run',
    title: 'Intervalos',
    subtitle: '4×4 o 30/30 · VO2max',
    duration: 38,
    image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&q=80',
    intro: 'El día que más mueve la aguja para bajar grasa sin tocar la fuerza. Elegí una opción.',
    blocks: [
      {
        type: 'warmup',
        title: 'Calentamiento',
        duration: 10,
        exercises: [
          { id: 'j-w-1', name: 'GOWOD · rutina del día', reps: '~10 min', detail: 'Antes de salir.' },
          { id: 'j-w-2', name: 'Caminata → trote progresivo', reps: '7 min', detail: 'No arranques frío en intervalos.' },
          { id: 'j-w-3', name: 'Drills', reps: '3 min', detail: 'Skipping, talones al glúteo, zancadas largas.' },
        ]
      },
      {
        type: 'metcon',
        title: 'Bloque principal',
        duration: 20,
        format: 'Elegí A o B',
        exercises: [
          { id: 'j-1-1', name: 'Opción A · 4 min × 4', reps: '85-90% FCM', detail: 'Recuperación 2 min de trote. Ritmo exigente sostenible.' },
          { id: 'j-1-2', name: 'Opción B · 30" / 30" × 16', reps: '~90% FCM', detail: 'Casi sprint. Recuperación trotando, no caminando.' },
          { id: 'j-1-3', name: 'Criterio', reps: '—', detail: 'Si mañana hay deadlift pesado, usá B. Si llegás cansado: 3×4 o 12×30/30.' },
        ]
      },
      {
        type: 'finisher',
        title: 'Vuelta a la calma',
        duration: 8,
        exercises: [
          { id: 'j-2-1', name: 'Trote suave Z1', reps: '5 min', detail: 'Bajá el pulso gradual.' },
          { id: 'j-2-2', name: 'Caminata', reps: '3 min', detail: 'Hasta pulso bajo 110.' },
        ]
      },
    ]
  },

  // ─────────────────────────────────────────
  // VIERNES · Bisagra + Empuje Vertical
  // ─────────────────────────────────────────
  {
    id: 'vie',
    day: 'V',
    name: 'Viernes',
    type: 'bigg',
    title: 'Bisagra + Hombro',
    subtitle: 'Deadlift + press vertical',
    duration: 50,
    image: 'https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?w=800&q=80',
    intro: 'Deadlift pesado, empuje vertical y complejo de barra de 6 rondas para cerrar la semana de fuerza.',
    blocks: [
      {
        type: 'warmup',
        title: 'Calentamiento',
        duration: 5,
        exercises: [
          { id: 'v-w-1', name: 'GOWOD · rutina del día', reps: '~10 min', detail: 'Antes de entrar acá.' },
          { id: 'v-w-2', name: 'Activación posterior', reps: '2 rondas', detail: '10 good morning con barra vacía + 15 swing KB 12.' },
          { id: 'v-w-3', name: 'Aproximación al deadlift', reps: '2 series', rest: '60"', detail: 'Barra vacía × 8 → 50% × 5.' },
        ]
      },
      {
        type: 'quality',
        title: 'B1 · Core anti-rotación',
        duration: 6,
        format: '4 rondas · circuito',
        exercises: [
          { id: 'v-1-1', name: 'Plancha', reps: '10 seg', detail: 'Tensión máxima, no aguante largo.' },
          { id: 'v-1-2', name: 'Plancha Lateral', reps: '5 reps/lado', detail: 'Sube y baja la cadera con control.' },
          { id: 'v-1-3', name: 'Pallof Press', reps: '8/8 reps', detail: 'Elástico anclado al rack. No dejes que te rote.' },
          { id: 'v-1-4', name: 'Bear Kick', reps: '8 reps', detail: 'Desde bear position, patada cruzada. Cadera baja.' },
        ]
      },
      {
        type: 'strength',
        title: 'B2 · Circuito Bisagra',
        duration: 13,
        format: '4 rondas · descanso 90"',
        exercises: [
          { id: 'v-2-1', name: 'Deadlift', reps: '5 reps', detail: 'RPE 7-8. Bajada controlada, sin rebote.', target: 'Registrar' },
          { id: 'v-2-2', name: 'Tirón de Pecho', reps: '8 reps', detail: 'Tracción horizontal. Escápulas primero.', target: 'Registrar' },
          { id: 'v-2-3', name: 'Puente Glúteo Isométrico', reps: '20 seg', detail: '4 series. Va en el descanso del deadlift.' },
        ]
      },
      {
        type: 'strength',
        title: 'B3 · Circuito Hombro',
        duration: 11,
        format: '4 rondas · descanso 60"',
        exercises: [
          { id: 'v-3-1', name: 'Press Hombro', reps: '6 reps', detail: 'Estricto. Costillas abajo, glúteo apretado.', target: 'Registrar' },
          { id: 'v-3-2', name: 'Vuelos Laterales', reps: '10 reps', detail: 'DDB livianas. Control, no impulso.' },
          { id: 'v-3-3', name: 'Push Up con Salto', reps: '5 reps', detail: 'Manos despegan del suelo. Potencia de empuje.' },
        ]
      },
      {
        type: 'metcon',
        title: 'B4 · Complejo de Barra',
        duration: 13,
        format: "6 rondas en 13' · barra liviana",
        exercises: [
          { id: 'v-4-1', name: 'KB Swing Pesado (KB 20)', reps: '5 reps', detail: 'Reemplaza el deadlift original: ya lo hiciste 4×5 pesado en B2.' },
          { id: 'v-4-2', name: 'Barbell Clean', reps: '4 reps', detail: 'Barra liviana. Técnica primero con fatiga.', target: 'Registrar' },
          { id: 'v-4-3', name: 'Barbell Thruster', reps: '3 reps', detail: 'Misma barra, sin soltar.' },
          { id: 'v-4-4', name: 'Burpees', reps: '2 reps', detail: 'Rápidos.' },
          { id: 'v-4-5', name: 'Corriendo', reps: '1 min', detail: 'Afuera o en el lugar. Cierre de ronda.' },
        ]
      },
    ]
  },

  // ─────────────────────────────────────────
  // SÁBADO · HYROX HOME BENCHMARK
  // ─────────────────────────────────────────
  {
    id: 'sab',
    day: 'S',
    name: 'Sábado',
    type: 'bigg',
    title: 'HYROX Home',
    subtitle: 'Benchmark · 8 estaciones',
    duration: 55,
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&q=80',
    intro: 'Test repetible. Las reps son fijas a propósito: repetilo cada 3-4 semanas y compará el tiempo. Anotá el total en las notas de la sesión.',
    blocks: [
      {
        type: 'warmup',
        title: 'Calentamiento pre-test',
        duration: 8,
        format: 'No arranques frío: es una carrera',
        exercises: [
          { id: 's-w-1', name: 'GOWOD · rutina del día', reps: '~10 min', detail: 'Antes de entrar acá.' },
          { id: 's-w-2', name: 'Trote progresivo', reps: '5 min', detail: 'Subí de a poco hasta ritmo cómodo.' },
          { id: 's-w-3', name: 'Ensayo de estaciones', reps: '3 min', detail: '10 wall ball + 10 swing + 5 burpee broad jump. Sin llegar a fatiga.' },
        ]
      },
      {
        type: 'metcon',
        title: 'HYROX HOME · Por tiempo',
        duration: 45,
        format: '8 rondas: 200 m corriendo + 1 estación · anotá el tiempo total',
        exercises: [
          { id: 's-1-1', name: '1 · Soga', reps: '150 saltos', detail: 'Reemplaza SkiErg 1000 m. Cada estación va después de 200 m corriendo.' },
          { id: 's-1-2', name: '2 · Goblet Squat KB 20', reps: '30 reps', detail: 'Reemplaza Sled Push 50 m. Sin soltar la KB.' },
          { id: 's-1-3', name: '3 · Remo TRX', reps: '30 reps', detail: 'Reemplaza Sled Pull 50 m. Más horizontal = más duro.' },
          { id: 's-1-4', name: '4 · Burpee Broad Jump', reps: '20 reps', detail: 'Estación oficial. La que más duele.' },
          { id: 's-1-5', name: '5 · American Swing KB 20', reps: '40 reps', detail: 'Reemplaza Row 1000 m. KB sobre la cabeza.' },
          { id: 's-1-6', name: '6 · Farmer Carry (KB 20 + 12)', reps: '100 m', detail: 'Asimétrico. Cambiá de mano a la mitad.' },
          { id: 's-1-7', name: '7 · Bumper Overhead Lunges (10 kg)', reps: '40 pasos', detail: 'Reemplaza Sandbag Lunges 100 m.' },
          { id: 's-1-8', name: '8 · Wall Ball (10 kg)', reps: '50 reps', detail: 'Estación final. Vaciate acá.' },
        ]
      },
      {
        type: 'quality',
        title: 'Marcas de referencia',
        duration: 0,
        format: 'Compará contra vos mismo',
        exercises: [
          { id: 's-2-1', name: 'Primera vez', detail: 'Solo terminá. Anotá el tiempo, sea el que sea. Ese es tu punto cero.' },
          { id: 's-2-2', name: 'Objetivo 3 meses', detail: 'Bajar 10% del tiempo inicial sin cambiar las reps.' },
          { id: 's-2-3', name: 'Dónde perdés tiempo', detail: 'Anotá qué estación te frenó. Casi siempre es wall ball o lunges.' },
          { id: 's-2-4', name: 'Si no llegás a los 45 min', detail: 'Cortá donde estés y anotá hasta dónde llegaste. Sirve igual como marca.' },
        ]
      },
    ]
  },

  // ─────────────────────────────────────────
  // DOMINGO · Descanso
  // ─────────────────────────────────────────
  {
    id: 'dom',
    day: 'D',
    name: 'Domingo',
    type: 'rest',
    title: 'Descanso',
    subtitle: 'GOWOD + caminata',
    duration: 15,
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    intro: 'Ni corras ni levantes. GOWOD y caminar.',
    blocks: [
      {
        type: 'quality',
        title: 'Recuperación',
        duration: 15,
        exercises: [
          { id: 'd-1-1', name: 'GOWOD · sesión larga', reps: '15-20 min', detail: 'El día que más tiempo tenés. Aprovechá para la rutina completa.' },
          { id: 'd-1-2', name: 'Caminata', reps: '30-45 min', detail: 'Con las nenas. Pulso bajo 110.' },
        ]
      },
      {
        type: 'quality',
        title: 'Chequeo semanal',
        duration: 0,
        format: 'Dos minutos, una vez por semana',
        exercises: [
          { id: 'd-2-1', name: 'Exportá los datos', detail: 'Botón de exportar → CSV. Es lo que sirve para ajustar cargas.' },
          { id: 'd-2-2', name: 'Señales de alarma', detail: 'Si dos semanas seguidas las cargas no suben y el sueño está mal, bajá volumen 20% una semana.' },
          { id: 'd-2-3', name: 'Test HYROX', detail: 'Cada 3-4 semanas repetí el sábado con las mismas reps y compará el tiempo.' },
        ]
      },
    ]
  },

];

export default week;
