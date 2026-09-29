// One story scene per service area: the problem -> the star arrives -> solved.
// Each scene is 256x144 (a camera over a larger world) with dithered lighting.
import type { PixelScene } from './PixelCanvas';
import { financeHQScene, HQ_W, HQ_H, HQ_LOOP } from './financeHQ';
import { maintenanceHQScene, MAINT_W, MAINT_H, MAINT_LOOP } from './maintenanceHQ';
import { safetyHQScene, SAFETY_W, SAFETY_H, SAFETY_LOOP } from './safetyHQ';
import { operationsHQScene, OPS_W, OPS_H, OPS_LOOP } from './operationsHQ';
import { predictiveHQScene, PRED_W, PRED_H, PRED_LOOP } from './predictiveHQ';
import { dataHQScene, DATA_W, DATA_H, DATA_LOOP } from './dataHQ';
import { HOLD } from './sets';
import { maintenanceLineScene, MAINT_LINE_LOOP } from '../scenes/maintenanceLine';
import { CANVAS_W, CANVAS_H, type LineState } from '../scenes/lineKit';

export interface AreaSceneDef {
  /** Pixel scenes ignore the state; executive (line) scenes read the language from it. */
  scene: PixelScene<LineState | undefined>;
  /** Logical size in pixels. */
  w: number;
  h: number;
  /** Loop length in seconds. */
  loop: number;
  /** Key frame (s, loop time) shown when still: reduced motion, or a card that is not playing.
   *  Every key frame comes after the click, so it includes the click pause (HOLD). */
  still: number;
  fps?: number;
  /** Vector scene (executive style): smooth scaling instead of pixelated. */
  smooth?: boolean;
}

export const AREA_SCENE_DEFS: Record<string, AreaSceneDef> = {
  seguridad: { scene: safetyHQScene, w: SAFETY_W, h: SAFETY_H, loop: SAFETY_LOOP, still: 7.6 + HOLD, fps: 24 },
  mantenimiento: { scene: maintenanceHQScene, w: MAINT_W, h: MAINT_H, loop: MAINT_LOOP, still: 12.4 + HOLD, fps: 24 },
  operaciones: { scene: operationsHQScene, w: OPS_W, h: OPS_H, loop: OPS_LOOP, still: 9.6 + HOLD, fps: 24 },
  finanzas: { scene: financeHQScene, w: HQ_W, h: HQ_H, loop: HQ_LOOP, still: 10 + HOLD, fps: 24 },
  ia: { scene: predictiveHQScene, w: PRED_W, h: PRED_H, loop: PRED_LOOP, still: 7.9 + HOLD, fps: 24 },
  'datos-web': { scene: dataHQScene, w: DATA_W, h: DATA_H, loop: DATA_LOOP, still: 9.4 + HOLD, fps: 24 },
};

/** Executive (line-art) versions of the same stories. Areas without one fall back to pixel art. */
export const LINE_SCENE_DEFS: Partial<Record<string, AreaSceneDef>> = {
  mantenimiento: { scene: maintenanceLineScene, w: CANVAS_W, h: CANVAS_H, loop: MAINT_LINE_LOOP, still: 6.9, fps: 30, smooth: true },
};

export type SceneStyle = 'line' | 'pixel';
/** The scene for an area in the chosen style (pixel when the area has no executive version yet). */
export const sceneFor = (areaId: string, style: SceneStyle): AreaSceneDef =>
  (style === 'line' && LINE_SCENE_DEFS[areaId]) || AREA_SCENE_DEFS[areaId];
