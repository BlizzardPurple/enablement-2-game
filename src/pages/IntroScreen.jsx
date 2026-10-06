export default function IntroScreen({ onStart }) {
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem',
      background: 'radial-gradient(ellipse at 50% 30%, rgba(57,196,195,0.08), transparent 60%), var(--bg-dark)',
    }}>
      <img
        src="/assets/kenney/robot-pack/Side view/robot_blueBody.png"
        alt="Bot"
        style={{ width: 96, height: 96, marginBottom: '1.5rem', animation: 'float 2s ease-in-out infinite' }}
      />

      <h1 style={{
        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
        fontWeight: 900,
        lineHeight: 1.1,
        marginBottom: '0.5rem',
      }}>
        <span style={{ color: 'var(--n-turquoise)' }}>Campaign</span>{' '}
        <span style={{ color: 'var(--n-purple)' }}>Chaos</span>
      </h1>

      <p style={{
        color: 'var(--text-muted)',
        fontSize: '1rem',
        maxWidth: 420,
        marginBottom: '2rem',
        lineHeight: 1.6,
      }}>
        Match messy placement labels to the correct database entries before they fall off the conveyor belt.
      </p>

      <button
        onClick={onStart}
        style={{
          padding: '14px 48px',
          fontSize: '1.1rem',
          fontWeight: 700,
          fontFamily: 'var(--font-game)',
          color: '#fff',
          background: 'linear-gradient(135deg, var(--n-turquoise), var(--n-purple))',
          border: 'none',
          borderRadius: 'var(--radius)',
          cursor: 'pointer',
          transition: 'transform 0.15s, box-shadow 0.15s',
          boxShadow: '0 4px 20px rgba(57, 196, 195, 0.3)',
        }}
        onMouseOver={(e) => { e.target.style.transform = 'scale(1.05)'; }}
        onMouseOut={(e) => { e.target.style.transform = 'scale(1)'; }}
      >
        Start Game
      </button>

      <div style={{
        marginTop: '2.5rem',
        display: 'flex',
        gap: '2rem',
        color: 'var(--text-dim)',
        fontSize: '0.75rem',
      }}>
        <span>⌨️ Type to search</span>
        <span>↑↓ Navigate</span>
        <span>↵ Confirm match</span>
      </div>
    </div>
  );
}
