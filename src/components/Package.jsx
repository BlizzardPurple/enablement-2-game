import { DB_LOOKUP } from '../data/gameData';

export default function Package({ item, dir, isSel, onClick, e2, frozen, slow }) {
  const dur = e2 ? 3 : frozen ? 999 : slow ? 14 : 7;
  const anim = dir === 'ltr' ? 'moveL' : 'moveR';
  const hasPU = !!item.powerup && !e2;
  const alive = item.status === 'active' || item.status === 'wrong';

  const stStyles = {
    matched: { background: 'var(--ok)', color: '#fff', opacity: 0, transform: 'scale(1.3)', transition: 'all 0.4s' },
    wrong: { background: 'var(--bad)', color: '#fff', animation: 'shake 0.4s' },
    dropped: { animation: 'explode 0.8s ease-out forwards' },
  };

  return (
    <div
      onClick={onClick}
      style={{
        position: 'absolute', top: '50%',
        ...(dir === 'ltr' ? { left: -200 } : { right: -200 }),
        transform: 'translateY(-50%)',
        animation: alive ? `${anim} ${dur}s linear forwards` : undefined,
        padding: '8px 16px', borderRadius: 10,
        fontSize: '1.05rem', fontWeight: 700, fontFamily: "'Fira Code',monospace",
        whiteSpace: 'nowrap', cursor: item.status === 'active' ? 'pointer' : 'default',
        userSelect: 'none', zIndex: 4,
        border: `2px solid ${hasPU ? 'var(--n-orange)' : isSel ? 'var(--n-turquoise)' : 'var(--border)'}`,
        background: isSel ? 'var(--n-turquoise)' : hasPU ? 'var(--bg2)' : 'var(--bg3)',
        color: isSel ? 'var(--n-navy)' : 'var(--text)',
        boxShadow: hasPU ? '0 0 14px rgba(255,148,8,0.4)' : isSel ? '0 0 16px var(--glow)' : 'var(--shadow)',
        ...(hasPU && alive ? { animation: `${anim} ${dur}s linear forwards, glow 1.2s ease-in-out infinite` } : {}),
        ...(stStyles[item.status] || {}),
      }}
    >
      {hasPU && <span style={{ marginRight: 6 }}>{item.powerup.icon}</span>}
      📦 {item.label}
      {hasPU && item.status === 'active' && (
        <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--n-orange)', fontWeight: 800, marginTop: 1 }}>⚡ {item.powerup.name}</span>
      )}
      {e2 && item.status === 'active' && (
        <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--n-turquoise)', fontWeight: 800, marginTop: 1 }}>→ {DB_LOOKUP[item.answerId]}</span>
      )}
    </div>
  );
}
