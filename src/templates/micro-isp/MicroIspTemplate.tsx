import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { ArrowRight, Zap, X, Globe, CheckCircle2 } from 'lucide-react';
import { serviceIcons } from '@/components/Icons';
import { SpotlightCard } from '@/components/Effects';
import { useLanguage } from '@/i18n';
import { useSiteConfig } from '@/contexts/SiteConfigContext';

const portfolio = [
  { id: 1, client: 'Vroom Vroom Accessories', project: 'E-commerce Accessori Moto', tech: 'WordPress / WooCommerce', thumb: '/portfolio/vroomvroom-thumb.webp', image: '/portfolio/vroomvroom.webp', url: 'https://vroomvroomaccessories.com' },
  { id: 2, client: 'Studio Legale Donofrio', project: 'Sito Corporate Studio Legale', tech: 'Custom / Wagtail CMS', thumb: '/portfolio/studiolegale-thumb.webp', image: '/portfolio/studiolegale.webp', url: 'https://studiolegaledonofrio.it' },
  { id: 3, client: 'Magix Promotion', project: 'Portale Agenzia Musicale', tech: 'Wagtail / React', thumb: '/portfolio/magixpromotion-thumb.webp', image: '/portfolio/magixpromotion.webp', url: 'https://new.magixpromotion.com' },
  { id: 4, client: 'Gemmologia.net', project: 'Portale Formazione Gemmologica', tech: 'jQuery / Custom', thumb: '/portfolio/gemmologia-thumb.webp', image: '/portfolio/gemmologia.webp', url: 'https://gemmologia.net' },
  { id: 5, client: 'MC Castellazzo Bormida', project: 'Sito Moto Club Storico', tech: 'Wagtail / React', thumb: '/portfolio/mccastellazzob-thumb.webp', image: '/portfolio/mccastellazzob.webp', url: 'https://new.mccastellazzob.com/it' },
];

const getMarginLeft = (index: number) => {
  const margins = ['md:ml-0', 'md:ml-[10%]', 'md:ml-[20%]', 'md:ml-[30%]', 'md:ml-[40%]'];
  return margins[index] || 'md:ml-0';
};

export default function MicroIspTemplate() {
  const { t, lang, setLang } = useLanguage();
  const { mobileLayout, isMobile } = useSiteConfig();

  const containerRef = useRef(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<typeof portfolio[number] | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const items = t.services.items;
  const selectedService = selectedServiceId ? items.find(s => s.id === selectedServiceId) : null;
  const SelectedIcon = selectedService ? serviceIcons[selectedService.id] : null;

  useEffect(() => {
    document.body.style.overflow = (selectedServiceId || selectedProject || isFormOpen) ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedServiceId, selectedProject, isFormOpen]);

  // Escape key closes modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFormOpen) { setIsFormOpen(false); }
        else if (selectedProject) { setSelectedProject(null); }
        else if (selectedServiceId) { setSelectedServiceId(null); }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFormOpen, selectedProject, selectedServiceId]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    setTimeout(() => {
      setFormStatus('success');
      setTimeout(() => { setIsFormOpen(false); setFormStatus('idle'); setSelectedServiceId(null); }, 2500);
    }, 1500);
  };

  const compactHero = isMobile && mobileLayout === 'compact';
  const isCards = isMobile && mobileLayout === 'cards';

  return (
    <div className="relative min-h-screen bg-bg text-text overflow-hidden" ref={containerRef}>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-accent focus:text-bg focus:font-mono focus:text-sm focus:uppercase focus:tracking-widest">Skip to main content</a>
      <div className="noise" aria-hidden="true"></div>

      {/* Navigation */}
      <header>
      <nav aria-label="Main navigation" className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-40 mix-blend-difference">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-2xl font-bold tracking-tighter flex items-center gap-2">
          <span className="relative inline-flex items-center justify-center w-9 h-9">
            <span className="absolute inset-0 rounded-full border border-accent/50 shadow-[0_0_12px_rgba(var(--theme-accent-rgb),0.3)]"></span>
            <span className="font-serif text-xl leading-none text-accent drop-shadow-[0_0_6px_rgba(var(--theme-accent-rgb),0.5)]" aria-hidden="true">β</span>
          </span>
          BETA<span className="text-accent">BI</span><span className="text-accent">.</span>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono text-xs uppercase tracking-widest hidden md:flex gap-8 items-center">
          <a href="#services" className="hover:text-accent transition-colors">{t.nav.services}</a>
          <a href="#portfolio" className="hover:text-accent transition-colors">{t.nav.portfolio}</a>
          <a href="#contact" className="hover:text-accent transition-colors">{t.nav.contact}</a>
          <div className="flex items-center gap-2 ml-4 border-l border-white/20 pl-4">
            <button onClick={() => setLang('it')} aria-label="Lingua italiana" className={`transition-colors ${lang === 'it' ? 'text-accent font-bold' : 'text-gray-500 hover:text-white'}`}>IT</button>
            <span className="text-gray-600" aria-hidden="true">/</span>
            <button onClick={() => setLang('en')} aria-label="English language" className={`transition-colors ${lang === 'en' ? 'text-accent font-bold' : 'text-gray-500 hover:text-white'}`}>EN</button>
          </div>
        </motion.div>
        {/* Mobile nav */}
        <div className="md:hidden flex items-center gap-4">
          <button onClick={() => setLang(lang === 'it' ? 'en' : 'it')} aria-label={lang === 'it' ? 'Switch to English' : 'Passa all\'italiano'} className="font-mono text-xs uppercase tracking-widest">
            <Globe className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </nav>
      </header>

      <main id="main-content">
      {/* Hero Section */}
      <section className={`relative flex flex-col md:justify-center px-6 md:px-12 lg:px-24 ${compactHero ? 'min-h-[75vh] pt-20' : 'min-h-screen pt-24'}`}>
        {/* Decorative β watermark */}
        <span className="absolute right-[-8vw] top-[10%] text-[45vw] md:text-[30vw] font-serif leading-none text-accent/[0.03] pointer-events-none select-none" aria-hidden="true">β</span>
        <div className="bg-grid" aria-hidden="true"></div>
        <div className="sui-blob sui-blob-1" aria-hidden="true"></div>
        <div className="sui-blob sui-blob-2" aria-hidden="true"></div>
        <div className="relative z-10 max-w-6xl">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} className="flex items-center gap-4 mb-8">
            <div className="w-12 h-[1px] bg-accent"></div>
            <span className="font-mono text-sm tracking-widest text-accent uppercase">{t.hero.badge}</span>
          </motion.div>
          <h1 className={`font-display font-black tracking-[-0.05em] md:tracking-tighter uppercase flex flex-col leading-[0.85] ${compactHero ? 'text-[8vw] md:text-[4.8rem] lg:text-[7.2rem]' : 'text-[9.6vw] md:text-[4.8rem] lg:text-[7.2rem]'}`}>
            <div className="overflow-hidden text-reveal-clip py-2">
              <motion.span className="block" initial={{ y: "100%", opacity: 0 }} animate={{ y: "0%", opacity: 1 }} transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}>{t.hero.title1}</motion.span>
            </div>
            <div className="overflow-hidden text-reveal-clip py-2">
              <motion.span className="block text-outline" initial={{ y: "100%", opacity: 0 }} animate={{ y: "0%", opacity: 1 }} transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}>{t.hero.title2}</motion.span>
            </div>
            <div className="overflow-hidden text-reveal-clip py-2">
              <motion.span className="block" initial={{ y: "100%", opacity: 0 }} animate={{ y: "0%", opacity: 1 }} transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}>{t.hero.title3}</motion.span>
            </div>
          </h1>
          <motion.div className="mt-12 flex flex-col md:flex-row gap-8 md:items-end justify-between" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}>
            <p className="font-mono text-sm md:text-base max-w-md text-gray-400 leading-relaxed">{t.hero.desc}</p>
            <a href="#services" className="group relative inline-flex items-center justify-center px-8 py-4 font-mono text-sm font-bold uppercase tracking-widest text-bg bg-accent overflow-hidden">
              <span className="relative flex items-center gap-3">{t.hero.cta} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
            </a>
          </motion.div>
        </div>
        <motion.div aria-hidden="true" className="absolute right[-10vw] top-1/4 w-[50vw] h-[50vw] rounded-full border border-accent/20 mix-blend-screen pointer-events-none hidden lg:block"
          style={{ y, opacity }} animate={{ scale: [1, 1.05, 1], rotate: [0, 90, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
          <div className="absolute inset-10 rounded-full border border-accent/10 border-dashed"></div>
          <div className="absolute inset-20 rounded-full border border-accent/5"></div>
        </motion.div>
      </section>

      {/* Marquee */}
      <div className="marquee-container my-24">
        <div className="marquee-content font-display text-4xl md:text-6xl font-black uppercase tracking-tighter">
          {[...t.marquee, ...t.marquee].map((text, i) => (
            <span key={i} className="flex items-center"><span className="mx-8">{text}</span><span className="mx-8 text-outline-accent text-bg">✦</span></span>
          ))}
        </div>
      </div>

      {/* Services Section */}
      <section id="services" className="py-32 px-6 md:px-12 lg:px-24 relative overflow-hidden">
        <div className="bg-mesh-2"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} className="mb-32 md:mb-48">
            <h2 className="font-display text-6xl md:text-8xl lg:text-[10rem] font-black uppercase tracking-tighter leading-[0.85]">
              {t.why.title1} <br /><span className="text-outline-accent text-bg">{t.why.title2}</span>
            </h2>
            <p className="font-mono text-gray-400 max-w-xl mt-8 text-sm md:text-base">{t.why.desc}</p>
          </motion.div>

          {isCards ? (
            <div className="grid grid-cols-1 gap-4">
              {items.map((item) => {
                const Icon = serviceIcons[item.id];
                return (
                  <motion.div key={item.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
                    className="bg-surface border border-white/10 p-6 rounded-xl relative overflow-hidden" onClick={() => setSelectedServiceId(item.id)}>
                    <div className="absolute top-4 right-4 w-12 h-12 text-white/10">{Icon && <Icon />}</div>
                    <span className="font-mono text-xs text-accent uppercase tracking-widest">{item.subtitle}</span>
                    <h3 className="font-display text-2xl font-bold uppercase tracking-tight mt-2 mb-3">{item.title}</h3>
                    <p className="font-mono text-sm text-gray-400">{item.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col relative">
              {items.map((item, i) => {
                const Icon = serviceIcons[item.id];
                return (
                  <SpotlightCard key={item.id}
                    initial={{ opacity: 0, y: 100, rotate: -2 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, delay: 0.1 }}
                    bg={item.bg} className={`w-full md:w-[60%] p-8 pb-16 md:p-12 md:pb-24 shadow-2xl group hover:z-50 transition-all duration-500 diagonal-stripes ${getMarginLeft(i)} ${i !== 0 ? '-mt-8 md:-mt-20' : ''}`}>
                    <div className="absolute top-0 right-0 p-6 font-display text-7xl md:text-9xl font-black text-white/5 group-hover:text-accent/10 transition-colors duration-500 pointer-events-none z-0">{item.id}</div>
                    <div className="absolute bottom-10 right-10 w-32 h-32 md:w-48 md:h-48 text-white/5 transition-all duration-500 pointer-events-none z-0 group-hover:scale-110">{Icon && <Icon />}</div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                      <div>
                        <div className="font-mono text-xs text-accent uppercase tracking-widest mb-4 flex items-center gap-3"><span className="w-8 h-[1px] bg-accent"></span>{item.subtitle}</div>
                        <h3 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight mb-6 group-hover:text-accent transition-colors duration-300">{item.title}</h3>
                        <p className="font-mono text-sm md:text-base text-gray-400 max-w-md leading-relaxed">{item.desc}</p>
                      </div>
                      <button onClick={() => setSelectedServiceId(item.id)} className="mt-12 flex items-center gap-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 cursor-pointer w-fit relative z-40">
                        <div className="w-10 h-10 rounded-full border border-accent flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-bg transition-colors duration-300"><ArrowRight className="w-4 h-4" /></div>
                        <span className="font-mono text-xs uppercase tracking-widest text-accent">{t.modal.explore}</span>
                      </button>
                    </div>
                    <div className="absolute bottom-0 left-0 w-0 h-1 bg-accent group-hover:w-full transition-all duration-700 ease-out z-30"></div>
                    <div className="absolute top-0 left-0 w-1 h-0 bg-accent group-hover:h-full transition-all duration-700 ease-out delay-100 z-30"></div>
                  </SpotlightCard>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-32 px-6 md:px-12 lg:px-24 relative overflow-hidden">
        <div className="bg-grid" aria-hidden="true"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="mb-16 md:mb-24">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-[1px] bg-accent"></div>
              <span className="font-mono text-xs text-accent uppercase tracking-widest">{t.portfolio.overline}</span>
            </div>
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.85]">
              {t.portfolio.title}
            </h2>
          </motion.div>

          <div className={isCards ? 'grid grid-cols-1 gap-6' : 'grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8'}>
            {portfolio.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.12 }}
                onClick={() => setSelectedProject(item)}
                className="group cursor-pointer relative bg-surface border border-white/10 overflow-hidden hover:border-accent/40 transition-all duration-500"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={item.thumb}
                    alt={item.client}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-bg/40 group-hover:bg-bg/0 transition-all duration-500" />
                  <div className="absolute top-4 right-4 font-display text-5xl font-black text-white/10 pointer-events-none">{String(item.id).padStart(2, '0')}</div>
                </div>
                <div className="p-6 relative">
                  <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-accent group-hover:w-full transition-all duration-700 ease-out" />
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-display text-xl md:text-2xl font-bold uppercase tracking-tight group-hover:text-accent transition-colors duration-300">{item.client}</h3>
                      <p className="font-mono text-xs text-gray-500 mt-1">{item.project}</p>
                    </div>
                    <span className="shrink-0 font-mono text-[10px] text-accent uppercase tracking-widest border border-accent/30 px-3 py-1">{item.tech}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 px-6 md:px-12 lg:px-24 bg-accent text-bg clip-diagonal relative z-20 mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 className="font-display text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 leading-[0.9]">{t.stats.title1}<br />{t.stats.title2}<br />{t.stats.title3}</h2>
            <p className="font-mono font-medium max-w-md mb-8">{t.stats.desc}</p>
            <ul className="font-mono text-sm space-y-4 font-bold">
              {t.stats.items.map((item, i) => (<li key={i} className="flex items-center gap-3"><Zap className="w-5 h-5" /> {item}</li>))}
            </ul>
          </motion.div>
          <div className="grid grid-cols-2 gap-4">
            {t.stats.numbers.map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-bg text-text p-8 flex flex-col justify-center items-center text-center aspect-square">
                <div className="font-display text-4xl md:text-5xl font-black text-accent mb-2">{stat.value}</div>
                <div className="font-mono text-xs uppercase tracking-widest text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="pt-32 pb-12 px-6 md:px-12 lg:px-24 border-t border-white/10 mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-24">
            <div className="lg:col-span-2">
              <h2 className="font-display text-4xl font-black uppercase tracking-tighter mb-6">{t.footer.title}</h2>
              <p className="font-mono text-sm text-gray-400 max-w-sm mb-8">{t.footer.desc}</p>
              <a href="mailto:posta@betabi.it" className="inline-block font-display text-3xl md:text-5xl font-bold hover:text-accent transition-colors">posta@betabi.it</a>
            </div>
            <div>
              <h4 className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-6">{t.footer.hq}</h4>
              <address className="font-mono text-sm not-italic text-gray-300 space-y-2">
                <p>Via Rimini 6g</p><p>15048 Valenza (AL), IT</p><p>+39 347 806 3221</p>
              </address>
            </div>
            <div>
              <h4 className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-6">{t.footer.social}</h4>
              <ul className="font-mono text-sm text-gray-300 space-y-2">
                <li><a href="#" className="hover:text-accent transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Twitter / X</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">GitHub</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 font-mono text-xs text-gray-500">
            <p>&copy; {new Date().getFullYear()} Beta BI. {t.footer.rights}</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <button onClick={() => window.dispatchEvent(new CustomEvent('open-legal', { detail: 'privacy' }))} className="hover:text-white transition-colors">{t.footer.privacy}</button>
              <button onClick={() => window.dispatchEvent(new CustomEvent('open-legal', { detail: 'cookie' }))} className="hover:text-white transition-colors">{t.footer.cookie}</button>
            </div>
          </div>
        </div>
      </footer>
      </main>

      {/* Portfolio Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-black/80 backdrop-blur-md" onClick={() => setSelectedProject(null)} role="dialog" aria-modal="true">
            <motion.div initial={{ scale: 0.95, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 20, opacity: 0 }} transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-[1230px] max-h-[90vh] md:max-h-[85vh] bg-bg border border-accent/30 shadow-[0_0_50px_rgba(var(--theme-accent-rgb),0.1)] overflow-hidden flex flex-col md:flex-row" onClick={(e) => e.stopPropagation()}>
              <div className="bg-grid opacity-50 absolute inset-0 pointer-events-none"></div>
              <button onClick={() => setSelectedProject(null)} aria-label="Close" className="absolute top-4 right-4 md:top-6 md:right-6 text-gray-500 hover:text-accent transition-colors z-50 bg-bg/80 md:bg-transparent backdrop-blur-md md:backdrop-blur-none rounded-full p-2 md:p-1 border border-white/10 md:border-transparent"><X className="w-5 h-5 md:w-8 md:h-8" aria-hidden="true" /></button>

              {/* Left panel — screenshot */}
              <div className="relative w-full md:w-[62%] border-b md:border-b-0 md:border-r border-accent/20 overflow-hidden bg-[#0a0a12] flex items-center justify-center h-[250px] md:h-auto shrink-0">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.client}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg/40 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-bg/20 pointer-events-none" />
              </div>

              {/* Right panel — info */}
              <div className="relative w-full md:w-[38%] p-6 md:p-8 flex flex-col justify-center overflow-y-auto">
                <div className="relative z-10">
                  <div className="font-mono text-xs text-accent uppercase tracking-widest mb-4 flex items-center gap-3"><span className="w-8 h-[1px] bg-accent"></span>{selectedProject.tech}</div>
                  <h3 className="font-display text-3xl md:text-5xl font-bold uppercase tracking-tight mb-2 text-white">{selectedProject.client}</h3>
                  <p className="font-mono text-sm text-gray-400 mb-6">{selectedProject.project}</p>
                  <div className="border-t border-accent/20 pt-6 mb-8">
                    <p className="font-mono text-sm text-gray-300 leading-relaxed">
                      {t.portfolio.desc
                        .replace('{client}', selectedProject.client)
                        .replace('{tech}', selectedProject.tech)}
                    </p>
                  </div>
                  <a href={selectedProject.url} target="_blank" rel="noopener noreferrer" className="group relative inline-flex items-center justify-center px-8 py-4 font-mono text-sm font-bold uppercase tracking-widest text-bg bg-accent overflow-hidden w-fit">
                    <span className="relative flex items-center gap-3">{t.portfolio.explore} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Service Detail Modal */}
      <AnimatePresence>
        {selectedService && !isFormOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-black/80 backdrop-blur-md" onClick={() => setSelectedServiceId(null)} role="dialog" aria-modal="true">
            <motion.div initial={{ scale: 0.95, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 20, opacity: 0 }} transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-4xl max-h-[90vh] md:max-h-[80vh] bg-bg border border-accent/30 shadow-[0_0_50px_rgba(var(--theme-accent-rgb),0.1)] overflow-hidden flex flex-col md:flex-row" onClick={(e) => e.stopPropagation()}>
              <div className="bg-grid opacity-50 absolute inset-0 pointer-events-none"></div>
              <button onClick={() => setSelectedServiceId(null)} aria-label="Close" className="absolute top-4 right-4 md:top-6 md:right-6 text-gray-500 hover:text-accent transition-colors z-50 bg-bg/80 md:bg-transparent backdrop-blur-md md:backdrop-blur-none rounded-full p-2 md:p-1 border border-white/10 md:border-transparent"><X className="w-5 h-5 md:w-8 md:h-8" aria-hidden="true" /></button>
              <div className="relative w-full md:w-2/5 p-8 md:p-12 bg-accent/5 flex items-center justify-center border-b md:border-b-0 md:border-r border-accent/20 modal-active-svg h-[250px] md:h-auto shrink-0">
                <div className="w-32 h-32 md:w-48 md:h-48 drop-shadow-[0_0_15px_rgba(var(--theme-accent-rgb),0.5)]">{SelectedIcon && <SelectedIcon />}</div>
                <div className="absolute top-4 left-4 font-display text-5xl md:text-6xl font-black text-accent/10">{selectedService.id}</div>
              </div>
              <div className="relative w-full md:w-3/5 p-6 md:p-12 flex flex-col justify-center overflow-y-auto">
                <div className="relative z-10">
                  <div className="font-mono text-xs text-accent uppercase tracking-widest mb-4 flex items-center gap-3"><span className="w-8 h-[1px] bg-accent"></span>{selectedService.subtitle}</div>
                  <h3 className="font-display text-3xl md:text-5xl font-bold uppercase tracking-tight mb-4 md:mb-6 text-white pr-8 md:pr-0">{selectedService.title}</h3>
                  <p className="font-mono text-sm md:text-base text-gray-300 leading-relaxed mb-8">{selectedService.details}</p>
                  <button onClick={() => setIsFormOpen(true)} className="group relative inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 font-mono text-sm font-bold uppercase tracking-widest text-bg bg-accent overflow-hidden w-fit">
                    <span className="relative flex items-center gap-3">{t.modal.setup} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Form Modal */}
      <AnimatePresence>
        {isFormOpen && selectedService && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-12 bg-black/90 backdrop-blur-md" onClick={() => setIsFormOpen(false)} role="dialog" aria-modal="true">
            <motion.div initial={{ scale: 0.95, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 20, opacity: 0 }} transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-2xl bg-bg border border-accent/30 shadow-[0_0_50px_rgba(var(--theme-accent-rgb),0.15)] overflow-hidden max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="bg-grid opacity-30 absolute inset-0 pointer-events-none"></div>
              <button onClick={() => setIsFormOpen(false)} aria-label="Close" className="absolute top-4 right-4 md:top-6 md:right-6 text-gray-500 hover:text-accent transition-colors z-50 bg-bg/80 md:bg-transparent backdrop-blur-md md:backdrop-blur-none rounded-full p-2 md:p-1 border border-white/10 md:border-transparent"><X className="w-5 h-5 md:w-8 md:h-8" aria-hidden="true" /></button>
              <div className="overflow-y-auto p-6 pt-16 md:p-12 flex-1">
                {formStatus === 'success' ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center py-12 relative z-10">
                    <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mb-6 text-accent"><CheckCircle2 className="w-10 h-10" /></div>
                    <h3 className="font-display text-3xl font-bold uppercase tracking-tight text-white mb-4">{t.form.success}</h3>
                  </motion.div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="relative z-10 flex flex-col gap-6">
                    <div>
                      <h3 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-white mb-2">{t.form.title}</h3>
                      <p className="font-mono text-sm text-gray-400">{t.form.desc}</p>
                    </div>
                    <div className="mt-4"><label htmlFor="form-service" className="form-label">{t.form.service}</label><input id="form-service" type="text" value={selectedService.title} readOnly className="form-input text-accent border-accent/50" /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div><label htmlFor="form-name" className="form-label">{t.form.name}</label><input id="form-name" type="text" required className="form-input" autoFocus /></div>
                      <div><label htmlFor="form-email" className="form-label">{t.form.email}</label><input id="form-email" type="email" required className="form-input" /></div>
                    </div>
                    <div><label htmlFor="form-company" className="form-label">{t.form.company}</label><input id="form-company" type="text" className="form-input" /></div>
                    <div><label htmlFor="form-message" className="form-label">{t.form.message}</label><textarea id="form-message" required rows={4} className="form-input resize-none"></textarea></div>
                    <div className="mt-4 flex justify-end">
                      <button type="submit" disabled={formStatus === 'submitting'} className="group relative inline-flex items-center justify-center px-8 py-4 font-mono text-sm font-bold uppercase tracking-widest text-bg bg-accent overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed">
                        <span className="relative flex items-center gap-3">{formStatus === 'submitting' ? t.form.sending : t.form.send} {formStatus !== 'submitting' && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
