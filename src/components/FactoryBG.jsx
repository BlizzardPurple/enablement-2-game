/**
 * Decorative factory background — worker robots, gears, pipes.
 * Pure CSS + Kenney sprites.
 */
export default function FactoryBG() {
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {/* Subtle gear patterns */}
      <div style={{
        position: 'absolute', top: 20, left: 20, width: 60, height: 60,
        border: '3px solid var(--text-dim)', borderRadius: '50%', opacity: 0.15,
        animation: 'float 4s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', top: 80, left: 50, width: 40, height: 40,
        border: '2px solid var(--text-dim)', borderRadius: '50%', opacity: 0.1,
        animation: 'float 5s ease-in-out infinite reverse',
      }} />
      <div style={{
        position: 'absolute', bottom: 30, right: 30, width: 50, height: 50,
        border: '3px solid var(--text-dim)', borderRadius: '50%', opacity: 0.12,
        animation: 'float 3.5s ease-in-out infinite',
      }} />

      {/* Worker robots (decorative) */}
      <img
        src="/assets/kenney/robot-pack/Side view/robot_greenDrive1.png"
        alt=""
        style={{ position: 'absolute', bottom: 12, left: 16, width: 36, opacity: 0.2, animation: 'float 3s ease-in-out infinite' }}
      />
      <img
        src="/assets/kenney/robot-pack/Side view/robot_yellowDrive2.png"
        alt=""
        style={{ position: 'absolute', bottom: 12, right: 16, width: 36, opacity: 0.2, animation: 'float 3.5s ease-in-out infinite reverse' }}
      />
      <img
        src="/assets/kenney/robot-pack/Side view/robot_blueBody.png"
        alt=""
        style={{ position: 'absolute', top: 16, right: 100, width: 28, opacity: 0.12, animation: 'float 4s ease-in-out infinite' }}
      />

      {/* Pipe lines */}
      <div style={{
        position: 'absolute', left: 0, top: '30%', width: 8, height: '40%',
        background: 'var(--text-dim)', opacity: 0.08, borderRadius: 4,
      }} />
      <div style={{
        position: 'absolute', right: 0, top: '20%', width: 8, height: '60%',
        background: 'var(--text-dim)', opacity: 0.06, borderRadius: 4,
      }} />
    </div>
  );
}
