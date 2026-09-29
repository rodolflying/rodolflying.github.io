import { useEffect, useRef } from 'react';

export type PixelScene<S = unknown> = (g: CanvasRenderingContext2D, t: number, state: S) => void;

interface PixelCanvasProps<S> {
  scene: PixelScene<S>;
  /** Logical (low-res) size of the scene in pixels. */
  width: number;
  height: number;
  /** Extra data the scene reads every frame (e.g. slider values). */
  state?: S;
  /** Time (s) rendered when the visitor prefers reduced motion. */
  stillAt?: number;
  /** Cap the redraw rate (heavier scenes, or a deliberate low-fps pixel look). */
  fps?: number;
  /** When false, draw the `stillAt` frame once and stay still (e.g. until hovered). */
  play?: boolean;
  /** Vector scenes (the executive style): draw smoothed and scale the canvas without pixelation. */
  smooth?: boolean;
  /** Called with the loop time of every drawn frame (e.g. to sync an HTML caption). */
  onFrame?: (t: number) => void;
  className?: string;
  label?: string;
}

/**
 * Crisp pixel-art canvas: draws a scene on a tiny canvas that CSS scales up with
 * `image-rendering: pixelated`. Animates only while on screen (and while `play`), and
 * renders a single still frame for prefers-reduced-motion.
 */
function PixelCanvas<S>({ scene, width, height, state, stillAt = 2, fps, play = true, smooth = false, onFrame, className = '', label }: PixelCanvasProps<S>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef(state);
  stateRef.current = state;
  const sceneRef = useRef(scene);
  sceneRef.current = scene;
  const onFrameRef = useRef(onFrame);
  onFrameRef.current = onFrame;

  useEffect(() => {
    const canvas = canvasRef.current;
    const g = canvas?.getContext('2d');
    if (!canvas || !g) return;
    g.imageSmoothingEnabled = smooth;
    const reduce = !play || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let visible = false;
    const start = performance.now();
    const minGap = fps ? 1000 / fps : 0;
    let last = -Infinity;

    const frame = (now: number) => {
      if (now - last >= minGap || reduce) {
        // keep the remainder so a 30 fps cap really draws 30 fps on a 60 Hz screen
        last = minGap && Number.isFinite(last) ? now - ((now - last) % minGap) : now;
        const t = reduce ? stillAt : (now - start) / 1000;
        g.setTransform(1, 0, 0, 1, 0, 0); // vector scenes scale the context; start each frame clean
        g.clearRect(0, 0, width, height);
        sceneRef.current(g, t, stateRef.current as S);
        onFrameRef.current?.(t);
      }
      if (!reduce && visible) raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible || reduce) raf = requestAnimationFrame(frame);
    });
    io.observe(canvas);
    raf = requestAnimationFrame(frame);
    // a still frame is drawn once: draw it again when the web fonts arrive
    let alive = true;
    if (reduce) document.fonts?.ready.then(() => alive && requestAnimationFrame(frame));
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [width, height, stillAt, fps, play, smooth]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`block w-full h-auto ${className}`}
      style={{ imageRendering: smooth ? 'auto' : 'pixelated', aspectRatio: `${width} / ${height}` }}
    />
  );
}

export default PixelCanvas;
