'use client';

import { ActivityType } from '@/lib/types';

const ACTIVITIES: { type: ActivityType; label: string; icon: string }[] = [
  { type: 'lifting', label: 'Lifting', icon: '🏋️' },
  { type: 'boxing', label: 'Boxing', icon: '🥊' },
  { type: 'running', label: 'Running', icon: '🏃' },
  { type: 'basketball', label: 'Basketball', icon: '🏀' },
];

interface Props {
  value: ActivityType | null;
  onChange: (type: ActivityType) => void;
}

export default function ActivitySelector({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {ACTIVITIES.map(activity => (
        <button
          key={activity.type}
          type="button"
          data-testid={`activity-${activity.type}`}
          onClick={() => onChange(activity.type)}
          className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
            value === activity.type
              ? 'border-accent bg-accent/10 text-accent'
              : 'border-border bg-card hover:border-accent/50 text-muted hover:text-foreground'
          }`}
        >
          <span className="text-2xl">{activity.icon}</span>
          <span className="text-sm font-medium">{activity.label}</span>
        </button>
      ))}
    </div>
  );
}
