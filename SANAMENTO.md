# SANAMENTO.md — Piano di correzioni `betabi-site`

> Documento generato dall'audit del 1 marzo 2026.
> Stato attuale: **build OK**, **TypeScript OK**, **Docker OK** — ma non pronto per produzione.

---

## Stato audit

| Check | Risultato |
| --- | --- |
| `tsc --noEmit` | OK — zero errori |
| `npm run build` | OK — 1.77s, 441 KB (133 KB gzip) |
| Docker Compose dev | OK — container running, :3000 risponde 200 |
| Test frontend | **ASSENTI** — zero file `.test.tsx` |
| ESLint | **NON CONFIGURATO** |

### Bundle attuale

| Chunk | Size | Gzip | Nota |
| --- | --- | --- | --- |
| `index.js` (vendor) | 213 KB | 68 KB | React + motion unificati |
| `Effects.js` | 137 KB | 45 KB | **Troppo pesante** — motion non splittato |
| `MicroIspTemplate.js` | 23 KB | 5 KB | OK |
| `AgencyTemplate.js` | 20 KB | 5 KB | OK |
| `index.css` | 47 KB | 9 KB | OK |

---

## Fase 1 — Critici (bloccano deploy)

### 1.1 Self-host font (rimuovere Google Fonts CDN)

**Problema:** `index.html` righe 9-11 caricano font da `fonts.googleapis.com`. Viola GDPR (tracking Google), degrada performance (richieste esterne), crea dipendenza.

**Correzione:**

1. Scaricare i file woff2 dei font usati:
   - **Archivo Black** (400) — usato da `--font-display`
   - **Epilogue** (300, 400, 500, 600) — usato da `--font-sans`
   - **IBM Plex Mono** (300, 400, 600, 400i) — usato da `--font-mono`
   - **Newsreader** (400i, 500i) — usato da `--font-serif`
   - ~~Bricolage Grotesque~~ — **caricato ma mai usato**, non scaricare

2. Creare directory `public/fonts/` con struttura:
   ```
   public/fonts/
   ├── archivo-black-400.woff2
   ├── epilogue-300.woff2
   ├── epilogue-400.woff2
   ├── epilogue-500.woff2
   ├── epilogue-600.woff2
   ├── ibm-plex-mono-300.woff2
   ├── ibm-plex-mono-400.woff2
   ├── ibm-plex-mono-400i.woff2
   ├── ibm-plex-mono-600.woff2
   ├── newsreader-400i.woff2
   └── newsreader-500i.woff2
   ```

3. In `src/index.css`, aggiungere `@font-face` per ciascun file prima di `@import "tailwindcss"`:
   ```css
   @font-face {
     font-family: "Archivo Black";
     src: url("/fonts/archivo-black-400.woff2") format("woff2");
     font-weight: 400;
     font-style: normal;
     font-display: swap;
     unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
   }
   /* ... ripetere per ogni font/peso */
   ```

4. In `index.html`, **rimuovere** queste 3 righe:
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=..." rel="stylesheet">
   ```

5. In `index.html`, **aggiungere** preload per i font critici (above-the-fold):
   ```html
   <link rel="preload" href="/fonts/archivo-black-400.woff2" as="font" type="font/woff2" crossorigin>
   <link rel="preload" href="/fonts/epilogue-400.woff2" as="font" type="font/woff2" crossorigin>
   ```

**Strumenti:** [google-webfonts-helper](https://gwfh.mranftl.com/fonts) oppure `fontsource` npm packages.

**Verifica:** `npm run build` OK, nessuna richiesta a `fonts.googleapis.com` nel Network tab.

---

### 1.2 Favicon e Web App Manifest

**Problema:** `index.html` non ha nessun favicon, apple-touch-icon, manifest, né `<meta name="theme-color">`.

**Correzione:**

1. Generare il set favicon da [realfavicongenerator.net](https://realfavicongenerator.net) con logo Beta BI:
   ```
   public/
   ├── favicon.ico          (32x32, multi-size)
   ├── favicon.svg          (SVG scalabile)
   ├── apple-touch-icon.png (180x180)
   └── manifest.json
   ```

2. Creare `public/manifest.json`:
   ```json
   {
     "name": "Beta BI",
     "short_name": "BetaBI",
     "start_url": "/",
     "display": "standalone",
     "background_color": "#050505",
     "theme_color": "#050505",
     "icons": [
       { "src": "/favicon.svg", "type": "image/svg+xml", "sizes": "any" },
       { "src": "/apple-touch-icon.png", "type": "image/png", "sizes": "180x180" }
     ]
   }
   ```

3. In `index.html` `<head>`, aggiungere:
   ```html
   <link rel="icon" href="/favicon.ico" sizes="32x32">
   <link rel="icon" href="/favicon.svg" type="image/svg+xml">
   <link rel="apple-touch-icon" href="/apple-touch-icon.png">
   <link rel="manifest" href="/manifest.json">
   <meta name="theme-color" content="#050505">
   ```

**Verifica:** favicon visibile nel tab browser, Lighthouse SEO non segnala warning.

---

### 1.3 Sostituire dati placeholder

**Problema:** Entrambi i template contengono dati fittizi hardcoded.

**File coinvolti:**
- `src/templates/agency/AgencyTemplate.tsx` — footer: `hello@betabi.it`, `+39 012 345 6789`, `Milano, Italia`, `P.IVA 12345678901`
- `src/templates/micro-isp/MicroIspTemplate.tsx` — footer: `Via dell'Innovazione, 42`, `20126 Milano`, `P.IVA 12345678901`

**Correzione:**

1. Creare file `src/config/siteData.ts`:
   ```typescript
   export const siteData = {
     name: "Beta BI",
     email: "posta@betabi.it",
     phone: "+39 XXX XXX XXXX",       // <-- inserire numero reale
     address: "Indirizzo reale",       // <-- inserire indirizzo reale
     city: "Città",
     zip: "CAP",
     country: "Italia",
     vatNumber: "IT__________",        // <-- inserire P.IVA reale
     social: {
       linkedin: "https://linkedin.com/company/betabi",  // <-- URL reali
       github: "https://github.com/bertalan",
       twitter: "",
     },
     url: "https://betabi.it",
   } as const;
   ```

2. In entrambi i template, importare `siteData` e sostituire tutti i valori hardcoded:
   ```typescript
   import { siteData } from '@/config/siteData';
   // ...
   <a href={`mailto:${siteData.email}`}>{siteData.email}</a>
   ```

3. Nel footer, aggiornare anche i link social da `href="#"` ai valori reali.

**Verifica:** `grep -r "012 345\|12345678901\|Via dell'Innovazione\|hello@betabi" src/` non trova risultati.

---

### 1.4 Implementare form contatto

**Problema:**
- Agency: il bottone è `type="button"`, nessun handler `onSubmit`
- Micro-ISP: `setTimeout(1500ms)` simula l'invio senza endpoint reale

**Correzione (bridge temporaneo senza backend):**

1. Creare hook condiviso `src/hooks/useContactForm.ts`:
   ```typescript
   import { useState, useCallback } from 'react';

   interface ContactFormData {
     name: string;
     email: string;
     message: string;
     company?: string;
     _honeypot?: string;    // campo trappola
     _loadedAt?: number;    // timestamp caricamento
   }

   type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

   export function useContactForm() {
     const [status, setStatus] = useState<FormStatus>('idle');
     const [loadedAt] = useState(() => Date.now());

     const submit = useCallback(async (data: ContactFormData) => {
       // Honeypot check
       if (data._honeypot) {
         setStatus('success'); // finta risposta
         return;
       }
       // Timing check (< 3s = bot)
       if (Date.now() - loadedAt < 3000) {
         setStatus('success');
         return;
       }

       setStatus('submitting');
       try {
         const res = await fetch('/api/v2/contacts/submit/', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({
             name: data.name,
             email: data.email,
             message: data.message,
             company: data.company,
           }),
         });
         if (!res.ok) throw new Error(`HTTP ${res.status}`);
         setStatus('success');
       } catch {
         setStatus('error');
       }
     }, [loadedAt]);

     const reset = useCallback(() => setStatus('idle'), []);

     return { status, submit, reset };
   }
   ```

2. Nei form di entrambi i template:
   - Aggiungere campo honeypot nascosto (`<input name="website" className="hidden" tabIndex={-1}>`)
   - Collegare `onSubmit` al hook
   - Validazione client-side (email regex, campi obbligatori)
   - Feedback UI: spinner → success/error → reset

3. **Endpoint backend:** finché non c'è il backend Wagtail, due opzioni bridge:
   - A) [Formspree](https://formspree.io) — reindirizzare il POST a un form Formspree gratuito
   - B) Funzione Cloudflare Worker — intercetta il POST e invia email via MailChannels

**Verifica:** form compila → submit → risposta visibile. Network tab mostra la richiesta POST.

---

### 1.5 Generare favicon Beta BI

Se non esiste un logo vettoriale, creare un favicon SVG minimale:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="4" fill="#050505"/>
  <text x="16" y="22" text-anchor="middle" font-family="system-ui" font-weight="900" font-size="18" fill="#ccff00">β</text>
</svg>
```

Esportare a ico/png con tool online o `sharp`/`svgo`.

---

## Fase 2 — Qualità codice

### 2.1 Eliminare `any` — Tipizzare SpotlightCard e Portfolio

**File:** `src/components/Effects.tsx`

Sostituire la firma di SpotlightCard:
```typescript
// DA:
export const SpotlightCard = ({ children, className, bg, style, initial, whileInView, viewport, transition }: any) => {

// A:
interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  bg?: string;
  style?: React.CSSProperties;
  initial?: import('motion/react').MotionProps['initial'];
  whileInView?: import('motion/react').MotionProps['whileInView'];
  viewport?: import('motion/react').MotionProps['viewport'];
  transition?: import('motion/react').MotionProps['transition'];
}

export const SpotlightCard = ({ children, className, bg, style, initial, whileInView, viewport, transition }: SpotlightCardProps) => {
```

**File:** `src/templates/agency/AgencyTemplate.tsx`

```typescript
// DA:
const [selectedProject, setSelectedProject] = useState<any>(null);

// A:
interface PortfolioItem {
  title: string;
  category: string;
  year: string;
  image: string;
  description: string;
}
const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
```

---

### 2.2 Abilitare strict TypeScript

**File:** `tsconfig.json`

Cambiare:
```json
"noUnusedLocals": true,
"noUnusedParameters": true,
```

Poi eseguire `npm run lint` e fixare i warning risultanti (rimuovere import inutilizzati, prefissare parametri unused con `_`).

---

### 2.3 Setup ESLint

```bash
cd betabi-site
npm install -D eslint @eslint/js typescript-eslint eslint-plugin-react-hooks
```

Creare `eslint.config.js`:
```javascript
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  { ignores: ['dist/'] },
);
```

Aggiungere script in `package.json`:
```json
"lint:eslint": "eslint src/",
"lint:ts": "tsc --noEmit",
"lint": "npm run lint:ts && npm run lint:eslint"
```

---

### 2.4 Ottimizzare bundle — manualChunks

**File:** `vite.config.ts`

Aggiungere nella sezione `build`:
```typescript
build: {
  sourcemap: false,
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom'],
        motion: ['motion/react'],
      },
    },
  },
},
```

**Risultato atteso:** `Effects.js` scende da 137 KB a ~5 KB (la libreria motion va nel chunk `motion`).

---

### 2.5 Spostare deps in devDependencies

**File:** `package.json`

Spostare da `dependencies` a `devDependencies`:
- `vite`
- `@tailwindcss/vite`
- `@vitejs/plugin-react`

```bash
npm install -D vite @tailwindcss/vite @vitejs/plugin-react
# poi rimuoverli da dependencies se rimangono duplicati
```

---

### 2.6 Hook condiviso `useBodyLock`

**Problema:** Portfolio modal, ContactModal (Agency) e ServiceModal + ContactModal (Micro-ISP) manipolano `document.body.style.overflow` indipendentemente. Se due modal sono aperti, il cleanup di uno ripristina lo scroll anche per l'altro.

**Creare** `src/hooks/useBodyLock.ts`:
```typescript
import { useEffect } from 'react';

let lockCount = 0;

export function useBodyLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    lockCount++;
    document.body.style.overflow = 'hidden';
    return () => {
      lockCount--;
      if (lockCount === 0) {
        document.body.style.overflow = '';
      }
    };
  }, [locked]);
}
```

Sostituire tutti i `useEffect` che manipolano `body.style.overflow` nei template con `useBodyLock(isOpen)`.

---

## Fase 3 — Testing

### 3.1 Setup Vitest + React Testing Library

```bash
cd betabi-site
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

Creare `vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
});
```

Creare `src/test/setup.ts`:
```typescript
import '@testing-library/jest-dom';
```

Aggiungere script in `package.json`:
```json
"test": "vitest run",
"test:watch": "vitest",
"test:coverage": "vitest run --coverage"
```

---

### 3.2 Test componenti core

Creare i seguenti file di test:

| File | Cosa testa |
| --- | --- |
| `src/i18n/__tests__/LanguageProvider.test.tsx` | Cambio lingua, persistenza localStorage, valore `t` corretto |
| `src/contexts/__tests__/SiteConfigContext.test.tsx` | Switch template, color theme, mobile layout, persistenza |
| `src/components/__tests__/Effects.test.tsx` | Preloader raggiunge 100%, SpotlightCard render |
| `src/__tests__/App.test.tsx` | Template routing: agency vs micro-isp in base a config |

---

### 3.3 Test accessibilità con jest-axe

```bash
npm install -D jest-axe @types/jest-axe
```

Pattern test:
```typescript
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('AgencyTemplate has no a11y violations', async () => {
  const { container } = render(<AgencyTemplate />);  // con provider wrapper
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## Fase 4 — SEO & Accessibilità

### 4.1 hreflang dinamico

Aggiungere in `index.html` (statico per ora, dinamizzare con componente React se necessario):
```html
<link rel="alternate" hreflang="it" href="https://betabi.it/">
<link rel="alternate" hreflang="en" href="https://betabi.it/">
<link rel="alternate" hreflang="x-default" href="https://betabi.it/">
```

Quando il routing sarà path-based (`/it/`, `/en/`), creare un componente `<HreflangLinks>` che inietta i tag dinamicamente.

---

### 4.2 Pagine Privacy, Cookie, Terms

Creare componente `src/templates/shared/LegalPage.tsx` che renderizza contenuto statico i18n.

Aggiungere chiavi in `src/i18n/it.ts` e `en.ts`:
```typescript
legal: {
  privacy: { title: "Privacy Policy", content: "..." },
  cookies: { title: "Cookie Policy", content: "..." },
  terms: { title: "Termini di Servizio", content: "..." },
}
```

Collegare i link nel footer (`href="#privacy"` ecc.) a una navigazione intra-app che mostra la pagina legal in un modal o sezione dedicata.

---

### 4.3 Language switcher mobile (Micro-ISP)

**File:** `src/templates/micro-isp/MicroIspTemplate.tsx`

Il bottone `Globe` nel nav è `hidden md:flex`. Aggiungerlo anche alla nav mobile:
```tsx
{/* Nella sezione mobile menu */}
<button onClick={() => setLang(lang === 'it' ? 'en' : 'it')}
  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
  aria-label={t.nav.switchLang}>
  <Globe className="w-4 h-4" />
  {lang === 'it' ? 'EN' : 'IT'}
</button>
```

---

### 4.4 `prefers-reduced-motion`

**File:** `src/index.css` — aggiungere:
```css
@media (prefers-reduced-motion: reduce) {
  .custom-cursor { display: none !important; }
  .marquee-content { animation: none !important; }
  .sui-blob { animation: none !important; }
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**File:** `src/components/Effects.tsx` — nel componente `CustomCursor`, aggiungere check:
```typescript
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReduced) return null;
```

**File:** Agency template — ripristinare `cursor: auto` quando reduced-motion è attivo.

---

### 4.5 aria-label mancanti

**Micro-ISP template:**
- Bottone Globe mobile: aggiungere `aria-label={t.nav.switchLang}`
- Bottone close service modal: verificare `aria-label="Chiudi"`
- Bottone close contact modal: verificare `aria-label="Chiudi"`

**Agency template:**
- Bottone hamburger menu: verificare `aria-label` presente
- Link social nel footer: aggiungere `aria-label="LinkedIn"`, `aria-label="GitHub"`, ecc.

**Regola:** ogni `<button>` o `<a>` che contiene solo un'icona (senza testo visibile) **deve** avere `aria-label`.

---

## Fase 5 — Cleanup

### 5.1 Archiviare prototipi

Le directory `betabi-it-agency/` e `betabi-micro-isp/` sono prototipi Google AI Studio, ora consolidati in `betabi-site/`. Contengono dipendenze pericolose (`express`, `better-sqlite3`, `@google/genai`) e brand errato ("Nexus").

```bash
# Opzione A: rimuovere
rm -rf betabi-it-agency betabi-micro-isp

# Opzione B: archiviare in branch
git checkout -b archive/prototypes
git add betabi-it-agency betabi-micro-isp
git commit -m "chore: archive AI Studio prototypes"
git checkout main
rm -rf betabi-it-agency betabi-micro-isp
git add -A && git commit -m "chore: remove archived prototypes from main"
```

---

### 5.2 Sostituire immagini picsum.photos

**File:** `src/templates/agency/AgencyTemplate.tsx` — portfolio items

Le immagini `https://picsum.photos/seed/*/800/600` sono placeholder. Sostituire con:
- Immagini reali di progetti Beta BI in `public/images/portfolio/`
- Oppure placeholder locali generati (SVG con titolo progetto)

**Pattern sostituzione:**
```typescript
// DA:
image: "https://picsum.photos/seed/web1/800/600"

// A:
image: "/images/portfolio/progetto-nome.webp"
```

Convertire le immagini in WebP con dimensione max 800x600, qualità 80%.

---

### 5.3 Popolare link social

Nei footer di entrambi i template, sostituire `href="#"` con gli URL reali da `siteData`:
```typescript
import { siteData } from '@/config/siteData';

// Nel footer
{siteData.social.linkedin && <a href={siteData.social.linkedin} ...>}
{siteData.social.github && <a href={siteData.social.github} ...>}
```

---

## Priorità di esecuzione consigliata

```
Fase 1.1 (font self-hosted)     ████████████  BLOCCANTE — GDPR
Fase 1.3 (dati placeholder)     ████████      BLOCCANTE — credibilità
Fase 1.2 (favicon/manifest)     ██████        BLOCCANTE — brand
Fase 2.4 (bundle optimization)  ██████        PERF — -45KB gzip
Fase 2.1 (eliminare any)        █████         QUALITÀ
Fase 2.2 (strict TS)            █████         QUALITÀ
Fase 2.3 (ESLint)               █████         QUALITÀ
Fase 2.5 (deps classification)  ██            TRIVIALE
Fase 2.6 (useBodyLock)          ████          BUG PREVENTION
Fase 1.4 (form contatto)        ████████████  FUNZIONALITÀ (può aspettare backend)
Fase 3.x (testing)              ██████████    INFRASTRUTTURA
Fase 4.x (SEO/a11y)             ████████      COMPLIANCE
Fase 5.x (cleanup)              ████          HOUSEKEEPING
```

---

## Comandi di verifica post-sanamento

```bash
# TypeScript strict
npm run lint

# Build pulito
npm run build

# Nessun riferimento a Google Fonts
grep -r "googleapis" index.html src/

# Nessun dato placeholder
grep -r "012 345\|12345678901\|Via dell'Innovazione\|hello@betabi\|picsum.photos" src/

# Nessun `any` esplicito
grep -rn ": any" src/

# Bundle size check
ls -lh dist/assets/

# Test
npm test

# Docker
docker compose up -d && curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/
```
