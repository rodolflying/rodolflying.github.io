import { hyphenateSync as hyphenateEs } from 'hyphen/es';
import { hyphenateSync as hyphenateEn } from 'hyphen/en';
import { useLanguage } from '@/hooks/useLanguage';

/**
 * Justified paragraphs need hyphenation or they open "rivers" between words, and many
 * desktop browsers don't hyphenate Spanish on their own. This adds soft hyphens (U+00AD):
 * invisible unless the browser breaks a word there at the end of a line.
 * Names and acronyms with inner capitals (TypeScript, SQL, RPA) are left whole.
 */
// Built with RegExp so the Unicode flag doesn't depend on the compile target.
const LONG_WORD = new RegExp(String.raw`\p{L}{7,}`, 'gu');
const INNER_CAPITAL = new RegExp(String.raw`\p{Lu}`, 'u');

export function useHyphenate() {
  const { language } = useLanguage();
  const hyphenate = language === 'es' ? hyphenateEs : hyphenateEn;
  return (text: string) =>
    text.replace(LONG_WORD, (word) => (INNER_CAPITAL.test(word.slice(1)) ? word : hyphenate(word)));
}
