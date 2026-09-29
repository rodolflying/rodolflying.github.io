import { lazy, Suspense, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ShieldCheck, Wrench, Route, Wallet, Bot, BrainCircuit, Globe, Check, AlertTriangle, ArrowRight, type LucideIcon } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { areas, type AreaIcon } from '@/data/areas';
import AreaScene from '@/components/scenes/AreaScene';
import { useSceneStyle } from '@/hooks/useSceneStyle';
import SceneStyleToggle from '@/components/ui/SceneStyleToggle';

// Loaded on first open: keeps the dialog, its data and the dialog library out of the main bundle.
const AreaOpsDialog = lazy(() => import('./AreaOpsDialog'));

export const AREA_ICONS: Record<AreaIcon, LucideIcon> = {
  shield: ShieldCheck,
  wrench: Wrench,
  route: Route,
  wallet: Wallet,
  bot: Bot,
  brain: BrainCircuit,
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
  const [opsLoaded, setOpsLoaded] = useState(false);
  // The dialog is controlled (no DialogTrigger), so remember which button opened it and hand focus back on close.
  const opener = useRef<HTMLButtonElement | null>(null);
  const openOps = (e: MouseEvent<HTMLButtonElement>) => { opener.current = e.currentTarget; setOpsLoaded(true); setOpsOpen(true); };
  const tabsRef = useRef<HTMLDivElement>(null);

  // ARIA tabs pattern: arrows move (and select) with a roving tabindex, Home/End jump to the ends.
  const onTabKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = areas.findIndex((a) => a.id === activeId);
    const next =
      e.key === 'ArrowRight' ? (i + 1) % areas.length
      : e.key === 'ArrowLeft' ? (i - 1 + areas.length) % areas.length
      : e.key === 'Home' ? 0
      : e.key === 'End' ? areas.length - 1
      : -1;
    if (next < 0) return;
    e.preventDefault();
    setActiveId(areas[next].id);
    tabsRef.current?.querySelector<HTMLButtonElement>(`#area-tab-${areas[next].id}`)?.focus();
  };

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
  const style = useSceneStyle();

  return (
    // The page header (services_page.title) already names this, so no second big title here.
    <section id="areas" aria-label={t('areas.title')} className="pt-2 pb-16 md:pb-20 bg-night">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Area selector: one compact row (scrolls sideways on phones) */}
        <div
          id="areas-tabs"
          ref={tabsRef}
          className="scroll-mt-20 flex lg:flex-wrap gap-2 overflow-x-auto py-1 mb-3 -mx-4 px-4 lg:mx-0 lg:px-0"
          role="tablist"
          aria-label={t('areas.title')}
          onKeyDown={onTabKey}
        >
          {areas.map((a) => {
            const AIcon = AREA_ICONS[a.icon];
            const active = a.id === activeId;
            return (
              <button
                key={a.id}
                type="button"
                id={`area-tab-${a.id}`}
                role="tab"
                aria-selected={active}
                aria-controls="area-panel"
                tabIndex={active ? 0 : -1}
                title={a.name[language]}
                onClick={() => setActiveId(a.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full border whitespace-nowrap flex-shrink-0 text-sm font-semibold transition-colors ${
                  active ? 'text-white' : 'bg-surface-1/60 border-line text-ink-2 hover:text-white hover:border-ink-3'
                }`}
                style={active ? { borderColor: a.color, backgroundColor: `${a.color}1f` } : undefined}
              >
                <AIcon className="w-4 h-4 flex-shrink-0" style={{ color: a.color }} aria-hidden="true" />
                {a.short[language]}
              </button>
            );
          })}
        </div>

        <div id="area-panel" role="tabpanel" aria-labelledby={`area-tab-${area.id}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={area.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl border border-line bg-surface-1 p-4 md:p-6 grid lg:grid-cols-12 lg:grid-rows-[auto_1fr] gap-5 lg:gap-x-8 lg:gap-y-4 items-start"
            >
              {/* Scene: the result is clickable */}
              <div className="lg:col-span-7">
                <button
                  type="button"
                  onClick={openOps}
                  aria-label={`${t('areas.ops_cta')}: ${area.name[language]}`}
                  className="group relative block w-full rounded-xl overflow-hidden text-left transition-colors"
                >
                  <AreaScene areaId={area.id} style={style} lang={language} label={area.pitch[language]} />
                  <span className="pointer-events-none absolute inset-0 rounded-xl ring-inset ring-0 group-hover:ring-2 transition-all" style={{ ['--tw-ring-color' as string]: area.color }} />
                  <span
                    className="absolute top-2 right-2 hidden sm:inline-flex items-center gap-2 rounded-md border bg-night/85 px-2.5 py-1.5 font-mono text-xs text-white transition-colors group-hover:bg-night"
                    style={{ borderColor: `${area.color}88` }}
                  >
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: area.color }} aria-hidden="true" />
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
                    <p className="text-copper-soft leading-relaxed mb-1">{area.people[language]}</p>
                    <p className="text-ink-2 leading-relaxed">{area.pitch[language]}</p>
                  </div>
                </div>

                {/* Results as inline rows (value + label) between hairlines: no box inside the panel */}
                <ul className="mb-5 divide-y divide-line border-y border-line">
                  {area.results.map((r) => (
                    <li key={r.label.es} className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 py-3">
                      <span className="font-display text-lg font-bold leading-tight" style={{ color: area.color }}>{r.value[language]}</span>
                      <span className="text-sm text-ink-2 leading-snug">{r.label[language]}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={openOps}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 font-semibold text-white transition-colors hover:bg-white/5 mb-5"
                  style={{ borderColor: area.color }}
                >
                  {t('areas.ops_cta')} <ArrowRight className="w-4 h-4" style={{ color: area.color }} aria-hidden="true" />
                </button>

                <h4 className="text-sm font-semibold text-white mb-2">{t('areas.what_we_build')}</h4>
                <ul className="space-y-2">
                  {area.solutions.map((s) => (
                    <li key={s.es} className="flex gap-2.5 text-[15px] text-ink-2 leading-snug">
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
                    <span key={r.es} className="inline-flex items-center gap-2 text-sm text-ink-2 px-3 py-1.5 rounded-full bg-white/5 border border-line">
                      <AlertTriangle className="w-4 h-4 text-gold" aria-hidden="true" />
                      {r[language]}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-ink-3 mt-3">{t('areas.results_note')}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-4 text-center">
          <SceneStyleToggle />
        </div>
      </div>

      {opsLoaded && (
        <Suspense fallback={null}>
          <AreaOpsDialog area={area} open={opsOpen} onOpenChange={setOpsOpen} returnFocusTo={opener} />
        </Suspense>
      )}
    </section>
  );
};

export default AreasSection;
