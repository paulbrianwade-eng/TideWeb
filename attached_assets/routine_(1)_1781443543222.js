// TIDE — Rutina semanal · estructura con 3 cards por día: GYM + FLEXIBILIDAD + NUTRICIÓN
// Perfil: 85.8kg · 183cm · 38 años · 24.5% grasa · Grasa visceral 14 → PRIORIDAD

export const week = [

  // ─── LUNES · PUSH · BENCH PRESS ────────────────────────────────────────────
  {
    id: 'lun', day: 'L', name: 'Lunes', type: 'bigg',
    title: 'Push · Bench Press', subtitle: 'Empuje horizontal + hip power',
    duration: 55,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
    intro: 'Bench press pesado como ancla. Bloque 1 de hip power enciende la cadena posterior antes del empuje.',
    cards: [
      {
        id: 'gym', label: 'Gym', emoji: '🏋️', duration: 55,
        blocks: [
          {
            type: 'warmup', title: 'Calentamiento', duration: 8,
            format: 'Activación torácica + empuje',
            exercises: [
              { id: 'l-w-1', name: 'Movilidad torácica + hombro', reps: '4 min', detail: 'Cat-cow, banded dislocates con elástico, rotaciones torácicas en cuadrupedia.' },
              { id: 'l-w-2', name: 'Activación general', reps: '2 rondas', detail: '10 push ups + 10 KB swing KB8 + 10 jumping jacks.' },
              { id: 'l-w-3', name: 'Aproximación al bench', reps: '2 sets', rest: '45"', detail: 'Barra vacía × 8 + 60% 1RM × 5.' },
            ]
          },
          {
            type: 'quality', title: 'Bloque 1 · Hip Power', duration: 7,
            format: "AMRAP 7' for quality · Tema: Hip Power",
            exercises: [
              { id: 'l-1-1', name: 'American Swing (KB 20)', reps: '8 reps', detail: 'KB hasta overhead. Extensión completa de cadera.' },
              { id: 'l-1-2', name: 'Box Jumps', reps: '5 reps', detail: 'Cajón. Caída suave, step down.' },
              { id: 'l-1-3', name: 'DKB Hang Clean (2x KB 12)', reps: '5 reps', detail: 'Desde bisagra, tracción explosiva. Codos altos.' },
              { id: 'l-1-4', name: 'Goblet Pulse Squat (KB 20)', reps: '10 reps', detail: 'Squat profundo, dos pulsos abajo, sube.' },
            ]
          },
          {
            type: 'strength', title: 'Bloque 2 · Bench Press', duration: 13,
            format: "AMRAP 13' · Objetivo 3-4 rondas",
            exercises: [
              { id: 'l-2-1', name: 'Barbell Bench Press', reps: '5 reps', detail: 'Carga ~75% 1RM. RPE 7-8. Barra baja al esternón, codos 45°.', target: '~50-55 kg' },
              { id: 'l-2-2', name: 'DKB Bent Over Row (2x KB 12)', reps: '8 reps', detail: 'Tronco ~45°, codos hacia cadera. Control excéntrico.' },
              { id: 'l-2-3', name: 'Soga (jump rope)', reps: '90"', detail: '⚠️ Reemplaza Machine 40%. Ritmo conversacional.' },
            ]
          },
          {
            type: 'metcon', title: 'Bloque 3 · Hybrid Metcon', duration: 12,
            format: 'Every 90" · 8 rondas',
            exercises: [
              { id: 'l-3-1', name: 'KB Floor Press (2x KB 12)', reps: '8 reps', detail: '⚠️ Reemplaza DDB chest press. En suelo, pausa 1" abajo.' },
              { id: 'l-3-2', name: 'Burpees Over The Bar', reps: '5 reps', detail: 'Barra en el suelo. Burpee + salto lateral.' },
              { id: 'l-3-3', name: 'Strict Pull Ups', reps: '5 reps', detail: 'Completo rango. Escala: TRX row vertical.' },
              { id: 'l-3-4', name: 'Mountain Climbers', reps: '30"', detail: 'Desde plank alto. Ritmo constante.' },
              { id: 'l-3-5', name: 'DKB Thruster (2x KB 12)', reps: '5 reps', detail: 'Squat + press overhead encadenado.' },
              { id: 'l-3-6', name: 'Skipping (soga)', reps: '45"', detail: 'Ritmo sostenido.' },
            ]
          },
          {
            type: 'finisher', title: 'Bloque 4 · Midline', duration: 7,
            format: 'Every 90" x 5 rondas · Rotar ejercicios',
            exercises: [
              { id: 'l-4-1', name: 'Hollow Hold', reps: '40"', detail: 'Lumbar pegada al suelo. Brazos y piernas extendidos.' },
              { id: 'l-4-2', name: 'Tuck Ups', reps: '15 reps', detail: 'Knees to chest desde hollow. Control en la bajada.' },
              { id: 'l-4-3', name: 'Plank Jack', reps: '30"', detail: 'Plank alto, piernas abren y cierran.' },
            ]
          },
        ]
      },
      {
        id: 'flex', label: 'Flexibilidad', emoji: '🧘', duration: 12,
        blocks: [
          {
            type: 'quality', title: 'Flexibilidad · Cadena Post + Overhead', duration: 12,
            format: 'GOWOD · 12 min · Prioridad: Cadena posterior (17) + Overhead (70)',
            exercises: [
              { id: 'l-mob-1', name: 'Banded Hamstring Stretch', reps: '90" / lado', detail: 'GOWOD · Isquiotibiales. Score 17 → CRÍTICO. Elástico anclado bajo, pierna estirada, tracción suave y sostenida.' },
              { id: 'l-mob-2', name: '90 To 90', reps: '2 min / lado', detail: 'GOWOD · Caderas + Glúteos (score 37). Sentado, ambas piernas en 90°. Rota lentamente.' },
              { id: 'l-mob-3', name: 'Banded Overhead Fixer', reps: '90"', detail: 'GOWOD · Pectorales + Hombros (score 70, bajando). Elástico desde arriba, brazos overhead, abrí el pecho.' },
              { id: 'l-mob-4', name: 'Rotación Dorsal (Paul Wade)', reps: '2 x 15 / lado', detail: 'Cuadrupedia, mano detrás de la cabeza. Codo hacia el techo sin mover la pelvis.' },
            ]
          },
        ]
      },
      {
        id: 'nut', label: 'Nutrición', emoji: '🥗', duration: 5,
        blocks: [
          {
            type: 'warmup', title: 'Nutrición · Día de Fuerza', duration: 5,
            format: '~2200 kcal · 170g proteína · Día BIGG',
            exercises: [
              { id: 'l-nut-1', name: 'Desayuno', reps: '~500 kcal', detail: '3 huevos + 2 claras revueltos · Avena 50g con banana · Café sin azúcar.' },
              { id: 'l-nut-2', name: 'Almuerzo', reps: '~650 kcal', detail: '180g pollo, pavo o atún · Arroz integral ½ taza · Ensalada grande + aceite de oliva.' },
              { id: 'l-nut-3', name: 'Merienda / Pre-entreno', reps: '~300 kcal', detail: 'Yogur griego natural 200g + fruta. O: 2 tostadas integrales + ½ palta + 1 huevo.' },
              { id: 'l-nut-4', name: 'Post-entreno', reps: '~350 kcal', detail: 'Batido: 1 scoop proteína + banana + leche descremada. O: 150g pollo + arroz.' },
              { id: 'l-nut-5', name: 'Cena', reps: '~450 kcal', detail: '150g salmón, merluza o carne magra · Verduras salteadas abundantes. Sin carbohidratos extra.' },
              { id: 'l-nut-6', name: 'Objetivo del día', reps: 'CHECK', detail: '✓ ~2200 kcal  ✓ 170g proteína  ✓ 2.5L agua  ✗ Sin alcohol  ✗ Sin ultraprocesados' },
            ]
          },
        ]
      },
    ]
  },

  // ─── MARTES · PULL · DEADLIFT + ROW ────────────────────────────────────────
  {
    id: 'mar', day: 'M', name: 'Martes', type: 'bigg',
    title: 'Pull · Deadlift + Row', subtitle: 'Cadena posterior + tirón',
    duration: 55,
    image: 'https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?w=800&q=80',
    intro: 'Deadlift pesado como ancla + bent over row como accesorio. Bloque 1 de pull prehab activa la espalda antes del levantamiento.',
    cards: [
      {
        id: 'gym', label: 'Gym', emoji: '🏋️', duration: 55,
        blocks: [
          {
            type: 'warmup', title: 'Calentamiento', duration: 8,
            format: 'Movilidad cadera + activación posterior',
            exercises: [
              { id: 'ma-w-1', name: 'Movilidad cadera + isquios', reps: '4 min', detail: "90/90, world's greatest, jefferson curls con barra vacía." },
              { id: 'ma-w-2', name: 'Activación posterior', reps: '2 sets', rest: '30"', detail: '10 glute bridge + 10 banded good morning + 10 KB swing KB8.' },
              { id: 'ma-w-3', name: 'Aproximación al deadlift', reps: '2 sets', rest: '60"', detail: 'Barra vacía × 8 + 50% 1RM × 5.' },
            ]
          },
          {
            type: 'quality', title: 'Bloque 1 · Pull Prehab', duration: 7,
            format: "AMRAP 7' for quality · Tema: Pull Prehab",
            exercises: [
              { id: 'ma-1-1', name: 'Scapular Pull Ups (TRX)', reps: '10 reps', detail: 'Brazo extendido, depresión escápula sin doblar codo. Activa serrato.' },
              { id: 'ma-1-2', name: 'Bird Dogs', reps: '8/8 reps', detail: 'Cuadrupedia. Brazo y pierna opuestos, columna neutra.' },
              { id: 'ma-1-3', name: 'DKB Dead Bug (2x KB 8)', reps: '8 reps', detail: 'KB overhead, pierna opuesta baja. Lumbar pegada al suelo.' },
              { id: 'ma-1-4', name: 'Front Step + Thoracic Rotation', reps: '6/6 reps', detail: 'Paso adelante, rota el tronco hacia la pierna delantera.' },
            ]
          },
          {
            type: 'strength', title: 'Bloque 2 · Deadlift', duration: 13,
            format: "AMRAP 13' · RPE 7 · No buscar PR",
            exercises: [
              { id: 'ma-2-1', name: 'Barbell Deadlift', reps: '5 reps', detail: 'Carga ~70% 1RM. Espalda neutra, cadera atrás.', target: '~55-60 kg' },
              { id: 'ma-2-2', name: 'Barbell Bent Over Row', reps: '8 reps', detail: 'Tronco ~45°, codos pegados al tronco.', target: '~35-40 kg' },
              { id: 'ma-2-3', name: 'Soga (jump rope)', reps: '90"', detail: '⚠️ Reemplaza Machine 40%. Recuperación activa.' },
            ]
          },
          {
            type: 'metcon', title: 'Bloque 3 · Hybrid Metcon', duration: 12,
            format: 'Complete 3 rounds · Anotar tiempo total',
            exercises: [
              { id: 'ma-3-1', name: 'Barbell Romanian Deadlift', reps: '10 reps', detail: 'Carga moderada. Bisagra, isquios al límite. Excéntrico 2".', target: '~40 kg' },
              { id: 'ma-3-2', name: 'Jumping Pull Ups', reps: '10 reps', detail: 'Salto asistido, excéntrico controlado 3".' },
              { id: 'ma-3-3', name: 'Russian Swing (KB 20)', reps: '15 reps', detail: 'KB hasta pecho. Explosión de cadera.' },
              { id: 'ma-3-4', name: 'DKB Box Step Ups (2x KB 8)', reps: '10/10 reps', detail: 'Cajón. Sube, rodilla arriba. Alterna piernas.' },
              { id: 'ma-3-5', name: 'Burpees', reps: '8 reps', detail: 'Pecho al suelo, salto con palmada.' },
              { id: 'ma-3-6', name: 'Sprawl to Box Jump', reps: '6 reps', detail: 'Caída a plank, regresa de pie, box jump inmediato.' },
            ]
          },
          {
            type: 'finisher', title: 'Bloque 4 · Midline', duration: 6,
            format: "AMRAP 6' · 4 ejercicios",
            exercises: [
              { id: 'ma-4-1', name: 'Reverse Crunches', reps: '15 reps', detail: 'Piernas juntas, sube cadera del suelo.' },
              { id: 'ma-4-2', name: 'Copenhagen Plank', reps: '20"/lado', detail: 'Pie en cajón, plank lateral. Cadera arriba.' },
              { id: 'ma-4-3', name: 'Back Extensions', reps: '12 reps', detail: 'En suelo boca abajo. Eleva tronco controlado.' },
              { id: 'ma-4-4', name: 'Leg Circles', reps: '10/dirección', detail: 'Piernas juntas y rectas. Círculos amplios. Lumbar fija.' },
            ]
          },
        ]
      },
      {
        id: 'flex', label: 'Flexibilidad', emoji: '🧘', duration: 12,
        blocks: [
          {
            type: 'quality', title: 'Flexibilidad · Caderas + Posterior', duration: 12,
            format: 'GOWOD · 12 min · Prioridad: Caderas (37) + Cadena posterior (17)',
            exercises: [
              { id: 'ma-mob-1', name: '90 To 90 Hip External Rotations', reps: '2 min / lado', detail: 'GOWOD · Caderas + Glúteos. En 90/90, lleva rodilla delantera hacia el pecho rotando hacia afuera.' },
              { id: 'ma-mob-2', name: 'Banded Hip Opener', reps: '90" / lado', detail: 'GOWOD · Caderas + Aductores + Glúteos. Elástico en cadera, abre lateralmente.' },
              { id: 'ma-mob-3', name: 'Active Cobra', reps: '60"', detail: 'GOWOD · Lumbares + Trapecios. Boca abajo, empuja el suelo, eleva tronco activamente.' },
              { id: 'ma-mob-4', name: 'Bent Over Locked Rotation', reps: '60" / lado', detail: 'GOWOD · Caderas + Lumbares. Tronco inclinado, rotación desde la cadera.' },
            ]
          },
        ]
      },
      {
        id: 'nut', label: 'Nutrición', emoji: '🥗', duration: 5,
        blocks: [
          {
            type: 'warmup', title: 'Nutrición · Día de Fuerza', duration: 5,
            format: '~2200 kcal · 170g proteína · Día BIGG',
            exercises: [
              { id: 'ma-nut-1', name: 'Desayuno', reps: '~500 kcal', detail: '3 huevos + 2 claras · Avena 50g con banana · Café sin azúcar.' },
              { id: 'ma-nut-2', name: 'Almuerzo', reps: '~650 kcal', detail: '180g pollo, pavo o atún · Arroz integral ½ taza · Ensalada + aceite de oliva.' },
              { id: 'ma-nut-3', name: 'Merienda / Pre-entreno', reps: '~300 kcal', detail: 'Yogur griego 200g + fruta. O: 2 tostadas integrales + ½ palta + huevo.' },
              { id: 'ma-nut-4', name: 'Post-entreno', reps: '~350 kcal', detail: 'Batido proteína + banana + leche. O: 150g pollo + arroz.' },
              { id: 'ma-nut-5', name: 'Cena', reps: '~450 kcal', detail: '150g salmón o merluza · Verduras salteadas (preferir pescado — impacta en grasa visceral).' },
              { id: 'ma-nut-6', name: 'Objetivo del día', reps: 'CHECK', detail: '✓ ~2200 kcal  ✓ 170g proteína  ✓ 2.5L agua  ✗ Sin alcohol  ✗ Sin ultraprocesados' },
            ]
          },
        ]
      },
    ]
  },

  // ─── MIÉRCOLES · LEGS · SQUAT + HIP THRUST ─────────────────────────────────
  {
    id: 'mie', day: 'M', name: 'Miércoles', type: 'bigg',
    title: 'Legs · Squat + Hip Thrust', subtitle: 'Cuadriceps + gluteo + posterior',
    duration: 55,
    image: 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=800&q=80',
    intro: 'Día de piernas completo. Back squat + hip thrust. Post-gym: protocolo GOWOD de caderas — el más importante de la semana (score 37).',
    cards: [
      {
        id: 'gym', label: 'Gym', emoji: '🏋️', duration: 55,
        blocks: [
          {
            type: 'warmup', title: 'Calentamiento', duration: 8,
            format: 'Activación glúteo + movilidad cadera/tobillo',
            exercises: [
              { id: 'mi-w-1', name: 'Movilidad cadera + tobillo', reps: '4 min', detail: "90/90, world's greatest, ankle rocks, pigeon stretch." },
              { id: 'mi-w-2', name: 'Activación glúteo', reps: '2 sets', rest: '30"', detail: '15 banded side steps + 15 glute bridge + 10 jumping jacks.' },
              { id: 'mi-w-3', name: 'Aproximación squat', reps: '2 sets', rest: '45"', detail: 'Back squat barra vacía x 8 + 60% 1RM x 5.' },
            ]
          },
          {
            type: 'quality', title: 'Bloque 1 · Lower Prehab', duration: 7,
            format: "AMRAP 7' for quality · Tema: Lower Prehab",
            exercises: [
              { id: 'mi-1-1', name: 'Banded Side Steps', reps: '15/lado', detail: 'Elástico en tobillos. Posición de squat, pasos laterales.' },
              { id: 'mi-1-2', name: 'Single-Leg Glute Bridge', reps: '10/lado', detail: 'Una pierna extendida, sube cadera. Pausa 1" arriba.' },
              { id: 'mi-1-3', name: 'DKB Cossack Squat (2x KB 8)', reps: '6/lado', detail: 'Sentadilla lateral profunda. KB frente al pecho.' },
              { id: 'mi-1-4', name: 'Banded Squat', reps: '15 reps', detail: 'Elástico en rodillas. Empuja rodillas afuera. Squat lento.' },
            ]
          },
          {
            type: 'strength', title: 'Bloque 2 · Back Squat', duration: 13,
            format: "AMRAP 13' · Objetivo 3-4 rondas",
            exercises: [
              { id: 'mi-2-1', name: 'Barbell Back Squat', reps: '6 reps', detail: 'Carga ~72% 1RM. RPE 7-8. Profundidad completa.', target: '~45-50 kg' },
              { id: 'mi-2-2', name: 'DKB Front Rack Lunges (2x KB 12)', reps: '8/8 reps', detail: '⚠️ Reemplaza DB pesadas. KB en rack, paso largo.' },
              { id: 'mi-2-3', name: 'Soga (jump rope)', reps: '90"', detail: '⚠️ Reemplaza Machine 40%.' },
            ]
          },
          {
            type: 'metcon', title: 'Bloque 3 · Hybrid Metcon', duration: 13,
            format: 'Every 90" · 8 rondas',
            exercises: [
              { id: 'mi-3-1', name: 'Barbell Hip Thrust', reps: '8 reps', detail: 'Espalda alta en banco. Pausa 1" arriba.', target: '~50-60 kg' },
              { id: 'mi-3-2', name: 'Jumping Lunges', reps: '10 reps (5/lado)', detail: 'Salto con cambio de pierna. Aterrizaje suave.' },
              { id: 'mi-3-3', name: 'SKB Single-Leg Deadlift (KB 12)', reps: '6/lado', detail: 'Bisagra unilateral. Control del balance.' },
              { id: 'mi-3-4', name: 'Wall Ball (pelota 10 kg)', reps: '10 reps', detail: 'Squat profundo + lanzar pelota a pared ~3m.' },
              { id: 'mi-3-5', name: 'Lateral Bounds / Skater Jumps', reps: '10 reps (5/lado)', detail: 'Salto lateral, caes a un pie. Mantene 1".' },
              { id: 'mi-3-6', name: 'MB Rotational Slam (pelota 10 kg)', reps: '8 reps', detail: 'Pelota overhead, gira y slam lateral. 4/lado.' },
            ]
          },
          {
            type: 'finisher', title: 'Bloque 4 · Midline', duration: 6,
            format: 'Complete 1 a 10 · 2 ejercicios',
            exercises: [
              { id: 'mi-4-1', name: 'Tuck Ups', reps: '1→10 reps', detail: 'Knees to chest desde hollow. Una rep más por ronda.' },
              { id: 'mi-4-2', name: 'Sit Ups', reps: '1→10 reps', detail: 'Completos, pies libres. Misma cantidad que Tuck Ups.' },
            ]
          },
        ]
      },
      {
        id: 'flex', label: 'Flexibilidad', emoji: '🧘', duration: 14,
        blocks: [
          {
            type: 'quality', title: 'Flexibilidad · Caderas Profundo', duration: 14,
            format: 'GOWOD · 14 min · Sesión más importante para Caderas (37)',
            exercises: [
              { id: 'mi-mob-1', name: 'Banded Knight Stretch', reps: '2 min / lado', detail: 'GOWOD · Caderas + Cuádriceps. En lunge bajo con elástico en cadera trasera. Empuja hacia adelante.' },
              { id: 'mi-mob-2', name: 'Banded Pigeon', reps: '2 min / lado', detail: 'GOWOD · Glúteos + Caderas. Posición de paloma con elástico. Empuja cadera al suelo.' },
              { id: 'mi-mob-3', name: '0 To 90', reps: '2 min / lado', detail: 'GOWOD · Caderas + Glúteos. Movimiento activo de 0° a 90° de flexión.' },
              { id: 'mi-mob-4', name: '90 To 90 Rotation', reps: '90" / lado', detail: 'GOWOD · Caderas. En 90/90, rota el tronco hacia la pierna delantera.' },
              { id: 'mi-mob-5', name: 'Banded Squat On Wall', reps: '90"', detail: 'GOWOD · Caderas + Aductores. Contra la pared con elástico en rodillas. Profundidad máxima.' },
            ]
          },
        ]
      },
      {
        id: 'nut', label: 'Nutrición', emoji: '🥗', duration: 5,
        blocks: [
          {
            type: 'warmup', title: 'Nutrición · Día de Piernas', duration: 5,
            format: '~2200 kcal · 170g proteína · Día BIGG',
            exercises: [
              { id: 'mi-nut-1', name: 'Desayuno', reps: '~500 kcal', detail: '3 huevos + 2 claras · Avena 50g + banana · Café sin azúcar.' },
              { id: 'mi-nut-2', name: 'Almuerzo', reps: '~700 kcal', detail: '200g pollo · Arroz integral ½ taza + lentejas ¼ taza · Ensalada. Piernas necesitan carbohidratos.' },
              { id: 'mi-nut-3', name: 'Merienda / Pre-entreno', reps: '~300 kcal', detail: 'Yogur griego 200g + banana + miel (1 cdita). Carbos rápidos antes del squat.' },
              { id: 'mi-nut-4', name: 'Post-entreno', reps: '~400 kcal', detail: 'Batido proteína + banana + leche. Recuperación rápida.' },
              { id: 'mi-nut-5', name: 'Cena', reps: '~400 kcal', detail: '150g carne magra o pollo · Vegetales asados abundantes. Sin arroz adicional.' },
              { id: 'mi-nut-6', name: 'Objetivo del día', reps: 'CHECK', detail: '✓ ~2200 kcal  ✓ 170g proteína  ✓ 2.5L agua  ✗ Sin alcohol  ✗ Sin ultraprocesados' },
            ]
          },
        ]
      },
    ]
  },

  // ─── JUEVES · RUN · INTERVALOS ─────────────────────────────────────────────
  {
    id: 'jue', day: 'J', name: 'Jueves', type: 'run',
    title: 'Intervalos VO2max', subtitle: 'Cardio intenso · EPOC alto',
    duration: 38,
    image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&q=80',
    intro: 'Cardio intenso sin cansar el tren superior. Post-run: movilidad de cadena posterior y tórax.',
    cards: [
      {
        id: 'gym', label: 'Run', emoji: '🏃', duration: 38,
        blocks: [
          {
            type: 'warmup', title: 'Estructura de la sesión', duration: 38,
            exercises: [
              { id: 'j-w-1', name: 'Calentamiento', reps: '10 min', detail: "Caminata 2' → trote suave subiendo gradual." },
              { id: 'j-w-2', name: 'Drills (opcional)', reps: '3 min', detail: 'Skipping, talones glúteos, zancadas largas.' },
              { id: 'j-w-3', name: 'Bloque principal', reps: '16 min', detail: 'Elegí una de las dos opciones.' },
              { id: 'j-w-4', name: 'Vuelta a la calma', reps: '8 min', detail: 'Trote suave Z1. Pulso bajo 120 ppm.' },
            ]
          },
          {
            type: 'metcon', title: 'Opción A · 4x4', duration: 16,
            format: 'VO2max clásico',
            exercises: [
              { id: 'j-2-1', name: 'Trabajo: 4 min x 4', reps: '85-90% FCM', detail: 'Ritmo exigente sin reventar.' },
              { id: 'j-2-2', name: 'Recuperación: 2 min x 4', reps: 'Trote suave', detail: 'Pulso baja a Z2 antes de la siguiente serie.' },
            ]
          },
          {
            type: 'metcon', title: 'Opción B · 30/30', duration: 16,
            format: 'Más explosivo',
            exercises: [
              { id: 'j-3-1', name: 'Trabajo: 30" x 16', reps: '~90% FCM', detail: 'Casi sprint controlado.' },
              { id: 'j-3-2', name: 'Recuperación: 30" x 16', reps: 'Trote activo', detail: 'No caminar. Respiración nasal si podés.' },
            ]
          },
          {
            type: 'quality', title: 'Cuándo usar cada opción', duration: 0,
            exercises: [
              { id: 'j-4-1', name: 'Si llegás fresco', detail: 'Opción A (4x4) → mayor estímulo VO2max.' },
              { id: 'j-4-2', name: 'Si llegás cansado', detail: 'Opción B o reducí a 12 intervalos.' },
              { id: 'j-4-3', name: 'Mañana hay Shoulder Press', detail: 'Cualquiera. El tren superior no se compromete.' },
            ]
          },
        ]
      },
      {
        id: 'flex', label: 'Flexibilidad', emoji: '🧘', duration: 12,
        blocks: [
          {
            type: 'quality', title: 'Flexibilidad · Cadena Post + Tórax', duration: 12,
            format: 'GOWOD + Paul Wade · 12 min · Post-run — músculo caliente = máxima efectividad',
            exercises: [
              { id: 'j-mob-1', name: 'Banded Hamstring Stretch', reps: '2 min / lado', detail: 'GOWOD · Isquiotibiales. Score 17 → CRÍTICO. Post-run es el mejor momento del día para ganar rango.' },
              { id: 'j-mob-2', name: 'Active Butterfly', reps: '2 min', detail: 'GOWOD · Aductores + Caderas. Plantas juntas, rodillas se abren activamente hacia el suelo.' },
              { id: 'j-mob-3', name: 'Extensión Dorsal con Roller', reps: '3 x 15 reps', detail: 'Paul Wade · Tórax (score 69, mejorando). Roller en zona dorsal. Sin roller: toalla enrollada.' },
              { id: 'j-mob-4', name: 'Banded Squat On Wall', reps: '90"', detail: 'GOWOD · Caderas + Aductores. Sentado contra pared con elástico en rodillas.' },
            ]
          },
        ]
      },
      {
        id: 'nut', label: 'Nutrición', emoji: '🥗', duration: 5,
        blocks: [
          {
            type: 'warmup', title: 'Nutrición · Día de Cardio', duration: 5,
            format: '~2000 kcal · 170g proteína · Día RUN',
            exercises: [
              { id: 'j-nut-1', name: 'Desayuno', reps: '~450 kcal', detail: '3 huevos + 1 clara · Avena 40g + fruta · Café. Levemente más liviano.' },
              { id: 'j-nut-2', name: 'Almuerzo', reps: '~600 kcal', detail: '180g pollo o atún · Arroz integral ½ taza · Ensalada + aceite de oliva.' },
              { id: 'j-nut-3', name: 'Merienda / Pre-run', reps: '~250 kcal', detail: '1 banana + yogur griego 150g. Evitar grasas antes del cardio.' },
              { id: 'j-nut-4', name: 'Post-run', reps: '~300 kcal', detail: 'Batido proteína + fruta. O: yogur griego 200g + granola sin azúcar 30g.' },
              { id: 'j-nut-5', name: 'Cena', reps: '~400 kcal', detail: '150-180g salmón o merluza · Vegetales al vapor. Sin carbohidratos extra. Grasa visceral responde al cardio + déficit.' },
              { id: 'j-nut-6', name: 'Objetivo del día', reps: 'CHECK', detail: '✓ ~2000 kcal  ✓ 170g proteína  ✓ 3L agua (cardio)  ✗ Sin alcohol  ✗ Sin ultraprocesados' },
            ]
          },
        ]
      },
    ]
  },

  // ─── VIERNES · PUSH · SHOULDER PRESS ───────────────────────────────────────
  {
    id: 'vie', day: 'V', name: 'Viernes', type: 'bigg',
    title: 'Push · Shoulder Press', subtitle: 'Overhead strength + KB metcon',
    duration: 55,
    image: 'https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?w=800&q=80',
    intro: 'Empuje vertical pesado. Overhead está en 70 y bajando (-8%) — la flexibilidad de hoy es especialmente importante.',
    cards: [
      {
        id: 'gym', label: 'Gym', emoji: '🏋️', duration: 55,
        blocks: [
          {
            type: 'warmup', title: 'Calentamiento', duration: 8,
            format: 'Activación hombro + movilidad torácica',
            exercises: [
              { id: 'v-w-1', name: 'Movilidad torácica + hombro', reps: '4 min', detail: 'Rotaciones torácicas, banded dislocates, lat stretch.' },
              { id: 'v-w-2', name: 'Activación general', reps: '2 rondas', detail: '10 push ups + 10 KB swing KB8 + 10 jumping jacks.' },
              { id: 'v-w-3', name: 'Aproximación shoulder press', reps: '2 sets', rest: '45"', detail: 'Barra vacía x 8 + 60% 1RM x 5.' },
            ]
          },
          {
            type: 'quality', title: 'Bloque 1 · Push Control', duration: 7,
            format: "AMRAP 7' for quality · Tema: Push Control",
            exercises: [
              { id: 'v-1-1', name: 'KB Kneeling Halo (KB 12)', reps: '6/6 reps', detail: 'Arrodillado, círculo lento alrededor de la cabeza.' },
              { id: 'v-1-2', name: 'Push Up Hold', reps: '5 reps x 3"', detail: 'Baja lento 3", pausa en el fondo, empuja.' },
              { id: 'v-1-3', name: 'DKB Z-Press (2x KB 8)', reps: '5 reps', detail: 'Sentado en suelo, piernas extendidas. Prensa estricta.' },
              { id: 'v-1-4', name: 'Scapular Pull Ups (TRX)', reps: '8 reps', detail: 'Activa escápulas antes del press.' },
            ]
          },
          {
            type: 'strength', title: 'Bloque 2 · Shoulder Press', duration: 13,
            format: "AMRAP 13' · Objetivo 3-4 rondas",
            exercises: [
              { id: 'v-2-1', name: 'Barbell Shoulder Press', reps: '5 reps', detail: 'Carga ~70% 1RM. Prensa estricta, sin arco lumbar.', target: '~40-45 kg' },
              { id: 'v-2-2', name: 'DKB Z-Press (2x KB 12)', reps: '8 reps', detail: '⚠️ Reemplaza DDB pesadas. Prensa vertical en suelo.', target: '2x KB 12' },
              { id: 'v-2-3', name: 'Soga (jump rope)', reps: '90"', detail: '⚠️ Reemplaza Machine 40%.' },
            ]
          },
          {
            type: 'metcon', title: 'Bloque 3 · Hybrid Metcon', duration: 13,
            format: "AMRAP 13' · 7 movimientos",
            exercises: [
              { id: 'v-3-1', name: 'Barbell Push Press', reps: '5 reps', detail: 'Asistencia de piernas, bloqueo arriba.', target: '~35-40 kg' },
              { id: 'v-3-2', name: 'Box Jumps', reps: '8 reps', detail: 'Cajón. Rebote suave o step down.' },
              { id: 'v-3-3', name: 'TRX Row (estricto)', reps: '10 reps', detail: 'Pull horizontal. Compensación del empuje.' },
              { id: 'v-3-4', name: 'Burpee Broad Jump', reps: '5 reps', detail: 'Pecho al suelo + salto hacia adelante.' },
              { id: 'v-3-5', name: 'American Swing (KB 20)', reps: '12 reps', detail: 'KB hasta overhead. Extensión completa.' },
              { id: 'v-3-6', name: 'Jumping Curtsy Lunges', reps: '10 reps (5/lado)', detail: 'Estocada cruzada con salto de cambio.' },
              { id: 'v-3-7', name: 'Pogo Jumps', reps: '20 reps', detail: 'Saltos rápidos en tobillo. Mínima flexión de rodilla.' },
            ]
          },
          {
            type: 'finisher', title: 'Bloque 4 · Midline', duration: 7,
            format: 'Every 60" x 7 rondas · Rotar 4 ejercicios',
            exercises: [
              { id: 'v-4-1', name: 'Hollow Hold', reps: '40"', detail: 'Lumbar pegada. Brazos y piernas a 45°.' },
              { id: 'v-4-2', name: 'V-Sit Ups', reps: '15 reps', detail: 'Sube tronco y piernas al mismo tiempo.' },
              { id: 'v-4-3', name: 'Leg Levers', reps: '12 reps', detail: 'Piernas rectas, suben y bajan lento.' },
              { id: 'v-4-4', name: 'Plank Shoulder Taps', reps: '20 reps (10/lado)', detail: 'Plank alto, toca hombro contrario.' },
            ]
          },
        ]
      },
      {
        id: 'flex', label: 'Flexibilidad', emoji: '🧘', duration: 12,
        blocks: [
          {
            type: 'quality', title: 'Flexibilidad · Hombros + Tórax', duration: 12,
            format: 'GOWOD + Paul Wade · 12 min · Overhead 70 y bajando → invertir tendencia',
            exercises: [
              { id: 'v-mob-1', name: 'Banded Overhead Fixer', reps: '90"', detail: 'GOWOD · Pectorales + Hombros. Elástico desde arriba, brazos overhead. Frena el hundimiento escapular.' },
              { id: 'v-mob-2', name: 'Banded Lat Stretch', reps: '90" / lado', detail: 'GOWOD · Rotadores + Hombros. En lunge bajo, elástico en la muñeca. Estira el dorsal y rotadores externos.' },
              { id: 'v-mob-3', name: 'Banded Shoulder Strap', reps: '90" / lado', detail: 'GOWOD · Hombros + Pectorales. Elástico detrás del cuerpo, hombro en rotación externa.' },
              { id: 'v-mob-4', name: 'Rotación Dorsal (Paul Wade)', reps: '2 x 15 / lado', detail: 'Cuadrupedia, codo hacia el techo. Tórax mejorando (+12%) — mantener el progreso.' },
            ]
          },
        ]
      },
      {
        id: 'nut', label: 'Nutrición', emoji: '🥗', duration: 5,
        blocks: [
          {
            type: 'warmup', title: 'Nutrición · Día de Fuerza', duration: 5,
            format: '~2200 kcal · 170g proteína · Día BIGG',
            exercises: [
              { id: 'v-nut-1', name: 'Desayuno', reps: '~500 kcal', detail: '3 huevos + 2 claras · Avena 50g + fruta · Café sin azúcar.' },
              { id: 'v-nut-2', name: 'Almuerzo', reps: '~650 kcal', detail: '180g pollo o carne magra · Papa mediana o arroz · Ensalada + aceite oliva.' },
              { id: 'v-nut-3', name: 'Merienda', reps: '~300 kcal', detail: 'Yogur griego 200g + fruta. O: 2 tostadas + palta.' },
              { id: 'v-nut-4', name: 'Post-entreno', reps: '~350 kcal', detail: 'Batido proteína + banana + leche. O: 150g pollo + arroz.' },
              { id: 'v-nut-5', name: 'Cena', reps: '~400 kcal', detail: '150g pescado o pollo · Vegetales salteados · Aceite de oliva.' },
              { id: 'v-nut-6', name: 'Objetivo del día', reps: 'CHECK', detail: '✓ ~2200 kcal  ✓ 170g proteína  ✓ 2.5L agua  ✗ Sin alcohol  ✗ Sin ultraprocesados' },
            ]
          },
        ]
      },
    ]
  },

  // ─── SÁBADO · HYROX-STYLE ──────────────────────────────────────────────────
  {
    id: 'sab', day: 'S', name: 'Sabado', type: 'bigg',
    title: 'Hyrox-style', subtitle: 'Hibrido completo · Dia estrella',
    duration: 55,
    image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&q=80',
    intro: 'La sesión más completa. Front squat + metcon Hyrox largo. Post-gym: protocolo full-body de recuperación.',
    cards: [
      {
        id: 'gym', label: 'Gym', emoji: '🏋️', duration: 55,
        blocks: [
          {
            type: 'warmup', title: 'Calentamiento', duration: 8,
            format: 'Activación full body + específico front squat',
            exercises: [
              { id: 's-w-1', name: 'Movilidad general', reps: '4 min', detail: "Cadera, hombro, columna torácica. World's greatest x 5/lado." },
              { id: 's-w-2', name: 'Activación', reps: '2 rondas', detail: '10 air squats + 10 push ups + 10 KB swing KB8 + 5 burpees.' },
              { id: 's-w-3', name: 'Específico front squat', reps: '2 sets', rest: '30"', detail: 'Front squat barra vacía x 5 + hang power clean x 5.' },
            ]
          },
          {
            type: 'quality', title: 'Bloque 1 · Back Power', duration: 7,
            format: "AMRAP 7' for quality · Tema: Back Power",
            exercises: [
              { id: 's-1-1', name: 'Russian Swing (KB 20)', reps: '8 reps', detail: 'KB hasta pecho. Explosión de cadera pura.' },
              { id: 's-1-2', name: 'DKB Bent Over Row (2x KB 12)', reps: '6 reps', detail: 'Tronco horizontal, codos altos. Activación dorsal.' },
              { id: 's-1-3', name: 'SKB Single-Arm Overhead Carry (KB 20)', reps: '20 pasos/lado', detail: 'KB overhead. Estabilidad hombro y antirotación de core.' },
              { id: 's-1-4', name: 'Walkouts', reps: '4 reps', detail: 'Desde de pie, manos al suelo, camina a plank y vuelve.' },
            ]
          },
          {
            type: 'strength', title: 'Bloque 2 · Front Squat', duration: 12,
            format: "AMRAP 12' · Objetivo 3 rondas",
            exercises: [
              { id: 's-2-1', name: 'Barbell Front Squat', reps: '6 reps', detail: 'Codos altos, tronco vertical. RPE 7.', target: '~40-45 kg' },
              { id: 's-2-2', name: 'Strict Chin Ups', reps: '6 reps', detail: 'Agarre supino. Completo rango. Escala: TRX vertical.' },
              { id: 's-2-3', name: 'Soga (jump rope)', reps: '90"', detail: '⚠️ Reemplaza Machine 40%.' },
            ]
          },
          {
            type: 'metcon', title: 'Bloque 3 · Long Metcon · Hyrox', duration: 13,
            format: "AMRAP 13' · Objetivo 1-2 rondas · 8 movimientos",
            exercises: [
              { id: 's-3-1', name: 'Barbell Hang Power Clean', reps: '5 reps', detail: 'Explosivo desde encima de rodilla.', target: '~45 kg' },
              { id: 's-3-2', name: 'DKB Front Rack March (2x KB 12)', reps: '20 pasos', detail: 'Carry en rack, pasos altos. Simula farmer carry Hyrox.' },
              { id: 's-3-3', name: 'Burpee Box Jump', reps: '8 reps', detail: 'Burpee completo + box jump encadenado.' },
              { id: 's-3-4', name: 'Goblet Thrusters (KB 20)', reps: '8 reps', detail: 'Squat profundo + press overhead encadenado.' },
              { id: 's-3-5', name: 'Band-Assisted Pull Ups', reps: '8 reps', detail: 'Elástico en barra del rack. Chin above bar.' },
              { id: 's-3-6', name: 'MB Devil Press (pelota 5 kg)', reps: '6 reps', detail: '⚠️ Pelota en lugar de DDB. Burpee + ground to overhead.' },
              { id: 's-3-7', name: 'DKB Farmer March (2x KB 20)', reps: '20 pasos', detail: 'Máxima carga. Simula Farmer Carry Hyrox.' },
              { id: 's-3-8', name: 'Jumping Squats', reps: '12 reps', detail: 'Sin peso. Máxima explosión. Aterrizaje suave.' },
            ]
          },
          {
            type: 'finisher', title: 'Bloque 4 · Midline', duration: 8,
            format: '45" ON / 15" OFF · 2 rondas · 4 ejercicios',
            exercises: [
              { id: 's-4-1', name: 'Zombie Sit Ups', reps: '45"', detail: 'Desde suelo, brazos overhead, sube sin inercia.' },
              { id: 's-4-2', name: 'Heel Touches', reps: '45"', detail: 'Crunch lateral alternado tocando talones.' },
              { id: 's-4-3', name: 'Scissor Kicks', reps: '45"', detail: 'Piernas extendidas, movimiento en tijera. Lumbar pegada.' },
              { id: 's-4-4', name: 'Dead Bug Progressions', reps: '45"', detail: 'Brazo y pierna opuestos, lentos. Lumbar neutral.' },
            ]
          },
        ]
      },
      {
        id: 'flex', label: 'Flexibilidad', emoji: '🧘', duration: 13,
        blocks: [
          {
            type: 'quality', title: 'Flexibilidad · Full Body Recovery', duration: 13,
            format: 'GOWOD · 13 min · Post-gym · Prepara el cuerpo para el descanso del domingo',
            exercises: [
              { id: 's-mob-1', name: 'Banded Reverse T Hip Opener', reps: '2 min / lado', detail: 'GOWOD · Caderas + Pectorales + Glúteos + Lumbares. En lunge, elástico jalando cadera. Apertura total.' },
              { id: 's-mob-2', name: '90 To 90 Hip Internal Rotations', reps: '2 min / lado', detail: 'GOWOD · Caderas + Glúteos. Desde 90/90, lleva rodilla trasera al suelo. Rotación interna.' },
              { id: 's-mob-3', name: 'Banded Hip Opener', reps: '90" / lado', detail: 'GOWOD · Caderas + Aductores. Elástico en cadera. Zona más crítica del perfil (score 37).' },
              { id: 's-mob-4', name: 'Banded Hamstring Stretch', reps: '90" / lado', detail: 'GOWOD · Isquiotibiales. Score 17 → siempre presente. Post-Hyrox el músculo está caliente.' },
              { id: 's-mob-5', name: 'Active Cobra', reps: '60"', detail: 'GOWOD · Lumbares + Trapecios. Cierre de sesión. Descomprime la columna.' },
            ]
          },
        ]
      },
      {
        id: 'nut', label: 'Nutrición', emoji: '🥗', duration: 5,
        blocks: [
          {
            type: 'warmup', title: 'Nutrición · Día Hyrox', duration: 5,
            format: '~2300 kcal · 170g proteína · Día más largo',
            exercises: [
              { id: 's-nut-1', name: 'Desayuno', reps: '~550 kcal', detail: '3 huevos + 2 claras · Avena 60g + banana + miel (1 cdita) · Café. Sesión más larga: más combustible.' },
              { id: 's-nut-2', name: 'Almuerzo', reps: '~700 kcal', detail: '200g pollo o carne · Arroz ½ taza + papa mediana · Ensalada abundante.' },
              { id: 's-nut-3', name: 'Merienda / Pre-entreno', reps: '~350 kcal', detail: '2 tostadas integrales + 2 huevos + 1 banana. 60-90 min antes del Hyrox.' },
              { id: 's-nut-4', name: 'Post-entreno', reps: '~400 kcal', detail: 'Batido proteína + banana + avena 30g + leche. Recuperación tras el metcon más largo.' },
              { id: 's-nut-5', name: 'Cena', reps: '~350 kcal', detail: '150g salmón o pollo · Vegetales salteados · Palta (grasas buenas para recuperación nocturna).' },
              { id: 's-nut-6', name: 'Objetivo del día', reps: 'CHECK', detail: '✓ ~2300 kcal  ✓ 170g proteína  ✓ 3L agua  ✗ Sin alcohol  ✗ Sin ultraprocesados. Dormí 8h → mañana descansás.' },
            ]
          },
        ]
      },
    ]
  },

  // ─── DOMINGO · DESCANSO ────────────────────────────────────────────────────
  {
    id: 'dom', day: 'D', name: 'Domingo', type: 'rest',
    title: 'Descanso + Movilidad', subtitle: 'Recuperación total · GOWOD completo',
    duration: 45,
    image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80',
    intro: 'Sin gym. El domingo es el día más importante para la movilidad — protocolo GOWOD largo de 20 min.',
    cards: [
      {
        id: 'flex', label: 'Flexibilidad', emoji: '🧘', duration: 20,
        blocks: [
          {
            type: 'quality', title: 'Recuperación activa', duration: 5,
            format: 'Opcional · 20-30 min suave',
            exercises: [
              { id: 'd-1-1', name: 'Caminata al aire libre', reps: '20-30 min', detail: 'Ritmo cómodo. Sol si es posible. Z1 puro.' },
              { id: 'd-1-2', name: 'Respiración diafragmática', reps: '5 min', detail: 'Acostado, inhala 4", sostiene 2", exhala 6". Activa el sistema parasimpático.' },
            ]
          },
          {
            type: 'quality', title: 'Protocolo GOWOD Completo', duration: 20,
            format: 'GOWOD + Paul Wade · 20 min · Todas las zonas',
            exercises: [
              { id: 'd-mob-1', name: '90 To 90', reps: '2 min / lado', detail: 'GOWOD · Caderas (score 37). Inicio del protocolo. Sentado, ambas piernas en 90°.' },
              { id: 'd-mob-2', name: 'Banded Hamstring Stretch', reps: '2 min / lado', detail: 'GOWOD · Isquiotibiales (score 17). El más importante. Tomá el tiempo completo.' },
              { id: 'd-mob-3', name: 'Banded Pigeon', reps: '2 min / lado', detail: 'GOWOD · Glúteos + Caderas. Libera el piriforme y la cápsula posterior.' },
              { id: 'd-mob-4', name: 'Banded T Hip Opener', reps: '2 min / lado', detail: 'GOWOD · Caderas + Pectorales + Glúteos + Lumbares. En lunge con rotación.' },
              { id: 'd-mob-5', name: 'Active Butterfly', reps: '2 min', detail: 'GOWOD · Aductores + Caderas. Plantas juntas, rodillas se abren activamente.' },
              { id: 'd-mob-6', name: 'Banded Lat Stretch', reps: '90" / lado', detail: 'GOWOD · Rotadores + Hombros. Score 70 bajando → trabajo semanal obligatorio.' },
              { id: 'd-mob-7', name: 'Extensión Dorsal con Roller', reps: '3 x 15 reps', detail: 'Paul Wade · Tórax (+12%, mejorando). Mantené el progreso.' },
              { id: 'd-mob-8', name: 'Rotación Dorsal (Paul Wade)', reps: '2 x 15 / lado', detail: 'Cierre del protocolo. Respira profundo en cada rotación.' },
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
              { id: 'd-nut-1', name: 'Desayuno', reps: '~450 kcal', detail: '3 huevos + 2 claras · 1 tostada integral + palta · Café sin azúcar. Sin avena hoy.' },
              { id: 'd-nut-2', name: 'Almuerzo', reps: '~550 kcal', detail: '200g salmón o caballa (omega-3 reduce inflamación) · Vegetales asados abundantes. Sin arroz ni papa.' },
              { id: 'd-nut-3', name: 'Merienda', reps: '~200 kcal', detail: 'Frutos secos sin sal 30g (nueces, almendras) + 1 manzana.' },
              { id: 'd-nut-4', name: 'Cena', reps: '~400 kcal', detail: '150g pollo o pavo · Espinaca, brócoli o coliflor salteados. Aceite de oliva. Sin carbohidratos densos.' },
              { id: 'd-nut-5', name: 'Suplementación (opcional)', reps: 'Si usás', detail: 'Whey si no llegaste a 170g · Omega-3 (reduce grasa visceral) · Magnesio antes de dormir.' },
              { id: 'd-nut-6', name: 'Objetivo del día', reps: 'CHECK', detail: '✓ ~1800 kcal  ✓ 170g proteína  ✓ 2.5L agua  ✗ Sin alcohol (clave para grasa visceral)  ✓ Dormir 8h.' },
            ]
          },
        ]
      },
    ]
  },

]
