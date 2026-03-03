export const SvgTransaction = () => (
  <svg viewBox="0 0 100 100" className="vital-svg w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true">
    <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" strokeDasharray="4 4" className="pulse-shape" />
    <polygon points="50,20 80,35 80,65 50,80 20,65 20,35" className="flow-line" />
    <circle cx="50" cy="50" r="10" className="pulse-shape" />
    <line x1="50" y1="10" x2="50" y2="40" className="flow-line" />
    <line x1="90" y1="30" x2="60" y2="45" className="flow-line" />
    <line x1="10" y1="30" x2="40" y2="45" className="flow-line" />
    <line x1="50" y1="90" x2="50" y2="60" className="flow-line" />
  </svg>
);

export const SvgAvailability = () => (
  <svg viewBox="0 0 100 100" className="vital-svg w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true">
    <rect x="20" y="20" width="60" height="15" className="pulse-shape" />
    <rect x="20" y="45" width="60" height="15" className="pulse-shape" />
    <rect x="20" y="70" width="60" height="15" className="pulse-shape" />
    <circle cx="30" cy="27.5" r="3" className="flow-line" />
    <circle cx="30" cy="52.5" r="3" className="flow-line" />
    <circle cx="30" cy="77.5" r="3" className="flow-line" />
    <line x1="45" y1="27.5" x2="70" y2="27.5" className="flow-line" />
    <line x1="45" y1="52.5" x2="70" y2="52.5" className="flow-line" />
    <line x1="45" y1="77.5" x2="70" y2="77.5" className="flow-line" />
    <path d="M10 50 Q 25 20 50 50 T 90 50" strokeDasharray="2 4" className="flow-line" />
  </svg>
);

export const SvgVPS = () => (
  <svg viewBox="0 0 100 100" className="vital-svg w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true">
    <polygon points="50,20 80,35 50,50 20,35" className="pulse-shape" />
    <polygon points="20,35 50,50 50,80 20,65" className="flow-line" />
    <polygon points="80,35 50,50 50,80 80,65" className="flow-line" />
    <line x1="50" y1="50" x2="50" y2="20" strokeDasharray="2 2" className="flow-line" />
    <line x1="20" y1="65" x2="80" y2="65" strokeDasharray="2 2" className="flow-line" />
    <rect x="40" y="40" width="20" height="20" transform="rotate(45 50 50)" className="pulse-shape" />
  </svg>
);

export const SvgCloud = () => (
  <svg viewBox="0 0 100 100" className="vital-svg w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true">
    <path d="M30 75 A20 20 0 0 0 20 60 A20 20 0 0 1 50 30 A25 25 0 0 1 80 50 A15 15 0 0 1 70 75 L30 75 Z" className="pulse-shape" />
    <rect x="40" y="45" width="20" height="15" className="flow-line" />
    <line x1="50" y1="60" x2="50" y2="90" className="flow-line" />
    <line x1="30" y1="90" x2="70" y2="90" className="flow-line" />
    <circle cx="30" cy="90" r="3" className="pulse-shape" />
    <circle cx="50" cy="90" r="3" className="pulse-shape" />
    <circle cx="70" cy="90" r="3" className="pulse-shape" />
  </svg>
);

export const SvgContent = () => (
  <svg viewBox="0 0 100 100" className="vital-svg w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true">
    <circle cx="50" cy="50" r="40" strokeDasharray="5 5" className="flow-line" />
    <circle cx="50" cy="50" r="15" className="pulse-shape" />
    <line x1="50" y1="10" x2="50" y2="35" className="flow-line" />
    <line x1="50" y1="65" x2="50" y2="90" className="flow-line" />
    <line x1="10" y1="50" x2="35" y2="50" className="flow-line" />
    <line x1="65" y1="50" x2="90" y2="50" className="flow-line" />
    <rect x="45" y="45" width="10" height="10" className="pulse-shape" />
  </svg>
);

export const serviceIcons: Record<string, React.FC> = {
  '01': SvgTransaction,
  '02': SvgAvailability,
  '03': SvgVPS,
  '04': SvgCloud,
  '05': SvgContent,
};
