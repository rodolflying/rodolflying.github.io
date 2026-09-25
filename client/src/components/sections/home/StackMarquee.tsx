import { useLanguage } from '@/hooks/useLanguage';

const STACK = [
  'Python', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'SAP', 'Power BI', 'AWS', 'Docker',
  'Playwright', 'Selenium', 'OpenAI', 'Gemini', 'WhatsApp API', 'Telegram', 'Supabase', 'Excel',
];

const StackMarquee = () => {
  const { t } = useLanguage();
  // Rendered twice so the -50% translate loops seamlessly.
  const items = [...STACK, ...STACK];

  return (
    <section className="py-10 border-y border-night-line bg-night-900" aria-label={t('stack.label')}>
      <p className="text-center text-sm text-slate-400 mb-6">{t('stack.label')}</p>
      <div className="marquee overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
        <ul className="marquee-track flex gap-10 pr-10">
          {items.map((name, i) => (
            <li key={i} className="flex items-center gap-3 text-lg font-display font-semibold text-slate-200 whitespace-nowrap" aria-hidden={i >= STACK.length}>
              <span className="w-1.5 h-1.5 rounded-full bg-star" />
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default StackMarquee;
