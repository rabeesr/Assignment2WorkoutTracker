'use client';

import { useFitness } from '@/context/FitnessContext';
import { LiftingMetrics } from '@/lib/types';
import Link from 'next/link';
import { useMemo } from 'react';

export default function GoalsWidget() {
  const { state } = useFitness();
  const activeGoals = state.goals.filter(g => !g.completedAt);

  const progress = useMemo(() => {
    return activeGoals.map(goal => {
      let current = 0;

      if (goal.type === 'weight' && goal.exercise) {
        state.sessions
          .filter(s => s.type === 'lifting')
          .forEach(s => {
            const m = s.metrics as LiftingMetrics;
            (m.exercises || []).forEach(ex => {
              if (ex.name.toLowerCase() === goal.exercise!.toLowerCase() && ex.weight > current) {
                current = ex.weight;
              }
            });
          });
      } else if (goal.type === 'run_pace') {
        let best = Infinity;
        state.sessions
          .filter(s => s.type === 'running')
          .forEach(s => {
            const pace = s.duration / (s.metrics as { distance: number }).distance * (s.metrics as { distance: number }).distance >= 5 ? s.duration : Infinity;
            const fiveKPace = s.duration;
            if (fiveKPace < best && (s.metrics as { distance: number }).distance >= 4.5) best = fiveKPace;
          });
        current = best === Infinity ? 0 : best;
      } else if (goal.type === 'sessions_per_week') {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        current = state.sessions.filter(s => new Date(s.date) >= weekAgo).length;
      }

      const pct = goal.type === 'run_pace'
        ? (current > 0 ? Math.min((goal.target / current) * 100, 100) : 0)
        : Math.min((current / goal.target) * 100, 100);

      return { ...goal, current, pct: Math.round(pct) };
    });
  }, [activeGoals, state.sessions]);

  if (progress.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-900">Goals</h2>
        <Link href="/goals" className="text-xs text-accent hover:text-accent-hover font-medium">Manage →</Link>
      </div>
      <div className="space-y-3">
        {progress.slice(0, 3).map(goal => (
          <div key={goal.id}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-700">{goal.title}</span>
              <span className="text-xs font-mono text-gray-400">{goal.pct}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${goal.pct}%`,
                  backgroundColor: goal.pct >= 100 ? '#16a34a' : goal.pct >= 50 ? '#2563eb' : '#d97706',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
