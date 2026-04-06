import { ActivityType, MuscleLoad } from './types';

const MUSCLE_WEIGHTS: Record<ActivityType, MuscleLoad> = {
  lifting: {
    chest: 0.30,
    shoulders: 0.20,
    back: 0.15,
    arms: 0.20,
    core: 0.05,
    legs: 0.10,
  },
  boxing: {
    chest: 0.05,
    shoulders: 0.35,
    back: 0.10,
    arms: 0.20,
    core: 0.25,
    legs: 0.05,
  },
  running: {
    chest: 0.0,
    shoulders: 0.0,
    back: 0.05,
    arms: 0.05,
    core: 0.15,
    legs: 0.75,
  },
  basketball: {
    chest: 0.0,
    shoulders: 0.10,
    back: 0.05,
    arms: 0.10,
    core: 0.20,
    legs: 0.55,
  },
};

export function getMuscleWeights(type: ActivityType): MuscleLoad {
  return MUSCLE_WEIGHTS[type];
}

export function computeMuscleLoad(
  type: ActivityType,
  intensity: number,
  duration: number
): MuscleLoad {
  const weights = MUSCLE_WEIGHTS[type];
  const factor = intensity * (duration / 60); // normalize duration to hours
  return {
    chest: weights.chest * factor,
    shoulders: weights.shoulders * factor,
    back: weights.back * factor,
    arms: weights.arms * factor,
    core: weights.core * factor,
    legs: weights.legs * factor,
  };
}
