import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { ContactMessage } from '@/types';
import { motion } from 'framer-motion';
import { Mail, Phone, Linkedin, Github } from 'lucide-react';
import { FaMedium } from 'react-icons/fa';
import confetti from 'canvas-confetti';

const makeContactSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().trim().min(2, { message: t('contact.errors.name') }).max(100),
    email: z.string().trim().email({ message: t('contact.errors.email') }).max(254),
    subject: z.string().trim().min(2, { message: t('contact.errors.subject') }).max(150),
    message: z.string().trim().min(10, { message: t('contact.errors.message') }).max(5000),
    honey: z.string().optional(), // Honeypot trap
  });

type ContactFormData = z.infer<ReturnType<typeof makeContactSchema>>;

// CTAs across the site link to /contact?service=<key>; prefill the subject accordingly.
const SERVICE_SUBJECTS: Record<string, { es: string; en: string }> = {
  diagnostico: { es: 'Solicitud de diagnóstico operativo', en: 'Operational diagnosis request' },
  automatizacion: { es: 'Cotización de automatización de procesos', en: 'Process automation quote' },
};

const subjectFromQuery = (language: 'es' | 'en') => {
  const service = new URLSearchParams(window.location.search).get('service');
  return (service && SERVICE_SUBJECTS[service]?.[language]) || '';
};

const Contact = () => {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      // Lanzar confeti!
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#007BFF', '#00F0FF', '#0F9D58']
      });

      toast({
        title: t('contact.success_title'),
        description: t('contact.success_message'),
      });
      reset();
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast({
        title: t('contact.error_title'),
        description: error.message || t('contact.error_message'),
        variant: 'destructive',
      });
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: ContactFormData) => {
    setIsSubmitting(true);
    contactMutation.mutate(data);
  };

  return (
    <section id="contact" className="py-20 bg-night">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            {t('contact.title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#FFC857] to-[#47E5C2] mx-auto"></div>
          <p className="mt-6 text-slate-300 max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </motion.div>
        
        <motion.div 
          className="grid md:grid-cols-2 gap-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="cyberpunk-border bg-[#0E1626] p-8 rounded-lg">
            <h3 className="text-2xl font-display text-[#FFC857] mb-6">
              {t('contact.form_title')}
            </h3>
            
            {/* Honeypot Input: Oculto para bots */}
          <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
            <label htmlFor="honey">Do not fill this out if you are human</label>
            <input id="honey" type="text" {...register('honey')} tabIndex={-1} autoComplete="off" />
          </div>

          <form onSubmit={handleSubmit((data) => onSubmit(data as ContactMessage))} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                  {t('contact.name')}
                </label>
                <input 
                  type="text" 
                  id="name" 
                  {...register('name')}
                  className={`w-full px-4 py-3 bg-[#070B14] border ${
                    errors.name ? 'border-red-500' : 'border-slate-600'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFC857] focus:border-transparent text-slate-200`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  {t('contact.email')}
                </label>
                <input 
                  type="email" 
                  id="email" 
                  {...register('email')}
                  className={`w-full px-4 py-3 bg-[#070B14] border ${
                    errors.email ? 'border-red-500' : 'border-slate-600'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFC857] focus:border-transparent text-slate-200`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-2">
                  {t('contact.subject')}
                </label>
                <input 
                  type="text" 
                  id="subject" 
                  {...register('subject')}
                  className={`w-full px-4 py-3 bg-[#070B14] border ${
                    errors.subject ? 'border-red-500' : 'border-slate-600'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFC857] focus:border-transparent text-slate-200`}
                />
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-500">{errors.subject.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                  {t('contact.message')}
                </label>
                <textarea 
                  id="message" 
                  {...register('message')}
                  rows={5} 
                  className={`w-full px-4 py-3 bg-[#070B14] border ${
                    errors.message ? 'border-red-500' : 'border-slate-600'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFC857] focus:border-transparent text-slate-200 resize-none`}
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
                )}
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#FFC857] to-[#47E5C2] text-[#070B14] font-bold rounded-lg hover:opacity-90 transition duration-300 shadow-lg shadow-[#FFC857]/20 disabled:opacity-50"
              >
                {isSubmitting ? t('contact.sending') : t('contact.send_btn')}
              </button>
            </form>
          </div>
          
          <div className="flex flex-col space-y-8">
            <div className="cyberpunk-border bg-[#0E1626] p-6 rounded-lg">
              <h3 className="text-xl font-display text-[#47E5C2] mb-6">
                {t('contact.info_title')}
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-lg bg-[#47E5C2]/20 flex items-center justify-center mr-4 mt-1">
                    <Mail className="text-[#47E5C2]" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-1">
                      {t('contact.email_label')}
                    </p>
                    <a 
                      href="mailto:rodolfo.antonio.sep@gmail.com" 
                      className="text-white hover:text-[#47E5C2] transition-colors duration-300"
                    >
                      rodolfo.antonio.sep@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-lg bg-[#7C9CFF]/20 flex items-center justify-center mr-4 mt-1">
                    <Phone className="text-[#7C9CFF]" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-1">
                      {t('contact.phone_label')}
                    </p>
                    <a 
                      href="https://wa.me/56956632620" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-[#7C9CFF] transition-colors duration-300"
                    >
                      +56 9 5663 2620
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-lg bg-[#FF7A85]/20 flex items-center justify-center mr-4 mt-1">
                    <Linkedin className="text-[#FF7A85]" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-1">LinkedIn</p>
                    <a 
                      href="https://www.linkedin.com/in/rodolfo-sepulveda-847532135/"
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="text-white hover:text-[#FF7A85] transition-colors duration-300"
                    >
                      rodolfo-sepulveda-847532135
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-lg bg-[#FFC857]/20 flex items-center justify-center mr-4 mt-1">
                    <Github className="text-[#FFC857]" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-1">GitHub</p>
                    <a 
                      href="https://github.com/rodolflying" 
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="text-white hover:text-[#FFC857] transition-colors duration-300"
                    >
                      rodolflying
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="cyberpunk-border bg-[#0E1626] p-6 rounded-lg">
              <h3 className="text-xl font-display text-[#7C9CFF] mb-6">
                {t('contact.next_title')}
              </h3>
              <ol className="space-y-4">
                {(['step1', 'step2', 'step3'] as const).map((step, i) => (
                  <li key={step} className="flex gap-3">
                    <span className="w-7 h-7 rounded-full bg-[#7C9CFF]/20 border border-[#7C9CFF]/50 text-[#C7D4FF] text-sm font-bold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-slate-300 text-sm leading-relaxed">{t(`contact.next.${step}`)}</p>
                  </li>
                ))}
              </ol>
              <p className="text-slate-400 text-xs mt-6 pt-4 border-t border-slate-700">
                Star Apps SpA · RUT 77.373.407-0
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
