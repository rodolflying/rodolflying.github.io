import { useEffect, useRef } from 'react';

/**
 * Brand hero animation, mirroring the logo (a hand clicking a star):
 * scattered stars fly in and form the Star Apps star with the logo's target rings;
 * a hand clicks the centre and a shockwave lights the star and links it to the
 * surrounding stars ("one click and everything connects"). Visitors can click
 * anywhere to trigger the same effect. Canvas only; pauses off-screen and renders a
 * static star for prefers-reduced-motion.
 */

const MINT = '71, 229, 194';
const GOLD = '255, 200, 87';
const WHITE = '238, 242, 248';

const OUTLINE_POINTS_PER_EDGE = 5;
const AMBIENT = 60;
const AUTO_CLICK_EVERY = 7; // seconds between demo clicks
const USER_QUIET = 9; // demo waits this long after a visitor click

// lucide "pointer" icon (24x24); the index fingertip is at (8, 2).
const HAND_PATHS = [
  'M22 14a8 8 0 0 1-8 8',
  'M18 11v-1a2 2 0 0 0-2-2a2 2 0 0 0-2 2',
  'M14 10V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1',
  'M10 9.5V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v10',
  'M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15',
];

interface Particle {
  x: number;
  y: number;
  sx: number | null; // star position (normalized -1..1) or null for ambient stars
  sy: number | null;
  fx: number; // scattered position (0..1 of the canvas)
  fy: number;
  size: number;
  phase: number;
  gold: boolean;
  delay: number;
  glow: number; // 0..1, lit by a shockwave
}

interface Ripple {
  x: number;
  y: number;
  t0: number;
}

interface Link {
  a: number;
  b: number;
  t0: number;
}

const rand = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

function starOutline(): Array<[number, number]> {
  const vertices: Array<[number, number]> = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? 1 : 0.42;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    vertices.push([Math.cos(a) * r, Math.sin(a) * r]);
  }
  const pts: Array<[number, number]> = [];
  for (let i = 0; i < 10; i++) {
    const [ax, ay] = vertices[i];
    const [bx, by] = vertices[(i + 1) % 10];
    for (let k = 0; k < OUTLINE_POINTS_PER_EDGE; k++) {
      const t = k / OUTLINE_POINTS_PER_EDGE;
      pts.push([ax + (bx - ax) * t, ay + (by - ay) * t]);
    }
  }
  return pts;
}

function buildParticles(): Particle[] {
  const list: Particle[] = starOutline().map(([sx, sy], i) => ({
    x: 0, y: 0, sx, sy,
    fx: rand(i + 1), fy: rand(i + 101),
    size: i % OUTLINE_POINTS_PER_EDGE === 0 ? 2.6 : 1.6,
    phase: rand(i + 201) * Math.PI * 2,
    gold: i % (OUTLINE_POINTS_PER_EDGE * 2) === 0,
    delay: rand(i + 301) * 0.6,
    glow: 0,
  }));
  for (let i = 0; i < AMBIENT; i++) {
    list.push({
      x: 0, y: 0, sx: null, sy: null,
      fx: rand(i + 501), fy: rand(i + 601),
      size: 0.7 + rand(i + 701) * 1.3,
      phase: rand(i + 801) * Math.PI * 2,
      gold: rand(i + 901) > 0.85,
      delay: 0,
      glow: 0,
    });
  }
  return list;
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

interface StarConstellationProps {
  className?: string;
}

const StarConstellation = ({ className = '' }: StarConstellationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const particles = buildParticles();
    const outlineCount = particles.filter((p) => p.sx !== null).length;
    const handPaths = HAND_PATHS.map((d) => new Path2D(d));
    const ripples: Ripple[] = [];
    const links: Link[] = [];
    const pointer = { x: -9999, y: -9999, active: false };
    let width = 0;
    let height = 0;
    let formStart = Number.POSITIVE_INFINITY; // set when first visible
    let lastPress = -Infinity; // seconds (performance.now based)
    let lastUserClick = -Infinity;
    let nextDemo = Number.POSITIVE_INFINITY;
    let raf = 0;
    let visible = true;

    const geometry = () => ({
      cx: width / 2,
      cy: height / 2,
      radius: Math.min(width, height) * 0.4,
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Disperse as the canvas scrolls out of view (beside the headline on desktop, below it on mobile).
    const scrollProgress = () => {
      const rect = canvas.getBoundingClientRect();
      return clamp01(-rect.top / (rect.height * 0.9));
    };

    /** A click (demo or visitor): shockwave, lit stars and new links toward nearby stars. */
    const press = (x: number, y: number, nowS: number) => {
      ripples.push({ x, y, t0: nowS });
      lastPress = nowS;
      // Link the surrounding stars (outside the star) nearest to the click to the star's tips.
      const { cx, cy, radius } = geometry();
      const ambient = particles
        .map((p, i) => ({ i, d: Math.hypot(p.x - x, p.y - y), fromCenter: Math.hypot(p.x - cx, p.y - cy) }))
        .filter(({ i, fromCenter }) => particles[i].sx === null && fromCenter > radius * 0.95)
        .sort((a, b) => a.d - b.d)
        .slice(0, 12);
      const tips = [0, 2, 4, 6, 8].map((v) => v * OUTLINE_POINTS_PER_EDGE);
      ambient.forEach(({ i }, k) => {
        const tip = tips.reduce((best, t) =>
          Math.hypot(particles[t].x - particles[i].x, particles[t].y - particles[i].y) <
          Math.hypot(particles[best].x - particles[i].x, particles[best].y - particles[i].y) ? t : best, tips[0]);
        links.push({ a: tip, b: i, t0: nowS + k * 0.06 });
      });
    };

    const drawHand = (x: number, y: number, scale: number, alpha: number) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(x, y);
      ctx.scale(scale, scale);
      ctx.translate(-8, -2); // fingertip on (x, y)
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = 8 / scale;
      ctx.strokeStyle = 'rgba(7, 11, 20, 0.9)';
      ctx.lineWidth = 5 / scale + 1.2;
      handPaths.forEach((p) => ctx.stroke(p));
      ctx.shadowBlur = 0;
      ctx.strokeStyle = `rgba(${WHITE}, 1)`;
      ctx.lineWidth = 1.8;
      handPaths.forEach((p) => ctx.stroke(p));
      ctx.restore();
    };

    const draw = (now: number) => {
      const nowS = now / 1000;
      ctx.clearRect(0, 0, width, height);
      const { cx, cy, radius } = geometry();
      const elapsed = reduceMotion ? 10 : nowS - formStart / 1000;
      const scatter = reduceMotion ? 0 : scrollProgress();
      const formed = clamp01((elapsed - 1.2) / 1.2) * (1 - scatter);

      // Demo click loop once the star is formed and the visitor is not interacting.
      if (!reduceMotion && formed > 0.95 && nextDemo === Number.POSITIVE_INFINITY) nextDemo = nowS + 0.6;
      let hand: { x: number; y: number; scale: number; alpha: number } | null = null;
      if (!reduceMotion && formed > 0.95 && nowS >= nextDemo) {
        const t = nowS - nextDemo; // 0..1.6 s choreography
        const handScale = Math.max(1.4, radius / 45);
        const startX = cx + radius * 0.9;
        const startY = cy + radius * 0.95;
        if (t < 0.8) {
          const k = easeInOut(t / 0.8);
          hand = { x: startX + (cx - startX) * k, y: startY + (cy - startY) * k, scale: handScale, alpha: clamp01(t / 0.25) };
        } else if (t < 1.05) {
          const k = Math.sin(((t - 0.8) / 0.25) * Math.PI);
          hand = { x: cx, y: cy, scale: handScale * (1 - 0.14 * k), alpha: 1 };
          if (lastPress < nextDemo) press(cx, cy, nowS);
        } else if (t < 1.6) {
          const k = easeInOut((t - 1.05) / 0.55);
          hand = { x: cx + radius * 0.35 * k, y: cy + radius * 0.4 * k, scale: handScale, alpha: 1 - k };
        } else {
          nextDemo = Math.max(nowS + AUTO_CLICK_EVERY, lastUserClick + USER_QUIET);
        }
      }

      const sincePress = nowS - lastPress;
      const flash = sincePress >= 0 && sincePress < 1.6 ? Math.pow(1 - sincePress / 1.6, 2) : 0;

      // Positions
      for (const p of particles) {
        const fx = p.fx * width;
        const fy = p.fy * height;
        if (p.sx !== null && p.sy !== null) {
          const t = easeInOut(clamp01((elapsed - 0.2 - p.delay) / 1.8));
          const form = t * (1 - scatter);
          const breathe = reduceMotion ? 0 : Math.sin(nowS / 0.9 + p.phase) * 2;
          const bump = 1 + flash * 0.06; // the star "pops" on click
          const tx = cx + p.sx * radius * bump + breathe;
          const ty = cy + p.sy * radius * bump + breathe * 0.6;
          p.x = fx + (tx - fx) * form;
          p.y = fy + (ty - fy) * form;
        } else {
          const drift = reduceMotion ? 0 : Math.sin(nowS / 4 + p.phase) * 6;
          p.x = fx + drift;
          p.y = fy + Math.cos(nowS / 5 + p.phase) * 4;
        }
        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 90 && dist > 0) {
            const push = (1 - dist / 90) * 10;
            p.x += (dx / dist) * push;
            p.y += (dy / dist) * push;
          }
        }
        // Shockwave lights up the stars it passes
        for (const r of ripples) {
          const front = (nowS - r.t0) * radius * 1.6;
          const d = Math.hypot(p.x - r.x, p.y - r.y);
          if (Math.abs(d - front) < 18) p.glow = 1;
        }
        p.glow *= 0.94;
      }

      if (formed > 0) {
        // Star fill, like the solid mint star of the logo
        ctx.save();
        const fill = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        fill.addColorStop(0, `rgba(${MINT}, ${(0.16 + flash * 0.35) * formed})`);
        fill.addColorStop(1, `rgba(${MINT}, ${(0.05 + flash * 0.15) * formed})`);
        ctx.fillStyle = fill;
        ctx.beginPath();
        for (let i = 0; i < outlineCount; i++) {
          const p = particles[i];
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Glowing outline
        ctx.save();
        ctx.lineWidth = 1.6 + flash * 1.4;
        ctx.strokeStyle = `rgba(${MINT}, ${(0.8 + flash * 0.2) * formed})`;
        ctx.shadowColor = `rgba(${MINT}, 0.9)`;
        ctx.shadowBlur = 14 + flash * 24;
        ctx.beginPath();
        for (let i = 0; i <= outlineCount; i++) {
          const p = particles[i % outlineCount];
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
        ctx.restore();

        // Target rings at the centre (from the logo)
        ctx.save();
        ctx.strokeStyle = `rgba(${WHITE}, ${(0.35 + flash * 0.5) * formed})`;
        ctx.lineWidth = 1.4;
        for (const k of [0.1, 0.19]) {
          ctx.beginPath();
          ctx.arc(cx, cy, radius * k * (1 + flash * 0.25), 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.fillStyle = `rgba(${WHITE}, ${0.6 * formed})`;
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.03, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Ambient constellation lines
      ctx.lineWidth = 0.6;
      for (let i = outlineCount; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 85) {
            ctx.strokeStyle = `rgba(${WHITE}, ${0.1 * (1 - d / 85)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // "Everything connects": links drawn from the star to nearby stars after a click
      for (let i = links.length - 1; i >= 0; i--) {
        const l = links[i];
        const age = nowS - l.t0;
        if (age < 0) continue;
        if (age > 3) {
          links.splice(i, 1);
          continue;
        }
        const grow = clamp01(age / 0.45);
        const fade = age < 2 ? 1 : 1 - (age - 2);
        const a = particles[l.a];
        const b = particles[l.b];
        ctx.save();
        ctx.strokeStyle = `rgba(${MINT}, ${0.7 * fade})`;
        ctx.shadowColor = `rgba(${MINT}, 0.8)`;
        ctx.shadowBlur = 8;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(a.x + (b.x - a.x) * grow, a.y + (b.y - a.y) * grow);
        ctx.stroke();
        ctx.restore();
        if (grow >= 1) particles[l.b].glow = Math.max(particles[l.b].glow, fade);
      }

      // Shockwave rings (echo of the logo's target)
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        const age = nowS - r.t0;
        if (age > 1.4) {
          ripples.splice(i, 1);
          continue;
        }
        for (const offset of [0, 0.18]) {
          const k = age - offset;
          if (k < 0) continue;
          ctx.strokeStyle = `rgba(${MINT}, ${0.8 * (1 - k / 1.4)})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(r.x, r.y, k * radius * 1.6, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Stars
      for (const p of particles) {
        const twinkle = reduceMotion ? 1 : 0.6 + 0.4 * Math.sin(nowS / 0.6 + p.phase);
        const color = p.glow > 0.05 ? MINT : p.gold ? GOLD : p.sx !== null ? MINT : WHITE;
        ctx.fillStyle = `rgba(${color}, ${Math.min(1, twinkle + p.glow)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 + p.glow * 0.9), 0, Math.PI * 2);
        ctx.fill();
      }

      if (hand) drawHand(hand.x, hand.y, hand.scale, hand.alpha);

      if (!reduceMotion && visible) raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = pointer.x >= 0 && pointer.y >= 0 && pointer.x <= rect.width && pointer.y <= rect.height;
    };
    const onLeave = () => {
      pointer.active = false;
    };
    const onClick = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nowS = performance.now() / 1000;
      lastUserClick = nowS;
      nextDemo = nowS + USER_QUIET;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const { cx, cy, radius } = geometry();
      // A click on the star presses its centre, like the logo; elsewhere it ripples from the cursor.
      if (Math.hypot(x - cx, y - cy) < radius * 0.75) press(cx, cy, nowS);
      else press(x, y, nowS);
      if (reduceMotion) requestAnimationFrame(draw);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && formStart === Number.POSITIVE_INFINITY) formStart = performance.now();
      if (visible && !reduceMotion) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(draw);
      }
    });
    io.observe(canvas);
    window.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerdown', onClick);
    canvas.addEventListener('pointerleave', onLeave);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerdown', onClick);
      canvas.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className={`block w-full h-full cursor-pointer ${className}`} aria-hidden="true" />;
};

export default StarConstellation;
