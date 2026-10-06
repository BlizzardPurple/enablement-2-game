/**
 * Tutorial robot using Kenney's blue robot sprite.
 * Shows speech bubbles with instructions.
 */
export default function RobotBot({ message, visible = true }) {
  if (!visible) return null;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-end',
      gap: 12,
      animation: 'float 2s ease-in-out infinite',
    }}>
      <img
        src="/assets/kenney/robot-pack/Side view/robot_blueBody.png"
        alt="Bot"
        style={{ width: 64, height: 64, imageRendering: 'auto' }}
      />
      {message && (
        <div style={{
          background: 'var(--bg-card-light)',
          border: '1px solid var(--border-glow)',
          borderRadius: 'var(--radius)',
          padding: '10px 16px',
          fontSize: '0.85rem',
          color: 'var(--text-primary)',
          maxWidth: 320,
          position: 'relative',
          boxShadow: 'var(--shadow-card)',
        }}>
          {message}
          {/* Speech bubble arrow */}
          <div style={{
            position: 'absolute',
            left: -8,
            bottom: 12,
            width: 0,
            height: 0,
            borderTop: '6px solid transparent',
            borderBottom: '6px solid transparent',
            borderRight: '8px solid var(--bg-card-light)',
          }} />
        </div>
      )}
    </div>
  );
}
