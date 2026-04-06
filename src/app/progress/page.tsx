'use client';

import { useState, useMemo } from 'react';
import { useFitness } from '@/context/FitnessContext';
import { ActivityType, Session } from '@/lib/types';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

const TABS: { type: ActivityType | 'calories'; label: string }[] = [
  { type: 'lifting', label: 'Lifting' },
  { type: 'running', label: 'Running' },
  { type: 'boxing', label: 'Boxing' },
  { type: 'basketball', label: 'Basketball' },
  { type: 'calories', label: 'Calories' },
];

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function LiftingProgress({ sessions }: { sessions: Session[] }) {
  const data = sessions
    .filter(s => s.type === 'lifting')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(s => {
      const m = s.metrics as { sets: number; reps: number; weight: number; exercise: string };
      return {
        date: formatDate(s.date),
        volume: m.sets * m.reps * m.weight,
        weight: m.weight,
        exercise: m.exercise,
      };
    });

  if (data.length === 0) return <EmptyState activity="lifting" />;

  return (
    <div className="space-y-6">
      <ChartCard title="Volume Over Time (sets × reps × weight)">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2d37" />
            <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <Tooltip contentStyle={{ background: '#1a1d27', border: '1px solid #2a2d37', borderRadius: '8px', color: '#e5e7eb' }} />
            <Line type="monotone" dataKey="volume" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1' }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Weight Progression">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2d37" />
            <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <Tooltip contentStyle={{ background: '#1a1d27', border: '1px solid #2a2d37', borderRadius: '8px', color: '#e5e7eb' }} />
            <Bar dataKey="weight" fill="#818cf8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function RunningProgress({ sessions }: { sessions: Session[] }) {
  const data = sessions
    .filter(s => s.type === 'running')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(s => {
      const m = s.metrics as { distance: number };
      return {
        date: formatDate(s.date),
        distance: m.distance,
        pace: Number((s.duration / m.distance).toFixed(1)),
      };
    });

  if (data.length === 0) return <EmptyState activity="running" />;

  return (
    <div className="space-y-6">
      <ChartCard title="Distance Over Time (km)">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2d37" />
            <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <Tooltip contentStyle={{ background: '#1a1d27', border: '1px solid #2a2d37', borderRadius: '8px', color: '#e5e7eb' }} />
            <Bar dataKey="distance" fill="#22c55e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Pace Trend (min/km — lower is faster)">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2d37" />
            <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <Tooltip contentStyle={{ background: '#1a1d27', border: '1px solid #2a2d37', borderRadius: '8px', color: '#e5e7eb' }} />
            <Line type="monotone" dataKey="pace" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e' }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function BoxingProgress({ sessions }: { sessions: Session[] }) {
  const data = sessions
    .filter(s => s.type === 'boxing')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(s => ({
      date: formatDate(s.date),
      rounds: (s.metrics as { rounds: number }).rounds,
      intensity: s.intensity,
    }));

  if (data.length === 0) return <EmptyState activity="boxing" />;

  return (
    <ChartCard title="Rounds Per Session">
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2d37" />
          <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 12 }} />
          <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
          <Tooltip contentStyle={{ background: '#1a1d27', border: '1px solid #2a2d37', borderRadius: '8px', color: '#e5e7eb' }} />
          <Bar dataKey="rounds" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

function BasketballProgress({ sessions }: { sessions: Session[] }) {
  const data = useMemo(() => {
    const bball = sessions
      .filter(s => s.type === 'basketball')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Group by week
    const weeks: Record<string, number> = {};
    bball.forEach(s => {
      const d = new Date(s.date);
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      const key = weekStart.toISOString().split('T')[0];
      weeks[key] = (weeks[key] || 0) + 1;
    });

    return Object.entries(weeks).map(([week, count]) => ({
      week: formatDate(week),
      sessions: count,
    }));
  }, [sessions]);

  if (data.length === 0) return <EmptyState activity="basketball" />;

  return (
    <ChartCard title="Sessions Per Week">
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2d37" />
          <XAxis dataKey="week" tick={{ fill: '#9ca3af', fontSize: 12 }} />
          <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} allowDecimals={false} />
          <Tooltip contentStyle={{ background: '#1a1d27', border: '1px solid #2a2d37', borderRadius: '8px', color: '#e5e7eb' }} />
          <Bar dataKey="sessions" fill="#eab308" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

function CaloriesProgress({ sessions }: { sessions: Session[] }) {
  const data = sessions
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(s => ({
      date: formatDate(s.date),
      calories: s.caloriesBurned,
      type: s.type,
    }));

  if (data.length === 0) return <EmptyState activity="any" />;

  return (
    <ChartCard title="Calorie Burn Per Session">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2d37" />
          <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 12 }} />
          <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
          <Tooltip contentStyle={{ background: '#1a1d27', border: '1px solid #2a2d37', borderRadius: '8px', color: '#e5e7eb' }} />
          <Area type="monotone" dataKey="calories" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="text-sm font-medium text-muted mb-4">{title}</h3>
      {children}
    </div>
  );
}

function EmptyState({ activity }: { activity: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-8 text-center">
      <p className="text-muted">No {activity} sessions logged yet.</p>
    </div>
  );
}

export default function ProgressPage() {
  const { state } = useFitness();
  const [activeTab, setActiveTab] = useState<ActivityType | 'calories'>('lifting');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Progress</h1>

      <div className="flex gap-1 bg-card border border-border rounded-lg p-1">
        {TABS.map(tab => (
          <button
            key={tab.type}
            onClick={() => setActiveTab(tab.type)}
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              activeTab === tab.type
                ? 'bg-accent text-white'
                : 'text-muted hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'lifting' && <LiftingProgress sessions={state.sessions} />}
      {activeTab === 'running' && <RunningProgress sessions={state.sessions} />}
      {activeTab === 'boxing' && <BoxingProgress sessions={state.sessions} />}
      {activeTab === 'basketball' && <BasketballProgress sessions={state.sessions} />}
      {activeTab === 'calories' && <CaloriesProgress sessions={state.sessions} />}
    </div>
  );
}
