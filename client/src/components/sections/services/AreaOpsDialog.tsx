import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Radar, BellRing, MonitorCheck, Tablet, NotebookPen, Database, Cpu, BarChart3, MessageSquare, Mic,
  BrainCircuit, Wrench, FileText, Mail, Globe, Satellite, ClipboardCheck, Send, Layers, ShieldCheck,
  Router, Calculator, Wallet, ScanSearch, LayoutDashboard, Newspaper, Workflow, Terminal, Pause, Play,
  ArrowRight, type LucideIcon,
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/hooks/useLanguage';
import type { Area } from '@/data/areas';
import { areaOps, type AreaOps, type OpsIcon, type OpsLog } from '@/data/areaOps';

const ICONS: Record<OpsIcon, LucideIcon> = {
  radar: Radar, bell: BellRing, monitor: MonitorCheck, tablet: Tablet, book: NotebookPen, database: Database,
  cpu: Cpu, chart: BarChart3, message: MessageSquare, mic: Mic, brain: BrainCircuit, wrench: Wrench,
  file: FileText, mail: Mail, globe: Globe, satellite: Satellite, check: ClipboardCheck, send: Send,
  layers: Layers, shield: ShieldCheck, router: Router, calculator: Calculator, wallet: Wallet,
  scan: ScanSearch, dashboard: LayoutDashboard, news: Newspaper,
};

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** hh:mm:ss + n seconds. */
function clockPlus(base: string, n: number) {
  const [h, m, s] = base.split(':').map(Number);
  const total = (h * 3600 + m * 60 + s + n) % 86400;
  return [Math.floor(total / 3600), Math.floor((total % 3600) / 60), total % 60].map((v) => String(v).padStart(2, '0')).join(':');
}

// ---------------------------------------------------------------- flow
function FlowView({ ops, color }: { ops: AreaOps; color: string }) {
  const { t, language } = useLanguage();
  const [selected, setSelected] = useState(0);
  const [live, setLive] = useState(0);

  // A "processing" marker walks through the steps, so the pipeline visibly runs.
  useEffect(() => {
    if (reducedMotion()) return;
    const id = window.setInterval(() => setLive((v) => (v + 1) % ops.steps.length), 1400);
    return () => window.clearInterval(id);
  }, [ops]);

  const step = ops.steps[selected];
  const next = ops.steps[selected + 1];
  const payload = typeof step.payload === 'string' ? step.payload : step.payload[language];

  return (
    <div>
      <p className="text-sm text-slate-400 mb-3">{t('areas.ops_flow_hint')}</p>
      <div className="relative">
        {/* the wire the data travels along (desktop) */}
        <div className="hidden md:block absolute left-[10%] right-[10%] top-1/2 h-px bg-night-line" aria-hidden="true">
          <span className="ops-pulse absolute -top-[3px] h-[7px] w-[7px] rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />
        </div>
        <div className="relative flex md:grid md:grid-cols-5 gap-3 overflow-x-auto snap-x pb-2 md:pb-0 -mx-1 px-1" role="tablist">
          {ops.steps.map((s, i) => {
            const Icon = ICONS[s.icon];
            const active = i === selected;
            return (
              <button
                key={s.title.es}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelected(i)}
                className={`snap-start flex-shrink-0 w-[46%] sm:w-[30%] md:w-auto text-left rounded-xl border p-3 transition-colors ${
                  active ? 'bg-night-700' : 'bg-night-800 border-night-line hover:border-slate-600'
                }`}
                style={active ? { borderColor: color, boxShadow: `0 0 18px ${color}30` } : undefined}
              >
                <span className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs" style={{ color }}>
                    {t('areas.ops_step')} {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="relative flex items-center">
                    {live === i && <span className="absolute -left-3 h-1.5 w-1.5 rounded-full animate-ping" style={{ backgroundColor: color }} aria-hidden="true" />}
                    <Icon className="w-4 h-4" style={{ color: active ? color : '#94A3B8' }} aria-hidden="true" />
                  </span>
                </span>
                <span className="block font-display text-sm font-bold text-white leading-snug">{s.title[language]}</span>
                <span className="block font-mono text-xs text-slate-400 mt-1 tracking-wide">{s.tag[language]}</span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="mt-4 grid lg:grid-cols-12 gap-4 rounded-xl border border-night-line bg-night p-4 sm:p-5"
        >
          <div className="lg:col-span-7 space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded border" style={{ color, borderColor: `${color}55`, backgroundColor: `${color}14` }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
                {t('areas.ops_online')}
              </span>
              <span className="text-slate-400">{t('areas.ops_every')}: <strong className="text-white font-semibold">{step.every[language]}</strong></span>
              <span className="text-slate-400">{t('areas.ops_tech')}: <strong className="text-white font-semibold">{step.tech}</strong></span>
            </div>
            <h4 className="font-display text-lg font-bold text-white">{step.title[language]}</h4>
            <p className="text-slate-300 leading-relaxed">{step.summary[language]}</p>
            <div className="rounded-lg border border-night-line bg-white/5 p-3">
              <p className="flex items-center gap-2 text-xs font-mono font-bold text-gold mb-1">
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                {t('areas.ops_resilience')}
              </p>
              <p className="text-sm text-slate-300">{step.resilience[language]}</p>
            </div>
            {next ? (
              <button type="button" onClick={() => setSelected(selected + 1)} className="inline-flex items-center gap-2 text-sm font-semibold hover:underline" style={{ color }}>
                {t('areas.ops_next')}: {next.title[language]} <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            ) : (
              <button type="button" onClick={() => setSelected(0)} className="inline-flex items-center gap-2 text-sm font-semibold hover:underline" style={{ color }}>
                {t('areas.ops_restart')} <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
          </div>
          <div className="lg:col-span-5 rounded-lg border border-night-line bg-night-900 p-3 font-mono text-xs self-start">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-night-line">
              <span style={{ color }}>// {t('areas.ops_payload')}</span>
              <span className="text-slate-400">JSON</span>
            </div>
            <pre className="text-slate-200 overflow-x-auto leading-relaxed">{payload}</pre>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------- console
interface Line extends OpsLog { id: number; time: string }

function ConsoleView({ ops, color, areaId }: { ops: AreaOps; color: string; areaId: string }) {
  const { t, language } = useLanguage();
  const reduce = reducedMotion();
  const [streaming, setStreaming] = useState(!reduce);
  const [lines, setLines] = useState<Line[]>(() => {
    const n = reduce ? ops.logs.length : 2;
    return ops.logs.slice(0, n).map((l, i) => ({ ...l, id: i, time: clockPlus(ops.clock, i * 7) }));
  });
  const boxRef = useRef<HTMLDivElement>(null);

  // The log tells the story in order, then keeps looping like a real feed.
  useEffect(() => {
    if (!streaming) return;
    const id = window.setInterval(() => {
      setLines((prev) => {
        const n = prev.length ? prev[prev.length - 1].id + 1 : 0;
        const next = [...prev, { ...ops.logs[n % ops.logs.length], id: n, time: clockPlus(ops.clock, n * 7) }];
        return next.slice(-30);
      });
    }, 1500);
    return () => window.clearInterval(id);
  }, [streaming, ops]);

  // Keep the newest line visible by scrolling only the log box (never the page).
  useEffect(() => {
    const el = boxRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const levelClass = (l: OpsLog['level']) => (l === 'ok' ? 'text-star' : l === 'warn' ? 'text-gold' : 'text-slate-300');

  return (
    <div className="rounded-xl border border-night-line bg-[#0B0F18] overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-night-800 border-b border-night-line">
        <span className="flex items-center gap-2 font-mono text-xs text-slate-300">
          <span className="flex gap-1.5 mr-1" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]" />
          </span>
          <Terminal className="w-3.5 h-3.5" style={{ color }} aria-hidden="true" />
          star-apps@{areaId}:~$
        </span>
        <button
          type="button"
          onClick={() => setStreaming((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded border border-night-line px-2 py-1 font-mono text-xs text-slate-300 hover:text-white"
        >
          {streaming ? <Pause className="w-3.5 h-3.5" aria-hidden="true" /> : <Play className="w-3.5 h-3.5" aria-hidden="true" />}
          {streaming ? t('areas.ops_pause') : t('areas.ops_resume')}
        </button>
      </div>

      <div className="p-4 font-mono text-xs overflow-x-auto">
        <table className="w-full min-w-[520px] text-left border-collapse">
          <thead>
            <tr className="text-slate-400 border-b border-night-line">
              <th className="py-1.5 pr-3 font-semibold">{t('areas.ops_process')}</th>
              <th className="py-1.5 pr-3 font-semibold">{t('areas.ops_status')}</th>
              <th className="py-1.5 pr-3 font-semibold">{t('areas.ops_every')}</th>
              <th className="py-1.5 font-semibold">{t('areas.ops_last')}</th>
            </tr>
          </thead>
          <tbody>
            {ops.processes.map((p) => (
              <tr key={p.name} className="border-b border-night-line/50">
                <td className="py-2 pr-3 text-white font-bold">{p.name}</td>
                <td className="py-2 pr-3">
                  <span className="inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded border" style={{ color, borderColor: `${color}55` }}>
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
                    {t('areas.ops_online')}
                  </span>
                </td>
                <td className="py-2 pr-3 text-slate-300">{p.schedule[language]}</td>
                <td className="py-2 text-slate-400">{p.last[language]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div ref={boxRef} className="h-56 overflow-y-auto px-4 pb-4 font-mono text-xs space-y-1.5" aria-live="off">
        {lines.map((l) => (
          <div key={l.id} className="flex flex-wrap sm:flex-nowrap gap-x-2 leading-relaxed">
            <span className="text-slate-500 flex-shrink-0">[{l.time}]</span>
            <span className="flex-shrink-0 font-bold" style={{ color }}>[{l.proc}]</span>
            <span className={`w-full sm:w-auto ${levelClass(l.level)}`}>{l.text[language]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- dialog
interface Props {
  area: Area;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AreaOpsDialog = ({ area, open, onOpenChange }: Props) => {
  const { t, language } = useLanguage();
  const ops = areaOps[area.id];
  const [view, setView] = useState<'flow' | 'console'>('flow');

  useEffect(() => { if (open) setView('flow'); }, [open, area.id]);

  if (!ops) return null;

  const tabs = [
    { id: 'flow' as const, label: t('areas.ops_tab_flow'), icon: Workflow },
    { id: 'console' as const, label: t('areas.ops_tab_console'), icon: Terminal },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[calc(100%-1.5rem)] max-h-[92vh] overflow-y-auto overflow-x-hidden [&>*]:min-w-0 rounded-2xl border-night-line bg-night-900 p-5 sm:p-7 text-slate-200">
        <DialogHeader className="text-left space-y-2 pr-6">
          <p className="inline-flex items-center gap-2 font-mono text-xs tracking-wider" style={{ color: area.color }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: area.color }} />
            {t('areas.ops_badge')}
          </p>
          <DialogTitle className="font-display text-xl sm:text-2xl font-bold text-white">
            {t('areas.ops_title')}: {area.name[language]}
          </DialogTitle>
          <DialogDescription className="text-slate-300 text-base">{ops.intro[language]}</DialogDescription>
        </DialogHeader>

        <div className="flex gap-2" role="tablist">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = view === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setView(tab.id)}
                className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
                  active ? 'text-white bg-night-700' : 'text-slate-400 border-night-line hover:text-white'
                }`}
                style={active ? { borderColor: area.color } : undefined}
              >
                <Icon className="w-4 h-4" style={{ color: active ? area.color : undefined }} aria-hidden="true" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {view === 'flow' ? <FlowView key={area.id} ops={ops} color={area.color} /> : <ConsoleView key={area.id} ops={ops} color={area.color} areaId={area.id} />}

        <p className="text-xs text-slate-400">{t('areas.ops_note')}</p>
      </DialogContent>
    </Dialog>
  );
};

export default AreaOpsDialog;
