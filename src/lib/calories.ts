import { ActivityType } from './types';

const BASE_MET: Record<ActivityType, number> = {
  lifting: 5.0,
  boxing: 7.5,
  running: 9.0,
  basketball: 6.5,
};

export function estimateCalories(
  type: ActivityType,
  intensity: number,
  durationMinutes: number,
  bodyWeightKg: number = 75
): number {
  const baseMet = BASE_MET[type];
  const effectiveMet = baseMet * (intensity / 7);
  const durationHours = durationMinutes / 60;
  return Math.round(effectiveMet * bodyWeightKg * durationHours);
}
