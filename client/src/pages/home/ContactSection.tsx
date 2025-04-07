import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Phone, Linkedin, Github, Globe } from 'lucide-react';
import { CyberpunkCard } from '@/components/ui/cyberpunk-card';
import { useToast } from '@/hooks/use-toast';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/queryClient';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters."
  }),
  email: z.string().email({
    message: "Please enter a valid email address."
  }),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters."
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters."
  })
});

type FormValues = z.infer<typeof formSchema>;

export default function ContactSection() {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await apiRequest('POST', '/api/contact', data);
      toast({
        title: t('contact.success.title'),
        description: t('contact.success.message'),
      });
      form.reset();
    } catch (error) {
      toast({
        title: t('contact.error.title'),
        description: t('contact.error.message'),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactItems = [
    { 
      icon: <Mail className="text-xl text-cyber-teal" />, 
      title: 'Email', 
      value: 'rodolfo.antonio.sep@gmail.com', 
      link: 'mailto:rodolfo.antonio.sep@gmail.com' 
    },
    { 
      icon: <Phone className="text-xl text-cyber-teal" />, 
      title: t('contact.phone'), 
      value: '+56 9 5663 2620', 
      link: 'tel:+56956632620' 
    },
    { 
      icon: <Linkedin className="text-xl text-cyber-teal" />, 
      title: 'LinkedIn', 
      value: 'rodolfo-sepulveda-847537135', 
      link: 'https://linkedin.com/in/rodolfo-sepulveda-847537135' 
    },
    { 
      icon: <Github className="text-xl text-cyber-teal" />, 
      title: 'GitHub', 
      value: 'rodolflying', 
      link: 'https://github.com/rodolflying' 
    },
    { 
      icon: <Globe className="text-xl text-cyber-teal" />, 
      title: 'Medium', 
      value: '@rodolfo.antonio.sep', 
      link: 'https://medium.com/@rodolfo.antonio.sep' 
    }
  ];

  return (
    <section id="contact" className="py-20 bg-cyber-gray/50" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-orbitron text-4xl font-bold text-white inline-block relative">
            <span className="relative z-10">{t('contact.title')}</span>
            <span className="absolute bottom-0 left-0 w-full h-1 bg-cyber-teal"></span>
          </h2>
          <p className="text-cyber-light mt-4 max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="font-orbitron text-white text-2xl mb-6">{t('contact.getInTouch')}</h3>
            <div className="space-y-6">
              {contactItems.map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-cyber-teal/20 p-3 rounded-lg mr-4 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">{item.title}</h4>
                    <a 
                      href={item.link} 
                      target={item.link.startsWith('http') ? '_blank' : undefined}
                      rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-cyber-light hover:text-cyber-teal transition duration-300"
                    >
                      {item.value}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CyberpunkCard>
              <h3 className="font-orbitron text-white text-2xl mb-6">{t('contact.sendMessage')}</h3>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-cyber-light">{t('contact.form.name')}</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="bg-cyber-dark/70 border-cyber-teal/30 text-white focus:border-cyber-teal" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-cyber-light">{t('contact.form.email')}</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="email"
                            className="bg-cyber-dark/70 border-cyber-teal/30 text-white focus:border-cyber-teal" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-cyber-light">{t('contact.form.subject')}</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="bg-cyber-dark/70 border-cyber-teal/30 text-white focus:border-cyber-teal" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-cyber-light">{t('contact.form.message')}</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            rows={5}
                            className="bg-cyber-dark/70 border-cyber-teal/30 text-white focus:border-cyber-teal resize-none" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-cyber-teal text-cyber-dark font-orbitron py-6 px-6 rounded-lg hover:bg-transparent hover:text-cyber-teal border-2 border-cyber-teal transition duration-300 uppercase tracking-wider"
                  >
                    {isSubmitting ? t('contact.form.sending') : t('contact.form.send')}
                  </Button>
                </form>
              </Form>
            </CyberpunkCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
