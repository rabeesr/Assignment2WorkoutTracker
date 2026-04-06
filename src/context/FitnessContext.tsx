'use client';

import React, { createContext, useContext, useReducer, useState, useEffect, ReactNode } from 'react';
import { FitnessState, FitnessAction, Session, WorkoutTemplate } from '@/lib/types';
import { SEED_SESSIONS } from '@/lib/seedData';
import { DEFAULT_TEMPLATES } from '@/lib/templates';

const emptyState: FitnessState = {
  sessions: [],
  templates: [],
  bodyWeightKg: 75,
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
      },
    });
    setIsReady(true);
  }, []);

  const addSession = (session: Session) => dispatch({ type: 'ADD_SESSION', payload: session });
  const deleteSession = (id: string) => dispatch({ type: 'DELETE_SESSION', payload: id });
  const addTemplate = (template: WorkoutTemplate) => dispatch({ type: 'ADD_TEMPLATE', payload: template });
  const deleteTemplate = (id: string) => dispatch({ type: 'DELETE_TEMPLATE', payload: id });
  const getSession = (id: string) => state.sessions.find(s => s.id === id);

  return (
    <FitnessContext.Provider value={{ state, dispatch, addSession, deleteSession, addTemplate, deleteTemplate, getSession, isReady }}>
      {children}
    </FitnessContext.Provider>
  );
}

export function useFitness() {
  const ctx = useContext(FitnessContext);
  if (!ctx) throw new Error('useFitness must be used within FitnessProvider');
  return ctx;
}
