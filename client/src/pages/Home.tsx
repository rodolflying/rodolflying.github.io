import { useLanguage } from '@/hooks/useLanguage';
import Layout from '@/components/Layout';
import Hero from '@/components/sections/Hero';
import AreasOverview from '@/components/sections/home/AreasOverview';
import ValueFrameworkSection from '@/components/sections/services/ValueFrameworkSection';
import CasesSection from '@/components/sections/home/CasesSection';
import ProcessSection from '@/components/sections/home/ProcessSection';
import ConnectDotsSection from '@/components/sections/home/ConnectDotsSection';
import RoiCalculator from '@/components/sections/proof/RoiCalculator';
import { Link } from 'wouter';
import { motion } from 'framer-motion';

const Home = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      <Hero />
      <ConnectDotsSection />
      <AreasOverview />
      <CasesSection featuredOnly />
      <ValueFrameworkSection />
      <ProcessSection />

      {/* ROI estimate with the interactive pixel scene */}
      <section id="roi" className="py-20 bg-[#0A1020] border-t border-night-line">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <RoiCalculator />
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="py-16 bg-gradient-to-br from-[#47E5C2]/5 via-transparent to-[#7C9CFF]/5 border-t border-night-line">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-display font-bold text-white mb-4">{t('home.cta_title')}</h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">{t('home.cta_subtitle')}</p>
            <Link
              href="/contact?service=diagnostico"
              className="inline-block px-8 py-3 bg-[#47E5C2] text-[#070B14] font-bold rounded-lg hover:bg-[#47E5C2]/85 transition-colors shadow-lg shadow-[#47E5C2]/20"
            >
              {t('home.cta_contact')}
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
