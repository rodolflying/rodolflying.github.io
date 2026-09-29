// Finance story, executive style, told as the service actually works:
// 21:30 at the office, an analyst still typing invoices one by one -> the star arrives and clicks:
// each document is entered and validated before posting, backups attached, the odd one flagged ->
// next day 18:00: the analyst reviews the flag, decides, and leaves on time -> the dots connect.
import type { PixelScene } from '../pixel/PixelCanvas';
import {
  COL, W, LW, LH, begin, box, brandStar, check, circle, clamp, clickRing, clockChip, constellation, ctx, ease,
  fade, line, mountains, panel, person, poly, seg, sky, stars, status, text, type LineState, type SceneCaptionDef, limb
} from './lineKit';

export const FIN_LINE_LOOP = 16.5;

const T = {
  sheets: [0.9, 2.0, 3.0],
  starIn: [3.0, 3.7] as [number, number], starFly: [3.7, 4.3] as [number, number], click: 4.45,
  panelIn: [4.8, 5.3] as [number, number],
  rows: 5.4, rowStep: 0.7, rowDur: 0.6, flagged: 2,
  backups: 8.3,
  lapse: [9.4, 10.2] as [number, number],
  decide: 11.1, stand: 11.9, walk: [12.1, 13.1] as [number, number], thanks: [13.1, 13.5] as [number, number], exit: [13.5, 13.9] as [number, number],
  dots: [14.0, 15.9] as [number, number],
};
/** Poster frame: every document entered and validated, backups attached, one flagged, the analyst leaning back. */
export const FIN_LINE_STILL = 8.9;

export const FIN_LINE_CAPTIONS: SceneCaptionDef[] = [
  { from: 0.3, to: 3.9, time: '21:30', es: 'Otra noche digitando facturas una por una', en: 'Another night typing invoices one by one' },
  { from: 4.4, to: 7.2, time: '21:31', es: 'Cada documento se ingresa y valida solo', en: 'Every document entered and checked, no typing' },
  { from: 7.3, to: 9.5, time: '21:34', es: 'Respaldos adjuntos; lo dudoso queda marcado', en: 'Backups attached; anything odd is flagged' },
  { from: 10.3, to: 13.9, time: '18:00', es: 'Revisa lo marcado, decide y se va a su hora', en: 'Reviews the flag, decides, leaves on time' },
  { from: 14.0, to: 16.2, es: 'Lo repetitivo corre solo; las personas deciden', en: 'The routine runs itself; people decide' },
];

const WORDS = {
  es: {
    title: 'Documentos', docs: ['Factura', 'Solicitud de pedido', 'Hoja de servicio', 'Factura'], queued: 'En cola', checking: 'Validando',
    posted: 'Grabada', review: 'Revisar: centro de costo', backups: 'Respaldos adjuntos', form: 'Factura', flag: 'Revisar', approve: 'Aprobar', clear: 'Al día',
  },
  en: {
    title: 'Documents', docs: ['Invoice', 'Purchase requisition', 'Service entry sheet', 'Invoice'], queued: 'Queued', checking: 'Checking',
    posted: 'Posted', review: 'Review: cost center', backups: 'Backups attached', form: 'Invoice', flag: 'Review', approve: 'Approve', clear: 'All clear',
  },
};

const FLOOR = 214;
const WIN = { x: 20, y: 34, w: 132, h: 116 };
const DESK = { x: 196, y: 184, w: 110 };
const MON = { x: 220, y: 136, w: 56, h: 40 };
const SEAT = { x: 186, y: 194 };
const STACK = { x: 282, y: 180 };
const PERCH: [number, number] = [270, 127];
const DOOR = { x: 404, y: 130, w: 36 };

// ---------------------------------------------------------------- local primitives (kit candidates)
/** Same limb as the kit's person: an outline with a soft fill. */

/**
 * A seated figure in profile, in the kit's limb style (candidate for lineKit). (x, seat) = where
 * the hip rests on the seat, foot = floor. `lean` tilts the torso (radians, + = forward).
 * 'type' puts both hands on a keyboard at (x + 19, seat - 12); 'lean' rests them on the lap.
 * `press` (0..1) dips the front hand, for a click. Returns the front hand.
 */
function seated(x: number, seat: number, foot: number, o: { t: number; pose: 'type' | 'lean'; facing?: 1 | -1; lean?: number; shirt?: string; press?: number }) {
  const G = ctx();
  const f = o.facing ?? 1, top = o.shirt ?? COL.sky;
  const hy = seat - 3, ang = f * (o.lean ?? 0);
  const at = (ly: number): [number, number] => [x - ly * Math.sin(ang), hy + ly * Math.cos(ang)];
  for (const s of [-1, 1]) {
    const kx = x + f * (15 + s * 1.5), fx = kx + f * 2;
    limb(x, hy, kx, hy - 1, COL.trousers, 4.2);
    limb(kx, hy - 1, fx, foot - 3, COL.trousers, 4.2);
    box(fx - 3.5 + f * 2, foot - 3.5, 7, 3.5, 1.5, { fill: COL.bg2, stroke: COL.line, w: W.hair });
  }
  const S = at(-17);
  const typing = o.pose === 'type';
  const bob = (p: number) => (typing && Math.sin(o.t * 19 + p) > 0.3 ? -1.2 : 0);
  let hand: [number, number], elbow: [number, number];
  if (typing) { hand = [x + f * 19, seat - 12 + bob(0) + (o.press ?? 0) * 1.6]; elbow = [x + f * 8, seat - 9]; }
  else { hand = [x + f * 12, seat - 6]; elbow = [S[0] + f, seat - 8]; }
  if (typing) {
    const bh: [number, number] = [hand[0] - f * 4, seat - 12 + bob(2.1)];
    limb(S[0] - f, S[1] + 1, elbow[0] - f * 3, elbow[1], top);
    limb(elbow[0] - f * 3, elbow[1], bh[0], bh[1], top);
    circle(bh[0], bh[1], 2.2, { fill: COL.skin, stroke: COL.line, w: W.hair });
  }
  G.save();
  G.translate(x, hy); G.rotate(ang);
  box(-8, -21, 16, 24, 6, { fill: COL.bg2, stroke: COL.line, w: W.base });
  box(-8, -21, 16, 24, 6, { fill: top, fa: 0.3 });
  G.restore();
  limb(S[0], S[1], elbow[0], elbow[1], top);
  limb(elbow[0], elbow[1], hand[0], hand[1], top);
  circle(hand[0], hand[1], 2.4, { fill: COL.skin, stroke: COL.line, w: W.hair });
  const hd = at(-28);
  circle(hd[0], hd[1], 7, { fill: COL.skin, fa: 0.85, stroke: COL.line, w: W.base });
  circle(hd[0] + f * 3, hd[1] - 0.5, 0.9, { fill: COL.bg });
  return hand;
}

/** Office chair seen from the side; the backrest sits behind a figure facing f. */
function chair(x: number, seat: number, foot: number, f: 1 | -1) {
  const bx = x - f * 12;
  line(bx, seat + 1, bx - f * 2, seat - 12, COL.soft, W.base);
  box(bx - f * 2 - 3, seat - 32, 6, 22, 3, { fill: COL.panel, stroke: COL.line, w: W.base });
  box(x - 11, seat, 24, 4, 2, { fill: COL.panel, stroke: COL.line, w: W.base });
  line(x + 1, seat + 4, x + 1, foot - 5, COL.soft, W.base);
  line(x - 9, foot - 4, x + 11, foot - 4, COL.soft, W.base);
  for (const wx of [x - 9, x + 11]) circle(wx, foot - 2, 1.8, { fill: COL.bg, stroke: COL.soft, w: W.hair });
}

/** A document sheet glyph centred on (x, y). */
function docGlyph(x: number, y: number, color: string, a = 1) {
  box(x - 4.5, y - 6, 9, 12, 1.5, { fill: color, fa: 0.12, stroke: color, w: W.hair, a });
  line(x - 2, y - 2, x + 2, y - 2, color, W.hair, a);
  line(x - 2, y + 1, x + 2, y + 1, color, W.hair, a);
  line(x - 2, y + 4, x + 0.5, y + 4, color, W.hair, a);
}
/** Paperclip glyph (a backup attached). */
function clipGlyph(x: number, y: number, color: string, a = 1) {
  box(x - 2.5, y - 6, 5, 12, 2.5, { stroke: color, w: W.hair, a });
  line(x, y - 3, x, y + 4, color, W.hair, a);
}
/** A small flag glyph (flagged for review). */
function flagGlyph(x: number, y: number, color: string, a = 1) {
  line(x - 3, y + 5, x - 3, y - 5, color, W.base, a);
  poly([[x - 3, y - 5], [x + 4, y - 3], [x - 3, y]], { fill: color, fa: 0.4, stroke: color, w: W.hair, a }, true);
}
/** A small analog clock glyph. */
function clockGlyph(x: number, y: number, color: string, a = 1) {
  circle(x, y, 4.8, { stroke: color, w: W.base, a });
  line(x, y, x, y - 3, color, W.hair, a);
  line(x, y, x + 2.4, y + 1, color, W.hair, a);
}
/** Wall clock: hours as a decimal (21.5 = 21:30). */
function wallClock(cx: number, cy: number, r: number, hours: number) {
  circle(cx, cy, r, { fill: COL.panel, stroke: COL.line, w: W.base });
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const r0 = i % 3 ? r - 2.5 : r - 4;
    line(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0, cx + Math.cos(a) * (r - 1.5), cy + Math.sin(a) * (r - 1.5), COL.dim, W.hair);
  }
  const ha = ((hours % 12) / 12) * Math.PI * 2 - Math.PI / 2;
  const ma = ((hours % 1) * Math.PI * 2) - Math.PI / 2;
  line(cx, cy, cx + Math.cos(ha) * r * 0.5, cy + Math.sin(ha) * r * 0.5, COL.white, W.emph);
  line(cx, cy, cx + Math.cos(ma) * r * 0.78, cy + Math.sin(ma) * r * 0.78, COL.white, W.base);
  circle(cx, cy, 1.3, { fill: COL.gold });
}

// ---------------------------------------------------------------- the office
const ridge = (x: number) => 104 - Math.sin((x - 20) * 0.045) * 10 - Math.sin(x * 0.11 + 1) * 3;

/** The window onto a northern city: hills with lights climbing the slope. d = 0 night, 1 afternoon. */
function cityView(t: number, d: number) {
  const G = ctx();
  G.save();
  G.beginPath(); G.rect(WIN.x, WIN.y, WIN.w, WIN.h); G.clip();
  sky(d * 0.8, WIN.y + WIN.h);
  if (d < 1) stars(t, 1 - d);
  if (d > 0) {
    circle(122, 92, 18, { fill: COL.gold, fa: 0.14 * d });
    circle(122, 92, 8, { fill: COL.gold, fa: 0.8 * d });
  }
  mountains(96, COL.faint, 0.6);
  const pts: Array<[number, number]> = [[WIN.x, WIN.y + WIN.h]];
  for (let x = WIN.x; x <= WIN.x + WIN.w; x += 4) pts.push([x, ridge(x)]);
  pts.push([WIN.x + WIN.w, WIN.y + WIN.h]);
  poly(pts, { fill: COL.earth, fa: 0.12 + 0.22 * d, stroke: COL.dim, w: W.hair }, true);
  // city lights on the hillside
  for (let i = 0; i < 46; i++) {
    const x = WIN.x + 3 + ((i * 37.7) % (WIN.w - 6));
    const r0 = ridge(x) + 5, y = r0 + ((i * 23.3) % Math.max(1, WIN.y + WIN.h - 4 - r0));
    const tw = 0.6 + 0.4 * Math.sin(t * 2.5 + i * 1.3);
    circle(x, y, i % 5 ? 0.8 : 1.1, { fill: i % 3 ? COL.gold : COL.soft, a: (1 - d * 0.85) * tw });
  }
  // buildings in front
  const bl: Array<[number, number, number]> = [[24, 14, 18], [40, 10, 26], [66, 16, 14], [98, 12, 22], [112, 18, 16], [134, 14, 24]];
  bl.forEach(([x, w, h], i) => {
    box(x, WIN.y + WIN.h - h, w, h + 2, 1, { fill: COL.bg2, stroke: COL.dim, w: W.hair });
    for (let k = 0; k < 3; k++) {
      const lit = (i + k) % 2 === 0;
      box(x + 3 + (k % 2) * 5, WIN.y + WIN.h - h + 4 + Math.floor(k / 2) * 6, 2.5, 2.5, 0.5, { fill: lit ? COL.gold : COL.dim, a: lit ? 0.8 - d * 0.5 : 0.5 });
    }
  });
  G.restore();
  box(WIN.x, WIN.y, WIN.w, WIN.h, 3, { stroke: COL.line, w: W.base });
  line(WIN.x + WIN.w / 2, WIN.y, WIN.x + WIN.w / 2, WIN.y + WIN.h, COL.line, W.base);
  line(WIN.x, WIN.y + 44, WIN.x + WIN.w, WIN.y + 44, COL.line, W.hair);
  box(WIN.x - 6, WIN.y + WIN.h, WIN.w + 12, 5, 2, { fill: COL.panel, stroke: COL.line, w: W.hair });
}

function room(t: number, day: boolean) {
  box(0, 0, LW, FLOOR, 0, { fill: COL.bg2 });
  if (day) box(0, 0, LW, FLOOR, 0, { fill: COL.earth, fa: 0.05 });
  cityView(t, day ? 1 : 0);
  // the light the window lets in: warm afternoon sun, or a faint cool night
  poly([[WIN.x, WIN.y + WIN.h + 5], [WIN.x + WIN.w, WIN.y + WIN.h + 5], [WIN.x + WIN.w + 80, LH], [WIN.x + 60, LH]], { fill: day ? COL.gold : COL.sky, fa: day ? 0.06 : 0.025 });
  wallClock(186, 64, 13, day ? 18 + (t - T.lapse[1]) * 0.012 : 21.5 + t * 0.012);
  // pendant lamp over the desk, on at night
  line(246, 0, 246, 24, COL.soft, W.hair);
  poly([[238, 32], [254, 32], [250, 24], [242, 24]], { fill: COL.panel, stroke: COL.line, w: W.base }, true);
  circle(246, 33.5, 2.2, { fill: day ? COL.dim : COL.gold });
  if (!day) poly([[238, 33], [254, 33], [292, DESK.y], [200, DESK.y]], { fill: COL.gold, fa: 0.035 });
  // filing cabinet with a plant, and the door
  box(322, 160, 34, 54, 2, { fill: COL.panel, stroke: COL.line, w: W.base });
  for (let i = 0; i < 2; i++) { line(322, 178 + i * 18, 356, 178 + i * 18, COL.dim, W.hair); line(335, 169 + i * 18, 343, 169 + i * 18, COL.soft, W.base); }
  box(331, 148, 14, 12, 2, { fill: COL.earth, fa: 0.25, stroke: COL.line, w: W.hair });
  for (const [dx, dy] of [[-7, -12], [0, -16], [7, -11]]) poly([[338, 148], [338 + dx * 0.4, 148 + dy * 0.5], [338 + dx, 148 + dy]], { stroke: COL.mint, w: W.base, a: 0.7 });
  box(DOOR.x - 3, DOOR.y - 3, DOOR.w + 6, FLOOR - DOOR.y + 3, 2, { stroke: COL.line, w: W.base });
  // floor
  box(0, FLOOR, LW, LH - FLOOR, 0, { fill: COL.bg });
  line(0, FLOOR, LW, FLOOR, COL.dim, W.hair);
  for (let i = 0; i < 6; i++) line(40 + i * 80, FLOOR + 10 + (i % 2) * 14, 64 + i * 80, FLOOR + 10 + (i % 2) * 14, COL.faint, W.hair);
}

/** The door leaf, hinged on its right edge; open k in [0, 1]. */
function door(k: number) {
  const x = DOOR.x, y = DOOR.y, w = DOOR.w, h = FLOOR - DOOR.y;
  if (k > 0) box(x, y, w, h, 1, { fill: COL.bg, stroke: COL.dim, w: W.hair });
  const lx = x + w - w * (1 - 0.72 * k);
  poly([[lx, y + 3 * k], [x + w, y], [x + w, y + h], [lx, y + h - 2 * k]], { fill: COL.panel, stroke: COL.line, w: W.base }, true);
  circle(lx + 4 + 2 * (1 - k), y + h / 2, 1.6, { fill: COL.gold, fa: 0.7 });
}

function desk() {
  box(DESK.x, DESK.y, DESK.w, 4, 1.5, { fill: COL.panel, stroke: COL.line, w: W.base });
  // one slim leg under the monitor, clear of the seated analyst's knees
  line(DESK.x + 40, DESK.y + 4, DESK.x + 40, FLOOR, COL.line, W.base);
  line(DESK.x + 32, FLOOR - 1, DESK.x + 48, FLOOR - 1, COL.line, W.base);
  box(DESK.x + DESK.w - 30, DESK.y + 4, 26, FLOOR - DESK.y - 4, 1.5, { fill: COL.panel, stroke: COL.line, w: W.base });
  line(DESK.x + DESK.w - 30, DESK.y + 16, DESK.x + DESK.w - 4, DESK.y + 16, COL.dim, W.hair);
  line(DESK.x + DESK.w - 20, DESK.y + 10, DESK.x + DESK.w - 14, DESK.y + 10, COL.soft, W.base);
  box(200, DESK.y - 3, 16, 3, 1, { fill: COL.faint, stroke: COL.soft, w: W.hair });
}

/** The pile of pending paper: grows at night, empties as the documents are entered. */
function stack(t: number, day: boolean) {
  const x = STACK.x, y = STACK.y;
  box(x - 2, y, 22, 4, 1.5, { stroke: COL.soft, w: W.hair });
  let n = 0;
  if (!day) {
    n = t < T.rows ? 5 + T.sheets.filter((s) => t >= s).length : Math.round(8 * (1 - seg(t, T.rows, T.rows + 4 * T.rowStep - 0.2)));
  }
  for (let i = 0; i < n; i++) box(x + ((i * 3) % 4) - 1, y - 2.6 - i * 2.6, 18, 2.4, 0.8, { fill: COL.white, fa: 0.55, stroke: COL.line, w: W.hair });
  if (day) return;
  // sheets that keep arriving
  for (const s of T.sheets) {
    const k = seg(t, s - 0.45, s);
    if (k <= 0 || k >= 1) continue;
    const e = ease(k);
    box(x + Math.sin(k * 7) * 3, 140 + (y - 2.6 - (4 + T.sheets.indexOf(s)) * 2.6 - 140) * e, 18, 2.4, 0.8, { fill: COL.white, fa: 0.55, stroke: COL.line, w: W.hair, a: seg(k, 0, 0.3) });
  }
  // sheets flying into the monitor as each document is entered
  for (let i = 0; i < 4; i++) {
    const k = seg(t, T.rows + i * T.rowStep, T.rows + i * T.rowStep + 0.4);
    if (k <= 0 || k >= 1) continue;
    const e = ease(k);
    const sx = x + 9 + (MON.x + MON.w / 2 - x - 9) * e, sy = y - 18 + (MON.y + 20 - y + 18) * e - Math.sin(e * Math.PI) * 16;
    box(sx - 5, sy - 3.5, 10, 7, 1, { fill: COL.white, fa: 0.5, stroke: COL.line, w: W.hair, a: 1 - seg(k, 0.7, 1) });
  }
}

/** The monitor: a manual form at night, automatic after the click; a review button the next day. */
function monitor(t: number, day: boolean, lang: 'es' | 'en') {
  const L = WORDS[lang], s = MON;
  const cx = s.x + s.w / 2;
  line(cx, s.y + s.h, cx, DESK.y - 2, COL.line, W.base);
  box(cx - 10, DESK.y - 3, 20, 3, 1.5, { fill: COL.panel, stroke: COL.line, w: W.hair });
  const auto = t >= T.click + 0.15;
  const decided = day && t >= T.decide;
  const acc = day ? (decided ? COL.mint : COL.gold) : auto ? COL.mint : COL.sky;
  if (!day) circle(cx, s.y + s.h / 2, 46, { fill: acc, fa: 0.045 });
  box(s.x, s.y, s.w, s.h, 3, { fill: COL.bg2, stroke: COL.line, w: W.base });
  box(s.x + 2.5, s.y + 2.5, s.w - 5, s.h - 5, 2, { fill: acc, fa: 0.1 });
  if (!day && !auto) {
    text(L.form, s.x + 6, s.y + 10, { size: 9, weight: 600, color: COL.white });
    const typed = ((t * 14) % 26);
    [30, 22, typed].forEach((w, i) => { line(s.x + 6, s.y + 20 + i * 6, s.x + 6 + 40, s.y + 20 + i * 6, COL.faint, W.base); line(s.x + 6, s.y + 20 + i * 6, s.x + 6 + w, s.y + 20 + i * 6, COL.sky, W.base, 0.8); });
    if (Math.floor(t * 3) % 2) line(s.x + 7 + typed, s.y + 29, s.x + 7 + typed, s.y + 35, COL.white, W.hair);
  } else if (!day) {
    for (let i = 0; i < 4; i++) {
      const done = t >= T.rows + i * T.rowStep + T.rowDur;
      const bx = s.x + 6 + i * 11.5;
      box(bx, s.y + 8, 8, 8, 2, { stroke: done ? (i === T.flagged ? COL.gold : COL.mint) : COL.dim, w: W.hair });
      if (done && i !== T.flagged) check(bx + 1.5, s.y + 12, 0.5, COL.mint, 1, W.base);
      if (done && i === T.flagged) text('!', bx + 4, s.y + 12.5, { size: 8, weight: 700, color: COL.gold, align: 'center' });
    }
    const pk = seg(t, T.rows, T.rows + 4 * T.rowStep);
    line(s.x + 6, s.y + 30, s.x + s.w - 6, s.y + 30, COL.faint, W.emph);
    line(s.x + 6, s.y + 30, s.x + 6 + (s.w - 12) * pk, s.y + 30, COL.mint, W.emph);
  } else {
    text(decided ? L.clear : L.flag, s.x + 6, s.y + 10, { size: 9, weight: 600, color: acc });
    const bk = seg(t, T.decide, T.decide + 0.3);
    box(s.x + 6, s.y + 19, s.w - 12, 13, 4, { fill: acc, fa: 0.12 + 0.18 * bk, stroke: acc, w: W.hair });
    if (!decided) text(L.approve, cx, s.y + 25.5, { size: 9, weight: 600, color: COL.white, align: 'center' });
    else check(cx - 4, s.y + 25.5, 0.6, COL.mint, seg(t, T.decide, T.decide + 0.35), W.base);
  }
}

// ---------------------------------------------------------------- the ledger panel
function ledger(t: number, lang: 'es' | 'en') {
  const L = WORDS[lang];
  const pk = ease(seg(t, T.panelIn[0], T.panelIn[1]));
  if (pk <= 0) return;
  const px = 308 + (1 - pk) * 16, py = 40, pw = 162, ph = 178;
  panel(px, py, pw, ph, pk);
  text(L.title, px + 12, py + 29, { size: 12, weight: 600, font: 'display', color: COL.white, a: pk });
  clockChip(px + pw - 68, py + 19, t < 7.6 ? '21:31' : '21:34', pk);
  for (let i = 0; i < 4; i++) {
    const ry = py + 56 + i * 27;
    const a = pk * clamp((t - T.panelIn[0] - 0.1 * i) * 3);
    if (a <= 0) continue;
    const s0 = T.rows + i * T.rowStep, s1 = s0 + T.rowDur;
    const flag = i === T.flagged, done = t >= s1;
    if (done && flag) box(px + 5, ry - 12, pw - 10, 25, 6, { fill: COL.gold, fa: 0.08, a });
    else if (done) box(px + 5, ry - 12, pw - 10, 25, 6, { fill: COL.mint, fa: 0.07 * (1 - seg(t, s1 + 0.6, s1 + 1.4)), a });
    docGlyph(px + 16, ry, done ? (flag ? COL.gold : COL.mint) : t >= s0 ? COL.line : COL.soft, a);
    text(L.docs[i], px + 30, ry - 5, { size: 10, weight: 500, color: COL.line, a });
    if (t < s0) text(L.queued, px + 30, ry + 7, { size: 9, color: COL.dim, a });
    else if (!done) status(px + 28, ry + 7, 'busy', L.checking, a);
    else status(px + 28, ry + 7, flag ? 'busy' : 'ok', flag ? L.review : L.posted, a);
    if (done && !flag) check(px + pw - 22, ry + 1, 0.7, COL.mint, seg(t, s1, s1 + 0.3), W.emph);
    if (i < 3) line(px + 10, ry + 13.5, px + pw - 10, ry + 13.5, COL.faint, W.hair, a);
  }
  const fk = seg(t, T.backups, T.backups + 0.4);
  line(px + 10, py + ph - 24, px + pw - 10, py + ph - 24, COL.faint, W.hair, pk);
  clipGlyph(px + 16, py + ph - 11, COL.mint, fk);
  text(L.backups, px + 26, py + ph - 10.5, { size: 9.5, weight: 600, color: COL.mint, a: fk });
  check(px + pw - 22, py + ph - 11, 0.7, COL.mint, seg(t, T.backups + 0.2, T.backups + 0.5), W.emph);
}

// ---------------------------------------------------------------- the people and the star
function analyst(t: number, day: boolean, standing: boolean) {
  if (!standing) chair(SEAT.x, SEAT.y, FLOOR, 1);
  const bag = (x: number, y: number) => {
    box(x - 6, y, 12, 9, 2.5, { fill: COL.earth, fa: 0.3, stroke: COL.line, w: W.hair });
    poly([[x - 3, y], [x - 2, y - 3], [x + 2, y - 3], [x + 3, y]], { stroke: COL.line, w: W.hair });
  };
  const seatedNow = !day || t < T.stand;
  if (seatedNow && !standing) bag(160, FLOOR - 9);
  if (standing !== (day && !seatedNow)) return;
  if (!day) {
    // tired and slumped over the keyboard; after the click, a start of surprise and then a lean back
    const slump = 0.2 + 0.12 * Math.sin(seg(t, 2.2, 3.4) * Math.PI);
    if (t < T.click + 0.1) seated(SEAT.x, SEAT.y, FLOOR, { t, pose: 'type', lean: slump });
    else seated(SEAT.x, SEAT.y, FLOOR, { t, pose: 'lean', lean: t < T.click + 0.5 ? 0 : -0.13 * ease(seg(t, T.click + 0.5, T.click + 1.1)) });
    return;
  }
  if (t < T.stand) {
    const press = Math.sin(seg(t, T.decide - 0.25, T.decide + 0.05) * Math.PI);
    seated(SEAT.x, SEAT.y, FLOOR, { t: 0, pose: 'type', lean: 0.06, press });
    if (t > T.decide && t < T.decide + 0.5) circle(SEAT.x + 19, SEAT.y - 12, 3 + seg(t, T.decide, T.decide + 0.5) * 8, { stroke: COL.mint, w: W.hair, a: 1 - seg(t, T.decide, T.decide + 0.5) });
    return;
  }
  const G = ctx();
  const wk = ease(seg(t, T.walk[0], T.walk[1]));
  const x = SEAT.x + 4 + (DOOR.x + DOOR.w / 2 - SEAT.x - 4) * wk;
  const pose = t < T.walk[0] ? 'stand' : t < T.walk[1] ? 'walk' : t < T.thanks[1] ? 'thumbs' : 'walk';
  const facing = t >= T.walk[1] && t < T.thanks[1] ? -1 : 1;
  G.save();
  G.globalAlpha = 1 - seg(t, T.exit[0] + 0.1, T.exit[1]);
  const hand = person(x, FLOOR + 1, { t, pose, facing, shirt: COL.sky });
  if (pose !== 'thumbs') bag(hand[0], hand[1] + 2);
  G.restore();
}

function starAt(t: number, day: boolean) {
  if (day) { brandStar(PERCH[0], PERCH[1] + Math.sin(t * 3) * 1.5, 7, t); return; }
  if (t < T.starIn[0]) return;
  if (t < T.starIn[1]) {
    // a light that moves across the night sky, seen through the window
    const k = seg(t, T.starIn[0], T.starIn[1]);
    brandStar(WIN.x + 22 + k * 90, WIN.y + 30 + Math.sin(k * 3) * 6, 2.5 + k * 1.5, t, seg(k, 0, 0.3));
    return;
  }
  const k = ease(seg(t, T.starFly[0], T.starFly[1]));
  const x0 = WIN.x + 112, y0 = WIN.y + 30;
  const x = x0 + (PERCH[0] - x0) * k, y = y0 + (PERCH[1] - y0) * k - Math.sin(k * Math.PI) * 30;
  brandStar(x, y + (k >= 1 ? Math.sin(t * 3) * 1.5 : 0), 4 + 3 * k, t);
}

export const financeLineScene: PixelScene<LineState | undefined> = (g, time, state) => {
  const t = time % FIN_LINE_LOOP;
  const lang = state?.lang ?? 'es';
  begin(g);
  const day = t >= (T.lapse[0] + T.lapse[1]) / 2;
  room(t, day);
  door(day ? seg(t, T.thanks[1] - 0.2, T.exit[0]) * (1 - seg(t, T.exit[1] + 0.1, T.exit[1] + 0.5)) : 0);
  analyst(t, day, false);
  desk();
  monitor(t, day, lang);
  stack(t, day);
  analyst(t, day, true);
  starAt(t, day);
  if (!day) {
    clickRing(MON.x + MON.w / 2, MON.y + MON.h / 2, seg(t, T.click, T.click + 0.6));
    ledger(t, lang);
  }
  // the dots connect: the pile -> validated -> flagged for a person -> on time -> the star
  const k = seg(t, T.dots[0], T.dots[1]);
  if (k > 0) {
    fade(0.35 * seg(t, T.dots[0], T.dots[0] + 0.5));
    constellation([[60, 92], [140, 60], [222, 88], [304, 58], [384, 86]], k, t, [
      (x, y, a) => docGlyph(x, y, COL.line, a),
      (x, y, a) => check(x - 3.5, y, 0.55, COL.mint, a, W.base),
      (x, y, a) => flagGlyph(x, y, COL.gold, a),
      (x, y, a) => clockGlyph(x, y, COL.mint, a),
    ]);
  }
  // time-lapse (night -> next afternoon), the loop's end, and the start of every loop after the first
  fade(Math.max(Math.sin(seg(t, T.lapse[0], T.lapse[1]) * Math.PI), seg(t, 16.1, 16.5), time >= FIN_LINE_LOOP ? 1 - seg(t, 0, 0.3) : 0));
};
