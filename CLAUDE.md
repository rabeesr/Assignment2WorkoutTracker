# Unified Fitness Tracker

## Overview

A comprehensive fitness tracking app that unifies weightlifting, boxing, running, and basketball into a single system. Tracks workout sessions with multi-exercise support, muscle fatigue across all activities, recovery timelines, calorie expenditure, heart rate zones, personal records, goals, and progress photos. All data is stored in client-side state (in-memory, resets on refresh).

## Tech Stack

- **Next.js 16** (App Router) with TypeScript
- **React Context + useReducer** for state management
- **Tailwind CSS v4** for styling (light theme, clean minimal design)
- **Recharts** for trend charts on Progress page
- **canvas-confetti** for PR celebration animations
- **Playwright** for e2e testing

## Pages

| Route | Description |
|-------|-------------|
| `/` | Dashboard — heatmap, recovery timelines, calorie summary, training calendar, goals widget, rest day suggestions |
| `/log` | Log Session — dynamic multi-exercise form, biometrics, photo upload, templates |
| `/history` | History — filterable session list with delete support |
| `/progress` | Progress — per-exercise lifting charts, running/boxing/basketball trends, calorie & heart rate zones |
| `/records` | Personal Records — Olympic podium display, volume PRs, cardio records |
| `/goals` | Goals — set and track weight, pace, distance, and session targets with progress bars |
| `/report` | Weekly Report Card — stats vs last week, activity breakdown, muscle coverage, letter grade |
| `/templates` | Templates — browse, use, and delete workout templates |
| `/photos` | Progress Photos — gallery with lightbox and session links |
| `/session/[id]` | Session Detail — dynamic route with full breakdown, exercise table, muscle load |

## Features

### Dashboard
- **Anatomical Body Heatmap** — musculoskeletal SVG diagram (anterior + posterior views) with color-coded fatigue levels per muscle group (green → amber → red)
- **Interactive Hover Tooltips** — hovering a muscle shows fatigue value, recovery time in days, and the last 5 sessions that targeted it with individual fatigue contributions
- **Recovery Timeline** — per-muscle recovery bars showing days remaining (to 2 decimal places)
- **Rest Day Suggestions** — banner recommending rest when total fatigue is high, or suggesting the most recovered muscle to target
- **Quick Stats** — sessions this week, most trained activity, weekly calories, total duration
- **Energy Expenditure** — today's calories, weekly total, and daily average
- **Training Calendar** — GitHub-style 16-week contribution heatmap showing session density per day
- **Goals Widget** — top 3 active goals with progress bars, links to goals management page
- **Last Session Card** — summary of most recent workout with link to detail view

### Log Session
- **Activity Selector** — choose from Lifting, Boxing, Running, or Basketball
- **Multi-Exercise Lifting** — add multiple exercises per session, each with independent name, sets, reps, and weight
- **Dynamic Form** — activity-specific fields render based on selection
- **Biometrics** — average heart rate, max heart rate, pre-workout energy level (1-5), location (gym/home/outdoor/park), configurable body weight
- **Progress Photo** — optional photo upload stored as base64
- **Intensity Slider** — 1-10 scale with color feedback
- **Notes & Tags** — free-text notes and chip-based tag input
- **Workout Templates** — save sessions as reusable templates; load templates to pre-fill all fields
- **Calorie Preview** — real-time estimated calorie burn shown before submission
- **Confetti on New PR** — canvas-confetti fires when a lifting session beats an existing personal record
- **Save as Template** — option to save the current session configuration for future reuse

### History
- **Filterable Session List** — filter by activity type and/or tags
- **Expandable Rows** — click to reveal full session details inline, including exercise list for lifting
- **Session Deletion** — delete button in expanded view
- **Heart Rate & Location** — shown when available
- **Session Count** — shows number of matching sessions

### Session Detail (Dynamic Route)
- **Full Session Breakdown** — date/time, duration, intensity, calories, type, heart rate, energy level, location
- **Exercise Table** — for lifting sessions, shows exercise name, sets, reps, weight, and volume per exercise
- **Activity-Specific Metrics** — distance/pace for running, rounds for boxing
- **Muscle Load Distribution** — color-coded progress bars showing load per muscle group
- **Tags & Notes** — displayed with full formatting

### Progress
- **Tabbed Views** — Lifting, Running, Boxing, Basketball, Calories, Heart Rate
- **Per-Exercise Lifting Charts** — exercise selector to view weight and volume trends for individual exercises (e.g., Bench Press, Squat)
- **Running Charts** — distance over time and pace trend (min/km)
- **Boxing Charts** — rounds per session
- **Basketball Charts** — sessions per week
- **Calorie Chart** — area chart showing calorie burn per session
- **Heart Rate Zones** — zone distribution bars (Zone 1-5 based on % of max HR) and HR trend line chart (avg + max over time)

### Personal Records
- **Olympic Podium** — top 3 heaviest lifts displayed with gold/silver/bronze medals, animated trophy for #1
- **Full PR Table** — all exercises ranked by weight with medal badges, reps, and dates linking to sessions
- **Volume PRs** — grid of highest-volume sets per exercise
- **Cardio Records** — longest run, fastest pace, most boxing rounds

### Goals
- **Goal Types** — lift weight (per exercise), run distance, 5K time, sessions per week, custom
- **Auto Progress** — progress bars auto-calculate from session data (e.g., current bench max vs target)
- **Dashboard Widget** — top 3 active goals shown on dashboard
- **Mark Complete** — manually mark goals as achieved when target is hit
- **Seed Goals** — 3 pre-loaded example goals

### Weekly Report Card
- **Stats Comparison** — sessions, calories, duration vs last week with % change (green/red)
- **Activity Breakdown** — proportional bars showing session distribution by type
- **Muscle Coverage** — most trained vs least trained muscle group
- **PRs This Week** — highlighted in gold badges
- **Average Heart Rate** — weekly average when HR data is available
- **Letter Grade** — A through F based on training consistency

### Progress Photos
- **Photo Upload** — optional base64 photo when logging any session
- **Gallery View** — grid of photos with date, activity type overlay
- **Lightbox** — full-size view with left/right navigation
- **Session Links** — each photo links back to its session detail

### Templates
- **Template Management** — dedicated page to browse all saved templates
- **Exercise Preview** — lifting templates show full exercise list
- **Quick Use** — one-click to navigate to log form (templates also available on log page)
- **Delete** — remove templates no longer needed

### AI Coach (Placeholder)
- **Floating Chat Button** — bottom-right corner, accessible from any page
- **Coming Soon Panel** — shows planned features: personalized workout recommendations, recovery & fatigue analysis, training load optimization

### Cross-Cutting
- **Shared Layout** — persistent navigation bar with 9 pages
- **Seed Data** — 10 pre-loaded demo sessions with multi-exercise lifting and biometrics
- **MET-Based Calorie Estimation** — per-activity metabolic equivalent calculations scaled by intensity and body weight
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
  muscleLoad: { chest, shoulders, back, arms, core, legs },
  avgHeartRate?: number,
  maxHeartRate?: number,
  energyLevel?: number (1-5),
  location?: 'gym' | 'home' | 'outdoor' | 'park' | 'other',
  photo?: string (base64)
}
```

### LiftingMetrics (multi-exercise)
```ts
{
  exercises: Array<{ name: string, sets: number, reps: number, weight: number }>
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

### Goal
```ts
{
  id: string,
  title: string,
  type: 'weight' | 'run_pace' | 'run_distance' | 'sessions_per_week' | 'custom',
  target: number,
  unit: string,
  exercise?: string,
  createdAt: string,
  completedAt?: string
}
```

## Key Algorithms

- **Fatigue**: `intensity × (duration/60) × muscle_weight`, decays as `e^(-0.3 × days)`
- **Calories**: `MET × (intensity/7) × bodyWeightKg × durationHours`
- **Recovery**: `time_to_recovery = -ln(threshold / fatigue) / 0.3` (displayed in days to 2 decimal places)
- **HR Zones**: Zone 1 (<60% max), Zone 2 (60-70%), Zone 3 (70-80%), Zone 4 (80-90%), Zone 5 (90%+)

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # ESLint
npx playwright test  # e2e tests (3 tests: log flow, dashboard, session detail)
```

## Project Structure

- `src/app/` — Next.js pages and layout (11 routes)
- `src/components/dashboard/` — BodyHeatmap, RecoveryTimeline, QuickStats, CalorieSummary, RestDaySuggestion, TrainingCalendar, GoalsWidget
- `src/components/log/` — SessionForm, ActivitySelector, LiftingFields, BoxingFields, RunningFields, BasketballFields, IntensitySlider, TagInput, TemplateSelector
- `src/components/layout/` — Navbar, AIChatbot
- `src/context/` — FitnessContext (central state provider with useReducer)
- `src/lib/` — types.ts, fatigue.ts, calories.ts, muscleMapping.ts, seedData.ts, templates.ts
