import { useState } from 'react';
import Layout from '@/components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Activity, 
  Clock, 
  Send, 
  FileText, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Layers, 
  PlusCircle, 
  User, 
  Building2, 
  Calendar, 
  Sparkles,
  Search,
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BotSystem {
  id: string;
  name: string;
  description: string;
  host: string;
  status: 'operational' | 'maintenance' | 'incident';
  lastRun: string;
  successRate: string;
  processedToday: string;
}

interface TicketItem {
  id: string;
  title: string;
  type: 'Soporte Operativo' | 'Pequeño Ajuste' | 'Capacitación' | 'Nuevo Proyecto / Cambio';
  priority: 'Alta' | 'Media' | 'Baja';
  status: 'En Proceso' | 'Abierto' | 'Resuelto';
  createdAt: string;
  assignedTo: string;
}

interface DocDeliverable {
  id: string;
  title: string;
  category: 'Manual de Usuario' | 'Arquitectura To-Be' | 'Reporte SLA' | 'Acta de Entrega';
  version: string;
  updatedAt: string;
  fileSize: string;
  format: 'PDF' | 'DOCX' | 'ZIP';
}

export const PortalPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'status' | 'hours' | 'tickets' | 'docs'>('status');

  // Interactive Ticket Form state
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketType, setTicketType] = useState<TicketItem['type']>('Soporte Operativo');
  const [ticketPriority, setTicketPriority] = useState<TicketItem['priority']>('Media');
  const [ticketDescription, setTicketDescription] = useState('');
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);

  // Mock data for live portal demo
  const [systems] = useState<BotSystem[]>([
    {
      id: 'bot-1',
      name: 'Bot Extractor Facturación SAP ERP',
      description: 'Sincronización desatendida de facturas con proveedores y módulo contable.',
      host: 'Servidor On-Premise Linux (192.168.10.42)',
      status: 'operational',
      lastRun: 'Hace 4 minutos (02:25 hrs)',
      successRate: '99.94%',
      processedToday: '1,420 documentos'
    },
    {
      id: 'bot-2',
      name: 'Scraper de Índices & Licitaciones Públicas',
      description: 'Extracción diaria de oportunidades en MercadoPúblico y paridades cambiarias.',
      host: 'AWS Cloud EC2 (us-east-1)',
      status: 'operational',
      lastRun: 'Hace 18 minutos (02:11 hrs)',
      successRate: '100%',
      processedToday: '86 boletines'
    },
    {
      id: 'bot-3',
      name: 'Orquestador WhatsApp de Notificaciones Gerenciales',
      description: 'Disparo de alertas en tiempo real para discrepancias y cierres de turno.',
      host: 'Servidor On-Premise Windows VM',
      status: 'operational',
      lastRun: 'Hace 1 hora',
      successRate: '99.8%',
      processedToday: '42 alertas enviadas'
    },
    {
      id: 'bot-4',
      name: 'Integrador OCR Guías de Despacho',
      description: 'Digitalización y extracción de firmas en documentos físicos de transporte.',
      host: 'Docker Container On-Premise',
      status: 'maintenance',
      lastRun: 'Ventana de mantención programada',
      successRate: '98.5%',
      processedToday: 'En pausa programada'
    }
  ]);

  const [hoursSummary] = useState({
    totalContracted: 20,
    used: 12,
    available: 8,
    categories: [
      { name: 'Soporte Operativo', used: 4.5, color: '#47E5C2', desc: 'Monitoreo de logs y resolución de timeout SAP' },
      { name: 'Pequeños Ajustes', used: 3.0, color: '#7DD3FC', desc: 'Actualización de credenciales y nuevo campo RUT en reporte' },
      { name: 'Capacitación & Onboarding', used: 2.5, color: '#FFC857', desc: 'Taller virtual para 3 operadores de logística' },
      { name: 'Levantamiento & Discovery', used: 2.0, color: '#A5B4FC', desc: 'Mapeo de requerimiento para Bot de Inventario N°2' }
    ]
  });

  const [tickets, setTickets] = useState<TicketItem[]>([
    {
      id: 'TK-2026-104',
      title: 'Ajuste de formato en exportable Excel de facturas',
      type: 'Pequeño Ajuste',
      priority: 'Media',
      status: 'En Proceso',
      createdAt: '16 Sep 2026',
      assignedTo: 'Ing. R. Sepúlveda'
    },
    {
      id: 'TK-2026-103',
      title: 'Capacitación a nuevo analista de compras sobre panel de bots',
      type: 'Capacitación',
      priority: 'Baja',
      status: 'Resuelto',
      createdAt: '12 Sep 2026',
      assignedTo: 'Ing. R. Sepúlveda'
    },
    {
      id: 'TK-2026-102',
      title: 'Monitoreo preventivo por cambio de certificados SSL en ERP',
      type: 'Soporte Operativo',
      priority: 'Alta',
      status: 'Resuelto',
      createdAt: '08 Sep 2026',
      assignedTo: 'Star Apps Ops'
    }
  ]);

  const [documents] = useState<DocDeliverable[]>([
    {
      id: 'doc-1',
      title: 'Manual de Operaciones & Troubleshooting Bot SAP v2.4',
      category: 'Manual de Usuario',
      version: 'v2.4',
      updatedAt: '05 Sep 2026',
      fileSize: '4.2 MB',
      format: 'PDF'
    },
    {
      id: 'doc-2',
      title: 'Diagrama de Arquitectura To-Be & Mapa de Flujos de Red',
      category: 'Arquitectura To-Be',
      version: 'v1.8',
      updatedAt: '28 Ago 2026',
      fileSize: '2.8 MB',
      format: 'PDF'
    },
    {
      id: 'doc-3',
      title: 'Reporte Mensual de Desempeño y Cumplimiento de SLA (Agosto 2026)',
      category: 'Reporte SLA',
      version: 'v1.0',
      updatedAt: '01 Sep 2026',
      fileSize: '1.4 MB',
      format: 'PDF'
    },
    {
      id: 'doc-4',
      title: 'Acta de Entrega de Hito 3 — Código Fuente y Scripts pm2',
      category: 'Acta de Entrega',
      version: 'v1.0',
      updatedAt: '15 Ago 2026',
      fileSize: '18.5 MB',
      format: 'ZIP'
    }
  ]);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketTitle.trim()) return;

    const newTicket: TicketItem = {
      id: `TK-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: ticketTitle,
      type: ticketType,
      priority: ticketPriority,
      status: 'Abierto',
      createdAt: 'Hoy (En cola)',
      assignedTo: 'Star Apps Desk'
    };

    setTickets([newTicket, ...tickets]);
    setTicketTitle('');
    setTicketDescription('');
    setShowNewTicketModal(false);

    toast({
      title: 'Ticket Registrado Exitosamente',
      description: `Se ha abierto el ticket ${newTicket.id}. El equipo de soporte iniciará la revisión dentro de la ventana de SLA.`,
    });
  };

  return (
    <Layout page="portal" noindex>
      <div className="min-h-screen pt-28 pb-20 bg-[#070B14] text-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Client Bar */}
          <div className="bg-[#070B14] border border-night-line rounded-2xl p-6 mb-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#47E5C2]/10 border border-[#47E5C2]/30 flex items-center justify-center text-[#47E5C2]">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-display font-bold text-white">
                    PORTAL PRIVADO DE CLIENTES
                  </h1>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#47E5C2]/15 text-[#47E5C2] border border-[#47E5C2]/30">
                    MODO DEMO ACTIVO
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Organización: <strong className="text-slate-200">Transportes & Logística del Norte S.A.</strong> | Plan: <strong className="text-[#47E5C2]">Soporte Adaptativo 20h</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowNewTicketModal(true)}
                className="px-4 py-2.5 bg-[#47E5C2] text-black font-bold rounded-lg text-xs font-display hover:bg-[#47E5C2]/85 transition-colors flex items-center gap-2 shadow-lg shadow-[#47E5C2]/20"
              >
                <PlusCircle className="w-4 h-4" />
                <span>NUEVA SOLICITUD</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <button
              onClick={() => setActiveTab('status')}
              className={`p-4 rounded-xl border text-left transition-all ${
                activeTab === 'status' 
                  ? 'bg-[#0E1626] border-[#47E5C2] shadow-lg shadow-[#47E5C2]/10' 
                  : 'bg-[#0A1020] border-night-line hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <Activity className={`w-4 h-4 ${activeTab === 'status' ? 'text-[#47E5C2]' : 'text-slate-400'}`} />
                <span className="w-2 h-2 rounded-full bg-[#47E5C2] animate-ping" />
              </div>
              <div className="font-display font-bold text-sm text-white">Salud de Sistemas</div>
              <div className="text-xs text-slate-400 font-mono">Status de bots en vivo</div>
            </button>

            <button
              onClick={() => setActiveTab('hours')}
              className={`p-4 rounded-xl border text-left transition-all ${
                activeTab === 'hours' 
                  ? 'bg-[#0E1626] border-[#7DD3FC] shadow-lg shadow-[#7DD3FC]/10' 
                  : 'bg-[#0A1020] border-night-line hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <Clock className={`w-4 h-4 ${activeTab === 'hours' ? 'text-[#7DD3FC]' : 'text-slate-400'}`} />
                <span className="text-xs font-mono text-[#7DD3FC]">8h libres</span>
              </div>
              <div className="font-display font-bold text-sm text-white">Bolsa de Soporte</div>
              <div className="text-xs text-slate-400 font-mono">Transparencia 4-en-1</div>
            </button>

            <button
              onClick={() => setActiveTab('tickets')}
              className={`p-4 rounded-xl border text-left transition-all ${
                activeTab === 'tickets' 
                  ? 'bg-[#0E1626] border-[#A5B4FC] shadow-lg shadow-[#A5B4FC]/10' 
                  : 'bg-[#0A1020] border-night-line hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <Send className={`w-4 h-4 ${activeTab === 'tickets' ? 'text-[#A5B4FC]' : 'text-slate-400'}`} />
                <span className="text-xs font-mono text-[#A5B4FC]">{tickets.length} tickets</span>
              </div>
              <div className="font-display font-bold text-sm text-white">Centro de Tickets</div>
              <div className="text-xs text-slate-400 font-mono">Solicitudes y cambios</div>
            </button>

            <button
              onClick={() => setActiveTab('docs')}
              className={`p-4 rounded-xl border text-left transition-all ${
                activeTab === 'docs' 
                  ? 'bg-[#0E1626] border-[#FFC857] shadow-lg shadow-[#FFC857]/10' 
                  : 'bg-[#0A1020] border-night-line hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <FileText className={`w-4 h-4 ${activeTab === 'docs' ? 'text-[#FFC857]' : 'text-slate-400'}`} />
                <span className="text-xs font-mono text-[#FFC857]">4 archivos</span>
              </div>
              <div className="font-display font-bold text-sm text-white">Documentación</div>
              <div className="text-xs text-slate-400 font-mono">Manuales & diagramas</div>
            </button>
          </div>

          {/* TAB 1: SYSTEM HEALTH STATUS PAGE */}
          {activeTab === 'status' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex justify-between items-center bg-[#070B14] p-4 rounded-xl border border-night-line">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#47E5C2] animate-pulse" />
                  <span className="text-sm font-semibold text-white">
                    3 de 4 Sistemas Operando al 100% de Capacidad
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  Última sincronización global: Hace 2 minutos
                </span>
              </div>

              <div className="grid gap-4">
                {systems.map((sys) => (
                  <div key={sys.id} className="bg-[#070B14] border border-night-line rounded-xl p-5 hover:border-slate-700 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <span className={`w-3 h-3 rounded-full shrink-0 ${
                          sys.status === 'operational' ? 'bg-[#47E5C2] shadow-[0_0_8px_#47E5C2]' :
                          sys.status === 'maintenance' ? 'bg-amber-400 shadow-[0_0_8px_#FFC857]' : 'bg-red-500'
                        }`} />
                        <div>
                          <h3 className="text-base font-bold text-white font-display">{sys.name}</h3>
                          <p className="text-xs text-slate-400">{sys.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-xs font-mono px-2.5 py-1 rounded border font-bold ${
                          sys.status === 'operational' ? 'bg-[#47E5C2]/10 text-[#47E5C2] border-[#47E5C2]/30' :
                          sys.status === 'maintenance' ? 'bg-amber-400/10 text-amber-400 border-amber-400/30' :
                          'bg-red-500/10 text-red-500 border-red-500/30'
                        }`}>
                          {sys.status === 'operational' ? '🟢 OPERATIVO' :
                           sys.status === 'maintenance' ? '🟡 EN MANTENCIÓN' : '🔴 INCIDENCIA'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-night-line/80 text-xs font-mono">
                      <div>
                        <span className="text-slate-400 block">HOST / ENTORNO:</span>
                        <span className="text-slate-300 truncate block">{sys.host}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">ÚLTIMA EJECUCIÓN:</span>
                        <span className="text-white">{sys.lastRun}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">TASA DE ÉXITO:</span>
                        <span className="text-[#47E5C2] font-bold">{sys.successRate}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">VOLUMEN HOY:</span>
                        <span className="text-white">{sys.processedToday}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 2: TRANSPARENCY 4-IN-1 HOUR TRACKER */}
          {activeTab === 'hours' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {/* Grand Summary Card */}
              <div className="bg-[#070B14] border border-night-line rounded-2xl p-6 sm:p-8">
                <div className="grid lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-4 space-y-3">
                    <span className="text-xs font-mono uppercase text-[#7DD3FC] tracking-wider block">
                      BALANCE MENSUAL // SEPTIEMBRE 2026
                    </span>
                    <h3 className="text-3xl font-display font-bold text-white">
                      {hoursSummary.used}h / {hoursSummary.totalContracted}h
                    </h3>
                    <p className="text-xs text-slate-400">
                      Has consumido el 60% de tu bolsa mensual de ingeniería. Te restan <strong>8 horas disponibles</strong> para utilizar en cualquiera de las 4 categorías.
                    </p>

                    <div className="p-3 bg-black/50 rounded-lg border border-night-line text-xs font-mono">
                      <div className="flex justify-between py-1">
                        <span className="text-slate-400">Horas Contratadas:</span>
                        <span className="text-white font-bold">{hoursSummary.totalContracted} hrs</span>
                      </div>
                      <div className="flex justify-between py-1 border-t border-night-line">
                        <span className="text-slate-400">Horas Consumidas:</span>
                        <span className="text-[#7DD3FC] font-bold">{hoursSummary.used} hrs</span>
                      </div>
                      <div className="flex justify-between py-1 border-t border-night-line">
                        <span className="text-slate-400">Remanente Activo:</span>
                        <span className="text-[#47E5C2] font-bold">{hoursSummary.available} hrs</span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-8 space-y-4">
                    <h4 className="text-sm font-display font-semibold text-white">
                      Distribución por Categoría de Valor (4-en-1)
                    </h4>

                    {/* Progress multi-segment bar */}
                    <div className="w-full h-4 bg-night-900 rounded-full overflow-hidden flex border border-night-line p-0.5">
                      {hoursSummary.categories.map((cat, i) => (
                        <div 
                          key={i} 
                          style={{ 
                            width: `${(cat.used / hoursSummary.totalContracted) * 100}%`,
                            backgroundColor: cat.color 
                          }}
                          className="h-full first:rounded-l-full last:rounded-r-full transition-all"
                          title={`${cat.name}: ${cat.used}h`}
                        />
                      ))}
                    </div>

                    {/* Categories Detailed Cards */}
                    <div className="grid sm:grid-cols-2 gap-3 pt-2">
                      {hoursSummary.categories.map((cat, idx) => (
                        <div key={idx} className="p-3.5 bg-black/40 border border-night-line rounded-xl space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-white flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                              {cat.name}
                            </span>
                            <span className="text-xs font-mono font-bold" style={{ color: cat.color }}>
                              {cat.used} hrs
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 leading-snug">
                            {cat.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: TICKETING & REQUEST CENTER */}
          {activeTab === 'tickets' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex justify-between items-center bg-[#070B14] p-4 rounded-xl border border-night-line">
                <div>
                  <h3 className="text-sm font-display font-bold text-white">
                    Historial de Solicitudes y Controles de Cambio
                  </h3>
                  <p className="text-xs text-slate-400">
                    Reporta incidencias, pide entrenamientos o cotiza incrementos modulares para tus sistemas.
                  </p>
                </div>
                <button
                  onClick={() => setShowNewTicketModal(true)}
                  className="px-3.5 py-2 bg-[#A5B4FC] text-white font-bold rounded-lg text-xs font-mono flex items-center gap-1.5 hover:bg-[#A5B4FC]/85 transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Abrir Ticket
                </button>
              </div>

              <div className="grid gap-3">
                {tickets.map((tk) => (
                  <div key={tk.id} className="bg-[#070B14] border border-night-line rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#47E5C2]">{tk.id}</span>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 border border-slate-700 text-slate-300">
                          {tk.type}
                        </span>
                        <span className={`text-xs font-mono px-2 py-0.5 rounded font-bold ${
                          tk.priority === 'Alta' ? 'bg-red-500/15 text-red-400 border border-red-500/30' :
                          tk.priority === 'Media' ? 'bg-amber-400/15 text-amber-400 border border-amber-400/30' :
                          'bg-blue-400/15 text-blue-400 border border-blue-400/30'
                        }`}>
                          Prioridad {tk.priority}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-white">{tk.title}</h4>
                      <p className="text-xs text-slate-400 font-mono">
                        Creado: {tk.createdAt} • Asignado a: <strong className="text-slate-300">{tk.assignedTo}</strong>
                      </p>
                    </div>

                    <div className="shrink-0">
                      <span className={`text-xs font-mono px-3 py-1.5 rounded-lg border font-bold block text-center ${
                        tk.status === 'Resuelto' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                        tk.status === 'En Proceso' ? 'bg-[#7DD3FC]/10 text-[#7DD3FC] border-[#7DD3FC]/30' :
                        'bg-amber-400/10 text-amber-400 border-amber-400/30'
                      }`}>
                        {tk.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 4: DELIVERABLES & DOCUMENTATION REPO */}
          {activeTab === 'docs' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="bg-[#070B14] p-4 rounded-xl border border-night-line">
                <h3 className="text-sm font-display font-bold text-white">
                  Repositorio Oficial de Entregables & Diagramas To-Be
                </h3>
                <p className="text-xs text-slate-400">
                  Accede y descarga la documentación viva de los proyectos de software construidos para tu empresa.
                </p>
              </div>

              <div className="grid gap-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="bg-[#070B14] border border-night-line rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#FFC857]/10 border border-[#FFC857]/30 flex items-center justify-center text-[#FFC857] shrink-0 mt-0.5">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 border border-night-line text-slate-400">
                            {doc.category}
                          </span>
                          <span className="text-xs font-mono text-[#FFC857] font-bold">
                            {doc.version}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-white">{doc.title}</h4>
                        <span className="text-xs text-slate-400 font-mono">
                          Actualizado: {doc.updatedAt} • Tamaño: {doc.fileSize} • Formato: {doc.format}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        toast({
                          title: 'Descarga Simulada Iniciada',
                          description: `Generando enlace de descarga seguro para ${doc.title}.`,
                        });
                      }}
                      className="px-3.5 py-2 bg-white/5 border border-slate-700 hover:border-[#FFC857] hover:text-[#FFC857] text-white font-mono text-xs rounded-lg flex items-center gap-1.5 transition-colors shrink-0 self-start sm:self-auto"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar {doc.format}</span>
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* NEW TICKET MODAL */}
          {showNewTicketModal && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-[#0A1020] border border-night-line rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4"
              >
                <div className="flex justify-between items-center border-b border-night-line pb-3">
                  <h3 className="text-base font-display font-bold text-white">
                    Abrir Nueva Solicitud o Ticket
                  </h3>
                  <button 
                    onClick={() => setShowNewTicketModal(false)}
                    className="text-slate-400 hover:text-white text-sm font-mono"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCreateTicket} className="space-y-4 text-xs font-mono">
                  <div>
                    <label className="block text-slate-300 mb-1">Título de la Solicitud:</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Cambio de endpoint o ajuste en reporte"
                      value={ticketTitle}
                      onChange={(e) => setTicketTitle(e.target.value)}
                      className="w-full bg-black border border-night-line rounded-lg p-2.5 text-white focus:border-[#47E5C2] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1">Categoría (4-en-1):</label>
                      <select
                        value={ticketType}
                        onChange={(e) => setTicketType(e.target.value as any)}
                        className="w-full bg-black border border-night-line rounded-lg p-2.5 text-white focus:border-[#47E5C2] outline-none"
                      >
                        <option value="Soporte Operativo">Soporte Operativo</option>
                        <option value="Pequeño Ajuste">Pequeño Ajuste</option>
                        <option value="Capacitación">Capacitación & Onboarding</option>
                        <option value="Nuevo Proyecto / Cambio">Control de Cambio / Nuevo Proyecto</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1">Prioridad:</label>
                      <select
                        value={ticketPriority}
                        onChange={(e) => setTicketPriority(e.target.value as any)}
                        className="w-full bg-black border border-night-line rounded-lg p-2.5 text-white focus:border-[#47E5C2] outline-none"
                      >
                        <option value="Baja">Baja</option>
                        <option value="Media">Media</option>
                        <option value="Alta">Alta (Crítica)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Descripción o Detalle Técnico:</label>
                    <textarea
                      rows={4}
                      placeholder="Describe qué necesitas ajustar, sistema afectado y fechas deseadas..."
                      value={ticketDescription}
                      onChange={(e) => setTicketDescription(e.target.value)}
                      className="w-full bg-black border border-night-line rounded-lg p-2.5 text-white focus:border-[#47E5C2] outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-night-line">
                    <button
                      type="button"
                      onClick={() => setShowNewTicketModal(false)}
                      className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-[#47E5C2] text-black font-bold font-display hover:bg-[#47E5C2]/85"
                    >
                      ENVIAR SOLICITUD
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PortalPage;
