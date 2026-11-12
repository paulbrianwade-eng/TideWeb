import type { Exercise } from '../types';
import { x } from './ex-helpers';

/** Ejercicios presentes en la programación del ZIP que faltaban en TIDE. */
export const ZIP_EXERCISES: Exercise[] = [
  x('block-run', 'Vuelta a la manzana', {
    cat: ['Running'], obj: 'Transición cardiovascular sostenida entre bloques.',
    cap: ['Capacidad aeróbica'], tgt: ['Sistema cardiovascular'], mod: ['running'], typ: '1 vuelta · RPE 6–7',
    cues: ['No es sprint.', 'Ritmo parejo.', 'Volvé listo para el bloque siguiente.'],
    err: ['Salir a fondo', 'Llegar sin recuperar el control'], reg: 'Trote y caminata.', pro: 'Ritmo sostenido más rápido.', eq: ['Exterior'],
  }),
  x('kb-snatch', 'KB Snatch', {
    cat: ['Potencia', 'Unilateral'], obj: 'Potencia unilateral desde la cadera hasta overhead.',
    cap: ['Potencia', 'Unilateral'], tgt: ['Cadera', 'Hombro', 'Core'], typ: '4–6 por lado',
    cues: ['Kettlebell pegada.', 'Punch arriba.', 'La cadera inicia.'], err: ['Golpear el antebrazo', 'Tirar solo con el brazo'],
    reg: 'KB clean.', pro: 'Clean + snatch.', eq: ['Kettlebell'],
  }),
  x('clean-high-pull', 'Clean High Pull', {
    cat: ['Potencia'], obj: 'Triple extensión sin exigir la recepción completa del clean.',
    cap: ['Potencia'], tgt: ['Glúteos', 'Cuádriceps', 'Trapecio'], typ: '3–5 repeticiones',
    cues: ['Empujá el piso.', 'Terminá cadera y rodillas.', 'Barra cerca.'], err: ['Remar demasiado pronto', 'Alejar la barra'],
    reg: 'Clean pull.', pro: 'Hang clean.', eq: ['Barra'],
  }),
  x('front-rack-reverse-lunge', 'Front Rack Reverse Lunge', {
    cat: ['Unilateral', 'Fuerza'], obj: 'Estocada unilateral con demanda de tronco y desaceleración.',
    cap: ['Unilateral', 'Desaceleración'], tgt: ['Glúteos', 'Cuádriceps', 'Core'], typ: '6–8 por lado',
    cues: ['Paso atrás largo.', 'Tronco firme.', 'Empujá el piso al volver.'], err: ['Rodilla colapsada', 'Perder el rack'],
    reg: 'Reverse lunge con KB.', pro: 'Más carga.', eq: ['Barra'],
  }),
  x('push-jerk', 'Push Jerk', {
    cat: ['Potencia'], obj: 'Transferir fuerza del suelo a overhead con recepción estable.',
    cap: ['Potencia'], tgt: ['Piernas', 'Hombros', 'Core'], typ: '3–5 repeticiones',
    cues: ['Dip vertical.', 'Drive rápido.', 'Recibí con rodillas blandas.'], err: ['Press lento', 'Dip hacia adelante'],
    reg: 'Push press.', pro: 'Más velocidad con la misma carga.', eq: ['Barra'],
  }),
  x('split-jump', 'Split Jump', {
    cat: ['Potencia', 'Unilateral'], obj: 'Potencia reactiva unilateral y cambio rápido de apoyo.',
    cap: ['Potencia', 'Absorción de impacto'], tgt: ['Piernas', 'Tobillo'], typ: '6–10 total',
    cues: ['Salto vertical.', 'Caída suave.', 'Rodilla alineada.'], err: ['Caída rígida', 'Rodilla hacia adentro'],
    reg: 'Split squat rápido.', pro: 'Mayor altura.', eq: ['Peso corporal'],
  }),
  x('clean-pull', 'Clean Pull', {
    cat: ['Potencia'], obj: 'Aceleración de barra y triple extensión con baja complejidad.',
    cap: ['Potencia'], tgt: ['Cadena posterior', 'Cuádriceps', 'Trapecio'], typ: '3–5 repeticiones',
    cues: ['Barra cerca.', 'Extensión rápida.', 'Brazos largos hasta terminar cadera.'], err: ['Tirar con brazos', 'Perder postura'],
    reg: 'RDL explosivo.', pro: 'Clean high pull.', eq: ['Barra'],
  }),
  x('burpee-broad-jump', 'Burpee Broad Jump', {
    cat: ['Potencia', 'Finisher'], obj: 'Combinar transición al suelo con salto horizontal.',
    cap: ['Potencia', 'Resistencia local'], tgt: ['Full body'], typ: '4–6 repeticiones',
    cues: ['Burpee limpio.', 'Armá el salto.', 'Caé estable.'], err: ['Saltar sin control', 'Caída dura'],
    reg: 'Burpee + paso.', pro: 'Mayor distancia.', eq: ['Peso corporal'],
  }),
  x('kb-clean-push-press', 'KB Clean + Push Press', {
    cat: ['Potencia', 'Unilateral'], obj: 'Transferir fuerza del suelo a la mano en un gesto dinámico.',
    cap: ['Potencia', 'Unilateral'], tgt: ['Cadera', 'Hombro', 'Core'], typ: '5–6 por lado',
    cues: ['Clean pegado.', 'Dip corto.', 'Bloqueá sin arquear.'], err: ['Golpear el antebrazo', 'Press estricto fatigado'],
    reg: 'KB clean.', pro: 'Complejo continuo.', eq: ['Kettlebell'],
  }),
  x('med-ball-chest-pass', 'Medicine Ball Chest Pass', {
    cat: ['Potencia'], obj: 'Potencia de empuje horizontal sin fatiga pesada.',
    cap: ['Potencia'], tgt: ['Pecho', 'Tríceps', 'Core'], typ: '6–10 repeticiones',
    cues: ['Lanzamiento explosivo.', 'Costillas abajo.', 'Recuperá rápido.'], err: ['Lanzamiento lento', 'Arquear la lumbar'],
    reg: 'Balón más liviano.', pro: 'Desde split stance.', eq: ['Balón medicinal'],
  }),
  x('db-curl-to-press', 'DB Curl to Press', {
    cat: ['Potencia', 'Fuerza'], obj: 'Combinar brazo y hombro en un patrón continuo para circuitos.',
    cap: ['Resistencia local'], tgt: ['Bíceps', 'Hombros', 'Core'], typ: '8–12 repeticiones',
    cues: ['Curl limpio.', 'Press sin arquear.', 'Ritmo continuo.'], err: ['Balanceo', 'Hiperextensión lumbar'],
    reg: 'Curl y press separados.', pro: 'Más densidad.', eq: ['Mancuernas'],
  }),
  x('spinning-bike', 'Spinning Bike', {
    cat: ['Finisher'], obj: 'Trabajo cardiovascular sin impacto, continuo o dentro de circuitos.',
    cap: ['Capacidad aeróbica', 'Umbral'], tgt: ['Cuádriceps', 'Glúteos', 'Sistema cardiovascular'], typ: '30–60 s o 30–50 min',
    cues: ['Cadencia controlada.', 'Pedaleo fluido.', 'No rebotes en el asiento.'], err: ['Resistencia excesiva', 'Cadencia caótica'],
    reg: 'Menos resistencia.', pro: 'Más watts al mismo RPE.', eq: ['Bicicleta'],
  }),
  x('box-step-over', 'Box Step Over', {
    cat: ['Finisher', 'Unilateral'], obj: 'Trabajo cíclico de piernas con bajo impacto.',
    cap: ['Resistencia local', 'Unilateral'], tgt: ['Cuádriceps', 'Glúteos'], typ: '10–16 total',
    cues: ['Apoyo completo.', 'Ritmo continuo.', 'Control al bajar.'], err: ['Saltar sin control', 'Apoyo parcial'],
    reg: 'Box step-up.', pro: 'Más ritmo.', eq: ['Cajón'],
  }),
  x('db-shoulder-press', 'Seated DB Shoulder Press', {
    cat: ['Fuerza'], obj: 'Volumen de empuje vertical con libertad de rotación del hombro.',
    cap: ['Fuerza máxima'], tgt: ['Deltoides', 'Tríceps'], typ: '3 × 8 · RPE 8',
    cues: ['Costillas abajo.', 'Muñeca sobre el codo.', 'Bajá hasta la oreja.'], err: ['Arquear la lumbar', 'Chocar mancuernas'],
    reg: 'Menos carga y respaldo alto.', pro: 'De pie o unilateral.', eq: ['Mancuernas', 'Banco'],
  }),
  x('db-hammer-curl', 'DB Hammer Curl', {
    cat: ['Fuerza'], obj: 'Volumen de bíceps, braquial y agarre con bajo costo sistémico.',
    cap: ['Resistencia local'], tgt: ['Bíceps', 'Braquial', 'Antebrazo'], typ: '10–15 repeticiones',
    cues: ['Muñeca neutra.', 'Codos pegados.', 'Sin balanceo.'], err: ['Impulso lumbar', 'Muñeca doblada'],
    reg: 'Alternado.', pro: 'Tempo lento.', eq: ['Mancuernas'],
  }),
  x('db-lateral-raise', 'DB Lateral Raise', {
    cat: ['Fuerza'], obj: 'Volumen de deltoides sin interferir con el levantamiento principal.',
    cap: ['Resistencia local'], tgt: ['Deltoides medio'], typ: '12–20 repeticiones',
    cues: ['Hombros bajos.', 'Subí hasta la línea del hombro.', 'Controlá la bajada.'], err: ['Encoger trapecios', 'Balancear el torso'],
    reg: 'Menor rango.', pro: 'Pausa arriba.', eq: ['Mancuernas'],
  }),
  x('db-biceps-curl', 'DB Biceps Curl', {
    cat: ['Fuerza'], obj: 'Volumen de brazo con bajo costo de recuperación.',
    cap: ['Resistencia local'], tgt: ['Bíceps'], typ: '10–15 repeticiones',
    cues: ['Codos quietos.', 'Controlá la bajada.', 'No balancees el torso.'], err: ['Impulso con espalda', 'Rango corto'],
    reg: 'Curl alternado.', pro: 'Excéntrica de 3 segundos.', eq: ['Mancuernas'],
  }),
  x('situp-to-stand', 'Sit-Up to Stand', {
    cat: ['Core', 'Movilidad'], obj: 'Conectar flexión de tronco, transición suelo-parado y coordinación en un gesto continuo.',
    cap: ['Movilidad', 'Unilateral'], tgt: ['Core', 'Cadera', 'Piernas'], typ: '5–8 repeticiones',
    cues: ['Usá impulso controlado.', 'Plantá ambos pies.', 'Terminá alto y estable.'],
    err: ['Caer sobre talones', 'Perder control al ponerse de pie'], reg: 'Sit-up + apoyo de manos.',
    pro: 'Con medicine ball liviana.', eq: ['Peso corporal'],
  }),
  x('lateral-ape', 'Lateral Ape', {
    cat: ['Movilidad', 'Potencia'], obj: 'Mover el cuerpo lateralmente con apoyo de manos, cadera abierta y coordinación.',
    cap: ['Movilidad', 'Plano frontal', 'Cambio de dirección'], tgt: ['Cadera', 'Hombros', 'Core'], typ: '4–6/lado',
    cues: ['Manos suaves.', 'Cadera baja.', 'Desplazate lateral, no hacia adelante.'],
    err: ['Bloquear codos', 'Perder control de cadera'], reg: 'Ape reach estático.', pro: 'Más distancia lateral.', eq: ['Peso corporal'],
  }),
  x('shinbox-to-stand', 'Shin Box to Stand', {
    cat: ['Movilidad', 'Unilateral'], obj: 'Entrenar rotación de cadera y transición fluida desde el suelo a posición de pie.',
    cap: ['Movilidad', 'Unilateral', 'Equilibrio'], tgt: ['Cadera', 'Glúteos', 'Core'], typ: '4–6/lado',
    cues: ['Rotá desde cadera.', 'Subí sin colapsar rodilla.', 'Terminá estable.'],
    err: ['Forzar rodilla', 'Usar impulso descontrolado'], reg: '90/90 switch.', pro: 'Sin apoyo de manos.', eq: ['Peso corporal'],
  }),
  x('beast-to-down-dog', 'Beast to Down Dog', {
    cat: ['Movilidad', 'Core'], obj: 'Integrar core, hombros y cadena posterior en una transición animal fluida.',
    cap: ['Movilidad', 'Estabilidad escapular'], tgt: ['Core', 'Hombros', 'Isquios'], typ: '6–10 repeticiones',
    cues: ['Rodillas flotando en beast.', 'Empujá el piso.', 'Alargá columna al ir atrás.'],
    err: ['Hundir hombros', 'Moverse desde lumbar'], reg: 'Bear hold.', pro: 'Agregar shoulder tap.', eq: ['Peso corporal'],
  }),
  x('cossack-knee-drive', 'Cossack to Knee Drive', {
    cat: ['Movilidad', 'Unilateral', 'Potencia'], obj: 'Usar rango lateral de cadera y convertirlo en una salida unilateral activa.',
    cap: ['Movilidad', 'Plano frontal', 'Unilateral'], tgt: ['Aductores', 'Glúteos', 'Core'], typ: '5–6/lado',
    cues: ['Sentate sobre una cadera.', 'Pie de apoyo completo.', 'Salí fuerte a knee drive.'],
    err: ['Talón se despega', 'Rodilla colapsa'], reg: 'Cossack squat asistido.', pro: 'Agregar carga frontal liviana.', eq: ['Peso corporal'],
  }),
  x('crab-reach', 'Crab Reach', {
    cat: ['Movilidad', 'Core', 'Rotación'], obj: 'Abrir hombro y tórax mientras la cadera extiende y el core controla rotación.',
    cap: ['Movilidad', 'Rotación'], tgt: ['Tórax', 'Hombros', 'Glúteos', 'Oblicuos'], typ: '5–8/lado',
    cues: ['Empujá el piso.', 'Elevá cadera.', 'Rotá desde tórax.'],
    err: ['Cargar cuello', 'Arquear solo lumbar'], reg: 'Crab hold.', pro: 'Flujo alternado continuo.', eq: ['Peso corporal'],
  }),
];