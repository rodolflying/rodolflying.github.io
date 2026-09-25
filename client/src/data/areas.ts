// Service areas, built from the team's automation portfolio and generalized so no
// employer, internal system or industry-identifying term is shown.
import type { Bilingual } from './cases';

export type AreaIcon = 'shield' | 'wrench' | 'route' | 'wallet' | 'bot' | 'globe';

export interface AreaResult {
  value: string;
  label: Bilingual;
}

export interface Area {
  id: string;
  icon: AreaIcon;
  color: string;
  name: Bilingual;
  pitch: Bilingual;
  solutions: Bilingual[];
  results: AreaResult[];
  risks: Bilingual[];
}

export const areas: Area[] = [
  {
    id: 'seguridad',
    icon: 'shield',
    color: '#FF8FA3',
    name: { es: 'Seguridad operacional', en: 'Operational safety' },
    pitch: {
      es: 'Protocolos que se cumplen siempre, no solo cuando alguien alcanza a revisarlos.',
      en: 'Protocols that are followed every time, not only when someone has time to check.',
    },
    solutions: [
      { es: 'Monitoreo en tiempo real de alertas de fatiga con escalamiento según protocolo y bitácora automática', en: 'Real-time fatigue alert monitoring with protocol-based escalation and an automatic log' },
      { es: 'Verificación de que cada alerta crítica tenga su control mitigador registrado', en: 'Checks that every critical alert has its mitigating control on record' },
      { es: 'Seguimiento diario de acciones correctivas vencidas de investigaciones de incidentes', en: 'Daily follow-up of overdue corrective actions from incident investigations' },
      { es: 'Descarga y consolidación nocturna de reportes de seguridad para Power BI', en: 'Nightly download and consolidation of safety reports into Power BI' },
      { es: 'Auditoría de comunicaciones de radio con reconocimiento de voz local', en: 'Radio communication audits with on-premise speech recognition' },
    ],
    results: [
      { value: '100%', label: { es: 'de las alertas verificadas, no por muestreo', en: 'of alerts verified, not sampled' } },
      { value: '1.881', label: { es: 'filas de bitácora al año que ya no se tipean', en: 'log rows a year no longer typed by hand' } },
    ],
    risks: [
      { es: 'Evidencia lista ante fiscalizaciones y auditorías', en: 'Evidence ready for inspections and audits' },
      { es: 'Alertas que ya no se pierden entre turnos', en: 'Alerts no longer lost between shifts' },
    ],
  },
  {
    id: 'mantenimiento',
    icon: 'wrench',
    color: '#FFC857',
    name: { es: 'Mantenimiento y activos', en: 'Maintenance and assets' },
    pitch: {
      es: 'Tus equipos avisan cuando fallan y la orden de trabajo se crea sola, de día o de noche.',
      en: 'Your equipment reports its own failures and the work order is created automatically, day or night.',
    },
    solutions: [
      { es: 'Monitoreo de equipos con telemetría (GPS, módems satelitales, PLC) cada 30 minutos', en: 'Telemetry monitoring of equipment (GPS, satellite modems, PLCs) every 30 minutes' },
      { es: 'Creación automática de órdenes de trabajo en tu CMMS, sin duplicados y con plan de tareas', en: 'Automatic work orders in your CMMS, with no duplicates and a task checklist' },
      { es: 'Aviso al mantenedor por WhatsApp o Telegram con ubicación y hora estimada de llegada del equipo', en: 'Technician alerts via WhatsApp or Telegram with the asset location and ETA' },
      { es: 'Reinicio preventivo remoto de equipos de red y comunicaciones, con verificación y alertas', en: 'Preventive remote restarts of network and radio equipment, with verification and alerts' },
    ],
    results: [
      { value: '251', label: { es: 'órdenes de trabajo creadas solas en 6 meses', en: 'work orders created automatically in 6 months' } },
      { value: '97%', label: { es: 'efectividad en 1.450 reinicios remotos', en: 'success rate across 1,450 remote restarts' } },
    ],
    risks: [
      { es: 'Fallas del fin de semana atendidas antes del lunes', en: 'Weekend failures handled before Monday' },
      { es: 'Menos visitas de emergencia a terreno', en: 'Fewer emergency site visits' },
    ],
  },
  {
    id: 'operaciones',
    icon: 'route',
    color: '#7DD3FC',
    name: { es: 'Operaciones y logística', en: 'Operations and logistics' },
    pitch: {
      es: 'Indicadores de la operación completos y confiables, calculados todos los días.',
      en: 'Complete, reliable operational KPIs, calculated every day.',
    },
    solutions: [
      { es: 'KPIs de tiempos de ciclo: plan versus real por tramo, estadía y evento, directo a Power BI', en: 'Cycle-time KPIs: plan vs. actual by segment, dwell time and event, straight into Power BI' },
      { es: 'Analizador de conducción desde registradores de eventos: velocidad, excesos e informe PDF por operador', en: 'Driving analysis from event recorders: speed, violations and a PDF report per operator' },
      { es: 'Modelos de tiempos de viaje que se actualizan solos cuando cambian las restricciones', en: 'Travel-time models that update themselves when restrictions change' },
      { es: 'Eficiencia energética: minutos de motor apagado por equipo, evento y operador', en: 'Energy efficiency: engine-off minutes by asset, event and operator' },
      { es: 'Lectura de documentos de comercio exterior y cruce contra la carga declarada', en: 'Reading foreign-trade documents and cross-checking them against declared cargo' },
    ],
    results: [
      { value: '5.039', label: { es: 'viajes analizados en minutos, antes solo días puntuales', en: 'trips analyzed in minutes, previously only sample days' } },
      { value: '4', label: { es: 'formatos de registrador leídos por una sola herramienta', en: 'recorder formats read by a single tool' } },
    ],
    risks: [
      { es: 'Registros que desaparecían del reporte, ahora visibles', en: 'Records that silently vanished from reports, now visible' },
      { es: 'Un solo número para todas las reuniones de gestión', en: 'One number for every management meeting' },
    ],
  },
  {
    id: 'finanzas',
    icon: 'wallet',
    color: '#47E5C2',
    name: { es: 'Presupuesto, compras y finanzas', en: 'Budget, procurement and finance' },
    pitch: {
      es: 'Menos digitación en el ERP y el presupuesto real a la vista, sin armar planillas a fin de mes.',
      en: 'Less ERP data entry and the real budget in plain sight, without month-end spreadsheets.',
    },
    solutions: [
      { es: 'Bot en SAP que crea solicitudes de pedido y hojas de entrada de servicios, adjunta respaldos y contabiliza facturas', en: 'A SAP bot that creates purchase requisitions and service entry sheets, attaches backups and posts invoices' },
      { es: 'Plataforma web de control presupuestario con datos de SAP: oficial, real y ajustado por área', en: 'A web budget-control platform on SAP data: official, actual and adjusted by department' },
      { es: 'Estado de cada solicitud visible para todos, sin preguntar por correo', en: 'Every request status visible to everyone, no more status emails' },
      { es: 'Conciliaciones y validaciones antes de grabar (centro de costo, cuenta, montos)', en: 'Reconciliations and validations before posting (cost center, account, amounts)' },
    ],
    results: [
      { value: '21 → 1,5', label: { es: 'minutos por documento en el ERP', en: 'minutes per ERP document' } },
      { value: '354', label: { es: 'documentos procesados para 11 solicitantes', en: 'documents processed for 11 requesters' } },
    ],
    risks: [
      { es: 'Respaldos ordenados para auditoría', en: 'Organized backups for audits' },
      { es: 'Errores de imputación detectados antes del cierre', en: 'Posting errors caught before month-end close' },
    ],
  },
  {
    id: 'ia',
    icon: 'bot',
    color: '#7C9CFF',
    name: { es: 'Monitoreo con agentes de IA', en: 'AI-agent monitoring' },
    pitch: {
      es: 'Agentes que leen, escuchan y clasifican por ti, con los datos dentro de tu empresa.',
      en: 'Agents that read, listen and classify for you, keeping the data inside your company.',
    },
    solutions: [
      { es: 'Clasificación con IA de reportes que llegan por WhatsApp o correo, convertidos en tickets', en: 'AI classification of reports arriving by WhatsApp or email, turned into tickets' },
      { es: 'Transcripción de audio con reconocimiento de voz local y detección de cumplimiento de protocolo', en: 'On-premise speech-to-text with protocol compliance detection' },
      { es: 'Asistentes que responden sobre tus documentos internos (RAG)', en: 'Assistants that answer questions about your internal documents (RAG)' },
      { es: 'Tableros de monitoreo que combinan reglas, IA y alertas en tiempo real', en: 'Monitoring dashboards combining rules, AI and real-time alerts' },
    ],
    results: [
      { value: '24/7', label: { es: 'vigilancia sin depender de turnos', en: 'watch without depending on shifts' } },
      { value: '0', label: { es: 'datos sensibles enviados fuera cuando se usa IA local', en: 'sensitive data sent out when AI runs locally' } },
    ],
    risks: [
      { es: 'Auditoría del 100% en vez de revisar solo tras un incidente', en: '100% auditing instead of reviewing only after an incident' },
    ],
  },
  {
    id: 'datos-web',
    icon: 'globe',
    color: '#C4F18A',
    name: { es: 'Datos, reportes y plataformas web', en: 'Data, reporting and web platforms' },
    pitch: {
      es: 'Datos de portales, redes y planillas, convertidos en reportes y plataformas propias.',
      en: 'Data from portals, social media and spreadsheets, turned into reports and your own platforms.',
    },
    solutions: [
      { es: 'Automatización de trámites y cargas masivas en portales del Estado', en: 'Automated filings and bulk uploads on government portals' },
      { es: 'Recolección de datos web y de redes con análisis NLP', en: 'Web and social data collection with NLP analysis' },
      { es: 'Newsletters y comunicaciones masivas segmentadas', en: 'Segmented newsletters and mass communications' },
      { es: 'Sitios, dashboards y aplicaciones web a medida', en: 'Custom websites, dashboards and web applications' },
    ],
    results: [
      { value: '1M+', label: { es: 'destinatarios en envíos automatizados', en: 'recipients in automated sends' } },
      { value: '~1.500', label: { es: 'documentos cargados sin intervención', en: 'documents uploaded unattended' } },
    ],
    risks: [
      { es: 'Procesos que ya no dependen de una sola persona', en: 'Processes that no longer depend on a single person' },
    ],
  },
];

/** Portfolio-level figures (team experience, aggregated and anonymized). */
export const portfolioStats = {
  automations: '14',
  hoursPerMonth: '~190 h',
  fiveYearSaving: '−62%',
};
