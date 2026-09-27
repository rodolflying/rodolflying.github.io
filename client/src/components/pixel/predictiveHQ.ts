// Predictive story: "the failure we saw coming".
// A pump's bearing wears out while the classic alarm still says OK -> the star's model
// projects the vibration forward and finds when it will cross the limit -> a planned
// work order lands before that date -> planned stop: the technician swaps the bearing
// -> the machine runs smooth again, no emergency.
import type { PixelScene } from './PixelCanvas';
import { C, type Rect, type Light, clamp, ease, seg, rnd, setCtx, rect, dot, orect, bigNumber, lightingPass, world } from './engine';
import { drawSeated, drawStanding, drawChair, type Look, type Mood, type StandPose } from './rig';
import { desk, screenBase, scanlines, starBeat, drawStarBeat, clickBeat, fades, checkMark, mug, HOLD, hitStop, hitStopFx, grade, moodBubble, resultStamp } from './sets';

const WORLD_W = 320;
const WORLD_H = 180;
export const PRED_W = 256;
export const PRED_H = 144;
const STORY = 15;
export const PRED_LOOP = STORY + HOLD;

const T = {
  fly: [3.6, 4.4] as [number, number], click: [4.6, 4.95] as [number, number],
  forecast: [5.1, 6.3] as [number, number], prob: [6.0, 6.8] as [number, number], order: [7.0, 7.7] as [number, number],
  lapse: [8.0, 8.8] as [number, number], techIn: [9.0, 10.2] as [number, number], repair: [10.2, 11.8] as [number, number],
  restart: 11.9, thumbs: [12.2, 13.0] as [number, number], techOut: [13.0, 14.4] as [number, number], starOut: 13.6,
};

const ENGINEER: Look = { skin: 'light', hair: 'ponytail', hairColor: 'black', outfit: 'office', shirt: ['#1E3A5A', '#2E5A8A', '#4A86C0', '#8FC0EE'], glasses: true };
const TECH: Look = { skin: 'medium', hair: 'short', outfit: 'vest', headwear: 'helmet', bag: true, pants: ['#1E2638', '#2E3A56'] };

const SCREEN: Rect = { x: 166, y: 24, w: 112, h: 50 };
const CH = { x: SCREEN.x + 4, y: SCREEN.y + 7, w: 74, h: 38 }; // chart
const RP = { x: CH.x + CH.w + 4, y: SCREEN.y + 7 }; // right panel
const NOW = 0.62; // "now" marker inside the chart
const LIMIT = 0.82; // alarm limit (normalized)
const CROSS = NOW + 0.27; // where the forecast crosses the limit
const PLAN = NOW + 0.17; // planned stop, before the crossing
const TECH_AT = 128;

/** Bearing wear: grows until the planned stop, almost zero after the swap. */
const wear = (t: number) => (t < T.lapse[0] ? 0.25 + 0.55 * seg(t, 0, T.lapse[0]) : t < T.repair[1] ? 0.8 : 0.06);
const running = (t: number) => !(t >= T.lapse[1] && t < T.restart);
const repaired = (t: number) => t >= T.restart;

function camera(t: number): [number, number] {
  let x = 26;
  x += ease(seg(t, T.click[0] - 0.3, T.click[0] + 0.2)) * 14 * (1 - ease(seg(t, T.order[0], T.order[1])));
  x -= ease(seg(t, T.techIn[1] - 0.4, T.repair[0] + 0.2)) * 16 * (1 - ease(seg(t, T.thumbs[0], T.techOut[0] + 0.4)));
  return [Math.round(clamp(x, 0, WORLD_W - PRED_W)), 4];
}

// ---------------------------------------------------------------- the plant
function drawPlant() {
  rect(0, 0, WORLD_W, 128, '#26324A');
  for (let x = 0; x < WORLD_W; x += 24) rect(x, 0, 1, 124, '#1F2A3E');
  rect(0, 60, WORLD_W, 1, '#222C3E');
  rect(0, 124, WORLD_W, 4, C.base);
  rect(0, 128, WORLD_W, 52, '#3A3F4A');
  for (let y = 136; y < 180; y += 10) rect(0, y, WORLD_W, 1, '#33384A');
  rect(0, 150, WORLD_W, 2, C.gold1); // safety line on the floor
  for (const lx of [80, 232]) { rect(lx, 0, 1, 8, C.metal1); rect(lx - 7, 8, 15, 3, C.metal2); rect(lx - 8, 10, 17, 1, C.metal1); }
}

function drawMachine(t: number) {
  const w = wear(t);
  const run = running(t);
  // 1 px shake that shows up more often as the bearing wears
  const f = Math.floor(t * 30);
  const j = run && w > 0.3 && f % 2 === 1 && rnd(f) < w ? 1 : 0;
  // pipes (fixed)
  rect(114, 0, 10, 90, C.metal1); rect(114, 0, 2, 90, C.metal2);
  rect(136, 104, 34, 8, C.metal1); rect(136, 104, 34, 2, C.metal2); orect(166, 100, 4, 16, C.metal2);
  // plinth
  orect(30, 118, 112, 10, C.metal1); rect(30, 118, 112, 2, C.metal3);
  // motor
  orect(40 + j, 86, 50, 32, '#3E6A8A');
  rect(40 + j, 86, 50, 2, '#5E8AAA');
  for (let k = 44; k < 88; k += 4) rect(k + j, 89, 1, 27, '#2E506A');
  orect(34 + j, 90, 6, 24, C.metal2);
  orect(58 + j, 80, 12, 6, '#2E506A');
  // coupling guard with the shaft turning inside
  orect(90 + j, 96, 12, 12, C.helmet1);
  rect(90 + j, 96, 12, 2, C.helmet2);
  if (run) rect(90 + j + Math.floor((t * 40) % 10), 100, 2, 5, C.helmet3);
  // pump
  orect(102 + j, 88, 34, 30, C.metal2);
  rect(102 + j, 88, 34, 2, C.metal3);
  orect(110 + j, 94, 18, 18, C.metal1);
  rect(117 + j, 101, 4, 4, C.metal3);
  // vibration sensor on the bearing housing (where the model's data comes from)
  orect(95 + j, 89, 5, 5, C.ink);
  // lockout tag during the planned stop
  if (!run) { rect(64, 86, 1, 6, C.metal3); orect(62, 92, 5, 7, C.coral1); dot(64, 94, C.paper3); }
  // the worn bearing, set on the floor after the swap
  if (t >= T.repair[0] + 0.9 && t < T.techOut[1]) orect(112, 140, 6, 4, C.coral1);
}

/** Clipboard on the wall: empty, then the planned work order, then signed off. */
function drawClipboard(t: number) {
  orect(44, 62, 12, 15, C.wood2);
  rect(47, 61, 6, 2, C.metal3);
  if (t >= T.order[1]) {
    rect(46, 65, 8, 10, C.paper2);
    rect(47, 67, 6, 1, C.paper0); rect(47, 69, 4, 1, C.paper0);
    if (repaired(t)) checkMark(46, 70, C.mint1);
    else { rect(48, 71, 4, 1, C.gold1); rect(49, 70, 2, 3, C.gold1); }
  }
}

// ---------------------------------------------------------------- the monitoring screen
function chartY(v: number) { return CH.y + CH.h - 1 - Math.round(clamp(v) * (CH.h - 2)); }

function drawScreen(t: number) {
  screenBase(SCREEN, '#08121C', '#123040');
  const w = wear(t);
  const vNow = 0.2 + 0.55 * w;
  const scroll = running(t) ? Math.floor(t * 6) : 0;
  // axes, limit line and the "now" marker
  rect(CH.x, CH.y + CH.h, CH.w, 1, '#1C3A48');
  for (let x = 0; x < CH.w; x += 3) dot(CH.x + x, chartY(LIMIT), C.coral1);
  const nowX = CH.x + Math.round(NOW * CH.w);
  for (let y = CH.y; y < CH.y + CH.h; y += 2) dot(nowX, y, '#2A4A5A');
  // danger sign at the end of the limit line, and a pin on "today"
  const ly = chartY(LIMIT);
  const dx = CH.x + CH.w - 6;
  rect(dx + 2, ly - 7, 1, 1, C.coral2); rect(dx + 1, ly - 6, 3, 1, C.coral2); rect(dx + 1, ly - 5, 3, 1, C.coral2); rect(dx, ly - 4, 5, 1, C.coral2); rect(dx, ly - 3, 5, 1, C.coral2);
  dot(dx + 2, ly - 6, '#08121C'); dot(dx + 2, ly - 4, '#08121C');
  rect(nowX - 1, CH.y - 3, 3, 3, C.paper2); dot(nowX, CH.y, C.paper2);
  // measured history (after the swap: a flat, healthy line)
  for (let i = 0; i <= Math.round(NOW * CH.w); i++) {
    const fx = i / CH.w;
    const noise = (rnd(i + scroll) - 0.5) * 0.08;
    const v = repaired(t) ? 0.2 + noise * 0.8 : 0.2 + (vNow - 0.2) * Math.pow(fx / NOW, 1.8) + noise;
    dot(CH.x + i, chartY(v), repaired(t) ? C.mint3 : C.blue3);
  }
  // the model's forecast: projected wear crossing the limit, with its uncertainty band
  const fk = ease(seg(t, T.forecast[0], T.forecast[1]));
  if (fk > 0 && !repaired(t)) {
    const n = Math.round((1 - NOW) * CH.w * fk);
    for (let i = 0; i <= n; i++) {
      const fx = NOW + i / CH.w;
      const v = vNow + (LIMIT - vNow) * Math.pow((fx - NOW) / (CROSS - NOW), 1.3);
      const band = (fx - NOW) * 0.35;
      if (i % 2 === 0) dot(CH.x + Math.round(fx * CH.w), chartY(v), C.mint4);
      if (i % 3 === 0) { dot(CH.x + Math.round(fx * CH.w), chartY(v + band), C.mint1); dot(CH.x + Math.round(fx * CH.w), chartY(v - band), C.mint1); }
    }
    if (fk >= 1) {
      const cx = CH.x + Math.round(CROSS * CH.w), cy = chartY(LIMIT);
      const on = Math.floor(t * 4) % 2 === 0 || t >= T.order[1];
      if (on) for (let k = -2; k <= 2; k++) { dot(cx + k, cy + k, C.coral3); dot(cx + k, cy - k, C.coral3); }
      // "this is the day it would fail"
      rect(cx - 3, cy - 12, 7, 6, C.paper2); rect(cx - 3, cy - 12, 7, 2, C.coral1); dot(cx - 1, cy - 9, C.ink); dot(cx + 1, cy - 9, C.ink); dot(cx - 1, cy - 7, C.ink);
    }
  }
  // the planned stop, set before the predicted failure
  if (t >= T.order[0] && !repaired(t)) {
    const px = CH.x + Math.round(PLAN * CH.w);
    const k = seg(t, T.order[0], T.order[0] + 0.4);
    for (let y = CH.y + CH.h - 1; y > CH.y + CH.h - 1 - (CH.h - 2) * k; y -= 2) dot(px, y, C.gold3);
    if (k >= 1) { rect(px - 2, CH.y + 1, 5, 2, C.gold3); rect(px, CH.y + 3, 1, 3, C.gold3); }
  }
  // right panel: classic alarm status, then the model's failure probability, then healthy
  if (t < T.prob[0]) {
    rect(RP.x + 7, RP.y + 4, 10, 10, C.mint1); rect(RP.x + 8, RP.y + 5, 8, 8, C.mint2); // "all green"
    for (let i = 0; i < 3; i++) rect(RP.x + 4 + i * 6, RP.y + 26, 4, 8 - i * 2, '#1C3A48');
  } else if (!repaired(t)) {
    const p = Math.round(82 * ease(seg(t, T.prob[0], T.prob[1])));
    bigNumber(`${p}%`, RP.x, RP.y + 2, C.coral2, 2);
    rect(RP.x, RP.y + 15, Math.round(24 * p / 100), 2, C.coral2);
    if (t >= T.order[1]) {
      // wrench + calendar: work order planned
      rect(RP.x + 2, RP.y + 24, 7, 2, C.gold3); rect(RP.x + 1, RP.y + 22, 2, 6, C.gold3);
      orect(RP.x + 13, RP.y + 21, 9, 9, C.paper2); rect(RP.x + 13, RP.y + 21, 9, 2, C.coral1);
    }
    if (!running(t)) { rect(RP.x + 8, RP.y + 33, 2, 5, C.gold3); rect(RP.x + 12, RP.y + 33, 2, 5, C.gold3); }
  } else {
    bigNumber('3%', RP.x + 4, RP.y + 2, C.mint3, 2);
    checkMark(RP.x + 8, RP.y + 24, C.mint4);
  }
  scanlines(SCREEN);
}

function drawBeacon(t: number) {
  const run = running(t);
  const on = run ? true : Math.floor(t * 3) % 2 === 0;
  orect(62, 75, 4, 4, on ? (run ? C.mint3 : C.gold3) : C.metal1);
}

function vibrationMarks(t: number) {
  const w = wear(t);
  if (!running(t) || w < 0.35) return;
  for (let k = 0; k < 3; k++) {
    if (rnd(k + Math.floor(t * 6)) > w) continue;
    const r = 4 + k * 4 + ((t * 12) % 4);
    for (let a = -0.8; a <= 0.8; a += 0.2) {
      const x = 98 + Math.cos(a - Math.PI / 2) * r, y = 86 + Math.sin(a - Math.PI / 2) * r;
      rect(x, y, 2, 1, `rgba(255,${210 - k * 30},120,${0.95 - k * 0.2})`);
    }
  }
}

/** The work order flying from the screen to the clipboard by the machine. */
function flyingOrder(t: number) {
  const k = ease(seg(t, T.order[0] + 0.2, T.order[1]));
  if (k <= 0 || k >= 1) return;
  const sx = RP.x + 10, sy = RP.y + 20, tx = 46, ty = 65;
  const x = sx + (tx - sx) * k, y = sy + (ty - sy) * k - Math.sin(k * Math.PI) * 18;
  orect(x, y, 8, 10, C.paper2);
  rect(x + 2, y + 5, 4, 1, C.gold1); rect(x + 3, y + 4, 2, 3, C.gold1);
}

export const predictiveHQScene: PixelScene = (g, time) => {
  const raw = time % PRED_LOOP;
  const t = hitStop(raw, T.click[0]);
  const { canvas, g: w } = world('predictive', WORLD_W, WORLD_H);
  setCtx(w);
  const [cx, cy] = camera(t);
  const view: Rect = { x: cx, y: cy, w: PRED_W, h: PRED_H };

  // --- albedo
  drawPlant();
  orect(SCREEN.x - 3, SCREEN.y - 3, SCREEN.w + 6, SCREEN.h + 6, C.metal0);
  rect(SCREEN.x - 3, SCREEN.y - 3, SCREEN.w + 6, 1, C.metal2);
  drawClipboard(t);
  drawMachine(t);
  desk(176, 100, 110);
  orect(250, 94, 16, 5, C.metal1); rect(251, 95, 14, 1, C.metal3); // keyboard
  mug(232, 93, t, !repaired(t) || t > T.thumbs[0]);

  // engineer at the monitoring desk
  drawChair(188, 110, 128);
  {
    let pose: 'coffee' | 'watch' | 'type' = 'coffee';
    let mood: Mood = (t % 3.1) < 0.12 ? 'blink' : 'neutral';
    if (t >= T.click[0] && t < T.order[1]) { pose = t < T.order[0] ? 'watch' : 'type'; mood = t < T.click[0] + 0.7 ? 'surprised' : 'focus'; }
    else if (t >= T.order[1] && !repaired(t)) { pose = 'watch'; mood = 'focus'; }
    else if (repaired(t)) { pose = 'coffee'; mood = (t % 3.1) < 0.12 ? 'blink' : 'happy'; }
    const sip = pose === 'coffee' ? (seg(t, 1.2, 1.5) * (1 - seg(t, 2.0, 2.3)) + seg(t, 12.6, 12.9) * (1 - seg(t, 13.4, 13.7))) : 0;
    drawSeated(ENGINEER, pose, mood, 196, 76, t, { sip });
  }

  // technician: comes for the planned stop, swaps the bearing, leaves
  if (t >= T.techIn[0] && t < T.techOut[1]) {
    let pose: StandPose = 'walk';
    let mood: Mood = 'focus';
    let x = TECH_AT;
    let flip = true;
    if (t < T.techIn[1]) x = 330 - (330 - TECH_AT) * ease(seg(t, T.techIn[0], T.techIn[1]));
    else if (t < T.repair[1]) pose = 'repair';
    else if (t < T.thumbs[0]) { pose = 'stand'; mood = 'happy'; }
    else if (t < T.thumbs[1]) { pose = 'thumbsup'; mood = 'happy'; flip = false; }
    else { flip = false; mood = 'happy'; x = TECH_AT + (330 - TECH_AT) * ease(seg(t, T.techOut[0], T.techOut[1])); }
    drawStanding(TECH, pose, mood, Math.round(x), 70, t, flip);
  }

  // --- lights
  const sb = starBeat(t, T.fly, [40, 20], [SCREEN.x + SCREEN.w / 2, SCREEN.y - 3], T.click[1], T.starOut);
  const alarm = t >= T.prob[0] && !repaired(t);
  const lights: Light[] = [
    { x: 80, y: 14, r: 110, c: [1, 0.86, 0.62], i: 0.55 },
    { x: 232, y: 14, r: 110, c: [1, 0.86, 0.62], i: 0.55 },
    { x: SCREEN.x + SCREEN.w / 2, y: SCREEN.y + SCREEN.h / 2, r: 80, c: alarm ? [1, 0.5, 0.55] : [0.35, 0.9, 0.85], i: 0.6 },
    { x: 64, y: 77, r: 22, c: running(t) ? [0.3, 1, 0.75] : [1, 0.75, 0.3], i: 0.8 },
  ];
  if (sb.visible) lights.push({ x: sb.x, y: sb.bottom - 7, r: 36, c: [0.35, 1, 0.8], i: 0.7 });
  lightingPass({ view, ambient: [0.74, 0.74, 0.8], lights, emissive: [SCREEN] });

  // --- emissive + overlays
  drawScreen(t);
  drawBeacon(t);
  vibrationMarks(t);
  flyingOrder(t);
  drawStarBeat(sb);
  clickBeat(t, T.click, [sb.x + 6, sb.bottom - 10], [SCREEN.x + SCREEN.w / 2 - 3, SCREEN.y + 16]);
  if (t >= T.click[0] + 0.1 && t < T.click[0] + 0.8) { rect(208, 68, 2, 6, C.gold3); rect(208, 76, 2, 2, C.gold3); }
  if (repaired(t) && t < T.thumbs[1] + 0.2) moodBubble(207, 77, 'check', t);

  // --- camera crop + transitions
  g.imageSmoothingEnabled = false;
  g.drawImage(canvas, cx, cy, PRED_W, PRED_H, 0, 0, PRED_W, PRED_H);
  grade(g, PRED_W, PRED_H, seg(t, T.click[0] + 0.12, T.click[0] + 0.9));
  hitStopFx(g, raw, T.click[0], SCREEN.x + SCREEN.w / 2 - cx, SCREEN.y + 19 - cy, PRED_W, PRED_H);
  resultStamp(g, t, T.thumbs[0], STORY - 0.4, { value: '3%', old: '82%', icon: 'check', color: '#7C9CFF' }, PRED_W);
  setCtx(w);
  fades(g, t, STORY, PRED_W, PRED_H, [[T.lapse[0], T.lapse[1]]]);
};
