import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Radar, BellRing, MonitorCheck, Tablet, NotebookPen, Database, Cpu, BarChart3, MessageSquare, Mic,
  BrainCircuit, Wrench, FileText, Mail, Globe, Satellite, ClipboardCheck, Send, Layers, ShieldCheck,
  Router, Calculator, Wallet, ScanSearch, LayoutDashboard, Newspaper, Workflow, Terminal, Pause, Play,
  ArrowRight, Code2, Eye, MapPin, AlertTriangle, ListChecks, AlarmClock, Hourglass, UserCheck, Smartphone,
  CheckCircle2, List, FileBarChart, Users, Inbox, type LucideIcon,
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/hooks/useLanguage';
import type { Area } from '@/data/areas';
import { areaOps, type AreaOps, type OpsIcon, type OpsLog } from '@/data/areaOps';
import { STEP_ICONS, type StepIconName } from './StepIcons';

const ICONS: Record<OpsIcon, LucideIcon> = {
  radar: Radar, bell: BellRing, monitor: MonitorCheck, tablet: Tablet, book: NotebookPen, database: Database,
  cpu: Cpu, chart: BarChart3, message: MessageSquare, mic: Mic, brain: BrainCircuit, wrench: Wrench,
  file: FileText, mail: Mail, globe: Globe, satellite: Satellite, check: ClipboardCheck, send: Send,
  layers: Layers, shield: ShieldCheck, router: Router, calculator: Calculator, wallet: Wallet,
  scan: ScanSearch, dashboard: LayoutDashboard, news: Newspaper, eye: Eye, pin: MapPin, alert: AlertTriangle,
  listcheck: ListChecks, alarm: AlarmClock, hourglass: Hourglass, usercheck: UserCheck, phone: Smartphone,
  checkcircle: CheckCircle2, list: List, report: FileBarChart, users: Users, inbox: Inbox,
};

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** hh:mm:ss + n seconds. */
function clockPlus(base: string, n: number) {
  const [h, m, s] = base.split(':').map(Number);
  const total = (h * 3600 + m * 60 + s + n) % 86400;
  return [Math.floor(total / 3600), Math.floor((total % 3600) / 60), total % 60].map((v) => String(v).padStart(2, '0')).join(':');
}

// ---------------------------------------------------------------- flow
/** A step's animated icon on a dark tile; it only moves while its step is selected. */
function StepArt({ name, active, color, className = '' }: { name: string; active: boolean; color: string; className?: string }) {
  const Icon = STEP_ICONS[name as StepIconName] ?? STEP_ICONS.detect;
  return (
    <div
      className={`rounded-2xl border flex items-center justify-center transition-colors ${className}`}
      style={{ borderColor: active ? color : '#1E2A40', backgroundColor: active ? `${color}14` : '#0E1626' }}
    >
      <Icon color={color} active={active && !reducedMotion()} className="w-3/5 h-3/5" />
    </div>
  );
}

function FlowView({ ops, color }: { ops: AreaOps; color: string }) {
  const { t, language } = useLanguage();
  const [selected, setSelected] = useState(0);
  const [techOpen, setTechOpen] = useState(false);
  const n = ops.steps.length;
  const go = (i: number) => setSelected(Math.max(0, Math.min(n - 1, i)));

  const step = ops.steps[selected];
  const InIcon = ICONS[step.input.icon];
  const OutIcon = ICONS[step.output.icon];
  const payload = typeof step.payload === 'string' ? step.payload : step.payload[language];

  return (
    <div
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); go(selected + 1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); go(selected - 1); }
      }}
    >
      {/* the whole process at a glance: one illustrated tile per step */}
      <div className="relative">
        <div className="hidden sm:block absolute left-[10%] right-[10%] top-[52px] md:top-[60px] h-px border-t border-dashed border-night-line" aria-hidden="true">
          <span className="ops-pulse absolute -top-[4px] h-[7px] w-[7px] rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />
        </div>
        <ol className="relative flex sm:grid sm:grid-cols-5 gap-3 overflow-x-auto snap-x pt-3 pb-2 -mx-1 px-3" role="tablist" aria-label={ops.process[language]}>
          {ops.steps.map((s, i) => {
            const active = i === selected;
            return (
              <li key={s.name.es} className="snap-start flex-shrink-0 w-24 sm:w-auto">
                <button
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => go(i)}
                  className={`group w-full flex flex-col items-center text-center gap-2 transition-opacity ${active ? '' : 'opacity-60 hover:opacity-100'}`}
                >
                  <span className="relative">
                    <StepArt name={s.art} active={active} color={color} className="w-20 h-20 md:w-24 md:h-24" />
                    <span className="absolute -top-2 -left-2 h-6 w-6 rounded-full bg-night-900 border text-xs font-mono flex items-center justify-center" style={{ borderColor: active ? color : '#1E2A40', color: active ? color : '#94A3B8' }}>
                      {i + 1}
                    </span>
                  </span>
                  <span className={`font-display text-sm font-bold leading-tight ${active ? 'text-white' : 'text-slate-300'}`}>{s.name[language]}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="mt-5 rounded-xl border border-night-line bg-night p-4 sm:p-6"
        >
          <div className="flex items-center justify-between gap-3 mb-3">
            <p className="font-mono text-xs" style={{ color }}>
              {t('areas.ops_step')} {selected + 1} / {n} · {step.name[language].toUpperCase()}
            </p>
            <div className="flex gap-2">
              <button type="button" onClick={() => go(selected - 1)} disabled={selected === 0} aria-label={t('areas.ops_prev')} className="h-8 w-8 rounded-lg border border-night-line text-slate-300 hover:text-white disabled:opacity-30 flex items-center justify-center">
                <ArrowRight className="w-4 h-4 rotate-180" aria-hidden="true" />
              </button>
              <button type="button" onClick={() => go(selected + 1)} disabled={selected === n - 1} aria-label={t('areas.ops_next')} className="h-8 w-8 rounded-lg border text-white disabled:opacity-30 flex items-center justify-center" style={{ borderColor: color }}>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* what the step does, said once and big */}
          <h4 className="font-display text-xl md:text-2xl font-bold text-white leading-snug mb-4">{step.action.text[language]}</h4>

          {/* what comes in and what goes out, on one line */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-sm">
            <span className="inline-flex items-center gap-2 rounded-lg bg-night-800 border border-night-line px-3 py-2 text-slate-200">
              <InIcon className="w-4 h-4 text-slate-400 flex-shrink-0" aria-hidden="true" />
              <span><span className="text-slate-400">{t('areas.ops_in')}:</span> {step.input.text[language]}</span>
            </span>
            <ArrowRight className="hidden sm:block w-4 h-4 flex-shrink-0" style={{ color }} aria-hidden="true" />
            <span className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-white" style={{ borderColor: `${color}66`, backgroundColor: `${color}12` }}>
              <OutIcon className="w-4 h-4 flex-shrink-0" style={{ color }} aria-hidden="true" />
              <span><span className="text-slate-400">{t('areas.ops_out')}:</span> {step.output.text[language]}</span>
            </span>
          </div>

          <p className="text-sm text-slate-300 mt-3">
            <ShieldCheck className="inline w-4 h-4 mr-1 -mt-0.5 text-gold" aria-hidden="true" />
            <span className="text-gold font-semibold">{t('areas.ops_fail')}:</span> {step.fail[language]}
          </p>

          <p className="text-slate-200 text-base md:text-lg leading-relaxed mt-4 pl-3 border-l-2" style={{ borderColor: color }}>{step.why[language]}</p>

          <div className="flex flex-wrap items-center justify-between gap-3 mt-5">
            <span className="text-xs rounded-lg px-2.5 py-1.5 border" style={{ color, borderColor: `${color}55`, backgroundColor: `${color}14` }}>
              {t('areas.ops_example')}: {ops.example[language]}
            </span>
            <button type="button" onClick={() => setTechOpen((v) => !v)} aria-expanded={techOpen} className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white">
              <Code2 className="w-3.5 h-3.5" aria-hidden="true" />
              {techOpen ? t('areas.ops_tech_hide') : t('areas.ops_tech_show')}
            </button>
          </div>

          {/* technical detail of the real example, for IT teams */}
          {techOpen && (
            <div className="mt-4 grid lg:grid-cols-12 gap-4 border-t border-night-line pt-4">
              <div className="lg:col-span-5 space-y-2 text-xs font-mono">
                <p className="text-slate-400">{t('areas.ops_tech_title')}</p>
                <p className="text-white font-sans text-sm font-semibold">{step.title[language]}</p>
                <p className="text-slate-400">{t('areas.ops_every')}: <span className="text-white">{step.every[language]}</span></p>
                <p className="text-slate-400">{t('areas.ops_tech')}: <span className="text-white">{step.tech}</span></p>
              </div>
              <div className="lg:col-span-7 rounded-lg border border-night-line bg-night-900 p-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-night-line">
                  <span style={{ color }}>// {t('areas.ops_payload')}</span>
                  <span className="text-slate-400">JSON</span>
                </div>
                <pre className="text-slate-200 overflow-x-auto leading-relaxed">{payload}</pre>
              </div>
            </div>
          )}
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
          <p className="inline-flex flex-wrap items-center gap-2 font-mono text-xs tracking-wider" style={{ color: area.color }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: area.color }} />
            {area.name[language].toUpperCase()} · {t('areas.ops_badge')}
          </p>
          <DialogTitle className="font-display text-xl sm:text-2xl font-bold text-white">{ops.process[language]}</DialogTitle>
          <DialogDescription className="text-slate-300 text-base">{ops.appliesTo[language]}</DialogDescription>
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
