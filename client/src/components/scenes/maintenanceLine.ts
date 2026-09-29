// Maintenance story, executive style, told as the service actually works:
// night road: a mining pickup's modem stops reporting -> the fleet panel: the star restarts it
// remotely and the work order records it, nobody travels -> morning at the base: if it needs a
// check, the work order is already waiting -> the dots connect.
import type { PixelScene } from '../pixel/PixelCanvas';
import {
  COL, W, LW, begin, box, check, circle, clamp, clickRing, clockChip, constellation, desert, ease, fade, line,
  mountains, panel, person, pickup, pit, restart, road, seg, sky, stars, status, text, tower, antennaOf, wrench,
  brandStar, type LineState, type SceneCaptionDef,
} from './lineKit';

export const MAINT_LINE_LOOP = 17;

const T = {
  fail: 1.5,
  dashIn: [3.4, 3.9] as [number, number], panelIn: [3.7, 4.3] as [number, number],
  star: [4.5, 5.1] as [number, number], click: 5.3, restart: [5.5, 7.0] as [number, number],
  order: [7.2, 8.2] as [number, number],
  lapse: [9.9, 10.7] as [number, number],
  walk: [11.0, 12.3] as [number, number], read: [12.3, 13.4] as [number, number], thumbs: [13.4, 14.2] as [number, number],
  dots: [14.3, 16.1] as [number, number],
};
/** Poster frame: the fleet panel after the remote restart, with the work order recorded. */
export const MAINT_LINE_STILL = 8.7;

export const MAINT_LINE_CAPTIONS: SceneCaptionDef[] = [
  { from: 0.3, to: 3.5, time: '02:40', es: 'Una camioneta deja de reportar en ruta', en: 'A pickup stops reporting on the road' },
  { from: 4.2, to: 7.1, time: '02:41', es: 'Se detecta la falla y se reinicia a distancia', en: 'The fault is detected and restarted remotely' },
  { from: 7.2, to: 10.0, time: '02:43', es: 'Vuelve a reportar. Nadie tuvo que viajar', en: 'Reporting again. Nobody had to travel' },
  { from: 11.1, to: 14.2, time: '07:30', es: 'Si hace falta revisarla, la OT ya está lista', en: 'If it needs a check, the work order is ready' },
  { from: 14.4, to: 16.7, es: 'Resuelto antes de que alguien lo reporte', en: 'Fixed before anyone reports it' },
];

const WORDS = {
  es: { fleet: 'Flota en ruta', unit: 'Camioneta', online: 'En línea', lost: 'Sin señal', busy: 'Reiniciando', wo: 'OT', auto: 'automática', steps: ['Falla detectada', 'Reinicio remoto', 'Verificado'], noVisit: 'Sin visita a terreno', base: 'BASE' },
  en: { fleet: 'Fleet on the road', unit: 'Pickup', online: 'Online', lost: 'No signal', busy: 'Restarting', wo: 'WO', auto: 'automatic', steps: ['Fault detected', 'Remote restart', 'Verified'], noVisit: 'No site visit', base: 'BASE' },
};

const GROUND = 218;

// ---------------------------------------------------------------- 1. night road in the desert
function nightRoad(t: number) {
  sky(0);
  stars(t);
  mountains(170, '#131D33');
  pit(210, 170, 150, 0.8);
  tower(430, 164, 36, 1, t);
  desert(170, 0);
  road(192);
  const x = 10 + t * 70;
  const failed = t >= T.fail;
  const blink = Math.floor(t * 4) % 2 === 0;
  pickup(x, GROUND, { led: failed ? (blink ? COL.coral : '#7A2B3A') : COL.mint, t, moving: true, lights: true, signal: failed ? 0 : 1 });
  // the failure, called out on the modem
  const k = seg(t, T.fail + 0.15, T.fail + 0.4);
  if (k > 0) {
    const [ax, ay] = antennaOf(x, GROUND);
    const r = 9 + ((t * 20) % 10);
    circle(ax, ay, r, { stroke: COL.coral, w: W.hair, a: k * (1 - (r - 9) / 10) });
    box(ax - 10, ay - 38, 20, 20, 10, { fill: COL.coral, fa: 0.2, stroke: COL.coral, w: W.base, a: k });
    text('!', ax, ay - 27.5, { size: 14, weight: 700, color: COL.coral, align: 'center', a: k });
    line(ax, ay - 18, ax, ay - 8, COL.coral, W.hair, k);
  }
}

// ---------------------------------------------------------------- 2. the fleet panel
function pickupGlyph(x: number, y: number, color: string, a = 1) {
  const p = { stroke: color, w: W.hair, a };
  box(x, y - 4, 8, 5, 1, p);
  box(x + 8, y - 7, 7, 8, 1.5, p);
  box(x + 15, y - 3, 4, 4, 1, p);
  circle(x + 4, y + 2.5, 1.8, { fill: color, a });
  circle(x + 15, y + 2.5, 1.8, { fill: color, a });
}

function dashboard(t: number, lang: 'es' | 'en') {
  const L = WORDS[lang];
  stars(t, 0.35);
  const pk = ease(seg(t, T.panelIn[0], T.panelIn[1]));
  const px = 28 + (1 - pk) * 20, py = 30, pw = 252, ph = 180;
  panel(px, py, pw, ph, pk);
  text(L.fleet, px + 12, py + 29, { size: 12, weight: 600, font: 'display', color: COL.white, a: pk });
  clockChip(px + pw - 70, py + 19, t < T.restart[1] ? '02:41' : '02:43', pk);
  const restarting = t >= T.restart[0] && t < T.restart[1];
  const back = t >= T.restart[1];
  for (let i = 0; i < 4; i++) {
    const ry = py + 60 + i * 34;
    const a = pk * clamp((t - T.panelIn[0] - 0.12 * i) * 3);
    if (a <= 0) continue;
    const hit = i === 1;
    line(px + 10, ry + 17, px + pw - 10, ry + 17, COL.faint, W.hair, a);
    if (hit && back) box(px + 6, ry - 13, pw - 12, 28, 6, { fill: COL.mint, fa: 0.06 * (1 - seg(t, T.restart[1] + 1.2, T.restart[1] + 2.2)) + 0.03, a });
    pickupGlyph(px + 14, ry, hit && !back ? COL.coral : COL.soft, a);
    text(`${L.unit} 0${i + 1}`, px + 42, ry - 3, { size: 10.5, weight: 500, color: COL.line, a });
    line(px + 42, ry + 7, px + 42 + 44 - i * 6, ry + 7, COL.dim, W.base, a);
    const sx = px + pw - 82;
    if (!hit || back) status(sx, ry, 'ok', L.online, a);
    else if (restarting) { status(sx, ry, 'busy', L.busy, a); }
    else status(sx, ry, 'alert', L.lost, a * (Math.floor(t * 3) % 2 ? 1 : 0.5));
    if (hit && restarting) restart(px + pw - 94, ry, 5, t * 7, COL.gold, a);
    if (hit && back) check(px + pw - 99, ry, 0.7, COL.mint, seg(t, T.restart[1], T.restart[1] + 0.35), W.emph);
  }
  // the star flies to the alert and clicks it: the restart starts
  const alertX = px + pw - 70, alertY = py + 60 + 34;
  const sk = ease(seg(t, T.star[0], T.star[1]));
  if (t >= T.star[0]) {
    const sx = 40 + (px + pw + 2 - 40) * sk, sy = 24 + (alertY - 24) * sk - Math.sin(sk * Math.PI) * 26;
    brandStar(sx, sy + (sk >= 1 ? Math.sin(t * 3) * 1.5 : 0), 9, t);
  }
  clickRing(alertX, alertY, seg(t, T.click, T.click + 0.6));
  // the work order records what happened
  const ok = ease(seg(t, T.order[0], T.order[0] + 0.35));
  if (ok > 0) {
    const cx = 296 + (1 - ok) * -16, cy = 62, cw = 108, ch = 138;
    box(cx, cy, cw, ch, 10, { fill: COL.panel, stroke: COL.gold, w: W.base, a: ok });
    wrench(cx + 18, cy + 20, 1.1, COL.gold);
    text(L.wo, cx + 32, cy + 17, { size: 16, weight: 700, font: 'display', color: COL.white, a: ok });
    text(L.auto, cx + 32, cy + 30, { size: 9, color: COL.soft, a: ok });
    L.steps.forEach((s, i) => {
      const k = seg(t, T.order[0] + 0.3 + i * 0.22, T.order[0] + 0.5 + i * 0.22);
      const yy = cy + 52 + i * 21;
      box(cx + 12, yy - 5.5, 11, 11, 3, { stroke: COL.soft, w: W.hair, a: ok });
      check(cx + 14, yy, 0.62, COL.mint, k, W.base);
      text(s, cx + 30, yy + 0.5, { size: 9.5, color: COL.line, a: ok });
    });
    const nk = seg(t, T.order[1], T.order[1] + 0.4);
    line(cx + 12, cy + ch - 28, cx + cw - 12, cy + ch - 28, COL.faint, W.hair, ok);
    text(L.noVisit, cx + 12, cy + ch - 15, { size: 9.5, weight: 600, color: COL.mint, a: nk });
  }
}

// ---------------------------------------------------------------- 3. morning at the base
function base(x: number, ground: number, lang: 'es' | 'en') {
  const top = ground - 78;
  box(x, top, 120, 78, 3, { fill: COL.panel, stroke: COL.line, w: W.base });
  poly2([[x - 6, top + 2], [x + 60, top - 16], [x + 126, top + 2]]);
  box(x + 14, top + 30, 36, 48, 2, { fill: COL.bg2, stroke: COL.soft, w: W.hair });
  for (let i = 1; i < 6; i++) line(x + 14, top + 30 + i * 8, x + 50, top + 30 + i * 8, COL.dim, W.hair);
  box(x + 66, top + 26, 40, 20, 2, { fill: COL.sky, fa: 0.18, stroke: COL.soft, w: W.hair });
  text(WORDS[lang].base, x + 86, top + 14, { size: 10, weight: 700, font: 'display', color: COL.soft, align: 'center' });
}
function poly2(pts: Array<[number, number]>) {
  for (let i = 0; i < pts.length - 1; i++) line(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], COL.line, W.base);
}
/** A tablet in the hand showing the work order, all checked. */
function tablet(x: number, y: number, a: number) {
  box(x - 2, y - 13, 18, 22, 3, { fill: COL.bg2, stroke: COL.line, w: W.base, a });
  wrench(x + 3, y - 7, 0.5, COL.gold);
  for (let i = 0; i < 2; i++) check(x + 2, y - 1 + i * 5, 0.4, COL.mint, 1, W.hair);
}

function yard(t: number, lang: 'es' | 'en') {
  sky(0.85);
  circle(250, 168, 24, { fill: COL.gold, fa: 0.14 });
  circle(250, 168, 12, { fill: COL.gold, fa: 0.85 });
  mountains(170, '#2A3552');
  pit(20, 170, 170, 0.9);
  desert(170, 0.9);
  base(346, GROUND, lang);
  const tx = 150;
  pickup(tx, GROUND, { led: COL.mint, t, signal: 1 });
  // the technician walks over with the work order and checks it off
  const wk = ease(seg(t, T.walk[0], T.walk[1]));
  const px = 490 + (292 - 490) * wk;
  let pose: 'walk' | 'hold' | 'thumbs' | 'stand' = 'walk';
  if (t >= T.walk[1]) pose = t < T.read[1] ? 'hold' : t < T.thumbs[1] ? 'thumbs' : 'stand';
  const hand = person(px, GROUND + 2, { t, pose, facing: -1, helmet: true, vest: true });
  if (pose === 'hold') tablet(hand[0] - 14, hand[1], 1);
  // the dots connect: fault -> remote restart -> work order -> verified -> the star
  const k = seg(t, T.dots[0], T.dots[1]);
  if (k > 0) {
    fade(0.35 * seg(t, T.dots[0], T.dots[0] + 0.5));
    constellation([[60, 92], [138, 58], [220, 86], [300, 56], [376, 84]], k, t, [
      (x, y, a) => text('!', x, y + 0.5, { size: 11, weight: 700, color: COL.coral, align: 'center', a }),
      (x, y, a) => restart(x, y, 4.5, 0.3, COL.gold, a),
      (x, y) => wrench(x, y, 0.7, COL.gold),
      (x, y, a) => check(x - 3.5, y, 0.55, COL.mint, a, W.base),
    ]);
  }
}

export const maintenanceLineScene: PixelScene<LineState | undefined> = (g, time, state) => {
  const t = time % MAINT_LINE_LOOP;
  const lang = state?.lang ?? 'es';
  begin(g);
  const lapseMid = (T.lapse[0] + T.lapse[1]) / 2;
  if (t < T.dashIn[1]) nightRoad(t);
  if (t >= T.dashIn[0] && t < lapseMid) {
    if (t < T.dashIn[1]) fade(seg(t, T.dashIn[0], T.dashIn[1]));
    else box(0, 0, LW, 270, 0, { fill: COL.bg });
    dashboard(t, lang);
  }
  if (t >= lapseMid) yard(t, lang);
  // time-lapse (night -> morning), the loop's end, and the start of every loop after the first
  fade(Math.max(Math.sin(seg(t, T.lapse[0], T.lapse[1]) * Math.PI), seg(t, 16.6, 17), time >= MAINT_LINE_LOOP ? 1 - seg(t, 0, 0.3) : 0));
};
