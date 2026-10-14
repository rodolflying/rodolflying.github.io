import { C } from './palette';

/**
 * WhatsApp voice notes play, travel to a laptop that works offline, and come out as written
 * lines in a document.
 */
const BARS = [5, 9, 14, 8, 12, 17, 10, 6, 13, 9, 5];
const LINES = [62, 54, 66, 40, 60, 66, 48, 30];

const VoiceNote = ({ y, id }: { y: number; id: number }) => (
  <g transform={`translate(46 ${y})`}>
    <rect width="82" height="30" rx="11" fill={C.bg} stroke={C.faint} strokeWidth="1.4" />
    <path d="M10 9 l9 6 l-9 6 z" fill={C.mint} />
    {BARS.map((h, i) => (
      <rect
        key={i}
        className={`aw-bar aw-bar-${id}`}
        style={{ animationDelay: `${-i * 0.11}s` }}
        x={27 + i * 4.6}
        y={15 - h / 2}
        width="2.4"
        height={h}
        rx="1.2"
        fill={C.soft}
      />
    ))}
  </g>
);

const WhisperArt = () => (
  <svg viewBox="0 0 480 270" className="h-full w-full">
    {/* Phone with the voice notes */}
    <g transform="translate(34 26)">
      <rect width="106" height="216" rx="18" fill={C.panel} stroke={C.line} strokeWidth="1.6" />
      <rect x="40" y="9" width="26" height="5" rx="2.5" fill={C.faint} />
      <text x="14" y="34" className="art-sans" fontSize="8" fill={C.soft}>Terreno · norte</text>
      <line x1="0" y1="42" x2="106" y2="42" stroke={C.faint} strokeWidth="1.4" />
    </g>
    <VoiceNote y={84} id={0} />
    <VoiceNote y={124} id={1} />
    <g transform="translate(58 166)">
      <rect width="70" height="22" rx="9" fill={C.faint} />
      <rect x="10" y="9" width="44" height="4" rx="2" fill={C.dim} />
    </g>

    {/* Audio travelling to the laptop */}
    <line x1="146" y1="128" x2="180" y2="128" stroke={C.sky} strokeOpacity="0.5" strokeWidth="1.4" strokeDasharray="3 5" />
    {[0, 1].map((i) => (
      <circle key={i} className={`aw-dot aw-dot-${i}`} cx="0" cy="128" r="2.6" fill={C.sky} />
    ))}

    {/* Laptop, offline */}
    <g transform="translate(188 82)">
      <rect width="128" height="86" rx="8" fill={C.panel} stroke={C.line} strokeWidth="1.6" />
      <text x="12" y="17" className="art-mono" fontSize="7.5" fill={C.mint}>whisper · small</text>
      <polyline
        className="aw-wave"
        points="12,48 20,48 24,36 30,60 36,40 42,54 48,30 54,64 60,44 66,52 72,38 78,58 84,46 90,50 96,42 102,52 108,48 116,48"
        fill="none"
        stroke={C.sky}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <rect x="12" y="72" width="104" height="4" rx="2" fill={C.faint} />
      <rect className="aw-progress" x="12" y="72" width="104" height="4" rx="2" fill={C.mint} />
    </g>
    <path d="M176 176 h152 l10 10 h-172 z" fill={C.panel} stroke={C.line} strokeWidth="1.6" strokeLinejoin="round" />
    {/* No internet needed */}
    <g transform="translate(236 40)">
      <path d="M-14 0 a20 20 0 0 1 28 0" fill="none" stroke={C.dim} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M-8 6 a12 12 0 0 1 16 0" fill="none" stroke={C.dim} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="0" cy="12" r="2" fill={C.dim} />
      <line x1="-14" y1="16" x2="14" y2="-6" stroke={C.coral} strokeWidth="1.8" strokeLinecap="round" />
      <text x="24" y="10" className="art-sans" fontSize="8.5" fill={C.soft}>sin internet</text>
    </g>

    {/* Written result */}
    <line x1="322" y1="128" x2="356" y2="128" stroke={C.mint} strokeOpacity="0.5" strokeWidth="1.4" strokeDasharray="3 5" />
    <g transform="translate(362 40)">
      <path d="M0 8 a8 8 0 0 1 8 -8 h62 l18 18 v148 a8 8 0 0 1 -8 8 h-72 a8 8 0 0 1 -8 -8 z" fill={C.panel} stroke={C.line} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M70 0 v18 h18" fill="none" stroke={C.line} strokeWidth="1.4" strokeLinejoin="round" />
      <text x="10" y="32" className="art-mono" fontSize="6.2" fill={C.soft}>transcripciones.md</text>
      {LINES.map((w, i) => (
        <rect key={i} className={`aw-line aw-line-${i}`} x="10" y={46 + i * 14} width={w} height="5" rx="2.5" fill={i % 4 === 0 ? C.mint : C.line} fillOpacity={i % 4 === 0 ? 0.9 : 0.55} />
      ))}
      <rect className="aw-caret" x="44" y="142" width="2" height="9" fill={C.mint} />
    </g>
  </svg>
);

export default WhisperArt;
