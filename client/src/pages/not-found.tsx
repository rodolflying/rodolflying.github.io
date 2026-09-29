import { motion, useReducedMotion } from 'framer-motion';
import Layout from '@/components/Layout';
import { useLanguage } from '@/hooks/useLanguage';
import { CtaLink } from '@/components/ui/headers';

// A small constellation (viewBox 320x180) with one empty place: the star that got lost.
const STARS: Array<[number, number]> = [[40, 118], [86, 84], [134, 100], [168, 62], [150, 132]];
const LINKS: Array<[number, number]> = [[0, 1], [1, 2], [2, 3], [2, 4]];
const SLOT: [number, number] = [214, 88];
const LOST: [number, number] = [268, 52];
const DUST: Array<[number, number]> = [[22, 40], [70, 24], [118, 36], [206, 22], [300, 110], [240, 150], [196, 164], [92, 158], [290, 20]];

const starPath = (cx: number, cy: number, r: number) =>
  Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.44 : r;
    return `${i ? 'L' : 'M'}${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`;
  }).join(' ') + ' Z';

/** 404 in the site's line style: a constellation with a gap, and the Star Apps star floating off on its own. */
const LostStar = () => {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 320 180" className="w-full max-w-md mx-auto" aria-hidden="true">
      {DUST.map(([x, y], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r={i % 3 ? 0.9 : 1.3}
          fill={i % 4 ? '#8F9CB3' : '#FFC857'}
          animate={reduce ? undefined : { opacity: [0.3, 0.9, 0.3] }}
          transition={{ duration: 3 + (i % 4), repeat: Infinity, delay: i * 0.4 }}
        />
      ))}
      {LINKS.map(([a, b]) => (
        <line key={`${a}-${b}`} x1={STARS[a][0]} y1={STARS[a][1]} x2={STARS[b][0]} y2={STARS[b][1]} stroke="#47E5C2" strokeOpacity="0.55" strokeWidth="1.2" strokeDasharray="2 4" strokeLinecap="round" />
      ))}
      {/* the link that should reach the missing star */}
      <line x1={STARS[3][0]} y1={STARS[3][1]} x2={SLOT[0]} y2={SLOT[1]} stroke="#47E5C2" strokeOpacity="0.3" strokeWidth="1.2" strokeDasharray="2 4" strokeLinecap="round" />
      <circle cx={SLOT[0]} cy={SLOT[1]} r="7" fill="none" stroke="#8F9CB3" strokeOpacity="0.6" strokeWidth="1.2" strokeDasharray="2 3" />
      {STARS.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="6" fill="#47E5C2" fillOpacity="0.12" />
          <circle cx={x} cy={y} r="2.6" fill="#47E5C2" />
        </g>
      ))}
      {/* the lost star floats off, and a faint trail tries to bring it back */}
      <motion.g animate={reduce ? undefined : { y: [0, -5, 0], rotate: [0, 6, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} style={{ transformOrigin: `${LOST[0]}px ${LOST[1]}px` }}>
        <line x1={SLOT[0] + 8} y1={SLOT[1] - 5} x2={LOST[0] - 16} y2={LOST[1] + 10} stroke="#F2C7A5" strokeOpacity="0.5" strokeWidth="1.2" strokeDasharray="1.5 5" strokeLinecap="round">
          {!reduce && <animate attributeName="stroke-dashoffset" values="0;-13" dur="1.4s" repeatCount="indefinite" />}
        </line>
        <circle cx={LOST[0]} cy={LOST[1]} r="22" fill="#47E5C2" fillOpacity="0.07" />
        <path d={starPath(LOST[0], LOST[1], 16)} fill="#47E5C2" fillOpacity="0.2" stroke="#47E5C2" strokeWidth="1.8" strokeLinejoin="round" />
      </motion.g>
    </svg>
  );
};

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <Layout title={t('not_found.title')} noindex>
      <section className="min-h-[70vh] flex items-center justify-center pt-28 pb-16 bg-night">
        <div className="container mx-auto px-4 text-center max-w-lg">
          <div className="mb-8">
            <LostStar />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">{t('not_found.title')}</h1>
          <p className="text-ink-2 mb-8">
            <span className="num text-ink-3">404 · </span>
            {t('not_found.text')}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <CtaLink href="/">{t('not_found.home')}</CtaLink>
            <CtaLink href="/contact" variant="secondary">{t('navbar.contact')}</CtaLink>
          </div>
        </div>
      </section>
    </Layout>
  );
}
