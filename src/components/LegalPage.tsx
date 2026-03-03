import { useEffect, useRef } from 'react';
import { useLanguage } from '@/i18n';

export type LegalPageType = 'privacy' | 'cookie' | null;

interface LegalPageProps {
  page: LegalPageType;
  onClose: () => void;
}

export default function LegalPage({ page, onClose }: LegalPageProps) {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync URL + scroll to top on open
  useEffect(() => {
    if (page) {
      window.history.pushState({ legal: page }, '', `/${page}-policy`);
      containerRef.current?.scrollTo(0, 0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [page]);

  // Handle popstate (back button)
  useEffect(() => {
    const handlePop = () => {
      if (page) onClose();
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, [page, onClose]);

  // Escape key closes page
  useEffect(() => {
    if (!page) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [page]);

  if (!page) return null;

  const content = page === 'privacy' ? t.legal.privacy : t.legal.cookie;

  const handleClose = () => {
    // Go back in history if we pushed a state, otherwise just close
    if (window.history.state?.legal) {
      window.history.back();
    }
    onClose();
  };

  // Render markdown-like bold syntax (**text**)
  const renderContent = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
      }
      // Handle newlines
      const lines = part.split('\n');
      return lines.map((line, j) => (
        <span key={`${i}-${j}`}>
          {j > 0 && <br />}
          {line}
        </span>
      ));
    });
  };

  return (
    <div
      className="fixed inset-0 z-[300] bg-white dark:bg-[#0a0a0a] overflow-y-auto"
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={content.title}
    >
      {/* Sticky header */}
      <header className="sticky top-0 z-10 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md border-b border-black/10 dark:border-white/10">
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <button
            onClick={handleClose}
            className="inline-flex items-center gap-2 text-sm font-medium text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors"
            aria-label={t.legal.backToSite}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            {t.legal.backToSite}
          </button>
          <span className="text-xs text-black/40 dark:text-white/40 font-mono uppercase tracking-wider">
            {t.legal.lastUpdated}: 03/2026
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <h1 className="text-3xl md:text-5xl font-bold text-black dark:text-white mb-6 tracking-tight">
          {content.title}
        </h1>
        <p className="text-base md:text-lg text-black/70 dark:text-white/70 leading-relaxed mb-12 border-l-4 border-black/20 dark:border-white/20 pl-4">
          {content.intro}
        </p>

        <div className="space-y-10">
          {content.sections.map((section, i) => (
            <section key={i} className="group">
              <h2 className="text-xl md:text-2xl font-bold text-black dark:text-white mb-4 tracking-tight">
                {section.title}
              </h2>
              <div className="text-sm md:text-base text-black/70 dark:text-white/70 leading-relaxed">
                {renderContent(section.content)}
              </div>
            </section>
          ))}
        </div>

        {/* Bottom CTA back */}
        <div className="mt-16 pt-8 border-t border-black/10 dark:border-white/10 text-center">
          <button
            onClick={handleClose}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-80 transition-opacity"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            {t.legal.backToSite}
          </button>
        </div>
      </main>
    </div>
  );
}
