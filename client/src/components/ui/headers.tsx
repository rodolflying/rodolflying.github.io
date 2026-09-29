import type { ReactNode } from 'react';
import { Link } from 'wouter';
import { useHyphenate } from '@/hooks/useHyphenate';

/**
 * The site's type scale in three components, so every page and section speaks the same way:
 * PageHeader (one h1 per page), SectionHeader (h2) and CtaLink (the one primary button style).
 * Headings: Space Grotesk, sentence case, balanced; no eyebrows, no gradient bars.
 * Focus comes from the global :focus-visible rule in index.css.
 */

export const PageHeader = ({ title, subtitle, children }: { title: ReactNode; subtitle?: ReactNode; children?: ReactNode }) => {
  const hy = useHyphenate();
  return (
    <header className="pt-32 pb-10 md:pb-12 bg-night starfield">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="font-display text-[2.5rem] leading-[1.1] md:text-5xl font-bold tracking-[-0.02em] text-white text-balance">{title}</h1>
          {subtitle && <p className="mt-4 text-lg leading-relaxed text-ink-2 text-justify hyphens-auto max-w-[65ch]">{typeof subtitle === 'string' ? hy(subtitle) : subtitle}</p>}
          {children}
        </div>
      </div>
    </header>
  );
};

export const SectionHeader = ({ title, subtitle, align = 'left', size = 'md', className = '' }: {
  title: ReactNode;
  subtitle?: ReactNode;
  align?: 'left' | 'center';
  /** md = regular section h2; sm = a sub-heading directly under a PageHeader. */
  size?: 'md' | 'sm';
  className?: string;
}) => (
  <div className={`mb-10 ${align === 'center' ? 'text-center mx-auto' : ''} max-w-2xl ${className}`}>
    <h2 className={`font-display font-bold text-white leading-tight text-balance ${size === 'sm' ? 'text-2xl md:text-[1.75rem]' : 'text-3xl md:text-4xl'}`}>{title}</h2>
    {subtitle && <p className="mt-3 text-lg text-ink-2 text-pretty">{subtitle}</p>}
  </div>
);

const CTA = {
  primary: 'bg-star text-night hover:bg-star-soft',
  secondary: 'border border-line text-white hover:border-star hover:text-star',
};

/** Shared by CtaLink and by real <button>s that must look the same (e.g. the contact form submit). */
export const ctaClass = (variant: keyof typeof CTA = 'primary', className = '') =>
  `inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-semibold transition-colors active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none ${CTA[variant]} ${className}`;

/** The site's buttons as links: solid mint for the one action that matters, outline for the rest. */
export const CtaLink = ({ href, children, variant = 'primary', className = '' }: { href: string; children: ReactNode; variant?: keyof typeof CTA; className?: string }) => (
  <Link href={href} className={ctaClass(variant, className)}>
    {children}
  </Link>
);
