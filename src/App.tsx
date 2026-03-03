import { LanguageProvider } from '@/i18n';
import { SiteConfigProvider, useSiteConfig } from '@/contexts/SiteConfigContext';
import { Suspense, lazy, useState, useEffect, useRef, useCallback } from 'react';
import LegalPage, { type LegalPageType } from '@/components/LegalPage';

const AgencyTemplate = lazy(() => import('@/templates/agency/AgencyTemplate'));
const MicroIspTemplate = lazy(() => import('@/templates/micro-isp/MicroIspTemplate'));
const ComicTemplate = lazy(() => import('@/templates/comic/ComicTemplate'));

function TemplateRouter() {
  const { template } = useSiteConfig();
  return (
    <Suspense fallback={<div className="h-screen w-screen bg-black flex items-center justify-center" role="status" aria-label="Loading"><span className="sr-only">Loading...</span></div>}>
      {template === 'agency' ? <AgencyTemplate /> : template === 'comic' ? <ComicTemplate /> : <MicroIspTemplate />}
    </Suspense>
  );
}

function ConfigPanel() {
  const { template, setTemplate, mobileLayout, setMobileLayout, colorTheme, setColorTheme, highContrast, setHighContrast } = useSiteConfig();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen]);

  return (
    <div ref={panelRef} className="fixed bottom-12 right-4 z-[200]">
      <button onClick={() => setIsOpen(!isOpen)} className={`w-12 h-12 rounded-full backdrop-blur-md border flex items-center justify-center transition-colors shadow-lg ${isOpen ? 'bg-white/25 border-white/40 text-white' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`} aria-label="Site config" aria-expanded={isOpen}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
      </button>
      {isOpen && (
        <div role="dialog" aria-label="Site configuration" className="absolute bottom-16 right-0 w-72 bg-[#111]/95 backdrop-blur-xl border border-white/10 rounded-xl p-5 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200 origin-bottom-right">
          <h3 className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-4">Config Panel</h3>

          {/* Template */}
          <div className="mb-5">
            <label className="font-mono text-[0.625rem] uppercase tracking-widest text-gray-500 mb-2 block">Template</label>
            <div className="grid grid-cols-3 gap-2">
              {(['agency', 'micro-isp', 'comic'] as const).map((t) => (
                <button key={t} onClick={() => setTemplate(t)}
                  className={`px-3 py-2 font-mono text-xs uppercase tracking-wider rounded-lg border transition-all ${template === t ? 'bg-white/10 border-white/30 text-white' : 'border-white/5 text-gray-500 hover:text-gray-300 hover:border-white/15'}`}>{t}</button>
              ))}
            </div>
          </div>

          {/* Color Theme */}
          <div className="mb-5">
            <label className="font-mono text-[0.625rem] uppercase tracking-widest text-gray-500 mb-2 block">Color</label>
            <div className="flex gap-2">
              {([
                { key: 'neon', color: '#ccff00' },
                { key: 'blue', color: '#4CA2FF' },
                { key: 'red', color: '#FF3300' },
              ] as const).map(({ key, color }) => (
                <button key={key} onClick={() => setColorTheme(key)}
                  className={`w-10 h-10 rounded-lg border-2 transition-all ${colorTheme === key ? 'border-white scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  style={{ backgroundColor: color }} aria-label={`Theme ${key}`} />
              ))}
            </div>
          </div>

          {/* High Contrast (a11y) */}
          <div className="mb-5">
            <label className="font-mono text-[0.625rem] uppercase tracking-widest text-gray-500 mb-2 block">Accessibility</label>
            <button onClick={() => setHighContrast(!highContrast)}
              className={`w-full flex items-center justify-between px-3 py-2.5 font-mono text-xs uppercase tracking-wider rounded-lg border transition-all ${highContrast ? 'bg-white/15 border-white/30 text-white' : 'border-white/5 text-gray-500 hover:text-gray-300 hover:border-white/15'}`}
              aria-pressed={highContrast}
            >
              <span className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20z"/></svg>
                High Contrast
              </span>
              <span className={`w-8 h-4 rounded-full relative transition-colors ${highContrast ? 'bg-accent' : 'bg-white/20'}`}>
                <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${highContrast ? 'left-4.5' : 'left-0.5'}`} />
              </span>
            </button>
          </div>

          {/* Mobile Layout */}
          <div>
            <label className="font-mono text-[0.625rem] uppercase tracking-widest text-gray-500 mb-2 block">Mobile Layout</label>
            <div className="grid grid-cols-3 gap-2">
              {(['standard', 'compact', 'cards'] as const).map((l) => (
                <button key={l} onClick={() => setMobileLayout(l)}
                  className={`px-2 py-2 font-mono text-[0.625rem] uppercase tracking-wider rounded-lg border transition-all ${mobileLayout === l ? 'bg-white/10 border-white/30 text-white' : 'border-white/5 text-gray-500 hover:text-gray-300 hover:border-white/15'}`}>{l}</button>
              ))}
            </div>
          </div>

          {/* Apply & Reload */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2.5 font-mono text-xs uppercase tracking-widest rounded-lg bg-accent text-bg font-bold hover:opacity-90 transition-opacity"
            >
              Apply &amp; Reload
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [legalPage, setLegalPage] = useState<LegalPageType>(null);

  // Listen for custom events from any template's footer
  useEffect(() => {
    const handler = (e: Event) => {
      const page = (e as CustomEvent<LegalPageType>).detail;
      setLegalPage(page);
    };
    window.addEventListener('open-legal', handler);

    // Check initial URL for direct legal page access
    const path = window.location.pathname;
    if (path === '/privacy-policy') setLegalPage('privacy');
    else if (path === '/cookie-policy') setLegalPage('cookie');

    return () => window.removeEventListener('open-legal', handler);
  }, []);

  const handleCloseLegal = useCallback(() => {
    setLegalPage(null);
    // Reset URL to root if on a legal path
    if (window.location.pathname.includes('-policy')) {
      window.history.pushState({}, '', '/');
    }
  }, []);

  return (
    <LanguageProvider>
      <SiteConfigProvider>
        <TemplateRouter />
        <ConfigPanel />
        <LegalPage page={legalPage} onClose={handleCloseLegal} />
      </SiteConfigProvider>
    </LanguageProvider>
  );
}
