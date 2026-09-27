// "How it runs" for each service area: a generic process any company can recognize,
// each step as a simple in -> does -> out diagram, with the real case as an example and
// its technical detail on demand. Illustrative data: names, amounts and assets are
// fictitious and nothing identifies an employer, vendor or location.
import type { Bilingual } from './cases';

export type OpsIcon =
  | 'radar' | 'bell' | 'monitor' | 'tablet' | 'book' | 'database' | 'cpu' | 'chart' | 'message'
  | 'mic' | 'brain' | 'wrench' | 'file' | 'mail' | 'globe' | 'satellite' | 'check' | 'send'
  | 'layers' | 'shield' | 'router' | 'calculator' | 'wallet' | 'scan' | 'dashboard' | 'news'
  | 'eye' | 'pin' | 'alert' | 'listcheck' | 'alarm' | 'hourglass' | 'usercheck' | 'phone'
  | 'checkcircle' | 'list' | 'report' | 'users' | 'inbox';

/** One box of the step diagram: an icon and a short phrase. */
export interface OpsNode {
  icon: OpsIcon;
  text: Bilingual;
}

export interface OpsStep {
  /** Generic verb for the step (applies to any company). */
  name: Bilingual;
  /** Animated illustration: a key of STEP_ICONS (components/sections/services/StepIcons.tsx). */
  art: string;
  input: OpsNode;
  action: OpsNode;
  output: OpsNode;
  /** How the step copes when something fails, in one line. */
  fail: Bilingual;
  /** The business benefit, in plain words. */
  why: Bilingual;
  /** Technical detail from the real example: the component behind the step. */
  title: Bilingual;
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
  /** Generic process shown to visitors, e.g. "How a critical alert runs". */
  process: Bilingual;
  appliesTo: Bilingual;
  /** The real case behind it, shown as an example. */
  example: Bilingual;
  /** Time shown on the first console line; later lines advance from it. */
  clock: string;
  steps: OpsStep[];
  processes: OpsProcess[];
  logs: OpsLog[];
}

const json = (o: unknown) => JSON.stringify(o, null, 2);

export const areaOps: Record<string, AreaOps> = {
  seguridad: {
    process: { es: 'Así opera una alerta crítica', en: 'How a critical alert runs' },
    appliesTo: { es: 'Sirve para fatiga, gases, exceso de velocidad o cualquier evento que no puede esperar.', en: 'Works for fatigue, gas, speeding or any event that can\'t wait.' },
    example: { es: 'una alerta de fatiga en un camión a las 02:10', en: 'a fatigue alert on a truck at 02:10' },
    clock: '02:10:02',
    steps: [
      {
        name: { es: 'Detectar', en: 'Detect' },
        art: 'detect',
        input: { icon: 'radar', text: { es: 'Un evento desde un sensor, sistema o formulario', en: 'An event from a sensor, system or form' } },
        action: { icon: 'eye', text: { es: 'Lo capta al instante, sin que nadie esté mirando', en: 'Catches it instantly, with nobody watching' } },
        output: { icon: 'pin', text: { es: 'El evento con qué, dónde y cuándo', en: 'The event with what, where and when' } },
        fail: { es: 'Si la fuente no responde, consulta un respaldo.', en: 'If the source doesn\'t answer, it checks a backup.' },
        why: { es: 'Ninguna alerta depende de que alguien esté mirando la pantalla en ese minuto.', en: 'No alert depends on someone watching the screen at that minute.' },
        title: { es: 'Sensor de fatiga en cabina', en: 'In-cab fatigue sensor' },
        tech: 'API / webhook',
        every: { es: 'Tiempo real', en: 'Real time' },
        payload: json({ event: 'FATIGUE_HIGH', unit: 'TRUCK-12', driver: 'OP-0448', risk: 'high', ts: '02:10:02' }),
      },
      {
        name: { es: 'Clasificar', en: 'Classify' },
        art: 'classify',
        input: { icon: 'alert', text: { es: 'El evento detectado', en: 'The detected event' } },
        action: { icon: 'listcheck', text: { es: 'Aplica tu protocolo: gravedad y responsable', en: 'Applies your protocol: severity and owner' } },
        output: { icon: 'alarm', text: { es: 'Una alerta con prioridad y plazo', en: 'An alert with priority and deadline' } },
        fail: { es: 'Si no calza con ninguna regla, pasa a revisión humana.', en: 'If it matches no rule, it goes to human review.' },
        why: { es: 'La misma regla para todos los turnos, escrita una vez y aplicada siempre.', en: 'The same rule for every shift, written once and always applied.' },
        title: { es: 'Motor de alertas', en: 'Alert engine' },
        tech: 'Python',
        every: { es: 'Continuo', en: 'Continuous' },
        payload: json({ alert_id: 'AL-2291', protocol: 'fatigue_level_2', ack_deadline_s: 120, escalation: ['operator', 'supervisor'] }),
      },
      {
        name: { es: 'Avisar', en: 'Notify' },
        art: 'notify',
        input: { icon: 'bell', text: { es: 'La alerta con su plazo', en: 'The alert and its deadline' } },
        action: { icon: 'hourglass', text: { es: 'Avisa al responsable y cuenta el tiempo', en: 'Notifies the owner and counts the time' } },
        output: { icon: 'usercheck', text: { es: 'Alguien se hace cargo', en: 'Someone takes charge' } },
        fail: { es: 'Si nadie responde a tiempo, sube al supervisor.', en: 'If nobody answers in time, it goes up to the supervisor.' },
        why: { es: 'El sistema insiste hasta que una persona se hace cargo. No se pierde entre turnos.', en: 'The system insists until a person takes charge. Nothing is lost between shifts.' },
        title: { es: 'Consola de control', en: 'Control console' },
        tech: 'Dashboard web',
        every: { es: 'Tiempo real', en: 'Real time' },
        payload: json({ alert_id: 'AL-2291', ack_by: 'night_shift_operator', ack_after_s: 38, action: 'radio_contact' }),
      },
      {
        name: { es: 'Confirmar', en: 'Confirm' },
        art: 'confirm',
        input: { icon: 'message', text: { es: 'La instrucción para terreno', en: 'The instruction for the field' } },
        action: { icon: 'phone', text: { es: 'Llega a quien está en terreno y pide confirmación', en: 'Reaches whoever is in the field and asks for confirmation' } },
        output: { icon: 'checkcircle', text: { es: 'La acción confirmada', en: 'The action, confirmed' } },
        fail: { es: 'Sin confirmación, se repite por otro canal.', en: 'Without confirmation, it repeats through another channel.' },
        why: { es: 'Sabes que la instrucción llegó y se cumplió, no solo que se envió.', en: 'You know the instruction arrived and was followed, not just that it was sent.' },
        title: { es: 'Aviso al conductor', en: 'Driver notice' },
        tech: 'App móvil',
        every: { es: 'Por alerta', en: 'Per alert' },
        payload: json({ unit: 'TRUCK-12', instruction: 'active_break_15_min', read_confirmed: true, stop_at: 'km 84' }),
      },
      {
        name: { es: 'Registrar', en: 'Record' },
        art: 'record',
        input: { icon: 'list', text: { es: 'Todo lo anterior', en: 'Everything above' } },
        action: { icon: 'book', text: { es: 'Guarda cada paso con hora y responsable', en: 'Stores every step with time and owner' } },
        output: { icon: 'report', text: { es: 'Reporte periódico y evidencia lista', en: 'Regular report and ready evidence' } },
        fail: { es: 'Los registros no se pueden editar.', en: 'Records cannot be edited.' },
        why: { es: 'Ante una fiscalización, la evidencia ya está armada.', en: 'When an inspection comes, the evidence is already there.' },
        title: { es: 'Bitácora y resumen', en: 'Log and summary' },
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
    process: { es: 'Así se atiende una falla sin que nadie la reporte', en: 'How a failure gets handled without anyone reporting it' },
    appliesTo: { es: 'Sirve para flotas, equipos de red, bombas, generadores o cualquier activo que informe su estado.', en: 'Works for fleets, network gear, pumps, generators or any asset that reports its status.' },
    example: { es: 'una antena que falla de madrugada', en: 'an antenna failing before dawn' },
    clock: '02:40:10',
    steps: [
      {
        name: { es: 'Monitorear', en: 'Monitor' },
        art: 'monitor',
        input: { icon: 'satellite', text: { es: 'El estado de cada equipo: GPS, sensores, PLC', en: 'Every asset status: GPS, sensors, PLCs' } },
        action: { icon: 'radar', text: { es: 'Revisa toda la flota cada pocos minutos', en: 'Checks the whole fleet every few minutes' } },
        output: { icon: 'alert', text: { es: 'La falla detectada, con equipo y hora', en: 'The detected fault, with asset and time' } },
        fail: { es: 'Reintenta antes de declarar una falla, para no crear falsas alarmas.', en: 'It retries before declaring a fault, to avoid false alarms.' },
        why: { es: 'Las fallas aparecen aunque ocurran de noche o en fin de semana.', en: 'Failures show up even at night or on weekends.' },
        title: { es: 'Telemetría de equipos', en: 'Asset telemetry' },
        tech: 'Python',
        every: { es: 'Cada 30 min', en: 'Every 30 min' },
        payload: json({ asset: 'REPEATER-07', gps: 'ok', sat_modem: 'no_signal', last_seen_min: 42 }),
      },
      {
        name: { es: 'Diagnosticar', en: 'Diagnose' },
        art: 'diagnose',
        input: { icon: 'alert', text: { es: 'La falla detectada', en: 'The detected fault' } },
        action: { icon: 'scan', text: { es: 'La cruza con el historial y el plan de tareas', en: 'Checks it against history and the task plan' } },
        output: { icon: 'listcheck', text: { es: 'Qué hacer y con qué prioridad', en: 'What to do and how urgently' } },
        fail: { es: 'Nunca crea dos órdenes para la misma falla.', en: 'It never creates two orders for the same fault.' },
        why: { es: 'Sin órdenes duplicadas ni olvidadas.', en: 'No duplicated or forgotten orders.' },
        title: { es: 'Diagnóstico', en: 'Diagnosis' },
        tech: 'Python · PostgreSQL',
        every: { es: 'Por falla', en: 'Per fault' },
        payload: json({ fault: 'antenna_no_signal', open_work_order: false, task_plan: 'TP-ANT-02', priority: 'high' }),
      },
      {
        name: { es: 'Crear la orden', en: 'Create the order' },
        art: 'workorder',
        input: { icon: 'listcheck', text: { es: 'El diagnóstico', en: 'The diagnosis' } },
        action: { icon: 'wrench', text: { es: 'Crea la orden en tu sistema de mantenimiento', en: 'Creates the order in your maintenance system' } },
        output: { icon: 'file', text: { es: 'Orden con tareas, equipo y ubicación', en: 'An order with tasks, asset and location' } },
        fail: { es: 'Si el sistema no responde, la orden queda en cola.', en: 'If the system doesn\'t answer, the order waits in a queue.' },
        why: { es: 'La orden existe antes de que alguien llegue a la oficina.', en: 'The order exists before anyone reaches the office.' },
        title: { es: 'Orden de trabajo', en: 'Work order' },
        tech: 'API REST',
        every: { es: 'Por falla nueva', en: 'Per new fault' },
        payload: json({ work_order: 'WO-5812', asset: 'REPEATER-07', tasks: 4, created_at: '02:41' }),
      },
      {
        name: { es: 'Asignar', en: 'Assign' },
        art: 'assign',
        input: { icon: 'file', text: { es: 'La orden de trabajo', en: 'The work order' } },
        action: { icon: 'send', text: { es: 'Avisa al técnico por Telegram o WhatsApp', en: 'Notifies the technician on Telegram or WhatsApp' } },
        output: { icon: 'usercheck', text: { es: 'Técnico con ubicación y hora de llegada', en: 'A technician with location and arrival time' } },
        fail: { es: 'Si nadie confirma, avisa al supervisor.', en: 'If nobody confirms, the supervisor is notified.' },
        why: { es: 'El técnico sale con toda la información, sin llamadas de por medio.', en: 'The technician heads out with everything, no phone calls needed.' },
        title: { es: 'Aviso al técnico', en: 'Technician notice' },
        tech: 'Telegram · WhatsApp',
        every: { es: 'Por orden', en: 'Per order' },
        payload: json({ to: 'day_shift_technician', work_order: 'WO-5812', location: 'tower 7 · north sector', eta: '07:30' }),
      },
      {
        name: { es: 'Verificar', en: 'Verify' },
        art: 'verify',
        input: { icon: 'wrench', text: { es: 'El equipo reparado', en: 'The repaired asset' } },
        action: { icon: 'radar', text: { es: 'Confirma que el equipo vuelve a reportar', en: 'Confirms the asset reports again' } },
        output: { icon: 'report', text: { es: 'Orden cerrada e indicadores al día', en: 'Order closed and KPIs up to date' } },
        fail: { es: 'Si la falla vuelve, reabre la orden.', en: 'If the fault returns, it reopens the order.' },
        why: { es: 'Sabes que quedó resuelto, no solo que alguien fue.', en: 'You know it was fixed, not just that someone went.' },
        title: { es: 'Cierre verificado', en: 'Verified close' },
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
    process: { es: 'Así se arma un indicador confiable', en: 'How a reliable KPI gets built' },
    appliesTo: { es: 'Sirve para tiempos de ciclo, productividad, consumo o cualquier número que hoy se arma a mano.', en: 'Works for cycle times, productivity, consumption or any figure built by hand today.' },
    example: { es: 'todos los viajes, con plan versus real por tramo', en: 'every trip, with plan vs. actual per segment' },
    clock: '05:30:00',
    steps: [
      {
        name: { es: 'Recolectar', en: 'Collect' },
        art: 'collect',
        input: { icon: 'router', text: { es: 'Archivos, GPS y registros de cada equipo', en: 'Files, GPS and logs from every asset' } },
        action: { icon: 'layers', text: { es: 'Los reúne sin importar su formato', en: 'Brings them together whatever the format' } },
        output: { icon: 'database', text: { es: 'Todos los datos en un solo lugar', en: 'All the data in one place' } },
        fail: { es: 'Un archivo dañado se aparta sin frenar el resto.', en: 'A damaged file is set aside without stopping the rest.' },
        why: { es: 'Nadie tiene que buscar ni copiar archivos.', en: 'Nobody has to hunt for or copy files.' },
        title: { es: 'Registradores de eventos', en: 'Event recorders' },
        tech: 'Python',
        every: { es: 'Cada hora', en: 'Hourly' },
        payload: json({ files: 128, formats: 4, positions: '1.2 M', quarantined: 1 }),
      },
      {
        name: { es: 'Calcular', en: 'Compute' },
        art: 'compute',
        input: { icon: 'database', text: { es: 'Los datos reunidos', en: 'The collected data' } },
        action: { icon: 'cpu', text: { es: 'Calcula plan versus real, tiempos y eventos', en: 'Computes plan vs. actual, times and events' } },
        output: { icon: 'chart', text: { es: 'Indicadores por tramo, equipo y operador', en: 'KPIs by segment, asset and operator' } },
        fail: { es: 'Lo incompleto se marca, no desaparece.', en: 'Incomplete records are flagged, they don\'t vanish.' },
        why: { es: 'El cálculo es el mismo todos los días, sin errores de copia.', en: 'The calculation is the same every day, with no copy errors.' },
        title: { es: 'Viajes y tramos', en: 'Trips and segments' },
        tech: 'Python · Polars',
        every: { es: 'Cada hora', en: 'Hourly' },
        payload: json({ trip: 'T-5039', segments: 4, plan_min: 182, actual_min: 201, late_segments: [2, 4] }),
      },
      {
        name: { es: 'Consolidar', en: 'Consolidate' },
        art: 'database',
        input: { icon: 'chart', text: { es: 'Los indicadores', en: 'The KPIs' } },
        action: { icon: 'database', text: { es: 'Los guarda con su historial completo', en: 'Stores them with full history' } },
        output: { icon: 'layers', text: { es: 'Una sola fuente para toda la empresa', en: 'One source for the whole company' } },
        fail: { es: 'Si la carga falla, no quedan datos a medias.', en: 'If a load fails, no half-written data is left.' },
        why: { es: 'Todos parten del mismo dato.', en: 'Everyone starts from the same data.' },
        title: { es: 'Base operacional', en: 'Operations database' },
        tech: 'PostgreSQL',
        every: { es: 'Cada hora', en: 'Hourly' },
        payload: json({ table: 'trip_segments', rows_inserted: 20156, load: 'ok' }),
      },
      {
        name: { es: 'Publicar', en: 'Publish' },
        art: 'dashboard',
        input: { icon: 'database', text: { es: 'La fuente única', en: 'The single source' } },
        action: { icon: 'dashboard', text: { es: 'Actualiza el tablero cada mañana', en: 'Refreshes the dashboard every morning' } },
        output: { icon: 'users', text: { es: 'El mismo número en cada reunión', en: 'The same number in every meeting' } },
        fail: { es: 'Si algo falla, muestra la fecha del último dato válido.', en: 'If something fails, it shows the date of the last valid data.' },
        why: { es: 'Las reuniones discuten decisiones, no qué planilla está bien.', en: 'Meetings discuss decisions, not which spreadsheet is right.' },
        title: { es: 'Tablero único', en: 'Single dashboard' },
        tech: 'Power BI',
        every: { es: 'Diario 06:00', en: 'Daily 06:00' },
        payload: json({ dashboard: 'operations_cycles', refreshed: '06:05', trips: 5039, on_time: '87%' }),
      },
      {
        name: { es: 'Distribuir', en: 'Distribute' },
        art: 'distribute',
        input: { icon: 'dashboard', text: { es: 'El tablero actualizado', en: 'The updated dashboard' } },
        action: { icon: 'file', text: { es: 'Genera un informe por operador o área', en: 'Builds a report per operator or department' } },
        output: { icon: 'mail', text: { es: 'Cada jefatura recibe el suyo', en: 'Each manager gets theirs' } },
        fail: { es: 'Cada informe lleva fecha y versión.', en: 'Each report carries a date and version.' },
        why: { es: 'La información llega sola a quien la necesita.', en: 'Information reaches whoever needs it on its own.' },
        title: { es: 'Informe por operador', en: 'Per-operator report' },
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
    process: { es: 'Así se procesa una solicitud de compra', en: 'How a purchase request gets processed' },
    appliesTo: { es: 'Sirve para solicitudes de pedido, hojas de servicio, facturas o cualquier documento que hoy se digita en el ERP.', en: 'Works for purchase requisitions, service sheets, invoices or any document typed into the ERP today.' },
    example: { es: 'una hoja de entrada de servicios hecha por el bot', en: 'a service entry sheet done by the bot' },
    clock: '09:12:05',
    steps: [
      {
        name: { es: 'Solicitar', en: 'Request' },
        art: 'request',
        input: { icon: 'users', text: { es: 'Alguien que necesita comprar o pagar', en: 'Someone who needs to buy or pay' } },
        action: { icon: 'file', text: { es: 'Llena un formulario simple y adjunta respaldos', en: 'Fills in a simple form and attaches backups' } },
        output: { icon: 'inbox', text: { es: 'La solicitud completa', en: 'The complete request' } },
        fail: { es: 'No acepta la solicitud si falta algo.', en: 'It won\'t accept a request with missing data.' },
        why: { es: 'Nadie tiene que saber usar el ERP para pedir algo.', en: 'Nobody needs to know the ERP to ask for something.' },
        title: { es: 'Solicitud del área', en: 'Department request' },
        tech: 'Formulario web',
        every: { es: 'Por solicitud', en: 'Per request' },
        payload: json({ request: 'REQ-354', type: 'service_entry_sheet', cost_center: 'CC-4410', amount: 1250000, attachments: 2 }),
      },
      {
        name: { es: 'Validar', en: 'Validate' },
        art: 'validate',
        input: { icon: 'inbox', text: { es: 'La solicitud', en: 'The request' } },
        action: { icon: 'calculator', text: { es: 'Revisa centro de costo, cuenta, montos y presupuesto', en: 'Checks cost center, account, amounts and budget' } },
        output: { icon: 'checkcircle', text: { es: 'Lista para grabar', en: 'Ready to post' } },
        fail: { es: 'Si algo no cuadra, la devuelve con el motivo.', en: 'If something doesn\'t add up, it sends it back with the reason.' },
        why: { es: 'Los errores se detectan antes de grabar, no en el cierre.', en: 'Errors are caught before posting, not at month-end.' },
        title: { es: 'Validaciones', en: 'Validations' },
        tech: 'Python',
        every: { es: 'Por solicitud', en: 'Per request' },
        payload: json({ cost_center: 'ok', account: 'ok', budget_available: true, warnings: 0 }),
      },
      {
        name: { es: 'Ejecutar en el ERP', en: 'Run in the ERP' },
        art: 'bot',
        input: { icon: 'checkcircle', text: { es: 'La solicitud validada', en: 'The validated request' } },
        action: { icon: 'cpu', text: { es: 'El bot la graba en el ERP y adjunta los respaldos', en: 'The bot posts it in the ERP and attaches the backups' } },
        output: { icon: 'file', text: { es: 'El documento creado, con su número', en: 'The document created, with its number' } },
        fail: { es: 'Si la sesión se corta, retoma desde el último paso.', en: 'If the session drops, it resumes from the last step.' },
        why: { es: 'Cada documento toma una fracción del tiempo, sin digitar.', en: 'Each document takes a fraction of the time, with no typing.' },
        title: { es: 'Bot en el ERP', en: 'ERP bot' },
        tech: 'SAP GUI Scripting',
        every: { es: 'Cola en horario hábil', en: 'Queue in business hours' },
        payload: json({ document: '4500012345', minutes: 1.5, screenshots: 6, status: 'posted' }),
      },
      {
        name: { es: 'Controlar el presupuesto', en: 'Control the budget' },
        art: 'budget',
        input: { icon: 'file', text: { es: 'El documento creado', en: 'The new document' } },
        action: { icon: 'wallet', text: { es: 'Lo suma al presupuesto real del área', en: 'Adds it to the department\'s actual budget' } },
        output: { icon: 'dashboard', text: { es: 'Oficial, real y ajustado en una pantalla', en: 'Official, actual and adjusted on one screen' } },
        fail: { es: 'Se cuadra cada noche con el ERP.', en: 'It is reconciled with the ERP every night.' },
        why: { es: 'El presupuesto real está a la vista, sin armar planillas.', en: 'The real budget is in plain sight, without spreadsheets.' },
        title: { es: 'Control presupuestario', en: 'Budget control' },
        tech: 'Web · PostgreSQL',
        every: { es: 'Diario 02:00', en: 'Daily 02:00' },
        payload: {
          es: json({ area: 'Mantención', oficial: '100%', real: '61%', ajustado: '64%' }),
          en: json({ department: 'Maintenance', official: '100%', actual: '61%', adjusted: '64%' }),
        },
      },
      {
        name: { es: 'Notificar', en: 'Notify' },
        art: 'message',
        input: { icon: 'dashboard', text: { es: 'El estado de la solicitud', en: 'The request status' } },
        action: { icon: 'mail', text: { es: 'Avisa al solicitante con el número de documento', en: 'Tells the requester the document number' } },
        output: { icon: 'usercheck', text: { es: 'El solicitante informado', en: 'The requester, informed' } },
        fail: { es: 'El estado queda visible para todos en la plataforma.', en: 'The status stays visible to everyone on the platform.' },
        why: { es: 'Nadie pregunta por correo en qué va su solicitud.', en: 'Nobody emails to ask about their request.' },
        title: { es: 'Aviso al solicitante', en: 'Requester notice' },
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
    process: { es: 'Así se anticipa una falla', en: 'How a failure gets anticipated' },
    appliesTo: { es: 'Sirve para rodamientos, motores, bombas, demanda o cualquier comportamiento que deja señales antes de fallar.', en: 'Works for bearings, motors, pumps, demand or any behavior that leaves signs before it fails.' },
    example: { es: 'un rodamiento desgastado, detectado días antes de fallar', en: 'a worn bearing, spotted days before it failed' },
    clock: '06:00:00',
    steps: [
      {
        name: { es: 'Medir', en: 'Measure' },
        art: 'measure',
        input: { icon: 'radar', text: { es: 'Vibración, temperatura o consumo de cada equipo', en: 'Vibration, temperature or consumption of every asset' } },
        action: { icon: 'database', text: { es: 'Registra las señales de forma continua', en: 'Records the signals continuously' } },
        output: { icon: 'chart', text: { es: 'El historial de cada equipo', en: 'Each asset\'s history' } },
        fail: { es: 'El dato faltante se marca, no se inventa.', en: 'Missing data is flagged, never made up.' },
        why: { es: 'Las señales de desgaste quedan registradas aunque nadie las mire.', en: 'Signs of wear are recorded even when nobody is looking.' },
        title: { es: 'Sensores y telemetría', en: 'Sensors and telemetry' },
        tech: 'Sensores · PLC · API',
        every: { es: 'Cada minuto', en: 'Every minute' },
        payload: json({ asset: 'PUMP-03', vibration_mm_s: 6.8, temp_c: 71, current_a: 42, ts: '06:00' }),
      },
      {
        name: { es: 'Preparar los datos', en: 'Prepare the data' },
        art: 'prepare',
        input: { icon: 'chart', text: { es: 'Las señales en bruto', en: 'The raw signals' } },
        action: { icon: 'layers', text: { es: 'Limpia el ruido y calcula tendencias', en: 'Removes noise and computes trends' } },
        output: { icon: 'listcheck', text: { es: 'Variables listas para el modelo', en: 'Features ready for the model' } },
        fail: { es: 'Los valores imposibles se descartan antes del modelo.', en: 'Impossible values are dropped before the model.' },
        why: { es: 'El modelo aprende de datos limpios, no de errores de sensor.', en: 'The model learns from clean data, not sensor glitches.' },
        title: { es: 'Preparación de datos', en: 'Data preparation' },
        tech: 'Python · Pandas',
        every: { es: 'Cada hora', en: 'Hourly' },
        payload: json({ window: '24 h', vib_trend_per_day: '+0.9 mm/s', peaks: 14, missing: '0.3%' }),
      },
      {
        name: { es: 'Predecir', en: 'Predict' },
        art: 'predict',
        input: { icon: 'listcheck', text: { es: 'Las variables del equipo', en: 'The asset\'s features' } },
        action: { icon: 'brain', text: { es: 'Estima la probabilidad de falla y cuándo ocurriría', en: 'Estimates the failure probability and when it would happen' } },
        output: { icon: 'alarm', text: { es: 'Días de anticipación, con su margen', en: 'Days of warning, with their margin' } },
        fail: { es: 'Si los datos se salen de lo conocido, lo avisa en vez de adivinar.', en: 'If the data leaves known ground, it says so instead of guessing.' },
        why: { es: 'Sabes qué va a fallar antes de que falle.', en: 'You know what will fail before it fails.' },
        title: { es: 'Modelo predictivo', en: 'Predictive model' },
        tech: 'Python · scikit-learn',
        every: { es: 'Cada hora', en: 'Hourly' },
        payload: json({ asset: 'PUMP-03', failure_prob_7d: 0.82, days_to_limit: '5 (3-7)', model: 'v12' }),
      },
      {
        name: { es: 'Validar el modelo', en: 'Validate the model' },
        art: 'validateModel',
        input: { icon: 'alarm', text: { es: 'Cada predicción', en: 'Every prediction' } },
        action: { icon: 'chart', text: { es: 'La compara con lo que realmente pasó', en: 'Compares it with what actually happened' } },
        output: { icon: 'checkcircle', text: { es: 'Un modelo que sigue acertando', en: 'A model that stays accurate' } },
        fail: { es: 'Si su acierto baja, se reentrena.', en: 'If its accuracy drops, it is retrained.' },
        why: { es: 'La confianza se mide con estadística, no se supone.', en: 'Confidence is measured with statistics, not assumed.' },
        title: { es: 'Validación del modelo', en: 'Model validation' },
        tech: 'Python · estadística',
        every: { es: 'Semanal', en: 'Weekly' },
        payload: json({ period: 'last 90 days', precision: 0.87, recall: 0.81, retrain: false }),
      },
      {
        name: { es: 'Actuar a tiempo', en: 'Act in time' },
        art: 'act',
        input: { icon: 'alarm', text: { es: 'Una falla probable', en: 'A likely failure' } },
        action: { icon: 'wrench', text: { es: 'Propone la detención y crea la orden planificada', en: 'Proposes the stop and creates the planned order' } },
        output: { icon: 'usercheck', text: { es: 'Tu equipo aprueba y planifica', en: 'Your team approves and plans' } },
        fail: { es: 'El modelo sugiere, tu equipo decide.', en: 'The model suggests, your team decides.' },
        why: { es: 'Detenciones planificadas en vez de emergencias.', en: 'Planned stops instead of emergencies.' },
        title: { es: 'Orden planificada', en: 'Planned work order' },
        tech: 'API del CMMS',
        every: { es: 'Por predicción', en: 'Per prediction' },
        payload: {
          es: json({ work_order: 'WO-6120', asset: 'PUMP-03', task: 'cambio de rodamiento', planned_stop: 'martes 08:00' }),
          en: json({ work_order: 'WO-6120', asset: 'PUMP-03', task: 'bearing replacement', planned_stop: 'Tuesday 08:00' }),
        },
      },
    ],
    processes: [
      { name: 'sensor-ingest', schedule: { es: 'cada minuto', en: 'every minute' }, last: { es: 'hace 20 s', en: '20 s ago' } },
      { name: 'feature-builder', schedule: { es: 'cada hora', en: 'hourly' }, last: { es: 'hace 12 min', en: '12 min ago' } },
      { name: 'failure-model', schedule: { es: 'cada hora', en: 'hourly' }, last: { es: 'hace 11 min', en: '11 min ago' } },
      { name: 'model-monitor', schedule: { es: 'semanal', en: 'weekly' }, last: { es: 'lunes', en: 'Monday' } },
    ],
    logs: [
      { proc: 'sensor-ingest', level: 'info', text: { es: 'PUMP-03 · vibración 6,8 mm/s · bajo el límite de alarma', en: 'PUMP-03 · vibration 6.8 mm/s · below the alarm limit' } },
      { proc: 'feature-builder', level: 'warn', text: { es: 'Tendencia de vibración de +0,9 mm/s por día en PUMP-03', en: 'Vibration trend of +0.9 mm/s per day on PUMP-03' } },
      { proc: 'failure-model', level: 'warn', text: { es: 'Falla a 7 días: 82% · límite en 5 días (entre 3 y 7)', en: '7-day failure: 82% · limit in 5 days (between 3 and 7)' } },
      { proc: 'failure-model', level: 'ok', text: { es: 'WO-6120 propuesta: cambio de rodamiento el martes 08:00', en: 'WO-6120 proposed: bearing replacement on Tuesday 08:00' } },
      { proc: 'model-monitor', level: 'ok', text: { es: 'Últimos 90 días: 87% de precisión · no requiere reentrenar', en: 'Last 90 days: 87% precision · no retraining needed' } },
      { proc: 'sensor-ingest', level: 'ok', text: { es: 'Después del cambio: 1,9 mm/s · probabilidad de falla 3%', en: 'After the swap: 1.9 mm/s · failure probability 3%' } },
    ],
  },

  'datos-web': {
    process: { es: 'Así se carga un lote completo en un portal', en: 'How a whole batch gets filed on a portal' },
    appliesTo: { es: 'Sirve para rendiciones, trámites del SII, postulaciones o cualquier portal donde hoy se llena formulario por formulario.', en: 'Works for expense reports, tax filings, applications or any portal where forms are filled one by one today.' },
    example: { es: 'más de mil formularios cargados en paralelo', en: 'over a thousand forms filed in parallel' },
    clock: '10:02:00',
    steps: [
      {
        name: { es: 'Reunir', en: 'Gather' },
        art: 'collect',
        input: { icon: 'layers', text: { es: 'Planillas y datos del sistema interno', en: 'Spreadsheets and internal system data' } },
        action: { icon: 'scan', text: { es: 'Los ordena y normaliza', en: 'Sorts and normalizes them' } },
        output: { icon: 'database', text: { es: 'Un lote listo para revisar', en: 'A batch ready for review' } },
        fail: { es: 'Las filas con errores se apartan.', en: 'Rows with errors are set aside.' },
        why: { es: 'Nadie copia datos de una planilla a otra.', en: 'Nobody copies data between spreadsheets.' },
        title: { es: 'Planilla de origen', en: 'Source spreadsheet' },
        tech: 'Python',
        every: { es: 'Por lote', en: 'Per batch' },
        payload: json({ rows: 1500, valid: 1497, to_review: 3 }),
      },
      {
        name: { es: 'Validar', en: 'Validate' },
        art: 'validate',
        input: { icon: 'database', text: { es: 'El lote', en: 'The batch' } },
        action: { icon: 'listcheck', text: { es: 'Revisa cada fila contra las reglas del portal', en: 'Checks every row against the portal\'s rules' } },
        output: { icon: 'checkcircle', text: { es: 'Filas listas para cargar', en: 'Rows ready to file' } },
        fail: { es: 'Lo dudoso pasa a revisión humana.', en: 'Anything doubtful goes to human review.' },
        why: { es: 'El portal no rechaza envíos por errores evitables.', en: 'The portal no longer rejects filings over avoidable errors.' },
        title: { es: 'Bot en el portal', en: 'Portal bot' },
        tech: 'Playwright',
        every: { es: '6 sesiones en paralelo', en: '6 parallel sessions' },
        payload: json({ sessions: 6, submitted: 1500, receipts: 1500, avg_s_per_form: 14 }),
      },
      {
        name: { es: 'Cargar en el portal', en: 'File on the portal' },
        art: 'portal',
        input: { icon: 'checkcircle', text: { es: 'Las filas válidas', en: 'The valid rows' } },
        action: { icon: 'globe', text: { es: 'Varias sesiones llenan los formularios en paralelo', en: 'Several sessions fill in the forms in parallel' } },
        output: { icon: 'file', text: { es: 'Un comprobante por formulario', en: 'One receipt per form' } },
        fail: { es: 'Si el portal se cae, pausa y retoma donde quedó.', en: 'If the portal goes down, it pauses and resumes where it left off.' },
        why: { es: 'Semanas de digitación se vuelven horas.', en: 'Weeks of data entry become hours.' },
        title: { es: 'Comprobantes', en: 'Receipts' },
        tech: 'PostgreSQL',
        every: { es: 'Por formulario', en: 'Per form' },
        payload: json({ reference: 'F-001499', row: 1499, pdf: 'receipt_001499.pdf' }),
      },
      {
        name: { es: 'Respaldar', en: 'Archive' },
        art: 'archive',
        input: { icon: 'file', text: { es: 'Los comprobantes', en: 'The receipts' } },
        action: { icon: 'database', text: { es: 'Guarda cada comprobante con su folio', en: 'Stores each receipt with its reference' } },
        output: { icon: 'book', text: { es: 'Todo trazable a su fila original', en: 'Everything traceable to its original row' } },
        fail: { es: 'Nada se carga dos veces.', en: 'Nothing is filed twice.' },
        why: { es: 'Ante una auditoría, cada respaldo aparece en segundos.', en: 'In an audit, every backup shows up in seconds.' },
        title: { es: 'Newsletter segmentado', en: 'Segmented newsletter' },
        tech: 'Plantillas · envío masivo',
        every: { es: 'Semanal', en: 'Weekly' },
        payload: json({ segments: 5, recipients: 48210, bounced: '0.4%' }),
      },
      {
        name: { es: 'Informar el avance', en: 'Report progress' },
        art: 'progress',
        input: { icon: 'book', text: { es: 'El registro de cargas', en: 'The filing log' } },
        action: { icon: 'dashboard', text: { es: 'Muestra en vivo cuánto va y cuánto falta', en: 'Shows live what\'s done and what\'s left' } },
        output: { icon: 'mail', text: { es: 'Aviso al terminar, con el resumen', en: 'A notice when done, with the summary' } },
        fail: { es: 'Si el avance se detiene, avisa.', en: 'If progress stalls, it raises an alert.' },
        why: { es: 'Sabes el estado sin preguntarle a nadie.', en: 'You know the status without asking anyone.' },
        title: { es: 'Tablero de avance', en: 'Progress board' },
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
