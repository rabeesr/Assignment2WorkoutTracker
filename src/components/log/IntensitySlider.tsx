'use client';

interface Props {
  value: number;
  onChange: (v: number) => void;
}

export default function IntensitySlider({ value, onChange }: Props) {
  const color = value <= 3 ? 'text-green' : value <= 6 ? 'text-yellow' : 'text-red';

  return (
    <div>
      <label className="block text-sm font-medium text-muted mb-2">
        Intensity: <span className={`${color} font-bold`}>{value}/10</span>
      </label>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        data-testid="intensity-slider"
        className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-accent"
      />
      <div className="flex justify-between text-xs text-muted mt-1">
        <span>Easy</span>
        <span>Moderate</span>
        <span>Max Effort</span>
      </div>
    </div>
  );
}
