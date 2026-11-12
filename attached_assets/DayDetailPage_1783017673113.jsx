import { useState, useMemo, useEffect } from 'react'
import { ArrowLeft, Clock, Target, CheckCircle2, Play, Pause, Zap } from 'lucide-react'
import BlockCard from '../components/BlockCard'
import FinishWorkoutModal from '../components/FinishWorkoutModal'
import RestTimer, { parseRest } from '../components/RestTimer'
import WeightLogModal from '../components/WeightLogModal'
import { useElapsedTimer, formatTime } from '../components/timerHooks'
import { isWeightedExercise } from '../data/loads'

const typeConfig = {
  bigg: { tag: 'HYBRID', dot: '#C8FF00' },
  run:  { tag: 'RUN',    dot: '#FFB800' },
  rest: { tag: 'REST',   dot: '#8B92A0' },
}

const CARD_META = {
  gym:  { emoji: '🏋️', accent: '#C8FF00', bg: 'rgba(200,255,0,0.10)'  },
  flex: { emoji: '🧘', accent: '#818CF8', bg: 'rgba(129,140,248,0.10)' },
  nut:  { emoji: '🥗', accent: '#34D399', bg: 'rgba(52,211,153,0.10)'  },
}

function getRequiredGear(day) {
  const text = JSON.stringify(day).toLowerCase()
  const gear = []
  if (/barbell|barra|squat|deadlift|bench press|hip thrust/.test(text)) gear.push('Barra olímpica + discos')
  if (/banco|bench/.test(text)) gear.push('Banco reclinable')
  if (/kb 20|kb 12|kb 8/.test(text)) gear.push('KBs (8/12/20)')
  if (/ddb |db /.test(text)) gear.push('Mancuernas')
  if (/box jump|cajón/.test(text)) gear.push('Cajón')
  if (/trx/.test(text)) gear.push('TRX')
  if (/soga|jump rope/.test(text)) gear.push('Soga')
  if (/elást|banded/.test(text)) gear.push('Elásticos')
  if (/rueda abdominal/.test(text)) gear.push('Rueda abd.')
  return gear
}

// ── Card picker screen ──────────────────────────────────────────────────────
function CardSelectionView({ day, onSelectCard, onBack }) {
  const cfg = typeConfig[day.type] || typeConfig.bigg
  return (
    <div className="min-h-screen bg-tide-bg pb-12">
      {/* Hero */}
      <div className="relative h-80 overflow-hidden">
        <img src={day.image} alt={day.title}
          className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.6 }} />
        <div className="absolute inset-0 bg-gradient-to-b from-tide-bg/30 via-tide-bg/50 to-tide-bg" />

        <div className="relative p-5 flex items-center justify-between" style={{ paddingTop: 'max(2.5rem, env(safe-area-inset-top))' }}>
          <button onClick={onBack}
            className="w-10 h-10 rounded-full bg-tide-bg/70 backdrop-blur-md border border-white/10 flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-tide-text" strokeWidth={2.5} />
          </button>
          <div className="flex items-center gap-1.5 bg-tide-bg/70 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
            <span className="text-[10px] font-extrabold tracking-widest text-tide-text">{cfg.tag}</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="text-tide-dim text-[11px] font-bold tracking-widest mb-1 uppercase">{day.name}</p>
          <h1 className="font-display text-3xl text-tide-text leading-tight mb-1">{day.title}</h1>
          <p className="text-tide-dim text-sm font-medium">{day.subtitle}</p>
        </div>
      </div>

      {/* Intro */}
      <div className="px-5 pt-4 pb-5">
        <p className="text-[13px] text-tide-dim leading-relaxed">{day.intro}</p>
      </div>

      {/* Cards */}
      <div className="px-5 space-y-3">
        <p className="text-[10px] font-bold text-tide-muted tracking-wider uppercase mb-2">
          ¿Qué hacés hoy?
        </p>
        {day.cards.map(card => {
          const meta = CARD_META[card.id] || CARD_META.gym
          return (
            <button key={card.id} onClick={() => onSelectCard(card.id)}
              className="w-full bg-tide-surface border border-tide-border rounded-2xl p-4 flex items-center gap-4 active:scale-[0.98] transition-transform text-left">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl"
                style={{ background: meta.bg, border: `1px solid ${meta.accent}40` }}>
                {meta.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display text-lg text-tide-text leading-tight">{card.label}</div>
                <div className="text-[12px] text-tide-dim mt-0.5">
                  {card.blocks.length} {card.blocks.length === 1 ? 'bloque' : 'bloques'} · {card.duration} min
                </div>
              </div>
              <span className="text-tide-dim text-xl pr-1">›</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Main component ──────────────────────────────────────────────────────────
export default function DayDetailPage({ day, checks, onToggle, onBack, onFinish }) {
  const [selectedCard, setSelectedCard]     = useState(null)
  const [showFinish,   setShowFinish]       = useState(false)
  const [restTarget,   setRestTarget]       = useState(null)
  const [weightLogTarget, setWeightLogTarget] = useState(null)
  const [skippedBlocks, setSkippedBlocks]   = useState({})
  const [sessionStarted, setSessionStarted] = useState(false)
  const [paused,        setPaused]          = useState(false)

  const cfg          = typeConfig[day.type] || typeConfig.bigg
  const sessionTimer = useElapsedTimer(sessionStarted && !paused)

  // ── Wake Lock: mantiene la pantalla encendida mientras entrenás ──
  useEffect(() => {
    if (!sessionStarted || !('wakeLock' in navigator)) return
    let wakeLock = null
    const acquire = async () => {
      try { wakeLock = await navigator.wakeLock.request('screen') } catch (_) {}
    }
    acquire()
    const onVisible = () => { if (document.visibilityState === 'visible') acquire() }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      wakeLock?.release()
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [sessionStarted])

  // ── Bloques activos según card seleccionada (o fallback a day.blocks) ──
  const activeBlocks = useMemo(() => {
    if (day.cards && selectedCard) {
      return day.cards.find(c => c.id === selectedCard)?.blocks || []
    }
    return day.blocks || []
  }, [day, selectedCard])

  const activeCard = day.cards?.find(c => c.id === selectedCard)

  const realBlocks     = activeBlocks.filter((b, idx) =>
    b.type !== 'warmup' && b.type !== 'quality' && !skippedBlocks[idx]
  )
  const totalExercises = realBlocks.reduce((acc, b) => acc + b.exercises.length, 0)
  const checkedCount   = realBlocks.reduce(
    (acc, b) => acc + b.exercises.filter(e => checks[e.id]).length, 0
  )
  const progress  = totalExercises > 0 ? (checkedCount / totalExercises) * 100 : 0
  const canFinish = day.type !== 'rest' && checkedCount > 0

  const requiredGear = useMemo(
    () => getRequiredGear({ ...day, blocks: activeBlocks }),
    [day, activeBlocks]
  )

  const nextExerciseId = useMemo(() => {
    for (const block of activeBlocks) {
      for (const ex of block.exercises) {
        if (!checks[ex.id]) return ex.id
      }
    }
    return null
  }, [activeBlocks, checks])

  // ── Mostrar picker si el día tiene cards y ninguna está seleccionada ──
  if (day.cards && !selectedCard) {
    return <CardSelectionView day={day} onSelectCard={setSelectedCard} onBack={onBack} />
  }

  // ── Handlers ──
  function handleBack() {
    if (day.cards && selectedCard) {
      setSelectedCard(null)
      setSessionStarted(false)
      setPaused(false)
      setSkippedBlocks({})
    } else {
      onBack()
    }
  }

  function handleToggleExercise(id) {
    const exercise  = activeBlocks.flatMap(b => b.exercises).find(e => e.id === id)
    const wasChecked = !!checks[id]
    onToggle(id)
    if (!wasChecked && sessionStarted) {
      if (isWeightedExercise(exercise)) {
        setWeightLogTarget(exercise)
      } else {
        const restSeconds = parseRest(exercise.rest)
        if (restSeconds > 0) setRestTarget({ seconds: restSeconds, exerciseName: 'Próximo set' })
      }
      setTimeout(() => {
        const nextEl = document.querySelector('[data-exercise-id]:not([data-checked="true"])')
        if (nextEl) nextEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 300)
    }
  }

  function handleWeightSaved() {
    const ex = weightLogTarget
    setWeightLogTarget(null)
    if (ex) {
      const restSeconds = parseRest(ex.rest)
      if (restSeconds > 0) setRestTarget({ seconds: restSeconds, exerciseName: 'Próximo set' })
    }
  }

  function handleStartSession() {
    setSessionStarted(true)
  }

  function handleSaveSession(sessionData) {
    onFinish({ ...sessionData, dayId: day.id, elapsedSeconds: sessionTimer.seconds })
    setShowFinish(false)
    onBack()
  }

  function handleSkipBlock(idx) {
    setSkippedBlocks(prev => ({ ...prev, [idx]: true }))
  }

  const currentDuration = activeCard?.duration || day.duration
  const tagLabel        = activeCard ? activeCard.label.toUpperCase() : cfg.tag

  // ── Render ──
  return (
    <div className="min-h-screen bg-tide-bg pb-32">

      {/* Hero */}
      <div className="relative h-80 overflow-hidden">
        <img src={day.image} alt={day.title}
          className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.65 }} />
        <div className="absolute inset-0 bg-gradient-to-b from-tide-bg/40 via-tide-bg/40 to-tide-bg" />

        <div className="relative p-5 flex items-center justify-between" style={{ paddingTop: 'max(2.5rem, env(safe-area-inset-top))' }}>
          <button onClick={handleBack}
            className="w-10 h-10 rounded-full bg-tide-bg/70 backdrop-blur-md border border-white/10 flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-tide-text" strokeWidth={2.5} />
          </button>
          <div className="flex items-center gap-1.5 bg-tide-bg/70 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
            <span className="text-[10px] font-extrabold tracking-widest text-tide-text">{tagLabel}</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="text-tide-dim text-[11px] font-bold tracking-widest mb-1 uppercase">
            {day.name}{activeCard ? ` · ${activeCard.emoji} ${activeCard.label}` : ''}
          </p>
          <h1 className="font-display text-3xl text-tide-text leading-tight mb-2">{day.title}</h1>
          <div className="flex items-center gap-4 text-tide-dim text-sm font-medium">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-tide-lime" /> {currentDuration} min
            </span>
            <span className="flex items-center gap-1.5">
              <Target className="w-4 h-4 text-tide-lime" /> {day.subtitle}
            </span>
          </div>
        </div>
      </div>

      {/* Sticky session bar */}
      {day.type !== 'rest' && (
        <div className="bg-tide-bg px-5 py-3 sticky top-0 z-20 border-b border-tide-border">
          {!sessionStarted ? (
            <button onClick={handleStartSession}
              className="w-full bg-tide-lime text-tide-bg font-extrabold py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform tracking-wide uppercase text-sm"
              style={{ boxShadow: '0 8px 24px rgba(200,255,0,0.3)' }}>
              <Zap className="w-4 h-4" strokeWidth={3} fill="currentColor" />
              Empezar {activeCard?.label || 'sesión'}
            </button>
          ) : (
            <div className="bg-tide-surface border border-tide-border rounded-2xl p-3">
              <div className="flex items-center gap-3">
                <button onClick={() => setPaused(p => !p)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform ${paused ? 'bg-tide-lime' : 'bg-tide-amber'}`}
                  style={{ boxShadow: paused ? '0 0 14px rgba(200,255,0,0.4)' : '0 0 14px rgba(255,184,0,0.4)' }}>
                  {paused
                    ? <Play  className="w-4 h-4 text-tide-bg" strokeWidth={2.5} fill="currentColor" />
                    : <Pause className="w-4 h-4 text-tide-bg" strokeWidth={2.5} fill="currentColor" />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold tracking-wider text-tide-muted uppercase">
                    {paused ? 'En pausa' : 'En curso'}
                  </div>
                  <div className="font-mono text-2xl font-bold text-tide-text leading-none">
                    {formatTime(sessionTimer.seconds)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold tracking-wider text-tide-muted uppercase">Progreso</div>
                  <div className="font-mono text-base font-bold text-tide-text">{checkedCount}/{totalExercises}</div>
                </div>
              </div>
              <div className="h-1 bg-tide-surface-2 rounded-full overflow-hidden mt-2">
                <div className="h-full bg-tide-lime transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%`, boxShadow: '0 0 8px #C8FF00' }} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pre-workout summary */}
      {!sessionStarted && day.type !== 'rest' && (
        <div className="mx-5 mt-4 bg-tide-surface border border-tide-border rounded-2xl p-4">
          <div className="text-[10px] font-bold text-tide-muted tracking-wider uppercase mb-3">Antes de empezar</div>
          <div className="grid grid-cols-2 gap-2.5 mb-3">
            <div className="bg-tide-bg border border-tide-border rounded-xl p-3">
              <div className="text-[10px] font-bold text-tide-muted tracking-wider uppercase mb-1">Bloques</div>
              <div className="font-display text-xl text-tide-text">{activeBlocks.length}</div>
            </div>
            <div className="bg-tide-bg border border-tide-border rounded-xl p-3">
              <div className="text-[10px] font-bold text-tide-muted tracking-wider uppercase mb-1">Tiempo</div>
              <div className="font-display text-xl text-tide-text">{currentDuration}'</div>
            </div>
          </div>
          {requiredGear.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-tide-muted tracking-wider uppercase mb-1.5">Necesitás</div>
              <div className="flex flex-wrap gap-1.5">
                {requiredGear.map(g => (
                  <span key={g} className="bg-tide-surface-3 text-tide-text text-[11px] px-2.5 py-1 rounded-lg font-medium">{g}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="px-5 py-4">
        <p className="text-[13px] text-tide-dim leading-relaxed">{day.intro}</p>
      </div>

      <div className="space-y-0 animate-slide-up">
        {activeBlocks.map((block, idx) => (
          <BlockCard key={idx} block={block} checks={checks}
            onToggle={handleToggleExercise}
            onSkipBlock={() => handleSkipBlock(idx)}
            isSkipped={!!skippedBlocks[idx]}
            sessionStarted={sessionStarted}
            nextExerciseId={nextExerciseId} />
        ))}
      </div>

      {canFinish && sessionStarted && (
        <div className="px-5 mt-4">
          <button onClick={() => setShowFinish(true)}
            className="w-full bg-tide-text text-tide-bg font-extrabold py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform uppercase text-sm tracking-wide">
            <CheckCircle2 className="w-4 h-4" strokeWidth={3} />
            Finalizar {activeCard?.label || 'entrenamiento'}
          </button>
          <p className="text-[11px] text-tide-muted text-center mt-2 font-medium">
            Te vamos a pedir tu FC promedio y calorías quemadas
          </p>
        </div>
      )}

      {showFinish && (
        <FinishWorkoutModal day={day} elapsedSeconds={sessionTimer.seconds}
          onClose={() => setShowFinish(false)} onSave={handleSaveSession} />
      )}

      {restTarget && (
        <RestTimer seconds={restTarget.seconds} exerciseName={restTarget.exerciseName}
          onClose={() => setRestTarget(null)} />
      )}

      {weightLogTarget && (
        <WeightLogModal exercise={weightLogTarget}
          onClose={() => setWeightLogTarget(null)} onSaved={handleWeightSaved} />
      )}
    </div>
  )
}
