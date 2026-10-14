import type { Post, PostMeta } from '../../../scripts/blog';

export type { Post, PostMeta };

// Articles are Markdown files in content/blog, compiled at build time by scripts/blog.ts.
// `?meta` imports only the front matter, so the index doesn't ship every article's body.
const metas = import.meta.glob<PostMeta>('../content/blog/*.md', { eager: true, query: '?meta', import: 'default' });
const bodies = import.meta.glob<Post>('../content/blog/*.md', { import: 'default' });

/** Published posts, newest first. Drafts show up only in the dev server. */
export const posts: PostMeta[] = Object.values(metas)
  .filter((p) => import.meta.env.DEV || !p.draft)
  .sort((a, b) => b.date.localeCompare(a.date));

export const findPost = (slug: string) => posts.find((p) => p.slug === slug);

/** The full article (HTML and table of contents), loaded on demand. */
export const loadPost = (slug: string) => bodies[`../content/blog/${slug}.md`]?.();

/** Up to `n` other posts, same category first. */
export const relatedPosts = (post: PostMeta, n = 2) =>
  posts
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category))
    .slice(0, n);

export const formatPostDate = (date: string, lang: 'es' | 'en') =>
  new Date(`${date}T12:00:00`).toLocaleDateString(lang === 'es' ? 'es-CL' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
