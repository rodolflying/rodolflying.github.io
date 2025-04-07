import { useLanguage } from '@/hooks/useLanguage';

interface LanguageSwitchProps {
  isMobile?: boolean;
}

export const LanguageSwitch = ({ isMobile = false }: LanguageSwitchProps) => {
  const { language, toggleLanguage } = useLanguage();

  const id = isMobile ? 'mobile-language-toggle' : 'language-toggle';

  return (
    <div className="language-switch flex items-center">
      <span className="mr-2 text-sm">EN</span>
      <div className="relative inline-block w-[60px] h-[30px] select-none">
        <input
          type="checkbox"
          id={id}
          className="opacity-0 w-0 h-0"
          checked={language === 'es'}
          onChange={toggleLanguage}
        />
        <label
          htmlFor={id}
          className="cursor-pointer absolute top-0 left-0 right-0 bottom-0 bg-[#2A2A2A] rounded-full"
        >
          <span
            className={`absolute top-[3px] w-[24px] h-[24px] rounded-full transition-all duration-300 ${
              language === 'es' 
                ? 'bg-[#FF2D55] right-[3px]' 
                : 'bg-[#00FFC8] left-[3px]'
            }`}
          />
        </label>
      </div>
      <span className="ml-2 text-sm">ES</span>
    </div>
  );
};

export default LanguageSwitch;
