'use client';

import { useParams } from 'next/navigation';
import { useFitness } from '@/context/FitnessContext';
import { MUSCLE_GROUPS, LiftingMetrics } from '@/lib/types';
import { fatigueToColor } from '@/lib/fatigue';
import Link from 'next/link';

const ACTIVITY_ICONS: Record<string, string> = {
  lifting: '🏋️', boxing: '🥊', running: '🏃', basketball: '🏀',
};

export default function SessionDetailPage() {
  const params = useParams();
  const { getSession } = useFitness();
  const session = getSession(params.id as string);

  if (!session) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 text-lg mb-4">Session not found</p>
        <Link href="/history" className="text-accent hover:text-accent-hover font-medium">← Back to History</Link>
      </div>
    );
  }

  const date = new Date(session.date);
  const maxLoad = Math.max(...MUSCLE_GROUPS.map(m => session.muscleLoad[m]), 1);
  const liftingMetrics = session.type === 'lifting' ? session.metrics as LiftingMetrics : null;

  return (
    <div className="space-y-6">
      <Link href="/history" className="text-gray-400 hover:text-gray-900 text-sm">← History</Link>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <span className="text-4xl">{ACTIVITY_ICONS[session.type]}</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 capitalize">{session.type} Session</h1>
            <p className="text-gray-500">
              {date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              {' at '}{date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-[10px] text-gray-400">Duration</p>
            <p className="text-xl font-bold text-gray-900">{session.duration} min</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-[10px] text-gray-400">Intensity</p>
            <p className="text-xl font-bold text-gray-900">{session.intensity}/10</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-[10px] text-gray-400">Calories</p>
            <p className="text-xl font-bold text-accent">{session.caloriesBurned} kcal</p>
          </div>
          {session.avgHeartRate ? (
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] text-gray-400">Avg Heart Rate</p>
              <p className="text-xl font-bold text-gray-900">{session.avgHeartRate} bpm</p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] text-gray-400">Type</p>
              <p className="text-xl font-bold text-gray-900 capitalize">{session.type}</p>
            </div>
          )}
        </div>

        {/* Extra biometrics row */}
        {(session.maxHeartRate || session.energyLevel || session.location) && (
          <div className="flex flex-wrap gap-3 mb-6">
            {session.maxHeartRate && (
              <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">Max HR: {session.maxHeartRate} bpm</span>
            )}
            {session.energyLevel && (
              <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">Energy: {session.energyLevel}/5</span>
            )}
            {session.location && (
              <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full capitalize">📍 {session.location}</span>
            )}
          </div>
        )}

        {/* Lifting exercises */}
        {liftingMetrics && liftingMetrics.exercises?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Exercises</h3>
            <div className="bg-gray-50 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left px-4 py-2 text-[10px] font-medium text-gray-400 uppercase">Exercise</th>
                    <th className="text-center px-4 py-2 text-[10px] font-medium text-gray-400 uppercase">Sets</th>
                    <th className="text-center px-4 py-2 text-[10px] font-medium text-gray-400 uppercase">Reps</th>
                    <th className="text-right px-4 py-2 text-[10px] font-medium text-gray-400 uppercase">Weight</th>
                    <th className="text-right px-4 py-2 text-[10px] font-medium text-gray-400 uppercase">Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {liftingMetrics.exercises.map((ex, i) => (
                    <tr key={i} className="border-b border-gray-100 last:border-0">
                      <td className="px-4 py-2.5 font-medium text-gray-900">{ex.name || 'Unnamed'}</td>
                      <td className="px-4 py-2.5 text-center text-gray-600">{ex.sets}</td>
                      <td className="px-4 py-2.5 text-center text-gray-600">{ex.reps}</td>
                      <td className="px-4 py-2.5 text-right text-gray-600">{ex.weight} lbs</td>
                      <td className="px-4 py-2.5 text-right font-mono text-gray-500">{ex.sets * ex.reps * ex.weight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {'rounds' in session.metrics && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Boxing Details</h3>
            <p className="text-sm"><span className="text-gray-400">Rounds:</span> <span className="font-medium text-gray-900">{(session.metrics as { rounds: number }).rounds}</span></p>
          </div>
        )}
        {'distance' in session.metrics && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Running Details</h3>
            <p className="text-sm"><span className="text-gray-400">Distance:</span> <span className="font-medium text-gray-900">{(session.metrics as { distance: number }).distance} km</span></p>
            <p className="text-sm mt-1"><span className="text-gray-400">Pace:</span> <span className="font-medium text-gray-900">{(session.duration / (session.metrics as { distance: number }).distance).toFixed(1)} min/km</span></p>
          </div>
        )}

        {session.tags.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {session.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-blue-50 text-accent text-sm rounded-full">{tag}</span>
              ))}
            </div>
          </div>
        )}

        {session.notes && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
            <p className="text-gray-900 bg-gray-50 rounded-xl p-3 text-sm">{session.notes}</p>
          </div>
        )}

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-3">Muscle Load Distribution</h3>
          <div className="space-y-2">
            {MUSCLE_GROUPS.map(muscle => (
              <div key={muscle} className="flex items-center gap-3">
                <span className="text-sm text-gray-500 w-20 capitalize">{muscle}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(session.muscleLoad[muscle] / maxLoad) * 100}%`,
                      backgroundColor: fatigueToColor(session.muscleLoad[muscle], maxLoad),
                    }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-12 text-right font-mono">{session.muscleLoad[muscle].toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
