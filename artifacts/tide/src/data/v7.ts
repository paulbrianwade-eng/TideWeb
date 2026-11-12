import type { ExercisePrescription as Item, Phase, WorkoutBlock, Workout, SportActivity, SportModule, PrimaryCapability } from '../types';
import { addDays } from '../lib/date';
import { getExercise } from './exercises';
import type { Station } from './equipment';

export const PHASES: Phase[] = [
  { id: 1, name: 'Base + Recomp', weeks: [1, 4], focus: 'Técnica, volumen útil, base aeróbica y tolerancia', strength: { sets: 4, reps: '6–8', rpe: '7', rest: '90–120 s' }, power: { sets: 3, reps: '4–6', rest: '60 s', intent: 'Rápido y limpio' }, accessoryReps: '10–12', coachNote: 'Construir sin acumular basura. Técnica sólida, cardio distribuido y finishers intensos pero controlados.' },
  { id: 2, name: 'Strength + Muscle', weeks: [5, 8], focus: 'Subir fuerza y preservar/ganar masa muscular durante el déficit', strength: { sets: 5, reps: '5–6', rpe: '7–8', rest: '2 min' }, power: { sets: 4, reps: '3–5', rest: '75 s', intent: 'Velocidad con carga moderada' }, accessoryReps: '8–10', coachNote: 'La carga sube sin sacrificar velocidad ni rango por kilos.' },
  { id: 3, name: 'Power + Engine', weeks: [9, 12], focus: 'Potencia, levantamientos dinámicos, saltos, sprint y work capacity', strength: { sets: 4, reps: '4–5', rpe: '8', rest: '2–3 min' }, power: { sets: 4, reps: '3–5', rest: '60–75 s', intent: 'Máxima intención' }, accessoryReps: '8–10', coachNote: 'Velocidad, dinamismo y exigencia sin convertir potencia en cardio desordenado.' },
  { id: 4, name: 'Surf + Golf Ready', weeks: [13, 16], focus: 'Llegar liviano, fuerte, móvil y explosivo al agua y al campo', strength: { sets: 4, reps: '4–6', rpe: '7–8', rest: '2 min' }, power: { sets: 4, reps: '3–5', rest: '60–75 s', intent: 'Potencia aplicada' }, accessoryReps: '8–12', coachNote: 'Mantener fuerza, subir transferencia y llegar fresco.' },
];
export const phaseForWeek = (week: number): Phase => PHASES[Math.min(3, Math.max(0, Math.floor((week - 1) / 4)))]!;
export const isDeload = (week: number): boolean => week % 4 === 0;
const vol = (week: number, normal: number, unload = 2) => isDeload(week) ? unload : normal;
const pick = <T,>(array: T[], week: number, offset = 0): T => array[(week - 1 + offset) % array.length]!;
const p = (exerciseId: string, extra: Partial<Item> = {}): Item => ({ exerciseId, ...extra });
const R = (week: number, normal = 3) => vol(week, normal);

type Spec = Omit<WorkoutBlock, 'id' | 'index' | 'duration'>;
const b = (kind: WorkoutBlock['kind'], title: string, minutes: number, items: Item[], extra: Partial<Spec> = {}): Spec & { minutes: number } => ({
  kind, title, minutes, items, format: 'sets', formatLabel: `${minutes} min`, ...extra,
});
const circuit = (kind: WorkoutBlock['kind'], title: string, minutes: number, items: Item[], rounds: number, focus: string, rest?: string) =>
  b(kind, title, minutes, items, { format: 'rounds', rounds, formatLabel: `${rounds} vueltas`, focus, rest });

const CORE: Item[][] = [
  [p('ab-wheel',{reps:'8'}),p('copenhagen-plank',{duration:'20 s/lado',unilateral:true}),p('dead-bug',{reps:'8/lado',unilateral:true}),p('pallof-press',{reps:'10/lado',unilateral:true})],
  [p('trx-body-saw',{reps:'10'}),p('side-plank-rotation',{reps:'6/lado',unilateral:true}),p('bear-crawl',{distance:'10 m'}),p('hip-airplane',{reps:'5/lado',unilateral:true})],
  [p('side-plank',{duration:'25 s/lado',unilateral:true}),p('bird-dog',{reps:'8/lado',unilateral:true}),p('pallof-press',{reps:'8/lado',unilateral:true}),p('ab-wheel',{reps:'6–8'})],
  [p('dead-bug',{reps:'10/lado',unilateral:true}),p('copenhagen-plank',{duration:'15–20 s/lado',unilateral:true}),p('trx-body-saw',{reps:'8'}),p('bear-crawl',{distance:'12 m'})],
];
const core = (w:number,offset=0,minutes=7) => circuit('zona-media','01 · ZONA MEDIA',minutes,pick(CORE,w,offset),R(w),'Core tridimensional + estabilidad de cadera');
const contrast = (w:number,day:1|3|5) => {
  const phase=phaseForWeek(w);
  const sets=vol(w,day===1?phase.strength.sets:4,3);
  const main: Item = day===1 ? p('back-squat',{order:'A1',sets,reps:phase.id===1?'5–6':phase.id===2?'5':'4–5',rpe:isDeload(w)?'6':'7–8',rest:'90–120 s',instructions:'Fuerza principal. Técnica sólida; dejá 1–3 reps en reserva.'})
    : day===3 ? p('bench-press',{order:'A1',sets,reps:phase.id<=2?'6':'4–6',rpe:isDeload(w)?'6':'7–8',rest:'90–120 s',instructions:'Principal de empuje. No llegar al fallo.'})
    : p('romanian-deadlift',{order:'A1',sets,reps:phase.id>=3?'5–6':'6–8',rpe:isDeload(w)?'6':'7–8',rest:'90–120 s',instructions:'Principal de bisagra. Una sola configuración de barra.'});
  const explosive = day===1 ? p('box-jump',{order:'A2',sets,reps:'3–4',rest:'60–90 s',instructions:'Después de cada serie de squat. Pocas reps, máxima intención y aterrizaje limpio.'})
    : day===3 ? p('med-ball-chest-pass',{order:'A2',sets,reps:'5',load:'MB 5–10 kg',rest:'60–90 s',instructions:'Contraste del bench: lanzar con intención máxima. Cortar si cae la velocidad.'})
    : p('broad-jump',{order:'A2',sets,reps:'3–4',rest:'60–90 s',instructions:'Contraste horizontal. Salto potente, aterrizaje estable; no buscar fatiga.'});
  const accessory = day===1 ? p(pick(['single-leg-rdl','bulgarian-split-squat','reverse-lunge','soleus-raise'],w),{order:'B',sets:3,reps:'8–12/lado',unilateral:true,load:'Carga controlada'})
    : day===3 ? p(pick(['pull-up','barbell-row','trx-row','db-hammer-curl'],w),{order:'B',sets:3,reps:'8–12'})
    : p(pick(['overhead-press','pull-up','db-hammer-curl','db-lateral-raise'],w,1),{order:'B',sets:3,reps:'8–12',load:'Carga que deje técnica limpia'});
  return b('fuerza','02 · FUERZA + CONTRASTE',17,[main,explosive,accessory],{formatLabel:`${sets} contrastes A1 + A2 · 3 series B`,focus:day===1?'Fuerza de piernas + contraste explosivo + accesorio unilateral':day===3?'Empuje fuerte + lanzamiento explosivo + tirón/accesorio':'Bisagra fuerte + potencia horizontal + accesorio complementario',rest:'A1 → A2 explosivo · 60–90 s; luego B'});
};
const transition = (intensity:'sostenido'|'fuerte'='sostenido',rpe=intensity==='fuerte'?'7–8':'6–7') => b('transicion','VUELTA A LA MANZANA',3,[
  p('block-run',{sets:1,reps:'1 vuelta',duration:'2–4 min',rpe,instructions:'Transición cardiovascular. No sprint máximo. Volvé listo para el siguiente bloque.',alternatives:['Indoor/lluvia: bicicleta 2–4 min al mismo RPE']}),
],{focus:'Cardio transition · mantener pulsaciones sin perder calidad',formatLabel:'1 vuelta · 2–4 min',intensity,goal:'Mantener pulsaciones sin perder calidad para el siguiente bloque',scoreType:'time'});

const ATHLETE: Item[][] = [
  [p('situp-to-stand',{order:'A1',reps:'6'}),p('hang-clean',{order:'A2',reps:'4',rpe:'6–7'}),p('box-jump',{order:'A3',reps:'5'}),p('threshold-run',{order:'A4',distance:'25 m rápido',alternatives:['Indoor: bicicleta 20 s fuerte']})],
  [p('lateral-ape',{order:'A1',reps:'5/lado',unilateral:true}),p('kb-clean-push-press',{order:'A2',reps:'5/lado',unilateral:true}),p('lateral-bound',{order:'A3',reps:'5/lado',unilateral:true}),p('rotational-mb-throw',{order:'A4',reps:'6/lado',unilateral:true})],
  [p('shinbox-to-stand',{order:'A1',reps:'5/lado',unilateral:true}),p('clean-high-pull',{order:'A2',reps:'4',rpe:'6–7'}),p('broad-jump',{order:'A3',reps:'4'}),p('shuttle-run',{order:'A4',reps:'10-20-10 m',alternatives:['Indoor: bicicleta 30 s fuerte']})],
  [p('beast-to-down-dog',{order:'A1',reps:'8'}),p('push-jerk',{order:'A2',reps:'4',rpe:'6–7'}),p('split-jump',{order:'A3',reps:'6 total'}),p('rotational-mb-throw',{order:'A4',reps:'5/lado',unilateral:true})],
  [p('cossack-knee-drive',{order:'A1',reps:'5/lado',unilateral:true}),p('clean-pull',{order:'A2',reps:'5',rpe:'6–7'}),p('burpee-broad-jump',{order:'A3',reps:'5'}),p('shuttle-run',{order:'A4',reps:'10-10-10 m',alternatives:['Indoor: bicicleta 30 s fuerte']})],
  [p('crab-reach',{order:'A1',reps:'6/lado',unilateral:true}),p('kb-snatch',{order:'A2',reps:'5/lado',unilateral:true}),p('skater-jump',{order:'A3',reps:'6/lado',unilateral:true}),p('med-ball-chest-pass',{order:'A4',reps:'8'})],
  [p('situp-to-stand',{order:'A1',reps:'6'}),p('push-press',{order:'A2',reps:'5',rpe:'6–7'}),p('pogo-jump',{order:'A3',reps:'20'}),p('shuttle-run',{order:'A4',reps:'20-20 m',alternatives:['Indoor: bicicleta 25 s fuerte']})],
  [p('shinbox-to-stand',{order:'A1',reps:'5/lado',unilateral:true}),p('hang-clean',{order:'A2',reps:'3',rpe:'6–7'}),p('lateral-bound',{order:'A3',reps:'5/lado',unilateral:true}),p('rotational-mb-throw',{order:'A4',reps:'6/lado',unilateral:true})],
  [p('lateral-ape',{order:'A1',reps:'4/lado',unilateral:true}),p('clean-high-pull',{order:'A2',reps:'4'}),p('box-jump',{order:'A3',reps:'5'}),p('threshold-run',{order:'A4',distance:'30 m rápido',alternatives:['Indoor: bicicleta 20 s fuerte']})],
  [p('beast-to-down-dog',{order:'A1',reps:'8'}),p('kb-clean',{order:'A2',reps:'6/lado',unilateral:true}),p('broad-jump',{order:'A3',reps:'4'}),p('rotational-mb-throw',{order:'A4',reps:'5/lado',unilateral:true})],
  [p('cossack-knee-drive',{order:'A1',reps:'5/lado',unilateral:true}),p('push-jerk',{order:'A2',reps:'4'}),p('skater-jump',{order:'A3',reps:'6/lado',unilateral:true}),p('farmer-carry',{order:'A4',distance:'30 m',carry:true,alternatives:['Indoor: farmer march 40 pasos']})],
  [p('crab-reach',{order:'A1',reps:'6/lado',unilateral:true}),p('kb-clean-push-press',{order:'A2',reps:'5/lado',unilateral:true}),p('split-jump',{order:'A3',reps:'8 total'}),p('shuttle-run',{order:'A4',reps:'20-20 m',alternatives:['Indoor: bicicleta 30 s fuerte']})],
];
const athlete = (w:number,offset:number) => circuit('atleta','03 · ATLETA · MOVE + EXPLODE',11,pick(ATHLETE,w,offset),R(w),'Movilidad en movimiento + levantamiento explosivo + salto + locomoción/rotación','45–60 s entre vueltas · calidad explosiva antes que fatiga');

const FINISHERS: {mode:string;items:Item[]}[] = [
  {mode:'AMRAP 9 min',items:[p('spinning-bike',{duration:'35 s fuerte'}),p('db-curl-to-press',{reps:'10'}),p('box-step-over',{reps:'10'}),p('trx-row',{reps:'10',alternatives:['Indoor/lluvia: remo serrucho o band row']}),p('jump-rope',{reps:'40',alternatives:['Indoor/lluvia: bicicleta 30 s fuerte']})]},
  {mode:'FOR TIME · 4 vueltas',items:[p('threshold-run',{distance:'150 m',alternatives:['Indoor/lluvia: bicicleta 45 s fuerte']}),p('goblet-squat',{reps:'12',load:'KB 20 kg'}),p('db-shoulder-press',{reps:'12'}),p('burpee',{reps:'8'})]},
  {mode:'AMRAP 10 min',items:[p('kb-clean',{reps:'6/lado',unilateral:true}),p('reverse-lunge',{reps:'10 total'}),p('pull-up',{reps:'6'}),p('spinning-bike',{duration:'40 s fuerte'}),p('jump-rope',{reps:'30',alternatives:['Indoor/lluvia: bicicleta 25 s fuerte']})]},
  {mode:'CHIPPER',items:[p('jump-rope',{reps:'100',alternatives:['Indoor/lluvia: bicicleta 75 s fuerte']}),p('box-step-over',{reps:'30'}),p('db-hammer-curl',{reps:'20'}),p('burpee',{reps:'15'}),p('threshold-run',{distance:'300 m',alternatives:['Indoor/lluvia: bicicleta 75 s fuerte']})]},
  {mode:'AMRAP 9 min',items:[p('shuttle-run',{reps:'10-20-10 m'}),p('kb-clean-push-press',{reps:'5/lado',unilateral:true}),p('trx-row',{reps:'10',alternatives:['Indoor/lluvia: remo serrucho o band row']}),p('mountain-climber',{duration:'25 s'})]},
  {mode:'FOR TIME · 4 vueltas',items:[p('spinning-bike',{duration:'30 s fuerte'}),p('goblet-squat',{reps:'10'}),p('db-curl-to-press',{reps:'8'}),p('burpee-broad-jump',{reps:'5'})]},
  {mode:'LADDER 2-4-6-8-10',items:[p('push-press',{reps:'2-4-6-8-10',rpe:'6–7'}),p('pull-up',{reps:'2-4-6-8-10'}),p('threshold-run',{distance:'100 m entre escalones'})]},
  {mode:'AMRAP 10 min',items:[p('farmer-carry',{distance:'30 m',carry:true}),p('box-step-over',{reps:'12'}),p('db-biceps-curl',{reps:'12'}),p('jump-rope',{reps:'50',alternatives:['Indoor/lluvia: bicicleta 35 s fuerte']}),p('burpee',{reps:'6'})]},
  {mode:'FOR TIME · 3 vueltas',items:[p('threshold-run',{distance:'200 m',alternatives:['Indoor/lluvia: bicicleta 60 s fuerte']}),p('kb-swing',{reps:'15'}),p('push-up',{reps:'10'}),p('reverse-lunge',{reps:'12 total'}),p('jump-rope',{reps:'40',alternatives:['Indoor/lluvia: bicicleta 30 s fuerte']})]},
  {mode:'AMRAP 9 min',items:[p('spinning-bike',{duration:'40 s fuerte'}),p('mb-slam',{reps:'10'}),p('trx-row',{reps:'10',alternatives:['Indoor/lluvia: remo serrucho o band row']}),p('box-step-over',{reps:'10'}),p('mountain-climber',{duration:'20 s'})]},
  {mode:'FOR TIME · 4 vueltas',items:[p('threshold-run',{distance:'100 m',alternatives:['Indoor/lluvia: bicicleta 30 s fuerte']}),p('db-curl-to-press',{reps:'8'}),p('bulgarian-split-squat',{reps:'8/lado',unilateral:true}),p('bear-crawl',{distance:'10 m'}),p('jump-rope',{reps:'30',alternatives:['Indoor/lluvia: bicicleta 25 s fuerte']})]},
  {mode:'AMRAP 10 min',items:[p('spinning-bike',{duration:'30 s fuerte'}),p('pull-up',{reps:'5'}),p('box-step-over',{reps:'12'}),p('db-hammer-curl',{reps:'10'}),p('burpee',{reps:'6'})]},
];
const scored = (mode:string, items:Item[], minutes:number, title:string, focus:string): Spec & {minutes:number} => {
  const amrap=/AMRAP (\d+) min/.exec(mode);
  const laps=/(\d+) vueltas/.exec(mode);
  const format=amrap?'amrap':mode.includes('CHIPPER')?'chipper':mode.includes('LADDER')?'ladder':'for-time';
  return b('finisher',title,minutes,items,{format,formatLabel:mode,capMinutes:amrap?Number(amrap[1]):format==='for-time'?minutes:undefined,rounds:laps?Number(laps[1]):undefined,scoreType:amrap?'rounds-reps':format==='chipper'||format==='for-time'?'time':'reps',scoreHint:amrap?'Vueltas + repeticiones':format==='ladder'?'Escalones completados':'Tiempo total',focus,rest:'Solo lo necesario · RPE 8–9'});
};
const finisher=(w:number,offset:number)=>{
  const chosen=pick(FINISHERS,w,offset);
  const mode=isDeload(w)?chosen.mode.replace(/10 min|9 min/g,'7 min').replace('4 vueltas','3 vueltas'):chosen.mode;
  return scored(mode,chosen.items,isDeload(w)?7:mode.includes('10 min')?10:mode.includes('9 min')?9:11,'04 · FINISHER','AMRAP / For Time / Chipper · mixto y registrable');
};

const zone2=(w:number): (Spec & {minutes:number})[] => [
  b('recovery','MOVEMENT PREP',7,[p('foot-activation',{duration:'60 s'}),p('hip-9090',{reps:'8 cambios'}),p('open-book',{reps:'8/lado',unilateral:true}),p('shoulder-cars',{reps:'5/lado',unilateral:true})],{focus:'Preparar sin fatigar'}),
  b('outdoor','ZONE 2',isDeload(w)?33:40,[p(pick(['spinning-bike','zone2-run'],w),{sets:1,duration:isDeload(w)?'30–35 min':'35–45 min',rpe:'4–5',instructions:'Ritmo conversacional. Debés poder hablar en frases completas.'})],{focus:'Base aeróbica · favorecer recuperación y gasto energético',scoreType:'distance',scoreHint:'Distancia o vatios medios'}),
  b('recovery','MOBILITY',9,[p('hip-flexor-stretch',{duration:'45 s/lado',unilateral:true}),p('thoracic-rotation',{reps:'8/lado',unilateral:true}),p('worlds-greatest-stretch',{reps:'5/lado',unilateral:true})],{focus:'Cadera + tórax + cadena anterior'}),
];
const intervals=(w:number): (Spec & {minutes:number})[] => {
  const phase=phaseForWeek(w).id;
  const work=phase===1?{sets:6,distance:'400 m',rest:'90 s caminata/trote',note:'Fuerte controlado · RPE 7–8'}
    :phase===2?{sets:5,distance:'600 m',rest:'2 min trote',note:'Ritmo sostenido · RPE 8'}
    :phase===3?{sets:4,distance:'800 m',rest:'2 min trote',note:'Ritmo cercano al objetivo HYROX · RPE 8'}
    :{sets:isDeload(w)?3:4,distance:isDeload(w)?'800 m':'1 km',rest:'2–3 min trote',note:'Específico HYROX · fuerte pero repetible'};
  // La fuente V7 solo reduce las pasadas de la semana 16 (3 × 800 m).
  const count=work.sets;
  return [
    b('recovery','WARM-UP + DRILLS',11,[p('zone2-run',{duration:'8 min',rpe:'3–4'}),p('hip-9090',{reps:'6 cambios'}),p('pogo-jump',{reps:'20'}),p('lateral-shuffle',{duration:'2 × 20 s'})],{focus:'Subir temperatura + preparar tobillo/cadera + técnica de carrera'}),
    b('outdoor','PASADAS',isDeload(w)?24:32,[p('threshold-run',{sets:count,reps:'1 pasada',distance:work.distance,rest:work.rest,rpe:work.note,instructions:'Todas las repeticiones deben salir parejas. La última puede ser la más rápida, nunca la primera.'})],{format:'sets',formatLabel:`${count} × ${work.distance}`,rest:work.rest,focus:'Velocidad sostenible + tolerancia al ritmo de carrera'}),
    b('recovery','COOL DOWN',9,[p('zone2-run',{duration:'5–7 min',rpe:'2–3'}),p('hip-flexor-stretch',{duration:'45 s/lado',unilateral:true}),p('thoracic-rotation',{reps:'6/lado',unilateral:true})],{focus:'Bajar pulsaciones y recuperar movilidad'}),
  ];
};
const HYROX: {mode:string;items:Item[]}[] = [
  {mode:'HYROX STYLE · 4 vueltas FOR TIME',items:[p('threshold-run',{distance:'400 m',alternatives:['Indoor/lluvia: bicicleta 90 s fuerte']}),p('spinning-bike',{duration:'60 s fuerte'}),p('goblet-squat',{reps:'15'}),p('farmer-carry',{distance:'40 m',carry:true}),p('burpee',{reps:'10'})]},
  {mode:'HYROX STYLE · 5 vueltas',items:[p('threshold-run',{distance:'300 m',alternatives:['Indoor/lluvia: bicicleta 75 s fuerte']}),p('box-step-over',{reps:'16'}),p('pull-up',{reps:'5'}),p('reverse-lunge',{reps:'16 total'}),p('spinning-bike',{duration:'45 s fuerte'})]},
  {mode:'HYROX STYLE · CHIPPER',items:[p('threshold-run',{distance:'800 m',alternatives:['Indoor/lluvia: bicicleta 3 min fuerte-controlado']}),p('farmer-carry',{distance:'80 m',carry:true}),p('box-step-over',{reps:'40'}),p('burpee-broad-jump',{reps:'20'}),p('jump-rope',{reps:'150',alternatives:['Indoor/lluvia: bicicleta 90 s fuerte']}),p('threshold-run',{distance:'800 m',alternatives:['Indoor/lluvia: bicicleta 3 min fuerte-controlado']})]},
  {mode:'HYROX STYLE · 4 vueltas FOR TIME',items:[p('threshold-run',{distance:'400 m',alternatives:['Indoor/lluvia: bicicleta 90 s fuerte']}),p('spinning-bike',{duration:'45 s fuerte'}),p('db-curl-to-press',{reps:'12'}),p('goblet-squat',{reps:'12'}),p('bear-crawl',{distance:'15 m'})]},
];
const hyrox=(w:number): (Spec & {minutes:number})[] => {
  const h=pick(HYROX,w);
  const menu:Item[][]=[
    [p('clean-high-pull',{reps:'4'}),p('box-jump',{reps:'5'}),p('shuttle-run',{reps:'10-20-10 m'})],
    [p('kb-snatch',{reps:'5/lado',unilateral:true}),p('lateral-bound',{reps:'5/lado',unilateral:true}),p('farmer-carry',{distance:'30 m',carry:true})],
    [p('push-jerk',{reps:'4'}),p('broad-jump',{reps:'4'}),p('threshold-run',{distance:'30 m rápido'})],
    [p('kb-clean-push-press',{reps:'5/lado',unilateral:true}),p('skater-jump',{reps:'6/lado',unilateral:true}),p('shuttle-run',{reps:'20-20 m'})],
  ];
  const mode=isDeload(w)?h.mode.replace('5 vueltas','3 vueltas').replace('4 vueltas','3 vueltas'):h.mode;
  return [
    core(w,2,6),
    circuit('fuerza','02 · STRENGTH ENDURANCE',10,[
      p(pick(['front-rack-reverse-lunge','goblet-squat','bulgarian-split-squat'],w),{order:'A1',sets:3,reps:'8–10/lado',unilateral:true}),
      p(pick(['trx-row','pull-up','push-up'],w,1),{order:'A2',sets:3,reps:'8–12'}),
      p(pick(['db-shoulder-press','db-hammer-curl','db-lateral-raise'],w,2),{order:'A3',sets:3,reps:'10–15'}),
    ],R(w),'Resistencia de fuerza sin cargar la barra pesada'),
    circuit('atleta','03 · HYROX PREP',9,pick(menu,w),R(w),'Potencia corta antes del bloque largo','45 s entre vueltas'),
    {...scored(mode,h.items,isDeload(w)?16:21,'04 · HYROX STYLE','Sesión picante de carrera + estaciones funcionales'),rest:'Administrá ritmo · RPE 8–9'},
  ];
};

interface Day {name:string;tagline:string;objective:string;rpe:string;station:Station;capability:PrimaryCapability;transfersTo:SportModule[];next:SportActivity|null;note:string;build:(w:number)=>(Spec&{minutes:number})[]}
const DAYS:Day[]=[
  {name:'LOWER IGNITION',tagline:'Lower strength · Contrast · Athlete',objective:'Construir piernas fuertes y explosivas sin perder movilidad, velocidad ni capacidad de correr.',rpe:'8',station:'barra',capability:'Strength',transfersTo:[],next:'running',note:'Lunes: fuerza + contraste explosivo. Squat y salto conviven; la corrida entre bloques es parte del entrenamiento, no tiempo muerto.',build:w=>[core(w),contrast(w,1),transition(),athlete(w,1),transition('sostenido','7'),finisher(w,2)]},
  {name:'ZONE 2 + MOBILITY',tagline:'Aerobic base · Recovery',objective:'Construir motor aeróbico, mejorar recuperación y sumar volumen sin interferir con fuerza ni pasadas.',rpe:'4–5',station:'bici',capability:'Engine',transfersTo:['running'],next:'gym',note:'Martes fácil a propósito. Ritmo conversacional; terminar mejor de lo que empezaste.',build:zone2},
  {name:'UPPER SURF',tagline:'Upper strength · Chest throw · Athlete',objective:'Ganar/mantener pecho, espalda, hombros y brazos con potencia útil para surf y HYROX.',rpe:'8',station:'barra',capability:'Strength',transfersTo:['surf'],next:'running',note:'Miércoles: bench + lanzamiento de pecho como contraste. Después el Athlete cambia de patrón para evitar repetir empuje una y otra vez.',build:w=>[core(w,1),contrast(w,3),transition(),athlete(w,4),transition(),finisher(w,6)]},
  {name:'PASADAS',tagline:'Run quality · HYROX pace',objective:'Mejorar ritmo sostenible, economía de carrera y capacidad de repetir esfuerzos rápidos sin desordenar la técnica.',rpe:'7–8',station:'outdoor',capability:'Engine',transfersTo:['running'],next:'gym',note:'Jueves = calidad de carrera. Las pasadas progresan de 400 m hacia 1 km a medida que se acerca HYROX.',build:intervals},
  {name:'FULL BODY POWER',tagline:'Hinge strength · Contrast · Athlete',objective:'Mantener fuerza total, potencia horizontal y músculo útil sin llegar destruido al sábado.',rpe:'8',station:'barra',capability:'Strength',transfersTo:['surf','golf'],next:'gym',note:'Viernes: bisagra + broad jump como contraste. El finisher evita volver a cargar de hinge/press lo que ya se trabajó.',build:w=>[core(w,3),contrast(w,5),transition(),athlete(w,9),transition(),finisher(w,0)]},
  {name:'HYROX SATURDAY',tagline:'Race engine · Strength endurance',objective:'Construir tolerancia específica a correr entre estaciones y sostener trabajo funcional bajo fatiga.',rpe:'8–9',station:'outdoor',capability:'Engine',transfersTo:['running'],next:'rest',note:'Sábado picante y progresivo. Primero construimos capacidad y técnica bajo fatiga.',build:hyrox},
  {name:'REST',tagline:'Recovery',objective:'Recuperar para sostener fuerza, potencia, carrera y déficit calórico durante meses.',rpe:'1–2',station:'suelo',capability:'Recovery',transfersTo:[],next:'gym',note:'Domingo sin trabajo duro.',build:()=>[b('recovery','RESTORE',18,[p('nasal-breathing',{sets:1,duration:'3 min'}),p('hip-flow',{sets:1,duration:'5 min'}),p('easy-walk',{sets:1,duration:'10–20 min'})],{formatLabel:'10–20 min opcionales',focus:'Recuperación opcional'})]},
];
export const V7_WEEK = DAYS.map(({name,tagline,station})=>({name,tagline,station}));
export const buildV7 = (start:string):Workout[] => {
  const out:Workout[]=[];
  for(let week=1;week<=16;week++)for(let day=1;day<=7;day++){
    const plan=DAYS[day-1]!;
    const id=`${start}-v7-w${week}d${day}`;
    const blocks:WorkoutBlock[]=plan.build(week).map((spec,index)=>({...spec,id:`${id}-b${index+1}`,index:index+1,duration:`${spec.minutes} min`}));
    const equipment=[...new Set(blocks.flatMap(block=>block.items.flatMap(item=>getExercise(item.exerciseId).equipment)))].filter(item=>item!=='Peso corporal'&&item!=='Colchoneta').sort();
    out.push({id,week,day,date:addDays(start,(week-1)*7+day-1),name:plan.name,subtitle:plan.tagline,objective:plan.objective,duration:`${blocks.reduce((n,b)=>n+b.minutes,0)} min`,plannedRpe:isDeload(week)&&day!==7?'6–7':plan.rpe,coachNote:plan.note,nextDayActivity:plan.next,blocks,adaptations:[],status:day===7?'rest':'pending',externalActivity:day===7?'rest':undefined,phase:phaseForWeek(week).id,modules:plan.transfersTo,station:plan.station,capability:plan.capability,equipment,transfersTo:plan.transfersTo});
  }
  return out;
};