import { MuscleLoad, Session, MUSCLE_GROUPS } from './types';

const DECAY_CONSTANT = 0.3; // per day
const RECOVERY_THRESHOLD = 0.5;

export function calculateCurrentFatigue(sessions: Session[], now: Date = new Date()): MuscleLoad {
  const fatigue: MuscleLoad = { chest: 0, shoulders: 0, back: 0, arms: 0, core: 0, legs: 0 };

  for (const session of sessions) {
    const sessionDate = new Date(session.date);
    const daysSince = (now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince < 0) continue;

    const decayFactor = Math.exp(-DECAY_CONSTANT * daysSince);

    for (const muscle of MUSCLE_GROUPS) {
      fatigue[muscle] += session.muscleLoad[muscle] * decayFactor;
    }
  }

  return fatigue;
}

export function getRecoveryTimeDays(currentFatigue: number): number {
  if (currentFatigue <= RECOVERY_THRESHOLD) return 0;
  const days = -Math.log(RECOVERY_THRESHOLD / currentFatigue) / DECAY_CONSTANT;
  return Number(days.toFixed(2));
}

export function getMaxFatigue(fatigue: MuscleLoad): { muscle: keyof MuscleLoad; value: number } {
  let maxMuscle: keyof MuscleLoad = 'chest';
  let maxValue = 0;

  for (const muscle of MUSCLE_GROUPS) {
    if (fatigue[muscle] > maxValue) {
      maxValue = fatigue[muscle];
      maxMuscle = muscle;
    }
  }

  return { muscle: maxMuscle, value: maxValue };
}

export function getTotalFatigue(fatigue: MuscleLoad): number {
  return MUSCLE_GROUPS.reduce((sum, muscle) => sum + fatigue[muscle], 0);
}

export function shouldRest(fatigue: MuscleLoad): boolean {
  return getTotalFatigue(fatigue) > 15;
}

export function getMostRecoveredMuscle(fatigue: MuscleLoad): keyof MuscleLoad {
  let minMuscle: keyof MuscleLoad = 'chest';
  let minValue = Infinity;

  for (const muscle of MUSCLE_GROUPS) {
    if (fatigue[muscle] < minValue) {
      minValue = fatigue[muscle];
      minMuscle = muscle;
    }
  }

  return minMuscle;
}

export function fatigueToColor(fatigue: number, maxFatigue: number): string {
  if (maxFatigue === 0) return 'rgb(5, 150, 105)';
  const ratio = Math.min(fatigue / Math.max(maxFatigue, 5), 1);
  // Clean gradient: green → amber → red
  if (ratio < 0.5) {
    const t = ratio / 0.5;
    const r = Math.round(5 + (212 * t));
    const g = Math.round(150 + (69 * t) - (100 * t * t));
    const b = Math.round(105 - (99 * t));
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    const t = (ratio - 0.5) / 0.5;
    const r = Math.round(217 + (3 * t));
    const g = Math.round(119 - (81 * t));
    const b = Math.round(6 + (32 * t));
    return `rgb(${r}, ${g}, ${b})`;
  }
}
