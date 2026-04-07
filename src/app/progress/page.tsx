'use client';

import { useState, useMemo } from 'react';
import { useFitness } from '@/context/FitnessContext';
import { ActivityType, Session, LiftingMetrics } from '@/lib/types';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

const TABS: { type: ActivityType | 'calories' | 'heart_rate'; label: string }[] = [
  { type: 'lifting', label: 'Lifting' },
  { type: 'running', label: 'Running' },
  { type: 'boxing', label: 'Boxing' },
  { type: 'basketball', label: 'Basketball' },
  { type: 'calories', label: 'Calories' },
  { type: 'heart_rate', label: 'Heart Rate' },
];

const TOOLTIP_STYLE = { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#111827', fontSize: '12px' };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function LiftingProgress({ sessions }: { sessions: Session[] }) {
  const liftingSessions = sessions.filter(s => s.type === 'lifting');

  // Get all unique exercise names
  const exerciseNames = useMemo(() => {
    const names = new Set<string>();
    liftingSessions.forEach(s => {
      const m = s.metrics as LiftingMetrics;
      m.exercises?.forEach(ex => { if (ex.name) names.add(ex.name); });
    });
    return Array.from(names).sort();
  }, [liftingSessions]);

  const [selectedExercise, setSelectedExercise] = useState<string>(exerciseNames[0] || '');

  const exerciseData = useMemo(() => {
    return liftingSessions
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .flatMap(s => {
        const m = s.metrics as LiftingMetrics;
        return (m.exercises || [])
          .filter(ex => ex.name === selectedExercise)
          .map(ex => ({
            date: formatDate(s.date),
            weight: ex.weight,
            volume: ex.sets * ex.reps * ex.weight,
            sets: ex.sets,
            reps: ex.reps,
          }));
      });
  }, [liftingSessions, selectedExercise]);

  if (exerciseNames.length === 0) return <EmptyState activity="lifting" />;

  return (
    <div className="space-y-4">
      {/* Exercise selector */}
      <div className="flex gap-2 flex-wrap">
        {exerciseNames.map(name => (
          <button
            key={name}
            onClick={() => setSelectedExercise(name)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              selectedExercise === name
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      {exerciseData.length > 0 ? (
        <div className="space-y-6">
          <ChartCard title={`${selectedExercise} — Weight Over Time`}>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={exerciseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} unit=" lbs" />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Line type="monotone" dataKey="weight" stroke="#2563eb" strokeWidth={2} dot={{ fill: '#2563eb', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title={`${selectedExercise} — Volume (sets × reps × weight)`}>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={exerciseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Bar dataKey="volume" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      ) : (
        <p className="text-sm text-gray-400 py-4">No data for {selectedExercise} yet.</p>
      )}
    </div>
  );
}

function RunningProgress({ sessions }: { sessions: Session[] }) {
  const data = sessions
    .filter(s => s.type === 'running')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(s => ({
      date: formatDate(s.date),
      distance: (s.metrics as { distance: number }).distance,
      pace: Number((s.duration / (s.metrics as { distance: number }).distance).toFixed(1)),
    }));

  if (data.length === 0) return <EmptyState activity="running" />;

  return (
    <div className="space-y-6">
      <ChartCard title="Distance Over Time (km)">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 12 }} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Bar dataKey="distance" fill="#059669" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Pace Trend (min/km)">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 12 }} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Line type="monotone" dataKey="pace" stroke="#059669" strokeWidth={2} dot={{ fill: '#059669' }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function BoxingProgress({ sessions }: { sessions: Session[] }) {
  const data = sessions.filter(s => s.type === 'boxing')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(s => ({ date: formatDate(s.date), rounds: (s.metrics as { rounds: number }).rounds }));
  if (data.length === 0) return <EmptyState activity="boxing" />;
  return (
    <ChartCard title="Rounds Per Session">
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 12 }} />
          <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Bar dataKey="rounds" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

function BasketballProgress({ sessions }: { sessions: Session[] }) {
  const data = useMemo(() => {
    const bball = sessions.filter(s => s.type === 'basketball').sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const weeks: Record<string, number> = {};
    bball.forEach(s => {
      const d = new Date(s.date);
      const weekStart = new Date(d); weekStart.setDate(d.getDate() - d.getDay());
      const key = weekStart.toISOString().split('T')[0];
      weeks[key] = (weeks[key] || 0) + 1;
    });
    return Object.entries(weeks).map(([week, count]) => ({ week: formatDate(week), sessions: count }));
  }, [sessions]);
  if (data.length === 0) return <EmptyState activity="basketball" />;
  return (
    <ChartCard title="Sessions Per Week">
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="week" tick={{ fill: '#6b7280', fontSize: 12 }} />
          <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} allowDecimals={false} />
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Bar dataKey="sessions" fill="#d97706" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

function CaloriesProgress({ sessions }: { sessions: Session[] }) {
  const data = sessions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(s => ({ date: formatDate(s.date), calories: s.caloriesBurned }));
  if (data.length === 0) return <EmptyState activity="any" />;
  return (
    <ChartCard title="Calorie Burn Per Session">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 12 }} />
          <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Area type="monotone" dataKey="calories" stroke="#2563eb" fill="#2563eb" fillOpacity={0.1} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

const HR_ZONES = [
  { name: 'Zone 1 (Recovery)', min: 0, max: 0.6, color: '#93c5fd', label: '50-60%' },
  { name: 'Zone 2 (Endurance)', min: 0.6, max: 0.7, color: '#4ade80', label: '60-70%' },
  { name: 'Zone 3 (Tempo)', min: 0.7, max: 0.8, color: '#facc15', label: '70-80%' },
  { name: 'Zone 4 (Threshold)', min: 0.8, max: 0.9, color: '#fb923c', label: '80-90%' },
  { name: 'Zone 5 (Max)', min: 0.9, max: 1.0, color: '#ef4444', label: '90-100%' },
];

function HeartRateProgress({ sessions }: { sessions: Session[] }) {
  const hrSessions = sessions.filter(s => s.avgHeartRate).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const maxHR = 220; // estimated max

  const zoneDistribution = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    hrSessions.forEach(s => {
      const ratio = (s.avgHeartRate || 0) / maxHR;
      if (ratio < 0.6) counts[0]++;
      else if (ratio < 0.7) counts[1]++;
      else if (ratio < 0.8) counts[2]++;
      else if (ratio < 0.9) counts[3]++;
      else counts[4]++;
    });
    return counts;
  }, [hrSessions]);

  const total = hrSessions.length;

  const hrTrendData = hrSessions.map(s => ({
    date: formatDate(s.date),
    avg: s.avgHeartRate,
    max: s.maxHeartRate,
  }));

  if (hrSessions.length === 0) {
    return <EmptyState activity="sessions with heart rate data" />;
  }

  return (
    <div className="space-y-6">
      {/* Zone distribution */}
      <ChartCard title="Heart Rate Zone Distribution">
        <div className="space-y-3">
          {HR_ZONES.map((zone, i) => (
            <div key={zone.name} className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-32 truncate">{zone.name}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden relative">
                <div
                  className="h-full rounded-full transition-all duration-700 flex items-center justify-end pr-2"
                  style={{ width: `${total > 0 ? (zoneDistribution[i] / total) * 100 : 0}%`, backgroundColor: zone.color, minWidth: zoneDistribution[i] > 0 ? '32px' : '0' }}
                >
                  {zoneDistribution[i] > 0 && (
                    <span className="text-[10px] font-bold text-white drop-shadow">{zoneDistribution[i]}</span>
                  )}
                </div>
              </div>
              <span className="text-[10px] text-gray-400 w-16 text-right">{zone.label}</span>
            </div>
          ))}
        </div>
      </ChartCard>

      {/* HR trend */}
      <ChartCard title="Heart Rate Over Time">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={hrTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 12 }} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} domain={['dataMin - 10', 'dataMax + 10']} unit=" bpm" />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Line type="monotone" dataKey="avg" stroke="#2563eb" strokeWidth={2} dot={{ fill: '#2563eb', r: 3 }} name="Avg HR" />
            <Line type="monotone" dataKey="max" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 4" dot={{ fill: '#ef4444', r: 2 }} name="Max HR" />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <h3 className="text-sm font-medium text-gray-500 mb-4">{title}</h3>
      {children}
    </div>
  );
}

function EmptyState({ activity }: { activity: string }) {
  return <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center"><p className="text-gray-400">No {activity} sessions logged yet.</p></div>;
}

export default function ProgressPage() {
  const { state } = useFitness();
  const [activeTab, setActiveTab] = useState<ActivityType | 'calories' | 'heart_rate'>('lifting');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Progress</h1>
      <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1">
        {TABS.map(tab => (
          <button key={tab.type} onClick={() => setActiveTab(tab.type)}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeTab === tab.type ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900'
            }`}
          >{tab.label}</button>
        ))}
      </div>
      {activeTab === 'lifting' && <LiftingProgress sessions={state.sessions} />}
      {activeTab === 'running' && <RunningProgress sessions={state.sessions} />}
      {activeTab === 'boxing' && <BoxingProgress sessions={state.sessions} />}
      {activeTab === 'basketball' && <BasketballProgress sessions={state.sessions} />}
      {activeTab === 'calories' && <CaloriesProgress sessions={state.sessions} />}
      {activeTab === 'heart_rate' && <HeartRateProgress sessions={state.sessions} />}
    </div>
  );
}
