import { useState } from 'react';
import GalleryView   from './components/GalleryView';
import CalendarView  from './components/CalendarView';
import DownloadView  from './components/DownloadView';
import SettingsPanel from './components/SettingsPanel';
import { Settings2 }  from 'lucide-react';

export default function App() {
  const [tab, setTab] = useState('gallery');       // gallery | calendar | download
  const [showSettings, setShowSettings] = useState(false);

  const tabs = [
    { key: 'gallery',   label: 'Gallery'   },
    { key: 'calendar',  label: 'Calendar'  },
    { key: 'download',  label: 'Download'  },
  ];

  return (
    <div className="relative mx-auto max-w-xl p-4">
      {/* title bar */}
      <h1 className="mb-4 text-2xl font-bold">
        Intel AI Image Journaling
      </h1>

      {/* gear icon */}
      <button
        onClick={() => setShowSettings(true)}
        className="absolute right-4 top-4 rounded-full p-2 hover:bg-slate-100"
      >
        <Settings2 size={18} />
      </button>

      {/* tab buttons */}
      <div className="mb-4 flex gap-2">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`capitalize rounded px-3 py-1 text-sm ${
              tab === t.key
                ? 'bg-primary text-white'
                : 'border border-slate-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* routed view */}
      {tab === 'gallery'  && <GalleryView   />}
      {tab === 'calendar' && <CalendarView  />}
      {tab === 'download' && <DownloadView  />}

      {/* settings modal */}
      {showSettings && (
        <SettingsPanel onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}
