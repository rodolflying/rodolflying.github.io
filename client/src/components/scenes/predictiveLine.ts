// Predictive story, executive style: "the failure we saw coming".
// a pump in a plant vibrates a little more every day while the classic alarm still says OK ->
// the vibration chart: the star's model projects the trend forward and finds when it will cross
// the limit, and a planned work order lands before that date -> days later, a calm planned stop:
// the bearing is swapped while the maintenance lead follows the plan -> the dots connect.
import type { PixelScene } from '../pixel/PixelCanvas';
import {
  COL, W, LW, begin, box, check, circle, clamp, clickRing, clockChip, constellation, ctx, desert, ease, fade, line,
  mountains, panel, person, poly, seg, sky, status, text, wrench, arc, brandStar, type LineState, type SceneCaptionDef,
} from './lineKit';

export const PRED_LINE_LOOP = 16.5;

const T = {
  dashIn: [3.4, 3.9] as [number, number], panelIn: [3.6, 4.2] as [number, number], hist: [3.9, 4.8] as [number, number],
  star: [4.6, 5.2] as [number, number], click: 5.35,
  forecast: [5.6, 6.8] as [number, number], cross: 6.8,
  plan: [7.3, 7.7] as [number, number], order: [7.6, 8.6] as [number, number],
  lapse: [9.7, 10.5] as [number, number],
  work: [10.3, 11.5] as [number, number], restart: 12.0, thumbs: [12.4, 13.4] as [number, number],
  dots: [13.6, 15.6] as [number, number],
};
/** Poster frame: the forecast crossing the limit, the planned stop before it and its work order. */
export const PRED_LINE_STILL = 9.2;

export const PRED_LINE_CAPTIONS: SceneCaptionDef[] = [
  { from: 0.3, to: 3.5, time: '09:10', es: 'La vibración sube, pero la alarma sigue en OK', en: 'Vibration keeps rising, yet the alarm says OK' },
  { from: 4.2, to: 7.2, time: '09:12', es: 'El modelo proyecta cuándo cruzará el límite', en: 'The model projects when it will cross the limit' },
  { from: 7.3, to: 9.9, time: '09:15', es: 'La detención se agenda antes de esa fecha', en: 'The stop is scheduled before that date' },
  { from: 10.5, to: 13.5, time: '08:00', es: 'Días después: cambio planificado, sin apuro', en: 'Days later: a planned swap, no rush' },
  { from: 13.7, to: 16.3, es: 'Una detención planificada, no una emergencia', en: 'A planned stop, not an emergency' },
];

const WORDS = {
  es: {
    title: 'Vibración · bomba', alarmOk: 'Alarma: OK', model: 'Modelo: cruzará el límite', limit: 'Límite', today: 'Hoy',
    cross: 'Cruce estimado', stop: 'Detención', wo: 'OT', planned: 'planificada',
    steps: ['Rodamiento bomba', 'Repuesto reservado', 'Cuadrilla asignada'], when: 'Jueves 08:00', before: 'Antes del cruce',
    pump: 'Bomba', vib: 'Vib.', maint: 'En mantención',
  },
  en: {
    title: 'Vibration · pump', alarmOk: 'Alarm: OK', model: 'Model: will cross the limit', limit: 'Limit', today: 'Today',
    cross: 'Est. crossing', stop: 'Stop', wo: 'WO', planned: 'planned',
    steps: ['Pump bearing', 'Part reserved', 'Crew assigned'], when: 'Thursday 08:00', before: 'Before the crossing',
    pump: 'Pump', vib: 'Vib.', maint: 'Planned stop',
  },
};
type Words = typeof WORDS.es;

const FLOOR = 206;
const GROUND = 218;

// ---------------------------------------------------------------- the pump plant
/** The open door on the left: desert light outside, a warm patch on the floor inside. */
function door() {
  const G = ctx();
  G.save();
  G.beginPath(); G.rect(24, 104, 58, 102); G.clip();
  sky(0.9, 206);
  circle(66, 150, 16, { fill: COL.gold, fa: 0.12 });
  mountains(184, '#2A3552');
  desert(184, 0.9);
  G.restore();
  box(20, 96, 66, 8, 2, { fill: COL.panel, stroke: COL.soft, w: W.hair });
  for (let i = 1; i < 3; i++) line(22, 96 + i * 2.7, 84, 96 + i * 2.7, COL.dim, W.hair);
  box(22, 104, 62, 102, 1, { stroke: COL.line, w: W.base });
  poly([[24, FLOOR], [82, FLOOR], [200, 262], [70, 262]], { fill: COL.gold, fa: 0.07 }, true);
}

function lamp(x: number) {
  line(x, 0, x, 14, COL.dim, W.hair);
  poly([[x - 48, FLOOR], [x - 9, 22], [x + 9, 22], [x + 48, FLOOR]], { fill: COL.gold, fa: 0.03 }, true);
  poly([[x - 9, 22], [x - 4, 14], [x + 4, 14], [x + 9, 22]], { fill: COL.panel, stroke: COL.line, w: W.hair }, true);
  circle(x, 23, 2.5, { fill: COL.gold, fa: 0.8 });
}

/** Wall calendar: after the plan, the planned day circled in gold ahead of the forecast crossing. */
function calendar(planned: boolean, done: boolean) {
  const x = 100, y = 56;
  box(x, y, 40, 38, 3, { fill: COL.panel, stroke: COL.soft, w: W.hair });
  box(x, y, 40, 9, 3, { fill: COL.coral, fa: 0.3 });
  for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) circle(x + 7 + c * 6.5, y + 16 + r * 7, 0.9, { fill: COL.dim });
  if (!planned) return;
  circle(x + 7 + 3 * 6.5, y + 23, 3.4, { stroke: COL.gold, w: W.base });
  line(x + 7 + 1 * 6.5 - 2, y + 28, x + 7 + 1 * 6.5 + 2, y + 32, COL.coral, W.hair);
  line(x + 7 + 1 * 6.5 + 2, y + 28, x + 7 + 1 * 6.5 - 2, y + 32, COL.coral, W.hair);
  if (done) check(x + 7 + 3 * 6.5 - 3, y + 22, 0.45, COL.mint, 1, W.base);
}

/** The local panel by the pump: the classic alarm, and the vibration level against its trip point. */
function hmi(L: Words, kind: 'ok' | 'busy', lvl: number) {
  box(356, 62, 88, 66, 6, { fill: COL.panel, stroke: COL.soft, w: W.hair });
  text(L.pump, 364, 73, { size: 9, weight: 600, color: COL.soft });
  line(356, 80, 444, 80, COL.faint, W.hair);
  status(364, 93, kind, kind === 'ok' ? L.alarmOk : L.maint);
  text(L.vib, 364, 112, { size: 9, color: COL.soft });
  box(386, 109, 50, 6, 3, { stroke: COL.dim, w: W.hair });
  if (lvl > 0) box(386, 109, 50 * lvl, 6, 3, { fill: COL.sky, fa: 0.7 });
  line(386 + 50 * 0.85, 105, 386 + 50 * 0.85, 119, COL.coral, W.base);
}

/** Telemetry cable from the bearing sensor to the panel, with data dots flowing when running. */
function cable(t: number, running: boolean) {
  poly([[239, 152], [239, 100], [356, 100]], { stroke: COL.dim, w: W.hair });
  if (!running) return;
  const L1 = 52, total = L1 + 117;
  for (let i = 0; i < 6; i++) {
    const s = (t * 40 + i * 28) % total;
    const [x, y] = s < L1 ? [239, 152 - s] : [239 + (s - L1), 100];
    circle(x, y, 1.3, { fill: COL.mint, a: 0.8 });
  }
}

/** Motor, coupling, bearing housing (with the vibration sensor) and pump, on a plinth. */
function machine(t: number, running: boolean, wear: number, stopped: boolean) {
  const j = running ? Math.sin(t * 55) * 0.7 * clamp(wear - 0.3) : 0;
  // pipes: discharge up to the roof, suction out to the right
  box(262, -4, 16, 160, 0, { fill: COL.panel, stroke: COL.soft, w: W.hair });
  line(259, 40, 281, 40, COL.soft, W.base);
  line(259, 146, 281, 146, COL.soft, W.base);
  box(292, 169, 196, 14, 0, { fill: COL.panel, stroke: COL.soft, w: W.hair });
  for (const fx of [300, 340]) line(fx, 166, fx, 186, COL.soft, W.base);
  box(120, 198, 196, 8, 2, { fill: COL.panel, stroke: COL.line, w: W.base });
  // motor
  const mx = 138 + j;
  box(mx - 10, 156, 10, 36, 3, { fill: COL.bg2, stroke: COL.soft, w: W.hair });
  box(mx, 150, 72, 48, 6, { fill: COL.bg2, stroke: COL.line, w: W.base });
  box(mx, 150, 72, 48, 6, { fill: COL.sky, fa: 0.14 });
  for (let x = mx + 8; x < mx + 66; x += 6) line(x, 155, x, 193, COL.dim, W.hair);
  box(mx + 24, 140, 22, 10, 2, { fill: COL.panel, stroke: COL.line, w: W.hair });
  // coupling guard, with the shaft turning inside
  box(210 + j, 164, 20, 22, 3, { fill: COL.gold, fa: 0.14, stroke: COL.line, w: W.base });
  if (running) for (let k = 0; k < 2; k++) {
    const sx = 212 + j + ((t * 40 + k * 8) % 16);
    line(sx, 170, sx, 180, COL.gold, W.hair, 0.8);
  }
  // bearing housing + vibration sensor
  box(230 + j, 160, 18, 30, 3, { fill: COL.panel, stroke: COL.line, w: W.base });
  box(234 + j, 152, 10, 8, 2, { fill: COL.mint, fa: 0.3, stroke: COL.mint, w: W.hair });
  // pump volute
  circle(270 + j, 176, 24, { fill: COL.panel, stroke: COL.line, w: W.base });
  circle(270 + j, 176, 10, { fill: COL.bg2, stroke: COL.soft, w: W.hair });
  const rot = running ? t * 9 : 0.5;
  line(270 + j - Math.cos(rot) * 6, 176 - Math.sin(rot) * 6, 270 + j + Math.cos(rot) * 6, 176 + Math.sin(rot) * 6, COL.soft, W.base);
  // lockout tag during the planned stop
  if (stopped) {
    arc(188, 144, 3, Math.PI, 0, { stroke: COL.line, w: W.hair });
    box(184.5, 144, 7, 6, 1.5, { fill: COL.gold, fa: 0.6, stroke: COL.gold, w: W.hair });
    line(188, 150, 188, 154, COL.soft, W.hair);
    box(183.5, 154, 9, 12, 2, { fill: COL.coral, fa: 0.35, stroke: COL.coral, w: W.hair });
    circle(188, 157, 1, { fill: COL.bg });
  }
  // vibration: arcs off the bearing that grow with wear
  if (running && wear > 0.3) for (let r = 0; r < 3; r++) {
    const rad = 9 + r * 6 + ((t * 16) % 6);
    const c = wear > 0.6 ? COL.coral : COL.gold;
    const a = clamp(wear * 1.3) * (1 - r / 3);
    arc(239, 150, rad, -Math.PI * 0.88, -Math.PI * 0.56, { stroke: c, w: W.base, a });
    arc(239, 150, rad, -Math.PI * 0.44, -Math.PI * 0.12, { stroke: c, w: W.base, a });
  }
}

function room(t: number, L: Words, o: { running: boolean; wear: number; stopped: boolean; planned: boolean; done: boolean; lvl: number }) {
  box(0, 0, LW, 270, 0, { fill: COL.bg });
  for (let x = 20; x < LW; x += 40) line(x, 0, x, FLOOR, COL.faint, W.hair);
  line(0, 40, LW, 40, COL.faint, W.hair);
  box(0, FLOOR, LW, 270 - FLOOR, 0, { fill: COL.bg2 });
  line(0, FLOOR, LW, FLOOR, COL.dim, W.hair);
  for (const y of [238, 256]) line(0, y, LW, y, COL.faint, W.hair);
  line(0, 226, LW, 226, COL.gold, W.base, 0.35);
  door();
  lamp(200); lamp(380);
  calendar(o.planned, o.done);
  hmi(L, o.stopped ? 'busy' : 'ok', o.lvl);
  cable(t, o.running);
  machine(t, o.running, o.wear, o.stopped);
}

// ---------------------------------------------------------------- 2. the vibration chart
const CX0 = 38, CHW = 260, CY1 = 192, CHH = 96, CY0 = CY1 - CHH;
const NOW = 0.55, LIMIT = 0.8, CROSS = 0.86, PLAN = 0.74, END = 0.95;
const fx = (f: number) => CX0 + f * CHW;
const fy = (v: number) => CY1 - clamp(v, 0, 1.02) * CHH;
const noise = (f: number) => 0.025 * Math.sin(f * 53) + 0.018 * Math.sin(f * 131 + 1.3);
const vHist = (f: number) => 0.16 + 0.34 * Math.pow(f / NOW, 2.2) + noise(f) * (0.6 + f);
const V_NOW = vHist(NOW);
const vFc = (f: number) => V_NOW + (LIMIT - V_NOW) * Math.pow(Math.max(0, f - NOW) / (CROSS - NOW), 1.35);

function chart(t: number, L: Words) {
  const pk = ease(seg(t, T.panelIn[0], T.panelIn[1]));
  const px = 20 + (1 - pk) * 20, py = 26, pw = 292, ph = 188;
  const dx = px - 20;
  panel(px, py, pw, ph, pk);
  text(L.title, px + 12, py + 29, { size: 12, weight: 600, font: 'display', color: COL.white, a: pk });
  clockChip(px + pw - 70, py + 19, t < T.plan[0] ? '09:12' : '09:15', pk);
  status(px + 12, py + 46, 'ok', L.alarmOk, pk);
  const ck = seg(t, T.cross, T.cross + 0.4);
  if (ck > 0) status(px + 100, py + 46, 'alert', L.model, ck);
  if (pk <= 0) return;
  const X = (f: number) => fx(f) + dx;
  // axes, today and the limit
  line(X(0), CY0, X(0), CY1, COL.dim, W.hair, pk);
  line(X(0), CY1, X(1), CY1, COL.dim, W.hair, pk);
  poly([[X(NOW), CY0], [X(NOW), CY1]], { stroke: COL.soft, w: W.hair, a: pk * 0.6, dash: [1.5, 3] });
  text(L.today, X(NOW), CY1 + 10, { size: 9, color: COL.soft, align: 'center', a: pk });
  const ly = fy(LIMIT);
  poly([[X(0), ly], [X(1), ly]], { stroke: COL.coral, w: W.base, a: pk * 0.9, dash: [5, 4] });
  text(L.limit, X(0) + 3, ly - 7, { size: 9, weight: 600, color: COL.coral, a: pk });
  // measured history, drawn in
  const hk = seg(t, T.hist[0], T.hist[1]);
  if (hk > 0) {
    const pts: Array<[number, number]> = [];
    for (let f = 0; f <= NOW * hk + 1e-6; f += 0.005) pts.push([X(f), fy(vHist(f))]);
    if (pts.length > 1) {
      poly([...pts, [pts[pts.length - 1][0], CY1], [X(0), CY1]], { fill: COL.sky, fa: 0.08 }, true);
      poly(pts, { stroke: COL.sky, w: W.base });
    }
    if (hk >= 1) circle(X(NOW), fy(V_NOW), 3, { fill: COL.sky, stroke: COL.white, w: W.hair });
  }
  // the forecast: a dashed projection with its uncertainty band
  const fk = ease(seg(t, T.forecast[0], T.forecast[1]));
  if (fk > 0) {
    const upper: Array<[number, number]> = [], lower: Array<[number, number]> = [], mid: Array<[number, number]> = [];
    for (let f = NOW; f <= NOW + (END - NOW) * fk + 1e-6; f += 0.005) {
      const v = vFc(f), band = (f - NOW) * 0.45;
      mid.push([X(f), fy(v)]); upper.push([X(f), fy(v + band)]); lower.push([X(f), fy(v - band)]);
    }
    if (mid.length > 1) {
      poly([...upper, ...lower.reverse()], { fill: COL.mint, fa: 0.1 }, true);
      poly(mid, { stroke: COL.mint, w: W.emph, dash: [4, 3] });
    }
  }
  // the planned stop, before the crossing: a gold margin and a flag
  const plk = ease(seg(t, T.plan[0], T.plan[1]));
  if (plk > 0) {
    const x = X(PLAN);
    box(x, ly, X(CROSS) - x, CY1 - ly, 0, { fill: COL.gold, fa: 0.07 * plk });
    line(x, CY1, x, CY1 - (CY1 - ly) * plk, COL.gold, W.base);
    if (plk >= 1) circle(x, ly, 2.5, { fill: COL.gold });
    text(L.stop, x - 4, CY1 + 10, { size: 9, weight: 600, color: COL.gold, align: 'center', a: plk });
  }
  // the crossing: when the projection meets the limit
  if (ck > 0) {
    const cx = X(CROSS);
    poly([[cx, ly], [cx, CY1]], { stroke: COL.coral, w: W.hair, a: ck, dash: [2, 3] });
    const r = 5 + ((t * 10) % 8);
    circle(cx, ly, r, { stroke: COL.coral, w: W.hair, a: ck * (1 - (r - 5) / 8) });
    circle(cx, ly, 3.5, { fill: COL.bg, stroke: COL.coral, w: W.emph, a: ck });
    line(cx - 3, CY1 + 7, cx + 3, CY1 + 13, COL.coral, W.base, ck);
    line(cx + 3, CY1 + 7, cx - 3, CY1 + 13, COL.coral, W.base, ck);
    box(cx - 39, ly - 25, 78, 14, 7, { fill: COL.panel, stroke: COL.coral, w: W.hair, a: ck });
    text(L.cross, cx, ly - 17.5, { size: 9, weight: 600, color: COL.coral, align: 'center', a: ck });
  }
  // the star arrives at "today" and clicks the latest reading: the projection starts
  const sk = ease(seg(t, T.star[0], T.star[1]));
  if (t >= T.star[0]) {
    const tx = X(NOW) - 24, ty = 128;
    const sx = 40 + (tx - 40) * sk, sy = 20 + (ty - 20) * sk - Math.sin(sk * Math.PI) * 26;
    brandStar(sx, sy + (sk >= 1 ? Math.sin(t * 3) * 1.5 : 0), 9, t);
  }
  clickRing(X(NOW), fy(V_NOW), seg(t, T.click, T.click + 0.6));
  // the work order, planned before the crossing
  const ok = ease(seg(t, T.order[0], T.order[0] + 0.35));
  if (ok > 0) {
    const cx = 324 + (1 - ok) * -16, cy = 58, cw = 136, ch = 150;
    box(cx, cy, cw, ch, 10, { fill: COL.panel, stroke: COL.gold, w: W.base, a: ok });
    wrench(cx + 18, cy + 20, 1.1, COL.gold);
    text(L.wo, cx + 32, cy + 17, { size: 16, weight: 700, font: 'display', color: COL.white, a: ok });
    text(L.planned, cx + 32, cy + 30, { size: 9, color: COL.soft, a: ok });
    L.steps.forEach((s, i) => {
      const k = seg(t, T.order[0] + 0.3 + i * 0.2, T.order[0] + 0.5 + i * 0.2);
      const yy = cy + 52 + i * 19;
      box(cx + 12, yy - 5.5, 11, 11, 3, { stroke: COL.soft, w: W.hair, a: ok });
      check(cx + 14, yy, 0.62, COL.mint, k, W.base);
      text(s, cx + 30, yy + 0.5, { size: 9.5, color: COL.line, a: ok });
    });
    line(cx + 12, cy + 106, cx + cw - 12, cy + 106, COL.faint, W.hair, ok);
    const nk = seg(t, T.order[1], T.order[1] + 0.4);
    calGlyph(cx + 18, cy + 120, nk);
    text(L.when, cx + 30, cy + 120.5, { size: 9.5, weight: 600, color: COL.gold, a: nk });
    text(L.before, cx + 12, cy + 137, { size: 9.5, weight: 600, color: COL.mint, a: nk });
  }
}

/** Small calendar glyph (also a constellation node). */
function calGlyph(x: number, y: number, a = 1) {
  box(x - 5, y - 5, 10, 10, 2, { stroke: COL.gold, w: W.hair, a });
  line(x - 5, y - 2, x + 5, y - 2, COL.gold, W.hair, a);
  circle(x + 1.5, y + 1.8, 1.3, { fill: COL.gold, a });
}

// ---------------------------------------------------------------- 3. days later: the planned stop
/** The lead's tablet: the work order, checked off as the swap goes. */
function tablet(x: number, y: number, t: number) {
  box(x - 2, y - 13, 18, 22, 3, { fill: COL.bg2, stroke: COL.line, w: W.base });
  wrench(x + 3, y - 7, 0.5, COL.gold);
  for (let i = 0; i < 2; i++) check(x + 2, y - 1 + i * 5, 0.4, COL.mint, seg(t, 10.9 + i * 1.1, 11.2 + i * 1.1), W.hair);
}

function stopDay(t: number, L: Words) {
  const running = t >= T.restart;
  room(t, L, { running, wear: running ? 0.05 : 0, stopped: !running, planned: true, done: running, lvl: running ? 0.22 : 0 });
  // the new bearing goes in: the housing lights up
  const nb = seg(t, 11.5, 11.8) * (1 - seg(t, 12.2, 12.7));
  if (nb > 0) box(228, 158, 22, 34, 4, { stroke: COL.mint, w: W.emph, a: nb });
  // the worn bearing, set down on a cloth
  if (t >= 10.9) {
    const a = seg(t, 10.9, 11.1);
    box(202, 213, 26, 5, 2, { fill: COL.panel, stroke: COL.dim, w: W.hair, a });
    circle(215, 208, 5, { stroke: COL.coral, w: W.base, a });
    circle(215, 208, 2, { stroke: COL.coral, w: W.hair, a });
  }
  // technician at the bearing housing
  const working = t < T.restart;
  const hand = person(254, GROUND, { t, pose: working ? 'hold' : 'stand', facing: -1, helmet: true, vest: true });
  if (working && t >= T.work[0]) wrench(hand[0] - 3, hand[1] - 2, 0.8, COL.gold, Math.sin(t * 7) * 0.5 - 0.6);
  // the maintenance lead follows the plan, calmly
  const pose = t >= T.thumbs[0] && t < T.thumbs[1] ? 'thumbs' : 'hold';
  const lh = person(108, GROUND, { t, pose, facing: 1, helmet: true, shirt: COL.sky });
  if (pose === 'hold') tablet(lh[0] - 1, lh[1], t);
  // the dots connect: rising vibration -> projection -> planned stop -> done -> the star
  const k = seg(t, T.dots[0], T.dots[1]);
  if (k > 0) {
    fade(0.35 * seg(t, T.dots[0], T.dots[0] + 0.5));
    constellation([[60, 92], [138, 58], [220, 86], [300, 56], [376, 84]], k, t, [
      (x, y, a) => poly([[x - 6, y + 1], [x - 3, y - 3], [x, y + 3], [x + 3, y - 4], [x + 6, y]], { stroke: COL.coral, w: W.base, a }),
      (x, y, a) => {
        poly([[x - 6, y + 4], [x - 1, y + 1]], { stroke: COL.sky, w: W.base, a });
        poly([[x - 1, y + 1], [x + 6, y - 5]], { stroke: COL.mint, w: W.base, a, dash: [2, 1.5] });
      },
      (x, y, a) => calGlyph(x, y, a),
      (x, y, a) => check(x - 3.5, y, 0.55, COL.mint, a, W.base),
    ]);
  }
}

export const predictiveLineScene: PixelScene<LineState | undefined> = (g, time, state) => {
  const t = time % PRED_LINE_LOOP;
  const L = WORDS[state?.lang ?? 'es'];
  begin(g);
  const lapseMid = (T.lapse[0] + T.lapse[1]) / 2;
  if (t < T.dashIn[1]) {
    const wear = 0.35 + 0.5 * seg(t, 0, T.dashIn[0]);
    room(t, L, { running: true, wear, stopped: false, planned: false, done: false, lvl: 0.35 + 0.42 * seg(t, 0, T.dashIn[0]) });
  }
  if (t >= T.dashIn[0] && t < lapseMid) {
    if (t < T.dashIn[1]) fade(seg(t, T.dashIn[0], T.dashIn[1]));
    else box(0, 0, LW, 270, 0, { fill: COL.bg });
    chart(t, L);
  }
  if (t >= lapseMid) stopDay(t, L);
  // time-lapse (days later), the loop's end, and the start of every loop after the first
  fade(Math.max(Math.sin(seg(t, T.lapse[0], T.lapse[1]) * Math.PI), seg(t, 16.1, 16.5), time >= PRED_LINE_LOOP ? 1 - seg(t, 0, 0.3) : 0));
};
