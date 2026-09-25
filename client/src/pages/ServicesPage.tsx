import Layout from '@/components/Layout';
import Services from '@/components/sections/Services';
import AreasSection from '@/components/sections/services/AreasSection';
import ValueFrameworkSection from '@/components/sections/services/ValueFrameworkSection';
import ServiceModelSection from '@/components/sections/services/ServiceModelSection';
import ProofOfWorkSection from '@/components/sections/proof/ProofOfWorkSection';
import { useLanguage } from '@/hooks/useLanguage';

const ServicesPage = () => {
  const { t } = useLanguage();

  return (
    <Layout page="services">
      <div className="pt-20">
        <header className="pt-16 text-center bg-night starfield">
          <div className="container mx-auto px-4">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">{t('services_page.title')}</h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">{t('services_page.subtitle')}</p>
          </div>
        </header>
        <AreasSection />
        <ValueFrameworkSection />
        <ServiceModelSection />
        {/* Interactive demos */}
        <ProofOfWorkSection />
        <Services />
      </div>
    </Layout>
  );
};

export default ServicesPage;
