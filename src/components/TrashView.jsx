import { useState } from 'react';
import { usePhotoStore } from '../hooks/usePhotoStore';

export default function TrashView({ onClose }) {
  const { trash, recoverPhoto, deleteForever } = usePhotoStore();
  const [selected, setSelected] = useState(new Set());

  const toggle = id =>
    setSelected(prev=>{
      const next=new Set(prev);
      next.has(id)?next.delete(id):next.add(id);
      return next;
    });

  const recover = () => {
    selected.forEach(id => recoverPhoto(id));
    setSelected(new Set());
  };
  const purge = () => {
    selected.forEach(id => deleteForever(id));
    setSelected(new Set());
  };

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-lg space-y-4 rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold">Recently Deleted (≤ 7 days)</h2>

        {/* toolbar */}
        {selected.size>0 && (
          <div className="flex gap-2">
            <button onClick={recover}
              className="rounded bg-primary px-3 py-1 text-sm text-white">
              Recover ({selected.size})
            </button>
            <button onClick={purge}
              className="rounded bg-red-600 px-3 py-1 text-sm text-white">
              Delete ({selected.size})
            </button>
            <button onClick={()=>setSelected(new Set())}
              className="rounded border px-3 py-1 text-sm">
              Cancel
            </button>
          </div>
        )}

        {/* grid */}
        {trash.length===0?
          <p className="text-sm text-slate-500">No recently deleted items.</p>:
          <ul className="grid grid-cols-3 gap-4">
            {trash.map(p=>(
              <li key={p.id}
                  className={`relative overflow-hidden rounded-xl shadow-md ${
                    selected.has(p.id)?'ring-2 ring-[color:var(--c-primary)]':''
                  }`}
                  onClick={()=>toggle(p.id)}>
                <img src={p.dataURL} alt=""
                     className="aspect-square w-full object-cover"/>
              </li>
            ))}
          </ul>
        }

        <button onClick={onClose}
          className="mt-2 w-full rounded border px-3 py-2">
          Close
        </button>
      </div>
    </div>
  );
}
