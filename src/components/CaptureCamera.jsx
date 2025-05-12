import { useEffect, useRef, useState } from 'react';
import { usePhotoStore } from '../hooks/usePhotoStore';

/* iOS-style toggle without labels */
function Toggle({ enabled, onChange }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative h-8 w-16 rounded-full transition-colors ${
        enabled ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
      }`}
    >
      <span
        className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${
          enabled ? 'translate-x-9' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export default function CaptureCamera() {
  const videoRef   = useRef(null);
  const streamRef  = useRef(null);
  const [label, setLabel] = useState('');
  const [camOn, setCamOn] = useState(false);
  const { addPhoto } = usePhotoStore();

  /* start / stop camera */
  useEffect(() => {
    async function startCam() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
      } catch (err) {
        console.error('Camera error:', err);
        setCamOn(false);
      }
    }
    if (camOn) startCam();
    else if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  }, [camOn]);

  async function snap() {
    if (!videoRef.current) return;
    const c = document.createElement('canvas');
    c.width = videoRef.current.videoWidth;
    c.height = videoRef.current.videoHeight;
    c.getContext('2d').drawImage(videoRef.current, 0, 0);
    await addPhoto({
      dataURL: c.toDataURL('image/jpeg', 0.9),
      label,
      takenAt: Date.now(),
    });
    setLabel('');
  }

  return (
    <div className="space-y-4">
      {/* toggle row */}
      <div className="flex items-center gap-3">
        <Toggle enabled={camOn} onChange={setCamOn} />
        <span className="text-sm font-medium">
          {camOn ? 'Camera On' : 'Camera Off'}
        </span>
      </div>

      {/* video only when cam is on */}
      {camOn && (
        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-full rounded-xl shadow"
        />
      )}

      {/* label + snap */}
      <div className="flex gap-2">
        <input
          value={label}
          onChange={e => setLabel(e.target.value)}
          placeholder="Add a label…"
          disabled={!camOn}
          className="flex-1 pill-input disabled:opacity-50"
        />
        <button
          onClick={snap}
          disabled={!camOn}
          className={`rounded px-4 py-2 text-white transition ${
            camOn ? 'bg-primary hover:bg-primary/80' : 'bg-slate-400'
          }`}
        >
          Snap
        </button>
      </div>
    </div>
  );
}
