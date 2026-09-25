import { useLanguage } from '@/hooks/useLanguage';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Linkedin, Code2, KeyRound, LifeBuoy, FileText, ArrowRight } from 'lucide-react';

const PRINCIPLES = [
  { key: 'ownership', icon: KeyRound, color: '#47E5C2' },
  { key: 'no_licenses', icon: Code2, color: '#7C9CFF' },
  { key: 'support', icon: LifeBuoy, color: '#FFC857' },
  { key: 'docs', icon: FileText, color: '#FF7A85' },
] as const;

const INDUSTRIES = ['media', 'real_estate', 'social_research', 'logistics', 'accounting', 'education', 'public_sector'] as const;

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const About = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-20 bg-[#070B14]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div className="text-center mb-14" {...fadeUp}>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4 uppercase tracking-wider">
            {t('about.title')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#47E5C2] to-[#7C9CFF] mx-auto mb-6" />
          <p className="text-slate-300 max-w-2xl mx-auto md:text-lg leading-relaxed">{t('about.subtitle')}</p>
        </motion.div>

        {/* Who we are + founder */}
        <div className="grid lg:grid-cols-12 gap-8 mb-16">
          <motion.div className="lg:col-span-7 rounded-xl border border-night-line bg-[#0E1626] p-6 md:p-8" {...fadeUp}>
            <h2 className="text-lg font-display font-bold text-[#47E5C2] mb-4 uppercase tracking-wider">
              {t('about.who_title')}
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">{t('about.who_p1')}</p>
            <p className="text-slate-300 leading-relaxed mb-6">{t('about.who_p2')}</p>
            <p className="text-slate-400 text-sm border-t border-night-line pt-4">
              Star Apps SpA · RUT 77.373.407-0 · {t('about.country')}
            </p>
          </motion.div>

          <motion.div
            className="lg:col-span-5 rounded-xl border border-night-line bg-[#0E1626] p-6 md:p-8 flex flex-col"
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-lg font-display font-bold text-[#7C9CFF] mb-5 uppercase tracking-wider">
              {t('about.founder_title')}
            </h2>
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-14 h-14 rounded-full bg-gradient-to-br from-[#47E5C2] to-[#7C9CFF] flex items-center justify-center font-display font-bold text-[#070B14] text-lg flex-shrink-0"
                aria-hidden="true"
              >
                RS
              </div>
              <div>
                <p className="font-display font-bold text-white">Rodolfo Sepúlveda</p>
                <p className="text-sm text-slate-400">{t('about.founder_role')}</p>
              </div>
            </div>
            <p className="text-slate-300 leading-relaxed mb-6 flex-1">{t('about.founder_bio')}</p>
            <a
              href="https://www.linkedin.com/in/rodolfo-sepulveda-847532135/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#47E5C2] hover:underline self-start"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </a>
          </motion.div>
        </div>

        {/* How we work */}
        <motion.div className="mb-16" {...fadeUp}>
          <h2 className="text-2xl font-display font-bold text-white text-center mb-8">{t('about.principles_title')}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PRINCIPLES.map(({ key, icon: Icon, color }) => (
              <div key={key} className="rounded-xl border border-night-line bg-[#0E1626] p-5">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${color}18`, border: `1px solid ${color}35` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <h3 className="font-semibold text-white mb-2">{t(`about.principles.${key}.title`)}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{t(`about.principles.${key}.text`)}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Industries */}
        <motion.div className="mb-16 text-center" {...fadeUp}>
          <h2 className="text-2xl font-display font-bold text-white mb-3">{t('about.industries_title')}</h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-6">{t('about.industries_subtitle')}</p>
          <ul className="flex flex-wrap justify-center gap-3">
            {INDUSTRIES.map((key) => (
              <li key={key} className="px-4 py-2 rounded-full border border-slate-700 bg-[#0E1626] text-slate-200 text-sm">
                {t(`about.industries.${key}`)}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* CTA */}
        <motion.div className="text-center" {...fadeUp}>
          <Link
            href="/contact?service=diagnostico"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#47E5C2] text-[#070B14] font-bold rounded-lg hover:bg-[#47E5C2]/85 transition-colors"
          >
            {t('about.cta')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
