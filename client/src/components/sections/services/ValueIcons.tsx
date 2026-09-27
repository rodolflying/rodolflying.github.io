import { motion, type Variants } from 'framer-motion';

/**
 * Animated line icons for the value framework: light outline, one accent color and a soft
 * duotone fill. They draw themselves when the card scrolls into view ("show") and replay a
 * small motion on hover ("hover"); the card passes both states down as framer variants.
 */

const LINE = '#CBD5E1';
const SW = 2.5;

const draw = (delay = 0, duration = 0.9): Variants => ({
  hidden: { pathLength: 0, opacity: 0 },
  show: { pathLength: 1, opacity: 1, transition: { delay, duration, ease: 'easeInOut' } },
  hover: { pathLength: [0, 1], opacity: 1, transition: { duration: 0.7, ease: 'easeInOut' } },
});

const pop = (delay = 0): Variants => ({
  hidden: { scale: 0, opacity: 0 },
  show: { scale: 1, opacity: 1, transition: { delay, type: 'spring', stiffness: 260, damping: 16 } },
  hover: { scale: [1, 1.12, 1], transition: { duration: 0.5 } },
});

interface IconProps { color: string; className?: string }

const Svg = ({ className = 'w-16 h-16', children }: { className?: string; children: React.ReactNode }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

/** Efficiency: a clock whose hand races, wrapped by the arc of time given back. */
export const EfficiencyIcon = ({ color, className }: IconProps) => (
  <Svg className={className}>
    <circle cx="32" cy="35" r="19" fill={color} fillOpacity="0.14" />
    <motion.circle cx="32" cy="35" r="19" stroke={LINE} strokeWidth={SW} variants={draw(0)} />
    <motion.path d="M28 9h8M32 9v7" stroke={LINE} strokeWidth={SW} variants={draw(0.2, 0.4)} />
    {[0, 90, 180, 270].map((a) => (
      <line key={a} x1="32" y1="19.5" x2="32" y2="22" stroke={LINE} strokeWidth={SW} transform={`rotate(${a} 32 35)`} />
    ))}
    <line x1="32" y1="35" x2="32" y2="27" stroke={LINE} strokeWidth={SW} />
    {/* the invisible circle makes the group's box centred on the clock, so it spins around it */}
    <motion.g
      variants={{
        hidden: { rotate: -300 },
        show: { rotate: 0, transition: { duration: 1.2, ease: 'easeOut' } },
        // 360 looks like 0: reset right away so leaving the card doesn't spin it backwards
        hover: { rotate: [0, 360], transition: { duration: 0.9, ease: 'easeInOut' }, transitionEnd: { rotate: 0 } },
      }}
    >
      <circle cx="32" cy="35" r="19" stroke="none" />
      <line x1="32" y1="35" x2="42" y2="35" stroke={color} strokeWidth={SW + 0.5} />
    </motion.g>
    <circle cx="32" cy="35" r="2.2" fill={color} />
    <motion.path d="M11 24a23 23 0 0 1 8-10" stroke={color} strokeWidth={SW} variants={draw(0.5, 0.6)} />
    <motion.path d="M11 17v7h7" stroke={color} strokeWidth={SW} variants={draw(0.9, 0.3)} />
  </Svg>
);

/** Risk and compliance: a shield that fills with a check, with a pulse on hover. */
export const RiskIcon = ({ color, className }: IconProps) => {
  const shield = 'M32 8l18 6v15c0 12-7.5 20.5-18 26-10.5-5.5-18-14-18-26V14z';
  return (
    <Svg className={className}>
      <motion.circle
        cx="32" cy="32" r="22" stroke={color} strokeWidth="1.5"
        variants={{ hidden: { opacity: 0 }, show: { opacity: 0 }, hover: { opacity: [0.7, 0], scale: [0.85, 1.35], transition: { duration: 0.8 } } }}
      />
      <path d={shield} fill={color} fillOpacity="0.14" />
      <motion.path d={shield} stroke={LINE} strokeWidth={SW} variants={draw(0)} />
      <motion.path d="M23.5 31.5l6 6 11-12" stroke={color} strokeWidth={SW + 1} variants={draw(0.7, 0.5)} />
    </Svg>
  );
};

/** Decision capacity: a dashboard whose bars rise and a trend line that climbs. */
export const DecisionIcon = ({ color, className }: IconProps) => (
  <Svg className={className}>
    <rect x="7" y="11" width="50" height="35" rx="4" fill={color} fillOpacity="0.1" />
    <motion.rect x="7" y="11" width="50" height="35" rx="4" stroke={LINE} strokeWidth={SW} variants={draw(0)} />
    <motion.path d="M32 46v7M22 53h20" stroke={LINE} strokeWidth={SW} variants={draw(0.3, 0.4)} />
    {[
      { x: 15, h: 8, d: 0.4 },
      { x: 25, h: 13, d: 0.5 },
      { x: 35, h: 18, d: 0.6 },
    ].map((b) => (
      <motion.rect
        key={b.x} x={b.x} y={40 - b.h} width="6" height={b.h} rx="1" fill={color} fillOpacity="0.55"
        style={{ originY: 1 }}
        variants={{
          hidden: { scaleY: 0 },
          show: { scaleY: 1, transition: { delay: b.d, duration: 0.5, ease: 'easeOut' } },
          hover: { scaleY: [1, 0.3, 1], transition: { duration: 0.6, delay: b.d - 0.4 } },
        }}
      />
    ))}
    <motion.path d="M14 30l9-6 8 3 14-10" stroke={color} strokeWidth={SW} variants={draw(0.8, 0.6)} />
    <motion.path d="M40 17h5v5" stroke={color} strokeWidth={SW} variants={draw(1.3, 0.2)} />
  </Svg>
);

/** Avoided cost: a tall stack of licence coins next to a short own-software stack. */
export const CostIcon = ({ color, className }: IconProps) => (
  <Svg className={className}>
    {[44, 38, 32, 26, 20].map((y, i) => (
      <motion.rect key={y} x="10" y={y} width="20" height="6" rx="3" stroke={LINE} strokeWidth={SW - 0.5} variants={draw(0.1 * i, 0.4)} />
    ))}
    {[44, 38].map((y, i) => (
      <motion.rect
        key={y} x="36" y={y} width="20" height="6" rx="3" fill={color} fillOpacity="0.3" stroke={color} strokeWidth={SW - 0.5}
        variants={pop(0.6 + 0.12 * i)}
      />
    ))}
    <motion.path d="M22 13c8-7 18-5 23 11" stroke={color} strokeWidth={SW} variants={draw(0.9, 0.5)} />
    <motion.path d="M41 21l4 4 4-4" stroke={color} strokeWidth={SW} variants={draw(1.3, 0.25)} />
  </Svg>
);
