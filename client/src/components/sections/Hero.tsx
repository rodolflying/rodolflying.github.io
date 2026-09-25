import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowRight, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import StarConstellation from '@/components/ui/StarConstellation';

const wordVariants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(8px)' },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { delay: 0.15 + i * 0.07, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
};

const Hero = () => {
  const { t } = useLanguage();
  const words = t('hero.title').split(' ');
  const trust = [t('hero.trust_1'), t('hero.trust_2'), t('hero.trust_3')];

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
            <motion.p
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-star/30 bg-star/10 text-star text-sm font-medium mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="w-2 h-2 rounded-full bg-star animate-pulse" />
              {t('hero.badge')}
            </motion.p>

            <h1 className="font-display font-bold text-white tracking-tight leading-[1.05] text-4xl sm:text-5xl lg:text-6xl mb-5">
              {words.map((word, i) => (
                <motion.span
                  key={`${word}-${i}`}
                  className="inline-block mr-[0.25em]"
                  custom={i}
                  variants={wordVariants}
                  initial="hidden"
                  animate="show"
                >
                  {word}
                </motion.span>
              ))}
              <motion.span
                className="block mt-4 text-xl sm:text-2xl lg:text-[28px] leading-snug font-semibold text-transparent bg-clip-text bg-gradient-to-r from-star via-star-soft to-gold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 + words.length * 0.07 + 0.1, duration: 0.8 }}
              >
                {t('hero.title_highlight')}
              </motion.span>
            </h1>

            <motion.p
              className="text-slate-300 text-lg leading-relaxed max-w-2xl mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4 items-center mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05, duration: 0.6 }}
            >
              <Link
                href="/contact?service=diagnostico"
                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-star text-night font-semibold text-base shadow-[0_0_40px_-8px_rgba(71,229,194,0.7)] hover:shadow-[0_0_55px_-6px_rgba(71,229,194,0.9)] hover:-translate-y-0.5 transition-all"
              >
                {t('hero.cta_diagnostic')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#puntos"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('puntos')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-night-line bg-white/5 text-white font-semibold hover:border-star/50 hover:bg-star/10 transition-colors"
              >
                {t('hero.cta_demo')}
              </a>
            </motion.div>

            <motion.ul
              className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.25, duration: 0.6 }}
            >
              {trust.map((item) => (
                <li key={item} className="inline-flex items-center gap-2">
                  <Check className="w-4 h-4 text-star" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </motion.ul>
          </div>

          <motion.div
            className="lg:col-span-5 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="relative aspect-square w-full max-w-[520px] mx-auto">
              <StarConstellation />
            </div>
            <p className="text-center text-xs text-slate-400 mt-2 hidden lg:block">{t('hero.hint')}</p>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-slate-400"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        aria-hidden="true"
      >
        <ChevronDown className="w-6 h-6" />
      </motion.div>
    </section>
  );
};

export default Hero;
