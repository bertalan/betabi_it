import React, { createContext, useContext, useState, useCallback } from 'react';
import { it } from './it';
import { en } from './en';

export type Language = 'it' | 'en';
export type Translations = typeof it;

const translations: Record<Language, Translations> = { it, en };

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/** Detect language from browser, returning 'it' or 'en'. */
function detectBrowserLang(): Language {
  const raw = navigator.language || (navigator as any).userLanguage || '';
  // Match 'it', 'it-IT', 'it-CH', etc.
  if (raw.startsWith('it')) return 'it';
  if (raw.startsWith('en')) return 'en';
  // For any other language, default to English (international)
  return 'en';
}

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem('betabi_lang') as Language)
      || (import.meta.env.VITE_DEFAULT_LANG as Language)
      || detectBrowserLang();
  });

  // Sync html lang attribute on initial mount
  React.useEffect(() => {
    document.documentElement.lang = lang;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    document.documentElement.lang = newLang;
    localStorage.setItem('betabi_lang', newLang);
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
