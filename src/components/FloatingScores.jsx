export default function FloatingScores({ scores }) {
  return (
    <div style={{
      position: 'fixed',
      top: '40%',
      left: '50%',
      transform: 'translateX(-50%)',
      pointerEvents: 'none',
      zIndex: 999,
    }}>
      {scores.map(s => (
        <div
          key={s.id}
          style={{
            position: 'absolute',
            fontSize: '1.5rem',
            fontWeight: 800,
            color: s.type === 'correct' ? 'var(--correct)'
                 : s.type === 'wrong' ? 'var(--wrong)'
                 : 'var(--n-pink)',
            textShadow: '0 2px 8px rgba(0,0,0,0.5)',
            animation: 'scoreFloat 1s ease-out forwards',
            whiteSpace: 'nowrap',
          }}
        >
          {s.value}
        </div>
      ))}
    </div>
  );
}
