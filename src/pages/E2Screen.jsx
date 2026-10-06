import { useEffect } from 'react';

export default function E2Screen({ onGo }) {
  useEffect(() => { const t = setTimeout(onGo, 1500); return () => clearTimeout(t); }, [onGo]);

  return (
    <div style={{
      position: 'fixed', inset: 0, display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 600,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
      animation: 'flash 1.5s ease-in-out',
    }}>
      <div style={{
        textAlign: 'center', animation: 'pop 0.4s ease-out',
      }}>
        <div style={{
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 900,
          background: 'linear-gradient(135deg, var(--n-turquoise), var(--n-purple))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>
          ⚡ ENABLEMENT 2.0
        </div>
        <div style={{ fontSize: '.9rem', color: 'var(--n-turquoise)', marginTop: '.4rem', fontWeight: 600, letterSpacing: '.1em', opacity: 0.8 }}>
          AI ASSIST ACTIVATED
        </div>
      </div>
    </div>
  );
}
