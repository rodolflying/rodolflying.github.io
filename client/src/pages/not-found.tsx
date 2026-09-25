import { Link } from 'wouter';
import Layout from '@/components/Layout';
import { useLanguage } from '@/hooks/useLanguage';

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <Layout title={t('not_found.title')} noindex>
      <section className="min-h-[70vh] flex items-center justify-center pt-24 pb-16 bg-[#070B14]">
        <div className="container mx-auto px-4 text-center max-w-lg">
          <p className="font-display text-6xl font-bold text-[#47E5C2] mb-4">404</p>
          <h1 className="text-2xl font-display font-bold text-white mb-4">{t('not_found.title')}</h1>
          <p className="text-slate-400 mb-8">{t('not_found.text')}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/" className="px-6 py-3 bg-[#47E5C2] text-[#070B14] font-bold rounded-lg hover:bg-[#47E5C2]/85 transition-colors">
              {t('not_found.home')}
            </Link>
            <Link href="/contact" className="px-6 py-3 border-2 border-[#47E5C2] text-[#47E5C2] font-bold rounded-lg hover:bg-[#47E5C2]/10 transition-colors">
              {t('navbar.contact')}
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
