// Pixel scenes for the service model, ROI calculator, value framework, process,
// contact confirmation, 404 and the founder avatar.
import type { PixelScene } from './PixelCanvas';
import {
  P, px, clamp, ease, phase, sky, floor, star, hand, ring, coin, check, sprite, STAR_W, STAR_H,
} from './sprites';

// ---------------------------------------------------------------- 5-year cost coins
// Cumulative cost (MM CLP) of the reference portfolio, start + years 1..5.
export const COST_LICENSED = [149.5, 226.3, 303.0, 379.8, 456.5, 533.3];
export const COST_OWN = [74.8, 100.4, 126.0, 151.6, 177.2, 202.8];
export const COINS_W = 168;
export const COINS_H = 84;

export const coinsScene: PixelScene = (g, t) => {
  const LOOP = 9;
  const lt = t % LOOP;
  sky(g, COINS_W, COINS_H, t, 14, 11);
  px(g, 0, 76, COINS_W, 8, P.night2);
  const max = COST_LICENSED[5];
  const coinsFor = (v: number) => Math.max(1, Math.round((v / max) * 20));
  COST_LICENSED.forEach((lic, i) => {
    const appear = lt - 0.3 - i * 1.0; // one year per second
    if (appear < 0) return;
    const x = 8 + i * 27;
    [lic, COST_OWN[i]].forEach((v, s) => {
      const n = coinsFor(v);
      const color = s === 0 ? P.coral : P.mint;
      const shown = Math.min(n, Math.floor(appear * 40));
      for (let k = 0; k < shown; k++) coin(g, x + s * 10, 72 - k * 3, color);
      // the newest coin drops in
      if (shown < n) {
        const drop = phase(appear * 40, 1);
        coin(g, x + s * 10, 72 - shown * 3 - (1 - drop) * 12, color);
      }
    });
  });
  // gap marker on the last year once both stacks are complete
  if (lt > 6.6) {
    const x = 8 + 5 * 27 + 20;
    const top = 72 - coinsFor(COST_LICENSED[5]) * 3;
    const mid = 72 - coinsFor(COST_OWN[5]) * 3;
    for (let y = top + 2; y < mid; y += 2) px(g, x, y, 1, 1, P.gold);
    px(g, x - 1, top + 2, 3, 1, P.gold);
    px(g, x - 1, mid - 1, 3, 1, P.gold);
  }
};

// ---------------------------------------------------------------- ROI (interactive)
export interface RoiState {
  hoursPerDay: number;
  teamSize: number;
  savingsRatio: number; // 0..1, annual saving relative to a large reference
}
export const ROI_W = 240;
export const ROI_H = 44;

export const roiScene: PixelScene<RoiState> = (g, t, s) => {
  sky(g, ROI_W, ROI_H, t, 20, 21);
  floor(g, ROI_W, 36, 8);
  // one tiny worker per person (up to 14), sweating when many hours are lost
  const people = Math.min(s.teamSize, 14);
  for (let i = 0; i < people; i++) {
    const x = 6 + i * 11;
    px(g, x, 30, 10, 2, P.wood);
    px(g, x + 3, 18, 4, 4, P.skin);
    px(g, x + 3, 17, 4, 1, P.hair);
    px(g, x + 2, 22, 6, 8, i % 3 === 0 ? P.gold : P.shirt);
    if (s.hoursPerDay >= 4 && Math.floor(t * 2 + i) % 3 === 0) px(g, x + 8, 18 + phase(t, 0.6, i * 0.1) * 5, 1, 2, P.ice);
  }
  if (s.teamSize > 14) for (let k = 0; k < 3; k++) px(g, 6 + 14 * 11 + k * 3, 26, 2, 2, P.slate);
  // clock: red wedge = hours lost per day (out of 8)
  const cx = 186, cy = 18;
  ring(g, cx, cy, 10, P.slate);
  const frac = clamp(s.hoursPerDay / 8);
  for (let a = 0; a < frac * Math.PI * 2; a += 0.1) {
    for (let r = 2; r < 9; r += 2) px(g, cx + Math.sin(a) * r, cy - Math.cos(a) * r, 1, 1, P.coral);
  }
  const h = t * 3;
  for (let r = 0; r < 8; r++) px(g, cx + Math.sin(h) * r, cy - Math.cos(h) * r, 1, 1, P.white);
  // savings pile grows with the annual hours recovered
  const pile = Math.max(1, Math.round(2 + clamp(s.savingsRatio) * 10));
  for (let k = 0; k < pile; k++) coin(g, 212 + (k % 2), 32 - k * 3, P.gold);
  const drop = phase(t, 0.9);
  coin(g, 212, 32 - pile * 3 - (1 - drop) * 10, P.gold);
  star(g, 222, 2, t, 1, 0.6);
};

// ---------------------------------------------------------------- value framework icons (24x24)
export const ICON_W = 24;
export const ICON_H = 24;

export const clockIcon: PixelScene = (g, t) => {
  ring(g, 12, 12, 9, P.mint);
  ring(g, 12, 12, 8, P.mint);
  const a = t * 1.5;
  for (let r = 0; r < 7; r++) px(g, 12 + Math.sin(a) * r, 12 - Math.cos(a) * r, 1, 1, P.white);
  for (let r = 0; r < 4; r++) px(g, 12 + Math.sin(a / 12) * r, 12 - Math.cos(a / 12) * r, 1, 1, P.gold);
  px(g, 11, 11, 2, 2, P.mint);
};

export const shieldIcon: PixelScene = (g, t) => {
  const rows = [
    '..cccccccc..', '.cccccccccc.', 'cccccccccccc', 'cccccccccccc', 'cccccccccccc', 'cccccccccccc',
    '.cccccccccc.', '.cccccccccc.', '..cccccccc..', '...cccccc...', '....cccc....', '.....cc.....',
  ];
  const pulse = 0.5 + 0.5 * Math.sin(t * 3);
  sprite(g, rows, { c: pulse > 0.5 ? P.coral : '#E0606B' }, 0, 0, 2);
  check(g, 9, 9, P.white);
  check(g, 9, 10, P.white);
};

export const radarIcon: PixelScene = (g, t) => {
  ring(g, 12, 12, 10, P.sky);
  ring(g, 12, 12, 6, P.dim);
  const a = t * 2.2;
  for (let k = 0; k < 5; k++) {
    const aa = a - k * 0.12;
    for (let r = 0; r < 10; r++) px(g, 12 + Math.cos(aa) * r, 12 + Math.sin(aa) * r, 1, 1, k === 0 ? P.sky : 'rgba(124,156,255,0.35)');
  }
  const blip = phase(t, 2.86);
  if (blip < 0.4) px(g, 16, 7, 2, 2, P.gold);
};

export const scaleIcon: PixelScene = (g, t) => {
  const tilt = Math.sin(t * 1.4) * 2 + 2; // licensed side heavier
  px(g, 11, 4, 2, 16, P.slate);
  px(g, 6, 20, 12, 2, P.slate);
  // beam
  for (let x = 0; x <= 20; x++) px(g, 2 + x, 5 + Math.round((tilt * (x - 10)) / 10), 1, 1, P.gold);
  // pans
  px(g, 0, 10 - tilt, 7, 2, P.coral);
  for (let k = 0; k < 3; k++) px(g, 1, 7 - tilt - k * 2, 5, 2, P.coral);
  px(g, 17, 10 + tilt, 7, 2, P.mint);
  px(g, 18, 8 + tilt, 5, 2, P.mint);
};

// ---------------------------------------------------------------- process steps (96x54)
export const STEP_W = 96;
export const STEP_H = 54;

export const callStep: PixelScene = (g, t) => {
  sky(g, STEP_W, STEP_H, t, 10, 31);
  // two video tiles talking
  [[8, P.shirt], [52, P.gold]].forEach(([x, shirt], i) => {
    const xx = x as number;
    px(g, xx, 12, 36, 26, P.panel);
    px(g, xx, 12, 36, 2, P.line);
    px(g, xx + 14, 18, 8, 7, P.skin);
    px(g, xx + 14, 17, 8, 2, P.hair);
    px(g, xx + 11, 26, 14, 10, shirt as string);
    const talking = Math.floor(t * 1.2) % 2 === i;
    if (talking) {
      px(g, xx + 26, 16, 8, 5, P.white);
      px(g, xx + 27, 18, 5, 1, P.slateDark);
    }
  });
  // a written estimate appears
  const k = phase(t, 4);
  if (k > 0.55) {
    px(g, 40, 40, 16, 12, P.paper);
    for (let i = 0; i < 3; i++) px(g, 42, 43 + i * 3, 10, 1, P.slateDark);
    check(g, 50, 48, P.mintDeep);
  }
};

export const buildStep: PixelScene = (g, t) => {
  sky(g, STEP_W, STEP_H, t, 10, 32);
  floor(g, STEP_W, 46, 8);
  // milestones: blocks stack one by one, each gets a check
  const k = phase(t, 4.5);
  const blocks = Math.min(4, Math.floor(k * 5.5));
  for (let i = 0; i < blocks; i++) {
    const x = 18 + i * 16;
    const h = 8 + i * 6;
    px(g, x, 46 - h, 12, h, i === 3 ? P.gold : P.mint);
    px(g, x, 46 - h, 12, 1, P.mintSoft);
    check(g, x + 4, 46 - h - 6, P.white);
  }
  if (blocks < 4) {
    const x = 18 + blocks * 16;
    const drop = phase(k * 5.5, 1);
    px(g, x, 10 + drop * 20, 12, 6, P.mint);
  }
  star(g, 76, 8, t, 1, 0.5);
};

export const launchStep: PixelScene = (g, t) => {
  sky(g, STEP_W, STEP_H, t, 16, 33);
  floor(g, STEP_W, 48, 6);
  // server rack running
  px(g, 12, 18, 22, 30, P.panel);
  for (let i = 0; i < 4; i++) {
    px(g, 14, 21 + i * 7, 18, 5, P.line);
    px(g, 28, 23 + i * 7, 2, 1, Math.floor(t * 4 + i) % 2 ? P.mint : P.mintDeep);
  }
  // the star orbits the rack: ongoing support
  const a = t * 1.8;
  const sx = 23 + Math.cos(a) * 26 - STAR_W / 2;
  const sy = 30 + Math.sin(a) * 12 - STAR_H / 2;
  star(g, sx, sy, t, 1, 0.4);
  // uptime line
  for (let x = 48; x < 90; x++) {
    const y = 30 + Math.round(Math.sin(x * 0.4 + t * 4) * 1.5);
    px(g, x, y, 1, 1, P.mint);
  }
};

// ---------------------------------------------------------------- contact confirmation (120x68)
export const OK_W = 120;
export const OK_H = 68;

export const receivedScene: PixelScene = (g, t) => {
  sky(g, OK_W, OK_H, t, 20, 41);
  const lt = t % 4;
  const sx = 52, sy = 18;
  const press = clamp((lt - 0.9) / 0.12) * (1 - clamp((lt - 1.15) / 0.15));
  star(g, sx, sy + press, t, 1, 1);
  const hk = ease(clamp(lt / 0.9));
  hand(g, sx + 8 + 30 * (1 - hk), sy + 7 + 18 * (1 - hk) + press, 1);
  if (lt > 1.0) {
    const r = (lt - 1.0) * 22;
    if (r < 44) {
      ring(g, sx + 7, sy + 6, r, P.mint);
      if (r > 6) ring(g, sx + 7, sy + 6, r - 6, P.mintSoft);
    }
  }
  // an envelope flies into the star
  const ek = ease(phase(t, 4, 0.6));
  if (lt < 0.9) {
    px(g, 14 + ek * 30, 50 - ek * 20, 10, 7, P.paper);
    px(g, 14 + ek * 30, 50 - ek * 20, 10, 1, P.gold);
  }
};

// ---------------------------------------------------------------- 404 (160x72)
export const LOST_W = 160;
export const LOST_H = 72;

export const lostScene: PixelScene = (g, t) => {
  sky(g, LOST_W, LOST_H, t, 30, 51);
  floor(g, LOST_W, 60, 12);
  const x = 40 + Math.sin(t * 0.8) * 40;
  const dir = Math.cos(t * 0.8) >= 0 ? 1 : -1;
  // flashlight cone
  for (let i = 0; i < 26; i++) {
    const spread = i * 0.45;
    px(g, x + 7 + dir * (10 + i), 46 - spread, 1, spread * 2 + 1, 'rgba(255,200,87,0.12)');
  }
  star(g, x, 40 + Math.round(Math.sin(t * 6)), t, 1, 0);
  // question marks floating
  for (let i = 0; i < 3; i++) {
    const q = phase(t, 2.4, i * 0.8);
    const qx = 110 + i * 14, qy = 44 - q * 30;
    px(g, qx, qy, 3, 1, P.slate); px(g, qx + 2, qy + 1, 1, 2, P.slate); px(g, qx + 1, qy + 3, 1, 1, P.slate); px(g, qx + 1, qy + 5, 1, 1, P.slate);
  }
};

// ---------------------------------------------------------------- founder avatar (24x24)
export const AVATAR_W = 24;
export const AVATAR_H = 24;

export const founderAvatar: PixelScene = (g, t) => {
  px(g, 0, 0, 24, 24, P.panel);
  const rows = [
    '......hhhhhhh......',
    '....hhhhhhhhhhh....',
    '...hhhhhhhhhhhhh...',
    '...hhssssssssshh...',
    '...hsssssssssssh...',
    '...sssbssssbsss....',
    '...ssssssssssss....',
    '...sssssnnssssss...',
    '....ssssssssss.....',
    '.....smmmmmms......',
    '......ssssss.......',
    '...cccccccccccc....',
    '..cccccccgcccccc...',
    '.ccccccccgccccccc..',
    '.ccccccccgccccccc..',
  ];
  const blink = phase(t, 4) > 0.96;
  sprite(g, rows.map((r) => (blink ? r.replace(/b/g, 's') : r)), { h: P.hair, s: P.skin, b: P.night, n: '#D9A884', m: '#B5695A', c: P.mintDeep, g: P.mint }, 2, 5);
};

