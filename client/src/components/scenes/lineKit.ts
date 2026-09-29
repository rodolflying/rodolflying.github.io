// Drawing kit for the executive style: the same stories as the pixel scenes, drawn as clean
// vector line art (light outline, one accent, soft duotone fills) on the night background.
// Scenes draw in a 480x270 logical space on a 960x540 canvas (x2) for crisp lines.
import { clamp, ease, seg } from '../pixel/engine';

export { clamp, ease, seg };

export const LW = 480;
export const LH = 270;
export const SCALE = 2;
export const CANVAS_W = LW * SCALE;
export const CANVAS_H = LH * SCALE;

export const COL = {
  bg: '#0A0F1C', bg2: '#0E1626', panel: '#111B2E', line: '#CBD5E1', soft: '#94A3B8', dim: '#475569', faint: '#1E2A40',
  mint: '#47E5C2', coral: '#FF7A85', gold: '#FFC857', sky: '#7C9CFF', white: '#F1F5F9', vest: '#F59E4B',
};

export type Lang = 'es' | 'en';
export interface LineState { lang?: Lang }

let G: CanvasRenderingContext2D;
export const ctx = () => G;

/** Start a frame: scale to the logical space and set round caps. */
export function begin(g: CanvasRenderingContext2D) {
  G = g;
  g.setTransform(SCALE, 0, 0, SCALE, 0, 0);
  g.lineCap = 'round';
  g.lineJoin = 'round';
  g.globalAlpha = 1;
  g.setLineDash([]);
}

export function rgba(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

interface Paint { stroke?: string; fill?: string; fa?: number; w?: number; a?: number; dash?: number[] }
function paint({ stroke, fill, fa = 1, w = 1.6, a = 1, dash }: Paint) {
  G.save();
  G.globalAlpha *= a;
  if (fill) { G.fillStyle = fa === 1 ? fill : rgba(fill, fa); G.fill(); }
  if (stroke) { G.strokeStyle = stroke; G.lineWidth = w; if (dash) G.setLineDash(dash); G.stroke(); }
  G.restore();
}

export function poly(pts: Array<[number, number]>, p: Paint, closed = false) {
  G.beginPath();
  pts.forEach(([x, y], i) => (i ? G.lineTo(x, y) : G.moveTo(x, y)));
  if (closed) G.closePath();
  paint(p);
}
export function line(x1: number, y1: number, x2: number, y2: number, stroke: string, w = 1.6, a = 1) {
  poly([[x1, y1], [x2, y2]], { stroke, w, a });
}
export function box(x: number, y: number, w: number, h: number, r: number, p: Paint) {
  G.beginPath();
  G.roundRect(x, y, w, h, r);
  paint(p);
}
export function circle(x: number, y: number, r: number, p: Paint) {
  G.beginPath();
  G.arc(x, y, Math.max(0, r), 0, Math.PI * 2);
  paint(p);
}
export function arc(x: number, y: number, r: number, a0: number, a1: number, p: Paint) {
  G.beginPath();
  G.arc(x, y, Math.max(0, r), a0, a1);
  paint(p);
}
export function text(s: string, x: number, y: number, o: { size?: number; color?: string; weight?: number; align?: CanvasTextAlign; font?: 'sans' | 'display' | 'mono'; a?: number } = {}) {
  const fam = o.font === 'display' ? "'Space Grotesk', Inter, sans-serif" : o.font === 'mono' ? "'JetBrains Mono', monospace" : 'Inter, system-ui, sans-serif';
  G.save();
  G.globalAlpha *= o.a ?? 1;
  G.font = `${o.weight ?? 500} ${o.size ?? 10}px ${fam}`;
  G.fillStyle = o.color ?? COL.line;
  G.textAlign = o.align ?? 'left';
  G.textBaseline = 'middle';
  G.fillText(s, x, y);
  G.restore();
}
/** A check mark drawn up to fraction k. */
export function check(x: number, y: number, s: number, color: string, k = 1, w = 2) {
  const pts: Array<[number, number]> = [[x, y], [x + 3 * s, y + 3 * s], [x + 9 * s, y - 4 * s]];
  const L1 = Math.hypot(3 * s, 3 * s), L2 = Math.hypot(6 * s, 7 * s), total = L1 + L2;
  G.save();
  G.setLineDash([total * clamp(k), total]);
  poly(pts, { stroke: color, w });
  G.restore();
}

// ---------------------------------------------------------------- set pieces
/** Night-to-day sky: d = 0 night, 1 morning. */
export function sky(d: number, horizon = 170) {
  const g = G.createLinearGradient(0, 0, 0, horizon);
  const top = mixHex('#060A16', '#1E3563', d), low = mixHex('#111C33', '#C7A27F', d);
  g.addColorStop(0, top); g.addColorStop(1, low);
  G.fillStyle = g;
  G.fillRect(0, 0, LW, horizon);
}
export function mixHex(a: string, b: string, k: number) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const ch = (s: number) => Math.round(((pa >> s) & 255) + ((((pb >> s) & 255) - ((pa >> s) & 255)) * clamp(k)));
  return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
}
export function stars(t: number, a = 1) {
  for (let i = 0; i < 34; i++) {
    const x = (i * 97.3) % LW, y = (i * 53.7) % 120 + 6;
    const tw = 0.5 + 0.5 * Math.sin(t * 2 + i * 1.7);
    circle(x, y, i % 7 ? 0.7 : 1.1, { fill: i % 9 ? COL.soft : COL.gold, a: a * (0.35 + tw * 0.5) });
  }
}
export function mountains(y: number, color: string, a = 1) {
  const pts: Array<[number, number]> = [[0, y]];
  for (let x = 0; x <= LW; x += 12) pts.push([x, y - 14 - Math.sin(x * 0.018) * 9 - Math.sin(x * 0.05 + 1) * 4]);
  pts.push([LW, y]);
  poly(pts, { fill: color, fa: 0.55, stroke: COL.dim, w: 1.2, a }, true);
}
/** Road with painted lines that never move (only the vehicles do). */
export function road(y: number) {
  G.fillStyle = '#0D1424';
  G.fillRect(0, y, LW, 26);
  line(0, y, LW, y, COL.dim, 1.2);
  line(0, y + 26, LW, y + 26, COL.dim, 1.2);
  for (let x = 6; x < LW; x += 28) line(x, y + 13, x + 12, y + 13, COL.gold, 1.4, 0.55);
}
export function tower(x: number, base: number, h: number, signal: number, t: number) {
  const top = base - h;
  poly([[x - 9, base], [x, top], [x + 9, base]], { stroke: COL.dim, w: 1.3 });
  for (let k = 1; k < 5; k++) { const yy = base - (h * k) / 5; const hw = 9 * (1 - k / 5); line(x - hw, yy, x + hw, yy, COL.dim, 1); }
  if (signal > 0) for (let r = 0; r < 3; r++) {
    const rad = 6 + r * 5 + ((t * 10) % 5);
    arc(x, top, rad, -Math.PI * 0.8, -Math.PI * 0.2, { stroke: COL.mint, w: 1.2, a: signal * (1 - r / 3) * 0.8 });
  }
}

/** Service truck facing right; (x, ground) = rear wheel line. */
export function truck(x: number, ground: number, o: { led: string; t: number; moving?: boolean; lights?: boolean; signal?: number }) {
  const y = ground;
  if (o.lights) {
    const gr = G.createLinearGradient(x + 92, 0, x + 170, 0);
    gr.addColorStop(0, rgba(COL.gold, 0.22)); gr.addColorStop(1, rgba(COL.gold, 0));
    G.beginPath(); G.moveTo(x + 92, y - 20); G.lineTo(x + 170, y - 32); G.lineTo(x + 170, y - 2); G.lineTo(x + 92, y - 14); G.closePath();
    G.fillStyle = gr; G.fill();
  }
  box(x, y - 44, 62, 32, 4, { fill: COL.panel, stroke: COL.line, w: 1.6 });
  line(x + 6, y - 30, x + 40, y - 30, COL.mint, 2, 0.8);
  poly([[x + 64, y - 12], [x + 64, y - 38], [x + 80, y - 38], [x + 92, y - 24], [x + 92, y - 12]], { fill: COL.panel, stroke: COL.line, w: 1.6 }, true);
  poly([[x + 70, y - 34], [x + 79, y - 34], [x + 87, y - 24], [x + 70, y - 24]], { fill: COL.sky, fa: 0.25, stroke: COL.soft, w: 1.2 }, true);
  line(x + 2, y - 10, x + 92, y - 10, COL.line, 1.6);
  for (const wx of [14, 36, 80]) {
    circle(x + wx, y - 5, 6, { fill: COL.bg, stroke: COL.line, w: 1.6 });
    const a = o.moving ? o.t * 9 : 0;
    line(x + wx - Math.cos(a) * 3.5, y - 5 - Math.sin(a) * 3.5, x + wx + Math.cos(a) * 3.5, y - 5 + Math.sin(a) * 3.5, COL.soft, 1.2);
  }
  // roof antenna + status light
  line(x + 72, y - 38, x + 72, y - 50, COL.line, 1.6);
  circle(x + 72, y - 51, 5, { fill: o.led, fa: 0.18 });
  circle(x + 72, y - 51, 2.3, { fill: o.led });
  if (o.signal && o.signal > 0) for (let r = 0; r < 2; r++) arc(x + 72, y - 51, 6 + r * 4 + ((o.t * 8) % 4), -Math.PI * 0.85, -Math.PI * 0.15, { stroke: COL.mint, w: 1.1, a: o.signal * (1 - r / 2) });
}
/** The antenna tip of a truck drawn at (x, ground). */
export const antennaOf = (x: number, ground: number): [number, number] => [x + 72, ground - 51];

export type Pose = 'stand' | 'walk' | 'reach' | 'thumbs';
/** A simple, well-proportioned figure; (x, foot) = feet. `to` is where a reaching hand goes. */
export function person(x: number, foot: number, o: { t: number; pose?: Pose; facing?: 1 | -1; helmet?: boolean; vest?: boolean; shirt?: string; to?: [number, number] }) {
  const f = o.facing ?? 1;
  const hip = foot - 24, sh = foot - 44, head = foot - 53;
  const walk = o.pose === 'walk' ? Math.sin(o.t * 9) : 0;
  line(x, hip, x - 5 + walk * 5, foot, COL.line, 2.8);
  line(x, hip, x + 5 - walk * 5, foot, COL.line, 2.8);
  line(x - 5 + walk * 5 - 1, foot, x - 5 + walk * 5 + 3 * (o.facing ?? 1), foot, COL.line, 3);
  line(x + 5 - walk * 5 - 1, foot, x + 5 - walk * 5 + 3 * (o.facing ?? 1), foot, COL.line, 3);
  box(x - 8, sh - 2, 16, 24, 6, { fill: o.vest ? COL.vest : (o.shirt ?? COL.sky), fa: o.vest ? 0.55 : 0.3, stroke: COL.line, w: 1.6 });
  if (o.vest) { line(x - 7, sh + 8, x + 7, sh + 8, COL.white, 1.2, 0.8); line(x - 7, sh + 14, x + 7, sh + 14, COL.white, 1.2, 0.8); }
  // back arm
  const back: [number, number] = o.pose === 'walk' ? [x - f * (4 + walk * 5), hip + 2] : [x - f * 8, hip + 3];
  line(x - f * 6, sh + 2, back[0], back[1], COL.line, 2.6);
  // front arm
  let hand: [number, number];
  if (o.pose === 'reach' && o.to) hand = o.to;
  else if (o.pose === 'thumbs') hand = [x + f * 13, sh - 8];
  else if (o.pose === 'walk') hand = [x + f * (4 - walk * 5), hip + 2];
  else hand = [x + f * 8, hip + 3];
  if (o.pose === 'thumbs') { line(x + f * 6, sh + 2, x + f * 13, sh + 4, COL.line, 2.6); line(x + f * 13, sh + 4, hand[0], hand[1], COL.line, 2.6); line(hand[0], hand[1], hand[0], hand[1] - 4, COL.line, 2.4); }
  else line(x + f * 6, sh + 2, hand[0], hand[1], COL.line, 2.6);
  circle(x, head, 7, { fill: COL.bg2, stroke: COL.line, w: 1.6 });
  circle(x + f * 3, head - 1, 0.9, { fill: COL.line });
  if (o.helmet) {
    G.beginPath(); G.arc(x, head - 1, 8, Math.PI, 0); G.closePath();
    paint({ fill: COL.gold, stroke: COL.gold, w: 1.4 });
    line(x - 10, head - 1, x + 10, head - 1, COL.gold, 1.8);
  }
  return hand;
}

/** The Star Apps star, the brand's agent: a five-point outline with a soft glow. */
export function brandStar(cx: number, cy: number, r: number, t: number, a = 1) {
  circle(cx, cy, r * 1.9, { fill: COL.mint, fa: 0.08 + 0.04 * Math.sin(t * 3), a });
  const pts: Array<[number, number]> = [];
  for (let i = 0; i < 10; i++) {
    const ang = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.45 : r;
    pts.push([cx + Math.cos(ang) * rr, cy + Math.sin(ang) * rr]);
  }
  poly(pts, { fill: COL.mint, fa: 0.25, stroke: COL.mint, w: 1.6, a }, true);
}
/** A click: two rings that open from (x, y) for k in [0, 1]. */
export function clickRing(x: number, y: number, k: number) {
  if (k <= 0 || k >= 1) return;
  circle(x, y, 4 + k * 22, { stroke: COL.mint, w: 1.6, a: 1 - k });
  if (k > 0.2) circle(x, y, k * 22 - 2, { stroke: COL.mint, w: 1, a: (1 - k) * 0.6 });
}

/** A floating panel (card) with an optional window bar. */
export function panel(x: number, y: number, w: number, h: number, a = 1, bar = true) {
  box(x, y, w, h, 8, { fill: COL.panel, stroke: COL.faint, w: 1.2, a });
  if (bar) {
    line(x, y + 14, x + w, y + 14, COL.faint, 1.2, a);
    for (let i = 0; i < 3; i++) circle(x + 10 + i * 7, y + 7, 1.8, { fill: COL.dim, a });
  }
}
/** A status pill: mint (ok) or coral (alert). */
export function pill(x: number, y: number, ok: boolean, blink = 1) {
  box(x, y, 26, 10, 5, { fill: ok ? COL.mint : COL.coral, fa: 0.2, stroke: ok ? COL.mint : COL.coral, w: 1.1, a: blink });
  circle(x + 7, y + 5, 2, { fill: ok ? COL.mint : COL.coral, a: blink });
  line(x + 12, y + 5, x + 21, y + 5, ok ? COL.mint : COL.coral, 1.4, blink);
}
/** Phone with a notification sliding in (k in [0, 1]). */
export function phone(x: number, y: number, k: number, icon: (x: number, y: number) => void, done = false) {
  box(x, y, 50, 92, 9, { fill: COL.bg2, stroke: COL.line, w: 1.6 });
  line(x + 20, y + 86, x + 30, y + 86, COL.dim, 1.6);
  const bk = ease(clamp(k));
  if (bk <= 0) return;
  const by = y + 12 + (1 - bk) * -10;
  box(x + 5, by, 40, 30, 5, { fill: COL.panel, stroke: COL.mint, w: 1.2, a: bk });
  icon(x + 14, by + 11);
  line(x + 24, by + 9, x + 39, by + 9, COL.line, 1.4, bk);
  line(x + 24, by + 15, x + 34, by + 15, COL.soft, 1.4, bk);
  if (done) check(x + 20, by + 23, 0.8, COL.mint, 1, 1.6);
}
/** Small wrench glyph. */
export function wrench(x: number, y: number, s = 1, color = COL.gold, angle = 0) {
  G.save();
  G.translate(x, y); G.rotate(angle); G.scale(s, s);
  line(-5, 5, 3, -3, color, 2.2);
  arc(5, -5, 3.6, Math.PI * 0.1, Math.PI * 1.6, { stroke: color, w: 2 });
  G.restore();
}
/** Digital clock chip. */
export function clockChip(x: number, y: number, label: string, a = 1) {
  box(x, y, 50, 18, 9, { fill: COL.bg2, stroke: COL.faint, w: 1.2, a });
  circle(x + 10, y + 9, 4, { stroke: COL.soft, w: 1.2, a });
  line(x + 10, y + 9, x + 10, y + 6.5, COL.soft, 1.2, a);
  text(label, x + 18, y + 9.5, { size: 9, font: 'mono', color: COL.white, a });
}

// ---------------------------------------------------------------- screen-space overlays
/** Lower-third caption, like a documentary: a mint dot and one sentence. */
export function caption(s: string, k: number) {
  if (k <= 0) return;
  G.save();
  G.globalAlpha = clamp(k);
  G.font = "500 11px Inter, system-ui, sans-serif";
  const w = G.measureText(s).width + 26;
  box(12, LH - 34, w, 22, 11, { fill: COL.bg, fa: 0.82, stroke: COL.faint, w: 1 });
  circle(24, LH - 23, 3, { fill: COL.mint });
  text(s, 32, LH - 22.5, { size: 11, color: COL.white });
  G.restore();
}
/** The payoff: a figure dropping in at the top, with a small icon. */
export function stamp(value: string, k: number, out: number, color: string, icon: (x: number, y: number) => void) {
  if (k <= 0) return;
  const e = 1 + 2.2 * Math.pow(clamp(k) - 1, 3) + 1.2 * Math.pow(clamp(k) - 1, 2);
  G.save();
  G.font = "700 26px 'Space Grotesk', Inter, sans-serif";
  const w = G.measureText(value).width + 58;
  const x = (LW - w) / 2, y = -40 + 54 * e - 60 * ease(clamp(out));
  box(x, y, w, 40, 10, { fill: COL.bg, fa: 0.92, stroke: color, w: 1.6 });
  icon(x + 20, y + 20);
  text(value, x + 38, y + 21, { size: 26, weight: 700, font: 'display', color: COL.mint });
  G.restore();
}
/** Fade to the background color (screen space). */
export function fade(a: number) {
  if (a <= 0) return;
  G.save();
  G.globalAlpha = clamp(a);
  G.fillStyle = COL.bg;
  G.fillRect(0, 0, LW, LH);
  G.restore();
}
