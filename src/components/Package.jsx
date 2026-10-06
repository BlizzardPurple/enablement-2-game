import { DB_LOOKUP } from '../data/gameData';

export default function Package({ item, direction, isSelected, onClick, e2, frozen, slow }) {
  const base = e2 ? 3 : frozen ? 999 : slow ? 12 : 6;
  const anim = direction === 'ltr' ? 'slideL' : 'slideR';

  const statusStyles = {
    matched: { background: 'var(--correct)', color: '#fff', transform: 'scale(1.15)', opacity: 0, transition: 'all 0.4s' },
    wrong: { background: 'var(--wrong)', color: '#fff', animation: 'shake 0.4s' },
    dropped: { animation: 'explode 0.8s ease-out forwards' },
  };

  return (
    <div
      onClick={onClick}
      style={{
        position: 'absolute',
        top: '50%',
        [direction === 'ltr' ? 'left' : 'right']: 0,
        transform: 'translateY(-50%)',
        animation: item.status === 'active' || item.status === 'wrong'
          ? `${anim} ${base}s linear`
          : undefined,
        padding: '8px 14px',
        borderRadius: 8,
        fontSize: '0.95rem',
        fontWeight: 700,
        fontFamily: "'Fira Code', monospace",
        whiteSpace: 'nowrap',
        cursor: item.status === 'active' ? 'pointer' : 'default',
        userSelect: 'none',
        zIndex: 3,
        border: isSelected ? '2px solid var(--n-turquoise)' : '2px solid var(--border)',
        background: isSelected ? 'var(--n-turquoise)' : 'var(--bg-card2)',
        color: isSelected ? 'var(--n-navy)' : 'var(--text)',
        boxShadow: isSelected ? '0 0 16px var(--glow)' : 'var(--shadow)',
        transition: 'border-color 0.15s, background 0.15s',
        ...(statusStyles[item.status] || {}),
      }}
    >
      📦 {item.label}
      {e2 && item.status === 'active' && (
        <span style={{ display: 'block', fontSize: '0.6rem', color: 'var(--n-turquoise)', marginTop: 1, opacity: 0.85 }}>
          → {DB_LOOKUP[item.answerId]}
        </span>
      )}
    </div>
  );
}
