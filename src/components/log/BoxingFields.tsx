'use client';

import { BoxingMetrics } from '@/lib/types';

interface Props {
  value: BoxingMetrics;
  onChange: (v: BoxingMetrics) => void;
}

export default function BoxingFields({ value, onChange }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium text-muted mb-1">Rounds</label>
      <input
        type="number"
        min={1}
        value={value.rounds}
        onChange={e => onChange({ rounds: Number(e.target.value) })}
        data-testid="rounds-input"
        className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
      />
    </div>
  );
}
