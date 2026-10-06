import { useEffect } from 'react';

export default function E2Screen({ onGo }) {
  useEffect(() => { const t = setTimeout(onGo, 3500); return () => clearTimeout(t); }, [onGo]);

  return (
    <div style={{
      position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', zIndex: 600,
      background: '#000', animation: 'flash 3.5s ease-in-out',
    }}>
      <div style={{
        position: 'absolute', width: '60vw', height: '60vw', borderRadius: '50%',
        background: 'radial-gradient(circle,rgba(57,196,195,0.25),transparent 70%)',
        animation: 'pulse 1.2s ease-in-out infinite',
      }} />
      <div style={{
        fontSize: 'clamp(2rem,5vw,4rem)', fontWeight: 900, letterSpacing: '0.05em',
        background: 'linear-gradient(135deg,var(--n-turquoise),var(--n-purple))',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        zIndex: 1, animation: 'shake 0.5s ease-in-out', textAlign: 'center',
      }}>
        ⚡ ENABLEMENT 2.0<br/>POWERUP
      </div>
      <div style={{ fontSize: '1.1rem', color: 'var(--n-turquoise)', marginTop: '.8rem', fontWeight: 700, zIndex: 1, letterSpacing: '.15em', textTransform: 'uppercase' }}>
        ACTIVATED
      </div>
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute', width: 6, height: 6, borderRadius: '50%',
          background: i % 3 === 0 ? 'var(--n-turquoise)' : i % 3 === 1 ? 'var(--n-purple)' : 'var(--n-orange)',
          left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: 0.7,
          animation: `float ${1.2 + Math.random() * 2}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 1.5}s`,
        }} />
      ))}
    </div>
  );
}
