// Drawing kit for the executive style: the same stories as the pixel scenes, drawn as clean
// vector line art (light outline, one accent, soft duotone fills) on the night background.
// Scenes draw in a 480x270 logical space on a 960x540 canvas (x2) for crisp lines.
// Safe zones: the top-right corner (x > 400, y < 40) holds the page's badges, and the bottom
// band (y > 228) holds the caption, which is HTML over the canvas (components/scenes/AreaScene).
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
  /** Desert ground (the north of Chile), always used as a translucent fill. */
  earth: '#C08A55', skin: '#C9A58A', trousers: '#26334D',
};
/** Stroke weights: every line in a scene uses one of these. */
export const W = { hair: 1, base: 1.6, emph: 2.2 };

export type Lang = 'es' | 'en';
export interface LineState { lang?: Lang }

/** One documentary caption: an optional time label and a sentence, shown from `from` to `to` (s).
 *  The time is a plain clock ("02:40") or, when it carries words, one per language. */
export interface SceneCaptionDef { from: number; to: number; time?: string | { es: string; en: string }; es: string; en: string }
export const captionTime = (c: SceneCaptionDef, lang: Lang) => (typeof c.time === 'object' ? c.time[lang] : c.time);
/** The caption on screen at loop time t, with its opacity (fades 0.35 s in and out). */
export function captionAt(caps: SceneCaptionDef[] | undefined, t: number) {
  const c = caps?.find((c) => t >= c.from && t < c.to);
  if (!c) return null;
  return { cap: c, k: Math.min(seg(t, c.from, c.from + 0.35), 1 - seg(t, c.to - 0.35, c.to)) };
}

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
function paint({ stroke, fill, fa = 1, w = W.base, a = 1, dash }: Paint) {
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
export function line(x1: number, y1: number, x2: number, y2: number, stroke: string, w = W.base, a = 1) {
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
  poly(pts, { fill: color, fa: 0.55, stroke: COL.dim, w: W.hair, a }, true);
}
/** Desert ground from `top` down: d = 0 night, 1 morning (the ochre warms up with the light). */
export function desert(top: number, d: number) {
  G.fillStyle = COL.bg;
  G.fillRect(0, top, LW, LH - top);
  box(0, top, LW, LH - top, 0, { fill: COL.earth, fa: 0.08 + 0.2 * clamp(d) });
  line(0, top, LW, top, COL.dim, W.hair);
  for (let i = 0; i < 26; i++) {
    const x = (i * 83.1) % LW, y = top + 8 + ((i * 29) % (LH - top - 12));
    line(x, y, x + 4 + (i % 3) * 2, y, COL.earth, W.hair, 0.25 + 0.3 * clamp(d));
  }
}
/** A distant open-pit wall: stepped benches on the horizon, from x to x + w. */
export function pit(x: number, base: number, w: number, a = 1) {
  const steps = 4, sh = 6, sw = w / (2 * steps);
  const pts: Array<[number, number]> = [[x, base]];
  for (let i = 0; i < steps; i++) pts.push([x + i * sw + 5, base - (i + 1) * sh], [x + (i + 1) * sw, base - (i + 1) * sh]);
  for (let i = steps - 1; i >= 0; i--) pts.push([x + w - (i + 1) * sw, base - (i + 1) * sh], [x + w - i * sw - 5, base - i * sh]);
  poly(pts, { fill: COL.earth, fa: 0.1, stroke: COL.dim, w: W.hair, a }, true);
}
/** Road with painted lines that never move (only the vehicles do). */
export function road(y: number) {
  G.fillStyle = '#0D1424';
  G.fillRect(0, y, LW, 26);
  line(0, y, LW, y, COL.dim, W.hair);
  line(0, y + 26, LW, y + 26, COL.dim, W.hair);
  for (let x = 6; x < LW; x += 28) line(x, y + 13, x + 12, y + 13, COL.gold, W.base, 0.55);
}
export function tower(x: number, base: number, h: number, signal: number, t: number) {
  const top = base - h;
  poly([[x - 9, base], [x, top], [x + 9, base]], { stroke: COL.dim, w: W.base });
  for (let k = 1; k < 5; k++) { const yy = base - (h * k) / 5; const hw = 9 * (1 - k / 5); line(x - hw, yy, x + hw, yy, COL.dim, W.hair); }
  if (signal > 0) for (let r = 0; r < 3; r++) {
    const rad = 6 + r * 5 + ((t * 10) % 5);
    arc(x, top, rad, -Math.PI * 0.8, -Math.PI * 0.2, { stroke: COL.mint, w: W.hair, a: signal * (1 - r / 3) * 0.8 });
  }
}

/** A wheel: tyre, rim and a hub bolt that turns when moving. */
function wheel(x: number, y: number, r: number, spin: number) {
  circle(x, y, r, { fill: COL.bg, stroke: COL.line, w: W.base });
  circle(x, y, r * 0.45, { fill: COL.faint, stroke: COL.soft, w: W.hair });
  circle(x + Math.cos(spin) * r * 0.45, y + Math.sin(spin) * r * 0.45, 0.9, { fill: COL.soft });
}

/**
 * Mining pickup (double-cab 4x4) facing right, with the whip flag every pickup carries on a
 * mine site and a telemetry modem on the roof. (x, ground) = where the tyres touch the ground.
 */
export function pickup(x: number, ground: number, o: { led: string; t: number; moving?: boolean; lights?: boolean; signal?: number }) {
  const y = ground;
  if (o.lights) {
    const gr = G.createLinearGradient(x + 104, 0, x + 180, 0);
    gr.addColorStop(0, rgba(COL.gold, 0.22)); gr.addColorStop(1, rgba(COL.gold, 0));
    G.beginPath(); G.moveTo(x + 104, y - 22); G.lineTo(x + 180, y - 34); G.lineTo(x + 180, y - 6); G.lineTo(x + 104, y - 16); G.closePath();
    G.fillStyle = gr; G.fill();
  }
  // whip flag on the tray
  const sway = o.moving ? Math.sin(o.t * 6) * 2 : 0;
  line(x + 6, y - 24, x + 4 + sway, y - 74, COL.soft, W.hair);
  poly([[x + 4 + sway, y - 74], [x - 8 + sway * 1.4, y - 71], [x + 4 + sway, y - 67]], { fill: COL.coral, fa: 0.7, stroke: COL.coral, w: W.hair }, true);
  // tray + double cab + bonnet as one body outline
  poly([
    [x, y - 10], [x, y - 26], [x + 40, y - 26], [x + 44, y - 44], [x + 78, y - 44], [x + 88, y - 28],
    [x + 104, y - 25], [x + 106, y - 12], [x + 104, y - 10],
  ], { fill: COL.panel, stroke: COL.line, w: W.base }, true);
  poly([[x + 47, y - 41], [x + 60, y - 41], [x + 60, y - 29], [x + 45, y - 29]], { fill: COL.sky, fa: 0.2, stroke: COL.soft, w: W.hair }, true);
  poly([[x + 63, y - 41], [x + 76, y - 41], [x + 84, y - 29], [x + 63, y - 29]], { fill: COL.sky, fa: 0.2, stroke: COL.soft, w: W.hair }, true);
  line(x + 62, y - 29, x + 62, y - 13, COL.dim, W.hair);
  line(x + 4, y - 19, x + 38, y - 19, COL.mint, W.emph, 0.8);
  // roof beacon and telemetry modem
  box(x + 50, y - 48, 12, 4, 2, { fill: COL.gold, fa: 0.5, stroke: COL.gold, w: W.hair });
  line(x + 72, y - 44, x + 72, y - 54, COL.line, W.base);
  circle(x + 72, y - 55, 5, { fill: o.led, fa: 0.18 });
  circle(x + 72, y - 55, 2.3, { fill: o.led });
  if (o.signal && o.signal > 0) for (let r = 0; r < 2; r++) arc(x + 72, y - 55, 6 + r * 4 + ((o.t * 8) % 4), -Math.PI * 0.85, -Math.PI * 0.15, { stroke: COL.mint, w: W.hair, a: o.signal * (1 - r / 2) });
  const spin = o.moving ? o.t * 9 : 0.6;
  wheel(x + 22, y - 7, 7, spin);
  wheel(x + 86, y - 7, 7, spin);
}
/** The modem tip of a pickup drawn at (x, ground). */
export const antennaOf = (x: number, ground: number): [number, number] => [x + 72, ground - 55];

export type Pose = 'stand' | 'walk' | 'hold' | 'thumbs';
/** A limb drawn as an outline with a soft fill, like everything else in the kit. */
export function limb(x1: number, y1: number, x2: number, y2: number, fill: string, thick = 3.6) {
  line(x1, y1, x2, y2, COL.line, thick + W.base * 2);
  line(x1, y1, x2, y2, fill, thick);
}
/**
 * A figure; (x, foot) = feet. Limbs, torso and head share the kit's outline weight.
 * `hold` raises the front hand to chest height (a tablet goes there). Returns the front hand.
 */
export function person(x: number, foot: number, o: { t: number; pose?: Pose; facing?: 1 | -1; helmet?: boolean; vest?: boolean; shirt?: string }) {
  const f = o.facing ?? 1;
  const hip = foot - 24, sh = foot - 44, head = foot - 53;
  const walk = o.pose === 'walk' ? Math.sin(o.t * 9) : 0;
  const top = o.vest ? COL.vest : (o.shirt ?? COL.sky);
  for (const s of [-1, 1]) {
    const fx = x + s * (4 - walk * 5);
    limb(x + s * 2.5, hip, fx, foot - 3, COL.trousers, 4.2);
    box(fx - 3.5 + f * 1.5, foot - 3.5, 7, 3.5, 1.5, { fill: COL.bg2, stroke: COL.line, w: W.hair });
  }
  const back: [number, number] = o.pose === 'walk' ? [x - f * (4 + walk * 5), hip + 1] : [x - f * 7, hip + 2];
  limb(x - f * 5, sh + 3, back[0], back[1], top);
  box(x - 8, sh - 2, 16, 24, 6, { fill: COL.bg2, stroke: COL.line, w: W.base });
  box(x - 8, sh - 2, 16, 24, 6, { fill: top, fa: o.vest ? 0.6 : 0.3 });
  if (o.vest) { line(x - 7, sh + 8, x + 7, sh + 8, COL.white, W.hair, 0.85); line(x - 7, sh + 14, x + 7, sh + 14, COL.white, W.hair, 0.85); }
  let hand: [number, number];
  if (o.pose === 'hold') hand = [x + f * 11, sh + 7];
  else if (o.pose === 'thumbs') hand = [x + f * 13, sh - 6];
  else if (o.pose === 'walk') hand = [x + f * (4 - walk * 5), hip + 1];
  else hand = [x + f * 7, hip + 2];
  if (o.pose === 'thumbs') { limb(x + f * 5, sh + 3, x + f * 13, sh + 6, top); limb(x + f * 13, sh + 6, hand[0], hand[1], COL.skin, 3); }
  else limb(x + f * 5, sh + 3, hand[0], hand[1], top);
  circle(hand[0], hand[1], 2.4, { fill: COL.skin, stroke: COL.line, w: W.hair });
  circle(x, head, 7, { fill: COL.skin, fa: 0.85, stroke: COL.line, w: W.base });
  circle(x + f * 3, head - 0.5, 0.9, { fill: COL.bg });
  if (o.helmet) {
    G.beginPath(); G.arc(x, head - 1.5, 8, Math.PI, 0); G.closePath();
    paint({ fill: COL.gold, stroke: COL.line, w: W.hair });
    line(x - 10, head - 1.5, x + 10, head - 1.5, COL.line, W.base);
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
  poly(pts, { fill: COL.mint, fa: 0.25, stroke: COL.mint, w: W.base, a }, true);
}
/** A click: two rings that open from (x, y) for k in [0, 1]. */
export function clickRing(x: number, y: number, k: number) {
  if (k <= 0 || k >= 1) return;
  circle(x, y, 4 + k * 22, { stroke: COL.mint, w: W.base, a: 1 - k });
  if (k > 0.2) circle(x, y, k * 22 - 2, { stroke: COL.mint, w: W.hair, a: (1 - k) * 0.6 });
}

/** A floating panel (card) with an optional window bar. */
export function panel(x: number, y: number, w: number, h: number, a = 1, bar = true) {
  box(x, y, w, h, 8, { fill: COL.panel, stroke: COL.faint, w: W.hair, a });
  if (bar) {
    line(x, y + 14, x + w, y + 14, COL.faint, W.hair, a);
    for (let i = 0; i < 3; i++) circle(x + 10 + i * 7, y + 7, 1.8, { fill: COL.dim, a });
  }
}
/** A status dot with a short word, so the state reads as data rather than as a switch. */
export function status(x: number, y: number, kind: 'ok' | 'alert' | 'busy', label: string, a = 1) {
  const c = kind === 'ok' ? COL.mint : kind === 'alert' ? COL.coral : COL.gold;
  circle(x + 3, y, 3.2, { fill: c, fa: 0.25, stroke: c, w: W.hair, a });
  circle(x + 3, y, 1.4, { fill: c, a });
  text(label, x + 10, y + 0.5, { size: 9, weight: 600, color: c, a });
}
/** Circular "restart" arrow, turned by `spin` (radians). */
export function restart(x: number, y: number, r: number, spin: number, color = COL.gold, a = 1) {
  const a1 = spin + Math.PI * 1.6;
  arc(x, y, r, spin, a1, { stroke: color, w: W.base, a });
  const ex = x + Math.cos(a1) * r, ey = y + Math.sin(a1) * r;
  const tx = -Math.sin(a1), ty = Math.cos(a1); // direction of travel at the arrow tip
  const nx = Math.cos(a1), ny = Math.sin(a1);
  poly([[ex + tx * 3.2, ey + ty * 3.2], [ex + nx * 2.6, ey + ny * 2.6], [ex - nx * 2.6, ey - ny * 2.6]], { fill: color, a }, true);
}
/** Phone with a notification sliding in (k in [0, 1]). */
export function phone(x: number, y: number, k: number, icon: (x: number, y: number) => void, done = false) {
  box(x, y, 50, 92, 9, { fill: COL.bg2, stroke: COL.line, w: W.base });
  line(x + 20, y + 86, x + 30, y + 86, COL.dim, W.base);
  const bk = ease(clamp(k));
  if (bk <= 0) return;
  const by = y + 12 + (1 - bk) * -10;
  box(x + 5, by, 40, 30, 5, { fill: COL.panel, stroke: COL.mint, w: W.hair, a: bk });
  icon(x + 14, by + 11);
  line(x + 24, by + 9, x + 39, by + 9, COL.line, W.base, bk);
  line(x + 24, by + 15, x + 34, by + 15, COL.soft, W.hair, bk);
  if (done) check(x + 20, by + 23, 0.8, COL.mint, 1, W.base);
}
/** Small wrench glyph. */
export function wrench(x: number, y: number, s = 1, color = COL.gold, angle = 0) {
  G.save();
  G.translate(x, y); G.rotate(angle); G.scale(s, s);
  line(-5, 5, 3, -3, color, W.emph);
  arc(5, -5, 3.6, Math.PI * 0.1, Math.PI * 1.6, { stroke: color, w: W.emph });
  G.restore();
}
/** Digital clock chip. */
export function clockChip(x: number, y: number, label: string, a = 1) {
  box(x, y, 60, 20, 10, { fill: COL.bg2, stroke: COL.faint, w: W.hair, a });
  circle(x + 11, y + 10, 4.5, { stroke: COL.soft, w: W.hair, a });
  line(x + 11, y + 10, x + 11, y + 7, COL.soft, W.hair, a);
  line(x + 11, y + 10, x + 13, y + 11, COL.soft, W.hair, a);
  text(label, x + 20, y + 10.5, { size: 11, weight: 600, font: 'mono', color: COL.white, a });
}

// ---------------------------------------------------------------- the payoff
/**
 * The brand's signature ending ("we connect the dots"): the story's key points light up one
 * by one and a dotted mint line joins them, ending on the star. k in [0, 1].
 * `glyphs[i]` draws a small icon inside node i (all but the last, which is the star).
 */
export function constellation(pts: Array<[number, number]>, k: number, t: number, glyphs: Array<((x: number, y: number, a: number) => void) | undefined> = []) {
  if (k <= 0) return;
  const n = pts.length;
  G.save();
  G.setLineDash([2.5, 4]);
  G.lineDashOffset = -t * 8;
  for (let i = 0; i < n - 1; i++) {
    const lk = clamp(k * n - i - 0.6);
    if (lk <= 0) continue;
    const [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
    G.beginPath(); G.moveTo(x1, y1); G.lineTo(x1 + (x2 - x1) * lk, y1 + (y2 - y1) * lk);
    G.strokeStyle = COL.mint; G.lineWidth = W.base; G.globalAlpha = 0.85; G.stroke();
  }
  G.restore();
  pts.forEach(([x, y], i) => {
    const nk = ease(clamp(k * n - i));
    if (nk <= 0) return;
    if (i === n - 1) { brandStar(x, y, 6 + 3 * nk, t, nk); return; }
    circle(x, y, 10 * nk, { fill: COL.bg, fa: 0.92, stroke: COL.mint, w: W.base });
    glyphs[i]?.(x, y, nk);
  });
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
