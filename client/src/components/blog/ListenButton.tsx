import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { Headphones, Pause, Play, Square } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import type { PostMeta } from '@/lib/blog';

/**
 * "Escuchar artículo": the AutoRead extension's ideas, built into the blog with the browser's
 * own voices (Web Speech API). Clean the text, read block by block so the voice keeps its
 * intonation, prefer a Spanish voice, and light up the paragraph being read.
 */

interface Piece { text: string; el?: HTMLElement }

const RATES = [1, 1.25, 1.5, 1.75, 2, 0.75];
/** Short pieces: some online voices in Chrome stop when a single utterance runs too long. */
const MAX_CHARS = 220;

const supported = () => typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

/** What makes text sound bad aloud: soft hyphens, raw links, runs of spaces. */
export function cleanForSpeech(text: string) {
  return text
    .replace(/­/g, '')
    .replace(/https?:\/\/\S+/g, 'enlace')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Whole sentences, grouped up to MAX_CHARS, so the voice never stops mid-sentence. */
export function splitForSpeech(text: string, max = MAX_CHARS) {
  if (text.length <= max) return [text];
  const out: string[] = [];
  let current = '';
  for (const sentence of text.split(/(?<=[.!?…:;])\s+/)) {
    if (current && (current + ' ' + sentence).length > max) {
      out.push(current);
      current = sentence;
    } else {
      current = current ? `${current} ${sentence}` : sentence;
    }
  }
  if (current) out.push(current);
  return out;
}

/** Natural voices first, Chilean Spanish first, then Latin American, then any Spanish. */
function pickVoice(voices: SpeechSynthesisVoice[]) {
  const score = (v: SpeechSynthesisVoice) =>
    (/natural|neural|online/i.test(v.name) ? 4 : 0) + (/^es[-_]CL/i.test(v.lang) ? 3 : /^es[-_](419|MX|US|AR|CO|PE)/i.test(v.lang) ? 2 : 0) + (v.localService ? 1 : 0);
  return voices.filter((v) => /^es\b|^es[-_]/i.test(v.lang)).sort((a, b) => score(b) - score(a))[0];
}

/** The article in reading order: title, lead, "En corto", then the body. Code is announced, not read. */
function collect(meta: PostMeta, summary: HTMLElement | null, body: HTMLElement | null): Piece[] {
  const pieces: Piece[] = [{ text: meta.title }, { text: meta.description }];
  if (summary) pieces.push({ text: `En corto. ${meta.summary.join(' ')}`, el: summary });
  body?.querySelectorAll<HTMLElement>(':scope > h2, :scope > h3, :scope > p, :scope > ul > li, :scope > ol > li, :scope > blockquote, :scope > figure.code, :scope > .table-wrap').forEach((el) => {
    if (el.matches('figure.code')) pieces.push({ text: 'Sigue un bloque de código.', el });
    else if (el.matches('.table-wrap')) {
      el.querySelectorAll('tbody tr').forEach((tr) => pieces.push({ text: Array.from(tr.children, (td) => td.textContent).join(': ') + '.', el: tr as HTMLElement }));
    } else pieces.push({ text: el.textContent || '', el });
  });
  return pieces
    .map((p) => ({ ...p, text: cleanForSpeech(p.text) }))
    .filter((p) => p.text)
    .flatMap((p) => splitForSpeech(p.text).map((text) => ({ text, el: p.el })));
}

type Status = 'idle' | 'playing' | 'paused';

const ListenButton = ({ meta, summaryRef, bodyRef, ready }: {
  meta: PostMeta;
  summaryRef: RefObject<HTMLElement>;
  bodyRef: RefObject<HTMLElement>;
  /** The article body is in the page. */
  ready: boolean;
}) => {
  const { t } = useLanguage();
  const [status, setStatus] = useState<Status>('idle');
  const [rate, setRate] = useState(1);
  const pieces = useRef<Piece[]>([]);
  const index = useRef(0);
  // Every start or stop bumps the run; utterances from an older run ignore their events.
  const run = useRef(0);
  const voice = useRef<SpeechSynthesisVoice>();
  const lit = useRef<HTMLElement>();

  useEffect(() => {
    if (!supported()) return;
    const load = () => (voice.current = pickVoice(speechSynthesis.getVoices()));
    load();
    speechSynthesis.addEventListener('voiceschanged', load);
    return () => speechSynthesis.removeEventListener('voiceschanged', load);
  }, []);

  const light = (el?: HTMLElement) => {
    if (lit.current === el) return;
    lit.current?.classList.remove('is-reading');
    lit.current = el;
    if (!el) return;
    el.classList.add('is-reading');
    const box = el.getBoundingClientRect();
    if (box.top < 80 || box.bottom > window.innerHeight - 96) {
      const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el.scrollIntoView({ block: 'center', behavior: smooth ? 'smooth' : 'auto' });
    }
  };

  const stop = useCallback(() => {
    run.current++;
    if (supported()) speechSynthesis.cancel();
    lit.current?.classList.remove('is-reading');
    lit.current = undefined;
    setStatus('idle');
  }, []);

  const speakFrom = useCallback((i: number, speed: number) => {
    const piece = pieces.current[i];
    if (!piece) return stop();
    index.current = i;
    const myRun = ++run.current;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(piece.text);
    u.lang = voice.current?.lang || 'es-CL';
    if (voice.current) u.voice = voice.current;
    u.rate = speed;
    u.onend = () => {
      if (run.current === myRun) speakFrom(i + 1, speed);
    };
    u.onerror = (e) => {
      // "interrupted"/"canceled" are our own cancel(); anything else ends the reading.
      if (run.current === myRun && e.error !== 'interrupted' && e.error !== 'canceled') stop();
    };
    light(piece.el);
    speechSynthesis.speak(u);
    setStatus('playing');
  }, [stop]);

  // Leaving the article (or changing to another one) stops the voice.
  useEffect(() => stop, [meta.slug, stop]);

  if (!supported()) return null;

  const start = () => {
    pieces.current = collect(meta, summaryRef.current, bodyRef.current);
    speakFrom(0, rate);
  };
  const toggle = () => {
    if (status === 'playing') {
      speechSynthesis.pause();
      setStatus('paused');
    } else if (status === 'paused') {
      speechSynthesis.resume();
      setStatus('playing');
    } else start();
  };
  const nextRate = () => {
    const r = RATES[(RATES.indexOf(rate) + 1) % RATES.length];
    setRate(r);
    // A new speed applies from the current piece.
    if (status === 'playing') speakFrom(index.current, r);
  };

  const label = status === 'playing' ? t('blog.listen_pause') : status === 'paused' ? t('blog.listen_resume') : t('blog.listen');

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        disabled={!ready}
        className="mt-7 inline-flex items-center gap-2.5 rounded-full border border-line bg-surface-1 py-2 pl-2 pr-4 text-sm font-semibold text-white transition-colors hover:border-star hover:text-star disabled:opacity-60"
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-star text-night">
          {status === 'playing' ? <Pause className="h-3.5 w-3.5" aria-hidden="true" /> : <Headphones className="h-3.5 w-3.5" aria-hidden="true" />}
        </span>
        {label}
      </button>

      {status !== 'idle' && (
        <div
          role="region"
          aria-label={t('blog.listen_player')}
          className="fixed inset-x-4 bottom-4 z-40 mx-auto flex max-w-md items-center gap-3 rounded-full border border-line bg-surface-2/95 py-2 pl-2 pr-3 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-md"
        >
          <button
            type="button"
            onClick={toggle}
            aria-label={label}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-star text-night transition-colors hover:bg-star-soft"
          >
            {status === 'playing' ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
          </button>
          <p className="min-w-0 flex-1 truncate text-sm text-ink-2" aria-live="polite">
            <span className="font-semibold text-white">{status === 'playing' ? t('blog.listening') : t('blog.listen_paused')}</span>
            <span className="text-ink-3"> · {meta.title}</span>
          </p>
          <button
            type="button"
            onClick={nextRate}
            aria-label={`${t('blog.listen_speed')}: ${rate}x`}
            className="num shrink-0 rounded-full border border-line px-2.5 py-1 font-mono text-xs text-ink-2 transition-colors hover:border-star hover:text-star"
          >
            {rate}x
          </button>
          <button
            type="button"
            onClick={stop}
            aria-label={t('blog.listen_stop')}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-ink-3 transition-colors hover:bg-white/5 hover:text-white"
          >
            <Square className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      )}
    </>
  );
};

export default ListenButton;
