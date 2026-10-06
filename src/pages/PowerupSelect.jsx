export default function PowerupSelect({ options, onSelect }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 500,
      backdropFilter: 'blur(8px)',
    }}>
      <div style={{
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        color: 'var(--n-orange)',
        fontWeight: 700,
        marginBottom: '0.5rem',
      }}>
        ⚡ Powerup Unlocked
      </div>

      <h2 style={{
        fontSize: '2rem',
        fontWeight: 800,
        marginBottom: '2rem',
      }}>
        Choose Your Powerup
      </h2>

      <div style={{ display: 'flex', gap: '1.5rem' }}>
        {options.map(p => (
          <button
            key={p.id}
            onClick={() => onSelect(p)}
            style={{
              width: 220,
              padding: '1.5rem',
              background: 'var(--bg-card)',
              border: '2px solid rgba(255,255,255,0.08)',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              textAlign: 'center',
              color: 'var(--text-primary)',
              transition: 'border-color 0.2s, transform 0.15s, box-shadow 0.2s',
              fontFamily: 'var(--font-game)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = 'var(--n-orange)';
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 0 24px rgba(255, 148, 8, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{p.icon}</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>{p.name}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{p.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
