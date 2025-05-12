import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameDay, format } from 'date-fns';
import { usePhotoStore } from './usePhotoStore';

export function useCalendar(year, month) {
  const { photos } = usePhotoStore();
  const firstDay = startOfMonth(new Date(year, month));
  const lastDay  = endOfMonth(firstDay);

  // build a 6-week grid to cover edge cases
  const startDate = startOfWeek(firstDay, { weekStartsOn: 0 });
  const endDate   = endOfWeek(lastDay,  { weekStartsOn: 0 });

  const weeks = [];
  let day = startDate;

  while (day <= endDate) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      const dayPhotos = photos.filter(p =>
        isSameDay(new Date(p.takenAt), day)
      );
      week.push({
        date: day,
        photos: dayPhotos,
      });
      day = addDays(day, 1);
    }
    weeks.push(week);
  }

  const monthLabel = format(firstDay, 'MMMM yyyy');

  return { weeks, monthLabel };
}
