import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { ContactMessage } from '@/types';
import { Mail, Phone, Linkedin, Github, type LucideIcon } from 'lucide-react';
import { ctaClass } from '@/components/ui/headers';
import { motion } from 'framer-motion';

// Five-point star (the logo's shape) centred on (60, 60) for the "message sent" mark.
const STAR_PATH = Array.from({ length: 10 }, (_, i) => {
  const a = -Math.PI / 2 + (i * Math.PI) / 5;
  const r = i % 2 ? 12 : 28;
  return `${i ? 'L' : 'M'}${(60 + Math.cos(a) * r).toFixed(1)},${(60 + Math.sin(a) * r).toFixed(1)}`;
}).join(' ') + ' Z';

/** "Message sent": the star draws itself inside two dotted orbits, then a copper check (a person will answer). */
const SentStar = () => (
  <svg viewBox="0 0 120 120" className="mx-auto h-32 w-32" aria-hidden="true">
    {[52, 40].map((r, i) => (
      <motion.circle
        key={r}
        cx="60"
        cy="60"
        r={r}
        fill="none"
        stroke="#47E5C2"
        strokeOpacity={0.3 - i * 0.08}
        strokeWidth="1.2"
        strokeDasharray="1.5 5"
        strokeLinecap="round"
        style={{ transformOrigin: '60px 60px' }}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, rotate: i ? -30 : 30 }}
        transition={{ duration: 1.2, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
      />
    ))}
    <motion.path
      d={STAR_PATH}
      fill="#47E5C2"
      stroke="#47E5C2"
      strokeWidth="2"
      strokeLinejoin="round"
      initial={{ pathLength: 0, fillOpacity: 0 }}
      animate={{ pathLength: 1, fillOpacity: 0.18 }}
      transition={{ pathLength: { duration: 0.9, delay: 0.2 }, fillOpacity: { duration: 0.5, delay: 1 } }}
    />
    <motion.path
      d="M50 61 L57 68 L71 52"
      fill="none"
      stroke="#F2C7A5"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.45, delay: 1.1, ease: 'easeOut' }}
    />
  </svg>
);

const makeContactSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().trim().min(2, { message: t('contact.errors.name') }).max(100),
    email: z.string().trim().email({ message: t('contact.errors.email') }).max(254),
    subject: z.string().trim().min(2, { message: t('contact.errors.subject') }).max(150),
    message: z.string().trim().min(10, { message: t('contact.errors.message') }).max(5000),
    honey: z.string().optional(), // Honeypot trap
  });

type ContactFormData = z.infer<ReturnType<typeof makeContactSchema>>;
type FieldName = 'name' | 'email' | 'subject' | 'message';

// CTAs across the site link to /contact?service=<key>; prefill the subject accordingly.
const SERVICE_SUBJECTS: Record<string, { es: string; en: string }> = {
  diagnostico: { es: 'Solicitud de diagnóstico operativo', en: 'Operational diagnosis request' },
  automatizacion: { es: 'Cotización de automatización de procesos', en: 'Process automation quote' },
};

const subjectFromQuery = (language: 'es' | 'en') => {
  const service = new URLSearchParams(window.location.search).get('service');
  return (service && SERVICE_SUBJECTS[service]?.[language]) || '';
};

const labelClass = 'block text-sm font-medium text-ink-2 mb-2';
const boxClass = 'rounded-2xl border border-line bg-surface-1';
const boxTitle = 'font-display text-xl font-semibold text-white';

/** The page title (h1) lives in ContactPage's PageHeader; this is the form plus the side panels. */
const Contact = () => {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(makeContactSchema(t)),
    defaultValues: { subject: subjectFromQuery(language) },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactMessage) => {
      const response = await apiRequest('POST', '/api/contact', data);
      return response.json();
    },
    onSuccess: () => {
      setSent(true);
      toast({
        title: t('contact.success_title'),
        description: t('contact.success_message'),
      });
      reset();
      setIsSubmitting(false);
    },
    onError: () => {
      // Never surface raw server/network text; always the translated message.
      // TODO copy: contact.error_message could also offer WhatsApp as the fallback channel.
      toast({
        title: t('contact.error_title'),
        description: t('contact.error_message'),
        variant: 'destructive',
      });
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: ContactFormData) => {
    setIsSubmitting(true);
    contactMutation.mutate(data as ContactMessage);
  };

  // Field wiring: error state and message are linked to the input for assistive tech.
  const fieldProps = (name: FieldName) => ({
    id: name,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
    className: `w-full px-4 py-3 bg-night border rounded-lg text-ink transition-colors ${
      errors[name] ? 'border-danger' : 'border-line hover:border-ink-3/60'
    }`,
    ...register(name),
  });

  const fieldError = (name: FieldName) =>
    errors[name] && (
      <p id={`${name}-error`} className="mt-1.5 text-sm text-danger">{errors[name]?.message}</p>
    );

  const channels: Array<{ Icon: LucideIcon; label: string; href: string; text: string; external?: boolean }> = [
    { Icon: Mail, label: t('contact.email_label'), href: 'mailto:rodolfo.antonio.sep@gmail.com', text: 'rodolfo.antonio.sep@gmail.com' },
    { Icon: Phone, label: t('contact.phone_label'), href: 'https://wa.me/56956632620', text: '+56 9 5663 2620', external: true },
    { Icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/rodolfo-sepulveda-847532135/', text: 'rodolfo-sepulveda-847532135', external: true },
    { Icon: Github, label: 'GitHub', href: 'https://github.com/rodolflying', text: 'rodolflying', external: true },
  ];

  return (
    <section id="contact" className="pb-20 bg-night">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-10 items-start">
          <div className={`${boxClass} p-6 sm:p-8`}>
            <h2 className={`${boxTitle} mb-6`}>{t('contact.form_title')}</h2>

            {/* Honeypot: hidden from people and assistive tech; bots fill it */}
            <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
              <label htmlFor="honey">Do not fill this out if you are human</label>
              <input id="honey" type="text" {...register('honey')} tabIndex={-1} autoComplete="off" />
            </div>

            {sent ? (
              <div className="text-center" role="status">
                <div className="mb-6">
                  <SentStar />
                </div>
                <h3 className="font-display text-2xl font-bold text-white mb-2">{t('contact.success_title')}</h3>
                <p className="text-ink-2 mb-6">{t('contact.success_message')}</p>
                <button type="button" onClick={() => setSent(false)} className={ctaClass('secondary')}>
                  {t('contact.send_another')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                <div>
                  <label htmlFor="name" className={labelClass}>{t('contact.name')}</label>
                  <input type="text" autoComplete="name" {...fieldProps('name')} />
                  {fieldError('name')}
                </div>

                <div>
                  <label htmlFor="email" className={labelClass}>{t('contact.email')}</label>
                  <input type="email" autoComplete="email" {...fieldProps('email')} />
                  {fieldError('email')}
                </div>

                <div>
                  <label htmlFor="subject" className={labelClass}>{t('contact.subject')}</label>
                  <input type="text" {...fieldProps('subject')} />
                  {fieldError('subject')}
                </div>

                <div>
                  <label htmlFor="message" className={labelClass}>{t('contact.message')}</label>
                  <textarea rows={5} {...fieldProps('message')} />
                  {fieldError('message')}
                </div>

                <button type="submit" disabled={isSubmitting} className={ctaClass('primary', 'w-full')}>
                  {isSubmitting ? t('contact.sending') : t('contact.send_btn')}
                </button>
              </form>
            )}
          </div>

          <div className="flex flex-col gap-8">
            <div className={`${boxClass} p-6`}>
              <h2 className={`${boxTitle} mb-5`}>{t('contact.next_title')}</h2>
              <ol className="space-y-4">
                {(['step1', 'step2', 'step3'] as const).map((step, i) => (
                  <li key={step} className="flex gap-3">
                    <span className="num w-7 h-7 rounded-full border border-line text-ink-2 text-sm font-semibold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-ink-2 text-sm leading-relaxed pt-1">{t(`contact.next.${step}`)}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className={`${boxClass} p-6`}>
              <h2 className={`${boxTitle} mb-5`}>{t('contact.info_title')}</h2>
              <ul className="space-y-4">
                {channels.map(({ Icon, label, href, text, external }) => (
                  <li key={label} className="flex items-start gap-3">
                    <Icon className="w-5 h-5 mt-0.5 text-star flex-shrink-0" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-ink-3 text-sm">{label}</p>
                      <a
                        href={href}
                        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        className="text-white hover:text-star transition-colors break-words rounded"
                      >
                        {text}
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="text-ink-3 text-xs mt-6 pt-4 border-t border-line">Star Apps SpA · RUT 77.373.407-0</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
