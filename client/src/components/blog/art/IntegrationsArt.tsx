import { C } from './palette';

/**
 * Two ways into a system without an API: (1) the script asks the server what the web page asks
 * for, in fast batches; (2) a browser is driven row by row, slower but almost always possible.
 */
const ROWS = [0, 1, 2, 3];

const IntegrationsArt = () => (
  <svg viewBox="0 0 480 270" className="h-full w-full">
    {/* Server */}
    <g transform="translate(214 14)">
      <path d="M0 8 v34 a26 7 0 0 0 52 0 v-34" fill={C.panel} stroke={C.line} strokeWidth="1.6" />
      <ellipse cx="26" cy="8" rx="26" ry="7" fill={C.panel} stroke={C.line} strokeWidth="1.6" />
      <path d="M0 25 a26 7 0 0 0 52 0" fill="none" stroke={C.faint} strokeWidth="1.4" />
      <circle className="ai-led" cx="40" cy="34" r="2.2" fill={C.mint} />
      <circle cx="33" cy="34" r="2.2" fill={C.dim} />
    </g>

    {/* The web page talks to the server */}
    <polyline points="210,34 106,34 106,98" fill="none" stroke={C.sky} strokeOpacity="0.5" strokeWidth="1.4" strokeDasharray="3 5" />
    {[0, 1].map((i) => (
      <rect key={i} className={`ai-web ai-web-${i}`} x="-7" y="-4" width="14" height="8" rx="3" fill={C.sky} fillOpacity="0.85" />
    ))}

    {/* Path 1: the script calls the same service */}
    <polyline points="270,34 374,34 374,98" fill="none" stroke={C.mint} strokeOpacity="0.6" strokeWidth="1.6" strokeDasharray="3 5" />
    {[0, 1, 2].map((i) => (
      <g key={i} className={`ai-pkt ai-pkt-${i}`}>
        <rect x="-11" y="-6" width="22" height="12" rx="4" fill={C.bg} stroke={C.mint} strokeWidth="1.2" />
        <text x="0" y="2.6" textAnchor="middle" className="art-mono" fontSize="7" fill={C.mint}>{'{ }'}</text>
      </g>
    ))}
    <text x="312" y="26" className="art-mono" fontSize="8" fill={C.mint}>1 · servicio interno</text>

    {/* Browser with the data table */}
    <g transform="translate(22 104)">
      <rect width="168" height="124" rx="10" fill={C.panel} stroke={C.line} strokeWidth="1.6" />
      <line x1="0" y1="20" x2="168" y2="20" stroke={C.faint} strokeWidth="1.6" />
      <circle cx="12" cy="10" r="2.3" fill={C.dim} />
      <circle cx="21" cy="10" r="2.3" fill={C.dim} />
      <circle cx="30" cy="10" r="2.3" fill={C.dim} />
      {ROWS.map((i) => (
        <g key={i}>
          <rect className={i < 3 ? `ai-row ai-row-${i}` : undefined} x="12" y={32 + i * 22} width="144" height="16" rx="4" fill={C.gold} fillOpacity="0" stroke={C.faint} strokeWidth="1.2" />
          <rect x="20" y={38 + i * 22} width="40" height="4" rx="2" fill={C.soft} fillOpacity="0.7" />
          <rect x="72" y={38 + i * 22} width="30" height="4" rx="2" fill={C.dim} />
          <rect x="114" y={38 + i * 22} width="32" height="4" rx="2" fill={C.dim} />
        </g>
      ))}
    </g>

    {/* Path 2: the browser, row by row */}
    <line x1="196" y1="196" x2="284" y2="196" stroke={C.gold} strokeOpacity="0.6" strokeWidth="1.6" strokeDasharray="3 5" />
    <rect className="ai-copy" x="-8" y="-5" width="16" height="10" rx="3" fill={C.gold} fillOpacity="0.9" />
    <text x="240" y="216" textAnchor="middle" className="art-mono" fontSize="8" fill={C.gold}>2 · navegador</text>

    {/* The script receiving both */}
    <g transform="translate(290 104)">
      <rect width="168" height="124" rx="10" fill={C.bg} stroke={C.line} strokeWidth="1.6" />
      <text x="12" y="16" className="art-mono" fontSize="7.5" fill={C.soft}>python traer_todo.py</text>
      <line x1="0" y1="24" x2="168" y2="24" stroke={C.faint} strokeWidth="1.4" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} className={`ai-bulk ai-bulk-${i}`} x="14" y={36 + i * 11} width={[118, 96, 132, 84, 110][i]} height="5" rx="2.5" fill={C.mint} fillOpacity="0.8" />
      ))}
      {[0, 1, 2].map((i) => (
        <rect key={i} className={`ai-one ai-one-${i}`} x="14" y={96 + i * 9} width={[64, 52, 70][i]} height="4.5" rx="2.25" fill={C.gold} fillOpacity="0.85" />
      ))}
    </g>

    {/* The cursor working the browser */}
    <g className="ai-cursor">
      <path d="M0 0 L0 15 L4 11.5 L7 18 L9.6 16.9 L6.6 10.4 L11.6 10.4 Z" fill={C.white} stroke={C.bg} strokeWidth="1" strokeLinejoin="round" />
    </g>
  </svg>
);

export default IntegrationsArt;
