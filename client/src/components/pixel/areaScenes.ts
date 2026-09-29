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
import { maintenanceLineScene, MAINT_LINE_LOOP, MAINT_LINE_STILL, MAINT_LINE_CAPTIONS } from '../scenes/maintenanceLine';
import { safetyLineScene, SAFETY_LINE_LOOP, SAFETY_LINE_STILL, SAFETY_LINE_CAPTIONS } from '../scenes/safetyLine';
import { operationsLineScene, OPS_LINE_LOOP, OPS_LINE_STILL, OPS_LINE_CAPTIONS } from '../scenes/operationsLine';
import { financeLineScene, FIN_LINE_LOOP, FIN_LINE_STILL, FIN_LINE_CAPTIONS } from '../scenes/financeLine';
import { predictiveLineScene, PRED_LINE_LOOP, PRED_LINE_STILL, PRED_LINE_CAPTIONS } from '../scenes/predictiveLine';
import { dataLineScene, DATA_LINE_LOOP, DATA_LINE_STILL, DATA_LINE_CAPTIONS } from '../scenes/dataLine';
import { CANVAS_W, CANVAS_H, type LineState, type SceneCaptionDef } from '../scenes/lineKit';

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
  /** Documentary captions, shown as HTML over the scene (executive scenes). */
  captions?: SceneCaptionDef[];
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
  seguridad: { scene: safetyLineScene, w: CANVAS_W, h: CANVAS_H, loop: SAFETY_LINE_LOOP, still: SAFETY_LINE_STILL, fps: 30, smooth: true, captions: SAFETY_LINE_CAPTIONS },
  mantenimiento: { scene: maintenanceLineScene, w: CANVAS_W, h: CANVAS_H, loop: MAINT_LINE_LOOP, still: MAINT_LINE_STILL, fps: 30, smooth: true, captions: MAINT_LINE_CAPTIONS },
  operaciones: { scene: operationsLineScene, w: CANVAS_W, h: CANVAS_H, loop: OPS_LINE_LOOP, still: OPS_LINE_STILL, fps: 30, smooth: true, captions: OPS_LINE_CAPTIONS },
  finanzas: { scene: financeLineScene, w: CANVAS_W, h: CANVAS_H, loop: FIN_LINE_LOOP, still: FIN_LINE_STILL, fps: 30, smooth: true, captions: FIN_LINE_CAPTIONS },
  ia: { scene: predictiveLineScene, w: CANVAS_W, h: CANVAS_H, loop: PRED_LINE_LOOP, still: PRED_LINE_STILL, fps: 30, smooth: true, captions: PRED_LINE_CAPTIONS },
  'datos-web': { scene: dataLineScene, w: CANVAS_W, h: CANVAS_H, loop: DATA_LINE_LOOP, still: DATA_LINE_STILL, fps: 30, smooth: true, captions: DATA_LINE_CAPTIONS },
};

export type SceneStyle = 'line' | 'pixel';
/** The scene for an area in the chosen style (pixel when the area has no executive version yet). */
export const sceneFor = (areaId: string, style: SceneStyle): AreaSceneDef =>
  (style === 'line' && LINE_SCENE_DEFS[areaId]) || AREA_SCENE_DEFS[areaId];
