'use client';

import { MuscleLoad, MUSCLE_GROUPS, Session } from '@/lib/types';
import { fatigueToColor, getRecoveryTimeDays } from '@/lib/fatigue';
import { getMuscleWeights } from '@/lib/muscleMapping';
import { useState, useRef } from 'react';

interface Props {
  fatigue: MuscleLoad;
  sessions: Session[];
}

interface TooltipData {
  muscle: keyof MuscleLoad;
  x: number;
  y: number;
}

function getTopSessionsForMuscle(sessions: Session[], muscle: keyof MuscleLoad, limit: number = 5) {
  return sessions
    .filter(s => {
      const weights = getMuscleWeights(s.type);
      return weights[muscle] > 0;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
    .map(s => ({
      id: s.id,
      type: s.type,
      date: new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      contribution: s.muscleLoad[muscle],
    }));
}

export default function BodyHeatmap({ fatigue, sessions }: Props) {
  const maxVal = Math.max(...MUSCLE_GROUPS.map(m => fatigue[m]), 1);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const color = (muscle: keyof MuscleLoad) => fatigueToColor(fatigue[muscle], maxVal);

  const handleMouseEnter = (muscle: keyof MuscleLoad, e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setTooltip({
      muscle,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = (muscle: keyof MuscleLoad, e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setTooltip({
      muscle,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const muscleProps = (muscle: keyof MuscleLoad) => ({
    fill: color(muscle),
    stroke: tooltip?.muscle === muscle ? '#111827' : '#d1d5db',
    strokeWidth: tooltip?.muscle === muscle ? 1.5 : 0.5,
    style: { transition: 'all 0.2s ease', opacity: tooltip && tooltip.muscle !== muscle ? 0.5 : 0.9 },
    onMouseEnter: (e: React.MouseEvent<SVGElement>) => handleMouseEnter(muscle, e),
    onMouseMove: (e: React.MouseEvent<SVGElement>) => handleMouseMove(muscle, e),
    onMouseLeave: () => setTooltip(null),
    className: 'cursor-pointer',
  });

  const topSessions = tooltip ? getTopSessionsForMuscle(sessions, tooltip.muscle) : [];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 relative" ref={containerRef}>
      <h2 className="text-base font-semibold text-gray-900 mb-1">Muscle Fatigue Map</h2>
      <p className="text-xs text-gray-500 mb-5">Hover over a muscle group for detailed breakdown</p>

      <div className="flex justify-center gap-10">
        {/* Front View */}
        <div className="text-center">
          <p className="text-[10px] text-gray-400 mb-2 font-medium tracking-[0.15em] uppercase">Anterior</p>
          <svg viewBox="0 0 200 420" width="170" height="360">
            <defs>
              <radialGradient id="skinFront" cx="50%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#f3f4f6" />
                <stop offset="100%" stopColor="#e5e7eb" />
              </radialGradient>
              <filter id="muscleShadow">
                <feDropShadow dx="0" dy="0.5" stdDeviation="0.5" floodOpacity="0.08" />
              </filter>
            </defs>

            {/* Head */}
            <ellipse cx="100" cy="32" rx="20" ry="24" fill="url(#skinFront)" stroke="#d1d5db" strokeWidth="0.5" />
            {/* Neck */}
            <path d="M92,54 L92,68 Q100,72 108,68 L108,54" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="0.4" />

            {/* Deltoids - rounded anatomical shape */}
            <path d="M62,78 Q52,84 46,96 Q43,106 44,114 L56,112 Q58,98 64,86 Z" {...muscleProps('shoulders')} filter="url(#muscleShadow)" />
            <path d="M138,78 Q148,84 154,96 Q157,106 156,114 L144,112 Q142,98 136,86 Z" {...muscleProps('shoulders')} filter="url(#muscleShadow)" />

            {/* Pectoralis major - fan shape */}
            <path d="M68,82 Q78,78 100,76 Q122,78 132,82 L140,98 Q134,110 118,116 L100,118 L82,116 Q66,110 60,98 Z" {...muscleProps('chest')} filter="url(#muscleShadow)" />
            {/* Pec separation line */}
            <line x1="100" y1="78" x2="100" y2="118" stroke="#f9fafb" strokeWidth="0.6" opacity="0.5" />

            {/* Serratus */}
            <path d="M60,100 Q56,110 58,122 L68,120 L66,102 Z" fill={color('core')} opacity="0.4" stroke="#d1d5db" strokeWidth="0.3" />
            <path d="M140,100 Q144,110 142,122 L132,120 L134,102 Z" fill={color('core')} opacity="0.4" stroke="#d1d5db" strokeWidth="0.3" />

            {/* Rectus abdominis - segmented */}
            <path d="M82,120 L118,120 L116,202 Q100,208 84,202 Z" {...muscleProps('core')} filter="url(#muscleShadow)" />
            {/* Tendinous inscriptions */}
            <line x1="84" y1="140" x2="116" y2="140" stroke="#f9fafb" strokeWidth="0.7" opacity="0.5" />
            <line x1="84" y1="158" x2="116" y2="158" stroke="#f9fafb" strokeWidth="0.7" opacity="0.5" />
            <line x1="85" y1="176" x2="115" y2="176" stroke="#f9fafb" strokeWidth="0.7" opacity="0.5" />
            <line x1="86" y1="192" x2="114" y2="192" stroke="#f9fafb" strokeWidth="0.7" opacity="0.4" />
            <line x1="100" y1="120" x2="100" y2="202" stroke="#f9fafb" strokeWidth="0.5" opacity="0.4" />

            {/* Obliques */}
            <path d="M68,122 Q64,145 66,170 L82,168 L80,120 Z" fill={color('core')} opacity="0.45" stroke="#d1d5db" strokeWidth="0.3" />
            <path d="M132,122 Q136,145 134,170 L118,168 L120,120 Z" fill={color('core')} opacity="0.45" stroke="#d1d5db" strokeWidth="0.3" />

            {/* Biceps brachii */}
            <path d="M44,116 Q38,128 36,148 Q35,162 36,172 Q42,176 48,170 Q50,155 52,140 L56,112 Z" {...muscleProps('arms')} filter="url(#muscleShadow)" />
            <path d="M156,116 Q162,128 164,148 Q165,162 164,172 Q158,176 152,170 Q150,155 148,140 L144,112 Z" {...muscleProps('arms')} filter="url(#muscleShadow)" />

            {/* Forearms */}
            <path d="M36,176 Q32,196 30,218 L28,240 Q34,244 40,238 L48,174 Z" {...muscleProps('arms')} opacity="0.6" filter="url(#muscleShadow)" />
            <path d="M164,176 Q168,196 170,218 L172,240 Q166,244 160,238 L152,174 Z" {...muscleProps('arms')} opacity="0.6" filter="url(#muscleShadow)" />

            {/* Hands */}
            <ellipse cx="28" cy="250" rx="7" ry="13" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="0.4" />
            <ellipse cx="172" cy="250" rx="7" ry="13" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="0.4" />

            {/* Rectus femoris / Vastus - quad group */}
            <path d="M84,208 Q78,225 74,255 Q72,280 74,305 Q78,316 86,318 L92,316 Q90,290 88,260 Q86,235 88,208 Z" {...muscleProps('legs')} filter="url(#muscleShadow)" />
            <path d="M116,208 Q122,225 126,255 Q128,280 126,305 Q122,316 114,318 L108,316 Q110,290 112,260 Q114,235 112,208 Z" {...muscleProps('legs')} filter="url(#muscleShadow)" />
            {/* Inner quad */}
            <path d="M92,210 Q96,220 96,250 Q94,280 92,310 L86,318 Q88,295 88,260 Q88,230 88,210 Z" fill={color('legs')} opacity="0.6" stroke="#d1d5db" strokeWidth="0.3" />
            <path d="M108,210 Q104,220 104,250 Q106,280 108,310 L114,318 Q112,295 112,260 Q112,230 112,210 Z" fill={color('legs')} opacity="0.6" stroke="#d1d5db" strokeWidth="0.3" />

            {/* Knees */}
            <ellipse cx="82" cy="322" rx="12" ry="8" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="0.4" />
            <ellipse cx="118" cy="322" rx="12" ry="8" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="0.4" />

            {/* Tibialis anterior */}
            <path d="M74,332 Q72,350 72,370 Q74,390 82,396 Q88,392 90,370 Q90,350 88,332 Z" {...muscleProps('legs')} opacity="0.6" filter="url(#muscleShadow)" />
            <path d="M112,332 Q110,350 110,370 Q112,390 118,396 Q124,392 126,370 Q126,350 128,332 Z" {...muscleProps('legs')} opacity="0.6" filter="url(#muscleShadow)" />

            {/* Feet */}
            <ellipse cx="82" cy="404" rx="12" ry="6" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="0.3" />
            <ellipse cx="118" cy="404" rx="12" ry="6" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="0.3" />
          </svg>
        </div>

        {/* Back View */}
        <div className="text-center">
          <p className="text-[10px] text-gray-400 mb-2 font-medium tracking-[0.15em] uppercase">Posterior</p>
          <svg viewBox="0 0 200 420" width="170" height="360">
            {/* Head */}
            <ellipse cx="100" cy="32" rx="20" ry="24" fill="url(#skinFront)" stroke="#d1d5db" strokeWidth="0.5" />
            {/* Neck */}
            <path d="M92,54 L92,68 Q100,72 108,68 L108,54" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="0.4" />

            {/* Rear deltoids */}
            <path d="M62,78 Q52,84 46,96 Q43,106 44,114 L56,112 Q58,98 64,86 Z" {...muscleProps('shoulders')} filter="url(#muscleShadow)" />
            <path d="M138,78 Q148,84 154,96 Q157,106 156,114 L144,112 Q142,98 136,86 Z" {...muscleProps('shoulders')} filter="url(#muscleShadow)" />

            {/* Trapezius - diamond shape */}
            <path d="M80,72 Q100,68 120,72 L130,82 Q120,96 100,100 Q80,96 70,82 Z" {...muscleProps('back')} filter="url(#muscleShadow)" />

            {/* Rhomboids / mid back */}
            <path d="M72,84 Q68,100 68,118 L82,120 L82,100 Q78,92 72,84 Z" {...muscleProps('back')} opacity="0.75" filter="url(#muscleShadow)" />
            <path d="M128,84 Q132,100 132,118 L118,120 L118,100 Q122,92 128,84 Z" {...muscleProps('back')} opacity="0.75" filter="url(#muscleShadow)" />

            {/* Latissimus dorsi - large wing shape */}
            <path d="M68,120 Q62,140 60,160 Q60,175 64,185 L82,178 L82,120 Z" {...muscleProps('back')} opacity="0.7" filter="url(#muscleShadow)" />
            <path d="M132,120 Q138,140 140,160 Q140,175 136,185 L118,178 L118,120 Z" {...muscleProps('back')} opacity="0.7" filter="url(#muscleShadow)" />

            {/* Spine / erector spinae */}
            <line x1="100" y1="72" x2="100" y2="200" stroke="#d1d5db" strokeWidth="0.8" />
            <path d="M94,100 L94,195 Q100,200 106,195 L106,100 Q100,96 94,100 Z" fill={color('core')} opacity="0.5" stroke="#d1d5db" strokeWidth="0.3" />

            {/* Lower back */}
            <path d="M82,180 L118,180 L116,202 Q100,208 84,202 Z" {...muscleProps('core')} opacity="0.65" filter="url(#muscleShadow)" />

            {/* Triceps */}
            <path d="M44,116 Q38,128 36,148 Q35,162 36,172 Q42,176 48,170 Q50,155 52,140 L56,112 Z" {...muscleProps('arms')} filter="url(#muscleShadow)" />
            <path d="M156,116 Q162,128 164,148 Q165,162 164,172 Q158,176 152,170 Q150,155 148,140 L144,112 Z" {...muscleProps('arms')} filter="url(#muscleShadow)" />

            {/* Forearms */}
            <path d="M36,176 Q32,196 30,218 L28,240 Q34,244 40,238 L48,174 Z" {...muscleProps('arms')} opacity="0.6" filter="url(#muscleShadow)" />
            <path d="M164,176 Q168,196 170,218 L172,240 Q166,244 160,238 L152,174 Z" {...muscleProps('arms')} opacity="0.6" filter="url(#muscleShadow)" />

            {/* Hands */}
            <ellipse cx="28" cy="250" rx="7" ry="13" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="0.4" />
            <ellipse cx="172" cy="250" rx="7" ry="13" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="0.4" />

            {/* Gluteus maximus */}
            <path d="M84,204 Q80,218 82,235 Q88,245 100,242 L100,210 Q94,208 84,204 Z" {...muscleProps('legs')} opacity="0.8" filter="url(#muscleShadow)" />
            <path d="M116,204 Q120,218 118,235 Q112,245 100,242 L100,210 Q106,208 116,204 Z" {...muscleProps('legs')} opacity="0.8" filter="url(#muscleShadow)" />

            {/* Hamstrings - biceps femoris + semitendinosus */}
            <path d="M76,248 Q74,272 76,298 Q78,314 86,318 L92,314 Q90,290 88,265 L84,248 Z" {...muscleProps('legs')} filter="url(#muscleShadow)" />
            <path d="M124,248 Q126,272 124,298 Q122,314 114,318 L108,314 Q110,290 112,265 L116,248 Z" {...muscleProps('legs')} filter="url(#muscleShadow)" />
            {/* Inner hamstring */}
            <path d="M88,248 Q94,255 96,280 Q94,300 92,314 L86,318 Q88,295 88,268 Z" fill={color('legs')} opacity="0.55" stroke="#d1d5db" strokeWidth="0.3" />
            <path d="M112,248 Q106,255 104,280 Q106,300 108,314 L114,318 Q112,295 112,268 Z" fill={color('legs')} opacity="0.55" stroke="#d1d5db" strokeWidth="0.3" />

            {/* Knees */}
            <ellipse cx="82" cy="322" rx="12" ry="8" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="0.4" />
            <ellipse cx="118" cy="322" rx="12" ry="8" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="0.4" />

            {/* Gastrocnemius - calf diamond */}
            <path d="M72,332 Q68,345 70,365 Q74,386 82,392 Q86,388 88,375 Q90,358 88,340 L86,332 Z" {...muscleProps('legs')} opacity="0.7" filter="url(#muscleShadow)" />
            <path d="M128,332 Q132,345 130,365 Q126,386 118,392 Q114,388 112,375 Q110,358 112,340 L114,332 Z" {...muscleProps('legs')} opacity="0.7" filter="url(#muscleShadow)" />

            {/* Feet */}
            <ellipse cx="82" cy="404" rx="12" ry="6" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="0.3" />
            <ellipse cx="118" cy="404" rx="12" ry="6" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="0.3" />
          </svg>
        </div>
      </div>

      {/* Gradient legend */}
      <div className="mt-5 px-6">
        <div className="h-1.5 rounded-full" style={{
          background: 'linear-gradient(to right, #059669, #d97706, #dc2626)'
        }} />
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-gray-400">Recovered</span>
          <span className="text-[10px] text-gray-400">Moderate</span>
          <span className="text-[10px] text-gray-400">Fatigued</span>
        </div>
      </div>

      {/* Muscle stat chips */}
      <div className="grid grid-cols-3 gap-1.5 mt-4">
        {MUSCLE_GROUPS.map(muscle => (
          <div
            key={muscle}
            className={`text-center py-1.5 px-2 rounded-lg transition-all cursor-default ${
              tooltip?.muscle === muscle ? 'bg-gray-100 ring-1 ring-gray-300' : 'hover:bg-gray-50'
            }`}
            onMouseEnter={(e) => handleMouseEnter(muscle, e)}
            onMouseLeave={() => setTooltip(null)}
          >
            <div className="flex items-center justify-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color(muscle) }} />
              <span className="text-[11px] text-gray-500 capitalize">{muscle}</span>
            </div>
            <p className="text-xs font-semibold text-gray-900">{fatigue[muscle].toFixed(1)}</p>
          </div>
        ))}
      </div>

      {/* Hover tooltip */}
      {tooltip && (
        <div
          className="absolute z-50 bg-white border border-gray-200 rounded-xl shadow-lg p-4 w-64 pointer-events-none"
          style={{
            left: Math.min(tooltip.x + 16, 280),
            top: Math.max(tooltip.y - 20, 0),
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color(tooltip.muscle) }} />
              <span className="text-sm font-semibold text-gray-900 capitalize">{tooltip.muscle}</span>
            </div>
            <span className="text-xs font-mono text-gray-500">{fatigue[tooltip.muscle].toFixed(2)}</span>
          </div>
          <div className="text-xs text-gray-500 mb-3">
            Recovery: <span className="font-medium text-gray-700">{getRecoveryTimeDays(fatigue[tooltip.muscle])}d</span>
          </div>

          {topSessions.length > 0 ? (
            <>
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-1.5">Last {topSessions.length} sessions targeting this muscle</p>
              <div className="space-y-1.5">
                {topSessions.map((s, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="capitalize text-gray-700">{s.type}</span>
                      <span className="text-gray-400">{s.date}</span>
                    </div>
                    <span className="font-mono text-gray-500">+{s.contribution.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-xs text-gray-400 italic">No recent sessions</p>
          )}
        </div>
      )}
    </div>
  );
}
