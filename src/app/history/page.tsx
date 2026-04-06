'use client';

import { useState, useMemo } from 'react';
import { useFitness } from '@/context/FitnessContext';
import { ActivityType } from '@/lib/types';
import Link from 'next/link';

const ACTIVITY_ICONS: Record<ActivityType, string> = {
  lifting: '🏋️',
  boxing: '🥊',
  running: '🏃',
  basketball: '🏀',
};

export default function HistoryPage() {
  const { state } = useFitness();
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Session History</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value as ActivityType | 'all')}
          className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
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
          className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
        >
          <option value="">All Tags</option>
          {allTags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>

        <span className="flex items-center text-sm text-muted">
          {filtered.length} session{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Session List */}
      {filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <p className="text-muted">No sessions found.</p>
          <Link href="/log" className="text-accent text-sm hover:text-accent-hover mt-2 inline-block">
            Log your first session →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(session => {
            const isExpanded = expandedId === session.id;
            const date = new Date(session.date);
            return (
              <div
                key={session.id}
                className="bg-card border border-border rounded-xl overflow-hidden transition-colors hover:border-border/80"
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : session.id)}
                  className="w-full flex items-center gap-4 p-4 text-left cursor-pointer"
                >
                  <span className="text-2xl">{ACTIVITY_ICONS[session.type]}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium capitalize">{session.type}</span>
                      {session.tags.map(tag => (
                        <span key={tag} className="text-xs px-2 py-0.5 bg-accent/15 text-accent rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-muted">
                      {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      {' · '}{session.duration} min · Intensity {session.intensity}/10
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{session.caloriesBurned} kcal</p>
                    <p className="text-xs text-muted">{isExpanded ? '▲' : '▼'}</p>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-border pt-3 space-y-2">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted">Duration:</span>{' '}
                        <span className="text-foreground">{session.duration} min</span>
                      </div>
                      <div>
                        <span className="text-muted">Intensity:</span>{' '}
                        <span className="text-foreground">{session.intensity}/10</span>
                      </div>
                      <div>
                        <span className="text-muted">Calories:</span>{' '}
                        <span className="text-foreground">{session.caloriesBurned} kcal</span>
                      </div>
                      {'exercise' in session.metrics && (
                        <div>
                          <span className="text-muted">Exercise:</span>{' '}
                          <span className="text-foreground">{(session.metrics as { exercise: string }).exercise}</span>
                        </div>
                      )}
                      {'sets' in session.metrics && (
                        <div>
                          <span className="text-muted">Sets × Reps:</span>{' '}
                          <span className="text-foreground">
                            {(session.metrics as { sets: number; reps: number }).sets} × {(session.metrics as { sets: number; reps: number }).reps}
                          </span>
                        </div>
                      )}
                      {'weight' in session.metrics && (
                        <div>
                          <span className="text-muted">Weight:</span>{' '}
                          <span className="text-foreground">{(session.metrics as { weight: number }).weight} lbs</span>
                        </div>
                      )}
                      {'rounds' in session.metrics && (
                        <div>
                          <span className="text-muted">Rounds:</span>{' '}
                          <span className="text-foreground">{(session.metrics as { rounds: number }).rounds}</span>
                        </div>
                      )}
                      {'distance' in session.metrics && (
                        <div>
                          <span className="text-muted">Distance:</span>{' '}
                          <span className="text-foreground">{(session.metrics as { distance: number }).distance} km</span>
                        </div>
                      )}
                    </div>
                    {session.notes && (
                      <p className="text-sm text-muted italic">&ldquo;{session.notes}&rdquo;</p>
                    )}
                    <Link
                      href={`/session/${session.id}`}
                      className="text-sm text-accent hover:text-accent-hover font-medium inline-block mt-1"
                    >
                      Full Details →
                    </Link>
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
