import { useEffect, useRef } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useReducedMotion,
  easeInOut,
  type MotionValue,
} from 'framer-motion';
import { FileSpreadsheet, Database, Mail, Globe, FileText, MessageCircle, Boxes, type LucideIcon } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import starAppsLogo from '@assets/START_APPS_LOGO-removebg-preview.png';

/**
 * Scroll-driven brand story: scattered tools (the "dots") that a team connects by hand
 * get pulled, one after another, into orbit around Star Apps and wired into a single
 * automated flow. Positions are percentages of the square stage; movement uses
 * transforms (GPU) and a spring on the scroll progress for smoothness.
 */

interface Dot {
  key: string;
  icon: LucideIcon;
  label: { es: string; en: string };
  chaos: [number, number, number]; // x%, y%, rotation
}

// Ordered by the angle of their scattered position so each one flies to the nearest
// orbit slot and no two paths cross.
const DOTS: Dot[] = [
  { key: 'db', icon: Database, label: { es: 'Base de datos', en: 'Database' }, chaos: [44, 8, 6] },
  { key: 'erp', icon: Boxes, label: { es: 'ERP / SAP', en: 'ERP / SAP' }, chaos: [80, 14, 10] },
  { key: 'mail', icon: Mail, label: { es: 'Correo', en: 'Email' }, chaos: [88, 58, -8] },
  { key: 'portal', icon: Globe, label: { es: 'Portales web', en: 'Web portals' }, chaos: [62, 86, 12] },
  { key: 'pdf', icon: FileText, label: { es: 'PDF', en: 'PDF' }, chaos: [22, 80, 16] },
  { key: 'whatsapp', icon: MessageCircle, label: { es: 'WhatsApp', en: 'WhatsApp' }, chaos: [8, 52, -10] },
  { key: 'excel', icon: FileSpreadsheet, label: { es: 'Excel', en: 'Excel' }, chaos: [14, 20, -14] },
];

const ORBIT_RADIUS = 36;
const ORBIT = DOTS.map((_, i) => {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / DOTS.length;
  return [50 + Math.cos(a) * ORBIT_RADIUS, 50 + Math.sin(a) * ORBIT_RADIUS] as [number, number];
});

// Each tool travels in its own window of the scroll so they arrive in a cascade.
const TRAVEL_START = 0.18;
const TRAVEL_STAGGER = 0.035;
const TRAVEL_LENGTH = 0.32;
const windowOf = (i: number) => {
  const start = TRAVEL_START + i * TRAVEL_STAGGER;
  return [start, start + TRAVEL_LENGTH] as const;
};

// Hand-made "copy & paste" jumps shown only while things are still chaotic.
// Indexes into DOTS: excel-mail, erp-pdf, whatsapp-portal, db-mail, excel-portal.
const MANUAL_LINKS: Array<[number, number]> = [
  [6, 2], [1, 4], [5, 3], [0, 2], [6, 3],
];

interface DotMotion {
  px: MotionValue<number>;
  py: MotionValue<number>;
}

/** Positions (0..100) for every dot. DOTS is a constant array, so the hook order is stable. */
function useDotPositions(progress: MotionValue<number>): DotMotion[] {
  return DOTS.map((dot, i) => {
    const [start, end] = windowOf(i);
    const [cx, cy] = dot.chaos;
    const [ox, oy] = ORBIT[i];
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const px = useTransform(progress, [start, end], [cx, ox], { ease: easeInOut });
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const py = useTransform(progress, [start, end], [cy, oy], { ease: easeInOut });
    return { px, py };
  });
}

const MovingDot = ({
  dot,
  index,
  motionPos,
  stage,
  progress,
  language,
}: {
  dot: Dot;
  index: number;
  motionPos: DotMotion;
  stage: MotionValue<number>;
  progress: MotionValue<number>;
  language: 'es' | 'en';
}) => {
  const [start, end] = windowOf(index);
  const x = useTransform([motionPos.px, stage], ([p, s]: number[]) => (p / 100) * s);
  const y = useTransform([motionPos.py, stage], ([p, s]: number[]) => (p / 100) * s);
  const rotate = useTransform(progress, [start, end], [dot.chaos[2], 0], { ease: easeInOut });
  const border = useTransform(progress, [end - 0.06, end], ['rgba(255,122,133,0.55)', 'rgba(71,229,194,0.75)']);
  const Icon = dot.icon;

  return (
    <motion.div className="absolute left-0 top-0 z-10 will-change-transform" style={{ x, y }}>
      <motion.div className="-translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5" style={{ rotate }}>
        <motion.div
          className="float-slow w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-night-800 flex items-center justify-center border-2 shadow-lg"
          style={{ borderColor: border, animationDelay: `${index * -0.7}s` }}
        >
          <Icon className="w-6 h-6 text-slate-100" />
        </motion.div>
        <span className="text-xs sm:text-sm font-medium text-slate-200 whitespace-nowrap">{dot.label[language]}</span>
      </motion.div>
    </motion.div>
  );
};

const Wire = ({ index, progress }: { index: number; progress: MotionValue<number> }) => {
  const [, end] = windowOf(index);
  const pathLength = useTransform(progress, [end - 0.02, end + 0.1], [0, 1]);
  const [x, y] = ORBIT[index];
  return (
    <motion.line x1="50" y1="50" x2={x} y2={y} stroke="#47E5C2" strokeWidth="0.45" strokeLinecap="round" style={{ pathLength }} />
  );
};

const ConnectDotsSection = () => {
  const { t, language } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.35, restDelta: 0.0005 });
  // With reduced motion, jump straight to the connected state.
  const progress = useTransform(smooth, (v) => (reduceMotion ? 1 : v));

  // Stage size in px, so percentages can be turned into transforms.
  const stage = useMotionValue(0);
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => stage.set(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, [stage]);

  const positions = useDotPositions(progress);

  const manualOpacity = useTransform(progress, [0.05, 0.22, 0.4], [0.9, 0.9, 0]);
  const hubScale = useTransform(progress, [0.25, 0.55], [0.7, 1], { ease: easeInOut });
  const hubGlow = useTransform(progress, [0.55, 0.85], [0, 1]);
  const beforeOpacity = useTransform(progress, [0, 0.2, 0.32], [1, 1, 0]);
  const afterOpacity = useTransform(progress, [0.52, 0.66], [0, 1]);
  const pulsesOpacity = useTransform(progress, [0.82, 0.9], [0, 1]);

  return (
    <section id="puntos" ref={sectionRef} className="relative h-[260vh] bg-night">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden starfield">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-8 items-center">
          {/* Story text */}
          <div className="lg:col-span-5 relative min-h-[220px] sm:min-h-[260px]">
            <p className="text-sm font-semibold text-gold tracking-widest mb-3">{t('dots.badge')}</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">{t('dots.title')}</h2>
            <div className="relative">
              <motion.div style={{ opacity: beforeOpacity }} className="absolute inset-0">
                <p className="text-lg font-semibold text-[#FF9AA4] mb-2">{t('dots.before_title')}</p>
                <p className="text-slate-300 text-base sm:text-lg leading-relaxed">{t('dots.before_text')}</p>
              </motion.div>
              <motion.div style={{ opacity: afterOpacity }}>
                <p className="text-lg font-semibold text-star mb-2">{t('dots.after_title')}</p>
                <p className="text-slate-300 text-base sm:text-lg leading-relaxed">{t('dots.after_text')}</p>
              </motion.div>
            </div>
          </div>

          {/* Stage */}
          <div className="lg:col-span-7">
            <div ref={stageRef} className="relative aspect-square w-full max-w-[560px] mx-auto">
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" aria-hidden="true">
                {/* Manual copy/paste jumps follow the tools while they fade out */}
                <motion.g style={{ opacity: manualOpacity }}>
                  {MANUAL_LINKS.map(([a, b]) => (
                    <motion.line
                      key={`${a}-${b}`}
                      x1={positions[a].px}
                      y1={positions[a].py}
                      x2={positions[b].px}
                      y2={positions[b].py}
                      stroke="#FF7A85"
                      strokeWidth="0.35"
                      strokeDasharray="1.2 1.2"
                      className="manual-link"
                    />
                  ))}
                </motion.g>

                <motion.circle cx="50" cy="50" r={ORBIT_RADIUS} fill="none" stroke="#1E2A40" strokeWidth="0.3" style={{ opacity: hubGlow }} />

                {ORBIT.map((_, i) => (
                  <Wire key={i} index={i} progress={progress} />
                ))}

                {/* Data pulses once everything is connected */}
                <motion.g style={{ opacity: pulsesOpacity }}>
                  {ORBIT.map(([x, y], i) => (
                    <circle key={i} r="0.9" cx={x} cy={y} fill={i % 2 ? '#FFC857' : '#8DF0D8'}>
                      {!reduceMotion && (
                        <>
                          <animate attributeName="cx" values={`${x};50;${x}`} dur="2.4s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
                          <animate attributeName="cy" values={`${y};50;${y}`} dur="2.4s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
                        </>
                      )}
                    </circle>
                  ))}
                </motion.g>
              </svg>

              {/* Hub */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <motion.div className="relative flex flex-col items-center will-change-transform" style={{ scale: hubScale }}>
                  <motion.div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full"
                    style={{ opacity: hubGlow, background: 'radial-gradient(circle, rgba(71,229,194,0.45), transparent 70%)' }}
                  />
                  <img src={starAppsLogo} alt="" className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl" />
                  <span className="absolute top-full mt-2 font-brand text-xs text-white tracking-widest whitespace-nowrap">STAR APPS</span>
                </motion.div>
              </div>

              {DOTS.map((dot, i) => (
                <MovingDot
                  key={dot.key}
                  dot={dot}
                  index={i}
                  motionPos={positions[i]}
                  stage={stage}
                  progress={progress}
                  language={language}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConnectDotsSection;
