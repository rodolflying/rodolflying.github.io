import Layout from '@/components/Layout';
import { blogPosts, BlogPost } from '@/data/blog';
import { useLanguage } from '@/hooks/useLanguage';
import { motion } from 'framer-motion';
import { BookOpen, ExternalLink, Github, Clock, Filter } from 'lucide-react';
import { useState } from 'react';
import { FaMedium } from 'react-icons/fa';

const categoryColors: Record<string, string> = {
  Tutorial: '#00FFC8',
  Guide: '#6B38FB',
  Article: '#FF2D55',
  Project: '#FF9500',
};

const typeLabels: Record<string, { en: string; es: string }> = {
  tutorial: { en: 'Tutorial', es: 'Tutorial' },
  guide: { en: 'Guide', es: 'Guía' },
  article: { en: 'Article', es: 'Artículo' },
  project: { en: 'Project', es: 'Proyecto' },
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' });
};

const BlogCard = ({ post, featured = false }: { post: BlogPost; featured?: boolean }) => {
  const { language } = useLanguage();
  const lang = language as 'en' | 'es';
  const color = categoryColors[post.category] || '#00FFC8';

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-[#111111] border border-gray-800 rounded-2xl overflow-hidden group hover:border-gray-600 transition-all duration-300 flex flex-col ${
        featured ? 'md:col-span-2' : ''
      }`}
    >
      <div className={`relative overflow-hidden ${featured ? 'h-64' : 'h-44'}`}>
        <img
          src={post.image}
          alt={post.title[lang]}
          className="w-full h-full object-cover opacity-50 group-hover:opacity-65 group-hover:scale-105 transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/40 to-transparent" />
        <div className="absolute top-4 left-4 flex gap-2">
          <span
            className="text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm"
            style={{ backgroundColor: `${color}25`, color, border: `1px solid ${color}40` }}
          >
            {typeLabels[post.type][lang]}
          </span>
          {post.featured && (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FF9500]/25 text-[#FF9500] border border-[#FF9500]/40 backdrop-blur-sm">
              DESTACADO
            </span>
          )}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <span>{formatDate(post.date)}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {post.readTime[lang]}
          </span>
        </div>

        <h2 className={`font-['Orbitron'] font-bold text-white mb-3 leading-snug ${featured ? 'text-xl' : 'text-sm'}`}>
          {post.title[lang]}
        </h2>

        <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1">{post.excerpt[lang]}</p>

        <div className="flex flex-wrap gap-2 mb-5">
          {post.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-md">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-4 border-t border-gray-800 pt-4 mt-auto">
          {post.mediumUrl ? (
            <a
              href={post.mediumUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors duration-300"
            >
              <FaMedium className="w-4 h-4" />
              Leer en Medium
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <span className="text-sm text-gray-600 italic">Próximamente...</span>
          )}
          {post.githubUrl && (
            <a
              href={post.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-[#00FFC8] transition-colors duration-300"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          )}
        </div>
      </div>
    </motion.article>
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

  const filtered = activeFilter === 'all'
    ? blogPosts
    : blogPosts.filter((p) => p.category === activeFilter);

  const featured = filtered.find((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured);

  return (
    <section className="min-h-screen pt-28 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#00FFC8] bg-[#00FFC8]/10 border border-[#00FFC8]/30 px-4 py-2 rounded-full mb-6">
            <BookOpen className="w-3 h-3" />
            {t('blog.badge')}
          </div>
          <h1 className="text-4xl md:text-5xl font-['Orbitron'] font-bold text-white mb-4">
            {t('blog.title')}
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            {t('blog.subtitle')}
          </p>
          <div className="mt-6 flex justify-center">
            <a
              href="https://medium.com/@rodolfo.antonio.sep"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-4 py-2 rounded-lg transition-all duration-300"
            >
              <FaMedium className="w-4 h-4" />
              {t('blog.medium_link')}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </motion.div>

        <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
          <Filter className="w-4 h-4 text-gray-500 mr-1" />
          {categories.map((cat) => {
            const color = cat === 'all' ? '#ffffff' : (categoryColors[cat] || '#ffffff');
            const isActive = activeFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`text-sm px-4 py-2 rounded-full border transition-all duration-300 font-medium ${
                  isActive ? 'text-[#0a0a0a]' : 'text-gray-400 border-gray-700 hover:border-gray-500 hover:text-white'
                }`}
                style={isActive ? { backgroundColor: color, borderColor: color } : {}}
              >
                {categoryLabels[cat]}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featured && <BlogCard post={featured} featured={true} />}
          {rest.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No hay artículos en esta categoría todavía.</p>
          </div>
        )}

        <motion.div
          className="mt-20 text-center bg-[#111111] border border-gray-800 rounded-2xl p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <FaMedium className="w-10 h-10 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-['Orbitron'] font-bold text-white mb-3">{t('blog.cta_title')}</h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">{t('blog.cta_text')}</p>
          <a
            href="https://medium.com/@rodolfo.antonio.sep"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#0a0a0a] font-bold rounded-lg hover:bg-gray-100 transition-all duration-300"
          >
            <FaMedium className="w-5 h-5" />
            {t('blog.cta_btn')}
          </a>
        </motion.div>
      </div>
    </section>
  );
};

const BlogPage = () => (
  <Layout title="Blog">
    <BlogPageContent />
  </Layout>
);

export default BlogPage;
