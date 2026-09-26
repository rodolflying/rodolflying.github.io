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
  className?: string;
  label?: string;
}

/**
 * Crisp pixel-art canvas: draws a scene on a tiny canvas that CSS scales up with
 * `image-rendering: pixelated`. Animates only while on screen (and while `play`), and
 * renders a single still frame for prefers-reduced-motion.
 */
function PixelCanvas<S>({ scene, width, height, state, stillAt = 2, fps, play = true, className = '', label }: PixelCanvasProps<S>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef(state);
  stateRef.current = state;
  const sceneRef = useRef(scene);
  sceneRef.current = scene;

  useEffect(() => {
    const canvas = canvasRef.current;
    const g = canvas?.getContext('2d');
    if (!canvas || !g) return;
    g.imageSmoothingEnabled = false;
    const reduce = !play || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let visible = false;
    const start = performance.now();
    const minGap = fps ? 1000 / fps : 0;
    let last = -Infinity;

    const frame = (now: number) => {
      if (now - last >= minGap || reduce) {
        last = now;
        const t = reduce ? stillAt : (now - start) / 1000;
        g.clearRect(0, 0, width, height);
        sceneRef.current(g, t, stateRef.current as S);
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
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [width, height, stillAt, fps, play]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`block w-full h-auto ${className}`}
      style={{ imageRendering: 'pixelated', aspectRatio: `${width} / ${height}` }}
    />
  );
}

export default PixelCanvas;
