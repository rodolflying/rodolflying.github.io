import { ArrowRight } from 'lucide-react';
import Layout from '@/components/Layout';
import CasesSection from '@/components/sections/home/CasesSection';
import { PageHeader, CtaLink } from '@/components/ui/headers';
import { useLanguage } from '@/hooks/useLanguage';

/** Until the copy is rewritten, an all-caps title still reads in sentence case. */
const sentenceCase = (s: string) => (s === s.toUpperCase() ? s.charAt(0) + s.slice(1).toLowerCase() : s);

const ProjectsPage = () => {
  const { t } = useLanguage();

  return (
    <Layout page="projects">
      <PageHeader title={sentenceCase(t('projects.title'))} subtitle={t('cases.subtitle')} />
      <CasesSection />
      <section className="border-t border-night-line bg-night-900 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl md:text-3xl font-bold leading-tight text-white text-balance">{t('projects.cta_title')}</h2>
            <p className="mt-3 mb-8 text-lg text-slate-300 text-pretty">{t('projects.cta_text')}</p>
            <CtaLink href="/contact?service=diagnostico">
              {t('home.cta_contact')}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </CtaLink>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProjectsPage;
