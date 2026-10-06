export default function FloatingScores({ floats }) {
  return (
    <div style={{ position: 'fixed', top: '35%', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none', zIndex: 999 }}>
      {floats.map(f => (
        <div key={f.id} style={{
          fontSize: '1.8rem', fontWeight: 900,
          color: f.type === 'correct' ? 'var(--correct)' : f.type === 'wrong' ? 'var(--wrong)' : 'var(--n-pink)',
          textShadow: '0 2px 10px rgba(0,0,0,0.5)',
          animation: 'scoreFloat 1.2s ease-out forwards',
          position: 'absolute',
        }}>
          {f.value}
        </div>
      ))}
    </div>
  );
}
