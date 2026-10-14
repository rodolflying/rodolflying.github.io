import { C } from './palette';

/**
 * Select the text, press read, and the page is spoken paragraph by paragraph while the
 * headphones play.
 */
const PARAGRAPHS = [
  [232, 218, 160],
  [226, 236, 120],
  [214, 230, 176],
];

const AutoReadArt = () => (
  <svg viewBox="0 0 480 270" className="h-full w-full">
    {/* The article in the browser */}
    <g transform="translate(22 28)">
      <rect width="292" height="212" rx="10" fill={C.panel} stroke={C.line} strokeWidth="1.6" />
      <line x1="0" y1="20" x2="292" y2="20" stroke={C.faint} strokeWidth="1.6" />
      <circle cx="12" cy="10" r="2.3" fill={C.dim} />
      <circle cx="21" cy="10" r="2.3" fill={C.dim} />
      <circle cx="30" cy="10" r="2.3" fill={C.dim} />
      <rect x="18" y="34" width="168" height="10" rx="5" fill={C.line} fillOpacity="0.85" />
      {/* Selection sweep, then the paragraph being read */}
      <rect className="ar-select" x="12" y="58" width="262" height="140" rx="6" fill={C.sky} fillOpacity="0.16" />
      {PARAGRAPHS.map((_, p) => (
        <rect key={p} className={`ar-read ar-read-${p}`} x="12" y={58 + p * 48} width="262" height="40" rx="6" fill={C.mint} fillOpacity="0.12" stroke={C.mint} strokeOpacity="0.45" strokeWidth="1.2" />
      ))}
      {PARAGRAPHS.map((widths, p) =>
        widths.map((w, l) => <rect key={`${p}-${l}`} x="20" y={66 + p * 48 + l * 10} width={w} height="5" rx="2.5" fill={C.soft} fillOpacity="0.75" />),
      )}
    </g>

    {/* The extension's panel */}
    <g className="ar-popup">
      <g transform="translate(170 48)">
        <rect width="136" height="86" rx="10" fill={C.bg} stroke={C.mint} strokeOpacity="0.6" strokeWidth="1.4" />
        <text x="14" y="21" className="art-display" fontSize="10.5" fontWeight="700" fill={C.white}>AutoRead</text>
        <text x="14" y="40" className="art-sans" fontSize="7.5" fill={C.soft}>Voz: automática</text>
        <line x1="14" y1="54" x2="92" y2="54" stroke={C.faint} strokeWidth="3" strokeLinecap="round" />
        <line x1="14" y1="54" x2="58" y2="54" stroke={C.mint} strokeWidth="3" strokeLinecap="round" />
        <circle cx="58" cy="54" r="4.5" fill={C.white} />
        <text x="122" y="57" textAnchor="end" className="art-mono" fontSize="8" fill={C.line}>1.25x</text>
        <rect className="ar-play" x="14" y="64" width="52" height="15" rx="5" fill={C.mint} fillOpacity="0.2" stroke={C.mint} strokeWidth="1.2" />
        <path d="M23 68 l6 3.5 l-6 3.5 z" fill={C.mint} />
        <text x="34" y="74.5" className="art-sans" fontSize="7.5" fontWeight="600" fill={C.mint}>Leer</text>
      </g>
    </g>

    {/* Headphones and the sound */}
    <g transform="translate(398 134)">
      {[0, 1, 2].map((i) => (
        <g key={i} className={`ar-wave ar-wave-${i}`}>
          <path d={`M${-44 - i * 10} ${-1 - i * 6} a${26 + i * 10} ${26 + i * 10} 0 0 0 0 ${28 + i * 12}`} fill="none" stroke={C.mint} strokeWidth="1.6" strokeLinecap="round" />
          <path d={`M${44 + i * 10} ${-1 - i * 6} a${26 + i * 10} ${26 + i * 10} 0 0 1 0 ${28 + i * 12}`} fill="none" stroke={C.mint} strokeWidth="1.6" strokeLinecap="round" />
        </g>
      ))}
      <path d="M-28 6 v-10 a28 28 0 0 1 56 0 v10" fill="none" stroke={C.line} strokeWidth="2.2" strokeLinecap="round" />
      <rect x="-34" y="0" width="14" height="26" rx="6" fill={C.panel} stroke={C.line} strokeWidth="1.6" />
      <rect x="20" y="0" width="14" height="26" rx="6" fill={C.panel} stroke={C.line} strokeWidth="1.6" />
    </g>

    {/* Cursor pressing "Leer" */}
    <g className="ar-cursor">
      <path d="M0 0 L0 15 L4 11.5 L7 18 L9.6 16.9 L6.6 10.4 L11.6 10.4 Z" fill={C.white} stroke={C.bg} strokeWidth="1" strokeLinejoin="round" />
    </g>
  </svg>
);

export default AutoReadArt;
