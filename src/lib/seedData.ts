import { Session, Location } from './types';
import { computeMuscleLoad } from './muscleMapping';
import { estimateCalories } from './calories';

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(10, 0, 0, 0);
  return d.toISOString();
}

function makeSession(
  id: string,
  type: Session['type'],
  daysBack: number,
  duration: number,
  intensity: number,
  metrics: Session['metrics'],
  notes: string,
  tags: string[],
  extra?: { avgHeartRate?: number; maxHeartRate?: number; energyLevel?: number; location?: Location }
): Session {
  return {
    id,
    type,
    date: daysAgo(daysBack),
    duration,
    intensity,
    metrics,
    notes,
    tags,
    caloriesBurned: estimateCalories(type, intensity, duration),
    muscleLoad: computeMuscleLoad(type, intensity, duration),
    ...extra,
  };
}

export const SEED_SESSIONS: Session[] = [
  makeSession('seed-1', 'lifting', 1, 55, 8,
    { exercises: [
      { name: 'Bench Press', sets: 4, reps: 10, weight: 155 },
      { name: 'Incline Dumbbell Press', sets: 3, reps: 12, weight: 50 },
      { name: 'Cable Fly', sets: 3, reps: 15, weight: 30 },
    ]},
    'Felt strong today', ['push', 'chest'],
    { avgHeartRate: 128, maxHeartRate: 155, energyLevel: 4, location: 'gym' }
  ),
  makeSession('seed-2', 'running', 2, 32, 6,
    { distance: 5.2 },
    'Easy pace 5K', ['cardio'],
    { avgHeartRate: 152, maxHeartRate: 168, energyLevel: 3, location: 'outdoor' }
  ),
  makeSession('seed-3', 'boxing', 3, 45, 9,
    { rounds: 10 },
    'Sparring day, intense', ['conditioning'],
    { avgHeartRate: 162, maxHeartRate: 185, energyLevel: 5, location: 'gym' }
  ),
  makeSession('seed-4', 'basketball', 4, 75, 7,
    {},
    'Pickup game at the park', ['fun', 'cardio'],
    { avgHeartRate: 145, maxHeartRate: 172, energyLevel: 4, location: 'park' }
  ),
  makeSession('seed-5', 'lifting', 5, 60, 7,
    { exercises: [
      { name: 'Squat', sets: 5, reps: 5, weight: 225 },
      { name: 'Romanian Deadlift', sets: 4, reps: 8, weight: 185 },
      { name: 'Leg Press', sets: 3, reps: 12, weight: 320 },
    ]},
    'Leg day', ['legs'],
    { avgHeartRate: 135, maxHeartRate: 160, energyLevel: 4, location: 'gym' }
  ),
  makeSession('seed-6', 'running', 6, 48, 8,
    { distance: 8.1 },
    'Long run, pushed tempo', ['cardio', 'endurance'],
    { avgHeartRate: 158, maxHeartRate: 178, energyLevel: 3, location: 'outdoor' }
  ),
  makeSession('seed-7', 'lifting', 8, 50, 6,
    { exercises: [
      { name: 'Overhead Press', sets: 4, reps: 8, weight: 95 },
      { name: 'Lateral Raise', sets: 3, reps: 15, weight: 20 },
      { name: 'Face Pull', sets: 3, reps: 15, weight: 40 },
    ]},
    'Shoulder focus', ['push', 'shoulders'],
    { avgHeartRate: 118, maxHeartRate: 142, energyLevel: 3, location: 'gym' }
  ),
  makeSession('seed-8', 'boxing', 9, 30, 7,
    { rounds: 6 },
    'Bag work only', ['conditioning'],
    { avgHeartRate: 148, maxHeartRate: 170, energyLevel: 4, location: 'gym' }
  ),
  makeSession('seed-9', 'lifting', 3, 65, 9,
    { exercises: [
      { name: 'Bench Press', sets: 5, reps: 5, weight: 175 },
      { name: 'Close Grip Bench', sets: 3, reps: 10, weight: 135 },
      { name: 'Tricep Pushdown', sets: 3, reps: 12, weight: 50 },
    ]},
    'PR attempt day! Hit 175x5', ['push', 'chest', 'pr'],
    { avgHeartRate: 138, maxHeartRate: 168, energyLevel: 5, location: 'gym' }
  ),
  makeSession('seed-10', 'lifting', 10, 55, 7,
    { exercises: [
      { name: 'Squat', sets: 5, reps: 5, weight: 205 },
      { name: 'Leg Curl', sets: 3, reps: 12, weight: 90 },
    ]},
    'Working back up on squats', ['legs'],
    { avgHeartRate: 130, maxHeartRate: 155, energyLevel: 3, location: 'gym' }
  ),
];
