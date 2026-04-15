import { useLanguage } from '@/hooks/useLanguage';
import Layout from '@/components/Layout';
import Hero from '@/components/sections/Hero';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Code2, Download, BookOpen, User, ArrowRight, Zap, Globe } from 'lucide-react';

const SectionCard = ({
  href,
  icon: Icon,
  title,
  description,
  color,
  delay,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <Link href={href}>
      <div className="group relative bg-[#111111] border border-gray-800 rounded-xl p-6 cursor-pointer overflow-hidden hover:border-gray-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl h-full">
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-8 transition-opacity duration-400 rounded-xl"
          style={{ background: `radial-gradient(circle at top left, ${color}, transparent)` }}
        />
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors duration-300"
          style={{ backgroundColor: `${color}18`, border: `1px solid ${color}35` }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
        <h3 className="text-base font-['Orbitron'] font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">{description}</p>
        <div className="flex items-center text-sm font-medium transition-all duration-300" style={{ color }}>
          <span className="mr-2">Explorar</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>
    </Link>
  </motion.div>
);

const StatsBar = () => {
  const stats = [
    { value: '5+', label: 'Años de experiencia' },
    { value: '20+', label: 'Proyectos completados' },
    { value: '1M+', label: 'Datos procesados' },
    { value: '5+', label: 'Certificaciones' },
  ];

  return (
    <div className="border-t border-b border-gray-800 py-10 my-16 bg-[#0d0d0d]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
            >
              <div className="text-3xl md:text-4xl font-['Orbitron'] font-bold text-[#00FFC8] mb-1">{stat.value}</div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const { t } = useLanguage();

  const cards = [
    { href: '/about', icon: User, title: t('navbar.about'), description: t('home.about_desc'), color: '#00FFC8', delay: 0.1 },
    { href: '/services', icon: Zap, title: t('navbar.services'), description: t('home.services_desc'), color: '#FF2D55', delay: 0.2 },
    { href: '/projects', icon: Code2, title: t('navbar.projects'), description: t('home.projects_desc'), color: '#6B38FB', delay: 0.3 },
    { href: '/downloads', icon: Download, title: t('navbar.downloads'), description: t('home.downloads_desc'), color: '#FF9500', delay: 0.4 },
    { href: '/blog', icon: BookOpen, title: t('navbar.blog'), description: t('home.blog_desc'), color: '#00FFC8', delay: 0.5 },
    { href: '/contact', icon: Globe, title: t('navbar.contact'), description: t('home.contact_desc'), color: '#FF2D55', delay: 0.6 },
  ];

  return (
    <Layout>
      <Hero />
      <StatsBar />

      <section className="pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-2xl md:text-3xl font-['Orbitron'] font-bold text-white mb-3">
              {t('home.explore_title')}
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base">
              {t('home.explore_subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {cards.map((card) => (
              <SectionCard key={card.href} {...card} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-[#00FFC8]/5 via-transparent to-[#6B38FB]/5 border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <h2 className="text-2xl font-['Orbitron'] font-bold text-white mb-4">
              {t('home.cta_title')}
            </h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">{t('home.cta_subtitle')}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <span className="px-8 py-3 bg-[#00FFC8] text-[#121212] font-bold rounded-lg hover:bg-opacity-80 transition duration-300 shadow-lg shadow-[#00FFC8]/20 cursor-pointer inline-block">
                  {t('home.cta_contact')}
                </span>
              </Link>
              <Link href="/downloads">
                <span className="px-8 py-3 bg-transparent border-2 border-[#FF9500] text-[#FF9500] font-bold rounded-lg hover:bg-[#FF9500]/10 transition duration-300 cursor-pointer flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  {t('home.cta_download')}
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
