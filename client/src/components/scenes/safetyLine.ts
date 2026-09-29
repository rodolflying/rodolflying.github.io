// Safety story, executive style: "the alert that no longer gets lost".
// Control room at night: fatigue alerts pop up and vanish while the operator is on another
// call -> the alerts panel: the star keeps the alert active and escalates it by protocol; the
// driver gets the message in the cab and pulls over for a break; the log fills itself ->
// morning, shift change: every alert handled and on record, nothing typed -> the dots connect.
import type { PixelScene } from '../pixel/PixelCanvas';
import {
  COL, W, LW, LH, arc, begin, box, brandStar, check, circle, clamp, clickRing, clockChip, constellation, ctx, desert,
  ease, fade, line, mountains, panel, person, pit, poly, seg, sky, stars, status, text,
  type Lang, type LineState, type SceneCaptionDef,
} from './lineKit';

export const SAFETY_LINE_LOOP = 16.5;

const T = {
  alerts: [[0.9, 2.0], [2.3, 3.3]] as Array<[number, number]>,
  dashIn: [3.5, 4.0] as [number, number], panelIn: [3.8, 4.4] as [number, number],
  star: [4.5, 5.1] as [number, number], click: 5.3,
  card: [5.5, 5.9] as [number, number], notify: 6.0,
  inset: [6.0, 6.4] as [number, number], beam: [6.1, 6.9] as [number, number], cabAlert: 6.6,
  brake: [6.9, 7.6] as [number, number], ack: 7.7, cup: 8.0, log: 8.2,
  lapse: [9.9, 10.7] as [number, number],
  walk: [11.0, 12.2] as [number, number], read: [12.2, 13.2] as [number, number], thumbs: [13.2, 14.1] as [number, number],
  dots: [14.2, 16.0] as [number, number],
};
/** Poster frame: the alert handled, the protocol checked off, the driver on a break with a coffee. */
export const SAFETY_LINE_STILL = 9.2;

export const SAFETY_LINE_CAPTIONS: SceneCaptionDef[] = [
  { from: 0.3, to: 3.5, time: '02:10', es: 'Una alerta de fatiga aparece y se pierde', en: 'A fatigue alert pops up and gets lost' },
  { from: 4.2, to: 6.9, time: '02:11', es: 'La alerta sigue activa y se escala por protocolo', en: 'The alert stays active and escalates by protocol' },
  { from: 7.0, to: 10.0, time: '02:13', es: 'El conductor recibe el aviso y hace una pausa', en: 'The driver gets the message and takes a break' },
  { from: 11.1, to: 14.1, time: '07:30', es: 'Cambio de turno: todas atendidas y registradas', en: 'Shift change: every alert handled and logged' },
  { from: 14.3, to: 16.2, es: 'Ninguna alerta queda sin respuesta', en: 'No alert goes unanswered' },
];

const WORDS = {
  es: {
    alerts: 'Alertas de fatiga', unit: 'Camión', fatigue: 'Fatiga', missed: 'Perdidas', normal: 'Normal', active: 'Activa',
    handled: 'Atendida', onRoad: 'En ruta', onBreak: 'En pausa', protocol: 'Protocolo', cab: 'Cabina', rest: 'Pausa',
    steps: ['Aviso en cabina', 'Pausa confirmada', 'Bitácora automática'], night: 'Turno de noche', all: 'Todas atendidas',
  },
  en: {
    alerts: 'Fatigue alerts', unit: 'Truck', fatigue: 'Fatigue', missed: 'Missed', normal: 'Normal', active: 'Active',
    handled: 'Handled', onRoad: 'On the road', onBreak: 'On a break', protocol: 'Protocol', cab: 'Cab', rest: 'Break',
    steps: ['Cab alert sent', 'Break confirmed', 'Logged automatically'], night: 'Night shift', all: 'All handled',
  },
};
type Words = typeof WORDS.es;

const FLOOR_TOP = 204;
const FLOOR = 222;
const SEAT = 198;
const OPX = 128;
const DESK = { x: 160, y: 186, w: 196 };
const WIN = { x: 24, y: 40, w: 132, h: 80 };
const SCR = { x: 186, y: 40, w: 202, h: 102 };

// ---------------------------------------------------------------- glyphs
/** Bell (an alert that keeps ringing); `rock` swings it. */
function bell(x: number, y: number, s: number, color: string, a = 1, rock = 0) {
  const G = ctx();
  G.save();
  G.translate(x, y); G.rotate(rock); G.scale(s, s);
  poly([[-5, 3], [-4, -1], [-3.5, -4], [-1.5, -5.8], [1.5, -5.8], [3.5, -4], [4, -1], [5, 3]], { fill: color, fa: 0.2, stroke: color, w: W.base / s, a }, true);
  circle(0, 4.8, 1.4, { fill: color, a });
  G.restore();
}
/** A coffee cup with a wisp of steam. */
function cup(x: number, y: number, s: number, color: string, a = 1, steam = 0) {
  const G = ctx();
  G.save();
  G.translate(x, y); G.scale(s, s);
  box(-4, -3, 8, 8, 1.8, { fill: COL.bg2, stroke: color, w: W.base / s, a });
  arc(4, 1, 2.4, -Math.PI / 2, Math.PI / 2, { stroke: color, w: W.hair / s, a });
  if (steam > 0) for (let i = 0; i < 2; i++) {
    const o = Math.sin(steam * 3 + i * 2) * 1.2;
    poly([[-1.5 + i * 3, -5], [-2.5 + i * 3 + o, -8], [-1.5 + i * 3, -11]], { stroke: COL.soft, w: W.hair / s, a: a * 0.6 });
  }
  G.restore();
}
/** Shield outline (the protocol). */
function shield(x: number, y: number, s: number, color: string, a = 1) {
  const G = ctx();
  G.save();
  G.translate(x, y); G.scale(s, s);
  poly([[0, -6.5], [5.5, -4.5], [5, 1.5], [0, 6.5], [-5, 1.5], [-5.5, -4.5]], { fill: color, fa: 0.18, stroke: color, w: W.base / s, a }, true);
  G.restore();
}
/** A haul truck (dump body, cab, big wheels) facing right; (x, y) = rear wheel ground point. */
function haulTruck(x: number, y: number, s: number, color: string, a = 1, lights = false) {
  const G = ctx();
  G.save();
  G.translate(x, y); G.scale(s, s);
  const w = W.base / s;
  if (lights) poly([[22, -10], [44, -15], [44, -3]], { fill: COL.gold, fa: 0.22, a }, true);
  poly([[-2, -15], [14, -15], [14, -6], [1, -6]], { fill: COL.earth, fa: 0.3, stroke: color, w, a }, true);
  box(15, -14, 7, 8, 1.5, { fill: COL.panel, stroke: color, w, a });
  line(-1, -5, 23, -5, color, w, a);
  circle(4, -2.8, 3, { fill: COL.bg, stroke: color, w, a });
  circle(18, -2.8, 3, { fill: COL.bg, stroke: color, w, a });
  G.restore();
}

// ---------------------------------------------------------------- seated figures
/** A polyline limb, outline + soft fill (the kit's limb style, with a clean elbow joint). */
function limb(pts: Array<[number, number]>, fill: string, thick = 3.6) {
  poly(pts, { stroke: COL.line, w: thick + W.base * 2 });
  poly(pts, { stroke: fill, w: thick });
}
/**
 * A seated figure in the kit's style; (x, seat) = the hip on the seat. The front arm goes
 * through `elbow` to `hand` (drawn last, so a hand can reach the face). Returns the hand.
 */
function seated(x: number, seat: number, o: { facing?: 1 | -1; top?: string; vest?: boolean; headset?: boolean; hand: [number, number]; elbow?: [number, number]; legs?: boolean }) {
  const f = o.facing ?? 1;
  const sh = seat - 22, head = seat - 31;
  const top = o.vest ? COL.vest : (o.top ?? COL.sky);
  if (o.legs !== false) {
    const knee: [number, number] = [x + f * 16, seat + 1], foot: [number, number] = [x + f * 18, FLOOR - 3];
    limb([[x + f * 2, seat - 2], knee, foot], COL.trousers, 4.2);
    box(foot[0] - 3.5 + f * 1.5, FLOOR - 3.5, 7, 3.5, 1.5, { fill: COL.bg2, stroke: COL.line, w: W.hair });
  }
  box(x - 8, sh - 2, 16, 24, 6, { fill: COL.bg2, stroke: COL.line, w: W.base });
  box(x - 8, sh - 2, 16, 24, 6, { fill: top, fa: o.vest ? 0.6 : 0.3 });
  if (o.vest) { line(x - 7, sh + 8, x + 7, sh + 8, COL.white, W.hair, 0.85); line(x - 7, sh + 14, x + 7, sh + 14, COL.white, W.hair, 0.85); }
  circle(x, head, 7, { fill: COL.skin, fa: 0.85, stroke: COL.line, w: W.base });
  circle(x + f * 3, head - 0.5, 0.9, { fill: COL.bg });
  if (o.headset) {
    arc(x, head, 8.6, Math.PI * 1.15, Math.PI * 1.85, { stroke: COL.line, w: W.base });
    line(x - f * 1.5, head + 2, x + f * 5, head + 6, COL.soft, W.hair);
    circle(x - f * 1.5, head + 1, 2.6, { fill: COL.bg2, stroke: COL.line, w: W.hair });
  }
  const s: [number, number] = [x + f * 4, sh + 3];
  const e = o.elbow ?? [(s[0] + o.hand[0]) / 2, Math.max(s[1], o.hand[1]) + 3];
  limb([s, e, o.hand], top);
  circle(o.hand[0], o.hand[1], 2.4, { fill: COL.skin, stroke: COL.line, w: W.hair });
  return o.hand;
}
function chair(x: number, seat: number, f: 1 | -1 = 1) {
  box(x - f * 14 - 2.5, seat - 27, 5, 29, 2.5, { fill: COL.panel, stroke: COL.line, w: W.hair });
  line(x, seat + 4, x, FLOOR - 5, COL.soft, W.base);
  line(x - 11, FLOOR - 4, x + 11, FLOOR - 4, COL.soft, W.base);
  circle(x - 11, FLOOR - 1.8, 1.6, { fill: COL.bg, stroke: COL.soft, w: W.hair });
  circle(x + 11, FLOOR - 1.8, 1.6, { fill: COL.bg, stroke: COL.soft, w: W.hair });
  box(x - 13, seat, 27, 4, 2, { fill: COL.panel, stroke: COL.line, w: W.hair });
}

// ---------------------------------------------------------------- the control room
function windowView(t: number, d: number) {
  const G = ctx(), { x, y, w, h } = WIN, hz = y + 56;
  G.save();
  G.beginPath(); G.rect(x, y, w, h); G.clip();
  sky(d, hz);
  if (d < 0.5) stars(t, 1 - d * 2);
  else { circle(x + 98, hz - 6, 14, { fill: COL.gold, fa: 0.16 }); circle(x + 98, hz - 6, 6, { fill: COL.gold, fa: 0.85 }); }
  mountains(hz, d < 0.5 ? '#131D33' : '#2A3552');
  pit(x + 30, hz, 90, 0.8);
  desert(hz, d);
  // a haul truck crossing the site, headlights on at night
  const tx = x - 30 + ((t * 10) % (w + 40));
  haulTruck(tx, hz + 16, 0.7, COL.soft, 1, d < 0.5);
  G.restore();
  box(x, y, w, h, 3, { stroke: COL.line, w: W.base });
  line(x + w / 2, y, x + w / 2, y + h, COL.line, W.base);
  line(x - 5, y + h + 3, x + w + 5, y + h + 3, COL.soft, W.base);
}
/** Wall clock: hands at hh:mm. */
function wallClock(x: number, y: number, hh: number, mm: number) {
  circle(x, y, 13, { fill: COL.panel, stroke: COL.line, w: W.base });
  for (let i = 0; i < 12; i++) {
    const an = (i * Math.PI) / 6;
    line(x + Math.cos(an) * 10, y + Math.sin(an) * 10, x + Math.cos(an) * 11.5, y + Math.sin(an) * 11.5, COL.dim, W.hair);
  }
  const ha = -Math.PI / 2 + ((hh % 12) + mm / 60) * (Math.PI / 6), ma = -Math.PI / 2 + mm * (Math.PI / 30);
  line(x, y, x + Math.cos(ha) * 6, y + Math.sin(ha) * 6, COL.white, W.emph);
  line(x, y, x + Math.cos(ma) * 9, y + Math.sin(ma) * 9, COL.white, W.base);
  circle(x, y, 1.3, { fill: COL.gold });
}
function room(t: number, d: number, clock: [number, number]) {
  const G = ctx();
  G.fillStyle = COL.bg2; G.fillRect(0, 0, LW, LH);
  box(0, 150, LW, FLOOR_TOP - 150, 0, { fill: COL.panel, fa: 0.6 });
  line(0, 150, LW, 150, COL.faint, W.hair);
  windowView(t, d);
  wallClock(436, 78, clock[0], clock[1]);
  G.fillStyle = COL.bg; G.fillRect(0, FLOOR_TOP, LW, LH - FLOOR_TOP);
  line(0, FLOOR_TOP, LW, FLOOR_TOP, COL.dim, W.hair);
  // the wall screen
  const { x, y, w, h } = SCR;
  line(x + w / 2, y - 4, x + w / 2, 0, COL.dim, W.base);
  box(x - 4, y - 4, w + 8, h + 8, 7, { fill: COL.bg, stroke: COL.line, w: W.base });
  box(x, y, w, h, 4, { fill: COL.panel });
}
function desk(t: number, mug: boolean) {
  box(DESK.x + 8, DESK.y + 5, DESK.w - 16, FLOOR - DESK.y - 5, 2, { fill: COL.bg2, stroke: COL.dim, w: W.hair });
  box(DESK.x, DESK.y, DESK.w, 5, 2, { fill: COL.panel, stroke: COL.line, w: W.base });
  box(DESK.x + 12, DESK.y - 3, 34, 3, 1, { fill: COL.faint, stroke: COL.soft, w: W.hair });
  // radio base
  box(DESK.x + 120, DESK.y - 12, 22, 12, 2, { fill: COL.bg2, stroke: COL.soft, w: W.hair });
  line(DESK.x + 138, DESK.y - 12, DESK.x + 138, DESK.y - 22, COL.soft, W.base);
  circle(DESK.x + 127, DESK.y - 6, 2, { stroke: COL.soft, w: W.hair });
  if (mug) cup(DESK.x + 168, DESK.y - 5, 1, COL.line, 1, t);
}

function alertCard(x: number, y: number, a: number, L: Words) {
  box(x, y, 120, 30, 6, { fill: COL.coral, fa: 0.14, stroke: COL.coral, w: W.base, a });
  circle(x + 15, y + 15, 7.5, { stroke: COL.coral, w: W.base, a });
  text('!', x + 15, y + 15.5, { size: 11, weight: 700, color: COL.coral, align: 'center', a });
  text(L.fatigue, x + 30, y + 10.5, { size: 10.5, weight: 700, color: COL.coral, a });
  text(`${L.unit} 07`, x + 30, y + 21.5, { size: 9.5, color: COL.line, a });
}

// ---------------------------------------------------------------- 1. night: the alert gets lost
function nightRoom(t: number, lang: Lang) {
  const L = WORDS[lang];
  room(t, 0, [2, 10]);
  const { x, y, w } = SCR;
  text(L.alerts, x + 10, y + 14, { size: 11, weight: 600, font: 'display', color: COL.white });
  clockChip(x + w - 66, y + 4, '02:10');
  line(x + 8, y + 26, x + w - 8, y + 26, COL.faint, W.hair);
  // haul road on the map, trucks moving; the flagged one blinks while its alert is up
  const ry = (u: number) => y + 43 + Math.sin(u * 6) * 5;
  const road: Array<[number, number]> = [];
  for (let u = 0; u <= 1.001; u += 0.05) road.push([x + 12 + u * (w - 24), ry(u)]);
  poly(road, { stroke: COL.dim, w: W.base });
  const alertUp = T.alerts.some(([a0, a1]) => t >= a0 && t < a1);
  for (let i = 0; i < 3; i++) {
    const u = (t * 0.03 + i * 0.33) % 1;
    const c = i === 1 && alertUp ? (Math.floor(t * 4) % 2 ? COL.coral : COL.dim) : COL.mint;
    circle(x + 12 + u * (w - 24), ry(u), 2.8, { fill: c, fa: 0.35, stroke: c, w: W.hair });
  }
  // each alert pops up, nobody is free to take it, and it disappears
  for (const [a0, a1] of T.alerts) {
    const k = ease(seg(t, a0, a0 + 0.25)) * (1 - seg(t, a1 - 0.35, a1));
    if (k > 0 && t < a1) alertCard(x + 10, y + 60 + (1 - k) * 6, k, L);
    const gk = seg(t, a1, a1 + 0.8);
    if (gk > 0 && gk < 1) box(x + 10, y + 60 - gk * 18, 120, 30, 6, { stroke: COL.coral, w: W.hair, a: (1 - gk) * 0.8, dash: [3, 3] });
  }
  const lost = T.alerts.filter(([, b]) => t >= b).length;
  if (lost > 0) {
    const pk = seg(t, T.alerts[lost - 1][1], T.alerts[lost - 1][1] + 0.25);
    bell(x + 148, y + 75, 1 + 0.25 * Math.sin(pk * Math.PI), COL.coral);
    text(L.missed, x + 160, y + 69, { size: 9, weight: 600, color: COL.coral });
    text(String(lost), x + 160, y + 83, { size: 13, weight: 700, font: 'mono', color: COL.coral });
  }
  // the operator is on another call
  desk(t, true);
  chair(OPX, SEAT);
  const head = SEAT - 31;
  const hand = seated(OPX, SEAT, { top: COL.sky, hand: [OPX + 3, head + 6], elbow: [OPX + 11, SEAT - 10] });
  limb([[OPX - 1, head - 1], [hand[0] + 1, hand[1] + 2]], COL.bg2, 3);
  circle(hand[0], hand[1], 2.4, { fill: COL.skin, stroke: COL.line, w: W.hair });
  box(OPX + 8, head - 26, 24, 13, 6.5, { fill: COL.panel, stroke: COL.soft, w: W.hair });
  for (let i = 0; i < 3; i++) circle(OPX + 14 + i * 6, head - 19.5, 1.4, { fill: COL.soft, a: 0.4 + 0.6 * (Math.floor(t * 3) % 3 === i ? 1 : 0) });
}

// ---------------------------------------------------------------- 2. the alerts panel
const IDS = ['03', '07', '12', '21'];
const SPEED = 70;
/** Distance the cab has travelled (px), easing to a stop during the pull-over. */
function travel(t: number) {
  const [b0, b1] = T.brake, k = seg(t, b0, b1);
  return SPEED * Math.min(t, b0) + SPEED * (b1 - b0) * (k - (k * k) / 2);
}
const TRAVEL_END = travel(T.brake[1]);

function restSign(x: number, ground: number) {
  line(x, ground - 10, x, ground + 2, COL.soft, W.base);
  box(x - 9, ground - 25, 18, 16, 3, { fill: COL.sky, fa: 0.25, stroke: COL.sky, w: W.base });
  cup(x - 0.5, ground - 16, 0.75, COL.white);
}

/** Picture-in-picture: the driver's cab. The tablet on the dash alerts, the truck pulls over, coffee. */
function cabInset(t: number, lang: Lang) {
  const ik = ease(seg(t, T.inset[0], T.inset[1]));
  if (ik <= 0) return;
  const L = WORDS[lang];
  const G = ctx(), ix = 276 + (1 - ik) * 24, iy = 146, iw = 180, ih = 68;
  G.save();
  G.globalAlpha = ik;
  G.save();
  G.beginPath(); G.roundRect(ix, iy, iw, ih, 10); G.clip();
  const hz = iy + 34;
  sky(0, hz);
  stars(t, 0.7);
  mountains(hz, '#131D33');
  desert(hz, 0);
  G.fillStyle = '#0D1424'; G.fillRect(ix, hz + 4, iw, 12);
  const dist = travel(t);
  for (let x = ix - (dist % 26); x < ix + iw; x += 26) line(x, hz + 10, x + 12, hz + 10, COL.gold, W.base, 0.55);
  const sgx = ix + 128 + (TRAVEL_END - dist);
  if (sgx < ix + iw + 12) restSign(sgx, hz + 2);
  // the driver, hands on the wheel; after stopping, a coffee
  const dx = ix + 30, seat = iy + 66, head = seat - 31;
  const onBreak = t >= T.cup;
  const hand = seated(dx, seat, onBreak
    ? { vest: true, hand: [dx + 8, head + 7], elbow: [dx + 11, seat - 11], legs: false }
    : { vest: true, hand: [dx + 24, seat - 20], elbow: [dx + 13, seat - 14], legs: false });
  if (onBreak) cup(hand[0] + 2, hand[1] - 3, 0.8, COL.line, 1, t);
  // steering wheel (side view) and the dashboard
  poly([[dx + 22, seat - 30], [dx + 27, seat - 9]], { stroke: COL.line, w: W.emph });
  line(dx + 25, seat - 18, dx + 40, seat - 12, COL.soft, W.base);
  poly([[ix, iy + ih], [ix + 44, iy + ih], [ix + 52, iy + 52], [ix + iw - 20, iy + 50], [ix + iw, iy + 54], [ix + iw, iy + ih]], { fill: COL.bg2, stroke: COL.line, w: W.base }, true);
  poly([[ix + iw - 34, iy], [ix + iw - 8, iy + 50], [ix + iw, iy + 50], [ix + iw, iy]], { fill: COL.bg2, stroke: COL.line, w: W.base }, true);
  // tablet on the dash: the message arrives, then the break is confirmed
  const tx = ix + 96, ty = iy + 38;
  const alerting = t >= T.cabAlert && t < T.brake[1];
  if (alerting) {
    const r = (t * 24) % 12;
    circle(tx + 23, ty + 11, 17 + r, { stroke: COL.coral, w: W.hair, a: 1 - r / 12 });
  }
  box(tx, ty, 46, 22, 4, { fill: COL.panel, stroke: COL.line, w: W.base });
  if (alerting) {
    const b = Math.floor(t * 4) % 2 ? 1 : 0.55;
    bell(tx + 9, ty + 11, 0.8, COL.coral, b, Math.sin(t * 22) * 0.25);
    text(L.rest, tx + 16, ty + 11.5, { size: 9, weight: 700, color: COL.coral, a: b });
  } else if (t >= T.brake[1]) {
    check(tx + 5, ty + 11, 0.55, COL.mint, seg(t, T.brake[1], T.brake[1] + 0.3), W.base);
    text(L.rest, tx + 16, ty + 11.5, { size: 9, weight: 700, color: COL.mint });
  } else {
    line(tx + 6, ty + 9, tx + 30, ty + 9, COL.dim, W.base);
    line(tx + 6, ty + 14, tx + 22, ty + 14, COL.faint, W.base);
  }
  // label
  box(ix + 8, iy + 6, 74, 15, 7.5, { fill: COL.bg, fa: 0.8, stroke: COL.faint, w: W.hair });
  text(`${L.cab} · ${L.unit} 07`, ix + 45, iy + 14, { size: 9, weight: 600, color: COL.line, align: 'center' });
  G.restore();
  box(ix, iy, iw, ih, 10, { stroke: COL.line, w: W.base });
  G.restore();
}

function dashboard(t: number, lang: Lang) {
  const L = WORDS[lang];
  stars(t, 0.35);
  const pk = ease(seg(t, T.panelIn[0], T.panelIn[1]));
  const px = 24 + (1 - pk) * 20, py = 30, pw = 236, ph = 184;
  panel(px, py, pw, ph, pk);
  text(L.alerts, px + 12, py + 29, { size: 12, weight: 600, font: 'display', color: COL.white, a: pk });
  clockChip(px + pw - 70, py + 19, t < T.ack ? '02:11' : '02:13', pk);
  const active = t >= T.click && t < T.ack, done = t >= T.ack;
  for (let i = 0; i < 4; i++) {
    const ry = py + 60 + i * 34;
    const a = pk * clamp((t - T.panelIn[0] - 0.12 * i) * 3);
    if (a <= 0) continue;
    const hit = i === 1;
    line(px + 10, ry + 17, px + pw - 10, ry + 17, COL.faint, W.hair, a);
    if (hit && !done) box(px + 6, ry - 13, pw - 12, 28, 6, { fill: active ? COL.gold : COL.coral, fa: 0.07, a });
    if (hit && done) box(px + 6, ry - 13, pw - 12, 28, 6, { fill: COL.mint, fa: 0.06 * (1 - seg(t, T.ack + 1.2, T.ack + 2.2)) + 0.03, a });
    haulTruck(px + 13, ry + 7, 0.8, hit && !done ? (active ? COL.gold : COL.coral) : COL.soft, a);
    text(`${L.unit} ${IDS[i]}`, px + 42, ry - 4, { size: 10.5, weight: 500, color: COL.line, a });
    const parked = hit && t >= T.brake[1];
    text(parked ? L.onBreak : L.onRoad, px + 42, ry + 8, { size: 9, weight: parked ? 600 : 500, color: parked ? COL.gold : COL.dim, a });
    const sx = px + pw - 82;
    if (!hit) status(sx, ry, 'ok', L.normal, a);
    else if (done) status(sx, ry, 'ok', L.handled, a);
    else if (active) {
      status(sx, ry, 'busy', L.active, a);
      bell(sx - 11, ry, 0.85, COL.gold, a, Math.sin(t * 20) * 0.28);
      // it stays up until someone handles it
      line(sx, ry + 9, sx + 60 * (1 - seg(t, T.click, T.ack)), ry + 9, COL.gold, W.base, a * 0.8);
    } else status(sx, ry, 'alert', L.fatigue, a * (Math.floor(t * 3) % 2 ? 1 : 0.5));
    if (hit && done) check(px + pw - 99, ry, 0.7, COL.mint, seg(t, T.ack, T.ack + 0.35), W.emph);
  }
  // the star flies to the alert and clicks it: the alert stays active and escalates
  const alertX = px + pw - 70, alertY = py + 60 + 34;
  const sk = ease(seg(t, T.star[0], T.star[1]));
  if (t >= T.star[0]) {
    const sx = 40 + (px + pw + 2 - 40) * sk, sy = 24 + (alertY - 24) * sk - Math.sin(sk * Math.PI) * 26;
    brandStar(sx, sy + (sk >= 1 ? Math.sin(t * 3) * 1.5 : 0), 9, t);
  }
  clickRing(alertX, alertY, seg(t, T.click, T.click + 0.6));
  // the protocol card: each step checks itself off
  const ok = ease(seg(t, T.card[0], T.card[1]));
  if (ok > 0) {
    const cx = 276 + (1 - ok) * -16, cy = 44, cw = 180, ch = 94;
    box(cx, cy, cw, ch, 10, { fill: COL.panel, stroke: COL.gold, w: W.base, a: ok });
    shield(cx + 18, cy + 19, 1.25, COL.gold, ok);
    text(L.protocol, cx + 32, cy + 16, { size: 14, weight: 700, font: 'display', color: COL.white, a: ok });
    text(`${L.fatigue} · ${L.unit} 07`, cx + 32, cy + 30, { size: 9, color: COL.soft, a: ok });
    const at = [T.notify, T.ack, T.log];
    L.steps.forEach((s, i) => {
      const k = seg(t, at[i], at[i] + 0.3);
      const yy = cy + 50 + i * 16;
      box(cx + 12, yy - 5.5, 11, 11, 3, { stroke: COL.soft, w: W.hair, a: ok });
      check(cx + 14, yy, 0.62, COL.mint, k, W.base);
      text(s, cx + 30, yy + 0.5, { size: 9.5, color: k >= 1 ? COL.line : COL.soft, a: ok });
    });
    // the message travels from the protocol to the cab
    const bk = seg(t, T.beam[0], T.beam[1]);
    if (bk > 0 && bk < 1) {
      const G = ctx();
      G.save();
      G.setLineDash([2.5, 4]); G.lineDashOffset = -t * 20;
      poly([[cx + 150, cy + ch], [cx + 150, cy + ch + 10 + 18 * bk]], { stroke: COL.mint, w: W.base, a: Math.sin(bk * Math.PI) });
      G.restore();
    }
  }
  cabInset(t, lang);
}

// ---------------------------------------------------------------- 3. morning: shift change
function morningRoom(t: number, lang: Lang) {
  const L = WORDS[lang];
  room(t, 0.85, [7, 30]);
  const { x, y, w } = SCR;
  text(L.night, x + 10, y + 14, { size: 11, weight: 600, font: 'display', color: COL.white });
  clockChip(x + w - 66, y + 4, '07:30');
  line(x + 8, y + 26, x + w - 8, y + 26, COL.faint, W.hair);
  const k = ease(seg(t, T.lapse[1], T.lapse[1] + 0.6));
  shield(x + 20, y + 42, 1.3, COL.mint, k);
  check(x + 16.5, y + 42, 0.5, COL.mint, k, W.base);
  text(L.all, x + 34, y + 42.5, { size: 14, weight: 700, font: 'display', color: COL.mint, a: k });
  const rows: Array<[string, string]> = [['02:13', '07'], ['03:52', '12'], ['05:20', '03']];
  rows.forEach(([hhmm, u], i) => {
    const rk = seg(t, T.lapse[1] + 0.4 + i * 0.25, T.lapse[1] + 0.65 + i * 0.25);
    const yy = y + 62 + i * 14;
    text(hhmm, x + 12, yy, { size: 9, font: 'mono', color: COL.soft, a: rk });
    text(`${L.unit} ${u} · ${L.rest}`, x + 50, yy, { size: 9.5, color: COL.line, a: rk });
    check(x + w - 26, yy, 0.55, COL.mint, rk, W.base);
  });
  // the operator, calm, with a coffee; the day supervisor comes in and reviews the log
  desk(t, false);
  chair(OPX, SEAT);
  const hand = seated(OPX, SEAT, { top: COL.sky, headset: true, hand: [OPX + 11, SEAT - 16], elbow: [OPX + 7, SEAT - 7] });
  cup(hand[0] + 1, hand[1] - 4, 0.9, COL.line, 1, t);
  const wk = ease(seg(t, T.walk[0], T.walk[1]));
  const sx = 500 + (386 - 500) * wk;
  let pose: 'walk' | 'hold' | 'thumbs' | 'stand' = 'walk';
  if (t >= T.walk[1]) pose = t < T.read[1] ? 'hold' : t < T.thumbs[1] ? 'thumbs' : 'stand';
  const sh = person(sx, FLOOR, { t, pose, facing: -1, vest: true });
  if (pose === 'hold') {
    box(sh[0] - 16, sh[1] - 13, 18, 22, 3, { fill: COL.bg2, stroke: COL.line, w: W.base });
    shield(sh[0] - 7, sh[1] - 5, 0.6, COL.mint);
    for (let i = 0; i < 2; i++) check(sh[0] - 12, sh[1] + 2 + i * 4, 0.35, COL.mint, 1, W.hair);
  }
  // the dots connect: lost alert -> it stays active -> the driver rests -> on record -> the star
  const dk = seg(t, T.dots[0], T.dots[1]);
  if (dk > 0) {
    fade(0.35 * seg(t, T.dots[0], T.dots[0] + 0.5));
    constellation([[60, 92], [138, 58], [220, 86], [300, 56], [376, 84]], dk, t, [
      (x, y, a) => text('!', x, y + 0.5, { size: 11, weight: 700, color: COL.coral, align: 'center', a }),
      (x, y, a) => bell(x, y, 0.8, COL.gold, a),
      (x, y, a) => cup(x - 0.5, y + 1, 0.8, COL.line, a),
      (x, y, a) => check(x - 3.5, y, 0.55, COL.mint, a, W.base),
    ]);
  }
}

export const safetyLineScene: PixelScene<LineState | undefined> = (g, time, state) => {
  const t = time % SAFETY_LINE_LOOP;
  const lang = state?.lang ?? 'es';
  begin(g);
  const lapseMid = (T.lapse[0] + T.lapse[1]) / 2;
  if (t < T.dashIn[1]) nightRoom(t, lang);
  if (t >= T.dashIn[0] && t < lapseMid) {
    if (t < T.dashIn[1]) fade(seg(t, T.dashIn[0], T.dashIn[1]));
    else box(0, 0, LW, LH, 0, { fill: COL.bg });
    dashboard(t, lang);
  }
  if (t >= lapseMid) morningRoom(t, lang);
  // time-lapse (night -> morning), the loop's end, and the start of every loop after the first
  fade(Math.max(Math.sin(seg(t, T.lapse[0], T.lapse[1]) * Math.PI), seg(t, 16.1, 16.5), time >= SAFETY_LINE_LOOP ? 1 - seg(t, 0, 0.3) : 0));
};
