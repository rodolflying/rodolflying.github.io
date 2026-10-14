import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowLeft, ArrowRight, Github, Link2, Linkedin, MessageCircle } from 'lucide-react';
import Layout, { SITE_URL } from '@/components/Layout';
import { CtaLink } from '@/components/ui/headers';
import ArticleArt from '@/components/blog/ArticleArt';
import ListenButton from '@/components/blog/ListenButton';
import { useLanguage } from '@/hooks/useLanguage';
import { findPost, formatPostDate, loadPost, posts, relatedPosts, type Post, type PostMeta } from '@/lib/blog';

/** The section being read: the last h2 whose top has passed under the navbar. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string>();
  useEffect(() => {
    if (!ids.length) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      let current: string | undefined;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 140) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [ids]);
  return active;
}

const Share = ({ post }: { post: PostMeta }) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const url = `${SITE_URL}/blog/${post.slug}`;
  const linkClass = 'inline-flex items-center gap-2 rounded text-sm text-ink-2 hover:text-star transition-colors';
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard blocked: the address bar still has the link. */
    }
  };
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
      <span className="text-sm font-semibold text-white">{t('blog.share')}</span>
      <a className={linkClass} href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer">
        <Linkedin className="h-4 w-4" aria-hidden="true" />
        LinkedIn
      </a>
      <a className={linkClass} href={`https://wa.me/?text=${encodeURIComponent(`${post.title} ${url}`)}`} target="_blank" rel="noopener noreferrer">
        <MessageCircle className="h-4 w-4" aria-hidden="true" />
        WhatsApp
      </a>
      <button type="button" onClick={copy} className={linkClass}>
        <Link2 className="h-4 w-4" aria-hidden="true" />
        <span aria-live="polite">{copied ? t('blog.link_copied') : t('blog.copy_link')}</span>
      </button>
    </div>
  );
};

const Author = () => {
  const { t } = useLanguage();
  return (
    <div className="flex items-start gap-4">
      <img src="/founder.webp" alt="" width={56} height={56} className="h-14 w-14 shrink-0 rounded-full object-cover" />
      <div>
        <p className="font-display font-bold text-white">Rodolfo Sepúlveda</p>
        <p className="text-sm text-ink-3">{t('about.founder_role')}</p>
        <p className="mt-2 leading-relaxed text-ink-2 text-pretty">{t('blog.author_bio')}</p>
        <Link href="/about" className="mt-3 inline-flex items-center gap-1 rounded text-sm font-semibold text-star hover:underline underline-offset-4">
          {t('blog.author_more')}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
};

const PostNotFound = () => {
  const { t } = useLanguage();
  return (
    <Layout title={t('blog.not_found_title')} noindex>
      <section className="bg-night pt-32 pb-20">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-bold text-white">{t('blog.not_found_title')}</h1>
          <p className="mt-4 text-lg text-ink-2">{t('blog.not_found_text')}</p>
          <ul className="mt-10">
            {posts.map((p) => (
              <li key={p.slug} className="border-t border-line py-4">
                <Link href={`/blog/${p.slug}`} className="rounded font-display text-lg font-semibold text-white hover:text-star">{p.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Layout>
  );
};

const BlogPostPage = ({ params }: { params: { slug: string } }) => {
  const { t, language } = useLanguage();
  const meta = findPost(params.slug);
  const [post, setPost] = useState<Post | null>(null);
  const [, navigate] = useLocation();
  const summaryRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    setPost(null);
    loadPost(params.slug)?.then((p) => alive && setPost(p));
    return () => {
      alive = false;
    };
  }, [params.slug]);

  // Deep links to a section (#id) once the body is in the page.
  useEffect(() => {
    if (post && window.location.hash) document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.scrollIntoView();
  }, [post]);

  const tocIds = useMemo(() => post?.toc.map((h) => h.id) ?? [], [post]);
  const active = useActiveSection(tocIds);

  if (!meta) return <PostNotFound />;

  // The compiled HTML has its own copy buttons and links; one listener serves them all.
  const onBodyClick = async (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    // Links to our own pages navigate inside the app instead of reloading it.
    const link = target.closest<HTMLAnchorElement>('a[href^="/"]');
    if (link && !link.getAttribute('href')!.includes('#') && !e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
      e.preventDefault();
      navigate(link.getAttribute('href')!);
      return;
    }
    const button = target.closest<HTMLButtonElement>('[data-copy]');
    const code = button?.closest('figure')?.querySelector('pre')?.innerText;
    if (!button || code === undefined) return;
    try {
      await navigator.clipboard.writeText(code);
      const label = button.textContent;
      button.textContent = t('blog.code_copied');
      setTimeout(() => (button.textContent = label), 1800);
    } catch {
      /* Clipboard blocked: the code can still be selected by hand. */
    }
  };

  const related = relatedPosts(meta);

  return (
    <Layout title={meta.title} description={meta.description} type="article">
      <article>
        <header className="starfield bg-night pt-32 pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,27rem)] xl:gap-16">
              <div className="max-w-[68ch]">
                <p className="flex items-center gap-2 text-sm text-ink-3">
                  <Link href="/blog" className="rounded hover:text-star transition-colors">Blog</Link>
                  <span aria-hidden="true">/</span>
                  <span>{t(`blog.categories.${meta.category}`)}</span>
                </p>
                <h1 className="mt-4 font-display text-[2.25rem] leading-[1.12] md:text-5xl font-bold tracking-[-0.02em] text-white text-balance">{meta.title}</h1>
                <p className="mt-5 text-xl leading-relaxed text-ink-2 text-pretty">{meta.description}</p>
                <div className="mt-7 flex items-center gap-3 text-sm">
                  <img src="/founder.webp" alt="" width={40} height={40} className="h-10 w-10 shrink-0 rounded-full object-cover" />
                  <div>
                    <Link href="/about" className="rounded font-semibold text-ink-2 hover:text-star transition-colors">Rodolfo Sepúlveda</Link>
                    <p className="flex flex-wrap gap-x-2 text-ink-3">
                      <time dateTime={meta.date}>{formatPostDate(meta.date, language)}</time>
                      <span aria-hidden="true">·</span>
                      <span>{meta.readingMinutes} {t('blog.min_read')}</span>
                      {meta.updated && meta.updated !== meta.date && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{t('blog.updated')} <time dateTime={meta.updated}>{formatPostDate(meta.updated, language)}</time></span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <ListenButton meta={meta} summaryRef={summaryRef} bodyRef={bodyRef} ready={!!post} />
              </div>
              <div className="overflow-hidden rounded-2xl border border-line bg-surface-1">
                <ArticleArt slug={meta.slug} />
              </div>
            </div>
          </div>
        </header>

        <div className="bg-night pb-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,68ch)_minmax(0,15rem)] xl:gap-20">
              <div className="min-w-0">
                {meta.summary.length > 0 && (
                  <section ref={summaryRef} aria-labelledby="en-corto" className="rounded-2xl border border-line bg-surface-1 p-6 md:p-7">
                    <h2 id="en-corto" className="font-display text-lg font-bold text-white">
                      {t('blog.in_short')} <span className="font-sans text-sm font-normal text-ink-3">· {t('blog.in_short_hint')}</span>
                    </h2>
                    <ul className="mt-4 space-y-3">
                      {meta.summary.map((line) => (
                        <li key={line} className="flex gap-3 leading-relaxed text-ink-2">
                          <span className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full bg-star" aria-hidden="true" />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {post ? (
                  // Compiled from our own Markdown at build time (scripts/blog.ts), not user input.
                  <div ref={bodyRef} onClick={onBodyClick} className="prose-star mt-12" dangerouslySetInnerHTML={{ __html: post.html }} />
                ) : (
                  <div className="mt-12 space-y-4" aria-hidden="true">
                    {[92, 100, 84, 96, 70].map((w) => <div key={w} className="h-4 rounded bg-surface-1" style={{ width: `${w}%` }} />)}
                  </div>
                )}

                {meta.original && (
                  <p className="mt-12 text-sm text-ink-3">
                    {t('blog.original')}{' '}
                    <a href={meta.original.url} target="_blank" rel="noopener noreferrer" className="rounded text-ink-2 underline underline-offset-4 hover:text-star">
                      {formatPostDate(meta.original.date, language)}
                    </a>
                    .
                  </p>
                )}

                <div className="mt-10 border-t border-line pt-8">
                  <Share post={meta} />
                </div>
                <div className="mt-10 border-t border-line pt-8">
                  <Author />
                </div>
              </div>

              <aside className="hidden lg:block">
                <div className="sticky top-28 space-y-8">
                  {post && post.toc.length > 1 && (
                    <nav aria-labelledby="toc-title">
                      <p id="toc-title" className="text-sm font-semibold text-white">{t('blog.toc')}</p>
                      <ol className="mt-3 space-y-1 border-l border-line">
                        {post.toc.map((h) => (
                          <li key={h.id}>
                            <a
                              href={`#${h.id}`}
                              aria-current={active === h.id ? 'location' : undefined}
                              className={`-ml-px block border-l py-1.5 pl-4 text-sm leading-snug transition-colors ${
                                active === h.id ? 'border-star text-star' : 'border-transparent text-ink-3 hover:text-white'
                              }`}
                            >
                              {h.text}
                            </a>
                          </li>
                        ))}
                      </ol>
                    </nav>
                  )}
                  {meta.repo && (
                    <a href={meta.repo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded text-sm font-semibold text-ink-2 hover:text-star transition-colors">
                      <Github className="h-4 w-4" aria-hidden="true" />
                      {t('blog.repo')}
                    </a>
                  )}
                </div>
              </aside>
            </div>
          </div>
        </div>
      </article>

      <section className="border-t border-night-line bg-night-900 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl md:text-3xl font-bold leading-tight text-white text-balance">{t('blog.cta_title')}</h2>
            <p className="mt-3 mb-8 text-lg text-ink-2 text-pretty">{t('blog.cta_text')}</p>
            <CtaLink href="/contact?service=diagnostico">
              {t('blog.cta_btn')}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </CtaLink>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related" className="bg-night py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2 id="related" className="font-display text-2xl font-bold text-white">{t('blog.related')}</h2>
              <Link href="/blog" className="inline-flex items-center gap-1.5 rounded text-sm font-semibold text-ink-2 hover:text-star transition-colors">
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                {t('blog.back')}
              </Link>
            </div>
            <ul className="mt-8 grid gap-x-12 md:grid-cols-2">
              {related.map((p) => (
                <li key={p.slug} className="group relative grid grid-cols-[7.5rem_minmax(0,1fr)] items-start gap-5 border-t border-line py-6">
                  <div className="overflow-hidden rounded-lg border border-line bg-surface-1">
                    <ArticleArt slug={p.slug} mode="hover" />
                  </div>
                  <div>
                    <p className="text-sm text-ink-3">{t(`blog.categories.${p.category}`)} · {p.readingMinutes} {t('blog.min_read')}</p>
                    <h3 className="mt-1 font-display text-lg font-semibold leading-snug text-white text-balance">
                      <Link href={`/blog/${p.slug}`} className="rounded transition-colors group-hover:text-star after:absolute after:inset-0">{p.title}</Link>
                    </h3>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default BlogPostPage;
