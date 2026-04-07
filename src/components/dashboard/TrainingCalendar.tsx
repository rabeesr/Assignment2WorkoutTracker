'use client';

import { Session } from '@/lib/types';
import { useMemo } from 'react';

interface Props {
  sessions: Session[];
}

export default function TrainingCalendar({ sessions }: Props) {
  const { weeks, maxCount } = useMemo(() => {
    // Build 16 weeks of data
    const today = new Date();
    const dayMap: Record<string, number> = {};

    sessions.forEach(s => {
      const key = new Date(s.date).toISOString().split('T')[0];
      dayMap[key] = (dayMap[key] || 0) + 1;
    });

    const weeksArr: { date: Date; count: number; key: string }[][] = [];
    let max = 1;

    // Start from 15 weeks ago, on a Sunday
    const start = new Date(today);
    start.setDate(start.getDate() - (15 * 7) - start.getDay());

    for (let w = 0; w < 16; w++) {
      const week: { date: Date; count: number; key: string }[] = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(start);
        date.setDate(start.getDate() + w * 7 + d);
        const key = date.toISOString().split('T')[0];
        const count = dayMap[key] || 0;
        if (count > max) max = count;
        week.push({ date, count, key });
      }
      weeksArr.push(week);
    }

    return { weeks: weeksArr, maxCount: max };
  }, [sessions]);

  const getColor = (count: number) => {
    if (count === 0) return '#f3f4f6';
    const ratio = count / maxCount;
    if (ratio <= 0.33) return '#bbf7d0';
    if (ratio <= 0.66) return '#4ade80';
    return '#16a34a';
  };

  const months = useMemo(() => {
    const labels: { label: string; col: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, i) => {
      const month = week[0].date.getMonth();
      if (month !== lastMonth) {
        labels.push({ label: week[0].date.toLocaleDateString('en-US', { month: 'short' }), col: i });
        lastMonth = month;
      }
    });
    return labels;
  }, [weeks]);

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-1">Training Activity</h2>
      <p className="text-xs text-gray-400 mb-4">Last 16 weeks</p>

      <div className="overflow-x-auto">
        {/* Month labels */}
        <div className="flex gap-[3px] mb-1 ml-8">
          {months.map((m, i) => (
            <div
              key={i}
              className="text-[10px] text-gray-400"
              style={{ position: 'relative', left: `${m.col * 15}px` }}
            >
              {m.label}
            </div>
          ))}
        </div>

        <div className="flex gap-0.5">
          {/* Day labels */}
          <div className="flex flex-col gap-[3px] mr-1.5 pt-0.5">
            {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((d, i) => (
              <div key={i} className="h-[12px] text-[9px] text-gray-400 flex items-center">{d}</div>
            ))}
          </div>

          {/* Grid */}
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day) => (
                <div
                  key={day.key}
                  className="w-[12px] h-[12px] rounded-[2px] transition-colors"
                  style={{
                    backgroundColor: getColor(day.count),
                    outline: day.key === today ? '2px solid #2563eb' : 'none',
                    outlineOffset: '-1px',
                  }}
                  title={`${day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: ${day.count} session${day.count !== 1 ? 's' : ''}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-3 justify-end">
        <span className="text-[10px] text-gray-400">Less</span>
        {['#f3f4f6', '#bbf7d0', '#4ade80', '#16a34a'].map(c => (
          <div key={c} className="w-[10px] h-[10px] rounded-[2px]" style={{ backgroundColor: c }} />
        ))}
        <span className="text-[10px] text-gray-400">More</span>
      </div>
    </div>
  );
}
