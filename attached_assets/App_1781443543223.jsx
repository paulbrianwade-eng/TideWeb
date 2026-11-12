import { useState, useEffect } from 'react'
import HomePage from './pages/HomePage'
import DayDetailPage from './pages/DayDetailPage'
import ActivityPage from './pages/ActivityPage'
import BottomNav from './components/BottomNav'
import { week } from './data/routine'

const CHECKS_KEY  = 'tide_checks_v1'
const HISTORY_KEY = 'tide_history_v1'

const dayMap = ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab']

function getCurrentDayId() {
  return dayMap[new Date().getDay()]
}

export default function App() {
  const [currentTab,    setCurrentTab]    = useState('home')
  const [selectedDayId, setSelectedDayId] = useState(null)

  const [checks, setChecks] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CHECKS_KEY) || '{}') } catch { return {} }
  })

  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]') } catch { return [] }
  })

  useEffect(() => { localStorage.setItem(CHECKS_KEY,  JSON.stringify(checks))  }, [checks])
  useEffect(() => { localStorage.setItem(HISTORY_KEY, JSON.stringify(history)) }, [history])

  const todayId = getCurrentDayId()

  const completedDays = (() => {
    const now       = new Date()
    const dayOfWeek = now.getDay() === 0 ? 6 : now.getDay() - 1
    const monday    = new Date(now)
    monday.setDate(now.getDate() - dayOfWeek)
    monday.setHours(0, 0, 0, 0)
    const completed = new Set()
    history.forEach(h => { if (new Date(h.date) >= monday) completed.add(h.dayId) })
    return Array.from(completed)
  })()

  function handleSelectDay(dayId) { setSelectedDayId(dayId); window.scrollTo(0, 0) }
  function handleBack()           { setSelectedDayId(null);  window.scrollTo(0, 0) }
  function handleToggleCheck(exerciseId) {
    setChecks(c => ({ ...c, [exerciseId]: !c[exerciseId] }))
  }

  function handleFinishWorkout(sessionData) {
    setHistory(h => [...h, sessionData])
    const day = week.find(d => d.id === sessionData.dayId)
    if (day) {
      setChecks(c => {
        const next = { ...c }
        // Soporta tanto la estructura nueva (cards) como la antigua (blocks)
        const allBlocks = day.cards
          ? day.cards.flatMap(card => card.blocks)
          : (day.blocks || [])
        allBlocks.forEach(b => b.exercises.forEach(e => { delete next[e.id] }))
        return next
      })
    }
  }

  function handleDeleteHistory(dateIso) {
    setHistory(h => h.filter(item => item.date !== dateIso))
  }

  function handleTabChange(tab) {
    setCurrentTab(tab)
    setSelectedDayId(null)
    window.scrollTo(0, 0)
  }

  if (selectedDayId) {
    const day = week.find(d => d.id === selectedDayId)
    if (!day) { handleBack(); return null }
    return (
      <div className="max-w-[480px] mx-auto bg-tide-bg min-h-screen relative">
        <DayDetailPage day={day} checks={checks} onToggle={handleToggleCheck}
          onBack={handleBack} onFinish={handleFinishWorkout} />
      </div>
    )
  }

  return (
    <div className="max-w-[480px] mx-auto bg-tide-bg min-h-screen relative">
      {currentTab === 'home' && (
        <HomePage onSelectDay={handleSelectDay} completedDays={completedDays}
          history={history} currentDayId={todayId} />
      )}
      {currentTab === 'activity' && (
        <ActivityPage history={history} onDelete={handleDeleteHistory} />
      )}
      <BottomNav active={currentTab} onChange={handleTabChange} />
    </div>
  )
}
