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
    <div className={`border rounded-xl p-4 ${
      rest
        ? 'bg-red/10 border-red/30'
        : 'bg-green/10 border-green/30'
    }`}>
      {rest ? (
        <div>
          <p className="font-semibold text-red">Rest Recommended</p>
          <p className="text-sm text-muted mt-1">
            Your overall fatigue is high. Consider taking a rest day to recover.
          </p>
        </div>
      ) : (
        <div>
          <p className="font-semibold text-green">Good to Train</p>
          <p className="text-sm text-muted mt-1">
            <span className="capitalize font-medium text-foreground">{bestMuscle}</span> is most recovered — consider targeting it today.
          </p>
        </div>
      )}
    </div>
  );
}
