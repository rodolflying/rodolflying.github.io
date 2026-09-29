import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { EfficiencyIcon, RiskIcon, DecisionIcon, CostIcon } from './ValueIcons';
import { SectionHeader } from '@/components/ui/headers';

const PROOF_STEPS = ['baseline', 'pilot', 'impact'] as const;

/** A bell curve with its shaded confidence interval: "the saving, with its range". */
const ConfidenceCurve = () => {
  const pts = Array.from({ length: 41 }, (_, i) => {
    const x = i / 40;
    const y = Math.exp(-((x - 0.5) ** 2) / (2 * 0.12 ** 2));
    return [8 + x * 144, 50 - y * 38] as const;
  });
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const band = pts.filter(([x]) => x >= 8 + 0.26 * 144 && x <= 8 + 0.74 * 144);
  const area = `M${band[0][0]},50 ` + band.map(([x, y]) => `L${x.toFixed(1)},${y.toFixed(1)}`).join(' ') + ` L${band[band.length - 1][0]},50 Z`;
  return (
    <svg viewBox="0 0 160 56" className="w-full h-14 mt-3" aria-hidden="true">
      <path d={area} fill="#47E5C2" opacity="0.25" />
      <path d={line} fill="none" stroke="#47E5C2" strokeWidth="1.5" />
      <line x1="8" y1="50.5" x2="152" y2="50.5" stroke="#1E2A40" />
      <line x1="80" y1="10" x2="80" y2="50" stroke="#FFC857" strokeDasharray="2 2" />
    </svg>
  );
};

const PILLARS = [
  { key: 'efficiency', Icon: EfficiencyIcon, color: '#D98B54' },
  { key: 'risk', Icon: RiskIcon, color: '#47E5C2' },
  { key: 'decision', Icon: DecisionIcon, color: '#7C9CFF' },
] as const;

/**
 * What comes back to the company: three pillars (resources, reliable systems, information to
 * decide), the five-year total cost as a quieter fourth line, and how we prove it.
 * This is the value sheet every diagnosis delivers, one per process.
 */
const ValueFrameworkSection = () => {
  const { t } = useLanguage();
  const reduce = useReducedMotion();

  return (
    <section id="valor" className="py-20 bg-night-900/40 border-y border-night-line">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title={t('value.title')} subtitle={t('value.subtitle')} />

        <div className="grid md:grid-cols-3 gap-x-10 gap-y-10">
          {PILLARS.map(({ key, Icon, color }) => (
            // the column's states ("show" on scroll, "hover") also drive its icon's animation
            <motion.article
              key={key}
              className="border-t border-night-line pt-6 flex flex-col"
              initial={reduce ? false : 'hidden'}
              whileInView="show"
              whileHover={reduce ? undefined : 'hover'}
              viewport={{ once: true }}
              variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.4, when: 'beforeChildren' } } }}
            >
              <div className="mb-4">
                <Icon color={color} />
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-2">{t(`value.${key}.title`)}</h3>
              <p className="text-slate-300 leading-relaxed mb-3">{t(`value.${key}.text`)}</p>
              <p className="mt-auto text-sm text-slate-400">
                <span className="font-semibold" style={{ color }}>{t('value.example')}: </span>
                {t(`value.${key}.example`)}
              </p>
            </motion.article>
          ))}
        </div>

        {/* The quieter fourth line of the sheet: total cost, information rather than attack */}
        <div className="mt-10 flex flex-col sm:flex-row sm:items-start gap-4 border-t border-night-line pt-6">
          <div className="flex-shrink-0 opacity-80">
            <CostIcon color="#94A3B8" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-white mb-1">{t('value.avoided.title')}</h3>
            <p className="text-slate-300 leading-relaxed">
              {t('value.avoided.text')} <span className="text-slate-400">{t('value.example')}: {t('value.avoided.example')}</span>
            </p>
          </div>
        </div>

        {/* Measure before, prove after: the statistics behind every project */}
        <div className="mt-16 grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-3 text-balance">{t('value.proof_title')}</h3>
            <p className="text-slate-300 leading-relaxed">{t('value.proof_subtitle')}</p>
          </div>
          <ol className="lg:col-span-8 grid sm:grid-cols-3 gap-x-8 gap-y-6">
            {PROOF_STEPS.map((key, i) => (
              <li key={key} className="border-t-2 pt-4 flex flex-col" style={{ borderColor: i === 2 ? '#47E5C2' : '#1E2A40' }}>
                <span className="font-mono text-xs text-star mb-2">{i + 1}</span>
                <p className="font-display font-bold text-white mb-1">{t(`value.proof.${key}.title`)}</p>
                <p className="text-sm text-slate-300 leading-relaxed">{t(`value.proof.${key}.text`)}</p>
                {key === 'impact' && <ConfidenceCurve />}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default ValueFrameworkSection;
