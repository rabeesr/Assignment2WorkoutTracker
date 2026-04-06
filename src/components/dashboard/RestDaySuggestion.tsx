'use client';

import { MuscleLoad } from '@/lib/types';
import { shouldRest, getMostRecoveredMuscle } from '@/lib/fatigue';

interface Props {
  fatigue: MuscleLoad;
}

export default function RestDaySuggestion({ fatigue }: Props) {
  const rest = shouldRest(fatigue);
  const bestMuscle = getMostRecoveredMuscle(fatigue);

  return (
    <div className={`rounded-2xl p-4 border ${
      rest
        ? 'bg-red-50 border-red-200'
        : 'bg-emerald-50 border-emerald-200'
    }`}>
      {rest ? (
        <div>
          <p className="font-semibold text-red-700">Rest Recommended</p>
          <p className="text-sm text-red-600/70 mt-0.5">
            Your overall fatigue is high. Consider taking a rest day to recover.
          </p>
        </div>
      ) : (
        <div>
          <p className="font-semibold text-emerald-700">Good to Train</p>
          <p className="text-sm text-emerald-600/70 mt-0.5">
            <span className="capitalize font-medium text-emerald-800">{bestMuscle}</span> is most recovered — consider targeting it today.
          </p>
        </div>
      )}
    </div>
  );
}
