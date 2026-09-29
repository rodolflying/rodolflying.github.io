import Layout from '@/components/Layout';
import AreasSection from '@/components/sections/services/AreasSection';
import ValueFrameworkSection from '@/components/sections/services/ValueFrameworkSection';
import ServiceModelSection from '@/components/sections/services/ServiceModelSection';
import { PageHeader, CtaLink } from '@/components/ui/headers';
import { useLanguage } from '@/hooks/useLanguage';

const ServicesPage = () => {
  const { t } = useLanguage();

  return (
    <Layout page="services">
      <PageHeader title={t('services_page.title')} subtitle={t('services_page.subtitle')} />
      <AreasSection />
      <ValueFrameworkSection />
      <ServiceModelSection />
      <section className="py-16 border-t border-line bg-night-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">{t('home.cta_title')}</h2>
            <p className="text-ink-2">{t('home.cta_subtitle')}</p>
          </div>
          <CtaLink href="/contact?service=diagnostico" className="whitespace-nowrap self-start md:self-auto">
            {t('home.cta_contact')}
          </CtaLink>
        </div>
      </section>
    </Layout>
  );
};

export default ServicesPage;
