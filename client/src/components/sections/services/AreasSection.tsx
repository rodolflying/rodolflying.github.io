import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ShieldCheck, Wrench, Route, Wallet, Bot, Globe, Check, AlertTriangle, type LucideIcon } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { areas, type AreaIcon } from '@/data/areas';
import PixelCanvas from '@/components/pixel/PixelCanvas';
import { AREA_SCENES, AREA_W, AREA_H } from '@/components/pixel/areaScenes';

export const AREA_ICONS: Record<AreaIcon, LucideIcon> = {
  shield: ShieldCheck,
  wrench: Wrench,
  route: Route,
  wallet: Wallet,
  bot: Bot,
  globe: Globe,
};

const AreasSection = () => {
  const { t, language } = useLanguage();
  const [activeId, setActiveId] = useState(areas[0].id);

  // Deep links like /services#finanzas open that area.
  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.replace('#', '');
      if (areas.some((a) => a.id === id)) {
        setActiveId(id);
        // Deferred: Layout scrolls to top on navigation after this effect runs.
        setTimeout(() => document.getElementById('areas')?.scrollIntoView({ behavior: 'smooth' }), 350);
      }
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);

  const area = areas.find((a) => a.id === activeId) ?? areas[0];
  const Icon = AREA_ICONS[area.icon];

  return (
    <section id="areas" className="py-20 bg-night scroll-mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">{t('areas.title')}</h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg">{t('areas.subtitle')}</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Area selector */}
          <div className="lg:col-span-4 flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0" role="tablist" aria-label={t('areas.title')}>
            {areas.map((a) => {
              const AIcon = AREA_ICONS[a.icon];
              const active = a.id === activeId;
              return (
                <button
                  key={a.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls="area-panel"
                  onClick={() => setActiveId(a.id)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left whitespace-nowrap lg:whitespace-normal transition-colors flex-shrink-0 ${
                    active ? 'bg-night-700 border-transparent text-white' : 'bg-night-800/60 border-night-line text-slate-300 hover:text-white hover:border-slate-600'
                  }`}
                  style={active ? { boxShadow: `inset 3px 0 0 ${a.color}` } : undefined}
                >
                  <AIcon className="w-5 h-5 flex-shrink-0" style={{ color: a.color }} />
                  <span className="font-semibold">{a.name[language]}</span>
                </button>
              );
            })}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-8" id="area-panel" role="tabpanel">
            <AnimatePresence mode="wait">
              <motion.div
                key={area.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="spotlight rounded-2xl border border-night-line bg-night-800 p-6 md:p-8"
              >
                <div className="rounded-xl overflow-hidden border border-night-line mb-6">
                  <PixelCanvas scene={AREA_SCENES[area.id]} width={AREA_W} height={AREA_H} stillAt={5} label={area.pitch[language]} />
                </div>
                <div className="flex items-start gap-4 mb-6">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${area.color}1f`, border: `1px solid ${area.color}55` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: area.color }} />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-white mb-1">{area.name[language]}</h3>
                    <p className="text-slate-300 text-lg leading-relaxed">{area.pitch[language]}</p>
                  </div>
                </div>

                <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">{t('areas.what_we_build')}</p>
                <ul className="space-y-3 mb-8">
                  {area.solutions.map((s) => (
                    <li key={s.es} className="flex gap-3 text-slate-200 leading-relaxed">
                      <Check className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: area.color }} aria-hidden="true" />
                      {s[language]}
                    </li>
                  ))}
                </ul>

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  {area.results.map((r) => (
                    <div key={r.value} className="rounded-xl bg-night-900 border border-night-line p-4">
                      <p className="font-display text-3xl font-bold" style={{ color: area.color }}>{r.value}</p>
                      <p className="text-sm text-slate-300 mt-1">{r.label[language]}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {area.risks.map((r) => (
                    <span key={r.es} className="inline-flex items-center gap-2 text-sm text-slate-200 px-3 py-1.5 rounded-full bg-white/5 border border-night-line">
                      <AlertTriangle className="w-4 h-4 text-gold" aria-hidden="true" />
                      {r[language]}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-slate-400 mt-6">{t('areas.results_note')}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AreasSection;
