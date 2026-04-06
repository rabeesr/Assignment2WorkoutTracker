'use client';

import { WorkoutTemplate } from '@/lib/types';

interface Props {
  templates: WorkoutTemplate[];
  onSelect: (template: WorkoutTemplate) => void;
}

export default function TemplateSelector({ templates, onSelect }: Props) {
  if (templates.length === 0) return null;

  return (
    <div>
      <label className="block text-sm font-medium text-muted mb-2">Quick Start from Template</label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {templates.map(tpl => (
          <button
            key={tpl.id}
            type="button"
            onClick={() => onSelect(tpl)}
            className="p-3 bg-card border border-border rounded-lg text-left hover:border-accent hover:bg-card-hover transition-colors cursor-pointer"
          >
            <div className="text-sm font-medium text-foreground">{tpl.name}</div>
            <div className="text-xs text-muted mt-1">{tpl.type} · {tpl.defaultDuration}min</div>
          </button>
        ))}
      </div>
    </div>
  );
}
