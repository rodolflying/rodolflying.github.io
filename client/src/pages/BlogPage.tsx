import Layout from '@/components/Layout';
import { blogPosts, BlogPost } from '@/data/blog';
import { useLanguage } from '@/hooks/useLanguage';
import { BookOpen, ExternalLink, Github, Clock } from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '@/components/ui/headers';

// Legacy page: reachable by URL (noindex), out of the navigation until there are articles for the B2B focus.

const typeLabels: Record<string, { en: string; es: string }> = {
  tutorial: { en: 'Tutorial', es: 'Tutorial' },
  guide: { en: 'Guide', es: 'Guía' },
  article: { en: 'Article', es: 'Artículo' },
  project: { en: 'Project', es: 'Proyecto' },
};

const formatDate = (dateStr: string, lang: 'en' | 'es') =>
  new Date(dateStr).toLocaleDateString(lang === 'es' ? 'es-CL' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });

const MEDIUM = 'https://medium.com/@rodolfo.antonio.sep';

const BlogCard = ({ post, featured = false }: { post: BlogPost; featured?: boolean }) => {
  const { language } = useLanguage();
  const lang = language as 'en' | 'es';

  return (
    <article className={`bg-surface-1 border border-line rounded-2xl overflow-hidden flex flex-col ${featured ? 'md:col-span-2' : ''}`}>
      <div className={`overflow-hidden ${featured ? 'h-64' : 'h-44'}`}>
        <img src={post.image} alt="" className="w-full h-full object-cover opacity-60" loading="lazy" />
      </div>

      <div className="p-6 flex flex-col flex-1">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-3 mb-3">
          <span className="text-ink-2">{typeLabels[post.type][lang]}</span>
          <span aria-hidden="true">·</span>
          <span>{formatDate(post.date, lang)}</span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3 h-3" aria-hidden="true" />
            {post.readTime[lang]}
          </span>
        </p>

        <h2 className={`font-display font-bold text-white mb-3 leading-snug ${featured ? 'text-xl' : 'text-base'}`}>
          {post.title[lang]}
        </h2>

        <p className="text-ink-2 text-sm leading-relaxed mb-4 flex-1">{post.excerpt[lang]}</p>

        <p className="text-xs text-ink-3 mb-5">{post.tags.slice(0, 4).join(' · ')}</p>

        <div className="flex gap-4 border-t border-line pt-4 mt-auto">
          {post.mediumUrl ? (
            <a
              href={post.mediumUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-ink-2 hover:text-star transition-colors rounded"
            >
              {/* TODO copy: blog.read_on_medium (hardcoded, ES only) */}
              Leer en Medium
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
          ) : (
            <span className="text-sm text-ink-3">Próximamente</span>
          )}
          {post.githubUrl && (
            <a
              href={post.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-ink-2 hover:text-star transition-colors rounded"
            >
              <Github className="w-4 h-4" aria-hidden="true" />
              GitHub
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

const BlogPageContent = () => {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const categories = ['all', 'Tutorial', 'Guide', 'Article'];
  const categoryLabels: Record<string, string> = {
    all: 'Todos',
    Tutorial: 'Tutoriales',
    Guide: 'Guías',
    Article: 'Artículos',
  };

  const filtered = activeFilter === 'all' ? blogPosts : blogPosts.filter((p) => p.category === activeFilter);
  const featured = filtered.find((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured);

  return (
    <>
      <PageHeader title={t('blog.title')} subtitle={t('blog.subtitle')}>
        <a
          href={MEDIUM}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-star hover:underline underline-offset-4 rounded"
        >
          {t('blog.medium_link')}
          <ExternalLink className="w-3 h-3" aria-hidden="true" />
        </a>
      </PageHeader>

      <section className="pb-20 bg-night">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Same chip treatment as the area tabs on /services */}
          <div className="flex items-center gap-2 mb-10 flex-wrap">
            {categories.map((cat) => {
              const isActive = activeFilter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveFilter(cat)}
                  className={`text-sm px-4 py-2 rounded-full border font-semibold transition-colors ${
                    isActive ? 'bg-star/15 border-star/60 text-star' : 'bg-surface-1/60 border-line text-ink-2 hover:text-white hover:border-ink-3'
                  }`}
                >
                  {categoryLabels[cat]}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featured && <BlogCard post={featured} featured />}
            {rest.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-ink-3">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" aria-hidden="true" />
              <p>No hay artículos en esta categoría todavía.</p>
            </div>
          )}

          <div className="mt-20 border-t border-line pt-10 max-w-2xl">
            <h2 className="text-xl font-display font-bold text-white mb-3">{t('blog.cta_title')}</h2>
            <p className="text-ink-2 mb-6">{t('blog.cta_text')}</p>
            <a href={MEDIUM} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 font-semibold border border-line text-white hover:border-star hover:text-star transition-colors">
              {t('blog.cta_btn')}
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

const BlogPage = () => (
  <Layout page="blog" noindex>
    <BlogPageContent />
  </Layout>
);

export default BlogPage;
