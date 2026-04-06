'use client';

import { RunningMetrics } from '@/lib/types';

interface Props {
  value: RunningMetrics;
  onChange: (v: RunningMetrics) => void;
}

export default function RunningFields({ value, onChange }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium text-muted mb-1">Distance (km)</label>
      <input
        type="number"
        min={0}
        step={0.1}
        value={value.distance}
        onChange={e => onChange({ distance: Number(e.target.value) })}
        data-testid="distance-input"
        className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
      />
    </div>
  );
}
