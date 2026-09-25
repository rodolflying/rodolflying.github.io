import { motion } from 'framer-motion';
import { Hammer, LifeBuoy, Server, Check } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const MODES = [
  { key: 'project', icon: Hammer, color: '#47E5C2' },
  { key: 'pool', icon: LifeBuoy, color: '#FFC857' },
  { key: 'infra', icon: Server, color: '#7C9CFF' },
] as const;

const SLA_ROWS = ['high', 'medium', 'low'] as const;
const SLA_COLORS: Record<(typeof SLA_ROWS)[number], string> = { high: '#FF8FA3', medium: '#FFC857', low: '#47E5C2' };

// 5-year cumulative cost of the reference portfolio (team experience), in-house vs. licensed RPA platform.
const OWN_5Y = 202.8;
const LICENSED_5Y = 533.3;

const ServiceModelSection = () => {
  const { t } = useLanguage();
  const included = [1, 2, 3, 4, 5, 6].map((n) => t(`model.pool_includes.i${n}`));

  return (
    <section id="modelo" className="py-20 bg-night">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <p className="text-sm font-semibold text-gold tracking-widest mb-3">{t('model.badge')}</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">{t('model.title')}</h2>
          <p className="text-slate-300 text-lg">{t('model.subtitle')}</p>
        </div>

        {/* Three ways to work together */}
        <div className="grid md:grid-cols-3 gap-5 mb-12">
          {MODES.map(({ key, icon: Icon, color }, i) => (
            <motion.article
              key={key}
              className="spotlight rounded-2xl border border-night-line bg-night-800 p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Icon className="w-7 h-7 mb-4" style={{ color }} />
              <h3 className="font-display text-xl font-bold text-white mb-2">{t(`model.${key}.title`)}</h3>
              <p className="text-slate-300 leading-relaxed mb-3">{t(`model.${key}.text`)}</p>
              <p className="text-sm font-semibold" style={{ color }}>{t(`model.${key}.billing`)}</p>
            </motion.article>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Support pool + SLA */}
          <div className="rounded-2xl border border-night-line bg-night-800 p-6 md:p-8">
            <h3 className="font-display text-xl font-bold text-white mb-4">{t('model.pool_includes_title')}</h3>
            <ul className="space-y-2.5 mb-8">
              {included.map((item) => (
                <li key={item} className="flex gap-3 text-slate-200 leading-relaxed">
                  <Check className="w-5 h-5 text-star mt-0.5 flex-shrink-0" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>

            <h3 className="font-display text-xl font-bold text-white mb-1">{t('model.sla_title')}</h3>
            <p className="text-sm text-slate-400 mb-4">{t('model.sla_note')}</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-slate-400 border-b border-night-line">
                    <th className="py-2 pr-3 font-semibold">{t('model.sla.criticality')}</th>
                    <th className="py-2 pr-3 font-semibold">{t('model.sla.response')}</th>
                    <th className="py-2 pr-3 font-semibold">{t('model.sla.diagnosis')}</th>
                    <th className="py-2 font-semibold">{t('model.sla.resolution')}</th>
                  </tr>
                </thead>
                <tbody>
                  {SLA_ROWS.map((row) => (
                    <tr key={row} className="border-b border-night-line/60 text-slate-200">
                      <td className="py-3 pr-3 font-semibold" style={{ color: SLA_COLORS[row] }}>{t(`model.sla.${row}.name`)}</td>
                      <td className="py-3 pr-3">{t(`model.sla.${row}.response`)}</td>
                      <td className="py-3 pr-3">{t(`model.sla.${row}.diagnosis`)}</td>
                      <td className="py-3">{t(`model.sla.${row}.resolution`)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 5-year cost comparison */}
          <div className="rounded-2xl border border-night-line bg-night-800 p-6 md:p-8 flex flex-col">
            <h3 className="font-display text-xl font-bold text-white mb-1">{t('model.compare_title')}</h3>
            <p className="text-sm text-slate-400 mb-8">{t('model.compare_note')}</p>
            <div className="space-y-6 mb-8">
              {[
                { label: t('model.compare_licensed'), value: LICENSED_5Y, color: '#FF8FA3' },
                { label: t('model.compare_own'), value: OWN_5Y, color: '#47E5C2' },
              ].map((bar) => (
                <div key={bar.label}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-200">{bar.label}</span>
                    <span className="font-semibold text-white">{Math.round((bar.value / LICENSED_5Y) * 100)}%</span>
                  </div>
                  <div className="h-4 rounded-full bg-night-900 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: bar.color }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(bar.value / LICENSED_5Y) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-auto rounded-xl bg-star/10 border border-star/30 p-5">
              <p className="font-display text-4xl font-bold text-star">−{Math.round((1 - OWN_5Y / LICENSED_5Y) * 100)}%</p>
              <p className="text-slate-200 mt-1">{t('model.compare_result')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceModelSection;
