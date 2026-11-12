import assert from 'node:assert/strict';
import { buildCoachRows, buildCoachCsv, buildBackup } from '../src/lib/export';
import { EXERCISES, EXERCISE_MAP, getExercise } from '../src/data/exercises';
import { UNAVAILABLE } from '../src/data/equipment';
import { PATTERNS, patternsOf } from '../src/data/patterns';
import { buildProgram, defaultStart, phaseForWeek, TOTAL_WEEKS, TRAINING_PHASES, WEEK_STRUCTURE } from '../src/data/program';
import { FIXED_PROGRAM_START, STATE_VERSION, STORAGE_KEY, emptyState, migrate } from '../src/lib/storage';
import { plannedSets, sessionProgress, setKey } from '../src/lib/prescription';
import type { AppState, SessionSummary, Workout } from '../src/types';

const normalized = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const program=buildProgram();
const get=(w:number,d:number):Workout=>program[(w-1)*7+d-1]!;
const prefix='2026-10-12-v7';
assert.equal(defaultStart(),'2026-10-12');
assert.equal(defaultStart(),FIXED_PROGRAM_START);
assert.equal(STORAGE_KEY,'tide.state.v1');
assert.equal(STATE_VERSION,5);
assert.equal(TOTAL_WEEKS,16);
assert.equal(program.length,112);
assert.equal(program[0]?.date,'2026-10-12');
assert.equal(program.at(-1)?.date,'2027-01-31');
assert.equal(program[0]?.id,`${prefix}-w1d1`);
assert.equal(program.at(-1)?.id,`${prefix}-w16d7`);
assert.deepEqual(TRAINING_PHASES.map(phase=>phase.name),['Base + Recomp','Strength + Muscle','Power + Engine','Surf + Golf Ready']);
const names=['LOWER IGNITION','ZONE 2 + MOBILITY','UPPER SURF','PASADAS','FULL BODY POWER','HYROX SATURDAY','REST'];
assert.deepEqual(WEEK_STRUCTURE.map(d=>d.name),names);
assert.equal(new Set(EXERCISES.map(e=>e.id)).size,EXERCISES.length);
const rotations=new Set<string>();
for(let w=1;w<=16;w++){
  assert.equal(phaseForWeek(w).id,Math.floor((w-1)/4)+1);
  for(let d=1;d<=7;d++){
    const workout=get(w,d);
    assert.equal(workout.id,`${prefix}-w${w}d${d}`);
    assert.equal(workout.name,names[d-1]);
    assert.equal(workout.blocks.length,[6,3,6,3,6,4,1][d-1]);
    assert.equal(workout.phase,phaseForWeek(w).id);
    workout.blocks.forEach((block,index)=>{
      assert.equal(block.id,`${workout.id}-b${index+1}`);
      assert.equal(block.index,index+1);
      assert.ok(block.minutes>0);
      if(block.kind==='transicion'){
        assert.equal(block.items[0]?.exerciseId,'block-run');
        assert.equal(block.items[0]?.sets,1);
        assert.ok(block.items[0]?.duration);
        assert.ok(block.intensity&&block.goal);
      }
      if(block.kind==='finisher'){
        assert.ok(block.scoreType && block.scoreType!=='none',`${workout.id}: falta score`);
        assert.ok(block.formatLabel);
        if(block.format==='amrap')assert.ok(block.capMinutes && block.capMinutes>0);
        if(block.rounds!==undefined)assert.equal(typeof block.rounds,'number');
      }
      block.items.forEach(item=>{
        assert.ok(EXERCISE_MAP[item.exerciseId],`${workout.id}: falta ${item.exerciseId}`);
        assert.ok(PATTERNS[item.exerciseId]?.length>0,`${item.exerciseId}: falta patrón específico`);
        assert.ok(patternsOf(item.exerciseId).length>0,`${item.exerciseId}: falta patrón`);
        assert.ok(!getExercise(item.exerciseId).equipment.some(e=>UNAVAILABLE.includes(e)),`${item.exerciseId}: equipo indisponible`);
        if(item.sets!==undefined)assert.ok(Number.isInteger(item.sets)&&item.sets>0);
      });
    });
  }
  rotations.add(get(w,1).blocks[3]!.items.map(i=>i.exerciseId).join('|'));
  for(const [day,main,explosive] of [[1,'back-squat','box-jump'],[3,'bench-press','med-ball-chest-pass'],[5,'romanian-deadlift','broad-jump']] as const){
    const contrast=get(w,day).blocks[1]!;
    assert.equal(contrast.kind,'fuerza');
    assert.deepEqual(contrast.items.slice(0,2).map(i=>i.exerciseId),[main,explosive]);
    assert.equal(contrast.items[0]?.sets,contrast.items[1]?.sets);
    assert.equal(contrast.items[0]?.sets,w%4===0?3:day===1?phaseForWeek(w).strength.sets:4);
    assert.equal(get(w,day).blocks.filter(b=>b.kind==='transicion').length,2);
    assert.equal(get(w,day).blocks[3]?.rounds,w%4===0?2:3);
  }
  assert.equal(get(w,2).blocks[1]?.items[0]?.duration,w%4===0?'30–35 min':'35–45 min');
  const pasadas=get(w,4).blocks[1]!;
  assert.equal(pasadas.format,'sets','Las pasadas por distancia no activan el cronómetro 40/20.');
  assert.equal(pasadas.work,undefined);
  assert.equal(pasadas.pause,undefined);
  assert.equal(pasadas.scoreType,undefined,'No hay UI para marcar tiempos de cada pasada.');
  assert.equal(pasadas.items[0]?.sets,w===16?3:[6,5,4,4][Math.floor((w-1)/4)]);
  assert.equal(pasadas.items[0]?.distance,['400 m','600 m','800 m',w===16?'800 m':'1 km'][Math.floor((w-1)/4)]);
  assert.equal(pasadas.formatLabel,`${pasadas.items[0]?.sets} × ${pasadas.items[0]?.distance}`);
  assert.equal(get(w,6).blocks[2]?.rounds,w%4===0?2:3);
  get(w,6).blocks[1]!.items.forEach(item=>assert.equal(item.sets,3,'V7 mantiene 3 series de strength endurance incluso en descarga.'));
  assert.equal(get(w,7).status,'rest');
  assert.equal(get(w,7).externalActivity,'rest');
  if(w%4===0){
    assert.equal(get(w,1).blocks[5]?.capMinutes,7);
    assert.equal(get(w,1).plannedRpe,'6–7');
  }
}
assert.ok(rotations.size>=10,'Los menús atléticos deben rotar durante todo el ciclo.');
assert.equal(plannedSets(get(1,7).blocks[0]!.items[0]!,get(1,7).blocks[0]!),1);
assert.equal(plannedSets(get(1,2).blocks[1]!.items[0]!,get(1,2).blocks[1]!),1);

const migrated=migrate({programStart:'2026-08-23',history:[{workoutId:'w1d1'} as never],sessions:{w1d1:{workoutId:'w1d1'} as never},metrics:{weight:[{date:'2026-08-03',value:95}]}});
assert.equal(migrated.programStart,'2026-08-23');
assert.equal(migrated.history.length,1);
assert.ok(migrated.sessions['w1d1']);
assert.deepEqual(normalized(migrate(migrated)),normalized(migrated));
assert.equal(migrated.metrics.weight?.[0]?.value,95);
const state:AppState=emptyState();
const monday=get(1,1);
const strength=monday.blocks[1]!;
const main=strength.items[0]!;
const key=setKey(strength.id,main.exerciseId,0);
state.sessions[monday.id]={workoutId:monday.id,date:monday.date,startedAt:1,completedAt:2,elapsedMs:3600000,blockIndex:1,activeKey:key,sets:{[key]:[{done:true,load:'70 kg',reps:'5'}],[setKey('w1d1-b3','hang-clean',0)]:[{done:true,load:'20 kg',reps:'4'}]},skipped:[],substitutions:{},finisherScore:{time:'12:40',note:'3 vueltas'}};
const summary:SessionSummary={workoutId:monday.id,workoutName:monday.name,date:monday.date,durationMin:59,blocksCompleted:6,blocksTotal:6,volumeKg:350,setsCompleted:1,rpe:8,energy:7,pain:1,feeling:'justo',comment:'Buena sesión',highlight:'Squat',personalRecord:null,coachNote:'Mantener'};
state.history=[summary];
state.metrics.weight=[{date:monday.date,value:84.5}];
assert.ok(sessionProgress(monday,state.sessions[monday.id])>0);
assert.equal(sessionProgress(monday,migrated.sessions['cycle-2026-08-23-w1d1']),0);
const rows=buildCoachRows(state,program);
assert.ok(rows.some(row=>row.record_type==='set'&&row.exercise_id==='back-squat'&&row.load==='70 kg'));
assert.ok(rows.some(row=>row.record_type==='set'&&row.exercise_id==='hang-clean'&&row.block_title==='Registro histórico'));
assert.ok(rows.some(row=>row.record_type==='session'&&row.rpe===8));
assert.ok(rows.some(row=>row.record_type==='finisher'&&row.time==='12:40'));
assert.ok(rows.some(row=>row.record_type==='metric'&&row.metric_value===84.5));
const csv=buildCoachCsv(state,program);
assert.equal(csv.rowCount,rows.length);
assert.equal(csv.csv.charCodeAt(0),0xFEFF);
assert.equal(buildBackup(state,'2026-09-04T00:00:00.000Z').state,state);
assert.deepEqual(migrate(JSON.parse(JSON.stringify(state))).sessions[monday.id]?.sets,state.sessions[monday.id]?.sets,'Las cargas V7 persisten después de recargar.');
// V5 migration preserves the original cycle anchor and recorded fields, adding only
// the matching V7 prescription snapshot to protect history from future updates.
const previousMonday=buildProgram('2026-09-21')[0]!;
const previousKey=setKey(previousMonday.blocks[1]!.id,'back-squat',0);
const previousState:AppState={
  ...emptyState(),
  programStart:'2026-09-21',
  sessions:{
    [previousMonday.id]:{
      ...state.sessions[monday.id]!,
      workoutId:previousMonday.id,
      date:previousMonday.date,
      activeKey:previousKey,
      sets:{[previousKey]:[{done:true,load:'80',reps:'5'}]},
    },
  },
  history:[{...summary,workoutId:previousMonday.id,date:previousMonday.date}],
  metrics:state.metrics,
};
const restarted=migrate(previousState);
assert.equal(restarted.programStart,'2026-09-21');
assert.deepEqual(Object.fromEntries(Object.entries(restarted.sessions).map(([id,{definition: _definition,...recorded}])=>[id,recorded])),previousState.sessions);
assert.deepEqual(restarted.sessions[previousMonday.id]?.definition,previousMonday);
assert.deepEqual(restarted.history,previousState.history);
assert.deepEqual(restarted.metrics,previousState.metrics);
assert.equal(restarted.sessions[monday.id],undefined);
assert.equal(sessionProgress(monday,restarted.sessions[previousMonday.id]),0);
assert.deepEqual(normalized(migrate(normalized(restarted))),normalized(restarted));
assert.ok(buildCoachRows(restarted,program).some(row=>row.date==='2026-09-21'&&row.load==='80'));
console.log('✓ V7 validado: 16 semanas, contraste, rotaciones, descargas, catálogo, historial y exportación.');