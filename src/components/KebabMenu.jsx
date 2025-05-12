import { useRef, useEffect } from 'react';
import { usePhotoStore } from '../hooks/usePhotoStore';
import KebabMenu from './KebabMenu';

export default function PhotoList({ filter }) {
  const store   = usePhotoStore();
  const photos  = filter ? store.photos.filter(filter) : store.photos;

  /* swipe-to-delete refs -------------------------------------------------- */
  const drag = useRef({ id: null, startX: 0, offset: 0 });

  useEffect(() => {
    function move(e) {
      if (!drag.current.id) return;
      const x = e.clientX || (e.touches && e.touches[0].clientX);
      const offset = x - drag.current.startX;
      drag.current.offset = offset;
      const el = document.getElementById(`p-${drag.current.id}`);
      if (el) el.style.transform = `translateX(${offset}px) rotate(${offset / 20}deg)`;
    }
    function up() {
      const { id, offset } = drag.current;
      if (!id) return;
      const el = document.getElementById(`p-${id}`);
      if (el) {
        if (offset < -120) {
          el.style.transition = 'transform 0.3s';
          el.style.transform  = 'translateX(-400px) rotate(-20deg)';
          store.deletePhoto(id); // hard-delete (or trashPhoto if you prefer)
        } else {
          el.style.transition = 'transform 0.2s';
          el.style.transform  = 'translateX(0)';
        }
      }
      drag.current = { id: null, startX: 0, offset: 0 };
    }

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup',   up);
    window.addEventListener('touchmove',   move);
    window.addEventListener('touchend',    up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup',   up);
      window.removeEventListener('touchmove',   move);
      window.removeEventListener('touchend',    up);
    };
  }, [store]);

  /* ---------------------------------------------------------------------- */
  if (!photos.length)
    return <p className="mt-4 text-sm text-slate-500">No photos.</p>;

  return (
    <ul className="grid grid-cols-3 gap-4 mt-4">
      {photos.slice().reverse().map(p => (
        <li
          key={p.id}
          id={`p-${p.id}`}
          onPointerDown={e => {
            drag.current = {
              id: p.id,
              startX: e.clientX || (e.touches && e.touches[0].clientX),
              offset: 0,
            };
          }}
          onTouchStart={e => {
            drag.current = { id: p.id, startX: e.touches[0].clientX, offset: 0 };
          }}
          className="relative overflow-hidden rounded-xl shadow-md hover-zoom"
        >
          <img
            src={p.dataURL}
            alt={typeof p.label === 'string' ? p.label : p.label?.label ?? ''}
            className="aspect-square w-full object-cover pointer-events-none"
          />

          {/* kebab menu */}
          <KebabMenu
            id={p.id}
            onEdit={newLabel => store.updatePhoto(p.id, { label: newLabel })}
            onDelete={() => store.deletePhoto(p.id)}
          />

          {/* label pill (unwrap legacy object shape if present) */}
          <span className="absolute bottom-1 left-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] text-white">
            {typeof p.label === 'string'
              ? p.label
              : typeof p.label?.label === 'string'
              ? p.label.label
              : '—'}
          </span>
        </li>
      ))}
    </ul>
  );
}
