import { DB_LOOKUP } from '../data/gameData';

export default function Package({ item, direction, isSelected, onClick, e2, frozen, slow }) {
  const duration = e2 ? 3.5 : frozen ? 999 : slow ? 14 : 7;
  const animName = direction === 'ltr' ? 'pkgLTR' : 'pkgRTL';
  const hasPowerup = !!item.powerup;
  const isAnimating = item.status === 'active' || item.status === 'wrong';

  const statusStyles = {
    matched: { background: 'var(--correct)', color: '#fff', transform: 'translateY(-50%) scale(1.2)', opacity: 0, transition: 'all 0.4s' },
    wrong: { background: 'var(--wrong)', color: '#fff', animation: 'shake 0.4s' },
    dropped: { animation: 'explode 0.8s ease-out forwards' },
  };

  const glowColor = hasPowerup ? 'rgba(255,148,8,0.5)' : isSelected ? 'var(--glow)' : 'none';
  const borderCol = hasPowerup
    ? 'var(--n-orange)'
    : isSelected ? 'var(--n-turquoise)' : 'var(--border)';
  const bgCol = isSelected ? 'var(--n-turquoise)' : hasPowerup ? 'var(--bg-card)' : 'var(--bg-card2)';

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
        border: `2px solid ${borderCol}`,
        background: bgCol,
        color: isSelected ? 'var(--n-navy)' : 'var(--text)',
        boxShadow: hasPowerup
          ? `0 0 14px ${glowColor}, 0 0 28px rgba(255,148,8,0.15)`
          : isSelected ? '0 0 18px var(--glow)' : 'var(--shadow)',
        transition: 'border-color 0.15s, background 0.15s, box-shadow 0.3s',
        ...(hasPowerup && item.status === 'active' ? { animation: `${animName} ${duration}s linear forwards, glow 1.5s ease-in-out infinite` } : {}),
        ...(statusStyles[item.status] || {}),
      }}
    >
      {hasPowerup && <span style={{ marginRight: 6 }}>{item.powerup.icon}</span>}
      📦 {item.label}
      {hasPowerup && item.status === 'active' && (
        <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--n-orange)', marginTop: 2, fontWeight: 800 }}>
          ⚡ POWERUP: {item.powerup.name}
        </span>
      )}
      {e2 && item.status === 'active' && (
        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--n-turquoise)', marginTop: 2, fontWeight: 800 }}>
          → {DB_LOOKUP[item.answerId]}
        </span>
      )}
    </div>
  );
}
