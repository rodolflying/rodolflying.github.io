// Shared pixel-art palette and drawing helpers for the Star Apps scenes.

export const P = {
  night: '#070B14',
  night2: '#0A1020',
  panel: '#0E1626',
  line: '#1E2A40',
  mint: '#47E5C2',
  mintSoft: '#8DF0D8',
  mintDeep: '#1FB894',
  gold: '#FFC857',
  coral: '#FF7A85',
  sky: '#7C9CFF',
  ice: '#7DD3FC',
  white: '#EEF2F8',
  slate: '#B4C0D3',
  slateDark: '#5B6B85',
  dim: '#2A3A56',
  skin: '#F2C7A0',
  hair: '#3B2A20',
  shirt: '#7C9CFF',
  pants: '#2B3550',
  wood: '#6B4A33',
  woodDark: '#4A3223',
  paper: '#E6ECF5',
  paperEdge: '#AAB6C8',
};

export type G = CanvasRenderingContext2D;

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const rnd = (i: number) => {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};
/** Looping phase 0..1 of period `p` seconds. */
export const phase = (t: number, p: number, offset = 0) => (((t + offset) % p) + p) % p / p;

export const px = (g: G, x: number, y: number, w: number, h: number, c: string) => {
  g.fillStyle = c;
  g.fillRect(Math.round(x), Math.round(y), w, h);
};

export function sprite(g: G, rows: string[], map: Record<string, string>, x: number, y: number, scale = 1) {
  rows.forEach((row, j) =>
    row.split("").forEach((ch, i) => {
      if (map[ch]) px(g, x + i * scale, y + j * scale, scale, scale, map[ch]);
    }),
  );
}

export function sky(g: G, w: number, h: number, t: number, count = 24, seed = 0) {
  px(g, 0, 0, w, h, P.night);
  for (let i = 0; i < count; i++) {
    const x = Math.floor(rnd(i + seed) * w);
    const y = Math.floor(rnd(i + seed + 99) * h);
    if (Math.sin(t * 2.4 + i) > -0.35) px(g, x, y, 1, 1, i % 7 === 0 ? P.gold : P.dim);
  }
}

export function floor(g: G, w: number, y: number, h: number) {
  px(g, 0, y, w, h, P.night2);
  for (let x = 0; x < w; x += 12) px(g, x, y, 6, 1, P.line);
}

const STAR = [
  '.......m.......',
  '......mmm......',
  '......mmm......',
  '.....mmmmm.....',
  'mmmmmmmmmmmmmmm',
  '.mmmmmmmmmmmmm.',
  '..mmmmwmwmmmm..',
  '...mmmmmmmmm...',
  '...mmmmmmmmm...',
  '..mmmmm.mmmmm..',
  '..mmmm...mmmm..',
  '.mmm.......mmm.',
  '.mm.........mm.',
];
export const STAR_W = 15;
export const STAR_H = 13;

/** The Star Apps mascot. `sparkle` 0..1 adds twinkles around it. */
export function star(g: G, x: number, y: number, t: number, scale = 1, sparkle = 1) {
  sprite(g, STAR, { m: P.mint, w: P.night }, x, y, scale);
  if (sparkle <= 0) return;
  const w = STAR_W * scale;
  const h = STAR_H * scale;
  [[-3, 1], [w + 2, 2], [-2, h - 2], [w + 1, h - 3]].forEach(([dx, dy], i) => {
    if (Math.sin(t * 5 + i * 1.9) > 0.1 * (1 - sparkle)) {
      px(g, x + dx, y + dy, 1, 1, i % 2 ? P.gold : P.mintSoft);
      px(g, x + dx - 1, y + dy, 3, 1, 'rgba(141,240,216,0.35)');
      px(g, x + dx, y + dy - 1, 1, 3, 'rgba(141,240,216,0.35)');
    }
  });
}

/** The logo's pointing hand; the fingertip lands on (x, y). */
export function hand(g: G, x: number, y: number, scale = 1) {
  const parts = [[0, 0, 2, 6], [2, 3, 2, 5], [4, 4, 2, 4], [-2, 5, 8, 5], [-1, 10, 6, 2]];
  parts.forEach(([dx, dy, w, h]) => px(g, x + (dx - 1) * scale, y + (dy - 1) * scale, (w + 2) * scale, (h + 2) * scale, P.night));
  parts.forEach(([dx, dy, w, h]) => px(g, x + dx * scale, y + dy * scale, w * scale, h * scale, P.white));
}

export function ring(g: G, cx: number, cy: number, r: number, c: string) {
  const steps = Math.max(12, Math.round(r * 5));
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    px(g, cx + Math.cos(a) * r, cy + Math.sin(a) * r, 1, 1, c);
  }
}

/** A seated or standing office worker. mode: typing | coffee | idle */
export function person(g: G, x: number, y: number, t: number, mode: 'typing' | 'coffee' | 'idle' = 'idle', shirt = P.shirt) {
  const tap = mode === 'typing' && Math.floor(t * 8) % 2 ? 1 : 0;
  px(g, x + 2, y, 6, 2, P.hair);
  px(g, x + 1, y + 2, 8, 6, P.skin);
  px(g, x + 1, y + 2, 2, 3, P.hair);
  px(g, x + 6, y + 4, 1, 1, P.night);
  px(g, x, y + 8, 10, 10, shirt);
  if (mode === 'typing') {
    px(g, x + 9, y + 11 + tap, 8, 2, shirt);
    px(g, x + 17, y + 11 + tap, 2, 2, P.skin);
  } else if (mode === 'coffee') {
    px(g, x + 9, y + 10, 4, 2, shirt);
    px(g, x + 12, y + 8, 2, 4, P.skin);
    px(g, x + 11, y + 4, 4, 4, P.white);
    px(g, x + 15, y + 5, 1, 2, P.white);
    const s = Math.floor(t * 4) % 3;
    px(g, x + 12 + (s === 1 ? 1 : 0), y + 1 - s, 1, 1, P.slate);
  } else {
    px(g, x - 2, y + 9, 2, 7, shirt);
    px(g, x + 10, y + 9, 2, 7, shirt);
  }
  px(g, x + 1, y + 18, 3, 8, P.pants);
  px(g, x + 6, y + 18, 3, 8, P.pants);
}

export function sweat(g: G, x: number, y: number, t: number) {
  px(g, x, y + phase(t, 0.6) * 6, 1, 2, P.ice);
  px(g, x - 11, y + 2 + phase(t, 0.6, 0.3) * 6, 1, 2, P.ice);
}

export function desk(g: G, x: number, y: number, w: number) {
  px(g, x, y, w, 3, P.wood);
  px(g, x, y + 3, w, 2, P.woodDark);
  px(g, x + 3, y + 5, 3, 16, P.woodDark);
  px(g, x + w - 6, y + 5, 3, 16, P.woodDark);
}

export function monitor(g: G, x: number, y: number, w = 30, h = 20, screen = '#0B1322') {
  px(g, x, y, w, h, P.line);
  px(g, x + 2, y + 2, w - 4, h - 4, screen);
  px(g, x + w / 2 - 2, y + h, 4, 2, P.line);
  px(g, x + w / 2 - 7, y + h + 2, 14, 1, P.slateDark);
}

export function paperStack(g: G, x: number, y: number, n: number) {
  for (let i = 0; i < n; i++) {
    const off = i % 2 ? 1 : 0;
    px(g, x + off, y - i * 2, 14, 2, P.paper);
    px(g, x + off, y - i * 2 + 1, 14, 1, P.paperEdge);
  }
}

export function paper(g: G, x: number, y: number, c = P.paper) {
  px(g, x, y, 8, 6, c);
  px(g, x, y + 5, 8, 1, P.paperEdge);
  px(g, x + 2, y + 2, 4, 1, P.slateDark);
}

export function check(g: G, x: number, y: number, c = P.mint) {
  px(g, x, y + 2, 1, 1, c);
  px(g, x + 1, y + 3, 1, 1, c);
  px(g, x + 2, y + 2, 1, 1, c);
  px(g, x + 3, y + 1, 1, 1, c);
  px(g, x + 4, y, 1, 1, c);
}

export function database(g: G, x: number, y: number, fill: number) {
  px(g, x, y, 16, 20, P.panel);
  px(g, x, y, 16, 2, P.sky);
  px(g, x, y + 18, 16, 2, P.sky);
  px(g, x - 1, y + 2, 1, 16, P.sky);
  px(g, x + 16, y + 2, 1, 16, P.sky);
  const h = Math.round(16 * clamp(fill));
  px(g, x + 1, y + 18 - h, 14, h, P.mintDeep);
  px(g, x, y + 6, 16, 1, P.line);
  px(g, x, y + 12, 16, 1, P.line);
}

export function bars(g: G, x: number, y: number, p: number, values = [0.35, 0.55, 0.7, 0.95]) {
  px(g, x, y, 28, 22, P.panel);
  px(g, x, y + 21, 28, 1, P.slateDark);
  values.forEach((b, i) => {
    const h = Math.round(18 * b * clamp(p * 1.4 - i * 0.12));
    px(g, x + 3 + i * 6, y + 21 - h, 4, h, i === values.length - 1 ? P.gold : P.mint);
  });
}

export function alertIcon(g: G, x: number, y: number, on: boolean) {
  const c = on ? P.coral : P.dim;
  px(g, x + 3, y, 2, 1, c);
  px(g, x + 2, y + 1, 4, 1, c);
  px(g, x + 1, y + 2, 6, 3, c);
  px(g, x, y + 5, 8, 2, c);
  if (on) {
    px(g, x + 3, y + 2, 2, 2, P.night);
    px(g, x + 3, y + 5, 2, 1, P.night);
  }
}

export function coin(g: G, x: number, y: number, c = P.gold) {
  px(g, x + 1, y, 6, 1, c);
  px(g, x, y + 1, 8, 2, c);
  px(g, x + 1, y + 3, 6, 1, P.woodDark);
}
