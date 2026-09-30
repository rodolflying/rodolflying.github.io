import { useLanguage } from '@/hooks/useLanguage';
import Layout from '@/components/Layout';
import Hero from '@/components/sections/Hero';
import AreasOverview from '@/components/sections/home/AreasOverview';
import CasesSection from '@/components/sections/home/CasesSection';
import ProcessSection from '@/components/sections/home/ProcessSection';
import ConnectDotsSection from '@/components/sections/home/ConnectDotsSection';
import RoiCalculator from '@/components/sections/proof/RoiCalculator';
import { CtaLink } from '@/components/ui/headers';
import { DawnSky, ConstellationThread } from '@/components/ui/NightToDawn';

const Home = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      <DawnSky />
      <Hero />
      {/* From here down, a constellation line joins the sections as you scroll */}
      <ConstellationThread>
        <ConnectDotsSection />
        <AreasOverview />
        <CasesSection featuredOnly />
        <ProcessSection />

        {/* How much time comes back: the estimate */}
        <section id="roi" className="py-20 bg-night-900/40 border-t border-night-line">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <RoiCalculator />
          </div>
        </section>

        {/* The one call to action */}
        <section id="cta" className="py-20 border-t border-night-line">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4 text-balance">{t('home.cta_title')}</h2>
            <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">{t('home.cta_subtitle')}</p>
            <CtaLink href="/contact?service=diagnostico">{t('home.cta_contact')}</CtaLink>
          </div>
        </section>
      </ConstellationThread>
    </Layout>
  );
};

export default Home;
