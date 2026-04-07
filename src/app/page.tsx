'use client';

import { useFitness } from '@/context/FitnessContext';
import { calculateCurrentFatigue } from '@/lib/fatigue';
import BodyHeatmap from '@/components/dashboard/BodyHeatmap';
import RecoveryTimeline from '@/components/dashboard/RecoveryTimeline';
import QuickStats from '@/components/dashboard/QuickStats';
import CalorieSummary from '@/components/dashboard/CalorieSummary';
import RestDaySuggestion from '@/components/dashboard/RestDaySuggestion';
import TrainingCalendar from '@/components/dashboard/TrainingCalendar';
import GoalsWidget from '@/components/dashboard/GoalsWidget';
import Link from 'next/link';

export default function DashboardPage() {
  const { state } = useFitness();
  const fatigue = calculateCurrentFatigue(state.sessions);
  const lastSession = state.sessions.length > 0 ? state.sessions[0] : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Your fitness overview at a glance</p>
        </div>
        <Link
          href="/log"
          className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors"
        >
          + Log Session
        </Link>
      </div>

      <RestDaySuggestion fatigue={fatigue} />
      <QuickStats sessions={state.sessions} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BodyHeatmap fatigue={fatigue} sessions={state.sessions} />
        <div className="space-y-6">
          <RecoveryTimeline fatigue={fatigue} />
          <CalorieSummary sessions={state.sessions} />
        </div>
      </div>

      <TrainingCalendar sessions={state.sessions} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GoalsWidget />
        {lastSession && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-3">Last Session</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900 font-medium capitalize">{lastSession.type}</p>
                <p className="text-sm text-gray-500">
                  {lastSession.duration} min · Intensity {lastSession.intensity}/10 · {lastSession.caloriesBurned} kcal
                </p>
                {lastSession.notes && (
                  <p className="text-sm text-gray-400 mt-1 italic">&ldquo;{lastSession.notes}&rdquo;</p>
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
    </div>
  );
}
