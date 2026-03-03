import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export type TemplateId = 'agency' | 'micro-isp' | 'comic';
export type MobileLayout = 'standard' | 'compact' | 'cards';
export type ColorTheme = 'neon' | 'blue' | 'red';

const TEMPLATES: TemplateId[] = ['agency', 'micro-isp', 'comic'];
const COLOR_THEMES: ColorTheme[] = ['neon', 'blue', 'red'];

/** Pick a random item from arr, different from `exclude` if possible. */
function pickRandom<T>(arr: T[], exclude?: T): T {
  const filtered = arr.filter((x) => x !== exclude);
  const pool = filtered.length > 0 ? filtered : arr;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * On each new browser session, pick a random template + color theme
 * different from the previous visit. The choice is persisted in
 * localStorage so it stays consistent within a session and we know
 * what to avoid next time.
 */
function rotateOnNewSession(): { template: TemplateId; color: ColorTheme } {
  const isNewSession = !sessionStorage.getItem('betabi_session_init');

  if (isNewSession) {
    sessionStorage.setItem('betabi_session_init', '1');

    const prevTemplate = localStorage.getItem('betabi_template') as TemplateId | null;
    const prevColor = localStorage.getItem('betabi_color') as ColorTheme | null;

    const nextTemplate = pickRandom(TEMPLATES, prevTemplate);
    const nextColor = pickRandom(COLOR_THEMES, prevColor);

    localStorage.setItem('betabi_template', nextTemplate);
    localStorage.setItem('betabi_color', nextColor);

    return { template: nextTemplate, color: nextColor };
  }

  // Existing session — keep current values
  return {
    template: (localStorage.getItem('betabi_template') as TemplateId) || 'micro-isp',
    color: (localStorage.getItem('betabi_color') as ColorTheme) || 'neon',
  };
}

interface SiteConfigContextType {
  template: TemplateId;
  setTemplate: (t: TemplateId) => void;
  mobileLayout: MobileLayout;
  setMobileLayout: (m: MobileLayout) => void;
  colorTheme: ColorTheme;
  setColorTheme: (c: ColorTheme) => void;
  highContrast: boolean;
  setHighContrast: (h: boolean) => void;
  isMobile: boolean;
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

// Compute rotation once at module level (before any render)
const _rotated = rotateOnNewSession();

export const SiteConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const [template, setTemplateState] = useState<TemplateId>(_rotated.template);
  const [mobileLayout, setMobileLayoutState] = useState<MobileLayout>(() => {
    return (localStorage.getItem('betabi_mobile') as MobileLayout)
      || (import.meta.env.VITE_DEFAULT_MOBILE_LAYOUT as MobileLayout)
      || 'standard';
  });
  const [colorTheme, setColorThemeState] = useState<ColorTheme>(_rotated.color);
  const [highContrast, setHighContrastState] = useState<boolean>(() => {
    return localStorage.getItem('betabi_hc') === 'true';
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Sync theme class to root
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-neon', 'theme-blue', 'theme-red');
    root.classList.add(`theme-${colorTheme}`);
  }, [colorTheme]);

  // Sync template class to root
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('tpl-agency', 'tpl-micro-isp', 'tpl-comic');
    root.classList.add(`tpl-${template}`);
  }, [template]);

  // Sync high contrast class to root
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('high-contrast', highContrast);
  }, [highContrast]);

  const setTemplate = useCallback((t: TemplateId) => {
    setTemplateState(t);
    localStorage.setItem('betabi_template', t);
  }, []);

  const setMobileLayout = useCallback((m: MobileLayout) => {
    setMobileLayoutState(m);
    localStorage.setItem('betabi_mobile', m);
  }, []);

  const setColorTheme = useCallback((c: ColorTheme) => {
    setColorThemeState(c);
    localStorage.setItem('betabi_color', c);
  }, []);

  const setHighContrast = useCallback((h: boolean) => {
    setHighContrastState(h);
    localStorage.setItem('betabi_hc', String(h));
  }, []);

  return (
    <SiteConfigContext.Provider value={{ template, setTemplate, mobileLayout, setMobileLayout, colorTheme, setColorTheme, highContrast, setHighContrast, isMobile }}>
      {children}
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfig = () => {
  const ctx = useContext(SiteConfigContext);
  if (!ctx) throw new Error('useSiteConfig must be used within SiteConfigProvider');
  return ctx;
};
