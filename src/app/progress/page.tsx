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
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 12 }} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
            <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#111827' }} />
            <Line type="monotone" dataKey="volume" stroke="#2563eb" strokeWidth={2} dot={{ fill: '#2563eb' }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Weight Progression">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 12 }} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
            <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#111827' }} />
            <Bar dataKey="weight" fill="#3b82f6" radius={[4, 4, 0, 0]} />
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
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 12 }} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
            <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#111827' }} />
            <Bar dataKey="distance" fill="#059669" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Pace Trend (min/km — lower is faster)">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 12 }} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
            <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#111827' }} />
            <Line type="monotone" dataKey="pace" stroke="#059669" strokeWidth={2} dot={{ fill: '#059669' }} />
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
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 12 }} />
          <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
          <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#111827' }} />
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
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="week" tick={{ fill: '#6b7280', fontSize: 12 }} />
          <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} allowDecimals={false} />
          <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#111827' }} />
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
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 12 }} />
          <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
          <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#111827' }} />
          <Area type="monotone" dataKey="calories" stroke="#2563eb" fill="#2563eb" fillOpacity={0.2} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
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
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
      <p className="text-gray-500">No {activity} sessions logged yet.</p>
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
                : 'text-gray-500 hover:text-foreground'
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
