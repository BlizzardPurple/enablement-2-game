import { DB_LOOKUP } from '../data/gameData';

/**
 * Package on a belt. Always spawns from the START of the belt direction:
 * - LTR belt: starts at left edge, moves right
 * - RTL belt: starts at right edge, moves left
 * Animation goes from start edge to the opposite end.
 */
export default function Package({ item, direction, isSelected, onClick, e2, frozen, slow }) {
  const duration = e2 ? 3.5 : frozen ? 999 : slow ? 14 : 7;

  // LTR: package starts at left (-200px offscreen left) → exits right (100%+200px)
  // RTL: package starts at right (-200px offscreen right) → exits left (-100%-200px)
  const animName = direction === 'ltr' ? 'pkgLTR' : 'pkgRTL';

  const statusStyles = {
    matched: { background: 'var(--correct)', color: '#fff', transform: 'translateY(-50%) scale(1.2)', opacity: 0, transition: 'all 0.4s' },
    wrong: { background: 'var(--wrong)', color: '#fff', animation: 'shake 0.4s' },
    dropped: { animation: 'explode 0.8s ease-out forwards' },
  };

  const isAnimating = item.status === 'active' || item.status === 'wrong';

  return (
    <div
      onClick={onClick}
      style={{
        position: 'absolute',
        top: '50%',
        left: direction === 'ltr' ? 0 : 'auto',
        right: direction === 'rtl' ? 0 : 'auto',
        transform: 'translateY(-50%)',
        animation: isAnimating ? `${animName} ${duration}s linear forwards` : undefined,
        padding: '10px 18px',
        borderRadius: 10,
        fontSize: '1.1rem',
        fontWeight: 700,
        fontFamily: "'Fira Code', monospace",
        whiteSpace: 'nowrap',
        cursor: item.status === 'active' ? 'pointer' : 'default',
        userSelect: 'none',
        zIndex: 3,
        border: isSelected ? '2px solid var(--n-turquoise)' : '2px solid var(--border)',
        background: isSelected ? 'var(--n-turquoise)' : 'var(--bg-card2)',
        color: isSelected ? 'var(--n-navy)' : 'var(--text)',
        boxShadow: isSelected ? '0 0 18px var(--glow)' : 'var(--shadow)',
        transition: 'border-color 0.15s, background 0.15s',
        ...(statusStyles[item.status] || {}),
      }}
    >
      📦 {item.label}
      {e2 && item.status === 'active' && (
        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--n-turquoise)', marginTop: 2, fontWeight: 800 }}>
          → {DB_LOOKUP[item.answerId]}
        </span>
      )}
    </div>
  );
}
