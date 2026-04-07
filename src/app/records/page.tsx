'use client';

import { useMemo } from 'react';
import { useFitness } from '@/context/FitnessContext';
import { LiftingMetrics, PersonalRecord } from '@/lib/types';
import Link from 'next/link';

const MEDAL_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];

function computePersonalRecords(sessions: { id: string; date: string; type: string; metrics: unknown }[]): PersonalRecord[] {
  const bestByExercise: Record<string, PersonalRecord> = {};

  sessions
    .filter(s => s.type === 'lifting')
    .forEach(s => {
      const m = s.metrics as LiftingMetrics;
      (m.exercises || []).forEach(ex => {
        if (!ex.name) return;
        const key = ex.name.toLowerCase();
        if (!bestByExercise[key] || ex.weight > bestByExercise[key].weight) {
          bestByExercise[key] = {
            exercise: ex.name,
            weight: ex.weight,
            reps: ex.reps,
            date: s.date,
            sessionId: s.id,
          };
        }
      });
    });

  return Object.values(bestByExercise).sort((a, b) => b.weight - a.weight);
}

function computeVolumeRecords(sessions: { id: string; date: string; type: string; metrics: unknown }[]): { exercise: string; volume: number; date: string; sessionId: string; detail: string }[] {
  const bestByExercise: Record<string, { exercise: string; volume: number; date: string; sessionId: string; detail: string }> = {};

  sessions
    .filter(s => s.type === 'lifting')
    .forEach(s => {
      const m = s.metrics as LiftingMetrics;
      (m.exercises || []).forEach(ex => {
        if (!ex.name) return;
        const vol = ex.sets * ex.reps * ex.weight;
        const key = ex.name.toLowerCase();
        if (!bestByExercise[key] || vol > bestByExercise[key].volume) {
          bestByExercise[key] = {
            exercise: ex.name,
            volume: vol,
            date: s.date,
            sessionId: s.id,
            detail: `${ex.sets}×${ex.reps} @ ${ex.weight} lbs`,
          };
        }
      });
    });

  return Object.values(bestByExercise).sort((a, b) => b.volume - a.volume);
}

function computeCardioRecords(sessions: { id: string; date: string; type: string; duration: number; metrics: unknown }[]) {
  let longestRun = { distance: 0, date: '', sessionId: '', duration: 0 };
  let fastestPace = { pace: Infinity, date: '', sessionId: '', distance: 0 };
  let mostRounds = { rounds: 0, date: '', sessionId: '' };

  sessions.forEach(s => {
    if (s.type === 'running') {
      const m = s.metrics as { distance: number };
      if (m.distance > longestRun.distance) {
        longestRun = { distance: m.distance, date: s.date, sessionId: s.id, duration: s.duration };
      }
      const pace = s.duration / m.distance;
      if (pace < fastestPace.pace) {
        fastestPace = { pace, date: s.date, sessionId: s.id, distance: m.distance };
      }
    }
    if (s.type === 'boxing') {
      const m = s.metrics as { rounds: number };
      if (m.rounds > mostRounds.rounds) {
        mostRounds = { rounds: m.rounds, date: s.date, sessionId: s.id };
      }
    }
  });

  return { longestRun, fastestPace, mostRounds };
}

export default function RecordsPage() {
  const { state } = useFitness();

  const weightPRs = useMemo(() => computePersonalRecords(state.sessions), [state.sessions]);
  const volumePRs = useMemo(() => computeVolumeRecords(state.sessions), [state.sessions]);
  const cardioPRs = useMemo(() => computeCardioRecords(state.sessions), [state.sessions]);

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Personal Records</h1>
        <p className="text-sm text-gray-500 mt-0.5">Your all-time bests across every exercise</p>
      </div>

      {/* Weight PRs - Olympic podium style */}
      {weightPRs.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">🏆</span> Heaviest Lifts
          </h2>

          {/* Top 3 podium */}
          {weightPRs.length >= 1 && (
            <div className="flex items-end justify-center gap-3 mb-6">
              {/* Silver - 2nd */}
              {weightPRs[1] && (
                <div className="text-center animate-[fadeSlideUp_0.6s_ease_0.2s_both]">
                  <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 w-36 shadow-sm">
                    <div className="text-3xl mb-1" style={{ filter: 'grayscale(0.3)' }}>🥈</div>
                    <p className="text-xs font-medium text-gray-500 truncate">{weightPRs[1].exercise}</p>
                    <p className="text-xl font-black text-gray-900">{weightPRs[1].weight}</p>
                    <p className="text-[10px] text-gray-400">lbs × {weightPRs[1].reps} reps</p>
                  </div>
                  <div className="h-16 bg-gradient-to-t from-gray-200 to-gray-100 rounded-b-lg mt-1 flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-500">2nd</span>
                  </div>
                </div>
              )}

              {/* Gold - 1st */}
              <div className="text-center animate-[fadeSlideUp_0.6s_ease_both]">
                <div className="bg-white border-2 border-yellow-300 rounded-2xl p-5 w-40 shadow-md shadow-yellow-100 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/50 to-transparent" />
                  <div className="relative">
                    <div className="text-4xl mb-1 animate-[bounce_2s_ease_infinite]">🥇</div>
                    <p className="text-xs font-medium text-gray-500 truncate">{weightPRs[0].exercise}</p>
                    <p className="text-3xl font-black text-gray-900">{weightPRs[0].weight}</p>
                    <p className="text-[10px] text-gray-400">lbs × {weightPRs[0].reps} reps</p>
                    <p className="text-[10px] text-yellow-600 font-medium mt-1">{formatDate(weightPRs[0].date)}</p>
                  </div>
                </div>
                <div className="h-24 bg-gradient-to-t from-yellow-300 to-yellow-100 rounded-b-lg mt-1 flex items-center justify-center">
                  <span className="text-sm font-black text-yellow-800">1st</span>
                </div>
              </div>

              {/* Bronze - 3rd */}
              {weightPRs[2] && (
                <div className="text-center animate-[fadeSlideUp_0.6s_ease_0.4s_both]">
                  <div className="bg-white border-2 border-orange-200 rounded-2xl p-4 w-36 shadow-sm">
                    <div className="text-3xl mb-1">🥉</div>
                    <p className="text-xs font-medium text-gray-500 truncate">{weightPRs[2].exercise}</p>
                    <p className="text-xl font-black text-gray-900">{weightPRs[2].weight}</p>
                    <p className="text-[10px] text-gray-400">lbs × {weightPRs[2].reps} reps</p>
                  </div>
                  <div className="h-10 bg-gradient-to-t from-orange-200 to-orange-100 rounded-b-lg mt-1 flex items-center justify-center">
                    <span className="text-xs font-bold text-orange-700">3rd</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Full list */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-2.5 text-[10px] font-medium text-gray-400 uppercase w-8">#</th>
                  <th className="text-left px-4 py-2.5 text-[10px] font-medium text-gray-400 uppercase">Exercise</th>
                  <th className="text-right px-4 py-2.5 text-[10px] font-medium text-gray-400 uppercase">Weight</th>
                  <th className="text-right px-4 py-2.5 text-[10px] font-medium text-gray-400 uppercase">Reps</th>
                  <th className="text-right px-4 py-2.5 text-[10px] font-medium text-gray-400 uppercase">Date</th>
                </tr>
              </thead>
              <tbody>
                {weightPRs.map((pr, i) => (
                  <tr key={pr.exercise} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      {i < 3 ? (
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white" style={{ backgroundColor: MEDAL_COLORS[i] }}>
                          {i + 1}
                        </div>
                      ) : (
                        <span className="text-gray-300 text-xs font-mono">{i + 1}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{pr.exercise}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-gray-900">{pr.weight} lbs</td>
                    <td className="px-4 py-3 text-right text-gray-500">{pr.reps}</td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/session/${pr.sessionId}`} className="text-accent hover:text-accent-hover text-xs">
                        {formatDate(pr.date)}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Volume PRs */}
      {volumePRs.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">💪</span> Highest Volume
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {volumePRs.slice(0, 6).map((pr, i) => (
              <Link key={pr.exercise} href={`/session/${pr.sessionId}`}
                className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 mb-2">
                  {i === 0 && <span className="text-lg">🏅</span>}
                  <span className="text-sm font-semibold text-gray-900">{pr.exercise}</span>
                </div>
                <p className="text-2xl font-black text-gray-900">{pr.volume.toLocaleString()}</p>
                <p className="text-xs text-gray-400">{pr.detail}</p>
                <p className="text-[10px] text-gray-300 mt-1">{formatDate(pr.date)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Cardio PRs */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-2xl">⚡</span> Cardio Records
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {cardioPRs.longestRun.distance > 0 && (
            <Link href={`/session/${cardioPRs.longestRun.sessionId}`}
              className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow text-center"
            >
              <div className="text-3xl mb-2">🏃</div>
              <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Longest Run</p>
              <p className="text-3xl font-black text-gray-900 mt-1">{cardioPRs.longestRun.distance} km</p>
              <p className="text-xs text-gray-400 mt-1">{cardioPRs.longestRun.duration} min · {formatDate(cardioPRs.longestRun.date)}</p>
            </Link>
          )}
          {cardioPRs.fastestPace.pace < Infinity && (
            <Link href={`/session/${cardioPRs.fastestPace.sessionId}`}
              className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow text-center"
            >
              <div className="text-3xl mb-2">⏱️</div>
              <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Fastest Pace</p>
              <p className="text-3xl font-black text-gray-900 mt-1">{cardioPRs.fastestPace.pace.toFixed(1)} min/km</p>
              <p className="text-xs text-gray-400 mt-1">{cardioPRs.fastestPace.distance} km · {formatDate(cardioPRs.fastestPace.date)}</p>
            </Link>
          )}
          {cardioPRs.mostRounds.rounds > 0 && (
            <Link href={`/session/${cardioPRs.mostRounds.sessionId}`}
              className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow text-center"
            >
              <div className="text-3xl mb-2">🥊</div>
              <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Most Rounds</p>
              <p className="text-3xl font-black text-gray-900 mt-1">{cardioPRs.mostRounds.rounds}</p>
              <p className="text-xs text-gray-400 mt-1">{formatDate(cardioPRs.mostRounds.date)}</p>
            </Link>
          )}
        </div>
      </section>

      {weightPRs.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
          <div className="text-5xl mb-4">🏆</div>
          <p className="text-gray-400">No records yet. Start logging sessions to track your PRs!</p>
          <Link href="/log" className="text-accent text-sm hover:text-accent-hover mt-2 inline-block">Log a session →</Link>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
