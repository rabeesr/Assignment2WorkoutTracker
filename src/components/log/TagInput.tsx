'use client';

import { useState } from 'react';

interface Props {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export default function TagInput({ tags, onChange }: Props) {
  const [input, setInput] = useState('');

  const addTag = () => {
    const tag = input.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      onChange([...tags, tag]);
    }
    setInput('');
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter(t => t !== tag));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-muted mb-2">Tags</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map(tag => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-accent/15 text-accent text-xs font-medium rounded-full"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-red ml-0.5 cursor-pointer"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
          placeholder="Add tag..."
          className="flex-1 bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent"
        />
        <button
          type="button"
          onClick={addTag}
          className="px-3 py-2 bg-card border border-border rounded-lg text-sm text-muted hover:text-foreground hover:border-accent transition-colors cursor-pointer"
        >
          Add
        </button>
      </div>
    </div>
  );
}
