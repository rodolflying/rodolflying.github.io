import { ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { SectionHeader } from '@/components/ui/headers';
import { DiagnosisArt, BuildArt, SupportArt } from './ProcessArt';

const STEPS = ['diagnosis', 'build', 'support'] as const;
const STEP_ART = { diagnosis: DiagnosisArt, build: BuildArt, support: SupportArt };

/** Three steps in the order they happen. */
const ProcessSection = () => {
  const { t } = useLanguage();

  return (
    <section id="proceso" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title={t('process.title')} />

        <ol className="grid md:grid-cols-3 gap-x-10 gap-y-12 mb-12">
          {STEPS.map((step, i) => {
            const Art = STEP_ART[step];
            return (
              <li key={step} className="relative">
                <div className="mb-5">
                  <Art />
                </div>
                <p className="font-mono text-xs text-gold mb-1">{i + 1}</p>
                <h3 className="font-display text-white font-bold text-xl mb-2">{t(`process.steps.${step}.title`)}</h3>
                <p className="text-slate-300 leading-relaxed">{t(`process.steps.${step}.text`)}</p>
              </li>
            );
          })}
        </ol>

        <div className="flex flex-col md:flex-row gap-4 items-start border-t border-night-line pt-6">
          <ShieldCheck className="w-8 h-8 text-star flex-shrink-0" aria-hidden="true" />
          <div className="max-w-3xl">
            <h3 className="font-display text-white font-bold text-lg mb-1">{t('process.guarantee_title')}</h3>
            <p className="text-slate-300 leading-relaxed">{t('process.guarantee_text')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
