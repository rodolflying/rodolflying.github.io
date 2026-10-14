import { useState } from 'react';
import { Link } from 'wouter';
import { ArrowRight, Github, Rss, Star } from 'lucide-react';
import Layout from '@/components/Layout';
import { PageHeader, SectionHeader } from '@/components/ui/headers';
import ArticleArt from '@/components/blog/ArticleArt';
import { useLanguage } from '@/hooks/useLanguage';
import { posts, formatPostDate, type PostMeta } from '@/lib/blog';
import { repos } from '@/data/openSource';

const CATEGORIES = ['automatizacion', 'integraciones', 'ia-datos', 'herramientas'].filter((c) => posts.some((p) => p.category === c));

/** Category, date and reading time; "En español" when the interface is in English. */
const PostMetaLine = ({ post }: { post: PostMeta }) => {
  const { t, language } = useLanguage();
  return (
    <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-ink-3">
      <span className="text-ink-2">{t(`blog.categories.${post.category}`)}</span>
      <span aria-hidden="true">·</span>
      <time dateTime={post.date}>{formatPostDate(post.date, language)}</time>
      <span aria-hidden="true">·</span>
      <span>{post.readingMinutes} {t('blog.min_read')}</span>
      {language === 'en' && (
        <span className="rounded-md bg-white/5 px-2 py-0.5 text-xs font-semibold text-ink-2">{t('blog.spanish_only')}</span>
      )}
    </p>
  );
};

/** The newest article: its constellation large, the text beside it. */
const FeaturedPost = ({ post }: { post: PostMeta }) => {
  const { t } = useLanguage();
  return (
    <article className="group relative grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:gap-12">
      <div className="overflow-hidden rounded-2xl border border-line bg-surface-1">
        <ArticleArt slug={post.slug} />
      </div>
      <div>
        <PostMetaLine post={post} />
        <h2 className="mt-3 font-display text-2xl md:text-[2rem] font-bold leading-tight text-white text-balance">
          <Link href={`/blog/${post.slug}`} className="transition-colors group-hover:text-star after:absolute after:inset-0 rounded">
            {post.title}
          </Link>
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-ink-2 text-pretty">{post.description}</p>
        <p className="mt-6 inline-flex items-center gap-2 font-semibold text-star">
          {t('blog.read')}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </p>
      </div>
    </article>
  );
};

/** One row of the list: a small constellation, then meta, title and summary. */
const PostRow = ({ post }: { post: PostMeta }) => (
  <li className="group relative grid items-start gap-x-8 gap-y-3 border-t border-line py-8 sm:grid-cols-[13rem_minmax(0,1fr)]">
    <div className="hidden overflow-hidden rounded-xl border border-line bg-surface-1 sm:block">
      <ArticleArt slug={post.slug} mode="hover" />
    </div>
    <div className="max-w-[68ch]">
      <PostMetaLine post={post} />
      <h2 className="mt-2 font-display text-xl md:text-2xl font-semibold leading-snug text-white text-balance">
        <Link href={`/blog/${post.slug}`} className="transition-colors group-hover:text-star after:absolute after:inset-0 rounded">
          {post.title}
        </Link>
      </h2>
      <p className="mt-2 leading-relaxed text-ink-2 text-pretty">{post.description}</p>
    </div>
  </li>
);

const OpenSource = () => {
  const { t, language } = useLanguage();
  return (
    <section aria-labelledby="open-source" className="border-t border-line bg-night-900 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title={<span id="open-source">{t('blog.open_source_title')}</span>} subtitle={t('blog.open_source_text')} />
        <ul className="grid gap-x-12 md:grid-cols-2">
          {repos.map((repo) => (
            <li key={repo.name} className="border-t border-line py-6">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="font-mono text-base font-semibold text-white">
                  <a href={repo.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded hover:text-star transition-colors">
                    <Github className="h-4 w-4 text-ink-3" aria-hidden="true" />
                    {repo.name}
                  </a>
                </h3>
                {repo.stars !== undefined && repo.stars >= 10 && (
                  <p className="inline-flex items-center gap-1.5 text-sm text-ink-2 num">
                    <Star className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
                    {repo.stars} {t('blog.stars')}
                    {repo.forks ? <span className="text-ink-3">· {repo.forks} {t('blog.forks')}</span> : null}
                  </p>
                )}
              </div>
              <p className="mt-2 leading-relaxed text-ink-2 text-pretty">{repo.description[language]}</p>
              <p className="mt-2 flex flex-wrap gap-x-4 text-sm">
                <span className="text-ink-3">{repo.stack}</span>
                {repo.post && (
                  <Link href={`/blog/${repo.post}`} className="inline-flex items-center gap-1 font-semibold text-star hover:underline underline-offset-4 rounded">
                    {t('blog.explained')}
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                )}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

const BlogPage = () => {
  const { t } = useLanguage();
  const [category, setCategory] = useState('all');
  const list = category === 'all' ? posts : posts.filter((p) => p.category === category);
  const [featured, ...rest] = list;

  return (
    // Out of search results only while there is nothing to read.
    <Layout page="blog" canonicalPath="/blog/" noindex={posts.length === 0}>
      <PageHeader title={t('blog.title')} subtitle={t('blog.subtitle')}>
        <a href="/rss.xml" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink-2 hover:text-star transition-colors rounded">
          <Rss className="h-4 w-4" aria-hidden="true" />
          {t('blog.rss')}
        </a>
      </PageHeader>

      <section className="bg-night pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {CATEGORIES.length > 1 && (
            // Same chips as the area tabs on /services.
            <div className="mb-12 flex flex-wrap items-center gap-2">
              {['all', ...CATEGORIES].map((c) => {
                const active = category === c;
                return (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setCategory(c)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                      active ? 'border-star/60 bg-star/15 text-star' : 'border-line bg-surface-1/60 text-ink-2 hover:border-ink-3 hover:text-white'
                    }`}
                  >
                    {c === 'all' ? t('blog.all') : t(`blog.categories.${c}`)}
                  </button>
                );
              })}
            </div>
          )}

          {featured ? (
            <>
              <FeaturedPost post={featured} />
              {rest.length > 0 && <ul className="mt-16">{rest.map((p) => <PostRow key={p.slug} post={p} />)}</ul>}
            </>
          ) : (
            <p className="py-16 text-ink-3">{t('blog.empty')}</p>
          )}
        </div>
      </section>

      <OpenSource />
    </Layout>
  );
};

export default BlogPage;
