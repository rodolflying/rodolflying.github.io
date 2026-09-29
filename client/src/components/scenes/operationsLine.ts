// Operations story, executive style: "one number for everyone".
// Operations meeting at the mine office: the planner highlights printed sheets while two managers
// argue, each with their own spreadsheet -> the star turns the wall screen into a live view of
// the haul route (faena -> port, plan vs actual per segment) -> one shared gauge, the same for
// everyone -> the planner stands and conducts, the meeting decides -> the dots connect.
import type { PixelScene } from '../pixel/PixelCanvas';
import {
  COL, W, LW, LH, arc, begin, box, brandStar, check, circle, clamp, clickRing, clockChip, constellation, ctx, desert,
  ease, fade, line, mountains, pit, person, poly, seg, sky, status, text, type LineState, type SceneCaptionDef, limb
} from './lineKit';

export const OPS_LINE_LOOP = 16.5;

const T = {
  hl: [0.2, 4.6] as [number, number], argA: 0.7, argB: 1.5, argOut: [4.2, 4.6] as [number, number],
  star: [3.6, 4.2] as [number, number], click: 4.4, wipe: [4.6, 5.3] as [number, number],
  lower: [5.0, 5.7] as [number, number], route: [5.2, 6.2] as [number, number], trucks: 5.8,
  bars: [6.2, 7.2] as [number, number], gauge: [7.3, 8.2] as [number, number],
  drop: [7.9, 8.2] as [number, number], same: 8.3,
  rise: [9.6, 10.3] as [number, number], tag: 10.7, thumbs: [11.2, 12.9] as [number, number], agree: 11.3,
  dots: [13.8, 15.8] as [number, number], out: [16.1, 16.5] as [number, number],
};
/** Poster frame: the live route and the shared gauge, the planner conducting, the meeting agreeing. */
export const OPS_LINE_STILL = 12.4;

export const OPS_LINE_CAPTIONS: SceneCaptionDef[] = [
  { from: 0.3, to: 3.9, time: '07:50', es: 'Cada gerente llega con su propia planilla', en: 'Every manager brings their own spreadsheet' },
  { from: 4.3, to: 7.3, time: '07:58', es: 'Plan versus real, calculado todos los días', en: 'Plan vs actual, calculated every day' },
  { from: 7.5, to: 10.4, time: '08:00', es: 'Todos miran el mismo número', en: 'Everyone sees the same number' },
  { from: 10.6, to: 13.6, time: '08:10', es: 'La reunión pasa de discutir a decidir', en: 'The meeting moves from arguing to deciding' },
  { from: 13.9, to: 16.2, es: 'Con la información lista, el equipo dirige', en: 'With the data ready, the team leads' },
];

const WORDS = {
  es: { sheet: 'Planilla v7 (final)', today: 'Operación hoy', live: 'En vivo', faena: 'Faena', port: 'Puerto', pvr: 'Plan vs real', one: 'un solo número', behind: 'Vamos atrasados', ok: 'Vamos al día', agree: 'De acuerdo', plus: '+1 camión' },
  en: { sheet: 'Sheet v7 (final)', today: 'Operations today', live: 'Live', faena: 'Mine', port: 'Port', pvr: 'Plan vs actual', one: 'one number', behind: "We're behind", ok: "We're on time", agree: 'Agreed', plus: '+1 truck' },
};

const FLOOR = 214;
const WIN = { x: 14, y: 36, w: 116, h: 70 };
const SCR = { x: 150, y: 24, w: 242, h: 96 };
const PLANNER_X = 58;
const A_X = 258, B_X = 356;
/** Route on the wall screen: faena -> port, four segments; the third one runs late. */
const ROUTE: Array<[number, number]> = [[172, 62], [203, 50], [234, 64], [265, 50], [296, 62]];
const LATE = 2;
const PLAN = [12, 10, 12, 10];
const REAL = [11, 10, 17, 9];
const STAR_PARK: [number, number] = [396, 64];

// ---------------------------------------------------------------- local helpers
/** Same limb style as the kit's figures (outline + soft fill). Candidate for the kit. */
function clip(x: number, y: number, w: number, h: number, draw: () => void) {
  const G = ctx();
  G.save();
  G.beginPath(); G.rect(x, y, w, h); G.clip();
  draw();
  G.restore();
}

/**
 * A figure that goes from seated (rise 0) to standing (rise 1), facing f, drawn in the kit's
 * limb style. Hands go where the caller says. Candidate for the kit (seated people).
 */
function seatedPerson(x: number, floor: number, o: { rise: number; front: [number, number]; back: [number, number]; shirt: string; look?: number; facing?: 1 | -1 }) {
  const f = o.facing ?? 1, r = ease(clamp(o.rise));
  const hip = floor - 14 - 10 * r, sh = hip - 20, head = sh - 9;
  for (const s of [-1, 1]) {
    const kx = x + f * (11 * (1 - r)) + s * 2 * r, ky = floor - 14 + 1 * r;
    const fx = x + f * (12 * (1 - r)) + s * 3.5 * r + (1 - r) * s * 1.5;
    limb(x + s * 2, hip, kx, ky, COL.trousers, 4.2);
    limb(kx, ky, fx, floor - 3, COL.trousers, 4.2);
    box(fx - 3.5 + f * 1.5, floor - 3.5, 7, 3.5, 1.5, { fill: COL.bg2, stroke: COL.line, w: W.hair });
  }
  limb(x - f * 4, sh + 3, o.back[0], o.back[1], o.shirt);
  box(x - 8, sh - 2, 16, 24, 6, { fill: COL.bg2, stroke: COL.line, w: W.base });
  box(x - 8, sh - 2, 16, 24, 6, { fill: o.shirt, fa: 0.3 });
  limb(x + f * 5, sh + 3, o.front[0], o.front[1], o.shirt);
  circle(o.back[0], o.back[1], 2.4, { fill: COL.skin, stroke: COL.line, w: W.hair });
  circle(o.front[0], o.front[1], 2.4, { fill: COL.skin, stroke: COL.line, w: W.hair });
  circle(x, head, 7, { fill: COL.skin, fa: 0.85, stroke: COL.line, w: W.base });
  circle(x + f * 3, head - 0.5 - (o.look ?? 0) * 1.6, 0.9, { fill: COL.bg });
  return { sh, head };
}
/** Where the seated/standing figure's shoulder is, to aim the hands. */
const shoulderY = (floor: number, rise: number) => floor - 34 - 10 * ease(clamp(rise));

/** A mine haul truck, side view facing right; (x, ground) = rear tyre contact, s = scale. */
function haulTruck(x: number, gy: number, s: number, t: number) {
  const P = (px: number, py: number): [number, number] => [x + px * s, gy - py * s];
  poly([P(0, 11), P(2, 24), P(27, 24), P(29, 13), P(29, 11)], { fill: COL.panel, stroke: COL.line, w: W.hair }, true);
  box(x + 29 * s, gy - 22 * s, 9 * s, 9 * s, 1, { fill: COL.panel, stroke: COL.line, w: W.hair });
  box(x + 31 * s, gy - 20 * s, 5 * s, 4 * s, 0.5, { fill: COL.sky, fa: 0.3 });
  line(x + 1 * s, gy - 10 * s, x + 39 * s, gy - 10 * s, COL.soft, W.hair);
  for (const wx of [8, 32]) {
    circle(x + wx * s, gy - 5 * s, 5 * s, { fill: COL.bg, stroke: COL.line, w: W.hair });
    circle(x + wx * s + Math.cos(t * 6) * 2 * s, gy - 5 * s + Math.sin(t * 6) * 2 * s, 0.5, { fill: COL.soft });
  }
}
/** Port crane silhouette; (x, ground) = foot of the mast. */
function crane(x: number, gy: number, h: number) {
  line(x, gy, x, gy - h, COL.soft, W.base);
  line(x - 10, gy - h, x + 22, gy - h, COL.soft, W.base);
  line(x, gy - h - 6, x - 10, gy - h, COL.soft, W.hair);
  line(x, gy - h - 6, x + 22, gy - h, COL.soft, W.hair);
  line(x + 16, gy - h, x + 16, gy - h + 12, COL.dim, W.hair);
  box(x + 13, gy - h + 12, 6, 4, 1, { stroke: COL.gold, w: W.hair });
}
/** Tiny truck icon for the screen, centred on (x, y). */
function truckGlyph(x: number, y: number, color: string, a = 1) {
  poly([[x - 5, y - 1], [x - 4.5, y - 5], [x + 1.5, y - 5], [x + 1.5, y - 1]], { fill: COL.bg2, stroke: color, w: W.hair, a }, true);
  box(x + 2, y - 4, 3, 3, 0.6, { stroke: color, w: W.hair, a });
  circle(x - 3, y + 0.8, 1.3, { fill: color, a });
  circle(x + 3, y + 0.8, 1.3, { fill: color, a });
}
/** Small gauge: half dial filled to v. */
function gauge(cx: number, cy: number, r: number, v: number, a = 1, w = W.emph) {
  arc(cx, cy, r, Math.PI, Math.PI * 2, { stroke: COL.faint, w: w + 1, a });
  if (v > 0) arc(cx, cy, r, Math.PI, Math.PI * (1 + v), { stroke: COL.mint, w, a });
  const ang = Math.PI * (1 + v);
  line(cx, cy, cx + Math.cos(ang) * r * 0.8, cy + Math.sin(ang) * r * 0.8, COL.white, W.base, a);
  circle(cx, cy, 1.8, { fill: COL.white, a });
}
/** Speech bubble centred on cx with its tail pointing down to the speaker. */
function bubble(cx: number, y: number, w: number, a: number, stroke: string, draw: (x: number, y: number) => void) {
  if (a <= 0) return;
  const G = ctx();
  G.save();
  G.globalAlpha *= a;
  G.translate(cx, y + 9); G.scale(0.85 + 0.15 * a, 0.85 + 0.15 * a); G.translate(-cx, -(y + 9));
  box(cx - w / 2, y, w, 18, 9, { fill: COL.panel, stroke, w: W.hair });
  poly([[cx - 4, y + 18], [cx, y + 23], [cx + 4, y + 18]], { fill: COL.panel, stroke, w: W.hair });
  line(cx - 3.3, y + 18, cx + 3.3, y + 18, COL.panel, W.base);
  draw(cx, y + 9.5);
  G.restore();
}
/** A printed sheet with a small bar chart, held by a manager. */
function chartSheet(x: number, y: number, up: boolean, a: number) {
  box(x, y, 16, 20, 1.5, { fill: COL.white, fa: 0.9, stroke: COL.line, w: W.hair, a });
  line(x + 3, y + 4, x + 11, y + 4, COL.dim, W.hair, a);
  const hs = up ? [4, 7, 10] : [10, 7, 4];
  hs.forEach((h, i) => box(x + 3 + i * 4, y + 17 - h, 2.6, h, 0.5, { fill: up ? COL.gold : COL.coral, a }));
}

// ---------------------------------------------------------------- the set
function room(t: number) {
  box(0, 0, LW, LH, 0, { fill: COL.bg });
  box(0, FLOOR, LW, LH - FLOOR, 0, { fill: COL.bg2 });
  line(0, FLOOR, LW, FLOOR, COL.dim, W.hair);
  for (let x = 30; x < LW; x += 60) line(x, FLOOR + 1, x - 24, LH, COL.faint, W.hair);
  // the window: the real route outside, trucks between the pit and the port
  clip(WIN.x, WIN.y, WIN.w, WIN.h, () => {
    ctx().save(); ctx().translate(0, WIN.y - 24);
    sky(0.6, 72);
    ctx().restore();
    mountains(WIN.y + 44, '#2A3552');
    pit(WIN.x + 2, WIN.y + 46, 56, 0.9);
    desert(WIN.y + 46, 0.8);
    crane(WIN.x + WIN.w - 26, WIN.y + 48, 26);
    line(WIN.x, WIN.y + 60, WIN.x + WIN.w, WIN.y + 60, COL.dim, W.hair);
    const u = ((t * 9) % (WIN.w + 30)) - 22;
    haulTruck(WIN.x + u, WIN.y + 60, 0.52, t);
  });
  box(WIN.x, WIN.y, WIN.w, WIN.h, 3, { stroke: COL.line, w: W.base });
  line(WIN.x + WIN.w / 2, WIN.y, WIN.x + WIN.w / 2, WIN.y + WIN.h, COL.line, W.hair, 0.7);
  line(WIN.x - 4, WIN.y + WIN.h + 2, WIN.x + WIN.w + 4, WIN.y + WIN.h + 2, COL.soft, W.base);
}

function clockLabel(t: number) {
  return t < T.click ? '07:50' : t < T.gauge[0] ? '07:58' : t < T.tag - 0.3 ? '08:00' : '08:10';
}

// ---------------------------------------------------------------- the wall screen
function spreadsheet(t: number, lang: 'es' | 'en') {
  const s = SCR;
  text(WORDS[lang].sheet, s.x + 10, s.y + 11, { size: 9.5, weight: 600, color: COL.soft });
  const cw = (s.w - 20) / 7, ch = 10;
  for (let r = 0; r < 6; r++) for (let c = 0; c < 7; c++) {
    const x = s.x + 10 + c * cw, y = s.y + 22 + r * ch;
    box(x, y, cw, ch, 0, { stroke: COL.faint, w: W.hair });
    const bad = (r * 7 + c * 3) % 11 === 4;
    if (bad) {
      box(x + 1, y + 1, cw - 2, ch - 2, 0, { fill: COL.coral, fa: 0.25, a: Math.floor(t * 3 + c) % 2 ? 1 : 0.5 });
      text('??', x + cw / 2, y + ch / 2 + 0.5, { size: 7, weight: 700, color: COL.coral, align: 'center' });
    } else if ((r + c) % 3 !== 1) line(x + 4, y + 5, x + 4 + ((r * 5 + c * 7) % 14) + 6, y + 5, COL.dim, W.hair);
  }
}

function routePoint(u: number): [number, number] {
  // the late segment takes twice as long to cross
  const wts = [1, 1, 2, 1], tot = 5;
  let acc = 0;
  for (let i = 0; i < 4; i++) {
    const w = wts[i] / tot;
    if (u <= acc + w || i === 3) {
      const k = clamp((u - acc) / w);
      const [x1, y1] = ROUTE[i], [x2, y2] = ROUTE[i + 1];
      return [x1 + (x2 - x1) * k, y1 + (y2 - y1) * k];
    }
    acc += w;
  }
  return ROUTE[4];
}

function liveView(t: number, lang: 'es' | 'en') {
  const s = SCR, L = WORDS[lang];
  text(L.today, s.x + 10, s.y + 11, { size: 10.5, weight: 600, font: 'display', color: COL.white });
  status(s.x + s.w - 50, s.y + 11, 'ok', L.live);
  line(s.x + 6, s.y + 20, s.x + s.w - 6, s.y + 20, COL.faint, W.hair);
  // the route draws itself, faena -> port
  const rk = ease(seg(t, T.route[0], T.route[1]));
  for (let i = 0; i < 4; i++) {
    const k = clamp(rk * 4 - i);
    if (k <= 0) continue;
    const [x1, y1] = ROUTE[i], [x2, y2] = ROUTE[i + 1];
    line(x1, y1, x1 + (x2 - x1) * k, y1 + (y2 - y1) * k, i === LATE ? COL.coral : COL.mint, W.emph, 0.9);
  }
  ROUTE.forEach(([x, y], i) => {
    const k = ease(clamp(rk * 4 - i + 0.3));
    if (k > 0) circle(x, y, 2.6 * k, { fill: COL.bg2, stroke: i === 0 || i === 4 ? COL.gold : COL.line, w: W.base });
  });
  const la = seg(t, T.route[0], T.route[0] + 0.4);
  // faena (pit benches) and port (crane) marks
  const [fx, fy] = ROUTE[0], [px, py] = ROUTE[4];
  poly([[fx - 9, fy - 4], [fx - 7, fy - 7], [fx - 3, fy - 7], [fx - 1, fy - 10], [fx + 3, fy - 10]], { stroke: COL.soft, w: W.hair, a: la });
  line(px + 3, py, px + 3, py - 12, COL.soft, W.hair, la);
  line(px - 1, py - 12, px + 10, py - 12, COL.soft, W.hair, la);
  text(L.faena, fx, fy + 11, { size: 9, color: COL.soft, align: 'center', a: la });
  text(L.port, px, py + 11, { size: 9, color: COL.soft, align: 'center', a: la });
  // trucks on the route; the late segment slows them down
  if (t >= T.trucks) for (let i = 0; i < 3; i++) {
    const u = ((t - T.trucks) * 0.07 + i / 3) % 1;
    const [x, y] = routePoint(u);
    const a = seg(t, T.trucks, T.trucks + 0.4) * Math.min(seg(u, 0, 0.04), 1 - seg(u, 0.96, 1));
    truckGlyph(x, y - 4, COL.white, a);
  }
  // plan vs actual per segment
  for (let i = 0; i < 4; i++) {
    const bk = ease(seg(t, T.bars[0] + i * 0.12, T.bars[0] + 0.5 + i * 0.12));
    if (bk <= 0) continue;
    const mx = (ROUTE[i][0] + ROUTE[i + 1][0]) / 2, by = s.y + s.h - 8;
    box(mx - 7, by - PLAN[i] * bk, 6, PLAN[i] * bk, 1, { stroke: COL.soft, w: W.hair });
    box(mx + 1, by - REAL[i] * bk, 6, REAL[i] * bk, 1, { fill: i === LATE ? COL.coral : COL.mint, fa: 0.75 });
  }
  line(ROUTE[0][0] - 8, s.y + s.h - 8, ROUTE[4][0] + 8, s.y + s.h - 8, COL.faint, W.hair);
  // the decision: one more truck on the late segment
  const tk = ease(seg(t, T.tag, T.tag + 0.4));
  if (tk > 0) {
    const mx = (ROUTE[LATE][0] + ROUTE[LATE + 1][0]) / 2;
    box(mx - 33, 70, 60, 13, 6.5, { fill: COL.bg2, stroke: COL.gold, w: W.hair, a: tk });
    text(L.plus, mx - 7, 76.8, { size: 9, weight: 600, color: COL.gold, align: 'center', a: tk });
    check(mx + 16, 76.5, 0.45, COL.mint, seg(t, T.agree, T.agree + 0.35), W.base);
  }
  // one gauge, the same for everyone
  const gk = ease(seg(t, T.gauge[0], T.gauge[1]));
  if (gk > 0) {
    const cx = 351, cy = 76;
    line(312, s.y + 26, 312, s.y + s.h - 8, COL.faint, W.hair, gk);
    if (t >= T.gauge[1]) circle(cx, cy - 8, 26, { fill: COL.mint, fa: 0.07 * (1 - seg(t, T.gauge[1], T.gauge[1] + 1.2)) });
    gauge(cx, cy, 22, 0.78 * gk, gk);
    text(L.pvr, cx, cy + 12, { size: 9.5, weight: 600, color: COL.white, align: 'center', a: gk });
    text(L.one, cx, cy + 23, { size: 9, color: COL.soft, align: 'center', a: gk });
  }
}

function wallScreen(t: number, lang: 'es' | 'en') {
  const s = SCR;
  box(s.x, s.y, s.w, s.h, 5, { fill: COL.bg2, stroke: COL.line, w: W.base });
  const wk = ease(seg(t, T.wipe[0], T.wipe[1]));
  const wx = s.x + s.w * wk;
  if (wk < 1) clip(wx, s.y, s.x + s.w - wx, s.h, () => spreadsheet(t, lang));
  if (wk > 0) clip(s.x, s.y, wx - s.x, s.h, () => liveView(t, lang));
  if (wk > 0 && wk < 1) line(wx, s.y + 2, wx, s.y + s.h - 2, COL.mint, W.emph, 0.9);
  line(s.x + s.w / 2 - 14, s.y + s.h + 1.5, s.x + s.w / 2 + 14, s.y + s.h + 1.5, COL.dim, W.base);
}

// ---------------------------------------------------------------- the people
function plannerDesk(t: number) {
  const x = PLANNER_X, rise = seg(t, T.rise[0], T.rise[1]);
  const deskTop = FLOOR - 26;
  // chair
  line(x - 10, FLOOR - 12, x + 6, FLOOR - 12, COL.soft, W.base);
  line(x - 10, FLOOR - 12, x - 12, FLOOR - 40, COL.soft, W.base);
  line(x - 2, FLOOR - 12, x - 2, FLOOR - 2, COL.dim, W.base);
  line(x - 8, FLOOR - 1, x + 4, FLOOR - 1, COL.dim, W.base);
  // arms: holding a printed sheet and highlighting it -> resting on the desk -> conducting
  const sy = shoulderY(FLOOR, rise);
  const lower = ease(seg(t, T.lower[0], T.lower[1]));
  const rows = [165, 170, 175, 180];
  const hlk = (t - T.hl[0]) / ((T.hl[1] - T.hl[0]) / 4);
  const row = clamp(Math.floor(hlk), 0, 3), rk = clamp(hlk - row);
  const sheetY = 160 + lower * 20;
  const hlPos: [number, number] = [x + 15 + rk * 14, rows[row] - 2 + (sheetY - 158) + Math.sin(t * 20) * 0.4];
  const rest: [number, number] = [x + 17, deskTop - 2];
  const conduct: [number, number] = [x + 13 + Math.sin(t * 3.2) * 1.5, sy - 9 + Math.cos(t * 3.2) * 1.5];
  const mix = (a: [number, number], b: [number, number], k: number): [number, number] => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
  const front = t < T.rise[0] ? mix(hlPos, rest, lower) : mix(rest, conduct, ease(seg(t, T.rise[0] + 0.2, T.rise[1] + 0.2)));
  const backHold: [number, number] = [x + 13, sheetY + 24];
  const back = t < T.rise[0] ? mix(backHold, [x + 11, deskTop - 1], lower) : mix([x + 11, deskTop - 1], [x - 6, sy + 22], ease(rise));
  const look = t < T.lower[0] ? 0 : 1;
  seatedPerson(x, FLOOR, { rise, front, back, shirt: COL.sky, look });
  // desk (in front of her legs) and the pile of printed sheets
  box(x + 12, deskTop, 80, 4, 1.5, { fill: COL.panel, stroke: COL.line, w: W.base });
  line(x + 18, deskTop + 4, x + 18, FLOOR, COL.soft, W.base);
  line(x + 86, deskTop + 4, x + 86, FLOOR, COL.soft, W.base);
  for (let i = 0; i < 5; i++) box(x + 44 + (i % 2) * 2, deskTop - 3 - i * 2.4, 34, 2.4, 0.5, { fill: COL.white, fa: 0.75, stroke: COL.soft, w: W.hair });
  line(x + 47, deskTop - 6.6, x + 70, deskTop - 6.6, COL.gold, W.base, 0.8);
  // the sheet being highlighted, held up; it goes back to the pile when the screen goes live
  const sa = 1 - seg(t, T.lower[1] - 0.25, T.lower[1]);
  if (sa > 0) {
    box(x + 11, sheetY, 24, 28, 1.5, { fill: COL.white, fa: 0.92, stroke: COL.line, w: W.hair, a: sa });
    line(x + 14, sheetY + 3.5, x + 24, sheetY + 3.5, COL.dim, W.base, sa);
    rows.forEach((ry, i) => {
      const yy = ry - 158 + sheetY;
      line(x + 14, yy, x + 32, yy, COL.dim, W.hair, sa);
      const k = i < row ? 1 : i === row ? rk : 0;
      if (k > 0) line(x + 14, yy, x + 14 + 18 * k, yy, COL.gold, 3.2, 0.55 * sa);
    });
  }
  // the highlighter: in the hand while highlighting, then the conductor's baton
  const [hx, hy] = front;
  const ang = t >= T.rise[0] ? -0.6 + Math.sin(t * 3.2) * 0.25 : -1.2;
  const bl = t >= T.rise[0] ? 11 : 7;
  line(hx, hy, hx + Math.cos(ang) * bl, hy + Math.sin(ang) * bl, COL.line, W.base);
  circle(hx + Math.cos(ang) * bl, hy + Math.sin(ang) * bl, 1.3, { fill: COL.gold });
  // conducting: soft arcs toward the screen
  const ck = seg(t, T.rise[1], T.rise[1] + 0.4) * (1 - seg(t, T.dots[0], T.dots[0] + 0.4));
  if (ck > 0) for (let i = 0; i < 2; i++) {
    const r = 8 + i * 5 + ((t * 6) % 5);
    arc(hx + Math.cos(ang) * bl, hy + Math.sin(ang) * bl, r, -0.9, 0.3, { stroke: COL.mint, w: W.hair, a: ck * (1 - i * 0.4) * 0.8 });
  }
}

function managers(t: number, lang: 'es' | 'en') {
  const L = WORDS[lang];
  const arguing = t < T.argOut[1];
  const jit = arguing ? Math.sin(t * 7) * 0.8 : 0;
  const dropK = seg(t, T.drop[0], T.drop[1]);
  const thumbs = t >= T.thumbs[0] && t < T.thumbs[1];
  const pose = thumbs ? 'thumbs' : t < T.drop[1] ? 'hold' : 'stand';
  const ha = person(A_X + jit, FLOOR, { t, pose, facing: 1, shirt: COL.soft });
  const hb = person(B_X - jit, FLOOR, { t, pose: thumbs && t > T.thumbs[0] + 0.25 ? 'thumbs' : pose === 'thumbs' ? 'stand' : pose, facing: -1, shirt: COL.gold });
  if (dropK < 1) {
    chartSheet(ha[0] - 2, ha[1] - 14, false, 1 - dropK);
    chartSheet(hb[0] - 14, hb[1] - 14, true, 1 - dropK);
  }
  // the argument: two sheets, two stories
  const out = 1 - seg(t, T.argOut[0], T.argOut[1]);
  const by = 128;
  bubble(A_X - 4, by, 84, ease(seg(t, T.argA, T.argA + 0.3)) * out, COL.coral, (x, y) =>
    text(L.behind, x, y, { size: 9, weight: 600, color: COL.coral, align: 'center' }));
  bubble(B_X + 4, by, 80, ease(seg(t, T.argB, T.argB + 0.3)) * out, COL.gold, (x, y) =>
    text(L.ok, x, y, { size: 9, weight: 600, color: COL.gold, align: 'center' }));
  // then the same number for both, and the agreement
  const endK = 1 - seg(t, T.dots[0], T.dots[0] + 0.4);
  for (const [cx, dt] of [[A_X - 4, 0], [B_X + 4, 0.15]] as Array<[number, number]>) {
    const sk = ease(seg(t, T.same + dt, T.same + dt + 0.3)) * (1 - seg(t, T.agree - 0.2, T.agree));
    bubble(cx, by, 34, sk, COL.mint, (x, y) => gauge(x, y + 3.5, 7, 0.78, 1, W.base));
    const ak = ease(seg(t, T.agree + dt, T.agree + dt + 0.3)) * endK;
    bubble(cx, by, 78, ak, COL.mint, (x, y) => {
      check(x - 31, y, 0.5, COL.mint, 1, W.base);
      text(L.agree, x + 5, y, { size: 9, weight: 600, color: COL.mint, align: 'center' });
    });
  }
}

// ---------------------------------------------------------------- the scene
export const operationsLineScene: PixelScene<LineState | undefined> = (g, time, state) => {
  const t = time % OPS_LINE_LOOP;
  const lang = state?.lang ?? 'es';
  begin(g);
  room(t);
  clockChip(WIN.x, 8, clockLabel(t));
  wallScreen(t, lang);
  plannerDesk(t);
  managers(t, lang);
  // the star arrives, clicks the screen, then waits beside it
  const clickAt: [number, number] = [SCR.x + SCR.w / 2, SCR.y + SCR.h / 2];
  const dk = seg(t, T.dots[0], T.dots[1]);
  if (t >= T.star[0]) {
    const sk = ease(seg(t, T.star[0], T.star[1]));
    const park = ease(seg(t, T.click + 0.3, T.click + 1.0));
    const fx = 150 + (clickAt[0] - 150) * sk, fy = 10 + (clickAt[1] - 10) * sk - Math.sin(sk * Math.PI) * 20;
    const x = fx + (STAR_PARK[0] - fx) * park, y = fy + (STAR_PARK[1] - fy) * park;
    const a = 1 - seg(dk, 0.78, 0.84);
    if (a > 0) brandStar(x, y + (park >= 1 ? Math.sin(t * 3) * 1.5 : 0), 9, t, a);
  }
  clickRing(clickAt[0], clickAt[1], seg(t, T.click, T.click + 0.6));
  // the dots connect: printed sheets -> live route -> one number -> a decision -> the star
  if (dk > 0) {
    fade(0.55 * seg(t, T.dots[0], T.dots[0] + 0.5));
    constellation([[74, 70], [158, 42], [236, 138], [318, 44], STAR_PARK], dk, t, [
      (x, y, a) => {
        box(x - 4, y - 5.5, 8, 11, 1, { stroke: COL.soft, w: W.hair, a });
        line(x - 2, y - 1, x + 2, y - 1, COL.gold, W.emph, a * 0.8);
        line(x - 2, y + 2.5, x + 2, y + 2.5, COL.dim, W.hair, a);
      },
      (x, y, a) => {
        poly([[x - 5.5, y + 2], [x - 2, y - 2.5], [x + 1.5, y + 1.5], [x + 5.5, y - 3]], { stroke: COL.mint, w: W.base, a });
        circle(x - 5.5, y + 2, 1.3, { fill: COL.gold, a });
        circle(x + 5.5, y - 3, 1.3, { fill: COL.gold, a });
      },
      (x, y, a) => gauge(x, y + 3, 5.5, 0.78, a, W.base),
      (x, y, a) => check(x - 3.5, y, 0.55, COL.mint, a, W.base),
    ]);
  }
  // loop end, and the start of every loop after the first
  fade(Math.max(seg(t, T.out[0], T.out[1]), time >= OPS_LINE_LOOP ? 1 - seg(t, 0, 0.3) : 0));
};
