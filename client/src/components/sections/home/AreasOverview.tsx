import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { areas } from '@/data/areas';
import { AREA_ICONS } from '@/components/sections/services/AreasSection';
import PixelCanvas from '@/components/pixel/PixelCanvas';
import { AREA_SCENE_DEFS } from '@/components/pixel/areaScenes';

const AreasOverview = () => {
  const { t, language } = useLanguage();

  return (
    <section id="capacidades" className="py-20 bg-night">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">{t('areas.title')}</h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg">{t('areas.subtitle')}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {areas.map((area, i) => {
            const Icon = AREA_ICONS[area.icon];
            const headline = area.results[0];
            return (
              <motion.div
                key={area.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <Link
                  href={`/services#${area.id}`}
                  className="spotlight group h-full rounded-2xl border border-night-line bg-night-800 p-6 flex flex-col"
                >
                  <div className="rounded-xl overflow-hidden border border-night-line mb-5 -mx-1">
                    <PixelCanvas scene={AREA_SCENE_DEFS[area.id].scene} width={AREA_SCENE_DEFS[area.id].w} height={AREA_SCENE_DEFS[area.id].h} stillAt={AREA_SCENE_DEFS[area.id].still} fps={AREA_SCENE_DEFS[area.id].fps} />
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${area.color}1f`, border: `1px solid ${area.color}55` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: area.color }} />
                    </div>
                    <h3 className="font-display text-lg font-bold text-white leading-tight">{area.name[language]}</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed mb-5">{area.pitch[language]}</p>
                  <div className="mt-auto flex items-end justify-between gap-4 pt-4 border-t border-night-line">
                    <div>
                      <p className="font-display text-2xl font-bold" style={{ color: area.color }}>{headline.value}</p>
                      <p className="text-sm text-slate-400">{headline.label[language]}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-star group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AreasOverview;
