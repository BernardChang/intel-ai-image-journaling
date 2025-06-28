// src/components/CaptureCamera.jsx
import { useState, useRef, useEffect, useCallback } from 'react';
import { usePhotoStore } from '../hooks/usePhotoStore';

export default function CaptureCamera() {
  const videoRef    = useRef(null);
  const canvasRef   = useRef(null);
  const [stream,   setStream]    = useState(null);
  const [facing,   setFacing]    = useState('user'); // 'user' (selfie) | 'environment' (rear)
  const [label,    setLabel]     = useState('');
  const { addPhoto } = usePhotoStore();

  // Initialize or re-init camera whenever facing changes
  useEffect(() => {
    async function start() {
      // stop old tracks
      if (stream) stream.getTracks().forEach(t => t.stop());

      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: facing } },
          audio: false
        });
        setStream(newStream);
        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
          await videoRef.current.play();
        }
      } catch (err) {
        console.error('Camera init error:', err);
      }
    }
    start();
    // cleanup on unmount
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, [facing]);

  // Snap a photo but keep the stream running
  const snap = useCallback(() => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    // Draw the current frame
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);

    // Convert to JPEG
    const dataURL = canvas.toDataURL('image/jpeg', 0.9);
    // Save to your store
    addPhoto({
      dataURL,
      takenAt: Date.now(),
      label: label.trim()
    });
    setLabel('');
  }, [addPhoto, label]);

  return (
    <div className="space-y-2">
      {/* Controls: switch camera, label input, snap */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFacing(f => f === 'user' ? 'environment' : 'user')}
          className="rounded border px-3 py-1 text-sm"
        >
          {facing === 'user' ? 'Use Rear Camera' : 'Use Front Camera'}
        </button>

        <input
          type="text"
          placeholder="Add a label…"
          value={label}
          onChange={e => setLabel(e.target.value)}
          className="flex-1 rounded-full border px-4 py-2 text-sm"
        />

        <button
          onClick={snap}
          className="rounded bg-[color:var(--c-primary)] px-4 py-2 text-white"
        >
          Snap
        </button>
      </div>

      {/* Live preview */}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          muted
          playsInline
        />
      </div>

      {/* Hidden canvas for captures */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
