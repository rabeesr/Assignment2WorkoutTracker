'use client';

import { Session } from '@/lib/types';

interface Props {
  sessions: Session[];
}

export default function CalorieSummary({ sessions }: Props) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const todaySessions = sessions.filter(s => new Date(s.date) >= today);
  const weekSessions = sessions.filter(s => new Date(s.date) >= weekAgo);

  const todayCalories = todaySessions.reduce((sum, s) => sum + s.caloriesBurned, 0);
  const weekCalories = weekSessions.reduce((sum, s) => sum + s.caloriesBurned, 0);
  const avgDaily = weekSessions.length > 0 ? Math.round(weekCalories / 7) : 0;

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4">Energy Expenditure</h2>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-muted mb-1">Today</p>
          <p className="text-2xl font-bold text-accent">{todayCalories}</p>
          <p className="text-xs text-muted">kcal</p>
        </div>
        <div>
          <p className="text-xs text-muted mb-1">This Week</p>
          <p className="text-2xl font-bold text-foreground">{weekCalories.toLocaleString()}</p>
          <p className="text-xs text-muted">kcal</p>
        </div>
        <div>
          <p className="text-xs text-muted mb-1">Daily Avg</p>
          <p className="text-2xl font-bold text-foreground">{avgDaily}</p>
          <p className="text-xs text-muted">kcal/day</p>
        </div>
      </div>
    </div>
  );
}
