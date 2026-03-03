import { motion, useScroll, useTransform, MotionValue } from 'motion/react';
import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { useLanguage } from '@/i18n';

export const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 600);
          return 100;
        }
        return p + Math.floor(Math.random() * 15) + 5;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading"
      initial={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[200] bg-bg flex flex-col items-center justify-center text-text"
    >
      <div className="font-display text-[20vw] tracking-tighter leading-none overflow-hidden text-accent">
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {Math.min(progress, 100)}%
        </motion.div>
      </div>
      <div className="absolute bottom-12 font-sans text-sm uppercase tracking-widest text-muted">
        {t.system.loading}
      </div>
    </motion.div>
  );
};

export const MagneticButton = ({ children, className = '', onClick }: { children: ReactNode, className?: string, onClick?: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.3, y: middleY * 0.3 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
      onClick={onClick}
      aria-hidden="true"
      style={{ display: 'inline-block' }}
    >
      {children}
    </motion.div>
  );
};

const Word = ({ children, progress, range }: { children: ReactNode, progress: MotionValue<number>, range: [number, number] }) => {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.25em] mt-[0.1em]">
      {children}
    </motion.span>
  );
};

export const TextReveal = ({ text, className = '' }: { text: string, className?: string }) => {
  const container = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 90%", "end 60%"]
  });
  const words = text.split(" ");

  return (
    <p ref={container} className={`flex flex-wrap ${className}`}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + (1 / words.length);
        return <Word key={i} progress={scrollYProgress} range={[start, end]}>{word}</Word>;
      })}
    </p>
  );
};

export const SpotlightCard = ({ children, className = "", bg = "bg-[#111]", style, initial, whileInView, viewport, transition }: any) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={divRef}
      initial={initial}
      whileInView={whileInView}
      viewport={viewport}
      transition={transition}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden border border-white/5 ${bg} ${className}`}
      style={style}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 z-20"
        style={{
          opacity,
          background: `radial-gradient(800px circle at ${position.x}px ${position.y}px, rgba(var(--theme-accent-rgb),0.12), transparent 40%)`,
        }}
      />
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 z-20 mix-blend-overlay"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.05), transparent 40%)`,
        }}
      />
      {children}
    </motion.div>
  );
};
