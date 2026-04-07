'use client';

import { useState, useMemo } from 'react';
import { useFitness } from '@/context/FitnessContext';
import { GoalType, Goal, LiftingMetrics } from '@/lib/types';

const GOAL_TYPES: { value: GoalType; label: string; unit: string; placeholder: string }[] = [
  { value: 'weight', label: 'Lift Weight', unit: 'lbs', placeholder: 'e.g., 225' },
  { value: 'run_distance', label: 'Run Distance', unit: 'km', placeholder: 'e.g., 10' },
  { value: 'run_pace', label: '5K Time', unit: 'min', placeholder: 'e.g., 25' },
  { value: 'sessions_per_week', label: 'Sessions/Week', unit: 'sessions', placeholder: 'e.g., 4' },
  { value: 'custom', label: 'Custom', unit: '', placeholder: 'Target value' },
];

export default function GoalsPage() {
  const { state, addGoal, deleteGoal, completeGoal } = useFitness();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<GoalType>('weight');
  const [target, setTarget] = useState('');
  const [exercise, setExercise] = useState('');
  const [unit, setUnit] = useState('lbs');

  const activeGoals = state.goals.filter(g => !g.completedAt);
  const completedGoals = state.goals.filter(g => g.completedAt);

  const goalProgress = useMemo(() => {
    return state.goals.map(goal => {
      let current = 0;
      if (goal.type === 'weight' && goal.exercise) {
        state.sessions.filter(s => s.type === 'lifting').forEach(s => {
          (s.metrics as LiftingMetrics).exercises?.forEach(ex => {
            if (ex.name.toLowerCase() === goal.exercise!.toLowerCase() && ex.weight > current) current = ex.weight;
          });
        });
      } else if (goal.type === 'sessions_per_week') {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        current = state.sessions.filter(s => new Date(s.date) >= weekAgo).length;
      } else if (goal.type === 'run_distance') {
        state.sessions.filter(s => s.type === 'running').forEach(s => {
          const d = (s.metrics as { distance: number }).distance;
          if (d > current) current = d;
        });
      }
      const pct = Math.min((current / goal.target) * 100, 100);
      return { ...goal, current, pct: Math.round(pct) };
    });
  }, [state.goals, state.sessions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !target) return;
    const goal: Goal = {
      id: crypto.randomUUID(),
      title: title.trim(),
      type,
      target: Number(target),
      unit: GOAL_TYPES.find(g => g.value === type)?.unit || unit,
      exercise: type === 'weight' ? exercise : undefined,
      createdAt: new Date().toISOString(),
    };
    addGoal(goal);
    setTitle(''); setTarget(''); setExercise(''); setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Goals</h1>
          <p className="text-sm text-gray-500 mt-0.5">Set targets and track your progress</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
        >
          + New Goal
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs text-gray-400 mb-1">Goal Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Bench Press 200 lbs"
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Type</label>
              <select value={type} onChange={e => setType(e.target.value as GoalType)}
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-accent">
                {GOAL_TYPES.map(gt => <option key={gt.value} value={gt.value}>{gt.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Target</label>
              <input type="number" value={target} onChange={e => setTarget(e.target.value)}
                placeholder={GOAL_TYPES.find(g => g.value === type)?.placeholder}
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-accent" />
            </div>
            {type === 'weight' && (
              <div className="col-span-2">
                <label className="block text-xs text-gray-400 mb-1">Exercise Name</label>
                <input type="text" value={exercise} onChange={e => setExercise(e.target.value)} placeholder="e.g., Bench Press"
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-accent" />
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg cursor-pointer">Add Goal</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-500 text-sm cursor-pointer">Cancel</button>
          </div>
        </form>
      )}

      {activeGoals.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-gray-500">Active Goals</h2>
          {goalProgress.filter(g => !g.completedAt).map(goal => (
            <div key={goal.id} className="bg-white border border-gray-200 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-gray-500">{goal.current}/{goal.target} {goal.unit}</span>
                  {goal.pct >= 100 && (
                    <button onClick={() => completeGoal(goal.id)} className="text-xs text-green-600 font-medium hover:bg-green-50 px-2 py-1 rounded cursor-pointer">
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${goal.pct}%`, backgroundColor: goal.pct >= 100 ? '#16a34a' : goal.pct >= 50 ? '#2563eb' : '#d97706' }} />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-400">{goal.pct}% complete</span>
                <button onClick={() => deleteGoal(goal.id)} className="text-xs text-red-400 hover:text-red-600 cursor-pointer">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {completedGoals.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-gray-500">Completed</h2>
          {completedGoals.map(goal => (
            <div key={goal.id} className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">✅</span>
                <span className="text-sm font-medium text-green-800">{goal.title}</span>
              </div>
              <button onClick={() => deleteGoal(goal.id)} className="text-xs text-gray-400 hover:text-red-500 cursor-pointer">Remove</button>
            </div>
          ))}
        </div>
      )}

      {state.goals.length === 0 && !showForm && (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
          <div className="text-4xl mb-3">🎯</div>
          <p className="text-gray-400">No goals yet. Set your first target!</p>
        </div>
      )}
    </div>
  );
}
