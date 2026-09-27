import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import PixelCanvas from '@/components/pixel/PixelCanvas';
import { clockIcon, shieldIcon, radarIcon, scaleIcon, ICON_W, ICON_H } from '@/components/pixel/moreScenes';

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

const DIMENSIONS = [
  { key: 'efficiency', icon: clockIcon, color: '#47E5C2' },
  { key: 'risk', icon: shieldIcon, color: '#FF8FA3' },
  { key: 'decision', icon: radarIcon, color: '#7C9CFF' },
  { key: 'avoided', icon: scaleIcon, color: '#FFC857' },
] as const;

/** The 4-dimension value framework used in every diagnosis (one sheet per process). */
const ValueFrameworkSection = () => {
  const { t } = useLanguage();

  return (
    <section id="valor" className="py-20 bg-night-900 border-y border-night-line">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">{t('value.title')}</h2>
          <p className="text-slate-300 text-lg">{t('value.subtitle')}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {DIMENSIONS.map(({ key, icon, color }, i) => (
            <motion.article
              key={key}
              className="spotlight rounded-2xl border border-night-line bg-night-800 p-6 flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className="w-14 h-14 mb-4">
                <PixelCanvas scene={icon} width={ICON_W} height={ICON_H} stillAt={1} />
              </div>
              <h3 className="font-display text-lg font-bold text-white mb-2">{t(`value.${key}.title`)}</h3>
              <p className="text-slate-300 leading-relaxed mb-4">{t(`value.${key}.text`)}</p>
              <p className="mt-auto text-sm text-slate-400 border-t border-night-line pt-3">
                <span className="font-semibold" style={{ color }}>{t('value.example')}: </span>
                {t(`value.${key}.example`)}
              </p>
            </motion.article>
          ))}
        </div>

        {/* Measure before, prove after: the statistics behind every project */}
        <div className="mt-8 rounded-2xl border border-night-line bg-night-800 p-6 md:p-8 grid lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-4">
            <h3 className="font-display text-xl md:text-2xl font-bold text-white mb-2">{t('value.proof_title')}</h3>
            <p className="text-slate-300 leading-relaxed">{t('value.proof_subtitle')}</p>
          </div>
          <ol className="lg:col-span-8 grid sm:grid-cols-3 gap-4">
            {PROOF_STEPS.map((key, i) => (
              <li key={key} className="rounded-xl border border-night-line bg-night-900 p-4 flex flex-col">
                <span className="font-mono text-xs text-star mb-2">{String(i + 1).padStart(2, '0')}</span>
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
