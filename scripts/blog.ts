/**
 * Build-time blog engine. Markdown files in client/src/content/blog/ become:
 *  - app modules: `post.md` -> { ...meta, html, toc } and `post.md?meta` -> meta only (for the index);
 *  - on `vite build`, one static HTML file per public route with its own title, description,
 *    canonical, Open Graph and JSON-LD (the article body included for blog posts), plus
 *    sitemap.xml, robots.txt and rss.xml. GitHub Pages and Cloudflare Pages serve `/about` from
 *    `about.html`, so every URL answers 200 with real content before React loads.
 * Code is highlighted here with Shiki, so the browser downloads no highlighter.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { Marked, type Tokens } from 'marked';
import { createHighlighter, type Highlighter, type ThemeRegistration } from 'shiki';
import { transform } from 'esbuild';
import type { Plugin, ResolvedConfig } from 'vite';

// The hyphen package resolves by directory, which Node's ESM loader refuses; require() handles it.
const { hyphenateSync: hyphenateEs } = createRequire(import.meta.url)('hyphen/es') as {
  hyphenateSync: (text: string) => string;
};

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  category: string;
  tags: string[];
  /** "En corto": three or four lines for whoever decides, above the technical body. */
  summary: string[];
  repo?: string;
  /** The Medium story this article revises, when there is one. */
  original?: { url: string; date: string };
  draft?: boolean;
  readingMinutes: number;
}

export interface TocItem { id: string; text: string }
export interface Post extends PostMeta { html: string; toc: TocItem[] }

// import.meta.url, not import.meta.dirname: Vite rewrites the former when it bundles the config.
const CONTENT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'client', 'src', 'content', 'blog');
const AUTHOR = { name: 'Rodolfo Sepúlveda', path: '/about' };

/* ---------- Markdown ---------- */

// Night-sky palette (tailwind.config.ts): mint keywords, gold strings, periwinkle calls, copper numbers.
const THEME: ThemeRegistration = {
  name: 'star-night',
  type: 'dark',
  colors: { 'editor.background': '#0A1020', 'editor.foreground': '#C6CFDD' },
  tokenColors: [
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#8F9CB3', fontStyle: 'italic' } },
    { scope: ['keyword', 'storage', 'storage.type', 'keyword.control', 'keyword.operator.logical', 'keyword.operator.word'], settings: { foreground: '#47E5C2' } },
    { scope: ['string', 'string.quoted', 'punctuation.definition.string'], settings: { foreground: '#FFC857' } },
    { scope: ['constant.numeric', 'constant.language', 'constant.character', 'variable.other.constant'], settings: { foreground: '#F2C7A5' } },
    { scope: ['entity.name.function', 'support.function', 'meta.function-call.generic', 'variable.function'], settings: { foreground: '#7C9CFF' } },
    { scope: ['entity.name.class', 'entity.name.type', 'support.class', 'support.type', 'entity.name.namespace'], settings: { foreground: '#8DF0D8' } },
    { scope: ['entity.name.tag', 'meta.decorator', 'entity.name.function.decorator'], settings: { foreground: '#47E5C2' } },
    { scope: ['entity.other.attribute-name', 'support.type.property-name', 'variable.parameter'], settings: { foreground: '#EEF2F8' } },
  ],
};
const LANGS = ['python', 'bash', 'powershell', 'javascript', 'typescript', 'json', 'ini', 'csv', 'html'] as const;
const LANG_LABEL: Record<string, string> = { python: 'Python', bash: 'Terminal', powershell: 'PowerShell', javascript: 'JavaScript', typescript: 'TypeScript', json: 'JSON', ini: '.env', csv: 'CSV', html: 'HTML', text: 'Texto' };

let highlighter: Promise<Highlighter> | undefined;
const getHighlighter = () => (highlighter ??= createHighlighter({ themes: [THEME], langs: [...LANGS] }));

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const slugify = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function renderMarkdown(md: string, hl: Highlighter) {
  const toc: TocItem[] = [];
  const marked = new Marked({ gfm: true });
  marked.use({
    renderer: {
      heading({ tokens, depth }: Tokens.Heading) {
        const inner = this.parser.parseInline(tokens);
        const text = inner.replace(/<[^>]+>/g, '');
        const id = slugify(text);
        if (depth === 2) toc.push({ id, text });
        return `<h${depth} id="${id}">${inner}</h${depth}>\n`;
      },
      code({ text, lang }: Tokens.Code) {
        // ```python title="main.py"  -> label "main.py"
        const [rawLang = 'text', ...rest] = (lang || 'text').split(/\s+/);
        const known = (LANGS as readonly string[]).includes(rawLang) ? rawLang : 'text';
        const title = rest.join(' ').match(/title="([^"]+)"/)?.[1];
        const code = hl.codeToHtml(text, { lang: known, theme: 'star-night' });
        return `<figure class="code"><figcaption><span>${escapeHtml(title || LANG_LABEL[known] || known)}</span><button type="button" class="code-copy" data-copy>Copiar</button></figcaption>${code}</figure>\n`;
      },
      link({ href, title, tokens }: Tokens.Link) {
        const inner = this.parser.parseInline(tokens);
        const external = /^https?:\/\//.test(href);
        return `<a href="${escapeHtml(href)}"${title ? ` title="${escapeHtml(title)}"` : ''}${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${inner}</a>`;
      },
      image({ href, title, text }: Tokens.Image) {
        const caption = title ? `<figcaption>${escapeHtml(title)}</figcaption>` : '';
        return `<figure class="media"><img src="${escapeHtml(href)}" alt="${escapeHtml(text)}" loading="lazy" decoding="async">${caption}</figure>`;
      },
      table(token: Tokens.Table) {
        const cell = (c: Tokens.TableCell, tag: 'th' | 'td') => `<${tag}>${this.parser.parseInline(c.tokens)}</${tag}>`;
        const head = `<tr>${token.header.map((c) => cell(c, 'th')).join('')}</tr>`;
        const body = token.rows.map((r) => `<tr>${r.map((c) => cell(c, 'td')).join('')}</tr>`).join('');
        return `<div class="table-wrap"><table><thead>${head}</thead><tbody>${body}</tbody></table></div>\n`;
      },
    },
  });
  const html = marked.parse(md, { async: false }) as string;
  return { html, toc };
}

/**
 * Same rule as useHyphenate: soft hyphens in long words of running text so justified paragraphs
 * don't open gaps. Only for the app; crawlers and RSS get the clean HTML.
 */
// Built with RegExp so the Unicode flag doesn't depend on the compile target (as in useHyphenate).
const LONG_WORD = new RegExp(String.raw`\p{L}{7,}`, 'gu');
const INNER_CAPITAL = new RegExp(String.raw`\p{Lu}`, 'u');
const NO_HYPHENS = /^(pre|code|h[1-6]|figcaption|a|th|td|button)$/;
function hyphenateHtml(html: string) {
  let skip = 0;
  return html.split(/(<[^>]+>)/).map((part) => {
    const tag = part.match(/^<(\/?)([a-z0-9]+)/i);
    if (tag) {
      if (NO_HYPHENS.test(tag[2].toLowerCase())) skip += tag[1] ? -1 : 1;
      return part;
    }
    if (skip > 0) return part;
    return part.replace(LONG_WORD, (w) => (INNER_CAPITAL.test(w.slice(1)) ? w : hyphenateEs(w)));
  }).join('');
}

/** `key: value` lines; values that look like JSON (arrays, objects, quoted strings) are parsed as JSON. */
function parseFrontmatter(src: string) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) throw new Error('missing frontmatter');
  const data: Record<string, unknown> = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    const v = kv[2].trim();
    data[kv[1]] = /^[[{"]/.test(v) || v === 'true' || v === 'false' ? JSON.parse(v) : v;
  }
  return { data, body: src.slice(m[0].length) };
}

export async function readPost(file: string): Promise<Post> {
  const { data, body } = parseFrontmatter(fs.readFileSync(file, 'utf8'));
  const slug = path.basename(file, '.md');
  for (const key of ['title', 'description', 'date', 'category']) {
    if (!data[key]) throw new Error(`${slug}.md: "${key}" is required`);
  }
  const words = body.replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length;
  const codeLines = (body.match(/```[\s\S]*?```/g) || []).join('\n').split('\n').length;
  const { html, toc } = renderMarkdown(body, await getHighlighter());
  return {
    slug,
    title: data.title as string,
    description: data.description as string,
    date: data.date as string,
    updated: data.updated as string | undefined,
    category: data.category as string,
    tags: (data.tags as string[]) || [],
    summary: (data.summary as string[]) || [],
    repo: data.repo as string | undefined,
    original: data.original as PostMeta['original'],
    draft: data.draft === true,
    // ~200 words a minute for prose, code is skimmed.
    readingMinutes: Math.max(1, Math.round(words / 200 + codeLines / 60)),
    html,
    toc,
  };
}

export async function readAllPosts({ drafts = false } = {}) {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md'));
  const posts = await Promise.all(files.map((f) => readPost(path.join(CONTENT_DIR, f))));
  return posts.filter((p) => drafts || !p.draft).sort((a, b) => b.date.localeCompare(a.date));
}

const metaOf = ({ html: _html, toc: _toc, ...meta }: Post): PostMeta => meta;

/* ---------- Static pages ---------- */

interface Route {
  path: string;
  title: string;
  description: string;
  type?: 'website' | 'article';
  jsonLd?: object[];
  /** Static markup inside #root for crawlers that don't run JavaScript. React replaces it on mount. */
  body?: string;
  extraHead?: string;
}

const attr = (s: string) => escapeHtml(s).replace(/\n/g, ' ');

function renderRoute(template: string, site: string, route: Route) {
  const url = `${site}${route.path}`;
  const image = `${site}/og-default.png`;
  // data-rh lets react-helmet-async take these over once the app mounts.
  const head = [
    `<meta data-rh="true" name="description" content="${attr(route.description)}" />`,
    `<link data-rh="true" rel="canonical" href="${url}" />`,
    `<meta data-rh="true" property="og:type" content="${route.type || 'website'}" />`,
    `<meta data-rh="true" property="og:site_name" content="Star Apps" />`,
    `<meta data-rh="true" property="og:locale" content="es_CL" />`,
    `<meta data-rh="true" property="og:title" content="${attr(route.title)}" />`,
    `<meta data-rh="true" property="og:description" content="${attr(route.description)}" />`,
    `<meta data-rh="true" property="og:url" content="${url}" />`,
    `<meta data-rh="true" property="og:image" content="${image}" />`,
    `<meta data-rh="true" name="twitter:card" content="summary_large_image" />`,
    `<meta data-rh="true" name="twitter:title" content="${attr(route.title)}" />`,
    `<meta data-rh="true" name="twitter:description" content="${attr(route.description)}" />`,
    `<meta data-rh="true" name="twitter:image" content="${image}" />`,
    route.extraHead || '',
    ...(route.jsonLd || []).map((j) => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, '\\u003c')}</script>`),
  ].filter(Boolean).join('\n    ');
  // Function replacements: article HTML may contain "$" sequences that string replacements would expand.
  return template
    .replace(/<title>[\s\S]*?<\/title>/, () => `<title>${escapeHtml(route.title)}</title>`)
    .replace(/\s*<(?:meta|link) data-rh="true"[^>]*>/g, '')
    .replace('</head>', () => `    ${head}\n  </head>`)
    .replace('<div id="root"></div>', () => `<div id="root">${route.body || ''}</div>`);
}

const dateEs = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' });

function postBody(p: Post) {
  // The same classes BlogPostPage uses, so the pre-JS view already looks like the article.
  return `<main class="bg-night"><article class="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20"><div class="max-w-[68ch]">`
    + `<p class="text-sm text-ink-3"><a href="/blog/">Blog</a></p>`
    + `<h1 class="mt-4 font-display text-[2.25rem] leading-[1.12] md:text-5xl font-bold tracking-[-0.02em] text-white">${escapeHtml(p.title)}</h1>`
    + `<p class="mt-5 text-xl leading-relaxed text-ink-2">${escapeHtml(p.description)}</p>`
    + `<p class="mt-6 text-sm text-ink-3">${AUTHOR.name} · <time datetime="${p.date}">${dateEs(p.date)}</time> · ${p.readingMinutes} min de lectura</p>`
    + (p.summary.length ? `<section class="mt-10"><h2>En corto</h2><ul>${p.summary.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ul></section>` : '')
    + `<div class="prose-star mt-10">${p.html}</div></div></article></main>`;
}

function blogBody(posts: Post[], title: string, description: string) {
  return `<main class="bg-night"><div class="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20"><h1 class="font-display text-[2.5rem] leading-[1.1] md:text-5xl font-bold text-white">${escapeHtml(title)}</h1>`
    + `<p class="mt-4 text-lg text-ink-2 max-w-[65ch]">${escapeHtml(description)}</p><ul class="mt-12">`
    + posts.map((p) => `<li class="border-t border-line py-6"><a href="/blog/${p.slug}" class="font-display text-xl font-semibold text-white">${escapeHtml(p.title)}</a><p class="mt-2 text-ink-2">${escapeHtml(p.description)}</p><p class="mt-2 text-sm text-ink-3"><time datetime="${p.date}">${dateEs(p.date)}</time> · ${p.readingMinutes} min de lectura</p></li>`).join('')
    + `</ul></div></main>`;
}

/** The app's own Spanish translations, so titles and descriptions are written once. */
async function loadStrings(root: string) {
  const src = fs.readFileSync(path.join(root, 'src', 'i18n', 'translations', 'es.ts'), 'utf8');
  const { code } = await transform(src, { loader: 'ts', format: 'esm' });
  const mod = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
  return mod.default as { seo: Record<string, string>; blog: Record<string, string> & { categories: Record<string, string> } };
}

function rss(site: string, posts: Post[]) {
  const items = posts.map((p) => `    <item>
      <title>${escapeHtml(p.title)}</title>
      <link>${site}/blog/${p.slug}</link>
      <guid isPermaLink="true">${site}/blog/${p.slug}</guid>
      <pubDate>${new Date(`${p.date}T12:00:00-03:00`).toUTCString()}</pubDate>
      <category>${escapeHtml(p.category)}</category>
      <description>${escapeHtml(p.description)}</description>
      <content:encoded><![CDATA[${p.html.replace(/]]>/g, ']]]]><![CDATA[>')}]]></content:encoded>
    </item>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Star Apps · Blog</title>
    <link>${site}/blog/</link>
    <atom:link href="${site}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Automatización, integración de sistemas e IA, explicadas por quien las construye.</description>
    <language>es-cl</language>
${items}
  </channel>
</rss>
`;
}

async function writeSite(config: ResolvedConfig) {
  const out = config.build.outDir;
  const site = (config.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') || 'https://rodolflying.github.io';
  const template = fs.readFileSync(path.join(out, 'index.html'), 'utf8');
  const strings = await loadStrings(config.root);
  const seo = strings.seo;
  const posts = await readAllPosts();
  const org = { '@id': `${site}/#organization` };

  const page = (p: string, key: string): Route => ({ path: p, title: `${seo[key]} | Star Apps`, description: seo[`${key}_desc`] });
  const routes: Route[] = [
    page('/services', 'services'),
    page('/projects', 'projects'),
    page('/about', 'about'),
    page('/contact', 'contact'),
  ];
  if (posts.length) {
    // The index lives at /blog/ (blog/index.html): hosts redirect /blog there anyway, because the posts' blog/ folder exists.
    const blog = page('/blog/', 'blog');
    routes.push({
      ...blog,
      extraHead: `<link rel="alternate" type="application/rss+xml" title="Star Apps · Blog" href="${site}/rss.xml" />`,
      body: blogBody(posts, strings.blog.title, blog.description),
    });
    for (const p of posts) {
      const url = `${site}/blog/${p.slug}`;
      routes.push({
        path: `/blog/${p.slug}`,
        title: `${p.title} | Star Apps`,
        description: p.description,
        type: 'article',
        body: postBody(p),
        extraHead: [
          `<meta data-rh="true" property="article:published_time" content="${p.date}" />`,
          p.updated ? `<meta data-rh="true" property="article:modified_time" content="${p.updated}" />` : '',
        ].filter(Boolean).join('\n    '),
        jsonLd: [{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'BlogPosting',
              '@id': `${url}#article`,
              headline: p.title,
              description: p.description,
              datePublished: p.date,
              dateModified: p.updated || p.date,
              inLanguage: 'es-CL',
              mainEntityOfPage: url,
              image: `${site}/og-default.png`,
              keywords: p.tags.join(', '),
              articleSection: strings.blog.categories[p.category] || p.category,
              author: { '@type': 'Person', name: AUTHOR.name, url: `${site}${AUTHOR.path}` },
              publisher: org,
              ...(p.original ? { isBasedOn: p.original.url } : {}),
            },
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${site}/` },
                { '@type': 'ListItem', position: 2, name: 'Blog', item: `${site}/blog/` },
                { '@type': 'ListItem', position: 3, name: p.title, item: url },
              ],
            },
          ],
        }],
      });
    }
  }

  for (const route of routes) {
    const html = renderRoute(template, site, route);
    const file = path.join(out, route.path.endsWith('/') ? `${route.path.slice(1)}index.html` : `${route.path.slice(1)}.html`);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, html);
  }

  const lastmod = new Map(posts.map((p) => [`/blog/${p.slug}`, p.updated || p.date]));
  const urls = ['/', ...routes.map((r) => r.path)];
  fs.writeFileSync(path.join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${site}${u}</loc>${lastmod.has(u) ? `<lastmod>${lastmod.get(u)}</lastmod>` : ''}</url>`).join('\n')}
</urlset>
`);
  fs.writeFileSync(path.join(out, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`);
  if (posts.length) fs.writeFileSync(path.join(out, 'rss.xml'), rss(site, posts));
  config.logger.info(`blog: ${routes.length} static routes, ${posts.length} posts, sitemap.xml, robots.txt${posts.length ? ', rss.xml' : ''}`);
}

/* ---------- Vite plugin ---------- */

const POST_ID = /[\\/]content[\\/]blog[\\/][^\\/]+\.md(\?meta)?$/;

export function blogPlugin(): Plugin {
  let config: ResolvedConfig;
  return {
    name: 'star-apps-blog',
    enforce: 'pre',
    configResolved(c) {
      config = c;
    },
    async load(id) {
      const m = id.match(POST_ID);
      if (!m) return null;
      const file = id.replace(/\?meta$/, '');
      this.addWatchFile(file);
      const post = await readPost(file);
      const data = m[1] ? metaOf(post) : { ...post, html: hyphenateHtml(post.html) };
      return `export default ${JSON.stringify(data)};`;
    },
    async closeBundle() {
      if (config.command === 'build') await writeSite(config);
    },
  };
}
