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

export interface AreaSceneDef {
  scene: PixelScene;
  /** Logical size in pixels. */
  w: number;
  h: number;
  /** Loop length in seconds. */
  loop: number;
  /** Key frame (s, loop time) shown when still: reduced motion, or a card that is not playing.
   *  Every key frame comes after the click, so it includes the click pause (HOLD). */
  still: number;
  fps?: number;
}

export const AREA_SCENE_DEFS: Record<string, AreaSceneDef> = {
  seguridad: { scene: safetyHQScene, w: SAFETY_W, h: SAFETY_H, loop: SAFETY_LOOP, still: 7.6 + HOLD, fps: 24 },
  mantenimiento: { scene: maintenanceHQScene, w: MAINT_W, h: MAINT_H, loop: MAINT_LOOP, still: 12.4 + HOLD, fps: 24 },
  operaciones: { scene: operationsHQScene, w: OPS_W, h: OPS_H, loop: OPS_LOOP, still: 9.6 + HOLD, fps: 24 },
  finanzas: { scene: financeHQScene, w: HQ_W, h: HQ_H, loop: HQ_LOOP, still: 10 + HOLD, fps: 24 },
  ia: { scene: predictiveHQScene, w: PRED_W, h: PRED_H, loop: PRED_LOOP, still: 7.9 + HOLD, fps: 24 },
  'datos-web': { scene: dataHQScene, w: DATA_W, h: DATA_H, loop: DATA_LOOP, still: 9.4 + HOLD, fps: 24 },
};
