// Shared pixel-art engine for the high-detail scenes: palette with shading ramps,
// drawing helpers bound to a current context, dithered lighting, the star mascot.

export type RGB = [number, number, number];
export interface Rect { x: number; y: number; w: number; h: number }
export interface Light { x: number; y: number; r: number; c: RGB; i: number }

// ---------------------------------------------------------------- math / colour utils
export const hex = (h: string): RGB => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
export const css = (c: RGB, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
export const mix = (a: RGB, b: RGB, k: number): RGB => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOutBack = (t: number) => 1 + 2.2 * Math.pow(t - 1, 3) + 1.2 * Math.pow(t - 1, 2);
export const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
export const rnd = (i: number) => {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

// ---------------------------------------------------------------- palette (ramps, hue-shifted)
export const C = {
  ink: '#05070F',
  wall0: '#0E1528', wall1: '#141E38', wall2: '#1A2745', wall3: '#233357',
  base: '#0B111F',
  floor0: '#2A1B14', floor1: '#3E291C', floor2: '#553824', floor3: '#6E4A30',
  wood0: '#2E1D14', wood1: '#4A2F1F', wood2: '#6B4630', wood3: '#8C6242',
  metal0: '#1B2233', metal1: '#2B3448', metal2: '#445067', metal3: '#6A7690', metal4: '#9AA6BE',
  frame0: '#0C1120', frame1: '#1C2740',
  hair0: '#1E120D', hair1: '#3A2319', hair2: '#5A3726',
  paper0: '#7E8AA0', paper1: '#B9C3D3', paper2: '#E4EAF3', paper3: '#FFFFFF',
  mint0: '#0E5A4C', mint1: '#16866F', mint2: '#1FB894', mint3: '#47E5C2', mint4: '#8DF0D8', mint5: '#D6FFF4',
  gold0: '#7A5212', gold1: '#B57E22', gold2: '#E8A93C', gold3: '#FFC857', gold4: '#FFE2A3',
  coral0: '#7A2B3A', coral1: '#C44E5E', coral2: '#FF7A85', coral3: '#FFB3BA',
  leaf0: '#1F4A2A', leaf1: '#2E6B3A', leaf2: '#3F8F4A', leaf3: '#6BC46B',
  pot0: '#6B2E1E', pot1: '#9A4A2E', pot2: '#C4683F',
  blue1: '#1B5A7A', blue2: '#3AA0C8', blue3: '#8FD6F0',
  // outdoor / work site
  sand0: '#5A3E2A', sand1: '#8A6242', sand2: '#B98A5C', sand3: '#D9AE7C',
  rock0: '#2A2233', rock1: '#3E3348', rock2: '#5A4A62',
  asphalt0: '#16181F', asphalt1: '#23262F', asphalt2: '#333845',
  vest0: '#A8420E', vest1: '#E0621C', vest2: '#FF8A2A', vest3: '#FFB066',
  helmet0: '#A87A12', helmet1: '#E0AC1E', helmet2: '#FFD23F', helmet3: '#FFEE9A',
  truck0: '#5A1E1E', truck1: '#9A2E2A', truck2: '#D4483C', truck3: '#F07A5E',
  glass0: '#0C1830', glass1: '#2A4A7A',
};

/** 4x4 Bayer matrix for ordered dithering. */
export const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

// ---------------------------------------------------------------- context-bound drawing
let G: CanvasRenderingContext2D;
export const setCtx = (g: CanvasRenderingContext2D) => { G = g; };
export const ctx = () => G;

export const rect = (x: number, y: number, w: number, h: number, c: string) => {
  G.fillStyle = c;
  G.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
};
export const dot = (x: number, y: number, c: string) => rect(x, y, 1, 1, c);
/** Rect with a 1px dark outline. */
export const orect = (x: number, y: number, w: number, h: number, c: string) => { rect(x - 1, y - 1, w + 2, h + 2, C.ink); rect(x, y, w, h, c); };

export function sprite(rows: string[], map: Record<string, string>, x: number, y: number, flip = false) {
  const w = rows[0].length;
  for (let j = 0; j < rows.length; j++) {
    const row = rows[j];
    for (let i = 0; i < row.length; i++) {
      const c = map[row[i]];
      if (c) dot(flip ? x + (w - 1 - i) : x + i, y + j, c);
    }
  }
}

export function ring(cx: number, cy: number, r: number, c: string) {
  const steps = Math.max(16, Math.round(r * 6));
  for (let i = 0; i < steps; i++) { const a = (i / steps) * Math.PI * 2; dot(cx + Math.cos(a) * r, cy + Math.sin(a) * r, c); }
}

const DIGITS: Record<string, string[]> = {
  '0': ['###', '#.#', '#.#', '#.#', '###'], '1': ['.#.', '##.', '.#.', '.#.', '###'], '2': ['###', '..#', '###', '#..', '###'],
  '3': ['###', '..#', '.##', '..#', '###'], '4': ['#.#', '#.#', '###', '..#', '..#'], '5': ['###', '#..', '###', '..#', '###'],
  '6': ['###', '#..', '###', '#.#', '###'], '7': ['###', '..#', '.#.', '.#.', '.#.'], '8': ['###', '#.#', '###', '#.#', '###'],
  '9': ['###', '#.#', '###', '..#', '###'], ':': ['...', '.#.', '...', '.#.', '...'],
};
/** Tiny 3x5 digits (and ':'). */
export function number(n: number | string, x: number, y: number, c: string) {
  String(n).split('').forEach((d, i) => { if (DIGITS[d]) sprite(DIGITS[d], { '#': c }, x + i * 4, y); });
}

/** Vertical gradient with ordered dithering between `steps` bands. */
export function ditherGradient(area: Rect, colorAt: (y01: number) => RGB, steps = 10) {
  const img = G.getImageData(area.x, area.y, area.w, area.h);
  const bands: RGB[] = [];
  for (let k = 0; k <= steps; k++) bands.push(colorAt(k / steps));
  for (let y = 0; y < area.h; y++) {
    for (let x = 0; x < area.w; x++) {
      const b = BAYER[(y & 3) * 4 + (x & 3)];
      const c = bands[Math.min(steps, Math.floor((y / area.h) * steps + b))];
      const i = (y * area.w + x) * 4;
      img.data[i] = c[0]; img.data[i + 1] = c[1]; img.data[i + 2] = c[2]; img.data[i + 3] = 255;
    }
  }
  G.putImageData(img, area.x, area.y);
}

// ---------------------------------------------------------------- lighting
interface LightingOptions {
  view: Rect;
  ambient: RGB;
  lights: Light[];
  /** Areas that emit light themselves (skies, screens): left untouched. */
  emissive?: Rect[];
  /** Extra light at a pixel (window shafts, headlight cones...). */
  extra?: (x: number, y: number) => RGB | null;
  steps?: number;
}

/** Multiplies the albedo layer by dithered, quantized light (point lights + ambient + extras). */
export function lightingPass({ view, ambient, lights, emissive = [], extra, steps = 6 }: LightingOptions) {
  const img = G.getImageData(view.x, view.y, view.w, view.h);
  const data = img.data;
  for (let y = view.y; y < view.y + view.h; y++) {
    for (let x = view.x; x < view.x + view.w; x++) {
      let skip = false;
      for (const e of emissive) if (x >= e.x && x < e.x + e.w && y >= e.y && y < e.y + e.h) { skip = true; break; }
      if (skip) continue;
      let r = ambient[0], g = ambient[1], b = ambient[2];
      for (const L of lights) {
        const dx = x - L.x, dy = y - L.y;
        const d2 = dx * dx + dy * dy;
        if (d2 > L.r * L.r) continue;
        const f = 1 - Math.sqrt(d2) / L.r;
        const k = f * f * L.i;
        r += L.c[0] * k; g += L.c[1] * k; b += L.c[2] * k;
      }
      if (extra) {
        const e = extra(x, y);
        if (e) { r += e[0]; g += e[1]; b += e[2]; }
      }
      const bay = BAYER[(y & 3) * 4 + (x & 3)];
      const i = ((y - view.y) * view.w + (x - view.x)) * 4;
      data[i] = Math.min(255, data[i] * Math.min(1.35, Math.floor(r * steps + bay) / steps));
      data[i + 1] = Math.min(255, data[i + 1] * Math.min(1.35, Math.floor(g * steps + bay) / steps));
      data[i + 2] = Math.min(255, data[i + 2] * Math.min(1.35, Math.floor(b * steps + bay) / steps));
    }
  }
  G.putImageData(img, view.x, view.y);
}

/** Lazily-created offscreen world canvas per scene key. */
const worlds = new Map<string, HTMLCanvasElement>();
export function world(key: string, w: number, h: number) {
  let c = worlds.get(key);
  if (!c) { c = document.createElement('canvas'); c.width = w; c.height = h; worlds.set(key, c); }
  const g = c.getContext('2d', { willReadFrequently: true })!;
  g.imageSmoothingEnabled = false;
  return { canvas: c, g };
}

// ---------------------------------------------------------------- the Star Apps mascot
const STAR_N = [
  '.......o.......',
  '......oLo......',
  '......oLo......',
  '.....oLmmo.....',
  'oooooLmmmmooooo',
  'oLLLmmmmmmmmmdo',
  '.ommmmmmmmmmdo.',
  '..ommmmmmmmdo..',
  '...ommmmmmmdo..',
  '..ommmmodmmmdo.',
  '..ommdo...ommdo',
  '.ommdo.....omdo',
  '.ooo.........oo',
];
const STAR_SQUASH = [
  '........o........',
  '.......oLo.......',
  '......oLmmo......',
  'ooooooLmmmmoooooo',
  'oLLLmmmmmmmmmmmdo',
  '.ommmmmmmmmmmmdo.',
  '..ommmmmmmmmmdo..',
  '..ommmmoodmmmdo..',
  '.ommdo.....oommdo',
  'oooo.........oooo',
];
const STAR_STRETCH = [
  '......o......',
  '.....oLo.....',
  '.....oLo.....',
  '.....oLmo....',
  '....oLmmo....',
  'oooooLmmmoooo',
  'oLLmmmmmmmmdo',
  '.ommmmmmmmdo.',
  '..ommmmmmdo..',
  '..ommmmmmdo..',
  '..ommmodmdo..',
  '.ommdo.ommdo.',
  '.ommo...ommo.',
  '.oo.......oo.',
];
const STAR_MAP = { o: C.mint1, L: C.mint5, m: C.mint3, d: C.mint2 };
export type StarShape = 'n' | 'squash' | 'stretch';
export type StarEyes = 'open' | 'blink' | 'happy' | 'focus';

/** The mascot, bottom-centred on (cx, bottom). */
export function drawStar(cx: number, bottom: number, shape: StarShape = 'n', eyes: StarEyes = 'open', headphones = false) {
  const rows = shape === 'squash' ? STAR_SQUASH : shape === 'stretch' ? STAR_STRETCH : STAR_N;
  const w = rows[0].length, h = rows.length;
  const x = Math.round(cx - w / 2), y = Math.round(bottom - h);
  sprite(rows, STAR_MAP, x, y);
  const ey = y + Math.round(h * 0.52), ex = x + Math.round(w / 2) - 3;
  if (eyes === 'blink') { rect(ex, ey + 1, 2, 1, C.mint0); rect(ex + 4, ey + 1, 2, 1, C.mint0); }
  else if (eyes === 'happy') { dot(ex, ey + 1, C.mint0); dot(ex + 1, ey, C.mint0); dot(ex + 4, ey, C.mint0); dot(ex + 5, ey + 1, C.mint0); }
  else if (eyes === 'focus') { rect(ex, ey, 2, 2, C.ink); rect(ex + 4, ey, 2, 2, C.ink); dot(ex + 1, ey, C.paper3); dot(ex + 5, ey, C.paper3); }
  else { rect(ex, ey - 1, 2, 3, C.ink); rect(ex + 4, ey - 1, 2, 3, C.ink); dot(ex, ey - 1, C.paper3); dot(ex + 4, ey - 1, C.paper3); }
  dot(ex - 1, ey + 2, C.coral2); dot(ex + 6, ey + 2, C.coral2);
  if (headphones) {
    for (let k = 0; k < w - 4; k++) dot(x + 2 + k, y + 2 - Math.round(Math.sin((k / (w - 5)) * Math.PI) * 3), C.metal1);
    rect(x, y + 4, 3, 5, C.metal1); rect(x + w - 3, y + 4, 3, 5, C.metal1);
    dot(x + 1, y + 5, C.mint4); dot(x + w - 2, y + 5, C.mint4);
  }
}

/** The logo's pointing hand; fingertip at (x, y). */
export function drawHand(x: number, y: number) {
  const rows = [
    '.kk......',
    'kwwk.....',
    'kwwk.....',
    'kwwkkk...',
    'kwwwwwkk.',
    'kwwwwwwwk',
    'kwwwwwwwk',
    '.kwwwwwk.',
    '..kkkkk..',
  ];
  sprite(rows, { k: C.ink, w: C.paper3 }, x - 1, y);
}

/** Sparkle trail behind something that flies. */
export function trail(x: number, y: number, dirX: number, n = 5) {
  for (let i = 1; i <= n; i++) dot(x - i * 4 * dirX, y + i * 2, i % 2 ? C.gold3 : C.mint4);
}
