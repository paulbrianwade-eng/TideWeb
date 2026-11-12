// TIDE — Hybrid Athlete · SEMANA 1 · Estructura A/B/C/D
// Objetivo S1: recuperar sensaciones · encontrar cargas RPE 7-8 · calidad de movimiento · llegar fresco al sábado
// Movilidad diaria 10' específica por día · Mar/Jue Z2 35' · Dom recuperación

export const week = [

  // ─── LUNES · UPPER STRENGTH + SPRINT ───────────────────────────────────────
  {
    id: 'lun', day: 'L', name: 'Lunes', type: 'bigg',
    title: 'Upper Strength + Sprint', subtitle: 'Empuje horizontal + velocidad · Semana 1',
    duration: 55,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
    intro: 'Semana 1: recuperar sensaciones y encontrar tu carga de bench a RPE 8 (te quedan 2 reps en el tanque). No fuerces. Calidad de movimiento sobre peso. Sprint con recuperación completa.',
    cards: [
      {
        id: 'gym', label: 'Gym', emoji: '🏋️', duration: 55,
        blocks: [
          {
            type: 'quality', title: 'A · Potencia', duration: 8,
            format: '3 vueltas · Potencia integrada',
            exercises: [
              { id: 'l-a-1', name: 'Hang Power Clean (barra)', reps: '3 reps', detail: 'Barra liviana-moderada. Tracción explosiva desde la bisagra. Foco en velocidad de barra.' },
              { id: 'l-a-2', name: 'Box Jump', reps: '3 reps', detail: 'Aterrizaje suave, step down. Despierta el sistema nervioso.' },
            ]
          },
          {
            type: 'strength', title: 'B · Fuerza', duration: 23,
            format: '5 vueltas · Descanso 90" · RPE 8',
            exercises: [
              { id: 'l-b-1', name: 'Bench Press', reps: '5x5', detail: 'Principal. RPE 8 — dejá 2 reps en reserva. Semana 1: buscás la carga, no el máximo. Barra al esternón, codos 45°.', target: 'Buscar RPE 8' },
              { id: 'l-b-2', name: 'Dominadas', reps: '5x6', detail: 'En el descanso del bench. Estrictas. Antagonista — equilibra el hombro.' },
              { id: 'l-b-3', name: 'Trap 3 Raise (banda o pelota 5kg)', reps: '5x10', detail: 'Brazo en diagonal a 45°, eleva controlado. Salud del hombro y trapecio inferior.' },
            ]
          },
          {
            type: 'metcon', title: 'C · Conditioning · VELOCIDAD', duration: 14,
            format: '5 vueltas · Caminar = descanso · Objetivo: velocidad',
            exercises: [
              { id: 'l-c-1', name: 'Sprint 80m', reps: 'máxima velocidad', detail: 'Sistema ATP-PC. Aceleración máxima. Caminá la vuelta como recuperación completa.' },
              { id: 'l-c-2', name: 'KB Swings (KB 20)', reps: '12 reps', detail: 'Explosión de cadera. KB hasta altura de pecho.' },
              { id: 'l-c-3', name: 'Bear Crawl ida/vuelta', reps: '1 ida + 1 vuelta', detail: 'Cuadrupedia, rodillas a 2cm del suelo. Estabilidad de core en movimiento.' },
            ]
          },
          {
            type: 'finisher', title: 'D · Core', duration: 8,
            format: 'Anti-rotación + estabilidad',
            exercises: [
              { id: 'l-d-1', name: 'Pallof Press (banda)', reps: '3x10/lado', detail: 'Anti-rotación. Empujá al frente sin rotar el tronco.' },
              { id: 'l-d-2', name: 'Side Plank', reps: '3x30"/lado', detail: 'Cadera arriba, cuerpo en línea.' },
              { id: 'l-d-3', name: 'Dead Bug', reps: '3x8/lado', detail: 'Brazo y pierna opuestos. Lumbar pegada al suelo.' },
            ]
          },
        ]
      },
      {
        id: 'flex', label: 'Movilidad', emoji: '🧘', duration: 10,
        blocks: [
          {
            type: 'quality', title: 'Movilidad Diaria · Lunes', duration: 10,
            format: '10 min · Incluye Thread the Needle (Lun/Vie)',
            exercises: [
              { id: 'l-mob-1', name: 'Gato contento / enojado', reps: '10 reps', detail: 'Cuadrupedia, alterna flexión y extensión de columna.' },
              { id: 'l-mob-2', name: 'Alcanzar y tirar', reps: '10/lado', detail: 'Estira el costado y dorsal, luego tracciona.' },
              { id: 'l-mob-3', name: 'Psoas dinámico', reps: '8/lado', detail: 'Lunge, balanceo activo de cadera. Abre el flexor.' },
              { id: 'l-mob-4', name: '90/90', reps: '8/lado', detail: 'Sentado, rota caderas entre ambos lados.' },
              { id: 'l-mob-5', name: 'Rock Back aductores', reps: '8/lado', detail: 'Cuadrupedia con pierna lateral extendida, mece hacia atrás.' },
              { id: 'l-mob-6', name: 'Sentadilla profunda + rotación', reps: '8 reps', detail: 'En el fondo del squat, rota el tronco abriendo un brazo.' },
              { id: 'l-mob-7', name: 'Inchworm', reps: '6 reps', detail: 'De pie, camina con las manos a plank y volvé.' },
              { id: 'l-mob-8', name: 'Band Pull Apart', reps: '15 reps', detail: 'Banda al frente, separa las manos. Hombro posterior.' },
              { id: 'l-mob-9', name: 'Shoulder CARs', reps: '5/lado', detail: 'Círculos controlados de hombro, rango máximo.' },
              { id: 'l-mob-10', name: 'Thread the Needle', reps: '8/lado', detail: 'Cuadrupedia, pasa un brazo por debajo rotando el tórax. Específico Lun/Vie.' },
            ]
          },
        ]
      },
      {
        id: 'nut', label: 'Nutrición', emoji: '🥗', duration: 5,
        blocks: [
          {
            type: 'warmup', title: 'Nutrición · Día de Fuerza', duration: 5,
            format: '~2200 kcal · 170g proteína',
            exercises: [
              { id: 'l-nut-1', name: 'Desayuno', reps: '~500 kcal', detail: '3 huevos + 2 claras · Avena 50g con banana · Café sin azúcar.' },
              { id: 'l-nut-2', name: 'Almuerzo', reps: '~650 kcal', detail: '180g pollo, pavo o atún · Arroz integral ½ taza · Ensalada + aceite de oliva.' },
              { id: 'l-nut-3', name: 'Merienda', reps: '~300 kcal', detail: 'Yogur griego 200g + fruta. O: 2 tostadas + ½ palta + huevo.' },
              { id: 'l-nut-4', name: 'Post-entreno', reps: '~350 kcal', detail: 'Batido proteína + banana + leche. O: 150g pollo + arroz.' },
              { id: 'l-nut-5', name: 'Cena', reps: '~450 kcal', detail: '150g salmón o carne magra · Verduras salteadas abundantes.' },
              { id: 'l-nut-6', name: 'Objetivo del día', reps: 'CHECK', detail: '✓ ~2200 kcal  ✓ 170g proteína  ✓ 2.5L agua  ✗ Sin alcohol  ✗ Sin ultraprocesados' },
            ]
          },
        ]
      },
    ]
  },

  // ─── MARTES · ZONA 2 ───────────────────────────────────────────────────────
  {
    id: 'mar', day: 'M', name: 'Martes', type: 'run',
    title: 'Zona 2 · 35 min', subtitle: 'Base aeróbica + movilidad',
    duration: 45,
    image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&q=80',
    intro: 'Base aeróbica para los 10 km y para quemar grasa. 35 min a ritmo conversacional. No es obligatorio hacer martes Y jueves: elegí uno según la semana.',
    cards: [
      {
        id: 'gym', label: 'Zona 2', emoji: '🏃', duration: 45,
        blocks: [
          {
            type: 'run', title: 'Bloque Z2', duration: 35,
            format: 'Ritmo conversacional · 60-70% FCM',
            exercises: [
              { id: 'ma-z-1', name: 'Trote suave / caminata rápida / bici', reps: '35 min', detail: 'Zona 2 pura. Pulso 60-70% FCM. Deberías poder mantener una conversación. Construye base aeróbica sin fatiga.' },
            ]
          },
        ]
      },
      {
        id: 'flex', label: 'Movilidad', emoji: '🧘', duration: 10,
        blocks: [
          {
            type: 'quality', title: 'Movilidad Diaria · Martes', duration: 10,
            format: '10 min',
            exercises: [
              { id: 'ma-mob-1', name: 'Gato contento / enojado', reps: '10 reps', detail: 'Cuadrupedia, alterna flexión y extensión.' },
              { id: 'ma-mob-2', name: 'Alcanzar y tirar', reps: '10/lado', detail: 'Estira costado y dorsal, luego tracciona.' },
              { id: 'ma-mob-3', name: 'Psoas dinámico', reps: '8/lado', detail: 'Lunge, balanceo activo de cadera.' },
              { id: 'ma-mob-4', name: '90/90', reps: '8/lado', detail: 'Sentado, rota caderas entre ambos lados.' },
              { id: 'ma-mob-5', name: 'Rock Back aductores', reps: '8/lado', detail: 'Cuadrupedia con pierna lateral extendida.' },
              { id: 'ma-mob-6', name: 'Sentadilla profunda + rotación', reps: '8 reps', detail: 'En el fondo del squat, rota el tronco.' },
              { id: 'ma-mob-7', name: 'Inchworm', reps: '6 reps', detail: 'De pie a plank con las manos y volvé.' },
              { id: 'ma-mob-8', name: 'Band Pull Apart', reps: '15 reps', detail: 'Separa las manos. Hombro posterior.' },
              { id: 'ma-mob-9', name: 'Shoulder CARs', reps: '5/lado', detail: 'Círculos controlados de hombro.' },
            ]
          },
        ]
      },
      {
        id: 'nut', label: 'Nutrición', emoji: '🥗', duration: 5,
        blocks: [
          {
            type: 'warmup', title: 'Nutrición · Día de Cardio', duration: 5,
            format: '~1950 kcal · 170g proteína',
            exercises: [
              { id: 'ma-nut-1', name: 'Desayuno', reps: '~450 kcal', detail: '3 huevos + 1 clara · Avena 40g + fruta · Café.' },
              { id: 'ma-nut-2', name: 'Almuerzo', reps: '~600 kcal', detail: '180g pollo o pescado · Arroz integral ½ taza · Ensalada grande.' },
              { id: 'ma-nut-3', name: 'Merienda', reps: '~250 kcal', detail: 'Yogur griego 200g + frutos secos 20g.' },
              { id: 'ma-nut-4', name: 'Cena', reps: '~450 kcal', detail: '150g salmón o carne magra · Verduras salteadas.' },
              { id: 'ma-nut-5', name: 'Objetivo del día', reps: 'CHECK', detail: '✓ ~1950 kcal  ✓ 170g proteína  ✓ 2.5L agua  ✗ Sin alcohol' },
            ]
          },
        ]
      },
    ]
  },

  // ─── MIÉRCOLES · LOWER STRENGTH + POWER ────────────────────────────────────
  {
    id: 'mie', day: 'M', name: 'Miércoles', type: 'bigg',
    title: 'Lower Strength + Power', subtitle: 'Pierna + potencia · Semana 1',
    duration: 56,
    image: 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=800&q=80',
    intro: 'Semana 1: encontrá tu carga de back squat a RPE 8. El single-leg RDL corrige descompensaciones — calidad sobre peso. Potencia y cambios de dirección en el conditioning.',
    cards: [
      {
        id: 'gym', label: 'Gym', emoji: '🏋️', duration: 56,
        blocks: [
          {
            type: 'quality', title: 'A · Potencia', duration: 8,
            format: '3 vueltas · Potencia integrada',
            exercises: [
              { id: 'mi-a-1', name: 'Broad Jump', reps: '3 reps', detail: 'Salto horizontal máximo. Aterrizaje controlado. Potencia de cadera.' },
              { id: 'mi-a-2', name: 'Hang Power Clean (barra)', reps: '3 reps', detail: 'Barra liviana. Tracción explosiva.' },
            ]
          },
          {
            type: 'strength', title: 'B · Fuerza', duration: 24,
            format: '5 vueltas · Descanso 2" · RPE 8',
            exercises: [
              { id: 'mi-b-1', name: 'Back Squat', reps: '5x5', detail: 'Principal. RPE 8 — 2 reps en reserva. Profundidad completa, rodillas afuera.', target: 'Buscar RPE 8' },
              { id: 'mi-b-2', name: 'Single-Leg RDL (KB 20)', reps: '5x8/lado', detail: 'En el descanso del squat. Bisagra unilateral. Corrige descompensación de cadera.' },
              { id: 'mi-b-3', name: 'Monster Walk (banda)', reps: '5x10/dirección', detail: 'Banda en tobillos, semi-squat, pasos laterales. Glúteo medio.' },
            ]
          },
          {
            type: 'metcon', title: 'C · Conditioning · POTENCIA + CAMBIOS', duration: 15,
            format: "AMRAP 15' · Objetivo: potencia y cambios de dirección",
            exercises: [
              { id: 'mi-c-1', name: 'Shuttle Run 5-10-5', reps: '1 set', detail: 'Pro-agility: 5m, vuelta, 10m, vuelta, 5m. Cambios de dirección explosivos.' },
              { id: 'mi-c-2', name: 'Box Jump', reps: '10 reps', detail: 'Explosivos. Aterrizaje suave.' },
              { id: 'mi-c-3', name: 'Wall Ball (pelota 10 kg)', reps: '12 reps', detail: 'Squat + lanzar pelota a pared ~3m.' },
              { id: 'mi-c-4', name: 'Push Press (barra o KB 20)', reps: '8 reps', detail: 'Asistencia de piernas, bloqueo arriba.' },
            ]
          },
          {
            type: 'finisher', title: 'D · Core', duration: 8,
            format: 'Anti-rotación + estabilidad',
            exercises: [
              { id: 'mi-d-1', name: 'Copenhagen Plank', reps: '3x20"/lado', detail: 'Pie en cajón, plank lateral. Aductores y oblicuos.' },
              { id: 'mi-d-2', name: 'Bird Dog', reps: '3x8/lado', detail: 'Cuadrupedia. Brazo y pierna opuestos, columna neutra.' },
              { id: 'mi-d-3', name: 'Hollow Hold', reps: '3x30"', detail: 'Lumbar pegada. Brazos y piernas extendidos.' },
            ]
          },
        ]
      },
      {
        id: 'flex', label: 'Movilidad', emoji: '🧘', duration: 10,
        blocks: [
          {
            type: 'quality', title: 'Movilidad Diaria · Miércoles', duration: 10,
            format: '10 min · Incluye Rotación tibial + Ankle Rocks (Mié/Sáb)',
            exercises: [
              { id: 'mi-mob-1', name: 'Gato contento / enojado', reps: '10 reps', detail: 'Cuadrupedia, alterna flexión y extensión.' },
              { id: 'mi-mob-2', name: 'Alcanzar y tirar', reps: '10/lado', detail: 'Estira costado y dorsal.' },
              { id: 'mi-mob-3', name: 'Psoas dinámico', reps: '8/lado', detail: 'Lunge, balanceo activo de cadera.' },
              { id: 'mi-mob-4', name: '90/90', reps: '8/lado', detail: 'Sentado, rota caderas.' },
              { id: 'mi-mob-5', name: 'Rock Back aductores', reps: '8/lado', detail: 'Cuadrupedia con pierna lateral extendida.' },
              { id: 'mi-mob-6', name: 'Sentadilla profunda + rotación', reps: '8 reps', detail: 'En el fondo del squat, rota el tronco.' },
              { id: 'mi-mob-7', name: 'Inchworm', reps: '6 reps', detail: 'De pie a plank y volvé.' },
              { id: 'mi-mob-8', name: 'Band Pull Apart', reps: '15 reps', detail: 'Hombro posterior.' },
              { id: 'mi-mob-9', name: 'Shoulder CARs', reps: '5/lado', detail: 'Círculos controlados de hombro.' },
              { id: 'mi-mob-10', name: 'Rotación Tibial', reps: '20/lado', detail: 'Sentado, rota la tibia. Específico Mié/Sáb — prepara rodilla para el squat.' },
              { id: 'mi-mob-11', name: 'Ankle Rocks', reps: '10/lado', detail: 'Rodilla sobre el pie, mece hacia adelante. Movilidad de tobillo. Específico Mié/Sáb.' },
            ]
          },
        ]
      },
      {
        id: 'nut', label: 'Nutrición', emoji: '🥗', duration: 5,
        blocks: [
          {
            type: 'warmup', title: 'Nutrición · Día de Piernas', duration: 5,
            format: '~2250 kcal · 170g proteína',
            exercises: [
              { id: 'mi-nut-1', name: 'Desayuno', reps: '~500 kcal', detail: '3 huevos + 2 claras · Avena 50g + banana · Café sin azúcar.' },
              { id: 'mi-nut-2', name: 'Almuerzo', reps: '~700 kcal', detail: '200g pollo · Arroz ½ taza + lentejas ¼ taza · Ensalada. Piernas necesitan carbos.' },
              { id: 'mi-nut-3', name: 'Merienda', reps: '~300 kcal', detail: 'Yogur griego 200g + banana + miel.' },
              { id: 'mi-nut-4', name: 'Post-entreno', reps: '~400 kcal', detail: 'Batido proteína + banana + leche.' },
              { id: 'mi-nut-5', name: 'Cena', reps: '~400 kcal', detail: '150g carne magra o pollo · Vegetales asados.' },
              { id: 'mi-nut-6', name: 'Objetivo del día', reps: 'CHECK', detail: '✓ ~2250 kcal  ✓ 170g proteína  ✓ 2.5L agua  ✗ Sin alcohol' },
            ]
          },
        ]
      },
    ]
  },

  // ─── JUEVES · ZONA 2 ───────────────────────────────────────────────────────
  {
    id: 'jue', day: 'J', name: 'Jueves', type: 'run',
    title: 'Zona 2 · 35 min', subtitle: 'Base aeróbica + movilidad',
    duration: 45,
    image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&q=80',
    intro: 'Mismo objetivo que el martes: base aeróbica suave, 35 min. Recordá — alcanza con hacer martes O jueves, no los dos obligatoriamente.',
    cards: [
      {
        id: 'gym', label: 'Zona 2', emoji: '🏃', duration: 45,
        blocks: [
          {
            type: 'run', title: 'Bloque Z2', duration: 35,
            format: 'Ritmo conversacional · 60-70% FCM',
            exercises: [
              { id: 'ju-z-1', name: 'Trote suave / caminata rápida / bici', reps: '35 min', detail: 'Zona 2 pura. Pulso 60-70% FCM. Conversacional. Quema grasa y construye base sin fatiga.' },
            ]
          },
        ]
      },
      {
        id: 'flex', label: 'Movilidad', emoji: '🧘', duration: 10,
        blocks: [
          {
            type: 'quality', title: 'Movilidad Diaria · Jueves', duration: 10,
            format: '10 min',
            exercises: [
              { id: 'ju-mob-1', name: 'Gato contento / enojado', reps: '10 reps', detail: 'Cuadrupedia, alterna flexión y extensión.' },
              { id: 'ju-mob-2', name: 'Alcanzar y tirar', reps: '10/lado', detail: 'Estira costado y dorsal.' },
              { id: 'ju-mob-3', name: 'Psoas dinámico', reps: '8/lado', detail: 'Lunge, balanceo activo de cadera.' },
              { id: 'ju-mob-4', name: '90/90', reps: '8/lado', detail: 'Sentado, rota caderas.' },
              { id: 'ju-mob-5', name: 'Rock Back aductores', reps: '8/lado', detail: 'Cuadrupedia con pierna lateral extendida.' },
              { id: 'ju-mob-6', name: 'Sentadilla profunda + rotación', reps: '8 reps', detail: 'En el fondo del squat, rota el tronco.' },
              { id: 'ju-mob-7', name: 'Inchworm', reps: '6 reps', detail: 'De pie a plank y volvé.' },
              { id: 'ju-mob-8', name: 'Band Pull Apart', reps: '15 reps', detail: 'Hombro posterior.' },
              { id: 'ju-mob-9', name: 'Shoulder CARs', reps: '5/lado', detail: 'Círculos controlados de hombro.' },
            ]
          },
        ]
      },
      {
        id: 'nut', label: 'Nutrición', emoji: '🥗', duration: 5,
        blocks: [
          {
            type: 'warmup', title: 'Nutrición · Día de Cardio', duration: 5,
            format: '~1950 kcal · 170g proteína',
            exercises: [
              { id: 'ju-nut-1', name: 'Desayuno', reps: '~450 kcal', detail: '3 huevos + 1 clara · Avena 40g + fruta · Café.' },
              { id: 'ju-nut-2', name: 'Almuerzo', reps: '~600 kcal', detail: '180g pollo o pescado · Arroz integral ½ taza · Ensalada grande.' },
              { id: 'ju-nut-3', name: 'Merienda', reps: '~250 kcal', detail: 'Yogur griego 200g + frutos secos 20g.' },
              { id: 'ju-nut-4', name: 'Cena', reps: '~450 kcal', detail: '150g salmón o carne magra · Verduras salteadas.' },
              { id: 'ju-nut-5', name: 'Objetivo del día', reps: 'CHECK', detail: '✓ ~1950 kcal  ✓ 170g proteína  ✓ 2.5L agua  ✗ Sin alcohol' },
            ]
          },
        ]
      },
    ]
  },

  // ─── VIERNES · UPPER ATHLETIC + VO2 ────────────────────────────────────────
  {
    id: 'vie', day: 'V', name: 'Viernes', type: 'bigg',
    title: 'Upper Athletic + VO₂', subtitle: 'Empuje vertical + capacidad aeróbica · Semana 1',
    duration: 55,
    image: 'https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?w=800&q=80',
    intro: 'Semana 1: Strict Press a RPE controlado, calidad sobre peso. El conditioning de 6 rondas con descanso 45" sube tu VO₂ Max — la base para los 10 km. Llegá vivo al sábado.',
    cards: [
      {
        id: 'gym', label: 'Gym', emoji: '🏋️', duration: 55,
        blocks: [
          {
            type: 'quality', title: 'A · Potencia', duration: 8,
            format: '3 vueltas · Potencia integrada',
            exercises: [
              { id: 'v-a-1', name: 'Plyo Push Up', reps: '5 reps', detail: 'Push up explosivo, manos despegan del suelo. Potencia de empuje.' },
              { id: 'v-a-2', name: 'Box Jump', reps: '3 reps', detail: 'Aterrizaje suave. Activación reactiva.' },
            ]
          },
          {
            type: 'strength', title: 'B · Fuerza', duration: 22,
            format: '6 vueltas · Descanso 90" · RPE 7-8',
            exercises: [
              { id: 'v-b-1', name: 'Strict Press (barra)', reps: '6x6', detail: 'Principal. Prensa estricta, sin arco lumbar. Semana 1: carga controlada, técnica perfecta.', target: 'Buscar RPE 7-8' },
              { id: 'v-b-2', name: 'TRX Row', reps: '6x10', detail: 'En el descanso del press. Tirón horizontal. Codos pegados al tronco.' },
              { id: 'v-b-3', name: 'Trap 3 Raise (banda)', reps: '6x10', detail: 'Brazo en diagonal a 45°. Trapecio inferior — equilibra el hombro.' },
            ]
          },
          {
            type: 'metcon', title: 'C · Conditioning · VO₂ MAX', duration: 14,
            format: '6 rondas · Descanso 45" · Objetivo: capacidad aeróbica máxima',
            exercises: [
              { id: 'v-c-1', name: 'Sprint 100m', reps: '~90-95%', detail: 'Casi máximo. Si no tenés espacio: 30" soga doble o run en el lugar a tope.' },
              { id: 'v-c-2', name: 'Push Press (barra o KB 20)', reps: '8 reps', detail: 'Inmediato post-sprint. Asistencia de piernas.' },
              { id: 'v-c-3', name: 'KB Swing (KB 20)', reps: '10 reps', detail: 'Explosión de cadera. Luego 45" de descanso.' },
            ]
          },
          {
            type: 'finisher', title: 'D · Core', duration: 9,
            format: 'Agarre + anti-rotación',
            exercises: [
              { id: 'v-d-1', name: 'Dead Hang', reps: '3x30"', detail: 'Colgado de la barra. Descomprime la columna, fortalece el agarre.' },
              { id: 'v-d-2', name: 'Pallof Press (banda)', reps: '3x10/lado', detail: 'Anti-rotación. Empujá al frente sin rotar.' },
              { id: 'v-d-3', name: 'Side Plank', reps: '3x30"/lado', detail: 'Cadera arriba, cuerpo en línea.' },
            ]
          },
        ]
      },
      {
        id: 'flex', label: 'Movilidad', emoji: '🧘', duration: 10,
        blocks: [
          {
            type: 'quality', title: 'Movilidad Diaria · Viernes', duration: 10,
            format: '10 min · Incluye Thread the Needle (Lun/Vie)',
            exercises: [
              { id: 'v-mob-1', name: 'Gato contento / enojado', reps: '10 reps', detail: 'Cuadrupedia, alterna flexión y extensión.' },
              { id: 'v-mob-2', name: 'Alcanzar y tirar', reps: '10/lado', detail: 'Estira costado y dorsal.' },
              { id: 'v-mob-3', name: 'Psoas dinámico', reps: '8/lado', detail: 'Lunge, balanceo activo de cadera.' },
              { id: 'v-mob-4', name: '90/90', reps: '8/lado', detail: 'Sentado, rota caderas.' },
              { id: 'v-mob-5', name: 'Rock Back aductores', reps: '8/lado', detail: 'Cuadrupedia con pierna lateral extendida.' },
              { id: 'v-mob-6', name: 'Sentadilla profunda + rotación', reps: '8 reps', detail: 'En el fondo del squat, rota el tronco.' },
              { id: 'v-mob-7', name: 'Inchworm', reps: '6 reps', detail: 'De pie a plank y volvé.' },
              { id: 'v-mob-8', name: 'Band Pull Apart', reps: '15 reps', detail: 'Hombro posterior.' },
              { id: 'v-mob-9', name: 'Shoulder CARs', reps: '5/lado', detail: 'Círculos controlados de hombro.' },
              { id: 'v-mob-10', name: 'Thread the Needle', reps: '8/lado', detail: 'Cuadrupedia, pasa un brazo por debajo rotando el tórax. Específico Lun/Vie.' },
            ]
          },
        ]
      },
      {
        id: 'nut', label: 'Nutrición', emoji: '🥗', duration: 5,
        blocks: [
          {
            type: 'warmup', title: 'Nutrición · Día de Fuerza + VO₂', duration: 5,
            format: '~2150 kcal · 170g proteína',
            exercises: [
              { id: 'v-nut-1', name: 'Desayuno', reps: '~500 kcal', detail: '3 huevos + 2 claras · Avena 50g + fruta · Café sin azúcar.' },
              { id: 'v-nut-2', name: 'Almuerzo', reps: '~650 kcal', detail: '180g pollo o carne magra · Papa o arroz · Ensalada.' },
              { id: 'v-nut-3', name: 'Merienda', reps: '~300 kcal', detail: 'Yogur griego 200g + fruta.' },
              { id: 'v-nut-4', name: 'Post-entreno', reps: '~300 kcal', detail: 'Batido proteína + banana + leche.' },
              { id: 'v-nut-5', name: 'Cena', reps: '~400 kcal', detail: '150g pescado o pollo · Vegetales salteados.' },
              { id: 'v-nut-6', name: 'Objetivo del día', reps: 'CHECK', detail: '✓ ~2150 kcal  ✓ 170g proteína  ✓ 3L agua (VO₂)  ✗ Sin alcohol' },
            ]
          },
        ]
      },
    ]
  },

  // ─── SÁBADO · HYBRID PERFORMANCE ───────────────────────────────────────────
  {
    id: 'sab', day: 'S', name: 'Sabado', type: 'bigg',
    title: 'Hybrid Performance', subtitle: 'Resistencia + capacidad mixta estilo Hyrox · Semana 1',
    duration: 62,
    image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&q=80',
    intro: 'El día estrella. Llegaste fresco gracias a la semana bien dosificada. EMOM de fuerza explosiva + 4 vueltas de conditioning Hyrox. Ritmo sostenible, no sprint — moverte rápido bajo fatiga.',
    cards: [
      {
        id: 'gym', label: 'Gym', emoji: '🏋️', duration: 62,
        blocks: [
          {
            type: 'quality', title: 'A · Potencia', duration: 8,
            format: '3 vueltas · Potencia integrada',
            exercises: [
              { id: 's-a-1', name: 'Hang Power Clean (barra)', reps: '3 reps', detail: 'Barra liviana. Tracción explosiva.' },
              { id: 's-a-2', name: 'Box Jump', reps: '3 reps', detail: 'Aterrizaje suave.' },
              { id: 's-a-3', name: 'Soga', reps: '30"', detail: 'Despierta tobillos y ritmo cardíaco.' },
            ]
          },
          {
            type: 'strength', title: 'B · Fuerza', duration: 16,
            format: "EMOM 16' · Front Squat (impares) / Dominadas (pares) · RPE 6-7 velocidad",
            exercises: [
              { id: 's-b-1', name: 'Front Squat', reps: '5 reps · min impares', detail: 'Carga liviana-moderada. Foco en velocidad, no peso. Min 1-3-5-7-9-11-13-15.', target: 'Liviano-velocidad' },
              { id: 's-b-2', name: 'Dominadas', reps: '6 reps · min pares', detail: 'Min 2-4-6-8-10-12-14-16. Estrictas o asistidas con banda.' },
            ]
          },
          {
            type: 'metcon', title: 'C · Conditioning · HYBRID LARGO', duration: 28,
            format: '4 rondas · Descanso 60" entre rondas · Estilo Hyrox · Ritmo sostenible',
            exercises: [
              { id: 's-c-1', name: 'Correr 400m', reps: '1 ronda', detail: 'Ritmo sostenible. Si no tenés espacio: 3 min soga o run en el lugar.' },
              { id: 's-c-2', name: 'KB Swing (KB 20)', reps: '15 reps', detail: 'Explosión de cadera.' },
              { id: 's-c-3', name: 'Burpees', reps: '10 reps', detail: 'Pecho al suelo, salto arriba.' },
              { id: 's-c-4', name: 'Front Rack Lunges (KB 20 o barra)', reps: '10 reps (5/lado)', detail: 'Unilateral bajo fatiga. Torso recto.' },
              { id: 's-c-5', name: 'Hang Power Clean (barra)', reps: '6 reps', detail: 'Explosivo aún cansado. Técnica primero.' },
              { id: 's-c-6', name: 'Mountain Climbers', reps: '20 reps', detail: 'Desde plank alto. Ritmo constante. Luego 60" de descanso.' },
            ]
          },
          {
            type: 'finisher', title: 'D · Core', duration: 8,
            format: 'Anti-rotación + estabilidad',
            exercises: [
              { id: 's-d-1', name: 'Dead Bug', reps: '3x8/lado', detail: 'Brazo y pierna opuestos. Lumbar neutral.' },
              { id: 's-d-2', name: 'Hollow Hold', reps: '3x30"', detail: 'Lumbar pegada. Brazos y piernas extendidos.' },
              { id: 's-d-3', name: 'Pallof Press (banda)', reps: '3x10/lado', detail: 'Anti-rotación. Cierre de la semana.' },
            ]
          },
        ]
      },
      {
        id: 'flex', label: 'Movilidad', emoji: '🧘', duration: 10,
        blocks: [
          {
            type: 'quality', title: 'Movilidad Diaria · Sábado', duration: 10,
            format: '10 min · Incluye Rotación tibial + Ankle Rocks (Mié/Sáb)',
            exercises: [
              { id: 's-mob-1', name: 'Gato contento / enojado', reps: '10 reps', detail: 'Cuadrupedia, alterna flexión y extensión.' },
              { id: 's-mob-2', name: 'Alcanzar y tirar', reps: '10/lado', detail: 'Estira costado y dorsal.' },
              { id: 's-mob-3', name: 'Psoas dinámico', reps: '8/lado', detail: 'Lunge, balanceo activo de cadera.' },
              { id: 's-mob-4', name: '90/90', reps: '8/lado', detail: 'Sentado, rota caderas.' },
              { id: 's-mob-5', name: 'Rock Back aductores', reps: '8/lado', detail: 'Cuadrupedia con pierna lateral extendida.' },
              { id: 's-mob-6', name: 'Sentadilla profunda + rotación', reps: '8 reps', detail: 'En el fondo del squat, rota el tronco.' },
              { id: 's-mob-7', name: 'Inchworm', reps: '6 reps', detail: 'De pie a plank y volvé.' },
              { id: 's-mob-8', name: 'Band Pull Apart', reps: '15 reps', detail: 'Hombro posterior.' },
              { id: 's-mob-9', name: 'Shoulder CARs', reps: '5/lado', detail: 'Círculos controlados de hombro.' },
              { id: 's-mob-10', name: 'Rotación Tibial', reps: '20/lado', detail: 'Sentado, rota la tibia. Específico Mié/Sáb.' },
              { id: 's-mob-11', name: 'Ankle Rocks', reps: '10/lado', detail: 'Rodilla sobre el pie, mece hacia adelante. Específico Mié/Sáb.' },
            ]
          },
        ]
      },
      {
        id: 'nut', label: 'Nutrición', emoji: '🥗', duration: 5,
        blocks: [
          {
            type: 'warmup', title: 'Nutrición · Día Hybrid', duration: 5,
            format: '~2300 kcal · 170g proteína · Día más largo',
            exercises: [
              { id: 's-nut-1', name: 'Desayuno', reps: '~550 kcal', detail: '3 huevos + 2 claras · Avena 60g + banana + miel · Café.' },
              { id: 's-nut-2', name: 'Almuerzo', reps: '~700 kcal', detail: '200g pollo o carne · Arroz ½ taza + papa mediana · Ensalada.' },
              { id: 's-nut-3', name: 'Merienda / Pre-entreno', reps: '~350 kcal', detail: '2 tostadas + 2 huevos + 1 banana.' },
              { id: 's-nut-4', name: 'Post-entreno', reps: '~400 kcal', detail: 'Batido proteína + banana + avena 30g + leche.' },
              { id: 's-nut-5', name: 'Cena', reps: '~350 kcal', detail: '150g salmón o pollo · Vegetales · Palta.' },
              { id: 's-nut-6', name: 'Objetivo del día', reps: 'CHECK', detail: '✓ ~2300 kcal  ✓ 170g proteína  ✓ 3L agua  ✗ Sin alcohol. Dormí 8h.' },
            ]
          },
        ]
      },
    ]
  },

  // ─── DOMINGO · RECUPERACIÓN ────────────────────────────────────────────────
  {
    id: 'dom', day: 'D', name: 'Domingo', type: 'rest',
    title: 'Recuperación', subtitle: 'Caminata + movilidad + respiración',
    duration: 45,
    image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80',
    intro: 'Cierre de Semana 1. Caminata, movilidad completa y respiración. Anotá tus sensaciones: ¿qué cargas encontraste? ¿cómo llegaste al sábado? Eso guía la Semana 2.',
    cards: [
      {
        id: 'flex', label: 'Movilidad', emoji: '🧘', duration: 25,
        blocks: [
          {
            type: 'quality', title: 'Recuperación activa', duration: 5,
            format: 'Caminata + respiración',
            exercises: [
              { id: 'd-1-1', name: 'Caminata al aire libre', reps: '30-45 min', detail: 'Ritmo cómodo. Sol si es posible.' },
              { id: 'd-1-2', name: 'Respiración diafragmática', reps: '5 min', detail: 'Inhala 4", sostiene 2", exhala 6". Sistema parasimpático.' },
            ]
          },
          {
            type: 'quality', title: 'Movilidad Completa', duration: 20,
            format: '20 min · Todas las zonas',
            exercises: [
              { id: 'd-mob-1', name: 'Gato contento / enojado', reps: '10 reps', detail: 'Cuadrupedia, alterna flexión y extensión.' },
              { id: 'd-mob-2', name: 'Psoas dinámico', reps: '8/lado', detail: 'Lunge, balanceo activo de cadera.' },
              { id: 'd-mob-3', name: '90/90', reps: '8/lado', detail: 'Sentado, rota caderas (score 37).' },
              { id: 'd-mob-4', name: 'Banded Hamstring Stretch', reps: '2 min/lado', detail: 'GOWOD · Isquiotibiales (score 17 → CRÍTICO).' },
              { id: 'd-mob-5', name: 'Banded Pigeon', reps: '2 min/lado', detail: 'GOWOD · Glúteos + Caderas.' },
              { id: 'd-mob-6', name: 'Thread the Needle', reps: '8/lado', detail: 'Rotación de tórax en cuadrupedia.' },
              { id: 'd-mob-7', name: 'Rotación Tibial + Ankle Rocks', reps: '20 + 10/lado', detail: 'Movilidad de rodilla y tobillo.' },
              { id: 'd-mob-8', name: 'Shoulder CARs', reps: '5/lado', detail: 'Círculos controlados de hombro, rango máximo.' },
            ]
          },
        ]
      },
      {
        id: 'nut', label: 'Nutrición', emoji: '🥗', duration: 5,
        blocks: [
          {
            type: 'warmup', title: 'Nutrición · Día de Descanso', duration: 5,
            format: '~1800 kcal · 170g proteína · Carbohidratos reducidos',
            exercises: [
              { id: 'd-nut-1', name: 'Desayuno', reps: '~450 kcal', detail: '3 huevos + 2 claras · 1 tostada + palta · Café.' },
              { id: 'd-nut-2', name: 'Almuerzo', reps: '~550 kcal', detail: '200g salmón o caballa · Vegetales asados. Sin arroz ni papa.' },
              { id: 'd-nut-3', name: 'Merienda', reps: '~200 kcal', detail: 'Frutos secos sin sal 30g + 1 manzana.' },
              { id: 'd-nut-4', name: 'Cena', reps: '~400 kcal', detail: '150g pollo o pavo · Brócoli, espinaca o coliflor.' },
              { id: 'd-nut-5', name: 'Seguimiento Semana 1', reps: 'IMPORTANTE', detail: 'Enviá: captura Garmin · RPE de cada día · peso del ejercicio principal (bench, squat, press, front squat) · sensaciones generales. Esto define la Semana 2.' },
              { id: 'd-nut-6', name: 'Objetivo del día', reps: 'CHECK', detail: '✓ ~1800 kcal  ✓ 170g proteína  ✓ 2.5L agua  ✗ Sin alcohol  ✓ Dormir 8h.' },
            ]
          },
        ]
      },
    ]
  },

]
