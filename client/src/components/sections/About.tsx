import { useLanguage } from '@/hooks/useLanguage';
import { Linkedin, Code2, KeyRound, LifeBuoy, FileText, ArrowRight } from 'lucide-react';
import { SectionHeader, CtaLink } from '@/components/ui/headers';

const PRINCIPLES = [
  { key: 'ownership', icon: KeyRound },
  { key: 'no_licenses', icon: Code2 },
  { key: 'support', icon: LifeBuoy },
  { key: 'docs', icon: FileText },
] as const;

const INDUSTRIES = ['media', 'real_estate', 'social_research', 'logistics', 'accounting', 'education', 'public_sector'] as const;

/** The body of /about; the page header (h1) lives in AboutPage. */
const About = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="bg-night pt-6 pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Who we are + founder: two open columns on a thin rule */}
        <div className="grid gap-12 border-t border-night-line pt-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 className="font-display text-2xl md:text-3xl font-bold leading-tight text-white text-balance">{t('about.who_title')}</h2>
            <p className="mt-5 max-w-prose leading-relaxed text-slate-300 text-pretty">{t('about.who_p1')}</p>
            <p className="mt-4 max-w-prose leading-relaxed text-slate-300 text-pretty">{t('about.who_p2')}</p>
            <p className="mt-6 text-sm text-slate-400">Star Apps SpA · RUT 77.373.407-0 · {t('about.country')}</p>
          </div>

          <div className="flex flex-col lg:col-span-5">
            <h2 className="font-display text-2xl md:text-3xl font-bold leading-tight text-white text-balance">{t('about.founder_title')}</h2>
            <div className="mt-5 flex items-center gap-4">
              <img
                src="/founder.webp"
                alt="Rodolfo Sepúlveda"
                width={80}
                height={80}
                loading="lazy"
                className="h-20 w-20 flex-shrink-0 rounded-full object-cover ring-1 ring-night-line"
              />
              <div>
                <p className="font-display font-bold text-white">Rodolfo Sepúlveda</p>
                <p className="text-sm text-slate-400">{t('about.founder_role')}</p>
              </div>
            </div>
            <p className="mt-5 leading-relaxed text-slate-300 text-pretty">{t('about.founder_bio')}</p>
            <a
              href="https://www.linkedin.com/in/rodolfo-sepulveda-847532135/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 self-start rounded-sm text-sm font-semibold text-star underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-star focus-visible:ring-offset-2 focus-visible:ring-offset-night"
            >
              <Linkedin className="h-4 w-4" aria-hidden="true" />
              LinkedIn
            </a>
          </div>
        </div>

        {/* Principles: four rows with thin dividers, one accent */}
        <div className="mt-24">
          <SectionHeader title={t('about.principles_title')} />
          <ul className="divide-y divide-night-line border-y border-night-line">
            {PRINCIPLES.map(({ key, icon: Icon }) => (
              <li key={key} className="grid gap-x-8 gap-y-2 py-6 md:grid-cols-[minmax(0,18rem)_1fr] md:items-start">
                <h3 className="flex items-center gap-3 font-display text-lg font-semibold text-white">
                  <Icon className="h-5 w-5 flex-shrink-0 self-center text-star" strokeWidth={1.75} aria-hidden="true" />
                  {t(`about.principles.${key}.title`)}
                </h3>
                <p className="max-w-prose leading-relaxed text-slate-300 text-pretty md:pl-0 pl-8">{t(`about.principles.${key}.text`)}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Industries */}
        <div className="mt-24">
          <SectionHeader title={t('about.industries_title')} subtitle={t('about.industries_subtitle')} className="!mb-6" />
          <ul className="flex flex-wrap gap-2.5">
            {INDUSTRIES.map((key) => (
              <li key={key} className="rounded-full border border-night-line bg-night-800 px-4 py-2 text-sm text-slate-200">
                {t(`about.industries.${key}`)}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16">
          <CtaLink href="/contact?service=diagnostico">
            {t('about.cta')}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </CtaLink>
        </div>
      </div>
    </section>
  );
};

export default About;
