import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, X, Globe, Zap, Shield, Server, Cloud, FileText, CheckCircle2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/i18n';
import { useSiteConfig } from '@/contexts/SiteConfigContext';

/* ─────────────────────────────────────────────────────────
   COMIC PANEL — reusable wrapper with thick border + optional rotation
   ───────────────────────────────────────────────────────── */
const Panel = ({
  children,
  className = '',
  rotate = 0,
  noPad = false,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  rotate?: number;
  noPad?: boolean;
  onClick?: () => void;
}) => (
  <div
    className={`comic-panel relative ${noPad ? '' : 'p-6 md:p-8'} ${className}`}
    style={rotate ? { transform: `rotate(${rotate}deg)` } : undefined}
    onClick={onClick}
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
    onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
  >
    {children}
  </div>
);

/* ─────────────────────────────────────────────────────────
   SPEECH BUBBLE
   ───────────────────────────────────────────────────────── */
const SpeechBubble = ({
  children,
  className = '',
  tail = 'bottom-left',
}: {
  children: React.ReactNode;
  className?: string;
  tail?: 'bottom-left' | 'bottom-right' | 'top-left';
}) => (
  <div className={`comic-bubble comic-bubble-${tail} ${className}`}>
    {children}
  </div>
);

/* ─────────────────────────────────────────────────────────
   ACTION BURST — POW / ZAP / BOOM star shape
   ───────────────────────────────────────────────────────── */
const ActionBurst = ({
  text,
  className = '',
  color = 'var(--comic-yellow)',
}: {
  text: string;
  className?: string;
  color?: string;
}) => (
  <div className={`comic-burst ${className}`} style={{ '--burst-color': color } as React.CSSProperties}>
    <span className="comic-burst-text">{text}</span>
  </div>
);

/* ─────────────────────────────────────────────────────────
   HALFTONE OVERLAY
   ───────────────────────────────────────────────────────── */
const Halftone = ({ className = '' }: { className?: string }) => (
  <div className={`comic-halftone ${className}`} aria-hidden="true" />
);

/* ─────────────────────────────────────────────────────────
   SPEED LINES — radiating action lines
   ───────────────────────────────────────────────────────── */
const SpeedLines = ({ className = '' }: { className?: string }) => (
  <div className={`comic-speed-lines ${className}`} aria-hidden="true">
    {Array.from({ length: 24 }).map((_, i) => (
      <div
        key={i}
        className="comic-speed-line"
        style={{ transform: `rotate(${i * 15}deg)` }}
      />
    ))}
  </div>
);

/* ═════════════════════════════════════════════════════════
   HEADER
   ═════════════════════════════════════════════════════════ */
const Header = ({ onOpenContact }: { onOpenContact: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, lang, setLang } = useLanguage();

  return (
    <header className="fixed top-0 w-full z-50 bg-white border-b-4 border-black">
      <div className="px-4 md:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="relative inline-flex items-center justify-center w-10 h-10 bg-[var(--comic-yellow)] border-3 border-black shadow-[3px_3px_0_#000] rounded-full">
            <span className="font-comic-title text-2xl text-black leading-none" aria-hidden="true">β</span>
          </span>
          <span className="font-comic-title text-3xl tracking-tight text-black">
            BETA<span className="text-[var(--comic-red)]">BI</span>
            <span className="text-[var(--comic-yellow)] text-lg align-super">!</span>
          </span>
        </div>
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-8">
          <a href="#servizi" className="comic-nav-link">{t.nav.services}</a>
          <a href="#portfolio" className="comic-nav-link">{t.nav.portfolio}</a>
          <a href="#agenzia" className="comic-nav-link">{t.nav.agency}</a>
          <button onClick={onOpenContact} className="comic-nav-link">{t.nav.contact}</button>
          <button
            onClick={() => setLang(lang === 'it' ? 'en' : 'it')}
            aria-label="Switch language"
            className="comic-nav-link flex items-center gap-1 ml-2 border-2 border-black px-3 py-1 bg-[var(--comic-yellow)] text-black font-bold rounded-none"
          >
            <Globe size={14} aria-hidden="true" /> {lang.toUpperCase()}
          </button>
        </nav>
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={() => setLang(lang === 'it' ? 'en' : 'it')}
            className="font-comic-title text-sm border-2 border-black px-2 py-1 bg-[var(--comic-yellow)] text-black font-bold"
          >
            {lang.toUpperCase()}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            className="w-10 h-10 border-3 border-black bg-white flex items-center justify-center"
          >
            {isOpen ? <X size={24} strokeWidth={3} /> : (
              <div className="flex flex-col gap-1.5">
                <div className="w-5 h-[3px] bg-black" /><div className="w-5 h-[3px] bg-black" /><div className="w-5 h-[3px] bg-black" />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white border-t-3 border-black p-6 flex flex-col gap-6"
          >
            <a href="#servizi" className="font-comic-title text-3xl text-black border-b-3 border-black pb-2" onClick={() => setIsOpen(false)}>{t.nav.services}</a>
            <a href="#portfolio" className="font-comic-title text-3xl text-black border-b-3 border-black pb-2" onClick={() => setIsOpen(false)}>{t.nav.portfolio}</a>
            <a href="#agenzia" className="font-comic-title text-3xl text-black border-b-3 border-black pb-2" onClick={() => setIsOpen(false)}>{t.nav.agency}</a>
            <button
              onClick={() => { setIsOpen(false); onOpenContact(); }}
              className="font-comic-title text-3xl text-[var(--comic-red)] border-b-3 border-black pb-2 text-left"
            >
              {t.nav.contact}
            </button>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

/* ═════════════════════════════════════════════════════════
   HERO — Comic book cover style
   ═════════════════════════════════════════════════════════ */
const Hero = ({ onOpenContact }: { onOpenContact: () => void }) => {
  const { t } = useLanguage();
  const { mobileLayout, isMobile } = useSiteConfig();
  const compactHero = isMobile && mobileLayout === 'compact';

  return (
    <section className={`relative bg-white overflow-hidden ${compactHero ? 'min-h-[80vh]' : 'min-h-screen'}`}>
      {/* Decorative backgrounds — contained, no layout impact */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <Halftone className="absolute inset-0 opacity-[0.07]" />
        <SpeedLines className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] opacity-[0.06]" />
      </div>

      {/* Content: compact group top + scroll indicator pushed to bottom */}
      <div className="relative z-10 flex flex-col items-center min-h-screen px-4 md:px-8 text-center">

        {/* Header clearance — matches fixed header h-20 + border */}
        <div className="h-[146px] md:h-[162px] shrink-0" aria-hidden="true" />

        {/* Badge */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 3 }}
          transition={{ duration: 0.6, delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-[10px]"
        >
          <SpeechBubble className="inline-block px-5 py-2 md:px-6 md:py-3" tail="bottom-left">
            <span className="font-comic-body text-xs sm:text-sm md:text-base text-black font-bold">{t.hero.badge}</span>
          </SpeechBubble>
        </motion.div>

        {/* Main title — responsive clamped sizes */}
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative"
        >
          <h1 className="font-comic-title leading-[0.85] text-black text-[clamp(2.2rem,10vw,4.5rem)] md:text-[clamp(3.5rem,8vw,7rem)]">
            <span className="block comic-text-shadow">{t.hero.title1}</span>
            <span className="block text-[var(--comic-red)] comic-text-shadow-red">{t.hero.title2}</span>
            <span className="block comic-text-shadow">{t.hero.title3}</span>
          </h1>
        </motion.div>

        {/* Burst accent */}
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 12 }}
          transition={{ duration: 0.5, delay: 0.8, type: 'spring' }}
          className="absolute top-28 right-4 md:right-16 hidden md:block"
        >
          <ActionBurst text="WOW!" className="w-24 h-24 text-lg" />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="font-comic-body text-sm md:text-lg lg:text-xl text-black/70 max-w-2xl mt-4 md:mt-6 leading-relaxed"
        >
          {t.hero.desc}
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="mt-4 md:mt-6"
        >
          <button
            onClick={onOpenContact}
            className="comic-btn comic-btn-primary inline-flex items-center gap-3 text-base md:text-lg"
          >
            {t.hero.cta} <ArrowRight className="w-5 h-5" strokeWidth={3} />
          </button>
        </motion.div>

        {/* Scroll indicator — pushed to bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-auto pt-4 pb-6 flex flex-col items-center gap-2"
        >
          <span className="font-comic-body text-xs uppercase tracking-widest text-black/60 font-bold">{t.hero.scroll}</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-6 h-10 border-3 border-black/30 rounded-full flex justify-center pt-2"
          >
            <div className="w-1.5 h-3 bg-black/30 rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

/* ═════════════════════════════════════════════════════════
   MARQUEE — action word ticker
   ═════════════════════════════════════════════════════════ */
const Marquee = () => {
  const { t } = useLanguage();
  return (
    <div
      className="comic-marquee border-y-4 border-black bg-[var(--comic-yellow)] py-4 overflow-hidden group"
      aria-hidden="true"
      role="presentation"
    >
      <div className="marquee-content font-comic-title text-3xl md:text-5xl text-black group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]">
        {[...t.marquee, ...t.marquee].map((text, i) => (
          <span key={i} className="flex items-center">
            <span className="mx-6 md:mx-10">{text}</span>
            <span className="mx-4 text-[var(--comic-red)] text-2xl md:text-4xl">★</span>
          </span>
        ))}
      </div>
    </div>
  );
};

/* ═════════════════════════════════════════════════════════
   SERVICE ICON MAPPER
   ═════════════════════════════════════════════════════════ */
const serviceIconMap: Record<string, React.ElementType> = {
  '01': Zap,
  '02': Shield,
  '03': Server,
  '04': Cloud,
  '05': FileText,
};

/* ═════════════════════════════════════════════════════════
   SERVICE DETAIL MODAL — Comic style speech bubble
   ═════════════════════════════════════════════════════════ */
const ServiceDetailModal = ({
  service,
  onClose,
  onSetup,
}: {
  service: { id: string; title: string; subtitle: string; desc: string; details: string } | null;
  onClose: () => void;
  onSetup: () => void;
}) => {
  const { t } = useLanguage();
  if (!service) return null;
  const Icon = serviceIconMap[service.id] || Zap;

  return (
    <AnimatePresence>
      {service && (
        <motion.div
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-black/70"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.85, y: 50, rotate: -3 }}
            animate={{ scale: 1, y: 0, rotate: 0 }}
            exit={{ scale: 0.85, y: 50, rotate: 3 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl bg-white border-4 border-black shadow-[8px_8px_0_#000] overflow-hidden max-h-[90vh] flex flex-col md:flex-row"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 w-10 h-10 border-3 border-black bg-[var(--comic-red)] text-white flex items-center justify-center hover:bg-black transition-colors z-50"
            >
              <X size={20} strokeWidth={3} aria-hidden="true" />
            </button>

            {/* Left panel — icon + number */}
            <div className="w-full md:w-2/5 p-8 md:p-12 bg-[var(--comic-yellow)]/20 border-b-4 md:border-b-0 md:border-r-4 border-black flex flex-col items-center justify-center relative shrink-0 min-h-[200px] md:min-h-0">
              <Halftone className="absolute inset-0 opacity-[0.06]" />
              <span aria-hidden="true" className="absolute top-4 left-4 font-comic-title text-6xl text-black/10">{service.id}</span>
              <div className="relative w-24 h-24 md:w-32 md:h-32 border-4 border-black bg-white flex items-center justify-center">
                <Icon size={48} strokeWidth={2.5} className="text-black" />
              </div>
              <span className="relative font-comic-body text-xs text-[var(--comic-blue)] uppercase font-bold tracking-wider mt-4">{service.subtitle}</span>
            </div>

            {/* Right panel — content */}
            <div className="w-full md:w-3/5 p-6 md:p-10 flex flex-col justify-center overflow-y-auto">
              <h3 className="font-comic-title text-3xl md:text-4xl text-black mb-4 leading-tight pr-10">{service.title}</h3>
                    <p className="font-comic-body text-sm text-black/70 leading-relaxed mb-8">{service.details}</p>
              <button
                onClick={onSetup}
                className="comic-btn comic-btn-primary self-start inline-flex items-center gap-3"
              >
                {t.modal.setup} <ArrowRight size={18} strokeWidth={3} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ═════════════════════════════════════════════════════════
   SERVICES — Comic panel grid
   ═════════════════════════════════════════════════════════ */
const Services = ({ onSelectService }: { onSelectService: (id: string) => void }) => {
  const { t } = useLanguage();
  const { mobileLayout, isMobile } = useSiteConfig();
  const items = t.services.items;
  const isCards = isMobile && mobileLayout === 'cards';

  if (isCards) {
    return (
      <section id="servizi" className="py-16 px-4 bg-white">
        <div className="mb-10 text-center">
          <h2 className="font-comic-title text-5xl text-black comic-text-shadow">
            {t.services.overline} <span className="text-[var(--comic-red)]">{t.services.title}</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {items.map((s, i) => {
            const Icon = serviceIconMap[s.id] || Zap;
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Panel className="bg-white cursor-pointer" onClick={() => onSelectService(s.id)}>
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-12 h-12 border-3 border-black bg-[var(--comic-yellow)] flex items-center justify-center">
                      <Icon size={24} strokeWidth={3} className="text-black" />
                    </div>
                    <div>
                      <span className="font-comic-body text-xs text-[var(--comic-blue)] uppercase font-bold tracking-wider">{s.subtitle}</span>
                      <h3 className="font-comic-title text-xl text-black mt-1">{s.title}</h3>
                      <p className="font-comic-body text-sm text-black/75 mt-2">{s.desc}</p>
                    </div>
                  </div>
                </Panel>
              </motion.div>
            );
          })}
        </div>
      </section>
    );
  }

  const panelColors = [
    'bg-[var(--comic-yellow)]/10',
    'bg-[var(--comic-blue)]/10',
    'bg-[var(--comic-red)]/5',
    'bg-[var(--comic-yellow)]/10',
    'bg-[var(--comic-blue)]/10',
  ];

  return (
    <section id="servizi" className="py-20 md:py-32 px-4 md:px-8 bg-white relative">
      <Halftone className="absolute inset-0 opacity-[0.04]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-24"
        >
          <SpeechBubble className="inline-block px-8 py-4 mb-4">
            <span className="font-comic-body text-sm text-black/70 uppercase tracking-wider font-bold">{t.services.overline}</span>
          </SpeechBubble>
          <h2 className="font-comic-title text-6xl md:text-8xl text-black comic-text-shadow">
            {t.services.title}
          </h2>
        </motion.div>

        {/* Comic panel grid — asymmetric */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {items.map((s, i) => {
            const Icon = serviceIconMap[s.id] || Zap;
            const rotation = i % 2 === 0 ? -0.5 : 0.5;
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 50, rotate: rotation * 4 }}
                whileInView={{ opacity: 1, y: 0, rotate: rotation }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`${i === 0 ? 'lg:col-span-2 lg:row-span-1' : ''} ${i === 4 ? 'lg:col-span-2' : ''}`}
              >
                <Panel className={`h-full ${panelColors[i]} group hover:-translate-y-2 hover:shadow-[8px_8px_0_#000] transition-all duration-300 cursor-pointer`} onClick={() => onSelectService(s.id)}>
                  {/* Number + icon row */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-comic-title text-5xl text-black/10 group-hover:text-[var(--comic-red)]/30 transition-colors">{s.id}</span>
                    <div className="w-14 h-14 border-3 border-black bg-white flex items-center justify-center group-hover:bg-[var(--comic-yellow)] transition-colors">
                      <Icon size={28} strokeWidth={2.5} className="text-black" />
                    </div>
                  </div>

                  {/* Content */}
                  <span className="font-comic-body text-xs text-[var(--comic-blue)] uppercase font-bold tracking-wider">{s.subtitle}</span>
                  <h3 className="font-comic-title text-2xl md:text-3xl text-black mt-2 mb-4 leading-tight">{s.title}</h3>
                  <p className="font-comic-body text-sm md:text-base text-black/75 leading-relaxed">{s.desc}</p>

                  {/* Bottom decorative line */}
                  <div className="mt-6 pt-4 border-t-3 border-black/10 group-hover:border-[var(--comic-red)] transition-colors">
                    <span className="font-comic-body text-xs text-black/40 uppercase tracking-wider font-bold flex items-center gap-2 group-hover:text-[var(--comic-red)] transition-colors">
                      <ArrowRight size={14} strokeWidth={3} /> {t.modal.explore}
                    </span>
                  </div>
                </Panel>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ═════════════════════════════════════════════════════════
   STATS — Comic style numbers
   ═════════════════════════════════════════════════════════ */
const Stats = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 md:py-32 bg-[var(--comic-red)] text-white relative overflow-hidden border-y-4 border-black">
      {/* Background decorativi contenuti per evitare espansione layout */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <Halftone className="absolute inset-0 opacity-[0.08] mix-blend-multiply" />
        <SpeedLines className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] opacity-[0.08]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-comic-title text-5xl md:text-7xl leading-[0.9] comic-text-shadow-white mb-8">
            {t.stats.title1}<br />{t.stats.title2}<br />{t.stats.title3}
          </h2>
          <p className="font-comic-body text-lg text-white/80 max-w-md mb-8">{t.stats.desc}</p>
          <ul className="space-y-4">
            {t.stats.items.map((item, i) => (
              <li key={i} className="flex items-center gap-3 font-comic-body font-bold text-base">
                <Zap className="w-5 h-5 text-[var(--comic-yellow)]" strokeWidth={3} />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {t.stats.numbers.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: i % 2 === 0 ? -1 : 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
            >
              <Panel className="bg-white text-black text-center aspect-square flex flex-col items-center justify-center">
                <div className="font-comic-title text-4xl md:text-5xl text-[var(--comic-red)] comic-text-shadow-small">
                  {stat.value}
                </div>
                <div className="font-comic-body text-xs uppercase tracking-wider text-black/70 font-bold mt-2">
                  {stat.label}
                </div>
              </Panel>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ═════════════════════════════════════════════════════════
   PORTFOLIO — Comic strip panels
   ═════════════════════════════════════════════════════════ */
const portfolio = [
  { id: 1, client: 'Vroom Vroom Accessories', project: 'E-commerce Accessori Moto', tech: 'WordPress / WooCommerce', thumb: '/portfolio/vroomvroom-thumb.webp', image: '/portfolio/vroomvroom.webp', url: 'https://vroomvroomaccessories.com' },
  { id: 2, client: 'Studio Legale Donofrio', project: 'Sito Corporate Studio Legale', tech: 'Custom / Wagtail CMS', thumb: '/portfolio/studiolegale-thumb.webp', image: '/portfolio/studiolegale.webp', url: 'https://studiolegaledonofrio.it' },
  { id: 3, client: 'Magix Promotion', project: 'Portale Agenzia Musicale', tech: 'Wagtail / React', thumb: '/portfolio/magixpromotion-thumb.webp', image: '/portfolio/magixpromotion.webp', url: 'https://new.magixpromotion.com' },
  { id: 4, client: 'Gemmologia.net', project: 'Portale Formazione Gemmologica', tech: 'jQuery / Custom', thumb: '/portfolio/gemmologia-thumb.webp', image: '/portfolio/gemmologia.webp', url: 'https://gemmologia.net' },
  { id: 5, client: 'MC Castellazzo Bormida', project: 'Sito Moto Club Storico', tech: 'Wagtail / React', thumb: '/portfolio/mccastellazzob-thumb.webp', image: '/portfolio/mccastellazzob.webp', url: 'https://new.mccastellazzob.com/it' },
];

const Portfolio = () => {
  const { t } = useLanguage();
  const { mobileLayout, isMobile } = useSiteConfig();
  const isCards = isMobile && mobileLayout === 'cards';
  const [selectedProject, setSelectedProject] = useState<typeof portfolio[number] | null>(null);

  useEffect(() => {
    document.body.style.overflow = selectedProject ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [selectedProject]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape' && selectedProject) setSelectedProject(null); };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject]);

  return (
    <section id="portfolio" className="py-20 md:py-32 px-4 md:px-8 bg-white relative">
      <Halftone className="absolute inset-0 opacity-[0.03]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16"
        >
          <div>
            <span className="font-comic-body text-sm uppercase tracking-wider text-[var(--comic-blue)] font-bold">{t.portfolio.overline}</span>
            <h2 className="font-comic-title text-6xl md:text-8xl text-black comic-text-shadow">{t.portfolio.title}</h2>
          </div>
          <ActionBurst text="NEW!" className="w-20 h-20 text-sm" color="var(--comic-red)" />
        </motion.div>

        <div className={isCards ? 'grid grid-cols-1 gap-6' : 'grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8'}>
          {portfolio.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40, rotate: i % 2 === 0 ? -2 : 2 }}
              whileInView={{ opacity: 1, y: 0, rotate: i % 2 === 0 ? -0.5 : 0.5 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              <Panel className="bg-white group hover:-translate-y-3 hover:shadow-[8px_8px_0_#000] transition-all duration-300">
                <div className="relative overflow-hidden border-3 border-black mb-4 aspect-video cursor-pointer" onClick={() => setSelectedProject(item)}>
                  <img
                    src={item.thumb}
                    alt={item.client}
                    className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 comic-halftone opacity-[0.15] mix-blend-multiply group-hover:opacity-0 transition-opacity duration-500" />
                </div>
                <div>
                  <h3 className="font-comic-title text-2xl text-black group-hover:text-[var(--comic-red)] transition-colors">{item.client}</h3>
                  <p className="font-comic-body text-sm text-black/70 mt-1">{item.project}</p>
                </div>
                <div className="mt-4">
                  <span className="inline-block border-2 border-black px-3 py-1 bg-[var(--comic-yellow)] font-comic-body text-xs text-black font-bold uppercase tracking-wider">{item.tech}</span>
                </div>
              </Panel>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Portfolio Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/80 comic-halftone-bg"
              onClick={() => setSelectedProject(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal panel */}
            <motion.div
              className="relative w-full max-w-[1230px] max-h-[90vh] overflow-y-auto bg-white border-4 border-black shadow-[8px_8px_0_#000] z-10"
              initial={{ scale: 0.5, rotate: -5, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 25 } }}
              exit={{ scale: 0.5, rotate: 5, opacity: 0, transition: { duration: 0.2 } }}
            >
              <Halftone className="absolute inset-0 opacity-[0.03] pointer-events-none" />

              {/* Close button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 bg-[var(--comic-red)] border-3 border-black shadow-[3px_3px_0_#000] flex items-center justify-center text-white hover:bg-black transition-colors cursor-pointer"
              >
                <X size={20} strokeWidth={3} />
              </button>

              <div className="relative z-10 flex flex-col md:flex-row">
                {/* Left panel — screenshot */}
                <div className="md:w-[66%] border-b-4 md:border-b-0 md:border-r-4 border-black bg-[#1a1a2e] flex items-center justify-center overflow-hidden">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.client}
                    className="w-full h-full object-contain min-h-[250px]"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Right panel — info */}
                <div className="md:w-[34%] p-6 flex flex-col gap-5">
                  <div>
                    <span className="inline-block border-2 border-black px-3 py-1 bg-[var(--comic-yellow)] font-comic-body text-xs text-black font-bold uppercase tracking-wider mb-4">
                      {selectedProject.tech}
                    </span>
                    <h3 className="font-comic-title text-3xl md:text-4xl text-black comic-text-shadow leading-tight">
                      {selectedProject.client}
                    </h3>
                    <p className="font-comic-body text-base text-black/70 mt-2 font-bold">
                      {selectedProject.project}
                    </p>
                  </div>

                  <div className="border-t-3 border-black border-dashed pt-4">
                    <p className="font-comic-body text-sm text-black/80 leading-relaxed">
                      {t.portfolio.desc
                        .replace('{client}', selectedProject.client)
                        .replace('{tech}', selectedProject.tech)}
                    </p>
                  </div>

                  <a
                    href={selectedProject.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="comic-btn self-start mt-auto inline-flex items-center gap-2"
                  >
                    {t.portfolio.explore} <ArrowRight size={18} strokeWidth={3} />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

/* ═════════════════════════════════════════════════════════
   ABOUT — Story panel
   ═════════════════════════════════════════════════════════ */
const About = () => {
  const { t } = useLanguage();

  return (
    <section id="agenzia" className="py-20 md:py-32 px-4 md:px-8 bg-[var(--comic-blue)] relative overflow-hidden border-y-4 border-black">
      <Halftone className="absolute inset-0 opacity-[0.06] mix-blend-multiply" />

      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left — big title panel */}
        <div className="md:col-span-4">
          <Panel className="bg-white text-center py-12">
            <h2 className="font-comic-title text-6xl md:text-7xl text-black leading-[0.85]">
              {t.about.title1}<br />
              <span className="text-[var(--comic-red)]">{t.about.title2}</span>
            </h2>
            <div className="mt-6 w-24 h-24 mx-auto border-4 border-black rounded-full bg-[var(--comic-yellow)] flex items-center justify-center font-comic-title text-3xl text-black">
              BI
            </div>
            <p className="font-comic-body text-xs uppercase tracking-wider text-black/70 font-bold mt-3">
              Bertalan Iván — {t.about.role}
            </p>
          </Panel>
        </div>

        {/* Right — story panels */}
        <div className="md:col-span-8 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <SpeechBubble className="p-6 md:p-8">
              <p className="font-comic-body text-lg md:text-xl text-black leading-relaxed">
                {t.about.p1}
              </p>
            </SpeechBubble>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Panel className="bg-white h-full">
                <p className="font-comic-body text-base text-black/70 leading-relaxed">{t.about.p2}</p>
              </Panel>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Panel className="bg-white h-full">
                <p className="font-comic-body text-base text-black/70 leading-relaxed">{t.about.p3}</p>
              </Panel>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ═════════════════════════════════════════════════════════
   FOOTER — Comic strip ending
   ═════════════════════════════════════════════════════════ */
const Footer = ({ onOpenContact }: { onOpenContact: () => void }) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-black text-white pt-20 pb-8 px-4 md:px-8 relative overflow-hidden border-t-4 border-black">
      {/* Decorative β watermark */}
      <span className="absolute -left-16 -bottom-24 text-[35rem] font-serif leading-none text-white/[0.03] pointer-events-none select-none rotate-[-15deg]" aria-hidden="true">β</span>
      {/* Top marquee */}
      <div className="comic-marquee-footer border-y-3 border-white/20 py-3 mb-16 -mx-4 md:-mx-8 overflow-hidden">
        <div className="marquee-content">
          {[...t.marquee, ...t.marquee].map((text, i) => (
            <span key={i} className="flex items-center">
              <span className="font-comic-title text-4xl md:text-5xl text-white mx-8">{text}</span>
              <span className="text-[var(--comic-yellow)] text-3xl">★</span>
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="md:col-span-2">
          <h2 className="font-comic-title text-4xl md:text-5xl mb-4">
            {t.footer.title}
            <span className="text-[var(--comic-yellow)]">!</span>
          </h2>
          <p className="font-comic-body text-base text-white/80 max-w-sm mb-8">{t.footer.desc}</p>
          <button
            onClick={onOpenContact}
            className="comic-btn comic-btn-primary inline-flex items-center gap-3"
          >
            {t.nav.contact} <ArrowRight size={18} strokeWidth={3} />
          </button>
        </div>
        <div>
          <h4 className="font-comic-title text-sm uppercase tracking-wider text-[var(--comic-yellow)] mb-4">{t.footer.social}</h4>
          <ul className="space-y-3 font-comic-body text-lg">
            <li><a href="#" className="hover:text-[var(--comic-yellow)] transition-colors">LinkedIn</a></li>
            <li><a href="#" className="hover:text-[var(--comic-yellow)] transition-colors">GitHub</a></li>
            <li><a href="#" className="hover:text-[var(--comic-yellow)] transition-colors">Twitter</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-comic-title text-sm uppercase tracking-wider text-[var(--comic-yellow)] mb-4">{t.footer.contact}</h4>
          <ul className="space-y-3 font-comic-body text-lg">
            <li><button onClick={onOpenContact} className="hover:text-[var(--comic-yellow)] transition-colors">posta@betabi.it</button></li>
            <li><a href="tel:+393478063221" className="hover:text-[var(--comic-yellow)] transition-colors">+39 347 806 3221</a></li>
            <li className="text-white/60">Valenza (AL), Italia</li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t-3 border-white/20 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 font-comic-body text-xs uppercase tracking-wider text-white/60">
        <p>&copy; {new Date().getFullYear()} Beta BI.</p>
        <div className="flex gap-6">
          <button onClick={() => window.dispatchEvent(new CustomEvent('open-legal', { detail: 'privacy' }))} className="hover:text-white transition-colors">{t.footer.privacy}</button>
          <button onClick={() => window.dispatchEvent(new CustomEvent('open-legal', { detail: 'cookie' }))} className="hover:text-white transition-colors">{t.footer.cookie}</button>
        </div>
      </div>

      {/* "THE END" burst */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="absolute bottom-16 right-8 hidden md:block"
      >
        <ActionBurst text="THE END" className="w-24 h-24 text-xs" color="var(--comic-yellow)" />
      </motion.div>
    </footer>
  );
};

/* ═════════════════════════════════════════════════════════
   CONTACT MODAL — Comic style
   ═════════════════════════════════════════════════════════ */
const ContactModal = ({ isOpen, onClose, serviceTitle }: { isOpen: boolean; onClose: () => void; serviceTitle?: string }) => {
  const { t } = useLanguage();
  const firstInputRef = useRef<HTMLInputElement>(null);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => firstInputRef.current?.focus(), 500);
    } else {
      document.body.style.overflow = 'auto';
      setFormStatus('idle');
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    setTimeout(() => {
      setFormStatus('success');
      setTimeout(() => { onClose(); }, 2500);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-black/70"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 40, rotate: -2 }}
            animate={{ scale: 1, y: 0, rotate: 0 }}
            exit={{ scale: 0.9, y: 40, rotate: 2 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-white border-4 border-black shadow-[8px_8px_0_#000] overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 w-10 h-10 border-3 border-black bg-[var(--comic-red)] text-white flex items-center justify-center hover:bg-black transition-colors z-50"
            >
              <X size={20} strokeWidth={3} aria-hidden="true" />
            </button>

            <div className="overflow-y-auto p-6 md:p-10 flex-1">
              {formStatus === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-12"
                >
                  <ActionBurst text="OK!" className="w-24 h-24 text-2xl mb-6" />
                  <h3 className="font-comic-title text-3xl text-black">{t.form.success}</h3>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="mb-2">
                    <SpeechBubble className="inline-block px-6 py-3 mb-4" tail="bottom-left">
                      <h3 className="font-comic-title text-3xl text-black">{t.form.title}</h3>
                    </SpeechBubble>
                    <p className="font-comic-body text-sm text-black/70">{t.form.desc}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="comic-name" className="font-comic-body text-xs text-black/70 uppercase font-bold tracking-wider block mb-1">{t.form.name}</label>
                      <input id="comic-name" ref={firstInputRef} type="text" required className="comic-input" />
                    </div>
                    <div>
                      <label htmlFor="comic-email" className="font-comic-body text-xs text-black/70 uppercase font-bold tracking-wider block mb-1">{t.form.email}</label>
                      <input id="comic-email" type="email" required className="comic-input" />
                    </div>
                  </div>
                  {serviceTitle && (
                    <div>
                      <label htmlFor="comic-service" className="font-comic-body text-xs text-black/70 uppercase font-bold tracking-wider block mb-1">{t.form.service}</label>
                      <input id="comic-service" type="text" value={serviceTitle} readOnly className="comic-input text-[var(--comic-blue)] border-[var(--comic-blue)]/50 font-bold" />
                    </div>
                  )}
                  <div>
                    <label htmlFor="comic-company" className="font-comic-body text-xs text-black/70 uppercase font-bold tracking-wider block mb-1">{t.form.company}</label>
                    <input id="comic-company" type="text" className="comic-input" />
                  </div>
                  <div>
                    <label htmlFor="comic-message" className="font-comic-body text-xs text-black/70 uppercase font-bold tracking-wider block mb-1">{t.form.message}</label>
                    <textarea id="comic-message" required rows={4} className="comic-input resize-none" />
                  </div>

                  <button
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className="comic-btn comic-btn-primary self-end inline-flex items-center gap-3 disabled:opacity-60"
                  >
                    {formStatus === 'submitting' ? t.form.sending : t.form.send}
                    {formStatus !== 'submitting' && <ArrowRight size={18} strokeWidth={3} />}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ═════════════════════════════════════════════════════════
   MAIN TEMPLATE EXPORT
   ═════════════════════════════════════════════════════════ */
export default function ComicTemplate() {
  const { t } = useLanguage();
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const items = t.services.items;
  const selectedService = selectedServiceId ? items.find(s => s.id === selectedServiceId) ?? null : null;

  // Lock body scroll when modals are open
  useEffect(() => {
    document.body.style.overflow = (selectedServiceId || isContactOpen) ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [selectedServiceId, isContactOpen]);

  // Escape key closes modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isContactOpen) { handleCloseContact(); }
        else if (selectedServiceId) { setSelectedServiceId(null); }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isContactOpen, selectedServiceId]);

  const handleSetup = () => {
    // Close service modal and open contact form (service title is passed through)
    setIsContactOpen(true);
  };

  const handleCloseContact = () => {
    setIsContactOpen(false);
    setSelectedServiceId(null);
  };

  return (
    <div className="min-h-screen bg-white text-black font-comic-body selection:bg-[var(--comic-yellow)] selection:text-black relative overflow-x-hidden">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[999] focus:p-4 focus:bg-white focus:text-black focus:border-3 focus:border-black">
        Skip to main content
      </a>

      <Header onOpenContact={() => setIsContactOpen(true)} />
      <ServiceDetailModal
        service={selectedService}
        onClose={() => setSelectedServiceId(null)}
        onSetup={handleSetup}
      />
      <ContactModal
        isOpen={isContactOpen}
        onClose={handleCloseContact}
        serviceTitle={selectedService?.title}
      />

      <main id="main-content">
        <Hero onOpenContact={() => setIsContactOpen(true)} />
        <Marquee />
        <Services onSelectService={(id) => setSelectedServiceId(id)} />
        <Stats />
        <Portfolio />
        <About />
      </main>

      <Footer onOpenContact={() => setIsContactOpen(true)} />
    </div>
  );
}
