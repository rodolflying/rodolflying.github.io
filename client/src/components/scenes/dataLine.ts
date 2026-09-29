// Data & web story, executive style, told as the service actually works:
// an administrator keys forms into a portal one by one while the days go by and the pile of
// pending forms barely shrinks -> the star opens several portal windows that fill in cascade
// and the pile empties, while she only reviews -> Friday 17:00: she helps a colleague and
// leaves on time -> the dots connect.
import type { PixelScene } from '../pixel/PixelCanvas';
import {
  COL, W, LW, LH, arc, begin, box, brandStar, check, circle, clamp, clickRing, constellation, ctx, ease, fade,
  line, mixHex, rgba, person, poly, seg, status, text, type LineState, type SceneCaptionDef, limb
} from './lineKit';

export const DATA_LINE_LOOP = 16.5;

const T = {
  days: [0.4, 4.4] as [number, number], form: 1.4,
  star: [4.7, 5.3] as [number, number], click: 5.5,
  pop: [5.8, 6.5] as [number, number], fill: [6.3, 8.8] as [number, number], cycle: 0.7,
  review: [9.0, 9.9] as [number, number],
  lapse: [9.9, 10.7] as [number, number],
  ask: [10.9, 11.6] as [number, number], answer: [11.4, 12.2] as [number, number],
  visitorOut: [12.1, 13.0] as [number, number],
  standUp: 12.3, walk: [12.5, 13.6] as [number, number], wave: [13.6, 14.0] as [number, number], out: [14.0, 14.35] as [number, number],
  dots: [14.4, 16.1] as [number, number],
};
/** Poster frame: every portal window sent, the pile gone, and she reviews the result. */
export const DATA_LINE_STILL = 9.5;

export const DATA_LINE_CAPTIONS: SceneCaptionDef[] = [
  { from: 0.3, to: 2.5, time: { es: 'Lunes 09:00', en: 'Monday 09:00' }, es: 'Cada formulario se carga a mano en el portal', en: 'Each form is keyed into the portal by hand' },
  { from: 2.6, to: 4.7, time: { es: 'Miércoles 18:00', en: 'Wednesday 18:00' }, es: 'Pasan los días y la pila casi no baja', en: 'Days go by and the pile barely shrinks' },
  { from: 4.9, to: 9.9, time: { es: 'Miércoles 18:05', en: 'Wednesday 18:05' }, es: 'El lote se carga solo y ella solo revisa', en: 'The batch files itself; she just reviews' },
  { from: 10.9, to: 14.3, time: { es: 'Viernes 17:00', en: 'Friday 17:00' }, es: 'Atiende a las personas y sale a su hora', en: 'She helps people and leaves on time' },
  { from: 14.4, to: 16.3, es: 'Su tiempo vuelve a lo que importa', en: 'Her time goes back to what matters' },
];

const WORDS = {
  es: { portal: 'Portal', fields: ['Nombre', 'Fecha', 'Monto'], sent: 'Enviado', pending: 'Pendientes', noneLeft: 'Sin pendientes', running: 'En curso', done: 'Listo', upToDate: 'Al día', days: ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE'] },
  en: { portal: 'Portal', fields: ['Name', 'Date', 'Amount'], sent: 'Sent', pending: 'Pending', noneLeft: 'Nothing pending', running: 'Running', done: 'Done', upToDate: 'Up to date', days: ['MON', 'TUE', 'WED', 'THU', 'FRI'] },
};
type Words = typeof WORDS.es;

const FLOOR = 214;
const ADMIN_X = 96;
const DESK = { x: 118, top: 182, w: 186 };
const MON = { x: 146, y: 102, w: 100, h: 66 };
const PILE = { x: 256, w: 38, max: 17 };
const WINS = [{ x: 234, y: 48 }, { x: 312, y: 42 }, { x: 390, y: 48 }];
const WIN_W = 74, WIN_H = 66;
const DOOR = { x: 420, y: 124, w: 36 };

// ---------------------------------------------------------------- the week's clock
/** Hours since Monday 00:00: Monday 09:00 -> Wednesday 18:00 by hand, a couple of hours for the batch, then Friday 17:00. */
function hoursAt(t: number) {
  if (t >= (T.lapse[0] + T.lapse[1]) / 2) return 4 * 24 + 17;
  if (t < T.star[1]) return 9 + (66 - 9) * ease(seg(t, T.days[0], T.days[1])) + seg(t, T.days[1], T.star[1]) * (5 / 60);
  return 66 + 5 / 60 + 2 * seg(t, T.fill[0], T.fill[1]);
}
/** Daylight in the window: 0 night, 1 noon. */
const daylight = (h: number) => clamp(Math.sin((((h % 24) - 6) / 12) * Math.PI) * 1.2);

// ---------------------------------------------------------------- local helpers (candidates for the kit)
/** A limb in the kit's style: outline plus soft fill (the kit's own `limb` is private). */
/** Hair with a bun, over a kit head at (x, hy), for the facing direction. */
function hair(x: number, hy: number, f: 1 | -1, a = 1) {
  const pts: Array<[number, number]> = [];
  for (let i = 0; i <= 12; i++) { const ang = Math.PI * (0.62 + (1.28 * i) / 12); pts.push([x + f * Math.cos(ang) * 8.2, hy + Math.sin(ang) * 8.2]); }
  for (let i = 12; i >= 0; i--) { const ang = Math.PI * (0.7 + (1.12 * i) / 12); pts.push([x + f * Math.cos(ang) * 5.6 - f * 1.2, hy - 1.4 + Math.sin(ang) * 5.6]); }
  circle(x - f * 8.5, hy - 3.5, 3.4, { fill: COL.earth, fa: 0.9, stroke: COL.line, w: W.hair, a });
  poly(pts, { fill: COL.earth, fa: 0.9, stroke: COL.line, w: W.hair, a }, true);
}
/** Office chair on castors, seen from the side, for a person facing right at x. */
function chair(x: number) {
  box(x - 15, 162, 5, 32, 2, { fill: COL.bg2, stroke: COL.line, w: W.base });
  box(x - 12, 192, 24, 5, 2, { fill: COL.bg2, stroke: COL.line, w: W.base });
  line(x, 197, x, 208, COL.soft, W.base);
  line(x - 11, 209, x + 11, 209, COL.soft, W.base);
  circle(x - 10, 211.5, 1.8, { fill: COL.bg, stroke: COL.soft, w: W.hair });
  circle(x + 10, 211.5, 1.8, { fill: COL.bg, stroke: COL.soft, w: W.hair });
}
type Arms = 'type' | 'rest' | 'hold';
/**
 * A seated figure facing right at a desk, in the kit's limb style; the hips sit at (x, 191).
 * `type` puts the hands on the keyboard, `rest` on the lap, `hold` raises a sheet to read.
 * Returns the front hand.
 */
function seated(x: number, o: { t: number; arms: Arms; shirt: string }): [number, number] {
  const hip = 191, sh = 169, head = 160;
  const bob = o.arms === 'type' ? Math.sin(o.t * 22) * 0.8 : 0;
  for (const d of [-2, 0]) {
    limb(x + d, hip, x + 17 + d, hip, COL.trousers, 4.2);
    limb(x + 17 + d, hip, x + 18 + d, FLOOR - 3, COL.trousers, 4.2);
    box(x + 16 + d, FLOOR - 3.5, 7, 3.5, 1.5, { fill: COL.bg2, stroke: COL.line, w: W.hair });
  }
  const elbow: [number, number] = o.arms === 'type' ? [x + 10, sh + 15] : o.arms === 'rest' ? [x + 6, sh + 16] : [x + 10, sh + 16];
  const hand: [number, number] = o.arms === 'type' ? [x + 34, sh + 11 + bob] : o.arms === 'rest' ? [x + 16, sh + 20] : [x + 20, sh + 5];
  if (o.arms === 'type') { limb(x - 2, sh + 3, x + 6, sh + 15, o.shirt); limb(x + 6, sh + 15, x + 29, sh + 12 - bob, COL.skin, 3); }
  box(x - 8, sh - 2, 16, 24, 6, { fill: COL.bg2, stroke: COL.line, w: W.base });
  box(x - 8, sh - 2, 16, 24, 6, { fill: o.shirt, fa: 0.3 });
  limb(x + 5, sh + 3, elbow[0], elbow[1], o.shirt);
  limb(elbow[0], elbow[1], hand[0], hand[1], COL.skin, 3);
  circle(hand[0], hand[1], 2.4, { fill: COL.skin, stroke: COL.line, w: W.hair });
  const hy = head + (o.arms === 'type' ? Math.sin(o.t * 3) * 0.4 : 0);
  circle(x, hy, 7, { fill: COL.skin, fa: 0.85, stroke: COL.line, w: W.base });
  hair(x, hy, 1);
  circle(x + 3, hy - 0.5, 0.9, { fill: COL.bg });
  return hand;
}
/** A sheet of paper, (x, y) = top-left, 10x13, with text lines and an optional check. */
function sheet(x: number, y: number, a = 1, ck = 0) {
  box(x, y, 10, 13, 1.5, { fill: COL.panel, stroke: COL.line, w: W.hair, a });
  for (let i = 0; i < 3; i++) line(x + 2.5, y + 3.5 + i * 2.6, x + 7.5 - (i === 2 ? 2 : 0), y + 3.5 + i * 2.6, COL.soft, W.hair, a * 0.8);
  if (ck > 0) check(x + 2.5, y + 10.5, 0.45, COL.mint, ck, W.base);
}
/** A speech bubble 26x17 at (x, y) with its tail toward `tail` (-1 left, 1 right). */
function bubble(x: number, y: number, tail: 1 | -1, a: number, content: (cx: number, cy: number) => void) {
  if (a <= 0) return;
  const tx = tail > 0 ? x + 20 : x + 6;
  poly([[tx - 3, y + 16], [tx + tail * 6, y + 23], [tx + 3, y + 16]], { fill: COL.panel, stroke: COL.soft, w: W.hair, a }, true);
  box(x, y, 26, 17, 7, { fill: COL.panel, stroke: COL.soft, w: W.hair, a });
  content(x + 13, y + 8.5);
}
/** Draw `fn` scaled by k about (cx, cy), used to pop windows out of the monitor. */
function scaled(cx: number, cy: number, k: number, fn: () => void) {
  const g = ctx();
  g.save();
  g.translate(cx, cy); g.scale(k, k); g.translate(-cx, -cy);
  fn();
  g.restore();
}

// ---------------------------------------------------------------- the office
function officeWindow(h: number) {
  const x = 22, y = 40, w = 64, hh = 76, d = daylight(h);
  const g = ctx();
  const gr = g.createLinearGradient(0, y, 0, y + hh);
  gr.addColorStop(0, mixHex('#060A16', '#2C4A86', d)); gr.addColorStop(1, mixHex('#111C33', '#C7A27F', d));
  g.fillStyle = gr; g.fillRect(x, y, w, hh);
  if (d < 0.4) for (let i = 0; i < 7; i++) circle(x + 5 + ((i * 23.7) % (w - 10)), y + 6 + ((i * 13.1) % 30), 0.7, { fill: COL.soft, a: 1 - d / 0.4 });
  const pts: Array<[number, number]> = [[x, y + hh]];
  for (let xx = x; xx <= x + w; xx += 4) pts.push([xx, y + hh - 16 - Math.sin(xx * 0.09) * 5 - Math.sin(xx * 0.23) * 2]);
  pts.push([x + w, y + hh]);
  poly(pts, { fill: mixHex('#131D33', '#5A4A5E', d), fa: 1 }, true);
  line(x + w / 2, y, x + w / 2, y + hh, COL.soft, W.hair);
  line(x, y + hh / 2, x + w, y + hh / 2, COL.soft, W.hair);
  box(x, y, w, hh, 2, { stroke: COL.line, w: W.base });
  line(x - 5, y + hh + 1.5, x + w + 5, y + hh + 1.5, COL.line, W.base);
}
function calendar(h: number, L: Words) {
  const x = 102, y = 46, w = 36, hh = 40;
  const day = Math.min(4, Math.floor(h / 24));
  box(x, y, w, hh, 3, { fill: COL.panel, stroke: COL.line, w: W.base });
  box(x, y, w, 11, 3, { fill: COL.coral, fa: 0.5 });
  line(x, y + 11, x + w, y + 11, COL.line, W.hair);
  circle(x + 10, y, 1.6, { fill: COL.bg, stroke: COL.soft, w: W.hair });
  circle(x + w - 10, y, 1.6, { fill: COL.bg, stroke: COL.soft, w: W.hair });
  text(L.days[day], x + w / 2, y + 26, { size: 12, weight: 700, font: 'display', color: day === 4 ? COL.mint : COL.white, align: 'center' });
  // yesterday's page drops off at midnight
  const k = (h - day * 24) / 6;
  if (day > 0 && day < 4 && k < 1) {
    const px = x + k * 16, py = y + 11 + k * k * 60;
    box(px, py, w * (1 - k * 0.5), hh - 11, 2, { fill: COL.panel, stroke: COL.soft, w: W.hair, a: 1 - k });
  }
}
function wallClock(h: number) {
  const x = 170, y = 64, r = 13;
  circle(x, y, r, { fill: COL.panel, stroke: COL.line, w: W.base });
  for (let i = 0; i < 4; i++) { const a = (i * Math.PI) / 2; line(x + Math.cos(a) * (r - 3), y + Math.sin(a) * (r - 3), x + Math.cos(a) * (r - 1.5), y + Math.sin(a) * (r - 1.5), COL.soft, W.hair); }
  const am = (h % 1) * Math.PI * 2 - Math.PI / 2, ah = ((h % 12) / 12) * Math.PI * 2 - Math.PI / 2;
  line(x, y, x + Math.cos(ah) * 6.5, y + Math.sin(ah) * 6.5, COL.white, W.emph);
  line(x, y, x + Math.cos(am) * 10, y + Math.sin(am) * 10, COL.soft, W.base);
  circle(x, y, 1.3, { fill: COL.gold });
}
function door(open: boolean) {
  const { x, y, w } = DOOR, hh = FLOOR - y;
  if (open) {
    box(x, y, w, hh, 1, { fill: COL.bg, stroke: COL.line, w: W.base });
    poly([[x + w, y], [x + w + 9, y + 6], [x + w + 9, FLOOR - 3], [x + w, FLOOR]], { fill: COL.bg2, stroke: COL.line, w: W.hair }, true);
  } else {
    box(x, y, w, hh, 1, { fill: COL.bg2, stroke: COL.line, w: W.base });
    box(x + 6, y + 8, w - 12, 30, 2, { stroke: COL.faint, w: W.hair });
    circle(x + w - 7, y + 50, 1.8, { fill: COL.gold, fa: 0.6, stroke: COL.gold, w: W.hair });
  }
}
/** A low filing cabinet with binders: the paperwork the story is about. */
function cabinet() {
  const x = 326, y = 164, w = 64;
  box(x, y, w, FLOOR - y, 2, { fill: COL.bg2, stroke: COL.line, w: W.base });
  line(x, y + 25, x + w, y + 25, COL.faint, W.hair);
  for (let i = 0; i < 2; i++) box(x + w / 2 - 7, y + 10 + i * 25, 14, 3, 1.5, { stroke: COL.soft, w: W.hair });
  const cols = [COL.sky, COL.gold, COL.soft, COL.sky, COL.coral, COL.soft];
  cols.forEach((c, i) => box(x + 6 + i * 9, y - 22 + (i % 2) * 2, 7, 22 - (i % 2) * 2, 1.5, { fill: c, fa: 0.2, stroke: COL.line, w: W.hair }));
}
function desk() {
  line(DESK.x + 6, DESK.top + 5, DESK.x + 6, FLOOR, COL.line, W.base);
  box(DESK.x + DESK.w - 46, DESK.top + 5, 40, FLOOR - DESK.top - 5, 2, { fill: COL.bg2, stroke: COL.line, w: W.base });
  line(DESK.x + DESK.w - 46, DESK.top + 18, DESK.x + DESK.w - 6, DESK.top + 18, COL.faint, W.hair);
  box(DESK.x, DESK.top, DESK.w, 5, 2, { fill: COL.panel, stroke: COL.line, w: W.base });
  box(128, DESK.top - 3, 30, 3, 1, { fill: COL.bg2, stroke: COL.soft, w: W.hair });
  // monitor
  box(MON.x + MON.w / 2 - 4, MON.y + MON.h, 8, DESK.top - MON.y - MON.h, 1, { fill: COL.bg2, stroke: COL.line, w: W.hair });
  box(MON.x + MON.w / 2 - 13, DESK.top - 2.5, 26, 2.5, 1, { fill: COL.bg2, stroke: COL.line, w: W.hair });
  box(MON.x, MON.y, MON.w, MON.h, 5, { fill: COL.bg2, stroke: COL.line, w: W.base });
  box(MON.x + 4, MON.y + 4, MON.w - 8, MON.h - 8, 3, { fill: COL.panel });
}
/** The pile of pending forms, n sheets high. Returns the top of the pile. */
function pile(n: number) {
  const y0 = DESK.top - 1;
  box(PILE.x - 2, y0 - 3, PILE.w + 4, 3, 1, { stroke: COL.soft, w: W.hair });
  for (let i = 0; i < n; i++) box(PILE.x + (i % 3) * 0.8, y0 - 2.3 * (i + 1) - 1, PILE.w - 2, 2.3, 0.6, { fill: COL.panel, stroke: COL.soft, w: W.hair });
  return y0 - 2.3 * n - 1;
}
/** The "Pending" tag above the pile: a bar that empties, then a status. */
function pendingTag(frac: number, L: Words, doneLabel: string | null) {
  const x = PILE.x - 2, y = 118;
  if (doneLabel) { status(x, y + 7, 'ok', doneLabel); return; }
  text(L.pending, x, y + 3, { size: 9, weight: 600, color: COL.soft });
  box(x, y + 10, 46, 4, 2, { stroke: COL.faint, w: W.hair });
  if (frac > 0) box(x, y + 10, 46 * frac, 4, 2, { fill: frac > 0.5 ? COL.gold : COL.mint, fa: 0.8 });
}

// ---------------------------------------------------------------- the portal forms
/** The monitor while she keys forms by hand: one field at a time, a check at the end. */
function screenByHand(t: number, L: Words) {
  const x = MON.x + 10, y = MON.y + 12;
  text(L.portal, x, y, { size: 9, weight: 600, color: COL.soft });
  line(MON.x + 6, y + 7, MON.x + MON.w - 6, y + 7, COL.faint, W.hair);
  const p = (t % T.form) / T.form;
  L.fields.forEach((f, r) => {
    const ry = y + 17 + r * 12;
    text(f, x, ry, { size: 9, color: COL.soft });
    box(x + 40, ry - 4, 38, 8, 2, { stroke: COL.dim, w: W.hair });
    const fk = seg(p, r * 0.28, r * 0.28 + 0.26);
    if (fk > 0) box(x + 41.5, ry - 2.5, 35 * fk, 5, 1.5, { fill: COL.soft, fa: 0.45 });
    if (fk > 0 && fk < 1 && Math.floor(t * 6) % 2) line(x + 42 + 35 * fk, ry - 3, x + 42 + 35 * fk, ry + 3, COL.white, W.hair);
  });
  const ck = seg(p, 0.86, 0.95);
  if (ck > 0) check(x + 64, y + 1, 0.55, COL.mint, ck, W.base);
}
function screenAuto(t: number, L: Words, friday: boolean) {
  const x = MON.x + 10, y = MON.y + 12;
  text(L.portal, x, y, { size: 9, weight: 600, color: COL.soft });
  line(MON.x + 6, y + 7, MON.x + MON.w - 6, y + 7, COL.faint, W.hair);
  const done = friday || t >= T.fill[1];
  for (let i = 0; i < 3; i++) box(x + i * 10, y + 16, 8, 6, 1.5, { stroke: done ? COL.mint : COL.soft, w: W.hair, fill: done ? COL.mint : undefined, fa: 0.2 });
  if (done) status(x, y + 36, 'ok', friday ? L.upToDate : L.done);
  else status(x, y + 36, 'busy', L.running, 0.6 + 0.4 * Math.abs(Math.sin(t * 4)));
}
/** One floating portal window at (x, y): fields fill in cascade, form after form, then "Sent". */
function portalWindow(x: number, y: number, i: number, t: number, L: Words) {
  box(x, y, WIN_W, WIN_H, 8, { fill: COL.panel, stroke: COL.sky, w: W.base });
  line(x, y + 14, x + WIN_W, y + 14, COL.faint, W.hair);
  for (let d = 0; d < 3; d++) circle(x + 9 + d * 6, y + 7, 1.6, { fill: COL.dim });
  text(L.portal, x + WIN_W - 7, y + 7.5, { size: 9, weight: 600, color: COL.soft, align: 'right' });
  const start = T.fill[0] + i * 0.2, cycles = 3;
  const local = t - start;
  const c = Math.min(cycles - 1, Math.floor(Math.max(0, local) / T.cycle));
  const p = local < 0 ? 0 : clamp((local - c * T.cycle) / T.cycle);
  L.fields.forEach((f, r) => {
    const ry = y + 24 + r * 11;
    text(f, x + 6, ry, { size: 9, color: COL.soft });
    box(x + 44, ry - 4, 24, 8, 2, { stroke: COL.dim, w: W.hair });
    const fk = seg(p, r * 0.18, r * 0.18 + 0.18);
    if (fk > 0) box(x + 45.5, ry - 2.5, 21 * fk, 5, 1.5, { fill: COL.mint, fa: 0.55 });
  });
  const ck = seg(p, 0.62, 0.8);
  const last = c === cycles - 1;
  if (ck > 0) {
    check(x + 7, y + 57, 0.6, COL.mint, ck, W.base);
    text(L.sent, x + 18, y + 57.5, { size: 9, weight: 600, color: COL.mint, a: last ? ck : ck * (1 - seg(p, 0.92, 1)) });
  }
}
/** Sheets leaving the pile for each window at the start of each of its forms. */
function flyingSheets(t: number, pileTop: number) {
  WINS.forEach((w, i) => {
    for (let c = 0; c < 3; c++) {
      const at = T.fill[0] + i * 0.2 + c * T.cycle - 0.32;
      const k = ease(seg(t, at, at + 0.32));
      if (k <= 0 || k >= 1) continue;
      const sx = PILE.x + 14, sy = pileTop - 12, tx = w.x + WIN_W / 2 - 5, ty = w.y + WIN_H / 2 - 6;
      sheet(sx + (tx - sx) * k, sy + (ty - sy) * k - Math.sin(k * Math.PI) * 16, 1 - k * 0.6);
    }
  });
}

// ---------------------------------------------------------------- the scenes
function room(h: number, L: Words, openDoor: boolean) {
  box(0, 0, LW, FLOOR, 0, { fill: COL.bg2 });
  box(0, FLOOR, LW, LH - FLOOR, 0, { fill: COL.bg });
  line(0, FLOOR, LW, FLOOR, COL.dim, W.hair);
  for (let i = 0; i < 9; i++) line(20 + i * 56, FLOOR + 14 + (i % 3) * 9, 44 + i * 56, FLOOR + 14 + (i % 3) * 9, COL.faint, W.hair);
  officeWindow(h);
  calendar(h, L);
  wallClock(h);
  door(openDoor);
  cabinet();
  // desk lamp light on the wall, warmer at night
  const g = ctx(), gr = g.createRadialGradient(ADMIN_X + 40, 150, 4, ADMIN_X + 40, 150, 80);
  gr.addColorStop(0, rgba(COL.gold, 0.05 + 0.05 * (1 - daylight(h)))); gr.addColorStop(1, rgba(COL.gold, 0));
  g.fillStyle = gr; g.fillRect(ADMIN_X - 40, 70, 160, FLOOR - 70);
}

function midweek(t: number, L: Words) {
  const h = hoursAt(t);
  room(h, L, false);
  chair(ADMIN_X);
  desk();
  const auto = t >= T.click;
  // the pile: barely moves by hand, empties once the batch runs
  const n = auto ? Math.round(16 * (1 - seg(t, T.fill[0] - 0.3, T.fill[1] - 0.2))) : Math.round(PILE.max - 1.4 * seg(t, 0, T.star[1]));
  const top = pile(n);
  pendingTag(n / PILE.max, L, t >= T.fill[1] ? L.noneLeft : null);
  if (auto) screenAuto(t, L, false);
  else screenByHand(t, L);
  // the admin: typing, then hands off, then reviewing one result
  const arms: Arms = t < T.click + 0.2 ? 'type' : t < T.review[0] ? 'rest' : 'hold';
  const hand = seated(ADMIN_X, { t, arms, shirt: COL.sky });
  if (arms === 'hold') sheet(hand[0] - 3, hand[1] - 15, 1, seg(t, T.review[0] + 0.35, T.review[0] + 0.6));
  // the star arrives and clicks the portal
  const sk = ease(seg(t, T.star[0], T.star[1]));
  if (t >= T.star[0]) {
    const rx = MON.x + MON.w - 30, ry = MON.y - 14;
    const sx = -10 + (rx + 10) * sk, sy = 24 + (ry - 24) * sk - Math.sin(sk * Math.PI) * 22;
    brandStar(sx, sy + (sk >= 1 ? Math.sin(t * 3) * 1.5 : 0), 9, t);
  }
  clickRing(MON.x + MON.w / 2, MON.y + MON.h / 2, seg(t, T.click, T.click + 0.6));
  // several portal windows pop out of the monitor and work in parallel
  WINS.forEach((w, i) => {
    const k = ease(seg(t, T.pop[0] + i * 0.15, T.pop[0] + i * 0.15 + 0.4));
    if (k <= 0) return;
    const mx = MON.x + MON.w / 2, my = MON.y + MON.h / 2;
    const cx = mx + (w.x + WIN_W / 2 - mx) * k, cy = my + (w.y + WIN_H / 2 - my) * k;
    const g = ctx();
    g.save(); g.globalAlpha = k;
    scaled(cx, cy, 0.25 + 0.75 * k, () => portalWindow(cx - WIN_W / 2, cy - WIN_H / 2, i, t, L));
    g.restore();
  });
  flyingSheets(t, top);
}

/** A standing figure that fades out while crossing the doorway. */
function walker(x: number, o: Parameters<typeof person>[2], withHair: boolean) {
  const a = 1 - seg(x, DOOR.x + 10, DOOR.x + 26);
  if (a <= 0) return;
  const g = ctx();
  g.save(); g.globalAlpha = a;
  person(x, FLOOR, o);
  if (withHair) hair(x, FLOOR - 53, o.facing ?? 1);
  if (withHair) circle(x + (o.facing ?? 1) * 3, FLOOR - 53.5, 0.9, { fill: COL.bg });
  g.restore();
}

function friday(t: number, L: Words) {
  const h = hoursAt(t);
  room(h, L, true);
  chair(ADMIN_X);
  desk();
  pile(0);
  pendingTag(0, L, L.noneLeft);
  screenAuto(t, L, true);
  // a colleague asks, she answers
  const vk = ease(seg(t, T.visitorOut[0], T.visitorOut[1]));
  const leaving = t >= T.visitorOut[0];
  walker(340 + (DOOR.x + 30 - 340) * vk, { t, pose: leaving ? 'walk' : 'stand', facing: leaving ? 1 : -1, shirt: COL.gold }, false);
  const qa = Math.min(seg(t, T.ask[0], T.ask[0] + 0.2), 1 - seg(t, T.ask[1] - 0.2, T.ask[1]));
  bubble(334, 126, -1, qa, (cx, cy) => text('?', cx, cy + 0.5, { size: 11, weight: 700, color: COL.gold, align: 'center', a: qa }));
  const aa = Math.min(seg(t, T.answer[0], T.answer[0] + 0.2), 1 - seg(t, T.answer[1] - 0.2, T.answer[1]));
  bubble(104, 124, 1, aa, (cx, cy) => check(cx - 4.5, cy, 0.6, COL.mint, seg(t, T.answer[0] + 0.1, T.answer[0] + 0.4), W.base));
  // Friday 17:00: she stands up and leaves on time
  if (t < T.standUp) seated(ADMIN_X, { t, arms: 'rest', shirt: COL.sky });
  else {
    const wk = ease(seg(t, T.walk[0], T.walk[1]));
    const x = ADMIN_X + 6 + (DOOR.x + 12 - ADMIN_X - 6) * wk;
    const waving = t >= T.wave[0] && t < T.wave[1];
    const px = t >= T.out[0] ? x + 18 * seg(t, T.out[0], T.out[1]) : x;
    walker(px, { t, pose: waving ? 'thumbs' : t >= T.walk[0] && t < T.walk[1] || t >= T.out[0] ? 'walk' : 'stand', facing: waving ? -1 : 1, shirt: COL.sky }, true);
  }
  // the dots connect: forms by hand -> days lost -> portals in parallel -> the person -> the star
  const k = seg(t, T.dots[0], T.dots[1]);
  if (k > 0) {
    fade(0.4 * seg(t, T.dots[0], T.dots[0] + 0.5));
    constellation([[60, 92], [140, 58], [220, 88], [300, 56], [376, 84]], k, t, [
      (x, y, a) => sheet(x - 5, y - 6.5, a),
      (x, y, a) => {
        circle(x, y, 5, { stroke: COL.soft, w: W.hair, a });
        line(x, y, x, y - 3.5, COL.soft, W.hair, a); line(x, y, x + 2.5, y + 1, COL.soft, W.hair, a);
      },
      (x, y, a) => {
        box(x - 6, y - 5, 9, 7, 1.5, { stroke: COL.sky, w: W.hair, a });
        box(x - 3, y - 2, 9, 7, 1.5, { fill: COL.bg, stroke: COL.sky, w: W.hair, a });
        check(x - 1, y + 1.5, 0.35, COL.mint, a, W.hair);
      },
      (x, y, a) => {
        circle(x, y - 2.5, 2.6, { fill: COL.skin, fa: 0.85, stroke: COL.line, w: W.hair, a });
        arc(x, y + 5, 4.5, Math.PI * 1.1, Math.PI * 1.9, { stroke: COL.line, w: W.hair, a });
      },
    ]);
  }
}

export const dataLineScene: PixelScene<LineState | undefined> = (g, time, state) => {
  const t = time % DATA_LINE_LOOP;
  const L = WORDS[state?.lang ?? 'es'];
  begin(g);
  if (t < (T.lapse[0] + T.lapse[1]) / 2) midweek(t, L);
  else friday(t, L);
  // time-lapse (Wednesday -> Friday), the loop's end, and the start of every loop after the first
  fade(Math.max(Math.sin(seg(t, T.lapse[0], T.lapse[1]) * Math.PI), seg(t, DATA_LINE_LOOP - 0.4, DATA_LINE_LOOP), time >= DATA_LINE_LOOP ? 1 - seg(t, 0, 0.3) : 0));
};
