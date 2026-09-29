import Layout from '@/components/Layout';
import { useLanguage } from '@/hooks/useLanguage';
import PixelCanvas from '@/components/pixel/PixelCanvas';
import { lostScene, LOST_W, LOST_H } from '@/components/pixel/moreScenes';
import { CtaLink } from '@/components/ui/headers';

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <Layout title={t('not_found.title')} noindex>
      <section className="min-h-[70vh] flex items-center justify-center pt-28 pb-16 bg-night">
        <div className="container mx-auto px-4 text-center max-w-lg">
          <div className="rounded-xl overflow-hidden mb-8">
            <PixelCanvas scene={lostScene} width={LOST_W} height={LOST_H} stillAt={1} />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">{t('not_found.title')}</h1>
          <p className="text-ink-2 mb-8">
            <span className="num text-ink-3">404 · </span>
            {t('not_found.text')}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <CtaLink href="/">{t('not_found.home')}</CtaLink>
            <CtaLink href="/contact" variant="secondary">{t('navbar.contact')}</CtaLink>
          </div>
        </div>
      </section>
    </Layout>
  );
}
