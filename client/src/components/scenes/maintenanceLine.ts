// Maintenance story, executive style: the same beats as the pixel scene, as vector line art.
// Night road: an antenna stops responding -> the fleet dashboard: the star creates the work
// order and notifies the technician -> time-lapse -> morning yard: the technician fixes it.
import type { PixelScene } from '../pixel/PixelCanvas';
import {
  COL, LW, LH, begin, box, caption, check, circle, clamp, clickRing, clockChip, ease, fade, line, mountains, panel,
  person, phone, pill, road, seg, sky, stamp, stars, text, tower, truck, antennaOf, wrench, brandStar, type LineState,
} from './lineKit';

export const MAINT_LINE_LOOP = 16;

const T = {
  road: [0, 3.6] as [number, number], fail: 1.5,
  dash: [3.6, 8.3] as [number, number], panelIn: [3.7, 4.3] as [number, number], star: [4.5, 5.1] as [number, number], click: 5.3,
  order: [5.6, 6.6] as [number, number], phone: [6.8, 7.4] as [number, number],
  lapse: [8.3, 9.1] as [number, number],
  walk: [9.3, 10.7] as [number, number], repair: [10.7, 12.0] as [number, number], fixed: 12.0, thumbs: [12.3, 13.3] as [number, number],
  stamp: [13.5, 15.4] as [number, number],
};

const CAPTIONS = {
  es: ['02:40 · Una antena deja de responder en ruta', '02:41 · La orden de trabajo ya está creada', '07:30 · El técnico llega con todo listo', 'Resuelto antes de que alguien lo reporte'],
  en: ['02:40 · An antenna stops responding on the road', '02:41 · The work order already exists', '07:30 · The technician arrives with everything ready', 'Fixed before anyone reports it'],
};

const GROUND = 218;

function ground(color: string) {
  box(0, 170, LW, LH - 170, 0, { fill: color });
  line(0, 170, LW, 170, COL.dim, 1.2);
}

// ---------------------------------------------------------------- 1. night road
function nightRoad(t: number) {
  sky(0);
  stars(t);
  mountains(170, '#131D33');
  tower(400, 164, 36, 1, t);
  ground('#0B1120');
  road(192);
  const x = 20 + t * 70;
  const failed = t >= T.fail;
  const blink = Math.floor(t * 4) % 2 === 0;
  truck(x, GROUND, { led: failed ? (blink ? COL.coral : '#7A2B3A') : COL.mint, t, moving: true, lights: true, signal: failed ? 0 : 1 });
  // the failure, called out on the antenna
  const k = seg(t, T.fail + 0.15, T.fail + 0.4) * (1 - seg(t, 3.2, 3.5));
  if (k > 0) {
    const [ax, ay] = antennaOf(x, GROUND);
    const r = 9 + ((t * 20) % 10);
    circle(ax, ay, r, { stroke: COL.coral, w: 1.4, a: k * (1 - (r - 9) / 10) });
    box(ax - 8, ay - 32, 16, 16, 8, { fill: COL.coral, fa: 0.2, stroke: COL.coral, w: 1.4, a: k });
    text('!', ax, ay - 23.5, { size: 11, weight: 700, color: COL.coral, align: 'center', a: k });
    line(ax, ay - 16, ax, ay - 8, COL.coral, 1.2, k);
  }
}

// ---------------------------------------------------------------- 2. the fleet dashboard
function truckGlyph(x: number, y: number, color: string) {
  box(x, y - 5, 12, 8, 1.5, { stroke: color, w: 1.2 });
  box(x + 12, y - 3, 5, 6, 1.5, { stroke: color, w: 1.2 });
  circle(x + 3, y + 4, 1.6, { fill: color });
  circle(x + 14, y + 4, 1.6, { fill: color });
}

function dashboard(t: number) {
  box(0, 0, LW, LH, 0, { fill: COL.bg });
  for (let x = 12; x < LW; x += 24) for (let y = 12; y < LH; y += 24) circle(x, y, 0.7, { fill: COL.faint });
  const pk = ease(seg(t, T.panelIn[0], T.panelIn[1]));
  const px = 36 + (1 - pk) * 24, py = 34, pw = 240, ph = 190;
  panel(px, py, pw, ph, pk);
  clockChip(px + pw - 58, py + 20, t < T.click ? '02:40' : t < T.lapse[0] + 0.4 ? '02:41' : '07:30', pk);
  line(px + 12, py + 29, px + 70, py + 29, COL.line, 2, pk);
  const ordered = t >= T.order[1];
  const rows = 4;
  for (let i = 0; i < rows; i++) {
    const ry = py + 58 + i * 32;
    const ok = i !== 1;
    const a = pk * clamp((t - T.panelIn[0] - 0.15 * i) * 3);
    if (a <= 0) continue;
    line(px + 10, ry + 16, px + pw - 10, ry + 16, COL.faint, 1, a);
    truckGlyph(px + 14, ry, ok ? COL.soft : COL.coral);
    line(px + 40, ry - 3, px + 40 + 70 - i * 8, ry - 3, COL.line, 1.6, a);
    line(px + 40, ry + 4, px + 40 + 40, ry + 4, COL.dim, 1.4, a);
    if (ok) pill(px + pw - 40, ry - 5, true, a);
    else if (!ordered) pill(px + pw - 40, ry - 5, false, a * (Math.floor(t * 3) % 2 ? 1 : 0.45));
    else {
      box(px + pw - 40, ry - 5, 26, 10, 5, { fill: COL.gold, fa: 0.2, stroke: COL.gold, w: 1.1 });
      wrench(px + pw - 27, ry, 0.8, COL.gold);
    }
  }
  // the star arrives and clicks the alert
  const alertX = px + pw - 27, alertY = py + 58 + 32;
  const sk = ease(seg(t, T.star[0], T.star[1]));
  if (t >= T.star[0]) {
    const sx = 40 + (alertX + 34 - 40) * sk, sy = 24 + (alertY - 4 - 24) * sk - Math.sin(sk * Math.PI) * 30;
    brandStar(sx, sy + (sk >= 1 ? Math.sin(t * 3) * 1.5 : 0), 9, t);
  }
  clickRing(alertX, alertY, seg(t, T.click, T.click + 0.6));
  // the work order builds itself
  const ok2 = ease(seg(t, T.order[0], T.order[0] + 0.35));
  if (ok2 > 0) {
    const cx = 290, cy = 58, cw = 104, ch = 116;
    box(cx + (1 - ok2) * -20, cy, cw, ch, 8, { fill: COL.panel, stroke: COL.gold, w: 1.4, a: ok2 });
    wrench(cx + 16, cy + 16, 1, COL.gold);
    line(cx + 30, cy + 13, cx + 80, cy + 13, COL.line, 1.8, ok2);
    line(cx + 30, cy + 20, cx + 64, cy + 20, COL.dim, 1.4, ok2);
    for (let i = 0; i < 3; i++) {
      const k = seg(t, T.order[0] + 0.35 + i * 0.2, T.order[0] + 0.55 + i * 0.2);
      box(cx + 12, cy + 38 + i * 18, 9, 9, 2, { stroke: COL.soft, w: 1.2, a: ok2 });
      check(cx + 13.5, cy + 42.5 + i * 18, 0.7, COL.mint, k, 1.6);
      line(cx + 28, cy + 42.5 + i * 18, cx + 28 + 50 - i * 8, cy + 42.5 + i * 18, COL.soft, 1.4, ok2);
    }
    truckGlyph(cx + 12, cy + 100, COL.soft);
    circle(cx + 50, cy + 99, 3.2, { stroke: COL.coral, w: 1.3, a: ok2 });
    line(cx + 50, cy + 102, cx + 50, cy + 106, COL.coral, 1.3, ok2);
  }
  // and reaches the technician's phone
  if (t >= T.phone[0] - 0.2) {
    phone(412, 70, seg(t, T.phone[0], T.phone[1]), (x, y) => wrench(x, y, 0.8, COL.gold), t >= T.phone[1] + 0.3);
  }
}

// ---------------------------------------------------------------- 3. the yard in the morning
function yard(t: number) {
  sky(0.85);
  circle(392, 168, 22, { fill: COL.gold, fa: 0.16 });
  circle(392, 168, 12, { fill: COL.gold, fa: 0.85 });
  mountains(170, '#2A3552');
  tower(80, 164, 36, 1, t);
  ground('#121B2E');
  for (let i = 0; i < 40; i++) circle((i * 71.7) % LW, 180 + ((i * 37) % 80), 0.8, { fill: COL.dim });
  const tx = 110;
  const fixed = t >= T.fixed;
  const blink = Math.floor(t * 4) % 2 === 0;
  truck(tx, GROUND, { led: fixed ? COL.mint : blink ? COL.coral : '#7A2B3A', t, signal: fixed ? 1 : 0 });
  brandStar(tx + 30, GROUND - 56 + Math.sin(t * 3) * 1.2, 6, t);
  const [ax, ay] = antennaOf(tx, GROUND);
  // the technician walks in, fixes it and gives the thumbs up
  const wk = ease(seg(t, T.walk[0], T.walk[1]));
  const px = 470 + (206 - 470) * wk;
  let pose: 'walk' | 'reach' | 'thumbs' | 'stand' = 'walk';
  if (t >= T.walk[1]) pose = t < T.repair[1] ? 'reach' : t >= T.thumbs[0] && t < T.thumbs[1] ? 'thumbs' : 'stand';
  const hand = person(px, GROUND + 2, { t, pose, facing: -1, helmet: true, vest: true, to: [ax + 6, ay + 4] });
  if (pose === 'reach') wrench(hand[0] + 2, hand[1] + 2, 1, COL.gold, Math.sin(t * 10) * 0.5);
  // bag by the truck
  box(226, GROUND - 10, 14, 10, 2, { fill: COL.panel, stroke: COL.soft, w: 1.2, a: seg(t, T.walk[1], T.walk[1] + 0.2) });
  if (fixed && t < T.stamp[1]) {
    const k = ease(seg(t, T.fixed, T.fixed + 0.3));
    circle(ax, ay - 20, 9 * k, { fill: COL.mint, fa: 0.2, stroke: COL.mint, w: 1.4 });
    check(ax - 4, ay - 20, 0.8, COL.mint, seg(t, T.fixed + 0.15, T.fixed + 0.5), 1.8);
  }
}

export const maintenanceLineScene: PixelScene<LineState | undefined> = (g, time, state) => {
  const t = time % MAINT_LINE_LOOP;
  const lang = state?.lang ?? 'es';
  begin(g);
  if (t < T.dash[0]) nightRoad(t);
  else if (t < T.lapse[0] + (T.lapse[1] - T.lapse[0]) / 2) dashboard(t);
  else yard(t);
  const cap = CAPTIONS[lang];
  caption(cap[0], seg(t, 0.3, 0.7) * (1 - seg(t, 3.2, 3.5)));
  caption(cap[1], seg(t, 4.2, 4.6) * (1 - seg(t, 8.0, 8.3)));
  caption(cap[2], seg(t, 9.4, 9.8) * (1 - seg(t, 13.2, 13.5)));
  caption(cap[3], seg(t, 13.6, 14.0) * (1 - seg(t, 15.4, 15.8)));
  stamp('24/7', seg(t, T.stamp[0], T.stamp[0] + 0.45), seg(t, T.stamp[1] - 0.35, T.stamp[1]), COL.gold, (x, y) => wrench(x, y, 1.1, COL.gold));
  fade(Math.max(1 - seg(t, 0, 0.35), Math.sin(seg(t, 3.4, 3.8) * Math.PI), Math.sin(seg(t, T.lapse[0], T.lapse[1]) * Math.PI), seg(t, 15.6, 16)));
};
