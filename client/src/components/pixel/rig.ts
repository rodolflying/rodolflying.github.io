// Character rig: one body, interchangeable skin / hair / outfit / headwear, several
// poses and facial expressions. Drawn in two passes (silhouette outline, then fills)
// so figures read clearly against any background. Figures face right unless flipped.
import { C, rect, dot, sprite } from './engine';

export type Skin = 'light' | 'medium' | 'dark';
export type Hair = 'bun' | 'short' | 'ponytail' | 'curly';
export type Outfit = 'office' | 'vest' | 'operator' | 'blazer' | 'cardigan';
export type Headwear = 'helmet' | 'headset' | null;
export type Mood = 'neutral' | 'tired' | 'blink' | 'focus' | 'surprised' | 'happy' | 'relieved' | 'stressed' | 'sleep';
export type StandPose = 'stand' | 'walk' | 'wave' | 'stretch' | 'repair' | 'point' | 'phone' | 'thumbsup' | 'carry';
export type SitPose = 'type' | 'watch' | 'coffee' | 'phone' | 'sleep' | 'idle';

export interface Look {
  skin: Skin;
  hair: Hair;
  hairColor?: 'dark' | 'brown' | 'black';
  outfit: Outfit;
  /** Shirt ramp: shadow, base, light, highlight. */
  shirt?: [string, string, string, string];
  pants?: [string, string];
  headwear?: Headwear;
  glasses?: boolean;
  bag?: boolean;
}

const SKINS: Record<Skin, [string, string, string]> = {
  light: ['#B0735A', '#E0A184', '#F5C9A8'],
  medium: ['#8A5236', '#B87650', '#DA9A70'],
  dark: ['#4E2E1C', '#7A4A2E', '#9E6A48'],
};
const HAIRS: Record<string, [string, string]> = {
  dark: [C.hair0, C.hair2],
  brown: ['#4A2A18', '#7A4A2A'],
  black: ['#0E0B10', '#2A2433'],
};
const SHIRTS: Record<Outfit, [string, string, string, string]> = {
  office: ['#27336E', '#3E4FA6', '#6C87F0', '#A9BCFF'],
  vest: ['#3A4458', '#556078', '#7A86A0', '#A4AEC4'],
  operator: ['#0F3A40', '#17565E', '#23808A', '#4FB4BE'],
  blazer: ['#1C2130', '#2C3346', '#434C66', '#5E6884'],
  cardigan: ['#8A5A12', '#B57E22', '#D9A040', '#F0C878'],
};

// ---------------------------------------------------------------- parts & two-pass rendering
type Part =
  | { k: 'r'; x: number; y: number; w: number; h: number; c: string }
  | { k: 's'; rows: string[]; map: Record<string, string>; x: number; y: number };

function render(parts: Part[], ox: number, oy: number, flip: boolean, boxW: number) {
  const X = (x: number, w: number) => (flip ? ox + boxW - x - w : ox + x);
  // pass 1: outline silhouette
  for (const p of parts) {
    if (p.k === 'r') rect(X(p.x, p.w) - 1, oy + p.y - 1, p.w + 2, p.h + 2, C.ink);
    else {
      const ink = Object.fromEntries(Object.keys(p.map).map((k) => [k, C.ink]));
      const w = p.rows[0].length;
      for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) sprite(p.rows, ink, X(p.x, w) + dx, oy + p.y + dy, flip);
    }
  }
  // pass 2: fills
  for (const p of parts) {
    if (p.k === 'r') rect(X(p.x, p.w), oy + p.y, p.w, p.h, p.c);
    else sprite(p.rows, p.map, X(p.x, p.rows[0].length), oy + p.y, flip);
  }
}

// ---------------------------------------------------------------- head
const HEAD = [
  '....sssss....',
  '..sssssssss..',
  '.sssssssssss.',
  '.sssssssssss.',
  'Sssssssssssss',
  'SsSSssssssss.',
  'SsSSsssssssss',
  'Ssssssssssss.',
  '.ssssssssss..',
  '.Sssssssss...',
  '..SSsssss....',
  '....Ssss.....',
  '.....sss.....',
];
const HAIR_TOP = [
  '...hhhhhh....',
  '.hhhhhhhhhh..',
  'hhhhhhhhhhhh.',
  'hhhhHHHhhhh..',
  'hhhhh..h.....',
];
const HELMET = [
  '.....yyyyyy.....',
  '...yyYYYyyyyy...',
  '..yyYYyyyyyyyy..',
  '.yyyyyyyyyyyyyy.',
  '.yyyyyyyyyyyyyyy',
  'dddddddddddddddd',
];

function headParts(look: Look, hx: number, hy: number): Part[] {
  const [s0, s1, s2] = SKINS[look.skin];
  const [h0, h1] = HAIRS[look.hairColor ?? 'dark'];
  const parts: Part[] = [];
  // back hair (behind the head)
  if (!look.headwear || look.headwear === 'headset') {
    if (look.hair === 'bun') parts.push({ k: 's', rows: ['.hh.', 'hHhh', 'hhhh', '.hh.'], map: { h: h0, H: h1 }, x: hx - 3, y: hy - 2 });
    if (look.hair === 'ponytail') parts.push({ k: 'r', x: hx - 2, y: hy + 4, w: 3, h: 9, c: h0 });
    if (look.hair === 'curly') parts.push({ k: 's', rows: ['.hh.hh', 'hhhhhh', 'hhhhh.', 'hhhhhh', '.hhhh.'], map: { h: h0 }, x: hx - 2, y: hy + 3 });
  }
  parts.push({ k: 's', rows: HEAD, map: { s: s1, S: s0, l: s2 }, x: hx, y: hy });
  if (look.headwear === 'helmet') {
    parts.push({ k: 's', rows: HELMET, map: { y: C.helmet2, Y: C.helmet3, d: C.helmet0 }, x: hx - 2, y: hy - 3 });
  } else {
    parts.push({ k: 's', rows: HAIR_TOP, map: { h: h0, H: h1 }, x: hx, y: hy });
    parts.push({ k: 'r', x: hx, y: hy + 4, w: 3, h: look.hair === 'short' ? 3 : 5, c: h0 });
    if (look.hair === 'curly') parts.push({ k: 's', rows: ['h.hh.h.h', '.h..h.h.'], map: { h: h0 }, x: hx + 1, y: hy - 1 });
  }
  return parts;
}

/** Eyes, brows and mouth, drawn after the fill pass. (hx, hy) = the head's top-left in the world;
 *  when `flip` is set the head faces left and features are mirrored inside its 13px width. */
function face(look: Look, mood: Mood, hx: number, hy: number, t: number, flip = false) {
  const [s0] = SKINS[look.skin];
  const [h0] = HAIRS[look.hairColor ?? 'dark'];
  const px = (x: number, y: number, c: string) => dot(flip ? hx + 12 - x : hx + x, hy + y, c);
  const ink = C.ink, white = C.paper3;
  // nose
  px(12, 7, s0);
  // eyes + brows
  switch (mood) {
    case 'blink':
    case 'sleep':
      px(9, 6, ink); px(10, 6, ink); px(8, 4, h0); px(9, 4, h0); px(10, 4, h0);
      break;
    case 'tired':
      px(9, 5, s0); px(10, 5, s0); px(9, 6, ink); px(10, 6, ink); px(9, 7, '#6E5A9A');
      px(8, 4, h0); px(9, 3, h0); px(10, 4, h0);
      break;
    case 'surprised':
      px(9, 4, white); px(10, 4, white); px(9, 5, ink); px(10, 5, white); px(9, 6, white); px(10, 6, white);
      px(8, 2, h0); px(9, 2, h0); px(10, 2, h0);
      break;
    case 'happy':
      px(9, 6, ink); px(10, 5, ink); px(11, 6, ink); px(8, 3, h0); px(9, 3, h0); px(10, 3, h0);
      break;
    case 'relieved':
      px(9, 5, ink); px(10, 6, ink); px(11, 5, ink); px(8, 3, h0); px(9, 3, h0); px(10, 3, h0);
      break;
    case 'focus':
      px(9, 5, ink); px(10, 5, ink); px(9, 6, ink); px(10, 6, ink); px(9, 5, white);
      px(8, 3, h0); px(9, 4, h0); px(10, 4, h0);
      break;
    case 'stressed':
      px(9, 5, white); px(10, 5, ink); px(9, 6, white); px(10, 6, ink);
      px(8, 4, h0); px(9, 3, h0); px(10, 3, h0);
      if (Math.floor(t * 3) % 2) px(3, 2, '#7DD3FC');
      px(3, 3, '#7DD3FC');
      break;
    default:
      px(9, 5, ink); px(10, 5, ink); px(9, 6, ink); px(10, 6, ink); px(9, 5, white);
      px(8, 4, h0); px(9, 4, h0); px(10, 4, h0);
  }
  // mouth
  if (mood === 'happy' || mood === 'relieved') { px(8, 9, s0); px(9, 10, s0); px(10, 10, s0); px(11, 9, s0); }
  else if (mood === 'surprised' || mood === 'sleep') { px(9, 9, ink); px(10, 9, ink); px(9, 10, ink); px(10, 10, ink); }
  else if (mood === 'stressed') { px(8, 10, s0); px(9, 9, s0); px(10, 10, s0); px(11, 9, s0); }
  else if (mood === 'tired') { px(8, 10, s0); px(9, 10, s0); px(10, 10, s0); }
  else { px(9, 10, s0); px(10, 10, s0); }
  // glasses
  if (look.glasses) { for (let x = 8; x <= 11; x++) px(x, 4, C.metal1); px(8, 5, C.metal1); px(11, 5, C.metal1); px(7, 5, C.metal2); px(6, 5, C.metal2); }
  // headset: ear cup + mic
  if (look.headwear === 'headset') {
    for (let x = 2; x <= 10; x++) px(x, -1 + (x < 4 || x > 8 ? 1 : 0), C.metal1);
    px(2, 5, C.metal1); px(3, 5, C.metal2); px(2, 6, C.metal1); px(3, 6, C.metal2); px(2, 7, C.metal1);
    for (let k = 0; k < 5; k++) px(3 + k, 8 + Math.floor(k / 2), C.metal1);
    px(8, 10, C.metal2);
  }
}

// ---------------------------------------------------------------- torso / outfit
function torsoParts(look: Look, x: number, y: number, h: number): Part[] {
  const [c0, c1, c2, c3] = look.shirt ?? SHIRTS[look.outfit];
  const parts: Part[] = [
    { k: 'r', x, y, w: 14, h, c: c1 },
  ];
  const fills: Part[] = [
    { k: 'r', x, y, w: 2, h, c: c0 },
    { k: 'r', x: x + 3, y: y + 1, w: 4, h: Math.min(8, h - 2), c: c2 },
  ];
  if (look.outfit === 'vest') {
    fills.push({ k: 'r', x, y: y + 2, w: 14, h: h - 2, c: C.vest1 });
    fills.push({ k: 'r', x, y: y + 2, w: 2, h: h - 2, c: C.vest0 });
    fills.push({ k: 'r', x: x + 3, y: y + 3, w: 3, h: h - 5, c: C.vest2 });
    fills.push({ k: 'r', x, y: y + Math.round(h * 0.45), w: 14, h: 1, c: C.paper2 });
    fills.push({ k: 'r', x, y: y + Math.round(h * 0.7), w: 14, h: 1, c: C.paper2 });
    fills.push({ k: 'r', x: x + 9, y, w: 4, h: 3, c: c1 });
  } else if (look.outfit === 'blazer') {
    fills.push({ k: 'r', x: x + 9, y, w: 4, h: 6, c: C.paper2 });
    fills.push({ k: 'r', x: x + 10, y: y + 2, w: 2, h: 7, c: C.coral1 });
    fills.push({ k: 'r', x: x + 8, y, w: 1, h: 8, c: c3 });
  } else if (look.outfit === 'cardigan') {
    fills.push({ k: 'r', x: x + 9, y, w: 3, h: h - 1, c: C.paper2 });
    fills.push({ k: 'r', x: x + 8, y, w: 1, h: h - 1, c: c3 });
  } else {
    fills.push({ k: 'r', x: x + 9, y, w: 4, h: 2, c: c3 });
    if (look.outfit === 'operator') fills.push({ k: 'r', x: x + 3, y: y + 4, w: 3, h: 2, c: C.mint3 });
  }
  return [...parts, ...fills];
}

// ---------------------------------------------------------------- standing
/** Standing figure in a 24x62 box, top-left at (x, y); feet on y + 60. */
export function drawStanding(look: Look, pose: StandPose, mood: Mood, x: number, y: number, t: number, flip = false) {
  const [s0, s1] = SKINS[look.skin];
  const [c0, c1] = look.shirt ?? SHIRTS[look.outfit];
  const [p0, p1] = look.pants ?? ['#171C2E', '#262E48'];
  const armC = c1;
  const f = Math.floor(t * 8) % 4;
  const walking = pose === 'walk';
  const bob = walking && f % 2 ? -1 : 0;
  const near = walking ? [2, 0, -2, 0][f] : 0;
  const far = -near;
  const parts: Part[] = [];
  // far arm (behind)
  if (pose === 'stretch') parts.push({ k: 'r', x: 3, y: 5, w: 3, h: 13, c: c0 }, { k: 'r', x: 3, y: 2, w: 3, h: 3, c: s0 });
  else parts.push({ k: 'r', x: 3 + (walking ? -near : 0), y: 17 + bob, w: 3, h: 13, c: c0 }, { k: 'r', x: 3 + (walking ? -near : 0), y: 30 + bob, w: 3, h: 3, c: s0 });
  // legs + shoes
  parts.push({ k: 'r', x: 5 + far, y: 34 + bob, w: 5, h: 23 - (walking && f === 3 ? 1 : 0), c: p0 });
  parts.push({ k: 'r', x: 10 + near, y: 34 + bob, w: 5, h: 23 - (walking && f === 1 ? 1 : 0), c: p1 });
  parts.push({ k: 'r', x: 4 + far, y: 57, w: 7, h: 3, c: C.ink }, { k: 'r', x: 9 + near, y: 57 - (walking && f === 1 ? 1 : 0), w: 8, h: 3, c: '#1E2230' });
  // torso
  parts.push(...torsoParts(look, 3, 16 + bob, 18));
  parts.push({ k: 'r', x: 3, y: 33 + bob, w: 14, h: 1, c: p0 });
  // bag strap + bag
  if (look.bag) {
    for (let k = 0; k < 13; k++) parts.push({ k: 'r', x: 5 + Math.round(k * 0.7), y: 17 + k + bob, w: 1, h: 1, c: C.wood1 });
    parts.push({ k: 'r', x: 13, y: 29 + bob, w: 7, h: 7, c: C.wood2 });
  }
  // head
  const hx = 5, hy = 3 + bob + (pose === 'repair' ? 1 : 0);
  parts.push(...headParts(look, hx, hy));
  // near arm (in front)
  switch (pose) {
    case 'wave': {
      const w = Math.round(Math.sin(t * 16) * 1.5);
      parts.push({ k: 'r', x: 15, y: 8, w: 3, h: 11, c: armC }, { k: 'r', x: 15 + w, y: 4, w: 3, h: 4, c: s1 });
      break;
    }
    case 'stretch':
      parts.push({ k: 'r', x: 14, y: 5, w: 3, h: 13, c: armC }, { k: 'r', x: 14, y: 2, w: 3, h: 3, c: s1 });
      break;
    case 'repair': {
      const hit = Math.floor(t * 6) % 2;
      parts.push({ k: 'r', x: 13, y: 18, w: 3, h: 5, c: armC }, { k: 'r', x: 15, y: 20 - hit, w: 7, h: 3, c: armC }, { k: 'r', x: 22, y: 19 - hit, w: 3, h: 3, c: s1 });
      parts.push({ k: 'r', x: 23, y: 13 - hit, w: 2, h: 7, c: C.metal3 }, { k: 'r', x: 22, y: 12 - hit, w: 4, h: 2, c: C.metal4 });
      break;
    }
    case 'point':
      parts.push({ k: 'r', x: 13, y: 18, w: 3, h: 4, c: armC }, { k: 'r', x: 15, y: 19, w: 8, h: 3, c: armC }, { k: 'r', x: 23, y: 19, w: 4, h: 2, c: s1 });
      break;
    case 'phone':
      parts.push({ k: 'r', x: 13, y: 17, w: 3, h: 7, c: armC }, { k: 'r', x: 13, y: 11, w: 3, h: 7, c: armC }, { k: 'r', x: 12, y: 8, w: 3, h: 4, c: s1 }, { k: 'r', x: 13, y: 6, w: 2, h: 6, c: C.ink });
      break;
    case 'thumbsup':
      parts.push({ k: 'r', x: 13, y: 18, w: 3, h: 5, c: armC }, { k: 'r', x: 15, y: 19, w: 5, h: 3, c: armC }, { k: 'r', x: 20, y: 17, w: 3, h: 4, c: s1 }, { k: 'r', x: 20, y: 14, w: 2, h: 3, c: s1 });
      break;
    case 'carry':
      parts.push({ k: 'r', x: 13, y: 18, w: 3, h: 6, c: armC }, { k: 'r', x: 14, y: 23, w: 6, h: 3, c: armC }, { k: 'r', x: 18, y: 18, w: 5, h: 8, c: C.metal2 }, { k: 'r', x: 19, y: 19, w: 3, h: 6, c: C.mint1 });
      break;
    default:
      parts.push({ k: 'r', x: 13 + (walking ? near : 0), y: 17 + bob, w: 3, h: 13, c: armC }, { k: 'r', x: 13 + (walking ? near : 0), y: 30 + bob, w: 3, h: 3, c: s1 });
  }
  render(parts, x, y, flip, 24);
  face(look, mood, flip ? x + 24 - hx - 13 : x + hx, y + hy, t, flip);
}

// ---------------------------------------------------------------- seated
/** Seated figure (no chair) in a 32x56 box, top-left at (x, y); feet on y + 54. */
export function drawSeated(look: Look, pose: SitPose, mood: Mood, x: number, y: number, t: number, opts: { slump?: number; sip?: number } = {}) {
  const [, s1] = SKINS[look.skin];
  const [c0, c1] = look.shirt ?? SHIRTS[look.outfit];
  const [p0, p1] = look.pants ?? ['#171C2E', '#262E48'];
  const slump = opts.slump ?? 0;
  const parts: Part[] = [];
  const sleeping = pose === 'sleep';
  // far arm
  parts.push({ k: 'r', x: 3, y: 18 + slump, w: 3, h: 11, c: c0 });
  // legs: thighs forward, shins down, shoes
  parts.push({ k: 'r', x: 4, y: 30, w: 17, h: 5, c: p0 });
  parts.push({ k: 'r', x: 5, y: 32, w: 18, h: 5, c: p1 });
  parts.push({ k: 'r', x: 18, y: 36, w: 5, h: 15, c: p1 });
  parts.push({ k: 'r', x: 17, y: 51, w: 9, h: 3, c: C.ink });
  // torso
  const ty = 15 + slump + (sleeping ? 4 : 0);
  parts.push(...torsoParts(look, sleeping ? 5 : 3, ty, sleeping ? 15 : 17));
  // head (resting on the folded arms when asleep)
  const hx = sleeping ? 15 : 5, hy = sleeping ? 14 : 2 + slump;
  parts.push(...headParts(look, hx, hy));
  // near arm
  switch (pose) {
    case 'type': {
      const tap = Math.floor(t * 12) % 4;
      parts.push({ k: 'r', x: 12, y: ty + 3, w: 4, h: 6, c: c1 }, { k: 'r', x: 14, y: ty + 7 + (tap === 1 ? 1 : 0), w: 12, h: 3, c: c1 }, { k: 'r', x: 26, y: ty + 7 + (tap === 3 ? 1 : 0), w: 4, h: 3, c: s1 });
      break;
    }
    case 'coffee': {
      const sip = opts.sip ?? 0;
      parts.push({ k: 'r', x: 12, y: ty + 3, w: 3, h: 7, c: c1 }, { k: 'r', x: 14, y: ty + 3 - Math.round(sip * 5), w: 3, h: 7, c: c1 });
      parts.push({ k: 'r', x: 16, y: ty - 1 - Math.round(sip * 6), w: 3, h: 3, c: s1 }, { k: 'r', x: 18, y: ty - 3 - Math.round(sip * 6), w: 5, h: 6, c: '#E8EEF8' }, { k: 'r', x: 23, y: ty - 1 - Math.round(sip * 6), w: 1, h: 3, c: '#E8EEF8' });
      break;
    }
    case 'phone':
      parts.push({ k: 'r', x: 12, y: ty + 3, w: 3, h: 6, c: c1 }, { k: 'r', x: 12, y: ty - 3, w: 3, h: 7, c: c1 }, { k: 'r', x: 12, y: ty - 7, w: 3, h: 4, c: s1 }, { k: 'r', x: 13, y: ty - 9, w: 2, h: 6, c: C.ink });
      break;
    case 'sleep':
      // folded arms on the desk, drawn in front so the head seems to rest on them
      break;
    case 'watch':
    case 'idle':
    default:
      parts.push({ k: 'r', x: 12, y: ty + 3, w: 3, h: 7, c: c1 }, { k: 'r', x: 13, y: ty + 8, w: 10, h: 3, c: c1 }, { k: 'r', x: 23, y: ty + 8, w: 3, h: 3, c: s1 });
  }
  if (sleeping) parts.push({ k: 'r', x: 12, y: 25, w: 18, h: 4, c: c1 }, { k: 'r', x: 28, y: 25, w: 3, h: 3, c: s1 });
  render(parts, x, y, false, 32);
  face(look, sleeping ? 'sleep' : mood, x + hx, y + hy, t);
}

/** Office chair (drawn before a seated figure): backrest at x, seat top at seatY, wheels on floorY. */
export function drawChair(x: number, seatY: number, floorY: number) {
  rect(x, seatY - 26, 4, 30, C.metal1);
  rect(x, seatY - 26, 1, 30, C.metal2);
  rect(x + 2, seatY, 20, 4, C.metal1);
  rect(x + 2, seatY, 20, 1, C.metal2);
  rect(x + 11, seatY + 4, 2, floorY - seatY - 7, C.metal0);
  rect(x + 4, floorY - 3, 16, 2, C.metal0);
  dot(x + 4, floorY - 1, C.metal2); dot(x + 19, floorY - 1, C.metal2);
}

/** Floating "zZz" for sleeping characters. */
export function zzz(x: number, y: number, t: number) {
  for (let i = 0; i < 3; i++) {
    const k = (t * 0.6 + i / 3) % 1;
    const zx = x + i * 3 + Math.round(Math.sin(k * 6) * 1), zy = y - k * 12;
    const c = `rgba(214,255,244,${1 - k})`;
    rect(zx, zy, 3, 1, c); dot(zx + 1, zy + 1, c); rect(zx, zy + 2, 3, 1, c);
  }
}
