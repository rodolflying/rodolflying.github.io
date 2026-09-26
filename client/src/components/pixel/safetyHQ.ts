// Safety story: "the alert that no longer gets lost".
// Control room at night: fatigue alerts pop up and vanish while the operator is on
// another call -> the star makes them persistent (timer + sound) -> the driver gets
// the message and pulls over for a break (picture-in-picture) -> the log fills itself
// -> morning: the supervisor sees 100% of alerts handled.
import type { PixelScene } from './PixelCanvas';
import { C, type RGB, type Rect, type Light, clamp, ease, easeOutBack, seg, setCtx, rect, dot, orect, number, lightingPass, world, ring } from './engine';
import { drawSeated, drawStanding, drawChair, type Look } from './rig';
import { cityView, windowFrame, windowMullions, desk, screenBase, scanlines, starBeat, drawStarBeat, clickBeat, fades, checkMark, mug } from './sets';

const WORLD_W = 320;
const WORLD_H = 180;
export const SAFETY_W = 256;
export const SAFETY_H = 144;
export const SAFETY_LOOP = 15;

const T = {
  alerts: [[1.0, 2.2], [2.6, 3.7]] as Array<[number, number]>,
  fly: [4.1, 4.9] as [number, number], click: [5.1, 5.45] as [number, number], ack: 6.7,
  inset: [5.7, 8.2] as [number, number], pull: 7.1,
  lapse: [8.3, 9.1] as [number, number], supIn: [9.3, 10.4] as [number, number], thumbs: [11.0, 12.0] as [number, number], leave: [12.0, 13.6] as [number, number],
};

const OPERATOR: Look = { skin: 'dark', hair: 'curly', outfit: 'operator', headwear: 'headset' };
const SUPERVISOR: Look = { skin: 'light', hair: 'short', outfit: 'blazer', glasses: true };
const DRIVER: Look = { skin: 'medium', hair: 'short', outfit: 'vest', pants: ['#1E2638', '#2E3A56'] };

const WIN: Rect = { x: 36, y: 22, w: 52, h: 32 };
const S_MAP: Rect = { x: 103, y: 33, w: 44, h: 24 };
const S_ALERT: Rect = { x: 159, y: 33, w: 44, h: 24 };
const S_LOG: Rect = { x: 215, y: 33, w: 44, h: 24 };

/** Time of day: 0 night, rising to 2 (morning) during the time-lapse. */
const tod = (t: number) => (t < T.lapse[0] ? 0 : t < T.lapse[1] ? seg(t, T.lapse[0], T.lapse[1]) * 1.4 : 1.4);

function camera(t: number): [number, number] {
  let x = 30, y = 10;
  const push = ease(seg(t, T.click[0] - 0.4, T.click[0] + 0.1)) * (1 - ease(seg(t, T.inset[0], T.inset[0] + 0.5)));
  x += push * 22; y += push * 4;
  x += ease(seg(t, T.supIn[0], T.supIn[1])) * 30 * (1 - ease(seg(t, T.leave[0] + 0.2, T.leave[1])));
  return [Math.round(clamp(x, 0, WORLD_W - SAFETY_W)), Math.round(clamp(y, 0, WORLD_H - SAFETY_H))];
}

function alertVisible(t: number) {
  // before the star: alerts appear and vanish after ~1s; after the click: persistent until ack
  for (const [a, b] of T.alerts) if (t >= a && t < b) return { on: true, fading: seg(t, b - 0.35, b) };
  if (t >= T.click[0] + 0.1 && t < T.ack) return { on: true, fading: 0 };
  return { on: false, fading: 0 };
}

function drawScreens(t: number) {
  const morning = t >= T.lapse[1];
  // map with trucks on a road; the flagged one blinks while alerting, then parks
  screenBase(S_MAP, '#08141C', '#123A48');
  for (let x = 0; x < S_MAP.w - 4; x++) dot(S_MAP.x + 2 + x, S_MAP.y + 13 + Math.round(Math.sin(x * 0.22) * 4), '#1C3A48');
  const a = alertVisible(t);
  for (let i = 0; i < 3; i++) {
    let k = (t * 0.04 + i * 0.33) % 1;
    const flagged = i === 1;
    if (flagged && t >= T.pull) k = 0.58;
    const x = S_MAP.x + 2 + k * (S_MAP.w - 4);
    const y = S_MAP.y + 13 + Math.round(Math.sin((x - S_MAP.x - 2) * 0.22) * 4);
    const c = flagged && a.on ? (Math.floor(t * 5) % 2 ? C.coral2 : C.coral0) : C.mint3;
    rect(x - 1, y - 1, 3, 3, c);
  }
  if (t >= T.pull) { const px = S_MAP.x + 2 + 0.58 * (S_MAP.w - 4); orect(px - 2, S_MAP.y + 4, 5, 5, '#2A55C8'); rect(px - 1, S_MAP.y + 5, 2, 3, C.paper3); dot(px, S_MAP.y + 6, '#2A55C8'); }
  scanlines(S_MAP);

  // alerts screen
  screenBase(S_ALERT, '#140A10', '#3A1420');
  if (a.on) {
    const persistent = t >= T.click[0] + 0.1;
    const alpha = 1 - a.fading;
    const col = persistent && t >= T.ack - 0.01 ? C.mint2 : C.coral1;
    const k = easeOutBack(clamp((t - (persistent ? T.click[0] + 0.1 : 0)) * 6));
    const cw = Math.round(34 * (persistent ? k : 1)), ch = 16;
    if (alpha > 0.05) {
      rect(S_ALERT.x + 3, S_ALERT.y + 5, cw, ch, alpha > 0.5 ? col : C.coral0);
      // driver face icon + "!"
      rect(S_ALERT.x + 6, S_ALERT.y + 8, 7, 7, C.paper2); rect(S_ALERT.x + 7, S_ALERT.y + 9, 5, 2, C.hair0); dot(S_ALERT.x + 10, S_ALERT.y + 12, C.ink);
      rect(S_ALERT.x + 18, S_ALERT.y + 8, 2, 6, C.paper3); rect(S_ALERT.x + 18, S_ALERT.y + 15, 2, 2, C.paper3);
      if (persistent) {
        // countdown bar + speaker waves: it stays until someone handles it
        const left = 1 - seg(t, T.click[0] + 0.1, T.ack);
        rect(S_ALERT.x + 24, S_ALERT.y + 17, Math.round(12 * left), 2, C.gold3);
        rect(S_ALERT.x + 26, S_ALERT.y + 8, 3, 4, C.paper3);
        for (let r = 0; r < 2; r++) { const w = 2 + r * 2 + ((t * 8) % 2); dot(S_ALERT.x + 30 + w, S_ALERT.y + 9, C.paper3); dot(S_ALERT.x + 30 + w, S_ALERT.y + 11, C.paper3); }
      }
    }
  } else if (t >= T.ack) {
    rect(S_ALERT.x + 3, S_ALERT.y + 5, 34, 16, C.mint1);
    checkMark(S_ALERT.x + 16, S_ALERT.y + 10);
  }
  scanlines(S_ALERT);

  // log / weekly summary
  screenBase(S_LOG, '#0A1216', '#16303A');
  if (!morning) {
    const rows = t < T.click[0] ? 0 : Math.min(4, Math.floor(seg(t, T.click[0] + 0.3, 8.0) * 5));
    for (let i = 0; i < rows; i++) { number(`0${2 + Math.floor(i / 2)}:${10 + i * 7}`, S_LOG.x + 2, S_LOG.y + 5 + i * 5, C.mint4); rect(S_LOG.x + 24, S_LOG.y + 7 + i * 5, 14, 1, C.mint1); }
  } else {
    const k = seg(t, T.lapse[1], T.lapse[1] + 1.5);
    number(`${Math.round(100 * k)}%`, S_LOG.x + 3, S_LOG.y + 6, C.mint3);
    for (let i = 0; i < 5; i++) { const h = Math.round((6 + i * 1.5) * k); rect(S_LOG.x + 4 + i * 7, S_LOG.y + S_LOG.h - 3 - h, 5, h, C.mint2); }
    if (k >= 1) checkMark(S_LOG.x + 30, S_LOG.y + 5, C.mint4);
  }
  scanlines(S_LOG);
}

/** Picture-in-picture: the driver's cab at night; the tablet alerts, the truck pulls over for coffee. */
function drawCabInset(g: CanvasRenderingContext2D, t: number) {
  const IW = 96, IH = 54;
  const { canvas, g: w } = world('safety-cab', IW, IH);
  setCtx(w);
  const parked = t >= T.pull;
  // windshield view
  rect(0, 0, IW, 30, '#0B1535');
  for (let i = 0; i < 8; i++) dot((i * 13 + 5) % IW, 3 + (i * 7) % 12, '#9FB3E0');
  rect(0, 22, IW, 8, '#101828');
  for (let x = -((parked ? 0 : t * 60) % 14); x < IW; x += 14) rect(x, 26, 6, 1, C.gold1);
  if (parked) { orect(58, 8, 18, 14, '#3A4660'); rect(61, 11, 12, 7, C.gold3); orect(78, 6, 8, 8, '#2A55C8'); rect(80, 8, 2, 4, C.paper3); rect(80, 8, 4, 2, C.paper3); rect(83, 9, 1, 2, C.paper3); }
  // cab interior
  rect(0, 30, IW, 24, '#171B26');
  rect(0, 30, IW, 2, '#232838');
  // driver (upper body visible), then the steering wheel in front
  const coffee = parked && t >= T.pull + 0.4;
  const alerted = t >= T.click[0] + 0.2 && !parked;
  const mood = !alerted && !parked ? ((t % 2.2) < 0.3 ? 'blink' : 'tired') : alerted ? 'surprised' : 'happy';
  drawSeated(DRIVER, coffee ? 'coffee' : 'watch', mood, 16, 14, t, { sip: coffee ? 0.5 + 0.5 * Math.sin(t * 2) : 0 });
  rect(38, 36, 3, 14, C.metal1); for (let a = 0; a < 20; a++) dot(44 + Math.cos(a / 3) * 6, 36 + Math.sin(a / 3) * 7, C.metal2);
  // tablet on the dashboard: coral alert, then mint "rest stop" message
  orect(66, 34, 16, 11, C.ink);
  rect(67, 35, 14, 9, alerted ? (Math.floor(t * 5) % 2 ? C.coral1 : C.coral0) : parked ? C.mint1 : '#0B2033');
  if (alerted) { rect(73, 36, 2, 4, C.paper3); rect(73, 41, 2, 2, C.paper3); }
  if (parked) checkMark(70, 37, C.paper3);
  // light from the tablet
  lightingPass({ view: { x: 0, y: 0, w: IW, h: IH }, ambient: [0.35, 0.38, 0.55], lights: [{ x: 72, y: 40, r: 40, c: alerted ? [1, 0.4, 0.45] : [0.35, 1, 0.8], i: 0.9 }], emissive: [{ x: 0, y: 0, w: IW, h: 30 }, { x: 67, y: 35, w: 14, h: 9 }] });
  // composite into the view with a slide-in
  const inK = ease(seg(t, T.inset[0], T.inset[0] + 0.35)) * (1 - ease(seg(t, T.inset[1] - 0.3, T.inset[1])));
  if (inK <= 0) return;
  const x = Math.round(SAFETY_W - (IW + 8) * inK), y = SAFETY_H - IH - 8;
  g.fillStyle = C.mint3; g.fillRect(x - 2, y - 2, IW + 4, IH + 4);
  g.fillStyle = C.ink; g.fillRect(x - 1, y - 1, IW + 2, IH + 2);
  g.drawImage(canvas, 0, 0, IW, IH, x, y, IW, IH);
}

export const safetyHQScene: PixelScene = (g, time) => {
  const t = time % SAFETY_LOOP;
  const { canvas, g: w } = world('safety', WORLD_W, WORLD_H);
  setCtx(w);
  const [cx, cy] = camera(t);
  const view: Rect = { x: cx, y: cy, w: SAFETY_W, h: SAFETY_H };
  const k = tod(t);
  const morning = t >= T.lapse[1];

  // --- albedo
  rect(0, 0, WORLD_W, 128, '#16243A');
  for (let x = 0; x < WORLD_W; x += 6) rect(x, 0, 1, 124, '#132038');
  rect(0, 124, WORLD_W, 4, C.base);
  rect(0, 128, WORLD_W, 52, '#2E3440');
  for (let y = 128; y < 180; y += 9) rect(0, y, WORLD_W, 1, '#262B36');
  rect(0, 128, WORLD_W, 1, '#4A5162');
  windowFrame(WIN);
  // video wall frames
  for (const s of [S_MAP, S_ALERT, S_LOG]) orect(s.x - 3, s.y - 3, s.w + 6, s.h + 6, C.metal0);
  rect(98, 60, 166, 2, C.metal1);
  desk(92, 100, 176);
  rect(150, 97, 26, 3, C.metal1); for (let i = 0; i < 6; i++) rect(152 + i * 4, 97, 3, 1, C.metal3);
  mug(146, 93, t, morning);
  // operator: on another call, then attentive, then leaving in the morning
  const leaving = t >= T.leave[0];
  if (!leaving) {
    drawChair(100, 110, 128);
    const pose = t < T.click[0] + 0.3 ? 'phone' : 'watch';
    const mood = t < T.click[0] ? 'stressed' : t < T.click[0] + 0.6 ? 'surprised' : t < T.ack ? 'focus' : morning && t < T.lapse[1] + 0.6 ? 'tired' : 'happy';
    drawSeated(OPERATOR, pose, mood, 108, 76, t);
  } else {
    drawChair(100, 110, 128);
    const lk = ease(seg(t, T.leave[0] + 0.3, T.leave[1]));
    drawStanding({ ...OPERATOR, bag: true }, t < T.leave[0] + 0.3 ? 'wave' : 'walk', 'happy', 106 - lk * 120, 66, t, true);
  }
  // supervisor walks in with a tablet and approves
  if (t >= T.supIn[0]) {
    const sk = ease(seg(t, T.supIn[0], T.supIn[1]));
    const pose = t < T.supIn[1] ? 'walk' : t >= T.thumbs[0] && t < T.thumbs[1] ? 'thumbsup' : 'carry';
    drawStanding(SUPERVISOR, pose, t >= T.thumbs[0] ? 'happy' : 'focus', 330 - sk * 100, 66, t, true);
  }

  // --- lights
  const lights: Light[] = [];
  const alerting = alertVisible(t).on && t < T.ack;
  lights.push({ x: S_MAP.x + 22, y: S_MAP.y + 12, r: 80, c: [0.35, 0.6, 1.0], i: 0.9 });
  lights.push({ x: S_ALERT.x + 22, y: S_ALERT.y + 12, r: 70, c: alerting ? [1, 0.35, 0.45] : [0.35, 1, 0.8], i: alerting ? 1.2 : 0.7 });
  lights.push({ x: S_LOG.x + 22, y: S_LOG.y + 12, r: 60, c: [0.35, 0.95, 0.8], i: 0.6 });
  const sb = starBeat(t, T.fly, [40, 20], [S_ALERT.x + 22, S_ALERT.y - 3], T.click[1]);
  if (sb.visible) lights.push({ x: sb.x, y: sb.bottom - 7, r: 36, c: [0.35, 1, 0.8], i: 0.7 });
  const d = clamp(k / 1.4);
  const ambient: RGB = [0.3 + d * 0.52, 0.33 + d * 0.42, 0.5 + d * 0.18];
  lightingPass({ view, ambient, lights, emissive: [WIN, S_MAP, S_ALERT, S_LOG] });

  // --- emissive
  cityView(WIN, t, k);
  windowMullions(WIN);
  drawScreens(t);
  drawStarBeat(sb);
  clickBeat(t, T.click, [sb.x + 6, sb.bottom - 10], [S_ALERT.x + 20, S_ALERT.y + 10]);
  if (alerting) { const r = ((t * 30) % 20); ring(S_ALERT.x + 22, S_ALERT.y + 12, 26 + r, `rgba(255,122,133,${0.5 * (1 - r / 20)})`); }
  // "!" over the operator when the alert finally sticks
  if (t >= T.click[0] + 0.1 && t < T.click[0] + 0.8) { rect(122, 68, 2, 6, C.gold3); rect(122, 76, 2, 2, C.gold3); }

  // --- camera + inset + transitions
  g.imageSmoothingEnabled = false;
  g.drawImage(canvas, cx, cy, SAFETY_W, SAFETY_H, 0, 0, SAFETY_W, SAFETY_H);
  drawCabInset(g, t);
  setCtx(w);
  fades(g, t, SAFETY_LOOP, SAFETY_W, SAFETY_H, [[T.lapse[0], T.lapse[1]]]);
};
