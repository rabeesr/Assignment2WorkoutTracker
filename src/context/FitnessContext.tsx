'use client';

import React, { createContext, useContext, useReducer, useState, useEffect, ReactNode } from 'react';
import { FitnessState, FitnessAction, Session, WorkoutTemplate, Goal } from '@/lib/types';
import { SEED_SESSIONS } from '@/lib/seedData';
import { DEFAULT_TEMPLATES } from '@/lib/templates';

const emptyState: FitnessState = {
  sessions: [],
  templates: [],
  bodyWeightKg: 75,
  goals: [],
};

function fitnessReducer(state: FitnessState, action: FitnessAction): FitnessState {
  switch (action.type) {
    case 'ADD_SESSION':
      return { ...state, sessions: [action.payload, ...state.sessions] };
    case 'DELETE_SESSION':
      return { ...state, sessions: state.sessions.filter(s => s.id !== action.payload) };
    case 'ADD_TEMPLATE':
      return { ...state, templates: [...state.templates, action.payload] };
    case 'DELETE_TEMPLATE':
      return { ...state, templates: state.templates.filter(t => t.id !== action.payload) };
    case 'SET_BODY_WEIGHT':
      return { ...state, bodyWeightKg: action.payload };
    case 'ADD_GOAL':
      return { ...state, goals: [...state.goals, action.payload] };
    case 'DELETE_GOAL':
      return { ...state, goals: state.goals.filter(g => g.id !== action.payload) };
    case 'COMPLETE_GOAL':
      return { ...state, goals: state.goals.map(g => g.id === action.payload ? { ...g, completedAt: new Date().toISOString() } : g) };
    case 'INIT':
      return action.payload;
    default:
      return state;
  }
}

interface FitnessContextValue {
  state: FitnessState;
  dispatch: React.Dispatch<FitnessAction>;
  addSession: (session: Session) => void;
  deleteSession: (id: string) => void;
  addTemplate: (template: WorkoutTemplate) => void;
  deleteTemplate: (id: string) => void;
  getSession: (id: string) => Session | undefined;
  addGoal: (goal: Goal) => void;
  deleteGoal: (id: string) => void;
  completeGoal: (id: string) => void;
  isReady: boolean;
}

const FitnessContext = createContext<FitnessContextValue | null>(null);

export function FitnessProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(fitnessReducer, emptyState);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    dispatch({
      type: 'INIT',
      payload: {
        sessions: SEED_SESSIONS,
        templates: DEFAULT_TEMPLATES,
        bodyWeightKg: 75,
        goals: [
          { id: 'goal-1', title: 'Bench Press 200 lbs', type: 'weight', target: 200, unit: 'lbs', exercise: 'Bench Press', createdAt: new Date().toISOString() },
          { id: 'goal-2', title: 'Run 5K under 25 min', type: 'run_pace', target: 25, unit: 'min', createdAt: new Date().toISOString() },
          { id: 'goal-3', title: 'Work out 4x per week', type: 'sessions_per_week', target: 4, unit: 'sessions', createdAt: new Date().toISOString() },
        ],
      },
    });
    setIsReady(true);
  }, []);

  const addSession = (session: Session) => dispatch({ type: 'ADD_SESSION', payload: session });
  const deleteSession = (id: string) => dispatch({ type: 'DELETE_SESSION', payload: id });
  const addTemplate = (template: WorkoutTemplate) => dispatch({ type: 'ADD_TEMPLATE', payload: template });
  const deleteTemplate = (id: string) => dispatch({ type: 'DELETE_TEMPLATE', payload: id });
  const getSession = (id: string) => state.sessions.find(s => s.id === id);
  const addGoal = (goal: Goal) => dispatch({ type: 'ADD_GOAL', payload: goal });
  const deleteGoal = (id: string) => dispatch({ type: 'DELETE_GOAL', payload: id });
  const completeGoal = (id: string) => dispatch({ type: 'COMPLETE_GOAL', payload: id });

  return (
    <FitnessContext.Provider value={{ state, dispatch, addSession, deleteSession, addTemplate, deleteTemplate, getSession, addGoal, deleteGoal, completeGoal, isReady }}>
      {children}
    </FitnessContext.Provider>
  );
}

export function useFitness() {
  const ctx = useContext(FitnessContext);
  if (!ctx) throw new Error('useFitness must be used within FitnessProvider');
  return ctx;
}
