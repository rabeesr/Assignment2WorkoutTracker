'use client';

import { MuscleLoad, MUSCLE_GROUPS } from '@/lib/types';
import { fatigueToColor } from '@/lib/fatigue';

interface Props {
  fatigue: MuscleLoad;
}

export default function BodyHeatmap({ fatigue }: Props) {
  const maxVal = Math.max(...MUSCLE_GROUPS.map(m => fatigue[m]), 1);

  const color = (muscle: keyof MuscleLoad) => fatigueToColor(fatigue[muscle], maxVal);

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4">Muscle Fatigue Map</h2>
      <div className="flex justify-center gap-12">
        {/* Front View */}
        <div className="text-center">
          <p className="text-xs text-muted mb-3 font-medium">FRONT</p>
          <svg viewBox="0 0 120 220" width="140" height="260">
            {/* Head */}
            <circle cx="60" cy="20" r="14" fill="#2a2d37" stroke="#3a3d47" strokeWidth="1" />
            {/* Neck */}
            <rect x="54" y="34" width="12" height="8" rx="2" fill="#2a2d37" />
            {/* Shoulders */}
            <rect x="16" y="42" width="28" height="14" rx="6" fill={color('shoulders')} opacity="0.85" />
            <rect x="76" y="42" width="28" height="14" rx="6" fill={color('shoulders')} opacity="0.85" />
            {/* Chest */}
            <rect x="34" y="42" width="52" height="28" rx="4" fill={color('chest')} opacity="0.85" />
            {/* Core */}
            <rect x="38" y="72" width="44" height="32" rx="4" fill={color('core')} opacity="0.85" />
            {/* Arms */}
            <rect x="8" y="56" width="16" height="42" rx="6" fill={color('arms')} opacity="0.85" />
            <rect x="96" y="56" width="16" height="42" rx="6" fill={color('arms')} opacity="0.85" />
            {/* Forearms */}
            <rect x="6" y="100" width="14" height="32" rx="5" fill={color('arms')} opacity="0.6" />
            <rect x="100" y="100" width="14" height="32" rx="5" fill={color('arms')} opacity="0.6" />
            {/* Legs */}
            <rect x="34" y="108" width="22" height="54" rx="6" fill={color('legs')} opacity="0.85" />
            <rect x="64" y="108" width="22" height="54" rx="6" fill={color('legs')} opacity="0.85" />
            {/* Calves */}
            <rect x="36" y="166" width="18" height="38" rx="6" fill={color('legs')} opacity="0.6" />
            <rect x="66" y="166" width="18" height="38" rx="6" fill={color('legs')} opacity="0.6" />
          </svg>
        </div>

        {/* Back View */}
        <div className="text-center">
          <p className="text-xs text-muted mb-3 font-medium">BACK</p>
          <svg viewBox="0 0 120 220" width="140" height="260">
            {/* Head */}
            <circle cx="60" cy="20" r="14" fill="#2a2d37" stroke="#3a3d47" strokeWidth="1" />
            {/* Neck */}
            <rect x="54" y="34" width="12" height="8" rx="2" fill="#2a2d37" />
            {/* Shoulders */}
            <rect x="16" y="42" width="28" height="14" rx="6" fill={color('shoulders')} opacity="0.85" />
            <rect x="76" y="42" width="28" height="14" rx="6" fill={color('shoulders')} opacity="0.85" />
            {/* Back */}
            <rect x="34" y="42" width="52" height="28" rx="4" fill={color('back')} opacity="0.85" />
            {/* Lower back / core */}
            <rect x="38" y="72" width="44" height="32" rx="4" fill={color('core')} opacity="0.7" />
            {/* Arms */}
            <rect x="8" y="56" width="16" height="42" rx="6" fill={color('arms')} opacity="0.85" />
            <rect x="96" y="56" width="16" height="42" rx="6" fill={color('arms')} opacity="0.85" />
            {/* Forearms */}
            <rect x="6" y="100" width="14" height="32" rx="5" fill={color('arms')} opacity="0.6" />
            <rect x="100" y="100" width="14" height="32" rx="5" fill={color('arms')} opacity="0.6" />
            {/* Hamstrings */}
            <rect x="34" y="108" width="22" height="54" rx="6" fill={color('legs')} opacity="0.85" />
            <rect x="64" y="108" width="22" height="54" rx="6" fill={color('legs')} opacity="0.85" />
            {/* Calves */}
            <rect x="36" y="166" width="18" height="38" rx="6" fill={color('legs')} opacity="0.6" />
            <rect x="66" y="166" width="18" height="38" rx="6" fill={color('legs')} opacity="0.6" />
          </svg>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ background: 'rgb(34, 197, 94)' }} />
          <span className="text-xs text-muted">Recovered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ background: 'rgb(234, 179, 94)' }} />
          <span className="text-xs text-muted">Moderate</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ background: 'rgb(239, 68, 68)' }} />
          <span className="text-xs text-muted">Fatigued</span>
        </div>
      </div>
    </div>
  );
}
