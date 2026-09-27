import { motion, type TargetAndTransition } from 'framer-motion';

/**
 * Our own animated icons for the process steps: light outline, one accent color and a soft
 * duotone fill, drawn for a dark background. `active` starts a small looping motion that
 * says what the step does (a bell rings, bars rise, a check draws...).
 */

export const LINE = '#CBD5E1';
export const SW = 2.5;

export interface StepIconProps { color: string; active?: boolean; className?: string }

// framer's prop unions are too deep for TypeScript to check through a spread, so the helper is loosely typed
type LoopProps = { initial: any; animate: any; transition: any }; // eslint-disable-line @typescript-eslint/no-explicit-any

/** Loop an animation while active; settle back to `rest` otherwise. */
export function loop(active: boolean | undefined, anim: TargetAndTransition, rest: TargetAndTransition, duration = 1.4, repeatDelay = 0.5): LoopProps {
  return {
    initial: rest,
    animate: active ? anim : rest,
    transition: active ? { duration, repeat: Infinity, repeatDelay, ease: 'easeInOut' as const } : { duration: 0.3 },
  };
}

const Svg = ({ className = 'w-12 h-12', children }: { className?: string; children: React.ReactNode }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

// ---------------------------------------------------------------- shared shapes
const Doc = ({ color, x = 16, y = 10, w = 30, h = 42 }: { color: string; x?: number; y?: number; w?: number; h?: number }) => (
  <>
    <path d={`M${x} ${y}h${w - 8}l8 8v${h - 8}H${x}z`} fill={color} fillOpacity="0.12" />
    <path d={`M${x} ${y}h${w - 8}l8 8v${h - 8}H${x}zM${x + w - 8} ${y}v8h8`} stroke={LINE} strokeWidth={SW} />
  </>
);
const Screen = ({ color }: { color: string }) => (
  <>
    <rect x="8" y="12" width="48" height="32" rx="4" fill={color} fillOpacity="0.1" />
    <rect x="8" y="12" width="48" height="32" rx="4" stroke={LINE} strokeWidth={SW} />
    <path d="M32 44v7M23 51h18" stroke={LINE} strokeWidth={SW} />
  </>
);

// ---------------------------------------------------------------- icons
/** Detect: a magnifier with a signal pulsing out of it. */
const Detect = ({ color, active, className }: StepIconProps) => (
  <Svg className={className}>
    <circle cx="27" cy="27" r="14" fill={color} fillOpacity="0.12" />
    <circle cx="27" cy="27" r="14" stroke={LINE} strokeWidth={SW} />
    <path d="M37.5 37.5L52 52" stroke={LINE} strokeWidth={SW + 1} />
    <circle cx="27" cy="27" r="3" fill={color} />
    <motion.circle cx="27" cy="27" r="8" stroke={color} strokeWidth="2" {...loop(active, { scale: [0.4, 1.4], opacity: [1, 0] }, { scale: 1, opacity: 0.6 })} />
  </Svg>
);

/** Classify: a clipboard whose rows get checked one after another. */
const Classify = ({ color, active, className }: StepIconProps) => (
  <Svg className={className}>
    <rect x="14" y="12" width="36" height="44" rx="4" fill={color} fillOpacity="0.1" />
    <rect x="14" y="12" width="36" height="44" rx="4" stroke={LINE} strokeWidth={SW} />
    <rect x="24" y="8" width="16" height="8" rx="2" fill="#0B1220" stroke={LINE} strokeWidth={SW} />
    {[24, 34, 44].map((y, i) => (
      <g key={y}>
        <motion.path d={`M20 ${y}l3 3 5-6`} stroke={color} strokeWidth={SW} {...loop(active, { pathLength: [0, 1] }, { pathLength: 1 }, 0.5, 1.2 - i * 0)} transition={active ? { duration: 0.4, delay: i * 0.35, repeat: Infinity, repeatDelay: 1.3 } : { duration: 0.2 }} />
        <path d={`M33 ${y + 1}h11`} stroke={LINE} strokeWidth={SW} />
      </g>
    ))}
  </Svg>
);

/** Notify: a bell that rings. */
const Notify = ({ color, active, className }: StepIconProps) => (
  <Svg className={className}>
    <motion.g style={{ originX: '32px', originY: '12px' }} {...loop(active, { rotate: [0, -14, 12, -8, 5, 0] }, { rotate: 0 }, 0.9, 0.7)}>
      <path d="M20 42V30a12 12 0 0 1 24 0v12l4 4H16z" fill={color} fillOpacity="0.14" />
      <path d="M20 42V30a12 12 0 0 1 24 0v12l4 4H16zM32 12v6" stroke={LINE} strokeWidth={SW} />
      <path d="M28 50a4 4 0 0 0 8 0" stroke={LINE} strokeWidth={SW} />
    </motion.g>
    <motion.path d="M10 24a20 20 0 0 1 5-9M54 24a20 20 0 0 0-5-9" stroke={color} strokeWidth={SW} {...loop(active, { opacity: [0, 1, 0] }, { opacity: 1 }, 0.9, 0.7)} />
  </Svg>
);

/** Confirm: a phone that buzzes and shows a check. */
const Confirm = ({ color, active, className }: StepIconProps) => (
  <Svg className={className}>
    <motion.g {...loop(active, { x: [0, -1.5, 1.5, -1.5, 0] }, { x: 0 }, 0.35, 1.4)}>
      <rect x="20" y="8" width="24" height="48" rx="5" fill={color} fillOpacity="0.1" />
      <rect x="20" y="8" width="24" height="48" rx="5" stroke={LINE} strokeWidth={SW} />
      <path d="M29 51h6" stroke={LINE} strokeWidth={SW} />
    </motion.g>
    <motion.path d="M26 31l4 4 8-9" stroke={color} strokeWidth={SW + 0.5} {...loop(active, { pathLength: [0, 1] }, { pathLength: 1 }, 0.6, 1.2)} />
  </Svg>
);

/** Record: a log book whose lines write themselves. */
const Record = ({ color, active, className }: StepIconProps) => (
  <Svg className={className}>
    <rect x="14" y="8" width="36" height="48" rx="3" fill={color} fillOpacity="0.1" />
    <rect x="14" y="8" width="36" height="48" rx="3" stroke={LINE} strokeWidth={SW} />
    <path d="M22 8v48" stroke={LINE} strokeWidth={SW} />
    {[20, 28, 36, 44].map((y, i) => (
      <motion.path key={y} d={`M27 ${y}h16`} stroke={i === 3 ? color : LINE} strokeWidth={SW}
        initial={{ pathLength: 1 }} animate={active ? { pathLength: [0, 1] } : { pathLength: 1 }}
        transition={active ? { duration: 0.4, delay: i * 0.3, repeat: Infinity, repeatDelay: 1.4 } : { duration: 0.2 }} />
    ))}
  </Svg>
);

/** Monitor: a screen with a live pulse line. */
const Monitor = ({ color, active, className }: StepIconProps) => (
  <Svg className={className}>
    <Screen color={color} />
    <motion.path d="M13 30h9l3-7 5 14 4-10 3 3h14" stroke={color} strokeWidth={SW} {...loop(active, { pathLength: [0, 1] }, { pathLength: 1 }, 1.1, 0.3)} />
  </Svg>
);

/** Diagnose: a gear under a magnifier. */
const Diagnose = ({ color, active, className }: StepIconProps) => (
  <Svg className={className}>
    <motion.g style={{ originX: '26px', originY: '26px' }} {...loop(active, { rotate: [0, 90] }, { rotate: 0 }, 1.2, 0.2)}>
      <circle cx="26" cy="26" r="9" fill={color} fillOpacity="0.14" stroke={LINE} strokeWidth={SW} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <path key={a} d="M26 12v4" stroke={LINE} strokeWidth={SW + 1} transform={`rotate(${a} 26 26)`} />
      ))}
      <circle cx="26" cy="26" r="3" fill={color} />
    </motion.g>
    <circle cx="43" cy="43" r="9" fill="#0B1220" stroke={color} strokeWidth={SW} />
    <path d="M49.5 49.5L56 56" stroke={color} strokeWidth={SW + 1} />
  </Svg>
);

/** Work order: a clipboard with a wrench that tightens. */
const WorkOrder = ({ color, active, className }: StepIconProps) => (
  <Svg className={className}>
    <rect x="12" y="12" width="32" height="44" rx="4" fill={color} fillOpacity="0.1" />
    <rect x="12" y="12" width="32" height="44" rx="4" stroke={LINE} strokeWidth={SW} />
    <rect x="20" y="8" width="16" height="8" rx="2" fill="#0B1220" stroke={LINE} strokeWidth={SW} />
    <path d="M19 26h18M19 34h12" stroke={LINE} strokeWidth={SW} />
    <motion.g style={{ originX: '44px', originY: '44px' }} {...loop(active, { rotate: [0, -30, 0] }, { rotate: 0 }, 0.8, 0.6)}>
      <path d="M36 52l10-10m2-10a6 6 0 0 0-7 8l-9 9 4 4 9-9a6 6 0 0 0 8-7l-4 4-4-1-1-4z" fill="#0B1220" stroke={color} strokeWidth={SW} />
    </motion.g>
  </Svg>
);

/** Assign: a message flies to the right person. */
const Assign = ({ color, active, className }: StepIconProps) => (
  <Svg className={className}>
    <circle cx="44" cy="22" r="7" fill={color} fillOpacity="0.14" stroke={LINE} strokeWidth={SW} />
    <path d="M32 46a12 12 0 0 1 24 0" fill={color} fillOpacity="0.14" />
    <path d="M32 46a12 12 0 0 1 24 0" stroke={LINE} strokeWidth={SW} />
    <motion.path d="M6 36l20-8-6 18-3-7z" fill={color} fillOpacity="0.3" stroke={color} strokeWidth={SW} {...loop(active, { x: [0, 6, 0], y: [0, -3, 0] }, { x: 0, y: 0 }, 0.9, 0.5)} />
  </Svg>
);

/** Verify: a gear with a check badge. */
const Verify = ({ color, active, className }: StepIconProps) => (
  <Svg className={className}>
    <circle cx="28" cy="30" r="11" fill={color} fillOpacity="0.12" stroke={LINE} strokeWidth={SW} />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
      <path key={a} d="M28 14v4" stroke={LINE} strokeWidth={SW + 1} transform={`rotate(${a} 28 30)`} />
    ))}
    <circle cx="44" cy="44" r="10" fill="#0B1220" stroke={color} strokeWidth={SW} />
    <motion.path d="M39 44l4 4 6-7" stroke={color} strokeWidth={SW} {...loop(active, { pathLength: [0, 1] }, { pathLength: 1 }, 0.5, 1.2)} />
  </Svg>
);

/** Collect: files from different places land in one folder. */
const Collect = ({ color, active, className }: StepIconProps) => (
  <Svg className={className}>
    <path d="M8 34h16l4 4h28v16H8z" fill={color} fillOpacity="0.14" />
    <path d="M8 34h16l4 4h28v16H8z" stroke={LINE} strokeWidth={SW} />
    {[{ x: 12, d: 0 }, { x: 27, d: 0.25 }, { x: 42, d: 0.5 }].map((f) => (
      <motion.rect key={f.x} x={f.x} y="8" width="10" height="13" rx="1.5" fill="#0B1220" stroke={f.x === 27 ? color : LINE} strokeWidth={SW - 0.5}
        initial={{ y: 0, opacity: 1 }} animate={active ? { y: [0, 22], opacity: [1, 0] } : { y: 0, opacity: 1 }}
        transition={active ? { duration: 0.8, delay: f.d, repeat: Infinity, repeatDelay: 0.9 } : { duration: 0.2 }} />
    ))}
  </Svg>
);

/** Compute: a calculator whose keys light up. */
const Compute = ({ color, active, className }: StepIconProps) => (
  <Svg className={className}>
    <rect x="16" y="8" width="32" height="48" rx="4" fill={color} fillOpacity="0.1" />
    <rect x="16" y="8" width="32" height="48" rx="4" stroke={LINE} strokeWidth={SW} />
    <rect x="21" y="13" width="22" height="9" rx="1.5" stroke={color} strokeWidth={SW - 0.5} />
    {[0, 1, 2].map((r) => [0, 1, 2].map((c) => (
      <motion.rect key={`${r}${c}`} x={21 + c * 8} y={27 + r * 8} width="6" height="5" rx="1" fill={LINE}
        initial={{ opacity: 0.55 }} animate={active ? { opacity: [0.55, 1, 0.55], fill: [LINE, color, LINE] } : { opacity: 0.55 }}
        transition={active ? { duration: 0.4, delay: (r * 3 + c) * 0.12, repeat: Infinity, repeatDelay: 1.2 } : { duration: 0.2 }} />
    )))}
  </Svg>
);

/** Database: a cylinder with data flowing in. */
const Database = ({ color, active, className }: StepIconProps) => (
  <Svg className={className}>
    <path d="M14 16v32c0 4 8 8 18 8s18-4 18-8V16" fill={color} fillOpacity="0.12" />
    <ellipse cx="32" cy="16" rx="18" ry="7" stroke={LINE} strokeWidth={SW} />
    <path d="M14 16v32c0 4 8 8 18 8s18-4 18-8V16M14 32c0 4 8 8 18 8s18-4 18-8" stroke={LINE} strokeWidth={SW} />
    {[0, 0.4, 0.8].map((d) => (
      <motion.circle key={d} cx="32" cy="4" r="2" fill={color}
        initial={{ y: 0, opacity: 0 }} animate={active ? { y: [0, 12], opacity: [1, 0] } : { y: 0, opacity: 0 }}
        transition={active ? { duration: 0.8, delay: d, repeat: Infinity, repeatDelay: 0.4 } : { duration: 0.2 }} />
    ))}
  </Svg>
);

/** Publish: a dashboard whose bars rise. */
const Dashboard = ({ color, active, className }: StepIconProps) => (
  <Svg className={className}>
    <Screen color={color} />
    {[{ x: 15, h: 9 }, { x: 25, h: 15 }, { x: 35, h: 20 }].map((b, i) => (
      <motion.rect key={b.x} x={b.x} y={40 - b.h} width="7" height={b.h} rx="1" fill={color} fillOpacity="0.6" style={{ originY: 1 }}
        initial={{ scaleY: 1 }} animate={active ? { scaleY: [0.2, 1] } : { scaleY: 1 }}
        transition={active ? { duration: 0.6, delay: i * 0.15, repeat: Infinity, repeatDelay: 1 } : { duration: 0.2 }} />
    ))}
    <path d="M45 34l3-6 4 2" stroke={color} strokeWidth={SW} />
  </Svg>
);

/** Distribute: an envelope that sends copies out. */
const Distribute = ({ color, active, className }: StepIconProps) => (
  <Svg className={className}>
    <rect x="8" y="22" width="32" height="24" rx="3" fill={color} fillOpacity="0.12" />
    <rect x="8" y="22" width="32" height="24" rx="3" stroke={LINE} strokeWidth={SW} />
    <path d="M9 24l15 11 15-11" stroke={LINE} strokeWidth={SW} />
    {[{ y: 18, d: 0 }, { y: 34, d: 0.2 }, { y: 50, d: 0.4 }].map((a) => (
      <motion.path key={a.y} d={`M44 ${a.y}h12m-4-4l4 4-4 4`} stroke={color} strokeWidth={SW}
        initial={{ x: 0, opacity: 1 }} animate={active ? { x: [-4, 2], opacity: [0, 1, 0] } : { x: 0, opacity: 1 }}
        transition={active ? { duration: 0.9, delay: a.d, repeat: Infinity, repeatDelay: 0.5 } : { duration: 0.2 }} />
    ))}
  </Svg>
);

/** Request: a form filled in with a pen. */
const Request = ({ color, active, className }: StepIconProps) => (
  <Svg className={className}>
    <Doc color={color} x={12} y={8} w={32} h={46} />
    <path d="M19 26h18M19 34h18M19 42h10" stroke={LINE} strokeWidth={SW} />
    <motion.g {...loop(active, { x: [0, -10, 0], y: [0, 8, 0] }, { x: 0, y: 0 }, 1.2, 0.3)}>
      <path d="M44 44l10-10 4 4-10 10-6 2z" fill="#0B1220" stroke={color} strokeWidth={SW} />
    </motion.g>
  </Svg>
);

/** Validate: a document stamped with a shield and check. */
const Validate = ({ color, active, className }: StepIconProps) => (
  <Svg className={className}>
    <Doc color={color} x={10} y={8} w={32} h={46} />
    <path d="M17 24h18M17 32h14" stroke={LINE} strokeWidth={SW} />
    <path d="M44 30l12 4v7c0 7-5 11-12 14-7-3-12-7-12-14v-7z" fill="#0B1220" stroke={color} strokeWidth={SW} />
    <motion.path d="M39 42l4 4 6-7" stroke={color} strokeWidth={SW} {...loop(active, { pathLength: [0, 1] }, { pathLength: 1 }, 0.5, 1.2)} />
  </Svg>
);

/** Bot: a robot that blinks while it works. */
const Bot = ({ color, active, className }: StepIconProps) => (
  <Svg className={className}>
    <rect x="12" y="20" width="40" height="30" rx="8" fill={color} fillOpacity="0.12" />
    <rect x="12" y="20" width="40" height="30" rx="8" stroke={LINE} strokeWidth={SW} />
    <path d="M32 20v-8M8 32v8M56 32v8" stroke={LINE} strokeWidth={SW} />
    <motion.circle cx="32" cy="10" r="3" fill={color} {...loop(active, { opacity: [1, 0.2, 1] }, { opacity: 1 }, 0.8, 0.2)} />
    {[24, 40].map((cx) => (
      <motion.rect key={cx} x={cx - 3} y="30" width="6" height="7" rx="2" fill={color} style={{ originY: 0.5 }} {...loop(active, { scaleY: [1, 0.15, 1] }, { scaleY: 1 }, 0.3, 1.6)} />
    ))}
    <path d="M25 43h14" stroke={LINE} strokeWidth={SW} />
  </Svg>
);

/** Budget: a donut chart whose slice fills. */
const Budget = ({ color, active, className }: StepIconProps) => (
  <Svg className={className}>
    <circle cx="32" cy="32" r="20" stroke={LINE} strokeWidth={SW + 5} strokeOpacity="0.35" />
    <motion.circle cx="32" cy="32" r="20" stroke={color} strokeWidth={SW + 5} transform="rotate(-90 32 32)" {...loop(active, { pathLength: [0.1, 0.62] }, { pathLength: 0.62 }, 1, 0.8)} />
    <path d="M28 27h6a3 3 0 0 1 0 6h-4a3 3 0 0 0 0 6h6M32 24v3M32 39v3" stroke={LINE} strokeWidth={SW - 0.5} />
  </Svg>
);

/** Message: a chat bubble that pops with a check. */
const Message = ({ color, active, className }: StepIconProps) => (
  <Svg className={className}>
    <motion.g style={{ originX: '32px', originY: '48px' }} {...loop(active, { scale: [1, 1.08, 1] }, { scale: 1 }, 0.5, 1.1)}>
      <path d="M10 16a6 6 0 0 1 6-6h32a6 6 0 0 1 6 6v20a6 6 0 0 1-6 6H26l-10 8v-8a6 6 0 0 1-6-6z" fill={color} fillOpacity="0.12" />
      <path d="M10 16a6 6 0 0 1 6-6h32a6 6 0 0 1 6 6v20a6 6 0 0 1-6 6H26l-10 8v-8a6 6 0 0 1-6-6z" stroke={LINE} strokeWidth={SW} />
    </motion.g>
    <motion.path d="M24 26l6 6 11-12" stroke={color} strokeWidth={SW + 0.5} {...loop(active, { pathLength: [0, 1] }, { pathLength: 1 }, 0.5, 1.1)} />
  </Svg>
);

/** Measure: a sensor sending a continuous wave. */
const Measure = ({ color, active, className }: StepIconProps) => (
  <Svg className={className}>
    <rect x="8" y="36" width="16" height="16" rx="3" fill={color} fillOpacity="0.14" stroke={LINE} strokeWidth={SW} />
    <circle cx="16" cy="44" r="3" fill={color} />
    <motion.path d="M26 30c4-12 8-12 12 0s8 12 12 0" stroke={color} strokeWidth={SW} {...loop(active, { pathLength: [0, 1], opacity: [0.4, 1] }, { pathLength: 1, opacity: 1 }, 1, 0.3)} />
    <path d="M26 44h30" stroke={LINE} strokeWidth={SW} strokeDasharray="3 4" />
  </Svg>
);

/** Prepare data: a funnel that turns noisy dots into a clean line. */
const Prepare = ({ color, active, className }: StepIconProps) => (
  <Svg className={className}>
    <path d="M10 14h44L38 34v14l-12 6V34z" fill={color} fillOpacity="0.12" />
    <path d="M10 14h44L38 34v14l-12 6V34z" stroke={LINE} strokeWidth={SW} />
    {[{ x: 18, d: 0 }, { x: 32, d: 0.3 }, { x: 46, d: 0.15 }].map((p) => (
      <motion.circle key={p.x} cx={p.x} cy="6" r="2.2" fill={color}
        initial={{ y: 0, x: 0, opacity: 0 }} animate={active ? { y: [0, 16], x: [0, (32 - p.x) * 0.6], opacity: [1, 0] } : { y: 0, x: 0, opacity: 0.8 }}
        transition={active ? { duration: 0.8, delay: p.d, repeat: Infinity, repeatDelay: 0.4 } : { duration: 0.2 }} />
    ))}
  </Svg>
);

/** Predict: a chart with a dashed forecast reaching a target. */
const Predict = ({ color, active, className }: StepIconProps) => (
  <Svg className={className}>
    <path d="M8 8v48h48" stroke={LINE} strokeWidth={SW} />
    <path d="M14 46l8-6 8 3 8-10" stroke={LINE} strokeWidth={SW} />
    <motion.path d="M38 33l12-14" stroke={color} strokeWidth={SW} strokeDasharray="3 4" {...loop(active, { pathLength: [0, 1] }, { pathLength: 1 }, 0.8, 0.8)} />
    <circle cx="50" cy="17" r="6" stroke={color} strokeWidth={SW} />
    <circle cx="50" cy="17" r="1.8" fill={color} />
  </Svg>
);

/** Validate the model: a bell curve with its check. */
const ValidateModel = ({ color, active, className }: StepIconProps) => (
  <Svg className={className}>
    <path d="M6 50h52" stroke={LINE} strokeWidth={SW} />
    <path d="M8 50c8 0 10-30 24-30s16 30 24 30" fill={color} fillOpacity="0.14" />
    <motion.path d="M8 50c8 0 10-30 24-30s16 30 24 30" stroke={LINE} strokeWidth={SW} {...loop(active, { pathLength: [0, 1] }, { pathLength: 1 }, 1, 0.4)} />
    <path d="M32 20v30" stroke={color} strokeWidth="2" strokeDasharray="2 3" />
    <circle cx="48" cy="14" r="8" fill="#0B1220" stroke={color} strokeWidth={SW} />
    <motion.path d="M44 14l3 3 5-6" stroke={color} strokeWidth={SW} {...loop(active, { pathLength: [0, 1] }, { pathLength: 1 }, 0.5, 0.9)} />
  </Svg>
);

/** Act in time: a calendar day booked for the planned stop. */
const ActInTime = ({ color, active, className }: StepIconProps) => (
  <Svg className={className}>
    <rect x="8" y="12" width="48" height="42" rx="5" fill={color} fillOpacity="0.1" />
    <rect x="8" y="12" width="48" height="42" rx="5" stroke={LINE} strokeWidth={SW} />
    <path d="M8 24h48M20 8v8M44 8v8" stroke={LINE} strokeWidth={SW} />
    {[0, 1, 2].map((c) => <rect key={c} x={15 + c * 12} y="31" width="7" height="6" rx="1" fill={LINE} fillOpacity="0.4" />)}
    <rect x="15" y="42" width="7" height="6" rx="1" fill={LINE} fillOpacity="0.4" />
    <motion.rect x="38" y="40" width="11" height="10" rx="2" fill={color} {...loop(active, { scale: [1, 1.2, 1] }, { scale: 1 }, 0.5, 1)} />
  </Svg>
);

/** File on a portal: a browser window whose form fills in. */
const Portal = ({ color, active, className }: StepIconProps) => (
  <Svg className={className}>
    <rect x="6" y="10" width="52" height="44" rx="4" fill={color} fillOpacity="0.1" />
    <rect x="6" y="10" width="52" height="44" rx="4" stroke={LINE} strokeWidth={SW} />
    <path d="M6 20h52" stroke={LINE} strokeWidth={SW} />
    <circle cx="12" cy="15" r="1.4" fill={LINE} /><circle cx="17" cy="15" r="1.4" fill={LINE} />
    {[28, 36, 44].map((y, i) => (
      <g key={y}>
        <rect x="13" y={y - 3} width="38" height="6" rx="1.5" stroke={LINE} strokeWidth="1.5" strokeOpacity="0.6" />
        <motion.path d={`M16 ${y}h20`} stroke={color} strokeWidth={SW}
          initial={{ pathLength: 1 }} animate={active ? { pathLength: [0, 1] } : { pathLength: 1 }}
          transition={active ? { duration: 0.5, delay: i * 0.35, repeat: Infinity, repeatDelay: 1.2 } : { duration: 0.2 }} />
      </g>
    ))}
  </Svg>
);

/** Archive: a receipt dropped into a box. */
const Archive = ({ color, active, className }: StepIconProps) => (
  <Svg className={className}>
    <path d="M10 30h44v22a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4z" fill={color} fillOpacity="0.12" />
    <path d="M10 30h44v22a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4zM6 24h52v6H6zM26 40h12" stroke={LINE} strokeWidth={SW} />
    <motion.g {...loop(active, { y: [-6, 8], opacity: [1, 0] }, { y: 0, opacity: 1 }, 0.9, 0.5)}>
      <path d="M24 6h16v14l-3-2-2 2-3-2-3 2-2-2-3 2z" fill="#0B1220" stroke={color} strokeWidth={SW - 0.5} />
    </motion.g>
  </Svg>
);

/** Report progress: a ring that fills up. */
const Progress = ({ color, active, className }: StepIconProps) => (
  <Svg className={className}>
    <circle cx="32" cy="32" r="20" stroke={LINE} strokeWidth={SW + 3} strokeOpacity="0.3" />
    <motion.circle cx="32" cy="32" r="20" stroke={color} strokeWidth={SW + 3} transform="rotate(-90 32 32)" {...loop(active, { pathLength: [0, 1] }, { pathLength: 0.75 }, 1.4, 0.5)} />
    <path d="M25 32l5 5 9-10" stroke={LINE} strokeWidth={SW} />
  </Svg>
);

export const STEP_ICONS = {
  detect: Detect, classify: Classify, notify: Notify, confirm: Confirm, record: Record,
  monitor: Monitor, diagnose: Diagnose, workorder: WorkOrder, assign: Assign, verify: Verify,
  collect: Collect, compute: Compute, database: Database, dashboard: Dashboard, distribute: Distribute,
  request: Request, validate: Validate, bot: Bot, budget: Budget, message: Message,
  measure: Measure, prepare: Prepare, predict: Predict, validateModel: ValidateModel, act: ActInTime,
  portal: Portal, archive: Archive, progress: Progress,
} as const;

export type StepIconName = keyof typeof STEP_ICONS;
