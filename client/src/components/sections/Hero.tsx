import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import StarConstellation from '@/components/ui/StarConstellation';
import { CtaLink } from '@/components/ui/headers';

const Hero = () => {
  const { t } = useLanguage();
  // The last words (what the team gains) carry the warm copper accent.
  const accent = t('hero.title_accent');
  const title = t('hero.title');
  const lead = title.endsWith(accent) ? title.slice(0, -accent.length) : `${title} `;

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden starfield">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(60% 50% at 75% 45%, rgba(71,229,194,0.10), transparent 70%), radial-gradient(40% 40% at 15% 80%, rgba(255,200,87,0.06), transparent 70%)',
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            {/* The page's one authored entrance is the star on the right; the title simply appears. */}
            <motion.h1
              className="font-display font-bold text-white tracking-tight leading-[1.08] text-4xl sm:text-5xl lg:text-6xl mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              {lead}
              <span className="text-copper-soft">{accent}</span>
            </motion.h1>

            <motion.p
              className="text-slate-300 text-lg leading-relaxed max-w-2xl mb-8 sm:text-justify hyphens-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4 items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
            >
              <CtaLink href="/contact?service=diagnostico" className="group">
                {t('hero.cta_diagnostic')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </CtaLink>
              <a
                href="#puntos"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('puntos')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-night-line text-white font-semibold hover:border-star hover:text-star transition-colors"
              >
                {t('hero.cta_demo')}
              </a>
            </motion.div>

            <motion.ul
              className="mt-8 flex flex-col sm:flex-row sm:flex-wrap gap-x-6 gap-y-2 text-sm text-slate-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.6 }}
            >
              {(['trust_1', 'trust_2', 'trust_3'] as const).map((k) => (
                <li key={k} className="inline-flex items-center gap-2">
                  <Check className="w-4 h-4 text-star flex-shrink-0" aria-hidden="true" />
                  {t(`hero.${k}`)}
                </li>
              ))}
            </motion.ul>

          </div>

          <motion.div
            className="lg:col-span-5 relative order-first lg:order-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="relative aspect-square w-full max-w-[240px] sm:max-w-[320px] lg:max-w-[520px] mx-auto">
              <StarConstellation />
            </div>
            <p className="text-center text-xs text-slate-400 mt-2 hidden lg:block">{t('hero.hint')}</p>
          </motion.div>
        </div>
      </div>

    </section>
  );
};

export default Hero;
