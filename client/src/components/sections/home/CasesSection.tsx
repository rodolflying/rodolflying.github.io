import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { cases } from '@/data/cases';

interface CasesSectionProps {
  /** Home shows only featured cases plus a link to the full list. */
  featuredOnly?: boolean;
}

const CasesSection = ({ featuredOnly = false }: CasesSectionProps) => {
  const { t, language } = useLanguage();
  const list = featuredOnly ? cases.filter((c) => c.featured) : cases;

  return (
    <section id="casos" className="py-20 bg-[#0A1020] border-y border-night-line">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">{t('cases.title')}</h2>
          <p className="text-slate-300 text-lg">{t('cases.subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((c, i) => (
            <motion.article
              key={c.slug}
              id={c.slug}
              className="spotlight rounded-2xl border border-night-line bg-night-800 overflow-hidden flex flex-col scroll-mt-24"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className="h-1" style={{ backgroundColor: c.color }} />
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="text-xs text-slate-300 px-2.5 py-1 rounded-full border border-slate-700">{c.sector[language]}</span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      c.attribution === 'starapps' ? 'bg-[#47E5C2]/15 text-[#47E5C2]' : 'bg-white/5 text-slate-400'
                    }`}
                  >
                    {t(`cases.attribution.${c.attribution}`)}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-white mb-4 leading-snug">{c.title[language]}</h3>

                <dl className="space-y-3 text-sm mb-6">
                  {(['problem', 'solution', 'result'] as const).map((field) => (
                    <div key={field}>
                      <dt className="text-xs font-mono uppercase tracking-wider text-slate-400">{t(`cases.${field}`)}</dt>
                      <dd className="text-slate-300 leading-relaxed">{c[field][language]}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-auto flex items-end justify-between gap-4 pt-4 border-t border-night-line">
                  <div>
                    <p className="text-2xl font-display font-bold" style={{ color: c.color }}>{c.metric.value}</p>
                    <p className="text-xs text-slate-400">{c.metric.label[language]}</p>
                  </div>
                  <p className="text-xs text-slate-400 text-right">{c.stack.join(' · ')}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <p className="text-xs text-slate-400 text-center mt-8 max-w-2xl mx-auto">{t('cases.attribution_note')}</p>

        {featuredOnly && (
          <div className="text-center mt-8">
            <Link href="/projects" className="inline-flex items-center gap-2 text-[#47E5C2] font-semibold hover:underline">
              {t('cases.see_all')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default CasesSection;
