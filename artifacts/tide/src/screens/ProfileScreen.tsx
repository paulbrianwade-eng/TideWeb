import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { EQUIPMENT_OPTIONS, PREFERENCES, SPORT_OPTIONS } from '../data/defaults';
import { Card, Field, SectionTitle, Toggle } from '../components/ui';
import { ExportButton } from '../components/ExportButton';
import { CloudSyncCard } from '../components/CloudSyncCard';
import { PhaseEditor, RaceDateCard } from '../components/PhaseEditor';
import { FOUR_WEEK_PLAN_ID } from '../data/mesocycle';

export const ProfileScreen = ({ onPlanRestarted }: { onPlanRestarted: () => void }) => {
  const app = useApp();
  const p = app.state.profile;
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmPlanRestart, setConfirmPlanRestart] = useState(false);
  const [planRestartMessage, setPlanRestartMessage] = useState('');
  const [confirmMesocycle, setConfirmMesocycle] = useState(false);
  const [mesocycleMessage, setMesocycleMessage] = useState('');

  const toggleIn = (list: string[], value: string) =>
    list.includes(value) ? list.filter((x) => x !== value) : [...list, value];

  return (
    <div className="blue-screen space-y-4">

      <header>
        <p className="eyebrow">Perfil</p>
        <h1 className="font-display text-3xl leading-none text-brand-dark">Configuración</h1>
      </header>

      <CloudSyncCard />

      <Card className="space-y-3 border-brand/30">
        <SectionTitle eyebrow="Rutina nueva · 4 semanas" title="Base, carga, pico y benchmark" />
        <p className="text-sm text-muted">
          La secuencia de cuatro semanas se repite cuatro veces en el calendario de 16 semanas de TIDE. Empieza hoy y conserva
          el historial, las sesiones, el perfil y las mediciones. Las cargas aproximadas son objetivos sugeridos, no resultados.
        </p>
        {app.state.activePlan === FOUR_WEEK_PLAN_ID && app.state.programStart === app.today ? (
          <p className="rounded-xl bg-lime-soft px-3 py-2 text-sm text-brand-dark" role="status">
            Este mesociclo ya está activo desde hoy.
          </p>
        ) : confirmMesocycle ? (
          <div className="space-y-2 rounded-xl border border-brand/20 bg-surface2 p-3">
            <p className="text-sm font-semibold text-ink">
              Se descargará un respaldo. Se reinician intercambios, sesiones omitidas y cambios de calendario desde hoy; el historial y el perfil se conservan.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="btn-primary flex-1"
                onClick={() => {
                  const result = app.integrateFourWeekMesocycleFromToday();
                  setMesocycleMessage(result.message);
                  if (result.ok) {
                    setConfirmMesocycle(false);
                    onPlanRestarted();
                  }
                }}
              >
                Descargar respaldo y aplicar rutina
              </button>
              <button type="button" onClick={() => setConfirmMesocycle(false)} className="btn-quiet">
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="btn-ghost w-full"
            onClick={() => { setMesocycleMessage(''); setConfirmMesocycle(true); }}
            data-testid="button-integrate-mesocycle"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" /> Integrar mesociclo desde hoy
          </button>
        )}
        {mesocycleMessage && <p className="text-sm text-ink" role="status">{mesocycleMessage}</p>}
      </Card>

      <RaceDateCard />
      <PhaseEditor />

      <Card className="space-y-3">
        <SectionTitle eyebrow="Datos" title="Perfil del atleta" />
        <Field label="Nombre" value={p.name} onChange={(v) => app.setProfile({ name: v })} />
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Edad"
            value={String(p.age)}
            inputMode="numeric"
            onChange={(v) => app.setProfile({ age: Number(v) || 0 })}
            suffix="años"
          />
          <Field
            label="Altura"
            value={String(p.height)}
            inputMode="numeric"
            onChange={(v) => app.setProfile({ height: Number(v) || 0 })}
            suffix="cm"
          />
          <Field
            label="Peso actual"
            value={String(p.weight)}
            inputMode="decimal"
            onChange={(v) => app.setProfile({ weight: Number(v.replace(',', '.')) || 0 })}
            suffix="kg"
          />
          <Field
            label="Peso objetivo"
            value={String(p.targetWeight)}
            inputMode="decimal"
            onChange={(v) => app.setProfile({ targetWeight: Number(v.replace(',', '.')) || 0 })}
            suffix="kg"
          />
          <Field
            label="Días disponibles"
            value={String(p.daysAvailable)}
            inputMode="numeric"
            onChange={(v) => app.setProfile({ daysAvailable: Number(v) || 0 })}
            suffix="por semana"
          />
          <Field
            label="Hora de entrenamiento"
            value={p.trainingTime}
            onChange={(v) => app.setProfile({ trainingTime: v })}
          />
        </div>
        <Field
          label="Duración preferida"
          value={p.preferredDuration}
          onChange={(v) => app.setProfile({ preferredDuration: v })}
        />
        <Field
          label="Molestias actuales"
          value={p.complaints.join(', ')}
          onChange={(v) => app.setProfile({ complaints: v.split(',').map((x) => x.trim()).filter(Boolean) })}
        />
      </Card>

      <Card className="space-y-3">
        <SectionTitle eyebrow="Disponible" title="Equipamiento" />
        <div className="grid gap-2 sm:grid-cols-2">
          {EQUIPMENT_OPTIONS.map((eq) => (
            <Toggle
              key={eq}
              active={p.equipment.includes(eq)}
              onClick={() => app.setProfile({ equipment: toggleIn(p.equipment, eq) })}
            >
              {eq}
            </Toggle>
          ))}
        </div>
      </Card>

      <Card className="space-y-3">
        <SectionTitle eyebrow="Práctica" title="Deportes" />
        <div className="grid gap-2 sm:grid-cols-2">
          {SPORT_OPTIONS.map((s) => (
            <Toggle
              key={s}
              active={p.sports.includes(s)}
              onClick={() => app.setProfile({ sports: toggleIn(p.sports, s) })}
            >
              {s}
            </Toggle>
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle eyebrow="Programación" title="Preferencias de entrenamiento" />
        <ul className="space-y-1 text-sm text-muted">
          {PREFERENCES.map((pref) => (
            <li key={pref} className="flex gap-2">
              <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand" />
              {pref}
            </li>
          ))}
        </ul>
      </Card>

      <Card className="space-y-3 border-brand/30">
        <SectionTitle eyebrow="Nuevo ciclo" title="Reiniciar el plan V8 desde hoy" />
        <p className="text-sm text-muted">
          Empieza en la semana 1 con el plan V8. Conserva tu historial, sesiones, cargas, perfil,
          mediciones y nutrición. Reinicia el calendario, los intercambios, las sesiones salteadas y las fases personalizadas.
        </p>
        {app.state.programStart === app.today ? (
          <p className="rounded-xl bg-lime-soft px-3 py-2 text-sm text-brand-dark" role="status">
            El plan V8 ya empieza hoy.
          </p>
        ) : confirmPlanRestart ? (
          <div className="space-y-2 rounded-xl border border-brand/20 bg-surface2 p-3">
            <p className="text-sm font-semibold text-ink">
              Se descargará un respaldo completo antes de cambiar el plan. Tu historial y perfil se conservarán.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="btn-primary flex-1"
                onClick={() => {
                  const result = app.restartPlanFromToday();
                  setPlanRestartMessage(result.message);
                  if (result.ok) {
                    setConfirmPlanRestart(false);
                    onPlanRestarted();
                  }
                }}
              >
                Descargar respaldo y reiniciar
              </button>
              <button type="button" onClick={() => setConfirmPlanRestart(false)} className="btn-quiet">
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="btn-ghost w-full"
            onClick={() => { setPlanRestartMessage(''); setConfirmPlanRestart(true); }}
            data-testid="button-restart-plan"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" /> Empezar de nuevo con V8
          </button>
        )}
        {planRestartMessage && <p className="text-sm text-ink" role="status">{planRestartMessage}</p>}
      </Card>

      <Card className="space-y-3">
        <SectionTitle eyebrow="Datos locales" title="Almacenamiento" />
        <p className="text-sm text-muted">
          Todo se guarda en este dispositivo. El reinicio conserva tus registros; la opción de demostración de abajo borra todo.
        </p>
        <ExportButton />
        {confirmReset ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                app.resetDemo();
                setConfirmReset(false);
              }}
              className="btn-ghost flex-1 border-danger/50 text-danger"
            >
              Confirmar borrado completo
            </button>
            <button type="button" onClick={() => setConfirmReset(false)} className="btn-quiet">
              Cancelar
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => setConfirmReset(true)} className="btn-ghost w-full">
            <RefreshCw className="h-4 w-4" aria-hidden="true" /> Borrar todos los datos de este dispositivo
          </button>
        )}
      </Card>
    </div>
  );
};
