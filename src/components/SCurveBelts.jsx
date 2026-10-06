import Belt from './Belt';
import WorkerRobots from './WorkerRobots';

/**
 * One continuous S-shaped conveyor belt.
 * The belt surface is one solid piece with curved U-turn corners.
 * Packages ride on the 3 straight sections.
 */

const BELT_H = 76;      // belt height (matches Belt component)
const CORNER_R = 50;     // corner radius
const INSET = '12%';     // how much shorter the straight sections are (creates space for corners)

export default function SCurveBelts({ belt, selUid, onSel, frozen, slow, e2, reversed, perf }) {
  const d1 = reversed ? 'rtl' : 'ltr';
  const d2 = reversed ? 'ltr' : 'rtl';
  const d3 = reversed ? 'rtl' : 'ltr';

  const beltColor = 'var(--belt-bg)';
  const stripeColor = 'var(--belt-stripe)';
  const beltSpeed = frozen ? '999s' : slow ? '4s' : e2 ? '1.2s' : '2s';

  return (
    <div style={{ position: 'relative' }}>

      {/* ── TOP STRAIGHT SECTION (Belt 1, L→R) ── */}
      <div style={{ width: `calc(100% - ${INSET})`, marginLeft: 0 }}>
        <Belt num={1} dir={d1} items={belt.byBelt(1)} selUid={selUid} onSel={onSel} frozen={frozen} slow={slow} e2={e2} />
      </div>

      {/* ── RIGHT U-TURN (connects Belt 1 end → Belt 2 start) ── */}
      <div style={{
        position: 'relative',
        width: BELT_H * 2 + 4,
        height: CORNER_R * 2,
        marginLeft: `calc(100% - ${INSET} - ${BELT_H + 2}px)`,
        marginTop: -2,
        marginBottom: -2,
      }}>
        {/* Outer arc */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0,
          width: BELT_H * 2 + 4,
          height: CORNER_R * 2,
          borderRight: `${BELT_H}px solid ${beltColor}`,
          borderRadius: `0 ${CORNER_R + BELT_H}px ${CORNER_R + BELT_H}px 0`,
          borderTop: 'none', borderBottom: 'none', borderLeft: 'none',
          boxSizing: 'border-box',
        }} />
        {/* Stripe overlay on corner */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0,
          width: BELT_H * 2 + 4,
          height: CORNER_R * 2,
          borderRight: `3px solid ${stripeColor}`,
          borderRadius: `0 ${CORNER_R + BELT_H}px ${CORNER_R + BELT_H}px 0`,
          borderTop: 'none', borderBottom: 'none', borderLeft: 'none',
          boxSizing: 'border-box',
          opacity: 0.5,
        }} />
      </div>

      {/* ── MIDDLE STRAIGHT SECTION (Belt 2, R→L) ── */}
      <div style={{ width: `calc(100% - ${INSET})`, marginLeft: INSET }}>
        <Belt num={2} dir={d2} items={belt.byBelt(2)} selUid={selUid} onSel={onSel} frozen={frozen} slow={slow} e2={e2} />
      </div>

      {/* ── LEFT U-TURN (connects Belt 2 end → Belt 3 start) ── */}
      <div style={{
        position: 'relative',
        width: BELT_H * 2 + 4,
        height: CORNER_R * 2,
        marginLeft: `calc(${INSET} - ${BELT_H + 2}px)`,
        marginTop: -2,
        marginBottom: -2,
      }}>
        <div style={{
          position: 'absolute',
          top: 0, right: 0,
          width: BELT_H * 2 + 4,
          height: CORNER_R * 2,
          borderLeft: `${BELT_H}px solid ${beltColor}`,
          borderRadius: `${CORNER_R + BELT_H}px 0 0 ${CORNER_R + BELT_H}px`,
          borderTop: 'none', borderBottom: 'none', borderRight: 'none',
          boxSizing: 'border-box',
        }} />
        <div style={{
          position: 'absolute',
          top: 0, right: 0,
          width: BELT_H * 2 + 4,
          height: CORNER_R * 2,
          borderLeft: `3px solid ${stripeColor}`,
          borderRadius: `${CORNER_R + BELT_H}px 0 0 ${CORNER_R + BELT_H}px`,
          borderTop: 'none', borderBottom: 'none', borderRight: 'none',
          boxSizing: 'border-box',
          opacity: 0.5,
        }} />
      </div>

      {/* ── BOTTOM STRAIGHT SECTION (Belt 3, L→R) ── */}
      <div style={{ width: `calc(100% - ${INSET})`, marginLeft: 0 }}>
        <Belt num={3} dir={d3} items={belt.byBelt(3)} selUid={selUid} onSel={onSel} frozen={frozen} slow={slow} e2={e2} />
      </div>

      {/* Worker robots positioned between sections */}
      <WorkerRobots performance={perf} />
    </div>
  );
}
