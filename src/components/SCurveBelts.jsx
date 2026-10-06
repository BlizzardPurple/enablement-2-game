import Belt from './Belt';
import WorkerRobots from './WorkerRobots';

/**
 * One continuous S-shaped conveyor belt drawn as a single SVG path.
 * Package interaction areas are transparent overlays on the straight sections.
 *
 * Layout (viewBox 0 0 1000 440):
 *   Belt 1: y=50,  from x=40 to x=880  (L→R)
 *   Corner: curves right from (880,50) down to (880,190)
 *   Belt 2: y=190, from x=880 to x=120  (R→L)
 *   Corner: curves left from (120,190) down to (120,330)
 *   Belt 3: y=330, from x=120 to x=960  (L→R)
 */

const VB_W = 1000;
const VB_H = 440;
const BELT_STROKE = 72;  // visual belt thickness
const BELT_Y1 = 50;
const BELT_Y2 = 190;
const BELT_Y3 = 330;
const CORNER_R = 70;     // radius of U-turns

// The single S-curve path
const S_PATH = `
  M 40,${BELT_Y1}
  L 880,${BELT_Y1}
  C ${880 + CORNER_R},${BELT_Y1} ${880 + CORNER_R},${BELT_Y2} 880,${BELT_Y2}
  L 120,${BELT_Y2}
  C ${120 - CORNER_R},${BELT_Y2} ${120 - CORNER_R},${BELT_Y3} 120,${BELT_Y3}
  L 960,${BELT_Y3}
`;

export default function SCurveBelts({ belt, selUid, onSel, frozen, slow, e2, reversed, perf }) {
  const d1 = reversed ? 'rtl' : 'ltr';
  const d2 = reversed ? 'ltr' : 'rtl';
  const d3 = reversed ? 'rtl' : 'ltr';
  const beltSpeed = frozen ? 999 : slow ? 0.5 : e2 ? 2 : 1;

  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: `${VB_W}/${VB_H}` }}>

      {/* ── SVG: the belt surface ── */}
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Belt stripe pattern */}
          <pattern id="beltStripes" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect width="20" height="20" fill="var(--belt-bg)" />
            <line x1="10" y1="0" x2="10" y2="20" stroke="var(--belt-stripe)" strokeWidth="2" opacity="0.4" />
          </pattern>
          <pattern id="beltStripesAnim" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect width="20" height="20" fill="var(--belt-bg)" />
            <line x1="10" y1="0" x2="10" y2="20" stroke="var(--belt-stripe)" strokeWidth="2" opacity="0.4" />
            <animateTransform attributeName="patternTransform" type="translate" from="0 0" to="20 0" dur={`${2 / beltSpeed}s`} repeatCount="indefinite" />
          </pattern>
        </defs>

        {/* Belt outer edge (slightly wider, darker) */}
        <path d={S_PATH} fill="none" stroke="var(--belt-stripe)" strokeWidth={BELT_STROKE + 4}
          strokeLinecap="round" strokeLinejoin="round" />

        {/* Belt main surface */}
        <path d={S_PATH} fill="none" stroke="url(#beltStripesAnim)" strokeWidth={BELT_STROKE}
          strokeLinecap="round" strokeLinejoin="round" />

        {/* Drop zone indicator at end of belt 3 */}
        <circle cx="960" cy={BELT_Y3} r="6" fill="var(--n-pink)">
          <animate attributeName="r" values="4;8;4" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite" />
        </circle>
      </svg>

      {/* ── Package overlay areas (transparent, positioned over straight sections) ── */}

      {/* Belt 1: top straight section */}
      <div style={{
        position: 'absolute',
        left: '4%', top: `${((BELT_Y1 - BELT_STROKE / 2) / VB_H) * 100}%`,
        width: '84%', height: `${(BELT_STROKE / VB_H) * 100}%`,
        overflow: 'visible',
      }}>
        {belt.byBelt(1).map(item => (
          <PackageOnBelt key={item.uid} item={item} dir={d1} selUid={selUid} onSel={onSel} e2={e2} frozen={frozen} slow={slow} />
        ))}
      </div>

      {/* Belt 2: middle straight section */}
      <div style={{
        position: 'absolute',
        left: '12%', top: `${((BELT_Y2 - BELT_STROKE / 2) / VB_H) * 100}%`,
        width: '76%', height: `${(BELT_STROKE / VB_H) * 100}%`,
        overflow: 'visible',
      }}>
        {belt.byBelt(2).map(item => (
          <PackageOnBelt key={item.uid} item={item} dir={d2} selUid={selUid} onSel={onSel} e2={e2} frozen={frozen} slow={slow} />
        ))}
      </div>

      {/* Belt 3: bottom straight section */}
      <div style={{
        position: 'absolute',
        left: '12%', top: `${((BELT_Y3 - BELT_STROKE / 2) / VB_H) * 100}%`,
        width: '84%', height: `${(BELT_STROKE / VB_H) * 100}%`,
        overflow: 'visible',
      }}>
        {belt.byBelt(3).map(item => (
          <PackageOnBelt key={item.uid} item={item} dir={d3} selUid={selUid} onSel={onSel} e2={e2} frozen={frozen} slow={slow} />
        ))}
      </div>

      {/* Worker robots */}
      <WorkerRobots performance={perf} />
    </div>
  );
}

/** Package positioned on a belt overlay - uses CSS animation to move across */
import { DB_LOOKUP } from '../data/gameData';

function PackageOnBelt({ item, dir, selUid, onSel, e2, frozen, slow }) {
  const isSel = item.uid === selUid;
  const dur = e2 ? 3.5 : frozen ? 999 : slow ? 14 : 7;
  const anim = dir === 'ltr' ? 'moveL' : 'moveR';
  const alive = item.status === 'active' || item.status === 'wrong';
  const hasPU = !!item.powerup && !e2;

  const stStyles = {
    matched: { background: 'var(--ok)', color: '#fff', opacity: 0, transform: 'translateY(-50%) scale(1.3)', transition: 'all 0.4s' },
    wrong: { background: 'var(--bad)', color: '#fff', animation: 'shake 0.4s' },
    dropped: { animation: 'explode 0.8s ease-out forwards' },
  };

  return (
    <div
      onClick={() => item.status === 'active' && onSel(item.uid)}
      style={{
        position: 'absolute', top: '50%',
        ...(dir === 'ltr' ? { left: -200 } : { right: -200 }),
        transform: 'translateY(-50%)',
        animation: alive ? `${anim} ${dur}s linear forwards` : undefined,
        padding: '6px 14px', borderRadius: 8,
        fontSize: 'clamp(0.7rem, 1.2vw, 1rem)', fontWeight: 700, fontFamily: "'Fira Code',monospace",
        whiteSpace: 'nowrap', cursor: item.status === 'active' ? 'pointer' : 'default',
        userSelect: 'none', zIndex: 4,
        border: `2px solid ${hasPU ? 'var(--n-orange)' : isSel ? 'var(--n-turquoise)' : 'var(--border)'}`,
        background: isSel ? 'var(--n-turquoise)' : hasPU ? 'var(--bg2)' : 'var(--bg3)',
        color: isSel ? 'var(--n-navy)' : 'var(--text)',
        boxShadow: hasPU ? '0 0 12px rgba(255,148,8,0.4)' : isSel ? '0 0 14px var(--glow)' : 'var(--shadow)',
        ...(hasPU && alive ? { animation: `${anim} ${dur}s linear forwards, glow 1.2s ease-in-out infinite` } : {}),
        ...(stStyles[item.status] || {}),
      }}
    >
      {hasPU && <span style={{ marginRight: 4 }}>{item.powerup.icon}</span>}
      📦 {item.label}
      {hasPU && item.status === 'active' && (
        <span style={{ display: 'block', fontSize: '0.6rem', color: 'var(--n-orange)', fontWeight: 800, marginTop: 1 }}>⚡ {item.powerup.name}</span>
      )}
      {e2 && item.status === 'active' && (
        <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--n-turquoise)', fontWeight: 800, marginTop: 1 }}>→ {DB_LOOKUP[item.answerId]}</span>
      )}
    </div>
  );
}
