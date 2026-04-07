'use client';

import { useMemo } from 'react';
import { useFitness } from '@/context/FitnessContext';
import { MUSCLE_GROUPS, LiftingMetrics, Session } from '@/lib/types';

function getWeekSessions(sessions: Session[], weeksAgo: number) {
  const now = new Date();
  const start = new Date(now.getTime() - (weeksAgo + 1) * 7 * 24 * 60 * 60 * 1000);
  const end = new Date(now.getTime() - weeksAgo * 7 * 24 * 60 * 60 * 1000);
  return sessions.filter(s => {
    const d = new Date(s.date);
    return d >= start && d < end;
  });
}

export default function ReportPage() {
  const { state } = useFitness();

  const thisWeek = useMemo(() => getWeekSessions(state.sessions, 0), [state.sessions]);
  const lastWeek = useMemo(() => getWeekSessions(state.sessions, 1), [state.sessions]);

  const stats = useMemo(() => {
    const totalSessions = thisWeek.length;
    const totalCalories = thisWeek.reduce((s, x) => s + x.caloriesBurned, 0);
    const totalDuration = thisWeek.reduce((s, x) => s + x.duration, 0);
    const avgIntensity = totalSessions > 0 ? (thisWeek.reduce((s, x) => s + x.intensity, 0) / totalSessions).toFixed(1) : '0';

    const lastSessions = lastWeek.length;
    const lastCalories = lastWeek.reduce((s, x) => s + x.caloriesBurned, 0);
    const lastDuration = lastWeek.reduce((s, x) => s + x.duration, 0);

    // Activity breakdown
    const activityCounts: Record<string, number> = {};
    thisWeek.forEach(s => { activityCounts[s.type] = (activityCounts[s.type] || 0) + 1; });

    // Muscle training frequency
    const muscleSessions: Record<string, number> = {};
    MUSCLE_GROUPS.forEach(m => { muscleSessions[m] = 0; });
    thisWeek.forEach(s => {
      MUSCLE_GROUPS.forEach(m => {
        if (s.muscleLoad[m] > 0) muscleSessions[m]++;
      });
    });
    const mostTrained = Object.entries(muscleSessions).sort((a, b) => b[1] - a[1])[0];
    const leastTrained = Object.entries(muscleSessions).sort((a, b) => a[1] - b[1])[0];

    // PRs this week
    const prsThisWeek: string[] = [];
    const allTimeBest: Record<string, number> = {};
    state.sessions.forEach(s => {
      if (s.type !== 'lifting') return;
      const m = s.metrics as LiftingMetrics;
      (m.exercises || []).forEach(ex => {
        if (!ex.name) return;
        const key = ex.name.toLowerCase();
        if (!allTimeBest[key] || ex.weight > allTimeBest[key]) allTimeBest[key] = ex.weight;
      });
    });
    thisWeek.forEach(s => {
      if (s.type !== 'lifting') return;
      const m = s.metrics as LiftingMetrics;
      (m.exercises || []).forEach(ex => {
        if (ex.name && allTimeBest[ex.name.toLowerCase()] === ex.weight) {
          prsThisWeek.push(`${ex.name}: ${ex.weight} lbs`);
        }
      });
    });

    // Avg heart rate
    const hrSessions = thisWeek.filter(s => s.avgHeartRate);
    const avgHR = hrSessions.length > 0 ? Math.round(hrSessions.reduce((s, x) => s + (x.avgHeartRate || 0), 0) / hrSessions.length) : null;

    return {
      totalSessions, totalCalories, totalDuration, avgIntensity,
      lastSessions, lastCalories, lastDuration,
      activityCounts, mostTrained, leastTrained, prsThisWeek, avgHR,
    };
  }, [thisWeek, lastWeek, state.sessions]);

  const delta = (curr: number, prev: number) => {
    if (prev === 0) return curr > 0 ? '+100%' : '—';
    const pct = Math.round(((curr - prev) / prev) * 100);
    return pct >= 0 ? `+${pct}%` : `${pct}%`;
  };

  const deltaColor = (curr: number, prev: number) => {
    if (curr > prev) return 'text-green-600';
    if (curr < prev) return 'text-red-500';
    return 'text-gray-400';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Weekly Report Card</h1>
        <p className="text-sm text-gray-500 mt-0.5">Your training summary for the past 7 days</p>
      </div>

      {/* Top stats with comparison */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Sessions', value: stats.totalSessions, prev: stats.lastSessions, unit: '' },
          { label: 'Calories', value: stats.totalCalories, prev: stats.lastCalories, unit: ' kcal' },
          { label: 'Duration', value: stats.totalDuration, prev: stats.lastDuration, unit: ' min' },
          { label: 'Avg Intensity', value: Number(stats.avgIntensity), prev: 0, unit: '/10', noDelta: true },
        ].map(stat => (
          <div key={stat.label} className="bg-white border border-gray-200 rounded-2xl p-4">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}{stat.unit}</p>
            {!('noDelta' in stat && stat.noDelta) && (
              <p className={`text-xs font-medium mt-0.5 ${deltaColor(stat.value, stat.prev)}`}>
                {delta(stat.value, stat.prev)} vs last week
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity breakdown */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Activity Breakdown</h2>
          {Object.entries(stats.activityCounts).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(stats.activityCounts).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
                <div key={type} className="flex items-center gap-3">
                  <span className="text-sm text-gray-700 capitalize w-24">{type}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: `${(count / stats.totalSessions) * 100}%` }} />
                  </div>
                  <span className="text-sm font-mono text-gray-500 w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No sessions this week.</p>
          )}
        </div>

        {/* Muscle coverage */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Muscle Coverage</h2>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-green-50 rounded-xl p-3">
              <p className="text-[10px] text-green-600 uppercase tracking-wide">Most Trained</p>
              <p className="text-lg font-bold text-green-800 capitalize">{stats.mostTrained?.[0] || '—'}</p>
              <p className="text-xs text-green-600">{stats.mostTrained?.[1] || 0} sessions</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-3">
              <p className="text-[10px] text-amber-600 uppercase tracking-wide">Least Trained</p>
              <p className="text-lg font-bold text-amber-800 capitalize">{stats.leastTrained?.[0] || '—'}</p>
              <p className="text-xs text-amber-600">{stats.leastTrained?.[1] || 0} sessions</p>
            </div>
          </div>
          {stats.avgHR && (
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">Avg Heart Rate</p>
              <p className="text-lg font-bold text-gray-900">{stats.avgHR} bpm</p>
            </div>
          )}
        </div>
      </div>

      {/* PRs this week */}
      {stats.prsThisWeek.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-yellow-800 mb-3 flex items-center gap-2">
            <span>🏆</span> PRs This Week
          </h2>
          <div className="flex flex-wrap gap-2">
            {[...new Set(stats.prsThisWeek)].map(pr => (
              <span key={pr} className="px-3 py-1.5 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">{pr}</span>
            ))}
          </div>
        </div>
      )}

      {/* Grade */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Weekly Grade</p>
        <div className="text-6xl font-black" style={{
          color: stats.totalSessions >= 5 ? '#16a34a' : stats.totalSessions >= 3 ? '#2563eb' : stats.totalSessions >= 1 ? '#d97706' : '#dc2626'
        }}>
          {stats.totalSessions >= 5 ? 'A' : stats.totalSessions >= 4 ? 'B+' : stats.totalSessions >= 3 ? 'B' : stats.totalSessions >= 2 ? 'C' : stats.totalSessions >= 1 ? 'D' : 'F'}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {stats.totalSessions >= 5 ? 'Outstanding week! Keep it up.' :
           stats.totalSessions >= 3 ? 'Solid effort. Room to push more.' :
           stats.totalSessions >= 1 ? 'Good start. Try to add more sessions.' :
           'No sessions logged. Time to get moving!'}
        </p>
      </div>
    </div>
  );
}
