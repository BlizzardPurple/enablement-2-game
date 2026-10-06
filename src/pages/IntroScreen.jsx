export default function IntroScreen({ onStart, theme }) {
  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem',
      background: 'radial-gradient(ellipse at 50% 30%,var(--glow),transparent 60%),var(--bg)',
    }}>
      <div style={{ position: 'absolute', top: 16, right: 16 }}>
        <button onClick={theme.toggle} style={{
          width: 36, height: 36, borderRadius: '50%', border: '1px solid var(--border)',
          background: 'var(--bg2)', cursor: 'pointer', fontSize: '1.1rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{theme.dark ? '☀️' : '🌙'}</button>
      </div>
      <img src="/assets/kenney/robot-pack/Side view/robot_redBody.png" alt=""
        style={{ width: 96, height: 96, imageRendering: 'auto', animation: 'float 2s ease-in-out infinite', marginBottom: '1.5rem' }} />
      <h1 style={{ fontSize: 'clamp(2.5rem,6vw,4rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '.4rem' }}>
        <span style={{ color: 'var(--n-turquoise)' }}>Campaign</span>{' '}
        <span style={{ color: 'var(--n-purple)' }}>Chaos</span>
      </h1>
      <p style={{ color: 'var(--text2)', fontSize: '1.1rem', maxWidth: 440, marginBottom: '2rem', lineHeight: 1.6 }}>
        Match messy placement labels to database entries before packages fall off the belt.
      </p>
      <button onClick={onStart} style={{
        padding: '16px 56px', fontSize: '1.2rem', fontWeight: 800,
        color: '#fff', background: 'linear-gradient(135deg,var(--n-turquoise),var(--n-purple))',
        border: 'none', borderRadius: 12, cursor: 'pointer',
        boxShadow: '0 4px 24px var(--glow)',
      }}
        onMouseOver={e => e.target.style.transform = 'scale(1.06)'}
        onMouseOut={e => e.target.style.transform = 'scale(1)'}
      >Start Game</button>
      <div style={{ marginTop: '2rem', display: 'flex', gap: '1.5rem', color: 'var(--text3)', fontSize: '.8rem' }}>
        <span>⌨️ Type to search</span><span>↑↓ Navigate</span><span>↵ Confirm</span>
      </div>
    </div>
  );
}
