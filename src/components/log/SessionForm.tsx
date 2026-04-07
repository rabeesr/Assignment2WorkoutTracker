'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ActivityType, ActivityMetrics, LiftingMetrics, BoxingMetrics, RunningMetrics, WorkoutTemplate, Session, Location, LOCATIONS } from '@/lib/types';
import { useFitness } from '@/context/FitnessContext';
import { computeMuscleLoad } from '@/lib/muscleMapping';
import { estimateCalories } from '@/lib/calories';
import ActivitySelector from './ActivitySelector';
import IntensitySlider from './IntensitySlider';
import TagInput from './TagInput';
import TemplateSelector from './TemplateSelector';
import LiftingFields from './LiftingFields';
import BoxingFields from './BoxingFields';
import RunningFields from './RunningFields';
import BasketballFields from './BasketballFields';

const DEFAULT_METRICS: Record<ActivityType, ActivityMetrics> = {
  lifting: { exercises: [{ name: '', sets: 3, reps: 10, weight: 135 }] },
  boxing: { rounds: 5 },
  running: { distance: 5 },
  basketball: {},
};

export default function SessionForm() {
  const router = useRouter();
  const { addSession, addTemplate, state, dispatch } = useFitness();

  const [activityType, setActivityType] = useState<ActivityType | null>(null);
  const [duration, setDuration] = useState(30);
  const [intensity, setIntensity] = useState(5);
  const [metrics, setMetrics] = useState<ActivityMetrics>({});
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');

  // New fields
  const [avgHeartRate, setAvgHeartRate] = useState<string>('');
  const [maxHeartRate, setMaxHeartRate] = useState<string>('');
  const [energyLevel, setEnergyLevel] = useState<number>(3);
  const [location, setLocation] = useState<Location>('gym');
  const [bodyWeight, setBodyWeight] = useState<string>(String(state.bodyWeightKg));

  const handleActivityChange = (type: ActivityType) => {
    setActivityType(type);
    setMetrics(DEFAULT_METRICS[type]);
  };

  const handleTemplateSelect = (tpl: WorkoutTemplate) => {
    setActivityType(tpl.type);
    setMetrics(tpl.defaultMetrics);
    setIntensity(tpl.defaultIntensity);
    setDuration(tpl.defaultDuration);
    setTags(tpl.defaultTags);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityType) return;

    const bw = Number(bodyWeight) || state.bodyWeightKg;
    if (bw !== state.bodyWeightKg) {
      dispatch({ type: 'SET_BODY_WEIGHT', payload: bw });
    }

    const session: Session = {
      id: crypto.randomUUID(),
      type: activityType,
      date: new Date().toISOString(),
      duration,
      intensity,
      metrics,
      notes,
      tags,
      caloriesBurned: estimateCalories(activityType, intensity, duration, bw),
      muscleLoad: computeMuscleLoad(activityType, intensity, duration),
      ...(avgHeartRate ? { avgHeartRate: Number(avgHeartRate) } : {}),
      ...(maxHeartRate ? { maxHeartRate: Number(maxHeartRate) } : {}),
      energyLevel,
      location,
    };

    addSession(session);

    if (saveAsTemplate && templateName.trim()) {
      addTemplate({
        id: crypto.randomUUID(),
        name: templateName.trim(),
        type: activityType,
        defaultMetrics: metrics,
        defaultIntensity: intensity,
        defaultDuration: duration,
        defaultTags: tags,
      });
    }

    router.push('/');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <TemplateSelector templates={state.templates} onSelect={handleTemplateSelect} />

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-sm font-medium text-gray-500 mb-3">Activity Type</h3>
        <ActivitySelector value={activityType} onChange={handleActivityChange} />
      </div>

      {activityType && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Duration (minutes)</label>
              <input
                type="number"
                min={1}
                value={duration}
                onChange={e => setDuration(Number(e.target.value))}
                data-testid="duration-input"
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-accent"
              />
            </div>
            <IntensitySlider value={intensity} onChange={setIntensity} />
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-3">
              {activityType.charAt(0).toUpperCase() + activityType.slice(1)} Details
            </h3>
            {activityType === 'lifting' && (
              <LiftingFields value={metrics as LiftingMetrics} onChange={setMetrics} />
            )}
            {activityType === 'boxing' && (
              <BoxingFields value={metrics as BoxingMetrics} onChange={setMetrics} />
            )}
            {activityType === 'running' && (
              <RunningFields value={metrics as RunningMetrics} onChange={setMetrics} />
            )}
            {activityType === 'basketball' && <BasketballFields />}
          </div>

          {/* Biometrics */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Biometrics & Conditions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[10px] text-gray-400 mb-0.5">Avg HR (bpm)</label>
                <input
                  type="number"
                  min={40}
                  max={220}
                  value={avgHeartRate}
                  onChange={e => setAvgHeartRate(e.target.value)}
                  placeholder="—"
                  className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 mb-0.5">Max HR (bpm)</label>
                <input
                  type="number"
                  min={40}
                  max={220}
                  value={maxHeartRate}
                  onChange={e => setMaxHeartRate(e.target.value)}
                  placeholder="—"
                  className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 mb-0.5">Body Weight (kg)</label>
                <input
                  type="number"
                  min={30}
                  max={300}
                  value={bodyWeight}
                  onChange={e => setBodyWeight(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 mb-0.5">Location</label>
                <select
                  value={location}
                  onChange={e => setLocation(e.target.value as Location)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-accent"
                >
                  {LOCATIONS.map(l => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-[10px] text-gray-400 mb-1.5">Pre-workout Energy</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setEnergyLevel(level)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      energyLevel === level
                        ? 'bg-accent text-white'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {level === 1 ? 'Exhausted' : level === 2 ? 'Low' : level === 3 ? 'Normal' : level === 4 ? 'Good' : 'Peak'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <TagInput tags={tags} onChange={setTags} />

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="How did the session feel?"
              rows={3}
              data-testid="notes-input"
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-accent resize-none"
            />
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={saveAsTemplate}
                onChange={e => setSaveAsTemplate(e.target.checked)}
                className="accent-accent"
              />
              <span className="text-sm text-gray-900">Save as workout template</span>
            </label>
            {saveAsTemplate && (
              <input
                type="text"
                value={templateName}
                onChange={e => setTemplateName(e.target.value)}
                placeholder="Template name (e.g., Push Day)"
                className="mt-3 w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-accent"
              />
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-gray-500">
              Est. calories: <span className="text-gray-900 font-medium">
                {estimateCalories(activityType, intensity, duration, Number(bodyWeight) || state.bodyWeightKg)} kcal
              </span>
            </p>
            <button
              type="submit"
              data-testid="submit-session"
              className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors cursor-pointer"
            >
              Log Session
            </button>
          </div>
        </>
      )}
    </form>
  );
}
