// Operations story: "one number for everyone".
// A planner highlights printed timetables with a calculator while two managers argue,
// each with a different chart -> the star turns the wall screen into a live route
// (plan vs actual per segment, delays in red) -> one dashboard, one number (5.039 trips)
// -> both charts sync, thumbs up, meeting over.
import type { PixelScene } from './PixelCanvas';
import { C, type RGB, type Rect, type Light, clamp, ease, easeOutBack, seg, rnd, setCtx, rect, dot, orect, bigNumber, thousands, lightingPass, world } from './engine';
import { drawSeated, drawStanding, drawChair, type Look, type Mood, type StandPose } from './rig';
import { cityView, windowFrame, windowMullions, officeRoom, desk, screenBase, scanlines, starBeat, drawStarBeat, clickBeat, fades, checkMark, plant } from './sets';

const WORLD_W = 320;
const WORLD_H = 180;
export const OPS_W = 256;
export const OPS_H = 144;
export const OPS_LOOP = 15;
const TRIPS = 5039;

const T = {
  fly: [3.6, 4.4] as [number, number], click: [4.6, 4.95] as [number, number],
  route: [5.1, 6.3] as [number, number], trucks: 5.5, bars: [6.2, 7.8] as [number, number],
  dash: [8.1, 9.3] as [number, number], sync: [9.0, 9.8] as [number, number],
  thumbs: [10.0, 11.0] as [number, number], leave: [11.3, 13.0] as [number, number], starOut: 13.3,
};

const PLANNER: Look = { skin: 'medium', hair: 'ponytail', hairColor: 'brown', outfit: 'office', shirt: ['#4A2A6E', '#6A3EA0', '#9468D0', '#C6A8F0'] };
const BOSS_A: Look = { skin: 'light', hair: 'short', hairColor: 'black', outfit: 'blazer', glasses: true };
const BOSS_B: Look = { skin: 'dark', hair: 'bun', outfit: 'blazer', shirt: ['#4A1E26', '#6E2C36', '#9A4250', '#C46A76'] };

const WIN: Rect = { x: 22, y: 24, w: 40, h: 30 };
const BOARD: Rect = { x: 84, y: 26, w: 52, h: 38 };
const TV: Rect = { x: 150, y: 22, w: 100, h: 44 };
const A_X = 176, B_X = 214, BOSS_Y = 74;

// route geometry on the wall screen
const STATIONS = [0, 1, 2, 3, 4].map((i) => ({ x: TV.x + 9 + i * 21, y: TV.y + 15 + [0, -3, 2, -2, 1][i] }));
const PLAN = [9, 7, 10, 8];
const ACTUAL = [8, 11, 9, 12];

function camera(t: number): [number, number] {
  let x = 16;
  const push = ease(seg(t, T.click[0] - 0.3, T.click[0] + 0.4)) * (1 - ease(seg(t, T.sync[0] - 0.2, T.sync[1])));
  x += push * 40;
  x += ease(seg(t, T.leave[0], T.leave[1])) * 36 * (1 - ease(seg(t, T.leave[1] + 0.4, T.leave[1] + 1.4)));
  return [Math.round(clamp(x, 0, WORLD_W - OPS_W)), 4];
}

function routePoint(p: number) {
  const f = clamp(p) * (STATIONS.length - 1);
  const i = Math.min(STATIONS.length - 2, Math.floor(f));
  const k = f - i;
  return { x: STATIONS[i].x + (STATIONS[i + 1].x - STATIONS[i].x) * k, y: STATIONS[i].y + (STATIONS[i + 1].y - STATIONS[i].y) * k };
}

function drawTV(t: number) {
  const s = TV;
  if (t < T.click[0] + 0.12) {
    // the "before": a dense spreadsheet with broken cells
    screenBase(s, '#0E1420', '#232C3E');
    for (let r = 0; r < 7; r++) for (let c = 0; c < 8; c++) {
      const bad = rnd(r * 9 + c) > 0.84;
      rect(s.x + 2 + c * 12, s.y + 5 + r * 5, 11, 4, bad ? (Math.floor(t * 3 + c) % 2 ? C.coral1 : C.coral0) : '#1A2334');
      if (!bad && rnd(r * 5 + c * 3) > 0.4) rect(s.x + 3 + c * 12, s.y + 6 + r * 5, 2 + Math.floor(rnd(r + c * 7) * 7), 1, '#3A4660');
    }
  } else if (t < T.dash[0]) {
    screenBase(s, '#08141C', '#123A48');
    // the route draws itself, stations pop in
    const rk = ease(seg(t, T.route[0], T.route[1]));
    for (let i = 0; i <= 60; i++) {
      const p = i / 60;
      if (p > rk) break;
      const q = routePoint(p);
      dot(q.x, q.y, C.mint2);
    }
    STATIONS.forEach((st, i) => {
      const k = easeOutBack(seg(rk, i / 4 - 0.05, i / 4 + 0.1));
      if (k > 0.05) orect(st.x - 1, st.y - 1, 3, 3, i === 0 || i === 4 ? C.gold3 : C.paper2);
    });
    // trucks moving along it; the second one runs late
    if (t >= T.trucks) for (let i = 0; i < 3; i++) {
      const late = i === 1;
      const p = ((t - T.trucks) * (late ? 0.07 : 0.12) + i * 0.3) % 1;
      const q = routePoint(p);
      rect(q.x - 2, q.y - 4, 4, 2, late ? C.coral2 : C.gold3);
      rect(q.x - 2, q.y - 2, 5, 1, C.ink);
    }
    // plan vs actual per segment (plan: outline, actual: mint, or red when late)
    const base = s.y + s.h - 3;
    for (let i = 0; i < 4; i++) {
      const cx = Math.round((STATIONS[i].x + STATIONS[i + 1].x) / 2);
      const k = ease(seg(t, T.bars[0] + i * 0.3, T.bars[0] + i * 0.3 + 0.5));
      if (k <= 0) continue;
      const hp = PLAN[i], ha = Math.round(ACTUAL[i] * k);
      rect(cx - 5, base - hp, 4, 1, C.paper0); rect(cx - 5, base - hp, 1, hp, C.paper0); rect(cx - 2, base - hp, 1, hp, C.paper0);
      const late = ACTUAL[i] > PLAN[i];
      rect(cx, base - ha, 4, ha, late && k >= 1 ? C.coral2 : C.mint3);
      if (late && k >= 1 && Math.floor(t * 4) % 2) { rect(cx + 1, base - ha - 7, 2, 3, C.coral3); dot(cx + 1, base - ha - 3, C.coral3); dot(cx + 2, base - ha - 3, C.coral3); }
    }
    rect(s.x + 3, base + 1, s.w - 6, 1, '#1C3A48');
  } else {
    // one dashboard: the number everyone quotes
    screenBase(s, '#0A1216', '#16303A');
    const k = ease(seg(t, T.dash[0] + 0.15, T.dash[1]));
    bigNumber(thousands(TRIPS * k), s.x + 6, s.y + 9, C.mint3, 3);
    // tiny truck icon + label strip
    rect(s.x + 6, s.y + 30, 7, 3, C.gold3); rect(s.x + 13, s.y + 31, 3, 2, C.gold2); rect(s.x + 7, s.y + 33, 2, 1, C.ink); rect(s.x + 12, s.y + 33, 2, 1, C.ink);
    rect(s.x + 19, s.y + 31, 26, 1, C.mint1); rect(s.x + 19, s.y + 33, 18, 1, C.mint0);
    // the trend, drawn left to right
    const cx0 = s.x + 62, cw = 32, ch = 20, cy0 = s.y + 8;
    rect(cx0, cy0 + ch, cw, 1, '#1C3A48');
    for (let i = 0; i <= cw; i++) {
      if (i / cw > k) break;
      const v = 0.25 + 0.55 * (i / cw) + Math.sin(i * 0.6) * 0.08;
      dot(cx0 + i, cy0 + ch - Math.round(v * ch), C.mint4);
    }
    if (k >= 1) checkMark(s.x + s.w - 12, s.y + s.h - 9, C.mint4);
  }
  scanlines(s);
}

function drawBoard(t: number) {
  // corkboard with printed timetables; highlighter strokes pile up before the star arrives
  orect(BOARD.x, BOARD.y, BOARD.w, BOARD.h, C.wood2);
  rect(BOARD.x, BOARD.y, BOARD.w, 1, C.wood3);
  const strokes = Math.floor(seg(t, 0.3, T.click[0]) * 14);
  for (let i = 0; i < 4; i++) {
    const sx = BOARD.x + 3 + i * 12, sy = BOARD.y + 4 + (i % 2) * 2;
    rect(sx, sy, 10, 28, C.paper2);
    dot(sx + 4, sy - 1, i % 2 ? C.coral1 : C.blue2);
    for (let r = 0; r < 8; r++) rect(sx + 1, sy + 3 + r * 3, 3 + ((r + i) % 3) * 2, 1, C.paper0);
    for (let r = 0; r < 8; r++) if (i * 8 + r < strokes * 2.3 && rnd(i * 8 + r) > 0.35) rect(sx, sy + 2 + r * 3, 9, 2, 'rgba(255,226,90,0.75)');
    if (strokes > 8 && i === 2) { for (let a = 0; a < 16; a++) dot(sx + 5 + Math.cos(a / 2.5) * 5, sy + 14 + Math.sin(a / 2.5) * 3, C.coral1); }
  }
}

/** A printed chart held by a manager; `sync` in [0,1] flips it to the shared (mint) chart. */
function chartCard(x: number, y: number, variant: 'up' | 'down', sync: number) {
  const flipK = Math.abs(1 - sync * 2); // 1 -> 0 -> 1 while it turns over
  const w = Math.max(1, Math.round(11 * flipK));
  const ox = x + Math.round((11 - w) / 2);
  orect(ox, y, w, 12, C.paper2);
  if (w < 9) return;
  const synced = sync >= 0.5;
  const hs = synced ? [3, 5, 8] : variant === 'up' ? [2, 5, 8] : [8, 5, 3];
  const col = synced ? C.mint2 : variant === 'up' ? C.coral1 : C.gold1;
  hs.forEach((h, i) => rect(ox + 1 + i * 3, y + 11 - h, 2, h, col));
  if (synced) rect(ox + 1, y + 2, 9, 1, C.mint1);
}

/** Speech bubble with a mini chart (or a check once everyone agrees). */
function speech(x: number, y: number, kind: 'up' | 'down' | 'ok') {
  orect(x, y, 13, 9, C.paper3);
  dot(x + (kind === 'down' ? 10 : 2), y + 9, C.paper3); dot(x + (kind === 'down' ? 10 : 2), y + 10, C.ink);
  if (kind === 'ok') { checkMark(x + 3, y + 2, C.mint1); return; }
  const hs = kind === 'up' ? [2, 4, 6] : [6, 4, 2];
  hs.forEach((h, i) => rect(x + 2 + i * 3, y + 8 - h, 2, h, kind === 'up' ? C.coral1 : C.gold1));
  rect(x + 11, y + 1, 1, 4, C.ink); dot(x + 11, y + 6, C.ink);
}

function drawLamp(x: number) {
  rect(x, 0, 1, 8, C.metal1);
  rect(x - 6, 8, 13, 3, C.metal2); rect(x - 7, 10, 15, 1, C.metal1);
}

export const operationsHQScene: PixelScene = (g, time) => {
  const t = time % OPS_LOOP;
  const { canvas, g: w } = world('operations', WORLD_W, WORLD_H);
  setCtx(w);
  const [cx, cy] = camera(t);
  const view: Rect = { x: cx, y: cy, w: OPS_W, h: OPS_H };
  const argue = t < T.click[0];
  const syncK = seg(t, T.sync[0], T.sync[1]);

  // --- albedo
  officeRoom(WORLD_W, C.wall2, C.wall1, '#3A3F4E', '#2E3240');
  windowFrame(WIN);
  plant(30, 51, t);
  drawBoard(t);
  orect(TV.x - 3, TV.y - 3, TV.w + 6, TV.h + 6, C.metal0);
  rect(TV.x - 3, TV.y - 3, TV.w + 6, 1, C.metal2);
  drawLamp(110); drawLamp(274);
  desk(58, 100, 94);
  // calculator + paper pile
  orect(102, 96, 10, 4, C.metal1); rect(103, 97, 5, 1, C.mint1);
  for (let i = 0; i < 6; i++) rect(122 + (i % 2), 99 - i, 20, 1, i % 2 ? C.paper1 : C.paper2);

  // planner
  drawChair(60, 110, 128);
  {
    let pose: 'type' | 'watch' | 'coffee' = 'type';
    let mood: Mood = (t % 2.9) < 0.14 ? 'blink' : 'stressed';
    if (!argue) {
      pose = t < T.thumbs[0] ? 'watch' : 'coffee';
      mood = t < T.click[0] + 0.8 ? 'surprised' : t < T.dash[0] ? 'focus' : (t % 3.3) < 0.12 ? 'blink' : 'happy';
    }
    const sip = seg(t, 11.4, 11.7) * (1 - seg(t, 12.2, 12.5));
    drawSeated(PLANNER, pose, mood, 68, 76, t, { slump: argue && t > 2 ? 1 : 0, sip });
  }

  // the two managers
  const speaker = Math.floor(t / 0.9) % 2; // 0: A talks, 1: B talks
  const leaveK = ease(seg(t, T.leave[0], T.leave[1]));
  const boss = (look: Look, x0: number, isA: boolean) => {
    const flip = !isA && t < T.leave[0];
    let pose: StandPose = 'carry';
    let mood: Mood = 'neutral';
    if (argue) {
      const talking = (speaker === 0) === isA;
      pose = talking ? 'point' : 'carry';
      mood = talking ? 'stressed' : 'focus';
    } else if (t < T.sync[1]) {
      mood = t < T.click[0] + 0.7 ? 'surprised' : 'focus';
    } else if (t < T.leave[0]) {
      pose = isA && t >= T.thumbs[0] && t < T.thumbs[1] ? 'thumbsup' : 'carry';
      mood = 'happy';
    } else {
      pose = 'walk';
      mood = 'happy';
    }
    const x = x0 + leaveK * (isA ? 150 : 140);
    drawStanding(look, pose, mood, Math.round(x), BOSS_Y, t, flip);
    if (pose === 'carry') chartCard(flip ? x - 4 : x + 17, BOSS_Y + 14, isA ? 'up' : 'down', syncK);
  };
  boss(BOSS_A, A_X, true);
  boss(BOSS_B, B_X, false);

  // --- lights
  const sb = starBeat(t, T.fly, [30, 30], [TV.x + TV.w / 2, TV.y - 3], T.click[1], T.starOut);
  const tvC: RGB = t < T.click[0] ? [0.5, 0.55, 0.8] : [0.35, 1, 0.8];
  const lights: Light[] = [
    { x: 110, y: 12, r: 80, c: [1, 0.85, 0.6], i: 0.35 },
    { x: 274, y: 12, r: 80, c: [1, 0.85, 0.6], i: 0.35 },
    { x: TV.x + TV.w / 2, y: TV.y + TV.h / 2, r: 90, c: tvC, i: t < T.click[0] ? 0.45 : 0.8 },
  ];
  if (sb.visible) lights.push({ x: sb.x, y: sb.bottom - 7, r: 36, c: [0.35, 1, 0.8], i: 0.7 });
  lightingPass({
    view, ambient: [0.78, 0.76, 0.74], lights, emissive: [WIN, TV],
    // soft daylight shaft from the window onto the floor
    extra: (x, y) => (y > WIN.y + WIN.h && Math.abs(x - (y - WIN.y - WIN.h) * 0.8 - (WIN.x + WIN.w / 2)) < WIN.w / 2 ? [0.18, 0.15, 0.1] : null),
  });

  // --- emissive + overlays
  cityView(WIN, t, 2.2);
  windowMullions(WIN);
  drawTV(t);
  drawStarBeat(sb);
  clickBeat(t, T.click, [sb.x + 6, sb.bottom - 10], [TV.x + TV.w / 2 - 3, TV.y + 16]);
  if (argue && t > 0.5) {
    const bob = Math.round(Math.sin(t * 10));
    if (speaker === 0) speech(A_X + 12, BOSS_Y - 13 + bob, 'up');
    else speech(B_X - 1, BOSS_Y - 13 + bob, 'down');
  }
  if (t >= T.thumbs[0] && t < T.thumbs[1]) speech(A_X + 12, BOSS_Y - 13, 'ok');
  // sync sparks: from the screen to both charts
  if (syncK > 0 && syncK < 1) for (let i = 0; i < 5; i++) {
    const k = clamp(syncK * 1.4 - i * 0.08);
    const sx = TV.x + TV.w / 2, sy = TV.y + TV.h;
    for (const [tx, ty] of [[A_X + 22, BOSS_Y + 18], [B_X + 2, BOSS_Y + 18]]) dot(sx + (tx - sx) * k, sy + (ty - sy) * k - Math.sin(k * Math.PI) * 6, i % 2 ? C.mint4 : C.gold3);
  }
  // "!" over the planner when the screen comes alive
  if (t >= T.click[0] + 0.1 && t < T.click[0] + 0.8) { rect(80, 68, 2, 6, C.gold3); rect(80, 76, 2, 2, C.gold3); }

  // --- camera crop + transitions
  g.imageSmoothingEnabled = false;
  g.drawImage(canvas, cx, cy, OPS_W, OPS_H, 0, 0, OPS_W, OPS_H);
  fades(g, t, OPS_LOOP, OPS_W, OPS_H);
};
