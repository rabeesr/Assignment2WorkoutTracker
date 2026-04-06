'use client';

import { useState } from 'react';

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-accent hover:bg-accent-hover text-white rounded-full shadow-lg shadow-accent/20 flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
        aria-label="AI Coach"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
          <line x1="10" y1="22" x2="14" y2="22" />
          <line x1="9" y1="17" x2="15" y2="17" />
        </svg>
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-card border border-border rounded-2xl shadow-2xl shadow-black/40 overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-200">
          {/* Header */}
          <div className="px-5 py-4 border-b border-border bg-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
                    <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">FitTrack AI Coach</p>
                  <p className="text-[10px] text-muted">Powered by AI</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted hover:text-foreground transition-colors cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Coming soon body */}
          <div className="px-5 py-10 text-center">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-foreground mb-2">Coming Soon</h3>
            <p className="text-sm text-muted leading-relaxed">
              AI-powered coaching is on the roadmap. Ask about recovery, get workout suggestions, and analyze your training patterns.
            </p>
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span>Personalized workout recommendations</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span>Recovery & fatigue analysis</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span>Training load optimization</span>
              </div>
            </div>
          </div>

          {/* Disabled input */}
          <div className="px-4 pb-4">
            <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-4 py-3 opacity-50">
              <input
                type="text"
                disabled
                placeholder="Chat coming soon..."
                className="flex-1 bg-transparent text-sm text-muted placeholder:text-muted/60 outline-none cursor-not-allowed"
              />
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
