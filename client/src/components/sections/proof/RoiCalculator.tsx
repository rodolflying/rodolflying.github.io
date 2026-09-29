import { useState, useMemo } from 'react';
import { Clock, Users, Wallet } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { CtaLink } from '@/components/ui/headers';

const COPY = {
  es: {
    title: '¿Cuánto tiempo y dinero vuelve a tu empresa?',
    subtitle: 'Una estimación simple para conversar. En el diagnóstico la afinamos con datos reales de tu proceso.',
    hoursLabel: 'Horas al día que una persona dedica a la tarea',
    teamLabel: 'Personas que hacen este trabajo',
    rateLabel: 'Costo hora de esa persona',
    hour: 'hora', hours: 'horas', person: 'persona', people: 'personas',
    hoursLabel2: 'horas al año vuelven a tu equipo',
    moneyLabel: (cur: string) => `${cur} al año vuelven a tu empresa`,
    weeks: (n: string) => `Como sumar ${n} semanas de trabajo de una persona.`,
    fte: (n: string) => `Como sumar ${n} personas a tiempo completo durante un año.`,
    exact: (v: string) => `${v} al año, con los supuestos de abajo.`,
    thousand: ' mil',
    assumptions: 'Supuestos: se automatiza el 60 % del tiempo de la tarea, 240 días hábiles al año y semanas de 44 horas. Es una estimación, no una cotización.',
    question: '¿En qué usaría tu equipo ese tiempo?',
    cta: 'Solicitar diagnóstico gratuito',
  },
  en: {
    title: 'How much time and money comes back to your company?',
    subtitle: 'A simple estimate to start the conversation. In the diagnosis we refine it with real data from your process.',
    hoursLabel: 'Hours a day one person spends on the task',
    teamLabel: 'People doing this work',
    rateLabel: 'Hourly cost of that person',
    hour: 'hour', hours: 'hours', person: 'person', people: 'people',
    hoursLabel2: 'hours a year come back to your team',
    moneyLabel: (cur: string) => `${cur} a year come back to your company`,
    weeks: (n: string) => `Like adding ${n} weeks of one person’s work.`,
    fte: (n: string) => `Like adding ${n} full-time people for a year.`,
    exact: (v: string) => `${v} a year, with the assumptions below.`,
    thousand: 'k',
    assumptions: 'Assumptions: 60% of the task’s time is automated, 240 working days a year and 44-hour weeks. An estimate, not a quote.',
    question: 'What would your team do with that time?',
    cta: 'Request a free diagnosis',
  },
};

const WORKING_DAYS = 240;
const AUTOMATABLE = 0.6;
const WEEK_HOURS = 44;
const YEAR_HOURS = WEEK_HOURS * 48; // one full-time person, net of holidays

/**
 * What comes back: hours for the team and money for the company, side by side (the owner
 * signs, the team feels it). No ROI or payback: it is an estimate, not a quote.
 */
export const RoiCalculator = () => {
  const { language } = useLanguage();
  const c = COPY[language];
  const locale = language === 'es' ? 'es-CL' : 'en-US';
  const [currency, setCurrency] = useState<'CLP' | 'USD'>('CLP');
  const [hoursPerDay, setHoursPerDay] = useState(1.5);
  const [teamSize, setTeamSize] = useState(2);
  const [hourlyRate, setHourlyRate] = useState(20000);

  const switchCurrency = (next: 'CLP' | 'USD') => {
    if (next === currency) return;
    setCurrency(next);
    setHourlyRate(next === 'CLP' ? 20000 : 25);
  };

  const r = useMemo(() => {
    const hours = Math.round(hoursPerDay * teamSize * WORKING_DAYS * AUTOMATABLE);
    return { hours, weeks: Math.round(hours / WEEK_HOURS), fte: hours / YEAR_HOURS, money: Math.round(hours * hourlyRate) };
  }, [hoursPerDay, teamSize, hourlyRate]);

  const fmt = (n: number) => n.toLocaleString(locale);
  const sym = currency === 'CLP' ? '$' : 'US$';
  // Big and readable: $181,4 M / US$227 mil; the exact figure goes underneath.
  const compact = (n: number) =>
    n >= 1e6 ? `${sym}${(n / 1e6).toLocaleString(locale, { maximumFractionDigits: 1 })} M`
      : n >= 1e3 ? `${sym}${Math.round(n / 1e3).toLocaleString(locale)}${c.thousand}`
        : `${sym}${fmt(n)}`;
  const money = (n: number) => (currency === 'CLP' ? `$${n.toLocaleString('es-CL')} CLP` : `US$${n.toLocaleString('en-US')}`);

  const slider = 'w-full h-2 rounded-lg appearance-none cursor-pointer bg-night-700 accent-star';

  return (
    <div className="grid lg:grid-cols-12 gap-10 items-start">
      <div className="lg:col-span-5">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3 text-balance">{c.title}</h2>
        <p className="text-slate-300 text-lg mb-8">{c.subtitle}</p>

        <div className="space-y-7">
          <label className="block">
            <span className="flex justify-between items-baseline gap-4 mb-2 text-sm">
              <span className="inline-flex items-center gap-2 text-slate-200"><Clock className="w-4 h-4 text-star" aria-hidden="true" />{c.hoursLabel}</span>
              <span className="num font-mono font-semibold text-white whitespace-nowrap">{hoursPerDay.toLocaleString(locale)} {hoursPerDay === 1 ? c.hour : c.hours}</span>
            </span>
            <input type="range" min="0.5" max="8" step="0.5" value={hoursPerDay} onChange={(e) => setHoursPerDay(parseFloat(e.target.value))} className={slider} />
          </label>

          <label className="block">
            <span className="flex justify-between items-baseline gap-4 mb-2 text-sm">
              <span className="inline-flex items-center gap-2 text-slate-200"><Users className="w-4 h-4 text-star" aria-hidden="true" />{c.teamLabel}</span>
              <span className="num font-mono font-semibold text-white whitespace-nowrap">{teamSize} {teamSize === 1 ? c.person : c.people}</span>
            </span>
            <input type="range" min="1" max="30" step="1" value={teamSize} onChange={(e) => setTeamSize(parseInt(e.target.value))} className={slider} />
          </label>

          <label className="block">
            <span className="flex justify-between items-baseline gap-4 mb-2 text-sm">
              <span className="inline-flex items-center gap-2 text-slate-200"><Wallet className="w-4 h-4 text-star" aria-hidden="true" />{c.rateLabel}</span>
              <span className="num font-mono font-semibold text-white whitespace-nowrap">{money(hourlyRate)}</span>
            </span>
            <input
              type="range"
              min={currency === 'CLP' ? 6000 : 8}
              max={currency === 'CLP' ? 60000 : 80}
              step={currency === 'CLP' ? 1000 : 1}
              value={hourlyRate}
              onChange={(e) => setHourlyRate(parseFloat(e.target.value))}
              className={slider}
            />
            <span className="mt-2 inline-flex rounded-lg border border-night-line p-0.5 text-xs" role="group" aria-label={language === 'es' ? 'Moneda' : 'Currency'}>
              {(['CLP', 'USD'] as const).map((cur) => (
                <button
                  key={cur}
                  type="button"
                  aria-pressed={currency === cur}
                  onClick={() => switchCurrency(cur)}
                  className={`rounded-md px-3 py-1.5 font-semibold transition-colors ${currency === cur ? 'bg-star/15 text-star' : 'text-slate-400 hover:text-white'}`}
                >
                  {cur}
                </button>
              ))}
            </span>
          </label>
        </div>
      </div>

      <div className="lg:col-span-7 lg:pl-10 lg:border-l border-night-line" aria-live="polite">
        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
          <div>
            <p className="num font-display font-bold text-white text-5xl md:text-6xl leading-none">{fmt(r.hours)}</p>
            <p className="mt-3 text-lg text-slate-200">{c.hoursLabel2}</p>
            <p className="mt-2 text-copper-soft">
              {r.weeks < 52 ? c.weeks(fmt(r.weeks)) : c.fte(r.fte.toLocaleString(locale, { maximumFractionDigits: 1 }))}
            </p>
          </div>
          <div className="sm:border-l sm:border-night-line sm:pl-10">
            <p className="num font-display font-bold text-star text-5xl md:text-6xl leading-none whitespace-nowrap">{compact(r.money)}</p>
            <p className="mt-3 text-lg text-slate-200">{c.moneyLabel(currency)}</p>
            <p className="mt-2 text-slate-400">{c.exact(money(r.money))}</p>
          </div>
        </div>
        <p className="mt-6 text-sm text-slate-400 max-w-xl">{c.assumptions}</p>

        <div className="mt-8 pt-6 border-t border-night-line flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
          <p className="font-display text-xl font-bold text-white">{c.question}</p>
          <CtaLink href="/contact?service=diagnostico">{c.cta}</CtaLink>
        </div>
      </div>
    </div>
  );
};

export default RoiCalculator;
