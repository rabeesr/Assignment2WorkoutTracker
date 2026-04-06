'use client';

import { useFitness } from '@/context/FitnessContext';
import { calculateCurrentFatigue } from '@/lib/fatigue';
import BodyHeatmap from '@/components/dashboard/BodyHeatmap';
import RecoveryTimeline from '@/components/dashboard/RecoveryTimeline';
import QuickStats from '@/components/dashboard/QuickStats';
import CalorieSummary from '@/components/dashboard/CalorieSummary';
import RestDaySuggestion from '@/components/dashboard/RestDaySuggestion';
import Link from 'next/link';

export default function DashboardPage() {
  const { state } = useFitness();
  const fatigue = calculateCurrentFatigue(state.sessions);
  const lastSession = state.sessions.length > 0 ? state.sessions[0] : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link
          href="/log"
          className="px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
        >
          + Log Session
        </Link>
      </div>

      <RestDaySuggestion fatigue={fatigue} />
      <QuickStats sessions={state.sessions} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BodyHeatmap fatigue={fatigue} />
        <div className="space-y-6">
          <RecoveryTimeline fatigue={fatigue} />
          <CalorieSummary sessions={state.sessions} />
        </div>
      </div>

      {lastSession && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-3">Last Session</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground font-medium capitalize">{lastSession.type}</p>
              <p className="text-sm text-muted">
                {lastSession.duration} min · Intensity {lastSession.intensity}/10 · {lastSession.caloriesBurned} kcal
              </p>
              {lastSession.notes && (
                <p className="text-sm text-muted mt-1 italic">&ldquo;{lastSession.notes}&rdquo;</p>
              )}
            </div>
            <Link
              href={`/session/${lastSession.id}`}
              className="text-sm text-accent hover:text-accent-hover font-medium"
            >
              View Details →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
