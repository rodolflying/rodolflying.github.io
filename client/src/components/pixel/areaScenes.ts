// One looping 160x90 pixel scene per service area: problem -> the star arrives -> solved.
import type { PixelScene } from './PixelCanvas';
import { financeHQScene, HQ_W, HQ_H } from './financeHQ';
import {
  P, px, clamp, ease, phase, sky, floor, star, person, sweat, desk, monitor, paperStack, paper,
  check, database, bars, alertIcon, ring, STAR_W,
} from './sprites';

export const AREA_W = 160;
export const AREA_H = 90;
const LOOP = 7;
const ARRIVE = 2.4; // star starts flying in
const LANDED = 3.1; // star in place, solution running

/** Loop timing shared by every area scene. */
function timeline(t: number) {
  const lt = t % LOOP;
  const solved = lt >= LANDED;
  const arrive = ease(clamp((lt - ARRIVE) / (LANDED - ARRIVE)));
  const leave = ease(clamp((lt - (LOOP - 0.5)) / 0.5));
  const progress = clamp((lt - LANDED) / (LOOP - 0.5 - LANDED));
  return { lt, solved, arrive, leave, progress };
}

/** Star flies from the top-right corner to (x, y), and fades up at the end of the loop. */
function arrivingStar(g: CanvasRenderingContext2D, t: number, x: number, y: number) {
  const { lt, arrive, leave } = timeline(t);
  if (lt < ARRIVE) return;
  const sx = AREA_W + 4 + (x - AREA_W - 4) * arrive;
  const sy = -16 + (y + 16) * arrive - leave * 30;
  const bob = lt >= LANDED ? Math.round(Math.sin(t * 5) * 1) : 0;
  if (arrive < 1) for (let i = 1; i < 4; i++) px(g, sx + STAR_W + i * 4 * (1 - arrive), sy + 3 - i * 3 * (1 - arrive), 1, 1, i % 2 ? P.gold : P.mintSoft);
  star(g, sx, sy + bob, t);
  if (lt >= LANDED && lt < LANDED + 0.6) ring(g, x + 7, y + 6, (lt - LANDED) * 30, P.mint);
}

// 1. Seguridad: alerts that nobody sees -> every alert handled and logged.
export const safetyScene: PixelScene = (g, t) => {
  const { solved, progress } = timeline(t);
  sky(g, AREA_W, AREA_H, t, 18, 1);
  floor(g, AREA_W, 72, 18);
  desk(g, 30, 60, 80);
  monitor(g, 52, 30, 44, 28, solved ? '#061A17' : '#0B1322');
  // operator rows with alert states
  for (let i = 0; i < 4; i++) {
    const y = 34 + i * 5;
    px(g, 56, y, 14, 2, P.slateDark);
    const ringing = !solved && Math.sin(t * 7 + i * 2) > 0.2;
    const handled = solved && progress > i * 0.2;
    if (handled) check(g, 84, y - 1);
    else alertIcon(g, 83, y - 2, ringing);
  }
  if (!solved) {
    // the operator looks away: busy with papers
    person(g, 14, 36, t, 'idle');
    paperStack(g, 6, 58, 4);
    if (Math.floor(t * 3) % 2) px(g, 104, 24, 3, 3, P.coral);
  } else {
    person(g, 14, 36, t, 'coffee');
    // automatic log filling up
    px(g, 112, 36, 18, 22, P.paper);
    const lines = Math.floor(progress * 6);
    for (let i = 0; i < lines; i++) px(g, 114, 39 + i * 3, 13, 1, P.slateDark);
  }
  arrivingStar(g, t, 98, 34);
};

// 2. Mantenimiento: a failure nobody reports -> work order created and sent to the technician.
export const maintenanceScene: PixelScene = (g, t) => {
  const { solved, progress, lt } = timeline(t);
  sky(g, AREA_W, AREA_H, t, 16, 2);
  floor(g, AREA_W, 66, 24);
  // road with moving dashes
  for (let x = -12; x < AREA_W; x += 16) px(g, x + ((t * 20) % 16), 76, 8, 1, P.dim);
  // vehicle (generic service truck)
  const vx = 20;
  px(g, vx, 50, 40, 14, P.sky);
  px(g, vx + 40, 54, 14, 10, P.ice);
  px(g, vx + 44, 56, 7, 4, P.night);
  px(g, vx + 4, 64, 8, 4, P.night); px(g, vx + 6, 65, 4, 2, P.slate);
  px(g, vx + 38, 64, 8, 4, P.night); px(g, vx + 40, 65, 4, 2, P.slate);
  // antenna on the roof
  px(g, vx + 18, 42, 1, 8, P.slate);
  const broken = Math.floor(lt * 4) % 2 === 0;
  if (!solved) {
    if (broken) { px(g, vx + 16, 40, 5, 1, P.coral); px(g, vx + 18, 38, 1, 5, P.coral); }
    // technician waiting, not aware
    person(g, 124, 40, t, 'idle', P.gold);
    px(g, 128, 32, 3, 1, P.slate); px(g, 130, 33, 1, 2, P.slate); px(g, 129, 36, 1, 1, P.slate); // "?"
  } else {
    // scan beam from the star, then a work order flies to the technician
    if (progress < 0.35) for (let y = 30; y < 50; y += 2) px(g, vx + 18, y, 1, 1, P.mint);
    px(g, vx + 18, 40, 1, 1, P.mint);
    const k = ease(clamp((progress - 0.3) / 0.4));
    const ox = vx + 24 + (120 - vx - 24) * k;
    const oy = 34 - Math.sin(k * Math.PI) * 16;
    if (k > 0 && k < 1) { paper(g, ox, oy); px(g, ox, oy, 8, 2, P.gold); }
    person(g, 124, 40, t, 'idle', P.gold);
    if (k >= 1) {
      px(g, 138, 46, 6, 9, P.line); px(g, 139, 47, 4, 6, P.mintDeep); // phone
      check(g, 139, 49, P.white);
    }
  }
  arrivingStar(g, t, 32, 24);
};

// 3. Operaciones: KPIs built by hand on sample days -> every trip calculated automatically.
export const operationsScene: PixelScene = (g, t) => {
  const { solved, progress } = timeline(t);
  sky(g, AREA_W, AREA_H, t, 14, 3);
  // chart panel
  px(g, 44, 14, 108, 62, P.panel);
  px(g, 48, 70, 100, 1, P.slateDark);
  const n = 12;
  for (let i = 0; i < n; i++) {
    const x = 52 + i * 8;
    const plan = 18 + Math.round(10 * Math.sin(i * 0.9));
    // plan line (dashed)
    if (i % 2 === 0) px(g, x, 70 - plan - 8, 6, 1, P.slate);
    const real = plan + Math.round(8 * Math.sin(i * 2.3));
    let show = false;
    if (!solved) show = [1, 5, 9].includes(i) && phase(t, 7) > i / 14; // only sample days
    else show = progress > i / n;
    if (show) {
      const late = real > plan + 3;
      px(g, x + 1, 70 - real, 4, real, solved && late ? P.coral : P.mint);
    } else if (!solved) px(g, x + 1, 68, 4, 2, P.dim);
  }
  if (!solved) {
    person(g, 12, 44, t, 'idle');
    px(g, 24, 56, 8, 10, P.slateDark); px(g, 25, 57, 6, 3, P.ice); // calculator
    sweat(g, 22, 45, t);
  } else {
    person(g, 12, 44, t, 'coffee');
    // KPI tile
    px(g, 124, 18, 24, 12, P.night2);
    px(g, 127, 22, Math.round(18 * progress), 3, P.gold);
  }
  arrivingStar(g, t, 20, 18);
};

// 4. Finanzas: ERP data entry piling up -> documents flow in, checked and stored.
export const financeScene: PixelScene = (g, t) => {
  const { solved, progress, lt } = timeline(t);
  sky(g, AREA_W, AREA_H, t, 16, 4);
  floor(g, AREA_W, 72, 18);
  desk(g, 30, 60, 84);
  monitor(g, 60, 36, 34, 22, solved ? '#061A17' : '#0B1322');
  if (!solved) {
    person(g, 38, 40, t, 'typing');
    sweat(g, 48, 40, t);
    paperStack(g, 98, 58, 3 + Math.floor(lt * 2.5));
    for (let i = 0; i < 3; i++) px(g, 64, 41 + i * 4, 6 + Math.floor(phase(t, 1.2, i * 0.4) * 18), 2, P.slate);
  } else {
    person(g, 12, 40, t, 'coffee');
    const left = Math.max(0, 9 - Math.floor(progress * 11));
    paperStack(g, 98, 58, left);
    const k = ease(phase(t, 0.45));
    if (left > 0) paper(g, 99 + (70 - 99) * k, 58 - left * 2 + (40 - 58 + left * 2) * k - Math.sin(k * Math.PI) * 10);
    const done = Math.min(3, Math.floor(progress * 5));
    for (let i = 0; i < done; i++) { px(g, 64, 41 + i * 4, 16, 2, P.mintDeep); check(g, 84, 40 + i * 4); }
    database(g, 128, 50, progress);
    for (let i = 0; i < 2; i++) {
      const q = phase(t, 0.8, i * 0.4);
      px(g, 96 + (128 - 96) * q, 48 + (58 - 48) * q, 2, 2, i ? P.gold : P.mint);
    }
  }
  arrivingStar(g, t, 42, 22);
};

// 5. IA: messages pouring in unsorted -> classified into urgent / medium / low tickets.
export const aiScene: PixelScene = (g, t) => {
  const { solved, progress } = timeline(t);
  sky(g, AREA_W, AREA_H, t, 16, 5);
  floor(g, AREA_W, 76, 14);
  const bins = [
    { x: 58, c: P.coral },
    { x: 88, c: P.gold },
    { x: 118, c: P.mint },
  ];
  bins.forEach((b) => {
    px(g, b.x, 58, 22, 18, P.panel);
    px(g, b.x, 58, 22, 2, b.c);
  });
  // phone on the left spitting chat bubbles
  px(g, 10, 30, 16, 28, P.line); px(g, 12, 32, 12, 22, P.night2);
  for (let i = 0; i < 4; i++) {
    const q = phase(t, 1.6, i * 0.4);
    if (!solved) {
      // bubbles fall into a messy pile
      const x = 28 + q * 30 + i * 3;
      const y = 34 + q * q * 36;
      px(g, x, Math.min(y, 70 - i * 3), 9, 5, i % 2 ? P.white : P.mintSoft);
    } else {
      const bin = bins[i % 3];
      const k = ease(q);
      const x = 28 + (bin.x + 6 - 28) * k;
      const y = 36 + (60 - 36) * k - Math.sin(k * Math.PI) * 14;
      px(g, x, y, 9, 5, i % 2 ? P.white : P.mintSoft);
    }
  }
  if (!solved) {
    for (let i = 0; i < 6; i++) px(g, 56 + i * 6, 70 - (i % 3) * 3, 9, 5, i % 2 ? P.white : P.mintSoft);
    person(g, 136, 30, t, 'idle');
    sweat(g, 146, 30, t);
  } else {
    bins.forEach((b, i) => {
      const n = Math.floor(progress * (3 - i * 0.6) * 2);
      for (let j = 0; j < n; j++) px(g, b.x + 3, 72 - j * 3, 16, 2, b.c);
    });
  }
  arrivingStar(g, t, 34, 18);
};

// 6. Datos: copying from websites by hand -> a crawler fills the table and the chart.
export const dataScene: PixelScene = (g, t) => {
  const { solved, progress } = timeline(t);
  sky(g, AREA_W, AREA_H, t, 14, 6);
  // three browser windows
  for (let i = 0; i < 3; i++) {
    const x = 8, y = 10 + i * 24;
    px(g, x, y, 40, 20, P.panel);
    px(g, x, y, 40, 4, P.line);
    px(g, x + 2, y + 1, 2, 2, P.coral); px(g, x + 5, y + 1, 2, 2, P.gold); px(g, x + 8, y + 1, 2, 2, P.mint);
    for (let r = 0; r < 3; r++) px(g, x + 3, y + 7 + r * 4, 20 + ((i + r) % 3) * 5, 1, P.slateDark);
  }
  // spreadsheet grid
  px(g, 92, 10, 60, 44, P.panel);
  for (let r = 0; r < 8; r++) px(g, 92, 14 + r * 5, 60, 1, P.line);
  for (let c = 0; c < 3; c++) px(g, 110 + c * 14, 10, 1, 44, P.line);
  const rows = solved ? Math.floor(progress * 8) : Math.floor(phase(t, 7) * 2.2);
  for (let r = 0; r < rows; r++) {
    px(g, 95, 16 + r * 5, 12, 2, P.mint);
    px(g, 113, 16 + r * 5, 9, 2, P.slate);
    px(g, 127, 16 + r * 5, 9, 2, P.slate);
    px(g, 141, 16 + r * 5, 8, 2, P.gold);
  }
  if (!solved) {
    person(g, 60, 50, t, 'idle');
    // slow copy arrow
    const q = phase(t, 2.4);
    px(g, 48 + q * 40, 20, 3, 2, P.slate);
    sweat(g, 70, 50, t);
  } else {
    // the star zips between the windows, data streaming to the table
    for (let i = 0; i < 3; i++) {
      const q = phase(t, 0.7, i * 0.23);
      px(g, 48 + (92 - 48) * q, 18 + i * 24 + (20 - 18 - i * 24) * q, 2, 2, i === 1 ? P.gold : P.mint);
    }
    bars(g, 108, 60, progress);
    person(g, 64, 50, t, 'coffee');
  }
  arrivingStar(g, t, 58, 30);
};

export const AREA_SCENES: Record<string, PixelScene> = {
  seguridad: safetyScene,
  mantenimiento: maintenanceScene,
  operaciones: operationsScene,
  finanzas: financeScene,
  ia: aiScene,
  'datos-web': dataScene,
};

/** Scene + logical size per area. Finance uses the higher-detail "style frame" scene. */
export const AREA_SCENE_DEFS: Record<string, { scene: PixelScene; w: number; h: number; still: number; fps?: number }> = {
  ...Object.fromEntries(Object.entries(AREA_SCENES).map(([k, scene]) => [k, { scene, w: AREA_W, h: AREA_H, still: 5 }])),
  finanzas: { scene: financeHQScene, w: HQ_W, h: HQ_H, still: 10, fps: 24 },
};
