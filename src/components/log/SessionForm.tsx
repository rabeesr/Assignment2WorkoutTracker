'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ActivityType, ActivityMetrics, LiftingMetrics, BoxingMetrics, RunningMetrics, WorkoutTemplate, Session } from '@/lib/types';
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
  lifting: { exercise: '', sets: 3, reps: 10, weight: 135 },
  boxing: { rounds: 5 },
  running: { distance: 5 },
  basketball: {},
};

export default function SessionForm() {
  const router = useRouter();
  const { addSession, addTemplate, state } = useFitness();

  const [activityType, setActivityType] = useState<ActivityType | null>(null);
  const [duration, setDuration] = useState(30);
  const [intensity, setIntensity] = useState(5);
  const [metrics, setMetrics] = useState<ActivityMetrics>({});
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');

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

    const session: Session = {
      id: crypto.randomUUID(),
      type: activityType,
      date: new Date().toISOString(),
      duration,
      intensity,
      metrics,
      notes,
      tags,
      caloriesBurned: estimateCalories(activityType, intensity, duration, state.bodyWeightKg),
      muscleLoad: computeMuscleLoad(activityType, intensity, duration),
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

      <div className="border-t border-border pt-6">
        <h3 className="text-sm font-medium text-muted mb-3">Activity Type</h3>
        <ActivitySelector value={activityType} onChange={handleActivityChange} />
      </div>

      {activityType && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Duration (minutes)</label>
              <input
                type="number"
                min={1}
                value={duration}
                onChange={e => setDuration(Number(e.target.value))}
                data-testid="duration-input"
                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
              />
            </div>
            <IntensitySlider value={intensity} onChange={setIntensity} />
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-medium text-muted mb-3">
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

          <TagInput tags={tags} onChange={setTags} />

          <div>
            <label className="block text-sm font-medium text-muted mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="How did the session feel?"
              rows={3}
              data-testid="notes-input"
              className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent resize-none"
            />
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={saveAsTemplate}
                onChange={e => setSaveAsTemplate(e.target.checked)}
                className="accent-accent"
              />
              <span className="text-sm text-foreground">Save as workout template</span>
            </label>
            {saveAsTemplate && (
              <input
                type="text"
                value={templateName}
                onChange={e => setTemplateName(e.target.value)}
                placeholder="Template name (e.g., Push Day)"
                className="mt-3 w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent"
              />
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-muted">
              Est. calories: <span className="text-foreground font-medium">
                {estimateCalories(activityType, intensity, duration, state.bodyWeightKg)} kcal
              </span>
            </p>
            <button
              type="submit"
              data-testid="submit-session"
              className="px-6 py-2.5 bg-accent hover:bg-accent-hover text-white font-medium rounded-lg transition-colors cursor-pointer"
            >
              Log Session
            </button>
          </div>
        </>
      )}
    </form>
  );
}
