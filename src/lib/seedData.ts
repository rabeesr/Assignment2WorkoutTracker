import { Session } from './types';
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
  tags: string[]
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
  };
}

export const SEED_SESSIONS: Session[] = [
  makeSession('seed-1', 'lifting', 1, 55, 8, { exercise: 'Bench Press', sets: 4, reps: 10, weight: 155 }, 'Felt strong today', ['push', 'chest']),
  makeSession('seed-2', 'running', 2, 32, 6, { distance: 5.2 }, 'Easy pace 5K', ['cardio']),
  makeSession('seed-3', 'boxing', 3, 45, 9, { rounds: 10 }, 'Sparring day, intense', ['conditioning']),
  makeSession('seed-4', 'basketball', 4, 75, 7, {}, 'Pickup game at the park', ['fun', 'cardio']),
  makeSession('seed-5', 'lifting', 5, 60, 7, { exercise: 'Squat', sets: 5, reps: 5, weight: 225 }, 'Leg day', ['pull', 'legs']),
  makeSession('seed-6', 'running', 6, 48, 8, { distance: 8.1 }, 'Long run, pushed tempo', ['cardio', 'endurance']),
  makeSession('seed-7', 'lifting', 8, 50, 6, { exercise: 'Overhead Press', sets: 4, reps: 8, weight: 95 }, 'Shoulder focus', ['push', 'shoulders']),
  makeSession('seed-8', 'boxing', 9, 30, 7, { rounds: 6 }, 'Bag work only', ['conditioning']),
];
