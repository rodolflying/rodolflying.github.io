import { useSyncExternalStore } from 'react';
import type { SceneStyle } from '@/components/pixel/areaScenes';

/**
 * Illustration style for the area stories: "line" (executive, the default) or "pixel".
 * Shared by every scene on the page and remembered in this browser.
 */
const KEY = 'starapps.sceneStyle';
const listeners = new Set<() => void>();

function read(): SceneStyle {
  try {
    return localStorage.getItem(KEY) === 'pixel' ? 'pixel' : 'line';
  } catch {
    return 'line';
  }
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  window.addEventListener('storage', fn);
  return () => {
    listeners.delete(fn);
    window.removeEventListener('storage', fn);
  };
}

export function setSceneStyle(style: SceneStyle) {
  try {
    localStorage.setItem(KEY, style);
  } catch {
    /* private mode: the choice just won't persist */
  }
  listeners.forEach((fn) => fn());
}

export function useSceneStyle(): SceneStyle {
  return useSyncExternalStore(subscribe, read, () => 'line');
}
