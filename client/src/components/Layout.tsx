import { ReactNode, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'wouter';
import Navbar from './Navbar';
import Footer from './Footer';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';

export const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') || 'https://rodolflying.github.io';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.png`;

export type SeoPage = 'about' | 'services' | 'projects' | 'downloads' | 'blog' | 'contact' | 'portal' | 'privacy';

interface LayoutProps {
  children: ReactNode;
  /** Picks the translated title/description from the `seo` i18n namespace. */
  page?: SeoPage;
  /** Explicit overrides, e.g. for a blog post. */
  title?: string;
  description?: string;
  image?: string;
  /** Keeps unfinished or demo pages out of search results. */
  noindex?: boolean;
}

const Layout = ({ children, page, title, description, image, noindex }: LayoutProps) => {
  const { t, language } = useLanguage();
  const [location] = useLocation();

  const pageTitle = title || (page && t(`seo.${page}`));
  const fullTitle = pageTitle ? `${pageTitle} | Star Apps` : t('seo.default_title');
  const metaDescription = description || (page && t(`seo.${page}_desc`)) || t('seo.default_description');
  const ogImage = image || DEFAULT_OG_IMAGE;
  const canonical = `${SITE_URL}${location === '/' ? '/' : location}`;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <html lang={language} />
        <title>{fullTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonical} />
        {noindex && <meta name="robots" content="noindex, nofollow" />}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Star Apps" />
        <meta property="og:locale" content={language === 'es' ? 'es_CL' : 'en_US'} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-star focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-night"
      >
        {/* TODO copy: a11y.skip_to_content */}
        {language === 'es' ? 'Saltar al contenido' : 'Skip to content'}
      </a>
      <Navbar />
      <motion.main
        id="main"
        tabIndex={-1}
        className="flex-grow focus:outline-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
};

export default Layout;
