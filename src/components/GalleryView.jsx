import { useState } from 'react';
import { startOfDay, startOfWeek, startOfMonth, isAfter } from 'date-fns';
import CaptureCamera from './CaptureCamera';
import PhotoList from './PhotoList';

const filters = {
  all:  { label: 'All',   fn: () => true },
  today:{ label: 'Today', fn: p => isAfter(p.takenAt, startOfDay(new Date())) },
  week: { label: 'Week',  fn: p => isAfter(p.takenAt, startOfWeek(new Date(), { weekStartsOn:0 })) },
  month:{ label:'Month',  fn: p => isAfter(p.takenAt, startOfMonth(new Date())) },
  top:  { label:'Top',    fn: () => true }  // placeholder – will sort by AI later
};

export default function GalleryView() {
  const [key, setKey] = useState('all');
  const { fn } = filters[key];

  return (
    <div className="space-y-4">
      {/* camera always on top */}
      <CaptureCamera />

      {/* filter bar */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(filters).map(([k, { label }]) => (
          <button
            key={k}
            onClick={() => setKey(k)}
            className={`rounded-full px-3 py-1 text-sm ${
              key === k ? 'bg-primary text-white' : 'border border-slate-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* photo grid – PhotoList will live-filter */}
      <PhotoList filter={fn} />
    </div>
  );
}
