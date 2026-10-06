import { useRef, useState, useEffect } from 'react';
import { DB_LOOKUP } from '../data/gameData';
import WorkerRobots from './WorkerRobots';

/**
 * One continuous S-shaped belt. Packages follow the actual SVG path
 * using CSS offset-path. Everything is in a fixed 1000x440 coordinate
 * space, scaled to fit the container.
 */

// The S-curve path (in 1000x440 space)
const S_PATH = 'M 30,55 L 880,55 C 960,55 960,195 880,195 L 120,195 C 40,195 40,335 120,335 L 970,335';
const VB_W = 1000;
const VB_H = 400;
const BELT_STROKE = 68;

export default function SCurveBelts({ belt, selUid, onSel, e2, frozen, slow, perf }) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  // Measure container and compute scale
  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      setScale(w / VB_W);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const beltSpeed = frozen ? 999 : slow ? 0.5 : e2 ? 2 : 1;

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', aspectRatio: `${VB_W}/${VB_H}` }}>

      {/* Scaled inner container — everything in 1000x440 coordinate space */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: VB_W, height: VB_H,
        transformOrigin: 'top left',
        transform: `scale(${scale})`,
      }}>

        {/* SVG belt surface */}
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} style={{ position: 'absolute', inset: 0, width: VB_W, height: VB_H }}>
          <defs>
            <pattern id="bp" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="var(--belt-bg)" />
              <line x1="10" y1="0" x2="10" y2="20" stroke="var(--belt-stripe)" strokeWidth="2" opacity="0.35" />
              <animateTransform attributeName="patternTransform" type="translate" from="0 0" to="20 0" dur={`${2 / beltSpeed}s`} repeatCount="indefinite" />
            </pattern>
          </defs>
          {/* Edge */}
          <path d={S_PATH} fill="none" stroke="var(--belt-stripe)" strokeWidth={BELT_STROKE + 6} strokeLinecap="round" strokeLinejoin="round" />
          {/* Surface */}
          <path d={S_PATH} fill="none" stroke="url(#bp)" strokeWidth={BELT_STROKE} strokeLinecap="round" strokeLinejoin="round" />
          {/* Drop zone pulse */}
          <circle cx="970" cy="335" r="5" fill="var(--n-pink)">
            <animate attributeName="r" values="4;9;4" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite" />
          </circle>
        </svg>

        {/* Packages — each follows the S-path via offset-path */}
        {belt.items.map(item => (
          <PathPackage
            key={item.uid}
            item={item}
            isSel={item.uid === selUid}
            onSel={() => item.status === 'active' && onSel(item.uid)}
            e2={e2}
          />
        ))}

        {/* Worker robots */}
        <WorkerRobots performance={perf} />
      </div>
    </div>
  );
}

function PathPackage({ item, isSel, onSel, e2 }) {
  const hasPU = !!item.powerup && !e2;
  const travelSec = (item.travelTime || 18000) / 1000;

  const stStyles = {
    matched: { opacity: 0, transform: 'scale(1.4)', transition: 'all 0.4s', background: 'var(--ok)' },
    dropped: { animation: 'explode 0.8s ease-out forwards' },
    wrong: { animation: 'shake 0.4s', background: 'var(--bad)', color: '#fff' },
  };

  const isAlive = item.status === 'active' || item.status === 'wrong';

  return (
    <div
      onClick={onSel}
      style={{
        position: 'absolute',
        // This is the magic — follow the SVG path
        offsetPath: `path('${S_PATH}')`,
        offsetRotate: '0deg',
        offsetAnchor: '50% 50%',
        offsetDistance: '0%',
        // Animate from 0% to 100% along the path
        animation: isAlive ? `followPath ${travelSec}s linear forwards` : undefined,
        // Package styling
        padding: '6px 12px',
        borderRadius: 8,
        fontSize: '13px',
        fontWeight: 700,
        fontFamily: "'Fira Code', monospace",
        whiteSpace: 'nowrap',
        cursor: item.status === 'active' ? 'pointer' : 'default',
        userSelect: 'none',
        zIndex: 5,
        border: `2px solid ${hasPU ? 'var(--n-orange)' : isSel ? 'var(--n-turquoise)' : 'var(--border)'}`,
        background: isSel ? 'var(--n-turquoise)' : hasPU ? 'var(--bg2)' : 'var(--bg3)',
        color: isSel ? '#002' : 'var(--text)',
        boxShadow: hasPU ? '0 0 12px rgba(255,148,8,0.4)' : isSel ? '0 0 14px var(--glow)' : 'var(--shadow)',
        ...(stStyles[item.status] || {}),
      }}
    >
      {hasPU && <span style={{ marginRight: 4 }}>{item.powerup.icon}</span>}
      📦 {item.label}
      {hasPU && item.status === 'active' && (
        <span style={{ display: 'block', fontSize: '10px', color: 'var(--n-orange)', fontWeight: 800, marginTop: 1 }}>⚡ {item.powerup.name}</span>
      )}
      {e2 && item.status === 'active' && (
        <span style={{ display: 'block', fontSize: '10px', color: 'var(--n-turquoise)', fontWeight: 800, marginTop: 1 }}>→ {DB_LOOKUP[item.answerId]}</span>
      )}
    </div>
  );
}
