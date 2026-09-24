import { useState, lazy, Suspense } from 'react';
import { MoreVertical } from 'lucide-react';

const Version0 = lazy(() => import('./components/Version0'));
const Version1 = lazy(() => import('./components/Version1'));
const Version2 = lazy(() => import('./components/Version2'));
const Version3 = lazy(() => import('./components/Version3'));

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>
  );
}

function App() {
  const [currentVersion, setCurrentVersion] = useState<'0' | '1' | '2' | '3'>('1');
  const [showVersionDropdown, setShowVersionDropdown] = useState(false);

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: '#F7F7FA' }}>
      <div className="bg-white">
        <div className="mx-auto px-8 py-5 flex items-center gap-3 relative" style={{ maxWidth: '1440px' }}>
          <h1 className="font-bold text-gray-900" style={{ fontSize: '28px' }}>
            Питомцы
          </h1>
          <button
            className="p-1 rounded hover:bg-gray-100 transition-colors"
            onClick={() => setShowVersionDropdown(!showVersionDropdown)}
          >
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </button>
          {showVersionDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowVersionDropdown(false)}
              />
              <div
                className="absolute top-16 left-16 bg-white border border-gray-200 rounded-lg py-1 z-50 min-w-[160px]"
                style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              >
                {(['0', '1', '2', '3'] as const).map((version) => (
                  <button
                    key={version}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      setCurrentVersion(version);
                      setShowVersionDropdown(false);
                    }}
                  >
                    Версия {version} {currentVersion === version && '✓'}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mx-auto" style={{ maxWidth: '1440px' }}>
        <Suspense fallback={<LoadingSpinner />}>
          {currentVersion === '0' && <Version0 />}
          {currentVersion === '1' && <Version1 />}
          {currentVersion === '2' && <Version2 />}
          {currentVersion === '3' && <Version3 />}
        </Suspense>
      </div>
    </div>
  );
}

export default App;
