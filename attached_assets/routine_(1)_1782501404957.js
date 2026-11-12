// TIDE — Hybrid Athlete · Estructura A/B/C/D · 4 días fuerza + 2 Z2 + descanso
// A: Warm-Up + Potencia | B: Fuerza + Accesorio | C: Athletic Conditioning | D: Core + Movilidad
// Lun: Upper+Sprint | Mié: Lower+Power | Vie: Upper+VO2 | Sáb: Hybrid Performance
// Mar/Jue: Zona 2 (uno u otro) | Dom: Recuperación

export const week = [

  // ─── LUNES · UPPER STRENGTH + SPRINT ───────────────────────────────────────
  {
    id: 'lun', day: 'L', name: 'Lunes', type: 'bigg',
    title: 'Upper Strength + Sprint', subtitle: 'Empuje horizontal + velocidad',
    duration: 55,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
    intro: 'Objetivo: fuerza de empuje horizontal + velocidad pura (ATP-PC). Abrís la semana fresco con el sistema nervioso al máximo. Sprints cortos con recuperación total — velocidad real, no fatiga.',
    cards: [
      {
        id: 'gym', label: 'Gym', emoji: '🏋️', duration: 55,
        blocks: [
          {
            type: 'quality', title: 'A · Warm-Up + Potencia', duration: 9,
            format: '3 vueltas continuas · Movilidad + potencia integradas',
            exercises: [
              { id: 'l-a-1', name: 'Extensión Dorsal + Rotación Dorsal', reps: '4/lado', detail: 'Roller o suelo. Abre tórax y prepara el patrón de press. Movilidad activa.' },
              { id: 'l-a-2', name: 'Box Jump', reps: '4 reps', detail: 'Aterrizaje suave, step down. Despierta el sistema nervioso.' },
              { id: 'l-a-3', name: 'Hang Power Clean (barra)', reps: '5 reps', detail: 'Barra liviana. Tracción explosiva desde la bisagra. Potencia técnica.' },
              { id: 'l-a-4', name: 'Scapular Pull Ups (barra)', reps: '5 reps', detail: 'Depresión escapular. Activa la espalda antes del trabajo de tirón.' },
            ]
          },
          {
            type: 'strength', title: 'B · Fuerza + Accesorio', duration: 23,
            format: 'Superserie · 5 rondas · Descanso 90" · RPE 7→8→9 progresivo',
            exercises: [
              { id: 'l-b-1', name: 'Bench Press', reps: '5x5', detail: 'Ejercicio principal. Progresión RPE por semana: S1 RPE7 · S2-3 RPE8 · descarga RPE6. Barra al esternón, codos 45°.', target: '~52-55 kg' },
              { id: 'l-b-2', name: 'Dominadas estrictas', reps: '5x6', detail: 'En el descanso del bench. Deja 1 rep en reserva. Antagonista — equilibra el hombro.' },
              { id: 'l-b-3', name: 'Trap 3 Raise (banda o pelota 5kg)', reps: '5x10', detail: 'Brazo en diagonal a 45°, eleva controlado. Salud del hombro y trapecio inferior — clave con tanto press.' },
            ]
          },
          {
            type: 'metcon', title: 'C · Athletic Conditioning · VELOCIDAD', duration: 13,
            format: '5 vueltas · Descanso completo entre vueltas · Objetivo: velocidad',
            exercises: [
              { id: 'l-c-1', name: 'Sprint 80m', reps: 'máxima velocidad', detail: 'Sistema ATP-PC. Aceleración máxima. Caminá la vuelta como recuperación.' },
              { id: 'l-c-2', name: 'KB Swings (KB 20)', reps: '12 reps', detail: 'Explosión de cadera. KB hasta altura de pecho.' },
              { id: 'l-c-3', name: 'Burpee Broad Jump', reps: '6 reps', detail: 'Pecho al suelo + salto hacia adelante. Potencia horizontal.' },
              { id: 'l-c-4', name: 'Bear Crawl ida/vuelta', reps: '1 ida + 1 vuelta', detail: 'Cuadrupedia, rodillas a 2cm del suelo. Estabilidad de core en movimiento.' },
            ]
          },
          {
            type: 'finisher', title: 'D · Core + Movilidad', duration: 9,
            format: 'Anti-rotación + cierre de movilidad',
            exercises: [
              { id: 'l-d-1', name: 'Pallof Press (banda)', reps: '3x10/lado', detail: 'Anti-rotación. Empujá al frente sin rotar el tronco.' },
              { id: 'l-d-2', name: 'Side Plank', reps: '3x30"/lado', detail: 'Cadera arriba, cuerpo en línea. Estabilidad lateral.' },
              { id: 'l-d-3', name: 'Dead Bug', reps: '3x8/lado', detail: 'Brazo y pierna opuestos. Lumbar pegada al suelo.' },
              { id: 'l-d-4', name: 'Movilidad hombros + dorsal', reps: '3 min', detail: 'Banded overhead fixer + lat stretch. Cierre del día.' },
            ]
          },
        ]
      },
      {
        id: 'flex', label: 'Flexibilidad', emoji: '🧘', duration: 10,
        blocks: [
          {
            type: 'quality', title: 'Flexibilidad · Cadena Post + Overhead', duration: 10,
            format: 'GOWOD · 10 min · Cadena posterior (17) + Overhead (70)',
            exercises: [
              { id: 'l-mob-1', name: 'Banded Hamstring Stretch', reps: '90"/lado', detail: 'GOWOD · Isquiotibiales. Score 17 → CRÍTICO.' },
              { id: 'l-mob-2', name: '90 To 90', reps: '2 min/lado', detail: 'GOWOD · Caderas + Glúteos (score 37).' },
              { id: 'l-mob-3', name: 'Banded Overhead Fixer', reps: '90"', detail: 'GOWOD · Pectorales + Hombros (score 70).' },
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
    title: 'Zona 2 · Base Aeróbica', subtitle: 'Cardio suave + movilidad',
    duration: 50,
    image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&q=80',
    intro: 'Base aeróbica para los 10 km y para quemar grasa. Ritmo conversacional — deberías poder hablar. No es obligatorio hacer martes Y jueves: elegí uno según la semana.',
    cards: [
      {
        id: 'gym', label: 'Zona 2', emoji: '🏃', duration: 50,
        blocks: [
          {
            type: 'run', title: 'Bloque Z2', duration: 40,
            format: 'Ritmo conversacional · 60-70% FCM',
            exercises: [
              { id: 'ma-z-1', name: 'Trote suave / caminata rápida / bici', reps: '30-40 min', detail: 'Zona 2 pura. Pulso 60-70% FCM. Deberías poder mantener una conversación. Construye base aeróbica sin fatiga.' },
            ]
          },
          {
            type: 'quality', title: 'Movilidad de cierre', duration: 10,
            format: '10 min · Post-cardio',
            exercises: [
              { id: 'ma-z-2', name: 'Rotación Dorsal', reps: '2x15/lado', detail: 'Cuadrupedia, codo hacia el techo. Tórax.' },
              { id: 'ma-z-3', name: 'Extensión Dorsal con Roller', reps: '3x15', detail: 'Roller en zona dorsal. Sin roller: toalla enrollada.' },
              { id: 'ma-z-4', name: 'Rotación Tibial', reps: '20/lado', detail: 'Sentado, rota la tibia interna y externamente. Movilidad de rodilla.' },
            ]
          },
        ]
      },
      {
        id: 'flex', label: 'Flexibilidad', emoji: '🧘', duration: 10,
        blocks: [
          {
            type: 'quality', title: 'Movilidad opcional · Caderas', duration: 10,
            format: 'GOWOD · 10 min · Opcional',
            exercises: [
              { id: 'ma-mob-1', name: 'Banded Hip Opener', reps: '90"/lado', detail: 'GOWOD · Caderas + Aductores + Glúteos.' },
              { id: 'ma-mob-2', name: 'Banded Hamstring Stretch', reps: '90"/lado', detail: 'GOWOD · Isquiotibiales (score 17).' },
              { id: 'ma-mob-3', name: '90 To 90', reps: '2 min/lado', detail: 'GOWOD · Caderas (score 37).' },
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
    title: 'Lower Strength + Power', subtitle: 'Pierna + potencia y cambios de dirección',
    duration: 56,
    image: 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=800&q=80',
    intro: 'Objetivo: fuerza de pierna + corrección unilateral + potencia lateral. El día más atlético — cambios de dirección con máximo carryover a surf, golf y rugby.',
    cards: [
      {
        id: 'gym', label: 'Gym', emoji: '🏋️', duration: 56,
        blocks: [
          {
            type: 'quality', title: 'A · Warm-Up + Potencia', duration: 9,
            format: '3 vueltas continuas · Movilidad + potencia integradas',
            exercises: [
              { id: 'mi-a-1', name: 'Rotación Tibial + Movilidad tobillo', reps: '20/lado', detail: 'Prepara rodilla y tobillo para el squat profundo.' },
              { id: 'mi-a-2', name: 'Broad Jump', reps: '4 reps', detail: 'Salto horizontal máximo. Aterrizaje controlado. Potencia de cadera.' },
              { id: 'mi-a-3', name: 'Hang Power Clean (barra)', reps: '5 reps', detail: 'Barra liviana. Tracción explosiva.' },
              { id: 'mi-a-4', name: 'Monster Walk (banda)', reps: '10 pasos/dirección', detail: 'Banda en tobillos, semi-squat, pasos laterales. Activa glúteo medio.' },
            ]
          },
          {
            type: 'strength', title: 'B · Fuerza + Accesorio', duration: 24,
            format: 'Superserie · 5 rondas · Descanso 2" · RPE 8 · Ondas de carga',
            exercises: [
              { id: 'mi-b-1', name: 'Back Squat', reps: '5x5', detail: 'Ejercicio principal. Progresión RPE: S1 RPE7 · S2-3 RPE8 · descarga RPE6. Profundidad completa, rodillas afuera.', target: '~50-55 kg' },
              { id: 'mi-b-2', name: 'Single-Leg RDL (KB 20)', reps: '5x8/lado', detail: 'En el descanso del squat. Bisagra unilateral. Corrige descompensación de cadera que el squat tapa.' },
            ]
          },
          {
            type: 'metcon', title: 'C · Athletic Conditioning · POTENCIA + CAMBIOS', duration: 15,
            format: "AMRAP 15' · Objetivo: potencia y cambios de dirección",
            exercises: [
              { id: 'mi-c-1', name: 'Shuttle Run 5-10-5', reps: '1 set', detail: 'Pro-agility: 5m, vuelta, 10m, vuelta, 5m. Cambios de dirección explosivos.' },
              { id: 'mi-c-2', name: 'Box Jump', reps: '10 reps', detail: 'Explosivos. Aterrizaje suave.' },
              { id: 'mi-c-3', name: 'Wall Ball (pelota 10 kg)', reps: '12 reps', detail: 'Squat + lanzar pelota a pared ~3m.' },
              { id: 'mi-c-4', name: 'Push Press (barra o KB 20)', reps: '8 reps', detail: 'Asistencia de piernas, bloqueo arriba.' },
            ]
          },
          {
            type: 'finisher', title: 'D · Core + Movilidad', duration: 8,
            format: 'Anti-rotación + cierre de cadera',
            exercises: [
              { id: 'mi-d-1', name: 'Copenhagen Plank', reps: '3x20"/lado', detail: 'Pie en cajón, plank lateral. Aductores y oblicuos.' },
              { id: 'mi-d-2', name: 'Bird Dog', reps: '3x8/lado', detail: 'Cuadrupedia. Brazo y pierna opuestos, columna neutra.' },
              { id: 'mi-d-3', name: 'Hollow Hold', reps: '3x30"', detail: 'Lumbar pegada. Brazos y piernas extendidos.' },
              { id: 'mi-d-4', name: 'Movilidad de cadera', reps: '3 min', detail: 'Pigeon + banded knight stretch. Cierre del día.' },
            ]
          },
        ]
      },
      {
        id: 'flex', label: 'Flexibilidad', emoji: '🧘', duration: 12,
        blocks: [
          {
            type: 'quality', title: 'Flexibilidad · Caderas Profundo', duration: 12,
            format: 'GOWOD · 12 min · Sesión clave para Caderas (37)',
            exercises: [
              { id: 'mi-mob-1', name: 'Banded Knight Stretch', reps: '2 min/lado', detail: 'GOWOD · Caderas + Cuádriceps.' },
              { id: 'mi-mob-2', name: 'Banded Pigeon', reps: '2 min/lado', detail: 'GOWOD · Glúteos + Caderas.' },
              { id: 'mi-mob-3', name: '0 To 90', reps: '2 min/lado', detail: 'GOWOD · Caderas + Glúteos.' },
              { id: 'mi-mob-4', name: 'Banded Squat On Wall', reps: '90"', detail: 'GOWOD · Caderas + Aductores.' },
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
    title: 'Zona 2 · Base Aeróbica', subtitle: 'Cardio suave + movilidad',
    duration: 50,
    image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&q=80',
    intro: 'Mismo objetivo que el martes: base aeróbica suave. Recordá — alcanza con hacer martes O jueves, no los dos obligatoriamente. Elegí según cómo venga la semana.',
    cards: [
      {
        id: 'gym', label: 'Zona 2', emoji: '🏃', duration: 50,
        blocks: [
          {
            type: 'run', title: 'Bloque Z2', duration: 40,
            format: 'Ritmo conversacional · 60-70% FCM',
            exercises: [
              { id: 'ju-z-1', name: 'Trote suave / caminata rápida / bici', reps: '30-40 min', detail: 'Zona 2 pura. Pulso 60-70% FCM. Conversacional. Quema grasa y construye base sin fatiga.' },
            ]
          },
          {
            type: 'quality', title: 'Movilidad de cierre', duration: 10,
            format: '10 min · Post-cardio',
            exercises: [
              { id: 'ju-z-2', name: 'Rotación Dorsal', reps: '2x15/lado', detail: 'Cuadrupedia, codo hacia el techo.' },
              { id: 'ju-z-3', name: 'Extensión Dorsal con Roller', reps: '3x15', detail: 'Roller o toalla en zona dorsal.' },
              { id: 'ju-z-4', name: 'Rotación Tibial', reps: '20/lado', detail: 'Sentado, rota la tibia. Movilidad de rodilla.' },
            ]
          },
        ]
      },
      {
        id: 'flex', label: 'Flexibilidad', emoji: '🧘', duration: 10,
        blocks: [
          {
            type: 'quality', title: 'Movilidad opcional · Hombros', duration: 10,
            format: 'GOWOD · 10 min · Opcional · Prepara el viernes',
            exercises: [
              { id: 'ju-mob-1', name: 'Banded Overhead Fixer', reps: '90"', detail: 'GOWOD · Pectorales + Hombros. Prepara el press del viernes.' },
              { id: 'ju-mob-2', name: 'Banded Lat Stretch', reps: '90"/lado', detail: 'GOWOD · Rotadores + Hombros (score 70).' },
              { id: 'ju-mob-3', name: 'Banded Hamstring Stretch', reps: '90"/lado', detail: 'GOWOD · Isquiotibiales (score 17).' },
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
    title: 'Upper Athletic + VO₂', subtitle: 'Empuje vertical + capacidad aeróbica máxima',
    duration: 55,
    image: 'https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?w=800&q=80',
    intro: 'Objetivo: fuerza overhead + tirón + VO₂ Max. El día que construye tu motor para los 10 km. El conditioning Every 2\' mezcla sprint y fuerza para subir el techo aeróbico.',
    cards: [
      {
        id: 'gym', label: 'Gym', emoji: '🏋️', duration: 55,
        blocks: [
          {
            type: 'quality', title: 'A · Warm-Up + Potencia', duration: 9,
            format: '3 vueltas continuas · Movilidad + potencia integradas',
            exercises: [
              { id: 'v-a-1', name: 'Rotación Dorsal', reps: '4/lado', detail: 'Cuadrupedia, codo hacia el techo. Movilidad torácica para el overhead.' },
              { id: 'v-a-2', name: 'Plyo Push Up', reps: '5 reps', detail: 'Push up explosivo, manos despegan del suelo. Potencia de empuje.' },
              { id: 'v-a-3', name: 'Box Jump', reps: '4 reps', detail: 'Aterrizaje suave. Activación reactiva.' },
              { id: 'v-a-4', name: 'Band Pull Apart', reps: '12 reps', detail: 'Banda al frente, separa las manos. Salud de hombro posterior.' },
            ]
          },
          {
            type: 'strength', title: 'B · Fuerza + Accesorio', duration: 22,
            format: 'Superserie · 6 rondas · Descanso 90" · RPE 7-8',
            exercises: [
              { id: 'v-b-1', name: 'Strict Press (barra)', reps: '6x6', detail: 'Ejercicio principal. Prensa estricta, sin arco lumbar. Progresión RPE semanal.', target: '~38-40 kg' },
              { id: 'v-b-2', name: 'TRX Row', reps: '6x10', detail: 'En el descanso del press. Tirón horizontal. Codos pegados al tronco.' },
              { id: 'v-b-3', name: 'Trap 3 Raise (banda)', reps: '6x10', detail: 'Brazo en diagonal a 45°. Trapecio inferior — equilibra el hombro.' },
            ]
          },
          {
            type: 'metcon', title: 'C · Athletic Conditioning · VO₂ MAX', duration: 14,
            format: "Every 2' x 6 rondas · Objetivo: capacidad aeróbica máxima",
            exercises: [
              { id: 'v-c-1', name: 'Sprint 100m', reps: '~90-95%', detail: 'Casi máximo. Si no tenés espacio: 30" soga doble o run en el lugar a tope.' },
              { id: 'v-c-2', name: 'Push Press (barra o KB 20)', reps: '8 reps', detail: 'Inmediato post-sprint. Asistencia de piernas.' },
              { id: 'v-c-3', name: 'KB Swing (KB 20)', reps: '10 reps', detail: 'Explosión de cadera. El resto del 2\' es descanso.' },
            ]
          },
          {
            type: 'finisher', title: 'D · Core + Movilidad', duration: 9,
            format: 'Anti-rotación + cierre de hombros',
            exercises: [
              { id: 'v-d-1', name: 'Dead Hang', reps: '3x30"', detail: 'Colgado de la barra. Descomprime la columna, fortalece el agarre.' },
              { id: 'v-d-2', name: 'Pallof Press (banda)', reps: '3x10/lado', detail: 'Anti-rotación. Empujá al frente sin rotar.' },
              { id: 'v-d-3', name: 'Side Plank', reps: '3x30"/lado', detail: 'Cadera arriba, cuerpo en línea.' },
              { id: 'v-d-4', name: 'Movilidad hombros', reps: '3 min', detail: 'Banded lat stretch + shoulder strap. Cierre del día.' },
            ]
          },
        ]
      },
      {
        id: 'flex', label: 'Flexibilidad', emoji: '🧘', duration: 10,
        blocks: [
          {
            type: 'quality', title: 'Flexibilidad · Hombros + Tórax', duration: 10,
            format: 'GOWOD · 10 min · Overhead 70 bajando → invertir',
            exercises: [
              { id: 'v-mob-1', name: 'Banded Overhead Fixer', reps: '90"', detail: 'GOWOD · Pectorales + Hombros.' },
              { id: 'v-mob-2', name: 'Banded Lat Stretch', reps: '90"/lado', detail: 'GOWOD · Rotadores + Hombros.' },
              { id: 'v-mob-3', name: 'Rotación Dorsal (Paul Wade)', reps: '2x15/lado', detail: 'Tórax mejorando (+12%) — mantener.' },
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
    title: 'Hybrid Performance', subtitle: 'Resistencia muscular + capacidad mixta estilo Hyrox',
    duration: 65,
    image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&q=80',
    intro: 'El día estrella. Objetivo: resistencia bajo fatiga + capacidad mixta estilo Hyrox. EMOM de fuerza explosiva + conditioning largo de 4 vueltas. Aprendés a moverte rápido cansado.',
    cards: [
      {
        id: 'gym', label: 'Gym', emoji: '🏋️', duration: 65,
        blocks: [
          {
            type: 'quality', title: 'A · Warm-Up + Potencia', duration: 9,
            format: '3 vueltas continuas · Movilidad + potencia integradas',
            exercises: [
              { id: 's-a-1', name: 'Box Jump', reps: '5 reps', detail: 'Aterrizaje suave. Activación reactiva.' },
              { id: 's-a-2', name: 'Hang Power Clean (barra)', reps: '5 reps', detail: 'Barra liviana. Tracción explosiva.' },
              { id: 's-a-3', name: 'Soga', reps: '40"', detail: 'Despierta tobillos y ritmo cardíaco.' },
              { id: 's-a-4', name: 'Bear Crawl', reps: 'ida/vuelta', detail: 'Cuadrupedia, core activo. Estabilidad en movimiento.' },
            ]
          },
          {
            type: 'strength', title: 'B · Fuerza + Accesorio', duration: 16,
            format: "EMOM 16' · Front Squat (impares) / Dominadas (pares) · RPE 6-7 velocidad",
            exercises: [
              { id: 's-b-1', name: 'Front Squat', reps: '5 reps · min impares', detail: 'Carga liviana-moderada. Foco en velocidad, no peso. Min 1-3-5-7-9-11-13-15.', target: '~38-42 kg' },
              { id: 's-b-2', name: 'Dominadas', reps: '6 reps · min pares', detail: 'Min 2-4-6-8-10-12-14-16. Estrictas o asistidas con banda.' },
            ]
          },
          {
            type: 'metcon', title: 'C · Athletic Conditioning · HYBRID LARGO', duration: 28,
            format: '4 vueltas · Estilo Hyrox · Ritmo sostenible, no sprint',
            exercises: [
              { id: 's-c-1', name: 'Correr 400m', reps: '1 vuelta', detail: 'Ritmo sostenible. Si no tenés espacio: 3 min soga o run en el lugar.' },
              { id: 's-c-2', name: 'KB Swing (KB 20)', reps: '15 reps', detail: 'Explosión de cadera.' },
              { id: 's-c-3', name: 'Burpees', reps: '10 reps', detail: 'Pecho al suelo, salto arriba.' },
              { id: 's-c-4', name: 'Front Rack Lunges (KB 20 o barra)', reps: '10 reps (5/lado)', detail: 'Unilateral bajo fatiga. Torso recto.' },
              { id: 's-c-5', name: 'Hang Power Clean (barra)', reps: '6 reps', detail: 'Explosivo aún cansado. Técnica primero.' },
              { id: 's-c-6', name: 'Mountain Climbers', reps: '20 reps', detail: 'Desde plank alto. Ritmo constante.' },
            ]
          },
          {
            type: 'finisher', title: 'D · Core + Movilidad', duration: 10,
            format: 'Anti-rotación + movilidad completa',
            exercises: [
              { id: 's-d-1', name: 'Hollow Hold', reps: '3x30"', detail: 'Lumbar pegada. Brazos y piernas extendidos.' },
              { id: 's-d-2', name: 'Dead Bug', reps: '3x8/lado', detail: 'Brazo y pierna opuestos. Lumbar neutral.' },
              { id: 's-d-3', name: 'Pallof Press (banda)', reps: '3x10/lado', detail: 'Anti-rotación. Cierre de core.' },
              { id: 's-d-4', name: 'Movilidad completa', reps: '5 min', detail: 'GOWOD flow full body. Cierre de la semana de entreno.' },
            ]
          },
        ]
      },
      {
        id: 'flex', label: 'Flexibilidad', emoji: '🧘', duration: 13,
        blocks: [
          {
            type: 'quality', title: 'Flexibilidad · Full Body Recovery', duration: 13,
            format: 'GOWOD · 13 min · Prepara el descanso del domingo',
            exercises: [
              { id: 's-mob-1', name: 'Banded Reverse T Hip Opener', reps: '2 min/lado', detail: 'GOWOD · Caderas + Pectorales + Glúteos + Lumbares.' },
              { id: 's-mob-2', name: '90 To 90 Hip Internal Rotations', reps: '2 min/lado', detail: 'GOWOD · Caderas + Glúteos.' },
              { id: 's-mob-3', name: 'Banded Hamstring Stretch', reps: '90"/lado', detail: 'GOWOD · Isquiotibiales (score 17).' },
              { id: 's-mob-4', name: 'Active Cobra', reps: '60"', detail: 'GOWOD · Lumbares. Cierre.' },
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
    title: 'Recuperación', subtitle: 'Descanso total + movilidad completa',
    duration: 45,
    image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80',
    intro: 'Cierre de semana. Caminata, movilidad completa y respiración. La recuperación es donde se consolida la fuerza y se pierde la grasa.',
    cards: [
      {
        id: 'flex', label: 'Flexibilidad', emoji: '🧘', duration: 25,
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
            format: 'GOWOD + Paul Wade · 20 min · Todas las zonas',
            exercises: [
              { id: 'd-mob-1', name: '90 To 90', reps: '2 min/lado', detail: 'GOWOD · Caderas (score 37).' },
              { id: 'd-mob-2', name: 'Banded Hamstring Stretch', reps: '2 min/lado', detail: 'GOWOD · Isquiotibiales (score 17 → CRÍTICO).' },
              { id: 'd-mob-3', name: 'Banded Pigeon', reps: '2 min/lado', detail: 'GOWOD · Glúteos + Caderas.' },
              { id: 'd-mob-4', name: 'Active Butterfly', reps: '2 min', detail: 'GOWOD · Aductores + Caderas.' },
              { id: 'd-mob-5', name: 'Banded Lat Stretch', reps: '90"/lado', detail: 'GOWOD · Rotadores + Hombros (score 70).' },
              { id: 'd-mob-6', name: 'Extensión Dorsal con Roller', reps: '3x15', detail: 'Paul Wade · Tórax (score 69).' },
              { id: 'd-mob-7', name: 'Rotación Tibial', reps: '20/lado', detail: 'Movilidad de rodilla.' },
              { id: 'd-mob-8', name: 'Rotación Dorsal', reps: '2x15/lado', detail: 'Cierre del protocolo.' },
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
              { id: 'd-nut-5', name: 'Objetivo del día', reps: 'CHECK', detail: '✓ ~1800 kcal  ✓ 170g proteína  ✓ 2.5L agua  ✗ Sin alcohol  ✓ Dormir 8h.' },
            ]
          },
        ]
      },
    ]
  },

]
