'use client';

import { MuscleLoad, MUSCLE_GROUPS } from '@/lib/types';
import { fatigueToColor, getRecoveryTimeDays } from '@/lib/fatigue';
import { useState } from 'react';

interface Props {
  fatigue: MuscleLoad;
}

export default function BodyHeatmap({ fatigue }: Props) {
  const maxVal = Math.max(...MUSCLE_GROUPS.map(m => fatigue[m]), 1);
  const [hovered, setHovered] = useState<keyof MuscleLoad | null>(null);

  const color = (muscle: keyof MuscleLoad) => fatigueToColor(fatigue[muscle], maxVal);
  const glow = (muscle: keyof MuscleLoad) =>
    hovered === muscle ? `drop-shadow(0 0 8px ${color(muscle)})` : 'none';

  const muscleProps = (muscle: keyof MuscleLoad) => ({
    fill: color(muscle),
    style: { filter: glow(muscle), transition: 'all 0.3s ease' },
    onMouseEnter: () => setHovered(muscle),
    onMouseLeave: () => setHovered(null),
    className: 'cursor-pointer',
  });

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold">Muscle Fatigue Map</h2>
        {hovered && (
          <div className="text-right animate-in fade-in">
            <span className="text-sm font-medium capitalize text-foreground">{hovered}</span>
            <span className="text-xs text-muted ml-2">
              {getRecoveryTimeDays(fatigue[hovered])}d recovery
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-16">
        {/* Front View */}
        <div className="text-center">
          <p className="text-[10px] text-muted mb-2 font-semibold tracking-[0.2em] uppercase">Anterior</p>
          <svg viewBox="0 0 200 400" width="160" height="320">
            <defs>
              <radialGradient id="skinBase" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#1a1d24" />
                <stop offset="100%" stopColor="#12141a" />
              </radialGradient>
            </defs>

            {/* Body outline for depth */}
            <ellipse cx="100" cy="36" rx="22" ry="26" fill="url(#skinBase)" stroke="#252830" strokeWidth="0.5" />

            {/* Neck */}
            <path d="M90,60 L90,75 Q100,78 110,75 L110,60" fill="#15171d" stroke="#252830" strokeWidth="0.5" />

            {/* Trapezius / Shoulders - anatomical deltoid shape */}
            <path d="M58,82 Q48,90 42,108 L54,108 Q58,95 68,85 Z" {...muscleProps('shoulders')} opacity="0.9" />
            <path d="M142,82 Q152,90 158,108 L146,108 Q142,95 132,85 Z" {...muscleProps('shoulders')} opacity="0.9" />

            {/* Chest - pectoralis major */}
            <path d="M68,85 Q72,82 100,80 Q128,82 132,85 L138,100 Q130,112 100,115 Q70,112 62,100 Z" {...muscleProps('chest')} opacity="0.9" />

            {/* Core - rectus abdominis with segments */}
            <path d="M76,118 L124,118 L122,200 Q100,205 78,200 Z" {...muscleProps('core')} opacity="0.85" />
            {/* Ab segment lines */}
            <line x1="78" y1="138" x2="122" y2="138" stroke="#090b10" strokeWidth="0.8" opacity="0.4" />
            <line x1="78" y1="158" x2="122" y2="158" stroke="#090b10" strokeWidth="0.8" opacity="0.4" />
            <line x1="79" y1="178" x2="121" y2="178" stroke="#090b10" strokeWidth="0.8" opacity="0.4" />
            <line x1="100" y1="118" x2="100" y2="200" stroke="#090b10" strokeWidth="0.6" opacity="0.3" />

            {/* Arms - biceps */}
            <path d="M42,108 Q36,120 34,145 L32,165 Q38,170 46,165 L54,108 Z" {...muscleProps('arms')} opacity="0.9" />
            <path d="M158,108 Q164,120 166,145 L168,165 Q162,170 154,165 L146,108 Z" {...muscleProps('arms')} opacity="0.9" />

            {/* Forearms */}
            <path d="M32,168 Q28,190 26,215 L24,235 Q32,238 38,232 L46,168 Z" {...muscleProps('arms')} opacity="0.65" />
            <path d="M168,168 Q172,190 174,215 L176,235 Q168,238 162,232 L154,168 Z" {...muscleProps('arms')} opacity="0.65" />

            {/* Hands */}
            <ellipse cx="25" cy="242" rx="7" ry="12" fill="#15171d" stroke="#252830" strokeWidth="0.5" />
            <ellipse cx="175" cy="242" rx="7" ry="12" fill="#15171d" stroke="#252830" strokeWidth="0.5" />

            {/* Quadriceps */}
            <path d="M78,205 Q72,220 70,260 Q68,290 72,310 Q78,318 88,315 L92,205 Z" {...muscleProps('legs')} opacity="0.9" />
            <path d="M122,205 Q128,220 130,260 Q132,290 128,310 Q122,318 112,315 L108,205 Z" {...muscleProps('legs')} opacity="0.9" />

            {/* Inner thigh separation */}
            <path d="M92,205 Q100,215 108,205" fill="none" stroke="#090b10" strokeWidth="1" opacity="0.5" />

            {/* Knees */}
            <ellipse cx="80" cy="318" rx="11" ry="8" fill="#15171d" stroke="#252830" strokeWidth="0.5" />
            <ellipse cx="120" cy="318" rx="11" ry="8" fill="#15171d" stroke="#252830" strokeWidth="0.5" />

            {/* Shins / Calves front */}
            <path d="M72,326 Q70,345 70,365 Q72,385 80,390 Q86,385 88,365 Q88,345 86,326 Z" {...muscleProps('legs')} opacity="0.65" />
            <path d="M114,326 Q112,345 112,365 Q114,385 120,390 Q126,385 128,365 Q128,345 128,326 Z" {...muscleProps('legs')} opacity="0.65" />
          </svg>
        </div>

        {/* Back View */}
        <div className="text-center">
          <p className="text-[10px] text-muted mb-2 font-semibold tracking-[0.2em] uppercase">Posterior</p>
          <svg viewBox="0 0 200 400" width="160" height="320">
            {/* Head */}
            <ellipse cx="100" cy="36" rx="22" ry="26" fill="url(#skinBase)" stroke="#252830" strokeWidth="0.5" />

            {/* Neck */}
            <path d="M90,60 L90,75 Q100,78 110,75 L110,60" fill="#15171d" stroke="#252830" strokeWidth="0.5" />

            {/* Rear deltoids */}
            <path d="M58,82 Q48,90 42,108 L54,108 Q58,95 68,85 Z" {...muscleProps('shoulders')} opacity="0.9" />
            <path d="M142,82 Q152,90 158,108 L146,108 Q142,95 132,85 Z" {...muscleProps('shoulders')} opacity="0.9" />

            {/* Upper back - trapezius / rhomboids */}
            <path d="M68,80 Q100,76 132,80 L136,100 Q130,115 100,118 Q70,115 64,100 Z" {...muscleProps('back')} opacity="0.9" />

            {/* Lats */}
            <path d="M64,102 Q60,130 65,155 L76,155 L76,118 Q70,112 64,102 Z" {...muscleProps('back')} opacity="0.75" />
            <path d="M136,102 Q140,130 135,155 L124,155 L124,118 Q130,112 136,102 Z" {...muscleProps('back')} opacity="0.75" />

            {/* Spine line */}
            <line x1="100" y1="80" x2="100" y2="200" stroke="#090b10" strokeWidth="1" opacity="0.3" />

            {/* Lower back / erectors */}
            <path d="M76,158 L124,158 L122,200 Q100,205 78,200 Z" {...muscleProps('core')} opacity="0.7" />

            {/* Triceps */}
            <path d="M42,108 Q36,120 34,145 L32,165 Q38,170 46,165 L54,108 Z" {...muscleProps('arms')} opacity="0.9" />
            <path d="M158,108 Q164,120 166,145 L168,165 Q162,170 154,165 L146,108 Z" {...muscleProps('arms')} opacity="0.9" />

            {/* Forearms */}
            <path d="M32,168 Q28,190 26,215 L24,235 Q32,238 38,232 L46,168 Z" {...muscleProps('arms')} opacity="0.65" />
            <path d="M168,168 Q172,190 174,215 L176,235 Q168,238 162,232 L154,168 Z" {...muscleProps('arms')} opacity="0.65" />

            {/* Hands */}
            <ellipse cx="25" cy="242" rx="7" ry="12" fill="#15171d" stroke="#252830" strokeWidth="0.5" />
            <ellipse cx="175" cy="242" rx="7" ry="12" fill="#15171d" stroke="#252830" strokeWidth="0.5" />

            {/* Glutes */}
            <path d="M78,200 Q76,215 80,230 Q90,238 100,235 L100,205 Q92,205 78,200 Z" {...muscleProps('legs')} opacity="0.8" />
            <path d="M122,200 Q124,215 120,230 Q110,238 100,235 L100,205 Q108,205 122,200 Z" {...muscleProps('legs')} opacity="0.8" />

            {/* Hamstrings */}
            <path d="M72,240 Q70,270 72,300 Q76,315 86,312 L90,240 Z" {...muscleProps('legs')} opacity="0.9" />
            <path d="M128,240 Q130,270 128,300 Q124,315 114,312 L110,240 Z" {...muscleProps('legs')} opacity="0.9" />

            {/* Knees */}
            <ellipse cx="80" cy="318" rx="11" ry="8" fill="#15171d" stroke="#252830" strokeWidth="0.5" />
            <ellipse cx="120" cy="318" rx="11" ry="8" fill="#15171d" stroke="#252830" strokeWidth="0.5" />

            {/* Calves - gastrocnemius */}
            <path d="M72,326 Q68,342 70,365 Q74,388 80,392 Q88,388 90,365 Q90,342 88,326 Z" {...muscleProps('legs')} opacity="0.7" />
            <path d="M112,326 Q110,342 112,365 Q114,388 120,392 Q128,388 130,365 Q130,342 128,326 Z" {...muscleProps('legs')} opacity="0.7" />
          </svg>
        </div>
      </div>

      {/* Gradient legend bar */}
      <div className="mt-6 px-4">
        <div className="h-2 rounded-full" style={{
          background: 'linear-gradient(to right, rgb(16,185,129), rgb(245,158,11), rgb(239,68,68))'
        }} />
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-muted font-medium">Recovered</span>
          <span className="text-[10px] text-muted font-medium">Moderate</span>
          <span className="text-[10px] text-muted font-medium">Fatigued</span>
        </div>
      </div>

      {/* Muscle group fatigue values */}
      <div className="grid grid-cols-3 gap-2 mt-5">
        {MUSCLE_GROUPS.map(muscle => (
          <div
            key={muscle}
            className={`text-center p-2 rounded-lg border transition-all ${
              hovered === muscle ? 'border-accent/40 bg-accent/5' : 'border-transparent'
            }`}
            onMouseEnter={() => setHovered(muscle)}
            onMouseLeave={() => setHovered(null)}
          >
            <div
              className="w-2.5 h-2.5 rounded-full mx-auto mb-1"
              style={{ backgroundColor: color(muscle) }}
            />
            <p className="text-[11px] text-muted capitalize">{muscle}</p>
            <p className="text-xs font-semibold text-foreground">{fatigue[muscle].toFixed(1)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
