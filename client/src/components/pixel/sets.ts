// Reusable set pieces and story beats for the high-detail scenes.
import {
  C, type RGB, type Rect, hex, css, mix, clamp, ease, seg, rnd, rect, dot, orect, sprite, ring,
  ditherGradient, drawStar, drawHand, trail, ctx, type StarShape, type StarEyes,
} from './engine';

// ---------------------------------------------------------------- sky
const SKIES: RGB[][] = [
  [hex('#04071A'), hex('#0B1535'), hex('#1A2A58')], // 0 night
  [hex('#1C2358'), hex('#7A4A7E'), hex('#F2A07A')], // 1 dawn
  [hex('#2C5EA8'), hex('#5E97D6'), hex('#BFE0F5')], // 2 noon
  [hex('#2E4488'), hex('#D9825F'), hex('#FFD08A')], // 3 evening
];
/** Time of day wrapped to [0,4): 0 night, 1 dawn, 2 noon, 3 evening, then back to night. */
const wrap = (k: number) => ((k % 4) + 4) % 4;
/** Sky colour at height y01 for a time-of-day value k (night, dawn, noon, evening, wrapping around). */
export function skyAt(k: number, y01: number): RGB {
  const kk = wrap(k);
  const i = Math.floor(kk), f = kk - i;
  const grad = (s: RGB[]) => (y01 < 0.5 ? mix(s[0], s[1], y01 * 2) : mix(s[1], s[2], (y01 - 0.5) * 2));
  return mix(grad(SKIES[i]), grad(SKIES[(i + 1) % 4]), f);
}
/** 0 at night, 1 in daylight, for a time-of-day value k. */
export const daylight = (k: number) => { const kk = wrap(k); return kk < 1 ? kk : kk <= 3 ? 1 : 4 - kk; };

/** City seen through a window: dithered sky, stars/moon or sun, two skyline layers with lit windows. */
export function cityView(win: Rect, t: number, k: number) {
  const d = daylight(k);
  ditherGradient(win, (y) => skyAt(k, y));
  if (d < 0.6) {
    for (let i = 0; i < 18; i++) if (Math.sin(t * 3 + i * 1.7) > -0.2) dot(win.x + 2 + Math.floor(rnd(i) * (win.w - 4)), win.y + 2 + Math.floor(rnd(i + 40) * win.h * 0.45), i % 5 ? '#9FB3E0' : C.gold4);
    sprite(['.###.', '#####', '####.', '###..', '.#...'], { '#': '#E8EEFF' }, win.x + win.w - 18, win.y + 6);
  } else {
    const g = ctx();
    const p = clamp((wrap(k) - 0.8) / 2.4);
    const sx = win.x + win.w * (0.1 + 0.8 * p), sy = win.y + win.h * (0.62 - 0.4 * Math.sin(p * Math.PI));
    for (let r = 7; r >= 0; r--) { g.fillStyle = r > 5 ? 'rgba(255,208,138,0.35)' : r > 3 ? C.gold4 : '#FFF4D6'; g.beginPath(); g.arc(sx, sy, r, 0, Math.PI * 2); g.fill(); }
  }
  const farC = mix(hex('#101B3A'), hex('#6C7FB8'), d * 0.8);
  const nearC = mix(hex('#070C1C'), hex('#3B4A78'), d * 0.8);
  for (let i = 0; i * 11 < win.w + 11; i++) {
    const bh = 12 + Math.floor(rnd(i + 3) * win.h * 0.3);
    rect(win.x + i * 11 - 2, win.y + win.h - bh - 5, 10, bh + 5, css(farC));
  }
  for (let i = 0; i * 16 < win.w + 16; i++) {
    const bx = win.x + i * 16 - 4, bh = 8 + Math.floor(rnd(i + 11) * win.h * 0.35), bw = 12 + Math.floor(rnd(i + 17) * 5);
    const by = win.y + win.h - bh;
    rect(bx, by, Math.min(bw, win.x + win.w - bx), bh, css(nearC));
    for (let wy = by + 3; wy < win.y + win.h - 2; wy += 4) for (let wx = bx + 2; wx < Math.min(bx + bw - 2, win.x + win.w - 1); wx += 3) {
      const key = wx * 7 + wy * 13;
      if (rnd(key) > 0.45 && (d < 0.5 || rnd(key + 1) > 0.85) && Math.sin(t * 0.7 + key) > -0.8) dot(wx, wy, d < 0.5 ? C.gold3 : '#9FB3E0');
    }
  }
}

// ---------------------------------------------------------------- room & props
export function officeRoom(W: number, wall = C.wall2, stripe = C.wall1, floor = C.floor2, plank = C.floor1) {
  rect(0, 0, W, 128, wall);
  for (let x = 0; x < W; x += 6) rect(x, 0, 1, 124, stripe);
  rect(0, 124, W, 4, C.base);
  rect(0, 128, W, 52, floor);
  for (let y = 128; y < 180; y += 7) rect(0, y, W, 1, plank);
  for (let y = 128, k = 0; y < 180; y += 7, k++) for (let x = (k % 2) * 24; x < W; x += 48) rect(x, y, 1, 7, plank);
  rect(0, 128, W, 1, C.floor3);
}

export function windowFrame(win: Rect) {
  orect(win.x - 3, win.y - 3, win.w + 6, win.h + 6, C.frame1);
  rect(win.x - 6, win.y + win.h + 3, win.w + 12, 3, C.wood2);
}
export function windowMullions(win: Rect) {
  rect(win.x + Math.floor(win.w / 2) - 1, win.y, 2, win.h, C.frame1);
  rect(win.x, win.y + Math.floor(win.h / 2) - 1, win.w, 2, C.frame1);
}

export function desk(x: number, y: number, w: number) {
  rect(x, y, w, 5, C.wood3);
  rect(x, y + 5, w, 3, C.wood1);
  rect(x, y, w, 1, '#A87A55');
  rect(x + 4, y + 8, 5, 128 - y - 8, C.wood1);
  rect(x + w - 9, y + 8, 5, 128 - y - 8, C.wood1);
}

/** Monitor frame; returns the screen rect (to be drawn later as emissive). */
export function monitor(x: number, y: number, w: number, h: number, standY?: number): Rect {
  orect(x, y, w, h, C.metal0);
  rect(x, y, w, 1, C.metal2);
  const sy = standY ?? y + h;
  rect(x + w / 2 - 3, y + h, 6, sy - y - h + 2, C.metal1);
  rect(x + w / 2 - 9, sy + 1, 18, 2, C.metal2);
  return { x: x + 3, y: y + 3, w: w - 6, h: h - 6 };
}

export function screenBase(s: Rect, bg: string, bar: string) {
  rect(s.x, s.y, s.w, s.h, bg);
  rect(s.x, s.y, s.w, 3, bar);
}
export function scanlines(s: Rect) {
  for (let y = s.y; y < s.y + s.h; y += 2) rect(s.x, y, s.w, 1, 'rgba(255,255,255,0.035)');
}

export function wallClock(cx: number, cy: number, hours: number) {
  const g = ctx();
  g.fillStyle = C.frame0; g.beginPath(); g.arc(cx, cy, 11, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#D9E0EE'; g.beginPath(); g.arc(cx, cy, 9, 0, Math.PI * 2); g.fill();
  for (let h = 0; h < 12; h++) { const a = (h / 12) * Math.PI * 2; dot(cx + Math.sin(a) * 7, cy - Math.cos(a) * 7, C.metal1); }
  const ha = ((hours % 12) / 12) * Math.PI * 2, ma = (hours % 1) * Math.PI * 2;
  for (let r = 0; r < 4; r++) dot(cx + Math.sin(ha) * r, cy - Math.cos(ha) * r, C.ink);
  for (let r = 0; r < 7; r++) dot(cx + Math.sin(ma) * r, cy - Math.cos(ma) * r, C.coral1);
}

export function mug(x: number, y: number, t: number, steam: boolean) {
  rect(x, y, 6, 7, '#E8EEF8'); rect(x + 6, y + 2, 2, 3, '#E8EEF8'); rect(x, y, 6, 1, C.paper1);
  if (steam) for (let i = 0; i < 3; i++) { const k = (t * 0.8 + i / 3) % 1; dot(x + 2 + Math.round(Math.sin(k * 6 + i)), y - 2 - k * 8, `rgba(220,230,245,${0.8 * (1 - k)})`); }
}

export function plant(x: number, y: number, t: number, perk = 1) {
  rect(x, y + 1, 10, 6, C.pot1); rect(x, y + 1, 10, 1, C.pot2); rect(x + 1, y + 6, 8, 1, C.pot0);
  [[-3, -1, 1], [0, -3, 0], [3, -2, 1], [6, -3, 0], [9, -1, 1]].forEach(([lx, ly, s], i) => {
    const droop = Math.round((1 - perk) * (3 + (i % 2)));
    const sway = Math.round(Math.sin(t * 1.5 + i) * 0.6 * perk);
    for (let k = 0; k < 5; k++) dot(x + 2 + lx * 0.6 + sway + k * (lx < 3 ? -0.4 : 0.4), y + ly - k + droop * (k / 4) * 1.5, k < 2 ? C.leaf1 : s ? C.leaf3 : C.leaf2);
  });
}

/** Chat bubble (9x6 + tail). */
export function bubble(x: number, y: number, c: string, urgent = false) {
  orect(x, y, 9, 5, c);
  dot(x + 1, y + 5, c); dot(x + 1, y + 6, C.ink);
  if (urgent) { rect(x + 4, y + 1, 1, 2, C.paper3); dot(x + 4, y + 4, C.paper3); }
  else { rect(x + 2, y + 2, 5, 1, c === C.paper2 ? C.paper0 : C.mint1); }
}

/** Drifting dust, visible only where `inLight` says so. */
export function motes(area: Rect, t: number, n: number, inLight: (x: number, y: number) => boolean, color = 'rgba(255,226,163,0.8)') {
  for (let i = 0; i < n; i++) {
    const x = area.x + ((rnd(i) * area.w + t * (2 + rnd(i + 5) * 4)) % area.w);
    const y = area.y + ((rnd(i + 9) * area.h + t * 3 * (rnd(i + 2) - 0.5) + area.h * 4) % area.h);
    if (inLight(x, y) && Math.sin(t * 2 + i) > 0) dot(x, y, color);
  }
}

export function checkMark(x: number, y: number, c = C.paper3) {
  [[0, 2], [1, 3], [2, 4], [3, 3], [4, 2], [5, 1], [6, 0]].forEach(([dx, dy]) => dot(x + dx, y + dy, c));
}

// ---------------------------------------------------------------- the star's entrance and click
export interface StarBeat { x: number; bottom: number; shape: StarShape; eyes: StarEyes; visible: boolean }

/**
 * Star flying from `from` to a perch between `fly[0]` and `fly[1]`, landing with squash
 * & stretch, then bobbing. Eyes focus while working, blink now and then.
 */
export function starBeat(t: number, fly: [number, number], from: [number, number], perch: [number, number], clickEnd: number, leaveAt = Infinity): StarBeat {
  if (t < fly[0]) return { x: -99, bottom: -99, shape: 'n', eyes: 'open', visible: false };
  if (t < fly[1]) {
    const k = ease(seg(t, fly[0], fly[1]));
    return { x: from[0] + (perch[0] - from[0]) * k, bottom: from[1] + (perch[1] - from[1]) * k - Math.sin(k * Math.PI) * 22, shape: 'stretch', eyes: 'open', visible: true };
  }
  if (t >= leaveAt) {
    const k = ease(seg(t, leaveAt, leaveAt + 0.6));
    return { x: perch[0] + k * 80, bottom: perch[1] - k * 70, shape: 'stretch', eyes: 'happy', visible: k < 1 };
  }
  const k = seg(t, fly[1], fly[1] + 0.3);
  const shape: StarShape = k < 0.4 ? 'squash' : k < 0.8 ? 'stretch' : 'n';
  const bottom = perch[1] - (shape === 'stretch' ? 2 : 0) + (k >= 1 ? Math.round(Math.sin(t * 4)) : 0);
  const eyes: StarEyes = t < clickEnd ? 'focus' : (t % 3.1) < 0.12 ? 'blink' : t < clickEnd + 3 ? 'focus' : 'happy';
  return { x: perch[0], bottom, shape, eyes, visible: true };
}

export function drawStarBeat(b: StarBeat, headphones = false) {
  if (!b.visible) return;
  if (b.shape === 'stretch') trail(b.x, b.bottom - 6, 1);
  drawStar(b.x, b.bottom, b.shape, b.eyes, headphones);
}

/** The hand pops out of the star and clicks (tx, ty); then a double ring. */
export function clickBeat(t: number, click: [number, number], from: [number, number], target: [number, number]) {
  if (t >= click[0] && t < click[1] + 0.2) {
    const k = seg(t, click[0], click[0] + 0.15), back = seg(t, click[1], click[1] + 0.2);
    const e = k * (1 - back);
    drawHand(from[0] + (target[0] - from[0]) * e, from[1] + (target[1] - from[1]) * e);
  }
  const r = seg(t, click[0] + 0.12, click[1] + 0.6);
  if (r > 0 && r < 1) { ring(target[0] + 3, target[1] + 3, r * 36, C.mint4); if (r > 0.2) ring(target[0] + 3, target[1] + 3, r * 36 - 6, C.mint3); }
}

/** Standard fades: into the loop, at the end, and optional cuts. */
export function fades(g: CanvasRenderingContext2D, t: number, loop: number, w: number, h: number, cuts: Array<[number, number]> = []) {
  const put = (a: number) => { if (a > 0) { g.fillStyle = `rgba(5,7,15,${a})`; g.fillRect(0, 0, w, h); } };
  if (t < 0.35) put(1 - t / 0.35);
  if (t > loop - 0.6) put(seg(t, loop - 0.6, loop) * 0.95);
  for (const [a, b] of cuts) if (t >= a && t < b) put(Math.sin(seg(t, a, b) * Math.PI));
}
