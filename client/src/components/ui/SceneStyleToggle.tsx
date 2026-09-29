import { Gamepad2, PenLine } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { setSceneStyle, useSceneStyle } from '@/hooks/useSceneStyle';

/**
 * A quiet link under the stories: line illustrations are the site's voice, and the pixel-art
 * versions stay one click away as a retro alternative (remembered in this browser).
 */
const SceneStyleToggle = ({ className = '' }: { className?: string }) => {
  const { t } = useLanguage();
  const retro = useSceneStyle() === 'pixel';
  const Icon = retro ? PenLine : Gamepad2;
  return (
    <button
      type="button"
      onClick={() => setSceneStyle(retro ? 'line' : 'pixel')}
      className={`inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm text-slate-400 underline-offset-4 transition-colors hover:text-star hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-star ${className}`}
    >
      <Icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
      {t(retro ? 'areas.style_back' : 'areas.style_retro')}
    </button>
  );
};

export default SceneStyleToggle;
