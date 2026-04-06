# Unified Fitness Tracker

## Overview

A lightweight fitness tracking app that unifies weightlifting, boxing, running, and basketball into a single system. Tracks workout sessions, muscle fatigue across all activities, recovery timelines, and calorie expenditure. All data is stored in client-side state (in-memory, resets on refresh).

## Tech Stack

- **Next.js 14+** (App Router) with TypeScript
- **React Context + useReducer** for state management
- **Tailwind CSS** for styling
- **Recharts** for trend charts on Progress page
- **Playwright** for e2e testing

## Pages

| Route | Description |
|-------|-------------|
| `/` | Dashboard — muscle fatigue heatmap, recovery timelines, calorie summary, rest day suggestions |
| `/log` | Log Session — dynamic form per activity type, workout templates, notes & tags |
| `/history` | History — chronological session list, filterable by activity type and tags |
| `/progress` | Progress — trend charts for volume, pace, rounds, calories |
| `/session/[id]` | Session Detail — dynamic route showing full session breakdown |

## Data Model

### Session
```ts
{
  id: string,
  type: 'lifting' | 'boxing' | 'running' | 'basketball',
  date: string (ISO),
  duration: number (minutes),
  intensity: number (1-10),
  metrics: ActivityMetrics,
  notes: string,
  tags: string[],
  caloriesBurned: number,
  muscleLoad: { chest, shoulders, back, arms, core, legs }
}
```

### WorkoutTemplate
```ts
{
  id: string,
  name: string,
  type: ActivityType,
  defaultMetrics: ActivityMetrics,
  defaultIntensity: number,
  defaultDuration: number,
  defaultTags: string[]
}
```

## Key Algorithms

- **Fatigue**: `intensity × (duration/60) × muscle_weight`, decays as `e^(-0.3 × days)`
- **Calories**: `MET × (intensity/7) × bodyWeightKg × durationHours`
- **Recovery**: `time_to_recovery = -ln(threshold / fatigue) / 0.3`

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # ESLint
npx playwright test  # e2e tests
```

## Project Structure

- `src/app/` — Next.js pages and layout
- `src/components/` — UI components organized by page
- `src/context/` — FitnessContext (central state provider)
- `src/lib/` — Types, fatigue/calorie math, muscle mapping, seed data
- `src/hooks/` — Custom hooks (useSessions, useFatigue)
