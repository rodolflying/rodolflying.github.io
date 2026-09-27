// Dev-only review sheet for the step icons (not part of the site build).
import { createRoot } from 'react-dom/client';
import { STEP_ICONS } from '../src/components/sections/services/StepIcons';

const COLORS = ['#FF8FA3', '#FFC857', '#7DD3FC', '#47E5C2', '#7C9CFF', '#C4F18A'];
const active = new URLSearchParams(location.search).has('active');

createRoot(document.getElementById('root')!).render(
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 150px)', gap: 12 }}>
    {Object.entries(STEP_ICONS).map(([name, Icon], i) => (
      <div key={name} style={{ background: '#0E1626', border: '1px solid #1E2A40', borderRadius: 16, padding: 12, textAlign: 'center' }}>
        <Icon color={COLORS[i % 6]} active={active} className="" />
        <div>{name}</div>
      </div>
    ))}
  </div>,
);
