import { motion } from 'framer-motion';
import { Timer, ShieldAlert, Radar, Scale } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const DIMENSIONS = [
  { key: 'efficiency', icon: Timer, color: '#47E5C2' },
  { key: 'risk', icon: ShieldAlert, color: '#FF8FA3' },
  { key: 'decision', icon: Radar, color: '#7C9CFF' },
  { key: 'avoided', icon: Scale, color: '#FFC857' },
] as const;

/** The 4-dimension value framework used in every diagnosis (one sheet per process). */
const ValueFrameworkSection = () => {
  const { t } = useLanguage();

  return (
    <section id="valor" className="py-20 bg-night-900 border-y border-night-line">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <p className="text-sm font-semibold text-star tracking-widest mb-3">{t('value.badge')}</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">{t('value.title')}</h2>
          <p className="text-slate-300 text-lg">{t('value.subtitle')}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {DIMENSIONS.map(({ key, icon: Icon, color }, i) => (
            <motion.article
              key={key}
              className="spotlight rounded-2xl border border-night-line bg-night-800 p-6 flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${color}1f`, border: `1px solid ${color}55` }}>
                <Icon className="w-5 h-5" style={{ color }} />
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
      </div>
    </section>
  );
};

export default ValueFrameworkSection;
