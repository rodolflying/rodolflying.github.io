import { useCallback, useRef } from 'react';
import { Play } from 'lucide-react';
import PixelCanvas from '@/components/pixel/PixelCanvas';
import { sceneFor, type SceneStyle } from '@/components/pixel/areaScenes';
import { captionAt, captionTime, type Lang } from './lineKit';

interface AreaSceneProps {
  areaId: string;
  style: SceneStyle;
  lang: Lang;
  play?: boolean;
  /** Accessible name; executive scenes default to their whole story (the captions in order). */
  label?: string;
  /** Short prompt ("play story") shown while still: in the caption strip, or over pixel scenes. */
  hint?: string;
}

/**
 * An area's story scene in the chosen style. Executive scenes get their documentary caption as
 * an HTML strip under the canvas: readable at any card size, never covering the picture, and in
 * the page language. The strip keeps room for two lines so it never changes height mid-story.
 */
const AreaScene = ({ areaId, style, lang, play = true, label, hint }: AreaSceneProps) => {
  const def = sceneFor(areaId, style);
  const boxRef = useRef<HTMLSpanElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const shown = useRef('');

  // Runs every drawn frame: touch the DOM only when the caption or its opacity changes.
  const sync = useCallback((t: number) => {
    const el = boxRef.current;
    if (!el) return;
    const c = captionAt(def.captions, t % def.loop);
    el.style.opacity = c ? String(c.k) : '0';
    const id = c ? `${c.cap.from}|${lang}` : '';
    if (!c || shown.current === id) return;
    shown.current = id;
    if (timeRef.current) {
      const time = captionTime(c.cap, lang);
      timeRef.current.textContent = time ?? '';
      timeRef.current.hidden = !time;
    }
    if (textRef.current) textRef.current.textContent = c.cap[lang];
  }, [def, lang]);

  const story = def.captions?.map((c) => { const time = captionTime(c, lang); return time ? `${time}: ${c[lang]}` : c[lang]; }).join('. ');

  return (
    <div className="relative">
      <PixelCanvas
        key={`${areaId}-${style}-${lang}`}
        scene={def.scene}
        width={def.w}
        height={def.h}
        stillAt={def.still}
        fps={def.fps}
        smooth={def.smooth}
        state={{ lang }}
        play={play}
        onFrame={def.captions ? sync : undefined}
        label={story ?? label}
      />
      {def.captions && (
        <p aria-hidden="true" className="flex min-h-[3.25rem] items-center gap-3 border-t border-night-line bg-night-900 px-3 py-2 text-[13px] leading-snug text-slate-100">
          <span ref={boxRef} className="flex-1 opacity-0">
            <span ref={timeRef} className="mr-2 font-mono text-xs font-semibold text-star" />
            <span ref={textRef} />
          </span>
          {hint && <span className="inline-flex flex-shrink-0 items-center gap-1.5 font-mono text-xs text-star"><Play className="h-3 w-3 fill-current" />{hint}</span>}
        </p>
      )}
      {hint && !def.captions && (
        <span className="absolute bottom-2 left-2 inline-flex items-center gap-1.5 rounded-md border border-night-line bg-night/80 px-2 py-1 font-mono text-xs text-star" aria-hidden="true">
          <Play className="h-3 w-3 fill-current" />{hint}
        </span>
      )}
    </div>
  );
};

export default AreaScene;
