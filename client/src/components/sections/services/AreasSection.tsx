import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ShieldCheck, Wrench, Route, Wallet, Bot, Globe, Check, AlertTriangle, ArrowRight, type LucideIcon } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { areas, type AreaIcon } from '@/data/areas';
import PixelCanvas from '@/components/pixel/PixelCanvas';
import { AREA_SCENE_DEFS } from '@/components/pixel/areaScenes';
import AreaOpsDialog from './AreaOpsDialog';

export const AREA_ICONS: Record<AreaIcon, LucideIcon> = {
  shield: ShieldCheck,
  wrench: Wrench,
  route: Route,
  wallet: Wallet,
  bot: Bot,
  globe: Globe,
};

/**
 * One area at a time: its story scene next to what it solves and what it measured, all
 * in one screen. The scene is a button that opens "how it runs" (flow + live console).
 */
const AreasSection = () => {
  const { t, language } = useLanguage();
  const [activeId, setActiveId] = useState(areas[0].id);
  const [opsOpen, setOpsOpen] = useState(false);

  // Deep links like /services#finanzas open that area.
  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.replace('#', '');
      if (areas.some((a) => a.id === id)) {
        setActiveId(id);
        // Deferred: Layout scrolls to top on navigation after this effect runs.
        setTimeout(() => document.getElementById('areas-tabs')?.scrollIntoView({ behavior: 'smooth' }), 350);
      }
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);

  const area = areas.find((a) => a.id === activeId) ?? areas[0];
  const Icon = AREA_ICONS[area.icon];
  const def = AREA_SCENE_DEFS[area.id];

  return (
    <section id="areas" className="py-16 md:py-20 bg-night">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">{t('areas.title')}</h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg">{t('areas.subtitle')}</p>
        </div>

        {/* Area selector: one compact row (scrolls sideways on phones) */}
        <div
          id="areas-tabs"
          className="scroll-mt-20 flex lg:flex-wrap lg:justify-center gap-2 overflow-x-auto pb-2 mb-3 -mx-4 px-4 lg:mx-0 lg:px-0"
          role="tablist"
          aria-label={t('areas.title')}
        >
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
                title={a.name[language]}
                onClick={() => setActiveId(a.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full border whitespace-nowrap flex-shrink-0 text-sm font-semibold transition-colors ${
                  active ? 'text-white' : 'bg-night-800/60 border-night-line text-slate-300 hover:text-white hover:border-slate-600'
                }`}
                style={active ? { borderColor: a.color, backgroundColor: `${a.color}1f` } : undefined}
              >
                <AIcon className="w-4 h-4 flex-shrink-0" style={{ color: a.color }} aria-hidden="true" />
                {a.short[language]}
              </button>
            );
          })}
        </div>

        <div id="area-panel" role="tabpanel">
          <AnimatePresence mode="wait">
            <motion.div
              key={area.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="spotlight rounded-2xl border border-night-line bg-night-800 p-4 md:p-6 grid lg:grid-cols-12 gap-5 lg:gap-x-8 lg:gap-y-4 items-start"
            >
              {/* Scene: the result is clickable */}
              <div className="lg:col-span-7">
                <button
                  type="button"
                  onClick={() => setOpsOpen(true)}
                  aria-label={`${t('areas.ops_cta')}: ${area.name[language]}`}
                  className="group relative block w-full rounded-xl overflow-hidden border border-night-line text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-star"
                >
                  <PixelCanvas key={area.id} scene={def.scene} width={def.w} height={def.h} stillAt={def.still} fps={def.fps} label={area.pitch[language]} />
                  <span className="pointer-events-none absolute inset-0 rounded-xl ring-inset ring-0 group-hover:ring-2 transition-all" style={{ ['--tw-ring-color' as string]: area.color }} />
                  <span
                    className="absolute top-2 right-2 inline-flex items-center gap-2 rounded-md border bg-night/85 px-2.5 py-1.5 font-mono text-xs text-white transition-colors group-hover:bg-night"
                    style={{ borderColor: `${area.color}88` }}
                  >
                    <span className="relative flex h-2 w-2" aria-hidden="true">
                      <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" style={{ backgroundColor: area.color }} />
                      <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: area.color }} />
                    </span>
                    {t('areas.ops_cta')}
                  </span>
                </button>
              </div>

              {/* What it is, what it measured, and the way in */}
              <div className="lg:col-span-5 lg:row-span-2">
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${area.color}1f`, border: `1px solid ${area.color}55` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: area.color }} />
                  </div>
                  <div>
                    <h3 className="font-display text-xl md:text-2xl font-bold text-white leading-tight mb-1">{area.name[language]}</h3>
                    <p className="text-slate-300 leading-relaxed">{area.pitch[language]}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  {area.results.map((r) => (
                    <div key={r.value} className="rounded-xl bg-night-900 border border-night-line p-3">
                      <p className="font-display text-2xl md:text-3xl font-bold leading-none" style={{ color: area.color }}>{r.value}</p>
                      <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-snug">{r.label[language]}</p>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setOpsOpen(true)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 font-semibold text-white transition-colors hover:bg-white/5 mb-5"
                  style={{ borderColor: area.color }}
                >
                  {t('areas.ops_cta')} <ArrowRight className="w-4 h-4" style={{ color: area.color }} aria-hidden="true" />
                </button>

                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t('areas.what_we_build')}</p>
                <ul className="space-y-2">
                  {area.solutions.map((s) => (
                    <li key={s.es} className="flex gap-2.5 text-[15px] text-slate-200 leading-snug">
                      <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: area.color }} aria-hidden="true" />
                      {s[language]}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Risks avoided + note, under the scene on large screens */}
              <div className="lg:col-span-7">
                <div className="flex flex-wrap gap-2">
                  {area.risks.map((r) => (
                    <span key={r.es} className="inline-flex items-center gap-2 text-sm text-slate-200 px-3 py-1.5 rounded-full bg-white/5 border border-night-line">
                      <AlertTriangle className="w-4 h-4 text-gold" aria-hidden="true" />
                      {r[language]}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-3">{t('areas.results_note')}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <AreaOpsDialog area={area} open={opsOpen} onOpenChange={setOpsOpen} />
    </section>
  );
};

export default AreasSection;
