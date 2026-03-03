import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { ArrowRight, Menu, X, Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/i18n';
import { MagneticButton, TextReveal, Preloader } from '@/components/Effects';
import { useSiteConfig } from '@/contexts/SiteConfigContext';

const portfolio = [
  { id: 1, client: 'Vroom Vroom Accessories', project: 'E-commerce Accessori Moto', tech: 'WordPress / WooCommerce', thumb: '/portfolio/vroomvroom-thumb.webp', image: '/portfolio/vroomvroom.webp', url: 'https://vroomvroomaccessories.com' },
  { id: 2, client: 'Studio Legale Donofrio', project: 'Sito Corporate Studio Legale', tech: 'Custom / Wagtail CMS', thumb: '/portfolio/studiolegale-thumb.webp', image: '/portfolio/studiolegale.webp', url: 'https://studiolegaledonofrio.it' },
  { id: 3, client: 'Magix Promotion', project: 'Portale Agenzia Musicale', tech: 'Wagtail / React', thumb: '/portfolio/magixpromotion-thumb.webp', image: '/portfolio/magixpromotion.webp', url: 'https://new.magixpromotion.com' },
  { id: 4, client: 'Gemmologia.net', project: 'Portale Formazione Gemmologica', tech: 'jQuery / Custom', thumb: '/portfolio/gemmologia-thumb.webp', image: '/portfolio/gemmologia.webp', url: 'https://gemmologia.net' },
  { id: 5, client: 'MC Castellazzo Bormida', project: 'Sito Moto Club Storico', tech: 'Wagtail / React', thumb: '/portfolio/mccastellazzob-thumb.webp', image: '/portfolio/mccastellazzob.webp', url: 'https://new.mccastellazzob.com/it' },
];

const Header = ({ onOpenContact }: { onOpenContact: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, lang, setLang } = useLanguage();

  return (
    <header className="fixed top-0 w-full z-50 mix-blend-difference text-white">
      <div className="px-6 md:px-12 h-24 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="relative w-10 h-10 flex items-center justify-center">
            <span className="absolute inset-0 rounded-full border border-current opacity-40"></span>
            <span className="font-serif text-2xl leading-none" aria-hidden="true">β</span>
          </span>
          <span className="font-display font-bold text-2xl tracking-tighter uppercase">Beta BI</span>
        </div>
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-12">
          <a href="#servizi" className="text-sm font-bold uppercase tracking-widest hover:text-accent transition-colors">{t.nav.services}</a>
          <a href="#portfolio" className="text-sm font-bold uppercase tracking-widest hover:text-accent transition-colors">{t.nav.portfolio}</a>
          <a href="#vision" className="text-sm font-bold uppercase tracking-widest hover:text-accent transition-colors">{t.nav.agency}</a>
          <button onClick={onOpenContact} className="text-sm font-bold uppercase tracking-widest hover:text-accent transition-colors">{t.nav.contact}</button>
          <button onClick={() => setLang(lang === 'it' ? 'en' : 'it')} aria-label={`Switch language`} className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-accent transition-colors ml-4">
            <Globe size={16} aria-hidden="true" /> {lang}
          </button>
        </nav>
        <div className="md:hidden flex items-center gap-6">
          <button onClick={() => setLang(lang === 'it' ? 'en' : 'it')} className="text-sm font-bold uppercase tracking-widest">{lang}</button>
          <button onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen} aria-label={isOpen ? "Close menu" : "Open menu"}>
            {isOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.nav initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed top-24 left-0 w-full bg-bg/85 backdrop-blur-xl text-text p-6 flex flex-col gap-8 h-[calc(100vh-6rem)] z-40">
            <a href="#servizi" className="text-4xl font-display uppercase" onClick={() => setIsOpen(false)}>{t.nav.services}</a>
            <a href="#portfolio" className="text-4xl font-display uppercase" onClick={() => setIsOpen(false)}>{t.nav.portfolio}</a>
            <a href="#vision" className="text-4xl font-display uppercase" onClick={() => setIsOpen(false)}>{t.nav.agency}</a>
            <button onClick={() => { setIsOpen(false); onOpenContact(); }} className="text-4xl font-display uppercase text-left text-accent mt-8">{t.nav.contact}</button>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

const Hero = ({ isReady }: { isReady: boolean }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { t } = useLanguage();
  const shouldAnimate = isReady && isImageLoaded;
  const { mobileLayout, isMobile } = useSiteConfig();

  const compactHero = isMobile && mobileLayout === 'compact';

  return (
    <section className={`relative flex flex-col justify-end pb-12 md:pb-20 px-6 md:px-12 overflow-hidden ${compactHero ? 'min-h-[70vh] pt-28' : 'min-h-screen pt-40'}`}>
      <div className="absolute bottom-24 md:bottom-auto md:top-32 right-6 md:right-32 w-[70vw] md:w-[35vw] aspect-[4/5] overflow-hidden z-0 opacity-60 md:opacity-100">
        <motion.img initial={{ scale: 1.2, opacity: 0 }} animate={isReady ? { scale: 1, opacity: 1 } : { scale: 1.2, opacity: 0 }} transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
          src="https://picsum.photos/seed/brutalist/800/1000?grayscale" alt="Architecture" className="w-full h-full object-cover" referrerPolicy="no-referrer" onLoad={() => setIsImageLoaded(true)} />
        <div className="absolute inset-0 bg-accent mix-blend-multiply opacity-20"></div>
      </div>
      <div className="z-10 relative mix-blend-difference text-white pointer-events-none">
        <motion.div initial={{ y: 100, opacity: 0 }} animate={shouldAnimate ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }} transition={{ duration: 1, delay: 0.2, ease: [0.25, 1, 0.5, 1] }} className="overflow-hidden">
          <h1 className={`leading-[0.75] font-display m-0 p-0 tracking-tighter ${compactHero ? 'text-[16vw]' : 'text-[22vw] md:text-[18vw]'}`}>{t.hero.agencyTitle1}</h1>
          <div className="flex items-end gap-4 md:gap-6">
            <span className={`leading-[0.75] font-display m-0 p-0 tracking-tighter text-accent ${compactHero ? 'text-[16vw]' : 'text-[22vw] md:text-[18vw]'}`}>{t.hero.agencyTitle2}</span>
            <motion.p initial={{ opacity: 0, x: -20 }} animate={shouldAnimate ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }} transition={{ duration: 1, delay: 0.6, ease: [0.25, 1, 0.5, 1] }}
              className="font-serif italic text-lg md:text-3xl max-w-xs md:max-w-md mb-[0.08em] text-white/80 leading-tight">{t.hero.subtitle}</motion.p>
          </div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={shouldAnimate ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-[23px] right-6 md:right-12 flex items-center gap-4 text-white mix-blend-difference">
        <span className="font-sans text-xs uppercase tracking-widest font-bold">{t.hero.scroll}</span>
        <div className="w-12 h-[1px] bg-white"></div>
      </motion.div>
    </section>
  );
};

const Services = () => {
  const { t } = useLanguage();
  const { mobileLayout, isMobile } = useSiteConfig();
  const items = t.services.items;

  if (isMobile && mobileLayout === 'cards') {
    return (
      <section id="servizi" className="py-20 px-6 bg-bg">
        <div className="mb-12">
          <h2 className="font-serif italic text-3xl text-muted">{t.services.overline}<br /><span className="text-text font-display not-italic uppercase text-5xl tracking-tighter">{t.services.title}</span></h2>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {items.map((s) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
              className="bg-surface border border-muted/20 p-6 rounded-xl">
              <span className="text-accent font-mono text-xs">{s.subtitle}</span>
              <h3 className="text-2xl font-display tracking-tighter mt-2 mb-3">{s.title}</h3>
              <p className="text-muted text-sm">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="servizi" className="py-32 relative z-20 bg-bg">
      <div className="px-6 md:px-12 mb-20">
        <h2 className="font-serif italic text-4xl md:text-6xl text-muted">{t.services.overline}<br /><span className="text-text font-display not-italic uppercase text-6xl md:text-8xl tracking-tighter">{t.services.title}</span></h2>
      </div>
      <div className="flex flex-col border-t border-muted/30">
        {items.map((s) => (
          <motion.div key={s.id} initial="initial" whileHover="hover" className="group relative border-b border-muted/30 px-6 md:px-12 py-12 md:py-20 overflow-hidden">
            <div className="absolute inset-0 bg-accent transform origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[0.25,1,0.5,1] z-0"></div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-12">
                <span className="font-sans font-bold text-sm text-muted group-hover:text-bg transition-colors duration-500">{s.id}</span>
                <h3 className="text-4xl md:text-7xl font-display text-text group-hover:text-bg transition-colors duration-500 tracking-tighter">{s.title}</h3>
              </div>
              <p className="font-sans text-lg md:text-xl max-w-md text-muted group-hover:text-bg transition-colors duration-500">{s.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const Portfolio = () => {
  const { t } = useLanguage();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const { mobileLayout, isMobile } = useSiteConfig();

  useEffect(() => {
    document.body.style.overflow = selectedProject ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [selectedProject]);

  // Escape key closes modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape' && selectedProject) setSelectedProject(null); };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject]);

  const isCards = isMobile && mobileLayout === 'cards';

  return (
    <section id="portfolio" ref={containerRef} className="py-32 px-6 md:px-12 bg-surface relative z-20">
      <div className="mb-24 flex flex-col md:flex-row justify-between items-end gap-8">
        <div>
          <span className="font-sans font-bold text-sm uppercase tracking-widest text-accent mb-4 block">{t.portfolio.overline}</span>
          <h2 className="text-6xl md:text-8xl font-display tracking-tighter">{t.portfolio.title}</h2>
        </div>
        <MagneticButton>
          <button className="flex items-center gap-4 text-xl font-serif italic hover:text-accent transition-colors">{t.portfolio.viewAll} <ArrowRight /></button>
        </MagneticButton>
      </div>
      <div className={isCards ? "grid grid-cols-1 gap-6" : "grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24"}>
        {portfolio.map((item, index) => (
          <motion.div key={item.id} style={!isCards ? { y: index % 2 === 0 ? y1 : y2 } : undefined}
            className={`group cursor-pointer ${!isCards && index % 2 !== 0 ? 'md:mt-32' : ''}`} onClick={() => setSelectedProject(item)}
            role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedProject(item); } }}>
            <div className={`relative overflow-hidden mb-4 md:mb-6 ${isCards ? 'aspect-video rounded-xl' : 'aspect-[3/2]'}`}>
              <div className="absolute inset-0 bg-accent mix-blend-multiply opacity-0 group-hover:opacity-40 transition-opacity duration-500 z-10"></div>
              <img src={item.thumb} alt={item.client} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" referrerPolicy="no-referrer" loading="lazy" decoding="async" />
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl md:text-3xl font-display tracking-tighter mb-1 group-hover:text-accent transition-colors">{item.client}</h3>
                <p className="font-serif italic text-muted text-lg md:text-xl">{item.project}</p>
              </div>
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-accent border border-accent px-3 py-1 rounded-full">{item.tech}</span>
            </div>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {selectedProject && (
          <motion.div role="dialog" aria-modal="true" aria-label={selectedProject.client} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-12 bg-bg/80 backdrop-blur-md" onClick={() => setSelectedProject(null)}>
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} onClick={(e) => e.stopPropagation()}
              className="bg-surface w-full h-full md:h-auto md:max-h-[90vh] md:max-w-[1536px] flex flex-col md:flex-row overflow-hidden md:rounded-2xl border border-muted/20">
              <div className="w-full md:w-[60%] h-[40vh] md:h-[80vh] relative overflow-hidden bg-black/90 flex items-center justify-center">
                <img src={selectedProject.image} alt={selectedProject.client} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-accent mix-blend-multiply opacity-10 pointer-events-none"></div>
              </div>
              <div className="w-full md:w-[40%] p-8 md:p-12 flex flex-col justify-center relative overflow-y-auto">
                <button autoFocus onClick={() => setSelectedProject(null)} aria-label="Close" className="absolute top-6 right-6 text-muted hover:text-accent transition-colors"><X size={32} aria-hidden="true" /></button>
                <span className="font-sans text-sm font-bold uppercase tracking-widest text-accent mb-4 block">{selectedProject.tech}</span>
                <h3 className="text-5xl md:text-7xl font-display tracking-tighter mb-2">{selectedProject.client}</h3>
                <p className="font-serif italic text-2xl text-muted mb-8">{selectedProject.project}</p>
                <p className="font-sans text-lg text-text/80 leading-relaxed mb-12">{t.portfolio.desc.replace('{client}', selectedProject.client).replace('{tech}', selectedProject.tech)}</p>
                <MagneticButton className="self-start">
                  <a href={selectedProject.url} target="_blank" rel="noopener noreferrer" className="font-display uppercase tracking-widest text-xl border-b-2 border-accent pb-2 hover:text-accent transition-colors flex items-center gap-4 group">
                    {t.portfolio.explore} <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                  </a>
                </MagneticButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const About = () => {
  const { t } = useLanguage();
  return (
    <section id="vision" className="py-32 px-6 md:px-12 bg-bg relative z-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <h2 className="text-6xl md:text-8xl font-display tracking-tighter text-outline-accent">{t.about.title1}</h2>
          <h2 className="text-6xl md:text-8xl font-display tracking-tighter">{t.about.title2}</h2>
        </div>
        <div className="md:col-span-8 md:pl-12">
          <TextReveal text={t.about.p1} className="font-serif italic text-3xl md:text-5xl leading-tight mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-muted font-sans text-lg">
            <TextReveal text={t.about.p2} />
            <TextReveal text={t.about.p3} />
          </div>
          <div className="mt-16 pt-8 border-t border-muted/30 flex items-center justify-between">
            <div>
              <p className="font-display text-2xl uppercase tracking-tighter text-text">Bertalan Iván</p>
              <p className="font-sans text-sm text-accent uppercase tracking-widest mt-1">{t.about.role}</p>
            </div>
            <div className="w-16 h-16 rounded-full border border-muted/50 flex items-center justify-center font-serif text-3xl text-accent/60">β</div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = ({ onOpenContact }: { onOpenContact: () => void }) => {
  const { t } = useLanguage();
  return (
    <footer className="bg-surface pt-32 pb-12 px-6 md:px-12 relative z-20 overflow-hidden">
      {/* Decorative β watermark */}
      <span className="absolute -right-20 -top-20 text-[40rem] font-serif leading-none text-muted/[0.04] pointer-events-none select-none" aria-hidden="true">β</span>
      <div className="marquee-container mb-32 -mx-6 md:-mx-12 border-y border-muted/20 py-4">
        <div className="marquee-content">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center">
              <span className="text-4xl md:text-6xl font-display uppercase tracking-tighter mx-8 text-outline">{t.footer.marquee1}</span>
              <span className="text-accent text-4xl">✦</span>
              <span className="text-4xl md:text-6xl font-display uppercase tracking-tighter mx-8">{t.footer.marquee2}</span>
              <span className="text-accent text-4xl">✦</span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-24">
        <div className="md:col-span-2">
          <h2 className="text-4xl font-display tracking-tighter mb-6 flex items-center gap-3">
            <span className="relative w-12 h-12 flex items-center justify-center">
              <span className="absolute inset-0 rounded-full border-2 border-accent/40"></span>
              <span className="font-serif text-3xl leading-none text-accent" aria-hidden="true">β</span>
            </span>
            BETA BI.
          </h2>
          <p className="text-muted font-serif italic text-xl max-w-sm">{t.footer.subtitle}</p>
        </div>
        <div>
          <h4 className="font-sans font-bold text-sm uppercase tracking-widest text-accent mb-6">{t.footer.social}</h4>
          <ul className="space-y-4 font-display text-xl tracking-tight">
            <li><a href="#" className="hover:text-accent transition-colors">LinkedIn</a></li>
            <li><a href="#" className="hover:text-accent transition-colors">GitHub</a></li>
            <li><a href="#" className="hover:text-accent transition-colors">Twitter</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-sans font-bold text-sm uppercase tracking-widest text-accent mb-6">{t.footer.contact}</h4>
          <ul className="space-y-4 font-display text-xl tracking-tight">
            <li><button onClick={onOpenContact} className="hover:text-accent transition-colors">hello@betabi.it</button></li>
            <li>+39 012 345 6789</li>
            <li className="text-muted">Milano, Italia</li>
          </ul>
        </div>
      </div>
      <div className="pt-8 border-t border-muted/30 flex flex-col md:flex-row items-center justify-between gap-4 font-sans text-xs uppercase tracking-widest text-muted">
        <p>&copy; {new Date().getFullYear()} Beta BI. P.IVA 12345678901.</p>
        <div className="flex gap-8">
          <button onClick={() => window.dispatchEvent(new CustomEvent('open-legal', { detail: 'privacy' }))} className="hover:text-text transition-colors">{t.footer.privacy}</button>
          <button onClick={() => window.dispatchEvent(new CustomEvent('open-legal', { detail: 'cookie' }))} className="hover:text-text transition-colors">{t.footer.cookie}</button>
        </div>
      </div>
    </footer>
  );
};

const ContactModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { t } = useLanguage();
  const firstInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => firstInputRef.current?.focus(), 700);
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  // Escape key closes modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen) onClose(); };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div role="dialog" aria-modal="true" initial={{ clipPath: 'inset(100% 0 0 0)' }} animate={{ clipPath: 'inset(0% 0 0 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
          className="fixed inset-0 z-[100] bg-accent text-bg flex flex-col overflow-y-auto">
          <div className="px-6 md:px-12 h-24 flex items-center justify-between shrink-0">
            <span className="relative w-10 h-10 flex items-center justify-center">
              <span className="absolute inset-0 rounded-full border border-current opacity-40"></span>
              <span className="font-serif text-2xl leading-none" aria-hidden="true">β</span>
            </span>
            <span className="font-display font-bold text-2xl tracking-tighter uppercase">Beta BI</span>
            <button onClick={onClose} aria-label="Close" className="hover:rotate-90 transition-transform duration-500"><X size={40} /></button>
          </div>
          <div className="flex-1 flex flex-col md:flex-row px-6 md:px-12 pb-12 gap-12 md:gap-24 items-center">
            <div className="w-full md:w-1/2">
              <h2 className="text-[18vw] md:text-[12vw] leading-[0.8] font-display tracking-tighter mb-6 text-bg">{t.contact.title}</h2>
              <p className="font-serif italic text-3xl md:text-5xl max-w-lg text-bg/80">{t.contact.subtitle}</p>
            </div>
            <div className="w-full md:w-1/2">
              <form className="flex flex-col gap-12 w-full max-w-xl">
                <div><label htmlFor="contact-name" className="sr-only">{t.contact.name}</label><input id="contact-name" ref={firstInputRef} type="text" placeholder={t.contact.name} className="w-full bg-transparent border-b-2 border-bg/30 pb-4 font-sans text-xl md:text-2xl placeholder:text-bg/50 text-bg focus:outline-none focus:border-bg transition-colors uppercase tracking-widest" /></div>
                <div><label htmlFor="contact-email" className="sr-only">{t.contact.email}</label><input id="contact-email" type="email" placeholder={t.contact.email} className="w-full bg-transparent border-b-2 border-bg/30 pb-4 font-sans text-xl md:text-2xl placeholder:text-bg/50 text-bg focus:outline-none focus:border-bg transition-colors uppercase tracking-widest" /></div>
                <div><label htmlFor="contact-project" className="sr-only">{t.contact.project}</label><textarea id="contact-project" placeholder={t.contact.project} rows={3} className="w-full bg-transparent border-b-2 border-bg/30 pb-4 font-sans text-xl md:text-2xl placeholder:text-bg/50 text-bg focus:outline-none focus:border-bg transition-colors uppercase tracking-widest resize-none"></textarea></div>
                <MagneticButton className="self-start">
                  <button type="button" className="font-display text-4xl md:text-5xl uppercase tracking-tighter hover:translate-x-4 transition-transform duration-300 flex items-center gap-4 text-bg">
                    {t.contact.send} <ArrowRight size={40} />
                  </button>
                </MagneticButton>
              </form>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function AgencyTemplate() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsHovering(!!(target.tagName.toLowerCase() === 'a' || target.tagName.toLowerCase() === 'button' || target.closest('a') || target.closest('button')));
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    return () => { window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('mouseover', handleMouseOver); };
  }, []);

  return (
    <div className="min-h-screen bg-bg text-text font-sans selection:bg-accent selection:text-bg relative overflow-x-hidden">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[999] focus:p-4 focus:bg-bg focus:text-accent">Skip to main content</a>
      <AnimatePresence mode="wait">
        {isLoading && <Preloader key="preloader" onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>
      <div className="noise-overlay" aria-hidden="true"></div>
      <div aria-hidden="true" className={`custom-cursor hidden md:block ${isHovering ? 'hovering' : ''}`} style={{ left: mousePos.x, top: mousePos.y }}></div>
      <Header onOpenContact={() => setIsContactOpen(true)} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <main id="main-content">
        <Hero isReady={!isLoading} />
        <Services />
        <Portfolio />
        <About />
      </main>
      <Footer onOpenContact={() => setIsContactOpen(true)} />
    </div>
  );
}
