import type { FinisherScore, WorkoutBlock } from '../types';

/**
 * Registro del resultado del finisher. El campo cambia según el tipo de score:
 * AMRAP pide rondas y repeticiones, For Time pide tiempo, los intervalos piden
 * distancia. Se guarda en cuanto se escribe.
 */
export const ScoreInput = ({
  block,
  value,
  onChange,
}: {
  block: WorkoutBlock;
  value?: FinisherScore;
  onChange: (score: FinisherScore) => void;
}) => {
  const set = (patch: Partial<FinisherScore>) => onChange({ ...value, ...patch });

  return (
    <section className="card p-4">
      <p className="label-brand label">Score del finisher</p>
      <p className="mt-0.5 text-sm text-muted">{block.scoreHint}</p>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {block.scoreType === 'rounds-reps' && (
          <>
            <label className="block">
              <span className="label">Rondas</span>
              <input
                inputMode="numeric"
                value={value?.rounds ?? ''}
                onChange={(e) => set({ rounds: e.target.value })}
                placeholder="0"
                className="field mt-1"
              />
            </label>
            <label className="block">
              <span className="label">Repeticiones</span>
              <input
                inputMode="numeric"
                value={value?.reps ?? ''}
                onChange={(e) => set({ reps: e.target.value })}
                placeholder="0"
                className="field mt-1"
              />
            </label>
          </>
        )}

        {block.scoreType === 'time' && (
          <label className="col-span-2 block">
            <span className="label">Tiempo total</span>
            <input
              value={value?.time ?? ''}
              onChange={(e) => set({ time: e.target.value })}
              placeholder="12:40"
              className="field mt-1"
            />
          </label>
        )}

        {block.scoreType === 'reps' && (
          <label className="col-span-2 block">
            <span className="label">Repeticiones totales</span>
            <input
              inputMode="numeric"
              value={value?.reps ?? ''}
              onChange={(e) => set({ reps: e.target.value })}
              placeholder="0"
              className="field mt-1"
            />
          </label>
        )}

        {block.scoreType === 'distance' && (
          <label className="col-span-2 block">
            <span className="label">Distancia total</span>
            <input
              value={value?.distance ?? ''}
              onChange={(e) => set({ distance: e.target.value })}
              placeholder="1200 m"
              className="field mt-1"
            />
          </label>
        )}

        <label className="col-span-2 block">
          <span className="label">Comentario</span>
          <input
            value={value?.note ?? ''}
            onChange={(e) => set({ note: e.target.value })}
            placeholder="Cómo se sintió"
            className="field mt-1"
          />
        </label>
      </div>
    </section>
  );
};
