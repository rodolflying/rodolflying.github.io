// "How it runs" for each service area: the same story as the pixel scene, told as the
// real pipeline (steps, processes, logs). Illustrative data: names, amounts and assets
// are fictitious and nothing identifies an employer, vendor or location.
import type { Bilingual } from './cases';

export type OpsIcon =
  | 'radar' | 'bell' | 'monitor' | 'tablet' | 'book' | 'database' | 'cpu' | 'chart' | 'message'
  | 'mic' | 'brain' | 'wrench' | 'file' | 'mail' | 'globe' | 'satellite' | 'check' | 'send'
  | 'layers' | 'shield' | 'router' | 'calculator' | 'wallet' | 'scan' | 'dashboard' | 'news';

export interface OpsStep {
  icon: OpsIcon;
  title: Bilingual;
  tag: Bilingual;
  summary: Bilingual;
  resilience: Bilingual;
  tech: string;
  every: Bilingual;
  /** Sample of the data this step hands to the next one (JSON), per language when it holds text. */
  payload: string | Bilingual;
}

export interface OpsProcess {
  name: string;
  schedule: Bilingual;
  last: Bilingual;
}

export interface OpsLog {
  proc: string;
  level: 'info' | 'ok' | 'warn';
  text: Bilingual;
}

export interface AreaOps {
  intro: Bilingual;
  /** Time shown on the first console line; later lines advance from it. */
  clock: string;
  steps: OpsStep[];
  processes: OpsProcess[];
  logs: OpsLog[];
}

const json = (o: unknown) => JSON.stringify(o, null, 2);

export const areaOps: Record<string, AreaOps> = {
  seguridad: {
    intro: {
      es: 'Una alerta de fatiga a las 02:10: del sensor en cabina a la bitácora, sin que nadie tenga que acordarse de nada.',
      en: 'A fatigue alert at 02:10: from the in-cab sensor to the log, without anyone having to remember a thing.',
    },
    clock: '02:10:02',
    steps: [
      {
        icon: 'radar',
        title: { es: 'Sensor de fatiga en cabina', en: 'In-cab fatigue sensor' },
        tag: { es: 'ORIGEN', en: 'SOURCE' },
        summary: {
          es: 'El sistema de detección del vehículo emite el evento con equipo, conductor, hora y nivel de riesgo.',
          en: "The vehicle's detection system emits the event with asset, driver, time and risk level.",
        },
        resilience: {
          es: 'Si la API del proveedor no responde, el bot reintenta y consulta su portal como respaldo.',
          en: "If the vendor API does not answer, the bot retries and falls back to the vendor's portal.",
        },
        tech: 'API / webhook',
        every: { es: 'Tiempo real', en: 'Real time' },
        payload: json({ event: 'FATIGUE_HIGH', unit: 'TRUCK-12', driver: 'OP-0448', risk: 'high', ts: '02:10:02' }),
      },
      {
        icon: 'bell',
        title: { es: 'Motor de alertas', en: 'Alert engine' },
        tag: { es: 'PROTOCOLO', en: 'PROTOCOL' },
        summary: {
          es: 'Clasifica la severidad, aplica el protocolo (quién y en cuánto tiempo) y deja la alerta fija con temporizador hasta que alguien la atienda.',
          en: 'Rates severity, applies the protocol (who and how fast) and pins the alert with a timer until someone handles it.',
        },
        resilience: {
          es: 'Ninguna alerta se cierra sola: si nadie la reconoce en 2 minutos, escala al siguiente nivel.',
          en: 'No alert closes itself: if nobody acknowledges it within 2 minutes, it escalates to the next level.',
        },
        tech: 'Python',
        every: { es: 'Continuo', en: 'Continuous' },
        payload: json({ alert_id: 'AL-2291', protocol: 'fatigue_level_2', ack_deadline_s: 120, escalation: ['operator', 'supervisor'] }),
      },
      {
        icon: 'monitor',
        title: { es: 'Consola de control', en: 'Control console' },
        tag: { es: 'OPERADOR', en: 'OPERATOR' },
        summary: {
          es: 'El operador ve la alerta con sonido y cuenta regresiva. Al reconocerla, registra el contacto con el conductor.',
          en: 'The operator sees the alert with sound and a countdown. On acknowledging it, they record the contact with the driver.',
        },
        resilience: {
          es: 'Si la consola se cae, la alerta llega igual por Telegram al supervisor de turno.',
          en: 'If the console goes down, the alert still reaches the shift supervisor on Telegram.',
        },
        tech: 'Dashboard web',
        every: { es: 'Tiempo real', en: 'Real time' },
        payload: json({ alert_id: 'AL-2291', ack_by: 'night_shift_operator', ack_after_s: 38, action: 'radio_contact' }),
      },
      {
        icon: 'tablet',
        title: { es: 'Aviso al conductor', en: 'Driver notice' },
        tag: { es: 'TERRENO', en: 'FIELD' },
        summary: {
          es: 'El conductor recibe la instrucción en su tablet: pausa activa en el próximo punto seguro.',
          en: 'The driver gets the instruction on the tablet: an active break at the next safe stop.',
        },
        resilience: {
          es: 'Si la tablet no confirma la lectura, se repite por radio y queda marcada para seguimiento.',
          en: 'If the tablet does not confirm reading, it is repeated by radio and flagged for follow-up.',
        },
        tech: 'App móvil',
        every: { es: 'Por alerta', en: 'Per alert' },
        payload: json({ unit: 'TRUCK-12', instruction: 'active_break_15_min', read_confirmed: true, stop_at: 'km 84' }),
      },
      {
        icon: 'book',
        title: { es: 'Bitácora y resumen', en: 'Log and summary' },
        tag: { es: 'EVIDENCIA', en: 'EVIDENCE' },
        summary: {
          es: 'Cada paso queda en la bitácora sin tipear nada, y cada lunes llega el resumen con el 100% de las alertas y su control.',
          en: 'Every step lands in the log with no typing, and every Monday the summary arrives with 100% of alerts and their controls.',
        },
        resilience: {
          es: 'Registros con hora y responsable que no se editan: listos para una fiscalización.',
          en: 'Timestamped records with an owner that cannot be edited: ready for an inspection.',
        },
        tech: 'PostgreSQL · Power BI',
        every: { es: 'Por alerta · lunes 07:00', en: 'Per alert · Mondays 07:00' },
        payload: json({ week: '2026-W39', alerts: 214, verified: 214, avg_ack_s: 41, pending: 0 }),
      },
    ],
    processes: [
      { name: 'fatigue-watcher', schedule: { es: 'cada 10 s', en: 'every 10 s' }, last: { es: 'hace 4 s', en: '4 s ago' } },
      { name: 'alert-escalator', schedule: { es: 'continuo', en: 'continuous' }, last: { es: 'ahora', en: 'now' } },
      { name: 'driver-notifier', schedule: { es: 'por alerta', en: 'per alert' }, last: { es: 'hace 2 min', en: '2 min ago' } },
      { name: 'weekly-report', schedule: { es: 'lunes 07:00', en: 'Mondays 07:00' }, last: { es: 'lunes', en: 'Monday' } },
    ],
    logs: [
      { proc: 'fatigue-watcher', level: 'info', text: { es: '46 equipos en ruta · sin eventos nuevos', en: '46 assets on the road · no new events' } },
      { proc: 'fatigue-watcher', level: 'warn', text: { es: 'FATIGUE_HIGH · TRUCK-12 · riesgo alto', en: 'FATIGUE_HIGH · TRUCK-12 · high risk' } },
      { proc: 'alert-escalator', level: 'info', text: { es: 'AL-2291 fijada en consola · 120 s para reconocer', en: 'AL-2291 pinned on console · 120 s to acknowledge' } },
      { proc: 'alert-escalator', level: 'ok', text: { es: 'AL-2291 reconocida por el operador en 38 s', en: 'AL-2291 acknowledged by the operator in 38 s' } },
      { proc: 'driver-notifier', level: 'ok', text: { es: 'Pausa activa entregada a TRUCK-12 · lectura confirmada', en: 'Active break sent to TRUCK-12 · read confirmed' } },
      { proc: 'weekly-report', level: 'ok', text: { es: 'Bitácora al día · 214/214 alertas con control registrado', en: 'Log up to date · 214/214 alerts with a recorded control' } },
    ],
  },

  mantenimiento: {
    intro: {
      es: 'Una antena que falla de madrugada: la orden de trabajo ya está creada cuando llega el turno de día.',
      en: 'An antenna fails before dawn: the work order already exists when the day shift arrives.',
    },
    clock: '02:40:10',
    steps: [
      {
        icon: 'satellite',
        title: { es: 'Telemetría de equipos', en: 'Asset telemetry' },
        tag: { es: 'ORIGEN', en: 'SOURCE' },
        summary: {
          es: 'Cada 30 minutos consulta el estado de GPS, módems satelitales y PLC de toda la flota.',
          en: 'Every 30 minutes it checks the GPS, satellite modems and PLCs of the whole fleet.',
        },
        resilience: {
          es: 'Un equipo que no responde se reintenta antes de declararlo caído, para no crear falsas alarmas.',
          en: 'An unresponsive asset is retried before being declared down, to avoid false alarms.',
        },
        tech: 'Python',
        every: { es: 'Cada 30 min', en: 'Every 30 min' },
        payload: json({ asset: 'REPEATER-07', gps: 'ok', sat_modem: 'no_signal', last_seen_min: 42 }),
      },
      {
        icon: 'scan',
        title: { es: 'Diagnóstico', en: 'Diagnosis' },
        tag: { es: 'REGLAS', en: 'RULES' },
        summary: {
          es: 'Cruza la falla con el historial: si es nueva, si ya hay una orden abierta y qué plan de tareas corresponde.',
          en: 'Checks the fault against history: whether it is new, whether an order is already open and which task plan applies.',
        },
        resilience: {
          es: 'Nunca crea dos órdenes para la misma falla.',
          en: 'It never creates two orders for the same fault.',
        },
        tech: 'Python · PostgreSQL',
        every: { es: 'Por falla', en: 'Per fault' },
        payload: json({ fault: 'antenna_no_signal', open_work_order: false, task_plan: 'TP-ANT-02', priority: 'high' }),
      },
      {
        icon: 'wrench',
        title: { es: 'Orden de trabajo', en: 'Work order' },
        tag: { es: 'CMMS', en: 'CMMS' },
        summary: {
          es: 'Crea la orden en tu sistema de mantenimiento con plan de tareas, equipo y ubicación.',
          en: 'Creates the order in your maintenance system with the task plan, asset and location.',
        },
        resilience: {
          es: 'Si el sistema no responde, la orden queda en cola y se reintenta. El aviso al técnico sale igual.',
          en: 'If the system does not answer, the order is queued and retried. The technician is notified anyway.',
        },
        tech: 'API REST',
        every: { es: 'Por falla nueva', en: 'Per new fault' },
        payload: json({ work_order: 'WO-5812', asset: 'REPEATER-07', tasks: 4, created_at: '02:41' }),
      },
      {
        icon: 'send',
        title: { es: 'Aviso al técnico', en: 'Technician notice' },
        tag: { es: 'TERRENO', en: 'FIELD' },
        summary: {
          es: 'El mantenedor recibe la orden por Telegram con ubicación y hora estimada de llegada del equipo.',
          en: 'The technician gets the order on Telegram with the location and estimated arrival of the asset.',
        },
        resilience: {
          es: 'Si nadie confirma en 30 minutos, avisa al supervisor.',
          en: 'If nobody confirms within 30 minutes, the supervisor is notified.',
        },
        tech: 'Telegram · WhatsApp',
        every: { es: 'Por orden', en: 'Per order' },
        payload: json({ to: 'day_shift_technician', work_order: 'WO-5812', location: 'tower 7 · north sector', eta: '07:30' }),
      },
      {
        icon: 'check',
        title: { es: 'Cierre verificado', en: 'Verified close' },
        tag: { es: 'INDICADORES', en: 'KPIS' },
        summary: {
          es: 'Cuando el equipo vuelve a reportar, la orden se marca verificada y entra a los indicadores.',
          en: 'When the asset reports again, the order is marked verified and feeds the KPIs.',
        },
        resilience: {
          es: 'Si la falla vuelve dentro de 24 horas, reabre la orden en vez de crear otra.',
          en: 'If the fault returns within 24 hours, it reopens the order instead of creating another.',
        },
        tech: 'Power BI',
        every: { es: 'Por orden', en: 'Per order' },
        payload: json({ work_order: 'WO-5812', status: 'verified', downtime_min: 312, repeat_24h: false }),
      },
    ],
    processes: [
      { name: 'telemetry-poll', schedule: { es: 'cada 30 min', en: 'every 30 min' }, last: { es: 'hace 12 min', en: '12 min ago' } },
      { name: 'wo-creator', schedule: { es: 'por falla', en: 'per fault' }, last: { es: '02:41', en: '02:41' } },
      { name: 'tech-notifier', schedule: { es: 'por orden', en: 'per order' }, last: { es: '02:41', en: '02:41' } },
      { name: 'remote-restart', schedule: { es: 'diario 04:00', en: 'daily 04:00' }, last: { es: 'hoy 04:00', en: 'today 04:00' } },
    ],
    logs: [
      { proc: 'telemetry-poll', level: 'info', text: { es: '118 equipos consultados · 117 en línea', en: '118 assets polled · 117 online' } },
      { proc: 'telemetry-poll', level: 'warn', text: { es: 'REPEATER-07 sin señal satelital hace 42 min', en: 'REPEATER-07 without satellite signal for 42 min' } },
      { proc: 'wo-creator', level: 'ok', text: { es: 'Falla nueva · WO-5812 creada con 4 tareas', en: 'New fault · WO-5812 created with 4 tasks' } },
      { proc: 'tech-notifier', level: 'ok', text: { es: 'Aviso enviado al turno de día · llegada 07:30', en: 'Notice sent to the day shift · arrival 07:30' } },
      { proc: 'remote-restart', level: 'ok', text: { es: 'Reinicio preventivo de 18 equipos · 18/18 respondieron', en: 'Preventive restart of 18 assets · 18/18 answered' } },
      { proc: 'telemetry-poll', level: 'ok', text: { es: 'REPEATER-07 vuelve a reportar · WO-5812 verificada', en: 'REPEATER-07 reporting again · WO-5812 verified' } },
    ],
  },

  operaciones: {
    intro: {
      es: 'De los registradores a bordo a un solo tablero: todas las reuniones miran el mismo número.',
      en: 'From on-board recorders to a single dashboard: every meeting looks at the same number.',
    },
    clock: '05:30:00',
    steps: [
      {
        icon: 'router',
        title: { es: 'Registradores de eventos', en: 'Event recorders' },
        tag: { es: 'ORIGEN', en: 'SOURCE' },
        summary: {
          es: 'Lee los archivos de los registradores a bordo, en 4 formatos distintos, junto con las posiciones GPS.',
          en: 'Reads the on-board recorder files, in 4 different formats, along with GPS positions.',
        },
        resilience: {
          es: 'Un archivo dañado se aparta en cuarentena sin detener el resto del lote.',
          en: 'A damaged file is quarantined without stopping the rest of the batch.',
        },
        tech: 'Python',
        every: { es: 'Cada hora', en: 'Hourly' },
        payload: json({ files: 128, formats: 4, positions: '1.2 M', quarantined: 1 }),
      },
      {
        icon: 'cpu',
        title: { es: 'Viajes y tramos', en: 'Trips and segments' },
        tag: { es: 'CÁLCULO', en: 'COMPUTE' },
        summary: {
          es: 'Arma cada viaje, lo divide por tramo y calcula plan versus real, estadías y eventos.',
          en: 'Builds each trip, splits it by segment and computes plan vs. actual, dwell times and events.',
        },
        resilience: {
          es: 'Los viajes incompletos no desaparecen del reporte: quedan marcados para revisión.',
          en: 'Incomplete trips do not vanish from the report: they are flagged for review.',
        },
        tech: 'Python · Polars',
        every: { es: 'Cada hora', en: 'Hourly' },
        payload: json({ trip: 'T-5039', segments: 4, plan_min: 182, actual_min: 201, late_segments: [2, 4] }),
      },
      {
        icon: 'database',
        title: { es: 'Base operacional', en: 'Operations database' },
        tag: { es: 'HISTORIAL', en: 'HISTORY' },
        summary: {
          es: 'Guarda viajes, tramos y eventos en una sola fuente, con historial completo.',
          en: 'Stores trips, segments and events in a single source, with full history.',
        },
        resilience: {
          es: 'Cargas transaccionales: si algo falla, no quedan datos a medias.',
          en: 'Transactional loads: if something fails, no half-written data is left behind.',
        },
        tech: 'PostgreSQL',
        every: { es: 'Cada hora', en: 'Hourly' },
        payload: json({ table: 'trip_segments', rows_inserted: 20156, load: 'ok' }),
      },
      {
        icon: 'dashboard',
        title: { es: 'Tablero único', en: 'Single dashboard' },
        tag: { es: 'GESTIÓN', en: 'MANAGEMENT' },
        summary: {
          es: 'El tablero se actualiza solo cada mañana. Todas las reuniones miran el mismo número.',
          en: 'The dashboard refreshes itself every morning. Every meeting looks at the same number.',
        },
        resilience: {
          es: 'Si la carga nocturna falla, el tablero muestra la fecha del último dato válido.',
          en: 'If the nightly load fails, the dashboard shows the date of the last valid data.',
        },
        tech: 'Power BI',
        every: { es: 'Diario 06:00', en: 'Daily 06:00' },
        payload: json({ dashboard: 'operations_cycles', refreshed: '06:05', trips: 5039, on_time: '87%' }),
      },
      {
        icon: 'file',
        title: { es: 'Informe por operador', en: 'Per-operator report' },
        tag: { es: 'SALIDA', en: 'OUTPUT' },
        summary: {
          es: 'Un PDF por operador con velocidades y excesos, enviado a su jefatura.',
          en: 'A PDF per operator with speeds and violations, sent to their manager.',
        },
        resilience: {
          es: 'Cada informe lleva fecha y versión, para que nadie discuta con uno antiguo.',
          en: 'Each report carries a date and version, so nobody argues over an old one.',
        },
        tech: 'Python · PDF',
        every: { es: 'Lunes 08:00', en: 'Mondays 08:00' },
        payload: json({ reports: 42, period: 'week 39', sent_to: 'managers', violations_flagged: 7 }),
      },
    ],
    processes: [
      { name: 'recorder-reader', schedule: { es: 'cada hora', en: 'hourly' }, last: { es: 'hace 18 min', en: '18 min ago' } },
      { name: 'trip-builder', schedule: { es: 'cada hora', en: 'hourly' }, last: { es: 'hace 16 min', en: '16 min ago' } },
      { name: 'bi-refresh', schedule: { es: 'diario 06:00', en: 'daily 06:00' }, last: { es: 'hoy 06:05', en: 'today 06:05' } },
      { name: 'operator-report', schedule: { es: 'lunes 08:00', en: 'Mondays 08:00' }, last: { es: 'lunes', en: 'Monday' } },
    ],
    logs: [
      { proc: 'recorder-reader', level: 'info', text: { es: '128 archivos leídos · 4 formatos · 1 en cuarentena', en: '128 files read · 4 formats · 1 quarantined' } },
      { proc: 'trip-builder', level: 'ok', text: { es: '5.039 viajes armados · 20.156 tramos', en: '5,039 trips built · 20,156 segments' } },
      { proc: 'trip-builder', level: 'warn', text: { es: 'Tramos 2 y 4 sobre el plan · T-5039 +19 min', en: 'Segments 2 and 4 over plan · T-5039 +19 min' } },
      { proc: 'bi-refresh', level: 'ok', text: { es: 'Tablero actualizado 06:05 · mismo número para todos', en: 'Dashboard refreshed 06:05 · same number for everyone' } },
      { proc: 'operator-report', level: 'ok', text: { es: '42 informes PDF enviados a jefaturas', en: '42 PDF reports sent to managers' } },
      { proc: 'recorder-reader', level: 'info', text: { es: 'Sin archivos nuevos · próximo ciclo en 60 min', en: 'No new files · next cycle in 60 min' } },
    ],
  },

  finanzas: {
    intro: {
      es: 'Una solicitud de compra, del formulario al documento contabilizado, sin digitar en el ERP.',
      en: 'A purchase request, from the form to the posted document, with no ERP typing.',
    },
    clock: '09:12:05',
    steps: [
      {
        icon: 'file',
        title: { es: 'Solicitud del área', en: 'Department request' },
        tag: { es: 'ORIGEN', en: 'SOURCE' },
        summary: {
          es: 'El solicitante completa un formulario web con los datos y adjunta los respaldos.',
          en: 'The requester fills in a web form and attaches the supporting documents.',
        },
        resilience: {
          es: 'Valida los campos obligatorios antes de aceptar la solicitud.',
          en: 'Required fields are validated before the request is accepted.',
        },
        tech: 'Formulario web',
        every: { es: 'Por solicitud', en: 'Per request' },
        payload: json({ request: 'REQ-354', type: 'service_entry_sheet', cost_center: 'CC-4410', amount: 1250000, attachments: 2 }),
      },
      {
        icon: 'calculator',
        title: { es: 'Validaciones', en: 'Validations' },
        tag: { es: 'REGLAS', en: 'RULES' },
        summary: {
          es: 'Revisa centro de costo, cuenta, montos y presupuesto disponible antes de tocar el ERP.',
          en: 'Checks cost center, account, amounts and available budget before touching the ERP.',
        },
        resilience: {
          es: 'Si algo no cuadra, devuelve la solicitud con el motivo en vez de grabar mal.',
          en: 'If something does not add up, it returns the request with the reason instead of posting it wrong.',
        },
        tech: 'Python',
        every: { es: 'Por solicitud', en: 'Per request' },
        payload: json({ cost_center: 'ok', account: 'ok', budget_available: true, warnings: 0 }),
      },
      {
        icon: 'cpu',
        title: { es: 'Bot en el ERP', en: 'ERP bot' },
        tag: { es: 'EJECUCIÓN', en: 'EXECUTION' },
        summary: {
          es: 'Crea la solicitud de pedido o la hoja de entrada, adjunta los respaldos y contabiliza la factura.',
          en: 'Creates the purchase requisition or entry sheet, attaches the backups and posts the invoice.',
        },
        resilience: {
          es: 'Guarda una captura de cada paso. Si la sesión expira, retoma desde el último paso confirmado.',
          en: 'Saves a screenshot of every step. If the session expires, it resumes from the last confirmed step.',
        },
        tech: 'SAP GUI Scripting',
        every: { es: 'Cola en horario hábil', en: 'Queue in business hours' },
        payload: json({ document: '4500012345', minutes: 1.5, screenshots: 6, status: 'posted' }),
      },
      {
        icon: 'wallet',
        title: { es: 'Control presupuestario', en: 'Budget control' },
        tag: { es: 'PLATAFORMA', en: 'PLATFORM' },
        summary: {
          es: 'La plataforma web muestra el presupuesto oficial, real y ajustado por área, ya con el documento nuevo.',
          en: 'The web platform shows official, actual and adjusted budget by department, including the new document.',
        },
        resilience: {
          es: 'Se sincroniza cada noche con el ERP y marca cualquier diferencia.',
          en: 'It syncs with the ERP every night and flags any difference.',
        },
        tech: 'Web · PostgreSQL',
        every: { es: 'Diario 02:00', en: 'Daily 02:00' },
        payload: {
          es: json({ area: 'Mantención', oficial: '100%', real: '61%', ajustado: '64%' }),
          en: json({ department: 'Maintenance', official: '100%', actual: '61%', adjusted: '64%' }),
        },
      },
      {
        icon: 'mail',
        title: { es: 'Aviso al solicitante', en: 'Requester notice' },
        tag: { es: 'SALIDA', en: 'OUTPUT' },
        summary: {
          es: 'El solicitante recibe el número de documento. Nadie pregunta por correo en qué va.',
          en: 'The requester gets the document number. Nobody emails to ask about the status.',
        },
        resilience: {
          es: 'El estado de cada solicitud queda visible en la plataforma para todos.',
          en: 'Every request status stays visible on the platform for everyone.',
        },
        tech: 'Correo · WhatsApp',
        every: { es: 'Por documento', en: 'Per document' },
        payload: json({ to: 'requester', request: 'REQ-354', document: '4500012345', status: 'done' }),
      },
    ],
    processes: [
      { name: 'request-intake', schedule: { es: 'continuo', en: 'continuous' }, last: { es: 'hace 3 min', en: '3 min ago' } },
      { name: 'erp-bot', schedule: { es: 'lun a vie 08–19', en: 'Mon–Fri 08–19' }, last: { es: 'ahora', en: 'now' } },
      { name: 'budget-sync', schedule: { es: 'diario 02:00', en: 'daily 02:00' }, last: { es: 'hoy 02:00', en: 'today 02:00' } },
      { name: 'requester-notifier', schedule: { es: 'por documento', en: 'per document' }, last: { es: 'hace 1 min', en: '1 min ago' } },
    ],
    logs: [
      { proc: 'request-intake', level: 'info', text: { es: 'REQ-354 recibida · 2 respaldos adjuntos', en: 'REQ-354 received · 2 attachments' } },
      { proc: 'request-intake', level: 'ok', text: { es: 'Centro de costo, cuenta y presupuesto validados', en: 'Cost center, account and budget validated' } },
      { proc: 'erp-bot', level: 'info', text: { es: 'Creando hoja de entrada · paso 4 de 6', en: 'Creating entry sheet · step 4 of 6' } },
      { proc: 'erp-bot', level: 'ok', text: { es: 'Documento 4500012345 contabilizado en 1,5 min', en: 'Document 4500012345 posted in 1.5 min' } },
      { proc: 'requester-notifier', level: 'ok', text: { es: 'Número de documento enviado al solicitante', en: 'Document number sent to the requester' } },
      { proc: 'budget-sync', level: 'info', text: { es: 'Real del área Mantención: 61% del presupuesto', en: 'Maintenance department actual: 61% of budget' } },
    ],
  },

  ia: {
    intro: {
      es: 'Mensajes y radio de un turno completo: todo se escucha, se clasifica y lo urgente llega a quien corresponde.',
      en: 'A full shift of messages and radio: everything is heard, classified, and the urgent part reaches the right person.',
    },
    clock: '03:14:08',
    steps: [
      {
        icon: 'message',
        title: { es: 'Canales de entrada', en: 'Input channels' },
        tag: { es: 'ORIGEN', en: 'SOURCE' },
        summary: {
          es: 'WhatsApp, correo y el audio de la radio llegan a una sola cola.',
          en: 'WhatsApp, email and radio audio arrive in a single queue.',
        },
        resilience: {
          es: 'Si un canal se corta, los mensajes esperan en cola y se procesan al volver.',
          en: 'If a channel drops, messages wait in the queue and are processed when it returns.',
        },
        tech: 'WhatsApp API · IMAP',
        every: { es: 'Tiempo real', en: 'Real time' },
        payload: json({ whatsapp: 37, email: 12, radio_minutes: 94, window: 'night shift' }),
      },
      {
        icon: 'mic',
        title: { es: 'Transcripción local', en: 'Local transcription' },
        tag: { es: 'VOZ A TEXTO', en: 'SPEECH TO TEXT' },
        summary: {
          es: 'El audio de la radio se transcribe con reconocimiento de voz que corre en tus servidores.',
          en: 'Radio audio is transcribed by speech recognition running on your own servers.',
        },
        resilience: {
          es: 'Nada sale de la empresa: el modelo es local y no envía audio a terceros.',
          en: 'Nothing leaves the company: the model is local and sends no audio to third parties.',
        },
        tech: 'Whisper local',
        every: { es: 'Por audio', en: 'Per clip' },
        payload: {
          es: json({ clip: 'radio_03:14', duration_s: 22, text: 'Unidad 12 solicita ingreso a zona de carga', confidence: 0.94 }),
          en: json({ clip: 'radio_03:14', duration_s: 22, text: 'Unit 12 requests entry to the loading area', confidence: 0.94 }),
        },
      },
      {
        icon: 'brain',
        title: { es: 'Clasificación con IA', en: 'AI classification' },
        tag: { es: 'AGENTE', en: 'AGENT' },
        summary: {
          es: 'Un agente clasifica cada mensaje en urgente, normal o informativo, y extrae equipo, lugar y responsable.',
          en: 'An agent classifies each message as urgent, normal or informational, and extracts asset, place and owner.',
        },
        resilience: {
          es: 'Si la confianza es baja, el mensaje pasa a revisión humana en vez de adivinar.',
          en: 'When confidence is low, the message goes to human review instead of guessing.',
        },
        tech: 'LLM local',
        every: { es: 'Por mensaje', en: 'Per message' },
        payload: {
          es: json({ message: 'WA-8812', class: 'urgente', asset: 'bomba 3', location: 'planta sur', confidence: 0.91 }),
          en: json({ message: 'WA-8812', class: 'urgent', asset: 'pump 3', location: 'south plant', confidence: 0.91 }),
        },
      },
      {
        icon: 'shield',
        title: { es: 'Chequeo de protocolo', en: 'Protocol check' },
        tag: { es: 'AUDITORÍA', en: 'AUDIT' },
        summary: {
          es: 'Revisa que cada comunicación de radio cumpla el protocolo: identificación, confirmación y cierre.',
          en: 'Checks each radio call follows the protocol: identification, read-back and closure.',
        },
        resilience: {
          es: 'Audita el 100% de las comunicaciones, no una muestra después de un incidente.',
          en: 'Audits 100% of calls, not a sample after an incident.',
        },
        tech: 'Reglas + IA',
        every: { es: 'Por audio', en: 'Per clip' },
        payload: json({ clip: 'radio_03:14', identified: true, read_back: true, closure: true, compliant: true }),
      },
      {
        icon: 'send',
        title: { es: 'Ticket y aviso', en: 'Ticket and notice' },
        tag: { es: 'SALIDA', en: 'OUTPUT' },
        summary: {
          es: 'Lo urgente se convierte en ticket y llega al técnico. El resto queda ordenado en el tablero del supervisor.',
          en: "Urgent items become a ticket and reach the technician. The rest stays sorted on the supervisor's board.",
        },
        resilience: {
          es: 'Si el técnico no confirma, se reenvía y se avisa al supervisor.',
          en: 'If the technician does not confirm, it is resent and the supervisor is notified.',
        },
        tech: 'Tablero web · Telegram',
        every: { es: 'Por mensaje urgente', en: 'Per urgent message' },
        payload: json({ ticket: 'TK-1207', to: 'shift_technician', priority: 'urgent', sent_after_s: 9 }),
      },
    ],
    processes: [
      { name: 'inbox-listener', schedule: { es: 'continuo', en: 'continuous' }, last: { es: 'ahora', en: 'now' } },
      { name: 'speech-to-text', schedule: { es: 'por audio', en: 'per clip' }, last: { es: 'hace 6 s', en: '6 s ago' } },
      { name: 'classifier-agent', schedule: { es: 'por mensaje', en: 'per message' }, last: { es: 'hace 2 s', en: '2 s ago' } },
      { name: 'protocol-audit', schedule: { es: 'por audio', en: 'per clip' }, last: { es: 'hace 6 s', en: '6 s ago' } },
    ],
    logs: [
      { proc: 'inbox-listener', level: 'info', text: { es: '12 mensajes nuevos en la cola', en: '12 new messages in the queue' } },
      { proc: 'classifier-agent', level: 'warn', text: { es: 'WA-8812 urgente · bomba 3 · planta sur', en: 'WA-8812 urgent · pump 3 · south plant' } },
      { proc: 'classifier-agent', level: 'ok', text: { es: 'TK-1207 enviado al técnico de turno en 9 s', en: 'TK-1207 sent to the shift technician in 9 s' } },
      { proc: 'speech-to-text', level: 'info', text: { es: 'radio_03:14 transcrito · 22 s · confianza 0,94', en: 'radio_03:14 transcribed · 22 s · confidence 0.94' } },
      { proc: 'protocol-audit', level: 'ok', text: { es: 'Identificación, confirmación y cierre: cumple', en: 'Identification, read-back and closure: compliant' } },
      { proc: 'classifier-agent', level: 'info', text: { es: '11 mensajes restantes: 4 normales, 7 informativos', en: '11 remaining messages: 4 normal, 7 informational' } },
    ],
  },

  'datos-web': {
    intro: {
      es: 'Mil quinientos formularios en un portal del Estado, cargados en paralelo mientras el equipo hace otra cosa.',
      en: 'Fifteen hundred forms on a government portal, uploaded in parallel while the team does something else.',
    },
    clock: '10:02:00',
    steps: [
      {
        icon: 'layers',
        title: { es: 'Planilla de origen', en: 'Source spreadsheet' },
        tag: { es: 'ORIGEN', en: 'SOURCE' },
        summary: {
          es: 'Los datos vienen de planillas y del sistema interno. Se normalizan y validan antes de subir nada.',
          en: 'Data comes from spreadsheets and the internal system. It is normalized and validated before anything is uploaded.',
        },
        resilience: {
          es: 'Las filas con errores se apartan para revisión y no frenan el resto.',
          en: 'Rows with errors are set aside for review and do not hold up the rest.',
        },
        tech: 'Python',
        every: { es: 'Por lote', en: 'Per batch' },
        payload: json({ rows: 1500, valid: 1497, to_review: 3 }),
      },
      {
        icon: 'globe',
        title: { es: 'Bot en el portal', en: 'Portal bot' },
        tag: { es: 'CARGA', en: 'UPLOAD' },
        summary: {
          es: 'Varias sesiones en paralelo completan los formularios del portal, uno por fila, y guardan el comprobante.',
          en: 'Several parallel sessions fill in the portal forms, one per row, and keep the receipt.',
        },
        resilience: {
          es: 'Si el portal se cae o cambia un campo, el bot pausa, avisa y retoma donde quedó.',
          en: 'If the portal goes down or a field changes, the bot pauses, alerts and resumes where it left off.',
        },
        tech: 'Playwright',
        every: { es: '6 sesiones en paralelo', en: '6 parallel sessions' },
        payload: json({ sessions: 6, submitted: 1500, receipts: 1500, avg_s_per_form: 14 }),
      },
      {
        icon: 'database',
        title: { es: 'Comprobantes', en: 'Receipts' },
        tag: { es: 'REGISTRO', en: 'RECORD' },
        summary: {
          es: 'Cada comprobante se guarda con su folio, enlazado a la fila original.',
          en: 'Each receipt is stored with its reference number, linked to the original row.',
        },
        resilience: {
          es: 'Nada se carga dos veces: el folio se revisa antes de cada envío.',
          en: 'Nothing is uploaded twice: the reference is checked before each submission.',
        },
        tech: 'PostgreSQL',
        every: { es: 'Por formulario', en: 'Per form' },
        payload: json({ reference: 'F-001499', row: 1499, pdf: 'receipt_001499.pdf' }),
      },
      {
        icon: 'news',
        title: { es: 'Newsletter segmentado', en: 'Segmented newsletter' },
        tag: { es: 'COMUNICACIÓN', en: 'OUTREACH' },
        summary: {
          es: 'Con los datos al día, se arma y envía el newsletter para cada segmento.',
          en: 'With the data up to date, the newsletter is built and sent for each segment.',
        },
        resilience: {
          es: 'Rebotes y bajas se excluyen solos del siguiente envío.',
          en: 'Bounces and unsubscribes are excluded from the next send automatically.',
        },
        tech: 'Plantillas · envío masivo',
        every: { es: 'Semanal', en: 'Weekly' },
        payload: json({ segments: 5, recipients: 48210, bounced: '0.4%' }),
      },
      {
        icon: 'dashboard',
        title: { es: 'Tablero de avance', en: 'Progress board' },
        tag: { es: 'SEGUIMIENTO', en: 'TRACKING' },
        summary: {
          es: 'Un tablero muestra en vivo cuántos van, cuántos faltan y cuáles necesitan revisión.',
          en: 'A board shows live how many are done, how many remain and which need review.',
        },
        resilience: {
          es: 'Si el avance se detiene, avisa antes de que alguien lo note tarde.',
          en: 'If progress stalls, it raises an alert before anyone notices too late.',
        },
        tech: 'Dashboard web',
        every: { es: 'Tiempo real', en: 'Real time' },
        payload: json({ done: 1500, pending: 0, to_review: 3, finished_at: 'Friday 16:40' }),
      },
    ],
    processes: [
      { name: 'sheet-validator', schedule: { es: 'por lote', en: 'per batch' }, last: { es: 'hoy 10:00', en: 'today 10:00' } },
      { name: 'portal-bot ×6', schedule: { es: 'en paralelo', en: 'in parallel' }, last: { es: 'ahora', en: 'now' } },
      { name: 'receipt-archiver', schedule: { es: 'por formulario', en: 'per form' }, last: { es: 'hace 2 s', en: '2 s ago' } },
      { name: 'newsletter-sender', schedule: { es: 'semanal', en: 'weekly' }, last: { es: 'viernes', en: 'Friday' } },
    ],
    logs: [
      { proc: 'sheet-validator', level: 'info', text: { es: '1.500 filas · 1.497 válidas · 3 a revisión', en: '1,500 rows · 1,497 valid · 3 to review' } },
      { proc: 'portal-bot ×6', level: 'info', text: { es: '6 sesiones abiertas en el portal', en: '6 portal sessions open' } },
      { proc: 'portal-bot ×6', level: 'warn', text: { es: 'Portal lento · pausa de 30 s y reintento', en: 'Portal slow · 30 s pause and retry' } },
      { proc: 'receipt-archiver', level: 'ok', text: { es: 'F-001499 guardado y enlazado a la fila 1.499', en: 'F-001499 stored and linked to row 1,499' } },
      { proc: 'portal-bot ×6', level: 'ok', text: { es: '1.500 de 1.500 formularios enviados', en: '1,500 of 1,500 forms submitted' } },
      { proc: 'newsletter-sender', level: 'ok', text: { es: 'Newsletter enviado a 5 segmentos · 48.210 destinatarios', en: 'Newsletter sent to 5 segments · 48,210 recipients' } },
    ],
  },
};
