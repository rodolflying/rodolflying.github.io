// Maintenance story: "the failure that gets fixed before anyone reports it".
// Night convoy on a desert road -> an antenna fails -> in the workshop the technician
// sleeps, the star creates the work order, reboots the repeater and wakes the phone ->
// next morning the truck pulls into the yard and the technician (helmet + vest) fixes it.
import type { PixelScene } from './PixelCanvas';
import {
  C, type RGB, type Rect, type Light, hex, css, mix, clamp, ease, easeOutBack, seg, rnd,
  setCtx, rect, dot, orect, sprite, ring, number, ditherGradient, lightingPass, world,
  drawStar, drawHand, trail, type StarShape, type StarEyes,
} from './engine';
import { drawSeated, drawStanding, drawChair, zzz, type Look } from './rig';

const WORLD_W = 320;
const WORLD_H = 180;
export const MAINT_W = 256;
export const MAINT_H = 144;
export const MAINT_LOOP = 16;

const T = {
  convoy: [0, 4.0], fail: 1.9,
  intro: [4.3, 5.3], fly: [5.3, 6.1], land: [6.1, 6.35], click: [6.35, 6.7], tower: [6.9, 7.6], phone: [7.6, 8.6],
  lapse: [8.6, 9.5],
  arrive: [9.6, 10.9], walk: [10.8, 11.9], repair: [11.9, 13.2], thumbs: [13.2, 13.8], depart: [13.8, 15.0],
};

const TECH: Look = { skin: 'medium', hair: 'short', outfit: 'vest', headwear: 'helmet', bag: true, pants: ['#1E2638', '#2E3A56'] };
const TECH_NIGHT: Look = { ...TECH, headwear: null, bag: false };

// ---------------------------------------------------------------- trucks
const WHEEL = ['.kkkk.', 'kkmmkk', 'kmHmmk', 'kmmmmk', 'kkmmkk', '.kkkk.'];

/** Service truck facing right, top-left (x, y), scale s (1 = 44x24). */
function truck(x: number, y: number, s: number, t: number, moving: boolean, ledRed: boolean, headlightsOn: boolean) {
  const R = (lx: number, ly: number, w: number, h: number, c: string) => rect(x + lx * s, y + ly * s, w * s, h * s, c);
  const O = (lx: number, ly: number, w: number, h: number, c: string) => { rect(x + lx * s - 1, y + ly * s - 1, w * s + 2, h * s + 2, C.ink); R(lx, ly, w, h, c); };
  // box body
  O(0, 3, 27, 15, C.metal2);
  R(0, 3, 27, 2, C.metal3); R(0, 15, 27, 3, C.metal1);
  for (let k = 6; k < 27; k += 7) R(k, 5, 1, 10, C.metal1);
  R(3, 8, 10, 3, C.mint2); // company stripe
  // cab
  O(27, 7, 15, 11, C.truck2);
  R(27, 7, 15, 2, C.truck3); R(27, 15, 15, 3, C.truck1);
  R(33, 9, 7, 4, C.glass1); R(34, 9, 2, 1, C.blue3);
  O(41, 14, 3, 4, C.metal3);
  if (headlightsOn) R(43, 13, 1, 2, C.gold4); else R(43, 13, 1, 2, C.gold2);
  // chassis
  R(1, 18, 42, 2, C.ink);
  // wheels
  const spin = moving ? Math.floor(t * 12) % 2 : 0;
  for (const wx of [5, 17, 34]) {
    if (s === 1) {
      rect(x + wx, y + 18, 6, 6, C.ink); rect(x + wx + 2, y + 20, 2, 2, spin ? C.metal3 : C.metal2);
    } else {
      sprite(WHEEL, { k: C.ink, m: C.metal1, H: spin ? C.metal4 : C.metal3 }, x + wx * s, y + 18 * s);
      sprite(WHEEL, { k: C.ink, m: C.metal1, H: C.metal3 }, x + wx * s + 3, y + 18 * s + 3);
    }
  }
  // roof antenna + status LED
  R(36, 2, 1, 5, C.metal3);
  const blink = Math.floor(t * 4) % 2 === 0;
  dot(x + 36 * s, y + 1 * s, ledRed ? (blink ? C.coral2 : C.coral0) : C.mint3);
  if (s > 1) dot(x + 36 * s + 1, y + 1 * s, ledRed ? (blink ? C.coral2 : C.coral0) : C.mint3);
}

// ---------------------------------------------------------------- exterior (desert road + depot)
function extSky(y01: number, d: number): RGB {
  const night = [hex('#04071A'), hex('#0B1535'), hex('#1C2A52')];
  const morning = [hex('#3A6AB8'), hex('#86B4E4'), hex('#F2D2A0')];
  const a = y01 < 0.5 ? mix(night[0], night[1], y01 * 2) : mix(night[1], night[2], (y01 - 0.5) * 2);
  const b = y01 < 0.5 ? mix(morning[0], morning[1], y01 * 2) : mix(morning[1], morning[2], (y01 - 0.5) * 2);
  return mix(a, b, d);
}

function drawExterior(t: number, d: number, camX: number) {
  ditherGradient({ x: 0, y: 0, w: WORLD_W, h: 104 }, (y) => extSky(y, d));
  if (d < 0.5) {
    for (let i = 0; i < 40; i++) {
      const x = Math.floor(rnd(i) * WORLD_W), y = Math.floor(rnd(i + 50) * 70);
      if (Math.sin(t * 2.5 + i) > -0.3) dot(x, y, i % 6 ? '#9FB3E0' : C.gold4);
    }
    sprite(['.###.', '#####', '####.', '###..', '.#...'], { '#': '#E8EEFF' }, 250, 14);
  } else {
    for (let r = 9; r >= 0; r--) { ctxCircle(60, 40, r, r > 6 ? 'rgba(255,226,163,0.35)' : r > 3 ? C.gold4 : '#FFF4D6'); }
  }
  // far mountains (parallax: moves at half the camera speed)
  const par = camX * 0.5;
  const mC = css(mix(hex('#101A36'), hex('#8A7AA8'), d));
  const mC2 = css(mix(hex('#0A1128'), hex('#6E6690'), d));
  for (let x = 0; x < WORLD_W; x++) {
    const wx = x - par;
    const h1 = 22 + Math.sin(wx * 0.035) * 10 + Math.sin(wx * 0.09) * 4;
    rect(x, 104 - h1, 1, h1, mC);
    const h2 = 12 + Math.sin(wx * 0.06 + 2) * 6;
    rect(x, 104 - h2, 1, h2, mC2);
  }
  // repeater tower on a hill
  const tx = 92 - par * 0.2;
  for (let k = 0; k < 16; k++) { dot(tx - k * 0.25, 70 + k, C.metal1); dot(tx + k * 0.25, 70 + k, C.metal1); if (k % 4 === 0) rect(tx - k * 0.25, 70 + k, k * 0.5 + 1, 1, C.metal1); }
  // desert bands
  rect(0, 104, WORLD_W, 14, C.sand1);
  rect(0, 104, WORLD_W, 1, C.sand2);
  // far road (night convoy)
  rect(0, 118, WORLD_W, 8, C.asphalt1);
  rect(0, 118, WORLD_W, 1, C.asphalt2);
  for (let x = -((t * 40) % 16); x < WORLD_W; x += 16) rect(x, 122, 7, 1, C.gold1);
  rect(0, 126, WORLD_W, 26, C.sand2);
  for (let i = 0; i < 30; i++) { const x = Math.floor(rnd(i + 200) * WORLD_W), y = 128 + Math.floor(rnd(i + 300) * 22); rect(x, y, 2 + (i % 3), 1, C.sand1); }
  // yard (gravel) in the foreground
  rect(0, 152, WORLD_W, 28, C.sand1);
  rect(0, 152, WORLD_W, 1, C.sand3);
  for (let i = 0; i < 60; i++) dot(Math.floor(rnd(i + 400) * WORLD_W), 154 + Math.floor(rnd(i + 500) * 26), i % 3 ? C.sand0 : C.sand2);
  // depot building
  orect(236, 96, 80, 56, '#3A4660');
  rect(236, 96, 80, 3, '#56627E');
  rect(252, 116, 40, 36, C.metal1);
  for (let y = 118; y < 152; y += 3) rect(252, y, 40, 1, C.metal0);
  rect(298, 126, 12, 26, C.wood1); rect(307, 138, 1, 2, C.gold2);
  orect(256, 102, 32, 10, C.mint1);
  // wrench icon on the sign
  rect(266, 106, 12, 2, C.paper2); rect(264, 104, 3, 6, C.paper2); rect(277, 105, 3, 4, C.paper2);
  // floodlight pole
  rect(228, 78, 2, 74, C.metal2);
  rect(224, 76, 9, 3, C.metal3);
}

function ctxCircle(cx: number, cy: number, r: number, c: string) {
  const g = currentG;
  g.fillStyle = c; g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.fill();
}

// ---------------------------------------------------------------- interior (workshop office at night)
const WIN: Rect = { x: 24, y: 26, w: 80, h: 58 };
const SCREEN: Rect = { x: 183, y: 75, w: 38, h: 21 };
const CLOCK: Rect = { x: 140, y: 30, w: 34, h: 11 };

function drawInterior(t: number, d: number) {
  // walls + floor
  rect(0, 0, WORLD_W, 128, '#1E2A3E');
  for (let x = 0; x < WORLD_W; x += 8) rect(x, 0, 1, 124, '#1A2536');
  rect(0, 124, WORLD_W, 4, C.base);
  rect(0, 128, WORLD_W, 52, '#3A3F4C');
  for (let y = 128; y < 180; y += 10) rect(0, y, WORLD_W, 1, '#2E323D');
  for (let x = 0; x < WORLD_W; x += 20) rect(x, 128, 1, 52, '#2E323D');
  rect(0, 128, WORLD_W, 1, '#565C6C');
  // window frame
  orect(WIN.x - 3, WIN.y - 3, WIN.w + 6, WIN.h + 6, C.frame1);
  // pegboard with tool silhouettes
  orect(196, 24, 64, 36, '#6E5A3C');
  for (let y = 28; y < 58; y += 4) for (let x = 200; x < 258; x += 4) dot(x, y, '#5A4A30');
  rect(204, 30, 2, 18, C.metal3); rect(201, 30, 8, 3, C.metal3);          // wrench
  rect(216, 32, 10, 3, C.coral1); rect(224, 30, 3, 7, C.metal3);          // hammer
  rect(236, 30, 2, 20, C.gold2); rect(234, 48, 6, 4, C.ink);              // screwdriver
  rect(246, 34, 8, 12, C.metal2); ring(250, 40, 3, C.metal4);              // tape
  // shelf with boxes
  rect(268, 60, 46, 3, C.wood2); rect(268, 96, 46, 3, C.wood2);
  orect(272, 48, 12, 12, C.sand2); orect(288, 50, 10, 10, C.sand1); orect(274, 84, 16, 12, C.sand2);
  // desk
  rect(110, 100, 150, 5, C.wood3); rect(110, 105, 150, 3, C.wood1); rect(110, 100, 150, 1, '#A87A55');
  rect(114, 108, 5, 20, C.wood1); rect(251, 108, 5, 20, C.wood1);
  // desk lamp
  orect(112, 97, 12, 3, C.metal1); rect(117, 82, 2, 15, C.metal2); for (let k = 0; k < 9; k++) dot(118 + k, 82 - Math.round(k * 0.6), C.metal2);
  sprite(['..kkkk..', '.kmmmmk.', 'kmmmmmmk', 'gggggggg'], { k: C.ink, m: C.metal3, g: C.gold3 }, 123, 74);
  // fleet monitor frame
  orect(180, 72, 44, 27, C.metal0);
  rect(198, 99, 8, 1, C.metal2);
  // printer
  orect(228, 90, 24, 10, C.metal2);
  rect(228, 90, 24, 2, C.metal3);
  rect(232, 89, 16, 1, C.ink);
  // helmet waiting on the desk (until the technician wakes up)
  if (t < T.phone[1]) sprite(['...yyyy...', '.yyYYyyyy.', 'yyYyyyyyyy', 'dddddddddd'], { y: C.helmet2, Y: C.helmet3, d: C.helmet0 }, 160, 95);
  // phone on the desk (buzzing)
  const buzz = t >= T.phone[0] - 0.4 && t < T.phone[0] + 0.5 ? (Math.floor(t * 30) % 2 ? 1 : -1) : 0;
  if (t < T.phone[0] + 0.5) {
    orect(148 + buzz, 97, 7, 3, C.ink);
    if (t >= T.phone[0] - 0.4) rect(149 + buzz, 97, 5, 2, C.mint3);
  }
  void d;
}

function drawInteriorEmissive(t: number, d: number, towerOk: boolean) {
  // window view: night desert with the repeater tower, dawn during the time-lapse
  ditherGradient(WIN, (y) => {
    const night = y < 0.6 ? mix(hex('#04071A'), hex('#12204A'), y / 0.6) : mix(hex('#12204A'), hex('#241E3A'), (y - 0.6) / 0.4);
    const dawn = y < 0.6 ? mix(hex('#2A3A78'), hex('#E0906A'), y / 0.6) : mix(hex('#E0906A'), hex('#F6C98A'), (y - 0.6) / 0.4);
    return mix(night, dawn, d);
  });
  for (let i = 0; i < 12; i++) if (d < 0.5) dot(WIN.x + Math.floor(rnd(i + 7) * WIN.w), WIN.y + Math.floor(rnd(i + 17) * 30), '#9FB3E0');
  // hills + tower
  const hc = css(mix(hex('#0A1128'), hex('#5A4A6A'), d));
  for (let x = 0; x < WIN.w; x++) { const h = 12 + Math.sin(x * 0.08) * 5; rect(WIN.x + x, WIN.y + WIN.h - h, 1, h, hc); }
  const tx = WIN.x + 50, ty = WIN.y + 22;
  for (let k = 0; k < 20; k++) { dot(tx - k * 0.3, ty + k, C.metal1); dot(tx + k * 0.3, ty + k, C.metal1); if (k % 5 === 0) rect(tx - k * 0.3, ty + k, k * 0.6 + 1, 1, C.metal1); }
  const blink = Math.floor(t * 3) % 2 === 0;
  if (towerOk) { dot(tx, ty - 1, C.mint3); dot(tx, ty - 2, C.mint4); }
  else if (blink) { dot(tx, ty - 1, C.coral2); dot(tx, ty - 2, C.coral3); }
  // mullion
  rect(WIN.x + WIN.w / 2 - 1, WIN.y, 2, WIN.h, C.frame1);
  // digital clock: 02:40 at night, rolling to 07:30 in the time-lapse
  rect(CLOCK.x, CLOCK.y, CLOCK.w, CLOCK.h, '#0A0C12');
  const mins = t < T.lapse[0] ? 160 + Math.floor((t - 4) * 0.5) : t < T.lapse[1] ? 162 + Math.floor(seg(t, T.lapse[0], T.lapse[1]) * 288) : 450;
  const hh = String(Math.floor(mins / 60)).padStart(2, '0'), mm = String(mins % 60).padStart(2, '0');
  number(`${hh}:${mm}`, CLOCK.x + 4, CLOCK.y + 3, t < T.lapse[0] ? C.coral2 : C.mint3);
  // fleet monitor: road map with trucks; one blinks red until the order is created
  const s = SCREEN;
  rect(s.x, s.y, s.w, s.h, '#08141C');
  for (let x = 0; x < s.w - 4; x++) dot(s.x + 2 + x, s.y + 10 + Math.round(Math.sin(x * 0.25) * 3), '#1C3A48');
  const ordered = t >= T.click[0] + 0.15;
  for (let i = 0; i < 4; i++) {
    const k = ((t * 0.05 + i * 0.25) % 1);
    const x = s.x + 2 + k * (s.w - 4);
    const y = s.y + 10 + Math.round(Math.sin((x - s.x - 2) * 0.25) * 3);
    const bad = i === 1 && !ordered;
    rect(x - 1, y - 1, 3, 3, bad ? (Math.floor(t * 4) % 2 ? C.coral2 : C.coral0) : C.mint3);
  }
  if (ordered) {
    const k = easeOutBack(seg(t, T.click[0] + 0.15, T.click[0] + 0.5));
    const w = Math.round(18 * k), h = Math.round(12 * k);
    rect(s.x + s.w - w - 2, s.y + 2, w, h, C.paper2);
    if (k > 0.9) { rect(s.x + s.w - w - 2, s.y + 2, w, 2, C.gold2); for (let i = 0; i < 3; i++) rect(s.x + s.w - w, s.y + 6 + i * 2, w - 6, 1, C.paper0); }
  }
  for (let y = s.y; y < s.y + s.h; y += 2) rect(s.x, y, s.w, 1, 'rgba(255,255,255,0.04)');
}

/** Work order printing out of the printer (with checklist) after the click. */
function drawPrintedOrder(t: number) {
  const k = seg(t, T.click[0] + 0.3, T.click[0] + 1.0);
  if (k <= 0 || t > T.lapse[0]) return;
  const h = Math.round(16 * ease(k));
  rect(233, 89 - h, 14, h, C.paper2);
  rect(233, 89 - h, 14, 2, C.gold2);
  for (let i = 0; i < Math.min(4, Math.floor(h / 3)); i++) { rect(235, 93 - h + i * 3, 2, 1, C.mint1); rect(238, 93 - h + i * 3, 7, 1, C.paper0); }
}

// ---------------------------------------------------------------- scene
let currentG: CanvasRenderingContext2D;

function cameraFor(t: number): [number, number] {
  let x: number, y: number;
  if (t < T.intro[0]) {
    x = ease(seg(t, 0, 4)) * 64; y = 20;
    // push in on the failing truck, then let it go
    const f = ease(seg(t, T.fail - 0.3, T.fail + 0.2)) * (1 - ease(seg(t, T.fail + 1.1, T.fail + 1.6)));
    const focusX = -60 + T.fail * 95 - 80 + 36 - MAINT_W / 2;
    x = x + (focusX - x) * f; y = 20 + f * 0;
  }
  else if (t < T.lapse[1]) {
    x = 40; y = 24;
    const push = ease(seg(t, T.click[0] - 0.4, T.click[0] + 0.2)) * (1 - ease(seg(t, T.tower[0], T.tower[0] + 0.4)));
    x += push * 30; y += push * 10;
    const toWin = ease(seg(t, T.tower[0], T.tower[0] + 0.4)) * (1 - ease(seg(t, T.tower[1], T.phone[0] + 0.2)));
    x -= toWin * 30;
    if (t >= T.land[0] && t < T.land[0] + 0.2) y += Math.round(Math.sin(t * 90));
  } else { x = 20 + ease(seg(t, T.depart[0] + 0.3, T.depart[1])) * 44; y = 36; }
  return [Math.round(clamp(x, 0, WORLD_W - MAINT_W)), Math.round(clamp(y, 0, WORLD_H - MAINT_H))];
}

export const maintenanceHQScene: PixelScene = (g, time) => {
  const t = time % MAINT_LOOP;
  const { canvas, g: w } = world('maintenance', WORLD_W, WORLD_H);
  currentG = w;
  setCtx(w);
  const [cx, cy] = cameraFor(t);
  const view: Rect = { x: cx, y: cy, w: MAINT_W, h: MAINT_H };
  const interior = t >= T.intro[0] - 0.3 && t < T.lapse[1];
  const lights: Light[] = [];
  let ambient: RGB;
  let emissive: Rect[] = [];
  let extra: ((x: number, y: number) => RGB | null) | undefined;

  if (!interior) {
    // ---------------- exterior
    const morning = t >= T.lapse[1];
    const d = morning ? 1 - seg(t, 15.2, 16) : 0;
    drawExterior(t, d, cx);
    emissive = [{ x: 0, y: 0, w: WORLD_W, h: 96 }, { x: 0, y: 96, w: 224, h: 8 }];
    if (!morning) {
      // night convoy on the far road (scale 1), the middle truck's antenna fails
      for (let i = 0; i < 3; i++) {
        const tx = -60 + t * 95 - i * 80;
        if (tx < -50 || tx > WORLD_W + 10) continue;
        const failed = i === 1 && t >= T.fail;
        truck(tx, 102, 1, t, true, failed, true);
        lights.push({ x: tx + 52, y: 116, r: 26, c: [1, 0.85, 0.55], i: 0.9 });
        if (i === 1 && t >= T.fail && t < T.fail + 0.5) {
          const k = seg(t, T.fail, T.fail + 0.5);
          for (let s = 0; s < 6; s++) dot(tx + 36 + Math.cos(s) * k * 8, 101 - Math.abs(Math.sin(s * 2)) * k * 8, s % 2 ? C.gold3 : C.coral2);
        }
      }
      lights.push({ x: 228, y: 80, r: 90, c: [1, 0.8, 0.5], i: 1.0 });
      ambient = [0.22, 0.25, 0.42];
    } else {
      // morning: the truck pulls into the yard (scale 2)
      const arrive = ease(seg(t, T.arrive[0], T.arrive[1]));
      const depart = ease(seg(t, T.depart[0], T.depart[1]));
      const tx = -100 + arrive * 140 + depart * 260;
      const fixed = t >= T.repair[0] + 1.0;
      truck(tx, 124, 2, t, arrive < 1 || depart > 0, !fixed, false);
      // honk when leaving
      if (t >= T.thumbs[0] + 0.2 && t < T.depart[0] + 0.4) for (let k = 0; k < 3; k++) { const r = 4 + k * 3 + ((t * 10) % 3); for (let a = -0.6; a <= 0.6; a += 0.3) dot(tx + 90 + Math.cos(a) * r, 146 + Math.sin(a) * r, C.paper3); }
      // technician walks out of the workshop door to the cab and repairs the antenna
      if (t >= T.walk[0]) {
        const wk = ease(seg(t, T.walk[0], T.walk[1]));
        const antennaX = 40 + 72; // where the truck stops
        const tx2 = 296 + (antennaX - 296) * wk;
        const pose = t < T.walk[1] ? 'walk' : t < T.repair[1] ? 'repair' : t < T.thumbs[1] ? 'thumbsup' : 'wave';
        const mood = pose === 'repair' ? 'focus' : 'happy';
        drawStanding(TECH, pose, mood, Math.round(tx2), 110, t, true);
      }
      ambient = mix([0.3, 0.3, 0.45], [1.0, 0.92, 0.8], d) as RGB;
    }
  } else {
    // ---------------- interior workshop
    const d = seg(t, T.lapse[0], T.lapse[1]);
    drawInterior(t, d);
    drawChair(114, 108, 128);
    const awake = t >= T.phone[0];
    if (!awake) {
      drawSeated(TECH_NIGHT, 'sleep', 'sleep', 120, 74, t);
    } else {
      const mood = t < T.phone[0] + 0.35 ? 'surprised' : 'happy';
      drawSeated({ ...TECH_NIGHT, headwear: t > T.phone[1] - 0.3 ? 'helmet' : null }, 'phone', mood, 120, 74, t);
    }
    drawPrintedOrder(t);
    ambient = mix([0.2, 0.22, 0.36], [0.7, 0.6, 0.55], d) as RGB;
    lights.push({ x: 127, y: 84, r: 64, c: [1, 0.78, 0.45], i: 1.3 });
    const ordered = t >= T.click[0] + 0.15;
    lights.push({ x: 202, y: 85, r: 56, c: ordered ? [0.3, 0.95, 0.78] : [0.4, 0.6, 1.0], i: 0.9 });
    if (t >= T.phone[0] - 0.4 && t < T.phone[1]) lights.push({ x: 151, y: 96, r: 18, c: [0.3, 1, 0.8], i: 0.8 });
    emissive = [WIN, SCREEN, CLOCK];
  }

  // --- star (interior act)
  let starX = -99, starBottom = -99;
  let shape: StarShape = 'n';
  let eyes: StarEyes = 'open';
  if (interior && t >= T.fly[0]) {
    const perchX = 202, perchBottom = 72;
    if (t < T.land[0]) {
      const k = ease(seg(t, T.fly[0], T.land[0]));
      starX = 70 + (perchX - 70) * k; starBottom = 50 + (perchBottom - 50) * k - Math.sin(k * Math.PI) * 20; shape = 'stretch';
    } else {
      starX = perchX;
      const k = seg(t, T.land[0], T.land[1]);
      shape = k < 0.4 ? 'squash' : k < 0.8 ? 'stretch' : 'n';
      starBottom = perchBottom - (shape === 'stretch' ? 2 : 0) + (k >= 1 ? Math.round(Math.sin(t * 4)) : 0);
      eyes = t < T.click[1] ? 'focus' : (t % 3.1) < 0.12 ? 'blink' : 'happy';
    }
    lights.push({ x: starX, y: starBottom - 7, r: 36, c: [0.35, 1, 0.8], i: 0.7 });
  }
  if (!interior && t >= T.arrive[0] && t < T.depart[1]) {
    // the star rides on the truck's roof in the morning
    const arrive = ease(seg(t, T.arrive[0], T.arrive[1]));
    const depart = ease(seg(t, T.depart[0], T.depart[1]));
    starX = -100 + arrive * 140 + depart * 260 + 30;
    starBottom = 128 + Math.round(Math.sin(t * 5));
    eyes = t > T.repair[0] + 1.0 ? 'happy' : 'open';
  }

  lightingPass({ view, ambient: ambient!, lights, emissive, extra });

  if (interior) drawInteriorEmissive(t, seg(t, T.lapse[0], T.lapse[1]), t >= T.tower[0] + 0.35);
  if (!interior && t < T.lapse[1]) {
    // headlight glints + depot window glow at night (emissive details)
    for (let i = 0; i < 3; i++) { const tx = -60 + t * 95 - i * 80; if (tx > -50 && tx < WORLD_W) { dot(tx + 43, 115, C.gold4); dot(tx + 44, 115, C.gold4); } }
    rect(225, 78, 7, 1, C.gold4);
  }
  if (starX > -50) {
    if (shape === 'stretch' && interior && t < T.land[0]) trail(starX, starBottom - 6, 1);
    drawStar(starX, starBottom, shape, eyes);
    if (interior && t >= T.click[0] && t < T.click[1] + 0.2) {
      const k = seg(t, T.click[0], T.click[0] + 0.15), back = seg(t, T.click[1], T.click[1] + 0.2);
      drawHand(209 + 4 * k - 4 * back, 70 + 10 * k - 10 * back);
    }
    const click = seg(t, T.click[0] + 0.12, T.click[1] + 0.5);
    if (interior && click > 0 && click < 1) { ring(213, 80, click * 34, C.mint4); if (click > 0.2) ring(213, 80, click * 34 - 6, C.mint3); }
    // zap to the repeater tower through the window
    if (interior && t >= T.tower[0] && t < T.tower[0] + 0.45) {
      const k = seg(t, T.tower[0], T.tower[0] + 0.45);
      const x0 = starX - 6, y0 = starBottom - 8, x1 = WIN.x + 50, y1 = WIN.y + 20;
      for (let i = 0; i < 24; i++) { const u = i / 24; if (u > k) break; dot(x0 + (x1 - x0) * u, y0 + (y1 - y0) * u + Math.sin(u * 30) * 2, i % 2 ? C.mint4 : C.gold3); }
    }
  }
  if (interior && t < T.phone[0]) zzz(146, 80, t);
  // check mark when the antenna is fixed
  if (!interior && t >= T.repair[0] + 1.0 && t < T.thumbs[1] + 0.3) {
    const k = easeOutBack(seg(t, T.repair[0] + 1.0, T.repair[0] + 1.4));
    const bx = -100 + 140 + 72 - 4, by = 108 - Math.round(k * 6);
    orect(bx, by, 11, 9, C.mint2);
    dot(bx + 2, by + 4, C.paper3); dot(bx + 3, by + 5, C.paper3); dot(bx + 4, by + 6, C.paper3); dot(bx + 5, by + 5, C.paper3); dot(bx + 6, by + 4, C.paper3); dot(bx + 7, by + 3, C.paper3); dot(bx + 8, by + 2, C.paper3);
  }
  // dust in the lamp light at night
  if (interior) for (let i = 0; i < 12; i++) { const mx = 118 + ((rnd(i) * 40 + t * 3) % 40), my = 80 + ((rnd(i + 3) * 30 + t * 2) % 26); if (Math.sin(t * 2 + i) > 0.2) dot(mx, my, 'rgba(255,226,163,0.7)'); }

  // --- camera crop + transitions
  g.imageSmoothingEnabled = false;
  g.drawImage(canvas, cx, cy, MAINT_W, MAINT_H, 0, 0, MAINT_W, MAINT_H);
  const fades: Array<[number, number]> = [[T.intro[0] - 0.3, T.intro[0] + 0.1], [T.lapse[1] - 0.15, T.lapse[1] + 0.25], [15.4, 16.2], [-0.4, 0.3]];
  for (const [a, b] of fades) {
    if (t >= a && t < b) {
      const k = Math.sin(seg(t, a, b) * Math.PI);
      g.fillStyle = `rgba(5,7,15,${a < 0 ? 1 - seg(t, 0, b) : k})`;
      g.fillRect(0, 0, MAINT_W, MAINT_H);
    }
  }
};
