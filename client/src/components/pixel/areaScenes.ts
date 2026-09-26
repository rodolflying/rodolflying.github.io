// One story scene per service area: the problem -> the star arrives -> solved.
// Each scene is 256x144 (a camera over a larger world) with dithered lighting.
import type { PixelScene } from './PixelCanvas';
import { financeHQScene, HQ_W, HQ_H, HQ_LOOP } from './financeHQ';
import { maintenanceHQScene, MAINT_W, MAINT_H, MAINT_LOOP } from './maintenanceHQ';
import { safetyHQScene, SAFETY_W, SAFETY_H, SAFETY_LOOP } from './safetyHQ';
import { operationsHQScene, OPS_W, OPS_H, OPS_LOOP } from './operationsHQ';
import { aiHQScene, AI_W, AI_H, AI_LOOP } from './aiHQ';
import { dataHQScene, DATA_W, DATA_H, DATA_LOOP } from './dataHQ';

export interface AreaSceneDef {
  scene: PixelScene;
  /** Logical size in pixels. */
  w: number;
  h: number;
  /** Loop length in seconds. */
  loop: number;
  /** Key frame (s) shown when still: reduced motion, or a card that is not playing. */
  still: number;
  fps?: number;
}

export const AREA_SCENE_DEFS: Record<string, AreaSceneDef> = {
  seguridad: { scene: safetyHQScene, w: SAFETY_W, h: SAFETY_H, loop: SAFETY_LOOP, still: 7.6, fps: 24 },
  mantenimiento: { scene: maintenanceHQScene, w: MAINT_W, h: MAINT_H, loop: MAINT_LOOP, still: 12.4, fps: 24 },
  operaciones: { scene: operationsHQScene, w: OPS_W, h: OPS_H, loop: OPS_LOOP, still: 9.6, fps: 24 },
  finanzas: { scene: financeHQScene, w: HQ_W, h: HQ_H, loop: HQ_LOOP, still: 10, fps: 24 },
  ia: { scene: aiHQScene, w: AI_W, h: AI_H, loop: AI_LOOP, still: 7.4, fps: 24 },
  'datos-web': { scene: dataHQScene, w: DATA_W, h: DATA_H, loop: DATA_LOOP, still: 9.4, fps: 24 },
};
