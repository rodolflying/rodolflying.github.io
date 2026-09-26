// Data & web story: "1.500 forms".
// An administrator uploads forms one by one ("41 / 1500") while days and nights pass
// in the window and the calendar sheds pages -> the star opens several portal windows
// that fill in cascade, the counter races to 1.500 and newsletters fly out ->
// it is Friday: the admin tears off the page and leaves early.
import type { PixelScene } from './PixelCanvas';
import { C, type RGB, type Rect, type Light, clamp, ease, easeOutBack, mix, seg, setCtx, rect, dot, orect, number, bigNumber, thousands, lightingPass, world } from './engine';
import { drawSeated, drawStanding, drawChair, zzz, type Look, type Mood, type StandPose } from './rig';
import { cityView, daylight, windowFrame, windowMullions, officeRoom, desk, monitor, screenBase, scanlines, starBeat, drawStarBeat, clickBeat, fades, checkMark, mug, plant } from './sets';

const WORLD_W = 320;
const WORLD_H = 180;
export const DATA_W = 256;
export const DATA_H = 144;
export const DATA_LOOP = 15;
const TOTAL = 1500;

const T = {
  lapse: [0.3, 4.6] as [number, number],
  fly: [4.6, 5.3] as [number, number], click: [5.5, 5.85] as [number, number],
  pop: [6.0, 6.7] as [number, number], fill: [6.4, 9.0] as [number, number], mail: [8.7, 10.1] as [number, number],
  close: [10.1, 10.5] as [number, number],
  standUp: 10.3, walk: [10.5, 11.2] as [number, number], tear: [11.3, 11.9] as [number, number],
  wave: [11.9, 12.4] as [number, number], leave: [12.4, 13.9] as [number, number], starOut: 13.6,
};

const ADMIN: Look = { skin: 'light', hair: 'curly', hairColor: 'brown', outfit: 'cardigan', glasses: true };

const WIN: Rect = { x: 30, y: 22, w: 44, h: 32 };
const CAL: Rect = { x: 88, y: 44, w: 18, h: 22 };
const PILE = { x: 206, bottom: 99, sheets: 22 };
const TILES = [0, 1, 2, 3, 4, 5].map((i) => ({ x: 130 + (i % 3) * 50, y: 10 + Math.floor(i / 3) * 20, w: 44, h: 15 }));
const FIRST_DAY = 16; // Wednesday; the loop ends on Friday 18

/** Time of day: Wednesday noon -> Friday evening during the lapse, then Friday evening. */
const tod = (t: number) => 2 + 9 * ease(seg(t, T.lapse[0], T.lapse[1]));
/** Calendar day shown (a page falls at each midnight; the admin tears Friday off at the end). */
const dayAt = (t: number) => FIRST_DAY + Math.floor(tod(t) / 4) + (t >= T.tear[0] + 0.25 ? 1 : 0);

function camera(t: number): [number, number] {
  let x = 26;
  x -= ease(seg(t, T.walk[0], T.walk[1])) * 14 * (1 - ease(seg(t, T.leave[1] - 0.2, T.leave[1] + 0.8)));
  return [Math.round(clamp(x, 0, WORLD_W - DATA_W)), 4];
}

function counterAt(t: number) {
  if (t < T.fill[0]) return 3 + Math.round(38 * seg(t, T.lapse[0], T.click[0]));
  return Math.round(41 + (TOTAL - 41) * ease(seg(t, T.fill[0], T.fill[1])));
}

function drawCalendar(t: number) {
  orect(CAL.x, CAL.y, CAL.w, CAL.h, C.paper2);
  rect(CAL.x, CAL.y, CAL.w, 4, C.coral1);
  dot(CAL.x + 4, CAL.y - 2, C.metal3); dot(CAL.x + 13, CAL.y - 2, C.metal3);
  const d = dayAt(t);
  bigNumber(d, CAL.x + 2, CAL.y + 7, d >= FIRST_DAY + 3 ? C.mint1 : C.ink, 2);
  if (d >= FIRST_DAY + 3) { rect(CAL.x + 7, CAL.y + 18, 4, 2, C.gold2); } // weekend: a little sun
  for (let i = 0; i < 4; i++) rect(CAL.x + 1, CAL.y + CAL.h - 1 + (i % 2), CAL.w - 2, 1, i % 2 ? C.paper1 : C.paper2);
}

/** Pages flying off: one per midnight during the lapse, and Friday's, torn by hand. */
function fallingPages(t: number) {
  const pages: Array<{ at: number; day: number }> = [];
  for (let m = 1; m <= 2; m++) {
    // tod(t) crosses 4*m: invert the eased lapse numerically (cheap, few samples)
    for (let s = 0; s <= 80; s++) {
      const tt = T.lapse[0] + (s / 80) * (T.lapse[1] - T.lapse[0]);
      if (tod(tt) >= 4 * m) { pages.push({ at: tt, day: FIRST_DAY + m - 1 }); break; }
    }
  }
  pages.push({ at: T.tear[0] + 0.25, day: FIRST_DAY + 2 });
  for (const p of pages) {
    const k = seg(t, p.at, p.at + 0.9);
    if (k <= 0 || k >= 1) continue;
    const x = CAL.x + k * 22 * (p.day === FIRST_DAY + 2 ? -1 : 1), y = CAL.y + 4 + k * k * 70;
    const w = Math.max(2, Math.round(CAL.w * Math.abs(Math.cos(k * 9))));
    orect(x + (CAL.w - w) / 2, y, w, CAL.h - 4, C.paper2);
    if (w > 10) number(p.day, x + 5, y + 5, C.ink);
  }
}

function drawPile(t: number) {
  // the inbox pile: slowly worked by hand, then pulled into the portal windows
  const byHand = Math.floor(seg(t, T.lapse[0], T.click[0]) * 4);
  const fast = Math.floor(ease(seg(t, T.fill[0], T.fill[1] - 0.4)) * (PILE.sheets - 4));
  const n = PILE.sheets - byHand - fast;
  for (let i = 0; i < n; i++) rect(PILE.x + (i % 3 === 1 ? 1 : 0), PILE.bottom - i, 18, 1, i % 2 ? C.paper1 : C.paper2);
  rect(PILE.x, PILE.bottom, 18, 1, C.paper0);
  // done tray on the left of the keyboard
  orect(136, 96, 14, 3, C.metal1);
  for (let i = 0; i < Math.min(3, byHand); i++) rect(137, 95 - i, 12, 1, C.paper2);
}

/** Sheets lifting off the pile into the portal windows while they work. */
function flyingSheets(t: number) {
  if (t < T.fill[0] || t > T.fill[1] - 0.3) return;
  for (let i = 0; i < 5; i++) {
    const cycle = (t - T.fill[0]) * 1.8 + i / 5;
    const k = ease(cycle % 1);
    const tile = TILES[(Math.floor(cycle) * 5 + i) % 6];
    const sx = PILE.x + 9, sy = PILE.bottom - 12, tx = tile.x + tile.w / 2, ty = tile.y + tile.h / 2;
    const x = Math.round(sx + (tx - sx) * k - 2), y = Math.round(sy + (ty - sy) * k - Math.sin(k * Math.PI) * 8);
    if (k > 0.92) continue;
    orect(x, y, 5, 6, C.paper3);
    rect(x + 1, y + 1, 3, 1, C.paper0); rect(x + 1, y + 3, 2, 1, C.paper0);
  }
}

function drawMonitor(t: number, s: Rect) {
  const n = counterAt(t);
  if (t < T.click[0] + 0.12) {
    // the portal, one form at a time
    screenBase(s, '#0E1624', '#2A3550');
    for (let i = 0; i < 3; i++) { rect(s.x + 3, s.y + 6 + i * 5, 8, 1, C.paper0); rect(s.x + 13, s.y + 5 + i * 5, 20, 3, '#1A2438'); }
    const typed = Math.floor((t * 3) % 1 * 18);
    rect(s.x + 14, s.y + 6, typed, 1, C.paper2);
    if (Math.floor(t * 2) % 2) rect(s.x + 14 + typed, s.y + 5, 1, 3, C.paper3);
    number(`${n}/1500`, s.x + 3, s.y + s.h - 6, C.gold3);
  } else {
    screenBase(s, '#08141A', '#123A48');
    bigNumber(thousands(n), s.x + 2, s.y + 6, n >= TOTAL ? C.mint4 : C.mint3, 2);
    rect(s.x + 2, s.y + s.h - 6, s.w - 4, 3, '#1C3A48');
    rect(s.x + 2, s.y + s.h - 6, Math.round((s.w - 4) * (n / TOTAL)), 3, C.mint3);
    if (n >= TOTAL) checkMark(s.x + s.w - 10, s.y + 6, C.mint4);
  }
  scanlines(s);
}

/** Floating portal windows: pop out of the monitor, fill forms in cascade, send newsletters. */
function drawTiles(t: number) {
  if (t < T.pop[0] || t >= T.close[1]) return;
  const from = { x: 180, y: 76 };
  TILES.forEach((tile, i) => {
    const pk = easeOutBack(seg(t, T.pop[0] + i * 0.08, T.pop[0] + i * 0.08 + 0.4));
    const ck = ease(seg(t, T.close[0] + i * 0.03, T.close[1]));
    const k = pk * (1 - ck);
    if (k <= 0.02) return;
    const w = Math.max(3, Math.round(tile.w * k)), h = Math.max(2, Math.round(tile.h * k));
    const x = Math.round(from.x + (tile.x + tile.w / 2 - from.x) * k - w / 2), y = Math.round(from.y + (tile.y + tile.h / 2 - from.y) * k - h / 2);
    orect(x, y, w, h, C.paper2);
    rect(x, y, w, 3, C.mint1);
    if (w < tile.w - 2) return;
    dot(x + 1, y + 1, C.coral2); dot(x + 3, y + 1, C.gold3); dot(x + 5, y + 1, C.mint4);
    // a form cycles every 0.55 s: three fields fill left to right, then a check
    const done = t >= T.fill[1];
    const local = done ? 1 : ((t - T.fill[0] - i * 0.12) / 0.55) % 1;
    const active = t >= T.fill[0] + i * 0.12;
    for (let f = 0; f < 3; f++) {
      rect(x + 2, y + 5 + f * 3, 6, 1, C.paper0);
      rect(x + 10, y + 4 + f * 3, 22, 2, C.paper1);
      if (active) { const fk = clamp(local * 3.4 - f); rect(x + 10, y + 5 + f * 3, Math.round(22 * fk), 1, C.ink); }
    }
    if (active && local > 0.9) checkMark(x + 35, y + 6, C.mint1);
  });
}

function drawEnvelopes(t: number) {
  if (t < T.mail[0] || t > T.mail[1] + 0.6) return;
  const target = { x: WIN.x + WIN.w / 2, y: WIN.y + WIN.h / 2 };
  for (let i = 0; i < 10; i++) {
    const tile = TILES[i % 6];
    const at = T.mail[0] + i * 0.12;
    const k = ease(seg(t, at, at + 0.6));
    if (k <= 0 || k >= 1) continue;
    const sx = tile.x + tile.w / 2, sy = tile.y + tile.h / 2;
    const x = sx + (target.x - sx) * k, y = sy + (target.y - sy) * k - Math.sin(k * Math.PI) * 14;
    const small = k > 0.75;
    orect(x, y, small ? 5 : 7, small ? 3 : 5, C.paper3);
    if (!small) { dot(x + 1, y + 1, C.paper0); dot(x + 2, y + 2, C.paper0); dot(x + 3, y + 3, C.coral1); dot(x + 4, y + 2, C.paper0); dot(x + 5, y + 1, C.paper0); }
  }
}

function drawLamp(on: boolean) {
  rect(228, 97, 8, 3, C.metal1);
  rect(231, 84, 2, 13, C.metal2);
  rect(226, 81, 12, 4, C.metal2); rect(227, 85, 10, 1, on ? C.gold4 : C.metal0);
}

export const dataHQScene: PixelScene = (g, time) => {
  const t = time % DATA_LOOP;
  const { canvas, g: w } = world('data', WORLD_W, WORLD_H);
  setCtx(w);
  const [cx, cy] = camera(t);
  const view: Rect = { x: cx, y: cy, w: DATA_W, h: DATA_H };
  const k = tod(t);
  const day = daylight(k);
  const night = day < 0.3;

  // --- albedo
  officeRoom(WORLD_W, '#241E36', '#1F1A30');
  windowFrame(WIN);
  plant(38, 51, t, t < T.click[0] ? 0.5 : 1);
  drawCalendar(t);
  // binders shelf
  rect(246, 64, 44, 2, C.wood2);
  ['#3E4FA6', C.coral1, C.mint1, C.gold1, '#6A3EA0', C.blue1].forEach((c, i) => rect(248 + i * 7, 48 + (i % 2), 6, 16 - (i % 2), c));
  desk(110, 100, 128);
  const scr = monitor(158, 60, 44, 32, 98);
  drawPile(t);
  drawLamp(night && t < T.click[0]);
  mug(151, 93, t, t < T.click[0]);

  // admin
  const seated = t < T.standUp;
  drawChair(112, 110, 128);
  if (seated) {
    let pose: 'type' | 'sleep' | 'watch' | 'coffee' = night ? 'sleep' : 'type';
    let mood: Mood = (t % 2.7) < 0.14 ? 'blink' : 'tired';
    if (t >= T.click[0]) {
      pose = t < T.pop[1] ? 'watch' : 'coffee';
      mood = t < T.click[0] + 0.6 ? 'surprised' : (t % 3.1) < 0.12 ? 'blink' : 'relieved';
    }
    const sip = seg(t, 7.6, 7.9) * (1 - seg(t, 8.4, 8.7));
    drawSeated(ADMIN, pose, mood, 120, 76, t, { slump: t > 2 && t < T.click[0] ? 1 : 0, sip });
  } else {
    let pose: StandPose = 'stand';
    let x = 118;
    let flip = true;
    let mood: Mood = 'happy';
    const look = { ...ADMIN, bag: t >= T.wave[0] };
    if (t >= T.walk[0] && t < T.walk[1]) { pose = 'walk'; x = 118 - ease(seg(t, T.walk[0], T.walk[1])) * 30; }
    else if (t >= T.walk[1] && t < T.tear[1]) { pose = 'stretch'; x = 88; mood = t < T.tear[0] + 0.3 ? 'focus' : 'happy'; }
    else if (t >= T.tear[1] && t < T.wave[1]) { pose = 'wave'; x = 88; flip = false; }
    else if (t >= T.wave[1]) { pose = 'walk'; x = 88 - ease(seg(t, T.leave[0], T.leave[1])) * 120; }
    if (t >= T.walk[1]) x = t >= T.leave[0] ? x : 88;
    drawStanding(look, pose, mood, Math.round(x), 66, t, flip);
  }

  // --- lights
  const sb = starBeat(t, T.fly, [50, 30], [scr.x + scr.w / 2, scr.y - 4], T.click[1], T.starOut);
  const lights: Light[] = [
    { x: scr.x + scr.w / 2, y: scr.y + scr.h / 2, r: 60, c: t < T.click[0] ? [0.45, 0.6, 1] : [0.35, 1, 0.8], i: 0.9 - day * 0.4 },
  ];
  if (night && t < T.click[0]) lights.push({ x: 232, y: 88, r: 60, c: [1, 0.8, 0.5], i: 0.9 });
  if (t >= T.pop[0] && t < T.close[1]) lights.push({ x: 200, y: 30, r: 110, c: [0.35, 1, 0.8], i: 0.45 });
  if (sb.visible) lights.push({ x: sb.x, y: sb.bottom - 7, r: 36, c: [0.35, 1, 0.8], i: 0.7 });
  const ambient: RGB = mix([0.22, 0.24, 0.4], k % 4 > 2.5 ? [0.78, 0.6, 0.5] : [0.8, 0.76, 0.7], day);
  lightingPass({
    view, ambient, lights, emissive: [WIN, scr],
    extra: day > 0.6 ? (x, y) => (y > WIN.y + WIN.h && Math.abs(x - (y - WIN.y - WIN.h) * 0.9 - (WIN.x + WIN.w / 2)) < WIN.w / 2 ? [0.22 * day, 0.16 * day, 0.08 * day] : null) : undefined,
  });

  // --- emissive + overlays
  cityView(WIN, t, k);
  windowMullions(WIN);
  drawMonitor(t, scr);
  fallingPages(t);
  flyingSheets(t);
  drawTiles(t);
  drawEnvelopes(t);
  if (seated && night && t < T.click[0]) zzz(146, 72, t);
  drawStarBeat(sb);
  clickBeat(t, T.click, [sb.x + 6, sb.bottom - 10], [scr.x + scr.w / 2 - 3, scr.y + 10]);
  if (t >= T.click[0] + 0.1 && t < T.click[0] + 0.8) { rect(134, 68, 2, 6, C.gold3); rect(134, 76, 2, 2, C.gold3); }

  // --- camera crop + transitions
  g.imageSmoothingEnabled = false;
  g.drawImage(canvas, cx, cy, DATA_W, DATA_H, 0, 0, DATA_W, DATA_H);
  fades(g, t, DATA_LOOP, DATA_W, DATA_H);
};
