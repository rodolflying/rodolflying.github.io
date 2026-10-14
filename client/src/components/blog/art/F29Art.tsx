import { C } from './palette';

/**
 * F29 sin movimiento: the bot ticks "Sin movimiento", sends the form, the receipt with its folio
 * comes out and a notice goes to the team, all before day 28 on the calendar.
 */
const F29Art = () => (
  <svg viewBox="0 0 480 270" className="h-full w-full">
    {/* Calendar: the deadline */}
    <g transform="translate(24 62)">
      <rect width="112" height="120" rx="10" fill={C.panel} stroke={C.soft} strokeWidth="1.6" />
      <line x1="0" y1="26" x2="112" y2="26" stroke={C.faint} strokeWidth="1.6" />
      <text x="56" y="16" textAnchor="middle" className="art-mono" fontSize="8.5" fill={C.soft}>PLAZO</text>
      {Array.from({ length: 28 }, (_, i) => {
        const col = i % 7, row = Math.floor(i / 7);
        return i === 27 ? null : <circle key={i} cx={14 + col * 14} cy={42 + row * 20} r="2.2" fill={C.dim} />;
      })}
      <g className="af-due">
        <circle cx="98" cy="102" r="10" fill="none" stroke={C.gold} strokeWidth="1.6" />
        <text x="98" y="105" textAnchor="middle" className="art-mono" fontSize="8.5" fontWeight="700" fill={C.gold}>28</text>
      </g>
    </g>

    {/* The tax portal form */}
    <g transform="translate(152 34)">
      <rect width="196" height="166" rx="10" fill={C.panel} stroke={C.line} strokeWidth="1.6" />
      <line x1="0" y1="22" x2="196" y2="22" stroke={C.faint} strokeWidth="1.6" />
      <circle cx="13" cy="11" r="2.5" fill={C.dim} />
      <circle cx="23" cy="11" r="2.5" fill={C.dim} />
      <circle cx="33" cy="11" r="2.5" fill={C.dim} />
      <rect x="46" y="5" width="104" height="12" rx="6" fill={C.bg} stroke={C.faint} />
      <text x="56" y="13.5" className="art-mono" fontSize="7" fill={C.soft}>sii.cl · F29</text>
      <text x="16" y="45" className="art-display" fontSize="12.5" fontWeight="700" fill={C.white}>Declaración F29</text>
      <text x="16" y="61" className="art-sans" fontSize="8.5" fill={C.soft}>Período: mes anterior</text>
      <rect x="16" y="78" width="14" height="14" rx="3" fill={C.bg} stroke={C.line} strokeWidth="1.4" />
      <path className="af-tick" d="M19.5 85 l3.5 3.5 l7 -8" fill="none" stroke={C.mint} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" pathLength={1} />
      <text x="38" y="88.5" className="art-sans" fontSize="9.5" fill={C.line}>Sin movimiento</text>
      <rect x="16" y="104" width="164" height="9" rx="4.5" fill={C.faint} />
      <rect x="16" y="117" width="120" height="9" rx="4.5" fill={C.faint} />
      <rect className="af-send" x="16" y="136" width="72" height="22" rx="6" fill={C.mint} fillOpacity="0" stroke={C.mint} strokeWidth="1.6" />
      <text x="52" y="150" textAnchor="middle" className="art-sans" fontSize="9.5" fontWeight="600" fill={C.mint}>Enviar</text>
    </g>

    {/* The receipt with its folio */}
    <g className="af-receipt">
      <g transform="translate(364 56)">
        <rect width="92" height="124" rx="8" fill={C.panel} stroke={C.line} strokeWidth="1.6" />
        <text x="12" y="20" className="art-sans" fontSize="8" fill={C.soft}>Comprobante</text>
        <text x="12" y="42" className="art-sans" fontSize="8" fill={C.soft}>Folio</text>
        <text x="12" y="57" className="art-mono" fontSize="9.5" fill={C.white}>N° ········</text>
        <rect x="12" y="72" width="62" height="5" rx="2.5" fill={C.faint} />
        <rect x="12" y="83" width="46" height="5" rx="2.5" fill={C.faint} />
        <circle cx="68" cy="104" r="10" fill="none" stroke={C.mint} strokeWidth="1.6" />
        <path className="af-ok" d="M63.5 104 l3 3 l6 -6.5" fill="none" stroke={C.mint} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" pathLength={1} />
      </g>
    </g>

    {/* The notice to the team */}
    <g className="af-note">
      <rect x="196" y="216" width="196" height="28" rx="14" fill={C.bg} stroke={C.mint} strokeOpacity="0.5" strokeWidth="1.4" />
      <circle cx="214" cy="230" r="6" fill={C.mint} fillOpacity="0.18" />
      <path d="M211 230 l2 2 l4 -4.5" fill="none" stroke={C.mint} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <text x="228" y="233" className="art-sans" fontSize="8.5" fill={C.line}>Declarado · folio guardado</text>
    </g>

    {/* The bot's cursor and its clicks */}
    <circle className="af-ripple af-ripple-1" cx="175" cy="119" r="11" fill="none" stroke={C.mint} strokeWidth="1.4" />
    <circle className="af-ripple af-ripple-2" cx="204" cy="181" r="13" fill="none" stroke={C.mint} strokeWidth="1.4" />
    <g className="af-cursor">
      <path d="M0 0 L0 15 L4 11.5 L7 18 L9.6 16.9 L6.6 10.4 L11.6 10.4 Z" fill={C.white} stroke={C.bg} strokeWidth="1" strokeLinejoin="round" />
    </g>
  </svg>
);

export default F29Art;
