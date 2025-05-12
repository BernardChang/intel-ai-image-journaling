import { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { usePhotoStore } from '../hooks/usePhotoStore';

export default function DownloadView() {
  const { photos } = usePhotoStore();
  const [selected, setSelected] = useState(new Set());

  function toggle(id) {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  }

  async function download() {
    if (!selected.size) return;

    const zip = new JSZip();
    photos
      .filter(p => selected.has(p.id))
      .forEach((p, idx) => {
        const base64 = p.dataURL.split(',')[1];
        zip.file(`photo-${idx + 1}.jpg`, base64, { base64: true });
      });

    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, 'photos.zip');
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Select photos to download</h2>

      {/* grid */}
      <ul className="grid grid-cols-3 gap-4">
        {photos.map(p => {
          const checked = selected.has(p.id);
          return (
            <li
              key={p.id}
              className="relative cursor-pointer overflow-hidden rounded-xl shadow"
              onClick={() => toggle(p.id)}
            >
              <img
                src={p.dataURL}
                alt={p.label}
                className={`aspect-square w-full object-cover transition-opacity ${
                  checked ? 'opacity-40' : ''
                }`}
              />
              {/* tick overlay */}
              {checked && (
                <span className="absolute inset-0 grid place-items-center text-4xl text-primary">
                  ✓
                </span>
              )}
            </li>
          );
        })}
      </ul>

      <button
        onClick={download}
        disabled={!selected.size}
        className={`rounded px-4 py-2 text-white ${
          selected.size ? 'bg-primary hover:bg-primary/80' : 'bg-slate-400'
        }`}
      >
        Download {selected.size ? `(${selected.size})` : ''}
      </button>
    </div>
  );
}
