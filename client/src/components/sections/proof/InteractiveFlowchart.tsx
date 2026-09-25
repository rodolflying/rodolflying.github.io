import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GitFork, 
  Database, 
  Mail, 
  MessageSquare, 
  FileSpreadsheet, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Shield, 
  RefreshCw,
  Sparkles,
  Layers
} from 'lucide-react';

interface FlowNode {
  id: string;
  title: string;
  category: string;
  icon: any;
  color: string;
  status: string;
  latency: string;
  protocol: string;
  summary: string;
  resilience: string;
  payloadPreview: string;
}

export const InteractiveFlowchart = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('sap');

  const nodes: FlowNode[] = [
    {
      id: 'sap',
      title: '1. Origen: SAP ERP / Portal',
      category: 'EXTRACCIÓN',
      icon: Database,
      color: '#47E5C2',
      status: '🟢 Conexión Estable (200 OK)',
      latency: '240 ms',
      protocol: 'RFC / SAP GUI Scripting / REST API',
      summary: 'El bot inicia sesión de forma segura y extrae las transacciones pendientes (ej. FBL1N, ME23N o facturas de proveedores) sin bloquear terminales de usuarios humanos.',
      resilience: 'Reintentos automáticos con backoff exponencial si la sesión de SAP expira o hay congestión de red.',
      payloadPreview: `{\n  "source": "SAP_ERP_PROD",\n  "batch_id": "BATCH-2026-09",\n  "records_extracted": 342,\n  "status": "EXTRACTED_OK"\n}`
    },
    {
      id: 'mail',
      title: '2. Ingesta: Correos & Facturas',
      category: 'PARSER',
      icon: Mail,
      color: '#7DD3FC',
      status: '🟢 Escuchando Bandeja IMAP / OAuth2',
      latency: '85 ms',
      protocol: 'Microsoft Graph API / IMAP Seguro',
      summary: 'Detecta correos entrantes de clientes o proveedores, descarga automáticamente archivos adjuntos en formato XML, Excel o PDF y extrae los campos clave usando OCR / Regex.',
      resilience: 'Filtrado de spam y cuarentena automática para archivos con formatos dañados o corruptos.',
      payloadPreview: `{\n  "inbox": "facturacion@empresa.com",\n  "attachments_found": 8,\n  "parsed_xml_keys": ["rut", "monto", "folio"],\n  "validated": true\n}`
    },
    {
      id: 'core',
      title: '3. Núcleo: Pipeline Python ETL',
      category: 'PROCESAMIENTO',
      icon: Cpu,
      color: '#7C9CFF',
      status: '🟢 Proceso Nativo pm2 (PID 4912)',
      latency: '45 ms',
      protocol: 'Python 3.12 / Polars / Pandas',
      summary: 'Aplica todas las reglas de negocio de tu empresa: homologación de códigos de producto, cálculo de impuestos, validación cruzada entre lo facturado y lo recibido en bodega.',
      resilience: 'Validación estricta con Pydantic. Si un registro presenta inconsistencias, se aísla sin interrumpir el resto del lote.',
      payloadPreview: `{\n  "engine": "StarApps_ETL_Core",\n  "valid_records": 340,\n  "anomalies_detected": 2,\n  "execution_time_sec": 1.42\n}`
    },
    {
      id: 'database',
      title: '4. Persistencia: BD & Power BI',
      category: 'DATA WAREHOUSE',
      icon: FileSpreadsheet,
      color: '#FFC857',
      status: '🟢 PostgreSQL Transaccional Listo',
      latency: '18 ms',
      protocol: 'PostgreSQL / DirectQuery BI',
      summary: 'Inserta los datos limpios en la base de datos central de la empresa y gatilla el webhook de actualización para que los tableros de Power BI se sincronicen de inmediato.',
      resilience: 'Transacciones ACID completas con rollback automático en caso de fallo de escritura.',
      payloadPreview: `{\n  "target_db": "postgresql://analytics_dw",\n  "table": "fact_transacciones_diarias",\n  "rows_inserted": 340,\n  "bi_refresh_trigger": "SUCCESS"\n}`
    },
    {
      id: 'alerts',
      title: '5. Salida: WhatsApp & Notificaciones',
      category: 'DESPACHO',
      icon: MessageSquare,
      color: '#FF7A85',
      status: '🟢 Webhook Meta API Operativo',
      latency: '110 ms',
      protocol: 'WhatsApp Business Cloud API / Telegram',
      summary: 'Envía un resumen ejecutivo al WhatsApp de la gerencia o jefatura con el total procesado y alerta en rojo únicamente las 2 anomalías que requieren decisión humana.',
      resilience: 'Fallback automático a correo electrónico si el número de WhatsApp del destinatario se encuentra fuera de cobertura.',
      payloadPreview: `{\n  "recipient": "+56 9 XXXX XXXX",\n  "message": "✅ 340 facturas cuadradas. ⚠️ 2 órdenes con discrepancia enviadas a revisión.",\n  "pdf_report_url": "https://reportes.tuempresa.cl/rep_902.pdf"\n}`
    }
  ];

  const selectedNode = nodes.find(n => n.id === selectedNodeId)!;

  return (
    <div className="bg-[#070B14] border border-night-line rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden">
      {/* Decorative ambient background */}
      <div 
        className="absolute top-1/3 left-1/3 w-80 h-80 rounded-full blur-[120px] pointer-events-none opacity-15 transition-colors duration-500"
        style={{ backgroundColor: selectedNode.color }}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-night-line/80 pb-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C9CFF]/10 border border-[#7C9CFF]/30 mb-2">
            <GitFork className="w-3.5 h-3.5 text-[#7C9CFF]" />
            <span className="text-xs font-mono text-[#7C9CFF] font-bold tracking-wider">
              SIMULACIÓN ILUSTRATIVA DE UN FLUJO
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
            Pipeline Orquestado de Extremo a Extremo
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Haz clic en los nodos para inspeccionar cómo un bot conecta tus ERPs con tus canales de comunicación sin fricción.
          </p>
        </div>
      </div>

      {/* Interactive Node Flowchart Bar */}
      <div className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 relative">
          {nodes.map((node, index) => {
            const isSelected = selectedNodeId === node.id;
            const Icon = node.icon;
            return (
              <button
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                className={`p-3.5 rounded-xl border text-left transition-all duration-300 relative group ${
                  isSelected
                    ? 'bg-[#0E1626] shadow-lg scale-[1.02]'
                    : 'bg-black/50 border-night-line hover:border-slate-700 hover:bg-[#0E1626]'
                }`}
                style={{
                  borderColor: isSelected ? node.color : undefined,
                  boxShadow: isSelected ? `0 0 20px ${node.color}25` : undefined
                }}
              >
                {/* Step number badge */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-black/60 border border-night-line" style={{ color: node.color }}>
                    PASO 0{index + 1}
                  </span>
                  <Icon className="w-4 h-4" style={{ color: isSelected ? node.color : '#6B7280' }} />
                </div>

                <div className="font-display text-xs font-bold text-white truncate">
                  {node.title.split(':')[1] || node.title}
                </div>
                <div className="text-xs font-mono text-slate-400 mt-0.5 uppercase tracking-wider">
                  {node.category}
                </div>

                {/* Animated progress connector line */}
                {isSelected && (
                  <motion.div 
                    layoutId="nodeIndicator"
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-b border-r bg-[#0E1626]"
                    style={{ borderColor: node.color }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Node Audit Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedNode.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="bg-black/60 border border-night-line rounded-xl p-5 sm:p-7 grid lg:grid-cols-12 gap-6 items-start"
        >
          {/* Node Details Left */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span 
                className="text-xs font-mono font-bold px-2.5 py-1 rounded border"
                style={{ 
                  color: selectedNode.color, 
                  backgroundColor: `${selectedNode.color}15`,
                  borderColor: `${selectedNode.color}35`
                }}
              >
                {selectedNode.status}
              </span>
              <span className="text-xs font-mono text-slate-400">
                Latencia: <strong className="text-white">{selectedNode.latency}</strong>
              </span>
              <span className="text-xs font-mono text-slate-400">
                Protocolo: <strong className="text-white">{selectedNode.protocol}</strong>
              </span>
            </div>

            <h4 className="text-lg font-display font-bold text-white">
              {selectedNode.title}
            </h4>

            <p className="text-sm text-slate-300 leading-relaxed">
              {selectedNode.summary}
            </p>

            {/* Resilience Box */}
            <div className="p-3.5 rounded-lg bg-white/5 border border-night-line space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
                <Shield className="w-3.5 h-3.5" />
                <span>MECANISMO DE RESILIENCIA Y FAILOVER:</span>
              </div>
              <p className="text-xs text-slate-300">
                {selectedNode.resilience}
              </p>
            </div>
          </div>

          {/* Node Code/Payload Right */}
          <div className="lg:col-span-5 bg-night-900 rounded-lg border border-night-line p-4 font-mono text-xs">
            <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-night-line mb-2">
              <span className="text-xs text-[#47E5C2]">// PAYLOAD AUDITADO</span>
              <span className="text-xs text-slate-400">FORMATO JSON</span>
            </div>
            <pre className="text-slate-300 overflow-x-auto text-xs leading-relaxed">
              {selectedNode.payloadPreview}
            </pre>
            <div className="mt-3 pt-2 border-t border-night-line/80 flex items-center justify-between text-xs text-slate-400">
              <span>Cifrado en tránsito: TLS 1.3</span>
              <span className="text-[#47E5C2]">Verificado ✓</span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default InteractiveFlowchart;
