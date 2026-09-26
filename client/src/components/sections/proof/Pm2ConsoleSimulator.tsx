import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Terminal, 
  Activity, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Cpu, 
  HardDrive, 
  ShieldCheck,
  Server
} from 'lucide-react';

interface ProcessItem {
  id: number;
  name: string;
  mode: string;
  status: 'online' | 'restarting' | 'stopped';
  cpu: string;
  mem: string;
  uptime: string;
  restarts: number;
}

export const Pm2ConsoleSimulator = () => {
  const [activeTab, setActiveTab] = useState<'status' | 'logs'>('status');
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [selectedProcess, setSelectedProcess] = useState<string>('all');
  const [logs, setLogs] = useState<Array<{ id: number; time: string; proc: string; level: 'info' | 'success' | 'warn'; text: string }>>([
    { id: 1, time: '02:14:02', proc: 'bot-sap-sync', level: 'info', text: 'Iniciando ciclo de sondeo en bandeja SAP FBL1N...' },
    { id: 2, time: '02:14:04', proc: 'bot-sap-sync', level: 'success', text: '18 facturas extraídas correctamente. Hash de verificación MD5 OK.' },
    { id: 3, time: '02:14:08', proc: 'scraper-market', level: 'info', text: 'Extrayendo índices de mercado desde portal público...' },
    { id: 4, time: '02:14:11', proc: 'notifier-wsp', level: 'success', text: 'Disparo de alerta gerencial WhatsApp: 200 OK via Meta Cloud API.' },
    { id: 5, time: '02:14:15', proc: 'api-portal-bridge', level: 'info', text: 'Heartbeat recibido desde servidor On-Premise cliente (ping 12ms).' },
  ]);

  const terminalRef = useRef<HTMLDivElement>(null);

  const processes: ProcessItem[] = [
    { id: 0, name: 'bot-sap-sync', mode: 'fork', status: 'online', cpu: '0.8%', mem: '44.2 MB', uptime: '48d 14h', restarts: 0 },
    { id: 1, name: 'scraper-market', mode: 'fork', status: 'online', cpu: '1.2%', mem: '38.6 MB', uptime: '32d 06h', restarts: 0 },
    { id: 2, name: 'notifier-wsp', mode: 'fork', status: 'online', cpu: '0.1%', mem: '26.4 MB', uptime: '92d 19h', restarts: 0 },
    { id: 3, name: 'api-portal-bridge', mode: 'cluster', status: 'online', cpu: '0.4%', mem: '51.8 MB', uptime: '114d 02h', restarts: 0 },
  ];

  // Simulator dynamic log ticker
  useEffect(() => {
    if (!isStreaming) return;

    const mockPool = [
      { proc: 'bot-sap-sync', level: 'info' as const, text: 'Comprobando locks de archivo en directorio /var/data/erp_inbox...' },
      { proc: 'bot-sap-sync', level: 'success' as const, text: 'Transformación Polars ejecutada en 0.04s. 0 inconsistencias.' },
      { proc: 'notifier-wsp', level: 'info' as const, text: 'Cola de mensajes: 0 pendientes en Redis. Estado: IDLE.' },
      { proc: 'api-portal-bridge', level: 'success' as const, text: 'Token JWT renovado para cliente corporativo. Expiración en 24h.' },
      { proc: 'scraper-market', level: 'success' as const, text: 'Tabla de paridades cambiarias actualizada en PostgreSQL.' },
      { proc: 'bot-sap-sync', level: 'info' as const, text: 'Backup incremental cifrado en caliente generado con éxito.' }
    ];

    const interval = setInterval(() => {
      const randomEntry = mockPool[Math.floor(Math.random() * mockPool.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];

      setLogs(prev => {
        const next = [...prev, {
          id: Date.now() + Math.random(),
          time: timeStr,
          proc: randomEntry.proc,
          level: randomEntry.level,
          text: randomEntry.text
        }];
        if (next.length > 40) next.shift();
        return next;
      });
    }, 2400);

    return () => clearInterval(interval);
  }, [isStreaming]);

  // Keep the newest log line visible by scrolling only the terminal box.
  // (scrollIntoView would scroll the whole page and yank the visitor back here.)
  useEffect(() => {
    const el = terminalRef.current;
    if (activeTab === 'logs' && el) el.scrollTop = el.scrollHeight;
  }, [logs, activeTab]);

  return (
    <div className="bg-[#070B14] border border-night-line rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 right-10 w-80 h-80 bg-[#7DD3FC]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-night-line/80 pb-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7DD3FC]/10 border border-[#7DD3FC]/30 mb-2">
            <Terminal className="w-3.5 h-3.5 text-[#7DD3FC]" />
            <span className="text-xs font-mono text-[#7DD3FC] font-bold tracking-wider">
              SIMULACIÓN DE MONITOREO OPERACIONAL
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
            Simulador de Consola & Uptime Daemon
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Visualiza cómo orquestamos y supervisamos procesos desatendidos con herramientas como <code className="text-[#47E5C2] bg-black/60 px-1 py-0.5 rounded">pm2</code> en segundo plano.
          </p>
        </div>

        {/* Monitoring badge */}
        <div className="flex items-center gap-3 bg-black/60 border border-night-line px-4 py-2 rounded-xl shrink-0 self-start sm:self-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-[#47E5C2] animate-ping" />
          <div>
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Monitoreo</div>
            <div className="text-sm font-display font-bold text-[#47E5C2]">24/7 con alertas</div>
          </div>
        </div>
      </div>

      {/* Terminal Window Mockup */}
      <div className="bg-[#0D0D0D] border border-night-line rounded-xl overflow-hidden shadow-2xl">
        {/* Terminal Header Bar */}
        <div className="bg-[#0E1626] px-4 py-3 border-b border-night-line flex flex-wrap items-center justify-between gap-3">
          {/* Window control dots & title */}
          <div className="flex items-center gap-2">
            <div className="flex space-x-1.5 mr-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
            </div>
            <span className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-[#47E5C2]" />
              demo@starapps-sim:~$
            </span>
          </div>

          {/* View Switcher Tabs */}
          <div className="flex items-center gap-2">
            <div className="flex bg-black p-0.5 rounded-lg border border-night-line">
              <button
                onClick={() => setActiveTab('status')}
                className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                  activeTab === 'status' ? 'bg-[#7DD3FC] text-black font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                pm2 status
              </button>
              <button
                onClick={() => setActiveTab('logs')}
                className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                  activeTab === 'logs' ? 'bg-[#7DD3FC] text-black font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                pm2 logs
              </button>
            </div>

            {activeTab === 'logs' && (
              <button
                onClick={() => setIsStreaming(!isStreaming)}
                className={`p-1.5 rounded border text-xs font-mono flex items-center gap-1 transition-colors ${
                  isStreaming 
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20' 
                    : 'bg-[#47E5C2]/10 border-[#47E5C2]/30 text-[#47E5C2] hover:bg-[#47E5C2]/20'
                }`}
                title={isStreaming ? 'Pausar stream de logs' : 'Reanudar stream de logs'}
              >
                {isStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
        </div>

        {/* Terminal Body */}
        <div ref={terminalRef} className="p-4 sm:p-5 font-mono text-xs overflow-x-auto overflow-y-auto h-[320px]">
          {activeTab === 'status' ? (
            /* Table View of pm2 status */
            <div className="space-y-4">
              <div className="text-xs text-slate-400">
                ┌─ [PM2 v5.4.2] Process Management List — All daemons supervised
              </div>

              <div className="min-w-[620px]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-night-line text-slate-400 text-xs">
                      <th className="py-2 px-3 font-semibold">ID</th>
                      <th className="py-2 px-3 font-semibold">APP NAME</th>
                      <th className="py-2 px-3 font-semibold">STATUS</th>
                      <th className="py-2 px-3 font-semibold">CPU</th>
                      <th className="py-2 px-3 font-semibold">MEM</th>
                      <th className="py-2 px-3 font-semibold">UPTIME</th>
                      <th className="py-2 px-3 font-semibold">RESTARTS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {processes.map((proc) => (
                      <tr key={proc.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-2.5 px-3 text-slate-400 font-mono">{proc.id}</td>
                        <td className="py-2.5 px-3 font-bold text-white flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#47E5C2]" />
                          {proc.name}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#47E5C2]/10 text-[#47E5C2] border border-[#47E5C2]/30">
                            ONLINE
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-300">{proc.cpu}</td>
                        <td className="py-2.5 px-3 text-[#7DD3FC]">{proc.mem}</td>
                        <td className="py-2.5 px-3 text-slate-400">{proc.uptime}</td>
                        <td className="py-2.5 px-3 text-emerald-400 font-bold">{proc.restarts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Resource Summary Pill */}
              <div className="flex flex-wrap gap-4 pt-3 border-t border-night-line text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 text-[#47E5C2]" />
                  <span>CPU Total: <strong className="text-white">2.5% (4 cores)</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <HardDrive className="w-3.5 h-3.5 text-[#7DD3FC]" />
                  <span>RAM Total: <strong className="text-white">161 MB / 8 GB</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Auto-Restart en caída: <strong className="text-white">Habilitado</strong></span>
                </div>
              </div>
            </div>
          ) : (
            /* Streaming Logs View */
            <div className="space-y-1.5 font-mono text-xs sm:text-xs">
              <div className="text-slate-400 mb-2 pb-1 border-b border-night-line flex items-center justify-between">
                <span>[STREAMING LOGS — FORMATO ISO-8601]</span>
                <span className="text-[#47E5C2] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#47E5C2] animate-pulse" />
                  FEED SIMULADO
                </span>
              </div>

              {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-slate-400 shrink-0">[{log.time}]</span>
                  <span className="text-[#7DD3FC] shrink-0 font-bold">[{log.proc}]</span>
                  <span className={
                    log.level === 'success' ? 'text-[#47E5C2]' :
                    log.level === 'warn' ? 'text-amber-400' : 'text-slate-300'
                  }>
                    {log.text}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pm2ConsoleSimulator;
