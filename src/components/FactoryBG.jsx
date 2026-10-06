const GEARS = [
  { x: 5, y: 8, s: 60 }, { x: 88, y: 5, s: 45 }, { x: 3, y: 85, s: 50 },
  { x: 92, y: 80, s: 55 }, { x: 50, y: 3, s: 35 }, { x: 48, y: 92, s: 40 },
];

export default function FactoryBG() {
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {/* Grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px)',
        backgroundSize: '60px 60px', opacity: 0.25,
      }} />
      {/* Gears */}
      {GEARS.map((g, i) => (
        <div key={i} style={{
          position: 'absolute', left: `${g.x}%`, top: `${g.y}%`,
          width: g.s, height: g.s, border: '3px solid var(--text3)', borderRadius: '50%',
          opacity: 0.08, animation: `float ${3 + i * 0.4}s ease-in-out infinite`, animationDelay: `${i * 0.3}s`,
        }} />
      ))}
      {/* Pipes */}
      {[0, 1, 2].map(i => (
        <div key={`p${i}`} style={{
          position: 'absolute', [i % 2 === 0 ? 'left' : 'right']: 0,
          top: `${20 + i * 25}%`, width: 5, height: '12%',
          background: 'var(--text3)', opacity: 0.06, borderRadius: 3,
        }} />
      ))}
    </div>
  );
}
