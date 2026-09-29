import { useLanguage } from '@/hooks/useLanguage';
import { setSceneStyle, useSceneStyle } from '@/hooks/useSceneStyle';
import type { SceneStyle } from '@/components/pixel/areaScenes';

/** Small segmented control to switch the story illustrations between executive and pixel art. */
const SceneStyleToggle = ({ className = '' }: { className?: string }) => {
  const { t } = useLanguage();
  const style = useSceneStyle();
  const options: Array<{ id: SceneStyle; label: string }> = [
    { id: 'line', label: t('areas.style_line') },
    { id: 'pixel', label: t('areas.style_pixel') },
  ];
  return (
    <div className={`inline-flex items-center gap-2 text-xs text-slate-400 ${className}`}>
      <span>{t('areas.style_label')}</span>
      <div className="inline-flex rounded-full border border-night-line bg-night-800 p-0.5" role="radiogroup" aria-label={t('areas.style_label')}>
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={style === o.id}
            onClick={() => setSceneStyle(o.id)}
            className={`rounded-full px-3 py-1 font-medium transition-colors ${style === o.id ? 'bg-night-700 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SceneStyleToggle;
