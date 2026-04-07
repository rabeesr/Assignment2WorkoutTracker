'use client';

import { useMemo, useState } from 'react';
import { useFitness } from '@/context/FitnessContext';
import Link from 'next/link';

export default function PhotosPage() {
  const { state } = useFitness();
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const photoSessions = useMemo(() => {
    return state.sessions
      .filter(s => s.photo)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [state.sessions]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Progress Photos</h1>
        <p className="text-sm text-gray-500 mt-0.5">Visual timeline of your fitness journey</p>
      </div>

      {photoSessions.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
          <div className="text-4xl mb-3">📷</div>
          <p className="text-gray-400 mb-2">No progress photos yet.</p>
          <p className="text-sm text-gray-400">Add a photo when logging a session to start tracking visually.</p>
          <Link href="/log" className="text-accent text-sm hover:text-accent-hover mt-3 inline-block">Log a session →</Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {photoSessions.map((session, i) => {
              const date = new Date(session.date);
              return (
                <button
                  key={session.id}
                  onClick={() => setSelectedIdx(i)}
                  className="relative group overflow-hidden rounded-2xl border border-gray-200 bg-white cursor-pointer aspect-square"
                >
                  <img src={session.photo} alt="Progress" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                    <p className="text-white text-xs font-medium capitalize">{session.type}</p>
                    <p className="text-white/70 text-[10px]">
                      {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Lightbox */}
          {selectedIdx !== null && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setSelectedIdx(null)}>
              <div className="relative max-w-2xl w-full" onClick={e => e.stopPropagation()}>
                <img src={photoSessions[selectedIdx].photo} alt="Progress" className="w-full rounded-2xl" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium capitalize">{photoSessions[selectedIdx].type} Session</p>
                    <p className="text-white/60 text-sm">
                      {new Date(photoSessions[selectedIdx].date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <Link
                    href={`/session/${photoSessions[selectedIdx].id}`}
                    className="px-3 py-1.5 bg-white/20 backdrop-blur text-white text-sm rounded-lg hover:bg-white/30"
                  >
                    View Session →
                  </Link>
                </div>
                <button onClick={() => setSelectedIdx(null)} className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/30 cursor-pointer">×</button>
                {/* Navigation arrows */}
                {selectedIdx > 0 && (
                  <button onClick={(e) => { e.stopPropagation(); setSelectedIdx(selectedIdx - 1); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/30 cursor-pointer">←</button>
                )}
                {selectedIdx < photoSessions.length - 1 && (
                  <button onClick={(e) => { e.stopPropagation(); setSelectedIdx(selectedIdx + 1); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/30 cursor-pointer">→</button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
