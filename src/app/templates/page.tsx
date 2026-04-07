'use client';

import { useFitness } from '@/context/FitnessContext';
import { LiftingMetrics } from '@/lib/types';
import Link from 'next/link';

const ACTIVITY_ICONS: Record<string, string> = {
  lifting: '🏋️', boxing: '🥊', running: '🏃', basketball: '🏀',
};

export default function TemplatesPage() {
  const { state, deleteTemplate } = useFitness();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workout Templates</h1>
          <p className="text-sm text-gray-500 mt-0.5">Save and reuse your favorite workouts</p>
        </div>
        <Link
          href="/log"
          className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors"
        >
          + New Session
        </Link>
      </div>

      {state.templates.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
          <p className="text-gray-400 mb-2">No templates yet.</p>
          <p className="text-sm text-gray-400">Log a session and check &ldquo;Save as template&rdquo; to create one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {state.templates.map(tpl => {
            const lm = tpl.type === 'lifting' ? tpl.defaultMetrics as LiftingMetrics : null;
            return (
              <div key={tpl.id} className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{ACTIVITY_ICONS[tpl.type]}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{tpl.name}</h3>
                      <p className="text-xs text-gray-400 capitalize">{tpl.type} · {tpl.defaultDuration} min · Intensity {tpl.defaultIntensity}/10</p>
                    </div>
                  </div>
                </div>

                {lm && lm.exercises?.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-3 text-sm space-y-1">
                    {lm.exercises.map((ex, i) => (
                      <div key={i} className="flex justify-between">
                        <span className="text-gray-700">{ex.name}</span>
                        <span className="text-gray-400 font-mono text-xs">{ex.sets}×{ex.reps} @ {ex.weight}</span>
                      </div>
                    ))}
                  </div>
                )}

                {'rounds' in tpl.defaultMetrics && (
                  <p className="text-sm text-gray-500 mb-3">{(tpl.defaultMetrics as { rounds: number }).rounds} rounds</p>
                )}
                {'distance' in tpl.defaultMetrics && (
                  <p className="text-sm text-gray-500 mb-3">{(tpl.defaultMetrics as { distance: number }).distance} km</p>
                )}

                {tpl.defaultTags.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap mb-3">
                    {tpl.defaultTags.map(tag => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 bg-blue-50 text-accent rounded-full">{tag}</span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 mt-auto pt-3 border-t border-gray-100">
                  <Link
                    href="/log"
                    className="flex-1 text-center py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Use Template
                  </Link>
                  <button
                    onClick={() => deleteTemplate(tpl.id)}
                    className="px-3 py-2 text-sm text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
