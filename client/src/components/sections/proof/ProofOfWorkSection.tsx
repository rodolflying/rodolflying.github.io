import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, 
  GitFork, 
  Terminal, 
  Sparkles,
  Zap,
  Activity
} from 'lucide-react';
import RoiCalculator from './RoiCalculator';
import InteractiveFlowchart from './InteractiveFlowchart';
import { useLanguage } from '@/hooks/useLanguage';
import Pm2ConsoleSimulator from './Pm2ConsoleSimulator';

export const ProofOfWorkSection = () => {
  const { language } = useLanguage();
  const es = language === 'es';
  const [activeTab, setActiveTab] = useState<'roi' | 'flowchart' | 'terminal'>('roi');

  const tabs = [
    {
      id: 'roi' as const,
      label: es ? 'Calculadora de ROI' : 'ROI Calculator',
      sublabel: es ? 'Ahorro financiero anual' : 'Annual savings',
      icon: Calculator,
      color: '#47E5C2'
    },
    {
      id: 'flowchart' as const,
      label: es ? 'Flujos interactivos' : 'Interactive flows',
      sublabel: 'Pipeline SAP ➔ WhatsApp',
      icon: GitFork,
      color: '#7C9CFF'
    },
    {
      id: 'terminal' as const,
      label: es ? 'Monitor de consola pm2' : 'pm2 console monitor',
      sublabel: es ? 'Monitoreo 24/7 (simulación)' : '24/7 monitoring (simulation)',
      icon: Terminal,
      color: '#7DD3FC'
    }
  ];

  return (
    <section id="proof-of-work" className="py-20 bg-black relative overflow-hidden border-t border-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#47E5C2]/10 border border-[#47E5C2]/30 mb-4">
            <Zap className="w-3.5 h-3.5 text-[#47E5C2]" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#47E5C2] font-bold">
              {es ? 'SIMULACIONES INTERACTIVAS' : 'INTERACTIVE SIMULATIONS'}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white tracking-tight mb-4">
            {es ? 'Muestras dinámicas de ' : 'Interactive '}<span className="text-[#47E5C2]">{es ? 'capacidades' : 'capabilities'}</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            {es
              ? 'Simulaciones ilustrativas de cómo trabajamos: calcula el impacto económico en tu negocio, mira cómo se conectan los sistemas y cómo se monitorea un bot en operación.'
              : 'Illustrative simulations of how we work: estimate the economic impact on your business, see how systems connect and how a running bot is monitored.'}
          </p>
        </div>

        {/* 3 Tabs Navigator */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-5 py-3.5 rounded-xl border font-mono transition-all duration-300 ${
                  isActive
                    ? 'bg-[#0E1626] text-white shadow-xl scale-[1.02]'
                    : 'bg-[#0A1020] text-slate-400 border-night-line/80 hover:border-slate-700 hover:text-slate-200'
                }`}
                style={{
                  borderColor: isActive ? tab.color : undefined,
                  boxShadow: isActive ? `0 0 25px ${tab.color}25` : undefined
                }}
              >
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ 
                    backgroundColor: isActive ? `${tab.color}25` : 'rgba(255,255,255,0.03)',
                    color: isActive ? tab.color : '#9CA3AF'
                  }}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs sm:text-sm font-bold font-display text-white">
                    {tab.label}
                  </div>
                  <div className="text-xs text-slate-400">
                    {tab.sublabel}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'roi' && <RoiCalculator />}
            {activeTab === 'flowchart' && <InteractiveFlowchart />}
            {activeTab === 'terminal' && <Pm2ConsoleSimulator />}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ProofOfWorkSection;
