import { useState, useEffect } from 'react';
import { setCssVar } from '../utils/color';
import TrashView from './TrashView'; // if you still have a Trash modal

export default function SettingsPanel({ onClose }) {
  // load saved values or defaults
  const [primary, setPrimary] = useState(
    localStorage.getItem('primary') || '#6366f1'
  );
  const [accent, setAccent] = useState(
    localStorage.getItem('accent') || '#fce7f3'
  );
  const [bg, setBg] = useState(
    localStorage.getItem('bg') || '#ffffff'
  );
  const [showTrash, setShowTrash] = useState(false);

  // whenever primary changes, update CSS var & storage
  useEffect(() => {
    setCssVar('--c-primary', primary);
    localStorage.setItem('primary', primary);
  }, [primary]);

  // pastel accent
  useEffect(() => {
    setCssVar('--c-accent-bg', accent);
    localStorage.setItem('accent', accent);
  }, [accent]);

  // page background
  useEffect(() => {
    setCssVar('--c-bg-app', bg);
    localStorage.setItem('bg', bg);
  }, [bg]);

  return (
    <>
      {/* semi-transparent backdrop */}
      <div className="fixed inset-0 z-30 grid place-items-center bg-black/40 backdrop-blur-sm">
        <div className="w-full max-w-sm space-y-4 rounded-xl bg-white p-6 shadow-lg">
          <h2 className="text-lg font-semibold">Customize Theme</h2>

          {/* Primary Accent */}
          <ColorPicker
            label="Primary accent"
            value={primary}
            onChange={setPrimary}
          />

          {/* Pastel Accent */}
          <ColorPicker
            label="Pastel accent"
            value={accent}
            onChange={setAccent}
          />

          {/* Page Background */}
          <ColorPicker
            label="Page background"
            value={bg}
            onChange={setBg}
          />

          {/* Optional trash button */}
          <button
            onClick={() => setShowTrash(true)}
            className="w-full rounded border px-3 py-2 text-sm"
          >
            Recently Deleted
          </button>

          {/* Done */}
          <button
            onClick={onClose}
            className="w-full rounded bg-[color:var(--c-primary)] py-2 text-white"
          >
            Done
          </button>
        </div>
      </div>

      {/* Trash modal, if you have that */}
      {showTrash && <TrashView onClose={() => setShowTrash(false)} />}
    </>
  );
}

/* Helper for one color row */
function ColorPicker({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="text-sm text-slate-600">{label}</span>
      <input
        type="color"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="mt-1 h-10 w-full rounded border-none p-0"
      />
    </label>
  );
}
