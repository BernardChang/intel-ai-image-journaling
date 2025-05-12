import { useState } from 'react';
import {
  format,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
} from 'date-fns';
import { useCalendar } from '../hooks/useCalendar';
import DayModal from './DayModal';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarView() {
  const [cursor, setCursor] = useState(new Date());
  const { weeks, monthLabel } = useCalendar(
    cursor.getFullYear(),
    cursor.getMonth()
  );
  const [selected, setSelected] = useState(null);

  return (
    <div className="space-y-4">
      {/* header */}
      <div className="flex items-center justify-between">
        <IconBtn onClick={() => setCursor(subMonths(cursor, 1))}>
          <ChevronLeft size={18} />
        </IconBtn>
        <h2 className="text-xl font-semibold">{monthLabel}</h2>
        <IconBtn onClick={() => setCursor(addMonths(cursor, 1))}>
          <ChevronRight size={18} />
        </IconBtn>
      </div>

      {/* weekdays */}
      <div className="grid grid-cols-7 text-center text-xs font-medium text-black dark:text-slate-200">
        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      {/* date grid */}
      <div className="grid grid-cols-7 gap-[1px] rounded bg-slate-200">
        {weeks.flat().map(day => {
          const inMonth = isSameMonth(day.date, cursor);
          const numberStyle = inMonth
            ? 'text-[color:var(--c-primary)]'
            : 'text-slate-400';
          const ring = isToday(day.date)
            ? 'ring-2 ring-[color:var(--c-primary)]'
            : '';

          return (
            <button
              key={day.date}
              onClick={() => setSelected(day)}
              className={`relative flex h-32 flex-col overflow-hidden p-1 focus:outline-none ${ring} ${
                inMonth
                  ? 'calendar-cell'
                  : 'bg-[color:color-mix(in_srgb,var(--c-bg-app)_40%,white)] dark:bg-[color:color-mix(in_srgb,var(--c-bg-app)_55%,#000)]'
              }`}
            >
              {/* day number */}
              <span className={`text-sm font-semibold ${numberStyle}`}>
                {format(day.date, 'd')}
              </span>

              {/* small thumbs */}
              <div className="mt-3 flex flex-wrap gap-[1px]">
                {day.photos.slice(0, 3).map(pic => (
                  <img
                    key={pic.id}
                    src={pic.dataURL}
                    alt=""
                    className="h-8 w-8 rounded object-cover"
                  />
                ))}
                {day.photos.length > 3 && (
                  <span className="ml-[1px] text-[10px] font-medium text-slate-600">
                    +{day.photos.length - 3}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* modal */}
      <DayModal
        open={!!selected}
        date={selected?.date}
        dayPhotos={selected?.photos ?? []}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}

function IconBtn({ children, ...props }) {
  return (
    <button {...props} className="rounded-full p-2 hover:bg-slate-100 focus:outline-none">
      {children}
    </button>
  );
}
