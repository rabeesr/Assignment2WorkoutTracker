# Unified Fitness Tracker (In-Memory App)

## Overview

A lightweight fitness tracking app that unifies weightlifting, boxing, running, basketball, and other activities into a single system.

The app tracks:

* Workout sessions
* Muscle fatigue (across all activities)
* Performance progression

All data is stored in client-side state (no database). Data resets on refresh.

---

## Core Concept

Every activity contributes to **muscle fatigue** and **performance metrics**.

Instead of siloed trackers (lifting vs cardio), this app creates a **shared model**:

* Each session → maps to muscle groups
* Fatigue accumulates and decays over time
* Users can visualize recovery and progression

---

## Pages (4 Total)

### 1. Dashboard (`/`)

**Purpose:** Quick daily overview

**Displays:**

* Muscle fatigue heatmap (front/back body)
* Most fatigued muscle group
* Last session summary
* Quick stats:

  * Total sessions this week
  * Most trained activity

**Key UI Elements:**

* Color-coded body map (green → red)
* Simple cards for stats

---

### 2. Log Session (`/log`)

**Purpose:** Primary input page

**Flow:**

1. Select activity type:

   * Lifting
   * Boxing
   * Running
   * Basketball

2. Dynamic form renders based on type:

   * Lifting → sets, reps, weight
   * Running → distance, time
   * Boxing → rounds, intensity
   * Basketball → duration, intensity

3. User inputs:

   * Duration
   * Intensity (1–10 slider)
   * Optional notes

4. On submit:

   * Map activity → muscle groups
   * Compute fatigue contribution
   * Store session in state

**Key Requirement:**
Logging should take < 15 seconds

---

### 3. History (`/history`)

**Purpose:** View past sessions

**Displays:**

* Chronological list of sessions
* Each item shows:

  * Activity type
  * Duration
  * Intensity
  * Key metrics (e.g., weight, distance)

**Features:**

* Filter by activity type
* Expand row to view details

---

### 4. Progress (`/progress`)

**Purpose:** Track performance trends

**Displays:**

* Lifting:

  * Volume over time
  * Personal records (PRs)
* Running:

  * Distance / pace trends
* Boxing:

  * Rounds over time
* Basketball:

  * Sessions per week

**Simple Visuals:**

* Line charts or basic trend indicators
* Weekly summaries

---

## Data Model

### Session Object

```
{
  id: string,
  type: "lifting" | "boxing" | "running" | "basketball",
  date: timestamp,
  duration: number,
  intensity: number (1–10),
  metrics: object, // activity-specific
  muscleLoad: {
    chest: number,
    shoulders: number,
    legs: number,
    arms: number,
    core: number
  }
}
```

---

## Muscle Mapping

Each activity maps to muscle groups with weights.

Example:

* Lifting (bench press focus)

  * chest: 0.6
  * shoulders: 0.25
  * arms: 0.15

* Boxing

  * shoulders: 0.4
  * core: 0.3
  * arms: 0.2
  * legs: 0.1

* Running

  * legs: 0.7
  * calves: 0.2
  * core: 0.1

* Basketball

  * legs: 0.5
  * calves: 0.2
  * core: 0.2
  * shoulders: 0.1

---

## Fatigue Model

### Per Session

```
fatigue = intensity × duration × muscle_weight
```

### Over Time (Decay)

```
current_fatigue = previous_fatigue * e^(-k * days)
```

Where:

* `k` is a decay constant (e.g., 0.3)

---

## State Management

* Store all sessions in a single array in memory
* Derive:

  * Current fatigue per muscle group
  * Weekly stats
  * Progress metrics

No persistence required.

---

## Tech Requirements

* React (components + state)
* Routing (4 pages)
* Forms (dynamic inputs)
* Tailwind (UI styling)
* Playwright (basic test flow: log session → verify dashboard)

---

## UX Principles

* Fast input (minimal typing)
* Visual-first (heatmap > tables)
* Default values where possible
* Clean, minimal layout

---

## MVP Scope

Must have:

* Log session
* Muscle mapping
* Fatigue calculation
* Heatmap visualization
* 4 working pages

Nice to have:

* Filters
* Trend charts
* PR tracking

---

## Future Improvements (Next Assignment)

* Persist data (database)
* User accounts
* Smarter fatigue modeling
* Recommendations ("Train legs today?")

---

## Goal

Build something you would actually use daily to:

* Track workouts
* Avoid overtraining
* See real progress across all activities
