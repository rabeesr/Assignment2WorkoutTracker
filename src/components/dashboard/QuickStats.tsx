'use client';

import { Session } from '@/lib/types';

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
    { label: 'Sessions This Week', value: String(thisWeek.length) },
    { label: 'Most Trained', value: mostTrained ? mostTrained[0] : '—' },
    { label: 'Weekly Calories', value: `${totalCalories.toLocaleString()} kcal` },
    { label: 'Total Duration', value: `${totalDuration} min` },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map(stat => (
        <div key={stat.label} className="bg-white border border-gray-200 rounded-2xl p-4">
          <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
          <p className="text-xl font-bold text-gray-900 capitalize">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
