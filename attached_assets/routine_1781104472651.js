// TIDE — Rutina semanal · 3 tarjetas por día: GYM + FLEXIBILIDAD + NUTRICIÓN
// Perfil: 85.8kg · 183cm · 38 años · 24.5% grasa · Grasa visceral 14
// Objetivo: definición · bajar grasa visceral · mantener músculo
// GOWOD score: Cadena post 17 (CRÍTICO) · Caderas 37 · Overhead 70 · Tobillos 100

export const week = [

  // ─── LUNES · PUSH · BENCH PRESS ────────────────────────────────────────────
  {
    id: 'lun', day: 'L', name: 'Lunes', type: 'bigg',
    title: 'Push · Bench Press',
    subtitle: 'Empuje horizontal + hip power',
    duration: 70,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
    intro: 'Abrís la semana con bench press pesado. Bloque 1 de hip power enciende la cadena posterior. Al terminar el gym: 12 min de movilidad enfocada en cadena posterior y overhead.',
    blocks: [
      // ── GYM ──
      {
        type: 'warmup', title: 'Calentamiento', duration: 8,
        format: 'Activación torácica + empuje',
        exercises: [
          { id: 'l-w-1', name: 'Movilidad torácica + hombro', reps: '4 min', detail: "Cat-cow, banded dislocates con elástico, rotaciones torácicas en cuadrupedia." },
          { id: 'l-w-2', name: 'Activación general', reps: '2 rondas', detail: '10 push ups + 10 KB swing KB8 + 10 jumping jacks.' },
          { id: 'l-w-3', name: 'Aproximación al bench', reps: '2 sets', rest: '45"', detail: 'Barra vacía × 8 + 60% 1RM × 5.' },
        ]
      },
      {
        type: 'quality', title: 'Bloque 1 · Hip Power',
        duration: 7, format: "AMRAP 7' for quality · Tema: Hip Power",
        exercises: [
          { id: 'l-1-1', name: 'American Swing (KB 20)', reps: '8 reps', detail: 'KB hasta overhead. Extensión completa de cadera. Técnica limpia.' },
          { id: 'l-1-2', name: 'Box Jumps', reps: '5 reps', detail: 'Cajón. Caída suave, step down. Foco en la explosión de cadera.' },
          { id: 'l-1-3', name: 'DKB Hang Clean (2x KB 12)', reps: '5 reps', detail: 'Desde la bisagra, tracción explosiva. Codos altos al frente.' },
          { id: 'l-1-4', name: 'Goblet Pulse Squat (KB 20)', reps: '10 reps', detail: 'Squat profundo, dos pulsos abajo, sube.' },
        ]
      },
      {
        type: 'strength', title: 'Bloque 2 · Bench Press',
        duration: 13, format: "AMRAP 13' · Objetivo 3-4 rondas",
        exercises: [
          { id: 'l-2-1', name: 'Barbell Bench Press', reps: '5 reps', detail: 'Carga ~75% 1RM. RPE 7-8. Barra baja al esternón, codos 45°.', target: '~50-55 kg' },
          { id: 'l-2-2', name: 'DKB Bent Over Row (2x KB 12)', reps: '8 reps', detail: 'Accesorio. Tronco ~45°, codos hacia cadera. Control excéntrico.' },
          { id: 'l-2-3', name: 'Soga (jump rope)', reps: '90"', detail: '⚠️ Reemplaza Machine 40%. Ritmo conversacional.' },
        ]
      },
      {
        type: 'metcon', title: 'Bloque 3 · Hybrid Metcon',
        duration: 12, format: 'Every 90" · 8 rondas',
        exercises: [
          { id: 'l-3-1', name: 'KB Floor Press (2x KB 12)', reps: '8 reps', detail: '⚠️ Reemplaza DDB chest press. En suelo, ambas KB. Pausa 1" abajo.' },
          { id: 'l-3-2', name: 'Burpees Over The Bar', reps: '5 reps', detail: 'Barra en el suelo. Burpee + salto lateral por encima. Explosivo.' },
          { id: 'l-3-3', name: 'Strict Pull Ups', reps: '5 reps', detail: 'Completo rango. Si no llega: TRX row bien vertical.' },
          { id: 'l-3-4', name: 'Mountain Climbers', reps: '30"', detail: 'Desde plank alto. Rodillas al pecho alternadas, ritmo constante.' },
          { id: 'l-3-5', name: 'DKB Thruster (2x KB 12)', reps: '5 reps', detail: 'Squat + press overhead encadenado. Brazo completamente extendido arriba.' },
          { id: 'l-3-6', name: 'Skipping (soga)', reps: '45"', detail: 'Salto a pie junto o alternado. Ritmo sostenido.' },
        ]
      },
      {
        type: 'finisher', title: 'Bloque 4 · Midline',
        duration: 7, format: 'Every 90" x 5 rondas · Rotar ejercicios',
        exercises: [
          { id: 'l-4-1', name: 'Hollow Hold', reps: '40"', detail: 'Lumbar pegada al suelo. Brazos y piernas extendidos a 45°.' },
          { id: 'l-4-2', name: 'Tuck Ups', reps: '15 reps', detail: 'Desde hollow, knees to chest. Control total en la bajada.' },
          { id: 'l-4-3', name: 'Plank Jack', reps: '30"', detail: 'Desde plank alto, piernas abren y cierran. Core activo, cadera quieta.' },
        ]
      },
      // ── FLEXIBILIDAD ──
      {
        type: 'quality', title: 'Flexibilidad · Cadena Post + Overhead',
        duration: 12, format: 'GOWOD · 12 min · Post-gym · Prioridad: Cadena posterior (17) + Overhead (70)',
        exercises: [
          { id: 'l-mob-1', name: 'Banded Hamstring Stretch', reps: '90" / lado', detail: 'GOWOD · Isquiotibiales. Tu zona más crítica (score 17). Elástico anclado bajo, pierna estirada, tracción suave y sostenida.' },
          { id: 'l-mob-2', name: '90 To 90', reps: '2 min / lado', detail: 'GOWOD · Caderas + Glúteos (score 37). Sentado, ambas piernas en 90°. Rota lentamente hacia adelante y atrás.' },
          { id: 'l-mob-3', name: 'Banded Overhead Fixer', reps: '90"', detail: 'GOWOD · Pectorales + Hombros + Laterales (score 70, bajando). Elástico desde arriba, brazos overhead, abre el pecho.' },
          { id: 'l-mob-4', name: 'Rotación Dorsal (Paul Wade)', reps: '2 x 15 reps / lado', detail: 'Cuadrupedia, mano detrás de la cabeza. Lleva el codo hacia el techo sin mover la pelvis. Tórax (score 69).' },
        ]
      },
      // ── NUTRICIÓN ──
      {
        type: 'warmup', title: 'Nutrición · Día de Fuerza',
        duration: 5, format: '~2200 kcal · 170g proteína · Día BIGG',
        exercises: [
          { id: 'l-nut-1', name: 'Desayuno', reps: '~500 kcal', detail: '3 huevos + 2 claras revueltos · Avena 50g con banana · Café sin azúcar. Si entrenás temprano, tomalo 60-90 min antes.' },
          { id: 'l-nut-2', name: 'Almuerzo', reps: '~650 kcal', detail: '180g pollo, pavo o atún · Arroz integral ½ taza cocida · Ensalada grande + aceite de oliva + limón.' },
          { id: 'l-nut-3', name: 'Merienda / Pre-entreno', reps: '~300 kcal', detail: 'Yogur griego natural 200g + fruta de estación. O: 2 tostadas integrales + ½ palta + 1 huevo.' },
          { id: 'l-nut-4', name: 'Post-entreno', reps: '~350 kcal', detail: 'Batido: 1 scoop proteína + banana + leche descremada. O: 150g pollo + arroz integral ½ taza.' },
          { id: 'l-nut-5', name: 'Cena', reps: '~450 kcal', detail: '150g salmón, merluza o carne magra · Verduras salteadas abundantes (zucchini, brócoli, espinaca, morrón). Sin carbohidratos extra.' },
          { id: 'l-nut-6', name: 'Objetivo del día', reps: 'CHECK', detail: '✓ ~2200 kcal  ✓ 170g proteína  ✓ 2.5L agua  ✗ Sin alcohol  ✗ Sin ultraprocesados. Grasa visceral 14 → esto es tu palanca más importante.' },
        ]
      },
    ]
  },

  // ─── MARTES · PULL · DEADLIFT + ROW ────────────────────────────────────────
  {
    id: 'mar', day: 'M', name: 'Martes', type: 'bigg',
    title: 'Pull · Deadlift + Row',
    subtitle: 'Cadena posterior + tirón',
    duration: 70,
    image: 'https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?w=800&q=80',
    intro: 'Deadlift pesado como ancla + bent over row como accesorio. Bloque 1 de pull prehab activa la espalda antes del levantamiento. Post-gym: movilidad de caderas y posterior.',
    blocks: [
      // ── GYM ──
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
        type: 'quality', title: 'Bloque 1 · Pull Prehab',
        duration: 7, format: "AMRAP 7' for quality · Tema: Pull Prehab",
        exercises: [
          { id: 'ma-1-1', name: 'Scapular Pull Ups (TRX)', reps: '10 reps', detail: 'Brazo extendido arriba, depresión de escápula sin doblar codo. Activa serrato y trapecio.' },
          { id: 'ma-1-2', name: 'Bird Dogs', reps: '8/8 reps', detail: 'Cuadrupedia. Brazo y pierna opuestos, columna neutra. Lento y controlado.' },
          { id: 'ma-1-3', name: 'DKB Dead Bug (2x KB 8)', reps: '8 reps', detail: 'KB overhead, pierna opuesta baja. Lumbar pegada. Control total del core.' },
          { id: 'ma-1-4', name: 'Front Step + Thoracic Rotation', reps: '6/6 reps', detail: 'Paso adelante, rota el tronco hacia la pierna delantera.' },
        ]
      },
      {
        type: 'strength', title: 'Bloque 2 · Deadlift',
        duration: 13, format: "AMRAP 13' · RPE 7 · No buscar PR",
        exercises: [
          { id: 'ma-2-1', name: 'Barbell Deadlift', reps: '5 reps', detail: 'Carga ~70% 1RM. Técnica primero. Espalda neutra, cadera atrás, bar path vertical.', target: '~55-60 kg' },
          { id: 'ma-2-2', name: 'Barbell Bent Over Row', reps: '8 reps', detail: 'Tronco ~45°, codos pegados al tronco. Carga moderada.', target: '~35-40 kg' },
          { id: 'ma-2-3', name: 'Soga (jump rope)', reps: '90"', detail: '⚠️ Reemplaza Machine 40%. Recuperación activa.' },
        ]
      },
      {
        type: 'metcon', title: 'Bloque 3 · Hybrid Metcon',
        duration: 12, format: 'Complete 3 rounds · Anotar tiempo total',
        exercises: [
          { id: 'ma-3-1', name: 'Barbell Romanian Deadlift', reps: '10 reps', detail: 'Carga moderada. Bisagra de cadera, isquios al límite. Control excéntrico 2".', target: '~40 kg' },
          { id: 'ma-3-2', name: 'Jumping Pull Ups', reps: '10 reps', detail: 'Salto asistido, eccéntrico controlado 3".' },
          { id: 'ma-3-3', name: 'Russian Swing (KB 20)', reps: '15 reps', detail: 'KB hasta altura de pecho. Explosión de cadera, no fuerza de brazos.' },
          { id: 'ma-3-4', name: 'DKB Box Step Ups (2x KB 8)', reps: '10/10 reps', detail: 'Cajón. Sube, rodilla arriba al llegar. Alterna piernas.' },
          { id: 'ma-3-5', name: 'Burpees', reps: '8 reps', detail: 'Pecho al suelo, salto con palmada arriba.' },
          { id: 'ma-3-6', name: 'Sprawl to Box Jump', reps: '6 reps', detail: 'Caída hacia plank, regresa de pie, box jump inmediato. Sin pausa.' },
        ]
      },
      {
        type: 'finisher', title: 'Bloque 4 · Midline',
        duration: 6, format: "AMRAP 6' · 4 ejercicios",
        exercises: [
          { id: 'ma-4-1', name: 'Reverse Crunches', reps: '15 reps', detail: 'Piernas juntas, sube cadera del suelo. Lento.' },
          { id: 'ma-4-2', name: 'Copenhagen Plank', reps: '20"/lado', detail: 'Pie en cajón, plank lateral. Cadera arriba.' },
          { id: 'ma-4-3', name: 'Back Extensions', reps: '12 reps', detail: 'En suelo boca abajo. Brazos al costado, eleva tronco.' },
          { id: 'ma-4-4', name: 'Leg Circles', reps: '10/dirección', detail: 'Piernas juntas y rectas. Círculos amplios y lentos. Lumbar fija.' },
        ]
      },
      // ── FLEXIBILIDAD ──
      {
        type: 'quality', title: 'Flexibilidad · Caderas + Posterior',
        duration: 12, format: 'GOWOD · 12 min · Post-gym · Prioridad: Caderas (37) + Cadena posterior (17)',
        exercises: [
          { id: 'ma-mob-1', name: '90 To 90 Hip External Rotations', reps: '2 min / lado', detail: 'GOWOD · Caderas + Glúteos (New). Sentado en 90/90, lleva la rodilla delantera hacia el pecho rotando hacia afuera. Sostené el rango.' },
          { id: 'ma-mob-2', name: 'Banded Hip Opener', reps: '90" / lado', detail: 'GOWOD · Caderas + Aductores + Glúteos. Elástico en cadera, en posición de cuadrupedia o lunge, abre la cadera hacia el costado.' },
          { id: 'ma-mob-3', name: 'Active Cobra', reps: '60"', detail: 'GOWOD · Abs + Trapecios + Músculos Lumbares (New). Boca abajo, empuja el suelo y eleva el tronco. Abre el pecho. Lumbar extendida activamente.' },
          { id: 'ma-mob-4', name: 'Bent Over Locked Rotation', reps: '60" / lado', detail: 'GOWOD · Caderas + Músculos Lumbares (New). Tronco inclinado, rotación desde la cadera. Libera el complejo lumbo-pélvico.' },
        ]
      },
      // ── NUTRICIÓN ──
      {
        type: 'warmup', title: 'Nutrición · Día de Fuerza',
        duration: 5, format: '~2200 kcal · 170g proteína · Día BIGG',
        exercises: [
          { id: 'ma-nut-1', name: 'Desayuno', reps: '~500 kcal', detail: '3 huevos + 2 claras revueltos · Avena 50g con banana · Café sin azúcar.' },
          { id: 'ma-nut-2', name: 'Almuerzo', reps: '~650 kcal', detail: '180g pollo, pavo o atún · Arroz integral ½ taza · Ensalada grande + aceite de oliva.' },
          { id: 'ma-nut-3', name: 'Merienda / Pre-entreno', reps: '~300 kcal', detail: 'Yogur griego natural 200g + fruta. O: 2 tostadas integrales + ½ palta + 1 huevo.' },
          { id: 'ma-nut-4', name: 'Post-entreno', reps: '~350 kcal', detail: 'Batido: 1 scoop proteína + banana + leche. O: 150g pollo + arroz integral ½ taza.' },
          { id: 'ma-nut-5', name: 'Cena', reps: '~450 kcal', detail: '150g salmón o merluza (preferir pescado — impacta directo en grasa visceral) · Verduras salteadas abundantes.' },
          { id: 'ma-nut-6', name: 'Objetivo del día', reps: 'CHECK', detail: '✓ ~2200 kcal  ✓ 170g proteína  ✓ 2.5L agua  ✗ Sin alcohol  ✗ Sin ultraprocesados.' },
        ]
      },
    ]
  },

  // ─── MIÉRCOLES · LEGS · SQUAT + HIP THRUST ─────────────────────────────────
  {
    id: 'mie', day: 'M', name: 'Miércoles', type: 'bigg',
    title: 'Legs · Squat + Hip Thrust',
    subtitle: 'Cuadriceps + gluteo + posterior',
    duration: 70,
    image: 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=800&q=80',
    intro: 'Día de piernas completo. Back squat + hip thrust. Post-gym: protocolo GOWOD de caderas profundo — el más importante de la semana para tu score de Caderas (37).',
    blocks: [
      // ── GYM ──
      {
        type: 'warmup', title: 'Calentamiento', duration: 8,
        format: 'Activacion gluteo + movilidad cadera/tobillo',
        exercises: [
          { id: 'mi-w-1', name: 'Movilidad cadera + tobillo', reps: '4 min', detail: "90/90, world's greatest, ankle rocks, pigeon stretch." },
          { id: 'mi-w-2', name: 'Activacion gluteo', reps: '2 sets', rest: '30"', detail: '15 banded side steps + 15 glute bridge + 10 jumping jacks.' },
          { id: 'mi-w-3', name: 'Aproximacion squat', reps: '2 sets', rest: '45"', detail: 'Back squat barra vacia x 8 + 60% 1RM x 5.' },
        ]
      },
      {
        type: 'quality', title: 'Bloque 1 · Lower Prehab',
        duration: 7, format: "AMRAP 7' for quality · Tema: Lower Prehab",
        exercises: [
          { id: 'mi-1-1', name: 'Banded Side Steps', reps: '15/lado', detail: 'Elastico en tobillos. Posicion de squat, pasos laterales. Glúteo medio.' },
          { id: 'mi-1-2', name: 'Single-Leg Glute Bridge', reps: '10/lado', detail: 'Una pierna extendida, sube cadera. Pausa 1" arriba.' },
          { id: 'mi-1-3', name: 'DKB Cossack Squat (2x KB 8)', reps: '6/lado', detail: 'Sentadilla lateral profunda. KB frente al pecho. Tobillo del pie extendido fijo.' },
          { id: 'mi-1-4', name: 'Banded Squat', reps: '15 reps', detail: 'Elastico en rodillas. Empuja rodillas hacia afuera. Squat lento y controlado.' },
        ]
      },
      {
        type: 'strength', title: 'Bloque 2 · Back Squat',
        duration: 13, format: "AMRAP 13' · Objetivo 3-4 rondas",
        exercises: [
          { id: 'mi-2-1', name: 'Barbell Back Squat', reps: '6 reps', detail: 'Carga ~72% 1RM. RPE 7-8. Profundidad completa, rodillas afuera.', target: '~45-50 kg' },
          { id: 'mi-2-2', name: 'DKB Front Rack Lunges (2x KB 12)', reps: '8/8 reps', detail: '⚠️ Reemplaza DB pesadas. KB en rack, paso largo, torso recto.' },
          { id: 'mi-2-3', name: 'Soga (jump rope)', reps: '90"', detail: '⚠️ Reemplaza Machine 40%. Ritmo conversacional.' },
        ]
      },
      {
        type: 'metcon', title: 'Bloque 3 · Hybrid Metcon',
        duration: 13, format: 'Every 90" · 8 rondas · Alta intensidad',
        exercises: [
          { id: 'mi-3-1', name: 'Barbell Hip Thrust', reps: '8 reps', detail: 'Espalda alta en banco. Pausa 1" arriba. Gluteo al maximo.', target: '~50-60 kg' },
          { id: 'mi-3-2', name: 'Jumping Lunges', reps: '10 reps (5/lado)', detail: 'Salto con cambio de pierna en el aire. Aterrizaje suave.' },
          { id: 'mi-3-3', name: 'SKB Single-Leg Deadlift (KB 12)', reps: '6/lado', detail: 'Bisagra unilateral. Cadera abre horizontal. Control del balance.' },
          { id: 'mi-3-4', name: 'Wall Ball (pelota 10 kg)', reps: '10 reps', detail: 'Squat profundo + lanzar pelota a pared ~3m. Recibis y repetis sin pausa.' },
          { id: 'mi-3-5', name: 'Lateral Bounds / Skater Jumps', reps: '10 reps (5/lado)', detail: 'Salto lateral, caes a un pie. Mantene 1". Potencia lateral.' },
          { id: 'mi-3-6', name: 'MB Rotational Slam (pelota 10 kg)', reps: '8 reps', detail: 'Pelota overhead, gira y slam lateral. 4/lado. Maximo explosivo.' },
        ]
      },
      {
        type: 'finisher', title: 'Bloque 4 · Midline',
        duration: 6, format: 'Complete 1 a 10 · 2 ejercicios',
        exercises: [
          { id: 'mi-4-1', name: 'Tuck Ups', reps: '1 a 10 reps', detail: 'Knees to chest desde hollow. Subis una rep por ronda hasta 10.' },
          { id: 'mi-4-2', name: 'Sit Ups', reps: '1 a 10 reps', detail: 'Completos, pies libres. Misma cantidad que Tuck Ups.' },
        ]
      },
      // ── FLEXIBILIDAD ──
      {
        type: 'quality', title: 'Flexibilidad · Caderas Profundo',
        duration: 14, format: 'GOWOD · 14 min · Post-gym · Prioridad: Caderas (37) — sesión más importante de la semana',
        exercises: [
          { id: 'mi-mob-1', name: 'Banded Knight Stretch', reps: '2 min / lado', detail: 'GOWOD · Caderas + Cuádriceps. En posición de lunge bajo, elástico en la cadera de atrás. Empuja hacia adelante y sostené.' },
          { id: 'mi-mob-2', name: 'Banded Pigeon', reps: '2 min / lado', detail: 'GOWOD · Glúteos + Caderas. Posición de paloma con elástico. Empuja la cadera hacia el suelo. La zona más rígida del perfil.' },
          { id: 'mi-mob-3', name: '0 To 90', reps: '2 min / lado', detail: 'GOWOD · Caderas + Glúteos. Desde 0° hasta 90° de flexión de cadera. Movimiento activo y controlado.' },
          { id: 'mi-mob-4', name: '90 To 90 Rotation', reps: '90" / lado', detail: 'GOWOD · Glúteos + Caderas. En 90/90, rota el tronco hacia la pierna delantera. Libera la rotación interna.' },
          { id: 'mi-mob-5', name: 'Banded Squat On Wall', reps: '90"', detail: 'GOWOD · Caderas + Aductores. Sentado contra la pared con elástico en rodillas. Profundidad máxima sostenida.' },
        ]
      },
      // ── NUTRICIÓN ──
      {
        type: 'warmup', title: 'Nutrición · Día de Piernas',
        duration: 5, format: '~2200 kcal · 170g proteína · Día BIGG',
        exercises: [
          { id: 'mi-nut-1', name: 'Desayuno', reps: '~500 kcal', detail: '3 huevos + 2 claras revueltos · Avena 50g con banana · Café sin azúcar.' },
          { id: 'mi-nut-2', name: 'Almuerzo', reps: '~700 kcal', detail: '200g pollo o pavo · Arroz integral ½ taza · Lentejas o garbanzos ¼ taza · Ensalada grande. Piernas necesitan carbohidratos.' },
          { id: 'mi-nut-3', name: 'Merienda / Pre-entreno', reps: '~300 kcal', detail: 'Yogur griego 200g + banana + miel (1 cdita). Carbohidratos de rápida absorción antes de squats.' },
          { id: 'mi-nut-4', name: 'Post-entreno', reps: '~400 kcal', detail: 'Batido proteína + banana + leche. Piernas trabajadas necesitan recuperación rápida.' },
          { id: 'mi-nut-5', name: 'Cena', reps: '~400 kcal', detail: '150g carne magra (peceto, lomo) o pollo · Vegetales asados abundantes · Sin arroz adicional.' },
          { id: 'mi-nut-6', name: 'Objetivo del día', reps: 'CHECK', detail: '✓ ~2200 kcal  ✓ 170g proteína  ✓ 2.5L agua  ✗ Sin alcohol  ✗ Sin ultraprocesados.' },
        ]
      },
    ]
  },

  // ─── JUEVES · RUN · INTERVALOS ─────────────────────────────────────────────
  {
    id: 'jue', day: 'J', name: 'Jueves', type: 'run',
    title: 'Intervalos VO2max', subtitle: 'Cardio intenso · EPOC alto',
    duration: 55,
    image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&q=80',
    intro: 'Cardio intenso sin cansar el tren superior. Post-run: movilidad de cadena posterior y tórax — las dos zonas más limitadas en tu perfil GOWOD.',
    blocks: [
      // ── GYM/RUN ──
      {
        type: 'warmup', title: 'Estructura de la sesion', duration: 38,
        exercises: [
          { id: 'j-w-1', name: 'Calentamiento', reps: '10 min', detail: "Caminata 2' → trote suave subiendo gradual. Movilidad tobillo y cadera." },
          { id: 'j-w-2', name: 'Drills (opcional)', reps: '3 min', detail: 'Skipping, talones gluteos, zancadas largas.' },
          { id: 'j-w-3', name: 'Bloque principal', reps: '16 min', detail: 'Elegí una de las dos opciones.' },
          { id: 'j-w-4', name: 'Vuelta a la calma', reps: '8 min', detail: 'Trote suave Z1. Pulso bajo 120 ppm.' },
        ]
      },
      {
        type: 'metcon', title: 'Opcion A · 4x4', duration: 16,
        format: 'VO2max clásico',
        exercises: [
          { id: 'j-2-1', name: 'Trabajo: 4 min x 4', reps: '85-90% FCM', detail: 'Ritmo exigente sin reventar. No podrias mantener conversación.' },
          { id: 'j-2-2', name: 'Recuperacion: 2 min x 4', reps: 'Trote suave', detail: 'Pulso debe bajar a Z2 antes de la siguiente serie.' },
        ]
      },
      {
        type: 'metcon', title: 'Opcion B · 30/30', duration: 16,
        format: 'Mas explosivo',
        exercises: [
          { id: 'j-3-1', name: 'Trabajo: 30" x 16', reps: '~90% FCM', detail: 'Casi sprint controlado. Mantene forma técnica.' },
          { id: 'j-3-2', name: 'Recuperacion: 30" x 16', reps: 'Trote', detail: 'Recuperación activa, no caminar. Nasal si podés.' },
        ]
      },
      {
        type: 'quality', title: 'Cuando usar cada opcion', duration: 0,
        exercises: [
          { id: 'j-4-1', name: 'Si llegás fresco', detail: 'Opcion A (4x4) → mayor estimulo VO2max.' },
          { id: 'j-4-2', name: 'Si llegás cansado', detail: 'Opcion B (30/30) o reducí a 12 intervalos.' },
          { id: 'j-4-3', name: 'Mañana hay Shoulder Press', detail: 'Cualquiera de las dos. El tren superior no se compromete.' },
        ]
      },
      // ── FLEXIBILIDAD ──
      {
        type: 'quality', title: 'Flexibilidad · Cadena Post + Tórax',
        duration: 12, format: 'GOWOD + Paul Wade · 12 min · Post-run',
        exercises: [
          { id: 'j-mob-1', name: 'Banded Hamstring Stretch', reps: '2 min / lado', detail: 'GOWOD · Isquiotibiales. Score 17 → CRÍTICO. Post-run es el mejor momento — el músculo está caliente. Máxima efectividad.' },
          { id: 'j-mob-2', name: 'Active Butterfly', reps: '2 min', detail: 'GOWOD · Aductores + Caderas (New). Sentado, plantas de los pies juntas. Empuja rodillas suavemente hacia el suelo. Activo, no pasivo.' },
          { id: 'j-mob-3', name: 'Extensión Dorsal con Roller', reps: '3 x 15 reps', detail: 'Paul Wade · Tórax (score 69, mejorando). Roller en zona dorsal, extiende columna hacia atrás. Sin roller: toalla enrollada.' },
          { id: 'j-mob-4', name: 'Banded Squat On Wall', reps: '90"', detail: 'GOWOD · Caderas + Aductores. Sentado contra pared con elastico en rodillas. Profundidad máxima.' },
        ]
      },
      // ── NUTRICIÓN ──
      {
        type: 'warmup', title: 'Nutrición · Día de Cardio',
        duration: 5, format: '~2000 kcal · 170g proteína · Día RUN',
        exercises: [
          { id: 'j-nut-1', name: 'Desayuno', reps: '~450 kcal', detail: '3 huevos + 1 clara · Avena 40g + fruta · Café. Levemente más liviano — día de cardio.' },
          { id: 'j-nut-2', name: 'Almuerzo', reps: '~600 kcal', detail: '180g pollo o atún · Arroz integral ½ taza · Ensalada grande + aceite de oliva.' },
          { id: 'j-nut-3', name: 'Merienda / Pre-run', reps: '~250 kcal', detail: '1 banana + yogur griego 150g. Evitar grasas antes del cardio — pueden causar malestar digestivo.' },
          { id: 'j-nut-4', name: 'Post-run', reps: '~300 kcal', detail: 'Batido proteína + 1 fruta. O: yogur griego 200g + granola sin azúcar (30g).' },
          { id: 'j-nut-5', name: 'Cena', reps: '~400 kcal', detail: '150-180g salmón o merluza · Vegetales al vapor · Sin carbohidratos extra. Grasa visceral responde especialmente al cardio + deficit calórico.' },
          { id: 'j-nut-6', name: 'Objetivo del día', reps: 'CHECK', detail: '✓ ~2000 kcal  ✓ 170g proteína  ✓ 3L agua (cardio)  ✗ Sin alcohol  ✗ Sin ultraprocesados.' },
        ]
      },
    ]
  },

  // ─── VIERNES · PUSH · SHOULDER PRESS ───────────────────────────────────────
  {
    id: 'vie', day: 'V', name: 'Viernes', type: 'bigg',
    title: 'Push · Shoulder Press',
    subtitle: 'Overhead strength + KB metcon',
    duration: 70,
    image: 'https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?w=800&q=80',
    intro: 'Empuje vertical pesado. Post-gym: protocolo de hombros y tórax — especialmente crítico porque Overhead está en 70 y bajando (-8%). Hay que revertir esa tendencia.',
    blocks: [
      // ── GYM ──
      {
        type: 'warmup', title: 'Calentamiento', duration: 8,
        format: 'Activacion hombro + movilidad toracica',
        exercises: [
          { id: 'v-w-1', name: 'Movilidad toracica + hombro', reps: '4 min', detail: 'Rotaciones torácicas en cuadrupedia, banded dislocates, lat stretch.' },
          { id: 'v-w-2', name: 'Activacion general', reps: '2 rondas', detail: '10 push ups + 10 KB swing KB8 + 10 jumping jacks.' },
          { id: 'v-w-3', name: 'Aproximacion shoulder press', reps: '2 sets', rest: '45"', detail: 'Barra vacia x 8 + 60% 1RM x 5.' },
        ]
      },
      {
        type: 'quality', title: 'Bloque 1 · Push Control',
        duration: 7, format: "AMRAP 7' for quality · Tema: Push Control",
        exercises: [
          { id: 'v-1-1', name: 'KB Kneeling Halo (KB 12)', reps: '6/6 reps', detail: 'Arrodillado, círculo lento alrededor de la cabeza. Activa hombro y core.' },
          { id: 'v-1-2', name: 'Push Up Hold', reps: '5 reps x 3"', detail: 'Bajá lento 3", pausa en el fondo, empujá. Control total de escápulas.' },
          { id: 'v-1-3', name: 'DKB Z-Press (2x KB 8)', reps: '5 reps', detail: 'Sentado en suelo, piernas extendidas. Prensa estricta overhead.' },
          { id: 'v-1-4', name: 'Scapular Pull Ups (TRX)', reps: '8 reps', detail: 'Activa escápulas antes del press. Prehab de manguito rotador.' },
        ]
      },
      {
        type: 'strength', title: 'Bloque 2 · Shoulder Press',
        duration: 13, format: "AMRAP 13' · Objetivo 3-4 rondas",
        exercises: [
          { id: 'v-2-1', name: 'Barbell Shoulder Press', reps: '5 reps', detail: 'Carga ~70% 1RM. Prensa estricta, sin arco lumbar. RPE 7-8.', target: '~40-45 kg' },
          { id: 'v-2-2', name: 'DKB Z-Press (2x KB 12)', reps: '8 reps', detail: '⚠️ Reemplaza DDB pesadas. Sentado en suelo, prensa vertical estricta.', target: '2x KB 12' },
          { id: 'v-2-3', name: 'Soga (jump rope)', reps: '90"', detail: '⚠️ Reemplaza Machine 40%. Ritmo sostenido.' },
        ]
      },
      {
        type: 'metcon', title: 'Bloque 3 · Hybrid Metcon',
        duration: 13, format: "AMRAP 13' · Alta intensidad · 7 movimientos",
        exercises: [
          { id: 'v-3-1', name: 'Barbell Push Press', reps: '5 reps', detail: 'Asistencia de piernas, bloqueo arriba. Carga ~60% 1RM.', target: '~35-40 kg' },
          { id: 'v-3-2', name: 'Box Jumps', reps: '8 reps', detail: 'Cajón. Rebote suave o step down controlado.' },
          { id: 'v-3-3', name: 'TRX Row (estricto)', reps: '10 reps', detail: 'Pull horizontal. Compensación del empuje. Codos pegados al tronco.' },
          { id: 'v-3-4', name: 'Burpee Broad Jump', reps: '5 reps', detail: 'Pecho al suelo + salto hacia adelante. Maxima explosion.' },
          { id: 'v-3-5', name: 'American Swing (KB 20)', reps: '12 reps', detail: 'KB hasta overhead. Extension de cadera completa.' },
          { id: 'v-3-6', name: 'Jumping Curtsy Lunges', reps: '10 reps (5/lado)', detail: 'Estocada cruzada con salto de cambio. Potencia lateral.' },
          { id: 'v-3-7', name: 'Pogo Jumps', reps: '20 reps', detail: 'Saltos rapidos en tobillo. Minima flexion de rodilla. Explosivos.' },
        ]
      },
      {
        type: 'finisher', title: 'Bloque 4 · Midline',
        duration: 7, format: 'Every 60" x 7 rondas · Rotar 4 ejercicios',
        exercises: [
          { id: 'v-4-1', name: 'Hollow Hold', reps: '40"', detail: 'Lumbar pegada al suelo. Brazos extendidos, piernas a 45°.' },
          { id: 'v-4-2', name: 'V-Sit Ups', reps: '15 reps', detail: 'Desde hollow, sube tronco y piernas al mismo tiempo.' },
          { id: 'v-4-3', name: 'Leg Levers', reps: '12 reps', detail: 'Piernas rectas, suben y bajan lento. Lumbar NO despega.' },
          { id: 'v-4-4', name: 'Plank Shoulder Taps', reps: '20 reps (10/lado)', detail: 'Plank alto, toca hombro contrario. Cadera estable.' },
        ]
      },
      // ── FLEXIBILIDAD ──
      {
        type: 'quality', title: 'Flexibilidad · Hombros + Tórax',
        duration: 12, format: 'GOWOD + Paul Wade · 12 min · Post-gym · Overhead 70 y bajando → invertir tendencia',
        exercises: [
          { id: 'v-mob-1', name: 'Banded Overhead Fixer', reps: '90"', detail: 'GOWOD · Pectorales + Hombros + Laterales. Elástico desde arriba, brazos extendidos overhead. Abre el pecho y frena el hundimiento escapular.' },
          { id: 'v-mob-2', name: 'Banded Lat Stretch', reps: '90" / lado', detail: 'GOWOD · Rotadores + Hombros + Laterales. En lunge bajo, elástico en la muñeca. Estira el dorsal y los rotadores externos del hombro.' },
          { id: 'v-mob-3', name: 'Banded Shoulder Strap', reps: '90" / lado', detail: 'GOWOD · Hombros + Pectorales. Elástico detrás del cuerpo, hombro en rotación externa. Libera la cápsula anterior.' },
          { id: 'v-mob-4', name: 'Rotación Dorsal (Paul Wade)', reps: '2 x 15 reps / lado', detail: 'Cuadrupedia, mano detrás de la cabeza. Codo hacia el techo sin mover la pelvis. Tórax mejorando (+12%) — mantener el progreso.' },
        ]
      },
      // ── NUTRICIÓN ──
      {
        type: 'warmup', title: 'Nutrición · Día de Fuerza',
        duration: 5, format: '~2200 kcal · 170g proteína · Día BIGG',
        exercises: [
          { id: 'v-nut-1', name: 'Desayuno', reps: '~500 kcal', detail: '3 huevos + 2 claras · Avena 50g + fruta · Café sin azúcar.' },
          { id: 'v-nut-2', name: 'Almuerzo', reps: '~650 kcal', detail: '180g pollo, pavo o carne magra · Papa mediana o arroz integral · Ensalada + aceite oliva.' },
          { id: 'v-nut-3', name: 'Merienda / Pre-entreno', reps: '~300 kcal', detail: 'Yogur griego 200g + fruta. O: 2 tostadas integrales + palta.' },
          { id: 'v-nut-4', name: 'Post-entreno', reps: '~350 kcal', detail: 'Batido proteína + banana + leche descremada. O: 150g pollo + arroz.' },
          { id: 'v-nut-5', name: 'Cena', reps: '~400 kcal', detail: '150g pescado o pollo · Vegetales salteados abundantes · Aceite de oliva. Sin carbohidratos extra.' },
          { id: 'v-nut-6', name: 'Objetivo del día', reps: 'CHECK', detail: '✓ ~2200 kcal  ✓ 170g proteína  ✓ 2.5L agua  ✗ Sin alcohol  ✗ Sin ultraprocesados.' },
        ]
      },
    ]
  },

  // ─── SÁBADO · HYROX-STYLE ──────────────────────────────────────────────────
  {
    id: 'sab', day: 'S', name: 'Sabado', type: 'bigg',
    title: 'Hyrox-style',
    subtitle: 'Hibrido completo · Dia estrella',
    duration: 70,
    image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&q=80',
    intro: 'La sesión más completa de la semana. Front squat + metcon Hyrox largo. Post-gym: protocolo full-body de recuperación y movilidad — preparás el cuerpo para el domingo de descanso.',
    blocks: [
      // ── GYM ──
      {
        type: 'warmup', title: 'Calentamiento', duration: 8,
        format: 'Activacion full body + especifico front squat',
        exercises: [
          { id: 's-w-1', name: 'Movilidad general', reps: '4 min', detail: "Cadera, hombro, columna toracica. World's greatest x 5/lado." },
          { id: 's-w-2', name: 'Activacion', reps: '2 rondas', detail: '10 air squats + 10 push ups + 10 KB swing KB8 + 5 burpees.' },
          { id: 's-w-3', name: 'Especifico front squat', reps: '2 sets', rest: '30"', detail: 'Front squat barra vacia x 5 + hang power clean x 5.' },
        ]
      },
      {
        type: 'quality', title: 'Bloque 1 · Back Power',
        duration: 7, format: "AMRAP 7' for quality · Tema: Back Power",
        exercises: [
          { id: 's-1-1', name: 'Russian Swing (KB 20)', reps: '8 reps', detail: 'KB hasta pecho. Explosión de cadera pura.' },
          { id: 's-1-2', name: 'DKB Bent Over Row (2x KB 12)', reps: '6 reps', detail: 'Tronco horizontal, codos altos. Activacion maxima dorsal.' },
          { id: 's-1-3', name: 'SKB Single-Arm Overhead Carry (KB 20)', reps: '20 pasos/lado', detail: 'Camine con KB overhead. Estabilidad hombro y antirotacion de core.' },
          { id: 's-1-4', name: 'Walkouts', reps: '4 reps', detail: 'Desde de pie, manos al suelo, camina a plank y vuelve.' },
        ]
      },
      {
        type: 'strength', title: 'Bloque 2 · Front Squat',
        duration: 12, format: "AMRAP 12' · Objetivo 3 rondas",
        exercises: [
          { id: 's-2-1', name: 'Barbell Front Squat', reps: '6 reps', detail: 'Codos altos, tronco vertical. RPE 7.', target: '~40-45 kg' },
          { id: 's-2-2', name: 'Strict Chin Ups', reps: '6 reps', detail: 'Agarre supino. Completo rango. Si no llega: TRX row vertical.' },
          { id: 's-2-3', name: 'Soga (jump rope)', reps: '90"', detail: '⚠️ Reemplaza Machine 40%.' },
        ]
      },
      {
        type: 'metcon', title: 'Bloque 3 · Long Metcon · Hyrox',
        duration: 13, format: "AMRAP 13' · Objetivo 1-2 rondas · 8 movimientos",
        exercises: [
          { id: 's-3-1', name: 'Barbell Hang Power Clean', reps: '5 reps', detail: 'Carga moderada. Explosivo desde encima de rodilla.', target: '~45 kg' },
          { id: 's-3-2', name: 'DKB Front Rack March (2x KB 12)', reps: '20 pasos', detail: 'Carry en rack, pasos altos. Simula farmer carry de Hyrox.' },
          { id: 's-3-3', name: 'Burpee Box Jump', reps: '8 reps', detail: 'Burpee completo + box jump encadenado inmediato. Sin pausa.' },
          { id: 's-3-4', name: 'Goblet Thrusters (KB 20)', reps: '8 reps', detail: 'KB en goblet, squat profundo + press overhead encadenado.' },
          { id: 's-3-5', name: 'Band-Assisted Pull Ups', reps: '8 reps', detail: 'Elastico en barra del rack. Rango completo. Chin above bar.' },
          { id: 's-3-6', name: 'MB Devil Press (pelota 5 kg)', reps: '6 reps', detail: '⚠️ Pelota en lugar de DDB. Burpee + ground to overhead explosivo.' },
          { id: 's-3-7', name: 'DKB Farmer March (2x KB 20)', reps: '20 pasos', detail: 'Máxima carga. Simula Farmer Carry Hyrox.' },
          { id: 's-3-8', name: 'Jumping Squats', reps: '12 reps', detail: 'Sin peso. Maxima explosion. Aterrizaje suave.' },
        ]
      },
      {
        type: 'finisher', title: 'Bloque 4 · Midline',
        duration: 8, format: '45" ON / 15" OFF · 2 rondas · 4 ejercicios',
        exercises: [
          { id: 's-4-1', name: 'Zombie Sit Ups', reps: '45"', detail: 'Desde suelo, brazos overhead, sube sin inercia.' },
          { id: 's-4-2', name: 'Heel Touches', reps: '45"', detail: 'Crunch lateral alternado tocando talones.' },
          { id: 's-4-3', name: 'Scissor Kicks', reps: '45"', detail: 'Piernas extendidas, movimiento alternado. Lumbar pegada.' },
          { id: 's-4-4', name: 'Dead Bug Progressions', reps: '45"', detail: 'Brazo y pierna opuestos, lentos. Lumbar neutral.' },
        ]
      },
      // ── FLEXIBILIDAD ──
      {
        type: 'quality', title: 'Flexibilidad · Full Body Recovery',
        duration: 13, format: 'GOWOD · 13 min · Post-gym · Preparación para descanso del domingo',
        exercises: [
          { id: 's-mob-1', name: 'Banded Reverse T Hip Opener', reps: '2 min / lado', detail: 'GOWOD · Caderas + Pectorales + Glúteos + Músculos Lumbares. Posición de lunge, elástico jalando cadera hacia atrás. Apertura total.' },
          { id: 's-mob-2', name: '90 To 90 Hip Internal Rotations', reps: '2 min / lado', detail: 'GOWOD · Caderas + Glúteos (New). Desde 90/90, lleva la rodilla trasera hacia el suelo. Rotación interna limitante en el score de caderas.' },
          { id: 's-mob-3', name: 'Banded Hip Opener', reps: '90" / lado', detail: 'GOWOD · Caderas + Aductores + Glúteos. En cuadrupedia, elástico en cadera. Abre hacia el costado. Zona más crítica del perfil.' },
          { id: 's-mob-4', name: 'Banded Hamstring Stretch', reps: '90" / lado', detail: 'GOWOD · Isquiotibiales. Score 17 → siempre presente. Post-Hyrox el músculo está caliente — ideal para ganar rango.' },
          { id: 's-mob-5', name: 'Active Cobra', reps: '60"', detail: 'GOWOD · Abs + Trapecios + Lumbares (New). Cierre de sesión. Extiende y descomprime la columna después del metcon.' },
        ]
      },
      // ── NUTRICIÓN ──
      {
        type: 'warmup', title: 'Nutrición · Día Hyrox',
        duration: 5, format: '~2300 kcal · 170g proteína · Día más largo de la semana',
        exercises: [
          { id: 's-nut-1', name: 'Desayuno', reps: '~550 kcal', detail: '3 huevos + 2 claras · Avena 60g + banana + miel (1 cdita) · Café. Sesión más larga: necesitás más combustible.' },
          { id: 's-nut-2', name: 'Almuerzo', reps: '~700 kcal', detail: '200g pollo o carne magra · Arroz integral ½ taza + papa mediana · Ensalada abundante + aceite oliva.' },
          { id: 's-nut-3', name: 'Merienda / Pre-entreno', reps: '~350 kcal', detail: '2 tostadas integrales + 2 huevos pasados + 1 banana. 60-90 min antes del Hyrox.' },
          { id: 's-nut-4', name: 'Post-entreno', reps: '~400 kcal', detail: 'Batido proteína + banana + avena 30g + leche. Recuperación rápida después del metcon más largo.' },
          { id: 's-nut-5', name: 'Cena', reps: '~350 kcal', detail: '150g salmón o pollo · Vegetales salteados · Palta (grasas buenas para recuperación nocturna).' },
          { id: 's-nut-6', name: 'Objetivo del día', reps: 'CHECK', detail: '✓ ~2300 kcal  ✓ 170g proteína  ✓ 3L agua  ✗ Sin alcohol  ✗ Sin ultraprocesados. Mañana es descanso → aprovechá para dormir 8h.' },
        ]
      },
    ]
  },

  // ─── DOMINGO · DESCANSO ────────────────────────────────────────────────────
  {
    id: 'dom', day: 'D', name: 'Domingo', type: 'rest',
    title: 'Descanso + Movilidad Larga',
    subtitle: 'Recuperacion total · Protocolo GOWOD completo',
    duration: 45,
    image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80',
    intro: 'Sin gym estructurado. Pero el domingo es el día más importante para tu movilidad: protocolo GOWOD completo de 20 min + nutrición de recuperación.',
    blocks: [
      {
        type: 'quality', title: 'Recuperacion activa', duration: 20,
        format: 'Caminata + respiracion · 20-30 min',
        exercises: [
          { id: 'd-1-1', name: 'Caminata al aire libre', reps: '20-30 min', detail: 'Ritmo cómodo. Sol si es posible. Z1 puro.' },
          { id: 'd-1-2', name: 'Respiracion diafragmatica', reps: '5 min', detail: 'Acostado, mano en pecho y otra en abdomen. Inhala 4", sostiene 2", exhala 6". Activa el sistema nervioso parasimpático.' },
        ]
      },
      // ── FLEXIBILIDAD ──
      {
        type: 'quality', title: 'Flexibilidad · Protocolo Completo',
        duration: 20, format: 'GOWOD + Paul Wade · 20 min · Todas las zonas · Sesión de la semana más importante',
        exercises: [
          { id: 'd-mob-1', name: '90 To 90', reps: '2 min / lado', detail: 'GOWOD · Caderas + Glúteos (score 37). Inicio del protocolo. Sentado, ambas piernas en 90°. Rota y sostené.' },
          { id: 'd-mob-2', name: 'Banded Hamstring Stretch', reps: '2 min / lado', detail: 'GOWOD · Isquiotibiales (score 17 → CRÍTICO). El más importante de la semana. Tomá el tiempo completo.' },
          { id: 'd-mob-3', name: 'Banded Pigeon', reps: '2 min / lado', detail: 'GOWOD · Glúteos + Caderas. Posición de paloma con elástico. Libera el piriforme y la cápsula posterior de cadera.' },
          { id: 'd-mob-4', name: 'Banded T Hip Opener', reps: '2 min / lado', detail: 'GOWOD · Caderas + Pectorales + Glúteos + Músculos Lumbares. En lunge con rotación. Apertura profunda.' },
          { id: 'd-mob-5', name: 'Active Butterfly', reps: '2 min', detail: 'GOWOD · Aductores + Caderas (New). Plantas de los pies juntas, rodillas se abren activamente.' },
          { id: 'd-mob-6', name: 'Banded Lat Stretch', reps: '90" / lado', detail: 'GOWOD · Rotadores + Hombros + Laterales. Hombros en 70 y bajando → trabajo semanal obligatorio.' },
          { id: 'd-mob-7', name: 'Extensión Dorsal con Roller', reps: '3 x 15 reps', detail: 'Paul Wade · Tórax (score 69, mejorando +12%). Mantené el progreso. Sin roller: toalla enrollada o silla.' },
          { id: 'd-mob-8', name: 'Rotación Dorsal (Paul Wade)', reps: '2 x 15 / lado', detail: 'Cierre del protocolo. Cuadrupedia, codo hacia el techo. Respirá profundo en cada rotación.' },
        ]
      },
      // ── NUTRICIÓN ──
      {
        type: 'warmup', title: 'Nutrición · Día de Descanso',
        duration: 5, format: '~1800 kcal · 170g proteína · Carbohidratos reducidos · Foco: recuperación',
        exercises: [
          { id: 'd-nut-1', name: 'Desayuno', reps: '~450 kcal', detail: '3 huevos + 2 claras revueltos · 1 tostada integral + palta · Café sin azúcar. Sin avena — menos carbohidratos hoy.' },
          { id: 'd-nut-2', name: 'Almuerzo', reps: '~550 kcal', detail: '200g salmón o caballa (omega-3 reduce inflamación) · Vegetales asados abundantes · Sin arroz ni papa. Prioridad: reducir grasa visceral.' },
          { id: 'd-nut-3', name: 'Merienda', reps: '~200 kcal', detail: 'Frutos secos sin sal (30g: nueces, almendras) + 1 manzana. Grasas buenas + fibra. Sin yogur ni lácteos si no es necesario.' },
          { id: 'd-nut-4', name: 'Cena', reps: '~400 kcal', detail: '150g pollo o pavo · Espinaca, brócoli o coliflor salteados · Aceite de oliva. Liviano, sin carbohidratos densos.' },
          { id: 'd-nut-5', name: 'Suplementacion (opcional)', reps: 'Si usas', detail: 'Proteína whey si no llegaste a 170g · Omega-3 (reduce grasa visceral) · Magnesio antes de dormir (mejora sueño y recuperación muscular).' },
          { id: 'd-nut-6', name: 'Objetivo del día', reps: 'CHECK', detail: '✓ ~1800 kcal  ✓ 170g proteína  ✓ 2.5L agua  ✗ Sin alcohol (clave para bajar grasa visceral)  ✗ Sin ultraprocesados  ✓ Dormir 8h.' },
        ]
      },
    ]
  },

]
