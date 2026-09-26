import { Link } from 'wouter';
import Layout from '@/components/Layout';
import AreasSection from '@/components/sections/services/AreasSection';
import ValueFrameworkSection from '@/components/sections/services/ValueFrameworkSection';
import ServiceModelSection from '@/components/sections/services/ServiceModelSection';
import { useLanguage } from '@/hooks/useLanguage';

const ServicesPage = () => {
  const { t } = useLanguage();

  return (
    <Layout page="services">
      <div className="pt-20">
        <header className="pt-16 bg-night starfield">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">{t('services_page.title')}</h1>
            <p className="text-slate-300 text-lg">{t('services_page.subtitle')}</p>
          </div>
        </header>
        <AreasSection />
        <ValueFrameworkSection />
        <ServiceModelSection />
        <section className="py-16 border-t border-night-line bg-night-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">{t('projects.cta_title')}</h2>
              <p className="text-slate-300">{t('projects.cta_text')}</p>
            </div>
            <Link
              href="/contact?service=diagnostico"
              className="inline-block px-7 py-3.5 bg-star text-night font-semibold rounded-xl hover:bg-star/85 transition-colors whitespace-nowrap"
            >
              {t('home.cta_contact')}
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default ServicesPage;
