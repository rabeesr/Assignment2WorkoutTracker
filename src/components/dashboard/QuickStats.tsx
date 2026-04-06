'use client';

import { Session, ActivityType } from '@/lib/types';

interface Props {
  sessions: Session[];
}

export default function QuickStats({ sessions }: Props) {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thisWeek = sessions.filter(s => new Date(s.date) >= weekAgo);

  const activityCounts: Record<string, number> = {};
  thisWeek.forEach(s => {
    activityCounts[s.type] = (activityCounts[s.type] || 0) + 1;
  });
  const mostTrained = Object.entries(activityCounts).sort((a, b) => b[1] - a[1])[0];

  const totalCalories = thisWeek.reduce((sum, s) => sum + s.caloriesBurned, 0);
  const totalDuration = thisWeek.reduce((sum, s) => sum + s.duration, 0);

  const stats = [
    { label: 'Sessions This Week', value: thisWeek.length, accent: false },
    { label: 'Most Trained', value: mostTrained ? mostTrained[0] : '—', accent: false },
    { label: 'Weekly Calories', value: `${totalCalories.toLocaleString()} kcal`, accent: true },
    { label: 'Total Duration', value: `${totalDuration} min`, accent: false },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map(stat => (
        <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted mb-1">{stat.label}</p>
          <p className={`text-xl font-bold capitalize ${stat.accent ? 'text-accent' : 'text-foreground'}`}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
