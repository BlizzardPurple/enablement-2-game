const ROBOTS = [
  { src: 'robot_greenDrive1.png', x: '3%', y: '85%', size: 40, delay: 0 },
  { src: 'robot_greenDrive2.png', x: '12%', y: '88%', size: 36, delay: 0.5 },
  { src: 'robot_yellowDrive1.png', x: '88%', y: '86%', size: 38, delay: 1 },
  { src: 'robot_yellowDrive2.png', x: '95%', y: '82%', size: 34, delay: 1.5 },
  { src: 'robot_blueBody.png', x: '5%', y: '10%', size: 28, delay: 0.3 },
  { src: 'robot_blueDrive1.png', x: '92%', y: '12%', size: 30, delay: 0.8 },
  { src: 'robot_greenBody.png', x: '50%', y: '92%', size: 32, delay: 0.6 },
  { src: 'robot_yellowBody.png', x: '20%', y: '5%', size: 26, delay: 1.2 },
  { src: 'robot_blueJump.png', x: '78%', y: '90%', size: 34, delay: 0.4 },
  { src: 'robot_greenJump.png', x: '35%', y: '8%', size: 24, delay: 0.9 },
  { src: 'robot_yellowJump.png', x: '65%', y: '6%', size: 22, delay: 1.1 },
  { src: 'robot_blueDrive2.png', x: '45%', y: '88%', size: 30, delay: 0.7 },
];

const GEARS = [
  { x: 20, y: 20, size: 70, opacity: 0.06 },
  { x: 85, y: 15, size: 50, opacity: 0.05 },
  { x: 10, y: 60, size: 45, opacity: 0.04 },
  { x: 90, y: 70, size: 60, opacity: 0.05 },
  { x: 50, y: 95, size: 55, opacity: 0.04 },
  { x: 75, y: 50, size: 35, opacity: 0.03 },
];

export default function FactoryBG() {
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {/* Grid pattern */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(var(--border) 1px, transparent 1px),
          linear-gradient(90deg, var(--border) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
        opacity: 0.3,
      }} />

      {/* Gears */}
      {GEARS.map((g, i) => (
        <div key={i} style={{
          position: 'absolute', left: `${g.x}%`, top: `${g.y}%`,
          width: g.size, height: g.size,
          border: '3px solid var(--text-muted)', borderRadius: '50%',
          opacity: g.opacity,
          animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
          animationDelay: `${i * 0.3}s`,
        }} />
      ))}

      {/* Pipes */}
      {[15, 45, 75].map((top, i) => (
        <div key={`pipe-${i}`} style={{
          position: 'absolute', left: i % 2 === 0 ? 0 : 'auto', right: i % 2 === 1 ? 0 : 'auto',
          top: `${top}%`, width: 6, height: '15%',
          background: 'var(--text-dim)', opacity: 0.08, borderRadius: 3,
        }} />
      ))}

      {/* Worker robots */}
      {ROBOTS.map((r, i) => (
        <img
          key={i}
          src={`/assets/kenney/robot-pack/Side view/${r.src}`}
          alt=""
          style={{
            position: 'absolute', left: r.x, top: r.y,
            width: r.size, opacity: 0.15,
            animation: `float ${2.5 + (i % 3)}s ease-in-out infinite`,
            animationDelay: `${r.delay}s`,
            transform: i % 2 === 0 ? 'scaleX(1)' : 'scaleX(-1)',
          }}
        />
      ))}
    </div>
  );
}
