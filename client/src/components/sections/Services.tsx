import { useState, useEffect, ReactNode } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  Globe, 
  Server, 
  Database, 
  BookOpen, 
  ArrowRight, 
  ShieldCheck, 
  HelpCircle, 
  Layers, 
  Coins, 
  ClipboardList, 
  RefreshCw, 
  XCircle, 
  Check 
} from 'lucide-react';

interface ServiceItem {
  id: string;
  icon: ReactNode;
  title: string;
  color: string;
  shortDesc: { en: string; es: string };
}

// -------------------------------------------------------------
// Interactive Simulators for each Service Category
// -------------------------------------------------------------

// 1. RPA & Automation Simulator
const RpaSimulator = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [running, setRunning] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!running) return;
    const messages = [
      '⚡ [SYS] Iniciando Orquestador RPA Star Apps...',
      '🔍 [DISCOVERY] Leyendo configuración de SAP ERP...',
      '🔑 [AUTH] Autenticación cifrada AES-256... [OK]',
      '🌐 [NAV] Abriendo sesión en portal de facturación ERP...',
      '📥 [DATA] Buscando nuevos documentos sin procesar...',
      '📊 [ETL] Encontrados 84 registros. Extrayendo campos...',
      '💾 [DB] Guardando datos estructurados en PostgreSQL...',
      '📈 [BI] Actualizando dataset en Microsoft Power BI...',
      '🚀 [RPA] Ejecución completada. Estado: 100% OK, 0 Errores.',
    ];
    setLogs([messages[0]]);
    setProgress(10);
    
    let index = 0;
    const interval = setInterval(() => {
      index++;
      if (index < messages.length) {
        setLogs(prev => [...prev, messages[index]]);
        setProgress(Math.round(((index + 1) / messages.length) * 100));
      } else {
        clearInterval(interval);
        setRunning(false);
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [running]);

  return (
    <div className="flex flex-col h-full justify-between p-4 font-mono text-[11px] md:text-xs text-[#00FFC8] bg-gray-950/80 rounded-lg">
      {/* Visual Pipeline */}
      <div className="flex justify-between items-center bg-black/40 p-2.5 rounded border border-gray-800 mb-3">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-gray-950 border border-gray-700 flex items-center justify-center text-gray-400 font-sans font-bold">SAP</div>
          <span className="text-[9px] text-gray-500 mt-1">Origen</span>
        </div>
        <div className="flex-1 px-3 relative">
          <div className="h-[2px] bg-gray-800 w-full" />
          {running && (
            <motion.div 
              className="absolute top-1/2 left-0 w-2 h-2 rounded-full bg-[#00FFC8] -translate-y-1/2 shadow-[0_0_8px_#00FFC8]"
              animate={{ left: ['0%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          )}
        </div>
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-gray-950 border border-[#00FFC8]/40 flex items-center justify-center text-[#00FFC8]">
            <Cpu className="w-4 h-4 text-[#00FFC8] animate-spin-slow" />
          </div>
          <span className="text-[9px] text-[#00FFC8] mt-1">Bot</span>
        </div>
        <div className="flex-1 px-3 relative">
          <div className="h-[2px] bg-gray-800 w-full" />
          {running && (
            <motion.div 
              className="absolute top-1/2 left-0 w-2 h-2 rounded-full bg-[#6B38FB] -translate-y-1/2 shadow-[0_0_8px_#6B38FB]"
              animate={{ left: ['0%', '100%'] }}
              transition={{ duration: 2, delay: 1, repeat: Infinity, ease: 'linear' }}
            />
          )}
        </div>
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-gray-950 border border-gray-750 flex items-center justify-center text-[#FF9500]">
            <Database className="w-4 h-4 text-[#FF9500]" />
          </div>
          <span className="text-[9px] text-gray-500 mt-1">Destino</span>
        </div>
      </div>

      {/* Terminal log output */}
      <div className="flex-1 bg-black/85 rounded p-3 border border-gray-850 overflow-y-auto max-h-[130px] space-y-1 text-left min-h-[110px] shadow-inner">
        {logs.map((log, i) => (
          <div 
            key={i} 
            className={
              log.includes('[SUCCESS]') || log.includes('[RPA]') 
                ? 'text-white font-bold' 
                : log.includes('[SYS]') 
                ? 'text-gray-400' 
                : 'text-[#00FFC8]'
            }
          >
            {log}
          </div>
        ))}
      </div>

      {/* Control bar */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-850">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${running ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-[10px] text-gray-400 font-sans">{running ? `EJECUTANDO - ${progress}%` : 'COMPLETADO'}</span>
        </div>
        <button 
          onClick={() => { setLogs([]); setRunning(true); setProgress(0); }}
          className="px-2.5 py-1 text-[10px] font-sans font-bold bg-[#00FFC8]/10 border border-[#00FFC8] rounded text-[#00FFC8] hover:bg-[#00FFC8]/25 transition active:scale-95"
        >
          Reiniciar Bot
        </button>
      </div>
    </div>
  );
};

// 2. AI Agent Simulator
const AiAgentSimulator = () => {
  const [messages, setMessages] = useState<{ sender: 'user' | 'agent'; text: string; type?: string }[]>([]);
  const [typing, setTyping] = useState(false);
  const [kpis, setKpis] = useState({ tokensSec: 154, cost: 0.0000 });

  const conversation: { sender: 'user' | 'agent'; text: string; type?: string }[] = [
    { sender: 'user', text: 'Analiza los últimos correos y extrae el sentimiento general junto con las tareas pendientes.' },
    { sender: 'agent', text: 'Pensamiento: Iniciando agente analista de correos. Recuperando los últimos 5 mensajes desde Gmail API...', type: 'thought' },
    { sender: 'agent', text: 'Acción: list_emails(query="label:unread") -> Retornados 5 correos.', type: 'action' },
    { sender: 'agent', text: 'Pensamiento: Analizando contenido de los correos para clasificación de sentimiento y extracción de tareas mediante Gemini Pro...', type: 'thought' },
    { sender: 'agent', text: 'Resultado del análisis:\n\n1. Soporte: Molestia por demora en entrega. Sentimiento: Negativo. Tarea: Contactar cliente urgentemente.\n2. Ventas: Cotización aprobada. Sentimiento: Positivo. Tarea: Enviar contrato.\n3. Proveedor: Retraso de insumos. Sentimiento: Neutro. Tarea: Re-agendar hitos.\n\nKPIs Actualizados: Sentimiento Promedio = 62% Positivo, Pendientes = 3.', type: 'response' }
  ];

  useEffect(() => {
    setMessages([conversation[0]]);
    setTyping(true);
    setKpis({ tokensSec: 0, cost: 0 });
    
    let step = 1;
    const interval = setInterval(() => {
      if (step < conversation.length) {
        const currentStep = step;
        setMessages(prev => [...prev, conversation[currentStep]]);
        setKpis({
          tokensSec: Math.floor(140 + Math.random() * 20),
          cost: parseFloat((0.00015 * currentStep).toFixed(5))
        });
        step++;
      } else {
        clearInterval(interval);
        setTyping(false);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full justify-between p-4 font-mono text-[11px] md:text-xs text-[#FF2D55] bg-gray-950/80 rounded-lg">
      {/* Node Network Visualizer */}
      <div className="h-10 flex items-center justify-around bg-black/45 border border-gray-800 rounded mb-3 px-4 relative overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div 
            key={i} 
            className="w-2 h-2 rounded-full bg-[#FF2D55]/60 z-10"
            animate={typing ? {
              scale: [1, 1.4, 1],
              backgroundColor: ['#FF2D55', '#6B38FB', '#FF2D55']
            } : {}}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.25 }}
          />
        ))}
        {/* Animated connecting canvas background */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FF2D55]/5 to-transparent pointer-events-none" />
      </div>

      {/* Terminal log output */}
      <div className="flex-1 bg-black/85 rounded p-3 border border-gray-850 overflow-y-auto max-h-[130px] space-y-2 text-left min-h-[110px]">
        {messages.filter(Boolean).map((msg, i) => (
          <div key={i} className={`rounded px-2 py-1 leading-relaxed ${
            msg.sender === 'user' 
              ? 'bg-[#121212] border border-gray-850 text-gray-300' 
              : msg.type === 'thought'
              ? 'text-gray-500 italic text-[10px]'
              : msg.type === 'action'
              ? 'text-[#6B38FB]'
              : 'text-white border-l-2 border-[#FF2D55] pl-2'
          }`}>
            <span className="text-[8px] block text-gray-500 uppercase tracking-wider mb-0.5">
              {msg.sender === 'user' ? 'Cliente' : 'Agente IA'}
            </span>
            <span className="whitespace-pre-wrap">{msg.text}</span>
          </div>
        ))}
        {typing && <span className="inline-block animate-pulse text-[#FF2D55] text-[10px]">▋ IA pensando...</span>}
      </div>

      {/* Control bar */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-850 text-[10px] text-gray-400 font-sans">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${typing ? 'bg-pink-500 animate-pulse' : 'bg-gray-600'}`} />
          <span>INFERENCIA: {typing ? `${kpis.tokensSec} tok/s` : 'OK'}</span>
        </div>
        <div>COSTO: ${kpis.cost} USD</div>
      </div>
    </div>
  );
};

// 3. Full Stack Web Dev Simulator
const FullStackSimulator = () => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [users, setUsers] = useState(1482);
  const [chartMetric, setChartMetric] = useState<'users' | 'revenue'>('users');

  const containerWidths = {
    desktop: 'w-full',
    tablet: 'w-3/4 border-x border-dashed border-gray-700',
    mobile: 'w-[180px] md:w-[200px] border-x border-dashed border-gray-700'
  };

  return (
    <div className="flex flex-col h-full justify-between p-3 text-white bg-gray-950/80 rounded-lg">
      {/* Device frame controls */}
      <div className="flex justify-between items-center border-b border-gray-850 pb-2 mb-2">
        <span className="text-[9px] uppercase font-['Orbitron'] tracking-wider text-gray-500">Vista de Dispositivo</span>
        <div className="flex space-x-1 bg-black p-0.5 rounded border border-gray-850">
          {(['desktop', 'tablet', 'mobile'] as const).map(d => (
            <button
              key={d}
              onClick={() => setDevice(d)}
              className={`px-1.5 py-0.5 rounded text-[8px] font-sans font-bold capitalize transition ${
                device === d ? 'bg-[#FF9500] text-black shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Mini App Screen */}
      <div className="flex-1 flex items-center justify-center overflow-hidden min-h-[130px] bg-black/30 rounded p-1">
        <motion.div 
          className={`h-full bg-[#151515] rounded border border-gray-800 flex flex-col p-2 transition-all duration-300 ${containerWidths[device]}`}
          layout
        >
          {/* Mock App Header */}
          <div className="flex justify-between items-center border-b border-gray-850 pb-1 mb-1.5">
            <span className="text-[7px] font-['Orbitron'] font-bold text-[#FF9500]">STAR_DASH</span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#FF9500]/70" />
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-2 gap-1 mb-1.5">
            <button 
              onClick={() => setChartMetric('users')}
              className={`p-1 rounded border text-left transition select-none ${
                chartMetric === 'users' ? 'border-[#FF9500] bg-[#FF9500]/5' : 'border-gray-850 bg-gray-900/40'
              }`}
            >
              <span className="text-[6px] text-gray-500 block">Clientes</span>
              <span className="text-[9px] font-bold text-white">{users}</span>
            </button>
            <button 
              onClick={() => setChartMetric('revenue')}
              className={`p-1 rounded border text-left transition select-none ${
                chartMetric === 'revenue' ? 'border-[#FF9500] bg-[#FF9500]/5' : 'border-gray-850 bg-gray-900/40'
              }`}
            >
              <span className="text-[6px] text-gray-500 block">Ventas</span>
              <span className="text-[9px] font-bold text-white">$4.9K</span>
            </button>
          </div>

          {/* Simple Vector Chart bar simulation */}
          <div className="flex-1 bg-gray-950 rounded p-1 flex items-end justify-between gap-1 border border-gray-850 min-h-[35px]">
            {chartMetric === 'users' ? (
              <>
                <motion.div className="bg-[#FF9500] w-full rounded-t" initial={{ height: 0 }} animate={{ height: '35%' }} transition={{ duration: 0.3 }} style={{ maxHeight: '100%' }} />
                <motion.div className="bg-[#FF9500] w-full rounded-t" initial={{ height: 0 }} animate={{ height: '65%' }} transition={{ duration: 0.3 }} style={{ maxHeight: '100%' }} />
                <motion.div className="bg-[#FF9500] w-full rounded-t" initial={{ height: 0 }} animate={{ height: '45%' }} transition={{ duration: 0.3 }} style={{ maxHeight: '100%' }} />
                <motion.div className="bg-[#FF9500] w-full rounded-t" initial={{ height: 0 }} animate={{ height: '85%' }} transition={{ duration: 0.3 }} style={{ maxHeight: '100%' }} />
              </>
            ) : (
              <>
                <motion.div className="bg-[#00FFC8] w-full rounded-t" initial={{ height: 0 }} animate={{ height: '20%' }} transition={{ duration: 0.3 }} style={{ maxHeight: '100%' }} />
                <motion.div className="bg-[#00FFC8] w-full rounded-t" initial={{ height: 0 }} animate={{ height: '50%' }} transition={{ duration: 0.3 }} style={{ maxHeight: '100%' }} />
                <motion.div className="bg-[#00FFC8] w-full rounded-t" initial={{ height: 0 }} animate={{ height: '75%' }} transition={{ duration: 0.3 }} style={{ maxHeight: '100%' }} />
                <motion.div className="bg-[#00FFC8] w-full rounded-t" initial={{ height: 0 }} animate={{ height: '95%' }} transition={{ duration: 0.3 }} style={{ maxHeight: '100%' }} />
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* Control Panel Footer */}
      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-gray-850 text-[9px] text-gray-500">
        <span>Prueba Interactiva: Alterna pestañas</span>
        <button 
          onClick={() => setUsers(prev => prev + 1)}
          className="text-[#FF9500] font-bold hover:underline select-none"
        >
          + Agregar Cliente
        </button>
      </div>
    </div>
  );
};

// 4. Web Scraping / Data Engineering Simulator
const DataScrapingSimulator = () => {
  const [records, setRecords] = useState(1280450);
  const [speed, setSpeed] = useState(1420);

  useEffect(() => {
    const interval = setInterval(() => {
      const increment = Math.floor(5 + Math.random() * 15);
      setRecords(prev => prev + increment);
      setSpeed(Math.floor(1300 + Math.random() * 250));
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full justify-between p-4 font-mono text-[11px] md:text-xs text-[#6B38FB] bg-gray-950/80 rounded-lg">
      {/* Visual Funnel ETL Animation */}
      <div className="relative h-16 bg-black/45 border border-gray-850 rounded flex items-center justify-between px-6 overflow-hidden mb-3">
        {/* Source Nodes */}
        <div className="flex flex-col gap-1 z-10">
          <div className="px-1 py-0.5 rounded bg-gray-900 border border-gray-700 text-[7px] text-gray-400">Web sites</div>
          <div className="px-1 py-0.5 rounded bg-gray-900 border border-gray-700 text-[7px] text-gray-400">SAP / ERP</div>
        </div>

        {/* Funnel SVG Icon */}
        <div className="w-10 h-10 flex items-center justify-center bg-gray-950 border border-[#6B38FB]/30 rounded-full relative z-10 shadow-lg">
          <Database className="w-5 h-5 text-[#6B38FB] animate-pulse" />
        </div>

        {/* Output */}
        <div className="flex flex-col items-center z-10">
          <div className="px-1.5 py-0.5 rounded bg-[#6B38FB]/10 border border-[#6B38FB] text-[8px] text-white font-bold">SQL / DW</div>
        </div>

        {/* Running particles */}
        <motion.div 
          className="absolute w-1.5 h-1.5 rounded-full bg-[#6B38FB] shadow-[0_0_6px_#6B38FB]"
          animate={{
            x: [30, 110, 210],
            y: [15, 30, 30],
            opacity: [0, 1, 1, 0]
          }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div 
          className="absolute w-1 h-1 rounded-full bg-[#00FFC8] shadow-[0_0_6px_#00FFC8]"
          animate={{
            x: [30, 110, 210],
            y: [45, 30, 30],
            opacity: [0, 1, 1, 0]
          }}
          transition={{ duration: 1.8, delay: 0.9, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Structured metrics display */}
      <div className="flex-1 bg-black/85 border border-gray-850 rounded p-3 flex flex-col justify-center gap-1.5 shadow-inner">
        <div>
          <span className="text-[8px] text-gray-500 uppercase tracking-wider block">Registros Indexados</span>
          <span className="text-lg md:text-xl font-bold font-['Orbitron'] text-white">
            {records.toLocaleString('es-CL')}
          </span>
        </div>
        <div className="flex justify-between items-center text-[9px] border-t border-gray-850 pt-1.5 text-gray-400">
          <span>ETL Speed: <b className="text-white">{speed} filas/s</b></span>
          <span className="text-[#00FFC8] font-bold">Base de Datos: ONLINE</span>
        </div>
      </div>

      {/* Control bar */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-850 text-[10px] text-gray-500 font-sans">
        <span>Infraestructura AWS/Redshift</span>
        <span className="text-[#6B38FB] font-bold">Duplicados Depurados [OK]</span>
      </div>
    </div>
  );
};

// 5. Cloud Consulting & Architecture Simulator
const ConsultingSimulator = () => {
  const [selectedNode, setSelectedNode] = useState<'client' | 'gateway' | 'backend' | 'db'>('client');

  const nodeInfo = {
    client: {
      title: 'Cliente (App Web / Mobile)',
      desc: 'Interfaz de usuario moderna en React/TS con renderizado fluido, comunicación segura HTTPS/WSS y carga diferida (lazy loading).',
      latency: 'RTT: 15ms'
    },
    gateway: {
      title: 'API Gateway / Cloudflare',
      desc: 'Orquestación de tráfico, balanceo de carga global, caché CDN perimetral, firewall WAF corporativo y mitigación de DDoS.',
      latency: 'Filtro WAF: <1ms'
    },
    backend: {
      title: 'Serverless Backend',
      desc: 'Microservicios en Python/NodeJS escalables horizontalmente de forma automática. Conectado a colas de mensajería y APIs de IA.',
      latency: 'Cómputo: 45ms'
    },
    db: {
      title: 'PostgreSQL / Supabase DB',
      desc: 'Base de datos optimizada en la nube. Réplicas de lectura, índices eficientes y backups automáticos.',
      latency: 'Query: 4ms'
    }
  };

  return (
    <div className="flex flex-col h-full justify-between p-3 text-white bg-gray-950/80 rounded-lg">
      {/* Node Interactive Map */}
      <div className="h-16 bg-black/60 border border-gray-850 rounded flex items-center justify-around px-2 relative mb-2.5">
        {(['client', 'gateway', 'backend', 'db'] as const).map(node => (
          <button
            key={node}
            onClick={() => setSelectedNode(node)}
            className={`w-9 h-9 rounded-lg flex items-center justify-center font-['Orbitron'] font-extrabold text-[9px] border transition select-none ${
              selectedNode === node 
                ? 'bg-[#00FFC8] text-black border-[#00FFC8] shadow-lg shadow-[#00FFC8]/25' 
                : 'bg-gray-900 text-gray-400 border-gray-800 hover:border-gray-700'
            }`}
          >
            {node === 'client' && 'CLI'}
            {node === 'gateway' && 'GW'}
            {node === 'backend' && 'API'}
            {node === 'db' && 'DB'}
          </button>
        ))}
        {/* Connection arrow labels */}
        <div className="absolute inset-x-0 bottom-1 text-center text-[7px] text-gray-500 pointer-events-none uppercase tracking-wider">
          Haz clic en un nodo para auditar
        </div>
      </div>

      {/* Node Description Details Card */}
      <div className="flex-1 bg-black/85 border border-gray-850 rounded p-2.5 text-left">
        <div className="flex justify-between items-center border-b border-gray-850 pb-1 mb-1.5">
          <h4 className="text-[10px] font-bold font-['Orbitron'] text-[#00FFC8]">
            {nodeInfo[selectedNode].title}
          </h4>
          <span className="font-mono text-[8px] text-gray-500 bg-gray-900 border border-gray-800 px-1 rounded">
            {nodeInfo[selectedNode].latency}
          </span>
        </div>
        <p className="text-[10px] leading-relaxed text-gray-300">
          {nodeInfo[selectedNode].desc}
        </p>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between mt-2 pt-1.5 text-[9px] text-gray-500 border-t border-gray-850">
        <span>DIAGRAMA DE ARQUITECTURA</span>
        <span className="text-[#00FFC8] font-bold">DISPONIBILIDAD: 99.9%</span>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Main Services Component
// -------------------------------------------------------------

const Services = () => {
  const { t, language } = useLanguage();
  const [activeServiceId, setActiveServiceId] = useState<string>('automation');
  
  // Hardcoded service items for each language since the i18n system isn't returning arrays properly
  const serviceItemsContent = {
    automation: {
      en: [
        'RPA solutions for real-time monitoring',
        'Automation of SAP transactions and ERPs',
        'ETL report optimization with Power BI',
        'Hardware maintenance automation (Fracttal)'
      ],
      es: [
        'Soluciones RPA para monitoreo en tiempo real',
        'Automatización de transacciones en SAP y ERPs',
        'Optimización de reportes ETL con Power BI',
        'Automatización de mantenimiento (Fracttal)'
      ]
    },
    webdev: {
      en: [
        'Modern web applications with React & TypeScript',
        'Interactive dashboards for data visualization',
        'Payment integration, authentication, and security',
        '100% responsive and cloud-ready architecture'
      ],
      es: [
        'Aplicaciones web modernas con React y TypeScript',
        'Dashboards interactivos para visualización de datos',
        'Integración de pagos, autenticación y seguridad',
        'Arquitectura 100% responsive y cloud-ready'
      ]
    },
    backend: {
      en: [
        'Development of custom Intelligent Agents (Gemini/GPT)',
        'Workflow automation with generative AI',
        'Natural Language Processing (NLP) model integration',
        'Specialized virtual assistants for businesses'
      ],
      es: [
        'Desarrollo de Agentes Inteligentes personalizados (Gemini/GPT)',
        'Automatización de flujos de trabajo con IA generativa',
        'Integración de modelos de procesamiento de lenguaje natural (NLP)',
        'Asistentes virtuales especializados para empresas'
      ]
    },
    webscraping: {
      en: [
        'Massive data extraction (Scalable Web Scraping)',
        'Processing and cleaning of millions of records',
        'Data infrastructure on AWS / GCP / Supabase',
        'Database architecture for Data Science'
      ],
      es: [
        'Extracción masiva de datos (Web Scraping escalable)',
        'Flujos de procesamiento y limpieza de millones de registros',
        'Infraestructura de datos en AWS / GCP / Supabase',
        'Arquitectura de bases de datos para Data Science'
      ]
    },
    consulting: {
      en: [
        'Cloud solution architecture',
        'Technical mentoring and programming training',
        'Operational industrial process optimization'
      ],
      es: [
        'Arquitectura de soluciones en la nube',
        'Mentoría técnica y formación en programación',
        'Optimización de procesos operativos industriales'
      ]
    }
  };
  
  // Proposal detailed structure content by language
  const proposalContent = {
    en: {
      subtitle: 'A professional framework designed to maximize cost efficiency, technology transfer, and code sovereignty.',
      
      // Methodology
      methodology_title: '3. Implementation Methodology',
      methodology_subtitle: 'Agile mapping, structured design, and seamless operational deployment.',
      methodology: [
        {
          phase: 'Phase 1',
          title: 'Agile Discovery',
          desc: 'One-on-one diagnostic sessions to map workflows and define immediate Quick Wins.',
          color: '#00FFC8'
        },
        {
          phase: 'Phase 2',
          title: 'Design & Integration',
          desc: 'Modeling of interoperable systems with your primary systems (SAP, Excel, Web Portals).',
          color: '#6B38FB'
        },
        {
          phase: 'Phase 3',
          title: 'Deployment',
          desc: 'Structured deployment and comprehensive testing ensuring full business operational continuity.',
          color: '#FF2D55'
        }
      ],

      // Comparison table
      compare_title: 'Traditional Model vs. Star Apps Approach',
      compare_subtitle: 'Compare how our open model optimizes your costs and gives you complete control.',
      compare_headers: ['Concept', 'Traditional Corporate Vendor', 'Our Open Approach'],
      compare_rows: [
        {
          label: 'Software Licenses',
          trad: 'Mandatory recurring annual fees ($4,000+ USD per bot)',
          our: '$0 in licenses. Native open-source code.'
        },
        {
          label: 'Support Pools',
          trad: 'Rigid hourly contracts with monthly expiration (use it or lose it)',
          our: 'Roll-over, flexible cumulative hours. Fair billing.'
        },
        {
          label: 'Code Sovereignty',
          trad: 'Vendor-owned. Perpetual technical dependence (Vendor Lock-in)',
          our: 'Client-owned source code. Transparent, auditable, and editable.'
        },
        {
          label: 'Cloud & AI Costs',
          trad: 'High markup margins on cloud compute or APIs (OpenAI/AWS)',
          our: 'Direct billing to the client at actual provider rates.'
        },
        {
          label: 'Travel Costs',
          trad: 'Additional travel and lodging fees included in the invoice',
          our: 'Digitally structured remote work. $0 hidden charges.'
        }
      ],

      // Additional blocks
      blocks: [
        {
          title: '1. Context & Challenge',
          desc: 'We understand your operation from end to end. We identify bottlenecks and redundant tasks that slow down your team\'s productivity to automate them.',
          icon: <HelpCircle className="w-8 h-8 text-[#FF9500]" />,
          color: '#FF9500'
        },
        {
          title: '2. Open Source Solution',
          desc: 'Custom solutions 100% free of annual software licenses from third parties. The client is the exclusive owner of the code; the only recurring costs are the actual usage of cloud servers or AI APIs.',
          icon: <Layers className="w-8 h-8 text-[#00FFC8]" />,
          color: '#00FFC8'
        },
        {
          title: '4. Transparency & Assumptions',
          desc: 'Clear scope boundaries and access requirements from the start of development. No unexpected "exclusions" or extra charges due to missing software modules.',
          icon: <ClipboardList className="w-8 h-8 text-[#6B38FB]" />,
          color: '#6B38FB'
        },
        {
          title: '5. Fair Continuous Support',
          desc: 'Monitoring, maintenance, and rapid recovery from incidents through flexible support pools and pay-per-use. Unused support hours roll over, with no abusive penalties.',
          icon: <RefreshCw className="w-8 h-8 text-[#FF2D55]" />,
          color: '#FF2D55'
        },
        {
          title: '6. Milestone Investment',
          desc: 'Transparent budget segmented by milestones (Kick-off, Delivery, Production). $0 licensing costs. Cloud server costs billed at actual provider rates.',
          icon: <Coins className="w-8 h-8 text-[#00FFC8]" />,
          color: '#00FFC8'
        },
        {
          title: '7. Assured Guarantee',
          desc: '3 to 6-month technical guarantee. By delivering open and documented source code, your technical team can audit, modify, and scale it in the future independently.',
          icon: <ShieldCheck className="w-8 h-8 text-[#FF9500]" />,
          color: '#FF9500'
        }
      ]
    },
    es: {
      subtitle: 'Un marco de trabajo profesional diseñado para maximizar la rentabilidad, la transferencia tecnológica y la soberanía del código.',
      
      // Methodology
      methodology_title: '3. Metodología de Implementación',
      methodology_subtitle: 'Mapeo ágil, diseño de sistemas y despliegue sin interrupciones operativas.',
      methodology: [
        {
          phase: 'Fase 1',
          title: 'Mapeo Ágil (Discovery)',
          desc: 'Sesiones de diagnóstico uno a uno para levantar flujos y definir Quick Wins inmediatos.',
          color: '#00FFC8'
        },
        {
          phase: 'Fase 2',
          title: 'Diseño e Integración',
          desc: 'Modelado de sistemas interoperables con tus plataformas de cabecera (SAP, Excel, Portales web).',
          color: '#6B38FB'
        },
        {
          phase: 'Fase 3',
          title: 'Puesta en Marcha',
          desc: 'Despliegue ordenado y pruebas exhaustivas garantizando continuidad operativa total.',
          color: '#FF2D55'
        }
      ],

      // Comparison table
      compare_title: 'Modelo Tradicional vs. Enfoque Star Apps',
      compare_subtitle: 'Compara cómo nuestro modelo abierto optimiza tus costos y te entrega control total.',
      compare_headers: ['Concepto', 'Proveedor Corporativo Tradicional', 'Nuestro Enfoque Abierto'],
      compare_rows: [
        {
          label: 'Licencias de Software',
          trad: 'Anualidades recurrentes obligatorias ($4,000+ USD por bot)',
          our: '$0 en licencias. Código abierto nativo.'
        },
        {
          label: 'Bolsas de Soporte',
          trad: 'Contratos rígidos de horas no transferibles (si no se usan, se pierden)',
          our: 'Horas flexibles acumulativas y transferibles. Pago justo.'
        },
        {
          label: 'Soberanía del Código',
          trad: 'Propiedad del proveedor. Dependencia técnica de por vida (Vendor Lock-in)',
          our: 'Código fuente del cliente. Transparente, auditable y modificable.'
        },
        {
          label: 'Costos de Nube e IA',
          trad: 'Márgenes de reventa elevados sobre cómputo o APIs (OpenAI/AWS)',
          our: 'Facturación directa al cliente a tarifa real de consumo de proveedor.'
        },
        {
          label: 'Costos de Traslado',
          trad: 'Cargos adicionales de transporte y alojamiento incluidos en factura',
          our: 'Trabajo remoto y digitalmente estructurado. $0 cargos ocultos.'
        }
      ],

      // Additional blocks
      blocks: [
        {
          title: '1. Contexto y Desafío',
          desc: 'Entendemos tu operación de punta a punta. Identificamos los cuellos de botella y las tareas redundantes que frenan la productividad de tu equipo para automatizarlas.',
          icon: <HelpCircle className="w-8 h-8 text-[#FF9500]" />,
          color: '#FF9500'
        },
        {
          title: '2. Solución Open Source',
          desc: 'Soluciones a la medida 100% libres de licencias anuales de software de terceros. El cliente es dueño exclusivo del código; los únicos costos recurrentes son los consumos puros de servidores nube o APIs de IA.',
          icon: <Layers className="w-8 h-8 text-[#00FFC8]" />,
          color: '#00FFC8'
        },
        {
          title: '4. Transparencia y Supuestos',
          desc: 'Límites claros del alcance y requerimientos de accesos desde el inicio del desarrollo. No habrá "exclusiones" inesperadas ni cobros adicionales por carencia de módulos de software.',
          icon: <ClipboardList className="w-8 h-8 text-[#6B38FB]" />,
          color: '#6B38FB'
        },
        {
          title: '5. Soporte Continuo Justo',
          desc: 'Monitoreo, mantenimiento y recuperación rápida de incidentes mediante bolsas de soporte flexibles y pago por consumo. Las horas de soporte sin utilizar se transfieren, sin penalizaciones.',
          icon: <RefreshCw className="w-8 h-8 text-[#FF2D55]" />,
          color: '#FF2D55'
        },
        {
          title: '6. Inversión Comercial por Hitos',
          desc: 'Presupuesto transparente segmentado por hitos (Kick-off, Entrega, Producción). Licenciamiento a costo $0. Costos de servidores en la nube a valor real de consumo directo.',
          icon: <Coins className="w-8 h-8 text-[#00FFC8]" />,
          color: '#00FFC8'
        },
        {
          title: '7. Garantía Asegurada',
          desc: 'Garantía técnica de 3 a 6 meses. Al entregarse código fuente abierto y documentado, tu equipo técnico podrá auditarlo, modificarlo y escalarlo en el futuro de forma independiente.',
          icon: <ShieldCheck className="w-8 h-8 text-[#FF9500]" />,
          color: '#FF9500'
        }
      ]
    }
  };

  const proposal = proposalContent[language as keyof typeof proposalContent];

  // Service categories with their corresponding icons
  const services: ServiceItem[] = [
    {
      id: 'automation',
      icon: <Cpu className="w-8 h-8" />,
      title: t('services.automation.title'),
      color: '#00FFC8',
      shortDesc: {
        en: 'Robotic Process Automation mapping real-time triggers to legacy platforms like SAP or custom APIs.',
        es: 'Modelado y diseño de robots RPA conectados en tiempo real a ERPs heredados (SAP) o plataformas locales.'
      }
    },
    {
      id: 'backend',
      icon: <Server className="w-8 h-8" />,
      title: t('services.backend.title'),
      color: '#FF2D55',
      shortDesc: {
        en: 'Custom Intelligent Agents deploying open LLM models for cognitive corporate document routing.',
        es: 'Integración y tuning de modelos LLM (Gemini, Llama) para desplegar agentes autónomos y análisis cognitivo.'
      }
    },
    {
      id: 'webdev',
      icon: <Globe className="w-8 h-8" />,
      title: t('services.webdev.title'),
      color: '#FF9500',
      shortDesc: {
        en: 'High-performance React full stack dashboards with real-time reactive charting.',
        es: 'Desarrollo frontend React/TS y backend serverless con dashboards interactivos y telemetría de datos.'
      }
    },
    {
      id: 'webscraping',
      icon: <Database className="w-8 h-8" />,
      title: t('services.webscraping.title'),
      color: '#6B38FB',
      shortDesc: {
        en: 'Automated ETL processing streams parsing millions of raw files into secure target databases.',
        es: 'Pipelines masivos de web scraping y flujos ETL para procesar e indexar millones de registros sin fallas.'
      }
    },
    {
      id: 'consulting',
      icon: <BookOpen className="w-8 h-8" />,
      title: t('services.consulting.title'),
      color: '#00FFC8',
      shortDesc: {
        en: 'Digital architecture reviews to transition workflows into cost-effective open source tools.',
        es: 'Auditoría y diseño de arquitecturas en la nube para migrar sistemas propietarios hacia código abierto.'
      }
    }
  ];

  return (
    <section id="services" className="py-20 bg-[#151515] relative overflow-hidden">
      {/* Visual Hex Background Overlay */}
      <div className="absolute inset-0 hex-pattern opacity-[0.02] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-['Orbitron'] font-bold text-white mb-4 uppercase tracking-wider">
            {t('services.title')}
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-xs md:text-sm">
            {language === 'es' 
              ? 'Haz clic en cada servicio para ver su simulador de funcionamiento en tiempo real.'
              : 'Click on each service to interact with its live functional simulator.'}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#00FFC8] to-[#6B38FB] mx-auto mt-4"></div>
        </motion.div>
        
        {/* Interactive Services Console Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24 items-stretch">
          
          {/* Left Column: Interactive Cards Selection (5 Columns span) */}
          <div className="lg:col-span-5 flex flex-col space-y-4 justify-between">
            {services.map((service) => {
              const isActive = activeServiceId === service.id;
              
              return (
                <motion.div
                  key={service.id}
                  onClick={() => setActiveServiceId(service.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 relative overflow-hidden ${
                    isActive 
                      ? 'bg-[#1e1e1e] shadow-lg border-opacity-100' 
                      : 'bg-[#181818]/60 hover:bg-[#1e1e1e]/40 border-opacity-20 hover:border-opacity-40'
                  }`}
                  style={{ 
                    borderColor: service.color,
                    boxShadow: isActive ? `0 0 15px ${service.color}15` : 'none'
                  }}
                  whileHover={{ x: 5 }}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div 
                      className="p-2 rounded-lg transition-colors"
                      style={{ 
                        backgroundColor: isActive ? `${service.color}15` : 'transparent',
                        color: service.color
                      }}
                    >
                      {service.icon}
                    </div>
                    <div>
                      <h3 className="font-['Orbitron'] font-bold text-sm md:text-base text-white flex items-center">
                        {service.title}
                        {isActive && (
                          <span className="ml-2 w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                        )}
                      </h3>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 text-xs leading-relaxed pl-12 pr-4">
                    {language === 'es' ? service.shortDesc.es : service.shortDesc.en}
                  </p>

                  {/* Highlight bar bottom */}
                  {isActive && (
                    <motion.div 
                      className="absolute bottom-0 left-0 h-1 bg-gradient-to-r"
                      style={{ 
                        backgroundColor: service.color, 
                        width: '100%' 
                      }}
                      layoutId="activeBar"
                    />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Right Column: Console Mockup Panel (7 Columns span) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="w-full bg-[#111111] border border-gray-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-full min-h-[340px]">
              
              {/* Window Header */}
              <div className="bg-[#181818] px-4 py-3 border-b border-gray-850 flex items-center justify-between">
                {/* Simulated buttons */}
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56] shadow" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow" />
                  <div className="w-3 h-3 rounded-full bg-[#27C93F] shadow" />
                </div>
                {/* Title */}
                <span className="font-['Orbitron'] text-[10px] tracking-widest text-gray-500 font-bold uppercase">
                  {services.find(s => s.id === activeServiceId)?.title}
                </span>
                {/* Pulse */}
                <div className="flex items-center space-x-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00FFC8] animate-pulse" />
                  <span className="text-[8px] font-['Orbitron'] text-[#00FFC8] font-bold">ONLINE</span>
                </div>
              </div>

              {/* Console Screen Container */}
              <div className="flex-1 bg-black/60 relative p-4 flex flex-col justify-between">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeServiceId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="h-full flex-1 flex flex-col justify-between"
                  >
                    {activeServiceId === 'automation' && <RpaSimulator />}
                    {activeServiceId === 'backend' && <AiAgentSimulator />}
                    {activeServiceId === 'webdev' && <FullStackSimulator />}
                    {activeServiceId === 'webscraping' && <DataScrapingSimulator />}
                    {activeServiceId === 'consulting' && <ConsultingSimulator />}
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          </div>
        </div>

        {/* Methodology flow section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-['Orbitron'] font-bold text-white mb-4">
            {proposal.methodology_title}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-xs md:text-sm mb-4">
            {proposal.methodology_subtitle}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#6B38FB] to-[#FF2D55] mx-auto"></div>
        </motion.div>

        {/* Horizontal Methodology layout with SVG Laser Connector */}
        <div className="relative mb-24">
          
          {/* Laser flow background path on desktop */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
            <svg className="w-full h-full" viewBox="0 0 1000 150" fill="none" preserveAspectRatio="none">
              <path 
                d="M 166,75 C 333,20 333,130 500,75 C 666,20 666,130 833,75" 
                stroke="url(#methodology-grad)" 
                strokeWidth="2" 
                strokeDasharray="6,6"
                className="opacity-25"
              />
              <defs>
                <linearGradient id="methodology-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00FFC8" />
                  <stop offset="50%" stopColor="#6B38FB" />
                  <stop offset="100%" stopColor="#FF2D55" />
                </linearGradient>
              </defs>
              {/* Laser animation overlay */}
              <motion.path 
                d="M 166,75 C 333,20 333,130 500,75 C 666,20 666,130 833,75" 
                stroke="#00FFC8" 
                strokeWidth="2.5"
                strokeDasharray="40 1000"
                strokeLinecap="round"
                animate={{ strokeDashoffset: [0, -1040] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
            {proposal.methodology.map((step, idx) => (
              <motion.div 
                key={idx}
                className="relative p-6 rounded-xl border border-gray-850 bg-[#181818]/80 hover:bg-[#1e1e1e] hover:border-gray-750 transition-all duration-300 shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                whileHover={{ y: -5 }}
              >
                <div 
                  className="absolute top-4 right-6 font-['Orbitron'] font-extrabold text-3xl opacity-15 select-none"
                  style={{ color: step.color }}
                >
                  0{idx + 1}
                </div>
                <span 
                  className="inline-block px-3 py-1 rounded-full text-[10px] font-['Orbitron'] font-bold mb-4 bg-black border"
                  style={{ color: step.color, borderColor: `${step.color}25` }}
                >
                  {step.phase}
                </span>
                <h3 className="text-base font-['Orbitron'] font-bold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Comparison Board section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-['Orbitron'] font-bold text-white mb-4">
            {proposal.compare_title}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-xs md:text-sm mb-4">
            {proposal.compare_subtitle}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#00FFC8] to-[#6B38FB] mx-auto"></div>
        </motion.div>

        {/* Glassmorphic Comparison Matrix */}
        <div className="mb-24">
          {/* Desktop view */}
          <div className="hidden md:block overflow-hidden rounded-xl border border-gray-850 bg-[#141414] shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-850 bg-gray-950 font-['Orbitron'] text-[10px] md:text-xs uppercase tracking-wider text-gray-400">
                  <th className="p-5 font-bold w-1/4">{proposal.compare_headers[0]}</th>
                  <th className="p-5 font-bold text-[#FF2D55] text-center w-3/8 bg-[#FF2D55]/5">{proposal.compare_headers[1]}</th>
                  <th className="p-5 font-bold text-[#00FFC8] text-center w-3/8 bg-[#00FFC8]/5">{proposal.compare_headers[2]}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-900">
                {proposal.compare_rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.01] transition-colors">
                    <td className="p-5 text-xs font-semibold text-gray-300 font-['Orbitron'] border-r border-gray-900">{row.label}</td>
                    
                    <td className="p-5 text-xs text-gray-400 bg-red-950/[0.04] border-r border-gray-900">
                      <div className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 mt-0.5 text-[#FF2D55] flex-shrink-0" />
                        <span>{row.trad}</span>
                      </div>
                    </td>
                    
                    <td className="p-5 text-xs text-gray-200 font-semibold bg-green-950/[0.04]">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 text-[#00FFC8] flex-shrink-0" />
                        <span className="text-[#00FFC8]">{row.our}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile view */}
          <div className="md:hidden space-y-6">
            {proposal.compare_rows.map((row, idx) => (
              <div key={idx} className="p-5 rounded-xl border border-gray-850 bg-[#141414] shadow-lg">
                <h4 className="font-['Orbitron'] font-bold text-xs text-white border-b border-gray-850 pb-2 mb-3 tracking-wide">
                  {row.label}
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-2 text-xs">
                    <XCircle className="w-4 h-4 mt-0.5 text-[#FF2D55] flex-shrink-0" />
                    <div>
                      <span className="block font-semibold text-[#FF2D55]/70 text-[10px] tracking-wider uppercase mb-0.5">{proposal.compare_headers[1]}</span>
                      <span className="text-gray-400 text-[11px]">{row.trad}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-xs">
                    <Check className="w-4 h-4 mt-0.5 text-[#00FFC8] flex-shrink-0" />
                    <div>
                      <span className="block font-semibold text-[#00FFC8]/70 text-[10px] tracking-wider uppercase mb-0.5">{proposal.compare_headers[2]}</span>
                      <span className="text-[#00FFC8] font-bold text-[11px]">{row.our}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Proposal Framework Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {proposal.blocks.map((block, idx) => (
            <motion.div 
              key={idx}
              className="p-6 rounded-xl border border-gray-850 bg-[#181818]/60 hover:bg-[#1e1e1e]/80 hover:border-gray-700 transition-all duration-300 flex flex-col justify-between shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              whileHover={{ y: -4 }}
            >
              <div>
                <div 
                  className="mb-4 inline-block p-2.5 rounded-lg border bg-black/40"
                  style={{ borderColor: `${block.color}15`, color: block.color }}
                >
                  {block.icon}
                </div>
                <h3 className="text-xs md:text-sm font-['Orbitron'] font-bold text-white mb-2.5 tracking-wider uppercase">
                  {block.title}
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed mb-4">
                  {block.desc}
                </p>
              </div>
              <div 
                className="w-12 h-1 rounded-full mt-2"
                style={{ backgroundColor: block.color }}
              ></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;