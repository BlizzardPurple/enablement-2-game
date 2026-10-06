const SPRITE_BASE = '/assets/kenney/robot-pack/Side view/robot_red';

export default function RobotBoss({ emotion = 'Body', line = '' }) {
  const sprite = `${SPRITE_BASE}${emotion}.png`;

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-end', gap: 14,
    }}>
      <img
        src={sprite}
        alt="Boss"
        style={{
          width: 80, height: 80, imageRendering: 'auto',
          animation: emotion === 'Damage2' ? 'shake 0.5s ease-in-out infinite' : 'float 2.5s ease-in-out infinite',
        }}
      />
      {line && (
        <div style={{
          background: 'var(--bg-card2)', border: '1px solid var(--border)',
          borderRadius: 12, padding: '10px 16px', fontSize: '0.95rem',
          fontWeight: 600,
          color: 'var(--text)', maxWidth: 280, lineHeight: 1.5,
          boxShadow: 'var(--shadow)', position: 'relative',
          animation: 'popIn 0.3s ease-out',
        }}>
          {line}
          <div style={{
            position: 'absolute', left: -7, bottom: 14,
            width: 0, height: 0,
            borderTop: '6px solid transparent',
            borderBottom: '6px solid transparent',
            borderRight: '7px solid var(--bg-card2)',
          }} />
        </div>
      )}
    </div>
  );
}
