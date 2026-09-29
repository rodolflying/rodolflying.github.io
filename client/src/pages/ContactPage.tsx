import Layout from '@/components/Layout';
import Contact from '@/components/sections/Contact';
import { PageHeader } from '@/components/ui/headers';
import { useLanguage } from '@/hooks/useLanguage';

const ContactPage = () => {
  const { t } = useLanguage();
  return (
    <Layout page="contact">
      <PageHeader title={t('contact.title')} subtitle={t('contact.subtitle')} />
      <Contact />
    </Layout>
  );
};

export default ContactPage;
