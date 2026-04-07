import { WorkoutTemplate } from './types';

export const DEFAULT_TEMPLATES: WorkoutTemplate[] = [
  {
    id: 'tpl-push-day',
    name: 'Push Day',
    type: 'lifting',
    defaultMetrics: { exercises: [
      { name: 'Bench Press', sets: 4, reps: 10, weight: 135 },
      { name: 'Overhead Press', sets: 3, reps: 8, weight: 85 },
      { name: 'Incline Dumbbell Press', sets: 3, reps: 12, weight: 45 },
    ]},
    defaultIntensity: 7,
    defaultDuration: 60,
    defaultTags: ['push'],
  },
  {
    id: 'tpl-pull-day',
    name: 'Pull Day',
    type: 'lifting',
    defaultMetrics: { exercises: [
      { name: 'Deadlift', sets: 3, reps: 5, weight: 225 },
      { name: 'Barbell Row', sets: 4, reps: 8, weight: 135 },
      { name: 'Bicep Curl', sets: 3, reps: 12, weight: 30 },
    ]},
    defaultIntensity: 7,
    defaultDuration: 55,
    defaultTags: ['pull'],
  },
  {
    id: 'tpl-5k-run',
    name: '5K Run',
    type: 'running',
    defaultMetrics: { distance: 5 },
    defaultIntensity: 6,
    defaultDuration: 28,
    defaultTags: ['cardio'],
  },
  {
    id: 'tpl-boxing-session',
    name: 'Boxing Session',
    type: 'boxing',
    defaultMetrics: { rounds: 8 },
    defaultIntensity: 8,
    defaultDuration: 45,
    defaultTags: ['cardio', 'conditioning'],
  },
  {
    id: 'tpl-pickup-basketball',
    name: 'Pickup Basketball',
    type: 'basketball',
    defaultMetrics: {},
    defaultIntensity: 7,
    defaultDuration: 60,
    defaultTags: ['cardio', 'fun'],
  },
];
