// "Style frame": the finance scene at a higher pixel-art level.
// 320x180, curated palette with shading ramps, dithered per-pixel lighting,
// emissive layer, squash & stretch, expressive characters and a day/night story:
// 21:30 overtime -> the star arrives and clicks -> next day 18:00, leaving on time.
import type { PixelScene } from './PixelCanvas';
import { setCtx as setEngineCtx } from './engine';
import { drawSeated, drawStanding, drawChair, type Look, type Mood } from './rig';

// The world is 320x180; a 256x144 camera (x5 = 1280x720, whole pixels) frames the action.
const WORLD_W = 320;
const WORLD_H = 180;
export const HQ_W = 256;
export const HQ_H = 144;
export const HQ_LOOP = 14;

type RGB = [number, number, number];
const hex = (h: string): RGB => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const css = (c: RGB, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
const mix = (a: RGB, b: RGB, k: number): RGB => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOutBack = (t: number) => 1 + 2.2 * Math.pow(t - 1, 3) + 1.2 * Math.pow(t - 1, 2);
const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const rnd = (i: number) => {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

// ---------------------------------------------------------------- palette (ramps, hue-shifted)
const C = {
  ink: '#05070F',
  wall0: '#0E1528', wall1: '#141E38', wall2: '#1A2745', wall3: '#233357',
  base: '#0B111F',
  floor0: '#2A1B14', floor1: '#3E291C', floor2: '#553824', floor3: '#6E4A30',
  wood0: '#2E1D14', wood1: '#4A2F1F', wood2: '#6B4630', wood3: '#8C6242',
  metal0: '#1B2233', metal1: '#2B3448', metal2: '#445067', metal3: '#6A7690',
  frame0: '#0C1120', frame1: '#1C2740',
  skin0: '#7A4A36', skin1: '#B0735A', skin2: '#E0A184', skin3: '#F5C9A8',
  hair0: '#1E120D', hair1: '#3A2319', hair2: '#5A3726',
  shirt0: '#27336E', shirt1: '#3E4FA6', shirt2: '#6C87F0', shirt3: '#A9BCFF',
  pants0: '#171C2E', pants1: '#262E48',
  paper0: '#7E8AA0', paper1: '#B9C3D3', paper2: '#E4EAF3', paper3: '#FFFFFF',
  mint0: '#0E5A4C', mint1: '#16866F', mint2: '#1FB894', mint3: '#47E5C2', mint4: '#8DF0D8', mint5: '#D6FFF4',
  gold0: '#7A5212', gold1: '#B57E22', gold2: '#E8A93C', gold3: '#FFC857', gold4: '#FFE2A3',
  coral1: '#C44E5E', coral2: '#FF7A85', coral3: '#FFB3BA',
  leaf0: '#1F4A2A', leaf1: '#2E6B3A', leaf2: '#3F8F4A', leaf3: '#6BC46B',
  pot0: '#6B2E1E', pot1: '#9A4A2E', pot2: '#C4683F',
  blue1: '#1B5A7A', blue2: '#3AA0C8', blue3: '#8FD6F0',
};

// 4x4 Bayer matrix for ordered dithering
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

// ---------------------------------------------------------------- drawing helpers
let G: CanvasRenderingContext2D;
const rect = (x: number, y: number, w: number, h: number, c: string) => {
  G.fillStyle = c;
  G.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
};
const dot = (x: number, y: number, c: string) => rect(x, y, 1, 1, c);
/** Rect with a 1px dark outline (sel-out style silhouette for characters). */
const orect = (x: number, y: number, w: number, h: number, c: string) => { rect(x - 1, y - 1, w + 2, h + 2, '#05070F'); rect(x, y, w, h, c); };
function sprite(rows: string[], map: Record<string, string>, x: number, y: number, flip = false) {
  const w = rows[0].length;
  for (let j = 0; j < rows.length; j++) {
    const row = rows[j];
    for (let i = 0; i < row.length; i++) {
      const c = map[row[i]];
      if (c) dot(flip ? x + (w - 1 - i) : x + i, y + j, c);
    }
  }
}

// tiny 3x5 digits for screen counters
const DIGITS: Record<string, string[]> = {
  '0': ['###', '#.#', '#.#', '#.#', '###'], '1': ['.#.', '##.', '.#.', '.#.', '###'], '2': ['###', '..#', '###', '#..', '###'],
  '3': ['###', '..#', '.##', '..#', '###'], '4': ['#.#', '#.#', '###', '..#', '..#'], '5': ['###', '#..', '###', '..#', '###'],
  '6': ['###', '#..', '###', '#.#', '###'], '7': ['###', '..#', '.#.', '.#.', '.#.'], '8': ['###', '#.#', '###', '#.#', '###'],
  '9': ['###', '#.#', '###', '..#', '###'],
};
function number(n: number, x: number, y: number, c: string) {
  String(n).split('').forEach((d, i) => sprite(DIGITS[d], { '#': c }, x + i * 4, y));
}

// ---------------------------------------------------------------- the story clock
const T = {
  night: [0, 4.2],
  fly: [4.2, 5.4],
  land: [5.4, 5.75],
  click: [5.75, 6.1],
  process: [6.1, 8.2],
  lapse: [8.2, 9.2],
  day: [9.2, 14],
};
/** Story time in hours (21.5 = 21:30), used by the wall clock. */
function storyHours(t: number) {
  if (t < T.lapse[0]) return 21.47 + t * 0.012;
  if (t < T.lapse[1]) return 21.57 + ease(seg(t, T.lapse[0], T.lapse[1])) * (18 + 24 - 21.57);
  return 42 + (t - T.lapse[1]) * 0.02;
}
/** 0 = night, 1 = afternoon. The time-lapse passes through dawn and midday. */
function dayness(t: number) {
  if (t < T.lapse[0]) return 0;
  if (t < T.lapse[1]) return seg(t, T.lapse[0], T.lapse[1]);
  if (t > 13.3) return 1 - seg(t, 13.3, 14) * 1; // back to night for the loop
  return 1;
}

// ---------------------------------------------------------------- scene pieces
const WIN = { x: 26, y: 22, w: 92, h: 68 };
const SCREEN = { x: 171, y: 65, w: 40, h: 28 };

function skyColor(t: number, y01: number): RGB {
  const lapse = seg(t, T.lapse[0], T.lapse[1]);
  const back = seg(t, 13.3, 14);
  const night: RGB[] = [hex('#04071A'), hex('#0B1535'), hex('#1A2A58')];
  const dawn: RGB[] = [hex('#1C2358'), hex('#7A4A7E'), hex('#F2A07A')];
  const noon: RGB[] = [hex('#2C5EA8'), hex('#5E97D6'), hex('#BFE0F5')];
  const eve: RGB[] = [hex('#2E4488'), hex('#D9825F'), hex('#FFD08A')];
  const grad = (stops: RGB[]) => (y01 < 0.5 ? mix(stops[0], stops[1], y01 * 2) : mix(stops[1], stops[2], (y01 - 0.5) * 2));
  let c: RGB;
  if (t < T.lapse[0]) c = grad(night);
  else if (t < T.lapse[1]) {
    if (lapse < 0.33) c = mix(grad(night), grad(dawn), lapse / 0.33);
    else if (lapse < 0.66) c = mix(grad(dawn), grad(noon), (lapse - 0.33) / 0.33);
    else c = mix(grad(noon), grad(eve), (lapse - 0.66) / 0.34);
  } else c = mix(grad(eve), grad(night), back);
  return c;
}

function drawWindowView(t: number) {
  const d = dayness(t);
  // sky with dithered bands
  const img = G.getImageData(WIN.x, WIN.y, WIN.w, WIN.h);
  const bands: RGB[] = [];
  for (let k = 0; k <= 10; k++) bands.push(skyColor(t, k / 10));
  for (let y = 0; y < WIN.h; y++) {
    for (let x = 0; x < WIN.w; x++) {
      const b = BAYER[(y & 3) * 4 + (x & 3)];
      const c = bands[Math.min(10, Math.floor((y / WIN.h) * 10 + b))];
      const i = (y * WIN.w + x) * 4;
      img.data[i] = c[0]; img.data[i + 1] = c[1]; img.data[i + 2] = c[2]; img.data[i + 3] = 255;
    }
  }
  G.putImageData(img, WIN.x, WIN.y);
  // night stars / moon, or the evening sun
  if (d < 0.6) {
    for (let i = 0; i < 22; i++) {
      const x = WIN.x + 2 + Math.floor(rnd(i) * (WIN.w - 4));
      const y = WIN.y + 2 + Math.floor(rnd(i + 40) * 30);
      if (Math.sin(t * 3 + i * 1.7) > -0.2) dot(x, y, i % 5 ? '#9FB3E0' : C.gold4);
    }
    sprite(['.###.', '#####', '####.', '###..', '.#...'].map((r) => r), { '#': '#E8EEFF' }, WIN.x + 70, WIN.y + 8);
  } else {
    const sy = WIN.y + 40 + (1 - d) * 10;
    for (let r = 7; r >= 0; r--) {
      const c = r > 5 ? 'rgba(255,208,138,0.35)' : r > 3 ? C.gold4 : '#FFF4D6';
      G.fillStyle = c;
      G.beginPath();
      G.arc(WIN.x + 72, sy, r, 0, Math.PI * 2);
      G.fill();
    }
  }
  // skyline: far and near layers
  const farC = mix(hex('#101B3A'), hex('#6C7FB8'), d * 0.8);
  const nearC = mix(hex('#070C1C'), hex('#3B4A78'), d * 0.8);
  for (let i = 0; i < 9; i++) {
    const bx = WIN.x + i * 11 - 2, bh = 14 + Math.floor(rnd(i + 3) * 18);
    rect(bx, WIN.y + WIN.h - bh - 6, 10, bh + 6, css(farC));
  }
  for (let i = 0; i < 6; i++) {
    const bx = WIN.x + i * 16 - 4, bh = 10 + Math.floor(rnd(i + 11) * 22), bw = 12 + Math.floor(rnd(i + 17) * 5);
    const by = WIN.y + WIN.h - bh;
    rect(bx, by, bw, bh, css(nearC));
    for (let wy = by + 3; wy < WIN.y + WIN.h - 2; wy += 4) {
      for (let wx = bx + 2; wx < bx + bw - 2; wx += 3) {
        const k = wx * 7 + wy * 13;
        const lit = rnd(k) > 0.45 && (d < 0.5 || rnd(k + 1) > 0.85);
        if (lit && Math.sin(t * 0.7 + k) > -0.8) dot(wx, wy, d < 0.5 ? C.gold3 : '#9FB3E0');
      }
    }
  }
}

function drawRoom(t: number) {
  const d = dayness(t);
  // wall with subtle striped wallpaper
  rect(0, 0, WORLD_W, 128, C.wall2);
  for (let x = 0; x < WORLD_W; x += 6) rect(x, 0, 1, 124, C.wall1);
  rect(0, 124, WORLD_W, 4, C.base);
  // floor planks
  rect(0, 128, WORLD_W, 52, C.floor2);
  for (let y = 128; y < 180; y += 7) rect(0, y, WORLD_W, 1, C.floor1);
  for (let y = 128, k = 0; y < 180; y += 7, k++) for (let x = (k % 2) * 24; x < WORLD_W; x += 48) rect(x, y, 1, 7, C.floor1);
  rect(0, 128, WORLD_W, 1, C.floor3);
  // window frame + sill + mullions (drawn around the emissive view)
  rect(WIN.x - 4, WIN.y - 4, WIN.w + 8, WIN.h + 8, C.frame1);
  rect(WIN.x - 7, WIN.y + WIN.h + 3, WIN.w + 14, 4, C.wood2);
  rect(WIN.x - 7, WIN.y + WIN.h + 7, WIN.w + 14, 1, C.wood0);
  // plant on the sill: droops at night, perks up in the afternoon
  const px0 = WIN.x + 6, py0 = WIN.y + WIN.h - 4;
  rect(px0, py0 + 1, 10, 6, C.pot1);
  rect(px0 + 1, py0 + 6, 8, 1, C.pot0);
  rect(px0, py0 + 1, 10, 1, C.pot2);
  const perk = d;
  const leaves: Array<[number, number, number]> = [[-3, -1, 1], [0, -3, 0], [3, -2, 1], [6, -3, 0], [9, -1, 1]];
  leaves.forEach(([lx, ly, s], i) => {
    const droop = Math.round((1 - perk) * (3 + (i % 2)));
    const sway = Math.round(Math.sin(t * 1.5 + i) * 0.6 * perk);
    for (let k = 0; k < 5; k++) dot(px0 + 2 + lx * 0.6 + sway + (k * (lx < 3 ? -0.4 : 0.4)), py0 + ly - k + droop * (k / 4) * 1.5, k < 2 ? C.leaf1 : s ? C.leaf3 : C.leaf2);
  });
  // wall clock
  const cx = 150, cy = 34;
  G.fillStyle = C.frame0; G.beginPath(); G.arc(cx, cy, 12, 0, Math.PI * 2); G.fill();
  G.fillStyle = '#D9E0EE'; G.beginPath(); G.arc(cx, cy, 10, 0, Math.PI * 2); G.fill();
  for (let h = 0; h < 12; h++) { const a = (h / 12) * Math.PI * 2; dot(cx + Math.sin(a) * 8, cy - Math.cos(a) * 8, C.metal1); }
  const hrs = storyHours(t);
  const ha = ((hrs % 12) / 12) * Math.PI * 2, ma = ((hrs % 1)) * Math.PI * 2;
  for (let r = 0; r < 5; r++) dot(cx + Math.sin(ha) * r, cy - Math.cos(ha) * r, C.ink);
  for (let r = 0; r < 8; r++) dot(cx + Math.sin(ma) * r, cy - Math.cos(ma) * r, C.coral1);
  dot(cx, cy, C.ink);
  // framed chart poster
  rect(176, 20, 36, 28, C.frame0);
  rect(178, 22, 32, 24, '#D9E0EE');
  [6, 10, 8, 15, 19].forEach((h, i) => rect(181 + i * 6, 43 - h, 4, h, i === 4 ? C.gold2 : C.mint2));
  // door on the right
  rect(262, 44, 40, 84, C.wood1);
  rect(262, 44, 40, 2, C.wood3);
  rect(266, 50, 32, 30, C.wood2);
  rect(266, 86, 32, 36, C.wood2);
  rect(292, 86, 3, 3, C.gold2);
  rect(260, 42, 2, 86, C.frame1); rect(302, 42, 2, 86, C.frame1);
}

function drawDesk(t: number) {
  // desk
  rect(114, 100, 128, 5, C.wood3);
  rect(114, 105, 128, 3, C.wood1);
  rect(114, 100, 128, 1, '#A87A55');
  rect(118, 108, 5, 22, C.wood1); rect(233, 108, 5, 22, C.wood1);
  rect(119, 108, 1, 22, C.wood2);
  // monitor
  rect(168, 62, 46, 34, C.metal0);
  rect(168, 62, 46, 1, C.metal2);
  rect(188, 96, 6, 4, C.metal1);
  rect(182, 99, 18, 2, C.metal2);
  // sticky notes on the bezel
  rect(212, 68, 5, 5, C.gold3); rect(212, 68, 5, 1, C.gold4);
  rect(212, 75, 5, 5, C.coral2);
  // keyboard
  rect(146, 97, 28, 3, C.metal1);
  for (let k = 0; k < 7; k++) rect(148 + k * 4, 97, 3, 1, C.metal3);
  // mug: cold at night, steaming in the afternoon
  const d = dayness(t);
  const held = t >= T.lapse[1] && t < 11.2;
  if (!held) { rect(176, 91, 6, 7, '#E8EEF8'); rect(182, 93, 2, 3, '#E8EEF8'); rect(176, 91, 6, 1, C.paper1); }
  if (!held && d > 0.9 && t > T.day[0]) {
    rect(177, 92, 4, 1, '#6B4630');
    for (let i = 0; i < 3; i++) {
      const k = ((t * 0.8 + i / 3) % 1);
      dot(178 + Math.round(Math.sin(k * 6 + i) * 1.2), 89 - k * 8, `rgba(220,230,245,${0.8 * (1 - k)})`);
    }
  }
  // inbox tray + paper stack
  rect(216, 97, 20, 3, C.metal2);
  rect(216, 99, 20, 1, C.metal1);
}

function paperStackHeight(t: number) {
  if (t < T.night[1]) return 6 + Math.floor(t * 1.2);
  if (t < T.process[0]) return 11;
  if (t < T.process[1]) return Math.max(0, 11 - Math.floor(seg(t, T.process[0], T.process[1] - 0.2) * 11));
  if (t < 10.2) return 0;
  if (t < 10.5) return 3; // a new batch lands
  if (t < 11.4) return Math.max(0, 3 - Math.floor(seg(t, 10.5, 11.3) * 3));
  return 0;
}

function drawStack(t: number) {
  const n = paperStackHeight(t);
  for (let i = 0; i < n; i++) {
    const off = i % 3 === 1 ? 1 : 0;
    rect(218 + off, 95 - i * 2, 16, 2, C.paper2);
    rect(218 + off, 96 - i * 2, 16, 1, C.paper0);
  }
  // new batch dropping in with a small bounce
  if (t >= 10.0 && t < 10.3) {
    const k = seg(t, 10.0, 10.3);
    const y = 60 + easeOutBack(k) * 35;
    rect(218, y, 16, 6, C.paper2);
    rect(218, y + 5, 16, 1, C.paper0);
  }
}

// flying papers (with 3 rotation frames), from the tray into the screen
const PAPER_FRAMES = [
  ['########', '#......#', '#.####.#', '#......#', '########'],
  ['.#######.', '##.....##', '#..###..#', '##.....##', '.#######.'],
  ['..####..', '.######.', '########', '.######.', '..####..'],
];
function drawFlyingPapers(t: number) {
  const batches: Array<[number, number, number]> = [[T.process[0], T.process[1] - 0.2, 11], [10.5, 11.3, 3]];
  batches.forEach(([a, b, count]) => {
    for (let i = 0; i < count; i++) {
      const start = a + ((b - a) / count) * i;
      const k = seg(t, start, start + 0.42);
      if (k <= 0 || k >= 1) continue;
      const e = ease(k);
      const x = 224 + (188 - 224) * e;
      const y = 92 - Math.sin(e * Math.PI) * 26 + (78 - 92) * e;
      const f = PAPER_FRAMES[Math.floor(t * 14 + i) % 3];
      sprite(f, { '#': C.paper2, '.': C.paper3 }, x, y);
    }
  });
}

// ---------------------------------------------------------------- characters (shared rig)
const ANALYST: Look = { skin: 'light', hair: 'bun', outfit: 'office' };

// The Star Apps mascot with shading, eyes, squash & stretch and the logo's little hand
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

function drawStar(t: number, cx: number, bottom: number, shape: 'n' | 'squash' | 'stretch', eyes: 'open' | 'blink' | 'happy' | 'focus') {
  const rows = shape === 'squash' ? STAR_SQUASH : shape === 'stretch' ? STAR_STRETCH : STAR_N;
  const w = rows[0].length, h = rows.length;
  const x = Math.round(cx - w / 2), y = Math.round(bottom - h);
  sprite(rows, STAR_MAP, x, y);
  const ey = y + Math.round(h * 0.52), ex = x + Math.round(w / 2) - 3;
  if (eyes === 'blink') { rect(ex, ey + 1, 2, 1, C.mint0); rect(ex + 4, ey + 1, 2, 1, C.mint0); }
  else if (eyes === 'happy') { dot(ex, ey + 1, C.mint0); dot(ex + 1, ey, C.mint0); dot(ex + 4, ey, C.mint0); dot(ex + 5, ey + 1, C.mint0); }
  else if (eyes === 'focus') { rect(ex, ey, 2, 2, C.ink); rect(ex + 4, ey, 2, 2, C.ink); dot(ex + 1, ey, C.paper3); dot(ex + 5, ey, C.paper3); }
  else { rect(ex, ey - 1, 2, 3, C.ink); rect(ex + 4, ey - 1, 2, 3, C.ink); dot(ex, ey - 1, C.paper3); dot(ex + 4, ey - 1, C.paper3); }
  // cheeks
  dot(ex - 1, ey + 2, C.coral2); dot(ex + 6, ey + 2, C.coral2);
}

function drawHand(x: number, y: number) {
  // the logo's pointer; fingertip at (x, y)
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

function ring(cx: number, cy: number, r: number, c: string) {
  const steps = Math.max(16, Math.round(r * 6));
  for (let i = 0; i < steps; i++) { const a = (i / steps) * Math.PI * 2; dot(cx + Math.cos(a) * r, cy + Math.sin(a) * r, c); }
}

// ---------------------------------------------------------------- screen UI (emissive)
function drawScreen(t: number) {
  const s = SCREEN;
  const after = t >= 5.95 && t < 13.6;
  if (!after) {
    rect(s.x, s.y, s.w, s.h, '#0B2033');
    rect(s.x, s.y, s.w, 3, C.blue1);
    for (let i = 0; i < 4; i++) {
      rect(s.x + 2, s.y + 6 + i * 5, 7, 2, C.blue1);
      const fill = i === 3 ? Math.floor(((t * 3) % 6) * 3) : 18;
      rect(s.x + 11, s.y + 6 + i * 5, fill, 2, C.blue2);
    }
    if (Math.floor(t * 3) % 2) rect(s.x + 11 + Math.floor(((t * 3) % 6) * 3), s.y + 20, 1, 3, C.paper3);
    rect(s.x + s.w - 12, s.y + 1, 11, 7, C.coral1);
    number(Math.min(99, 36 + paperStackHeight(t)), s.x + s.w - 11, s.y + 2, C.paper3);
  } else {
    rect(s.x, s.y, s.w, s.h, '#062019');
    rect(s.x, s.y, s.w, 3, C.mint1);
    const done = t < 9 ? Math.floor(seg(t, T.process[0], T.process[1]) * 11) : 11 + Math.floor(seg(t, 10.5, 11.3) * 3);
    const rows = Math.min(4, done);
    for (let i = 0; i < rows; i++) {
      const yy = s.y + 6 + i * 5;
      rect(s.x + 2, yy, 22, 2, C.mint1);
      dot(s.x + 27, yy + 1, C.mint4); dot(s.x + 28, yy + 2, C.mint4); dot(s.x + 29, yy + 1, C.mint4); dot(s.x + 30, yy, C.mint4);
    }
    rect(s.x + 2, s.y + s.h - 4, s.w - 4, 2, C.mint0);
    rect(s.x + 2, s.y + s.h - 4, Math.round((s.w - 4) * Math.min(1, done / 14)), 2, C.mint3);
    rect(s.x + s.w - 12, s.y + 1, 11, 7, C.mint2);
    number(paperStackHeight(t), s.x + s.w - 7, s.y + 2, C.ink);
  }
  // scanline sheen
  for (let y = s.y; y < s.y + s.h; y += 2) rect(s.x, y, s.w, 1, 'rgba(255,255,255,0.035)');
}

// ---------------------------------------------------------------- lighting
interface Light { x: number; y: number; r: number; c: RGB; i: number }

function lightingPass(t: number, lights: Light[], ambient: RGB, sun: number, moon: number, view: [number, number]) {
  const [vx, vy] = view;
  const img = G.getImageData(vx, vy, HQ_W, HQ_H);
  const data = img.data;
  const steps = 6;
  for (let y = vy; y < vy + HQ_H; y++) {
    for (let x = vx; x < vx + HQ_W; x++) {
      // the window view and the screen are emissive: never darkened
      if (x >= WIN.x && x < WIN.x + WIN.w && y >= WIN.y && y < WIN.y + WIN.h) continue;
      if (x >= SCREEN.x && x < SCREEN.x + SCREEN.w && y >= SCREEN.y && y < SCREEN.y + SCREEN.h) continue;
      let r = ambient[0], g = ambient[1], b = ambient[2];
      for (const L of lights) {
        const dx = x - L.x, dy = y - L.y;
        const d2 = dx * dx + dy * dy;
        if (d2 > L.r * L.r) continue;
        const f = 1 - Math.sqrt(d2) / L.r;
        const k = f * f * L.i;
        r += L.c[0] * k; g += L.c[1] * k; b += L.c[2] * k;
      }
      // light shafts from the window (sun in the afternoon, moon at night)
      if (y > WIN.y + WIN.h && (sun > 0 || moon > 0)) {
        const u = x - (y - (WIN.y + WIN.h)) * 0.9;
        const inPane = u > WIN.x + 2 && u < WIN.x + WIN.w - 2 && Math.abs(u - (WIN.x + WIN.w / 2)) > 2;
        if (inPane) {
          const fall = clamp(1 - (y - WIN.y - WIN.h) / 110);
          r += (0.55 * sun + 0.08 * moon) * fall; g += (0.42 * sun + 0.1 * moon) * fall; b += (0.25 * sun + 0.16 * moon) * fall;
        }
      }
      const bay = BAYER[(y & 3) * 4 + (x & 3)];
      const qr = Math.min(1.35, Math.floor(r * steps + bay) / steps);
      const qg = Math.min(1.35, Math.floor(g * steps + bay) / steps);
      const qb = Math.min(1.35, Math.floor(b * steps + bay) / steps);
      const i = ((y - vy) * HQ_W + (x - vx)) * 4;
      data[i] = Math.min(255, data[i] * qr);
      data[i + 1] = Math.min(255, data[i + 1] * qg);
      data[i + 2] = Math.min(255, data[i + 2] * qb);
    }
  }
  G.putImageData(img, vx, vy);
}

// ---------------------------------------------------------------- the scene
let world: HTMLCanvasElement | null = null;

/** Camera origin in world pixels: a nudge on landing, a push-in on the click, a pan to the door. */
function camera(t: number): [number, number] {
  let x = 36, y = 18;
  const push = ease(seg(t, T.click[0] - 0.3, T.click[1] + 0.4)) * (1 - ease(seg(t, T.lapse[0], T.lapse[0] + 0.6)));
  x += push * 16; y += push * 6;
  if (t >= T.land[0] && t < T.land[0] + 0.25) y += Math.round(Math.sin(t * 90)); // landing impact
  x += ease(seg(t, 12.0, 13.2)) * 28;
  x -= ease(seg(t, 13.6, 14)) * 28;
  return [Math.round(clamp(x, 0, WORLD_W - HQ_W)), Math.round(clamp(y, 0, WORLD_H - HQ_H))];
}

export const financeHQScene: PixelScene = (g, time) => {
  if (!world) { world = document.createElement('canvas'); world.width = WORLD_W; world.height = WORLD_H; }
  G = world.getContext('2d', { willReadFrequently: true })!;
  G.imageSmoothingEnabled = false;
  const t = time % HQ_LOOP;
  const d = dayness(t);
  const after = t >= 5.95;

  // --- star path / shape
  let starX = -99, starBottom = -99;
  let starShape: 'n' | 'squash' | 'stretch' = 'n';
  let starEyes: 'open' | 'blink' | 'happy' | 'focus' = 'open';
  const perchX = 191, perchBottom = 62;
  if (t >= T.fly[0] && t < T.land[0]) {
    const k = seg(t, 4.7, T.land[0]);
    if (t < 4.7) { starX = -99; } // still far away, drawn in the window view
    else {
      const e = ease(k);
      starX = 110 + (perchX - 110) * e;
      starBottom = 60 + (perchBottom - 60) * e - Math.sin(e * Math.PI) * 26;
      starShape = 'stretch';
    }
  } else if (t >= T.land[0] && t < 13.6) {
    starX = perchX;
    const k = seg(t, T.land[0], T.land[1]);
    starShape = k < 0.4 ? 'squash' : k < 0.75 ? 'stretch' : 'n';
    starBottom = perchBottom - (k >= 0.4 && k < 0.75 ? 2 : 0) + (k >= 0.75 ? Math.round(Math.sin(t * 4) * 1) : 0);
    starEyes = t < T.click[1] ? 'open' : (t % 3.3) < 0.12 ? 'blink' : t < 9.2 ? 'focus' : 'happy';
  } else if (t >= 13.6) {
    const k = seg(t, 13.6, 14);
    starX = perchX + k * 90;
    starBottom = perchBottom - ease(k) * 70;
    starShape = 'stretch';
  }

  // --- lights
  const lights: Light[] = [];
  const screenOn: RGB = after && t < 13.6 ? [0.3, 0.95, 0.78] : [0.35, 0.6, 1.0];
  lights.push({ x: SCREEN.x + SCREEN.w / 2, y: SCREEN.y + SCREEN.h / 2, r: 90, c: screenOn, i: 1.5 - d * 0.9 });
  if (starX > 0) lights.push({ x: starX, y: starBottom - 7, r: 44, c: [0.35, 1.0, 0.8], i: 0.75 });
  const click = seg(t, T.click[0] + 0.12, T.click[1] + 0.5);
  if (click > 0 && click < 1) lights.push({ x: 205, y: 80, r: 60 + click * 60, c: [0.4, 1, 0.85], i: 0.9 * (1 - click) });
  const nightAmb: RGB = [0.24, 0.27, 0.42];
  const dayAmb: RGB = [0.82, 0.72, 0.62];
  const ambient = mix(nightAmb, dayAmb, d);

  // --- albedo layer
  drawRoom(t);
  drawDesk(t);
  drawStack(t);
  // analyst (shared character rig)
  setEngineCtx(G);
  if (t < T.lapse[0] + 0.3) {
    const mood: Mood =
      t < T.night[1] ? ((t % 3.1) < 0.15 ? 'blink' : 'tired')
        : t < T.land[1] ? 'tired'
          : t < T.click[1] + 0.3 ? 'surprised'
            : 'happy';
    const slump = t > 2.3 && t < 3.0 ? 1 : 0;
    drawChair(124, 110, 128);
    drawSeated(ANALYST, t < T.land[1] ? 'type' : 'watch', mood, 132, 76, t, { slump });
  } else if (t >= T.lapse[1] && t < 11.2) {
    drawChair(124, 110, 128);
    const sip = seg(t, 9.6, 9.9) * (1 - seg(t, 10.3, 10.6));
    drawSeated(ANALYST, 'coffee', (t % 3.4) < 0.12 ? 'blink' : 'happy', 132, 76, t, { sip });
  } else if (t >= 11.2 && t < 11.9) {
    drawChair(124, 110, 128);
    drawStanding(ANALYST, 'stretch', 'happy', 130, 66, t);
  } else if (t >= 11.9 && t < 13.1) {
    drawChair(124, 110, 128);
    const k = seg(t, 12.1, 13.1);
    const x = 130 + ease(k) * 150;
    drawStanding({ ...ANALYST, bag: true }, t < 12.1 ? 'wave' : 'walk', 'happy', x, 66, t);
  } else {
    drawChair(124, 110, 128);
  }
  drawFlyingPapers(t);

  // --- lighting
  const view = camera(t);
  lightingPass(t, lights, ambient, t >= T.lapse[1] ? d : 0, t < T.lapse[0] ? 1 : 0, view);

  // --- emissive layer
  drawWindowView(t);
  // window mullions on top of the view
  rect(WIN.x + WIN.w / 2 - 1, WIN.y, 2, WIN.h, C.frame1);
  rect(WIN.x, WIN.y + WIN.h / 2 - 1, WIN.w, 2, C.frame1);
  drawScreen(t);
  // the star far away in the window sky
  if (t >= T.fly[0] && t < 4.7) {
    const k = seg(t, T.fly[0], 4.7);
    const sx = WIN.x + 20 + k * 60, sy = WIN.y + 18 + Math.sin(k * 3) * 6;
    const size = k < 0.5 ? 1 : 2;
    rect(sx - size, sy, size * 2 + 1, 1, C.mint4); rect(sx, sy - size, 1, size * 2 + 1, C.mint4); dot(sx, sy, C.paper3);
    for (let i = 1; i < 5; i++) dot(sx - i * 3, sy + i, i % 2 ? C.gold3 : C.mint3);
  }
  if (starX > 0) {
    // sparkle trail while flying
    if (starShape === 'stretch' && (t < T.land[0] || t >= 13.6)) for (let i = 1; i < 6; i++) dot(starX - i * 4 * (t < 13.6 ? 1 : -1), starBottom - 6 + i * 2, i % 2 ? C.gold3 : C.mint4);
    drawStar(t, starX, starBottom, starShape, starEyes);
    // the logo moment: the star's hand clicks the screen
    if (t >= T.click[0] && t < T.click[1] + 0.3) {
      const k = seg(t, T.click[0], T.click[0] + 0.15);
      const back = seg(t, T.click[1], T.click[1] + 0.3);
      const hx = 198 + 8 * k - 8 * back, hy = 64 + 14 * k - 14 * back;
      drawHand(hx, hy);
    }
  }
  if (click > 0 && click < 1) { ring(206, 79, click * 40, C.mint4); if (click > 0.15) ring(206, 79, click * 40 - 6, C.mint3); }
  // surprise mark above the analyst
  if (t >= T.land[1] && t < T.click[1] + 0.35) { rect(143, 66, 2, 6, C.gold3); rect(143, 74, 2, 2, C.gold3); }
  // music notes while the star works alone
  if (t >= 12.6 && t < 13.6) for (let i = 0; i < 2; i++) { const k = ((t * 0.9 + i * 0.5) % 1); const nx = perchX + 10 + i * 6, ny = 50 - k * 14; rect(nx, ny, 2, 2, C.mint4); rect(nx + 1, ny - 4, 1, 4, C.mint4); }
  // dust motes: visible only inside the light (screen glow at night, sun shafts in the afternoon)
  for (let i = 0; i < 26; i++) {
    const mx = 120 + ((rnd(i) * 200 + t * (3 + rnd(i + 5) * 4)) % 190);
    const my = 20 + ((rnd(i + 9) * 150 + t * 2 * (rnd(i + 2) - 0.5) * 8 + 160) % 150);
    const inScreen = Math.hypot(mx - 191, my - 79) < 60 && d < 0.5;
    const inSun = d > 0.8 && my > WIN.y + WIN.h && Math.abs(mx - (my - WIN.y - WIN.h) * 0.9 - (WIN.x + WIN.w / 2)) < WIN.w / 2;
    if ((inScreen || inSun) && Math.sin(t * 2 + i) > 0) dot(mx, my, inSun ? 'rgba(255,226,163,0.85)' : 'rgba(150,200,255,0.7)');
  }

  // --- camera crop into the visible canvas
  const [cx0, cy0] = view;
  g.imageSmoothingEnabled = false;
  g.drawImage(world, cx0, cy0, HQ_W, HQ_H, 0, 0, HQ_W, HQ_H);

  // --- transitions: time-lapse flicker and the fade back to night
  if (t >= T.lapse[0] && t < T.lapse[1]) {
    const k = seg(t, T.lapse[0], T.lapse[1]);
    const a = Math.sin(k * Math.PI) * 0.35;
    g.fillStyle = `rgba(5,7,15,${a})`;
    g.fillRect(0, 0, HQ_W, HQ_H);
  }
  if (t > 13.6) {
    g.fillStyle = `rgba(5,7,15,${seg(t, 13.6, 14) * 0.9})`;
    g.fillRect(0, 0, HQ_W, HQ_H);
  }
  if (t < 0.3) {
    g.fillStyle = `rgba(5,7,15,${(1 - t / 0.3) * 0.9})`;
    g.fillRect(0, 0, HQ_W, HQ_H);
  }
};
