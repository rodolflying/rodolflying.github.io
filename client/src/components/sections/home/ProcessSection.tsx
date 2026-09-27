import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { DiagnosisArt, BuildArt, SupportArt } from './ProcessArt';

const STEPS = ['diagnosis', 'build', 'support'] as const;
const STEP_ART = { diagnosis: DiagnosisArt, build: BuildArt, support: SupportArt };

const ProcessSection = () => {
  const { t } = useLanguage();

  return (
    <section id="proceso" className="py-20 bg-[#070B14]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white">{t('process.title')}</h2>
        </div>

        <ol className="grid md:grid-cols-3 gap-6 mb-10">
          {STEPS.map((step, i) => {
            const Art = STEP_ART[step];
            return (
            <motion.li
              key={step}
              className="spotlight relative rounded-2xl border border-night-line bg-night-800 p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="rounded-xl border border-night-line bg-night px-4 py-5 mb-5">
                <Art />
              </div>
              <p className="font-display text-sm font-bold text-gold mb-1">0{i + 1}</p>
              <h3 className="text-white font-semibold text-lg mb-2">{t(`process.steps.${step}.title`)}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{t(`process.steps.${step}.text`)}</p>
            </motion.li>
            );
          })}
        </ol>

        <motion.div
          className="rounded-xl border border-[#47E5C2]/30 bg-[#47E5C2]/5 p-6 md:p-8 flex flex-col md:flex-row gap-5 items-start"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <ShieldCheck className="w-10 h-10 text-[#47E5C2] flex-shrink-0" aria-hidden="true" />
          <div>
            <h3 className="text-white font-semibold text-lg mb-2">{t('process.guarantee_title')}</h3>
            <p className="text-slate-300 text-sm leading-relaxed">{t('process.guarantee_text')}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProcessSection;
