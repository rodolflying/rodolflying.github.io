// Portfolio shown by problem and sector instead of by client name.
// Each case states its authorship so visitors can tell Star Apps projects
// apart from the team's previous experience at other organizations.

export type Bilingual = { es: string; en: string };

export interface Case {
  slug: string;
  featured: boolean;
  attribution: 'starapps' | 'team';
  sector: Bilingual;
  title: Bilingual;
  problem: Bilingual;
  solution: Bilingual;
  result: Bilingual;
  metric: { value: string; label: Bilingual };
  stack: string[];
  color: string;
}

export const cases: Case[] = [
  {
    slug: 'ordenes-trabajo-automaticas',
    featured: true,
    attribution: 'team',
    sector: { es: 'Mantenimiento de flota', en: 'Fleet maintenance' },
    title: { es: 'Órdenes de trabajo que se crean solas', en: 'Work orders that create themselves' },
    problem: { es: 'Las fallas de los equipos a bordo se detectaban tarde y cada orden de trabajo se creaba a mano, solo en horario de oficina.', en: 'On-board equipment failures were spotted late and every work order was created by hand, only during office hours.' },
    solution: { es: 'Bot que revisa la telemetría de toda la flota cada 30 minutos, crea la orden en el CMMS sin duplicados y avisa al técnico con ubicación y hora de llegada.', en: 'A bot that checks the whole fleet’s telemetry every 30 minutes, creates the order in the CMMS with no duplicates and alerts the technician with location and ETA.' },
    result: { es: 'Tres de cada cuatro órdenes del período las creó el bot, y el 15% se generó de madrugada.', en: 'Three out of four work orders in the period were created by the bot, 15% of them overnight.' },
    metric: { value: '251', label: { es: 'órdenes automáticas en 6 meses', en: 'automatic orders in 6 months' } },
    stack: ['Python', 'API', 'SQL', 'WhatsApp', 'Gemini'],
    color: '#FFC857',
  },
  {
    slug: 'bot-erp-compras',
    featured: true,
    attribution: 'team',
    sector: { es: 'Compras y finanzas', en: 'Procurement and finance' },
    title: { es: 'Bot de compras y pagos en SAP', en: 'Procurement and payments bot in SAP' },
    problem: { es: 'Ingenieros y administradores de contrato perdían horas creando solicitudes de pedido, hojas de servicio y facturas en el ERP.', en: 'Engineers and contract managers lost hours creating requisitions, service sheets and invoices in the ERP.' },
    solution: { es: 'El usuario llena una fila en un Excel compartido; el bot crea el documento, adjunta respaldos, firma, envía y reporta el estado.', en: 'The user fills in one row of a shared Excel; the bot creates the document, attaches backups, signs, sends and reports the status.' },
    result: { es: '354 documentos procesados para 11 solicitantes de 6 áreas, con respaldos listos para auditoría.', en: '354 documents processed for 11 requesters across 6 departments, with audit-ready backups.' },
    metric: { value: '21 → 1,5', label: { es: 'minutos por documento', en: 'minutes per document' } },
    stack: ['SAP GUI Scripting', 'Python', 'Excel', 'Outlook'],
    color: '#47E5C2',
  },
  {
    slug: 'alertas-fatiga',
    featured: false,
    attribution: 'team',
    sector: { es: 'Seguridad operacional', en: 'Operational safety' },
    title: { es: 'Monitoreo de alertas de fatiga en tiempo real', en: 'Real-time fatigue alert monitoring' },
    problem: { es: 'En la sala de control se contaban a mano las alertas de cada operador y se registraban en Excel; una alerta podía perderse entre turnos.', en: 'Control-room staff counted each operator’s alerts by hand and logged them in Excel; an alert could get lost between shifts.' },
    solution: { es: 'Tablero que lee la plataforma cada 30 segundos, aplica el protocolo de escalamiento con cronómetro y sonido, y deja la bitácora automática.', en: 'A dashboard that reads the platform every 30 seconds, applies the escalation protocol with timer and sound, and keeps the log automatically.' },
    result: { es: 'Una sola regla para todos los turnos y evidencia de cumplimiento del protocolo.', en: 'One rule for every shift and evidence of protocol compliance.' },
    metric: { value: '1.881', label: { es: 'registros al año que ya no se tipean', en: 'log rows a year no longer typed' } },
    stack: ['Python', 'Playwright', 'SQLite'],
    color: '#FF8FA3',
  },
  {
    slug: 'control-presupuestario',
    featured: false,
    attribution: 'team',
    sector: { es: 'Control de gestión', en: 'Management control' },
    title: { es: 'Plataforma de control presupuestario', en: 'Budget-control platform' },
    problem: { es: 'El informe de presupuesto se armaba a mano cada mes en Excel y no mostraba qué gasto era realmente de cada área.', en: 'The budget report was built by hand in Excel every month and did not show which spending truly belonged to each area.' },
    solution: { es: 'Plataforma web que descarga los datos del ERP y muestra el presupuesto oficial, el real y el ajustado, con solicitudes y su estado en línea.', en: 'A web platform that pulls ERP data and shows the official, actual and adjusted budget, with requests and their status online.' },
    result: { es: 'Errores de imputación visibles antes del cierre y reclasificaciones trazables para auditoría.', en: 'Posting errors visible before close and traceable reclassifications for audits.' },
    metric: { value: '3', label: { es: 'versiones del presupuesto en una pantalla', en: 'budget versions on one screen' } },
    stack: ['React', 'FastAPI', 'SAP', 'Python'],
    color: '#7C9CFF',
  },
  {
    slug: 'newsletters-medios',
    featured: false,
    attribution: 'team',
    sector: { es: 'Medios y audiencias', en: 'Media and audiences' },
    title: { es: 'Newsletters automatizadas para un medio nacional', en: 'Automated newsletters for a national news outlet' },
    problem: { es: 'Quince newsletters se armaban y enviaban a mano, sin segmentación ni métricas confiables.', en: 'Fifteen newsletters were assembled and sent by hand, with no segmentation or reliable metrics.' },
    solution: { es: 'Pipeline en AWS que arma, segmenta y envía cada edición, con reportes de apertura y clics.', en: 'An AWS pipeline that builds, segments and sends each edition, with open and click reporting.' },
    result: { es: 'Envíos diarios a más de un millón de destinatarios sin intervención manual.', en: 'Daily sends to over a million recipients with no manual work.' },
    metric: { value: '1M+', label: { es: 'destinatarios', en: 'recipients' } },
    stack: ['AWS Pinpoint', 'Lambda', 'Python', 'Power BI'],
    color: '#FF8FA3',
  },
  {
    slug: 'datos-sociales-nlp',
    featured: false,
    attribution: 'team',
    sector: { es: 'Estudios sociales y opinión pública', en: 'Social and public opinion research' },
    title: { es: 'Recolección y análisis de conversación en redes', en: 'Social media collection and analysis' },
    problem: { es: 'Un equipo de sociólogos descargaba y clasificaba publicaciones a mano para sus estudios.', en: 'A team of sociologists downloaded and classified posts by hand for their studies.' },
    solution: { es: 'Scripts de recolección automática y clasificación con modelos de NLP sobre una base en la nube.', en: 'Automated collection scripts and NLP classification on a cloud database.' },
    result: { es: 'Base de cerca de 2 millones de registros y recolección cinco veces más rápida.', en: 'A database of about 2 million records and collection five times faster.' },
    metric: { value: '+500%', label: { es: 'eficiencia de recolección', en: 'collection efficiency' } },
    stack: ['Python', 'NLP', 'AWS', 'SQL'],
    color: '#FFC857',
  },
  {
    slug: 'bot-sii-f29',
    featured: true,
    attribution: 'starapps',
    sector: { es: 'Contabilidad y finanzas', en: 'Accounting and finance' },
    title: { es: 'Declaración mensual automática en el SII', en: 'Automatic monthly tax filing' },
    problem: { es: 'Sociedades sin movimiento debían declarar el F29 todos los meses, una por una.', en: 'Inactive companies had to file the monthly F29 tax form one by one, every month.' },
    solution: { es: 'Bot que ingresa al portal, completa y envía la declaración y guarda el comprobante.', en: 'A bot that logs into the portal, fills in and submits the filing, and stores the receipt.' },
    result: { es: 'La declaración se ejecuta sola y queda respaldada cada mes.', en: 'The filing runs on its own and is archived every month.' },
    metric: { value: '0', label: { es: 'declaraciones manuales', en: 'manual filings' } },
    stack: ['Python', 'Selenium'],
    color: '#7C9CFF',
  },
  {
    slug: 'rendicion-corfo',
    featured: false,
    attribution: 'team',
    sector: { es: 'Educación y proyectos con fondos públicos', en: 'Education and publicly funded projects' },
    title: { es: 'Rendición masiva de un proyecto CORFO', en: 'Bulk expense reporting for a public grant' },
    problem: { es: 'La rendición financiera exigía subir cerca de 1.500 formularios al portal SGP, uno a uno.', en: 'Financial reporting required uploading about 1,500 forms to the grant portal, one by one.' },
    solution: { es: 'Automatización web que lee los respaldos y completa cada formulario en el portal.', en: 'Web automation that reads the supporting files and fills in each form on the portal.' },
    result: { es: 'Semanas de digitación convertidas en una ejecución desatendida.', en: 'Weeks of data entry turned into one unattended run.' },
    metric: { value: '~1.500', label: { es: 'documentos rendidos', en: 'documents filed' } },
    stack: ['Python', 'Selenium', 'Excel'],
    color: '#47E5C2',
  },
  {
    slug: 'simulacion-atencion',
    featured: false,
    attribution: 'team',
    sector: { es: 'Servicios públicos', en: 'Public services' },
    title: { es: 'Rediseño de la atención con simulación de colas', en: 'Service redesign with queue simulation' },
    problem: { es: 'Tiempos de espera altos en la atención de público y sin datos para rediseñar el proceso.', en: 'Long waiting times at service counters and no data to redesign the process.' },
    solution: { es: 'Modelo de simulación del flujo de atención para probar escenarios antes de cambiar nada.', en: 'A simulation model of the service flow to test scenarios before changing anything.' },
    result: { es: 'Propuesta validada que reduce el tiempo de espera.', en: 'A validated proposal that cuts waiting time.' },
    metric: { value: '-20%', label: { es: 'tiempo de espera', en: 'waiting time' } },
    stack: ['Simulación', 'Diseño de procesos'],
    color: '#7DD3FC',
  },
  {
    slug: 'plataforma-blog',
    featured: false,
    attribution: 'starapps',
    sector: { es: 'Servicios profesionales', en: 'Professional services' },
    title: { es: 'Sitio con blog autoadministrable', en: 'Website with a self-managed blog' },
    problem: { es: 'Un profesional independiente necesitaba presencia web y publicar artículos sin depender de nadie.', en: 'An independent professional needed a web presence and a way to publish articles independently.' },
    solution: { es: 'Sitio a la medida con sistema de artículos en Markdown y diseño adaptable a móviles.', en: 'A custom site with a Markdown article system and a mobile-friendly design.' },
    result: { es: 'El cliente publica de forma autónoma y es dueño del sitio.', en: 'Content is published independently and the site is fully client-owned.' },
    metric: { value: '100%', label: { es: 'autónoma para publicar', en: 'self-publishing' } },
    stack: ['React', 'Markdown', 'Tailwind'],
    color: '#C4F18A',
  },
];
