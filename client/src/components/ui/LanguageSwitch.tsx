import { useLanguage } from '@/hooks/useLanguage';

const LANGS = [
  { code: 'es', short: 'ES', name: 'Español' },
  { code: 'en', short: 'EN', name: 'English' },
] as const;

/** Segmented ES | EN control: two real buttons, visible text, the pressed one is the active language. */
export const LanguageSwitch = ({ className = '' }: { className?: string; isMobile?: boolean }) => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <div role="group" aria-label={language === 'es' ? 'Idioma' : 'Language'} className={`inline-flex items-center rounded-lg border border-line p-0.5 ${className}`}>
      {LANGS.map(({ code, short, name }) => {
        const active = language === code;
        return (
          <button
            key={code}
            type="button"
            lang={code}
            aria-label={name}
            aria-pressed={active}
            onClick={() => { if (!active) toggleLanguage(); }}
            className={`h-8 min-w-[2.25rem] rounded-md px-2 text-xs font-semibold tracking-wide transition-colors ${
              active ? 'bg-star/15 text-star' : 'text-ink-3 hover:text-white'
            }`}
          >
            {short}
          </button>
        );
      })}
    </div>
  );
};

export default LanguageSwitch;
