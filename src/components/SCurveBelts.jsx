import Belt from './Belt';
import WorkerRobots from './WorkerRobots';

/**
 * S-shaped belt layout with actual curved connectors.
 * Belt 1: L→R, curves down-right to Belt 2: R→L, curves down-left to Belt 3: L→R
 */
export default function SCurveBelts({ belt, selUid, onSel, frozen, slow, e2, reversed, perf }) {
  const d1 = reversed ? 'rtl' : 'ltr';
  const d2 = reversed ? 'ltr' : 'rtl';
  const d3 = reversed ? 'rtl' : 'ltr';

  return (
    <div style={{ position: 'relative' }}>
      {/* Belt 1 — shifted left */}
      <div style={{ width: '85%', marginLeft: '0%' }}>
        <Belt num={1} dir={d1} items={belt.byBelt(1)} selUid={selUid} onSel={onSel} frozen={frozen} slow={slow} e2={e2} />
      </div>

      {/* S-curve connector 1→2 */}
      <svg width="100%" height="40" viewBox="0 0 1000 40" preserveAspectRatio="none" style={{ display: 'block' }}>
        <path
          d="M 850 0 C 900 0, 980 10, 980 20 C 980 30, 900 40, 850 40"
          fill="none" stroke="var(--belt-stripe)" strokeWidth="4" strokeDasharray="8 5" opacity="0.6"
        />
        {/* Flow arrow */}
        <polygon points="855,36 865,40 855,44" fill="var(--n-turquoise)" opacity="0.4" />
      </svg>

      {/* Belt 2 — shifted right */}
      <div style={{ width: '85%', marginLeft: '15%' }}>
        <Belt num={2} dir={d2} items={belt.byBelt(2)} selUid={selUid} onSel={onSel} frozen={frozen} slow={slow} e2={e2} />
      </div>

      {/* S-curve connector 2→3 */}
      <svg width="100%" height="40" viewBox="0 0 1000 40" preserveAspectRatio="none" style={{ display: 'block' }}>
        <path
          d="M 150 0 C 100 0, 20 10, 20 20 C 20 30, 100 40, 150 40"
          fill="none" stroke="var(--belt-stripe)" strokeWidth="4" strokeDasharray="8 5" opacity="0.6"
        />
        <polygon points="145,36 135,40 145,44" fill="var(--n-turquoise)" opacity="0.4" />
      </svg>

      {/* Belt 3 — shifted left again */}
      <div style={{ width: '85%', marginLeft: '0%' }}>
        <Belt num={3} dir={d3} items={belt.byBelt(3)} selUid={selUid} onSel={onSel} frozen={frozen} slow={slow} e2={e2} />
      </div>

      {/* Worker robots */}
      <WorkerRobots performance={perf} />
    </div>
  );
}
