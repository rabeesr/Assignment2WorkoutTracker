'use client';

import { LiftingMetrics, LiftingExercise } from '@/lib/types';

interface Props {
  value: LiftingMetrics;
  onChange: (v: LiftingMetrics) => void;
}

const EMPTY_EXERCISE: LiftingExercise = { name: '', sets: 3, reps: 10, weight: 135 };

export default function LiftingFields({ value, onChange }: Props) {
  const exercises = value.exercises || [];

  const updateExercise = (index: number, field: keyof LiftingExercise, val: string | number) => {
    const updated = [...exercises];
    updated[index] = { ...updated[index], [field]: val };
    onChange({ exercises: updated });
  };

  const addExercise = () => {
    onChange({ exercises: [...exercises, { ...EMPTY_EXERCISE }] });
  };

  const removeExercise = (index: number) => {
    onChange({ exercises: exercises.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-3">
      {exercises.map((ex, i) => (
        <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">Exercise {i + 1}</span>
            {exercises.length > 1 && (
              <button
                type="button"
                onClick={() => removeExercise(i)}
                className="text-xs text-red-400 hover:text-red-600 cursor-pointer"
              >
                Remove
              </button>
            )}
          </div>
          <input
            type="text"
            value={ex.name}
            onChange={e => updateExercise(i, 'name', e.target.value)}
            placeholder="e.g., Bench Press"
            data-testid={i === 0 ? 'exercise-input' : undefined}
            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-accent"
          />
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[10px] text-gray-400 mb-0.5">Sets</label>
              <input
                type="number"
                min={1}
                value={ex.sets}
                onChange={e => updateExercise(i, 'sets', Number(e.target.value))}
                data-testid={i === 0 ? 'sets-input' : undefined}
                className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-[10px] text-gray-400 mb-0.5">Reps</label>
              <input
                type="number"
                min={1}
                value={ex.reps}
                onChange={e => updateExercise(i, 'reps', Number(e.target.value))}
                data-testid={i === 0 ? 'reps-input' : undefined}
                className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-[10px] text-gray-400 mb-0.5">Weight (lbs)</label>
              <input
                type="number"
                min={0}
                value={ex.weight}
                onChange={e => updateExercise(i, 'weight', Number(e.target.value))}
                data-testid={i === 0 ? 'weight-input' : undefined}
                className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-accent"
              />
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addExercise}
        className="w-full py-2 border border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-accent hover:text-accent transition-colors cursor-pointer"
      >
        + Add Exercise
      </button>
    </div>
  );
}
