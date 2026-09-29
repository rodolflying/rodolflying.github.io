import Layout from '@/components/Layout';
import { downloads, Download } from '@/data/downloads';
import { useLanguage } from '@/hooks/useLanguage';
import { motion } from 'framer-motion';
import { Download as DownloadIcon, Github, Search, Layers, Monitor, ExternalLink, CheckCircle, Info } from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '@/components/ui/headers';

const iconMap: Record<string, React.ElementType> = {
  search: Search,
  layers: Layers,
  monitor: Monitor,
};

const RequirementTag = ({ text }: { text: string }) => (
  <div className="flex items-center gap-2 text-sm text-ink-3">
    <CheckCircle className="w-4 h-4 text-star flex-shrink-0" aria-hidden="true" />
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
      className="bg-surface-1 border border-line rounded-2xl overflow-hidden flex flex-col"
    >

      {item.screenshots && item.screenshots[0] && (
        <div className="relative h-44 overflow-hidden">
          <img
            src={item.screenshots[0]}
            alt={item.title[lang]}
            className="w-full h-full object-cover opacity-50"
          />
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
          <p className="text-sm text-ink-3">{item.category[lang]}</p>
          <h3 className="text-xl font-display font-bold text-white mt-2">{item.title[lang]}</h3>
        </div>

        <p className="text-ink-2 text-sm leading-relaxed mb-4">{item.description[lang]}</p>

        <div className="num flex items-center gap-4 text-xs text-ink-3 mb-4 border-t border-line pt-4">
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

        <p className="text-xs text-ink-3 mb-5">{item.tags.join(' · ')}</p>

        <button
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          className="flex items-center gap-2 text-sm text-ink-2 hover:text-white transition-colors mb-4 w-fit rounded"
        >
          <Info className="w-4 h-4" aria-hidden="true" />
          {expanded ? 'Ocultar detalles' : 'Ver detalles'}
        </button>

        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="mb-5 space-y-5"
          >
            <p className="text-ink-2 text-sm leading-relaxed">{item.longDescription[lang]}</p>
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Características</h4>
              <ul className="space-y-2">
                {item.features[lang].map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-star" />
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
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm bg-star text-night hover:bg-star-soft transition-colors"
          >
            <DownloadIcon className="w-4 h-4" aria-hidden="true" />
            {/* TODO copy: downloads.download_btn (hardcoded, ES only) */}
            Descargar archivo
          </a>
          {item.githubUrl && (
            <a
              href={item.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-line text-ink-2 hover:border-ink-3 hover:text-white transition-colors"
            >
              <Github className="w-4 h-4" aria-hidden="true" />
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
    <>
    <PageHeader title={t('downloads.title')} subtitle={t('downloads.subtitle')} />
    <section className="pb-20 bg-night">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-start gap-3 mb-12 max-w-3xl border-y border-line py-5">
          <Info className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <h2 className="text-white font-semibold mb-1">{t('downloads.info_title')}</h2>
            <p className="text-ink-2 text-sm leading-relaxed">{t('downloads.info_text')}</p>
          </div>
        </div>

        {downloads.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {downloads.map((item) => (
              <DownloadCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-ink-3">
            <DownloadIcon className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>{t('downloads.empty')}</p>
          </div>
        )}

        <div className="mt-20">
          <p className="text-ink-2 mb-3">{t('downloads.more_coming')}</p>
          <a
            href="https://github.com/rodolflying"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-star hover:underline underline-offset-4 font-medium text-sm rounded"
          >
            <Github className="w-4 h-4" aria-hidden="true" />
            {t('downloads.github_link')}
            <ExternalLink className="w-3 h-3" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
    </>
  );
};

const DownloadsPage = () => (
  <Layout page="downloads">
    <DownloadsPageContent />
  </Layout>
);

export default DownloadsPage;
