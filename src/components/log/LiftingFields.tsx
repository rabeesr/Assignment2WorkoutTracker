'use client';

import { LiftingMetrics } from '@/lib/types';

interface Props {
  value: LiftingMetrics;
  onChange: (v: LiftingMetrics) => void;
}

export default function LiftingFields({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <label className="block text-sm font-medium text-muted mb-1">Exercise</label>
        <input
          type="text"
          value={value.exercise}
          onChange={e => onChange({ ...value, exercise: e.target.value })}
          placeholder="e.g., Bench Press"
          data-testid="exercise-input"
          className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-muted mb-1">Sets</label>
        <input
          type="number"
          min={1}
          value={value.sets}
          onChange={e => onChange({ ...value, sets: Number(e.target.value) })}
          data-testid="sets-input"
          className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-muted mb-1">Reps</label>
        <input
          type="number"
          min={1}
          value={value.reps}
          onChange={e => onChange({ ...value, reps: Number(e.target.value) })}
          data-testid="reps-input"
          className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
        />
      </div>
      <div className="col-span-2">
        <label className="block text-sm font-medium text-muted mb-1">Weight (lbs)</label>
        <input
          type="number"
          min={0}
          value={value.weight}
          onChange={e => onChange({ ...value, weight: Number(e.target.value) })}
          data-testid="weight-input"
          className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
        />
      </div>
    </div>
  );
}
