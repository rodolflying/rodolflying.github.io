import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

export default function LanguageToggle() {
  const { i18n } = useTranslation();
  const [isSpanish, setIsSpanish] = useState(i18n.language === 'es');

  const toggleLanguage = () => {
    const newLanguage = isSpanish ? 'en' : 'es';
    i18n.changeLanguage(newLanguage);
    setIsSpanish(!isSpanish);
  };

  useEffect(() => {
    setIsSpanish(i18n.language === 'es');
  }, [i18n.language]);

  return (
    <label className="relative inline-block w-[60px] h-[30px] cursor-pointer">
      <input 
        type="checkbox" 
        className="opacity-0 w-0 h-0" 
        checked={isSpanish}
        onChange={toggleLanguage}
      />
      <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-cyber-gray transition-all duration-300 rounded-full flex items-center justify-between px-1.5">
        <span className="text-xs font-bold z-10">EN</span>
        <span className="text-xs font-bold z-10">ES</span>
        <span 
          className="absolute h-[22px] w-[22px] left-1 bottom-1 bg-cyber-teal rounded-full transition-all duration-300"
          style={{ transform: isSpanish ? 'translateX(30px)' : 'translateX(0)' }}
        ></span>
      </span>
    </label>
  );
}
