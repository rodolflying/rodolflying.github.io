import { useState } from 'react';
import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { areas } from '@/data/areas';
import { AREA_ICONS } from '@/components/sections/services/AreasSection';
import AreaScene from '@/components/scenes/AreaScene';
import { useSceneStyle } from '@/hooks/useSceneStyle';
import SceneStyleToggle from '@/components/ui/SceneStyleToggle';
import { SectionHeader } from '@/components/ui/headers';

/** The six areas as stories: the scene, the person it frees, and the way into the details. */
const AreasOverview = () => {
  const { t, language } = useLanguage();
  const style = useSceneStyle();
  // Six story scenes at once is a lot of work: with a mouse, a card plays its story while
  // hovered or focused and shows its key frame otherwise. Touch screens play what is visible.
  const [canHover] = useState(() => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  const [active, setActive] = useState<string | null>(null);

  return (
    <section id="capacidades" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title={t('areas.title')} subtitle={t('areas.subtitle')} align="center" />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {areas.map((area) => {
            const Icon = AREA_ICONS[area.icon];
            return (
              <Link
                key={area.id}
                href={`/services#${area.id}`}
                onMouseEnter={() => setActive(area.id)}
                onMouseLeave={() => setActive((a) => (a === area.id ? null : a))}
                onFocus={() => setActive(area.id)}
                onBlur={() => setActive((a) => (a === area.id ? null : a))}
                className="spotlight group h-full rounded-2xl border border-night-line bg-night-800 overflow-hidden flex flex-col"
              >
                <AreaScene
                  areaId={area.id}
                  style={style}
                  lang={language}
                  play={!canHover || active === area.id}
                  hint={canHover && active !== area.id ? (language === 'es' ? 'ver historia' : 'play story') : undefined}
                />
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="flex items-center gap-2.5 font-display text-lg font-bold text-white leading-tight mb-3">
                    <Icon className="w-5 h-5 flex-shrink-0" style={{ color: area.color }} aria-hidden="true" />
                    {area.name[language]}
                  </h3>
                  <p className="text-copper-soft leading-relaxed mb-2">{area.people[language]}</p>
                  <p className="text-sm text-slate-400 leading-relaxed">{area.pitch[language]}</p>
                  <span className="mt-auto pt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-300 group-hover:text-star transition-colors">
                    {language === 'es' ? 'Ver el área' : 'See the area'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="mt-6 text-center">
          <SceneStyleToggle />
        </div>
      </div>
    </section>
  );
};

export default AreasOverview;
