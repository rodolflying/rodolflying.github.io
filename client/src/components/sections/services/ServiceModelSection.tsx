import { Hammer, LifeBuoy, Server, Check, Plus } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { SectionHeader } from '@/components/ui/headers';

const MODES = [
  { key: 'project', icon: Hammer },
  { key: 'pool', icon: LifeBuoy },
  { key: 'infra', icon: Server },
] as const;

const SLA_ROWS = ['high', 'medium', 'low'] as const;
const SLA_COLORS: Record<(typeof SLA_ROWS)[number], string> = { high: '#FFC857', medium: '#7C9CFF', low: '#47E5C2' };

const FAQ = ['replace', 'fails', 'leave', 'licenses'] as const;

/** How we work together: three modes, what the monthly pool covers, honest response times and the usual questions. */
const ServiceModelSection = () => {
  const { t } = useLanguage();
  const included = [1, 2, 3, 4, 5, 6].map((n) => t(`model.pool_includes.i${n}`));

  return (
    <section id="modelo" className="py-20 bg-night">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title={t('model.title')} subtitle={t('model.subtitle')} />

        {/* Three ways to work together */}
        <div className="grid md:grid-cols-3 md:divide-x divide-night-line border-y border-night-line mb-16">
          {MODES.map(({ key, icon: Icon }) => (
            <article key={key} className="py-8 md:px-8 first:md:pl-0 last:md:pr-0 border-b md:border-b-0 border-night-line last:border-b-0">
              <Icon className="w-6 h-6 mb-4 text-star" aria-hidden="true" />
              <h3 className="font-display text-xl font-bold text-white mb-2">{t(`model.${key}.title`)}</h3>
              <p className="text-slate-300 leading-relaxed mb-3">{t(`model.${key}.text`)}</p>
              <p className="text-sm font-semibold text-gold">{t(`model.${key}.billing`)}</p>
            </article>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* What the monthly pool covers */}
          <div>
            <h3 className="font-display text-2xl font-bold text-white mb-5">{t('model.pool_includes_title')}</h3>
            <ul className="space-y-3">
              {included.map((item) => (
                <li key={item} className="flex gap-3 text-slate-200 leading-relaxed">
                  <Check className="w-5 h-5 text-star mt-0.5 flex-shrink-0" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Response times: automatic alerts around the clock, people on business days */}
          <div>
            <h3 className="font-display text-2xl font-bold text-white mb-2">{t('model.sla_title')}</h3>
            <p className="text-slate-300 mb-5">{t('model.sla_note')}</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-slate-400 border-b border-night-line">
                    <th scope="col" className="py-2 pr-3 font-semibold">{t('model.sla.criticality')}</th>
                    <th scope="col" className="py-2 pr-3 font-semibold">{t('model.sla.response')}</th>
                    <th scope="col" className="py-2 pr-3 font-semibold">{t('model.sla.diagnosis')}</th>
                    <th scope="col" className="py-2 font-semibold">{t('model.sla.resolution')}</th>
                  </tr>
                </thead>
                <tbody>
                  {SLA_ROWS.map((row) => (
                    <tr key={row} className="border-b border-night-line/60 text-slate-200">
                      <th scope="row" className="py-3 pr-3 font-semibold" style={{ color: SLA_COLORS[row] }}>{t(`model.sla.${row}.name`)}</th>
                      <td className="py-3 pr-3">{t(`model.sla.${row}.response`)}</td>
                      <td className="py-3 pr-3">{t(`model.sla.${row}.diagnosis`)}</td>
                      <td className="py-3">{t(`model.sla.${row}.resolution`)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* The questions every manager asks (licenses included, as the last one) */}
        <div className="max-w-3xl">
          <h3 className="font-display text-2xl font-bold text-white mb-4">{t('faq.title')}</h3>
          <div className="divide-y divide-night-line border-y border-night-line">
            {FAQ.map((key) => (
              <details key={key} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-md font-semibold text-white [&::-webkit-details-marker]:hidden">
                  {t(`faq.${key}.q`)}
                  <Plus className="w-5 h-5 flex-shrink-0 text-star transition-transform group-open:rotate-45" aria-hidden="true" />
                </summary>
                <p className="mt-3 text-slate-300 leading-relaxed">{t(`faq.${key}.a`)}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceModelSection;
