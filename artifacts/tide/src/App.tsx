import { useState } from 'react';
import { AppProvider, useApp } from './state/AppContext';
import { AppShell } from './components/AppShell';
import type { Screen } from './components/AppShell';
import { TodayScreen } from './screens/TodayScreen';
import { WeekScreen } from './screens/WeekScreen';
import { SessionScreen } from './screens/SessionScreen';
import { ProgressScreen } from './screens/ProgressScreen';
import { LibraryScreen } from './screens/LibraryScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { WorkoutSummaryModal } from './components/WorkoutSummaryModal';
import { ReadinessCheck } from './components/readiness';
import { applyAdaptations, emptyAnswers } from './lib/adaptations';
import type { AdaptationAnswers } from './lib/adaptations';
import { clearSessionResume, readSessionResume, saveSessionResume } from './lib/session-resume';

const Router = () => {
  const app = useApp();
  const [screen, setScreen] = useState<Screen>((app.state.lastScreen as Screen) ?? 'today');
  const [session, setSessionState] = useState<{ id: string; block: number } | null>(() => {
    const saved = readSessionResume();
    if (!saved) return null;
    const storedSession = app.sessionFor(saved.workoutId);
    if (storedSession?.completedAt || (!storedSession?.definition && !app.workoutById(saved.workoutId))) {
      clearSessionResume();
      return null;
    }
    return { id: saved.workoutId, block: saved.blockIndex };
  });
  const [checking, setChecking] = useState<{ id: string; block: number } | null>(null);
  const [answers, setAnswers] = useState<AdaptationAnswers>(emptyAnswers);
  const [finishing, setFinishing] = useState<string | null>(null);

  const setSession = (next: { id: string; block: number } | null) => {
    if (next) {
      const saved = readSessionResume(next.id);
      saveSessionResume({
        workoutId: next.id,
        blockIndex: saved?.blockIndex ?? next.block,
        view: saved?.view ?? 'block',
        exerciseIndex: saved?.exerciseIndex ?? 0,
        timerBlockId: saved?.timerBlockId ?? null,
        restTimer: saved?.restTimer ?? null,
      });
    } else {
      clearSessionResume();
    }
    setSessionState(next);
  };

  const navigate = (s: Screen) => {
    setScreen(s);
    app.setScreen(s);
  };

  /** Toda entrada al modo sesión pasa primero por las preguntas previas. */
  const openSession = (id: string, block = 0) => {
    if (app.sessionFor(id)?.definition) setSession({ id, block });
    else setChecking({ id, block });
  };

  const adaptedWorkout = (id: string) => {
    const base = app.workoutById(id);
    if (!base) return undefined;
    if (app.sessionFor(id)?.definition) return app.sessionFor(id)!.definition;
    const { blocks, rules } = applyAdaptations(base, answers);
    return { ...base, blocks, adaptations: rules.map((r) => r.label) };
  };

  if (checking) {
    const workout = app.workoutById(checking.id);
    if (workout) {
      return (
        <ReadinessCheck
          workout={workout}
          onBack={() => setChecking(null)}
          onStart={(a) => {
            const adapted = applyAdaptations(workout, a);
            app.startSession({ ...workout, blocks: adapted.blocks, adaptations: adapted.rules.map(r => r.label) });
            setAnswers(a);
            setSession(checking);
            setChecking(null);
          }}
        />
      );
    }
  }

  if (session) {
    return (
      <SessionScreen
        key={session.id}
        workoutId={session.id}
        workout={adaptedWorkout(session.id)}
        initialBlockIndex={session.block}
        onExit={() => setSession(null)}
        onFinish={() => {
          setFinishing(session.id);
          setSession(null);
        }}
      />
    );
  }

  if (finishing) {
    return <WorkoutSummaryModal workoutId={finishing} onClose={() => setFinishing(null)} />;
  }

  return (
    <AppShell screen={screen} onNavigate={navigate} bleed={screen === 'today'}>
      {screen === 'today' && (
        <TodayScreen onStart={openSession} onProfile={() => navigate('profile')} onWeek={() => navigate('week')} />
      )}
      {screen === 'week' && <WeekScreen onOpen={(id) => openSession(id)} />}
      {screen === 'progress' && <ProgressScreen />}
      {screen === 'library' && <LibraryScreen />}
      {screen === 'profile' && <ProfileScreen onPlanRestarted={() => navigate('today')} />}
    </AppShell>
  );
};

export default function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}
