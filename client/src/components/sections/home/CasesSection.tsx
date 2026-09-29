import { useState } from 'react';
import { ArrowRight, ChevronDown, Info } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { cases, type Case } from '@/data/cases';
import { areas } from '@/data/areas';
import { AREA_ICONS } from '@/components/sections/services/AreasSection';
import { SectionHeader, CtaLink } from '@/components/ui/headers';

interface CasesSectionProps {
  /** Home: only the featured cases plus a link to the full list. */
  featuredOnly?: boolean;
}

/** Which service area each case belongs to, for the filter chips on /projects. */
const CASE_AREA: Record<string, string> = {
  'ordenes-trabajo-automaticas': 'mantenimiento',
  'reinicio-remoto-equipos': 'mantenimiento',
  'bot-erp-compras': 'finanzas',
  'control-presupuestario': 'finanzas',
  'reportes-seguridad-nocturnos': 'seguridad',
  'alertas-fatiga': 'seguridad',
  'eficiencia-energetica-flota': 'operaciones',
  'simulacion-atencion': 'operaciones',
  'newsletters-medios': 'datos-web',
  'datos-sociales-nlp': 'datos-web',
  'bot-sii-f29': 'datos-web',
  'rendicion-corfo': 'datos-web',
  'plataforma-blog': 'datos-web',
};

/** Only areas that actually have a case get a chip: no empty filters. */
const FILTER_AREAS = areas.filter((a) => cases.some((c) => CASE_AREA[c.slug] === a.id));

const FIELDS = ['problem', 'solution', 'result'] as const;

/** Keeps "Proyecto Star Apps" and "Experiencia del equipo" visible on every case. */
const AttributionTag = ({ attribution }: { attribution: Case['attribution'] }) => {
  const { t } = useLanguage();
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-md px-2 py-0.5 text-xs font-semibold ${
        attribution === 'starapps' ? 'bg-star/10 text-star' : 'bg-white/5 text-slate-300'
      }`}
    >
      {t(`cases.attribution.${attribution}`)}
    </span>
  );
};

const Stack = ({ items }: { items: string[] }) => <p className="text-xs text-slate-400">{items.join(' · ')}</p>;

/** A featured case: open composition on a thin rule, no box. */
const FeaturedCase = ({ c, compact }: { c: Case; compact: boolean }) => {
  const { t, language } = useLanguage();
  // Home keeps it short: problem and result; the solution and stack live on /projects.
  const fields = compact ? (['problem', 'result'] as const) : FIELDS;
  return (
    // Subgrid on desktop lines up titles, metrics and text across the three columns.
    <article id={c.slug} className="scroll-mt-24 flex flex-col border-t border-night-line pt-6 lg:row-span-5 lg:grid lg:grid-rows-subgrid lg:gap-0">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-400">
        <span>{c.sector[language]}</span>
        <AttributionTag attribution={c.attribution} />
      </div>
      <h3 className="mt-3 font-display text-xl md:text-2xl font-bold leading-snug text-white text-balance">{c.title[language]}</h3>

      <div className="mt-5">
        <p className="font-display text-3xl font-bold leading-tight text-star text-balance">{c.metric.value[language]}</p>
        <p className="mt-1 text-sm text-slate-400 text-pretty">{c.metric.label[language]}</p>
      </div>

      <dl className="mt-6 space-y-4 text-[0.95rem]">
        {fields.map((field) => (
          <div key={field}>
            <dt className="text-sm font-semibold text-white">{t(`cases.${field}`)}</dt>
            <dd className="mt-1 leading-relaxed text-slate-300 text-pretty">{c[field][language]}</dd>
          </div>
        ))}
      </dl>
      {!compact && <div className="mt-6"><Stack items={c.stack} /></div>}
    </article>
  );
};

/** One row of the list: title, sector, impact and authorship; opens to problem / solution / result. */
const CaseRow = ({ c, open, onToggle }: { c: Case; open: boolean; onToggle: () => void }) => {
  const { t, language } = useLanguage();
  const panelId = `${c.slug}-detail`;
  return (
    <li id={c.slug} className="scroll-mt-24">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="group grid w-full grid-cols-[1fr_auto] items-start gap-x-4 gap-y-2 py-5 text-left md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto] md:gap-x-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-star focus-visible:ring-offset-2 focus-visible:ring-offset-night rounded-sm"
        >
          <span className="min-w-0">
            <span className="block font-display text-lg font-semibold leading-snug text-white text-balance transition-colors group-hover:text-star">
              {c.title[language]}
            </span>
            <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm font-normal text-slate-400">
              <span>{c.sector[language]}</span>
              <AttributionTag attribution={c.attribution} />
            </span>
          </span>
          <span className="col-start-1 row-start-2 text-sm font-normal text-slate-300 text-pretty md:col-start-2 md:row-start-1 md:pt-0.5 md:text-base">
            <span className="font-semibold text-star">{c.metric.value[language]}</span> {c.metric.label[language]}
          </span>
          <ChevronDown
            aria-hidden="true"
            className={`col-start-2 row-start-1 mt-1 h-5 w-5 text-slate-400 transition-transform duration-200 group-hover:text-star md:col-start-3 ${open ? 'rotate-180' : ''}`}
          />
        </button>
      </h3>
      <div id={panelId} role="region" aria-label={c.title[language]} hidden={!open} className="pb-7">
        <dl className="grid gap-5 md:grid-cols-3 md:gap-8">
          {FIELDS.map((field) => (
            <div key={field}>
              <dt className="text-sm font-semibold text-white">{t(`cases.${field}`)}</dt>
              <dd className="mt-1 text-[0.95rem] leading-relaxed text-slate-300 text-pretty">{c[field][language]}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-5">
          <Stack items={c.stack} />
        </div>
      </div>
    </li>
  );
};

const CasesSection = ({ featuredOnly = false }: CasesSectionProps) => {
  const { t, language } = useLanguage();
  const [areaId, setAreaId] = useState<string | null>(null);
  // A link to /projects#slug opens that case.
  const [openSlug, setOpenSlug] = useState<string | null>(() =>
    typeof window === 'undefined' ? null : window.location.hash.slice(1) || null,
  );

  // TODO copy: cases.filter_all (ES "Todos" / EN "All"); fallback until the key exists.
  const allLabel = t('cases.filter_all') === 'cases.filter_all' ? (language === 'es' ? 'Todos' : 'All') : t('cases.filter_all');

  const featured = cases.filter((c) => c.featured);
  // "All" lists the cases not already featured above; an area lists every case in it.
  const rows = areaId ? cases.filter((c) => CASE_AREA[c.slug] === areaId) : cases.filter((c) => !c.featured);

  const chip = (active: boolean) =>
    `flex flex-shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-star focus-visible:ring-offset-2 focus-visible:ring-offset-night ${
      active ? 'border-star bg-star/10 text-white' : 'border-night-line bg-night-800/60 text-slate-300 hover:border-slate-600 hover:text-white'
    }`;

  return (
    <section id="casos" className={`${featuredOnly ? 'py-20 border-y border-night-line' : 'pt-4 pb-20'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {featuredOnly ? (
          <SectionHeader title={t('cases.title')} subtitle={t('cases.subtitle')} className="!mb-5" />
        ) : (
          <h2 className="sr-only">{t('cases.title')}</h2>
        )}

        {/* What the two labels mean, next to where they first appear */}
        <p className="mb-10 flex max-w-2xl items-start gap-2 text-sm text-slate-400 text-pretty">
          <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-500" aria-hidden="true" />
          {t('cases.attribution_note')}
        </p>

        <div className="grid gap-12 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-0">
          {featured.map((c) => (
            <FeaturedCase key={c.slug} c={c} compact={featuredOnly} />
          ))}
        </div>

        {featuredOnly ? (
          <div className="mt-12">
            <CtaLink href="/projects" variant="secondary">
              {t('cases.see_all')}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </CtaLink>
          </div>
        ) : (
          <div className="mt-20">
            <div
              className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:flex-wrap lg:px-0"
              role="group"
              aria-label={t('cases.title')}
            >
              <button type="button" aria-pressed={areaId === null} onClick={() => setAreaId(null)} className={chip(areaId === null)}>
                {allLabel}
              </button>
              {FILTER_AREAS.map((a) => {
                const Icon = AREA_ICONS[a.icon];
                return (
                  <button
                    key={a.id}
                    type="button"
                    aria-pressed={areaId === a.id}
                    title={a.name[language]}
                    onClick={() => setAreaId(areaId === a.id ? null : a.id)}
                    className={chip(areaId === a.id)}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0 text-star" aria-hidden="true" />
                    {a.short[language]}
                  </button>
                );
              })}
            </div>

            <ul className="divide-y divide-night-line border-y border-night-line">
              {rows.map((c) => (
                <CaseRow key={c.slug} c={c} open={openSlug === c.slug} onToggle={() => setOpenSlug(openSlug === c.slug ? null : c.slug)} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

export default CasesSection;
