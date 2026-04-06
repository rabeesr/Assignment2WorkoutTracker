'use client';

import { useParams } from 'next/navigation';
import { useFitness } from '@/context/FitnessContext';
import { MUSCLE_GROUPS, MuscleLoad } from '@/lib/types';
import { fatigueToColor } from '@/lib/fatigue';
import Link from 'next/link';

const ACTIVITY_ICONS: Record<string, string> = {
  lifting: '🏋️',
  boxing: '🥊',
  running: '🏃',
  basketball: '🏀',
};

export default function SessionDetailPage() {
  const params = useParams();
  const { getSession } = useFitness();
  const session = getSession(params.id as string);

  if (!session) {
    return (
      <div className="text-center py-16">
        <p className="text-muted text-lg mb-4">Session not found</p>
        <Link href="/history" className="text-accent hover:text-accent-hover font-medium">
          ← Back to History
        </Link>
      </div>
    );
  }

  const date = new Date(session.date);
  const maxLoad = Math.max(...MUSCLE_GROUPS.map(m => session.muscleLoad[m]), 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/history" className="text-muted hover:text-foreground text-sm">
          ← History
        </Link>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <span className="text-4xl">{ACTIVITY_ICONS[session.type]}</span>
          <div>
            <h1 className="text-2xl font-bold capitalize">{session.type} Session</h1>
            <p className="text-muted">
              {date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              {' at '}
              {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-background rounded-lg p-3">
            <p className="text-xs text-muted">Duration</p>
            <p className="text-xl font-bold">{session.duration} min</p>
          </div>
          <div className="bg-background rounded-lg p-3">
            <p className="text-xs text-muted">Intensity</p>
            <p className="text-xl font-bold">{session.intensity}/10</p>
          </div>
          <div className="bg-background rounded-lg p-3">
            <p className="text-xs text-muted">Calories</p>
            <p className="text-xl font-bold text-accent">{session.caloriesBurned} kcal</p>
          </div>
          <div className="bg-background rounded-lg p-3">
            <p className="text-xs text-muted">Type</p>
            <p className="text-xl font-bold capitalize">{session.type}</p>
          </div>
        </div>

        {/* Activity-specific metrics */}
        {'exercise' in session.metrics && (
          <div className="bg-background rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-muted mb-2">Lifting Details</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-muted">Exercise:</span> <span className="font-medium">{(session.metrics as { exercise: string }).exercise}</span></div>
              <div><span className="text-muted">Sets:</span> <span className="font-medium">{(session.metrics as { sets: number }).sets}</span></div>
              <div><span className="text-muted">Reps:</span> <span className="font-medium">{(session.metrics as { reps: number }).reps}</span></div>
              <div><span className="text-muted">Weight:</span> <span className="font-medium">{(session.metrics as { weight: number }).weight} lbs</span></div>
            </div>
          </div>
        )}
        {'rounds' in session.metrics && (
          <div className="bg-background rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-muted mb-2">Boxing Details</h3>
            <p className="text-sm"><span className="text-muted">Rounds:</span> <span className="font-medium">{(session.metrics as { rounds: number }).rounds}</span></p>
          </div>
        )}
        {'distance' in session.metrics && (
          <div className="bg-background rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-muted mb-2">Running Details</h3>
            <p className="text-sm"><span className="text-muted">Distance:</span> <span className="font-medium">{(session.metrics as { distance: number }).distance} km</span></p>
            <p className="text-sm mt-1"><span className="text-muted">Pace:</span> <span className="font-medium">{(session.duration / (session.metrics as { distance: number }).distance).toFixed(1)} min/km</span></p>
          </div>
        )}

        {/* Tags */}
        {session.tags.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-muted mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {session.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-accent/15 text-accent text-sm rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {session.notes && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-muted mb-2">Notes</h3>
            <p className="text-foreground bg-background rounded-lg p-3 text-sm">{session.notes}</p>
          </div>
        )}

        {/* Muscle Load */}
        <div>
          <h3 className="text-sm font-medium text-muted mb-3">Muscle Load Distribution</h3>
          <div className="space-y-2">
            {MUSCLE_GROUPS.map(muscle => (
              <div key={muscle} className="flex items-center gap-3">
                <span className="text-sm text-muted w-20 capitalize">{muscle}</span>
                <div className="flex-1 bg-border/50 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(session.muscleLoad[muscle] / maxLoad) * 100}%`,
                      backgroundColor: fatigueToColor(session.muscleLoad[muscle], maxLoad),
                    }}
                  />
                </div>
                <span className="text-xs text-muted w-12 text-right">
                  {session.muscleLoad[muscle].toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
