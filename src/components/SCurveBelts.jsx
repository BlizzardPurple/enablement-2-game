import Belt from './Belt';
import WorkerRobots from './WorkerRobots';

/**
 * S-shaped belt layout. All 3 visible from start.
 * Belt 1: L→R, Belt 2: R→L, Belt 3: L→R
 * SVG connectors draw the S-curve between them.
 */
export default function SCurveBelts({ belt, selUid, onSel, frozen, slow, e2, reversed, perf }) {
  const d1 = reversed ? 'rtl' : 'ltr';
  const d2 = reversed ? 'ltr' : 'rtl';
  const d3 = reversed ? 'rtl' : 'ltr';

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Belt 1 */}
      <Belt num={1} dir={d1} items={belt.byBelt(1)} selUid={selUid} onSel={onSel} frozen={frozen} slow={slow} e2={e2} />

      {/* S-curve connector 1→2 */}
      <svg width="100%" height="28" style={{ display: 'block' }}>
        <path d={`M ${d1 === 'ltr' ? '100%' : '0'} 0 C ${d1 === 'ltr' ? '85%' : '15%'} 28, ${d2 === 'rtl' ? '85%' : '15%'} 0, ${d2 === 'rtl' ? '100%' : '0'} 28`}
          fill="none" stroke="var(--belt-stripe)" strokeWidth="3" strokeDasharray="6 4" />
      </svg>

      {/* Belt 2 */}
      <Belt num={2} dir={d2} items={belt.byBelt(2)} selUid={selUid} onSel={onSel} frozen={frozen} slow={slow} e2={e2} />

      {/* S-curve connector 2→3 */}
      <svg width="100%" height="28" style={{ display: 'block' }}>
        <path d={`M ${d2 === 'rtl' ? '0' : '100%'} 0 C ${d2 === 'rtl' ? '15%' : '85%'} 28, ${d3 === 'ltr' ? '15%' : '85%'} 0, ${d3 === 'ltr' ? '0' : '100%'} 28`}
          fill="none" stroke="var(--belt-stripe)" strokeWidth="3" strokeDasharray="6 4" />
      </svg>

      {/* Belt 3 */}
      <Belt num={3} dir={d3} items={belt.byBelt(3)} selUid={selUid} onSel={onSel} frozen={frozen} slow={slow} e2={e2} />

      {/* Worker robots between belts */}
      <WorkerRobots performance={perf} />
    </div>
  );
}
