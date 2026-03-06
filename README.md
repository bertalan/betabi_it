# Beta BI — Corporate Website

> Boutique internet service company website built with React 19, TypeScript, Vite and Tailwind CSS v4. Features multiple design templates that rotate automatically on each visitor session.

**Live:** [betabi.it](https://betabi.it)

---

## Overview

Beta BI is a one-page corporate website for a boutique web engineering agency based in Italy. The site showcases the company's services (digital transactions, high availability infrastructure, VPS maintenance, cloud applications, content strategy), a curated portfolio of client work, and the company's vision.

### Key Features

- **3 Design Templates** — Agency (editorial), Micro-ISP (brutalist/mono), Comic (retro pop) — randomly rotated per session so returning visitors see a fresh layout
- **Bilingual** — Full Italian and English support with automatic browser language detection
- **Config Panel** — Live template/color/layout switcher for internal demos and client presentations
- **Responsive** — Mobile-first design with configurable mobile layouts (standard, compact, cards)
- **Color Themes** — Neon, Blue, Red accent palettes with high-contrast accessibility toggle
- **Performance** — Static SPA with immutable asset caching, WebP images, gzip compression
- **Legal Pages** — GDPR-compliant Privacy Policy and Cookie Policy overlays
- **Motion** — Smooth animations via the [Motion](https://motion.dev) library with reduced-motion support

## Tech Stack

| Technology | Version | Role |
|---|---|---|
| React | 19 | UI library |
| TypeScript | 5.7+ | Type safety (strict mode) |
| Vite | 6.x | Bundler + dev server + HMR |
| Tailwind CSS | 4.x | Utility-first CSS |
| Motion | 12.x | Animations |
| Lucide React | latest | SVG icons (tree-shakeable) |

## Project Structure

```
betabi-site/
├── index.html                 # Entry point
├── vite.config.ts             # Vite config + path aliases
├── docker-compose.yml         # Dev + prod Docker services
├── Dockerfile                 # Multi-stage prod build (Node → Nginx)
├── Dockerfile.dev             # Dev container with HMR
├── deploy/
│   ├── betabi.it.conf         # Nginx production config (HTTPS + SPA)
│   └── nginx.conf             # Nginx Docker config
├── public/
│   └── portfolio/             # Portfolio thumbnails + full images (WebP)
└── src/
    ├── App.tsx                # Root: template router + config panel + legal pages
    ├── main.tsx               # React bootstrap
    ├── index.css              # Global styles + CSS custom properties
    ├── components/
    │   ├── Effects.tsx        # Shared visual effects (particles, gradients)
    │   ├── Icons.tsx          # Custom SVG icon components
    │   └── LegalPage.tsx      # Privacy/Cookie policy overlay
    ├── contexts/
    │   └── SiteConfigContext   # Template, color, layout, a11y state management
    ├── i18n/
    │   ├── index.tsx          # Language provider + detection
    │   ├── it.ts              # Italian translations
    │   └── en.ts              # English translations
    └── templates/
        ├── agency/            # Editorial/corporate design
        ├── micro-isp/         # Brutalist/monospace design
        └── comic/             # Retro pop/comic design
```

## Getting Started

### Prerequisites

- Node.js 22+
- npm

### Development (Docker — recommended)

```bash
docker compose up dev
# → http://localhost:3000
```

### Development (local)

```bash
npm install
npm run dev
# → http://localhost:3000
```

### Production Build

```bash
npm run build
npm run preview    # preview at localhost:3000
```

### Docker Production

```bash
docker compose --profile prod up prod
# → http://localhost:8080 (Nginx serving static build)
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `BETABI_TEMPLATE` | `micro-isp` | Default template (`agency`, `micro-isp`, `comic`) |
| `BETABI_LANG` | `it` | Default language (`it`, `en`) |
| `BETABI_MOBILE_LAYOUT` | `standard` | Mobile layout (`standard`, `compact`, `cards`) |
| `BETABI_COLOR_THEME` | `neon` | Color theme (`neon`, `blue`, `red`) |

These are mapped to Vite env vars (`VITE_*`) in docker-compose.yml.

## Deployment

The site is deployed as a static SPA on a bare-metal server (BT Panel / aapanel) with:
- **Nginx** reverse proxy with SPA fallback (`try_files $uri $uri/ /index.html`)
- **Let's Encrypt** SSL certificates (auto-renewed via certbot)
- **HTTP/2**, gzip compression, immutable asset caching
- Security headers (HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy)

Deploy config: [`deploy/betabi.it.conf`](deploy/betabi.it.conf)

## License

[MIT](LICENSE)
