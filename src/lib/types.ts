export type ActivityType = 'lifting' | 'boxing' | 'running' | 'basketball';

export interface MuscleLoad {
  chest: number;
  shoulders: number;
  back: number;
  arms: number;
  core: number;
  legs: number;
}

export interface LiftingMetrics {
  exercise: string;
  sets: number;
  reps: number;
  weight: number;
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
  | { type: 'SET_BODY_WEIGHT'; payload: number };

export const MUSCLE_GROUPS: (keyof MuscleLoad)[] = [
  'chest', 'shoulders', 'back', 'arms', 'core', 'legs'
];
