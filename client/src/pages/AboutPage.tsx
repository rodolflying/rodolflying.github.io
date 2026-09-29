import Layout from '@/components/Layout';
import About from '@/components/sections/About';
import { PageHeader } from '@/components/ui/headers';
import { useLanguage } from '@/hooks/useLanguage';

const AboutPage = () => {
  const { t } = useLanguage();
  return (
    <Layout page="about">
      <PageHeader title={t('about.title')} subtitle={t('about.subtitle')} />
      <About />
    </Layout>
  );
};

export default AboutPage;
