import { useState, useRef, useEffect } from 'react';
import { usePhotoStore } from '../hooks/usePhotoStore';

export default function PhotoList({ filter }) {
  const store = usePhotoStore();
  const photos = filter ? store.photos.filter(filter) : store.photos;

  // Swipe-to-delete state
  const drag = useRef({ id: null, startX: 0, offset: 0 });

  useEffect(() => {
    function onMove(e) {
      if (!drag.current.id) return;
      const x = e.clientX ?? (e.touches && e.touches[0].clientX);
      const offset = x - drag.current.startX;
      drag.current.offset = offset;
      const el = document.getElementById(`p-${drag.current.id}`);
      if (el) el.style.transform = `translateX(${offset}px) rotate(${offset / 20}deg)`;
    }
    function onUp() {
      const { id, offset } = drag.current;
      if (!id) return;
      const el = document.getElementById(`p-${id}`);
      if (el) {
        if (offset < -120) {
          el.style.transition = 'transform 0.3s';
          el.style.transform = 'translateX(-400px) rotate(-20deg)';
          store.deletePhoto(id);
        } else {
          el.style.transition = 'transform 0.2s';
          el.style.transform = 'translateX(0)';
        }
      }
      drag.current = { id: null, startX: 0, offset: 0 };
    }

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [store]);

  // Modal state for enlarged view & editing
  const [selected, setSelected] = useState(null);
  const [draft, setDraft] = useState('');

  async function save() {
    await store.updatePhoto(selected.id, { label: draft.trim() });
    setSelected(null);
  }
  function remove() {
    store.deletePhoto(selected.id);
    setSelected(null);
  }

  if (!photos.length) {
    return (
      <p className="mt-4 text-sm text-slate-500">
        No photos.
      </p>
    );
  }

  return (
    <>
      <ul className="grid grid-cols-3 gap-4 mt-4">
        {photos.slice().reverse().map(p => {
          const label =
            typeof p.label === 'string'
              ? p.label
              : typeof p.label?.label === 'string'
              ? p.label.label
              : '';
          return (
            <li
              key={p.id}
              id={`p-${p.id}`}
              onPointerDown={e => {
                drag.current = {
                  id: p.id,
                  startX: e.clientX ?? (e.touches && e.touches[0].clientX),
                  offset: 0,
                };
              }}
              onTouchStart={e => {
                drag.current = { id: p.id, startX: e.touches[0].clientX, offset: 0 };
              }}
              onClick={() => {
                setSelected(p);
                setDraft(label);
              }}
              className="relative overflow-hidden rounded-xl shadow-md hover-zoom cursor-pointer"
            >
              <img
                src={p.dataURL}
                alt={label}
                className="aspect-square w-full object-cover pointer-events-none"
              />
              <span className="absolute bottom-1 left-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] text-white">
                {label || '—'}
              </span>
            </li>
          );
        })}
      </ul>

      {selected && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 shadow-lg max-w-3xl w-full grid grid-cols-[auto,1fr] gap-6">
            <img
              src={selected.dataURL}
              alt="Enlarged"
              className="max-h-[80vh] object-contain"
            />
            <div className="flex flex-col">
              <input
                type="text"
                value={draft}
                onChange={e => setDraft(e.target.value)}
                className="mb-4 w-full rounded border px-3 py-2"
                placeholder="Edit label..."
              />
              <div className="mt-auto flex gap-2">
                <button
                  onClick={save}
                  className="rounded bg-[color:var(--c-primary)] px-4 py-2 text-white"
                >
                  Save
                </button>
                <button
                  onClick={remove}
                  className="rounded bg-red-600 px-4 py-2 text-white"
                >
                  Delete
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="rounded border px-4 py-2"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
