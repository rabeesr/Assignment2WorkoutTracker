export type ActivityType = 'lifting' | 'boxing' | 'running' | 'basketball';

export type Location = 'gym' | 'home' | 'outdoor' | 'park' | 'other';

export interface MuscleLoad {
  chest: number;
  shoulders: number;
  back: number;
  arms: number;
  core: number;
  legs: number;
}

export interface LiftingExercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

export interface LiftingMetrics {
  exercises: LiftingExercise[];
}

export interface BoxingMetrics {
  rounds: number;
}

export interface RunningMetrics {
  distance: number; // km
}

export interface BasketballMetrics {}

export type ActivityMetrics = LiftingMetrics | BoxingMetrics | RunningMetrics | BasketballMetrics;

export interface Session {
  id: string;
  type: ActivityType;
  date: string; // ISO string
  duration: number; // minutes
  intensity: number; // 1-10
  metrics: ActivityMetrics;
  notes: string;
  tags: string[];
  caloriesBurned: number;
  muscleLoad: MuscleLoad;
  avgHeartRate?: number;
  maxHeartRate?: number;
  energyLevel?: number; // 1-5, pre-workout
  location?: Location;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  type: ActivityType;
  defaultMetrics: ActivityMetrics;
  defaultIntensity: number;
  defaultDuration: number;
  defaultTags: string[];
}

export interface PersonalRecord {
  exercise: string;
  weight: number;
  reps: number;
  date: string;
  sessionId: string;
}

export interface FitnessState {
  sessions: Session[];
  templates: WorkoutTemplate[];
  bodyWeightKg: number;
}

export type FitnessAction =
  | { type: 'ADD_SESSION'; payload: Session }
  | { type: 'DELETE_SESSION'; payload: string }
  | { type: 'ADD_TEMPLATE'; payload: WorkoutTemplate }
  | { type: 'DELETE_TEMPLATE'; payload: string }
  | { type: 'SET_BODY_WEIGHT'; payload: number }
  | { type: 'INIT'; payload: FitnessState };

export const MUSCLE_GROUPS: (keyof MuscleLoad)[] = [
  'chest', 'shoulders', 'back', 'arms', 'core', 'legs'
];

export const LOCATIONS: { value: Location; label: string }[] = [
  { value: 'gym', label: 'Gym' },
  { value: 'home', label: 'Home' },
  { value: 'outdoor', label: 'Outdoor' },
  { value: 'park', label: 'Park' },
  { value: 'other', label: 'Other' },
];
