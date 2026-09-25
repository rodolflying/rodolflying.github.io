import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Users, 
  ArrowRight, 
  Sparkles, 
  CheckCircle,
  Zap
} from 'lucide-react';
import { Link } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';

const COPY = {
  es: {
    badge: 'SIMULADOR FINANCIERO DE IMPACTO',
    title: 'Calculadora de Retorno de Inversión (ROI)',
    subtitle: 'Calcula cuánto dinero y tiempo recupera tu equipo al reemplazar tareas manuales por scripts y bots nativos.',
    hoursLabel: 'Horas manuales perdidas por día (por persona):',
    hour: 'hora', hours: 'horas', perDay: '/día',
    hoursScale: ['1 hora (Mínimo)', '4 horas (Medio día)', '8 horas (Jornada completa)'],
    teamLabel: 'Personas en el equipo haciendo este trabajo:',
    member: 'colaborador', members: 'colaboradores',
    teamScale: ['1 persona', '15 personas', '30 personas'],
    rateLabel: 'Costo hora estimado del colaborador:',
    insightPre: 'Tu equipo pierde ', insightHours: 'horas al día', insightPost: ' en procesos repetitivos que un bot ejecuta en minutos.',
    savingsLabel: 'AHORRO ANUALIZADO ESTIMADO',
    savingsText: 'Lo que tu empresa deja de gastar cada año en digitación, descargas manuales o planillas Excel.',
    hoursSaved: 'Horas recuperadas / año', hoursSavedSub: 'Tiempo para tareas de valor',
    payback: 'Tiempo de recuperación', months: 'meses', paybackSub: 'Hasta recuperar la inversión',
    roiLabel: 'ROI estimado el primer año (ilustrativo):',
    assumptions: (setup: string) => `Supuestos: 60% del tiempo es automatizable, 240 días hábiles al año y una inversión inicial referencial de ${setup}. No incluye soporte mensual ni hosting. Cada caso se cotiza tras el diagnóstico.`,
    cta: 'AUTOMATIZAR ESTE PROCESO',
  },
  en: {
    badge: 'FINANCIAL IMPACT SIMULATOR',
    title: 'Return on Investment (ROI) Calculator',
    subtitle: 'Estimate how much money and time your team gets back by replacing manual tasks with scripts and bots.',
    hoursLabel: 'Manual hours lost per day (per person):',
    hour: 'hour', hours: 'hours', perDay: '/day',
    hoursScale: ['1 hour (minimum)', '4 hours (half day)', '8 hours (full day)'],
    teamLabel: 'People on the team doing this work:',
    member: 'person', members: 'people',
    teamScale: ['1 person', '15 people', '30 people'],
    rateLabel: 'Estimated hourly cost per person:',
    insightPre: 'Your team loses ', insightHours: 'hours a day', insightPost: ' on repetitive work a bot can do in minutes.',
    savingsLabel: 'ESTIMATED ANNUAL SAVINGS',
    savingsText: 'What your company stops spending every year on data entry, manual downloads or Excel sheets.',
    hoursSaved: 'Hours recovered / year', hoursSavedSub: 'Time for higher-value work',
    payback: 'Payback period', months: 'months', paybackSub: 'Until the investment is recovered',
    roiLabel: 'Estimated first-year ROI (illustrative):',
    assumptions: (setup: string) => `Assumptions: 60% of the time can be automated, 240 working days a year and a reference setup cost of ${setup}. Excludes monthly support and hosting. Every case is quoted after the diagnosis.`,
    cta: 'AUTOMATE THIS PROCESS',
  },
};

export const RoiCalculator = () => {
  const { language } = useLanguage();
  const c = COPY[language];
  const [currency, setCurrency] = useState<'USD' | 'CLP'>('USD');
  const [hoursPerDay, setHoursPerDay] = useState<number>(1.5);
  const [teamSize, setTeamSize] = useState<number>(2);
  const [hourlyRate, setHourlyRate] = useState<number>(25); // 25 USD or 20,000 CLP

  // If currency changes, adjust reasonable default hourly rate
  const handleCurrencyChange = (newCurrency: 'USD' | 'CLP') => {
    if (newCurrency === currency) return;
    setCurrency(newCurrency);
    if (newCurrency === 'CLP') {
      setHourlyRate(20000);
    } else {
      setHourlyRate(25);
    }
  };

  const results = useMemo(() => {
    // 240 working days per year
    const workingDays = 240;
    // Conservative: assume 60% of the repetitive time can be automated
    const automationRate = 0.60;
    
    const dailyHoursWasted = hoursPerDay * teamSize;
    const annualHoursSaved = Math.round(dailyHoursWasted * workingDays * automationRate);
    const annualMoneySaved = Math.round(annualHoursSaved * hourlyRate);

    // Estimated Star Apps bot setup cost
    const estimatedSetupCost = currency === 'USD' ? 3500 : 3200000;
    const annualNetGain = Math.max(0, annualMoneySaved - estimatedSetupCost);
    const paybackMonths = annualMoneySaved > 0 
      ? Math.max(0.4, Number(((estimatedSetupCost / annualMoneySaved) * 12).toFixed(1)))
      : 12;
    const roiPercentage = estimatedSetupCost > 0 
      ? Math.round((annualNetGain / estimatedSetupCost) * 100) 
      : 0;

    return {
      dailyHoursWasted,
      annualHoursSaved,
      annualMoneySaved,
      paybackMonths,
      roiPercentage,
      estimatedSetupCost
    };
  }, [hoursPerDay, teamSize, hourlyRate, currency]);

  const formatCurrency = (val: number) => {
    if (currency === 'USD') {
      return `$${val.toLocaleString('en-US')} USD`;
    }
    return `$${val.toLocaleString('es-CL')} CLP`;
  };

  return (
    <div className="bg-[#070B14] border border-night-line rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#47E5C2]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-night-line/80 pb-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#47E5C2]/10 border border-[#47E5C2]/30 mb-2">
            <Calculator className="w-3.5 h-3.5 text-[#47E5C2]" />
            <span className="text-xs font-mono text-[#47E5C2] font-bold tracking-wider">
              {c.badge}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
            {c.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {c.subtitle}
          </p>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center gap-2 bg-black/70 p-1 rounded-lg border border-night-line shrink-0 self-start sm:self-auto">
          <span className="text-xs text-slate-400 font-mono pl-2">{language === 'es' ? 'Moneda:' : 'Currency:'}</span>
          <button
            onClick={() => handleCurrencyChange('USD')}
            className={`px-3 py-1 text-xs font-mono rounded font-bold transition-colors ${
              currency === 'USD' ? 'bg-[#47E5C2] text-black shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            USD ($)
          </button>
          <button
            onClick={() => handleCurrencyChange('CLP')}
            className={`px-3 py-1 text-xs font-mono rounded font-bold transition-colors ${
              currency === 'CLP' ? 'bg-[#47E5C2] text-black shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            CLP ($)
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-center">
        {/* Left Form: Sliders */}
        <div className="lg:col-span-6 space-y-6">
          {/* Slider 1: Hours per day */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="text-slate-300 font-medium flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#47E5C2]" />
                {c.hoursLabel}
              </span>
              <span className="font-mono font-bold text-[#47E5C2] bg-[#47E5C2]/10 px-2.5 py-0.5 rounded border border-[#47E5C2]/30">
                {hoursPerDay} {hoursPerDay === 1 ? c.hour : c.hours}{c.perDay}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="8"
              step="0.5"
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#47E5C2]"
            />
            <div className="flex justify-between text-xs text-slate-400 font-mono">
              <span>{c.hoursScale[0]}</span>
              <span>{c.hoursScale[1]}</span>
              <span>{c.hoursScale[2]}</span>
            </div>
          </div>

          {/* Slider 2: Team Size */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="text-slate-300 font-medium flex items-center gap-2">
                <Users className="w-4 h-4 text-[#7DD3FC]" />
                {c.teamLabel}
              </span>
              <span className="font-mono font-bold text-[#7DD3FC] bg-[#7DD3FC]/10 px-2.5 py-0.5 rounded border border-[#7DD3FC]/30">
                {teamSize} {teamSize === 1 ? c.member : c.members}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={teamSize}
              onChange={(e) => setTeamSize(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#7DD3FC]"
            />
            <div className="flex justify-between text-xs text-slate-400 font-mono">
              <span>{c.teamScale[0]}</span>
              <span>{c.teamScale[1]}</span>
              <span>{c.teamScale[2]}</span>
            </div>
          </div>

          {/* Slider 3: Hourly Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="text-slate-300 font-medium flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#FFC857]" />
                {c.rateLabel}
              </span>
              <span className="font-mono font-bold text-[#FFC857] bg-[#FFC857]/10 px-2.5 py-0.5 rounded border border-[#FFC857]/30">
                {formatCurrency(hourlyRate)}/hr
              </span>
            </div>
            <input
              type="range"
              min={currency === 'USD' ? 10 : 8000}
              max={currency === 'USD' ? 80 : 60000}
              step={currency === 'USD' ? 5 : 2000}
              value={hourlyRate}
              onChange={(e) => setHourlyRate(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#FFC857]"
            />
            <div className="flex justify-between text-xs text-slate-400 font-mono">
              <span>{currency === 'USD' ? '$10 USD' : '$8,000 CLP'}</span>
              <span>{currency === 'USD' ? '$45 USD' : '$30,000 CLP'}</span>
              <span>{currency === 'USD' ? '$80 USD' : '$60,000 CLP'}</span>
            </div>
          </div>

          {/* Key Insight Pill */}
          <div className="p-3.5 bg-black/40 border border-night-line rounded-xl text-xs text-slate-300 flex items-center gap-3">
            <Zap className="w-4 h-4 text-[#47E5C2] shrink-0" />
            <span>
              {c.insightPre}<strong>{results.dailyHoursWasted} {c.insightHours}</strong>{c.insightPost}
            </span>
          </div>
        </div>

        {/* Right Panel: Output KPIs */}
        <div className="lg:col-span-6 bg-black/60 border border-night-line rounded-xl p-6 relative">
          <div className="space-y-4">
            {/* Primary Big KPI */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-[#47E5C2]/10 via-black to-[#7C9CFF]/10 border border-[#47E5C2]/30">
              <span className="text-xs font-mono text-slate-400 block mb-1 uppercase tracking-wider">
                {c.savingsLabel}
              </span>
              <div className="text-3xl sm:text-4xl font-display font-bold text-[#47E5C2] tracking-tight">
                {formatCurrency(results.annualMoneySaved)}
              </div>
              <p className="text-xs text-slate-300 mt-2">
                {c.savingsText}
              </p>
            </div>

            {/* Secondary KPIs Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-lg bg-night-900 border border-night-line">
                <span className="text-xs font-mono text-slate-400 block">{c.hoursSaved}</span>
                <span className="text-xl font-bold font-display text-white">
                  {results.annualHoursSaved.toLocaleString(language === 'es' ? 'es-CL' : 'en-US')} hrs
                </span>
                <span className="text-xs text-slate-400 block mt-1">{c.hoursSavedSub}</span>
              </div>

              <div className="p-3.5 rounded-lg bg-night-900 border border-night-line">
                <span className="text-xs font-mono text-slate-400 block">{c.payback}</span>
                <span className="text-xl font-bold font-display text-[#7DD3FC]">
                  {results.paybackMonths} {c.months}
                </span>
                <span className="text-xs text-slate-400 block mt-1">{c.paybackSub}</span>
              </div>
            </div>

            {/* Payback & ROI Bar */}
            <div className="p-3.5 rounded-lg bg-night-900 border border-night-line">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-slate-400">{c.roiLabel}</span>
                <span className="font-mono font-bold text-[#47E5C2]">+{results.roiPercentage}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#47E5C2] to-[#7DD3FC] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(15, results.roiPercentage / 5))}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {c.assumptions(formatCurrency(results.estimatedSetupCost))}
              </p>
            </div>

            {/* Direct Action Button */}
            <Link href="/contact?service=automatizacion">
              <span className="w-full py-3.5 bg-[#47E5C2] text-black font-bold rounded-lg hover:bg-[#47E5C2]/85 transition-all duration-300 shadow-lg shadow-[#47E5C2]/20 flex items-center justify-center gap-2 cursor-pointer text-sm font-display tracking-wider">
                <span>{c.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoiCalculator;
