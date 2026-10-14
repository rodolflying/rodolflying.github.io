import { useEffect, useRef, useState, type ComponentType } from 'react';
import F29Art from './art/F29Art';
import IntegrationsArt from './art/IntegrationsArt';
import WhisperArt from './art/WhisperArt';
import AutoReadArt from './art/AutoReadArt';
import DefaultArt from './art/DefaultArt';
import './art/art.css';

/** Each article's animated line-art scene, by slug. A new article without one gets DefaultArt. */
const SCENES: Record<string, ComponentType> = {
  'declarar-f29-sin-movimiento-automatico': F29Art,
  'integrar-sistemas-sin-api': IntegrationsArt,
  'transcribir-audios-whatsapp-whisper': WhisperArt,
  'extension-chrome-leer-en-voz-alta': AutoReadArt,
};

/**
 * `auto` plays while on screen (article header, featured post); `hover` plays while the pointer
 * or focus is on the surrounding `.group` (list rows); `static` never moves. Paused, a scene
 * shows its finished frame (see art/art.css).
 */
const ArticleArt = ({ slug, mode = 'auto', className = '' }: { slug: string; mode?: 'auto' | 'hover' | 'static'; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (mode !== 'auto' || !el) return;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: 0.25 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [mode]);

  const Scene = SCENES[slug] ?? DefaultArt;
  const state = mode === 'hover' ? 'art-hover' : mode === 'auto' && onScreen ? 'art-live' : '';
  return (
    <div ref={ref} aria-hidden="true" className={`art aspect-[16/9] ${state} ${className}`}>
      <Scene />
    </div>
  );
};

export default ArticleArt;
