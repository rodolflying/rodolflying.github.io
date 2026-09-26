// AI story: "the supervisor who finally hears everything".
// The phone won't stop buzzing and the radio never goes quiet; an urgent message gets
// buried under the pile -> the star (with headphones) sorts every message into
// urgent / normal / info and turns the radio audio into checked text -> the urgent one
// reaches the technician, who heads out -> the supervisor puts the phone face down.
import type { PixelScene } from './PixelCanvas';
import { C, type Rect, type Light, clamp, ease, seg, rnd, setCtx, rect, dot, orect, bigNumber, lightingPass, world } from './engine';
import { drawSeated, drawStanding, drawChair, type Look, type Mood, type StandPose } from './rig';
import { cityView, windowFrame, windowMullions, officeRoom, desk, screenBase, scanlines, starBeat, drawStarBeat, clickBeat, fades, checkMark, bubble, plant } from './sets';

const WORLD_W = 320;
const WORLD_H = 180;
export const AI_W = 256;
export const AI_H = 144;
export const AI_LOOP = 15;

const T = {
  pile: [0.4, 3.7] as [number, number],
  fly: [3.9, 4.7] as [number, number], click: [4.9, 5.25] as [number, number],
  sort: 5.4, urgentOut: [7.7, 8.3] as [number, number], techPhone: [8.3, 9.1] as [number, number],
  thumbs: [9.1, 9.7] as [number, number], techLeave: [9.8, 11.4] as [number, number],
  faceDown: 10.2, total: 10.4, starOut: 13.3,
};

const SUPERVISOR: Look = { skin: 'light', hair: 'short', hairColor: 'brown', outfit: 'office', shirt: ['#1E4A2E', '#2E6B40', '#4A9A5E', '#7CC98E'] };
const TECH: Look = { skin: 'dark', hair: 'short', outfit: 'vest', headwear: 'helmet', pants: ['#1E2638', '#2E3A56'] };

const WIN: Rect = { x: 44, y: 22, w: 44, h: 32 };
const WALL: Rect = { x: 118, y: 18, w: 96, h: 40 };
const PHONE = { x: 120, y: 87 };
const RADIO = { x: 146, y: 88 };
const TECH_X = 236, TECH_Y = 66;

// the message pile: kind 0 urgent, 1 normal, 2 info
const N = 12;
const URGENT = 4;
const MSGS = Array.from({ length: N }, (_, i) => ({
  kind: i === URGENT ? 0 : i % 3 === 1 ? 2 : 1,
  at: T.pile[0] + i * ((T.pile[1] - T.pile[0]) / N),
  x: 110 + Math.round(rnd(i + 3) * 14),
  y: 80 - Math.round(i * 3.4 + rnd(i + 7) * 2),
}));
// sorting order: top of the pile first
const SORT_AT = (i: number) => T.sort + (N - 1 - i) * 0.17;
const COL_X = (k: number) => WALL.x + 5 + k * 14;

function camera(t: number): [number, number] {
  let x = 40;
  x += ease(seg(t, T.urgentOut[0] - 0.2, T.urgentOut[1] + 0.2)) * 24 * (1 - ease(seg(t, T.techLeave[1] - 0.4, T.techLeave[1] + 0.6)));
  return [Math.round(clamp(x, 0, WORLD_W - AI_W)), 4];
}

function colColor(kind: number) { return kind === 0 ? C.coral2 : kind === 1 ? C.mint3 : C.blue3; }

function drawWall(t: number) {
  const s = WALL;
  if (t < T.click[0] + 0.12) {
    screenBase(s, '#0B0F1A', '#161C2C');
    // idle: a lonely "0 / ?" style placeholder
    rect(s.x + 40, s.y + 18, 16, 2, '#1E2638');
    scanlines(s);
    return;
  }
  screenBase(s, '#08121A', '#123040');
  // three trays: urgent / normal / info
  for (let k = 0; k < 3; k++) {
    const x = COL_X(k);
    rect(x, s.y + 5, 11, 2, colColor(k));
    rect(x, s.y + 8, 11, s.h - 11, '#0E1C26');
  }
  const counts = [0, 0, 0];
  for (let i = N - 1; i >= 0; i--) {
    const m = MSGS[i];
    if (t < SORT_AT(i) + 0.25) continue;
    if (m.kind === 0 && t >= T.urgentOut[0]) { counts[0]++; continue; }
    const row = counts[m.kind]++;
    const y = s.y + s.h - 6 - row * 4;
    const blink = m.kind === 0 && t < T.urgentOut[0] && Math.floor(t * 6) % 2;
    rect(COL_X(m.kind) + 1, y, 9, 3, blink ? C.coral3 : colColor(m.kind));
  }
  if (t >= T.urgentOut[0]) checkMark(COL_X(0) + 2, s.y + s.h - 8, C.mint4);
  // radio transcript: each line checked against protocol
  const tx = s.x + 50;
  for (let i = 0; i < 6; i++) {
    const at = T.sort + 0.3 + i * 0.4;
    if (t < at) break;
    const k = seg(t, at, at + 0.3);
    const y = s.y + 6 + i * 5;
    rect(tx, y, 3, 3, i % 2 ? C.gold3 : C.blue3);
    rect(tx + 5, y + 1, Math.round((14 + (i * 7) % 12) * k), 1, C.paper1);
    if (k >= 1) checkMark(tx + 33, y - 1, C.mint3);
  }
  // total: 100% audited
  if (t >= T.total) {
    const k = ease(seg(t, T.total, T.total + 1));
    rect(s.x + 45, s.y + 3, s.w - 46, s.h - 5, '#08121A');
    bigNumber(`${Math.round(100 * k)}%`, s.x + s.w - 50, s.y + 8, C.mint3, 3);
    for (let j = 0; j < 3; j++) { rect(s.x + s.w - 49 + j * 16, s.y + 28, 12, 2, j === 0 ? C.coral2 : j === 1 ? C.mint3 : C.blue3); }
  }
  scanlines(s);
}

function drawRadio(t: number) {
  orect(RADIO.x, RADIO.y, 16, 11, C.metal1);
  rect(RADIO.x, RADIO.y, 16, 1, C.metal3);
  for (let y = 0; y < 3; y++) for (let x = 0; x < 4; x++) dot(RADIO.x + 2 + x * 2, RADIO.y + 3 + y * 2, C.metal0);
  rect(RADIO.x + 11, RADIO.y + 3, 3, 2, C.mint1);
  rect(RADIO.x + 13, RADIO.y - 10, 1, 10, C.metal2);
  dot(RADIO.x + 13, RADIO.y - 11, Math.floor(t * 4) % 2 ? C.coral2 : C.coral0);
}

function radioWaves(t: number) {
  // before: arcs spreading into the room; after: the sound travels up into the screen as dots
  const ox = RADIO.x + 13, oy = RADIO.y - 8;
  if (t < T.click[1]) {
    for (let r = 0; r < 3; r++) {
      const rad = ((t * 16 + r * 6) % 18) + 3;
      const a = 1 - rad / 21;
      for (let s = 0; s < 10; s++) { const ang = -Math.PI * 0.85 + (s / 9) * Math.PI * 0.7; dot(ox + Math.cos(ang) * rad, oy + Math.sin(ang) * rad, `rgba(214,225,240,${a})`); }
    }
  } else if (t < T.total) {
    for (let i = 0; i < 6; i++) {
      const k = (t * 1.2 + i / 6) % 1;
      const tx = WALL.x + 52, ty = WALL.y + WALL.h;
      dot(ox + (tx - ox) * k + Math.sin(k * 12 + i) * 2, oy + (ty - oy) * k, i % 2 ? C.gold3 : C.blue3);
    }
  }
}

function drawPhone(t: number) {
  if (t >= T.faceDown) {
    // face down: done listening to the pile
    rect(PHONE.x - 3, PHONE.y + 10, 13, 2, C.ink);
    rect(PHONE.x - 3, PHONE.y + 10, 13, 1, C.metal2);
    return;
  }
  const buzzing = t < T.pile[1] + 0.2 && (t - T.pile[0]) % ((T.pile[1] - T.pile[0]) / N) < 0.12;
  const sx = buzzing ? (Math.floor(t * 40) % 2 ? 1 : -1) : 0;
  rect(PHONE.x - 2, PHONE.y + 9, 11, 3, C.metal1); // stand
  orect(PHONE.x + sx, PHONE.y, 7, 11, C.ink);
  rect(PHONE.x + 1 + sx, PHONE.y + 1, 5, 9, t < T.click[0] ? C.blue1 : C.mint0);
  if (buzzing) { dot(PHONE.x - 2, PHONE.y + 2, C.paper1); dot(PHONE.x + 9, PHONE.y + 4, C.paper1); }
}

function drawMessages(t: number) {
  for (let i = 0; i < N; i++) {
    const m = MSGS[i];
    if (t < m.at) continue;
    const pop = seg(t, m.at, m.at + 0.12);
    let x = m.x, y = m.y + (1 - pop) * 6;
    const fk = seg(t, SORT_AT(i), SORT_AT(i) + 0.25);
    if (fk >= 1) {
      // the urgent one leaves the tray for the technician
      if (m.kind !== 0 || t < T.urgentOut[0] || t >= T.urgentOut[1]) continue;
      const k = ease(seg(t, T.urgentOut[0], T.urgentOut[1]));
      const sx = COL_X(0) + 1, sy = WALL.y + WALL.h - 6;
      x = sx + (TECH_X + 2 - sx) * k; y = sy + (TECH_Y + 4 - sy) * k - Math.sin(k * Math.PI) * 16;
      bubble(Math.round(x), Math.round(y), C.coral2, true);
      continue;
    }
    if (fk > 0) {
      const tx = COL_X(m.kind) + 1, ty = WALL.y + 12;
      const k = ease(fk);
      x = m.x + (tx - m.x) * k; y = m.y + (ty - m.y) * k;
    }
    const col = m.kind === 0 ? C.coral2 : m.kind === 1 ? C.paper2 : C.blue3;
    bubble(Math.round(x), Math.round(y), col, m.kind === 0);
  }
}

export const aiHQScene: PixelScene = (g, time) => {
  const t = time % AI_LOOP;
  const { canvas, g: w } = world('ai', WORLD_W, WORLD_H);
  setCtx(w);
  const [cx, cy] = camera(t);
  const view: Rect = { x: cx, y: cy, w: AI_W, h: AI_H };

  // --- albedo
  officeRoom(WORLD_W, '#1C2A3E', '#18253A', '#2F3542', '#272C38');
  windowFrame(WIN);
  plant(52, 51, t, t < T.click[0] ? 0.4 : 1);
  orect(WALL.x - 3, WALL.y - 3, WALL.w + 6, WALL.h + 6, C.metal0);
  rect(WALL.x - 3, WALL.y - 3, WALL.w + 6, 1, C.metal2);
  // door on the right
  orect(270, 62, 28, 66, C.wood1);
  rect(272, 64, 24, 62, C.wood2); rect(273, 66, 10, 26, C.wood1); rect(285, 66, 10, 26, C.wood1);
  rect(292, 96, 2, 3, C.gold2);
  desk(84, 100, 120);
  drawPhone(t);
  drawRadio(t);

  // supervisor
  drawChair(86, 110, 128);
  {
    const calm = t >= T.faceDown + 0.3;
    const mood: Mood = t < T.click[0] ? ((t % 2.6) < 0.14 ? 'blink' : 'stressed')
      : t < T.click[0] + 0.7 ? 'surprised'
        : !calm ? 'focus'
          : (t % 3.2) < 0.12 ? 'blink' : 'relieved';
    const sip = seg(t, 11.6, 11.9) * (1 - seg(t, 12.4, 12.7));
    drawSeated(SUPERVISOR, calm ? 'coffee' : 'watch', mood, 94, 76, t, { slump: t < T.click[0] && t > 2.4 ? 1 : 0, sip });
  }

  // technician by the door
  {
    let pose: StandPose = 'stand';
    let mood: Mood = (t % 3.4) < 0.14 ? 'blink' : 'neutral';
    let x = TECH_X;
    let flip = true;
    if (t >= T.techPhone[0] && t < T.thumbs[0]) { pose = 'phone'; mood = t < T.techPhone[0] + 0.4 ? 'surprised' : 'focus'; }
    else if (t >= T.thumbs[0] && t < T.techLeave[0]) { pose = 'thumbsup'; mood = 'happy'; }
    else if (t >= T.techLeave[0]) { pose = 'walk'; mood = 'focus'; flip = false; x = TECH_X + ease(seg(t, T.techLeave[0], T.techLeave[1])) * 110; }
    if (x < WORLD_W + 4) drawStanding(TECH, pose, mood, Math.round(x), TECH_Y, t, flip);
  }

  // --- lights
  const sb = starBeat(t, T.fly, [60, 30], [WALL.x + WALL.w / 2, WALL.y - 3], T.click[1], T.starOut);
  const lights: Light[] = [
    { x: WALL.x + WALL.w / 2, y: WALL.y + WALL.h / 2, r: 80, c: t < T.click[0] ? [0.35, 0.45, 0.8] : [0.35, 1, 0.8], i: t < T.click[0] ? 0.35 : 0.85 },
    { x: PHONE.x + 3, y: PHONE.y + 4, r: 28, c: [0.4, 0.6, 1], i: t < T.faceDown ? 0.7 : 0 },
    { x: RADIO.x + 13, y: RADIO.y - 10, r: 14, c: [1, 0.4, 0.45], i: 0.5 },
  ];
  if (sb.visible) lights.push({ x: sb.x, y: sb.bottom - 7, r: 36, c: [0.35, 1, 0.8], i: 0.7 });
  lightingPass({
    view, ambient: [0.36, 0.34, 0.46], lights, emissive: [WIN, WALL],
    extra: (x, y) => (y > WIN.y + WIN.h && y < 128 + 40 && Math.abs(x - (y - WIN.y - WIN.h) * 0.9 - (WIN.x + WIN.w / 2)) < WIN.w / 2 ? [0.3, 0.16, 0.06] : null),
  });

  // --- emissive + overlays
  cityView(WIN, t, 2.9);
  windowMullions(WIN);
  drawWall(t);
  radioWaves(t);
  drawMessages(t);
  drawStarBeat(sb, true);
  clickBeat(t, T.click, [sb.x + 6, sb.bottom - 10], [WALL.x + WALL.w / 2 - 3, WALL.y + 14]);
  if (t >= T.click[0] + 0.1 && t < T.click[0] + 0.8) { rect(106, 68, 2, 6, C.gold3); rect(106, 76, 2, 2, C.gold3); }
  if (t >= T.techPhone[0] && t < T.techPhone[0] + 0.6) { rect(TECH_X + 11, TECH_Y - 8, 2, 6, C.coral2); rect(TECH_X + 11, TECH_Y, 2, 2, C.coral2); }

  // --- camera crop + transitions
  g.imageSmoothingEnabled = false;
  g.drawImage(canvas, cx, cy, AI_W, AI_H, 0, 0, AI_W, AI_H);
  fades(g, t, AI_LOOP, AI_W, AI_H);
};
