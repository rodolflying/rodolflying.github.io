import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * The home page tells the same story as the area scenes: it starts at night and, as you
 * scroll, the sky warms into a desert dawn (copper at the horizon) while the stars fade.
 * A dotted constellation line runs down the left gutter, lighting one star per section.
 * Both follow the scroll with one rAF per frame and no React re-render.
 */

const clamp = (v: number) => Math.min(1, Math.max(0, v));

/** Fixed sky behind the page: stars fade out and a copper dawn fades in with scroll progress. */
export const DawnSky = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      ref.current?.style.setProperty('--dawn', clamp((p - 0.25) / 0.7).toFixed(3));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10" style={{ ['--dawn' as string]: 0 }}>
      <div className="absolute inset-0 starfield" style={{ opacity: 'calc(1 - var(--dawn) * 0.85)' }} />
      <div
        className="absolute inset-0"
        style={{
          opacity: 'var(--dawn)',
          background:
            'linear-gradient(to top, rgba(217,139,84,0.30) 0%, rgba(217,139,84,0.12) 25%, rgba(124,156,255,0.08) 52%, transparent 82%)',
        }}
      />
    </div>
  );
};

interface Node { x: number; y: number }

/** Section ids (in page order) the thread connects; the last one gets the star. */
const ANCHORS = ['puntos', 'capacidades', 'valor', 'casos', 'proceso', 'roi', 'cta'];
const GUTTER = 44; // px of free space needed left of the content

/** Wraps the page body and draws the constellation thread in its left gutter (wide screens only). */
export const ConstellationThread = ({ children }: { children: ReactNode }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<SVGRectElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [reached, setReached] = useState(-1);

  // Where the stars go: one per section, in the gutter, with a slight zigzag.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const measure = () => {
      const box = wrap.getBoundingClientRect();
      const container = wrap.querySelector<HTMLElement>('#valor .container, .container');
      const left = container ? container.getBoundingClientRect().left - box.left : 0;
      if (left < GUTTER * 1.2) { setNodes([]); return; }
      const x0 = left - GUTTER / 2 - 4;
      const next: Node[] = [];
      ANCHORS.forEach((id, i) => {
        const el = document.getElementById(id);
        if (!el) return;
        const top = el.getBoundingClientRect().top - box.top;
        next.push({ x: x0 + (i % 2 ? 9 : -9), y: top + 110 });
      });
      setNodes(next);
      setSize({ w: box.width, h: box.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  // How far the line is drawn: down to 60% of the viewport, or fully for reduced motion.
  useEffect(() => {
    if (!nodes.length) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    const update = () => {
      raf = 0;
      const wrap = wrapRef.current;
      if (!wrap) return;
      const reach = reduce ? Infinity : window.innerHeight * 0.6 - wrap.getBoundingClientRect().top;
      clipRef.current?.setAttribute('height', String(Math.max(0, Math.min(size.h, reach))));
      let lit = -1;
      nodes.forEach((n, i) => { if (n.y <= reach) lit = i; });
      setReached((r) => (r === lit ? r : lit));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, [nodes, size.h]);

  const path = nodes.map((n, i) => `${i ? 'L' : 'M'}${n.x},${n.y}`).join(' ');

  return (
    <div ref={wrapRef} className="relative">
      {nodes.length > 1 && (
        <svg className="pointer-events-none absolute inset-0" width={size.w} height={size.h} aria-hidden="true">
          <defs>
            <clipPath id="thread-drawn">
              <rect ref={clipRef} x="0" y="0" width={size.w} height="0" />
            </clipPath>
          </defs>
          <path d={path} fill="none" stroke="#47E5C2" strokeOpacity="0.12" strokeWidth="1.2" strokeDasharray="1 6" strokeLinecap="round" />
          <path d={path} fill="none" stroke="#47E5C2" strokeOpacity="0.7" strokeWidth="1.4" strokeDasharray="1 6" strokeLinecap="round" clipPath="url(#thread-drawn)" />
          {nodes.map((n, i) => {
            const lit = i <= reached;
            if (i === nodes.length - 1) {
              const pts = Array.from({ length: 10 }, (_, k) => {
                const a = -Math.PI / 2 + (k * Math.PI) / 5;
                const r = k % 2 ? 3.4 : 8;
                return `${n.x + Math.cos(a) * r},${n.y + Math.sin(a) * r}`;
              }).join(' ');
              return (
                <polygon
                  key={i}
                  points={pts}
                  fill={lit ? '#47E5C2' : 'none'}
                  fillOpacity={lit ? 0.35 : 0}
                  stroke="#47E5C2"
                  strokeOpacity={lit ? 1 : 0.3}
                  strokeWidth="1.4"
                  style={{ transition: 'fill-opacity 0.6s, stroke-opacity 0.6s' }}
                />
              );
            }
            return (
              <circle
                key={i}
                cx={n.x}
                cy={n.y}
                r={lit ? 3.2 : 2.4}
                fill={lit ? '#47E5C2' : '#1E2A40'}
                stroke="#47E5C2"
                strokeOpacity={lit ? 0.9 : 0.3}
                style={{ transition: 'r 0.4s, fill 0.4s' }}
              />
            );
          })}
        </svg>
      )}
      {children}
    </div>
  );
};
