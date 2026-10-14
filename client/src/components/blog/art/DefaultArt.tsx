import { C } from './palette';

/** For an article that has no scene of its own yet: a document being checked off. */
const DefaultArt = () => (
  <svg viewBox="0 0 480 270" className="h-full w-full">
    <g transform="translate(176 36)">
      <rect width="128" height="176" rx="10" fill={C.panel} stroke={C.line} strokeWidth="1.6" />
      <rect x="16" y="20" width="70" height="8" rx="4" fill={C.line} fillOpacity="0.85" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i}>
          <circle cx="22" cy={52 + i * 20} r="5" fill="none" stroke={i < 4 ? C.mint : C.dim} strokeWidth="1.4" />
          <rect x="34" y={49 + i * 20} width={[72, 60, 78, 52, 66, 44][i]} height="5" rx="2.5" fill={C.soft} fillOpacity="0.7" />
        </g>
      ))}
    </g>
  </svg>
);

export default DefaultArt;
