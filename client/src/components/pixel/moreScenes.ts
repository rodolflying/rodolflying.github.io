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

