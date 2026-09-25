import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code2, 
  Cpu, 
  Layers, 
  Server, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  HelpCircle, 
  TrendingUp, 
  Clock, 
  FileCode, 
  Terminal, 
  CloudRain, 
  Database,
  Users,
  Search,
  Wrench,
  ChevronRight
} from 'lucide-react';
import { Link } from 'wouter';

export const PillarsSection = () => {
  const [activePillar, setActivePillar] = useState<'pilar1' | 'pilar2' | 'pilar3' | 'pilar4'>('pilar1');
  const [activeSubcategory, setActiveSubcategory] = useState<number>(0);
  const [infraMode, setInfraMode] = useState<'onpremise' | 'cloud'>('onpremise');

  const pillars = [
    {
      id: 'pilar1' as const,
      num: '01',
      badge: 'PROYECTO POR HITO',
      title: 'Desarrollo a la Medida',
      subtitle: 'Custom Software & RPA',
      color: '#47E5C2',
      bgGlow: 'rgba(0, 255, 200, 0.12)',
      border: 'rgba(0, 255, 200, 0.3)',
      icon: Cpu,
      tagline: '0% en licencias recurrentes de software.',
      desc: 'Construimos aplicaciones, bots orquestadores, pipelines ETL y sistemas web diseñados milimétricamente para resolver el cuello de botella exacto de tu operación.',
      points: [
        'Código 100% nativo (Python, TypeScript, React, Docker)',
        'Sin cuotas mensuales obligatorias por licencias o asientos de usuario',
        'Despliegue directo en tus servidores o nube propia',
        'Propiedad intelectual y código fuente total para tu empresa'
      ],
      pricingModel: 'Tarifa fija por proyecto / entregables por hito'
    },
    {
      id: 'pilar2' as const,
      num: '02',
      badge: 'MÁS FLEXIBLE',
      title: 'Soporte Adaptativo 4-en-1',
      subtitle: 'Crédito Flexible de Ingeniería',
      color: '#7DD3FC',
      bgGlow: 'rgba(56, 189, 248, 0.12)',
      border: 'rgba(56, 189, 248, 0.3)',
      icon: Layers,
      tagline: 'Una bolsa de horas mensual que nunca se desperdicia.',
      desc: 'No es un canon de mantenimiento rígido. Es una bolsa de ingeniería viva que tu equipo distribuye mes a mes libremente según las prioridades del momento.',
      points: [
        'Soporte Operativo: Monitoreo preventivo y corrección de incidencias',
        'Pequeños Ajustes: Rutas, credenciales, nuevos campos en reportes',
        'Capacitación y Onboarding: Entrenamiento a tu personal operativo',
        'Levantamiento y Discovery: Mapeo presencial/remoto de nuevas automatizaciones'
      ],
      pricingModel: 'Bolsa mensual flexible (10h, 20h o personalizada)'
    },
    {
      id: 'pilar3' as const,
      num: '03',
      badge: 'FLEXIBILIDAD TOTAL',
      title: 'Infraestructura & Cloud',
      subtitle: 'On-Premise o Nube Gestionada',
      color: '#FFC857',
      bgGlow: 'rgba(245, 158, 11, 0.12)',
      border: 'rgba(245, 158, 11, 0.3)',
      icon: Server,
      tagline: 'Aprovecha tus máquinas o delegamos el hosting.',
      desc: 'Tú decides dónde reside el cómputo. Nos adaptamos a los servidores físicos de tu empresa o gestionamos entornos dedicados de alta disponibilidad.',
      points: [
        'Opción On-Premise: Despliegue nativo (Linux/Windows, pm2, Docker) sin cargo de infraestructura de nuestra parte',
        'Opción Cloud Gestionado: Instancias seguras en AWS, DigitalOcean o Azure',
        'Facturación transparente: Costo del proveedor + fee de administración en factura única',
        'Backups automáticos y protocolos de contingencia'
      ],
      pricingModel: 'Costo $0 si usas tus servidores | Costo de nube + fee de administración'
    },
    {
      id: 'pilar4' as const,
      num: '04',
      badge: 'CRECIMIENTO ORDENADO',
      title: 'Escalamiento & Cambios',
      subtitle: 'Controles de Cambio (Incrementos)',
      color: '#A5B4FC',
      bgGlow: 'rgba(168, 85, 247, 0.12)',
      border: 'rgba(168, 85, 247, 0.3)',
      icon: TrendingUp,
      tagline: 'Tu software evoluciona al ritmo de tu negocio.',
      desc: 'Cuando una necesidad supera un pequeño ajuste y altera la lógica nuclear del negocio, se presupuesta como un Incremento Modular para mantener la arquitectura limpia.',
      points: [
        'Cotización clara y cerrada por hito nuevo',
        'Sin reescribir la base: arquitectura modular extensible',
        'Pruebas de regresión automatizadas antes del pase a producción',
        'Documentación To-Be actualizada con cada entrega'
      ],
      pricingModel: 'Cotización por incremento adicional aprobado'
    }
  ];

  const currentPillarData = pillars.find(p => p.id === activePillar)!;

  const supportCategories = [
    {
      icon: ShieldCheck,
      title: '1. Soporte Operativo',
      desc: 'Resolución prioritaria de incidencias, fallas de conectividad externa, cambios en páginas web raspadas y monitoreo preventivo de salud de bots.',
      tag: 'Alta Prioridad'
    },
    {
      icon: Wrench,
      title: '2. Pequeños Ajustes',
      desc: 'Modificación de parámetros menores en código: cambio de rutas de red, nuevos campos en reportes Excel/PDF, actualización de credenciales y tokens.',
      tag: 'Agilidad'
    },
    {
      icon: Users,
      title: '3. Capacitación & Onboarding',
      desc: 'Sesiones 1 a 1 o grupales para entrenar a nuevos operadores en el uso de los sistemas, resolver dudas funcionales y crear manuales en video.',
      tag: 'Adopción'
    },
    {
      icon: Search,
      title: '4. Levantamiento & Discovery',
      desc: 'Ingeniería en terreno o remota para auditar procesos manuales, entrevistar a tu equipo y diseñar el diagrama To-Be del próximo proyecto.',
      tag: 'Estratégico'
    }
  ];

  return (
    <section className="py-20 bg-[#070B14] relative overflow-hidden border-t border-b border-slate-900">
      {/* Background ambient light */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full blur-[140px] pointer-events-none opacity-20 transition-colors duration-700"
        style={{ backgroundColor: currentPillarData.color }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-night-line mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#47E5C2]" />
            <span className="text-xs font-mono uppercase tracking-widest text-slate-300">
              ARQUITECTURA DE SERVICIOS
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white tracking-tight mb-5">
            4 Pilares de <span className="text-[#47E5C2]">Transparencia Total</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Eliminamos los modelos abusivos de licencias recurrentes. Diseñamos un marco de colaboración
            técnico, modular y con acompañamiento de ingeniería real para tu empresa.
          </p>
        </div>

        {/* 4 Pillars Nav Selector */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            const isActive = activePillar === pillar.id;
            return (
              <button
                key={pillar.id}
                onClick={() => setActivePillar(pillar.id)}
                className={`text-left p-4 rounded-xl border transition-all duration-300 relative overflow-hidden group ${
                  isActive 
                    ? 'bg-[#0E1626] shadow-xl' 
                    : 'bg-[#0A1020]/70 border-night-line/80 hover:border-slate-700 hover:bg-[#0E1626]/80'
                }`}
                style={{
                  borderColor: isActive ? pillar.color : undefined,
                  boxShadow: isActive ? `0 0 25px ${pillar.color}20` : undefined
                }}
              >
                {/* Active Indicator Top Bar */}
                {isActive && (
                  <motion.div 
                    layoutId="activePillarBar"
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ backgroundColor: pillar.color }}
                  />
                )}

                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-black/50 border border-night-line" style={{ color: pillar.color }}>
                    PILAR {pillar.num}
                  </span>
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                    style={{ 
                      backgroundColor: isActive ? `${pillar.color}25` : 'rgba(255,255,255,0.03)',
                      color: isActive ? pillar.color : '#9CA3AF'
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-white font-display font-semibold text-sm sm:text-base group-hover:text-white transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 font-mono">
                  {pillar.subtitle}
                </p>
              </button>
            );
          })}
        </div>

        {/* Dynamic Display Panel for Active Pillar */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePillar}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="bg-[#131313] border border-night-line rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden"
          >
            {/* Corner Decorative Accent */}
            <div 
              className="absolute top-0 right-0 w-48 h-48 rounded-bl-full pointer-events-none opacity-10"
              style={{ background: `radial-gradient(circle at top right, ${currentPillarData.color}, transparent)` }}
            />

            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Core Value & Specs */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <span 
                    className="inline-block text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-md mb-3 border font-semibold"
                    style={{ 
                      color: currentPillarData.color, 
                      backgroundColor: `${currentPillarData.color}15`,
                      borderColor: `${currentPillarData.color}35`
                    }}
                  >
                    {currentPillarData.badge}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">
                    {currentPillarData.title}
                  </h3>
                  <p className="text-base font-semibold" style={{ color: currentPillarData.color }}>
                    {currentPillarData.tagline}
                  </p>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed mt-3">
                    {currentPillarData.desc}
                  </p>
                </div>

                {/* Bullets */}
                <div className="space-y-3 pt-2">
                  {currentPillarData.points.map((pt, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div 
                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{ backgroundColor: `${currentPillarData.color}20` }}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" style={{ color: currentPillarData.color }} />
                      </div>
                      <span className="text-sm text-slate-300 leading-snug">{pt}</span>
                    </div>
                  ))}
                </div>

                {/* Pricing / Engagement Model Pill */}
                <div className="p-4 rounded-xl bg-black/40 border border-night-line flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 font-mono block">MODALIDAD COMERCIAL</span>
                    <span className="text-sm font-semibold text-white">{currentPillarData.pricingModel}</span>
                  </div>
                  <Link href="/contact">
                    <span 
                      className="px-4 py-2 rounded-lg text-xs font-bold font-mono tracking-wider cursor-pointer transition-all duration-300 flex items-center gap-1.5"
                      style={{ 
                        backgroundColor: currentPillarData.color, 
                        color: '#070B14' 
                      }}
                    >
                      COTIZAR
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                </div>
              </div>

              {/* Right Column: Interactive Demonstrations based on active Pillar */}
              <div className="lg:col-span-6 bg-black/50 border border-night-line/80 rounded-xl p-5 sm:p-6">
                {/* 1. If Pillar 1: Code Ownership & No License Card */}
                {activePillar === 'pilar1' && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between border-b border-night-line pb-3">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-[#47E5C2]" />
                        <span className="text-xs font-mono text-slate-300">propiedad_del_codigo.md</span>
                      </div>
                      <span className="text-xs font-mono text-[#47E5C2] bg-[#47E5C2]/10 px-2 py-0.5 rounded border border-[#47E5C2]/30">
                        100% OPEN SOURCE
                      </span>
                    </div>

                    <div className="font-mono text-xs text-slate-300 space-y-2 bg-night-900 p-4 rounded-lg border border-night-line">
                      <p className="text-slate-400"># Comparativa de Modelo de Licenciamiento:</p>
                      <p className="text-red-400">✗ Plataformas RPA comerciales: licencia anual por cada robot</p>
                      <p className="text-[#47E5C2] font-bold">✓ Enfoque Star Apps: $0 en licencias. Solo pagas las horas de ingeniería.</p>
                      <div className="h-px bg-slate-800 my-2" />
                      <p className="text-slate-400">Stack soportado nativamente:</p>
                      <div className="grid grid-cols-2 gap-2 text-xs pt-1 text-slate-300">
                        <div className="bg-white/5 p-2 rounded border border-night-line">⚡ Python 3.12 (Robocorp / Playwright)</div>
                        <div className="bg-white/5 p-2 rounded border border-night-line">🌐 TypeScript / Node.js & React</div>
                        <div className="bg-white/5 p-2 rounded border border-night-line">🐳 Docker & Docker-Compose</div>
                        <div className="bg-white/5 p-2 rounded border border-night-line">📊 PostgreSQL & Redis Queue</div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-lg bg-[#47E5C2]/5 border border-[#47E5C2]/20 flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-[#47E5C2] shrink-0" />
                      <p className="text-xs text-slate-300">
                        Entregamos repositorio Git completo, manuales To-Be y documentación técnica para que tu equipo interno tenga autonomía absoluta.
                      </p>
                    </div>
                  </div>
                )}

                {/* 2. If Pillar 2: 4-in-1 Interactive Distribution */}
                {activePillar === 'pilar2' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-night-line pb-3">
                      <span className="text-xs font-mono text-slate-300">EXPLORA LAS 4 CATEGORÍAS FLEXIBLES</span>
                      <span className="text-xs font-mono text-[#7DD3FC] bg-[#7DD3FC]/10 px-2 py-0.5 rounded border border-[#7DD3FC]/30">
                        TÚ DECIDES EL %
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {supportCategories.map((cat, idx) => {
                        const isSelected = activeSubcategory === idx;
                        const CatIcon = cat.icon;
                        return (
                          <button
                            key={idx}
                            onClick={() => setActiveSubcategory(idx)}
                            className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                              isSelected
                                ? 'bg-[#7DD3FC]/15 border-[#7DD3FC] text-white'
                                : 'bg-night-900/60 border-night-line text-slate-400 hover:border-slate-700 hover:text-slate-200'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <CatIcon className={`w-4 h-4 ${isSelected ? 'text-[#7DD3FC]' : 'text-slate-400'}`} />
                              <span className="text-xs font-mono uppercase px-1.5 py-0.5 rounded bg-black/40 border border-night-line">
                                {cat.tag}
                              </span>
                            </div>
                            <span className="text-xs font-bold block">{cat.title}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Detailed Active Subcategory Card */}
                    <div className="p-4 rounded-xl bg-night-900 border border-[#7DD3FC]/30 mt-2">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-[#7DD3FC] animate-ping" />
                        <h4 className="text-sm font-semibold text-white">
                          {supportCategories[activeSubcategory].title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {supportCategories[activeSubcategory].desc}
                      </p>
                      <div className="mt-3 pt-2.5 border-t border-night-line flex justify-between items-center text-xs text-slate-400 font-mono">
                        <span>Ejemplo de consumo:</span>
                        <span className="text-[#7DD3FC] font-bold">2 a 5 horas imputadas del plan</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. If Pillar 3: On-Premise vs Cloud Toggle */}
                {activePillar === 'pilar3' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-night-line pb-3">
                      <span className="text-xs font-mono text-slate-300">SIMULADOR DE DESPLIEGUE</span>
                      <div className="flex bg-black p-0.5 rounded-lg border border-night-line">
                        <button
                          onClick={() => setInfraMode('onpremise')}
                          className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                            infraMode === 'onpremise' ? 'bg-[#FFC857] text-black font-bold' : 'text-slate-400'
                          }`}
                        >
                          Tengo Servidores
                        </button>
                        <button
                          onClick={() => setInfraMode('cloud')}
                          className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                            infraMode === 'cloud' ? 'bg-[#FFC857] text-black font-bold' : 'text-slate-400'
                          }`}
                        >
                          No Tengo Hosting
                        </button>
                      </div>
                    </div>

                    {infraMode === 'onpremise' ? (
                      <div className="p-4 rounded-xl bg-night-900 border border-[#FFC857]/30 space-y-3">
                        <div className="flex items-center gap-2">
                          <Server className="w-4 h-4 text-[#FFC857]" />
                          <h4 className="text-sm font-bold text-white">Despliegue On-Premise / Servidores Propios</h4>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Conectamos tus equipos locales (Windows Server, Linux Ubuntu, Raspberry Pi o máquinas virtuales internas).
                          El software corre con demonios <code className="text-[#FFC857] bg-black/60 px-1 py-0.5 rounded">pm2</code> o contenedores Docker.
                        </p>
                        <div className="p-3 bg-black/40 rounded border border-night-line text-xs font-mono text-slate-300 space-y-1">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Cargo de servidores de Star Apps:</span>
                            <span className="text-[#47E5C2] font-bold">$0 / mes</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Seguridad de Datos:</span>
                            <span className="text-white">100% dentro de tu intranet</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-night-900 border border-[#FFC857]/30 space-y-3">
                        <div className="flex items-center gap-2">
                          <CloudRain className="w-4 h-4 text-[#FFC857]" />
                          <h4 className="text-sm font-bold text-white">Cloud Dedicado y Gestionado por Star Apps</h4>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Aprovisionamos servidores optimizados en AWS, DigitalOcean o Azure. Nosotros gestionamos parches, cortafuegos y balanceo de carga.
                        </p>
                        <div className="p-3 bg-black/40 rounded border border-night-line text-xs font-mono text-slate-300 space-y-1">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Facturación:</span>
                            <span className="text-[#FFC857] font-bold">Consolidada en 1 sola factura</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Monitoreo:</span>
                            <span className="text-white">24/7 con alertas automáticas</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="text-xs text-slate-400 font-mono text-center">
                      * En ambos escenarios el código fuente sigue siendo 100% propiedad del cliente.
                    </div>
                  </div>
                )}

                {/* 4. If Pillar 4: Modular Change Control Lifecycle */}
                {activePillar === 'pilar4' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-night-line pb-3">
                      <span className="text-xs font-mono text-slate-300">CICLO DE CONTROL DE CAMBIOS</span>
                      <span className="text-xs font-mono text-[#A5B4FC] bg-[#A5B4FC]/10 px-2 py-0.5 rounded border border-[#A5B4FC]/30">
                        MÉTODO ÁGIL
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      <div className="flex items-start gap-3 p-2.5 rounded bg-night-900 border border-night-line">
                        <div className="w-6 h-6 rounded-full bg-[#A5B4FC]/20 text-[#A5B4FC] flex items-center justify-center text-xs font-mono font-bold shrink-0">
                          1
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-white">Detección de Nueva Lógica</h5>
                          <p className="text-xs text-slate-400">Si un requerimiento altera el alcance inicial, se clasifica como Incremento para no distorsionar tu soporte mensual.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-2.5 rounded bg-night-900 border border-night-line">
                        <div className="w-6 h-6 rounded-full bg-[#A5B4FC]/20 text-[#A5B4FC] flex items-center justify-center text-xs font-mono font-bold shrink-0">
                          2
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-white">Estimación & Hito Acotado</h5>
                          <p className="text-xs text-slate-400">Definimos fechas de entrega, impacto en sistemas actuales y presupuesto cerrado.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-2.5 rounded bg-night-900 border border-night-line">
                        <div className="w-6 h-6 rounded-full bg-[#A5B4FC]/20 text-[#A5B4FC] flex items-center justify-center text-xs font-mono font-bold shrink-0">
                          3
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-white">Despliegue Sin Interrupción</h5>
                          <p className="text-xs text-slate-400">El nuevo módulo se acopla al pipeline existente mediante contenedores o microservicios sin detener la operación diaria.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default PillarsSection;
