import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { LINE, SW, loop } from '@/components/sections/services/StepIcons';

/**
 * Illustrations for "How we work", in the same line + duotone style as the step icons.
 * Each one animates only while it is on screen.
 */

const MINT = '#47E5C2';
const GOLD = '#FFC857';
const SKY = '#7C9CFF';
const INK = '#0B1220';

function useActive() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();
  return { ref, active: inView && !reduce };
}

const Frame = ({ svgRef, children }: { svgRef: React.Ref<SVGSVGElement>; children: React.ReactNode }) => (
  <svg ref={svgRef} viewBox="0 0 240 120" className="w-full h-auto" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

/** 01 Diagnosis: a video call that turns into a written report with three answers. */
export function DiagnosisArt() {
  const { ref, active } = useActive();
  return (
    <Frame svgRef={ref}>
      {/* the call */}
      <rect x="14" y="18" width="104" height="72" rx="8" fill={MINT} fillOpacity="0.08" stroke={LINE} strokeWidth={SW} />
      <path d="M14 30h104" stroke={LINE} strokeWidth={SW} />
      <circle cx="22" cy="24" r="1.6" fill={LINE} /><circle cx="28" cy="24" r="1.6" fill={LINE} />
      {[40, 92].map((cx, i) => (
        <g key={cx}>
          <circle cx={cx} cy="52" r="9" fill={i ? SKY : MINT} fillOpacity="0.2" stroke={LINE} strokeWidth={SW} />
          <path d={`M${cx - 15} 80a15 13 0 0 1 30 0`} stroke={LINE} strokeWidth={SW} />
        </g>
      ))}
      {/* who is talking */}
      {[0, 1, 2].map((k) => (
        <motion.rect key={k} x={60 + k * 5} y="46" width="3" height="12" rx="1.5" fill={MINT} style={{ originY: 0.5 }}
          initial={{ scaleY: 0.4 }} animate={active ? { scaleY: [0.3, 1, 0.5, 0.9, 0.3] } : { scaleY: 0.4 }}
          transition={active ? { duration: 0.9, delay: k * 0.12, repeat: Infinity } : { duration: 0.2 }} />
      ))}
      {/* the arrow to the report */}
      <motion.path d="M126 54h18m-5-5 5 5-5 5" stroke={GOLD} strokeWidth={SW} {...loop(active, { x: [0, 4, 0] }, { x: 0 }, 1, 0.4)} />
      {/* the report: what, how long, how much */}
      <path d="M152 14h52l12 12v84h-64z" fill={INK} stroke={LINE} strokeWidth={SW} />
      <path d="M204 14v12h12" stroke={LINE} strokeWidth={SW} />
      {[40, 64, 88].map((y, i) => (
        <g key={y}>
          <motion.path d={`M160 ${y}l4 4 7-8`} stroke={MINT} strokeWidth={SW}
            initial={{ pathLength: 1 }} animate={active ? { pathLength: [0, 1] } : { pathLength: 1 }}
            transition={active ? { duration: 0.35, delay: 0.4 + i * 0.4, repeat: Infinity, repeatDelay: 2 } : { duration: 0.2 }} />
          <path d={`M178 ${y}h${28 - i * 4}`} stroke={LINE} strokeWidth={SW} />
        </g>
      ))}
    </Frame>
  );
}

/** 02 Build by milestones: a progress line that checks each delivery as it reaches it. */
export function BuildArt() {
  const { ref, active } = useActive();
  const flags = [48, 120, 192];
  return (
    <Frame svgRef={ref}>
      <path d="M20 84h200" stroke={LINE} strokeWidth={SW + 2} strokeOpacity="0.3" />
      <motion.path d="M20 84h200" stroke={MINT} strokeWidth={SW + 2}
        initial={{ pathLength: 1 }} animate={active ? { pathLength: [0, 1] } : { pathLength: 1 }}
        transition={active ? { duration: 3, repeat: Infinity, repeatDelay: 0.8, ease: 'linear' } : { duration: 0.2 }} />
      {flags.map((x, i) => (
        <g key={x}>
          {/* the deliverable */}
          <path d={`M${x - 16} 22h24l8 8v28h-32z`} fill={i === 2 ? GOLD : MINT} fillOpacity="0.1" stroke={LINE} strokeWidth={SW} />
          <path d={`M${x - 9} 38h18M${x - 9} 46h12`} stroke={LINE} strokeWidth={SW - 0.5} />
          {/* the milestone on the line */}
          <circle cx={x} cy="84" r="9" fill={INK} stroke={LINE} strokeWidth={SW} />
          <motion.path d={`M${x - 4} 84l3 3 6-6`} stroke={MINT} strokeWidth={SW}
            initial={{ pathLength: 1, opacity: 1 }}
            animate={active ? { pathLength: [0, 0, 1, 1], opacity: [0, 0, 1, 1] } : { pathLength: 1, opacity: 1 }}
            transition={active ? { duration: 3.8, times: [0, ((x - 20) / 200) * 0.79, ((x - 20) / 200) * 0.79 + 0.06, 1], repeat: Infinity, ease: 'linear' } : { duration: 0.2 }} />
          <text x={x} y="108" textAnchor="middle" fill={LINE} fontSize="10" fontFamily="JetBrains Mono, monospace">{`H${i + 1}`}</text>
        </g>
      ))}
    </Frame>
  );
}

/** 03 Go live and support: a server with a live pulse and support on call. */
export function SupportArt() {
  const { ref, active } = useActive();
  return (
    <Frame svgRef={ref}>
      {/* server */}
      {[18, 44, 70].map((y, i) => (
        <g key={y}>
          <rect x="20" y={y} width="64" height="20" rx="4" fill={MINT} fillOpacity="0.08" stroke={LINE} strokeWidth={SW} />
          <path d={`M30 ${y + 10}h24`} stroke={LINE} strokeWidth={SW - 0.5} />
          <motion.circle cx="72" cy={y + 10} r="3" fill={MINT} {...loop(active, { opacity: [1, 0.25, 1] }, { opacity: 1 }, 0.9, i * 0.3)} />
        </g>
      ))}
      {/* the live pulse */}
      <motion.path d="M96 52h22l7-18 10 36 8-26 6 8h24" stroke={MINT} strokeWidth={SW}
        {...loop(active, { pathLength: [0, 1] }, { pathLength: 1 }, 1.4, 0.3)} />
      {/* support on call */}
      <circle cx="198" cy="46" r="18" fill={GOLD} fillOpacity="0.12" stroke={LINE} strokeWidth={SW} />
      <path d="M184 48v-4a14 14 0 0 1 28 0v4" stroke={LINE} strokeWidth={SW} />
      <rect x="180" y="46" width="6" height="10" rx="2" fill={GOLD} />
      <rect x="210" y="46" width="6" height="10" rx="2" fill={GOLD} />
      <path d="M213 56c0 8-6 10-12 10" stroke={LINE} strokeWidth={SW - 0.5} />
      <path d="M170 92h56" stroke={LINE} strokeWidth={SW} strokeOpacity="0.4" />
      <motion.path d="M170 92h56" stroke={GOLD} strokeWidth={SW} {...loop(active, { pathLength: [0, 1] }, { pathLength: 0.7 }, 2, 0.5)} />
    </Frame>
  );
}
