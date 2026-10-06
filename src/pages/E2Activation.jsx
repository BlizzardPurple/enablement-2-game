import { useEffect } from 'react';

export default function E2Activation({ onActivate }) {
  useEffect(() => {
    const timer = setTimeout(onActivate, 3000);
    return () => clearTimeout(timer);
  }, [onActivate]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 600,
      background: 'var(--bg-dark)',
      animation: 'enablementFlash 3s ease-in-out',
    }}>
      {/* Radial glow */}
      <div style={{
        position: 'absolute',
        width: '60vw',
        height: '60vw',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(57,196,195,0.2), transparent 70%)',
        animation: 'pulse 1.5s ease-in-out infinite',
      }} />

      <div style={{
        fontSize: 'clamp(2.5rem, 6vw, 5rem)',
        fontWeight: 900,
        background: 'linear-gradient(135deg, var(--n-turquoise), var(--n-purple))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        zIndex: 1,
        textAlign: 'center',
        lineHeight: 1.1,
      }}>
        ENABLEMENT 2.0
      </div>

      <div style={{
        fontSize: '1.1rem',
        color: 'var(--n-turquoise)',
        marginTop: '1rem',
        fontWeight: 600,
        zIndex: 1,
        opacity: 0.8,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      }}>
        Activated
      </div>

      {/* Particle dots */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: i % 2 === 0 ? 'var(--n-turquoise)' : 'var(--n-purple)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.6,
              animation: `float ${1.5 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
