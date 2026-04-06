# Unified Fitness Tracker

## Overview

A lightweight fitness tracking app that unifies weightlifting, boxing, running, and basketball into a single system. Tracks workout sessions, muscle fatigue across all activities, recovery timelines, and calorie expenditure. All data is stored in client-side state (in-memory, resets on refresh).

## Tech Stack

- **Next.js 16** (App Router) with TypeScript
- **React Context + useReducer** for state management
- **Tailwind CSS v4** for styling (light theme, clean minimal design)
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

## Features

### Dashboard
- **Anatomical Body Heatmap** — musculoskeletal SVG diagram (anterior + posterior views) with color-coded fatigue levels per muscle group (green → amber → red)
- **Interactive Hover Tooltips** — hovering a muscle shows fatigue value, recovery time in days, and the last 5 sessions that targeted it with individual fatigue contributions
- **Recovery Timeline** — per-muscle recovery bars showing days remaining (to 2 decimal places)
- **Rest Day Suggestions** — banner recommending rest when total fatigue is high, or suggesting the most recovered muscle to target
- **Quick Stats** — sessions this week, most trained activity, weekly calories, total duration
- **Energy Expenditure** — today's calories, weekly total, and daily average
- **Last Session Card** — summary of most recent workout with link to detail view

### Log Session
- **Activity Selector** — choose from Lifting, Boxing, Running, or Basketball
- **Dynamic Form** — activity-specific fields render based on selection (sets/reps/weight for lifting, rounds for boxing, distance for running)
- **Intensity Slider** — 1-10 scale with color feedback (green/yellow/red)
- **Notes & Tags** — free-text notes and chip-based tag input for categorization
- **Workout Templates** — save sessions as reusable templates; load templates to pre-fill all fields for quick logging (<5 seconds)
- **Calorie Preview** — real-time estimated calorie burn shown before submission
- **Save as Template** — option to save the current session configuration for future reuse

### History
- **Filterable Session List** — filter by activity type and/or tags
- **Expandable Rows** — click to reveal full session details inline
- **Session Count** — shows number of matching sessions
- **Link to Detail** — each session links to its full `/session/[id]` page

### Session Detail (Dynamic Route)
- **Full Session Breakdown** — date/time, duration, intensity, calories, type
- **Activity-Specific Metrics** — exercise name, sets, reps, weight, distance, pace, rounds
- **Muscle Load Distribution** — color-coded progress bars showing load per muscle group
- **Tags & Notes** — displayed with full formatting

### Progress
- **Tabbed Views** — switch between Lifting, Running, Boxing, Basketball, and Calories
- **Lifting Charts** — volume over time (sets × reps × weight) and weight progression
- **Running Charts** — distance over time and pace trend (min/km)
- **Boxing Charts** — rounds per session
- **Basketball Charts** — sessions per week
- **Calorie Chart** — area chart showing calorie burn per session across all activities

### AI Coach (Placeholder)
- **Floating Chat Button** — bottom-right corner, accessible from any page
- **Coming Soon Panel** — shows planned features: personalized workout recommendations, recovery & fatigue analysis, training load optimization
- **Disabled Input** — visual indication that the feature is on the roadmap

### Cross-Cutting
- **Shared Layout** — persistent navigation bar across all pages
- **Seed Data** — 8 pre-loaded demo sessions so the app looks populated on first load
- **MET-Based Calorie Estimation** — per-activity metabolic equivalent calculations scaled by intensity
- **Exponential Fatigue Decay** — fatigue accumulates from sessions and decays over time using `e^(-0.3 × days)`
- **6 Muscle Groups** — chest, shoulders, back, arms, core, legs with per-activity weight mapping

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
- **Recovery**: `time_to_recovery = -ln(threshold / fatigue) / 0.3` (displayed in days to 2 decimal places)

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # ESLint
npx playwright test  # e2e tests (3 tests: log flow, dashboard, session detail)
```

## Project Structure

- `src/app/` — Next.js pages and layout (5 routes)
- `src/components/dashboard/` — BodyHeatmap, RecoveryTimeline, QuickStats, CalorieSummary, RestDaySuggestion
- `src/components/log/` — SessionForm, ActivitySelector, LiftingFields, BoxingFields, RunningFields, BasketballFields, IntensitySlider, TagInput, TemplateSelector
- `src/components/layout/` — Navbar, AIChatbot
- `src/context/` — FitnessContext (central state provider with useReducer)
- `src/lib/` — types.ts, fatigue.ts, calories.ts, muscleMapping.ts, seedData.ts, templates.ts
