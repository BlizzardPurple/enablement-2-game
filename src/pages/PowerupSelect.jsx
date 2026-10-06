export default function PowerupSelect({ options, onSelect }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      zIndex: 500, backdropFilter: 'blur(8px)',
    }}>
      <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--n-orange)', fontWeight: 700 }}>
        ⚡ Powerup Unlocked
      </div>
      <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '2rem', marginTop: '0.5rem', color: '#fff' }}>
        Choose Your Powerup
      </h2>
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        {options.map(p => (
          <button
            key={p.id}
            onClick={() => onSelect(p)}
            style={{
              width: 220, padding: '1.5rem', background: 'var(--bg-card)',
              border: '2px solid var(--border)', borderRadius: 14,
              cursor: 'pointer', textAlign: 'center', color: 'var(--text)',
              fontFamily: 'inherit', transition: 'all 0.2s',
            }}
            onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--n-orange)'; e.currentTarget.style.transform = 'scale(1.06)'; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{p.icon}</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800 }}>{p.name}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>{p.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
