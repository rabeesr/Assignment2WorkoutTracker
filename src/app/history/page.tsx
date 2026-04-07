'use client';

import { useState, useMemo } from 'react';
import { useFitness } from '@/context/FitnessContext';
import { ActivityType, LiftingMetrics } from '@/lib/types';
import Link from 'next/link';

const ACTIVITY_ICONS: Record<ActivityType, string> = {
  lifting: '🏋️',
  boxing: '🥊',
  running: '🏃',
  basketball: '🏀',
};

export default function HistoryPage() {
  const { state, deleteSession } = useFitness();
  const [typeFilter, setTypeFilter] = useState<ActivityType | 'all'>('all');
  const [tagFilter, setTagFilter] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    state.sessions.forEach(s => s.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [state.sessions]);

  const filtered = useMemo(() => {
    return state.sessions
      .filter(s => typeFilter === 'all' || s.type === typeFilter)
      .filter(s => !tagFilter || s.tags.includes(tagFilter))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [state.sessions, typeFilter, tagFilter]);

  const handleDelete = (id: string) => {
    deleteSession(id);
    setExpandedId(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Session History</h1>

      <div className="flex flex-wrap gap-3">
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value as ActivityType | 'all')}
          className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-accent"
        >
          <option value="all">All Activities</option>
          <option value="lifting">Lifting</option>
          <option value="boxing">Boxing</option>
          <option value="running">Running</option>
          <option value="basketball">Basketball</option>
        </select>

        <select
          value={tagFilter}
          onChange={e => setTagFilter(e.target.value)}
          className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-accent"
        >
          <option value="">All Tags</option>
          {allTags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>

        <span className="flex items-center text-sm text-gray-400">
          {filtered.length} session{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
          <p className="text-gray-400">No sessions found.</p>
          <Link href="/log" className="text-accent text-sm hover:text-accent-hover mt-2 inline-block">
            Log your first session →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(session => {
            const isExpanded = expandedId === session.id;
            const date = new Date(session.date);
            const liftingMetrics = session.type === 'lifting' ? session.metrics as LiftingMetrics : null;
            return (
              <div key={session.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : session.id)}
                  className="w-full flex items-center gap-4 p-4 text-left cursor-pointer"
                >
                  <span className="text-2xl">{ACTIVITY_ICONS[session.type]}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-gray-900 capitalize">{session.type}</span>
                      {liftingMetrics && liftingMetrics.exercises?.length > 0 && (
                        <span className="text-xs text-gray-400">
                          {liftingMetrics.exercises.map(e => e.name).filter(Boolean).join(', ')}
                        </span>
                      )}
                      {session.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-accent rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-400">
                      {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      {' · '}{session.duration} min
                      {session.avgHeartRate ? ` · ${session.avgHeartRate} bpm` : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{session.caloriesBurned} kcal</p>
                    <p className="text-xs text-gray-400">{isExpanded ? '▲' : '▼'}</p>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                      <div><span className="text-gray-400">Duration:</span> <span className="text-gray-900">{session.duration} min</span></div>
                      <div><span className="text-gray-400">Intensity:</span> <span className="text-gray-900">{session.intensity}/10</span></div>
                      <div><span className="text-gray-400">Calories:</span> <span className="text-gray-900">{session.caloriesBurned} kcal</span></div>
                      {session.avgHeartRate && <div><span className="text-gray-400">Avg HR:</span> <span className="text-gray-900">{session.avgHeartRate} bpm</span></div>}
                      {session.maxHeartRate && <div><span className="text-gray-400">Max HR:</span> <span className="text-gray-900">{session.maxHeartRate} bpm</span></div>}
                      {session.energyLevel && <div><span className="text-gray-400">Energy:</span> <span className="text-gray-900">{session.energyLevel}/5</span></div>}
                      {session.location && <div><span className="text-gray-400">Location:</span> <span className="text-gray-900 capitalize">{session.location}</span></div>}
                    </div>

                    {liftingMetrics && liftingMetrics.exercises?.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs font-medium text-gray-400 mb-2">Exercises</p>
                        {liftingMetrics.exercises.map((ex, i) => (
                          <div key={i} className="flex items-center justify-between text-sm py-1">
                            <span className="text-gray-700">{ex.name || 'Unnamed'}</span>
                            <span className="text-gray-500 font-mono">{ex.sets}×{ex.reps} @ {ex.weight} lbs</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {'rounds' in session.metrics && (
                      <div className="text-sm"><span className="text-gray-400">Rounds:</span> <span className="text-gray-900">{(session.metrics as { rounds: number }).rounds}</span></div>
                    )}
                    {'distance' in session.metrics && (
                      <div className="text-sm"><span className="text-gray-400">Distance:</span> <span className="text-gray-900">{(session.metrics as { distance: number }).distance} km</span></div>
                    )}

                    {session.notes && (
                      <p className="text-sm text-gray-400 italic">&ldquo;{session.notes}&rdquo;</p>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <Link
                        href={`/session/${session.id}`}
                        className="text-sm text-accent hover:text-accent-hover font-medium"
                      >
                        Full Details →
                      </Link>
                      <button
                        onClick={() => handleDelete(session.id)}
                        className="text-xs text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        Delete Session
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
