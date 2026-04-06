'use client';

import { MuscleLoad, MUSCLE_GROUPS } from '@/lib/types';
import { getRecoveryTimeDays, fatigueToColor } from '@/lib/fatigue';

interface Props {
  fatigue: MuscleLoad;
}

export default function RecoveryTimeline({ fatigue }: Props) {
  const maxVal = Math.max(...MUSCLE_GROUPS.map(m => fatigue[m]), 1);

  const items = MUSCLE_GROUPS.map(muscle => ({
    muscle,
    days: getRecoveryTimeDays(fatigue[muscle]),
    fatigue: fatigue[muscle],
  })).sort((a, b) => b.days - a.days);

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4">Recovery Timeline</h2>
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.muscle} className="flex items-center gap-3">
            <span className="text-sm text-muted w-20 capitalize">{item.muscle}</span>
            <div className="flex-1 bg-border/50 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min((item.fatigue / maxVal) * 100, 100)}%`,
                  backgroundColor: fatigueToColor(item.fatigue, maxVal),
                }}
              />
            </div>
            <span className="text-xs text-muted w-20 text-right">
              {item.days === 0 ? 'Recovered' : `${item.days}d left`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
