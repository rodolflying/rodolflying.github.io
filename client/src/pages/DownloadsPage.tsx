import Layout from '@/components/Layout';
import { downloads, Download } from '@/data/downloads';
import { useLanguage } from '@/hooks/useLanguage';
import { motion } from 'framer-motion';
import { Download as DownloadIcon, Github, Search, Layers, Monitor, Star, ExternalLink, CheckCircle, Info } from 'lucide-react';
import { useState } from 'react';

const iconMap: Record<string, React.ElementType> = {
  search: Search,
  layers: Layers,
  monitor: Monitor,
};

const RequirementTag = ({ text }: { text: string }) => (
  <div className="flex items-center gap-2 text-sm text-gray-400">
    <CheckCircle className="w-4 h-4 text-[#00FFC8] flex-shrink-0" />
    <span>{text}</span>
  </div>
);

const DownloadCard = ({ item }: { item: Download }) => {
  const { language } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const Icon = iconMap[item.icon] || DownloadIcon;
  const lang = language as 'en' | 'es';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#111111] border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 transition-all duration-300 flex flex-col"
    >
      {item.isNew && (
        <div className="flex justify-end px-6 pt-4">
          <span className="flex items-center gap-1 text-xs font-bold text-[#FF9500] bg-[#FF9500]/10 border border-[#FF9500]/30 px-3 py-1 rounded-full">
            <Star className="w-3 h-3" /> NEW
          </span>
        </div>
      )}

      {item.screenshots && item.screenshots[0] && (
        <div className="relative h-44 overflow-hidden">
          <img
            src={item.screenshots[0]}
            alt={item.title[lang]}
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />
          <div
            className="absolute top-4 left-4 w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${item.color}20`, border: `1px solid ${item.color}50` }}
          >
            <Icon className="w-5 h-5" style={{ color: item.color }} />
          </div>
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
        <div className="mb-3">
          <span className="text-xs font-medium px-2 py-1 rounded-md mb-2 inline-block" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
            {item.category[lang]}
          </span>
          <h3 className="text-xl font-['Orbitron'] font-bold text-white mt-2">{item.title[lang]}</h3>
        </div>

        <p className="text-gray-400 text-sm leading-relaxed mb-4">{item.description[lang]}</p>

        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 border-t border-gray-800 pt-4">
          <span>v{item.version}</span>
          <span>•</span>
          <span>{item.size}</span>
          {item.downloads !== undefined && (
            <>
              <span>•</span>
              <span>{item.downloads} descargas</span>
            </>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {item.tags.map((tag) => (
            <span key={tag} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-md">
              {tag}
            </span>
          ))}
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4 w-fit"
        >
          <Info className="w-4 h-4" />
          {expanded ? 'Ocultar detalles' : 'Ver detalles'}
        </button>

        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="mb-5 space-y-5"
          >
            <p className="text-gray-300 text-sm leading-relaxed">{item.longDescription[lang]}</p>
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Características</h4>
              <ul className="space-y-2">
                {item.features[lang].map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Requisitos del sistema</h4>
              <div className="space-y-2">
                {item.requirements[lang].map((r, i) => (
                  <RequirementTag key={i} text={r} />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div className="flex gap-3 mt-auto">
          <a
            href={item.downloadUrl}
            download
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all duration-300 hover:opacity-90"
            style={{
              backgroundColor: item.color,
              color: '#0a0a0a',
              boxShadow: `0 4px 20px ${item.color}25`,
            }}
          >
            <DownloadIcon className="w-4 h-4" />
            Descargar .zip
          </a>
          {item.githubUrl && (
            <a
              href={item.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white transition-all duration-300"
            >
              <Github className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const DownloadsPageContent = () => {
  const { t } = useLanguage();

  return (
    <section className="min-h-screen pt-28 pb-20 hex-pattern">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FF9500] bg-[#FF9500]/10 border border-[#FF9500]/30 px-4 py-2 rounded-full mb-6">
            <DownloadIcon className="w-3 h-3" />
            {t('downloads.badge')}
          </div>
          <h1 className="text-4xl md:text-5xl font-['Orbitron'] font-bold text-white mb-4">
            {t('downloads.title')}
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            {t('downloads.subtitle')}
          </p>
        </motion.div>

        <motion.div
          className="bg-[#111111] border border-[#FF9500]/30 rounded-2xl p-6 mb-12 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#FF9500]/10 border border-[#FF9500]/30 flex items-center justify-center flex-shrink-0 mt-1">
              <Info className="w-5 h-5 text-[#FF9500]" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">{t('downloads.info_title')}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{t('downloads.info_text')}</p>
            </div>
          </div>
        </motion.div>

        {downloads.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {downloads.map((item) => (
              <DownloadCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            <DownloadIcon className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>{t('downloads.empty')}</p>
          </div>
        )}

        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <p className="text-gray-500 mb-4">{t('downloads.more_coming')}</p>
          <a
            href="https://github.com/rodolflying"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#00FFC8] hover:underline font-medium text-sm"
          >
            <Github className="w-4 h-4" />
            {t('downloads.github_link')}
            <ExternalLink className="w-3 h-3" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

const DownloadsPage = () => (
  <Layout title="Downloads">
    <DownloadsPageContent />
  </Layout>
);

export default DownloadsPage;
