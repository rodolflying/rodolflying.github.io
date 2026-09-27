// Service areas, built from the team's automation portfolio and generalized so no
// employer, internal system or industry-identifying term is shown.
import type { Bilingual } from './cases';

export type AreaIcon = 'shield' | 'wrench' | 'route' | 'wallet' | 'bot' | 'brain' | 'globe';

export interface AreaResult {
  /** A message or a general magnitude, not a one-off count. */
  value: Bilingual;
  label: Bilingual;
}

export interface Area {
  id: string;
  icon: AreaIcon;
  color: string;
  name: Bilingual;
  /** Short label for tabs and chips. */
  short: Bilingual;
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
    short: { es: 'Seguridad', en: 'Safety' },
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
      { value: { es: 'Todas', en: 'All' }, label: { es: 'las alertas se revisan, sin muestreo', en: 'alerts get reviewed, no sampling' } },
      { value: { es: 'Cero', en: 'Zero' }, label: { es: 'bitácoras tipeadas a mano', en: 'logs typed by hand' } },
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
    short: { es: 'Mantenimiento', en: 'Maintenance' },
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
      { value: { es: 'Día y noche', en: 'Day and night' }, label: { es: 'las órdenes de trabajo se crean solas', en: 'work orders create themselves' } },
      { value: { es: 'Sin viajar', en: 'No travel' }, label: { es: 'casi todos los reinicios resuelven la falla a distancia', en: 'almost every restart fixes the fault remotely' } },
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
    short: { es: 'Operaciones', en: 'Operations' },
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
      { value: { es: 'Toda la operación', en: 'Every trip' }, label: { es: 'analizada cada día, no solo días de muestra', en: 'analyzed every day, not just sample days' } },
      { value: { es: 'Una herramienta', en: 'One tool' }, label: { es: 'para todos los formatos de registrador', en: 'for every recorder format' } },
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
    short: { es: 'Finanzas', en: 'Finance' },
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
      { value: { es: '10× más rápido', en: '10× faster' }, label: { es: 'cada documento en el ERP', en: 'every ERP document' } },
      { value: { es: 'Cero', en: 'Zero' }, label: { es: 'digitación en el ERP para quien solicita', en: 'ERP typing for requesters' } },
    ],
    risks: [
      { es: 'Respaldos ordenados para auditoría', en: 'Organized backups for audits' },
      { es: 'Errores de imputación detectados antes del cierre', en: 'Posting errors caught before month-end close' },
    ],
  },
  {
    id: 'ia',
    icon: 'brain',
    color: '#7C9CFF',
    name: { es: 'Modelos predictivos e IA', en: 'Predictive models and AI' },
    short: { es: 'Predicción e IA', en: 'Prediction & AI' },
    pitch: {
      es: 'Modelos que anticipan fallas y comportamientos, funcionando en vivo, con el impacto demostrado con estadística.',
      en: 'Models that anticipate failures and behavior, running live, with their impact proven with statistics.',
    },
    solutions: [
      { es: 'Mantenimiento predictivo: modelos que leen la telemetría, anticipan la falla de un componente y agendan la detención antes de que ocurra', en: 'Predictive maintenance: models that read telemetry, anticipate a component failure and schedule the stop before it happens' },
      { es: 'Visión por computador para inspección visual, conteo y detección de elementos de protección personal', en: 'Computer vision for visual inspection, counting and personal protective equipment detection' },
      { es: 'Modelos supervisados y no supervisados: clasificación, segmentación y detección de anomalías', en: 'Supervised and unsupervised models: classification, segmentation and anomaly detection' },
      { es: 'Pipelines en vivo que reentrenan el modelo y avisan cuando deja de acertar', en: 'Live pipelines that retrain the model and alert when it stops being accurate' },
      { es: 'Estadística inferencial y diseño de experimentos: muestreo, pilotos controlados y ahorros con intervalo de confianza', en: 'Inferential statistics and design of experiments: sampling, controlled pilots and savings with confidence intervals' },
      { es: 'Agentes y modelos de lenguaje que corren en tus servidores, cuando la tarea lo justifica', en: 'Agents and language models running on your own servers, when the task calls for it' },
    ],
    results: [
      { value: { es: 'Menos espera', en: 'Shorter waits' }, label: { es: 'en un rediseño validado con simulación antes de cambiar nada', en: 'in a redesign validated with simulation before changing anything' } },
      { value: { es: 'Millones', en: 'Millions' }, label: { es: 'de registros de redes clasificados con NLP', en: 'of social media records classified with NLP' } },
    ],
    risks: [
      { es: 'Detenciones planificadas en vez de emergencias', en: 'Planned stops instead of emergencies' },
      { es: 'Decisiones respaldadas por datos, no por intuición', en: 'Decisions backed by data, not gut feeling' },
    ],
  },
  {
    id: 'datos-web',
    icon: 'globe',
    color: '#C4F18A',
    name: { es: 'Datos, reportes y plataformas web', en: 'Data, reporting and web platforms' },
    short: { es: 'Datos y web', en: 'Data & web' },
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
      { value: { es: 'Más de un millón', en: 'Over a million' }, label: { es: 'de destinatarios en envíos automatizados', en: 'recipients in automated sends' } },
      { value: { es: 'De semanas a horas', en: 'Weeks to hours' }, label: { es: 'para cargar un lote completo en un portal', en: 'to file a whole batch on a portal' } },
    ],
    risks: [
      { es: 'Procesos que ya no dependen de una sola persona', en: 'Processes that no longer depend on a single person' },
    ],
  },
];

