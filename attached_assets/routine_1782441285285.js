// TIDE — Rutina semanal · 4 días de entreno: Lun/Mié/Vie/Sáb
// Periodización: PESADO (Lun/Mié) · MODERADO (Vie) · MOTOR (Sáb)
// Martes/Jueves/Domingo = descanso (Domingo con movilidad larga)
// 3 cards: GYM + FLEXIBILIDAD + NUTRICIÓN

export const week = [

  // ─── LUNES · PUSH HORIZONTAL + TIRÓN · PESADO ──────────────────────────────
  {
    id: 'lun', day: 'L', name: 'Lunes', type: 'bigg',
    title: 'Push + Pull · Bench + Row', subtitle: 'Empuje horizontal + tirón · Día PESADO',
    duration: 62,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
    intro: 'Día PESADO (RPE 8). Bench press al límite + bent over row pesado para recuperar el patrón de tirón. Prehab de cadera/posterior antes de la fuerza. Midline con anti-rotación.',
    cards: [
      {
        id: 'gym', label: 'Gym', emoji: '🏋️', duration: 62,
        blocks: [
          {
            type: 'warmup', title: 'Calentamiento', duration: 8,
            format: 'Activación torácica + empuje + tirón',
            exercises: [
              { id: 'l-w-1', name: 'Movilidad torácica + hombro', reps: '4 min', detail: 'Cat-cow, banded dislocates, rotaciones torácicas.' },
              { id: 'l-w-2', name: 'Activación general', reps: '2 rondas', detail: '10 push ups + 10 KB swing KB8 + 10 jumping jacks.' },
              { id: 'l-w-3', name: 'Aproximación bench + row', reps: '2 sets', rest: '45"', detail: 'Bench barra vacía × 8 + 60% × 5 · Row barra vacía × 8.' },
            ]
          },
          {
            type: 'quality', title: 'Prehab · Cadera + Posterior', duration: 5,
            format: '5 min · Pre-fuerza · Mantener rango en día de empuje',
            exercises: [
              { id: 'l-prehab-1', name: 'Banded Hip Opener', reps: '45" / lado', detail: 'GOWOD · Caderas. Elástico en cadera, abre lateralmente.' },
              { id: 'l-prehab-2', name: 'Banded Hamstring Stretch', reps: '45" / lado', detail: 'GOWOD · Isquiotibiales (score 17). Mantenimiento — hoy no es leg day.' },
            ]
          },
          {
            type: 'quality', title: 'Bloque 1 · Hip Power', duration: 7,
            format: "AMRAP 7' for quality · Tema: Hip Power",
            exercises: [
              { id: 'l-1-1', name: 'American Swing (KB 20)', reps: '8 reps', detail: 'KB hasta overhead. Extensión completa de cadera.' },
              { id: 'l-1-2', name: 'Box Jumps', reps: '5 reps', detail: 'Cajón. Caída suave, step down.' },
              { id: 'l-1-3', name: 'DKB Hang Clean (2x KB 12)', reps: '5 reps', detail: 'Desde bisagra, tracción explosiva.' },
              { id: 'l-1-4', name: 'Goblet Pulse Squat (KB 20)', reps: '10 reps', detail: 'Squat profundo, dos pulsos abajo.' },
            ]
          },
          {
            type: 'strength', title: 'Bloque 2 · Bench Press', duration: 15,
            format: 'PESADO · RPE 8 · Triset · 5 rondas · Descanso 90" entre rondas',
            exercises: [
              { id: 'l-2-1', name: 'Barbell Bench Press', reps: '5 reps', rest: '0"', detail: 'Carga ~78% 1RM. RPE 8 — el press más exigente de la semana. Sin descanso → inmediato al siguiente.', target: '~54-58 kg' },
              { id: 'l-2-2', name: 'DKB Bent Over Row (2x KB 12)', reps: '8 reps', rest: '0"', detail: 'Superset inmediato. Codos hacia cadera, control excéntrico.' },
              { id: 'l-2-3', name: 'Box Jumps', reps: '6 reps', rest: '90"', detail: 'Explosivo. Luego 90" → volvés al bench.' },
            ]
          },
          {
            type: 'strength', title: 'Bloque 3 · Pull Pesado', duration: 10,
            format: 'PESADO · RPE 8 · 4 x 6 · Descanso 90" · Recupera el tirón del martes',
            exercises: [
              { id: 'l-3-1', name: 'Barbell Bent Over Row', reps: '6 reps', rest: '90"', detail: 'Tirón horizontal pesado. Tronco ~45°, barra al ombligo. RPE 8. 4 sets totales.', target: '~45-50 kg' },
              { id: 'l-3-2', name: 'Strict Pull Ups', reps: 'Máx reps', rest: '0"', detail: 'Tirón vertical. Inmediatamente después de cada set de row. Si no llegás: TRX row bien vertical.' },
            ]
          },
          {
            type: 'metcon', title: 'Bloque 4 · Hybrid Metcon', duration: 10,
            format: 'Every 90" · 6 rondas',
            exercises: [
              { id: 'l-4-1', name: 'KB Floor Press (2x KB 12)', reps: '8 reps', detail: '⚠️ Reemplaza DDB chest press. Pausa 1" abajo.' },
              { id: 'l-4-2', name: 'Burpees Over The Bar', reps: '5 reps', detail: 'Barra en suelo. Burpee + salto lateral.' },
              { id: 'l-4-3', name: 'Mountain Climbers', reps: '30"', detail: 'Desde plank alto. Ritmo constante.' },
              { id: 'l-4-4', name: 'DKB Thruster (2x KB 12)', reps: '5 reps', detail: 'Squat + press overhead encadenado.' },
            ]
          },
          {
            type: 'finisher', title: 'Bloque 5 · Midline + Anti-Rotación', duration: 7,
            format: 'Every 90" x 5 rondas · Rotar ejercicios',
            exercises: [
              { id: 'l-5-1', name: 'Hollow Hold', reps: '40"', detail: 'Lumbar pegada al suelo. Brazos y piernas extendidos.' },
              { id: 'l-5-2', name: 'Tuck Ups', reps: '15 reps', detail: 'Knees to chest desde hollow.' },
              { id: 'l-5-3', name: 'DDB Pallof Press', reps: '10/lado', detail: 'Anti-rotación. Elástico desde el costado, empujá al frente sin rotar el tronco.' },
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
              { id: 'l-mob-1', name: 'Banded Hamstring Stretch', reps: '90" / lado', detail: 'GOWOD · Isquiotibiales. Score 17 → CRÍTICO.' },
              { id: 'l-mob-2', name: '90 To 90', reps: '2 min / lado', detail: 'GOWOD · Caderas + Glúteos (score 37). Sentado en 90°.' },
              { id: 'l-mob-3', name: 'Banded Overhead Fixer', reps: '90"', detail: 'GOWOD · Pectorales + Hombros (score 70).' },
              { id: 'l-mob-4', name: 'Rotación Dorsal (Paul Wade)', reps: '2 x 15 / lado', detail: 'Cuadrupedia, codo hacia el techo.' },
            ]
          },
        ]
      },
      {
        id: 'nut', label: 'Nutrición', emoji: '🥗', duration: 5,
        blocks: [
          {
            type: 'warmup', title: 'Nutrición · Día PESADO', duration: 5,
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

  // ─── MARTES · DESCANSO ─────────────────────────────────────────────────────
  {
    id: 'mar', day: 'M', name: 'Martes', type: 'rest',
    title: 'Descanso', subtitle: 'Recuperación entre días pesados',
    duration: 15,
    image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80',
    intro: 'Día de descanso entre el lunes y el miércoles pesados. Movilidad opcional ligera si te sentís cargado, nada más.',
    cards: [
      {
        id: 'flex', label: 'Flexibilidad', emoji: '🧘', duration: 12,
        blocks: [
          {
            type: 'quality', title: 'Movilidad opcional · Caderas + Posterior', duration: 12,
            format: 'GOWOD · 12 min · Solo si te sentís cargado · Sin intensidad',
            exercises: [
              { id: 'ma-mob-1', name: '90 To 90 Hip External Rotations', reps: '2 min / lado', detail: 'GOWOD · Caderas + Glúteos. Suave, sin forzar.' },
              { id: 'ma-mob-2', name: 'Banded Hip Opener', reps: '90" / lado', detail: 'GOWOD · Caderas + Aductores + Glúteos.' },
              { id: 'ma-mob-3', name: 'Banded Hamstring Stretch', reps: '90" / lado', detail: 'GOWOD · Isquiotibiales (score 17). Recuperación entre días pesados.' },
              { id: 'ma-mob-4', name: 'Active Cobra', reps: '60"', detail: 'GOWOD · Lumbares + Trapecios. Descomprime la columna.' },
            ]
          },
        ]
      },
      {
        id: 'nut', label: 'Nutrición', emoji: '🥗', duration: 5,
        blocks: [
          {
            type: 'warmup', title: 'Nutrición · Día de Descanso', duration: 5,
            format: '~1900 kcal · 170g proteína · Carbohidratos moderados',
            exercises: [
              { id: 'ma-nut-1', name: 'Desayuno', reps: '~450 kcal', detail: '3 huevos + 2 claras · 1 tostada integral + palta · Café.' },
              { id: 'ma-nut-2', name: 'Almuerzo', reps: '~600 kcal', detail: '180g pollo o pescado · Arroz integral ½ taza · Ensalada grande.' },
              { id: 'ma-nut-3', name: 'Merienda', reps: '~250 kcal', detail: 'Yogur griego 200g + frutos secos 20g.' },
              { id: 'ma-nut-4', name: 'Cena', reps: '~450 kcal', detail: '150g salmón o carne magra · Verduras salteadas. Recuperación muscular.' },
              { id: 'ma-nut-5', name: 'Objetivo del día', reps: 'CHECK', detail: '✓ ~1900 kcal  ✓ 170g proteína  ✓ 2.5L agua  ✗ Sin alcohol  ✓ Dormir 8h.' },
            ]
          },
        ]
      },
    ]
  },

  // ─── MIÉRCOLES · LEGS · SQUAT + HIP THRUST · PESADO ────────────────────────
  {
    id: 'mie', day: 'M', name: 'Miércoles', type: 'bigg',
    title: 'Legs · Squat + Hip Thrust', subtitle: 'Cuadriceps + gluteo + posterior · Día PESADO',
    duration: 55,
    image: 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=800&q=80',
    intro: 'Segundo día PESADO (RPE 8). Back squat al límite con ladder. Trabajo unilateral fuerte (Cossack, single-leg RDL) — el día más completo en estabilidad de pierna.',
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
              { id: 'mi-1-2', name: 'Single-Leg Glute Bridge', reps: '10/lado', detail: 'Unilateral. Una pierna extendida, sube cadera.' },
              { id: 'mi-1-3', name: 'DKB Cossack Squat (2x KB 8)', reps: '6/lado', detail: 'Unilateral lateral profundo. KB frente al pecho.' },
              { id: 'mi-1-4', name: 'Banded Squat', reps: '15 reps', detail: 'Elástico en rodillas. Empuja rodillas afuera.' },
            ]
          },
          {
            type: 'strength', title: 'Bloque 2 · Back Squat', duration: 14,
            format: 'PESADO · RPE 8 · Ladder 8-6-4-2 · Subís ~5 kg por set · Wall Ball como descanso activo',
            exercises: [
              { id: 'mi-2-1', name: 'Back Squat Set 1', reps: '8 reps → Wall Ball 10', detail: 'Carga ~68% 1RM. Inmediato: 10 Wall Ball → descanso 60".', target: '~42 kg' },
              { id: 'mi-2-2', name: 'Back Squat Set 2', reps: '6 reps → Wall Ball 10', detail: 'Subís ~5 kg. RPE 7-8. Inmediato: 10 Wall Ball → descanso 60".', target: '~47 kg' },
              { id: 'mi-2-3', name: 'Back Squat Set 3', reps: '4 reps → Wall Ball 10', detail: 'Subís ~5 kg más. RPE 8. Inmediato: 10 Wall Ball → descanso 75".', target: '~52 kg' },
              { id: 'mi-2-4', name: 'Back Squat Set 4', reps: '2 reps → Wall Ball 10', detail: 'Peso máximo del día. RPE 9. Inmediato: 10 Wall Ball → descanso 90".', target: '~57 kg' },
              { id: 'mi-2-5', name: 'DKB Front Rack Lunges (2x KB 12)', reps: '2 x 8/8 reps', rest: '60"', detail: 'Unilateral. Accesorio final. Torso recto, paso largo.' },
            ]
          },
          {
            type: 'metcon', title: 'Bloque 3 · Hybrid Metcon', duration: 12,
            format: 'Every 90" · 8 rondas',
            exercises: [
              { id: 'mi-3-1', name: 'Barbell Hip Thrust', reps: '8 reps', detail: 'Espalda alta en banco. Pausa 1" arriba.', target: '~50-60 kg' },
              { id: 'mi-3-2', name: 'Jumping Lunges', reps: '10 reps (5/lado)', detail: 'Unilateral. Salto con cambio de pierna.' },
              { id: 'mi-3-3', name: 'SKB Single-Leg Deadlift (KB 12)', reps: '6/lado', detail: 'Unilateral. Bisagra. Control del balance.' },
              { id: 'mi-3-4', name: 'Wall Ball (pelota 10 kg)', reps: '10 reps', detail: 'Squat profundo + lanzar pelota a pared ~3m.' },
              { id: 'mi-3-5', name: 'Lateral Bounds / Skater Jumps', reps: '10 reps (5/lado)', detail: 'Unilateral. Salto lateral, caes a un pie.' },
              { id: 'mi-3-6', name: 'MB Rotational Slam (pelota 10 kg)', reps: '8 reps', detail: 'Pelota overhead, gira y slam lateral. 4/lado.' },
            ]
          },
          {
            type: 'finisher', title: 'Bloque 4 · Midline + Rotacional', duration: 7,
            format: 'Complete 1 a 10 · 2 ejercicios + cierre rotacional',
            exercises: [
              { id: 'mi-4-1', name: 'Tuck Ups', reps: '1→10 reps', detail: 'Knees to chest desde hollow. Una rep más por ronda.' },
              { id: 'mi-4-2', name: 'Sit Ups', reps: '1→10 reps', detail: 'Completos, pies libres. Misma cantidad que Tuck Ups.' },
              { id: 'mi-4-3', name: 'MB Russian Twist (pelota 10 kg)', reps: '20 reps (10/lado)', detail: 'Rotacional. Tronco a 45°, gira controlado de lado a lado.' },
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
              { id: 'mi-mob-1', name: 'Banded Knight Stretch', reps: '2 min / lado', detail: 'GOWOD · Caderas + Cuádriceps. En lunge bajo con elástico.' },
              { id: 'mi-mob-2', name: 'Banded Pigeon', reps: '2 min / lado', detail: 'GOWOD · Glúteos + Caderas. Posición paloma con elástico.' },
              { id: 'mi-mob-3', name: '0 To 90', reps: '2 min / lado', detail: 'GOWOD · Caderas + Glúteos. Movimiento activo de 0° a 90°.' },
              { id: 'mi-mob-4', name: '90 To 90 Rotation', reps: '90" / lado', detail: 'GOWOD · Caderas. En 90/90, rota tronco hacia pierna delantera.' },
              { id: 'mi-mob-5', name: 'Banded Squat On Wall', reps: '90"', detail: 'GOWOD · Caderas + Aductores. Contra la pared con elástico.' },
            ]
          },
        ]
      },
      {
        id: 'nut', label: 'Nutrición', emoji: '🥗', duration: 5,
        blocks: [
          {
            type: 'warmup', title: 'Nutrición · Día PESADO', duration: 5,
            format: '~2250 kcal · 170g proteína',
            exercises: [
              { id: 'mi-nut-1', name: 'Desayuno', reps: '~500 kcal', detail: '3 huevos + 2 claras · Avena 50g + banana · Café sin azúcar.' },
              { id: 'mi-nut-2', name: 'Almuerzo', reps: '~700 kcal', detail: '200g pollo · Arroz ½ taza + lentejas ¼ taza · Ensalada. Piernas necesitan carbohidratos.' },
              { id: 'mi-nut-3', name: 'Merienda', reps: '~300 kcal', detail: 'Yogur griego 200g + banana + miel (1 cdita). Carbos rápidos antes del squat.' },
              { id: 'mi-nut-4', name: 'Post-entreno', reps: '~400 kcal', detail: 'Batido proteína + banana + leche. Recuperación rápida tras la ladder.' },
              { id: 'mi-nut-5', name: 'Cena', reps: '~400 kcal', detail: '150g carne magra o pollo · Vegetales asados abundantes.' },
              { id: 'mi-nut-6', name: 'Objetivo del día', reps: 'CHECK', detail: '✓ ~2250 kcal  ✓ 170g proteína  ✓ 2.5L agua  ✗ Sin alcohol  ✗ Sin ultraprocesados' },
            ]
          },
        ]
      },
    ]
  },

  // ─── JUEVES · DESCANSO ─────────────────────────────────────────────────────
  {
    id: 'jue', day: 'J', name: 'Jueves', type: 'rest',
    title: 'Descanso', subtitle: 'Recuperación pre-viernes',
    duration: 15,
    image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80',
    intro: 'Día de descanso después del miércoles pesado. Caminata suave o movilidad opcional. Si querés meter cardio liviano por tu cuenta (caminar, trote suave), este es buen día.',
    cards: [
      {
        id: 'flex', label: 'Flexibilidad', emoji: '🧘', duration: 12,
        blocks: [
          {
            type: 'quality', title: 'Movilidad opcional · Hombros + Tórax', duration: 12,
            format: 'GOWOD + Paul Wade · 12 min · Opcional · Preparación para el viernes',
            exercises: [
              { id: 'ju-mob-1', name: 'Banded Overhead Fixer', reps: '90"', detail: 'GOWOD · Pectorales + Hombros. Prepara el hombro para el shoulder press de mañana.' },
              { id: 'ju-mob-2', name: 'Banded Lat Stretch', reps: '90" / lado', detail: 'GOWOD · Rotadores + Hombros (score 70, bajando).' },
              { id: 'ju-mob-3', name: 'Extensión Dorsal con Roller', reps: '3 x 15 reps', detail: 'Paul Wade · Tórax (score 69). Sin roller: toalla enrollada.' },
              { id: 'ju-mob-4', name: 'Banded Hamstring Stretch', reps: '90" / lado', detail: 'GOWOD · Isquiotibiales (score 17). Mantenimiento.' },
            ]
          },
        ]
      },
      {
        id: 'nut', label: 'Nutrición', emoji: '🥗', duration: 5,
        blocks: [
          {
            type: 'warmup', title: 'Nutrición · Día de Descanso', duration: 5,
            format: '~1900 kcal · 170g proteína · Carbohidratos moderados',
            exercises: [
              { id: 'ju-nut-1', name: 'Desayuno', reps: '~450 kcal', detail: '3 huevos + 2 claras · 1 tostada integral + palta · Café.' },
              { id: 'ju-nut-2', name: 'Almuerzo', reps: '~600 kcal', detail: '180g pollo o pescado · Arroz integral ½ taza · Ensalada grande.' },
              { id: 'ju-nut-3', name: 'Merienda', reps: '~250 kcal', detail: 'Yogur griego 200g + frutos secos 20g.' },
              { id: 'ju-nut-4', name: 'Cena', reps: '~450 kcal', detail: '150g salmón o carne magra · Verduras salteadas.' },
              { id: 'ju-nut-5', name: 'Objetivo del día', reps: 'CHECK', detail: '✓ ~1900 kcal  ✓ 170g proteína  ✓ 2.5L agua  ✗ Sin alcohol  ✓ Dormir 8h.' },
            ]
          },
        ]
      },
    ]
  },

  // ─── VIERNES · PUSH VERTICAL + PULL VERTICAL · MODERADO ────────────────────
  {
    id: 'vie', day: 'V', name: 'Viernes', type: 'bigg',
    title: 'Push + Pull Vertical', subtitle: 'Shoulder Press + dominadas · Día MODERADO',
    duration: 60,
    image: 'https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?w=800&q=80',
    intro: 'Día MODERADO (RPE 6-7). Shoulder Press + Weighted Pull Ups dedicados — el tirón vertical real que se perdió al sacar el martes. Prehab de cadera/posterior antes. Unilateral en B1.',
    cards: [
      {
        id: 'gym', label: 'Gym', emoji: '🏋️', duration: 60,
        blocks: [
          {
            type: 'warmup', title: 'Calentamiento', duration: 8,
            format: 'Activación hombro + movilidad torácica',
            exercises: [
              { id: 'v-w-1', name: 'Movilidad torácica + hombro', reps: '4 min', detail: 'Rotaciones torácicas, banded dislocates, lat stretch.' },
              { id: 'v-w-2', name: 'Activación general', reps: '2 rondas', detail: '10 push ups + 10 KB swing KB8 + 10 jumping jacks.' },
              { id: 'v-w-3', name: 'Aproximación shoulder press', reps: '2 sets', rest: '45"', detail: 'Barra vacía x 8 + 50% 1RM x 5.' },
            ]
          },
          {
            type: 'quality', title: 'Prehab · Cadera + Posterior', duration: 5,
            format: '5 min · Pre-fuerza · Mantener rango en día de empuje',
            exercises: [
              { id: 'v-prehab-1', name: 'Banded Hip Opener', reps: '45" / lado', detail: 'GOWOD · Caderas. Mantenimiento rápido.' },
              { id: 'v-prehab-2', name: 'Banded Hamstring Stretch', reps: '45" / lado', detail: 'GOWOD · Isquiotibiales (score 17). Mantenimiento.' },
            ]
          },
          {
            type: 'quality', title: 'Bloque 1 · Push Control + Unilateral', duration: 7,
            format: "AMRAP 7' for quality · Tema: Push Control",
            exercises: [
              { id: 'v-1-1', name: 'KB Kneeling Halo (KB 12)', reps: '6/6 reps', detail: 'Arrodillado, círculo lento alrededor de la cabeza.' },
              { id: 'v-1-2', name: 'Push Up Hold', reps: '5 reps x 3"', detail: 'Baja lento 3", pausa en el fondo.' },
              { id: 'v-1-3', name: 'Scapular Pull Ups (TRX)', reps: '8 reps', detail: 'Activa escápulas antes del tirón.' },
              { id: 'v-1-4', name: 'SKB Single-Leg Deadlift (KB 12)', reps: '6/lado', detail: 'Unilateral. Distribuye el trabajo de pierna en la semana.' },
            ]
          },
          {
            type: 'strength', title: 'Bloque 2 · Shoulder Press + Pull Vertical', duration: 14,
            format: 'MODERADO · RPE 6-7 · Every 2\' · 6 rondas · Press + dominada alternados',
            exercises: [
              { id: 'v-2-1', name: 'Barbell Shoulder Press', reps: '6 reps · Rondas impares', detail: 'Carga ~65% 1RM. Prensa estricta, sin arco lumbar. Rondas 1-3-5.', target: '~38 kg' },
              { id: 'v-2-2', name: 'Weighted Strict Pull Ups', reps: '5 reps · Rondas pares', detail: 'Tirón vertical pesado real con progresión de carga (KB colgada o bodyweight). Rondas 2-4-6. El reemplazo del deadlift del martes en patrón de tirón.', target: 'BW o +KB8' },
            ]
          },
          {
            type: 'metcon', title: 'Bloque 3 · Hybrid Metcon', duration: 13,
            format: "AMRAP 13' · 7 movimientos",
            exercises: [
              { id: 'v-3-1', name: 'Barbell Push Press', reps: '5 reps', detail: 'Asistencia de piernas, bloqueo arriba.', target: '~35 kg' },
              { id: 'v-3-2', name: 'Box Jumps', reps: '8 reps', detail: 'Cajón. Rebote suave o step down.' },
              { id: 'v-3-3', name: 'TRX Row (estricto)', reps: '10 reps', detail: 'Pull horizontal. Compensación del empuje.' },
              { id: 'v-3-4', name: 'Burpee Broad Jump', reps: '5 reps', detail: 'Pecho al suelo + salto hacia adelante.' },
              { id: 'v-3-5', name: 'American Swing (KB 20)', reps: '12 reps', detail: 'KB hasta overhead. Extensión completa.' },
              { id: 'v-3-6', name: 'Jumping Curtsy Lunges', reps: '10 reps (5/lado)', detail: 'Unilateral. Estocada cruzada con salto.' },
              { id: 'v-3-7', name: 'Pogo Jumps', reps: '20 reps', detail: 'Saltos rápidos en tobillo. Mínima flexión.' },
            ]
          },
          {
            type: 'finisher', title: 'Bloque 4 · Midline + Rotacional', duration: 7,
            format: 'Every 60" x 7 rondas · Rotar 4 ejercicios',
            exercises: [
              { id: 'v-4-1', name: 'Hollow Hold', reps: '40"', detail: 'Lumbar pegada. Brazos y piernas a 45°.' },
              { id: 'v-4-2', name: 'V-Sit Ups', reps: '15 reps', detail: 'Sube tronco y piernas al mismo tiempo.' },
              { id: 'v-4-3', name: 'Leg Levers', reps: '12 reps', detail: 'Piernas rectas, suben y bajan lento.' },
              { id: 'v-4-4', name: 'DDB Pallof Press Rotacional', reps: '10/lado', detail: 'Anti-rotación con giro. Carryover a golf/rugby.' },
            ]
          },
        ]
      },
      {
        id: 'flex', label: 'Flexibilidad', emoji: '🧘', duration: 12,
        blocks: [
          {
            type: 'quality', title: 'Flexibilidad · Hombros + Tórax', duration: 12,
            format: 'GOWOD + Paul Wade · 12 min · Overhead 70 bajando → invertir',
            exercises: [
              { id: 'v-mob-1', name: 'Banded Overhead Fixer', reps: '90"', detail: 'GOWOD · Pectorales + Hombros.' },
              { id: 'v-mob-2', name: 'Banded Lat Stretch', reps: '90" / lado', detail: 'GOWOD · Rotadores + Hombros.' },
              { id: 'v-mob-3', name: 'Banded Shoulder Strap', reps: '90" / lado', detail: 'GOWOD · Hombros + Pectorales.' },
              { id: 'v-mob-4', name: 'Rotación Dorsal (Paul Wade)', reps: '2 x 15 / lado', detail: 'Cuadrupedia, codo hacia el techo.' },
            ]
          },
        ]
      },
      {
        id: 'nut', label: 'Nutrición', emoji: '🥗', duration: 5,
        blocks: [
          {
            type: 'warmup', title: 'Nutrición · Día MODERADO', duration: 5,
            format: '~2100 kcal · 170g proteína',
            exercises: [
              { id: 'v-nut-1', name: 'Desayuno', reps: '~500 kcal', detail: '3 huevos + 2 claras · Avena 50g + fruta · Café sin azúcar.' },
              { id: 'v-nut-2', name: 'Almuerzo', reps: '~650 kcal', detail: '180g pollo o carne magra · Papa o arroz · Ensalada.' },
              { id: 'v-nut-3', name: 'Merienda', reps: '~300 kcal', detail: 'Yogur griego 200g + fruta.' },
              { id: 'v-nut-4', name: 'Post-entreno', reps: '~300 kcal', detail: 'Batido proteína + banana + leche.' },
              { id: 'v-nut-5', name: 'Cena', reps: '~400 kcal', detail: '150g pescado o pollo · Vegetales salteados.' },
              { id: 'v-nut-6', name: 'Objetivo del día', reps: 'CHECK', detail: '✓ ~2100 kcal  ✓ 170g proteína  ✓ 2.5L agua  ✗ Sin alcohol  ✗ Sin ultraprocesados' },
            ]
          },
        ]
      },
    ]
  },

  // ─── SÁBADO · HYROX-STYLE + CARDIO · MOTOR ─────────────────────────────────
  {
    id: 'sab', day: 'S', name: 'Sabado', type: 'bigg',
    title: 'Hyrox-style + Cardio', subtitle: 'Hibrido completo + intervalos · Día MOTOR',
    duration: 63,
    image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&q=80',
    intro: 'Día MOTOR — cargas livianas, foco en velocidad. Front squat rápido + metcon Hyrox. Cierra con un finisher de intervalos 8\' que recupera el estímulo VO2max del jueves perdido.',
    cards: [
      {
        id: 'gym', label: 'Gym', emoji: '🏋️', duration: 63,
        blocks: [
          {
            type: 'warmup', title: 'Calentamiento', duration: 8,
            format: 'Activación full body + específico front squat',
            exercises: [
              { id: 's-w-1', name: 'Movilidad general', reps: '4 min', detail: "Cadera, hombro, tórax." },
              { id: 's-w-2', name: 'Activación', reps: '2 rondas', detail: '10 air squats + 10 push ups + 10 KB swing KB8 + 5 burpees.' },
              { id: 's-w-3', name: 'Específico front squat', reps: '2 sets', rest: '30"', detail: 'Front squat barra vacía x 5 + hang power clean x 5.' },
            ]
          },
          {
            type: 'quality', title: 'Bloque 1 · Back Power', duration: 7,
            format: "AMRAP 7' for quality · Tema: Back Power",
            exercises: [
              { id: 's-1-1', name: 'Russian Swing (KB 20)', reps: '8 reps', detail: 'KB hasta pecho. Explosión de cadera pura.' },
              { id: 's-1-2', name: 'DKB Bent Over Row (2x KB 12)', reps: '6 reps', detail: 'Tronco horizontal, codos altos.' },
              { id: 's-1-3', name: 'SKB Single-Arm Overhead Carry (KB 20)', reps: '20 pasos/lado', detail: 'KB overhead. Estabilidad hombro y core.' },
              { id: 's-1-4', name: 'Walkouts', reps: '4 reps', detail: 'Desde de pie, manos al suelo, camina a plank.' },
            ]
          },
          {
            type: 'strength', title: 'Bloque 2 · Front Squat', duration: 10,
            format: 'MOTOR · RPE 6 · AMRAP 10\' · 5 ejercicios · Carga liviana, velocidad alta',
            exercises: [
              { id: 's-2-1', name: 'Barbell Front Squat', reps: '6 reps', detail: 'Carga ~62% 1RM. Liviano y rápido — foco en velocidad de salida.', target: '~36-38 kg' },
              { id: 's-2-2', name: 'Strict Chin Ups', reps: '5 reps', detail: 'Agarre supino. Completo rango. Sin kipping.' },
              { id: 's-2-3', name: 'DKB Push Press (2x KB 12)', reps: '8 reps', detail: 'Empuje explosivo desde el rack.' },
              { id: 's-2-4', name: 'Box Jumps', reps: '6 reps', detail: 'Explosivos.' },
              { id: 's-2-5', name: 'Burpee Broad Jump', reps: '4 reps', detail: 'Pecho al suelo + salto lo más lejos posible.' },
            ]
          },
          {
            type: 'metcon', title: 'Bloque 3 · Long Metcon · Hyrox', duration: 13,
            format: "AMRAP 13' · Objetivo 1-2 rondas · 8 movimientos",
            exercises: [
              { id: 's-3-1', name: 'Barbell Hang Power Clean', reps: '5 reps', detail: 'Explosivo desde encima de rodilla.', target: '~42 kg' },
              { id: 's-3-2', name: 'DKB Front Rack March (2x KB 12)', reps: '20 pasos', detail: 'Carry en rack, pasos altos.' },
              { id: 's-3-3', name: 'Burpee Box Jump', reps: '8 reps', detail: 'Burpee completo + box jump encadenado.' },
              { id: 's-3-4', name: 'Goblet Thrusters (KB 20)', reps: '8 reps', detail: 'Squat profundo + press overhead.' },
              { id: 's-3-5', name: 'Band-Assisted Pull Ups', reps: '8 reps', detail: 'Elástico en barra del rack.' },
              { id: 's-3-6', name: 'MB Devil Press (pelota 5 kg)', reps: '6 reps', detail: '⚠️ Pelota en lugar de DDB.' },
              { id: 's-3-7', name: 'DKB Farmer March (2x KB 20)', reps: '20 pasos', detail: 'Máxima carga. Simula Farmer Carry.' },
              { id: 's-3-8', name: 'Jumping Squats', reps: '12 reps', detail: 'Sin peso. Máxima explosión.' },
            ]
          },
          {
            type: 'metcon', title: 'Bloque 4 · Cardio Finisher · VO2max', duration: 8,
            format: 'Intervalos 8\' · Recupera el estímulo VO2max del jueves · 30/30 con soga o sprint',
            exercises: [
              { id: 's-4-1', name: 'Soga alta intensidad', reps: '30" ON x 8', detail: '⚠️ Reemplaza machine/air bike. Doble salto si podés. Máximo ritmo. Alterna con descanso.' },
              { id: 's-4-2', name: 'Recuperación activa', reps: '30" OFF x 8', detail: 'Soga lenta o marcha en el lugar. No pares del todo. Pulso baja pero seguís moviéndote.' },
              { id: 's-4-3', name: 'Alternativa: Shuttle Runs', detail: 'Si tenés espacio: corré 10m ida y vuelta a máxima velocidad durante los 30" ON, en lugar de la soga. Más parecido al Hyrox real.' },
            ]
          },
          {
            type: 'finisher', title: 'Bloque 5 · Midline + Rotacional', duration: 7,
            format: '45" ON / 15" OFF · 2 rondas · 3 ejercicios',
            exercises: [
              { id: 's-5-1', name: 'Zombie Sit Ups', reps: '45"', detail: 'Desde suelo, brazos overhead, sube sin inercia.' },
              { id: 's-5-2', name: 'MB Lateral Slam (pelota 10 kg)', reps: '45"', detail: 'Rotacional/explosivo. Pelota desde cadera hacia el suelo lateral, alterna lados.' },
              { id: 's-5-3', name: 'Dead Bug Progressions', reps: '45"', detail: 'Brazo y pierna opuestos, lentos. Lumbar neutral.' },
            ]
          },
        ]
      },
      {
        id: 'flex', label: 'Flexibilidad', emoji: '🧘', duration: 13,
        blocks: [
          {
            type: 'quality', title: 'Flexibilidad · Full Body Recovery', duration: 13,
            format: 'GOWOD · 13 min · Prepara el cuerpo para el descanso del domingo',
            exercises: [
              { id: 's-mob-1', name: 'Banded Reverse T Hip Opener', reps: '2 min / lado', detail: 'GOWOD · Caderas + Pectorales + Glúteos + Lumbares.' },
              { id: 's-mob-2', name: '90 To 90 Hip Internal Rotations', reps: '2 min / lado', detail: 'GOWOD · Caderas + Glúteos.' },
              { id: 's-mob-3', name: 'Banded Hip Opener', reps: '90" / lado', detail: 'GOWOD · Caderas + Aductores.' },
              { id: 's-mob-4', name: 'Banded Hamstring Stretch', reps: '90" / lado', detail: 'GOWOD · Isquiotibiales (score 17).' },
              { id: 's-mob-5', name: 'Active Cobra', reps: '60"', detail: 'GOWOD · Lumbares. Cierre de sesión.' },
            ]
          },
        ]
      },
      {
        id: 'nut', label: 'Nutrición', emoji: '🥗', duration: 5,
        blocks: [
          {
            type: 'warmup', title: 'Nutrición · Día MOTOR', duration: 5,
            format: '~2200 kcal · 170g proteína',
            exercises: [
              { id: 's-nut-1', name: 'Desayuno', reps: '~500 kcal', detail: '3 huevos + 2 claras · Avena 50g + banana + miel · Café.' },
              { id: 's-nut-2', name: 'Almuerzo', reps: '~650 kcal', detail: '200g pollo o carne · Arroz ½ taza + papa mediana · Ensalada.' },
              { id: 's-nut-3', name: 'Merienda / Pre-entreno', reps: '~300 kcal', detail: '2 tostadas + 2 huevos + 1 banana.' },
              { id: 's-nut-4', name: 'Post-entreno', reps: '~400 kcal', detail: 'Batido proteína + banana + avena 30g + leche.' },
              { id: 's-nut-5', name: 'Cena', reps: '~350 kcal', detail: '150g salmón o pollo · Vegetales · Palta.' },
              { id: 's-nut-6', name: 'Objetivo del día', reps: 'CHECK', detail: '✓ ~2200 kcal  ✓ 170g proteína  ✓ 3L agua  ✗ Sin alcohol. Dormí 8h → mañana descansás.' },
            ]
          },
        ]
      },
    ]
  },

  // ─── DOMINGO · DESCANSO + MOVILIDAD LARGA ──────────────────────────────────
  {
    id: 'dom', day: 'D', name: 'Domingo', type: 'rest',
    title: 'Descanso + Movilidad', subtitle: 'Recuperación total · GOWOD completo',
    duration: 45,
    image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80',
    intro: 'Sin gym. Cierra la semana de 4 días con el protocolo GOWOD completo de 20 min. El descanso bien manejado es tan importante como el estímulo.',
    cards: [
      {
        id: 'flex', label: 'Flexibilidad', emoji: '🧘', duration: 20,
        blocks: [
          {
            type: 'quality', title: 'Recuperación activa', duration: 5,
            format: 'Opcional · 20-30 min suave',
            exercises: [
              { id: 'd-1-1', name: 'Caminata al aire libre', reps: '20-30 min', detail: 'Ritmo cómodo. Sol si es posible.' },
              { id: 'd-1-2', name: 'Respiración diafragmática', reps: '5 min', detail: 'Inhala 4", sostiene 2", exhala 6".' },
            ]
          },
          {
            type: 'quality', title: 'Protocolo GOWOD Completo', duration: 20,
            format: 'GOWOD + Paul Wade · 20 min · Todas las zonas',
            exercises: [
              { id: 'd-mob-1', name: '90 To 90', reps: '2 min / lado', detail: 'GOWOD · Caderas (score 37).' },
              { id: 'd-mob-2', name: 'Banded Hamstring Stretch', reps: '2 min / lado', detail: 'GOWOD · Isquiotibiales (score 17 → CRÍTICO).' },
              { id: 'd-mob-3', name: 'Banded Pigeon', reps: '2 min / lado', detail: 'GOWOD · Glúteos + Caderas.' },
              { id: 'd-mob-4', name: 'Banded T Hip Opener', reps: '2 min / lado', detail: 'GOWOD · Caderas + Pectorales + Glúteos + Lumbares.' },
              { id: 'd-mob-5', name: 'Active Butterfly', reps: '2 min', detail: 'GOWOD · Aductores + Caderas.' },
              { id: 'd-mob-6', name: 'Banded Lat Stretch', reps: '90" / lado', detail: 'GOWOD · Rotadores + Hombros (score 70).' },
              { id: 'd-mob-7', name: 'Extensión Dorsal con Roller', reps: '3 x 15 reps', detail: 'Paul Wade · Tórax (score 69, +12%).' },
              { id: 'd-mob-8', name: 'Rotación Dorsal (Paul Wade)', reps: '2 x 15 / lado', detail: 'Cierre del protocolo.' },
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
              { id: 'd-nut-5', name: 'Suplementación (opcional)', reps: 'Si usás', detail: 'Whey si no llegaste a 170g · Omega-3 · Magnesio.' },
              { id: 'd-nut-6', name: 'Objetivo del día', reps: 'CHECK', detail: '✓ ~1800 kcal  ✓ 170g proteína  ✓ 2.5L agua  ✗ Sin alcohol  ✓ Dormir 8h.' },
            ]
          },
        ]
      },
    ]
  },

]
