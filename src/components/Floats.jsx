export default function Floats({ items }) {
  return (
    <div style={{ position: 'fixed', top: '30%', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none', zIndex: 999 }}>
      {items.map(f => (
        <div key={f.id} style={{
          fontSize: '2rem', fontWeight: 900, position: 'absolute',
          color: f.type === 'correct' ? 'var(--ok)' : f.type === 'wrong' || f.type === 'drop' ? 'var(--bad)' : 'var(--n-orange)',
          textShadow: '0 2px 10px rgba(0,0,0,0.5)',
          animation: 'scoreUp 1.2s ease-out forwards',
        }}>{f.value}</div>
      ))}
    </div>
  );
}
