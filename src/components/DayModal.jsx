import { createPortal } from 'react-dom';
import { isSameDay, format } from 'date-fns';
import PhotoList from './PhotoList';

export default function DayModal({ open, date, onClose }) {
  if (!open) return null;

  /* filter fn for just this day's photos */
  const filter = p => isSameDay(new Date(p.takenAt), date);

  return createPortal(
    <div className="fixed inset-0 z-20 grid place-items-center bg-black/40 backdrop-blur-sm">
      <div className="max-h-[80vh] w-full max-w-md overflow-auto rounded-xl bg-white p-4 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold">
          {format(date, 'EEEE, MMM d')}
        </h2>

        <PhotoList filter={filter} />

        <button
          onClick={onClose}
          className="mt-4 rounded bg-primary px-4 py-1 text-white"
        >
          Close
        </button>
      </div>
    </div>,
    document.body
  );
}
