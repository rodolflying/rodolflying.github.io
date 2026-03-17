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
import starAppsLogo from '@assets/STAR_APPSpng.png';

const contactSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email' }),
  subject: z.string().min(2, { message: 'Subject must be at least 2 characters' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' }),
});

type ContactFormData = z.infer<typeof contactSchema>;

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
    resolver: zodResolver(contactSchema),
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactMessage) => {
      const response = await apiRequest('POST', '/api/contact', data);
      return response.json();
    },
    onSuccess: () => {
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
    <section id="contact" className="py-20 bg-[#2A2A2A]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-['Orbitron'] font-bold text-white mb-4">
            {t('contact.title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#FF9500] to-[#00FFC8] mx-auto"></div>
          <p className="mt-6 text-gray-300 max-w-2xl mx-auto">
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
          <div className="cyberpunk-border bg-[#1E1E1E] p-8 rounded-lg">
            <h3 className="text-2xl font-['Orbitron'] text-[#FF9500] mb-6">
              {t('contact.form_title')}
            </h3>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('contact.name')}
                </label>
                <input 
                  type="text" 
                  id="name" 
                  {...register('name')}
                  className={`w-full px-4 py-3 bg-[#121212] border ${
                    errors.name ? 'border-red-500' : 'border-gray-600'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9500] focus:border-transparent text-gray-200`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('contact.email')}
                </label>
                <input 
                  type="email" 
                  id="email" 
                  {...register('email')}
                  className={`w-full px-4 py-3 bg-[#121212] border ${
                    errors.email ? 'border-red-500' : 'border-gray-600'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9500] focus:border-transparent text-gray-200`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('contact.subject')}
                </label>
                <input 
                  type="text" 
                  id="subject" 
                  {...register('subject')}
                  className={`w-full px-4 py-3 bg-[#121212] border ${
                    errors.subject ? 'border-red-500' : 'border-gray-600'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9500] focus:border-transparent text-gray-200`}
                />
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-500">{errors.subject.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('contact.message')}
                </label>
                <textarea 
                  id="message" 
                  {...register('message')}
                  rows={5} 
                  className={`w-full px-4 py-3 bg-[#121212] border ${
                    errors.message ? 'border-red-500' : 'border-gray-600'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9500] focus:border-transparent text-gray-200 resize-none`}
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
                )}
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#FF9500] to-[#00FFC8] text-[#121212] font-bold rounded-lg hover:opacity-90 transition duration-300 shadow-lg shadow-[#FF9500]/20 disabled:opacity-50"
              >
                {isSubmitting ? t('contact.sending') : t('contact.send_btn')}
              </button>
            </form>
          </div>
          
          <div className="flex flex-col space-y-8">
            <div className="cyberpunk-border bg-[#1E1E1E] p-6 rounded-lg">
              <h3 className="text-xl font-['Orbitron'] text-[#00FFC8] mb-6">
                {t('contact.info_title')}
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-lg bg-[#00FFC8]/20 flex items-center justify-center mr-4 mt-1">
                    <Mail className="text-[#00FFC8]" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">
                      {t('contact.email_label')}
                    </p>
                    <a 
                      href="mailto:rodolflying@gmail.com" 
                      className="text-white hover:text-[#00FFC8] transition-colors duration-300"
                    >
                      rodolflying@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-lg bg-[#6B38FB]/20 flex items-center justify-center mr-4 mt-1">
                    <Phone className="text-[#6B38FB]" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">
                      {t('contact.phone_label')}
                    </p>
                    <a 
                      href="https://wa.me/56956632620" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-[#6B38FB] transition-colors duration-300"
                    >
                      +56 9 5663 2620
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-lg bg-[#FF2D55]/20 flex items-center justify-center mr-4 mt-1">
                    <Linkedin className="text-[#FF2D55]" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">LinkedIn</p>
                    <a 
                      href="https://www.linkedin.com/in/rodolfo-sepulveda-847532135/"
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="text-white hover:text-[#FF2D55] transition-colors duration-300"
                    >
                      rodolfo-sepulveda-847532135
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-lg bg-[#FF9500]/20 flex items-center justify-center mr-4 mt-1">
                    <Github className="text-[#FF9500]" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">GitHub</p>
                    <a 
                      href="https://github.com/rodolflying" 
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="text-white hover:text-[#FF9500] transition-colors duration-300"
                    >
                      rodolflying
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="cyberpunk-border bg-[#1E1E1E] p-6 rounded-lg">
              <h3 className="text-xl font-['Orbitron'] text-[#6B38FB] mb-6">
                {t('contact.company_title')}
              </h3>
              
              <div className="flex items-center mb-6">
                <img 
                  src={starAppsLogo} 
                  alt="Star Apps Logo" 
                  className="h-14 mr-4"
                />
                <div>
                  <p className="text-white font-['Orbitron']">
                    STAR <span className="text-[#6B38FB]">APPS</span>
                  </p>
                  <p className="text-gray-400 text-sm">
                    {t('contact.company_subtitle')}
                  </p>
                </div>
              </div>
              
              <p className="text-gray-300 mb-6">
                {t('contact.company_desc')}
              </p>
              
              <a 
                href="https://starapps.cl" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-gradient-to-r from-[#6B38FB] to-[#00FFC8] text-[#121212] font-bold rounded-lg hover:opacity-90 transition duration-300"
              >
                {t('contact.visit_btn')}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
