import Layout from '@/components/Layout';
import AreasOverview from '@/components/sections/home/AreasOverview';
import CasesSection from '@/components/sections/home/CasesSection';
import { useLanguage } from '@/hooks/useLanguage';
import { Link } from 'wouter';

const ProjectsPage = () => {
  const { t } = useLanguage();

  return (
    <Layout page="projects">
      <div className="pt-20">
        <header className="pt-16 pb-4 text-center bg-[#070B14]">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white uppercase tracking-wider mb-4">
              {t('projects.title')}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-[#47E5C2] to-[#7C9CFF] mx-auto" />
          </div>
        </header>
        <CasesSection />
        <AreasOverview />
        <section className="py-16 bg-[#0A1020] border-t border-night-line text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-display font-bold text-white mb-4">{t('projects.cta_title')}</h2>
            <p className="text-slate-400 max-w-xl mx-auto mb-8">{t('projects.cta_text')}</p>
            <Link
              href="/contact?service=diagnostico"
              className="inline-block px-8 py-3 bg-[#47E5C2] text-[#070B14] font-bold rounded-lg hover:bg-[#47E5C2]/85 transition-colors"
            >
              {t('home.cta_contact')}
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default ProjectsPage;
